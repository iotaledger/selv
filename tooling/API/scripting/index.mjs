import { driver } from "@digitalbazaar/did-method-key";
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";

const serializedKeyPair = {
  id: undefined,
  type: 'Ed25519VerificationKey2020',
  publicKeyMultibase: 'z6MkfDvsiwx8ddaUitBuwxn8fCfyMZkK7ipQanMVS1FqvchE',
  privateKeyMultibase: 'zrv4A1PuCKJseb95jLWFkiBQX1QkkvfX9rZXP1nXZ3V53yZT3Yze18MfaQpzmrNXm1mbdFKSXdSTFGMbyPsHjFgXMZa'
};

const didKeyDriver = driver();
didKeyDriver.use({
  multibaseMultikeyHeader: "z6Mk",
  fromMultibase: Ed25519VerificationKey2020.from,
});


export const getDIDKey = async () => {
  const keyPair = await Ed25519VerificationKey2020.from(serializedKeyPair);
  
  return await didKeyDriver.fromKeyPair({
    verificationKeyPair: keyPair,
  });
};

export const sign = async (rawData) => {
  const keyPair = await Ed25519VerificationKey2020.from(serializedKeyPair);
  const { sign } = keyPair.signer();

  // data is a Uint8Array of bytes
  const data = (new TextEncoder()).encode(rawData);
  // Signing also outputs a Uint8Array, which you can serialize to text etc.
  return Buffer.from(await sign({data})).toString("base64url");
}

export const generateKP = async () => {
  
  const keyPair = await Ed25519VerificationKey2020.generate();

  return await keyPair.export({publicKey: true, privateKey: true});;
}