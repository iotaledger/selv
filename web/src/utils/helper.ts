const crypto = require('crypto');

export const decrypt = (key: string, payload: string) => {
    const textParts: string[] = payload.split(':');
    const firstElement: string = textParts.shift() || '';
    const iv: Buffer = Buffer.from(firstElement, 'hex');
    const encryptedText: Buffer = Buffer.from(textParts.join(':'), 'hex');
    const decipher: any = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

export const encrypt = async (key: string, payload: string) => {
    const IV_LENGTH = 16; // For AES, this is always 16
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(payload);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const flattenObject = (obj: {[key: string]: any;}, prefix = '') =>
    Object.keys(obj).reduce((acc: any, k: any) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (obj[k] && typeof obj[k] === 'object') {
            Object.assign(acc, flattenObject(obj[k], pre + k));
        } else {
            acc[k] = obj[k]; // acc[pre + k] to keep the nested structure
        }
        return acc;
    }, {});

export const getCompanyId = async () => {
    const companyDetailsString: string | null = await localStorage.getItem('companyDetails');
    const companyDetails = companyDetailsString && await JSON.parse(companyDetailsString);
    return companyDetails?.data?.CompanyNumber;
};

export const getRandomInt = (max: number) =>
    Math.abs(Math.floor(Math.random() * Math.floor(max)));
