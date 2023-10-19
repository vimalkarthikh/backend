import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export function getUserMail( request){
    return User.findOne({email:request.body.email,});
}

export function getuserdetails(id){
    return User.findById(id).select('_id name email')
}

export function generateToken(id){
    return jwt.sign({id},process.env.SecretKey)
}