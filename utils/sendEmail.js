const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", // Cambia según tu proveedor de email
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Tesipedia" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("📩 Correo enviado:", info.messageId);
    } catch (error) {
        console.error("❌ Error al enviar el correo:", error);
        throw new Error("No se pudo enviar el correo.");
    }
};

module.exports = sendEmail;