if (window.o != null) {
  (function() {
    o.extend('prompt', prompt);

    o.extend('promptNewValue', function(question, maybeDefaultValue) {
      return [prompt(question), promptNewValue(maybeDefaultValue)];
    });

    function prompt(question, maybeDefaultValue) {
      return function(next, context) {
        var answer = window.prompt(question);

        next({
          answer: answer,
        });
      };
    }

    function promptNewValue(maybeDefaultValue) {
      return function(next, context) {
        var el = o.getElement(context);

        if (el && el.value !== undefined) {
          if (context.answer) {
            el.value = context.answer;
          } else if (maybeDefaultValue) {
            el.value = o.evaluate(maybeDefaultValue);
          }
        }

        next();
      };
    }
  })();
}
