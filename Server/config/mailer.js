const { text } = require("express");
const nodeMailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        text
    });
};

module.exports = sendEmail;