import crypto from "crypto";

const generateRSAKeyPair = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  return { private: privateKey, public: publicKey };
};

export { generateRSAKeyPair };
