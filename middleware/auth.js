import jwt from 'jsonwebtoken';
import { getuserdetails } from '../Controller/usercontroler.js';

const isAuth= async (req,res,next)=>{
    let token;                                                   
    if(req.header){
        try {
            token = await req.headers["x-auth-token"];
            console.log(token);
            const decode=jwt.verify(token, process.env.SecretKey);
            req.user=await getuserdetails(decode.id);
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({error:'Internl Server Error'});
        }
    }
}

export {isAuth};