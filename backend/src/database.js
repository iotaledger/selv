const path = require('path');
const sqlite3 = require('sqlite3');
const { database } = require('../config');

sqlite3.verbose();
const db = new sqlite3.Database(
    path.resolve(__dirname, database), async error => {
        try {
            if (error) {
                return console.error('New database Error', error);
            }

            await db.run(`CREATE TABLE IF NOT EXISTS company (
                CompanyNumber TEXT PRIMARY KEY, 
                CompanyName TEXT, 
                CompanyCreationDate TEXT, 
                CompanyType TEXT, 
                CompanyStatus TEXT,
                CompanyOwner TEXT, 
                CompanyOwners TEXT, 
                CompanyAddress TEXT, 
                CompanyBusiness TEXT, 
                tangle TEXT
                )`);
            await db.run(`CREATE TABLE IF NOT EXISTS commitments (
                CommitmentUUID TEXT PRIMARY KEY,
                CommitmentId TEXT,
                CommitmentTitle TEXT, 
                CommitmentCreationDate TEXT, 
                CommitmentType TEXT, 
                CommitmentPercentage INTEGER,
                CommitmentSupport TEXT, 
                CommitmentWalletPercentage INTEGER
                )`);
            await db.run('CREATE TABLE IF NOT EXISTS did (root TEXT, privateKey TEXT, keyId TEXT, seed TEXT, mamState TEXT)');
            await db.run('CREATE TABLE IF NOT EXISTS credentials (id TEXT, credential TEXT)');
        } catch (error) {
            console.log('create', error);
            return null;
        }
    }
);

exports.close = async () => {
    db.close(error => {
        if (error) {
            return console.error(error.message);
        }
    });
};

exports.createOrUpdateCompany = async ({
    CompanyNumber,
    CompanyName,
    CompanyCreationDate,
    CompanyType,
    CompanyStatus,
    CompanyOwner,
    CompanyOwners,
    CompanyAddress,
    CompanyBusiness,
    tangle
}) => {
    const query = `
        REPLACE INTO company (
            CompanyNumber, 
            CompanyName, 
            CompanyCreationDate, 
            CompanyType, 
            CompanyStatus, 
            CompanyOwner, 
            CompanyOwners,
            CompanyAddress,
            CompanyBusiness,
            tangle
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.run(query, [
        CompanyNumber,
        CompanyName,
        CompanyCreationDate,
        CompanyType,
        CompanyStatus,
        CompanyOwner,
        CompanyOwners,
        CompanyAddress,
        CompanyBusiness,
        tangle
    ]);
};

exports.createCommitment = async ({
    CommitmentUUID,
    CommitmentId,
    CommitmentTitle, 
    CommitmentCreationDate, 
    CommitmentType, 
    CommitmentPercentage,
    CommitmentSupport, 
    CommitmentWalletPercentage
}) => {
    const query = `
        INSERT INTO commitments (
            CommitmentUUID,
            CommitmentId,
            CommitmentTitle, 
            CommitmentCreationDate, 
            CommitmentType, 
            CommitmentPercentage,
            CommitmentSupport, 
            CommitmentWalletPercentage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.run(query, [
        CommitmentUUID,
        CommitmentId,
        CommitmentTitle, 
        CommitmentCreationDate, 
        CommitmentType, 
        CommitmentPercentage,
        CommitmentSupport, 
        CommitmentWalletPercentage
    ]);
};

// createDID = async ({ root, privateKey, keyId, seed, next_root, start }) => {
//     const insert = `
//         INSERT INTO did (
//         root, privateKey, keyId, seed, next_root, start)
//         VALUES (?, ?, ?, ?, ?, ?)`;
//     await db.run(insert, [root, privateKey, keyId, seed, next_root, start]);
// };

// createCredential = async ({ id, credential }) => {
//     await db.run('INSERT INTO credentials (id, credential) VALUES (?, ?)', [id, credential]);
// };

// exports.writeData = async (table, data) => {
//     try {
//         console.log('writeData', table, data);
//         switch (table) {
//         case 'did':
//             await createDID(data);
//             return;
//         case 'credential':
//             await createCredential(data);
//             return;
//         case 'company':
//         default:
//             await createOrUpdateCompany(data);
//             return;
//         }
//     } catch (error) {
//         console.log('writeData', error);
//         return null;
//     }
// };

exports.readData = async (table, searchField = null) => {
    return new Promise((resolve, reject) => {
        try {
            let query = `SELECT * FROM ${table} ORDER BY rowid DESC LIMIT 1`;
            if (searchField) {
                query = `SELECT * FROM ${table} WHERE CompanyNumber = '${searchField}' ORDER BY rowid DESC LIMIT 1`;
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
            return reject(error);
        }
    });
};

exports.readAllData = async (table) => {
    return new Promise((resolve, reject) => {
        try {
            db.all(`SELECT * FROM ${table} ORDER BY rowid DESC`, (err, rows) => {
                if (err) {
                    return resolve(null);
                } else {
                    return resolve(rows);
                }
            });
        } catch (error) {
            console.log('readAllData', error);
            return reject(error);
        }
    });
};

exports.removeData = (table, value) => {
    return new Promise(async resolve => {
        if (table === 'company') {
            await db.run(`DELETE FROM company WHERE (CompanyNumber = '${value}') OR CompanyNumber IS NULL`);
            resolve();
        } else if (table === 'commitments') {
            await db.run(`DELETE FROM commitments WHERE (CommitmentUUID = '${value}') OR CommitmentUUID IS NULL`);
            resolve();
        } else {
            resolve();
        }
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

// const processData = async () => {
//     incorporatedCompanies.map(async company => {
//         console.log('creating', company)
//         await createCompany(company)
//     })
// }

// processData()
