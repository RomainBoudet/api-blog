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
        try {

            const {
                rows
            } = await db.query('SELECT * FROM category;');

            if (!rows[0]) {
                //throw new Error("Aucune category dans la BDD");
                console.log(chalk.yellow("Aucune category dans la BDD !"));
                return {
                    message: "Aucune category dans la BDD !" //! (utilisé dans la méthode newPost du postController)
                };
            }

            return rows.map(cat => new Category(cat));


        } catch (error) {

            console.log(chalk.yellow("Erreur dans la méthode findAll du Model Category : ", error));

        }

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

        }


    }



}

export default Category;