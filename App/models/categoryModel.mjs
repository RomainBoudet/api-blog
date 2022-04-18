import db from '../database.mjs';
import chalk from 'chalk';


class Category {
    id;
    route;
    label;

    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    /**
     * Méthode chargé d'aller chercher toutes les informations relatives à toutes les catégories (label et route)
     * @returns - les informations de toutes les catégories présentes en BDD
     * @static - une méthode static
     * @async - une méthode asynchrone
     */
    static async findAll() {
        //try {
            const {
                rows
            } = await db.query('SELECT * FROM category;');

            if (!rows[0]) {
                
                console.log(chalk.yellow("Aucune category dans la BDD !"));
                throw new Error("Il n'éxiste pas de catégories en BDD !"); //! (utilisé dans la méthode newPost du postController)
                /* return {
                    message: "Aucune category dans la BDD !" 
                }; */
            }

            return rows.map(cat => new Category(cat));

        /* } catch (error) {

            console.log(chalk.yellow("Erreur dans la méthode findAll du Model Category : ", error));

        } */

    }

    /**
     * Méthode chargé d'aller chercher toutes les informations relatives à toutes les catégories (label et route). 
     * UTILISÉ UNIQUEMENT PAR L'APPLI ELLE MÊME, AVEC UNE GESTION DE L'ERREUR EN CAS D'ABSENCE DE CATEGORY QUI NE RETOURNE PAS D'ERREUR...
     * @returns - les informations de toutes les catégories présentes en BDD
     * @static - une méthode static
     * @async - une méthode asynchrone
     */
     static async findAllInternal() {
            const {
                rows
            } = await db.query('SELECT * FROM category;');

            if (!rows[0]) {
                console.log(chalk.yellow("Aucune category dans la BDD ! (categoryModel - findAllInternal)"));
                return [];
            }

            return rows.map(cat => new Category(cat));
    }

    /**
     * Méthode chargé d'aller insérer les informations relatives à une catégorie passé en paramétre
     * @param route - la route d'une catégorie
     * @param label - le label d'une catégorie
     * @returns - Aucune donnée n'est retournée
     * @instance - une méthode d'insatnce
     * @async - une méthode asynchrone
     */
    async save() {

        try {

            const {
                rows,
            } = await db.query(
                `INSERT INTO category (route, label) VALUES ($1,$2) RETURNING *;`,
                [this.route, this.label]
            );

            this.id = rows[0].id;

            console.log(chalk.yellow("Une nouvelle category a bien été enregistrée !"));
            return new Category(rows[0]);

        } catch (error) {

            console.log(chalk.yellow("Erreur dans la méthode save du Model Category : ", error));
            // message lié a l'article alors qu'on est dans catégory car le seul endroit ou est utilisé cette methode est lors de la création d'un nouvel article !
            throw new Error("Vous avez essayer d'insérer un article avec une catégorie déja existante. Chaque categorie doit être unique. Votre article n'a pas pu être enregistré. Merci de réessayer avec une catégorie non existante.");

        }


    }



}

export default Category;