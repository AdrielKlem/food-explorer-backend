# Food Explorer Back-End

Este é o meu projeto final coloquei prática os meus conhecimentos adquiridos pela trilha Explorer de Rocketseat.

## 👨‍💻 Sobre

Food Explorer é um aplicação desenvolvida a partir das tecnologias ReactJs(Front-End) e NodeJs(Back-End).

Os usuários têm acesso aos cardápios dos restaurantes e podem fazer pedidos de seus pratos escolhidos. Já os administradores têm a capacidade de criar e vender os seus próprios pratos.

## 🔗 WEB (Front-End)

- [food-explorer-frontend](https://github.com/AdrielKlem/food-explorer-frontend)

## 🎨 Layout

A página inicial em versão desktop é vista na imagem abaixo:

![imagem_2023-10-10_155744071](https://github.com/AdrielKlem/food-explorer-frontend/assets/107509985/333ae501-7a8a-48df-b05f-683b331db1ef)

---

## 🛠 Tecnologias

As tecnologias que foram na criação do projeto Back-End:

- [Node.js](https://nodejs.org/en/)
- [Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Nodemon](https://nodemon.io/)
- [CORS](https://www.npmjs.com/package/cors)
- [Multer](https://www.npmjs.com/package/multer)
- [SQLite](https://www.sqlite.org/index.html)

---

## 🚨 Como utilizar

Clone o projeto para o local desejado em seu computador.

```bash
$ git clone git@github.com:AdrielKlem/food-explorer-backend.git
```

---

#### ⚙ Executando o BackEnd

```bash
# No BackEnd insira uma porta e um secret no arquivo .env vazio
  AUTH_SECRET=
  PORT=

# Instale as dependências necessárias
$ npm install

# Processar as migrates necessárias
$ npm run migrate

# Agora inicie o servidor do BackEnd
$ npm run dev
```

---

#### 🔑 Quer ver como a aplicação funciona vista pelo Admin? Use a conta a seguir:

```bash
  e-mail: admin
  senha: admin
```

---

## Observação

O Front-End foi hospedado nos serviços de [Netlify](https://www.netlify.com), enquanto o Back-End foi hospedado nos serviços de [Render](https://render.com).

Devido à natureza gratuita desses serviços, é possível que a comunicação com o Back-End da aplicação apresente demoras, podendo resultar em atrasos de pelo menos 1 minuto para o funcionamento normal da aplicação.

[Acesse o Projeto Final](https://cheerful-dodol-6cf8d7.netlify.app)
