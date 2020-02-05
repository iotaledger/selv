const crypto = require('crypto');

export default async (key: string, payload: string) => {
    const textParts: string[] = payload.split(':');
    const firstElement: string = textParts.shift() || '';
	const iv: Buffer = Buffer.from(firstElement, 'hex');
	const encryptedText: Buffer = Buffer.from(textParts.join(':'), 'hex');
	const decipher: any = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);

	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}
