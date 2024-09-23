// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let users = []; // Array temporal para almacenar usuarios

// Registro de usuario
const register = (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { username, email, password: hashedPassword };

    users.push(newUser);
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
};

// Inicio de sesión
const login = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso', token });
};

// Cierre de sesión (solo invalida en cliente)
const logout = (req, res) => {
    res.json({ message: 'Cierre de sesión exitoso' });
};

module.exports = { register, login, logout };
