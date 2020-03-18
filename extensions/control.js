if (window.o != null) {
  o.extend('focus', function(maybeSelector) {
    return function(next, context) {
      o.getElement(context, maybeSelector).focus();

      next();
    };
  });

  o.extend('setValue', function(selectorOrValue, value) {
    return function(next, context) {
      var el = value != null ? o.getElement(context, selectorOrValue) : o.getElement(context);

      if (el) {
        if (value != null) {
          el.value = value;
        } else if (selectorOrValue != null) {
          el.value = selectorOrValue;
        }
      }

      next();
    };
  });
}
