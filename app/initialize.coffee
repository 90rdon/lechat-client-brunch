application = require 'application'

module.exports = (host, port) ->
  $ ->
    application.initialize(host, port)
    #Backbone.history.start()
