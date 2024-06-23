# Requisitos

Ter o [docker](https://www.docker.com/) instalado.

# Como executar:

Para executar basta seguir os seguintes passos:

#### 1. Clonar esse repositório;
#### 2. Rodar `npm install`;
#### 3. Adicionar as variáveis de ambiente (podem ser adicionadas seguindo o modelo em [.env.example](.env.example)) 
#### 4. Executar `docker compose up` em um terminal dentro da pasta do repositório.

# Como executar os testes:

Para executar os testes é necessário ter o node instalado e estar com o container do docker em execução.

Com isso feito, basta executar:
- `npm run test` para rodar os testes unitários;
- `npm run test:e2e` para rodar os testes e2e;

# Acessando a aplicação

1. Acessando o [Swagger](http://127.0.0.1:3000/api) da aplicação. Pode ser acessado por meio do link http://127.0.0.1:`APPLICATION_PORT`/api

2. Você pode acessar a aplicação de duas formas:
Conectando diretamente usando alguma plataforma de API no endereço http://127.0.0.1:`APPLICATION_PORT`

> APPLICATION_PORT é configurada nas variáveis de ambiente



