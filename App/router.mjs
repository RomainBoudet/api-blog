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

  // NOTE
  // ressource : 
  // https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html
  // https://swagger.io/specification/
  // exemple : https://github.com/satansdeer/swagger-api-library/blob/master/routes/books.js 

/**
 * @swagger
 * components:
 *   schemas:
 *     article:
 *       type: object
 *       required:
 *         - category
 *         - slug
 *         - title
 *         - excerpt
 *         - content 
 *       properties:
 *         id:
 *           type: integer
 *           description: L'id de l'article
 *           example: 1
 *         title:
 *           type: string
 *           description: Le titre de l'article
 *           example: Angular, une fausse bonne idée ? 
 *         slug:
 *           type: string
 *           description: Le slug de l'article
 *           example: angular-une-fausse-bonne-idee
 *         excerpt:
 *           type: string
 *           description: Le résumé de l'article
 *           example: Laboris nisi ut aliquip ex ea
 *         content: 
 *           type: string
 *           description: Le contenu de l'article
 *           example: Voluptate velit esse cillum dolore eu.   
 *         category:
 *           type: string
 *           description: Le nom de la categorie
 *           example: Angular
 *         categoryId: 
 *           type: integer
 *           description: L'identifiant de la categorie de l'article
 *           example: 2
 */

 /**
  * @swagger
  * tags:
  *   name: Article
  *   description: La gestion de mes artcles
  */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Renvoie tous les articles
 *     tags: [Article]
 *     responses:
 *       200:
 *         description: La liste de tous les articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/article'
 *       404:
 *         description: Il n'existe pas d'articles en BDD
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: L'érreur à l'origine de la 404
 *                   example: Il n'éxiste pas d'article en BDD !
 */
router.get('/posts', cache, postController.allPosts);

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Renvoie un article selon son identifiant
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description:  L'identifiant de l'article
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: L'article selon son identifiant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/article'
 * 
 *       404:
 *         description: Il n'existe pas d'article avec l'id {id}
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: L'érreur à l'origine de la 404
 *                   example: Il n'existe pas d'article avec l'id 400
 */
router.get('/post/:id(\\d+)',cache, postController.onePost);

/**
 * @swagger
 * /posts/category/{id}:
 *   get:
 *     summary: Renvoie une liste d'articles selon l'identifiant d'une catégorie
 *     tags: [Article]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description:  L'identifiant d'une catégorie
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: La liste des articles correspondant à cet identifiant de catégorie
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/article'
 * 
 *       404:
 *         description: Il n'existe pas d'article avec l'id {id}
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: L'érreur à l'origine de la 404
 *                   example: Pas d'articles pour la catégorie avec l'identifiant 765
 */
router.get('/posts/category/:id(\\d+)', cache, postController.postsByCategory);

/**
 * @swagger
 * components:
 *   schemas:
 *     categorie:
 *       type: object
 *       required:
 *         - route
 *         - label
 *       properties:
 *         id:
 *           type: integer
 *           description: L'id de l'article
 *           example: 1
 *         route:
 *           type: string
 *           description: La route a contacté pour avoir les articles de cette catégorie
 *           example: /angular 
 *         label:
 *           type: string
 *           description: Le nom de la categorie
 *           example: Angular
 */

 /**
  * @swagger
  * tags:
  *   name: Categories
  *   description: La gestion de mes categories d'articles
  */

 /**
 * @swagger
 * /category:
 *   get:
 *     summary: Renvoie toutes les catégories existantes
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: La liste de toutes les catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/categorie'
  *       404:
 *         description: Il n'existe pas de catégories en BDD
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: L'érreur à l'origine de la 404
 *                   example: Il n'éxiste pas de catégories en BDD !
 */
router.get('/category', cache, categoryController.allCategories);

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Renvoie l'article nouvellement créé
 *     tags: [Article]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Le titre de l'article
 *                 example: React, le meilleur framework front ?
 *               category:
 *                 type: string / integer
 *                 description: Le titre de la catégorie de l'article OU son identifiant
 *                 example: React / 3
 *     responses:
 *       201:
 *         description: L'article nouvellement créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/article'
 * 
 *       404:
 *         description: Il n'existe pas d'article avec l'id {id}
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: L'érreur à l'origine de la 404
 *                   example: Un article avec ce slug existe déjà. Votre article n'a pas pu être enregistré.
 */
router.post('/posts', clean, validateBody(postSchema), flush, postController.newPost);
//! la position du flush entraine une invalidation du cache même si une érreur apparait (slug identique)
//! et qu'auncune donnée n'est enregistré.



export default router;