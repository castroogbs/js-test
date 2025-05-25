import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import autoresRouter from "./routes/autores";
import livrosRouter from "./routes/livros";
import editorasRouter from "./routes/editoras";
import categoriasRouter from "./routes/categorias";
import authRouter from "./routes/auth";


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use("/autores", autoresRouter);
app.use("/livros", livrosRouter);
app.use("/editoras", editorasRouter);
app.use("/categorias", categoriasRouter);
app.use("/auth", authRouter);


// Primeira rota de teste:
app.get("/", (req: Request, res: Response) => {
  res.json({ mensagem: "Bem-vindo à API da Livraria!" });
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na portas ${PORT}`);
});
