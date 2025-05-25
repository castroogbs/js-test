import { Router, Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    res.status(400).json({ erro: "Todos os campos são obrigatórios." });
    return;
  }
  const jaCadastrado = await prisma.usuario.findUnique({ where: { email } });
  if (jaCadastrado) {
    res.status(409).json({ erro: "Email já cadastrado." });
    return;
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: senhaHash },
  });
  res
    .status(201)
    .json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    res.status(400).json({ erro: "E-mail e senha obrigatórios." });
    return;
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
    res.status(401).json({ erro: "E-mail ou senha inválidos." });
    return;
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET ?? "segredo-pouco-seguro",
    { expiresIn: "2h" }
  );
  res.status(200).json({ token });
});

export default router;
