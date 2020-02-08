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
}

export const flattenObject = (obj: {[key: string]: any;}, prefix = '') =>
  Object.keys(obj).reduce((acc: any, k: any) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object') {
        Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
        acc[k] = obj[k]; // acc[pre + k] to keep the nested structure 
    }
    return acc;
  }, {});