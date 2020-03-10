(function() {
  load(
    function(o) {
      o()
        .waitForKey('shift alt e')
        .select('#test')
        .log()
        .execute(function(context) {
          context.el.value = Math.round(Math.random() * 10 + 1);
        })
        .setStyle('border: none');
    },
    ['log', 'control', 'styles', 'keys']
  );
})();
