var $ = require('./dom');
const bindEvent = require('./events');
const $c = require('./common')();

function Table(nodesID, settingsKey, settings){
  this.header = nodesID[0];
  this.body = nodesID[1];
  this.footer = nodesID[2];
  this.name = settingsKey;
  this.structure = {};
  this.content = [];
  this.size = [];
  //this.themes = $sd.forums[$cd.fid].themes;
  //this.players = $sd.players;
  this.sort = {
    cell: null,
    type: null
  };
  this.settings = settings;
  this.rows = 0;
}

Table.prototype = {
  /**
   * @returns {string}
   */
  getName: function(){
    return this.name;
  },

  /**
   * @returns {object[]}
   */
  getContent: function(){
    return this.content;
  },

  /**
   * @returns {number}
   */
  getLastRowContent: function(){
    return this.rows - 1;
  },

  /**
   * @param {object} element
   */
  pushContent: function(element){
    this.content.push(element);
  },

  /**
   */
  clearContent: function(){
    this.content = [];
    this.rows = 0;
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
    this.content[index][key] = value;
  },

  /**
   * @param {object} icons
   */
  changeSortImage: function(icons){
    var value, type, oldImg, newImg;

    value = this.settings.sort[this.name].cell;
    type = this.settings.sort[this.name].type;

    if(value != this.sort.cell){
      oldImg = $(this.header).find(`td[sort="${this.sort.cell}"]`).node().lastChild;
      oldImg.src = icons.sortNull;
    }

    newImg = $(this.header).find(`td[sort="${value}"]`).node().lastChild;
    newImg.src = type ? icons.sortDown : icons.sortUp;
  },

  /**
   * @param {string} td
   * @param {string} cell
   * @param {object} icons
   */
  setSortImage: function(td, cell, icons){
    var img = $(td).find('img').node();

    if(this.settings.sort[this.name].cell != cell){
      img.src = icons.sortNull;
    }else{
      img.src = this.settings.sort[this.name].type ? icons.sortDown : icons.sortUp;
    }
  },

  /**
   *
   */
  setSort: function(){
    this.sort.cell = this.settings.sort[this.name].cell;
    this.sort.type = this.settings.sort[this.name].type;
  },

  /**
   *
   */
  sorting: function(){
    var value, type, array;

    array = this.getContent();
    value = this.settings.sort[this.name].cell;
    type = this.settings.sort[this.name].type;

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
   * @param {object} icons
   * @param {Function} callback
   */
  setSorts: function(icons, callback){
    var table = this;

    $(table.header).find('td[sort]').nodeArr().forEach(function(td){
      var value;

      value = td.getAttribute("sort");
      table.setSortImage(td, value, icons);
      bindEvent(td, 'onclick', ()=>{
        var cell, name = table.getName();

        table.setSort(icons);

        cell = td.getAttribute("sort");
        if(cell == table.settings.sort[name].cell){
          table.settings.sort[name].type = table.settings.sort[name].type == 0 ? 1 : 0;
        }else{
          table.settings.sort[name].cell = cell;
          table.settings.sort[name].type = 1;
        }

        table.changeSortImage(icons);
        table.sorting();

        //saveToLocalStorage('settings');

        callback(true);
      });
    });
  },

  /**
   * @param {{key:[width, type, text]}, ...} v
   */
  setStructure: function(v){
    var table = this;

    Object.keys(v).forEach(function(key){
      var value, type = null, text = null;

      value = v[key];
      if(value[1]) type = /\|/.test(value[1]) ? value[1].split(/\|/) : [value[1]];
      if(value[2]) text = /\|/.test(value[2]) ? value[2].split(/\|/) : [value[2]];

      table.structure[key] = {
        width: value[0],
        filterType: type,
        filterName: text
      };
    });
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
   * @param {object} icons
   * @param {Function} callback
   */
  setFilters: function(icons, callback){
    var table = this, name = this.getName();

    $(table.footer).find('td[filter]').nodeArr().forEach(function(td){
      var value, ico;

      value = $(td).attr("filter");

      if(table.structure[value].filterType){
        ico = table.settings.show[name][value] ? icons.boxOn : icons.boxOff;
        ico = `<img src="${icons.filter}"><img style="margin-left: 1px;" src="${ico}"/>`;

        $(td).html(ico);

        bindEvent(td, 'onclick', function(){
          callback(value, td, table.settings.show[name], table.structure[value].filterType, table.structure[value].filterName);
        });
      }
    });
  },

  /**
   * @param {object} row
   * @returns {boolean}
   */
  filtering: function(row){
    var filter, value, length, list;

    filter = this.settings.show[this.name];
    list = Object.keys(filter);
    length = list.length;

    while(length--){
      value = list[length];

      switch (filter[value].type){
        case "boolean":
          if (filter[value].value != row[value]) return false;
          break;

        case "multiple":
          if(!$c.exist(row[value], filter[value].value)) return false;
          break;

        case "check":
          if(!$c.exist(row[value][1], filter[value].value)) return false;
          break;

        default:
          if(compare(filter[value], row[value])) return false;
      }
    }
    return true;

    function compare(k, n){
      if(isNaN(n)) n = parseInt(n, 10);
      return !(k.min <= n && n <= k.max);
    }
  }
};

/**
 * @param {string[]} nodesID
 * @param {string} settingsKey
 * @param {object} settings
 * @returns {Table}
 */
module.exports = function (nodesID, settingsKey, settings){
  return new Table(nodesID, settingsKey, settings);
};