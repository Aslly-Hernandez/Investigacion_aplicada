import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const usuarios = [{
  user: "admin",
  email: "admin@admin.com",
  password: "$2a$05$GxYp39QXPKk/y078OPWVaubQQqyEpNu4DwdtbpXc2XIFBzuR5BnUe"
  // 12345
}]

async function login(req, res) {
  const user = req.body.user.trim();
  const password = req.body.password.trim();
  if (!user || !password) {
    // console.log("* ERROR: Uno o varios campos estan vacios");
    return res.status(400).send({ status: "Error", message: "Uno o varios campos estan vacios" });
  }
  const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
  if (!usuarioARevisar) {
    // console.log("* ERROR: Este usuario ya se encuentra registrado");
    return res.status(400).send({ status: "Error", message: "El usuario no existe" });
  }
  const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.password);
  if (!loginCorrecto) {
    // console.log("* ERROR: Este usuario ya se encuentra registrado");
    return res.status(400).send({ status: "Error", message: "Contrasena incorrecta" });
  }
  const token = jsonwebtoken.sign(
    { user: usuarioARevisar.user }
    , process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION });

  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES ** 24 * 60 * 60 * 1000),
    path: "/"
  }

  res.cookie("jwt", token, cookieOption);
  res.send({ status: "ok", message: "Usuario logeado", redirect: "/admin" })

}

async function register(req, res) {
  // console.log(req.body);
  const user = req.body.user.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  // console.log(" -Usuario: " + user + "\n -Email: " + email + "\n -Passw: " + password);
  if (!user || !password || !email) {
    // console.log("* ERROR: Uno o varios campos estan vacios");
    return res.status(400).send({ status: "Error", message: "Uno o varios campos estan vacios" });
  }
  const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
  if (usuarioARevisar) {
    // console.log("* ERROR: Este usuario ya se encuentra registrado");
    return res.status(400).send({ status: "Error", message: "Este usuario ya se encuentra registrado" });
  }
  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password, salt);
  const nuevoUsuario = {
    user, email, password: hashPassword
  }
  usuarios.push(nuevoUsuario);
  // console.log(nuevoUsuario);
  // console.log(usuarios);
  return res.status(201).send({ status: "ok", message: "Usuario agregado exitosamente", redirect: "/" });

}

export const methods = {
  login,
  register
}
