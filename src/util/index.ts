import CryptoJS from "crypto-js"
/**
 * @description 加密方法
 * @param data  需要加密的数据
 * @returns {string} //唯一的hash字符串
 */
export function encrypt(data: any): string {
  if (typeof data === "object") {
    try {
      data = JSON.stringify(data)
    } catch (error) {
      console.log("encrypt error:", error)
    }
  }
  const dataHex = CryptoJS.enc.Utf8.parse(data)
  const encrypted = CryptoJS.AES.encrypt(
    dataHex,
    CryptoJS.enc.Utf8.parse("2120131404240929"),
    {
      iv: CryptoJS.enc.Utf8.parse("2120131404240929"),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  )
  return encrypted.ciphertext.toString()
}
/**
 * 解密方法
 * @param data
 * @returns {string}
 */
export function decrypt(data: any): string {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(
    str,
    CryptoJS.enc.Utf8.parse("2120131404240929"),
    {
      iv: CryptoJS.enc.Utf8.parse("2120131404240929"),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  )
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time))
