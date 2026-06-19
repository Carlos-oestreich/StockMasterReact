# StockMaster React - Frontend Web

![Status](https://img.shields.io/badge/status-finalizado-brightgreen)

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react">
  <img src="https://img.shields.io/badge/Vite-5.3.1-646CFF?style=for-the-badge&logo=vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.4-06B6D4?style=for-the-badge&logo=tailwindcss">
  <img src="https://img.shields.io/badge/Axios-1.6.0-5A29E4?style=for-the-badge&logo=axios">
  <img src="https://img.shields.io/badge/Chart.js-4.4.0-FF6384?style=for-the-badge&logo=chartdotjs">
  <img src="https://img.shields.io/badge/jsPDF-2.5.1-FF6F00?style=for-the-badge">
</p>

<p align="center">Sistema completo de gestao de estoque com interface moderna, responsiva e integrada a API REST.</p>
<p align="center"><strong>Desenvolvido para fins academicos</strong> por <a href="https://github.com/Carlos-oestreich">Carlos Eduardo Oestreich</a> e <a href="https://github.com/larissalaumann">Larissa Maria Laumann</a>.</p>

---

## Sobre o Projeto

O **StockMasterReact** e o frontend do ecossistema StockMaster, construido com **React 18 + Vite**.

- Arquitetura modular por paginas, componentes, contextos e servicos.
- Integracao com backend via **Axios** e autenticacao por token.
- Dashboard com indicadores visuais, graficos e alertas.
- Modulos operacionais de produtos, movimentacoes, usuarios e configuracoes.
- Geração de relatorios em PDF com layout profissional.

> **Nota:** Este repositorio contem apenas o frontend. Para funcionamento completo, execute o backend em conjunto.

---

## Versoes Relacionadas

Tambem desenvolvemos o backend em Java:

- [StockMaster Backend (Java + Spring Boot)](https://github.com/Carlos-oestreich/Projeto_StockMaster)

---

## Funcionalidades Principais

- Autenticacao com sessao e token JWT
- Cadastro inicial de empresa e usuario administrador
- Dashboard com metricas de estoque e negocio
- Gestao de categorias, produtos e fornecedores
- Controle de movimentacoes (entrada e saida)
- Alertas de estoque baixo e sem estoque
- Relatorios em PDF para acompanhamento gerencial
- Tema claro/escuro com persistencia no navegador
- Layout totalmente responsivo

---

## Arquitetura

```text
src/
|- components/        # Componentes reutilizaveis de interface
|- context/           # Estados globais (auth, tema, flash)
|- data/              # Dados estaticos de navegacao
|- models/            # Modelos de dominio
|- pages/             # Paginas da aplicacao
|- services/          # Integracao com API REST
|- utils/             # Utilitarios (formatacao, validacao, pdf)
|- App.jsx            # Estrutura principal e roteamento
`- main.jsx           # Ponto de entrada

public/
`- favicon.ico
```

---

## Tecnologias Utilizadas

- **React 18.3.1**
- **Vite 5.3.1**
- **Tailwind CSS 3.4.4**
- **Axios 1.6.0**
- **React Router DOM 6.23.0**
- **Chart.js 4.4.0** + **react-chartjs-2 5.2.0**
- **jsPDF 2.5.1** + **jspdf-autotable 3.8.2**
- **Lucide React 0.383.0**

---

## Seguranca

- Envio automatico de `Authorization: Bearer <token>` via interceptor
- Envio de `Empresa-Id` para segregacao de contexto da empresa
- Tratamento de respostas `401` com limpeza de sessao e redirecionamento
- Protecao de paginas privadas com componente de rota protegida

---

## Configuracao

A URL base da API esta definida em `src/services/api.js`:

```js
baseURL: 'http://localhost:8080'
```

Se seu backend estiver em outro host/porta, ajuste esse valor.

---

## Como Executar

1. **Clonar o projeto**

```bash
git clone https://github.com/Carlos-oestreich/StockMasterReact.git
cd StockMasterReact
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Executar ambiente de desenvolvimento**

```bash
npm run dev
```

4. **Gerar build de producao**

```bash
npm run build
```

5. **Visualizar build localmente**

```bash
npm run preview
```

Frontend (Vite): `http://localhost:5173`

---

## Scripts

- `npm run dev` - inicia o servidor de desenvolvimento
- `npm run build` - gera build otimizada
- `npm run preview` - executa preview da build

---

## Ambiente de Desenvolvimento

Projeto construido e validado com:

- **Node.js** (LTS recomendado)
- **npm**
- **JetBrains IntelliJ IDEA / VS Code**
- **Backend Java/Spring Boot** rodando em `localhost:8080`

---

## Responsividade e UX

- Suporte para mobile, tablet e desktop
- Componentes de UI consistentes (cards, tabelas, badges, drawers)
- Feedback de acoes com flash messages
- Navegacao lateral e topbar com foco em produtividade

---

## Relatorios e Indicadores

- Exportacao de PDFs com dados operacionais e gerenciais
- Dashboard com cards de status e graficos
- Alertas de estoque para tomada de decisao rapida

---

## Autores

- [Carlos Eduardo Oestreich](https://github.com/Carlos-oestreich)
- [Larissa Maria Laumann](https://github.com/larissalaumann)

---

## Observacao Final

Projeto academico finalizado, seguindo boas praticas de estrutura, legibilidade e experiencia de uso para um sistema real de gestao de estoque.

<div align="center">

Duvidas, feedbacks e colaboracoes sao bem-vindos.

Se este repositorio foi util, deixe uma estrela.

</div>

---

# English Version

---

# StockMaster React - Web Frontend

![Status](https://img.shields.io/badge/status-completed-brightgreen)

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react">
  <img src="https://img.shields.io/badge/Vite-5.3.1-646CFF?style=for-the-badge&logo=vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.4-06B6D4?style=for-the-badge&logo=tailwindcss">
  <img src="https://img.shields.io/badge/Axios-1.6.0-5A29E4?style=for-the-badge&logo=axios">
  <img src="https://img.shields.io/badge/Chart.js-4.4.0-FF6384?style=for-the-badge&logo=chartdotjs">
  <img src="https://img.shields.io/badge/jsPDF-2.5.1-FF6F00?style=for-the-badge">
</p>

<p align="center">Complete inventory management frontend with modern UI, responsive experience and REST API integration.</p>
<p align="center"><strong>Developed for academic purposes</strong> by <a href="https://github.com/Carlos-oestreich">Carlos Eduardo Oestreich</a> and <a href="https://github.com/larissalaumann">Larissa Maria Laumann</a>.</p>

---

## About the Project

**StockMasterReact** is the frontend layer of the StockMaster platform, built with **React 18 + Vite**.

- Modular structure with pages, components, contexts and services.
- REST API integration with token-based authentication.
- Dashboard with business metrics, charts and stock alerts.
- Operational modules for products, movements, users and settings.
- PDF report generation with clean presentation.

> **Note:** This repository contains only the frontend. Run the backend API together for full usage.

---

## Related Versions

Java backend version:

- [StockMaster Backend (Java + Spring Boot)](https://github.com/Carlos-oestreich/Projeto_StockMaster)

---

## Main Features

- JWT session authentication
- Initial company and admin setup flow
- Dashboard with stock and business indicators
- Category, product and supplier management
- Inventory movement control (inbound/outbound)
- Low stock and out-of-stock alerts
- PDF exports for operational and management reports
- Light/dark theme with persisted preference
- Fully responsive layout

---

## Frontend Architecture

```text
src/
|- components/        # Reusable UI components
|- context/           # Global state (auth, tema, flash)
|- data/              # Static navigation data
|- models/            # Domain models
|- pages/             # App pages
|- services/          # REST API integration
|- utils/             # Formatting, validation and PDF helpers
|- App.jsx            # App shell and routes
`- main.jsx           # Entry point
```

---

## Tech Stack

- **React 18.3.1**
- **Vite 5.3.1**
- **Tailwind CSS 3.4.4**
- **Axios 1.6.0**
- **React Router DOM 6.23.0**
- **Chart.js 4.4.0** + **react-chartjs-2 5.2.0**
- **jsPDF 2.5.1** + **jspdf-autotable 3.8.2**
- **Lucide React 0.383.0**

---

## Configuration

The API base URL is configured in `src/services/api.js`:

```js
baseURL: 'http://localhost:8080'
```

Update it if your backend runs on a different URL or port.

---

## How to Run

```bash
git clone https://github.com/Carlos-oestreich/StockMasterReact.git
cd StockMasterReact
npm install
npm run dev
```

Production commands:

```bash
npm run build
npm run preview
```

Default frontend URL (Vite): `http://localhost:5173`

---

## Authors

- [Carlos Eduardo Oestreich](https://github.com/Carlos-oestreich)
- [Larissa Maria Laumann](https://github.com/larissalaumann)

---

## Final Note

Completed academic project focused on clean architecture, practical usability and production-inspired inventory workflows.
