import db from '../database.mjs';

const postController = {

    allPosts: async(req, res) => {
        try {
            
            res.json('Hello World');


        } catch (error) {
            console.log('Error dans la méthode allPosts du postController : ', error);
        }

    }
};

export default postController;