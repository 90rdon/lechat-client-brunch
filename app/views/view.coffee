require 'lib/view_helper'

# Base class for all views.
module.exports = class View extends Backbone.View
  template: ->
    return

  get_render_data: ->
    return

  render: =>
    # console.debug "Rendering #{@constructor.name}"
    @$el.html @template @get_render_data()
    @after_render()
    this

  after_render: ->
    return
