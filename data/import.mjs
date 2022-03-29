//! Import ES6 dans ce fichier !
import 'dotenv/config'
import categories from './categories.json' assert { type: 'json' }; //! Expérimental ! Seul la version Node 17.8 permet ça !
import posts from './posts.json' assert { type: 'json' }; //! Expérimental ! https://nodejs.org/api/esm.html#esm_json_modules
import chalk from 'chalk';

// CONFIG pg
import pg from 'pg'; // pas de destructuration direct a l'import, pg est un commonJS module...
const { Pool } = pg;

// Import en mode commonJS :
//require('dotenv').config(); // j'aurai toutes les infos de connexion PG nécessaires
//const categories = require('./categories.json');
//const posts = require('./posts.json');
//const chalk = require('chalk');
//const { Pool } = require('pg');

const db = new Pool();
// rien à passer, tout est dans l'environnement 

const importData = async () => {
    try {

        console.log(chalk.green("Début de l'import"));
    
        console.log(chalk.green(`Import de ${categories.length} catégories`));
    
        const categoryInsert = "INSERT INTO category (route, label) VALUES ($1, $2) RETURNING id;";
    
        await db.query('DELETE FROM post;');

        await db.query('DELETE FROM category;');

    
        for (const cat of categories) {
            console.log(`Import de la catégorie ${cat.label}`);
            const result = await db.query(categoryInsert, [cat.route, cat.label]);
            
            // dans result, il y aura une propriété rows qui contiendra nos données
            cat.id = result.rows[0].id; // on stocke l'id directement dans la catégorie correspondante
        }
    
        console.log(chalk.green(`Import de ${posts.length} posts`));
    
        const postInsert = "INSERT INTO post (slug, title, excerpt, content, category_id) VALUES ($1, $2, $3, $4, $5);";
    
    
        for (const post of posts) {
            // on va fouiller dans l'array categories à la recherche de la bonne catégorie
            const theCategory = categories.find(cat => cat.label === post.category);
    
            await db.query(postInsert,
                [post.slug, post.title, post.excerpt, post.content, theCategory.id]
            );
        }
    
        console.log(chalk.green.bold("Import terminé"));
        
    } catch (error) {

        console.trace(chalk.red.bold("Erreur lors de l'import ! => ", error));

    }


};

importData();