(($)->
  throw "$.history is required. https://github.com/tkyk/jquery-history-plugin" unless $.history?

  class Router
    constructor: (@rule, @callback)-> @rule = new RegExp(@rule)
    match: (location)-> @ if @rule.test location
    fireCallback: (location)-> $(=> @callback.apply @, @rule.exec(location) )

  class RouteSet

    findAllMatchedRoutes: (location, setOfRoutes)->
      setOfRoutes.filter (route)->
        route.match(location)?

    findMatchedRoute: (location, setOfRoutes)->
      @findAllMatchedRoutes(location, setOfRoutes)[0]

    processWithSetOfRoutes: (location, setOfRoutes, findMethodType='one')->
      if findMethodType is 'one'
        findMethod = (location, setOfRoutes)=> @findMatchedRoute(location, setOfRoutes)
      else if 'all'
        findMethod = (location, setOfRoutes)=> @findAllMatchedRoutes(location, setOfRoutes)

      for passRoute in $(findMethod(location, setOfRoutes)).toArray()
        console.log passRoute
        passRoute.fireCallback(location)
      true

    beforeFilterProcess: (location)->
      @processWithSetOfRoutes(location, @filters.before_all, 'all')

    requestProcess: (location)->
      @processWithSetOfRoutes(location, @routes, 'one')

    afterFilterProcess: (location)->
      @processWithSetOfRoutes(location, @filters.after_all, 'all')

    process: (location)->
      @beforeFilterProcess(location) and @requestProcess(location) and @afterFilterProcess(location)

    addRoute: (rawMatch, callback)->
      @routes.push new Router(rawMatch, callback)

    addFilter: (rawMatch, callback, filterPosition)->
      @filters[filterPosition].push new Router(rawMatch, callback)

    add: (rawRoutesHash, filter=false)->
      unless filter
        $.each rawRoutesHash, (rawMatch, callback)=>
          @addRoute(rawMatch, callback)
      else
        $.each rawRoutesHash, (rawMatch, callback)=>
          @addFilter(rawMatch, callback, filter)

    constructor: (rawRoutesHash)->
      @routes = []
      @filters =
        after_all: []
        before_all: []
      @add(rawRoutesHash)

  $.router = (options)->
    options = $.extend {}, options
    $.router.routeset = new RouteSet(options.routes)
    $.router.filters = (options={}, filterType)-> $.router.routeset.add(options, filterType)
    $.router.filters(options.after_all, 'after_all')
    $.router.filters(options.before_all, 'before_all')

    $.history.init (hash)=>
      $.router.routeset.process(hash)

)(jQuery)
