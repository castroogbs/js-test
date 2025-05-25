import { Router } from "express";
import prisma from "../prisma";
const router = Router();

/**
 * @openapi
 * /autores:
 *   get:
 *     summary: Lista todos os autores
 *     tags:
 *       - Autores
 *     responses:
 *       200:
 *         description: Lista de autores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Autor'
 *       500:
 *         description: Erro ao buscar autores
 */
router.get("/", async (req, res) => {
  try {
    const autores = await prisma.autor.findMany();
    res.status(200).json(autores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: "Erro ao buscar autores." });
  }
});

/**
 * @openapi
 * /autores/{id}:
 *   get:
 *     summary: Busca um autor por ID
 *     tags:
 *       - Autores
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do autor
 *     responses:
 *       200:
 *         description: Autor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Autor não encontrado
 *       500:
 *         description: Erro ao buscar autor
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    res.status(400).json({ erro: "ID inválido." });
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
    res.status(200).json(autor);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar autor." });
  }
});

/**
 * @openapi
 * /autores:
 *   post:
 *     summary: Cria novo autor
 *     tags:
 *       - Autores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AutorInput'
 *     responses:
 *       201:
 *         description: Autor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       400:
 *         description: Nome e email são obrigatórios
 *       500:
 *         description: Erro ao criar autor
 */
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

/**
 * @openapi
 * /autores/{id}:
 *   put:
 *     summary: Atualiza um autor existente
 *     tags:
 *       - Autores
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do autor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AutorInput'
 *     responses:
 *       200:
 *         description: Autor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       400:
 *         description: ID, nome ou email inválidos
 *       404:
 *         description: Autor não encontrado
 *       500:
 *         description: Erro ao atualizar autor
 */
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

/**
 * @openapi
 * /autores/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um autor
 *     tags:
 *       - Autores
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do autor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Autor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Autor'
 *       400:
 *         description: ID inválido ou dados não informados
 *       404:
 *         description: Autor não encontrado
 *       500:
 *         description: Erro ao atualizar autor
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const dadosAtualizacao = req.body;
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
    const autor = await prisma.autor.findUnique({
      where: { id: parseInt(id) },
    });
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

/**
 * @openapi
 * /autores/{id}:
 *   delete:
 *     summary: Exclui um autor
 *     tags:
 *       - Autores
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do autor
 *     responses:
 *       204:
 *         description: Autor excluído com sucesso (No Content)
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Autor não encontrado
 *       500:
 *         description: Erro ao excluir autor
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    res.status(400).json({ erro: "ID inválido." });
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
    await prisma.autor.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: "Erro ao excluir autor." });
  }
});

export default router;
