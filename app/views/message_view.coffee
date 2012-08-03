View = require './view'
template = require './templates/message'


module.exports = class MessageView extends View
  className: 'message'
  template: template
  
  get_render_data: ->
    {
      body: @model.get 'body'
      time: @model.get 'time'
      sender: {
        name: @model.get('sender').get 'name'
      }
    }