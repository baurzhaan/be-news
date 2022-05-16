## Connect to the databases
You will need to add two environment files (.env.test and .env.development) to be able to connect to your local databases, which is a mandatory step.

Instruction on how to add environment files:
  1) create file ".env.test".
    - type `cp .env-example .env.test` in the current folder, this will copy the content of example file to the new file.
    - open '.env.test' file in editor (probably in VSCode).
    - replace the 'database_name_here' with the name of your test database, i.e. 'nc_news_test'.
    - save your changes.

  2) create file ".env.development"
  Markup: - type `cp .env-example .env.development` in the current folder, this will copy the content of example file to the new file.
        - open '.env.development' file in editor (probably in VSCode).
        - replace the 'database_name_here' with the name of your development database, i.e. 'nc_news_development'.
        - save your changes.
