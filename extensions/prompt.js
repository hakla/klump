if (window.o != null) {
  (function() {
    o.extend('prompt', prompt);

    o.extend('promptNewValue', function(question, maybeDefaultValue) {
      return [prompt(question, maybeDefaultValue), updateValue()];
    });

    function prompt(question, maybeDefaultValue) {
      return function(next, context) {
        var answer = window.prompt(question, o.evaluate(maybeDefaultValue));

        next({
          answer: answer,
        });
      };
    }

    function updateValue() {
      return function(next, context) {
        var el = o.getElement(context);

        if (el && el.value !== undefined) {
          if (context.answer) {
            el.value = context.answer;
          }
        }

        next();
      };
    }
  })();
}
