# NODE JS URL SHORTNER
This is a WebApp for creating a URL shortner.
In order to install it


Run 'npm inastall' after downloading the repo. to install the dependencies


To start the server on localhost:3000


Run 'npm start'

//Note that the downloaded version will use the online heroku database(postgres) by default unless the config is changed in the code 

Tech Stack- 


Backend - NodeJS ( Express Framework) + Postgres


Frontend - HTML + CSS


API's - 

POST /shortenMultiple - Use a Bulk Sequelize query to create entries for an array of longURLs


POST /shorten - Shorten a single or in case of an array - shorten each URL individually


POST /:shortcode - Expand a single shortUrl


POST /expandMultiple - Return the LongUrls for an array of shortcodes


The app has been deployed on Heroku - https://sheltered-caverns-41858.herokuapp.com/

All shortened URLs will be made with this link only.

//ToDO - Create better Error handlings and Document Reloading.

//For now , we have to reload the server again since the database queries are being run in a queue

//ToDo- Use timestamp instead of just date in database to order the enteries more accurately
