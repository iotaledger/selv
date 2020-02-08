const crypto = require('crypto');
const randomstring = require("randomstring");
const random_string = randomstring.generate();

const ENCRYPTION_KEY = random_string; // process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16


function encrypt(text) {
	let iv = crypto.randomBytes(IV_LENGTH);
	let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer.from(ENCRYPTION_KEY), iv);
	let encrypted = cipher.update(text);

	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
	let textParts = text.split(':');
	let iv = new Buffer.from(textParts.shift(), 'hex');
	let encryptedText = new Buffer.from(textParts.join(':'), 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer.from(ENCRYPTION_KEY), iv);
	let decrypted = decipher.update(encryptedText);

	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}


const mytext = JSON.stringify({
    message: 'Message from Alice',
    timestamp: (new Date()).toLocaleString()
  })

const encrypted = encrypt(mytext);
const decrypted = decrypt(encrypted);

console.log('encrypted')
console.log(encrypted)
console.log('==============')
console.log('decrypted')
console.log(decrypted)
console.log('==============')
console.log(random_string)
