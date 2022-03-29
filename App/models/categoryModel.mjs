
import db from '../database.mjs';

class Category {
    id;
    route;
    label;

    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }

    static async findAll () {
        const { rows } = await db.query('SELECT * FROM category;');

        if (!rows[0]) {
            //throw new Error("Aucune category dans la BDD");
            return null;
          }

        return rows.map(cat => new Category(cat));
    }

}

export default Category;