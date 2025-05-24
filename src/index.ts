import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import autoresRouter from "./routes/autores";


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
// Primeira rota de teste:
app.get("/", (req: Request, res: Response) => {
  res.json({ mensagem: "Bem-vindo à API da Livraria!" });
});
app.use("/autores", autoresRouter);


app.listen(PORT, () => {
  console.log(`Servidor rodando na portas ${PORT}`);
});
