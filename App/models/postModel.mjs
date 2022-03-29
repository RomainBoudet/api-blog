import db from '../database.mjs';
import chalk from 'chalk';

class Post {

    id;
    slug;
    title;
    excerpt;
    content;
    category;

    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }


    static async findOne(id) {

        try {
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
                throw new Error("Pas de post avec l'id " + id);
            }

            // à partir des données brutes, je crée une instance de Post
            return new Post(result.rows[0]);

        } catch (error) {

            console.log(chalk.yellow("Erreur dans la méthode findOne du Model Post : ", error));
        }

    }


    static async findAll() {

        try {

            // va chercher tous les posts dans la bdd
            const result = await db.query(`
                SELECT
                    post.*,
                    category.label category
                FROM post
                JOIN category ON post.category_id = category.id;
                `);

            if (!result.rows[0]) {
                throw new Error("Pas de post en BDD !");
            }

            // et les retourne, sous forme d'instances de Post
            return result.rows.map(post => new Post(post));

        } catch (error) {

            console.log(chalk.yellow("Erreur dans la méthode findAll du Model Post : ", error));

        }

    }

    static async findByCategory(categoryId) {

        try {
            const result = await db.query(`
            SELECT
                post.*,
                category.label category
            FROM post
            JOIN category ON post.category_id = category.id
            WHERE post.category_id = $1;
        `, [categoryId]);

            if (!result.rows[0]) {
                throw new Error("Pas de posts pour la catégorie " + categoryId);
            }

            return result.rows.map(post => new Post(post));

        } catch (error) {

            console.log(chalk.yellow("Erreur dans la méthode findByCategory du Model Post : ", error));

        }


    }

    /**
     * sauvegarde un post et le retourne avec son id
     * @param {Post} thePost 
     */
    async save() {

        try {

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

                return new Post (rows[0]);

            } catch (err) {
                throw new Error("Un article avec ce slug existe déjà");
            }



        } catch (error) {

            console.log(chalk.yellow("Erreur dans la méthode save du Model Post : ", error));
        }


    }

}

export default Post;