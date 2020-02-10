import {
    parse
} from "~/lib/identity";
import { createCipheriv } from 'browserify-aes';

export type QRLink = {
    channelId: string;
    challenge: string;
    password: string;
    requestedCredentials: string[];
};

export const parseLink = (link: string): QRLink => {
    return parse(link) as QRLink;
};

export const encrypt = (key: string, payload: string): string => {
    const IV_LENGTH = 16; // For AES, this is always 16
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(payload);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
};
