if (window.o != null) {
  o.extend('log', function() {
    return function(next, lastValue) {
      console.log(lastValue);

      next();
    };
  });
}
