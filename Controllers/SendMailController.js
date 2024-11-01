const asyncHandler = require('express-async-handler');
const { doc, getDoc, updateDoc } = require('firebase/firestore');
const { db } = require('../Config/firebaseConfig.js');
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.UserId,
        pass: process.env.PassKey,
    },
});
  
  
const sendMail = async(email,code,userName,userId) => {

    console.log('====================================');
    console.log(email,userName,userId);
    console.log('====================================');

    

    const mailOptions = {
        from: '"DKA" <saitharakdev@gmail.com>', 
        to: [email],
        subject: `Forgot Password OTP ${code}`,
        text: `Authentication Code: ${code}`,
        html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Secure OTP Verification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: auto;
                            background: #ffffff;
                            border-radius: 5px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #007BFF; /* Corporate color */
                            color: #ffffff;
                            padding: 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            padding: 20px;
                            text-align: left;
                        }
                        .otp-code {
                            font-size: 24px;
                            font-weight: bold;
                            color: #333333;
                        }
                        .footer {
                            padding: 10px;
                            text-align: center;
                            font-size: 12px;
                            color: #777777;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://res.cloudinary.com/dtjknk4ra/image/upload/v1730462409/DKA_q9oemj.png" alt="Company Logo" style="max-width: 150px; height: auto;">
                            <h1>Secure OTP Verification</h1>
                        </div>
                        <div class="content">
                            <p>Dear <span>${userName}</span>,</p>
                            <p>OTP request for acoount with DKA Id <span>${userId}</span></p>
                            <p>Your OTP code is <span class="otp-code">${code}</span>.</p>
                            <p>Please enter this code to complete your verification process.</p>
                        </div>
                        <div class="footer">
                            <p>Contact No : +91 7989833031</p>
                        </div>
                    </div>
                </body>
                </html>
        `,
    };


    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.log(error);
    }
}




const VerifyMail = asyncHandler(async(req,res) => {
    const {Id} = req.body;
    const docRef = doc(db, "students", Id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const userData = docSnap.data();
        // console.log("Document data:", docSnap.data());
        
        await SendEmail(userData.email, docRef,userData.name,userData.id);

        res.json({Message:"User found and OTP sent !",Email:userData.email});
    } else {
        console.log("No such document!");
        res.json({Message:"User not found!"});
    }
});

function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000); 
    return otp.toString();
}

const SendEmail = asyncHandler(async( email, docRef,userName, userId ) =>{
    const otp = generateOTP();
    await updateDoc(docRef, {"OTP": otp });
    await sendMail(email,otp,userName,userId).catch(console.error);
});

const VerifyOTP = asyncHandler( async(req, res) => {
    const {Id, responseOTP} = req.body;
    const docRef = doc(db, "students", Id);
    const docSnap = await getDoc(docRef);

    const userData = docSnap.data();

    if(userData.OTP === responseOTP){
        res.json({Message:"OTP verified"});
    }else{
        res.json({Message:"Invalid OTP"});
    }
});

module.exports = { VerifyMail, VerifyOTP }