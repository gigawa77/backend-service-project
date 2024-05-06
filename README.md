To successfully connect the two databases locally you must create 2 files, ".env.development" and ".env.test"

Once those files are created add "PGDATABASE=nc_news" to your .env.devlopment file and "PGDATABASE=nc_news_test" to your .env.test file

Here is a link to the hosted version of this project https://backend-service-project-2.onrender.com

This project is the backend for a news site that utilizes multiple databases (articles, users, topics and comments) to give the user whichever data they request

Before beginning, please type 'npm i' into your terminal and hit enter, this will install all the required dependencies

Once the dependencies are installed please type 'npm run setup-dbs' in the terminal and hit enter to initialize the database
