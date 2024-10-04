# Pokedéx

Este projeto é uma aplicação web de Pokédex desenvolvida utilizando **Vue.js 3**, **Vite**, **Vuetify** e **TypeScript**. A aplicação permite visualizar uma lista de Pokémon, pesquisar por nome ou número, filtrar por tipo e marcar favoritos.

Deploy: https://pokedex-puce-gamma.vercel.app/

## 🛠 Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript utilizado para criar a interface do usuário.
- **Vite** - Ferramenta de build rápida para desenvolvimento.
- **Vuetify** - Biblioteca de componentes UI baseada em Material Design.
- **TypeScript** - Superset de JavaScript que adiciona tipagem estática ao código.
- **PokeAPI** - API pública utilizada para obter os dados dos Pokémon.

## 🔗 Funcionalidades

- **Listagem de Pokémon**: Exibe uma lista de Pokémon com paginação.
![image](https://github.com/user-attachments/assets/74fb7a41-b974-4c10-84dc-b2fa64cf14a7)
- **Pesquisa**: Pesquisar Pokémon pelo nome ou número.
![image](https://github.com/user-attachments/assets/89c3bdc3-de3e-4494-9f5b-d7afe9d11cea)
- **Favoritos**: Marcar Pokémon como favoritos e exibi-los em uma página dedicada.
![image](https://github.com/user-attachments/assets/fe40975e-9d55-4a89-81aa-af7e045f21c9)
- **Ver Detalhes**: Ao selecionar um Pokémon, mostrar informações detalhadas, incluindo Estatísticas(HP, Attack, Defense, Special Attack, Special Defense e Speed), Tipos e Evoluções.
- ![image](https://github.com/user-attachments/assets/83928429-9cdc-460b-9994-aebc44f189a8)

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- Um gerenciador de pacotes, como o **npm** ou **yarn**

### Passos para Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/marcelamchdo/pokedex

2. Navegue até o diretório do projeto
   
   ```bash
   cd pokedex/app

3. Instale as dependências:
   
   ```bash
   npm install

4. Execute o servidor de desenvolvimento:
   
   ```bash
   npm run dev
   
5. Abra o navegador e acesse:

   ```bash
   http://localhost:5173


###📁 Estrutura do Projeto

   ```bash
  │
  ├── app/                       # Diretório da aplicação principal
  │   ├── public/                 # Arquivos públicos
  │   ├── src/                    # Código-fonte da aplicação
  │   │   ├── assets/             # Imagens e outros arquivos estáticos
  │   │   ├── components/         # Componentes Vue
  │   │   ├── composables/        # Funções reutilizáveis (Composition API)
  │   │   ├── router/             # Configuração das rotas
  │   │   ├── views/              # Páginas da aplicação
  │   │   ├── App.vue             # Componente raiz
  │   │   ├── main.ts             # Arquivo de entrada principal
  │   ├── dist/                   # Arquivos de build para produção
  │   ├── package.json            # Configurações de dependências e scripts
  │   └── vite.config.ts          # Configurações do Vite
```

### 🐛 Problemas Conhecidos

- Resolução de fontes no Vercel: Certifique-se de adicionar as configurações corretas no arquivo vite.config.js para garantir que as fontes sejam servidas corretamente em produção.

### 👩‍💻 Desenvolvido por
- Marcela Machado
   
