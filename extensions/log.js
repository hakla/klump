if (window.o != null) {
  o.extend('log', function() {
    return function(next, context) {
      console.log(context);

      next();
    };
  });
}
