import express from 'express';
const {Router} = express;
const router = Router();

// Import Controller
import postController from './controllers/postController.mjs';
import categoryController from './controllers/categoryController.mjs'

// Import validation input
import clean from './MW/sanitizer.mjs';
import postSchema from './schemas/postSchema.mjs';
import validateBody from'./services/validator.mjs';

// config du cache REDIS: invalidation du cache temporel et a chaque insertion de donnée, pour s'assurer d'une donnée fraîche
import cacheGenerator from './MW/cache.mjs';
const {
    cache,
    flush
  } = cacheGenerator({
    ttl: 1296000, // 3600 *24 *15 => 15 jours
    prefix: "blog", 
    //! si cette valeur change, faut mettre a jour le fichier nodemon.json 
    //!et les scripts dans package.json !
  });

/**
 * Un post
 * @typedef {post} post
 * @property {string} slug - Lien de navigation visible das la barre d'url
 * @property {string} title - Le titre d'un post
 * @property {string} excerpt - Le résumé d'un post
 * @property {string} content - Le contenu d'un post
 * @property {string} category - La catégorie d'un post
 */
/**
 * Renvoie tous les posts présent en base de donnée
 * @route GET /v1/posts
 * @group post - Pour récupérer tous les articles de l'API
 * @summary Renvoie toutes les données sur les posts présent en BDD
 * @returns {JSON} 200 - {id, slug, title, excerpt, content, category, categoryId}
 */
router.get('/posts', cache, postController.allPosts);

/**
 * Renvoie le post correspondant a l'id passé en paramétre
 * @route GET /v1/posts/:id
 * @group post - Pour récupérer l'article avec l'identifiant en paramétre
 * @summary Renvoie toutes les données d'un post
 * @param {number} id.path.required - l'id d'un post à fournir
 * @returns {JSON} 200 - {id, slug, title, excerpt, content, category, categoryId}
 */
router.get('/posts/:id(\\d+)', cache, postController.onePost);

/**
 * Renvoie les post correspondant a la catégorie passé en paramétre
 * @route GET /posts/category/:id
 * @group post - Pour récupérer les posts ayant l'identifiant de la catégorie en paramétre
 * @summary Renvoie toutes les données sur les posts présent dans la catégorie
 * @param {number} id.path.required - l'id d'un post à fournir
 * @returns {JSON} 200 - {id, slug, title, excerpt, content, category, categoryId}
 */
router.get('/posts/category/:id(\\d+)', cache, postController.postsByCategory);

/**
 * Une catégorie
 * @typedef {post} post
 * @property {string} route - La route a contacté pour avoir les articles de cette catégorie
 * @property {string} label - Le nom d'une catégorie
 */
/**
 * Renvoie toutes les catégories 
 * @route GET /category
 * @group category - Pour récupérer les posts ayant l'identifiant de la catégorie en paramétre
 * @summary Renvoie toutes les données sur les posts présent dans la catégorie
 * @param {number} id.path.required - l'id d'un post à fournir
 * @returns {JSON} 200 - {id, slug, title, excerpt, content, category, categoryId}
 */
router.get('/category', cache, categoryController.allCategories);

/**
 * Une route pour insérer un nouveau post. 
 * Pour relier le post a une catégorie, soit l'id de la catégorie (number) ou son label (string) son requis.
 * On utilise la distance de Levenstein pour déterminer si une category éxistante très similaire existe déja. 
 * Si oui, on la remplace par celle éxistante. 
 * on permet également d'insérer une nouvelle catégorie, en amont d'un nouvel articles, si elle n'est pas déja présente dans la BDD.
 * @route POST /posts
 * @group post
 * @summary  
 * @param {string} title.body.required
 * @param {string} slug.body.required
 * @param {number} content.body.required
 * @param {string} excerpt.query.required
 * @param {string} category.query
 * @param {string} categoryId.query
 * @returns {JSON} 200 - {id, slug, title, excerpt, content, categoryId}
 */
router.post('/posts', clean, validateBody(postSchema), flush, postController.newPost);
//! la position du flush entraine une invalidation du cache même si une érreur apparait (slug identique)
//! et qu'auncune donnée n'est enregistré.

export default router;