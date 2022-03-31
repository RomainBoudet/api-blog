

(for Node.17.8.0 with NVM :
*# api-blog
A small API who can deliver Json articles for my new react front :

### Install :

(Need to have postgreSQL, Node.js version 17.8.0 and REDIS version 5.yz at least on your machine.)

* Clone the repository => ```git clone <URL>```
* Create the .env file with the .env.example => ``` cp .env.example .env```
* Fill your new .env file with the port of your choice and postgreSQL config
* Create postgreSQL database => ```createdb blog```
* Import data definition language => ```psql blog -f data/tables.sql ```
* Import depencies => ```npm i```
* Import data in database => ``` npm run seed ```
* Start the API => ```npm start```

### Routes avalaible :
You can try the 4 GET routes :
 * All articles => v1/posts
 * One post by id => v1/post/:id
 * All post by categories => v1/posts/category/:id
 * All categories => v1/category

And 1 POST route :
* To insert a new article => v1/posts
* This post route allow you to insert in the same time, a new category, but only if the label of this new config changes more than two letters (with Levenstein distance).

Notes : this small API use REDIS for cache and JSDoc. 😉

#### To insatll Node.17.8.0 with NVM :
* Run =>```nvm ls```
  * if not in the list => ```nvm install 17.8.0```
* Run => ```nvm use 17.8.0``` 
  
If you wouldlike to come back to the LTS => ```nvm use --lts```


