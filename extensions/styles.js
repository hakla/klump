if (window.o != null) {
  o.extend('resetStyle', function(maybeSelector) {
    return function(next, lastValue) {
      var el = o.getElement(lastValue, maybeSelector);

      if (el.dataset.backupStyle != null) {
        el.style = el.dataset.backupStyle;
      }

      next();
    };
  });

  o.extend('setStyle', function(selectorOrStyle, style) {
    return function(next, context) {
      var el = style != null ? o.getElement(context, selectorOrStyle) : o.getElement(context);

      el.dataset.backupStyle = el.style.cssText;
      el.style = style || selectorOrStyle;

      next();
    };
  });
}
