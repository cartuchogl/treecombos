/*
Script: treecombos.js
  Jquery ul li trees to comboboxes

License:
  MIT

Version:
  0.1

Copyright:
  Copyright (c) 2011 [Carlos Bolaños](http://wocp.net).

Dependencies:
  - Jquery

Options:
  - tree: ($() object) ul li tree to convert
  - destination: ($() object) div to inject selects
  - mode: mootools inject where option, default bottom (TODO)

Notes:
  TODO

*/

function TreeCombos(options) {
    var defaults = {
      tree: null,
      destination: null,
      level: 0,
      mode:"bottom",
      select_text:"Elige"
    };
    this._current_level = null;
    this._select = null;
    this._next = null;
    this.options = $.extend(defaults, options);
}

TreeCombos.prototype.create = function() {
  this._current_level = this.options.tree.children('li');
  if (this._select == null) {
    this._select = $(document.createElement('select'));
    this._select.addClass('level' + this.options.level);
    this._select.change(this._onchange.bind(this));
    // TODO: support for mode
    this.options.destination.append(this._select);
  } else {
    this._select.html('');
  }
  var kk = this._select;
  var opt = $(document.createElement("option")).attr('value','').html(this.options.select_text);
  this._select.append(opt);
  
  this._current_level.each(function(index,item) {
    var opt = $(document.createElement("option"));
    opt.attr("value",$(item).attr('id').substr(4));
    opt.html($($(item).children('a')[0]).html());
    kk.append(opt);
  });
  this.destroyChilds(true);
};

TreeCombos.prototype._onchange = function(event) {
  this.update();
};

TreeCombos.prototype.destroyChilds = function(first) {
  if (this._next) {
    this._next.destroyChilds(false);
  }
  if (!first) {
    this._select.remove();
  }
  this._next = null;
};

TreeCombos.prototype.update = function() {
  var tmp = $(
    '#IIDD' + this._select.attr('value') + ' > ul'
  );
  var kk = tmp.children('li').length;
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
};

TreeCombos.prototype.select = function(lip) {
  var li = $($(lip)[0]);
  var ary = [];
  ary.unshift(li.attr('id').substr(4));
  var parent = $(li.parents('li'));
  while (parent.length>0) {
    ary.unshift(parent.attr('id').substr(4));
    parent = $(parent.parents('li'));
  }
  var current = this;
  for (var c = 0; c < ary.length; c++) {
    current._select.attr('value', ary[c]);
    current.update();
    current = current._next;
  }
  if (current && current._next) {
    current.destroyChilds(true);
  }
  return ary;
}
