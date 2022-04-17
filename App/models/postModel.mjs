import db from '../database.mjs';
import chalk from 'chalk';

class Post {

    id;
    slug;
    title;
    excerpt;
    content;
    category;
    categoryId;

    set category_id(val) {
        this.categoryId = val;
    }

    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    /**
     * Méthode chargé d'aller chercher les informations relatives à un post passé en paramétre
     * @param id- un id d'un post
     * @returns - les informations d'un post demandées
     * @static - une méthode static
     * @async - une méthode asynchrone
     */
    static async findOne(id) {
        // ! ATTENTION, si je met un try catch ici l'info de l'érreur n'est pas remonté dans le controller de
        //! et je ne peux pas renvoyer l'info proprement via res.status(404).json({mon message provenant du model})
        //try {
            const result = await db.query(`
            SELECT
                post.*,
                category.label category
            FROM post
            JOIN category ON post.category_id = category.id
            WHERE post.id = $1;
        `, [id]);

            if (!result.rows[0]) {
                // si pas de données
                // le constructeur d'une Erreur attend un message en argument
                console.log(chalk.yellow(`Pas de post avec l'id ${id}`));
                throw new Error(`Il n'existe pas d'article avec l'id ${id}`);
                /* return {
                    message: `Pas de post avec l'id ${id}`
                } */
            }

            // à partir des données brutes, je crée une instance de Post
            return new Post(result.rows[0]);

       // } catch (error) {

            //console.log(chalk.yellow("Erreur dans la méthode findOne du Model Post : ", error));
       // }

    }

    /**
     * Méthode chargé d'aller chercher les informations relatives à tous les posts présent en BDD
     * @returns - les informations d'un post demandées
     * @static - une méthode static
     * @async - une méthode asynchrone
     */
    static async findAll() {

            // va chercher tous les posts dans la bdd
            const result = await db.query(`
                SELECT
                    post.*,
                    category.label category
                FROM post
                JOIN category ON post.category_id = category.id;
                `);

            if (!result.rows[0]) {
                //throw new Error("Pas de post en BDD !");
                console.log(chalk.yellow("Pas d'article en BDD !"));
                throw new Error("Il n'éxiste pas d'article en BDD !");

            }

            // et les retourne, sous forme d'instances de Post
            return result.rows.map(post => new Post(post));

    }

    /**
     * Méthode chargé d'aller chercher les informations relatives à tous les posts qui ont la catégorie demandée
     * @param categoryId- un id d'une catégorie
     * @returns - La list des posts avec la catégorie demandé
     * @static - une méthode static
     * @async - une méthode asynchrone
     */
    static async findByCategory(categoryId) {

       
            const result = await db.query(`
            SELECT
                post.*,
                category.label category
            FROM post
            JOIN category ON post.category_id = category.id
            WHERE post.category_id = $1;
        `, [categoryId]);

            if (!result.rows[0]) {
                // throw new Error("Pas de posts pour la catégorie " + categoryId);
                
                console.log(chalk.yellow(`Pas d'articles pour la catégorie avec l'identifiant ${categoryId}`));
                throw new Error(`Pas d'articles pour la catégorie avec l'identifiant ${categoryId}`);
            }

            return result.rows.map(post => new Post(post));

    }

    /**
     * Méthode chargé d'aller insérer les informations relatives à un post
     * @returns - Les données du post nouvellement inséré
     * @instance - une méthode d'insatnce
     * @async - une méthode asynchrone
     */
    async save() {

            // Méthode flexible, qui accept l'id de la categorie ou le label de sa catégorie 
            let query;

            // toutes les données en commun sont préparées
            const data = [
                this.slug,
                this.title,
                this.excerpt,
                this.content
            ];
            // si categoryId est présent
            if (this.categoryId) {
                query = "INSERT INTO post (slug, title, excerpt, content, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
                data.push(this.categoryId);

            } else { // si category est présent plutôt que categoryId
                query = `
                INSERT INTO post (slug, title, excerpt, content, category_id)
                SELECT $1, $2, $3, $4, id
                FROM category
                WHERE label = $5
                RETURNING *;
            `;

                data.push(this.category);
            }

            // je ne pioche que les données parmi l'objet result qui m'est retourné
            try {
                // insérer le post et récupérer son id

                const {
                    rows
                } = await db.query(query, data);

                // l'affecter au post
                this.id = rows[0].id;

                return new Post(rows[0]);

            } catch (err) {
                console.log(chalk.yellow("Un article avec ce slug existe déjà : ", err));
                throw new Error("Un article avec ce slug existe déjà. Votre article n'a pas pu être enregistré.");
            }



    }

}

export default Post;