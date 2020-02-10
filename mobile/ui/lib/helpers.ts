import {
    parse
} from "~/lib/identity";
import { createCipheriv, createDecipheriv } from 'browserify-aes';

export type QRLink = {
    channelId: string;
    challenge: string;
    password: string;
    requestedCredentials: string[];
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
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }

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
}
