if (window.o != null) {
  (function() {
    o.extend('registerKey', function(combo, cb) {
      return function(next, context) {
        var combinations = [];
        var el = o.getElement(context, 'body');
        var counter = 0;

        var parts = combo.split(',');

        for (var i = 0; i < parts.length; ++i) {
          combinations.push(mapCombo(parts[i].trim()));
        }

        el.addEventListener('keydown', function keyDownHandler(event) {
          if (o.matches(event, combinations[counter]) === true) {
            if (combinations.length > counter + 1) {
              ++counter;
            } else {
              cb(context);

              counter = 0;
            }
          } else {
            counter = 0;
          }
        });

        next();
      };
    });

    function mapCombo(combination) {
      var o = {};
      var parts = combination.toLowerCase().split(' ');

      for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];

        if (part === 'ctrl') {
          o.ctrlKey = true;
        } else if (part === 'shift') {
          o.shiftKey = true;
        } else if (part === 'alt') {
          o.altKey = true;
        } else {
          o.code = 'Key' + part.toUpperCase();
        }
      }

      return o;
    }
  })();
}
