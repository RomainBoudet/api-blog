import 'dotenv/config';
import pg from 'pg';
const {Pool} = pg;

const db = new Pool();

export default db;