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
  
  
const sendMail = async(email,code) => {

    const mailOptions = {
        from: '"DKA" <saitharakdev@gmail.com>', 
        to: [email],
        subject: "Forgot Password",
        text: `Authentication Code :${code}`,
        html: `<b>${code}</b>`,
    }

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
        
        await SendEmail(userData.email, docRef);

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