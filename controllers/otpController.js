const nodemailer = require('nodemailer');
const crypto = require('crypto');
const employeeOtp = require('../models/OTP');
const generateOTP = async (req, res) => {
    const { userEmail } = req.body;
    let saveOtpObject={};
    // Generate a random OTP
     const generatedOTP= await generateUniqueOTP(userEmail);
    saveOtpObject = {
        emailAddress: userEmail,
        userOtp: generatedOTP
    };

    const savedOtp = await saveOTP(saveOtpObject);

    if (savedOtp) {
        let subject = "DFCU HRMS OTP";
        let text = `Your self onboarding code is ${generatedOTP}. Please enter this one time password to complete the self onboarding process on the DFCU HRMS portal.`;

        // Create a transporter object
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Email options
        let mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: subject,
            text: text
        };

        // Send email
        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({message:'OTP sent successfully.'});
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email. Please try again later.' });
        }
    } else {
        res.status(400).json({ error: "Error generating OTP! Please try again." });
    }
}
const generateUniqueOTP = async (userEmail) => {
    let OTP;
    let isUnique = false;

    while (!isUnique) {
        const randomComponent = Math.floor(Math.random() * 10000);
        const hashInput = `${userEmail}${randomComponent}`;
        const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
        OTP = parseInt(hash.slice(0, 10), 16) % 10000000000;

        // Ensure the OTP is a 10-digit number
        while (OTP.toString().length < 10 || OTP.toString()[0] === '0') {
            OTP = (Math.floor(Math.random() * 9000000000) + 1000000000);
        }

        // Check for uniqueness in the database
        const existingOtp = await employeeOtp.findOne({ where: { OTP } });
        isUnique = !existingOtp;
    }

    return OTP;
};

const saveOTP = async ({ emailAddress, userOtp }) => {
    try {
        const newOTP = await employeeOtp.create({ OTP:userOtp,emailAddress });

        return newOTP;
    } catch (error) {
        console.error('Error saving OTP:', error);
        return null;
    }
}
const validateOTP = async (req,res) => {
    const{userEmail, userOtp} =req.body;
    if(!userEmail || !userOtp){
        res.status(400).json({error:"Missing mandatory fields!"})
    }
    try {
        // Find the OTP record
        const OTPRecord = await employeeOtp.findOne({
            where: {
                OTP: userOtp,
                emailAddress: userEmail
            }
        });

        if (OTPRecord) {
            await OTPRecord.destroy();

            res.status(200).json({ message: 'OTP validated successfully.' });
        } else {
            res.status(400).json({ error: 'Invalid OTP or email address.' });
        }
    } catch (error) {
        console.error('Error validating and deleting OTP:', error);
        res.status(400).json( { error: 'An error occurred while validating the OTP.' });
    }
};

module.exports = { generateOTP,validateOTP };