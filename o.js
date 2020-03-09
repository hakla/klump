(function() {
  function o() {
    var steps = [];

    var context = {};

    function execute(i, lastValue) {
      if (steps.length > i) {
        steps[i](function(nextValue) {
          if (nextValue === undefined) {
            nextValue = lastValue;
          } else if (nextValue !== null && typeof nextValue === 'object') {
            nextValue = merge(lastValue, nextValue);
          }

          context = nextValue;

          execute(i + 1, nextValue);
        }, lastValue);
      }

      return context;
    }

    function getEl(maybeContext, maybeSelector) {
      var el;

      if (maybeSelector != null) {
        el = select(maybeSelector);
      }

      if (el == null && maybeContext != null) {
        el = maybeContext.el;
      }

      return el;
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

    var stepDefinition = {
      addStylesheet: function(url) {
        return function(next) {
          var link = document.createElement('link');

          link.onload = function() {
            next();
          };

          link.href = url;
          link.rel = 'stylesheet';

          document.head.appendChild(link);
        };
      },

      addScript: function(url) {
        return function(next) {
          var newScript = document.createElement('script');

          newScript.onload = function() {
            next();
          };

          document.head.appendChild(newScript);
          newScript.src = url;
        };
      },

      click: function(maybeSelector) {
        return function(next, lastValue) {
          getEl(lastValue, maybeSelector).click();

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
        return function(next, lastValue) {
          var nextValue = cb(lastValue);

          next(nextValue);
        };
      },

      focus: function(maybeSelector) {
        return function(next, lastValue) {
          getEl(lastValue, maybeSelector).focus();

          next();
        };
      },

      resetStyle: function(maybeSelector) {
        return function(next, lastValue) {
          var el = getEl(lastValue, maybeSelector);

          if (el.dataset.backupStyle != null) {
            el.style = el.dataset.backupStyle;
          }

          next();
        };
      },

      select: function(selector) {
        return function(next) {
          var el = select(selector);

          next({
            el: el,
          });
        };
      },

      setStyle: function(selectorOrStyle, style) {
        return function(next, lastValue) {
          var el =
            style != null
              ? getEl(lastValue, selectorOrStyle)
              : getEl(lastValue);

          el.dataset.backupStyle = el.style.cssText;
          el.style = style || selectorOrStyle;

          next();
        };
      },

      setValue: function(selectorOrValue, value) {
        return function(next, lastValue) {
          var el =
            value != null
              ? getEl(lastValue, selectorOrValue)
              : getEl(lastValue);

          el.value = value;

          next();
        };
      },
    };

    var o = {};

    for (var key in stepDefinition) {
      if (stepDefinition.hasOwnProperty(key)) {
        o[key] = (function(key) {
          return function() {
            steps.push(
              stepDefinition[key].apply(
                window,
                Array.prototype.slice.call(arguments)
              )
            );

            return o;
          };
        })(key);
      }
    }

    o.run = function() {
      return execute(0);
    };

    return o;
  }

  window.o = o;
})();

//# sourceURL=o.js
