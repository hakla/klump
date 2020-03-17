(function() {
  function load(n, e) {
    function o(n, e) {
      var o = document.createElement('script');
      (o.onload = e),
        document.head.appendChild(o),
        (o.src = 'https://cdn.jsdelivr.net/gh/hakla/klump@941324f/' + n);
    }
    o('o.js', function() {
      if (Array.isArray(e)) {
        e.length;
        for (var t = 0; t < e.length; t++) {
          o('extensions/' + e[t] + '.js', function() {
            0 == --t && n(window.o);
          });
        }
      } else n(window.o);
    });
  }

  load(
    function(o) {
      var $ = o.$;

      function button(text, cb) {
        var button = el('button', 'border: none', text);

        button.addEventListener('click', cb);

        return button;
      }

      function el(name, style, content) {
        var el = document.createElement(name);

        if (style != null) {
          el.style = style;
        }

        if (content != null) {
          if (typeof content === 'string') {
            el.innerHTML = content;
          } else if (Array.isArray(content)) {
            for (var i = 0; i < content.length; ++i) {
              el.appendChild(content[i]);
            }
          }
        }

        return el;
      }

      o()
        .addStylesheet('https://unpkg.com/easymde/dist/easymde.min.css')
        .addScript('https://unpkg.com/easymde/dist/easymde.min.js')
        .execute(function() {
          var div = el(
            'div',
            'position: fixed; top: 100px; right: 0px; height: 200px; width: 200px; background-color: #fff; z-index: 100001',
            [
              el('p', '', [
                button('In Progress', function() {
                  window
                    .o()
                    .click('.icon.icon-edit')
                    .delay(200)
                    .setValue('#issue_status_id', 2)
                    .run();
                }),
              ]),
              el('p', '', [
                button('In Progress (0%)', function() {
                  window
                    .o()
                    .click('.icon.icon-edit')
                    .delay(200)
                    .setValue('#issue_status_id', 2)
                    .setValue('#issue_done_ratio', 0)
                    .run();
                }),
              ]),
              el('p', '', [
                button('Fix available', function() {
                  window
                    .o()
                    .click('.icon.icon-edit')
                    .delay(200)
                    .setValue('#issue_status_id', 9)
                    .setValue('#issue_done_ratio', 100)
                    .run();
                }),
                el('p', '', [
                  button('Edit', function() {
                    window
                      .o()
                      .click('.icon.icon-edit')
                      .delay(200)
                      .click('p>a>.icon.icon-edit')
                      .delay(0)
                      .select('#issue_description')
                      .focus()
                      .setStyle(
                        'position: fixed; top: 0; left: 0; height: 100%; z-index: 100000; padding: 100px 25%; width: 50%; font-size: 16px; border: none;'
                      )
                      .run();
                  }),
                ]),
                el('p', '', [
                  button('Edit done', function() {
                    window
                      .o()
                      .resetStyle('#issue_description')
                      .run();
                  }),
                ]),
                el('p', '', [button('Edit MD', editMD)]),
                el('p', '', [button('Edit done MD', editMDDone)]),
              ]),
            ]
          );

          document.body.appendChild(div);
        })
        .registerKey('ctrl alt e', function() {
          if ($('#unique-md-random-id-uhflkjasdf__container') != null) {
            editMDDone();
          } else {
            editMD();
          }
        })
        .registerKey('ctrl alt r', function() {
          o()
            .click('.icon.icon-edit')
            .delay(200)
            .execute(function() {
              var hours = prompt('stunden?');

              $('#issue_estimated_hours').value = hours;
            });
        })
        .registerKey('ctrl alt w', function() {
          o()
            .click('#relations > .contextual > a')
            .delay(10)
            .setValue('#relation_issue_to_id', prompt('ticket'))
            .click('#new-relation-form input[type=submit]');
        })
        .registerKey('ctrl Enter', function() {
          $('#issue-form').submit();
        });

      function editMD() {
        window
          .o()
          .click('.icon.icon-edit')
          .delay(200)
          .click('p>a>.icon.icon-edit')
          .delay(0)
          .select('#issue_description')
          .execute(function(context) {
            var textarea = el('textarea');
            textarea.value = context.el.value;
            textarea.id = 'unique-md-random-id-uhflkjasdf';

            var div = el(
              'div',
              'position: fixed; top: 0; left: 0; height: 100%; z-index: 100000; padding: 100px 25%; width: 100%; font-size: 16px; border: none; background: #fff; overflow: scroll; box-sizing: border-box;',
              [textarea]
            );

            div.id = 'unique-md-random-id-uhflkjasdf__container';

            document.body.appendChild(div);

            document.documentElement.dataset.overflow = String(
              document.documentElement.style.overflow
            );

            document.documentElement.style.overflow = 'hidden';

            window.unique_mde_redmine = new EasyMDE({
              autofocus: true,
              element: textarea,
            });
          })
          .run();
      }

      function editMDDone() {
        window
          .o()
          .select('#issue_description')
          .execute(function(context) {
            var el = context.el;

            window.unique_mde_redmine.toTextArea();

            el.value = $('#unique-md-random-id-uhflkjasdf').value;

            $('#unique-md-random-id-uhflkjasdf__container').remove();

            document.documentElement.style.overflow = document.documentElement.dataset.overflow;
          })
          .run();
      }
    },
    ['styles', 'control', 'loader', 'keys']
  );
})();

//# sourceURL=redmine.js
