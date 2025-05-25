import { Router } from "express";
import prisma from "../prisma";
import { autenticarJWT } from "../middleware/auth";
const router = Router();

// GET /editoras - Lista todas as editoras
router.get("/", async (req, res) => {
  try {
    const editoras = await prisma.editora.findMany();
    res.status(200).json(editoras);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Erro ao buscar editoras." });
  }
});

// GET /editoras/:id - Busca editora por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    res.status(400).json({ erro: "ID inválido." });
    return;
  }
  try {
    const editora = await prisma.editora.findUnique({
      where: { id: parseInt(id) },
    });
    if (!editora) {
      res.status(404).json({ erro: "Editora não encontrada." });
      return;
    }
    res.status(200).json(editora);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar editora." });
  }
});

// POST /editoras - Cria nova editora
router.post("/", autenticarJWT, async (req, res) => {
  const { nome, endereco, telefone } = req.body;
  if (!nome) {
    res.status(400).json({ erro: "Nome é obrigatório." });
    return;
  }
  try {
    const novaEditora = await prisma.editora.create({
      data: { nome, endereco, telefone },
    });
    res.status(201).json(novaEditora);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar editora." });
  }
});

export default router;
