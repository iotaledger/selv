import { createCipheriv, createDecipheriv } from 'browserify-aes';

export type QRLink = {
    channelId: string;
    challenge: string;
    password: string;
    requestedCredentials: string[];
};

export const urlPortRegex = new RegExp('(https?://.*):(d*)/?(.*)');

/**
 * Parses serialised data
 *
 * @method parse
 *
 * @param {string} data
 * @returns {object}
 */
export const parse = (data: string): any => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

/**
 * Converts byte array to hex
 *
 * @method convertByteArrayToHex
 *
 * @param {Uint8Array} bytes
 *
 * @return {string}
 */
export const convertByteArrayToHex = (bytes: Uint8Array): string => {
    const hex = [];

    /* eslint-disable no-plusplus,no-bitwise */
    for (let i = 0; i < bytes.length; i++) {
        const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xf).toString(16));
    }

    /* eslint-enable no-plusplus,no-bitwise */
    return hex.join('');
};

/**
 * Parses QR link
 *
 * @method parseLink
 *
 * @param {string} link
 *
 * @returns {QRLink}
 */
export const parseLink = (link: string): QRLink => {
    return parse(link) as QRLink;
};

/**
 * Encrypts payload with provided password (key)
 *
 * @method encrypt
 *
 * @param {string} key
 * @param {string} payload
 *
 * @returns {string}
 */
export const encrypt = (key: string, payload: string): string => {
    const IV_LENGTH = 16; // For AES, this is always 16
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(payload);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${convertByteArrayToHex(iv)}:${encrypted.toString('hex')}`;
};

/**
 * Decrypts payload with provided password (key)
 *
 * @method decrypt
 *
 * @param {string} key
 * @param {string} payload
 *
 * @returns {string}
 */
export const decrypt = (key: string, payload: string): string => {
    const textParts = payload.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
