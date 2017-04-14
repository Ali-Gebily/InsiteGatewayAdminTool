# Barton Admin Tool


## Dependencies
- nodejs https://nodejs.org/en/ (v6+)
- MongoDB https://www.mongodb.com/ (v3.2)
- Heroku Toolbelt https://toolbelt.heroku.com
- git


## Configuration
Back end configuration is at `config/default.js`, you may also set env variables.
You may need to update the MONGODB_URI parameter to point to a new database.

Front end configuration is at `public/js/config.js`, you needn't change it.


## Local deployment
- Start MongoDB server
- Install dependencies `npm i`
- Run code lint check `npm run lint`
- Run tests `npm run test`
- Clear users and then add some sample users `npm run add-users`
- Start app `npm start`
- Access `http://localhost:3000`
- Login with `admin@test.com / abc123`


## Heroku deployment
- git init
- git add .
- git commit -m 'message'
- heroku login
- heroku create [application-name] // choose a name, or leave it empty to use generated one
- heroku addons:create mongolab // create Mongo Lab add-on
- git push heroku master // push code to Heroku
- optionally if you want to add some sample users, run `heroku run bash`, in the bash, run `npm run add-users`, then `exit`


I deployed the app to:
https://fathomless-castle-11207.herokuapp.com

Login with `admin@test.com / abc123`


## Notes
- This submission uses the suggested Angular 1.5.5, and I think this should be used. The reason is that:
  When I simply directly used Angular with the client components, there are problems rendering the page
  when route is changed, new routed page is blank, this is probably because Angular and client components
  have different handling for custom tags.
  Fortunately, client provided a component, i.e. bower_components\ng-polymer-elements, which solves the conflict,
  we should follow that client component, and that component uses Angular 1.5.5.
- For this initial development, I simply put back end and front end together; but it is easy to separate them if needed,
  the back end is CORS ready, and the front end can configure back end base URL, so it is just to deploy the front end
  `public` folder separately.
- This submission simply includes all client components, because it is probably more componennts are used in other pages,
  we may remove unused components later when in production.

