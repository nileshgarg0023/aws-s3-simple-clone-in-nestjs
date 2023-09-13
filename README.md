<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# File Upload API Documentation

This document provides information about the File Upload API endpoints and their usage.

# Link to postMan collection 

https://elements.getpostman.com/redirect?entityId=9715977-dcd153ce-f297-4f8c-a1a9-a1ac4b2cdfd1&entityType=collection
[Postman](https://www.postman.com/nileshgarg001/workspace/worksharing/collection/9715977-dcd153ce-f297-4f8c-a1a9-a1ac4b2cdfd1?action=share&creator=9715977)

## Table of Contents

1. [Create Folder](#create-folder)
2. [Upload File](#upload-file)
3. [Get File by ID](#get-file-by-id)
4. [List Files in a Folder](#list-files-in-a-folder)
5. [Create Folder (Again)](#create-folder-again)

---

## 1. Create Folder

**Endpoint:** `POST /file-upload/create-folder`

**Request/Respone**

```http
POST http://localhost:3000/file-upload/create-folder
Content-Type: application/json

{
    "folderName": "myfolder"
}

** Response: **
{
    "message": "Folder 'myfolder' created successfully"
}
```

**Endpoint:** `POST http://localhost:3000/file-upload/upload`

**Request/Response**

```http
Content-Type: multipart/form-data

[Binary File Data]

select form data in body
first field
folderName
second filed
file


response
{
    "id": "b45e3e91-dc49-446e-9d89-ece830daf036",
    "message": "File uploaded as 0abe8243-9e05-4893-8ebd-6ee29ef00480_2603740_0.jpg",
    "url": "http://localhost:3000/uploads/myfolder/0abe8243-9e05-4893-8ebd-6ee29ef00480_2603740_0.jpg"
}

```

**Endpoint:** `DELETE http://localhost:3000/file-upload/file/{id from upload file}`

```http
 will receive a response that file deleted with it's id
```

**Endpoint:** `GET http://localhost:3000/file-upload/files/{folderName}`

```http
 response

[
    {
        "filename": "0abe8243-9e05-4893-8ebd-6ee29ef00480_2603740_0.jpg",
        "size": 42651,
        "url": "http://localhost:3000/uploads/myfolder/0abe8243-9e05-4893-8ebd-6ee29ef00480_2603740_0.jpg"
    }
]
```
