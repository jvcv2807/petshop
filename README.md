# 🐾 Mundo Pet - Sistema de Agendamento

Aplicação web completa para agendamento de atendimentos em petshop desenvolvida a partir do layout oficial do Figma da formação da **Rocketseat**.

---

## 🚀 Funcionalidades

### 📅 Agenda
- **Agrupamento por períodos:**
  - 🌅 **Manhã:** 09h às 12h
  - ☀️ **Tarde:** 13h às 18h
  - 🌙 **Noite:** 19h às 21h
- **Cards de seção com identidade visual fiel ao Figma:**
  - Ícone temático oficial em SVG (Streamline / Solar);
  - Título do período;
  - Horário de atendimento do período;
- **Detalhes de cada agendamento:**
  - Horário formatado (`HH:mm`);
  - Nome do animal e nome do tutor (`Pet / Tutor`);
  - Descrição do serviço prestado;
  - Ação de exclusão imediata (**"Remover agendamento"**) com feedback em toast.
- **Filtro por data:**
  - Seletor de data interativo no topo;
  - Atualização dinâmica da agenda ao mudar a data;
  - Pré-carregado com os dados do protótipo Figma (`10/01/2024`).

### 📝 Modal "Agende um atendimento"
- Aberto ao clicar no botão flutuante **"Novo agendamento"**;
- **Foco automático** no primeiro campo (`Nome do tutor`);
- **Bloqueio de fundo** (backdrop blur e desativação do scroll);
- **Acessibilidade completa:** suporte a tecla `ESC` para fechar e focus trap (navegação com `Tab` e `Shift+Tab` restrita ao modal);
- **Campos do formulário:**
  1. Nome do tutor;
  2. Nome do pet;
  3. Telefone (com máscara dinâmica `(XX) XXXXX-XXXX`);
  4. Descrição do serviço;
  5. Data;
  6. Hora (com lista de horários permitidos e validação).

### ⚙️ Regras de Negócio e Validações
- **Validação de campos obrigatórios:** impede envio com campos vazios e exibe mensagens específicas por campo.
- **Janelas de horários válidas:**
  - Bloqueia horários fora das faixas (antes das 09:00, entre 12:01 e 12:59, entre 18:01 e 18:59, ou após as 21:00).
- **Prevenção de conflito de horários:**
  - Não permite dois agendamentos no mesmo horário para a mesma data.
- **Ordenação automática:**
  - Agendamentos são ordenados cronologicamente pelo horário.
- **Persistência de dados:**
  - Armazenamento no `localStorage` do navegador para manter os dados salvos entre sessões.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Semântico:** estruturação acessível com tags e atributos WAI-ARIA (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, etc.).
- **CSS3 Moderno:**
  - CSS Custom Properties (Design Tokens extraídos diretamente do Figma);
  - Layout responsivo (Grid e Flexbox);
  - Tipografia do Google Fonts: *Familjen Grotesk*, *Inter Tight* e *Inter*.
- **JavaScript (ES Modules):**
  - Manipulação modular de DOM;
  - Validações e máscaras reativas;
  - Gerenciamento de estado e `localStorage`.
- **Vite:** ferramenta de build ultrarrápida.

---

## 📦 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd petshop
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a URL indicada no terminal (geralmente `http://localhost:5173`).

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```

---

Feito com 💜 para o desafio da Rocketseat!
