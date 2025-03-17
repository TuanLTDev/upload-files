# Expressjs Backend API

## Description

A boilerplate/starter project for quickly building RESTful APIs using Node.js, Express, and Sequelize.

## Prerequisites

- [Node.js](https://nodejs.org/en) v16+
- [PostgreSQL](https://www.postgresql.org/)

## Project Structure

```bash
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--core\           # Shared constants
 |--database\
  |--config\        # Configuration for database
  |--migrations\    # Database migrations
  |--models\        # Database models
  |--seeders\       # Database seeders
 |--docs\           # Swagger file
 |--enum            # Shared enum
 |--middlewares\    # Custom express middlewares
 |--modules\        # Service, dto, repository according to each module
  |--auth\          # auth module
  |--user\          # user module
  |--role\          # role module
 |--response        # response handler
 |--routes\         # Routes
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--server.js       # App entry point
```

## Installation

### Clone the repo:

```
$ git clone https://github.com/dscdut/expressjs-boilerplate.git
$ cd expressjs-boilerplate
```

### Install the dependencies:

```
$ npm install
```

### Set the environment variables:

```
$ cp .env.example .env

# open .env and modify the environment variables (if needed)
```

### Database initialization

```bash
$ docker compose up init_db
```

- **Note:** Remember to add `--build` option when running the init_db the first time

## Commands

### Migration

```bash
# Reset database
$ npm run db:reset

# Create new migration file
$ npx migrate:make <migration_name_file.js>

# Run the migration
$ npx sequelize-cli db:migrate

# Undoing the migration
$ npx sequelize-cli db:migrate:undo
```

### Seeding

```bash
# Create seed file
$ npx sequelize-cli seed:generate --name <migration_name_file.js>

# Run all seed file
$ npx sequelize-cli db:seed:all

# Run specific seed file
$ npx sequelize-cli db:seed -- --seed <seed_file_name.js>
```

For more information you can read at Sequelize docs

https://sequelize.org/docs/v6/other-topics/migrations/

### Run the backend code

```bash
# Dev mode
$ npm run dev

# Production mode
$ npm start
```

Access `http://localhost:8080/api/v1/docs` to view the Swagger Docs

### Commit convention

View the `commitlint.config.js` file to follow commit convention

### Linting

```bash
# run ESLint and fix ESLint errors
$ npm run lint

# run prettier
$ npm run format
```

## Environment Variables

- The environment variables can be found and modified in the .env file. They come with these default values:

```bash
NODE_ENV=development

# Port number
DEV_APP_PORT=8080
#base URL for versioned APIs
DEV_ROUTER_PREFIX=/api/v1

# JWT
JWT_SECRET=gdscdut
# Number of days/minutes/seconds after which a access token expires
JWT_ACCESS_EXPIRATION='1d' ('1m' | '60' | '1h' | '2024-12-31')
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION='30d'

# database
HOST=localhost
DB_NAME=postgres
PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_DIALECT=postgres
```

## Design API

```sh
https://gdsc-boilerplate-swagger-docs-api-latest.onrender.com/
```
