const bcrypt = require('bcrypt');
const OtpVerification = require('../Model/otpVerify');
const Admin = require('../Model/AdminModel');
const nodemailer = require('nodemailer');

// let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     auth: {
//         // user: process.env.AUTH_EMAIL,
//         // pass: process.env.AUTH_PASS
//         user:"adilep916@gmail.com",
//         pass:"9061634916"
//     }
// })


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "Gmail",
    
    auth: {
        
        user: `adilep7165@gmail.com`,
        pass: `clmdzuatjaueqdcg`
        
        
        
    },
})

 const sendOTPVerificationEmail = async (req, res) => {
    const email = req.body.email;
const superAdmin= "adilep7165@gmail.com"
if(email===superAdmin) {

    console.log(email,"email in otp");
    const exist_otp = await OtpVerification.findOne({ email });
    console.log("popopoo",exist_otp);
    if (exist_otp) {
        console.log("exist otp");
        await OtpVerification.deleteMany({ email });
    }
    // const exist_email = await Admin.findOne({ email: email });
    // if (exist_email) {
    //     res.json({ status: 'existedEmail' });
    // } else {
        try {
            console.log("otp seded email");
            const otp = `${Math.floor(1000 + Math.random() * 9000)}`
            console.log("otppppp==>",otp);
            const mailOptions = {
                // from: process.env.AUTH_EMAIL,
                from:"adilep916@gmail.com",
                to: email,
                subject: "Verify your email",
                html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the sign up </p><p> This code <b> Expires in 10 Minutes</b>.</p>`
            }
            const hashedOTP = await bcrypt.hash(otp, 10);
            console.log(hashedOTP,"hashedOTP");
            
            const createdAt = Date.now();
            const expiresAt = Date.now() + 600000;

            const newOTPVerification = new OtpVerification({
                email: email,
                otp: hashedOTP,
                createdAt: createdAt,
                expiresAt:expiresAt
            })
            console.log(createdAt,expiresAt);
            await newOTPVerification.save()
            await transporter.sendMail(mailOptions)
            console.log(newOTPVerification,"newOTPVerification");
            res.json({ status: "sended" });
        }
        catch (err) {
            res.json({
                status: "failed",
                message: err.message,
            })
        }
    // }
}else{
    console.log("error");

}

}



 const otpVerify = async (req, res) => {
    const email = req.body.email;
    console.log("req.body.email in otp verify",email);
    const otp = req.body.otp.trim();
    console.log(otp,"verfyyyotp");
    const hashedOTP = await bcrypt.hash(otp, 10);

    const admin = await OtpVerification.findOne({ email:email });
    console.log(admin,"admin");
    if (admin) {
        console.log(admin.otp,"admin otp");
        console.log(otp,"ist otp kk");
        const validOtp = await bcrypt.compare(otp, admin.otp);
        console.log(validOtp,"validtotp");
        if (validOtp) {
            await OtpVerification.deleteMany({ email })
            res.json({ status: "success" });
        }
        else {
            res.json({ status: 'fail' });
        }
    }
    else {
        res.json({ status: 'failed'});
}
}

module.exports={otpVerify,sendOTPVerificationEmail}