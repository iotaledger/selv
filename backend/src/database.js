import path from 'path';
import sqlite3 from 'sqlite3';
import { database } from '../config.json';

sqlite3.verbose();
const db = new sqlite3.Database(
    path.resolve(__dirname, database), async error => {
        if (error) {
            return console.error('New database Error', error);
        }
        await db.run('CREATE TABLE IF NOT EXISTS company (id TEXT PRIMARY KEY, name TEXT, role TEXT, location TEXT, address TEXT)');
        await db.run('CREATE TABLE IF NOT EXISTS did (root TEXT, privateKey TEXT, keyId TEXT, seed TEXT, next_root TEXT, start INTEGER)');
        await db.run('CREATE TABLE IF NOT EXISTS credentials (id TEXT, credential TEXT)');
    }
);

export const close = async () => {
    db.close(error => {
        if (error) {
            return console.error(error.message);
        }
    });
};

export const createCompany = async ({ root, privateKey, keyId, seed, next_root, start }) => {
    const insert = `
        INSERT INTO company (
        root, privateKey, keyId, seed, next_root, start)
        VALUES (?, ?, ?, ?, ?, ?)`;
    await db.run(insert, [root, privateKey, keyId, seed, next_root, start]);
};

export const createDID = async ({ root, privateKey, keyId, seed, next_root, start }) => {
    const insert = `
        INSERT INTO did (
        root, privateKey, keyId, seed, next_root, start)
        VALUES (?, ?, ?, ?, ?, ?)`;
    await db.run(insert, [root, privateKey, keyId, seed, next_root, start]);
};

export const createCredential = async ({ id, credential }) => {
    await db.run('INSERT INTO credentials (id, credential) VALUES (?, ?)', [id, credential]);
};

export const writeData = async (table, data) => {
    try {
        console.log('writeData', table, data);
        switch (table) {
            case 'did':
                await createDID(data);
                return;
            case 'credential':
                await createCredential(data);
                return;
            case'company':
            default:
                await createCompany(data);
                return;
        }
    } catch (error) {
        console.log('writeData', error);
        return null;
    }
};

export const readData = async (table, searchField = null) => {
    return new Promise((resolve, reject) => {
        try {
            let query = `SELECT * FROM ${table} ORDER BY rowid DESC LIMIT 1`;
            if (searchField) {
                query = `SELECT * FROM ${table} WHERE id = '${searchField}' ORDER BY rowid DESC LIMIT 1`;
            }
            db.get(query, (err, row) => {
                if (err) {
                    return resolve(null);
                } else {
                    return resolve(row || null);
                }
            });
        } catch (error) {
            console.log('readData', error);
            return reject(null);
        }
    });
};

export const readAllData = async (table) => {
    return new Promise((resolve, reject) => {
        try {
            db.all(`SELECT * FROM ${table}`, (err, rows) => {
                if (err) {
                    return resolve(null);
                } else {
                    return resolve(rows);
                }
            });
        } catch (error) {
            console.log('readAllData', error);
            return reject(null);
        }
    });
};

export const removeData = (table) => {
    return new Promise(async resolve => {
        await db.run(`DELETE FROM ${table}`);
        resolve();
    });
};

/*
Example write operation:

import { writeData } from './databaseHelper';

const data = {
    address: 'CCCCCDDDDD',
    seed: 'SSSSSSEEEEDDDD',
    amount: 555
};

await writeData('wallet', data);
*/

/*
Example read operation:

import { readData } from './databaseHelper';

const result = await readData(channelId);
if (result) {
    return result;
}

*/

/*
Example delete operation:

import { removeData } from './databaseHelper';

await removeData(entry);

*/
