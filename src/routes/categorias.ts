import { Router } from "express";
import prisma from "../prisma";
const router = Router();

// GET /categorias - Lista todas as categorias
router.get("/", async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany();
    res.status(200).json(categorias);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Erro ao buscar categorias." });
  }
});

// GET /categorias/:id - Busca categoria por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    res.status(400).json({ erro: "ID inválido." });
    return;
  }
  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
    });
    if (!categoria) {
      res.status(404).json({ erro: "Categoria não encontrada." });
      return;
    }
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar categoria." });
  }
});

// POST /categorias - Cria nova categoria
router.post("/", async (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    res.status(400).json({ erro: "Nome é obrigatório." });
    return;
  }
  try {
    const novaCategoria = await prisma.categoria.create({
      data: { nome },
    });
    res.status(201).json(novaCategoria);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar categoria." });
  }
});

export default router;
