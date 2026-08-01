import crypto from "crypto" 
import jwt from "jsonwebtoken" // jsonWebToken

// genearte Access Token
const generateAccessToken = (id,role)=>{
   
   return jwt.sign(payload , process.env.JWT_ACCESS_SECRET , {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
   });
};

// Verify Access Token 
const verifyAccessToken = (token)=>{
   return jwt.verify(token,process.env.JWT_ACCESS_SECRET);
};

//generate Refresh Token
const generateRefreshToken = (id,role)=>{
   return jwt.sign(payload, process.env.JWT_REFRESH_SECRET , {
      expiresIn: process.env.JWT_REFRESH_EXPIRES||'7d'
   });
};

// verify Refresh Token 
const verifyRefreshToken = (token)=>{
   return jwt.verify(token , process.env.JWT_REFRESH_SECRET)
};

const generateResetTokens = ()=>{
   const rawToken = crypto.randomBytes(32).toString("hex");

   const hashedToken = crypto
   .createHash("sha256")
   .update(rawToken)
   .digest("hex")

   return {rawToken , hashedToken}
}

// verify resetToken
// const verifyResetToken = (token)=>{
//    return jwt.verify(token,process.env.JWT_RESET_EXPIRES)
// }

export {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateResetTokens
}