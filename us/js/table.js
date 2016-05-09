var $ = require('./dom.js');
var filter = require('./filters.js');

const bindEvent = require('./events.js');
const $ls = require('./ls.js');
const $c = require('./common.js')();

function Table(node, name, settings, sortKey){
  this._header = null;
  this._body = null;
  this._footer = null;
  this._ctxMenu = $('#contextMenu').node();

  this._name = name;
  this._sortKey = sortKey ? sortKey : "id";

  this._structure = {};
  this._content = [];
  this._renderContent = [];
  this._onIndexContent = null;
  //this._size = [];
  this._filters = {};
  this._openFilter = null;
  this._sort = {
    cell: null,
    type: null
  };
  this._settingsKey = settings;
  this._settings = $ls.load(this._settingsKey);
  this._setups = this._settings[this._name];
  this._rows = 0;
  this._renderRows = 0;
  this._indexedKeys = [];

  this._icons = {
    sortDown: "data:image/gif;base64,R0lGODlhBwAUAIABAARrAf///yH5BAEAAAEALAAAAAAHABQAAAIQjI+py+0BogRwHpno27yzAgA7",
    sortUp: "data:image/gif;base64,R0lGODlhBwAUAIABAARrAf///yH5BAEAAAEALAAAAAAHABQAAAIQjI+py+0IEphn2mDz27yrAgA7",
    sortNull: "data:image/gif;base64,R0lGODlhBwAUAIABAARrAf///yH5BAEAAAEALAAAAAAHABQAAAIUjI+pywYJ4ok00NvglXtK9GTiiBQAOw=="
  };

  this._ini(node);
}

Table.prototype = {
  _ini: function(node){
    var h, b, f;

    if(typeof node == "number")
      node = $('table[class="tabs-content"]').node().rows[node];

    h = $('<div>')
      .class("set", "tab-content")
      .node();

    b = $('<div>')
      .class("set", "tab-content-scroll")
      .html('<table align="center" type="padding" width="100%"></table>')
      .node();

    f = $('<div>')
      .class("set", "tab-content")
      .node();

    node.cells[0].appendChild(h);
    node.cells[0].appendChild(b);
    node.cells[0].appendChild(f);

    this._header = h;
    this._body = b.firstElementChild;
    this._footer = f;

    if(this._setups == null){
      this._settings[this._name] = {
        sort: {
          type: 1,
          cell: "id"
        },
        filters: {}
      };
      this._setups = this._settings[this._name];
      this._saveSettings();
    }
  },

  _changeSortImage: function(){
    var value, type, oldImg, newImg;

    value = this._setups.sort.cell;
    type = this._setups.sort.type;

    if(value != this._sort.cell){
      oldImg = $(this._header).find(`td[sort="${this._sort.cell}"]`).node().lastElementChild;
      oldImg.src = this._icons.sortNull;
    }

    newImg = $(this._header).find(`td[sort="${value}"]`).node().lastElementChild;
    newImg.src = type ? this._icons.sortDown : this._icons.sortUp;
  },

  _setSortImage: function(td, cell){
    var img = $(td).find('img').node();

    if(this._setups.sort.cell != cell){
      img.src = this._icons.sortNull;
    }else{
      img.src = this._setups.sort.type ? this._icons.sortDown : this._icons.sortUp;
    }
  },

  _setSort: function(){
    this._sort.cell = this._setups.sort.cell;
    this._sort.type = this._setups.sort.type;
  },

  _setStructureIndex: function(index, key){
    this._indexedKeys[index] = key;
  },

  _setCountCheck: function(){
    $(this._footer).find('b[type="countCheck"]').html(
      $(this._body).find('tr[class="light checked"]').length
    );
  },

  _setContentValue: function(index, key, value){
    this._renderContent[index][key] = value;
  },

  _setCountRows: function(){
    $(this._footer).find('b[type="countRows"]').html(this._renderRows + '/' + this._rows);
  },

  _sorting: function(){
    var value, type, array, sKey;

    array = this.getContent(true);
    value = this._setups.sort.cell;
    type = this._setups.sort.type;
    sKey = this._sortKey;

    array.sort(
      function(e1, e2){
        var p1, p2, res;

        p1 = e1[value]; p2 = e2[value];

        if(typeof p1 == "object"){
          p1 = p1[1];
          p2 = p2[1];
        }

        res = compare(p1, p2);
        if(res == 0) res = compare(e1[sKey], e2[sKey]);
        if(type) res = res == -1 ? 1 : -1;

        return res;
      }
    );

    function compare(e1, e2){
      if (e1 > e2) return 1;
      else if (e1 < e2) return -1;
      else return 0;
    }
  },

  _setSizes: function(){
    var table = this;

    $(this._header).find('td[sort]').each((cell)=>{
      setWidth(cell, "sort");
    });

    $(this._footer).find('td[filter], td[cell]').each((cell)=>{
      setWidth(cell, "filter");
    });

    function setWidth(cell, type){
      var width, key;

      key = $(cell).attr(type);
      if(!key) key = $(cell).attr("cell");
      width = table._structure[key].width;

      if(width > 0){
        cell.width = width;
      }
    }
  },

  _filtering: function(row){
    var filter, value, fv, rv, length, list;

    filter = this._setups.filters;
    list = Object.keys(filter);
    length = list.length;

    while(length--){
      value = list[length];
      fv = filter[value];
      rv = row[value];

      switch (fv.type){
        case "boolean":
          rv = rv != 0;
          if (fv.value != rv) return false;
          break;

        case "multiple":
          if(!$c.exist(rv, fv.value)) return false;
          break;

        case "check":
          if(typeof rv == "object") rv = rv[1];
          if(!$c.exist(rv, fv.value)) return false;
          break;

        default:
          if(compare(fv, row[value])) return false;
      }
    }
    return true;

    function compare(k, n){
      if(isNaN(n)) n = parseInt(n, 10);
      return !(k.min <= n && n <= k.max);
    }
  },

  _bindSorting: function(callback){
    var value, table = this;

    $(table._header).find('td[sort]').each(function(td){
      value = td.getAttribute("sort");
      table._setSortImage(td, value);

      bindEvent(td, 'onclick', sorting);
    });
    /////////////////////////////

    function sorting(td){
      var cell;

      table._setSort();
      cell = td.getAttribute("sort");

      if(cell == table._setups.sort.cell){
        table._setups.sort.type = table._setups.sort.type == 0 ? 1 : 0;
      }else{
        table._setups.sort.cell = cell;
        table._setups.sort.type = 1;
      }

      table._changeSortImage();
      table._saveSettings();
      callback("sort");
    }
  },

  _bindFilters: function(callback){
    var table = this;

    $(table._footer).find('td[filter]').each(function(td){
      var value, ft;

      value = $(td).attr("filter");
      ft = table._structure[value].filter;
      if(ft == null) return;

      if(table._setups.filters[value]){
        $(td).class("set", "enable");
      }

      bindEvent(td, 'onclick', filtering, [ft, value]);
    });
    /////////////////////////////

    function filtering(ft, value, td){
      if(table._filters[value] == null){
        table._filters[value] = filter("#filtersWindow", table, td, ft, value);
      }
      table._filters[value].activate(callback);
    }
  },

  _bindCheckAll: function(){
    var table = this;

    bindEvent($(table._footer).find('span[type="checkAll"]'), 'onclick', click);

    function click(button){
      var b = $(button), status;

      status = b.text() == "[отметить всё]";
      b.text(status ? "[снять всё]" : "[отметить всё]");

      $(table._body)
        .find('input[type="checkbox"]')
        .each(
          function(box, index){
            if(status){
              action(box, "light checked", status, index);
            }else{
              action(box, "light", status, index);
            }
          }
        );

      table._setCountCheck();

      function action(box, name, check, index){
        $(box).up('tr').class("set", name);
        box.checked = check;
        table._setContentValue(index, "check", check);
      }
    }
  },

  _saveSettings: function(){
    $ls.save(this._settingsKey, this._settings);
  },

  ////////////////////// Public Methods ////////////////////////////////////////////////////////////////////////////////
  /**
   * @returns {string}
   */
  getName: function(){
    return this._name;
  },

  /**
   * @param {boolean=} render
   * @returns {Array}
   */
  getContent: function(render){
    return render ? this._renderContent : this._content;
  },

  /**
   * @param {boolean=} all
   * @returns {[object, object, ...]}
   */
  getCheckedContent: function(all){
    var result = [];

    $(this._body).find('tr[class="light checked"]').each((tr)=>{
      result.push(this._renderContent[tr.rowIndex]);
    });

    return all && result.length == 0 ? [this._onIndexContent] : result;
  },

  /**
   * @param {string} key
   * @param {boolean=} check
   * @returns {string}
   */
  getWidth: function(key, check){
    var width;

    if(this._structure[key]){
      width = check ? this._structure[key].width - 17 : this._structure[key].width;
      return width != -1 ? `width="${width}"` : "";
    }
  },

  /**
   * @param td
   * @returns {string|null}
   */
  getKeysOnCell: function(td){
    return this._indexedKeys[td.cellIndex];
  },

  /**
   * @param {object} element
   * @param {boolean=} render
   */
  pushContent: function(element, render){
    if(render){
      this._renderContent.push(element);
      this._renderRows++;
    }else{
      this._content.push(element);
      this._rows++;
    }
  },

  /**
   * @param {boolean=} render
   */
  clearContent: function(render){
    if(render){
      this._renderContent = [];
      this._renderRows = 0;
      $(this._footer).find('span[type="checkAll"]').html("[отметить всё]");
      $(this._footer).find('b[type="countCheck"]').html(0);
    }else{
      this._content = [];
      this._rows = 0;
    }
  },

  /**
   * @param {{key:[width, type, text]}, ...} array
   */
  setStructure: function(array){
    var table = this;

    Object.keys(array).forEach(function(key, index){
      var value, type = null, text = null;

      value = array[key];
      table._setStructureIndex(index, key);

      if(value[1]) type = /\|/.test(value[1]) ? value[1].split(/\|/) : [value[1]];
      if(value[2]) text = /\|/.test(value[2]) ? value[2].split(/\|/) : [value[2]];

      table._structure[key] = {
        width: value[0],
        filter: type ? {
          type: type,
          header: text[0],
          rTrue: text[1] ? text[1] : null,
          rFalse: text[2] ? text[2] : null
        } : null
      };
    });
  },

  /**
   * @param {string} html
   */
  setHeader: function(html){
    this._header.innerHTML = html;
  },

  /**
   * @param {string} html
   */
  setFooter: function(html){
    this._footer.innerHTML = html;
  },

  /**
   * @param {function} callback
   * @param {boolean=} sizes
   * @param {boolean=} sorting
   * @param {boolean=} filtering
   */
  setControls: function(callback, sizes, sorting, filtering){
    if(sizes) this._setSizes();
    if(sorting) this._bindSorting(callback);
    if(filtering) this._bindFilters(callback);
    this._bindCheckAll();
  },

  bindClickRow: function(contextMenu){
    var table = this;

    $(this._body)
      .find('tr')
      .each((node)=>{
        bindEvent(node, 'onclick', leftClick, [], null, true);
        if(!contextMenu) return;
        bindEvent(node, "contextmenu", rightClick, [], null, true);
      });
    /////////////////////////////

    function leftClick(node, event){
      var box, action;

      if(event.target.nodeName == "A") return;
      if($(table._ctxMenu).node().style.visibility == "visible")
        return;

      box = $(node).find('input[type="checkbox"]').node();
      box.checked = !box.checked;
      action = box.checked ? "add" : "remove";
      $(node).class(action, "checked");

      table._setContentValue(node.rowIndex, "check", box.checked);
      table._setCountCheck();
    }
    /////////////////////////////

    function rightClick(node, event){
      var menu, elem;

      elem = event.target;
      if(elem.nodeName != "TD") return;
      event.preventDefault();

      menu = $(table._ctxMenu).class("set", table.name).attr("index", node.rowIndex).node();
      menu.style.left = event.clientX;
      menu.style.top = event.clientY + document.body.scrollTop;
      menu.style.visibility = "visible";
    }
  },

  /**
   * @param {string} mode
   */
  prepare: function(mode){
    var table = this;

    if(mode == "filter"){
      this.clearContent(true);
      this.getContent().forEach((row)=>{
        row.check = false;
        if(table._filtering(row)) table.pushContent(row, true);
      });
    }
    this._sorting();
    this._setCountRows();
  },

  /**
   * @param {string} html
   * @param {boolean=} add
   */
  render: function(html, add){
    $(this._body).html(html, add);
  }
};


/**
 * @param node
 * @param {string} name
 * @param {object} settings
 * @param {string=} sortKey
 * @returns {Table}
 */
module.exports = function (node, name, settings, sortKey){
  return new Table(node, name, settings, sortKey);
};