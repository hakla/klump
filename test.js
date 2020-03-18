(function() {
  load(
    function(o) {
      o()
        .waitForKey('shift+alt+e')
        .select('#test')
        .log()
        .promptNewValue('Test?', () => Math.round(Math.random() * 10 + 1))
        .setStyle('border: none');

      o()
        .waitForKey('ctrl+alt+2')
        .log('hit ctrl+alt+2');

      o()
        .waitForKey('ctrl+*')
        .log('hit asdf');
    },
    ['log', 'control', 'styles', 'keys', 'prompt']
  );
})();
