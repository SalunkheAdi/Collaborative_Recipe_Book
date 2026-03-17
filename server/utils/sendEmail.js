const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // For development, we'll just log the email content
    // In production, you would configure a real transporter

    console.log('----------------------------------------------------');
    console.log('EMAIL SENT (MOCK)');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log('----------------------------------------------------');

    // If you have SMTP credentials, you can use them here:
    /*
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    */
};

module.exports = sendEmail;
