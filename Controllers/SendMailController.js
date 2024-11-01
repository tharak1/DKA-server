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
  
  
const sendMail = async(email,name,Id,code) => {

    // const mailOptions = {
    //     from: '"DKA" <saitharakdev@gmail.com>', 
    //     to: [email],
    //     subject: "Forgot Password",
    //     text: `Authentication Code: ${code}`,
    //     html: `
    //         <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
    //             <div style="margin: 50px auto; width: 100%; padding: 20px 0;">
    //                 <div style="border-bottom: 1px solid #eee;">
    //                     <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">DKA</a>
    //                 </div>
    //                 <p style="font-size: 1.1em;">Hi,</p>
    //                 <p>Use the following OTP to complete your Sign Up procedures:</p>
    //                 <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">${code}</h2>
    //                 <p style="font-size: 0.9em;">Regards,<br />DKA</p>
    //                 <hr style="border: none; border-top: 1px solid #eee;" />
    //                 <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
    //                     <p>DKA</p>
    //                 </div>
    //             </div>
    //         </div>
    //     `,
    // };
    

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
                            <img src="https://firebasestorage.googleapis.com/v0/b/divya-kala-academy.appspot.com/o/assets%2FDKA.png?alt=media&token=0d4e2e7f-548c-4904-901c-fa93a158c46e" alt="Company Logo" style="max-width: 150px; height: auto;">
                            <h1>Secure OTP Verification</h1>
                        </div>
                        <div class="content">
                            <p>Dear ${name},</p>
                            <p>OTP request for acoount with DKA Id : ${Id}</p>
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
        console.log("Document data:", docSnap.data());
        
        await SendEmail(userData.email,userData.name,userData.id, docRef);

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

const SendEmail = asyncHandler(async( email, docRef ) =>{
    const otp = generateOTP();
    await updateDoc(docRef, {"OTP": otp });
    await sendMail(email,otp).catch(console.error);
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