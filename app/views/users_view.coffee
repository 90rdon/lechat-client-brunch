template = require 'views/templates/users'
View = require './view'
UserView = require './user_view'

module.exports = class UsersView extends View
  template: template
  
  initialize: ->
  
  after_render: ->
    container = @$('.users').first().empty()
    @collection.each (u) ->
      view = new UserView({model: u})
      container.append(view.render().$el)