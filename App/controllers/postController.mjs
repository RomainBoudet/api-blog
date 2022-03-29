

const postController = {

    allPosts: async(req, res) => {
        try {
            
            res.json('Hello World');


        } catch (error) {
            console.log('Rrror dans la méthode allPosts du postController : ', error);
        }

    }
};

export default postController;