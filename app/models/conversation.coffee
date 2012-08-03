application = require '/application'
Model = require './model'
Message = require '/models/message'

module.exports = class Conversation extends Model
  
  constructor: (@socket, @local, @remotes) ->
    super()
    
  initialize: ->
      
  post_body: (string) ->
    @post new Message({body: string, sender: @local})    
      
  post: (message) ->
    @set 'sending', true
    # prepare and send the message
    socket_message = 
      from: message.get('sender').id
      body: message.get('body')
    @remotes.each (recipient) =>
      console.log 'posting', {channel: recipient.id, message: socket_message}
      @socket.emit('post', {channel: recipient.id, message: socket_message});
    @set 'sending', false
    @trigger 'receive', message
    
  receive: (message) ->
    if (sender_id = message.get 'from')?
      message.set 'sender', (if sender_id == @local.id then @local else @remotes.get sender_id)
    @trigger 'receive', message
    