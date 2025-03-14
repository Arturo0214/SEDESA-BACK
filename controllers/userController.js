const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const crypto = require('crypto');
const sendEmail = require("../utils/sendEmail")

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
        res.status(400);
        throw new Error("El correo electrónico es obligatorio y debe ser un texto válido.");
    }

    const user = await User.findOne({ email: email.trim() });

    if (!user) {
        res.status(404);
        throw new Error("No se encontró una cuenta con este correo.");
    }

    // Generar un token seguro
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Guardar el token en la base de datos con una expiración de 1 hora
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    // **Aquí cambiamos la URL para que apunte al FRONTEND**
    const resetUrl = `${process.env.CLIENT_URL}reset-password/${resetToken}`;

    console.log("🔗 Enlace de restablecimiento generado:", resetUrl); // Verifica en la consola

    // **Nuevo diseño del correo en HTML**
    const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2575fc; text-align: center;">🔒 Restablecimiento de Contraseña</h2>
            <p style="font-size: 16px;">Hola <strong>${user.name}</strong>,</p>
            <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer tu contraseña.</p>
            <p style="font-size: 16px;">Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #2575fc; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
                   Restablecer Contraseña
                </a>
            </div>
            <p style="font-size: 14px; color: #666;">Si no solicitaste este cambio, ignora este mensaje.</p>
            <p style="font-size: 14px; color: #666;">Este enlace expirará en 1 hora.</p>
            <hr>
            <p style="font-size: 12px; text-align: center; color: #888;">© 2025 Mi Aplicación | Todos los derechos reservados</p>
        </div>
    `;

    await sendEmail(user.email, "🔒 Restablecimiento de Contraseña", message);

    res.status(200).json({ message: "Se ha enviado un enlace de restablecimiento a tu correo." });
});

const resetPassword = asyncHandler(async (req, res) => {
    console.log("🔹 Solicitud recibida en /users/reset-password/:token"); // Depuración

    const { token } = req.params;
    const { password } = req.body;

    console.log("🔹 Token recibido:", token);
    console.log("🔹 Nueva contraseña:", password);

    if (!token || !password) {
        res.status(400).json({ message: "Token y nueva contraseña requeridos." });
        return;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        res.status(400).json({ message: "El token no es válido o ha expirado." });
        return;
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada correctamente." });
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Favor de verificar que estén todos los datos');
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user.id)
        });
    } else {
        res.status(400);
        throw new Error('Credenciales incorrectas');
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Favor de verificar que estén todos los datos");
    }

    const userExiste = await User.findOne({ email });

    if (userExiste) {
        res.status(400);
        throw new Error("Este email ya fue registrado, el usuario ya existe");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        // **Enviar correo de bienvenida**
        const message = `
            <h2>¡Bienvenido a la plataforma, ${name}!</h2>
            <p>Tu cuenta ha sido creada exitosamente.</p>
            <p>Puedes iniciar sesión cuando quieras.</p>
            <br>
            <p>Saludos,</p>
            <p>El equipo de soporte</p>
        `;

        await sendEmail(user.email, "Registro Exitoso", message);

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            message: "Usuario registrado y correo de bienvenida enviado.",
        });
    } else {
        res.status(400);
        throw new Error("No se pudo crear el usuario, datos incorrectos");
    }
});

const getMisDatos = asyncHandler(async (req, res) => {
    res.json(req.user);
});

const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!req.user.isAdmin) {
        res.status(403);
        throw new Error("Solo el administrador puede realizar esta acción");
    }

    res.json(user);
});

const getAllUsers = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user.isAdmin) {
        res.status(403);
        throw new Error('No tienes permiso para realizar esta acción');
    }

    const users = await User.find({});

    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404);
        throw new Error('No se encontraron usuarios');
    }
});

module.exports = {
    loginUser,
    registerUser,
    getMisDatos,
    getAllUsers,
    getUserById,
    requestPasswordReset, 
    resetPassword
};