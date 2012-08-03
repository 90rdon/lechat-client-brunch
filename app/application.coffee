Conversation = require 'models/conversation'
Message = require 'models/message'
Collection = require 'models/collection'

# The application bootstrapper.
Application =
  initialize: (@io_host, @io_port) ->
    HomeView = require 'views/home_view'
    UsersView = require 'views/users_view'
    User = require 'models/user'
    Router = require 'lib/router'
    
    # the selected user
    @user = null
    @channel = null
    @conversations = {}
    
    @all_users = new Collection([
      new User({id: 1, name: 'Arnold'}),
      new User({id: 2, name: 'Bruce'}),
      new User({id: 3, name: 'Chris'}),
    ])

    # Ideally, initialized classes should be kept in controllers & mediator.
    # If you're making big webapp, here's more sophisticated skeleton
    # https://github.com/paulmillr/brunch-with-chaplin
    @homeView = new HomeView(@)
    @usersView = new UsersView({collection: @all_users})

    # Instantiate the router
    @router = new Router()
    # Freeze the object
    #Object.freeze? this
    
    head.js "http://#{@io_host}:#{@io_port}/socket.io/socket.io.js", =>
      console.log 'connecting to socket', url = "http://#{@io_host}:#{@io_port}"
      @socket = io.connect url
      # listen for 'joined' events
      @socket.on 'joined', (data) =>
        console.log 'joined', data
        @socket.on 'receive', (data) =>
          console.log 'app: received', data
          if (correspondent_id = data.from)?
            conversation = @start_chat_with(@all_users.get(correspondent_id))
            conversation.receive new Message(data)
      # start navigation
      @router.home()

  set_user: (user) ->
    console.log 'set user', @user
    if !@user? || user.id != @user.id
      @user = user
      # join the user's channel to receive updates
      @socket.emit 'join', {channel: @channel = @user.id}
      # go to home
      @router.home()
    
  start_chat_with: (other) ->
    return false if !@user? || !other?
    conversation = (@conversations[other.id] ||= new Conversation(@socket, @user, new Collection([other])))
    @homeView.show_chat_view_for conversation
    conversation

module.exports = Application
