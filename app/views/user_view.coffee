application = require '/application'
template = require 'views/templates/user'
View = require './view'

module.exports = class UserView extends View
  template: template

  get_render_data: ->
    @model.attributes
    
  after_render: ->
    console.log @$('input.choose')
    @$('input.choose').click =>
      console.log 'click'
      application.set_user @model