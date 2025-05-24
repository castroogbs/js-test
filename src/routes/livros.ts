import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// GET /livros - Lista todos os livros (incluindo autor, categoria e editora)
router.get("/", async (req, res) => {
  try {
    const livros = await prisma.livro.findMany({
      include: { autor: true, categoria: true, editora: true }
    });
    res.status(200).json(livros);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar livros." });
  }
});

// POST /livros - Cadastra um novo livro
router.post("/", async (req, res) => {
  const { titulo, resumo, ano, paginas, isbn, autor_id, categoria_id, editora_id } = req.body;

  if (!titulo || !ano || !isbn || !autor_id || !categoria_id || !editora_id) {
    res.status(400).json({ erro: "Todos os campos obrigatórios devem ser preenchidos." });
    return; // Apenas para interromper o fluxo
  }

  try {
    const novoLivro = await prisma.livro.create({
      data: {
        titulo,
        resumo,
        ano,
        paginas,
        isbn,
        autor_id: parseInt(autor_id),
        categoria_id: parseInt(categoria_id),
        editora_id: parseInt(editora_id)
      }
    });
    res.status(201).json(novoLivro);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar livro." });
  }
});

export default router;
