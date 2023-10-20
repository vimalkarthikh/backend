import { User } from "../models/user.js"
import { createTransport } from "nodemailer"
import crypto from "crypto"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from 'jsonwebtoken';
dotenv.config()

function generateToken(id){
  return jwt.sign({id},process.env.SecretKey,{expiresIn: 60*60})
}

// Route to handle "forgot password" request
const forgotPassword = async (req, res) => {
    const { email } = req.body; 
    
    // Check if email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //crypto.randomBytes(20).toString('hex');
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');                                                                                                        
    user.resetToken = resetToken;
    await user.save();
    
    //Send email with reset token  
     const resetUrl = `https://pswreset.netlify.app/rp/reset/${resetToken}`;
    var transporter = createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    var mailOptions = {
        from: 'vimalkarthik315@gmail.com',
        to: email,
        subject: "Reset Password",
        html:`<h1>Reset Password</h1><h1>This Link expires in 2 hours</h1><h2>Click on the link to reset your password</h2><h3>${resetUrl}</h3>`
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    });
    
    res.status(200).json({ message: 'A link to reset your password have been sent to your email.' });
  };
  
//  Route to handle password reset request
const resetPassword = async (req, res) => {
    const { password } = req.body;
   // const { token } = req.params.resetToken;
    //const  { token }  = req.params;
    // Verify reset token
    //console.log("token: ", token);
    const user = await User.findOne({ token: req.params.resetToken });
    if (!user) {
      return res.status(400).json({ message: 'Invalid token 1' });
    }
    
    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful' });
  };
 export {forgotPassword, resetPassword}
  
