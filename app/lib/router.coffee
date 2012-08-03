app = require 'application'

module.exports = class Router extends Backbone.Router
  routes:
    '': 'home'

  home: ->
    return @select_user() if !app.user?
    $('body').html app.homeView.render().el
    
  select_user: ->
    $('body').html app.usersView.render().el
