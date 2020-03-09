function load(next, extensions) {
  var base = './';

  function addScript(url, next) {
    var newScript = document.createElement('script');
    newScript.onload = next;

    document.head.appendChild(newScript);
    newScript.src = base + url;
  }

  addScript('o.js', function() {
    if (Array.isArray(extensions)) {
      var counter = extensions.length;

      for (var i = 0; i < extensions.length; i++) {
        var extension = extensions[i];

        addScript('extensions/' + extension + '.js', function() {
          if (--i === 0) {
            next(window.o);
          }
        });
      }
    } else {
      next(window.o);
    }
  });
}
