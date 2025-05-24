import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// GET /autores - Lista todos os autores
router.get("/", async (req, res) => {
  try {
    const autores = await prisma.autor.findMany();

    res.status(200).json(autores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Erro ao buscar autores." });
  }
});

// GET /autores/:id - Busca um autor por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ erro: "ID inválido." });
    return; // Apenas interrompe o fluxo em caso de erro
  }

  try {
    const autor = await prisma.autor.findUnique({
      where: { id: parseInt(id) },
    });

    if (!autor) {
      res.status(404).json({ erro: "Autor não encontrado." });
      return;
    }

    res.status(200).json(autor);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar autor." });
  }
});

// POST /autores - Cria novo autor
router.post("/", async (req, res) => {
  const { nome, email, telefone, bio } = req.body;

  if (!nome || !email) {
    res.status(400).json({ erro: "Nome e email são obrigatórios." });
    return;
  }

  try {
    const novoAutor = await prisma.autor.create({
      data: { nome, email, telefone, bio },
    });
    res.status(201).json(novoAutor);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar autor." });
  }
});

export default router;
