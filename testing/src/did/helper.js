const crypto = require('crypto');

export const encrypt = async (key, payload) => {
    const IV_LENGTH = 16; // For AES, this is always 16
	const iv = crypto.randomBytes(IV_LENGTH);
	const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
	let encrypted = cipher.update(payload);

	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
	// return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export const decrypt = async (key, payload) => {
	const textParts = payload.split(':');
	const iv = Buffer.from(textParts.shift(), 'hex');
	const encryptedText = Buffer.from(textParts.join(':'), 'hex');
	const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
	let decrypted = decipher.update(encryptedText);

	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}

export const storeCredential = async (credentialId, credential) => {
    await localStorage.setItem(credentialId, JSON.stringify(credential))
}

export const retrieveCredential = async credentialId => {
	const credential = await localStorage.getItem(credentialId)
	return credential ? JSON.parse(credential) : null
}

export const storeIdentity = async did => {
    await localStorage.setItem('did', JSON.stringify(did))
}

export const retrieveIdentity = async () => {
	const identity = await localStorage.getItem('did')
	return JSON.parse(identity)
}
