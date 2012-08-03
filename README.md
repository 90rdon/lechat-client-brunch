# `leChat` client

This is a client application for `leChat` server written in Coffeescript with Backbone.js, Socket.io and Brunch.io.

## Running locally

  * clone this repository
  
  * in the project directory, run `npm install` to install node package. This will create the `node_modules` folder.
  
  * run `brunch watch` to start the server. By default the server listens on port 3333. You can change this by setting the `PORT` environment variable:
  
        PORT=XXXX brunch watch
  
  * go to [http://localhost:3333](http://localhost:3333) in your browser. If the connection to your `leChat` IO server is successful (see below), you will be able to select a user and start a chat session.
  
## `leChat` IO server

  * this app will attempt to connect to a `leChat` IO server instance on `localhost:3000`. To change this, pass the `IO_PORT` and `IO_HOST` environment variables to `brunch watch`, as in:
  
        IO_PORT=1234 IO_HOST=my.host.local brunch watch
        
## deploying on Heroku

  * if you have installed the Heroku toolbelt, the app can be launched with `foreman`. Run `foreman start` to run the app on port 5000.