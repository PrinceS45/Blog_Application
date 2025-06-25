import { Schema , model } from "mongoose";
import {createHmac , randomBytes } from 'crypto';
import { createToken } from "../service/authentication.js";

const userSchema = new Schema ({
 fullname : {
    type : String , 
    required : true , 

 } ,
 email : {
     type : String ,
     required : true ,
     unique : true ,
 } , 
 salt : {
    type : String , 
   // required : true ,
 } , 
 password : {
     type : String ,
     required : true ,
 } ,
 profileImageURL : {
    type : String ,
    default : '/profillleeeeee.jpg' ,
 } , 
 role : {
    type : String , 
    enum : ["USER" , "ADMIN"] , 
    default : "USER" ,
 }

} , {timestamps : true} ) ; 


userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next(); // ← VERY important

  const salt = randomBytes(16).toString('hex'); // use 'hex' for readable output
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next(); // ← MUST call next()
});

userSchema.statics.matchPasswordAndGenerateToken =  async function (email , password) {
    const user = await this.findOne({email}) ; 
    if(!user) {
         throw new Error("User not model found") ; 
    }
    const salt = user.salt ; 
    const hashedPassword = user.password ; 

    const givenHashedPassword = createHmac("sha256" , salt)
    .update(password)
    .digest("hex");

    if(hashedPassword !== givenHashedPassword) {
     
        throw new Error("Invalid password");
    }
    
    const token = createToken(user) ; 
    return token ; 
     
}

const User = model ('User' , userSchema) ; 

export default User ;
