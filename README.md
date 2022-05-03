# Implementação
## Visão geral
O projeto utiliza Express para a criação do servidor e é construído em uma arquitetura MVC inspirada no Laravel/Adonis, visando uma maior agilidade no desenvolvimento.<br>
O Mongoose é utilizado como ODM p/ auxiliar no cumprimento das regras de negócio e tornar o banco mais organizado.

## Rotas
### Enviar Catálogo
Consiste em pegar o texto do arquivo `.csv` recebido e quebrar as linhas e colunas nos lugares onde têm vírgula. Da forma que foi implementado pode haver conflito, caso o valor de alguma célula já possua uma vírgula dentro dele, portanto, precisaria de mais tempo para polir essa função.

### Enviar Livro
Após receber o arquivo `.pdf`, puxo as 10 primeiras linhas que, em todos livros que testei, correspondem a capa e a folha de rosto do livro. Tendo essas primeiras linhas, busco no catálogo por livros que possuam o título igual a uma das linhas recebidas.

# Documentação
## POST  `/api/sellers` - Cadastrar Vendedor
**Headers**
| header       | valor            | obrigatório |
|--------------|------------------|-------------|
| Content-Type | application/json | sim         |

<br>**Corpo da requisição**
| propriedade    | tipo   | descrição                      | obrigatório |
|----------------|--------|--------------------------------|-------------|
| name           | string | nome do vendedor               | sim         |
| phone          | string | telefone no formato brasileiro | sim         |
| email          | string | email do vendedor              | sim         |
| password       | string | senha de no mínimo 6 dígitos   | sim         |
| fiscalDocument | string | CPF ou CNPJ do vendedor        | sim         |

## POST `/api/sellers/login` - Login
**Headers**
| header       | valor            | obrigatório |
|--------------|------------------|-------------|
| Content-Type | application/json | sim         |

<br>**Corpo da requisição**
| propriedade | tipo   | descrição         | obrigatório |
|-------------|--------|-------------------|-------------|
| email       | string | email do vendedor | sim         |
| password    | string | senha do vendedor | sim         |

## POST `/api/books/catalog` - Enviar catálogo
**Headers**
| header        | valor                              | obrigatório |
|---------------|------------------------------------|-------------|
| Content-Type  | multipart/form-data                | sim         |
| Authorization | Bearer {{ TOKEN GERADO NO LOGIN }} | sim         |

<br>**Corpo da requisição**
| propriedade | tipo   | descrição                         | obrigatório |
|-------------|--------|-----------------------------------|-------------|
| catalog     | file   | arquivo csv do catálogo de livros | sim         |

## POST `/api/books` - Enviar livro
**Headers**
| header        | valor                              | obrigatório |
|---------------|------------------------------------|-------------|
| Content-Type  | multipart/form-data                | sim         |
| Authorization | Bearer {{ TOKEN GERADO NO LOGIN }} | sim         |

<br>**Corpo da requisição**
| propriedade | tipo   | descrição                         | obrigatório |
|-------------|--------|-----------------------------------|-------------|
| book        | file   | arquivo pdf do livro a ser enviado| sim         |

## GET `/api/books` - Listar livros
**Query params**
| propriedade      | tipo                              | descrição                                   | obrigatório |
|------------------|-----------------------------------|---------------------------------------------|-------------|
| minPrice         | number                            | valor mínimo dos livros a serem exibidos    | não         |
| maxPrice         | number                            | valor máximo dos livros a serem exibidos    | não         |
| publisher        | string                            | nome da editora dos livros a serem exibidos | não         |
| publicationOrder | -1 (decrescente) ou 1 (crescente) | tipo de ordenação por data de publicação    | não         |
| priceOrder       | -1 (decrescente) ou 1 (crescente) | tipo de ordenação por preço                 | não         |

## GET `/api/books/download/:bookId` - Baixar livro
**Parâmetros de URL**
| param  | tipo            | descrição                    | obrigatório |
|--------|-----------------|------------------------------|-------------|
| bookId | string(ObjectId) | id do livro que será baixado | sim         |