import 'dotenv/config';
import pg from 'pg';
const {Pool} = pg;

/**
 * db est un pool de connecteurs de base de données
 * @module - permet le lien avec la base de données postgreSQL
 */
const db = new Pool();

export default db;