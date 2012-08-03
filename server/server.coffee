express = require('express')
http = require('http')
path = require('path')

# initialize express app
app = express()

# configure express app
app.configure ->
  app.set('port', process.env.PORT || 3333)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.favicon())
  app.use(express.logger('dev'))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  #app.use(app.router)
  #app.use(require('stylus').middleware(__dirname + '/public'))
  app.use(express.static(path.join(__dirname, 'public')))
  app.set('socket.io host', process.env.IO_HOST || 'localhost')
  app.set('socket.io port', process.env.IO_PORT || 3000)

# developement-specific configuration
app.configure 'development', ->
  app.use express.errorHandler()
  
  
# production-specific configuration
app.configure 'production', ->
  app.set('port', process.env.PORT || 80)


# routing
app.get '/', (err, res) -> res.render 'index', { 
    title: 'leChat : awesome chat client'
    io_host: app.get('socket.io host')
    io_port: app.get('socket.io port')
  }

# create server
server = http.createServer(app)

  
module.exports = {
  startServer: ->
    # start listening on port
    server.listen app.get('port'), ->
      console.log "Express server listening on port #{app.get('port')}"
}