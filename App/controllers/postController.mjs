// Import model
import Post from '../models/postModel.mjs';
import Category from '../models/categoryModel.mjs';

// Import npm
import chalk from 'chalk';
import {
    distance,
    closest
} from 'fastest-levenshtein';

/**
 * Une méthode qui va servir a intéragir avec le model Post pour les intéractions avec la BDD
 * Retourne un json
 * @name paiementController
 * @param {Express.Request} req - l'objet représentant la requête
 * @param {Express.Response} res - l'objet représentant la réponse
 * @return {JSON}  - une donnée en format json
 */
const postController = {

    /**
     * Méthode chargé d'aller chercher les informations relatives à tous les posts
     * @name allPost
     * @param {Express.Response} res - l'objet représentant la réponse
     * @returns - Tous les postes présent en base de données
     * @async - une méthode asynchrone
     */
    allPosts: async (_, res) => {

        try {
            let posts;
            try {
                posts = await Post.findAll();
            } catch (error) {
                return res.status(404).json({message: error.message})
            }
            return res.status(200).json(posts);

        } catch (err) {
            // Les érreurs du model, print en jaune, seront captées par le try catch du model !
            // Seules les érreurs du controller, print en rouge,  seront intercéptées ici !
            console.log(chalk.red('Error dans la méthode allPosts du postController : ', err));
            return res.status(500).end();
        }

    },

    /**
     * Méthode chargé d'aller chercher les informations relatives à un post via son id
     * @name onePost
     * @param {Express.Request} req - l'objet représentant la requête
     * @param {Express.Response} res - l'objet représentant la réponse
     * @returns - Le post demandé avec son id
     * @async - une méthode asynchrone
     */
    onePost: async (req, res) => {

        try {

            const {
                id
            } = req.params; // id du post
            let post;
            try {
                post = await Post.findOne(id);
            } catch (error) {
                return res.status(404).send({
                    message: error.message
                })
            }

            return res.status(200).json(post);

        } catch (err) {
            console.log(chalk.red('Error dans la méthode onePosts du postController : ', err));
            return res.status(500).end();
        }
    },

    /**
     * Méthode chargé d'aller chercher les informations relatives à un post via son id
     * @name postsByCategory
     * @param {Express.Request} req - l'objet représentant la requête
     * @param {Express.Response} res - l'objet représentant la réponse
     * @returns - Le post demandé avec son id
     * @async - une méthode asynchrone
     */
    postsByCategory: async (req, res) => {

        try {

            const {
                id
            } = req.params; // id de la catégorie
            let posts;
            try {
                posts = await Post.findByCategory(id);
            } catch (error) {
                return res.status(404).send({
                    message: error.message
                })
            }
            return res.status(200).json(posts);

        } catch (err) {
            console.log(chalk.red('Error dans la méthode postsByCategory du postController : ', err));
            return res.status(500).end();
        }
    },

    /**
     * Méthode chargé d'aller chercher enregistrer un nouveau post
     * @name newPost
     * @param {Express.Request} req - l'objet représentant la requête
     * @param {Express.Response} res - l'objet représentant la réponse
     * @returns - Le post nouvellement enregistré avec son id
     * @async - une méthode asynchrone
     */
    newPost: async (req, res) => {

        // ici, thePost peut contenir l'une des 2 propriétés suivantes :
        // - un categoryId, l'id d'une ligne dans la table category
        // - une category, le libellé d'une ligne dans la table category

        // On utilise la distance de Levenstein pour déterminer si une category éxistante très similaire existe déja.
        // si oui, on la remplace par celle éxistante. 

        // Enfin, on permet également d'insérer une nouvelle catégorie, en amont d'un nouvel articles, si elle n'est pas déja présente dans la BDD.

        try {

            if (req.body.category) {
                let categories;
                try {
                    categories = await Category.findAll();
                } catch (error) {

                    if (error.message !== "Aucune categorie dans la BDD !") {

                        let allLabels = [];
                        categories.map(item => allLabels.push(item.label));
    
                        // Si la category insérée existe déja
                        if (allLabels.includes(req.body.category)) {
                            const thePost = new Post(req.body);
                            let newPost;
                            try {
                                newPost = await thePost.save();
                            } catch (error) {
                                return res.status(404).json({message: error.message})    
                            }
                            return res.status(201).json(newPost);
    
                        }
    
                        // La category inséré n'existe pas
                        let arrayDistance = [];
                        for (const item of allLabels) {
                            const theDistance = distance(req.body.category, item);
                            arrayDistance.push(theDistance);
                        }
    
                        const indexSmallDistance = arrayDistance.findIndex((elem) => elem <= 2);
    
                        // Ca match: une catégorie présente dans la BDD est trés proche de ce qu'a inséré le user:
                        if (!(indexSmallDistance === -1 || indexSmallDistance === undefined)) {
    
                            // J'insére directement la catégory existante, le plus proche possible de sa demande !
                            const closeCategory = closest(req.body.category, allLabels);
    
                            console.log(`Vous avez tenté d'insérer un aticle avec une nouvelle catégorie ('${req.body.category}'). Une catégorie très similaire a été trouvée : '${closeCategory}'. Votre catégorie insérée va être convertie en sa catégorie existante la plus proche ('${closeCategory}'). `)
    
                            req.body.category = closeCategory
    
                            const thePost = new Post(req.body);
    
                            let newPost = newPost;
                            try {
                                newPost = await thePost.save();
                            } catch (error) {
                                return res.status(404).send({
                                    message: error.message
                                })
                            }
    
                            return res.status(201).json(newPost);
                        }
    
                        // ici il éxiste des catégories en BDD mais la catégorie inséré est loin de ce qui existe, 
    
                    };
                    // il y a une érreur dans le model category findAll et elle ne provient pas d'une absence de catégory.. :
                    return res.status(500).end();

                }
                // Si aucune catégorie n'existe, aucune vérification nécéssaire.
               

                // ici il n'existe pas de category déjé enregistrées en BDD
                console.log("req.body.category => ", req.body.category);

                const theCategory = new Category({
                    route: `/${req.body.category.replace(' ', '_').toLowerCase()}`,
                    label: `${req.body.category}`
                });

                try {
                    await theCategory.save();
                } catch (error) {
                    return res.status(404).send({
                        message: error.message
                    })

                }

            }

            // ici il n'y a pas de catégory dans le body mais un categoryId !

            const thePost = new Post(req.body);
            
            let newPost;
            try {
                newPost = await thePost.save();
            } catch (error) {
                return res.status(404).json({message: error.message}); 
            }

            return res.status(201).json(newPost);

        } catch (err) {

            console.log(chalk.red('Error dans la méthode newPost du postController : ', err));
            return res.status(500).end();
        }
    }
};

export default postController;