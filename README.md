# Bot de RPG para Discord

Este é um bot completo e interativo projetado para gerenciar sessões de RPG diretamente no Discord. Ele automatiza tarefas como a criação de personagens, rolagens de dados, gerenciamento de fichas, inventário e até a ordem de iniciativa de combate.

## ✨ Funcionalidades Principais

* **Criação de Fichas**: Processo interativo para a criação de novos personagens, com distribuição de pontos de atributos e seleção de espécie (incluindo espécies híbridas), classe, personalidade e aura.
* **Gerenciamento de Personagem**: Comandos para visualizar a ficha, inventário e equipamento, além de permitir a edição de informações.
* **Sistema de Rolagens**: Módulo de rolagem de dados para testes simples (`!rolar`), testes de atributo (`!teste`), furtividade (`!furtividade`) e investigação (`!investigar`).
* **Iniciativa de Combate**: Sistema para gerenciar a ordem de turno de jogadores e NPCs.
* **Banco de Dados de Itens**: Catálogo de itens, auras, classes e efeitos com a possibilidade de busca e listagem.
* **Comandos de Mestre**: Ferramentas exclusivas para o Mestre do Jogo gerenciar a sessão de forma mais fluida, como editar fichas de outros jogadores e controlar a iniciativa.

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
git clone [https://github.com/JiukOn/CoalizaoRPG-DiscordBot.git](https://github.com/JiukOn/CoalizaoRPG-DiscordBot.git)
cd CoalizaoRPG-DiscordBot
npm install
````

### Passo 3: Configurar o Bot do Discord

1.  Vá para o [Portal do Desenvolvedor do Discord](https://www.google.com/search?q=https://discord.com/developers/applications).
2.  Crie uma nova aplicação e, em seguida, um bot.
3.  Vá para a seção `Bot` e habilite os `Privileged Gateway Intents` (`PRESENCE INTENT`, `SERVER MEMBERS INTENT` e `MESSAGE CONTENT INTENT`).
4.  Copie o **token** do bot.
5.  Crie um arquivo chamado `.env` na raiz do seu projeto e adicione a seguinte linha, substituindo `SEU_TOKEN_AQUI` pelo token do seu bot:
    ```
    DISCORD_TOKEN=SEU_TOKEN_AQUI
    ```

### Passo 4: Ajustar as Configurações do Bot

1.  Abra o arquivo `config.js` e atualize as variáveis de acordo com o seu servidor.
2.  Altere o `SHEET_ID` em `utils/ficha.js` e `utils/criarficha.js` para o ID da sua planilha do Google Sheets.
3.  Altere o `PREFIX` dos comandos, os nomes dos cargos (`REQUIRED_ROLE`, `MESTRE_ROLE`) e a `COR_PRINCIPAL` dos embeds em `config.js`.

### Passo 5: Iniciar o Bot

Certifique-se de que o bot tenha as permissões necessárias no seu servidor Discord (ler mensagens, enviar mensagens, gerenciar apelidos). Depois, execute o comando:

```bash
npm start
ou
nodemon start
```

Se tudo estiver configurado corretamente, o bot estará online e pronto para uso\!

-----

## 📜 Comandos do Bot

Aqui estão todos os comandos disponíveis, com a sintaxe e a descrição detalhada para cada um.

### 🎲 Rolagens & Testes

  * `!rolar <XdY>` ou `!r <XdY>`: Rola X dados de Y faces (ex: `!rolar 3d6`). O padrão é `1d20`.
  * `!teste <atr> <dificuldade> [vantagem/desvantagem]`: Realiza um teste de atributo contra uma dificuldade.
  * `!furtividade <atr> <nome_inimigo> <bônus_inimigo> [vantagem/desvantagem]`: Realiza um teste de furtividade comparando a rolagem do jogador com a do inimigo.
  * `!investigar <atr> <dificuldade>`: Realiza um teste de investigação contra uma dificuldade, oferecendo descrições de falha e sucesso.

### 👤 Personagem

  * `!novaficha`: Inicia o processo interativo de criação de um novo personagem.
  * `!minhaficha` ou `!ficha`: Exibe a ficha completa do seu personagem.
  * `!inventario` ou `!inv`: Mostra a lista de itens no inventário do seu personagem.
  * `!equipamento` ou `!equip`: Exibe os itens que o seu personagem está usando no momento.
  * `!apelido <nome-do-personagem>`: Altera o seu apelido no servidor para o nome do seu personagem, facilitando a identificação.
  * `!editarficha <campo> <valor>`: Permite editar um campo da sua ficha. Mestres podem editar a ficha de outros personagens com `!editarficha <alvo> <campo> <valor>`.

### 📖 Informações

  * `!item <nome do item | ID>`: Exibe os detalhes de um item específico, que pode ser buscado por nome ou por ID.
  * `!item list <tipo>`: Lista todos os itens de um tipo específico. Tipos disponíveis: **Arma**, **Escudo**, **Vestimenta**, **Projétil**, **Item Mágico**, **Ferramenta**, **Consumível**, **Veneno**, **Item Diverso**.
  * `!list <tipo>` ou `!lista <tipo>`: Exibe uma lista completa de auras, personalidades, efeitos ou classes. Tipos disponíveis: **aura**, **personalidade**, **efeitosiniciais**, **classesiniciais**.

### ⚔️ Iniciativa

  * `!iniciativa`: Rola a sua iniciativa (baseada em Destreza) e a adiciona à lista de combate.

### 👑 Comandos do Mestre

  * `!iniciativa <nome> <bônus>, ...`: Permite ao mestre adicionar um ou mais NPCs ou personagens à lista de iniciativa com um bônus específico. Ex: `!iniciativa goblin 2, orc 5`.
  * `!iniciativa reset`: Limpa a lista de iniciativa para o próximo combate.
  * `!editarficha <alvo> <campo> <valor>`: Permite que o mestre edite a ficha de qualquer personagem no servidor.

-----

## 📁 Estrutura do Projeto

  * `index.js`: O ponto de entrada principal do bot.
  * `config.js`: Contém todas as configurações globais, como prefixos, roles, emojis e dados estáticos.
  * `commands/`: Contém os arquivos de cada comando do bot.
  * `data/`: Armazena os arquivos de dados JSON.
  * `utils/`: Funções de utilidade para manipulação de fichas, dados e outros.
  * `root/`: Pasta para o arquivo de credenciais `google.json`.
  * `.env`: Arquivo de variáveis de ambiente com o token do Discord.
  * `.gitignore`: Arquivo para ignorar arquivos confidenciais e de dependências.
  * `package.json` e `package-lock.json`: Gerenciamento das dependências do projeto.

Qualquer dúvida ou sugestão, sinta-se à vontade para entrar em contato\!

```
```
