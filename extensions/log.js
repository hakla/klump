if (window.o != null) {
  o.extend('log', function(value) {
    return function(next, context) {
      if (value !== undefined) {
        console.log(value, context);
      } else {
        console.log(context);
      }

      next();
    };
  });
}
