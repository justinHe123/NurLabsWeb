This is the web server for the NurLabs web site.

This repository is not built for local deployment and is primarily intended for remote deployment with Heroku.

If you want to test the server locally, run the following command with environmental variables set up:

    heroku local

See Heroku's Node.js startup guide for deploying the server to Heroku.

https://devcenter.heroku.com/articles/getting-started-with-nodejs

In brief, push the code to Heroku using

    git push heroku main

and create a Heroku cloud instance using

    heroku ps:scale web=1

