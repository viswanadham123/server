# server

## Getting started

### Install Node
```sh
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
$ nvm install 10.5.0
$ nvm use 10.5.0
```

### Clone this repo (and `cd` to it)
```sh
$ git clone (https://github.com/viswanadham123/server.git)
$ cd server
```

### Install Dependencies
```sh
$ npm install
```

### Load env vars
```sh
cp .env-example .env
```
Input the desired environment variables in `.env`.

### Start the server
```sh
$ node server.js
```
Open [http://localhost:8000](http://localhost:8000) to view it in your browser.

### Quering
Products
Retrieve all products:
[http://localhost:8000/products]

Retrieve a specific product (e.g., product with ID P105):
[http://localhost:8000/products/P105]

Query products with pagination and filters:
[http://localhost:8000/products?page=1&pageSize=10&productName=Shoes&productCategory=Clothes]
