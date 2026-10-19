<div align="center">

# Personal Blog API

**API REST de um blog pessoal com painel de administração**

[![TypeScript](https://img.shields.io/badge/TypeScript-NodeNext-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Zod](https://img.shields.io/badge/Zod-4-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

</div>

---

## Destaques

- **Autenticação JWT** — registo e login de admin, rotas protegidas por middleware
- **Validação com Zod** — schemas partilhados entre DTOs e middlewares, mensagens em português
- **Arquitetura modular** — cada domínio (`posts`, `auth`, `categories`, `tags`, `profile`) auto-contido
- **Prisma ORM** — tipagem forte em todas as queries, migrations versionadas, zero SQL à mão
- **Erros centralizados** — handlers globais de erro e 404 com respostas consistentes

## Stack

| Camada | Tecnologia |
| --- | --- |
| Runtime | Node.js ≥ 20 (ESM) |
| HTTP | Express 5 |
| ORM | Prisma 7 + `@prisma/adapter-mariadb` |
| Base de dados | MySQL 8 |
| Validação | Zod 4 |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Linguagem | TypeScript (NodeNext) |

## Quick Start

```bash
git clone git@github.com:MarioEstima/personal-blog-api.git
cd personal-blog-api

npm install
cp .env.example .env   # preencher as variáveis
npx prisma migrate dev # cria as tabelas
npm run dev            # http://localhost:3000
```

<details>
<summary><b>Pré-requisitos</b></summary>

- Node.js ≥ 20
- MySQL 8 a correr localmente (ou remoto)

</details>

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `PORT` | Porta do servidor (default `3000`) |
| `NODE_ENV` | `development` / `production` |
| `DATABASE_URL` | `mysql://user:password@localhost:3306/personal_blog` |
| `JWT_TOKEN` | Segredo usado para assinar os tokens JWT |

## Endpoints

Todas as rotas ficam sob `/api`. Rotas marcadas com (auth) exigem header `Authorization: Bearer <token>`.

### Auth

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/auth/register` | Regista o admin (primeiro utilizador) |
| POST | `/api/auth/login` | Autentica e devolve um JWT |
| GET | `/api/auth/me` | (auth) Dados do admin autenticado |

### Posts

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/posts` | Lista posts publicados (paginação e filtros) |
| GET | `/api/posts/:slug` | Detalhe de um post pelo slug |
| GET | `/api/posts/admin` | (auth) Lista todos os posts (rascunhos incluídos) |
| GET | `/api/posts/admin/:id` | (auth) Detalhe de qualquer post |
| POST | `/api/posts` | (auth) Cria um post |
| PUT | `/api/posts/:id` | (auth) Atualiza um post |
| DELETE | `/api/posts/:id` | (auth) Remove um post |

### Categories e Tags

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/categories` · `/api/tags` | Lista |
| GET | `/api/categories/:id` · `/api/tags/:id` | Detalhe |
| POST | `/api/categories` · `/api/tags` | (auth) Cria |
| PUT | `/api/categories/:id` · `/api/tags/:id` | (auth) Atualiza |
| DELETE | `/api/categories/:id` · `/api/tags/:id` | (auth) Remove |

### Profile e Health

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/profile` | Perfil público (registo único) |
| PUT | `/api/profile` | (auth) Atualiza o perfil |
| GET | `/health` | Health check (estado da base de dados) |

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

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Serve de desenvolvimento com hot-reload |
| `npm run build` | Gera o cliente Prisma e compila para `dist/` |
| `npm start` | Corre a versão compilada (`dist/server.js`) |

## Notas

- O cliente Prisma é gerado para `src/generated/` (não é commitado); `npm run dev` e `npm run build` cuidam disso automaticamente.
- Todas as queries passam pela ORM Prisma — não há SQL escrito à mão.

---

<div align="center">
<sub>Feito por Mario Estima</sub>
</div>
