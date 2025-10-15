import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Needed for ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default open({
    filename: path.join(__dirname, '../data/database.db'),
    driver: sqlite3.Database
});


