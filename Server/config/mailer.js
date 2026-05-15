const { text } = require("express");
const nodeMailer = require("nodemailer");

const sendEmail = async (to, subject, text, isHtml = false) => {
    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject
    };

    if (isHtml) {
        mailOptions.html = text;
    } else {
        mailOptions.text = text;
    }

    await transporter.sendMail(mailOptions);
};

// Send Reset OTP Email
const sendResetOtpEmail = async (to, otp) => {
    const subject = "Reset Your Password - SAS Academy";
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
                .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { font-size: 28px; font-weight: bold; color: #4F46E5; }
                .content { color: #333; line-height: 1.6; }
                .otp-box { background: #F3F4F6; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0; border-radius: 5px; }
                .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; letter-spacing: 5px; }
                .footer { font-size: 12px; color: #999; text-align: center; margin-top: 20px; }
                .warning { color: #EF4444; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🔐 SAS Academy</div>
                </div>
                
                <div class="content">
                    <p>Hello,</p>
                    
                    <p>We received a request to reset your password. Use the OTP below to proceed:</p>
                    
                    <div class="otp-box">
                        <p style="margin: 0; color: #666; font-size: 12px;">Your OTP Code:</p>
                        <div class="otp-code">${otp}</div>
                    </div>
                    
                    <p>This OTP will expire in <strong>10 minutes</strong>.</p>
                    
                    <p class="warning">⚠️ If you didn't request this, please ignore this email and your password will remain unchanged.</p>
                    
                    <p>For security reasons, never share this OTP with anyone.</p>
                </div>
                
                <div class="footer">
                    <p>&copy; 2026 SAS Academy. All rights reserved.</p>
                    <p>This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail(to, subject, html, true);
};

module.exports = sendEmail;
module.exports.sendResetOtpEmail = sendResetOtpEmail;