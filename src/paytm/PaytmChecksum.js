"use strict";

import crypto from 'crypto'

class PaytmChecksum {

	static encrypt(input, key) {
		var cipher = crypto.createCipheriv('AES-128-CBC', key, PaytmChecksum.iv);
		var encrypted = cipher.update(input, 'binary', 'base64');
		encrypted += cipher.final('base64');
		return encrypted;
	}
	static decrypt(encrypted, key) {
		var decipher = crypto.createDecipheriv('AES-128-CBC', key, PaytmChecksum.iv);
		var decrypted = decipher.update(encrypted, 'base64', 'binary');
		try {
			decrypted += decipher.final('binary');
		}
		catch (e) {
			console.log(e);
		}
		return decrypted;
	}
	static generateSignature(params, key) {
		if (typeof params !== "object" && typeof params !== "string") {
			var error = "string or object expected, " + (typeof params) + " given.";
			return Promise.reject(error);
		}
		if (typeof params !== "string"){
			params = PaytmChecksum.getStringByParams(params);
		}
		return PaytmChecksum.generateSignatureByString(params, key);
	}
	

	static verifySignature(params, key, checksum) {
		if (typeof params !== "object" && typeof params !== "string") {
		   	var error = "string or object expected, " + (typeof params) + " given.";
			return Promise.reject(error);
		}
		if(params.hasOwnProperty("CHECKSUMHASH")){
			delete params.CHECKSUMHASH
		}
		if (typeof params !== "string"){
			params = PaytmChecksum.getStringByParams(params);
		}
		return PaytmChecksum.verifySignatureByString(params, key, checksum);
	}

	static async generateSignatureByString(params, key) {
		var salt = await PaytmChecksum.generateRandomString(4);
		return PaytmChecksum.calculateChecksum(params, key, salt);
	}

	static verifySignatureByString(params, key, checksum) {		
		var paytm_hash = PaytmChecksum.decrypt(checksum, key);
		var salt = paytm_hash.substr(paytm_hash.length - 4);
		return (paytm_hash === PaytmChecksum.calculateHash(params, salt));
	}

	static generateRandomString(length) {
		return new Promise(function (resolve, reject) {
			crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
				if (!err) {
					var salt = buf.toString("base64");
					resolve(salt);					
				}
				else {
					console.log("error occurred in generateRandomString: " + err);
					reject(err);
				}
			});
		});
	}

	static getStringByParams(params) {
		var data = {};
		Object.keys(params).sort().forEach(function(key,value) {
			data[key] = (params[key] !== null && params[key].toLowerCase() !== "null") ? params[key] : "";
		});
		return Object.values(data).join('|');
	}

	static calculateHash(params, salt) {		
		var finalString = params + "|" + salt;
		return crypto.createHash('sha256').update(finalString).digest('hex') + salt;
	}
	static calculateChecksum(params, key, salt) {		
		var hashString = PaytmChecksum.calculateHash(params, salt);
		return PaytmChecksum.encrypt(hashString,key);
	}
}
PaytmChecksum.iv = '@@@@&&&&####$$$$';
export default PaytmChecksum;






















// "use strict";
// import crypto from "crypto";

// class PaytmChecksum {
//   static encrypt(input, key) {
//     const cipher = crypto.createCipheriv(
//       "aes-128-cbc",
//       Buffer.from(key, "utf-8"),
//       Buffer.from(PaytmChecksum.iv, "utf-8")
//     );
//     let encrypted = cipher.update(input, "utf-8", "base64");
//     encrypted += cipher.final("base64");
//     return encrypted;
//   }

//   static decrypt(encrypted, key) {
//     const decipher = crypto.createDecipheriv(
//       "aes-128-cbc",
//       Buffer.from(key, "utf-8"),
//       Buffer.from(PaytmChecksum.iv, "utf-8")
//     );
//     let decrypted = decipher.update(encrypted, "base64", "utf-8");
//     try {
//       decrypted += decipher.final("utf-8");
//     } catch (e) {
//       console.error("Error during decryption:", e);
//     }
//     return decrypted;
//   }

//   static generateSignature(params, key) {
//     if (typeof params !== "object" && typeof params !== "string") {
//       const error = "string or object expected, " + typeof params + " given.";
//       return Promise.reject(error);
//     }
//     if (typeof params !== "string") {
//       params = PaytmChecksum.getStringByParams(params);
//     }
//     return PaytmChecksum.generateSignatureByString(params, key);
//   }

//   static verifySignature(params, key, checksum) {
//     if (typeof params !== "object" && typeof params !== "string") {
//       const error = "string or object expected, " + typeof params + " given.";
//       return Promise.reject(error);
//     }
//     if (params.hasOwnProperty("CHECKSUMHASH")) {
//       delete params.CHECKSUMHASH;
//     }
//     if (typeof params !== "string") {
//       params = PaytmChecksum.getStringByParams(params);
//     }
//     return PaytmChecksum.verifySignatureByString(params, key, checksum);
//   }

//   static async generateSignatureByString(params, key) {
//     const salt = await PaytmChecksum.generateRandomString(4);
//     return PaytmChecksum.calculateChecksum(params, key, salt);
//   }

//   static verifySignatureByString(params, key, checksum) {
//     const paytm_hash = PaytmChecksum.decrypt(checksum, key);
//     const salt = paytm_hash.substr(paytm_hash.length - 4);
//     return paytm_hash === PaytmChecksum.calculateHash(params, salt);
//   }

//   static generateRandomString(length) {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(Math.ceil((length * 3) / 4), (err, buf) => {
//         if (err) {
//           console.error("Error occurred in generateRandomString:", err);
//           reject(err);
//         } else {
//           const salt = buf.toString("base64").slice(0, length);
//           resolve(salt);
//         }
//       });
//     });
//   }

//   static getStringByParams(params) {
//     const data = {};
//     Object.keys(params)
//       .sort()
//       .forEach((key) => {
//         data[key] =
//           params[key] !== null &&
//           params[key].toString().toLowerCase() !== "null"
//             ? params[key]
//             : "";
//       });
//     return Object.values(data).join("|");
//   }

//   static calculateHash(params, salt) {
//     const finalString = params + "|" + salt;
//     return crypto.createHash("sha256").update(finalString).digest("hex") + salt;
//   }

//   static calculateChecksum(params, key, salt) {
//     const hashString = PaytmChecksum.calculateHash(params, salt);
//     return PaytmChecksum.encrypt(hashString, key);
//   }
// }

// PaytmChecksum.iv = "@@@@&&&&####$$$$";

// export default PaytmChecksum;

