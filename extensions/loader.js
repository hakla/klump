if (window.o != null) {
  o.extend('addScript', function(url) {
    return function(next) {
      var newScript = document.createElement('script');

      newScript.onload = function() {
        next();
      };

      document.head.appendChild(newScript);
      newScript.src = url;
    };
  });

  o.extend('addStylesheet', function(url) {
    return function(next) {
      var link = document.createElement('link');

      link.onload = function() {
        next();
      };

      link.href = url;
      link.rel = 'stylesheet';

      document.head.appendChild(link);
    };
  });
}
