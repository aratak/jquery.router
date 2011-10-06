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
        return this.callback.apply(this, this.rule.exec(location));
      };
      return Router;
    })();
    RouteSet = (function() {
      RouteSet.prototype.findMatchedRoute = function() {
        var passRoute;
        passRoute = null;
        $.each(this.routes, __bind(function(i) {
          var route;
          route = this.routes[i];
          passRoute = route.match(this.location);
          return !(passRoute != null);
        }, this));
        return passRoute;
      };
      RouteSet.prototype.process = function() {
        var passRoute;
        passRoute = this.findMatchedRoute();
        if (passRoute != null) {
          return passRoute.fireCallback(this.location);
        }
      };
      RouteSet.prototype.addRoute = function(rawMatch, callback) {
        return this.routes.push(new Router(rawMatch, callback));
      };
      function RouteSet(rawRoutesHash, location) {
        this.location = location;
        this.routes = [];
        $.each(rawRoutesHash, __bind(function(rawMatch, callback) {
          return this.addRoute(rawMatch, callback);
        }, this));
      }
      return RouteSet;
    })();
    return $.router = function(options) {
      options = $.extend({}, options);
      return $.history.init(__bind(function(hash) {
        $.router.routeset = new RouteSet(options, hash);
        return $.router.routeset.process(hash);
      }, this));
    };
  })(jQuery);
}).call(this);
