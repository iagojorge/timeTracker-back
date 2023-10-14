# TimeTracker Back-End

O TimeTracker Back-End é a parte do servidor da aplicação TimeTracker, responsável por gerenciar a autenticação, projetos e fornecer dados para a página de dashboard.

## Descrição

O TimeTracker Back-End é desenvolvido usando Node.js e Express, oferecendo uma API segura para a aplicação TimeTracker. Ele se integra com um banco de dados MongoDB/Mongoose para armazenar dados de projetos e usuários, autentica usuários e fornece funcionalidades de gerenciamento de projetos.

## Recursos Principais

- Autenticação de Usuários (Registro e Login).
- Gerenciamento de Projetos (Adição, Listagem, Edição e Exclusão).
- Fornecimento de dados para a página de Dashboard.

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB/Mongoose
- JSON Web Tokens (JWT)

## Instalação

Siga as etapas abaixo para configurar o projeto:

1. Clone o repositório: `git clone https://seu-repositorio.git`
2. Instale as dependências: `npm install`

## Uso

Para iniciar o servidor, utilize o seguinte comando: `npm start serve`

O servidor estará disponível em [http://localhost:3000].

## Rotas da API

- Rota Pública:
  - `GET /`: Mensagem de boas-vindas.

- Rota Privada:
  - `GET /user/:id`: Acesso aos dados do usuário autenticado.

- Autenticação:
  - `POST /auth/register`: Registro de usuários.
  - `POST /auth/login`: Login de usuários.

- Gerenciamento de Projetos:
  - `POST /projetos`: Adição de novos projetos.
  - `GET /projetos/list`: Listagem de projetos.
  - `DELETE /projetos/:id`: Exclusão de projetos.
  - `PUT /projetos/:id`: Atualização de projetos.

- Dashboard:
  - `GET /dashboard/list`: Dados para a página de dashboard.

## Benefícios

- Facilita a autenticação de usuários.
- Gerencia projetos de forma eficiente.
- Fornece dados para a página de dashboard.
