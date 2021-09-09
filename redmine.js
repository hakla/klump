javascript: (function() {
  function load(n, e) {
    function o(n, e) {
      var o = document.createElement('script');
      (o.onload = e),
        document.head.appendChild(o),
        (o.src = 'https://cdn.jsdelivr.net/gh/hakla/klump@ad95c58/' + n);
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

  function updateField(selector) {
    return function(value) {
      return function(o) {
        o.setValue(selector, value);
      };
    };
  }

  var redmine = {
    addRelation: function(o) {
      o.click('#relations > .contextual > a')
        .delay(10)
        .select('#relation_issue_to_id')
        .promptNewValue('ticket')
        .click('#new-relation-form input[type=submit]')
        .click('#relations > .contextual > a');
    },

    setDoneRatio: updateField('#issue_done_ratio'),
    setEntryActivity: updateField('#time_entry_activity_id'),
    setEntryComments: updateField('#time_entry_comments'),
    setEntryHours: updateField('#time_entry_hours'),
    setEstimatedHours: updateField('#issue_estimated_hours'),
    setStatus: updateField('#issue_status_id'),

    focusEditor: function(o) {
      o.click('p>a>.icon.icon-edit')
        .delay(0)
        .select('#issue_description')
        .focus()
        .setStyle(
          'position: fixed; top: 0; left: 0; height: 100%; z-index: 100000; padding: 100px 25%; width: 50%; font-size: 16px; border: none;'
        );
    },

    unfocusEditor: function(o) {
      o.resetStyle('#issue_description');
    },

    openEditor: function(o) {
      o.click('.icon.icon-edit');
    },
  };

  load(
    function(o) {
      var $ = o.$;

      function button(text, cb) {
        var button = el('a', '', text, [['href', '']]);

        button.addEventListener('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
          cb(event);
        });

        return button;
      }

      function el(name, style, content, attributes = []) {
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

        if (attributes) {
          for (const [key, value] of attributes) {
            el.setAttribute(key, value)
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
            'position: sticky; top: 0; background: inherit; padding: 1rem; margin: 0rem -1rem -1rem; z-index: 1;',
            [
              el('h3', 'margin-top: 0;', 'Custom extensions'),
              el('ul', '', [
                el('li', '', [
                  button(
                    'In Progress (0%)',
                    o.pipe(redmine.openEditor, redmine.setStatus(2), redmine.setDoneRatio(0))
                  )
                ]),
                el('li', '', [
                  button(
                    'Fix available',
                    o.pipe(redmine.openEditor, redmine.setStatus(9), redmine.setDoneRatio(100))
                  ),
                ]),
              ]),
            ]
          );

          const s = document.querySelector('#sidebar');
          s.insertBefore(div, s.childNodes[0]);

          document.querySelector('#wrapper').style.overflow = 'inherit';
        })
        .registerKey('shift+alt+w 1', o.pipe(toggleEdit))
        .registerKey('shift+alt+w 8', o.pipe(toggleEdit, updateEstimatedHours))
        .registerKey('shift+alt+w shift+alt+r', o.pipe(addRelation))
        .registerKey(
          'shift+alt+w shift+alt+w',
          o.pipe(redmine.openEditor, redmine.setStatus(2), updateDone)
        )
        .registerKey(
          'shift+alt+l',
          o.pipe(
            toggleEdit,
            updateStatus,
            updateDone,
            updateActivity,
            updateSpentTime,
            updateComment
          )
        )
        .registerKey('ctrl+Enter', function() {
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

      function addRelation(o) {
        o.pipe(redmine.addRelation);
      }

      function toggleEdit(o) {
        o.click('.icon.icon-edit').delay(10);
      }

      function toggleEditor() {
        if ($('#unique-md-random-id-uhflkjasdf__container') != null) {
          editMDDone();
        } else {
          editMD();
        }
      }

      function updateActivity(o) {
        o.select('#time_entry_activity_id').promptNewValue(
          'Activity? (Design: 8, Development: 9, Meeting: 10, Project Management: 13)'
        );
      }

      function updateComment(o) {
        o.select('#time_entry_comments').promptNewValue('Comment?');
      }

      function updateDone(o) {
        o.select('#issue_done_ratio').promptNewValue('Done?');
      }

      function updateSpentTime(o) {
        o.select('#time_entry_hours').promptNewValue('Spent time?');
      }

      function updateStatus(o) {
        o.select('#issue_status_id').promptNewValue(
          'Status? (In Progress: 2, Postponed: 8, Fix available: 9, Resolved: 3, Closed: 5)',
          2
        );
      }

      function updateEstimatedHours(o) {
        o.select('#issue_estimated_hours').promptNewValue();
      }
    },
    ['styles', 'control', 'loader', 'keys', 'prompt']
  );
})();

//# sourceURL=redmine.js
