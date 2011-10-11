(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  (function($) {
    var RouteSet, Router;
    if ($.history == null) {
      throw "$.history is required. https://github.com/tkyk/jquery-history-plugin";
    }
    Router = (function() {
      function Router(rule, callback) {
        this.rule = rule;
        this.callback = callback;
        this.rule = new RegExp(this.rule);
      }
      Router.prototype.match = function(location) {
        if (this.rule.test(location)) {
          return this;
        }
      };
      Router.prototype.fireCallback = function(location) {
        return $(__bind(function() {
          return this.callback.apply(this, this.rule.exec(location));
        }, this));
      };
      return Router;
    })();
    RouteSet = (function() {
      RouteSet.prototype.findAllMatchedRoutes = function(location, setOfRoutes) {
        return setOfRoutes.filter(function(route) {
          return route.match(location) != null;
        });
      };
      RouteSet.prototype.findMatchedRoute = function(location, setOfRoutes) {
        return this.findAllMatchedRoutes(location, setOfRoutes)[0];
      };
      RouteSet.prototype.processWithSetOfRoutes = function(location, setOfRoutes, findMethodType) {
        var findMethod, passRoute, _i, _len, _ref;
        if (findMethodType == null) {
          findMethodType = 'one';
        }
        if (findMethodType === 'one') {
          findMethod = __bind(function(location, setOfRoutes) {
            return this.findMatchedRoute(location, setOfRoutes);
          }, this);
        } else if ('all') {
          findMethod = __bind(function(location, setOfRoutes) {
            return this.findAllMatchedRoutes(location, setOfRoutes);
          }, this);
        }
        _ref = $(findMethod(location, setOfRoutes)).toArray();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          passRoute = _ref[_i];
          console.log(passRoute);
          passRoute.fireCallback(location);
        }
        return true;
      };
      RouteSet.prototype.beforeFilterProcess = function(location) {
        return this.processWithSetOfRoutes(location, this.filters.before_all, 'all');
      };
      RouteSet.prototype.requestProcess = function(location) {
        return this.processWithSetOfRoutes(location, this.routes, 'one');
      };
      RouteSet.prototype.afterFilterProcess = function(location) {
        return this.processWithSetOfRoutes(location, this.filters.after_all, 'all');
      };
      RouteSet.prototype.process = function(location) {
        return this.beforeFilterProcess(location) && this.requestProcess(location) && this.afterFilterProcess(location);
      };
      RouteSet.prototype.addRoute = function(rawMatch, callback) {
        return this.routes.push(new Router(rawMatch, callback));
      };
      RouteSet.prototype.addFilter = function(rawMatch, callback, filterPosition) {
        return this.filters[filterPosition].push(new Router(rawMatch, callback));
      };
      RouteSet.prototype.add = function(rawRoutesHash, filter) {
        if (filter == null) {
          filter = false;
        }
        if (!filter) {
          return $.each(rawRoutesHash, __bind(function(rawMatch, callback) {
            return this.addRoute(rawMatch, callback);
          }, this));
        } else {
          return $.each(rawRoutesHash, __bind(function(rawMatch, callback) {
            return this.addFilter(rawMatch, callback, filter);
          }, this));
        }
      };
      function RouteSet(rawRoutesHash) {
        this.routes = [];
        this.filters = {
          after_all: [],
          before_all: []
        };
        this.add(rawRoutesHash);
      }
      return RouteSet;
    })();
    return $.router = function(options) {
      options = $.extend({}, options);
      $.router.routeset = new RouteSet(options.routes);
      $.router.filters = function(options, filterType) {
        if (options == null) {
          options = {};
        }
        return $.router.routeset.add(options, filterType);
      };
      $.router.filters(options.after_all, 'after_all');
      $.router.filters(options.before_all, 'before_all');
      return $.history.init(__bind(function(hash) {
        return $.router.routeset.process(hash);
      }, this));
    };
  })(jQuery);
}).call(this);
