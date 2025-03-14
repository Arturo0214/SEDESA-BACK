const sendEmail = require("./utils/sendEmail");

sendEmail("osvaldosuarezcruz@gmail.com", "Prueba de Nodemailer con Gmail", "Este es un correo de prueba enviado desde Nodemailer con Gmail.")
  .then(() => console.log("Correo enviado con éxito"))
  .catch((error) => console.error("Error al enviar el correo:", error));
