if (window.o != null) {
  (function() {
    o.extend('waitForKey', function(combo) {
      return function(next, context) {
        var el = o.getElement(context, 'body');

        createKeyHandler(el, combo, function() {
          next(context);
        });
      };
    });

    o.extend('registerKey', function(combo, cb) {
      return function(next, context) {
        var el = o.getElement(context, 'body');

        createKeyHandler(el, combo, function() {
          cb(context);
        });

        next();
      };
    });

    function createKeyHandler(el, combination, cb) {
      var combinations = parseCombination(combination);
      var counter = 0;

      el.addEventListener('keydown', function keyDownHandler(event) {
        if (matches(event, combinations[counter]) === true) {
          event.preventDefault();

          if (combinations.length > counter + 1) {
            ++counter;
          } else {
            cb();

            counter = 0;
          }
        } else {
          counter = 0;
        }
      });
    }

    function mapCombo(combination) {
      var o = {};

      var parts = combination.split('+');

      for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];

        if (part === 'ctrl') {
          o.ctrlKey = true;
        } else if (part === 'shift') {
          o.shiftKey = true;
        } else if (part === 'alt') {
          o.altKey = true;
        } else if (part === 'meta') {
          o.metaKey = true;
        } else {
          if (o.ctrlKey && o.altKey) {
            var code = part.charCodeAt(0);

            if (code > 47 && code < 58) {
              o.code = 'Digit' + part[0];
            }
          } else {
            o.key = part.toLowerCase();
          }
        }
      }

      return o;
    }

    function matches(event, combination) {
      return o.matches(
        {
          altKey: event.altKey,
          code: event.code,
          ctrlKey: event.ctrlKey,
          key: event.key.toLowerCase(),
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
        },
        combination
      );
    }

    function parseCombination(combination) {
      var combinations = [];

      var parts = combination.split(' ');

      for (var i = 0; i < parts.length; ++i) {
        combinations.push(mapCombo(parts[i].trim()));
      }

      return combinations;
    }
  })();
}
