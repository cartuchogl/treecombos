/*
Script: treecombos.js
  MooTools ul li trees to comboboxes

License:
  MIT

Version:
  0.1

Copyright:
  Copyright (c) 2011 [Carlos Bolaños](http://wocp.net).

Dependencies:
  - MooTools Core 1.2.3 (http://mootools.net)

Options:
  - tree: ($() object) ul li tree to convert
  - destination: ($() object) div to inject selects
  - mode: mootools inject where option, default bottom

Notes:
  TODO

*/
var TreeCombos = new Class({
  options: {
    tree: null,
    destination: null,
    level: 0,
    mode:"bottom"
  },
  _current_level: null,
  _select: null,
  _next: null,
  initialize: function(options) {
    this.options = $merge(this.options, options);
  },
  create: function() {
    this._current_level = this.options.tree.getChildren('li');
    if (this._select == null) {
      this._select = new Element('select', {
        'class': 'level' + this.options.level,
        'events': {
          'change': this._onchange.bind(this)
        }
      });
      this._select.inject(this.options.destination, this.options.mode);
    } else {
      this._select.set('html', '');
    }
    var kk = this._select;
    (new Element('option', {value: '', text: 'Elige'})).inject(kk);
    this._current_level.each(function(item) {
      (new Element('option', {
        value: item.get('id').substr(4),
        text: item.getChildren('a')[0].get('text')
      })).inject(kk);
    });
    this.destroyChilds(true);
  },
  destroyChilds: function(first) {
    if (this._next) {
      this._next.destroyChilds(false);
    }
    if (!first) {
      this._select.destroy();
    }
    this._next = null;
  },
  update: function() {
    var tmp = this.options.tree.getElement(
      '#IIDD' + this._select.get('value') + ' > ul'
    );
    var kk = tmp.getChildren('li').length;
    if (kk < 1) {
      this.destroyChilds(true);
    } else {
      if (this._next == null) {
        this._next = new TreeCombos({
          tree: tmp,
          destination: this.options.destination,
          level: this.options.level + 1,
          mode: this.options.mode
        });
      } else {
        this._next.options.tree = tmp;
      }
      this._next.create();
    }
  },
  select: function(li) {
    var ary = [];
    ary.unshift(li.get('id').substr(4));
    var parent = li.getParent('li');
    while (parent) {
      ary.unshift(parent.get('id').substr(4));
      parent = parent.getParent('li');
    }
    var current = this;
    for (var c = 0; c < ary.length; c++) {
      current._select.set('value', ary[c]);
      current.update();
      current = current._next;
    }
    if (current && current._next) {
      current.destroyChilds(true);
    }
    return ary;

  },
  _onchange: function(event) {
    this.update();
  }
});
