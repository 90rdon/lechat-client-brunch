Model = require './model'

module.exports = class Message extends Model
  
  initialize: ->
    @set 'time', (new Date()).getTime() if !@get('time')?
