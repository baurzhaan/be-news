## Link to the hosted version
https://be-news-app.herokuapp.com/api

## Summary
The app is an API of news application which allows to get, to update, to delete the articles, comments, etc.

## howto clone
go to the https://github.com/baurzhaan/be-news and clone in the preferred way (HTTPS, ssh, Github CLI)

## howto install dependancies
you will need to install below dependencies to run the app:
"dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.18.1",
    "pg": "^8.7.3"

## howto seed the local database
you will need to run the script in the package.json file, "seed": "node ./db/seeds/run-seed.js":
`npm seed`

to run the test run the `npm seed` command from the app directory

## howto run the tests
to run the test run the `npm test` command from the app directory

## Connect to the databases
Add two environment files (.env.test and .env.development) to be able to connect to the local databases:
1) create file ".env.test".
- type `cp .env-example .env.test` in the current folder, this will copy the content of example file to the new file.
- open '.env.test' file in editor (probably in VSCode).
- replace the 'database_name_here' with the name of your test database, i.e. 'nc_news_test'.
- save your changes.

2) create file ".env.development"
- type `cp .env-example .env.development` in the current folder, this will copy the content of example file to the new file.
- open '.env.development' file in editor (probably in VSCode).
- replace the 'database_name_here' with the name of your development database, i.e. 'nc_news_development'.
- save your changes.

## versions of Node.js and PostgreSQL
The app is tested with the versions
Node.js: v17.8.0
PostgreSQL: 14.3