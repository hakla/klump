if (window.o != null) {
  o.extensions = {
    log: function() {
      return function(next, lastValue) {
        console.log(lastValue);
        next();
      };
    },
  };
}
