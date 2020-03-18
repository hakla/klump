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

      o().registerKey('ctrl+1', o.pipe(pipe1, pipe2));

      function pipe1(o) {
        o.log('1');
      }

      function pipe2(o) {
        o.log('2');
      }
    },
    ['log', 'control', 'styles', 'keys', 'prompt']
  );
})();
