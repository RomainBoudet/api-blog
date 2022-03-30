import Category from '../models/categoryModel.mjs';
import chalk from 'chalk';

/**
 * Une méthode qui va servir a intéragir avec le model Category pour les intéractions avec la BDD
 * Retourne un json
 * @name paiementController
 * @param {Express.Request} req - l'objet représentant la requête
 * @param {Express.Response} res - l'objet représentant la réponse
 * @return {JSON}  - une donnée en format json
 */
const categoryController = {
    
    /**
     * Méthode chargé d'aller chercher les informations relatives à toutes les catégories
     * @name allCategories
     * @param {Express.Response} res - l'objet représentant la réponse
     * @returns - Toutes les catégorie et leurs routes présent en base de données
     * @async - une méthode asynchrone
     */
    allCategories: async (_, res) => {

        try {

        const categories = await Category.findAll();

        res.status(200).json(categories);

        } catch (err) {
            console.log(chalk.red("Erreur dans le categotyController, méthode AllCategories : ", err));
            res.status(500).end();
        }
       
    }

}

export default categoryController;