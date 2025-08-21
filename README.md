# Bot de RPG para Discord

Este é um bot completo e interativo projetado para gerenciar sessões de RPG diretamente no Discord. Ele automatiza tarefas como criação de personagens, rolagens de dados, gerenciamento de fichas, inventário e até a ordem de iniciativa de combate.

## ✨ Funcionalidades Principais

* **Criação de Fichas**: Processo interativo para a criação de novos personagens, com distribuição de pontos de atributos e seleção de espécie, classe, personalidade e aura.
* **Gerenciamento de Personagem**: Comandos para visualizar a ficha, inventário e equipamento, além de permitir a edição de informações.
* **Sistema de Rolagens**: Módulo de rolagem de dados para testes simples, testes de atributo, furtividade e investigação.
* **Iniciativa de Combate**: Sistema para gerenciar a ordem de turno de jogadores e NPCs.
* **Banco de Dados de Itens**: Catálogo de itens, auras, classes e efeitos com a possibilidade de busca e listagem.
* **Comandos de Mestre**: Ferramentas exclusivas para o Mestre do Jogo gerenciar a sessão de forma mais fluida.

---

## 🛠️ Instalação e Configuração

Para que o bot funcione em seu próprio servidor, siga os passos abaixo.

### Pré-requisitos

* **Node.js**: Versão 18 ou superior.
* **Git**: Para clonar o repositório.
* **Servidor Discord**: Com permissões de administrador para convidar o bot e gerenciar cargos.
* **Google Sheets**: Uma planilha para armazenar as fichas dos personagens.
* **Google Cloud Project**: Um projeto com a API do Google Sheets habilitada.

### Passo 1: Configurar a Planilha do Google Sheets

O bot usa uma planilha para ler e escrever os dados dos personagens.

1.  Crie uma nova planilha no Google Sheets.
2.  Crie uma aba chamada `Base`. Essa aba será usada como um modelo para todas as novas fichas criadas.
3.  Anote o **ID da Planilha**, que pode ser encontrado na URL: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`.
4.  Crie uma **Conta de Serviço** no Google Cloud e habilite a API do Google Sheets.
5.  Gere as credenciais da conta de serviço no formato JSON.
6.  Renomeie o arquivo JSON para `google.json` e coloque-o na pasta `root` do projeto.
7.  Compartilhe a sua planilha do Google Sheets com o e-mail da conta de serviço para que o bot tenha permissão de acesso.

### Passo 2: Clonar o Repositório e Instalar Dependências

Abra o terminal e execute os seguintes comandos:

```bash
git clone <url-do-seu-repositorio>
cd <nome-do-diretorio-do-bot>
npm install
