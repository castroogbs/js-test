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

// PUT /autores/:id - Atualiza um autor existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, bio } = req.body;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ erro: "ID inválido." });
    return;
  }
  if (!nome || !email) {
    res.status(400).json({ erro: "Nome e e-mail são obrigatórios." });
    return;
  }
  try {
    const autor = await prisma.autor.findUnique({
      where: { id: parseInt(id) },
    });
    if (!autor) {
      res.status(404).json({ erro: "Autor não encontrado." });
      return;
    }

    const autorAtualizado = await prisma.autor.update({
      where: { id: parseInt(id) },
      data: { nome, email, telefone, bio },
    });
    res.status(200).json(autorAtualizado);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar autor." });
  }
});

// PATCH /autores/:id - Atualiza parcialmente um autor existente
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const dadosAtualizacao = req.body; // aceita parcial

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ erro: "ID inválido." });
    return;
  }
  if (Object.keys(dadosAtualizacao).length === 0) {
    res
      .status(400)
      .json({ erro: "Informe pelo menos um campo para atualizar." });
    return;
  }
  try {
    const autor = await prisma.autor.findUnique({ where: { id: parseInt(id) } });
    if (!autor) {
      res.status(404).json({ erro: "Autor não encontrado." });
      return;
    }

    const autorAtualizado = await prisma.autor.update({
      where: { id: parseInt(id) },
      data: dadosAtualizacao,
    });
    res.status(200).json(autorAtualizado);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar autor." });
  }
});

// DELETE /autores/:id - Exclui um autor
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    res.status(400).json({ erro: "ID inválido." });
    return;
  }
  try {
    const autor = await prisma.autor.findUnique({ where: { id: parseInt(id) } });
    if (!autor) {
      res.status(404).json({ erro: "Autor não encontrado." });
      return;
    }

    await prisma.autor.delete({ where: { id: parseInt(id) } });
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir autor." });
  }
});

export default router;
