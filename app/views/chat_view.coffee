View = require './view'
template = require './templates/chat'

MessageView = require './message_view'

module.exports = class ChatView extends View
  className: 'chat-view'
  template: template
  
  events:
    'click input.send': 'post'
    'keydown input.body': 'keydown'
  
  initialize: ->
    # listen to receive events
    @model.on 'receive', (message) =>
      console.log 'chat:received', message
      view = new MessageView({model: message})
      el = view.render().$el
      console.log el
      el.appendTo( @$('.slider'))
      console.log 'scroll'
      @$('.conversation').first().scrollTop(@$('.slider').first().height() - @$('.conversation').first().height())

  after_render: ->
    # focus
    @focus()
    
  keydown: (evt) ->
    console.log evt.which
    @$('input.send').click() if evt.which == 13 # enter
    
  focus: ->
    @$('input.body').focus()

  post: ->
    # read message from input and post it
    @model.post_body (input_body = @$('input.body')).val()      
    # clear the input
    input_body.val('')
      
    # handle the busy state
    @model.on 'change:busy', (busy) =>
      console.log 'busy', busy
      @$('input.send').first().attr('disabled', busy)
    
    @focus()
  
  get_render_data: ->
    console.log @model.remotes, @model.remotes.at(0)
    {
      title: "Chat with #{if @model.remotes.length > 1 then @model.remotes.length+' people' else @model.remotes.at(0).get 'name'}"
    }