import Post from '../models/postModel.mjs';
import chalk from 'chalk';


const postController = {

    allPosts: async (_, res) => {

        try {

            const posts = await Post.findAll();

            res.json(posts);

        } catch (err) {
            // Les érreurs du model, print en jaune, seront captées par le try catch du model !
            // Seules les érreurs du controller, print en rouge,  seront intercéptées ici !
            console.log(chalk.red('Error dans la méthode allPosts du postController : ', err));
            res.status(404).end();
        }

    },

    onePost: async (req, res) => {

        try {

            const {
                id
            } = req.params; // id du post

            const post = await Post.findOne(id);

            res.json(post);

        } catch (err) {
            console.log(chalk.red('Error dans la méthode onePosts du postController : ', err));
            res.status(404).end();
        }
    },


    postsByCategory: async (req, res) => {

        try {

            const {
                id
            } = req.params; // id de la catégorie

            const posts = await Post.findByCategory(id);
            res.json(posts);

        } catch (err) {
            console.log(chalk.red('Error dans la méthode postsByCategory du postController : ', err));
            res.status(404).end();
        }
    },

    newPost: async (req, res) => {
    
        // ici, thePost peut contenir l'une des 2 propriétés suivantes :
        // - un categoryId, l'id d'une ligne dans la table category
        // - une category, le libellé d'une ligne dans la table category

        try {

            const thePost = new Post(req.body);
            const newPost = await thePost.save();

            res.json(newPost);

        } catch (err) {

            console.log(chalk.red('Error dans la méthode newPost du postController : ', err));
            res.status(404).end();
        }
    }
};

export default postController;