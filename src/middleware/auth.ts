import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export function autenticarJWT(req: Request, res: Response, next: NextFunction) {
const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ erro: "Token não fornecido." });
    return;
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "segredo-pouco-seguro");
    (req as any).usuario = payload; // Tipagem simplificada
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido ou expirado." });
    return;
  }
}
