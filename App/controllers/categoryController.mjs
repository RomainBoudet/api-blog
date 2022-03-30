import Category from '../models/categoryModel.mjs';
import chalk from 'chalk';

const categoryController = {
    
    allCategories: async (_, res) => {

        try {

        const categories = await Category.findAll();

        res.status(200).json(categories);

        } catch (err) {
            console.log("Erreur dans le categotyController, méthode AllCategories : ", err);
            res.status(500).end();
        }
       
    }

}

export default categoryController;