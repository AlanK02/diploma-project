import * as openpgp from 'openpgp';

export async function encryptData(plaintext, publicKeyArmored) {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: plaintext }),
        encryptionKeys: publicKey,
    });
    return encrypted;
}

export async function decryptData(ciphertext, privateKeyArmored) {
    const privateKey = await openpgp.readKey({ armoredKey: privateKeyArmored });
    const message = await openpgp.readMessage({
        armoredMessage: ciphertext,
    });
    const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey,
    });
    return decrypted;
}
