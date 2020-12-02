const crypto = require('crypto');

export const decrypt = (key, payload) => {
    const textParts = payload.split(':');
    const firstElement = textParts.shift() || '';
    const iv = Buffer.from(firstElement, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

export const encrypt = async (key, payload) => {
    const IV_LENGTH = 16; // For AES, this is always 16
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(payload);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const flattenObject = (obj, prefix = '') =>
    Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object') {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[k] = obj[k]; // acc[pre + k] to keep the nested structure
        }
        return acc;
    }, {});

export const getRandomInt = (max) =>
    Math.abs(Math.floor(Math.random() * Math.floor(max)));
