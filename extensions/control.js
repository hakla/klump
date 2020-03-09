if (window.o != null) {
  o.extend('focus', function(maybeSelector) {
    return function(next, lastValue) {
      o.getElement(lastValue, maybeSelector).focus();

      next();
    };
  });

  o.extend('setValue', function(selectorOrValue, value) {
    return function(next, lastValue) {
      var el = value != null ? o.getElement(lastValue, selectorOrValue) : o.getElement(lastValue);

      el.value = value || selectorOrValue;

      next();
    };
  });
}
