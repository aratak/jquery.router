(($)->
  throw "$.history is required. https://github.com/tkyk/jquery-history-plugin" unless $.history?

  class Router
    constructor: (@rule, @callback)-> @rule = new RegExp(@rule)
    match: (location)-> @ if @rule.test location
    fireCallback: (location)-> @callback.apply @, @rule.exec(location)

  class RouteSet
    findMatchedRoute: ->
      passRoute = null
      $.each @routes, (i)=>
        route = @routes[i]
        passRoute = route.match(@location)
        !passRoute?
      passRoute

    process: ->
      passRoute = @findMatchedRoute()
      passRoute.fireCallback(@location) if passRoute?

    addRoute: (rawMatch, callback)->
      @routes.push new Router(rawMatch, callback)

    constructor: (rawRoutesHash, @location)->
      @routes = []
      $.each rawRoutesHash, (rawMatch, callback)=>
        @addRoute(rawMatch, callback)



  $.router = (options)->
    options = $.extend {}, options
    $.history.init (hash)=>
      $.router.routeset = new RouteSet(options, hash)
      $.router.routeset.process(hash)

)(jQuery)
