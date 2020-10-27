# TemVacina

## Aplicação web crowdsourced para busca de locais de vacinação

Este projeto consiste em um sistema web para registro e consulta de vacinas por locais de vacinação, utilizando de geolocalização para fornecer resultados próximos ao usuário, bem como, visão de mapas para melhoria da usabilidade.

Desenvolvida em NodeJS utilizando o framework ExpressJS. Utiliza o padrão arquitetural MVC.

Esta aplicação poderá ser utilizada tanto num contexto mais local quanto em algo de maior escala. A mesma foi desenvolvida para ser executada numa stack mínima.


**Atenção: Aplicação em desenvolvimento, porém plenamente utilizável**

## Decisões arquiteturais

* ExpressJS
* MongoDB (4.2+)
* Bulma CSS
* SASS
* LeafletJS utilizando do OpenStreetMap
* Jest

## Tutorial


Em construção! 👷

## Deploy


É necessária a configuração do arquivo ".env":

MONGODB_URL="sua_url"

SECRET="seu_secret"

A instalação pode ser efetuada em qualquer servidor (local ou remoto) com suporte à stack da aplicação (NodeJS, MongoDB). Por se tratar de uma aplicação ainda em desenvolvimento, podem haver incompatibilidades no entanto. Para reportar algum problema, utilize-se da seção "Issues" deste repositório.

Algumas rotas de teste vem habilitadas por padrão (poderá ser removido em versões futuras).

## Instalação Teste


Crie e configure o arquivo ".env" (veja na seção Deploy).

Para instalar as dependências do projeto, utilize o comando:
```bash
npm install
```

Para executar a aplicação de forma simples, navegue até o diretório da mesma e utilize o comando:

```bash
npm start
```

## Onde obter dados?


Como fontes iniciais para dados acerca de postos de saúde e afins do Brasil, pode se utilizar das bases de dados disponíveis em:
* http://cnes.datasus.gov.br/
* http://www.dados.gov.br/dataset?groups=saude

## Próximos passos


- Integrações para coleta de informações de usuários e geração de métricas.
- Elaboração de ícones e melhorias na UI/UX da aplicação.
- Novas funcionalidades aos usuários, como compartilhamento em mídias sociais e fornecimento de contato direto com localidades.
- Conversão em API e lançamento no formato de aplicativo (PWA).