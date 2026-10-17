# Personal Blog API

API REST de um blog pessoal com painel de administração, construída com **Express 5**, **Prisma 7** (MySQL) e validação com **Zod**.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Runtime | Node.js 24 (ESM) |
| HTTP | Express 5 |
| ORM | Prisma 7 + `@prisma/adapter-mariadb` |
| Base de dados | MySQL 8 |
| Validação | Zod 4 |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Linguagem | TypeScript (NodeNext) |

## Pré-requisitos

- Node.js ≥ 20
- MySQL 8 a correr localmente (ou remoto)

## Setup

```bash
npm install
cp .env.example .env   # preencher as variáveis
npx prisma migrate dev # cria as tabelas
npm run dev            # http://localhost:3000
```

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `PORT` | Porta do servidor (default `3000`) |
| `NODE_ENV` | `development` / `production` |
| `DATABASE_URL` | `mysql://user:password@localhost:3306/personal_blog` |
| `JWT_TOKEN` | Segredo usado para assinar os tokens JWT |

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Serve de desenvolvimento com hot-reload |
| `npm run build` | Gera o cliente Prisma e compila para `dist/` |
| `npm start` | Corre a versão compilada (`dist/server.js`) |

## Estrutura

```
src/
├── server.ts               # bootstrap do Express
├── routes/                 # agregação das rotas em /api
├── middlewares/            # auth (JWT), validação (Zod), erros
├── shared/                 # cliente Prisma, erros, utilidades
└── modules/
    ├── auth/               # registo/login de admin + JWT
    ├── posts/              # publicações (CRUD + publicação)
    ├── categories/         # categorias
    ├── tags/               # tags
    └── profile/            # perfil público (registo único)
```

Cada módulo segue a mesma estrutura interna: `dtos/` (schemas Zod), `services/` (regras de negócio + Prisma), `controllers/` (HTTP), `routes/` (definição das rotas).

## Notas

- O cliente Prisma é gerado para `src/generated/` (não é commitado); `npm run dev` e `npm run build` cuidam disso automaticamente.
- Todas as queries passam pela ORM Prisma — não há SQL escrito à mão.
- A documentação detalhada dos endpoints (rotas, bodies, exemplos) vive fora deste README.
