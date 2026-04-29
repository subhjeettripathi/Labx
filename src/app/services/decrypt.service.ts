import { Injectable } from '@angular/core';
var CryptoJS = require("crypto-js")

@Injectable({
  providedIn: 'root'
})
export class DecryptService {
  secretKey = '89H49I12T20E542N17D4E5A47R184LKL';
  IV = '0543737198408118';
  decryptData: any;
  constructor() { }
  getDecryptedData(Data: any) {
    let key = CryptoJS.enc.Utf8.parse(this.secretKey);         // Key: Use a WordArray-object instead of a UTF8-string / NodeJS-buffer
    let iv = CryptoJS.enc.Utf8.parse(this.IV);                          // IV: Use a WordArray-object instead of a UTF8-string
    let cipher = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(Data));
    let decrypt = CryptoJS.AES.decrypt(cipher, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    this.decryptData = decrypt.toString(CryptoJS.enc.Utf8);
  }
  decode(x: any) {
    let wordArray = CryptoJS.enc.Base64.parse(x);
    let str = CryptoJS.enc.Utf8.stringify(wordArray);
    return str;
  }
}
