import conf from '@/conf/conf';
import { AES, enc } from 'crypto-js'


const secretKey = conf.secreteKey
export class encryptObject {
    encryptString(
        str: string,
    ) {
        const ciphertext = AES.encrypt(str, secretKey);
        return encodeURIComponent(ciphertext.toString());
    };
    decryptString(
        encryptedStr: string
    ) {
        const decodedStr = decodeURIComponent(encryptedStr);
        return AES.decrypt(decodedStr, secretKey).toString(enc.Utf8);
    };

}
const cryptoUtil = new encryptObject();
export default cryptoUtil