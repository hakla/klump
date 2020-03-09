(function() {
  function _(initialContext) {
    var steps = [];

    var globalContext = {};

    function execute(i, context) {
      if (steps.length > i) {
        steps[i](function(nextContext) {
          if (nextContext === undefined) {
            nextContext = context;
          } else if (nextContext !== null && typeof nextContext === 'object') {
            nextContext = merge(context, nextContext);
          }

          globalContext = nextContext;

          execute(i + 1, nextContext);
        }, context);
      }

      return globalContext;
    }

    var stepDefinition = {
      click: function(maybeSelector) {
        return function(next, lastValue) {
          getElement(lastValue, maybeSelector).click();

          next();
        };
      },

      delay: function(duration) {
        return function(next) {
          setTimeout(function() {
            next();
          }, duration);
        };
      },

      execute: function(cb) {
        return function(next, context) {
          var nextContext = cb(context);

          next(nextContext);
        };
      },

      select: function(selector) {
        return function(next) {
          var el = select(selector);

          if (el) {
            next({
              el: el,
            });
          } else {
            console.warn('Cannot find element matching selector: ' + selector);

            next({
              el: {},
            });
          }
        };
      },
    };

    var o = {};

    var fns = merge(stepDefinition, _.extensions);
    var timeout;

    for (var key in fns) {
      if (fns.hasOwnProperty(key)) {
        o[key] = (function(key) {
          return function() {
            steps.push(fns[key].apply(window, Array.prototype.slice.call(arguments)));

            if (timeout != null) {
              clearTimeout(timeout);
            }

            timeout = setTimeout(function() {
              o.run();
            }, 0);

            return o;
          };
        })(key);
      }
    }

    o.run = function() {
      if (initialContext instanceof Element) {
        initialContext = {
          el: initialContext,
        };
      }

      return execute(0, initialContext);
    };

    return o;
  }

  _.extensions = {};
  _.getElement = getElement;
  _.matches = matches;
  _.merge = merge;
  _.select = select;

  _.extend = function(name, fn) {
    _.extensions[name] = fn;
  };

  window.o = _;

  function getElement(maybeContext, maybeSelector) {
    var el;

    if (maybeSelector != null) {
      el = select(maybeSelector);
    }

    if (el == null && maybeContext != null) {
      el = maybeContext.el;
    }

    return el;
  }

  function matches(a, b) {
    var match = true;

    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        match = match && a[key] === b[key];
      }
    }

    return match;
  }

  /**
   * Shallow merge two objects into a new one
   */
  function merge(a, b) {
    var c = {};

    if (a != null) {
      for (var key in a) {
        if (a.hasOwnProperty(key)) {
          c[key] = a[key];
        }
      }
    }

    if (b != null) {
      for (var key in b) {
        if (b.hasOwnProperty(key)) {
          c[key] = b[key];
        }
      }
    }

    return c;
  }

  function select(selector) {
    return document.querySelector(selector);
  }
})();

//# sourceURL=o.js
