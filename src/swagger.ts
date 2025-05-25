import swaggerJsdoc from "swagger-jsdoc";

export const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Livraria",
      version: "1.0.0",
      description:
        "Documentação da API da Livraria feita em Node.js + TypeScript",
    },
    components: {
      schemas: {
        Autor: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            nome: {
              type: "string",
              example: "João da Silva",
            },
            email: {
              type: "string",
              example: "joao@email.com",
            },
            telefone: {
              type: "string",
              nullable: true,
              example: "31990000000",
            },
            bio: {
              type: "string",
              nullable: true,
              example: "Autor mineiro de livros técnicos.",
            },
          },
        },
        AutorInput: {
          type: "object",
          properties: {
            nome: { type: "string", example: "João da Silva" },
            email: { type: "string", example: "joao@email.com" },
            telefone: {
              type: "string",
              nullable: true,
              example: "31990000000",
            },
            bio: {
              type: "string",
              nullable: true,
              example: "Autor mineiro de livros técnicos.",
            },
          },
          required: ["nome", "email"],
        },
      },
    },
    servers: [
  {
    url: process.env.NODE_ENV === 'production' ? process.env.PUBLIC_API_URL : 'http://localhost:3333'
  }
],
  },
  apis: ["./src/routes/*.ts"], // onde estão seus comentários JSDoc
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
