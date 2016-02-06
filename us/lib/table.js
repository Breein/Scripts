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
   * @param {object} icons
   * @param {Function} callback
   */
  setControl: function(icons, callback){
    this.setSorts(icons, callback);
    this.setFilters(icons);
  },

  /**
   * @returns {object}
   */
  getStructure: function(){
    return this.structure;
  },

  /**
   * @param {number[]} array
   */
  setWidth: function(array){
    var table = this;

    array.forEach(function(element, id){
      table.size[id] = element;
    });
  },

  /**
   * @param {number} index
   * @param {boolean|null} check
   * @returns {string}
   */
  getWidth: function(index, check){
    var width;

    if(this.size[index]){
      width = check ? this.size[index] - 17 : this.size[index];
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
   * @param {number} id
   * @returns {object[]}
   */
  setContent: function(id){
    var table, o;

    table = this;
    o = {};

    Object.keys(table.getStructure()).forEach(function(value){
      if(table.structure[value].path.length == 2){
        o[value] = eval(table.structure[value].path[0] + "['" + id + "']" + table.structure[value].path[1]);
      }else{
        if(table.structure[value].path[0] == "Number(id)"){
          o[value] = Number(id);
        }
      }
    });

    if(!table.filtering(o)) return null;

    table.pushContent(o);
    return table.content[table.getLastRowContent()];
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

        callback();
      });
    });
  },

  /**
   * @param {*[]} values
   */
  setStructure: function(values){
    var table= this;

    values.forEach(function(elem){
      table.structure[elem[0]] = {
        filterType: elem[1],
        filterName: elem[2]
      };
    });
  },

  /**
   * @param {object} icons
   */
  setFilters: function(icons){
    var table = this;

    $(table.footer).find('td[filter]').nodeArr().forEach(function(td){
      var value, ico;

      value = $(td).attr("filter");

      if(table.structure[value].filterType){
        ico = table.settings.show.themes[value] ? icons.boxOn : icons.boxOff;
        ico = `<img src="${icons.filter}"><img style="margin-left: 1px;" src="${ico}"/>`;

        $(td).html(ico);

        //bindEvent(td, 'onclick', function(){
        //  doFilter(td, table.settings, table.structure[value].filterType, table.structure[value].filterName);
        //});
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
          if(!$c.exist(row[value][0], filter[value].value)) return false;
          break;

        default:
          if (compare(filter[value].value , row[value])) return false;
      }
    }
    return true;

    function compare(k, n){
      if(isNaN(n)) n = parseInt(n, 10);
      return !(k[0] <= n && n <= k[1]);
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