var $ = require('./dom.js');
var filter = require('./filters.js');

const bindEvent = require('./events.js');
const $ls = require('./ls.js');
const $c = require('./common.js')();

function Table(nodesID, settingsKey, settings, icons){
  this.header = nodesID[0];
  this.body = nodesID[1];
  this.footer = nodesID[2];
  this.ctxMenu = nodesID[3];
  this.name = settingsKey;
  this.icons = icons;
  this.structure = {};
  this.content = [];
  this.renderContent = [];
  this.size = [];
  this.filters = {};
  this.sort = {
    cell: null,
    type: null
  };
  this.settings = settings;
  this.setups = this.settings[this.name];
  this.rows = 0;
  this.renderRows = 0;
  this.indexedKeys = [];

  this.ini();
}

Table.prototype = {
  ini: function(){
    if(this.setups == null){
      this.settings[this.name] = {
        sort: {
          type: 1,
          cell: "id"
        },
        filters: {}
      };
      this.setups = this.settings[this.name];
      this.saveSettings();
    }
  },

  /**
   * @returns {string}
   */
  getName: function(){
    return this.name;
  },

  /**
   * @param {boolean=} render
   * @returns {Array}
   */
  getContent: function(render){
    return render ? this.renderContent : this.content;
  },

  /**
   * @param {number} index
   * @param {boolean=} render
   * @returns {object}
   */
  getContentOnIndex: function(index, render){
    var content = render == null ? this.renderContent : this.content;
    return content[index];
  },

  /**
   * @returns {Array}
   */
  getCheckedContent: function(){
    var result = [];

    this.getChecked().forEach((tr)=>{
      result.push(this.renderContent[tr.rowIndex]);
    });

    return result;
  },

  /**
   * @returns {Array}
   */
  getChecked: function(){
    return $(this.body).find('tr[class="light checked"]').nodeArr();
  },

  /**
   * @param {boolean=} render
   * @returns {number}
   */
  getLastRowContent: function(render){
    return render ? this.renderRows - 1 : this.rows - 1;
  },

  /**
   * @param {object} element
   * @param {boolean=} render
   */
  pushContent: function(element, render){
    if(render){
      this.renderContent.push(element);
      this.renderRows++;
    }else{
      this.content.push(element);
      this.rows++;
    }
  },

  /**
   * @param {boolean=} render
   */
  clearContent: function(render){
    if(render){
      this.renderContent = [];
      this.renderRows = 0;
      $(this.footer).find('span[type="checkAll"]').html("[отметить всё]");
      $(this.footer).find('b[type="countCheck"]').html(0);
    }else{
      this.content = [];
      this.rows = 0;
    }
  },

  /**
   * @returns {object}
   */
  getStructure: function(){
    return this.structure;
  },

  /**
   * @param {string} key
   * @param {boolean|null} check
   * @returns {string}
   */
  getWidth: function(key, check){
    var width;

    if(this.structure[key]){
      width = check ? this.structure[key].width - 17 : this.structure[key].width;
      return width != -1 ? `width="${width}"` : "";
    }
  },

  /**
   * @param {number} index
   * @param {string} key
   * @param {*} value
   */
  setContentValue: function(index, key, value){
    this.renderContent[index][key] = value;
  },

  /**
   */
  changeSortImage: function(){
    var value, type, oldImg, newImg;

    value = this.setups.sort.cell;
    type = this.setups.sort.type;

    if(value != this.sort.cell){
      oldImg = $(this.header).find(`td[sort="${this.sort.cell}"]`).node().lastChild;
      oldImg.src = this.icons.sortNull;
    }

    newImg = $(this.header).find(`td[sort="${value}"]`).node().lastChild;
    newImg.src = type ? this.icons.sortDown : this.icons.sortUp;
  },

  /**
   * @param {string} td
   * @param {string} cell
   */
  setSortImage: function(td, cell){
    var img = $(td).find('img').node();

    if(this.setups.sort.cell != cell){
      img.src = this.icons.sortNull;
    }else{
      img.src = this.setups.sort.type ? this.icons.sortDown : this.icons.sortUp;
    }
  },

  setSort: function(){
    this.sort.cell = this.setups.sort.cell;
    this.sort.type = this.setups.sort.type;
  },

  /**
   */
  setCountRows: function(){
    $(this.footer).find('b[type="countRows"]').html(this.renderRows + '/' + this.rows);
  },

  /**
   */
  setCountCheck: function(){
    $(this.footer).find('b[type="countCheck"]').html(
      this.getChecked().length
    );
  },

  /**
   */
  sorting: function(){
    var value, type, array;

    array = this.getContent(true);
    value = this.setups.sort.cell;
    type = this.setups.sort.type;

    array.sort(
      function(e1, e2){
        var p1, p2, res, i1, i2;

        p1 = e1[value]; p2 = e2[value];
        i1 = e1.id; i2 = e2.id;

        if(typeof p1 == "object"){
          p1 = p1[1];
          p2 = p2[1];
        }

        res = compare(p1, p2);
        if(res == 0) res = compare(i1, i2);
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

  /**
   * @param {Function} callback
   */
  setSorts: function(callback){
    var table = this;

    $(table.header).find('td[sort]').nodeArr().forEach(function(td){
      var value;

      value = td.getAttribute("sort");
      table.setSortImage(td, value);
      bindEvent(td, 'onclick', ()=>{
        var cell;

        table.setSort();

        cell = td.getAttribute("sort");
        if(cell == table.setups.sort.cell){
          table.setups.sort.type = table.setups.sort.type == 0 ? 1 : 0;
        }else{
          table.setups.sort.cell = cell;
          table.setups.sort.type = 1;
        }

        table.changeSortImage();
        table.saveSettings();
        callback("sort");
      });
    });
  },

  /**
   * @param {{key:[width, type, text]}, ...} v
   */
  setStructure: function(v){
    var table = this;

    Object.keys(v).forEach(function(key, index){
      var value, type = null, text = null;

      value = v[key];
      table.setStructureIndex(index, key);

      if(value[1]) type = /\|/.test(value[1]) ? value[1].split(/\|/) : [value[1]];
      if(value[2]) text = /\|/.test(value[2]) ? value[2].split(/\|/) : [value[2]];

      table.structure[key] = {
        width: value[0],
        filter: type ? {
          type: type,
          header: text[0],
          rTrue: text[1],
          rFalse: text[2]
        } : null
      };
    });
  },

  setStructureIndex: function(index, key){
    this.indexedKeys[index] = key;
  },

  /**
   * @param td
   * @returns {string}
   */
  getKeysOnCell: function(td){
    return this.indexedKeys[td.cellIndex];
  },

  /**
   *
   */
  setSizes: function(){
    var table = this;

    $(this.header).find('td[sort]').nodeArr().forEach((cell)=>{
      table.setWidth(cell, "sort");
    });

    $(this.footer).find('td[filter]').nodeArr().forEach((cell)=>{
      table.setWidth(cell, "filter");
    });
  },

  /**
   * @param cell
   * @param {string} type
   */
  setWidth: function(cell, type){
    var width, key;

    key = $(cell).attr(type);
    width = this.structure[key].width;

    if(width > 0){
      cell.width = width;
    }
  },

  /**
   * @param {Function} callback
   */
  setFilters: function(callback){
    var table = this;

    $(table.footer).find('td[filter]').nodeArr().forEach(function(td){
      var value, ft;

      value = $(td).attr("filter");
      ft = table.structure[value].filter;

      if(table.setups.filters[value]){
        $(td).class("set", "enable");
      }

      bindEvent(td, 'onclick', function(){
        if(table.filters[value] == null){
          table.filters[value] = filter("#sf_filtersWindow", table, td, ft, value);
        }
        table.filters[value].activate(callback);
      });

    });
  },

  /**
   * @param {object} row
   * @returns {boolean}
   */
  filtering: function(row){
    var filter, value, fv, rv, length, list;

    filter = this.setups.filters;
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

  /**
   * @param {boolean=} contextMenu
   */
  bindClickRow: function(contextMenu){
    var table = this;

    $(this.body)
      .find('tr')
      .nodeArr()
      .forEach((node)=>{
        bindEvent(node, 'onclick',()=>{
          var box, action;

          if($(table.ctxMenu).node().style.visibility == "visible")
            return;

          box = $(node).find('input[type="checkbox"]').node();
          box.checked = !box.checked;
          action = box.checked ? "add" : "remove";
          $(node).class(action, "checked");

          table.setContentValue(node.rowIndex, "check", box.checked);
          table.setCountCheck();
        });

        if(!contextMenu) return;

        bindEvent(node, "contextmenu", (event)=>{
          var menu, elem;

          elem = event.target;
          if(elem.nodeName != "TD") return;
          //if(table.getKeysOnCell(elem) != "name") return;
          event.preventDefault();

          menu = $(table.ctxMenu).class("set", table.name).attr("index", node.rowIndex).node();
          menu.style.left = event.clientX;
          menu.style.top = event.clientY + document.body.scrollTop;
          menu.style.visibility = "visible";
        });
      });
  },

  /**
   */
  bindCheckAll: function(){
    var table = this;
    var button = $(table.footer).find('span[type="checkAll"]').node();

    bindEvent(button, 'onclick', ()=>{
      var b = $(button), status;

      status = b.text() == "[отметить всё]";
      b.text(status ? "[снять всё]" : "[отметить всё]");

      $(table.body)
        .find('input[type="checkbox"]')
        .nodeArr()
        .forEach(
          function(box, index){
            if(status){
              action(box, "light checked", status, index);
            }else{
              action(box, "light", status, index);
            }
          }
        );

      table.setCountCheck();
    });

    function action(box, name, check, index){
      $(box).up('tr').class("set", name);
      box.checked = check;
      table.setContentValue(index, "check", check);
    }
  },

  /**
   * @param {string} mode
   */
  prepare: function(mode){
    if(mode == "filter"){
      this.clearContent(true);
      this.getContent().forEach((row)=>{
        row.check = false;
        if(this.filtering(row)) this.pushContent(row, true);
      });
    }
    this.sorting();
    this.setCountRows();
  },
  /**
   * @param {string} html
   * @param {boolean=} add
   */
  render: function(html, add){
    $(this.body).html(html, add);
  },

  saveSettings: function(){
    $ls.save("gk_SF_settings", this.settings);
  }
};

/**
 * @param {string[]} nodesID
 * @param {string} settingsKey
 * @param {object} settings
 * @param {object} icons
 * @returns {Table}
 */
module.exports = function (nodesID, settingsKey, settings, icons){
  return new Table(nodesID, settingsKey, settings, icons);
};