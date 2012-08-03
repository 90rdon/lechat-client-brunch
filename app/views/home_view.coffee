View = require './view'
template = require './templates/home'
ChatView = require './chat_view'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template

  constructor: (@app) ->
    super()
    @_chat_views = {}

  get_render_data: ->
    {
      user: @user().attributes if @user()?
      other_users: @other_users().map((u) -> u.attributes)
    }
  
  user: ->
    @app.user
  
  other_users: ->
    _(@app.all_users.filter((u) => u.id != @user().id))
    
  after_render: ->
    @other_users().each (u) =>
      @$('#chat-with-user-'+u.id).click =>
        @app.start_chat_with u
        
  show_chat_view_for: (conversation) ->
    cid = conversation.cid
    if !@_chat_views[cid]?
      # create and store the view
      @_chat_views[cid] = view = new ChatView({model: conversation})
      # display it
      @$('.chat-windows').first().append(view.render().$el)
    @_chat_views[cid]
    