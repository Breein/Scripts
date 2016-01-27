(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function Common() {}

Common.prototype = {

  /**
   * @param {number} now
   * @param {number} max
   * @param {boolean} int
   * @returns {number}
   */
  getPercent: function getPercent(now, max, int) {
    var percent;

    if (now == 0 || max == 0) {
      return 0;
    }

    percent = now / max * 100;
    if (int) {
      percent = parseInt(percent, 10);
    } else {
      percent = parseFloat(percent.toFixed(1));
    }

    return percent;
  },

  /**
   *
   * @param {number} date
   * @param {null|boolean} full
   * @returns {object}
   */
  getNormalDate: function getNormalDate(date, full) {
    if (isNaN(date)) return { d: date, t: '-' };
    if (date == 0) return { d: '-', t: '-' };

    date = date * 1000;
    date = new Date(date);
    date = date.toLocaleString();

    date = date.match(/(\d+).(\d+).(\d+), (\d+):(\d+):(.+)/);

    if (full != null) {
      date = {
        d: date[1] + '.' + date[2] + '.' + date[3],
        t: date[4] + ':' + date[5]
      };
    } else {
      date = {
        d: date[1] + '.' + date[2] + '.' + date[3].charAt(2) + date[3].charAt(3),
        t: date[4] + ':' + date[5]
      };
    }

    return date;
  },

  /**
   *
   * @param {number} t
   * @returns {string}
   */
  getNormalTime: function getNormalTime(t) {
    var result, hh, mm, ss;

    hh = 0;
    t = parseInt(t / 1000, 10);

    if (t > 3600) {
      hh = parseInt(t / 3600, 10);
      t = t % 3600;
    }
    mm = parseInt(t / 60, 10);
    ss = parseInt(t % 60, 10);

    if (mm < 10) mm = "0" + mm;
    if (ss < 10) ss = "0" + ss;

    result = mm + ':' + ss;

    if (hh > 0) {
      if (hh < 10) hh = "0" + hh;
      result = hh + ':' + result;
    }
    return result;
  },

  /**
   * @param {number} value
   * @returns {string}
   */
  convertID: function convertID(value) {
    var result, i, j;

    if (value < 1000) return value;

    value = value.toString();
    j = 1;i = value.length;
    result = "";

    while (i--) {
      result = value.charAt(i) + result;
      if (j % 3 == 0 && j != 0 && i != 0) {
        result = ',' + result;
      }
      j++;
    }
    return result;
  },

  /**
   * @param {string} str
   * @returns {string}
   */
  encodeHeader: function encodeHeader(str) {
    var a, string;

    if (!str) return str;

    string = String(str).replace(/%/g, '%25').replace(/\+/g, '%2B').replace(/\n/g, '%0A');
    a = document.createElement('a');
    a.href = "http://www.ganjawars.ru/encoded_str=?" + string;
    string = a.href.split('encoded_str=?')[1];
    string = string.replace(/%20/g, '+').replace(/=/g, '%3D').replace(/&/g, '%26');

    return string;
  },

  /**
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  randomNumber: function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   *
   * @param {*} value
   * @param {*[]} array
   * @returns {boolean}
   */
  exist: function exist(value, array) {
    var length;

    length = array.length;

    while (length--) {
      if (array[length] == value) {
        return true;
      }
    }
    return false;
  }
};

module.exports = function () {
  return new Common();
};

},{}],2:[function(require,module,exports){
"use strict";

function Api(param) {
  this.selector = param;
  this.nodeList = [];
  this.length = 0;
}

Api.prototype = {

  /**
   * @param {null|number} param
   * @returns {Array}
   */
  node: function node(param) {
    if (param != null) {
      if (param == -1) {
        param = this.length - 1;
      }
    } else {
      param = 0;
    }
    return this.nodeList[param] ? this.nodeList[param] : null;
  },

  /**
   * @returns {[]}
   */
  nodes: function nodes() {
    return this.nodeList;
  },

  /**
   * @returns {[]}
   */
  nodeArr: function nodeArr() {
    var nodes, length;

    length = this.nodeList.length;
    nodes = new Array(length);

    while (length--) {
      nodes[length] = this.nodeList[length];
    }

    return nodes;
  },

  /**
   * @returns {string}
   */
  getSelector: function getSelector() {
    return this.selector;
  },

  /**
   * @param {null|*} param
   * @returns {Api|string}
   */
  html: function html(param) {
    if (param != null) {
      this.nodeList[0].innerHTML = param;
      return this;
    } else {
      return this.nodeList[0] ? this.nodeList[0].innerHTML : "This node is null. Selector: " + this.selector;
    }
  },

  /**
   * @returns {string}
   */
  text: function text() {
    return this.nodeList[0] ? this.nodeList[0].textContent : "This node is null. Selector: " + this.selector;
  },

  /**
   * @param {string} attribute
   * @param {string} value
   * @returns {Api}
   */
  attr: function attr(attribute, value) {
    this.nodeList[0].setAttribute(attribute, value);
    return this;
  },

  /**
   * @param {string} param
   * @returns {Api}
   */
  find: function find(param) {
    var text,
        selector,
        node,
        key = false;
    var i,
        length,
        nodesArray = [];

    this.selector = param;
    node = this.nodeList[0] ? this.nodeList[0] : document;

    text = param.match(/(.+):contains\("~(.+)"\)/i);
    if (!text) {
      key = true;
      text = param.match(/(.+):contains\("(.+)"\)/);
    }

    if (text) {
      selector = text[1];
      text = text[2];
    } else {
      selector = param;
      text = null;
    }

    if (text) {
      nodesArray = node.querySelectorAll(selector);
      this.nodeList = [];

      for (i = 0, length = nodesArray.length; i < length; i++) {
        if (key) {
          if (nodesArray[i].textContent == text) {
            this.nodeList.push(nodesArray[i]);
          }
        } else {
          if (nodesArray[i].textContent.search(text) != -1) {
            this.nodeList.push(nodesArray[i]);
          }
        }
      }
    } else {
      this.nodeList = node.querySelectorAll(selector);
    }
    this.length = this.nodeList.length;

    return this;
  },

  /**
   * @param {string} param
   * @returns {Api}
   */
  up: function up(param) {
    var node;

    this.selector += " > up[" + param + "]";
    param = param.toUpperCase();
    node = this.nodeList[0].parentNode;
    this.nodeList = [];

    while (node.nodeName != param) {
      node = node.parentNode;
      if (node == document) {
        this.nodeList[0] = null;
        this.length = 0;

        return this;
      }
    }
    this.nodeList[0] = node;
    this.length = 1;

    return this;
  },

  /**
   * @param {string} param
   * @returns {Api}
   */
  next: function next(param) {
    var node, lastNode;

    this.selector += " > next[" + param + "]";
    param = param.toUpperCase();
    node = this.nodeList[0].nextSibling;
    lastNode = node.parentNode.lastChild;
    this.nodeList = [];

    while (node.nodeName != param) {
      node = node.nextSibling;
      if (node == lastNode) {
        this.nodeList[0] = null;
        this.length = 0;

        return this;
      }
    }
    this.nodeList[0] = node;
    this.length = 1;

    return this;
  }
};

/**
 * @param {*} param
 * @returns {Api}
 */
module.exports = function $(param) {
  var api, str;

  if (typeof param == "string") {
    str = param.match(/<(.+)>/);
    if (str) {
      api = new Api('create("' + str[1] + '")');
      api.nodeList[0] = document.createElement(str[1]);
      api.length = 1;
    } else {
      api = new Api(param).find(param);
    }
  } else {
    api = new Api('set("' + param.nodeName + '")');
    api.nodeList[0] = param;
    api.length = 1;
  }

  return api;
};

},{}],3:[function(require,module,exports){
'use strict';

module.exports = function bindEvent(element, event, callback) {
  if (!element) {
    return;
  }
  if (element.addEventListener) {
    if (event.substr(0, 2) == 'on') {
      event = event.substr(2);
    }
    element.addEventListener(event, callback, false);
  } else if (element.attachEvent) {
    if (event.substr(0, 2) != 'on') {
      event = 'on' + event;
    }
    element.attachEvent(event, callback, false);
  }
};

},{}],4:[function(require,module,exports){
"use strict";

var _Promise = require("babel-runtime/core-js/promise")["default"];

function DB(name) {
  this.o = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  this.t = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  this.kr = window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  this.r = null;
  this.db = null;
  this.tx = null;
  this.store = null;
  this.index = null;
  this.name = name;
  this.modifyingTable = null;
  this.removeTable = null;
  this.iniBase = null;
  this.version = 1;
}

DB.prototype = {

  /**
   *
   */
  connectDB: function connectDB() {
    var _this = this;

    return new _Promise(function (onsuccess) {
      var idb = _this;

      console.log("Run connect, version " + idb.version);

      idb.r = idb.o.open(_this.name, idb.version);

      idb.r.onerror = function () {
        console.log("Error!");
      };

      idb.r.onsuccess = function () {
        idb.db = idb.r.result;
        console.log("Success connect!");
        onsuccess(idb);
      };

      _this.r.onupgradeneeded = function (e) {
        idb.db = e.currentTarget.result;

        if (idb.version == 2) {
          idb.upgrade(true);
          console.log("Create: defaults");
        }
        idb.upgrade(false);
        console.log("Upgraded!");
      };
    });
  },

  /**
   * @param {*[]} list
   */
  setModifyingTableList: function setModifyingTableList(list) {
    this.modifyingTable = list;
  },

  /**
   * @param {*[]} list
   */
  setIniTableList: function setIniTableList(list) {
    this.iniBase = list;
  },
  /**
   * @param {string[]} list
   */
  setRemoveTableList: function setRemoveTableList(list) {
    this.removeTable = list;
  },

  /**
   * @param {boolean} ini
   */
  upgrade: function upgrade(ini) {
    var table,
        todo,
        idb = this;

    todo = ini ? idb.iniBase : idb.modifyingTable;

    if (todo) {
      todo.forEach(function (t) {
        if (idb.exist(t.name)) {
          table = idb.r.transaction.objectStore(t.name);
        } else {
          table = idb.db.createObjectStore(t.name, { keyPath: t.key });
          console.log("Success created: " + t.name);
        }

        if (t.index) {
          t.index.forEach(function (index) {
            table.createIndex(index[0], index[1], { unique: index[2] });
            console.log("Success created index: " + index.toString());
          });
        }
      });
      todo = null;
    }
    if (idb.removeTable) {
      idb.removeTable.forEach(function (t) {
        idb.db.deleteObjectStore(t);
        console.log("Success removed: " + t);
      });
      idb.removeTable = null;
    }
  },

  /**
   *
   * @param {string} name
   * @returns {boolean}
   */
  exist: function exist(name) {
    var length, array;

    array = this.db.objectStoreNames;
    length = array.length;

    while (length--) {
      if (array[length] == name) {
        return true;
      }
    }
    return false;
  },

  /**
   *
   */
  nextVersion: function nextVersion() {
    this.version++;
  },

  /**
   *
   */
  deleteDB: function deleteDB() {
    this.o.deleteDatabase(this.name);
    console.log("Success deleted: " + this.name);
  },

  /**
   * @param {string} table
   * @param {string} index
   * @param {string|number} value
   * @returns {object}
   */
  getOne: function getOne(table, index, value) {
    var _this2 = this;

    return new _Promise(function (onsuccess) {
      _this2.tx = _this2.db.transaction([table], "readonly");
      _this2.store = _this2.tx.objectStore(table);

      if (index == "id") {
        _this2.store.get(value).onsuccess = function (event) {
          onsuccess(event.target.result);
        };
      } else {
        _this2.index = _this2.store.index(index);
        _this2.index = _this2.index.get(value);

        _this2.index.onsuccess = function (event) {
          onsuccess(event.target.result); // здесь возвращается результат
        };
      }
    });
  },

  /**
   * @param {string} table
   * @param {number[]|null} range
   * @param {string|null} index
   */
  getFew: function getFew(table, range, index) {
    var _this3 = this;

    return new _Promise(function (onsuccess) {
      var results = [];
      var krv = range ? _this3.kr.bound(range[0], range[1]) : null;

      _this3.tx = _this3.db.transaction([table], "readonly");
      _this3.store = _this3.tx.objectStore(table);

      if (index) {
        _this3.store = _this3.store.index(index);
      }

      _this3.store.openCursor(krv).onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
          results.push(cursor.value);
          cursor["continue"]();
        } else {
          console.log("Got all results: ");
          onsuccess(results);
        }
      };
    });
  },

  /**
   * @param {string} table
   * @param {object} data
   */
  add: function add(table, data) {
    try {
      this.tx = this.db.transaction([table], "readwrite");
      this.store = this.tx.objectStore(table);

      this.store.put(data);
      console.log("Success added");
      console.log(data);
    } catch (e) {
      console.log("Failed added");
      console.log(e);
    }
  }
};

/**
 * @param {string} name
 *
 */
module.exports = function (name) {
  return new _Promise(function (onsuccess) {
    var db, idb;

    idb = new DB(name);
    db = idb.o.open(name);

    db.onsuccess = function () {
      idb.version = db.result.version == 1 ? 2 : db.result.version;
      db.result.close();

      onsuccess(idb);
    };
  });
};

},{"babel-runtime/core-js/promise":11}],5:[function(require,module,exports){
"use strict";

module.exports = function () {
  /**
   * Вызывает функцию через указанное количество миллисекунд в контексте ctx с аргументами args.
   * @param {int} timeout
   * @param {Object} ctx
   * @param {Array} args
   * @return {Number} Идентификатор таймаута.
   */
  Function.prototype.gkDelay = function (timeout, ctx, args) {
    var func = this;
    return setTimeout(function () {
      func.apply(ctx, args || []);
    }, timeout);
  };

  /**
   * @param {*} value
   * @returns {boolean}
   */
  Array.prototype.gkExist = function (value) {
    var length, array;

    array = this;
    length = array.length;

    while (length--) {
      if (array[length] == value) {
        return true;
      }
    }
    return false;
  };
};

},{}],6:[function(require,module,exports){
'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

module.exports = function (url, method, param) {
  return new _Promise(function (onsuccess, onfailure) {
    var request = new XMLHttpRequest();

    request.open(method, url, true);
    if (method == 'POST') request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(param);

    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
        onsuccess(request.responseText);
      } else if (request.readyState == 4 && request.status != 200) {
        onfailure(request);
      }
    };
  });
};

},{"babel-runtime/core-js/promise":11}],7:[function(require,module,exports){
'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var $ = require('./dom');
var bindEvent = require('./events');

function Table(nodesID, settingsKey, settings) {
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
  getName: function getName() {
    return this.name;
  },

  /**
   * @returns {object[]}
   */
  getContent: function getContent() {
    return this.content;
  },

  /**
   * @returns {number}
   */
  getLastRowContent: function getLastRowContent() {
    return this.rows - 1;
  },

  /**
   * @param {object} element
   */
  pushContent: function pushContent(element) {
    this.content.push(element);
  },

  /**
   */
  clearContent: function clearContent() {
    this.content = [];
    this.rows = 0;
  },

  /**
   * @param {object} icons
   */
  setControl: function setControl(icons) {
    this.setSorts(icons);
    this.setFilters(icons);
  },

  /**
   * @returns {object}
   */
  getStructure: function getStructure() {
    return this.structure;
  },

  /**
   * @param {number[]} array
   */
  setWidth: function setWidth(array) {
    var table = this;

    array.forEach(function (element, id) {
      table.size[id] = element;
    });
  },

  /**
   * @param {number} index
   * @param {boolean|null} check
   * @returns {string}
   */
  getWidth: function getWidth(index, check) {
    var width;

    if (this.size[index]) {
      width = check ? this.size[index] - 17 : this.size[index];
      return width != -1 ? 'width="' + width + '"' : "";
    }
  },

  /**
   * @param {number} id
   * @returns {object[]}
   */
  setContent: function setContent(id) {
    var table, o;

    table = this;
    o = {};

    _Object$keys(table.getStructure()).forEach(function (value) {
      if (table.structure[value].path.length == 2) {
        o[value] = eval(table.structure[value].path[0] + "['" + id + "']" + table.structure[value].path[1]);
      } else {
        if (table.structure[value].path[0] == "Number(id)") {
          o[value] = Number(id);
        }
      }
    });

    if (!table.filtering(o)) return null;

    table.pushContent(o);
    return table.content[table.getLastRowContent()];
  },

  /**
   * @param {object} icons
   */
  changeSortImage: function changeSortImage(icons) {
    var value, type, oldImg, newImg;

    value = this.settings.sort[this.name].cell;
    type = this.settings.sort[this.name].type;

    if (value != this.sort.cell) {
      oldImg = $(this.header).find('td[sort="' + this.sort.cell + '"]').node().lastChild;
      oldImg.src = icons.sortNull;
    }

    newImg = $(this.header).find('td[sort="' + value + '"]').node().lastChild;
    newImg.src = type ? icons.sortDown : icons.sortUp;
  },

  /**
   * @param {string} td
   * @param {string} cell
   * @param {object} icons
   */
  setSortImage: function setSortImage(td, cell, icons) {
    var img = $(td).find('img').node();

    if (this.settings.sort[this.name].cell != cell) {
      img.src = icons.sortNull;
    } else {
      img.src = this.settings.sort[this.name].type ? icons.sortDown : icons.sortUp;
    }
  },

  /**
   *
   */
  setSort: function setSort() {
    this.sort.cell = this.settings.sort[this.name].cell;
    this.sort.type = this.settings.sort[this.name].type;
  },

  /**
   *
   */
  sorting: function sorting() {
    var value, type, array;

    array = this.getContent();
    value = this.settings.sort[this.name].cell;
    type = this.settings.sort[this.name].type;

    array.sort(function (e1, e2) {
      var p1, p2, res;

      p1 = e1[value];p2 = e2[value];

      if (typeof p1 == "object") {
        if (p1.name) {
          p1 = p1.name;
          p2 = p2.name;
        }
        if (p1.text) {
          p1 = p1.text;
          p2 = p2.text;
        }
      }

      res = compare(p1, p2);
      if (type) res = res == -1 ? 1 : -1;
      return res;
    });

    function compare(e1, e2) {
      if (e1 > e2) return 1;else if (e1 < e2) return -1;else return 0;
    }
  },

  /**
   * @param {object} icons
   */
  setSorts: function setSorts(icons) {
    var table = this;

    $(table.header).find('td[sort]').nodeArr().forEach(function (td) {
      var value;

      value = td.getAttribute("sort");
      table.setSortImage(td, value, icons);
      bindEvent(td, 'onclick', function () {
        doSort(td, table);
      });
    });
  },

  /**
   * @param {*[]} values
   */
  setStructure: function setStructure(values) {
    var table, paths;

    table = this;
    paths = values[0];

    values.forEach(function (elem) {
      if (elem[0] != "paths") {
        table.structure[elem[0]] = {
          path: getPath(elem[1], elem[2]),
          filterType: elem[3],
          filterName: elem[4]
        };
      }
    });

    function getPath(e1, e2) {
      var result;

      if (e1) {
        result = paths[e1] + e2;
        result = result.split("[id]");
      } else {
        result = [e2];
      }
      return result;
    }
  },

  /**
   * @param {object} icons
   */
  setFilters: function setFilters(icons) {
    var table = this;

    $(table.footer).find('td[filter]').nodeArr().forEach(function (td) {
      var value, ico;

      value = td.getAttribute("filter");

      if (table.structure[value].filterType) {
        ico = table.settings.show.themes[value] ? icons.boxOn : icons.boxOff;
        ico = '<img style="margin-left: 1px;" src="' + ico + '"/>';
        td.innerHTML += ico;

        bindEvent(td, 'onclick', function () {
          doFilter(td, table.settings, table.structure[value].filterType, table.structure[value].filterName);
        });
      }
    });
  },

  /**
   * @param {object} row
   * @returns {boolean}
   */
  filtering: function filtering(row) {
    var filter, value, length, list;

    filter = this.settings.show[this.name];
    list = _Object$keys(filter);
    length = list.length;

    while (length--) {
      value = list[length];

      switch (filter[value].type) {
        case "boolean":
          if (filter[value].value != row[value]) return false;
          break;

        case "multiple":
          if (!exist(row[value].text, filter[value].value)) return false;
          break;

        case "check":
          if (!exist(row[value].name, filter[value].value)) return false;
          break;

        default:
          if (compare(filter[value].value, row[value])) return false;
      }
    }
    return true;

    function compare(k, n) {
      //if(k == null) return false;
      if (isNaN(n)) n = parseInt(n, 10);
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
module.exports = function (nodesID, settingsKey, settings) {
  return new Table(nodesID, settingsKey, settings);
};

},{"./dom":2,"./events":3,"babel-runtime/core-js/object/keys":9}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":15}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":16}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":17}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":18}],12:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":19}],13:[function(require,module,exports){
(function (global){
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g =
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this;

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

module.exports = { "default": module.exports, __esModule: true };

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./runtime":14}],14:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

"use strict";

var _Symbol = require("babel-runtime/core-js/symbol")["default"];

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

var _Promise = require("babel-runtime/core-js/promise")["default"];

!(function (global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof _Symbol === "function" ? _Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = _Object$create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      prototype[method] = function (arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function (genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
  };

  runtime.mark = function (genFun) {
    if (_Object$setPrototypeOf) {
      _Object$setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = _Object$create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function (arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value instanceof AwaitArgument) {
          return _Promise.resolve(value.arg).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return _Promise.resolve(value).then(function (unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new _Promise(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
      // Avoid propagating failures to Promises returned by later
      // invocations of the iterator.
      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function (innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" || method === "throw" && delegate.iterator[method] === undefined) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(delegate.iterator[method], delegate.iterator, arg);

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }
        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function () {
    return this;
  };

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function () {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function (object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function reset(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function stop() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function dispatchException(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function complete(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" || record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
// Among the various tricks for obtaining a reference to the global
// object, this seems to be the most reliable technique that does not
// use indirect eval (which violates Content Security Policy).
typeof global === "object" ? global : typeof window === "object" ? window : typeof self === "object" ? self : undefined);
}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":82,"babel-runtime/core-js/object/create":8,"babel-runtime/core-js/object/set-prototype-of":10,"babel-runtime/core-js/promise":11,"babel-runtime/core-js/symbol":12}],15:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":50}],16:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":25,"../../modules/es6.object.keys":75}],17:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":25,"../../modules/es6.object.set-prototype-of":76}],18:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/$.core').Promise;
},{"../modules/$.core":25,"../modules/es6.object.to-string":77,"../modules/es6.promise":78,"../modules/es6.string.iterator":79,"../modules/web.dom.iterable":81}],19:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
module.exports = require('../../modules/$.core').Symbol;
},{"../../modules/$.core":25,"../../modules/es6.object.to-string":77,"../../modules/es6.symbol":80}],20:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],21:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],22:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":43}],23:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":24,"./$.wks":72}],24:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],25:[function(require,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],26:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":20}],27:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],28:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":32}],29:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":35,"./$.is-object":43}],30:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":50}],31:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , ctx       = require('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":25,"./$.ctx":26,"./$.global":35}],32:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],33:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":22,"./$.ctx":26,"./$.is-array-iter":41,"./$.iter-call":44,"./$.to-length":69,"./core.get-iterator-method":73}],34:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":50,"./$.to-iobject":68}],35:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],36:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],37:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":50,"./$.descriptors":28,"./$.property-desc":55}],38:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":35}],39:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],40:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":24}],41:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./$.iterators')
  , ITERATOR   = require('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./$.iterators":49,"./$.wks":72}],42:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":24}],43:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],44:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":22}],45:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , descriptor     = require('./$.property-desc')
  , setToStringTag = require('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":50,"./$.hide":37,"./$.property-desc":55,"./$.set-to-string-tag":61,"./$.wks":72}],46:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./$.library')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , hide           = require('./$.hide')
  , has            = require('./$.has')
  , Iterators      = require('./$.iterators')
  , $iterCreate    = require('./$.iter-create')
  , setToStringTag = require('./$.set-to-string-tag')
  , getProto       = require('./$').getProto
  , ITERATOR       = require('./$.wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":50,"./$.export":31,"./$.has":36,"./$.hide":37,"./$.iter-create":45,"./$.iterators":49,"./$.library":52,"./$.redefine":57,"./$.set-to-string-tag":61,"./$.wks":72}],47:[function(require,module,exports){
var ITERATOR     = require('./$.wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":72}],48:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],49:[function(require,module,exports){
module.exports = {};
},{}],50:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],51:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":50,"./$.to-iobject":68}],52:[function(require,module,exports){
module.exports = true;
},{}],53:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":24,"./$.global":35,"./$.task":66}],54:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./$.export')
  , core    = require('./$.core')
  , fails   = require('./$.fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":25,"./$.export":31,"./$.fails":32}],55:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],56:[function(require,module,exports){
var redefine = require('./$.redefine');
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};
},{"./$.redefine":57}],57:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":37}],58:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],59:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":50,"./$.an-object":22,"./$.ctx":26,"./$.is-object":43}],60:[function(require,module,exports){
'use strict';
var core        = require('./$.core')
  , $           = require('./$')
  , DESCRIPTORS = require('./$.descriptors')
  , SPECIES     = require('./$.wks')('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":50,"./$.core":25,"./$.descriptors":28,"./$.wks":72}],61:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":50,"./$.has":36,"./$.wks":72}],62:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":35}],63:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./$.an-object')
  , aFunction = require('./$.a-function')
  , SPECIES   = require('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":20,"./$.an-object":22,"./$.wks":72}],64:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],65:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":27,"./$.to-integer":67}],66:[function(require,module,exports){
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":24,"./$.ctx":26,"./$.dom-create":29,"./$.global":35,"./$.html":38,"./$.invoke":39}],67:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],68:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":27,"./$.iobject":40}],69:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":67}],70:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":27}],71:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],72:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":35,"./$.shared":62,"./$.uid":71}],73:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":23,"./$.core":25,"./$.iterators":49,"./$.wks":72}],74:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./$.add-to-unscopables')
  , step             = require('./$.iter-step')
  , Iterators        = require('./$.iterators')
  , toIObject        = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":21,"./$.iter-define":46,"./$.iter-step":48,"./$.iterators":49,"./$.to-iobject":68}],75:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":54,"./$.to-object":70}],76:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./$.export');
$export($export.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.export":31,"./$.set-proto":59}],77:[function(require,module,exports){

},{}],78:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $export    = require('./$.export')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same-value')
  , SPECIES    = require('./$.wks')('species')
  , speciesConstructor = require('./$.species-constructor')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.descriptors')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.redefine-all')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
require('./$.set-to-string-tag')(P, PROMISE);
require('./$.set-species')(PROMISE);
Wrapper = require('./$.core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./$":50,"./$.a-function":20,"./$.an-object":22,"./$.classof":23,"./$.core":25,"./$.ctx":26,"./$.descriptors":28,"./$.export":31,"./$.for-of":33,"./$.global":35,"./$.is-object":43,"./$.iter-detect":47,"./$.library":52,"./$.microtask":53,"./$.redefine-all":56,"./$.same-value":58,"./$.set-proto":59,"./$.set-species":60,"./$.set-to-string-tag":61,"./$.species-constructor":63,"./$.strict-new":64,"./$.wks":72}],79:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":46,"./$.string-at":65}],80:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , DESCRIPTORS    = require('./$.descriptors')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setToStringTag = require('./$.set-to-string-tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isArray        = require('./$.is-array')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./$.library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":50,"./$.an-object":22,"./$.descriptors":28,"./$.enum-keys":30,"./$.export":31,"./$.fails":32,"./$.get-names":34,"./$.global":35,"./$.has":36,"./$.is-array":42,"./$.keyof":51,"./$.library":52,"./$.property-desc":55,"./$.redefine":57,"./$.set-to-string-tag":61,"./$.shared":62,"./$.to-iobject":68,"./$.uid":71,"./$.wks":72}],81:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":49,"./es6.array.iterator":74}],82:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],83:[function(require,module,exports){
"use strict";

module.exports = {
    loading: "data:image/gif;base64,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",
    inTeam: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABgUExURaHCpdDlz5m2nJ69orLVs5q5npawmKnLq/3//fb89aPFp5Stl5e0mpKxlqXIqejx5py7oJ7Aopa4mZu6n6vGrJy8oI+kkcLZw4utjt3t3Z+/o+P24PL48a7Qr7fVt////1D+6W0AAAAgdFJOU/////////////////////////////////////////8AXFwb7QAAAORJREFUeNrM0tGSgyAMBdCYCGpEF4mhK632//9y8aUjtLOvu/f1zGUyCfD8JfCHGC2+MsYSY9e+crQUrxjnHRIA85zT7a3GC+KsIl6JFlBl7jp7QbeIJ8pdSN2e+wVa9d5TSovh+53TPBfojQqaJKHpmwW4REERVZmO/guIKzToeLt98+OxBqiaI+LEw7Bv/eEo5XcrdNOtH4YmyDn1G45h67fgKGOq0Dmc1madvColggKz5XJA8ZL3VKPN6iyKEdK8jitGNNadbXN2DbhYnEyXlAc5t8vMPlbHxkviP/h9H/MjwAB5L0bCGQGg2gAAAABJRU5ErkJggg==",
    outTeam: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABgUExURcy6o7eLg8KqlbqUiMWrmP79/cmynr2djcKllMCiksWjjLmRh8Clkr+gkL2Zjb6dj8zAouHWwvv59buXi93MusSllsGdjsSnmLJ9fLyci8OjlsSmkLuZi7ycjeLYwv////ACeG4AAAAgdFJOU/////////////////////////////////////////8AXFwb7QAAAONJREFUeNrM0tGOgyAQBVAEOjLKgJYqUIX+/18ubNNG7GZfd2/m7SRk4MIev4T9IYZOvNOFFgNME5te6cMRg2RIqDXnsgy89Ikjj7tF1EpV5QDdEamYlJvWEqBwizFazBk3L+dcTz5iF/ee8iWDnK+fuLtkoWiZxXvOG3QmJVX0kv2iziiMSZZVZL6sfEJn4jJ/HwveqxMKc79d8zDkspBC3eA4uuWWl22AciH8QGHcSuvqARRaarGWYoylu1dItj9iEE6UnZKtr09Wj6GpLJneEhHWalQMp7LFIeEf/L4f8yXAAK3KR+odaCMIAAAAAElFTkSuQmCC",
    ok: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAABgUExURcfZyZq2nNnk2rbMt6C+o+Ts5KLBpZ68oaTFqLHVsqrFrarMrJq4nqTBppSsl6XIqZawmKLDpr3RvvL18s7ez5++pPn6+Zy5oO3y7Z/Aov/+/4+kkZu7oLTYtaDApP///9goXtYAAAAgdFJOU/////////////////////////////////////////8AXFwb7QAAAOhJREFUeNrM0ttuhCAQgGGQ4bAgq+Cg7oDs+79lsWkaMU1v2z/cfZlkArD3L7E/xDzz7565x+yOx1fH8YB8xTy5ACoEM525o+QL8qmUVFMNxgQVjHPzFV8lgWoF48/5DudSwCJTHhEjopt6HAXtq/SSJNIubrgtDOzOPFk5GNPjKBYNwKSiffE3fHIhNagoPQ0Ltp17tOuWFA6KvFituiGXg49rFBT9gDbc0C5ECCuRiIQdzjMfN2HhM1+hnzxRg24ba6gArytmPo6lSWqnpXjunqy8zrlUa7tao/Ptsfml/A9+3499CDAAMUlI6MueeL4AAAAASUVORK5CYII=",
    boxOff: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAMAAABFNRROAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAwUExURcXGyLO4venp6dvc3tPW2uXm5uDh4tTV1rq9wc3R1/Ly8u3t7cvP1a6zufT09I6PjxdGPcgAAABTSURBVHjaZM7LDsAgCERRRMUHFv//bztKm5r0rjibCTTPaNrX0uWF6hqopUivcIs8agnIPLYCblbVslVjZu29R9cC9mWLHJZdBRvKyvb75ewWYACxKAd6tFGoMwAAAABJRU5ErkJggg==",
    boxOn: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAMAAABFNRROAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAwUExURbS80err7Pj5+dja22d5psrMzs/U4t/h5U5jmUddlcDF0fb29svP1a6zufT09I6Pj+Y/NIsAAABeSURBVHjaTM5BDsAgCABBUCwiCv//bVGaxr1NIATwO3DLSlHbWru2iPVoRthl/GIQwtysXI0E6tGYC2OkKSZ5qMOnySJCxfioofcYaV5p/Cw3xFT8oVb2P6G7V4ABAJrfBzFmr8JyAAAAAElFTkSuQmCC",
    sortDown: "data:image/gif;base64,R0lGODlhBwAUAIABAARrAf///yH5BAEAAAEALAAAAAAHABQAAAIQjI+py+0BogRwHpno27yzAgA7",
    sortUp: "data:image/gif;base64,R0lGODlhBwAUAIABAARrAf///yH5BAEAAAEALAAAAAAHABQAAAIQjI+py+0IEphn2mDz27yrAgA7",
    sortNull: "data:image/gif;base64,R0lGODlhBwAUAIABAARrAf///yH5BAEAAAEALAAAAAAHABQAAAIUjI+pywYJ4ok00NvglXtK9GTiiBQAOw==",
    filter: "data:image/png;base64,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",
    memberIco: " data:image/png;base64,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"
};

},{}],84:[function(require,module,exports){
/**
 *
 * @returns {object}
 */

"use strict";

var _Object$keys = require("babel-runtime/core-js/object/keys")["default"];

module.exports = function () {
  var ts;

  ts = {
    player: {
      id: "id",
      name: "a",
      status: "b",
      date: "c",
      forums: "d"
    },
    forum: {
      id: "id",
      name: "a",
      sid: "b",
      posts: "c",
      words: "d",
      page: "e",
      themes: "f",
      log: "g"
    },
    theme: {
      id: "id",
      name: "a",
      author: "b",
      posts: "c",
      pages: "d",
      start: "e"
    },
    member: {
      id: "id",
      posts: "a",
      last: "b",
      start: "c",
      write: "d",
      words: "e",
      wordsAverage: "f",
      carma: "g",
      carmaAverage: "h",
      sn: "i",
      enter: "j",
      exit: "k",
      kick: "l",
      invite: "m"
    },
    timestamp: {
      id: "id",
      time: "a",
      data: "b"
    }
  };

  makeTS();

  return ts;

  function makeTS() {
    _Object$keys(ts).forEach(function (t) {
      _Object$keys(ts[t]).forEach(function (key) {
        ts[t][ts[t][key]] = key;
      });
    });
  }
};

},{"babel-runtime/core-js/object/keys":9}],85:[function(require,module,exports){
'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

require('./../../../lib/prototypes')();
var $ = require('./../../../lib/dom');
var db = require('./../../../lib/idb');
var bindEvent = require('./../../../lib/events');
var ajax = require('./../../../lib/request');
var createTable = require('./../../../lib/table');

var $c = require('./../../../lib/common')();
var $ts = require('./../src/structure')();
var $ico = require('./../src/icons');

var $nameScript = "Stats forums [GW]";
var $mode = true;
var $sd, $cd, $ss, $tsd, $answer, $screenWidth, $screenHeight, $date, $checked, $t;

var $idb, $forum;

var $statusStyle = {
  "Ok": "",
  "Торговый": "font-weight: bold;",
  "Арестован": "color: blue;",
  "Форумный": "color: red;",
  "Общий бан": "color: green; font-weight: bold;",
  "Заблокирован": "color: red; font-weight: bold;"
};

$checked = {
  themes: {},
  players: {}
};

$screenWidth = document.body.clientWidth;
$screenHeight = document.body.clientHeight;

$answer = $('<span>').node();
$date = parseInt(new Date().getTime() / 1000, 10);

$sd = {
  forums: {},
  players: {},
  kicked: {},
  invite: {}
};

$ss = {
  sort: {
    stats: {
      type: 1,
      cell: 'name'
    },
    themes: {
      type: 1,
      cell: 'id'
    }
  },
  show: {
    stats: {},
    themes: {}
  }
};

$cd = {
  fid: 0,
  fName: "",
  tid: 0,
  tName: "",
  fPage: 27,
  tPage: 0,
  lPage: 0,
  f: null,
  sid: null,
  nameToId: {},
  members: [],
  countMembers: 0,
  values: {
    stats: {
      id: ['ID', -1, -1],
      start: ['Тем начато', -1, -1],
      write: ['Участвовал', -1, -1],
      date: ['Последнее сообщение', -1, -1],
      posts: ['Сообщений', -1, -1],
      averageWords: ['Среднее количество слов', -1, -1],
      words: ['Количество слов', -1, -1],
      pStart: ['Процент начатых тем', -1, -1],
      pWrite: ['Процент участия', -1, -1],
      pPosts: ['Процент сообщений', -1, -1],
      pWords: ['Процент слов', -1, -1],
      status: ['Статус', -1, -1],
      enter: ['Принят', -1, -1],
      exit: ['Покинул', -1, -1],
      goAway: ['Изгнан', -1, -1],
      member: ['В составе', -1, -1]
    },
    themes: {
      id: '',
      date: '',
      posts: '',
      postsAll: ''
    }
  },
  showProgressTime: false,
  timeRequest: 0,
  statsCount: 0,
  themesCount: 0
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

addStyle();
createStatGUIButton();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStyle() {
  var css, code;

  code = 'table[type="padding"] td {\n    padding: 2px 5px 2px 5px;\n}\ntr[type="light"] {\n    background-color: #d8e8d8;\n}\ntr[type="lightChecked"] {\n    background-color: #c7dfc7;\n}\ntr[type^="light"]:hover {\n    background-color: #beccbe;\n}\ntr[type="header"] {\n    background-color: #d0eed0; font-weight: bold;\n}\n#sf_header_SI img, #sf_header_TL img{\n    float: right;\n}\ntd[sort], td[filter]{\n    cursor: pointer;\n}\ntd[sort]:hover, td[filter]:hover{\n    background-color: #cae1ca;\n}\n.sf_left {\n    padding-left: 5px;\n}\n#sf_STI {\n    padding: 0;\n}\n#sf_shadowLayer{\n    position: absolute;\n    width: 0;\n    height: 0;\n    z-index: 1;\n    background-color: #000000;\n    left: 0;\n    top: 0;\n    opacity: 0.7;\n    display: none;\n    cursor: pointer;\n}\ndiv[type="window"]{\n    position: absolute;\n    -moz-border-radius: 10px;\n    border-radius: 10px;\n    background-color: #FFFFFF;\n    z-index: 2;\n    display: none;\n}\n\ninput[type="button"]{\n    font-weight: 500;\n    font-family: Verdana;\n    background-color: rgb(208,238,208);\n    font-size: 10px;\n    height: 20px;\n}\ninput[type="text"][class="sf_hideInput"]{\n    font-weight: 500;\n    font-family: Verdana;\n    background-color: #f0fff0;\n    font-size: 12px;\n    text-align: center;\n    width: 50px;\n    border-style: none;\n}\ninput[type="checkbox"][name="sf_membersList"],[name="sf_themesList"]{\n    display: none;\n}\ndiv[class^="sf_count"]{\n    border: solid 1px #000000;\n    width: 100px;\n    line-height: 24px;\n    float: left;\n    height: 24px;\n}\ndiv[class="sf_count disabled"]{\n    border: solid 1px #C0c0c0;\n    color: #c0c0c0;\n}\ndiv[class="sf_space"]{\n    border: none;\n    width: 15px;\n    height: 24px;\n    float: left;\n}\ninput[type="text"][class="sf_count disabled"]{\n    color: #c0c0c0;\n    width: 65px;\n    border-style: none;\n    background: none;\n    padding: 0;\n    margin: 0;\n}\ninput[type="text"][class="sf_count enabled"]{\n    width: 65px;\n    border-style: none;\n    background: none;\n    padding: 0;\n    margin: 0;\n}\n#sf_calendar{\n    left: 0;\n    top: 0;\n}\n#sf_calendar td{\n    text-align: center;\n    height: 20px;\n    border: solid 1px #339933;\n    padding: 5px;\n}\n#sf_calendar td[type="day"]:hover, #sf_calendar td[type="control"]:hover{\n    background: #D8E8D8;\n    cursor: pointer;\n}\nspan[type="calendarCall"]{\n    cursor: pointer;\n}\ndiv[type^="multipleSelect"]{\n    background: #f0fff0;\n    position: absolute;\n    height: 24px;\n    overflow-y: hidden;\n}\ndiv[type="multipleSelect enabled"]:hover{\n    position: absolute;\n    overflow-y: visible;\n    height: 174px;\n    border: solid 1px #000000;\n    margin-left: -1px;\n    margin-top: -1px;\n}\ndiv[type^="option"]{\n    padding-left: 10px;\n    padding-right: 10px;\n    text-align: left;\n    border-top: dotted 1px #c0c0c0;\n}\ndiv[type="option selected"]{\n    background: #c3e5c3;\n}\ndiv[type^="option"]:hover{\n    background: #d9ecd9;\n    cursor: pointer;\n}\nspan[id^="sf_bCheckAll"]{\n    float: right;\n    margin-right: 5px;\n    font-size: 9px;\n    cursor: pointer;\n}';
  code += '\n    td[sort="member"]{\n      background-image: url(' + $ico.memberIco + ');\n      background-position: 10px center;\n      background-repeat:no-repeat;\n    }\n    #sf_statusWindow{\n      left: ' + ($screenWidth / 2 - 325) + ';\n      top: ' + ($screenHeight / 2 - 120) + ';\n    }\n    #sf_controlPanelWindow{\n        left: ' + ($screenWidth / 2 - 175) + ';\n        top: ' + ($screenHeight / 2 - 260) + ';\n    }\n    #sf_filtersWindow{\n        left: ' + ($screenWidth / 2 - 250) + ';\n        top: ' + ($screenHeight / 2 - 363) + ';\n    }\n    #sf_messageWindow{\n        left: ' + ($screenWidth / 2 - 370) + ';\n        top: ' + ($screenHeight / 2 - 222) + ';\n    }';
  css = $("style").html(code).node();
  css.setAttribute("type", "text/css");
  css.setAttribute("script", "true");

  document.head.appendChild(css);
}

function createStatGUIButton() {
  var fid, name, navigate, button;

  fid = location.search.match(/(\d+)/);
  fid = Number(fid[1]);

  navigate = $('a[style="color: #990000"]:contains("~Форумы")').up('b');
  name = navigate.text().match(/(.+) » (.+)/)[2];

  button = $('<span>').html(' :: <span id="sf_buttonStats" style="cursor: pointer;">\n    Статистика\n</span>').node();
  navigate.node().appendChild(button);

  $cd.fid = fid;
  $cd.fName = name;

  if (fid > 100) {
    $cd.sid = fid.toString();
    $cd.sid = Number($cd.sid.slice(1, $cd.sid.length));
  } else {
    $mode = false;
  }

  bindEvent(button, 'onclick', function () {
    makeConnect("gk_StatsForum", true);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function makeConnect(name, first) {
  var ini;
  return _regeneratorRuntime.async(function makeConnect$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:

        ini = [{ name: "players", key: "id", index: [["name", "a", true]] }, { name: "forums", key: "id" }];

        if (!first) {
          context$1$0.next = 6;
          break;
        }

        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(db(name));

      case 4:
        $idb = context$1$0.sent;

        $idb.setIniTableList(ini);

      case 6:
        context$1$0.next = 8;
        return _regeneratorRuntime.awrap($idb.connectDB());

      case 8:
        $idb = context$1$0.sent;

        //$idb.deleteDB();

        console.log($idb);
        addToDB();

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

function generatePlayers(id) {
  return {
    id: id,
    name: "",
    status: "",
    date: 0,
    forums: []
  };
}

function generateMembers(id) {
  return {
    id: id,
    posts: 0,
    last: 0,
    start: [],
    write: [],
    words: 0,
    wordsAverage: 0,
    carma: 0,
    carmaAverage: 0,
    sn: 0,
    enter: 0,
    exit: 0,
    kick: 0,
    invite: 0
  };
}

function generateForums(id) {
  return {
    id: id,
    name: "",
    sid: 0,
    posts: 0,
    words: 0,
    page: [0, 0],
    themes: [0, 0],
    log: [0, 0]
  };
}

function generateThemes(id) {
  return {
    id: id,
    name: "",
    author: [0, ""],
    posts: [0, 0],
    pages: [0, 0],
    start: 0
  };
}

function generateTimestamps(id) {
  return {
    id: id,
    time: [],
    data: []
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addToDB() {
  var forum;
  return _regeneratorRuntime.async(function addToDB$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if ($idb.exist('themes_' + $cd.fid)) {
          context$1$0.next = 12;
          break;
        }

        forum = generateForums($cd.fid);
        forum.name = $cd.fName;
        forum.sid = $cd.sid;
        forum = repack(forum, "forum");

        $idb.add("forums", forum);
        $idb.setModifyingTableList([{ name: 'themes_' + $cd.fid, key: "id" }, { name: 'members_' + $cd.fid, key: "id" }, { name: 'timestamp_' + $cd.fid, key: "id" }]);
        $idb.db.close();
        $idb.nextVersion();
        makeConnect("gk_StatsForum", false);
        context$1$0.next = 19;
        break;

      case 12:
        loadFromLocalStorage('settings');

        $t = {
          stats: createTable(["#sf_header_SI", "#sf_content_SI", "#sf_footer_SI"], "stats", $ss),
          themes: createTable(["#sf_header_TL", "#sf_content_TL", "#sf_footer_TL"], "themes", $ss)
        };

        context$1$0.next = 16;
        return _regeneratorRuntime.awrap($idb.getOne("forums", "id", $cd.fid));

      case 16:
        $forum = context$1$0.sent;

        $forum = repack($forum, "forum");

        createGUI();

      case 19:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI() {
  var table, td, gui, calendar;

  table = $('td[style="color: #990000"]:contains("Тема")').up('table').up('table').node();
  td = table.rows[0].cells[0];

  gui = $('<td>').html('<b><a style="color: #990000" href="http://www.ganjawars.ru/forum.php">Форумы</a> » ' + $cd.fName + '</b>\n:: <span id="sf_gui_settings" style="cursor: pointer; font-weight: bold;">Панель управления</span>\n□ <span id="sf_gui_filters" style="cursor: pointer; font-weight: bold;">Фильтры</span>\n□ <span id="sf_gui_message" style="cursor: pointer; font-weight: bold;">Рассылка почты</span>\n<br>\n<table width="97%" cellspacing="0" cellpadding="0" style="border-style: none; border-collapse: collapse;" align="center">\n    <tr><td class="sf_left" id="sf_header_SI" valign="top" colspan="2"></td></tr>\n    <tr><td class="sf_left" id="sf_content_SI" valign="top" colspan="2"></td></tr>\n    <tr><td class="sf_left" id="sf_footer_SI" valign="top" colspan="2"></td></tr>\n    <tr><td class="sf_left" align="center" id="sf_header_TL" width="1250"></td><td class="sf_left" valign="top" align="center" id="sf_header_STI"></td></tr>\n    <tr><td class="sf_left" align="center" id="sf_content_TL" width="1250"></td><td class="sf_left" valign="top" align="center" id="sf_content_STI" rowspan="2"></td></tr>\n    <tr><td class="sf_left" align="center" id="sf_footer_TL"></td></tr>\n</table>\n<div id="sf_shadowLayer" title="Клик закроет окно"></div>\n<div type="window" id="sf_statusWindow">' + createStatusWindow() + '</div>\n<div type="window" id="sf_controlPanelWindow">' + createControlPanel() + '</div>\n<div type="window" id="sf_filtersWindow"></div>\n<div type="window" id="sf_messageWindow">' + createMessageWindow() + '</div>\n<div type="window" id="sf_calendar"></div>').node();

  td.parentNode.removeChild(td);
  table.rows[0].appendChild(gui);

  renderBaseHTML();
  //renderStatsTable();
  //renderThemesTable();
  createShadowLayer();

  bindEvent($('#sf_gui_settings').node(), 'onclick', openControlPanelWindow);
  //bindEvent($('#sf_gui_message').node(), 'onclick', openMessageWindow);
  //bindEvent($('#sf_forgetForum').node(), 'onclick', forgetForum);

  $('#sf_controlPanelWindow').find('input[type="button"]').nodeArr().forEach(function (node) {
    bindEvent(node, 'onclick', function () {
      prepareDoTask(node);
    });
  });

  //bindEvent($('#sf_sendMessages').node(), 'onclick', prepareSendMails);

  calendar = $('span[type="calendarCall"]').node();
  bindEvent(calendar, 'onclick', function () {
    renderCalendar(calendar);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderCalendar(nodeTextDate) {
  var size, left, top, calendar, date;

  calendar = $('#sf_calendar').node();

  if (calendar.style.display == "block") {
    calendar.style.display = 'none';
    return;
  }
  if (nodeTextDate.nextElementSibling.disabled) {
    return;
  }

  size = nodeTextDate.getBoundingClientRect();
  left = size.left + size.width + 10;
  top = size.top - 5;

  calendar.style.left = left + 'px';
  calendar.style.top = top + 'px';
  calendar.style.display = 'block';

  date = Number(nodeTextDate.nextElementSibling.value);

  createCalendar(date, nodeTextDate);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createShadowLayer() {
  var bBody = document.body.getBoundingClientRect();
  var fullHeight = $screenHeight > bBody.height ? $screenHeight : bBody.height;
  var shadowLayer;

  shadowLayer = $('#sf_shadowLayer').node();
  shadowLayer.style.width = bBody.width;
  shadowLayer.style.height = fullHeight;

  bindEvent(shadowLayer, 'onclick', closeWindows);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createStatusWindow() {
  return '<table width="600" height="50" style="margin: 20px 25px; background-color: #f0fff0" type="padding">\n    <tr type="header" height="35">\n        <td align="center" style="color: #990000;">Прогресс задачи</td>\n    </tr>\n    <tr height="15">\n        <td></td>\n    </tr>\n    <tr>\n        <td style="padding-left: 30px;">\n            <b>Задача:</b> <span id="sf_progressText" style="font-style: italic;"></span> [<span id="sf_progressCurrent"></span>/<span id="sf_progressMax"></span>]\n            <span id="sf_progressTextExtra"></span>\n        </td>\n    </tr>\n    <tr>\n        <td style="padding-left: 30px;">\n            <b>Времени осталось:</b> <span>00:00</span><span style="display: none;" id="sf_progressTime">0</span>\n        </td>\n    </tr>\n    <tr>\n        <td style="padding-left: 30px;">\n            <div style="width: 510px; height: 10px; border: solid 1px #000000; float: left; margin-top: 8px;">\n                <div style="width: 0; height: 100%; background-color: brown;" id="sf_progressBar"></div>\n            </div>\n            <div style="float: left; width: 5px; height: 25px;"></div>\n            <div style="float: left; width: 25px; height: 25px;" id="sf_progressIco"></div>\n        </td>\n    </tr>\n    <tr height="25">\n        <td align="right" style="padding: 15px 30px 10px 0;">\n            <input type="button" value="Пауза" /> <input type="button" value="Отмена" />\n        </td>\n    </tr>\n    <tr height="5" bgcolor="#d0eed0">\n        <td></td>\n    </tr>\n</table>';
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createControlPanel() {
  var code, disabled;

  disabled = $mode ? '' : 'disabled';
  code = '<table cellspacing="0" width="300" style="border: solid 0 #000000; background-color: #f0fff0; margin: 20px 25px;" type="smallPadding">\n    <tr height="30" type="header">\n        <td align="center" bgcolor="#d0eed0" colspan="2">Сбор данных о темах</td>\n    </tr>\n    <tr>\n        <td align="right" colspan="2">\n            По какое число:\n            <span type="calendarCall" style="background-color: #ffffff;">' + $c.getNormalDate($date, true).d + '</span>\n            <input type="text"  name="sf_parseForum" class="sf_hideInput" style="display: none;" value="' + $date + '" />\n            <input type="radio" name="sf_parseForum" value="count" checked />\n        </td>\n    </tr>\n    <tr>\n        <td align="right" colspan="2">\n            Все страницы форума:\n            <input type="radio" name="sf_parseForum" value="all" />\n        </td>\n    </tr>\n    <tr height="30">\n        <td align="center" colspan="2"><input type="button" value="Начать" name="sf_parseForum" /></td>\n    </tr>\n\n    <tr height="30" type="header">\n        <td align="center" bgcolor="#d0eed0" colspan="2">Анализ известных тем</td>\n    </tr>\n    <tr>\n        <td align="right" colspan="2">\n            Количество тем:\n            <input type="text" name="sf_parseThemes" class="sf_hideInput" value="0" />/ [<span id="sf_countThreads" title="Необработанных тем / Всего тем">[0/0]</span>]\n            <input type="radio" name="sf_parseThemes" value="count" checked />\n        </td>\n    </tr>\n    <tr>\n        <td align="right" colspan="2">\n            Только отмеченные в списке:\n            <input type="radio" name="sf_parseThemes" value="select" />\n        </td>\n    </tr>\n    <tr>\n        <td align="right" colspan="2">\n            Все известные темы:\n            <input type="radio" name="sf_parseThemes" value="all" />\n        </td>\n    </tr>\n    <tr height="30">\n        <td align="center" colspan="2"><input type="button" value="Начать" name="sf_parseThemes" /></td>\n    </tr>\n\n    <tr height="30" type="header">\n        <td align="center" bgcolor="#d0eed0" colspan="2">Статус персонажей</td>\n    </tr>\n    <tr>\n        <td align="right" colspan="2">\n            Количество персонажей:\n            <input type="text" name="sf_parsePlayers" class="sf_hideInput" value="0" />/<span id="sf_countMembers">0</span>\n            <input type="radio" name="sf_parsePlayers" ' + disabled + ' value="count" checked />\n        </td>\n    </tr>\n    <tr>\n        <td align="right" colspan="2">\n            Только отмеченные в списке:\n            <input type="radio" name="sf_parsePlayers"  ' + disabled + ' value="select" />\n        </td>\n    </tr>\n    <tr>\n        <td align="right" colspan="2">\n            Все персонажи:\n            <input type="radio" name="sf_parsePlayers" ' + disabled + ' value="all" />\n        </td>\n    </tr>\n    <tr height="30">\n        <td align="center" colspan="2"><input type="button" value="Начать" ' + disabled + ' name="sf_parsePlayers" /></td>\n    </tr>\n\n    <tr height="30" type="header">\n        <td align="center" bgcolor="#d0eed0" colspan="2">Дополнительно</td>\n    </tr>\n    <tr height="25">\n        <td align="right">Состав синдиката:</td>\n        <td align="left"><input type="button" value="Обработать" name="sf_memberList" ' + disabled + ' /></td>\n    </tr>\n    <tr height="25">\n        <td align="right">Протокол синдиката:</td>\n        <td align="left"><input type="button" value="Обработать" name="sf_sindicateLog" ' + disabled + ' /></td>\n    </tr>\n\n    <tr height="40">\n        <td colspan="2" style="font-size: 9px;" align="center">\n            <span id="sf_forgetForum" style="cursor: pointer;">[забыть этот форум]</span>\n        </td>\n    </tr>\n    <tr height="5" bgcolor="#d0eed0">\n        <td colspan="2"></td>\n    </tr>\n</table>';

  return code;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createMessageWindow() {
  return '<table width="700" height="395" align="center" style="margin: 20px 25px; background-color: #f0fff0;" type="padding">\n    <tr type="header" height="35">\n        <td align="center" style="color: #990000;" colspan="3">Рассылка почты</td>\n    </tr>\n    <tr>\n        <td style="padding: 8px 5px 2px 5px;" align="right">Кому:</td>\n        <td style="padding: 8px 5px 2px 5px; width: 200px;"><select style="width: 200px;" name="mid"></select></td>\n        <td style="padding: 8px 5px 2px 5px; width: 350px;" align="left"> Всего: <span type="count"></td>\n    </tr>\n    <tr>\n        <td align="right">Тема:</td>\n        <td style="padding: 2px 5px 8px 5px;" colspan="2"><input type="text" maxlength="50" style="width:100%" value="" name="subject"></td>\n    </tr>\n    <tr height="30" type="header">\n        <td align="center" bgcolor="#d0eed0" colspan="3">Утилиты</td>\n    </tr>\n    <tr>\n        <td align="right" style="padding: 8px 5px 2px 5px;">Режим:</td>\n        <td style="padding: 8px 5px 2px 5px; width: 200px;" colspan="2">\n            <select style="width: 300px;" name="workMode">\n                <option value="mail">Почта</option>\n                <option value="invite">Почта и приглашение</option>\n                <option value="goAway">Почта и изгнание</option>\n            </select>\n        </td>\n    </tr>\n    <tr>\n        <td align="right">Синдикат:</td>\n        <td style="padding: 2px 5px 8px 5px; width: 200px;" colspan="2"><select style="width: 300px;" name="sid"></select></td>\n    </tr>\n    <tr height="30" type="header">\n        <td align="center" bgcolor="#d0eed0" colspan="3">Сообщение</td>\n    </tr>\n    <tr>\n        <td colspan="3" style="padding: 8px 8px 2px 8px;">\n            <textarea style="width:100%" rows="10" name="message"></textarea>\n        </td>\n    </tr>\n    <tr>\n        <td align="center" colspan="3" height="35">\n            <input type="button" id="sf_sendMessages" value="Запустить">\n        </td>\n    </tr>\n    <tr height="5" bgcolor="#d0eed0">\n        <td colspan="3"></td>\n    </tr>\n</table>';
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createCalendar(cDate, nodeTextDate) {
  var months, days, date, year, month, day, code, row, coll, dayNumber, firstDayWeek, exit, tMonth, tDay, color;

  months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентрябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  exit = false;

  date = cDate == null ? $date : cDate;
  date = $c.getNormalDate(date, true);
  date = date.d.split('.');

  day = Number(date[0]);
  tMonth = date[1];
  month = Number(date[1]);
  year = Number(date[2]);

  if (year % 4 == 0) days[1] = 29;

  code = '<table class="wb" style="margin: 20px 25px;">\n                <tr type="header">\n                    <td type="control">«</td>\n                    <td type="control" title="Выбрать год" colspan="5">' + months[month - 1] + ' ' + year + '</td>\n                    <td type="control">»</td>\n                </tr>\n                <tr type="header">\n                    <td>П</td>\n                    <td>В</td>\n                    <td>С</td>\n                    <td>Ч</td>\n                    <td>П</td>\n                    <td>С</td>\n                    <td>В</td>\n                </tr>';

  dayNumber = 1;
  firstDayWeek = Date.parse(month + '/1/' + year);
  firstDayWeek = new Date(firstDayWeek).getDay();firstDayWeek--;
  if (firstDayWeek == -1) firstDayWeek = 6;

  for (row = 0; row < 6; row++) {
    if (exit) break;
    code += '<tr>';
    for (coll = 0; coll < 7; coll++) {
      if (row == 0 && coll < firstDayWeek) {
        code += '<td colspan="' + firstDayWeek + '"></td>';
        coll = firstDayWeek;
      }
      if (dayNumber <= days[month - 1]) {
        if (dayNumber == days[month - 1] && coll == 6) exit = true;
        tDay = dayNumber < 10 ? '0' + dayNumber : dayNumber;
        color = dayNumber == day ? 'style="background-color: #d0eed0;"' : '';
        code += '<td type="day" ' + color + ' name="' + tDay + '.' + tMonth + '.' + year + '" title="' + tMonth + '/' + tDay + '/' + year + ' 00:00">' + dayNumber + '</td>';
        dayNumber++;
      } else {
        code += '<td colspan="' + (7 - coll) + '"></td>';
        exit = true;
        break;
      }
    }
    code += '</tr>';
  }

  code += '<tr type="header">\n                <td colspan="7">' + $c.getNormalDate($date, true).d + '</td>\n             </tr>\n        </table>';

  /////////////////////////////

  $('#sf_calendar').html(code).find('td[type="control"],[type="day"]').nodeArr().forEach(function (button) {
    if (button.getAttribute("type") == "control") {
      if (button.title == "Выбрать год") {
        bindEvent(button, 'onclick', function () {
          setYear(month, year);
        });
      } else {
        bindEvent(button, 'onclick', function () {
          moveMonth(button, month, year);
        });
      }
    } else {
      bindEvent(button, 'onclick', function () {
        calendarSetDate(button, nodeTextDate);
      });
    }
  });
  /////////////////////////////

  function moveMonth(button, month, year) {
    if (button.textContent == "«") {
      month--;
      if (month == 0) {
        year--;
        month = 12;
      }
    } else {
      month++;
      if (month == 13) {
        year++;
        month = 1;
      }
    }
    month = month < 10 ? '0' + month : month;

    createCalendar(Date.parse(month + '/01/' + year) / 1000, nodeTextDate);
  }
  /////////////////////////////

  function setYear(month, year) {
    var nYear;

    nYear = prompt("Введите поный год");

    if (nYear == "") {
      nYear = 1970;
      month = "01";
    } else {
      nYear = parseInt(nYear, 10);
      if (isNaN(nYear)) nYear = year;
    }
    console.log(nYear);

    createCalendar(Date.parse(month + '/01/' + nYear) / 1000, nodeTextDate);
  }
  /////////////////////////////

  function calendarSetDate(button, nodeTextDate) {
    nodeTextDate.nextElementSibling.value = Date.parse(button.title) / 1000;
    $(nodeTextDate).html(button.getAttribute('name'));
    $("#sf_calendar").node().style.display = "none";
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareDoTask(node) {

  openStatusWindow();

  switch (node.name) {
    case 'sf_parseForum':
      forum();break;
    case 'sf_parseThemes':
      themes();break;
    case 'sf_parsePlayers':
      players();break;
    case 'sf_memberList':
      getMembersList();break;
    case 'sf_sindicateLog':
      getMaxPageSindicateLog();break;
  }
  /////////////////////////////

  function forum() {
    var p = getParam('sf_parseForum');

    switch (p.type) {
      case 'count':
        displayProgress('start', 'Обработка форума синдиката #' + $forum.id + ' «' + $forum.name + '»', 0, 100);
        parseForum(0, false, p.count);
        break;

      case 'all':
        getMaxPageForum();
        break;
    }
  }
  /////////////////////////////

  function themes() {
    var p = getParam('sf_parseThemes'),
        l;

    switch (p.type) {
      case 'count':
        displayProgress('start', 'Обработка тем', 0, p.count);
        prepareParseThemes(p.count);
        break;

      case 'select':
        l = getList('sf_themesList');
        displayProgress('start', 'Обработка тем', 0, l.count);
        displayProgressTime(l.c);
        parseThemes(0, l.count, l.array);
        break;

      case 'all':
        displayProgress('start', 'Обработка тем', 0, $cd.f.threads['new']);
        prepareParseThemes(0);
        break;
    }
  }
  /////////////////////////////

  function players() {
    var p, l;

    p = getParam('sf_parsePlayers');

    switch (p.type) {
      case 'count':
        displayProgress('start', 'Обработка персонажей', 0, p.count);
        prepareParseMembers(p.count);
        break;

      case 'select':
        l = getList('sf_membersList');
        displayProgress('start', 'Обработка персонажей', 0, l.count);
        displayProgressTime(l.c);
        parseMembers(0, l.count, l.array);
        break;

      case 'all':
        displayProgress('start', 'Обработка персонажей', 0, $cd.countMembers);
        prepareParseMembers();
        break;
    }
  }
  /////////////////////////////

  function getParam(name) {
    var type, count, table;

    table = $(node).up('table').node();
    type = $(table).find('input[type="radio"][name="' + name + '"]:checked').node().value;
    count = $(table).find('input[type="text"][name="' + name + '"]').node().value;
    count = Number(count);

    return { count: count, type: type };
  }
  /////////////////////////////

  function getList(name) {
    var list = [],
        count = 0,
        id;

    $('input[type="checkbox"][name="' + name + '"]:checked').nodeArr().forEach(function (node) {
      id = Number(node.value);
      if (name == "sf_themesList" && $cd.f.themes[id].posts[0] != $cd.f.themes[id].posts[1]) {
        list.push(node.value);
        count += calculateThemePages(id).count;
      } else {
        list.push(id);
        count++;
      }
    });

    if (name == "sf_themesList") {
      count = list.length * 750 + count * 1250 + 500;
    } else {
      count = count * 1250;
    }

    return { array: list, count: list.length, c: count };
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function forgetForum() {
  var id;

  if (confirm('Вы уврены что хотите удалить все данные об этом форуме?')) {
    delete $sd.forums[$cd.fid];
    for (id in $sd.players) {
      if ($sd.players[id].forums[$cd.fid]) {
        delete $sd.players[id].forums[$cd.fid];
      }
    }
    for (id in $sd.kicked) {
      delete $sd.kicked[$cd.fid];
    }
    saveToLocalStorage('data');
    location.reload();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayProgress(ini, text, current, max) {
  var percent, c, m, b, i, t, te, img;

  img = '<div style="width: 25px; height: 25px; background: url(' + $ico.loading + ');"></div>';

  c = $("#sf_progressCurrent");
  m = $("#sf_progressMax");
  b = $("#sf_progressBar");
  i = $("#sf_progressIco");
  t = $("#sf_progressText");
  te = $("#sf_progressTextExtra");

  if (ini == 'start') {
    i.html(img);
    t.html(text);
    m.html(max);
    c.html(current);
    b.node().style.width = '0%';

    $cd.showProgressTime = true;
  }
  if (ini == 'work') {
    current = parseInt(c.text(), 10) + 1;
    max = parseInt(m.text(), 10);

    percent = $c.getPercent(current, max, false);
    b.node().style.width = percent + '%';
    c.html(current);
  }
  if (ini == 'extra') {
    te.html(text);
  }
  if (ini == 'done') {
    te.html('');
    b.node().style.width = '100%';
    c.html(m.text());
    i.html('<b>Завершено!</b>');

    $cd.showProgressTime = false;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function displayProgressTime(t) {
  var node, time;

  if (!$cd.showProgressTime) return;

  node = $('#sf_progressTime');
  time = t ? t : Number(node.text()) - 1000;
  if (time < 0) time = 0;
  node.node().previousElementSibling.textContent = $c.getNormalTime(time);
  node.html(time);
  displayProgressTime.gkDelay(1000, this, []);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function openStatusWindow() {
  $("#sf_controlPanelWindow").node().style.display = "none";
  $("#sf_filtersWindow").node().style.display = "none";
  $("#sf_messageWindow").node().style.display = "none";

  $("#sf_statusWindow").node().style.display = "block";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openControlPanelWindow() {
  $("#sf_shadowLayer").node().style.display = "block";

  $("#sf_countThreads").html($forum.themes[0] + '/' + $forum.themes[1]);
  //$("#sf_countMembers").html($cd.countMembers);
  $("#sf_controlPanelWindow").node().style.display = "block";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openFiltersWindow() {
  $("#sf_shadowLayer").node().style.display = "block";
  $("#sf_filtersWindow").node().style.display = "block";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openMessageWindow() {
  var window, n;

  $("#sf_shadowLayer").node().style.display = "block";
  window = $("#sf_messageWindow").node();
  n = 0;

  $(window).find('select[name="mid"]').html(createSelectList());
  $(window).find('select[name="sid"]').html(createSelectSID());
  $(window).find('span[type="count"]').html(n);

  window.style.display = "block";
  /////////////////////////////

  function createSelectSID() {
    var code, list, sid;

    code = '<option value="0">Выберите...</option>';
    list = $mode ? $sd.forums : $tsd.forums;

    _Object$keys(list).forEach(function (id) {
      sid = id.substring(1, id.length);
      code += '<option value="' + sid + '">[#' + sid + '] ' + list[id].name + '</option>';
    });

    return code;
  }
  /////////////////////////////

  function createSelectList() {
    var code;

    code = '<option>Посмотреть список...</option>';

    $('#sf_content_SI').find('input[type="checkbox"][name="sf_membersList"]:checked').nodeArr().forEach(function (box) {
      n++;
      code += '<option value="' + $sd.players[box.value].name + '|' + box.value + '">' + n + '. ' + $sd.players[box.value].name + '</option>';
    });

    return code;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function closeWindows() {
  var status = $("#sf_progressIco").text();
  var window = $("#sf_statusWindow").node();

  if (window.style.display == "block" && status != "Завершено!") return;

  $("#sf_shadowLayer").node().style.display = "none";

  $("#sf_controlPanelWindow").node().style.display = "none";
  $("#sf_filtersWindow").node().style.display = "none";
  $("#sf_messageWindow").node().style.display = "none";
  $("#sf_calendar").node().style.display = "none";
  window.style.display = "none";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMembersList() {
  var url;

  if ($cd.sid) {
    url = 'http://www.ganjawars.ru/syndicate.php?id=' + $cd.sid + '&page=members';
    displayProgress('start', 'Сбор и обработка информации о составе синдиката', 0, 1);

    try {
      REQ(url, 'GET', null, true, function (req) {
        $answer.innerHTML = req.responseText;
        parse();
        saveToLocalStorage('data');
        renderStatsTable();
        displayProgress('done');
      }, function () {
        errorLog("Сбор информации о составе синдиката", 0, 0);
      });
    } catch (e) {
      errorLog("сборе информации о составе синдиката", 1, e);
    }
  }
  /////////////////////////////

  function parse() {
    var list, id, name, sn, pf;

    list = $($answer).find('b:contains("Состав синдиката")').up('table').find('a[href*="info.php"]').nodeArr();

    _Object$keys($sd.players).forEach(function (id) {
      pf = $sd.players[id].forums[$cd.fid];
      if (pf != null) {
        pf.member = false;
        pf.sn = 0;
      }
    });

    list.forEach(function (node) {
      id = Number(node.href.match(/(\d+)/)[1]);
      name = node.textContent;
      sn = $(node).up('tr').node().cells[0].textContent;
      sn = parseInt(sn, 10);

      if ($sd.players[id] == null) {
        $sd.players[id] = generatePlayer(name);
      }

      if ($sd.players[id].forums[$cd.fid] == null) {
        $sd.players[id].forums[$cd.fid] = generateForumPlayer();
      }

      $sd.players[id].forums[$cd.fid].member = true;
      $sd.players[id].forums[$cd.fid].sn = sn;
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMaxPageSindicateLog() {
  var url, page;

  url = 'http://www.ganjawars.ru/syndicate.log.php?id=' + $cd.sid + '&page_id=10000000';

  try {
    REQ(url, 'GET', null, true, function (req) {
      $answer.innerHTML = req.responseText;
      $cd.lPage = parse();
      page = $cd.lPage - $cd.f.log;

      displayProgress('start', 'Обработка протокола синдиката #' + $cd.fid + ' «' + $sd.forums[$cd.fid].name + '»', 0, page + 1);
      displayProgressTime((page + 1) * 1250);
      parseSindicateLog.gkDelay(750, this, [page]);
    }, function () {
      errorLog("Сбор информации о максимальной странцие протокола синдиката", 0, 0);
    });
  } catch (e) {
    errorLog("сборе информации о максимальной странцие протокола синдиката", 1, e);
  }
  /////////////////////////////

  function parse() {
    var page;

    page = $($answer).find('b:contains("~Протокол синдиката #' + $cd.sid + '")').up('div').next('center').find('a');
    page = page.node(-1).href.split('page_id=')[1];

    return Number(page);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseSindicateLog(index) {
  var url;

  if (index != -1) {
    url = 'http://www.ganjawars.ru/syndicate.log.php?id=' + $cd.sid + '&page_id=' + index;

    try {
      REQ(url, 'GET', null, true, function (req) {
        displayProgress('work');
        $answer.innerHTML = req.responseText;
        $($answer).find('font[color="green"]').nodeArr().reverse().forEach(parse);
        index--;

        if ($cd.lPage != $cd.f.log) $cd.f.log++;

        correctionTime();
        saveToLocalStorage('data');
        parseSindicateLog.gkDelay(750, this, [index]);
      }, function () {
        errorLog("Сбор информации с протокола синдиката", 0, 0);
      });
    } catch (e) {
      errorLog("сборе информации с протокола синдиката", 1, e);
    }
  } else {
    renderStatsTable();
    displayProgress('done');
  }
  /////////////////////////////

  function parse(node) {
    var next, id, date, name;

    node = node.parentNode;
    date = node.textContent.match(/(\d)(\d).(\d)(\d).(\d)(\d) (\d)(\d):(\d)(\d)/);

    if (date) {
      next = $(node).next('nobr').node();

      if (next.textContent.match(/принят в синдикат/)) {
        setDate('enter');
        return;
      }
      if (next.textContent.match(/вышел из синдиката/)) {
        setDate('exit');
        return;
      }
      if (next.textContent.match(/покинул синдикат/)) {
        setDate('exit');
      }
      if (next.textContent.match(/пригласил в синдикат/)) {
        setInvite();
      }
    }
    /////////////////////////////

    function setDate(key) {
      var extra;

      id = $(next).find('a[href*="info.php"]');
      name = id.text();
      date = '' + date[3] + date[4] + '/' + date[1] + date[2] + '/20' + date[5] + date[6] + ' ' + date[7] + date[8] + ':' + date[9] + date[10];
      date = Date.parse(date) / 1000;

      if (id.length != 0) {
        id = id.node().href;
        id = Number(id.match(/(\d+)/)[1]);
      } else {
        name = next.textContent.match(/(.+) покинул синдикат \((.+)\)/)[1];
        id = $cd.nameToId[name];
        extra = true;
      }

      if (id != null) {
        if ($sd.players[id] == null) $sd.players[id] = generatePlayer(name);
        if ($sd.players[id].forums[$cd.fid] == null) $sd.players[id].forums[$cd.fid] = generateForumPlayer();

        $sd.players[id].forums[$cd.fid].goAway = extra ? 1 : 0;
        $sd.players[id].forums[$cd.fid][key] = date;
      } else if (name != null) {
        if ($sd.kicked[$cd.fid] == null) $sd.kicked[$cd.fid] = {};
        $sd.kicked[$cd.fid][name] = date;
      }
    }
    /////////////////////////////

    function setInvite() {
      var name, id;
      name = next.textContent.match(/(.+) пригласил в синдикат (.+)/)[2];
      id = $cd.nameToId[name];

      if (id != null) {
        if ($sd.players[id] == null) $sd.players[id] = generatePlayer(name);
        if ($sd.players[id].forums[$cd.fid] == null) $sd.players[id].forums[$cd.fid] = generateForumPlayer();

        $sd.players[id].forums[$cd.fid].invite = 1;
      } else if (name != null) {
        if ($sd.invite == null) $sd.invite = {};
        if ($sd.invite[$cd.fid] == null) $sd.invite[$cd.fid] = {};
        $sd.invite[$cd.fid][name] = 1;
      }
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMaxPageForum() {
  var url, page, parse;
  return _regeneratorRuntime.async(function getMaxPageForum$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        parse = function parse() {
          var page;

          page = $($answer).find('a[style="color: #990000"]:contains("~Форумы")').up('b').next('center').find('a');
          page = page.node(-1).href.split('page_id=')[1];

          return Number(page);
        };

        url = "http://www.ganjawars.ru/threads.php?fid=" + $forum.id + "&page_id=10000000";

        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(ajax(url, "GET", null));

      case 4:
        $answer.innerHTML = context$1$0.sent;

        $forum.page[1] = parse();
        page = $forum.page[1] - $forum.page[0];

        $idb.add("forums", repack($forum, "forum"));

        displayProgress('start', 'Обработка форума синдиката #' + $forum.id + ' «' + $forum.name + '»', 0, page + 1);
        displayProgressTime(page * 1250 + 1500);

        parseForum.gkDelay(750, this, [page, true]);

        /////////////////////////////

      case 11:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseForum(index, mode, stopDate) {
  var url, count, parse, calcNewThemes;
  return _regeneratorRuntime.async(function parseForum$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        calcNewThemes = function calcNewThemes() {
          var themes;

          themes = $cd.f.themes;
          $cd.f.threads['new'] = $cd.f.threads.all;

          _Object$keys(themes).forEach(function (tid) {
            if (themes[tid].posts[0] == themes[tid].posts[1]) {
              $cd.f.threads['new']--;
            }
          });
        };

        parse = function parse(tr) {
          var td, tid, theme, player, member, t, getId, getName, getPosts, getPages, getDate, getAuthor;
          return _regeneratorRuntime.async(function parse$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                getAuthor = function getAuthor() {
                  var a, name, id;

                  a = $(td[3]).find('a[href*="info.php"]');
                  name = a.text();
                  id = a.node().href.match(/(\d+)/)[0];

                  return [Number(id), name];
                };

                getDate = function getDate() {
                  var date;

                  date = tr.previousSibling.data;
                  date = date.match(/(\d+)/g);
                  date = date[1] + '/' + date[2] + '/' + date[0] + ' ' + date[3] + ':' + date[4] + ':' + date[5];
                  date = Date.parse(date) / 1000;

                  return date;
                };

                getPages = function getPages() {
                  var page;

                  page = [parseInt(theme.posts[0] / 20, 10), parseInt(theme.posts[1] / 20, 10)];

                  return page;
                };

                getPosts = function getPosts() {
                  var posts;

                  posts = $(td[2]).text().replace(/,/g, '');
                  posts = Number(posts);

                  if (theme == null) {
                    return [0, posts];
                  } else {
                    return [theme.posts[0], posts];
                  }
                };

                getName = function getName() {
                  return $(td[0]).find('a').text();
                };

                getId = function getId() {
                  var id;

                  id = $(td[0]).find('a').node();
                  id = id.href.split('tid=')[1];

                  return Number(id);
                };

                td = tr.cells;
                tid = getId();

                //date = getDate();

                context$2$0.next = 10;
                return _regeneratorRuntime.awrap($idb.getOne('themes_' + $forum.id, "id", tid));

              case 10:
                theme = context$2$0.sent;

                console.log("Begin:");

                if (theme == null) {
                  $forum.themes[1]++;
                  $idb.add('forums', repack($forum, "forum"));

                  theme = generateThemes(tid);
                  theme.name = getName();
                  theme.author = getAuthor();
                  theme.posts = getPosts();
                  theme.pages = getPages();
                  theme.start = getDate();
                } else {
                  theme = repack(theme, "theme");
                  theme.posts = getPosts();
                  theme.pages = getPages();
                }

                $idb.add('themes_' + $forum.id, repack(theme, "theme"));
                context$2$0.next = 16;
                return _regeneratorRuntime.awrap($idb.getOne('players', "id", theme.author[0]));

              case 16:
                player = context$2$0.sent;

                if (!(player == null)) {
                  context$2$0.next = 25;
                  break;
                }

                player = generatePlayers(theme.author[0]);
                player.name = theme.author[1];
                player.forums.push($forum.id);

                member = generateMembers(theme.author[0]);
                member.start.push(theme.id);
                context$2$0.next = 32;
                break;

              case 25:
                player = repack(player, "player");
                if (!$c.exist($forum.id, player.forums)) player.forums.push($forum.id);

                context$2$0.next = 29;
                return _regeneratorRuntime.awrap($idb.getOne('members_' + $forum.id, "id", player.id));

              case 29:
                member = context$2$0.sent;

                member = repack(member, "member");

                if (!$c.exist(theme.id, member.start)) {
                  member.start.push(theme.id);
                  console.log(member);
                  console.log("TRUE");
                } else {
                  console.log("FALSE");
                }

              case 32:

                $idb.add('players', repack(player, "player"));

                member = repack(member, "member");
                console.log(member);

                $idb.add('members_' + $forum.id, member);

                context$2$0.next = 38;
                return _regeneratorRuntime.awrap($idb.getOne('members_' + $forum.id, "id", player.id));

              case 38:
                t = context$2$0.sent;

                console.log("M:");
                console.log(t);

                //console.log(theme);
                //console.log(player);
                console.log("End ----");
                //if(mode){
                //  addTheme();
                //}else{
                //  if(stopDate != null && stopDate < date){
                //    addTheme();
                //  }else{
                //    count++;
                //    if(count == 5){
                //      index = -2;
                //    }
                //  }
                //}
                /////////////////////////////

              case 42:
              case 'end':
                return context$2$0.stop();
            }
          }, null, this);
        };

        url = 'http://www.ganjawars.ru/threads.php?fid=' + $cd.fid + '&page_id=' + index;
        count = 0;

        if (!(index != -1)) {
          context$1$0.next = 14;
          break;
        }

        context$1$0.next = 7;
        return _regeneratorRuntime.awrap(ajax(url, "GET", null));

      case 7:
        $answer.innerHTML = context$1$0.sent;

        displayProgress('work');

        $($answer).find('td[style="color: #990000"]:contains("Тема")').up('table').find('tr[bgcolor="#e0eee0"],[bgcolor="#d0f5d0"]').nodeArr().forEach(parse);

        index = $forum.sid ? index - 1 : index + 1;
        if ($forum.sid && $forum.page[0] != $forum.page[1]) $forum.page[0]++;

        //correctionTime();
        //calcNewThemes();
        //saveToLocalStorage('data');

        //parseForum.gkDelay(750, this, [index, mode, stopDate]);

        //try{
        //  REQ(url, 'GET', null, true,
        //    function(req){
        //      displayProgress('work');
        //
        //      $answer.innerHTML = req.responseText;
        //      $($answer)
        //        .find('td[style="color: #990000"]:contains("Тема")')
        //        .up('table')
        //        .find('tr[bgcolor="#e0eee0"],[bgcolor="#d0f5d0"]')
        //        .nodeArr()
        //        .forEach(parse);
        //
        //      index = mode ? index - 1 : index + 1;
        //      if(mode && $cd.fPage != $cd.f.page) $cd.f.page++;
        //
        //      correctionTime();
        //      calcNewThemes();
        //      saveToLocalStorage('data');
        //      parseForum.gkDelay(750, this, [index, mode, stopDate]);
        //    },
        //    function(){
        //      errorLog("Сбор информации о темах", 0, 0);
        //    }
        //  );
        //}catch(e){
        //  errorLog("сборе информации о темах", 1, e);
        //}
        context$1$0.next = 15;
        break;

      case 14:
        //saveToLocalStorage('data');
        //renderTables();
        displayProgress('done');

      case 15:
      case 'end':
        return context$1$0.stop();
    }
  }, null, this);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareParseThemes(max) {
  var themes, tid, list, count;

  themes = $cd.f.themes;
  list = [];
  count = 0;

  for (tid in themes) {
    if (themes[tid].posts[0] != themes[tid].posts[1]) {
      list.push(tid);
      count += calculateThemePages(Number(tid)).count;
      if (list.length == max) break;
    }
  }
  count = list.length * 750 + count * 1250 + 500;
  displayProgressTime(count);
  parseThemes(0, list.length, list);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculateThemePages(id) {
  var theme, pages, sPage, start;

  theme = $cd.f.themes[id];

  pages = theme.posts[1] / 20;
  pages = pages < 1 ? 0 : parseInt(pages, 10);

  sPage = theme.posts[0] / 20;
  sPage = sPage < 1 ? 0 : parseInt(sPage, 10);

  start = theme.posts[0] % 20 + 1;

  return { id: sPage, count: pages + 1, start: start };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseThemes(index, max, list) {
  var info, theme;

  $cd.tid = Number(list[index]);
  theme = $cd.f.themes[$cd.tid];

  if (index < max) {
    info = calculateThemePages($cd.tid);
    parseTheme(info.id, info.count, info.start);
  } else {
    saveToLocalStorage('data');
    renderTables();
    displayProgress('done');
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function parseTheme(id, count, start) {
    var url;

    $cd.tPage = id;
    url = 'http://www.ganjawars.ru/messages.php?fid=' + $cd.fid + '&tid=' + $cd.tid + '&page_id=' + $cd.tPage;

    if (id < count) {
      try {
        REQ(url, 'GET', null, true, function (req) {
          $answer.innerHTML = req.responseText;
          parse();
          correctionTime();
        }, function () {
          errorLog('Сбор информации о сообщениях', 0, 0);
          nextPageTheme();
        });
      } catch (e) {
        errorLog('сборе информации о сообщениях', 1, e);
        nextPageTheme();
      }
    } else {
      nextTheme();
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function parse() {
      var table, tr, pid, player, pf, w;
      var i, length;

      table = $($answer).find('td[style="color: #990000"]:contains("Автор")').up('table').node();

      $(table).find('font:contains("~Тема закрыта")').nodeArr().forEach(function (node) {
        node = $(node).up('tr').node();
        node.parentNode.removeChild(node);
      });
      tr = table.rows;
      length = tr.length;

      for (i = start; i < length; i++) {
        pid = getId();

        if ($sd.players[pid] == null) {
          $sd.players[pid] = generatePlayer(getName());
        }
        player = $sd.players[pid];

        if (player.forums[$cd.fid] == null) {
          player.forums[$cd.fid] = generateForumPlayer();
        }
        pf = player.forums[$cd.fid];

        theme.posts[0]++;
        $cd.f.posts++;

        pf.posts++;
        pf.last = getLastDate();

        w = getWords();
        $cd.f.words += w;
        pf.words[0] += w;
        pf.words[1] = parseInt(pf.words[0] / pf.posts, 10);

        if (!pf.themes.gkExist($cd.tid)) {
          pf.themes.push($cd.tid);
        }
      }

      nextPageTheme();
      /////////////////////////////

      function getId() {
        var id;

        id = $(tr[i].cells[0]).find('a[href*="info.php"]').node();
        id = id.href.match(/(\d+)/)[1];
        id = Number(id);

        return id;
      }
      /////////////////////////////

      function getName() {
        return $(tr[i].cells[0]).find('a[href*="info.php"]').text();
      }
      /////////////////////////////

      function getLastDate() {
        var date;

        date = $(tr[i].cells[1]).find('td[align="left"]:contains("~написано")').text();

        date = date.match(/(.+): (\d+)-(\d+)-(\d+) (.+) /);
        date = date[3] + '/' + date[4] + '/' + date[2] + ' ' + date[5];
        date = Date.parse(date) / 1000;

        return date > pf.last ? date : pf.last;
      }

      function getWords() {
        var words;

        words = $(tr[i].cells[1]).find('table[cellpadding="5"]').text();
        words = (words.replace(/\s['";:,.?¿\-!¡]/g, '').match(/\s+/g) || []).length + 1;

        return words;
      }
    }
    /////////////////////////////

    function nextTheme() {
      index++;
      $cd.f.threads['new']--;
      displayProgress('work');
      saveToLocalStorage('data');
      parseThemes.gkDelay(750, this, [index, max, list]);
    }
    /////////////////////////////

    function nextPageTheme() {
      id++;
      displayProgress.gkDelay(750, this, ['extra', '<br><b>Тема:</b> <i>' + $cd.f.themes[$cd.tid].name + '</i> [' + id + '/' + count + ']']);
      parseTheme.gkDelay(750, this, [id, count, 1]);
    }
    /////////////////////////////
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareParseMembers(count) {
  var length, player, list;

  length = count != null ? count : $cd.countMembers;
  list = [];

  while (length--) {
    player = $sd.players[$cd.members[length]];
    if (count == null) {
      list.push($cd.members[length]);
    } else {
      if (player.status.text == '') {
        list.push($cd.members[length]);
      }
    }
  }
  count = list.length * 750 + 500;
  displayProgressTime(count);

  parseMembers(0, list.length, list);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseMembers(id, count, list) {
  var url, player;

  if (id < count) {
    player = $sd.players[list[id]];
    url = 'http://www.ganjawars.ru/info.php?id=' + list[id];
    try {
      REQ(url, 'GET', null, true, function (req) {
        $answer.innerHTML = req.responseText;
        parse();
        saveToLocalStorage('data');
        correctionTime();
        nextMember();
      }, function () {
        errorLog('Сбор статуса персонажа', 0, 0);
        nextMember();
      });
    } catch (e) {
      errorLog('сборе статуса персонажа', 1, e);
    }
  } else {
    renderStatsTable();
    displayProgress('done');
  }
  /////////////////////////////

  function nextMember() {
    id++;
    displayProgress.gkDelay(750, this, ['work']);
    parseMembers.gkDelay(750, this, [id, count, list]);
  }
  /////////////////////////////

  function parse() {
    var block, arrest, banDefault, banCommon, banTrade, status, date;

    status = 'Ok';
    date = parseInt(new Date().getTime() / 1000, 10);

    block = $($answer).find('font[color="red"]:contains("Персонаж заблокирован")');
    arrest = $($answer).find('center:contains("Персонаж арестован, информация скрыта")').find('font[color="#000099"]');
    banDefault = $($answer).find('font[color="red"]:contains("~временно забанен в форуме модератором")');
    banCommon = $($answer).find('center:contains("~Персонаж под общим баном")').find('font[color="#009900"]');
    banTrade = $($answer).find('font[color="red"]:contains("~забанен в торговых форумах")');

    if (banTrade.length) {
      date = getDate(banTrade.text());
      status = 'Торговый';
    }
    if (arrest.length) {
      date = 0;
      status = 'Арестован';
    }
    if (banDefault.length) {
      date = getDate(banDefault.text());
      status = 'Форумный';
    }
    if (banCommon.length) {
      date = getDate(banCommon.text());
      status = 'Общий бан';
    }
    if (block.length) {
      date = 0;
      status = 'Заблокирован';
    }

    player.status.text = status;
    player.status.date = date;
  }
  /////////////////////////////

  function getDate(string) {
    var date;

    date = string.match(/(\d+)/g);
    date = date[3] + '/' + date[2] + '/20' + date[4] + ' ' + date[0] + ':' + date[1];
    date = Date.parse(date) / 1000;

    return date;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareSendMails() {
  var param, window, count, mode, tm, sid;
  var queue,
      f,
      invites = {};

  param = {
    list: [],
    awayList: {},
    lopata: '',
    out: 0,
    subject: '',
    message: '',
    sid: 0,
    mode: ''
  };

  tm = {
    mail: "Отправка почты",
    invite: "Отправка почты и приглашений",
    goAway: "Отправка почты и изгнание"
  };

  queue = ["getLopata", "stop"];
  f = {
    getInvitesId: function getInvitesId() {
      _getInvitesId();
    },
    getGoAwayId: function getGoAwayId() {
      _getGoAwayId();
    },
    getLopata: function getLopata() {
      _getLopata();
    },
    stop: function stop() {
      _stop();
    }
  };

  window = $("#sf_messageWindow").node();
  param.subject = encodeURIComponent($(window).find('input[type="text"][name="subject"]').node().value);
  param.message = encodeURIComponent($(window).find('textarea[name="message"]').node().value);
  param.mode = $(window).find('select[name="workMode"]').find('option:checked').node().value;
  sid = $(window).find('select[name="sid"]').find('option:checked').node();
  param.sid = Number(sid.value);sid = sid.textContent;

  if (param.mode != "mail") {
    if (param.sid == 0) {
      alert("Не выбран синдикат!");
      return;
    }
    if (param.mode == "invite") queue.unshift("getInvitesId");
    if (param.mode == "goAway") queue.unshift("getGoAwayId");
  }

  if (param.mode == "mail") {
    if (!confirm('Режим: ' + tm[param.mode] + '\n\n Все правильно?')) return;
  } else {
    if (!confirm('Режим:       ' + tm[param.mode] + '\nСиндикат:  ' + sid + '\n\n Все правильно?')) return;
  }

  next(0);
  /////////////////////////////

  function _stop() {
    $(window).find('select').find('option[value]').nodeArr().forEach(getList);

    count = param.list.length;

    openStatusWindow();
    displayProgress('start', 'Рассылка сообщений выбранным игрокам', 0, count);
    displayProgressTime(count * 39500 + 500);
    doActions(0, count, param);
  }

  /////////////////////////////

  function getList(option) {
    var name, id;

    id = option.value.split("|");
    name = id[0];
    id = id[1];

    if (invites[name] == null) {
      param.list.push({
        id: id,
        name: name,
        encode: encodeURIComponent(name)
      });
    }
  }
  /////////////////////////////

  function _getLopata() {
    try {
      REQ('http://www.ganjawars.ru/sms-create.php', 'GET', null, true, function (req) {
        $answer.innerHTML = req.responseText;
        param.out = Number($($answer).find('input[type="hidden"][name="outmail"]').node().value);
        param.lopata = $($answer).find('input[type="hidden"][name="lopata"]').node().value;

        next();
      }, function () {
        errorLog('Получении лопаты', 0, 0);
      });
    } catch (e) {
      errorLog('получении лопаты', 1, e);
    }
  }
  /////////////////////////////

  function _getGoAwayId() {
    try {
      REQ('http://www.ganjawars.ru/syndicate.edit.php?key=users&id=' + param.sid, 'GET', null, true, function (req) {
        $answer.innerHTML = req.responseText;
        param.awayList = {};

        $($answer).find('select[name="cid"]').find("option").nodeArr().forEach(parse);

        next();
      }, function () {
        errorLog('Получении списка id на изгнание персонажей', 0, 0);
      });
    } catch (e) {
      errorLog('получении списка id на изгнание персонажей', 1, e);
    }
    /////////////////////////////

    function parse(option) {
      var id, name;

      id = Number(option.value);
      name = option.textContent;
      name = name.match(/(\d+)\. (.+) \/ \$(\d+)/);
      name = name[2];

      param.awayList[name] = id;
    }
  }
  /////////////////////////////

  function _getInvitesId() {
    try {
      REQ('http://www.ganjawars.ru/syndicate.edit.php?key=invites&id=' + param.sid, 'GET', null, true, function (req) {
        $answer.innerHTML = req.responseText;
        param.awayList = {};

        $($answer).find('b:contains("Приглашенные персоны:")').up('td').find('a[href*="info.php"]').nodeArr().forEach(parse);

        next();
      }, function () {
        errorLog('Получении списка id на изгнание персонажей', 0, 0);
      });
    } catch (e) {
      errorLog('получении списка id на изгнание персонажей', 1, e);
    }

    function parse(node) {
      invites[node.textContent] = node.href.split('=')[1];
    }
  }
  /////////////////////////////

  function next(type) {
    if (type != null) {
      f[queue.shift()]();
      return;
    }

    f[queue.shift()].gkDelay(750, this, []);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doActions(index, count, param) {
  if (index < count) {
    if (param.mode == "invite") {
      sendInvite(index, param);
    }
    if (param.mode == "goAway") {
      if (param.awayList[param.list[index].name] != null) doGoAway(param.sid, param.awayList[param.list[index].name]);
    }

    sendMail.gkDelay(1250, this, [index, param]);

    param.out++;
    index++;

    displayProgress('work');
    doActions.gkDelay(random(360, 380) * 100, this, [index, count, param]);
  } else {
    displayProgress('done');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendMail(index, param) {
  var data;

  data = 'postform=1&outmail=' + param.out + '&lopata=' + param.lopata + '&mailto=' + param.list[index].encode + '&subject=' + param.subject + '&msg=' + param.message;

  try {
    REQ('http://www.ganjawars.ru/sms-create.php', 'POST', data, true, function () {
      correctionTime();
    }, function () {
      errorLog('Отправке письма ' + param.list[index].name, 0, 0);
    });
  } catch (e) {
    errorLog('отправке письма ' + param.list[index].name, 1, e);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendInvite(index, param) {
  var data, invite;

  data = 'key=invites&id=' + param.sid + '&invite=' + param.list[index].encode;
  invite = $mode ? $sd : $tsd;
  invite = invite.players[param.list[index].id].forums["1" + param.sid].invite;

  try {
    REQ('http://www.ganjawars.ru/syndicate.edit.php', 'POST', data, true, function () {
      correctionTime();
      invite = 1; //// Пееределать
      saveToLocalStorage('data');
    }, function () {
      errorLog('Отправке приглашения ' + param.list[index].name, 0, 0);
    });
  } catch (e) {
    errorLog('отправке приглашения ' + param.list[index].name, 1, e);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doGoAway(sid, id) {
  var data = 'id=' + sid + '&key=users&remove=' + id;

  try {
    REQ('http://www.ganjawars.ru/syndicate.edit.php', 'POST', data, true, function () {
      correctionTime();
    }, function () {
      errorLog('Изгнанние ' + id, 0, 0);
    });
  } catch (e) {
    errorLog('изгнании ' + id, 1, e);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//function generatePlayer(name){
//  return {
//    name: name,
//    status: {
//      text: '',
//      date: 0
//    },
//    forums:{}
//  };
//}
//
//function generateForumPlayer(){
//  return {
//    sn: 0,
//    enter: 0,
//    exit: 0,
//    goAway: 0,
//    invite: 0,
//    member: false,
//    posts: 0,
//    last: 0,
//    words: [0, 0],
//    start: [],
//    themes: []
//  };
//}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderBaseHTML() {
  var header, footer, b1, b2, width;

  $t.stats.setWidth([65, 45, -1, 40, 75, 75, 95, 80, 75, 75, 75, 75, 172, 80, 80, 50, 75, 95, 45]);

  $t.stats.setStructure([["paths", "$sd.players[id]", "$sd.players[id].forums[$cd.fid]", "$checked.players[id]", "getPercent($sd.players[id].forums[$cd.fid]"], ["id", 0, "Number(id)", "number", "ID"], ["sNumber", 2, ".sn", "number", "Номер в списке синдиката"], ["name", 1, ".name", "check", "Имя"], ["member", 2, ".member", "boolean", "В составе"], ["status", 1, ".status", "multiple", "Статус"], ["enter", 2, ".enter", "date", "Принят"], ["exit", 2, ".exit", "date", "Покинул"], ["invite", 2, ".invite", "date", "Приглашен"], ["checked", 3, "", null, null], ["startThemes", 2, ".start.length", "number", "Начато тем"], ["writeThemes", 2, ".themes.length", "number", "Учавствовал в темах"], ["lastMessage", 2, ".last", "date", "Последнее сообщение"], ["posts", 2, ".posts", "number", "Всего сообщений"], ["percentStartThemes", 4, ".start.length, $cd.f.threads.all, false);", "number", "Процент начатых тем"], ["percentWriteThemes", 4, ".themes.length, $cd.f.threads.all, false);", "number", "Процент участия в темах"], ["percentPosts", 4, ".posts, $cd.f.posts, false);", "number", "Процент сообщений"], ["percentWords", 4, ".words[0], $cd.f.words, false);", "number", "Процент написанных слов"], ["words", 2, ".words[0]", "number", "Всего написанных слов"], ["wordsAverage", 2, ".words[1]", "number", "Среднее количество написанных слов"]]);

  //<div style="width: 24px; height: 24px; margin-left: 5px; float: left; background-image: url(${$ico.memberIco})"></div>

  header = '<table align="center" style="width: 100%;" type="padding">\n                <tr style="height: 35px; font-style: italic;">\n                    <td align="center" colspan="17">Данные по форуму #' + $cd.fid + '<b> «' + $forum.name + '»</b></td>\n                </tr>\n                <tr type="header">\n                    <td ' + $t.stats.getWidth(0) + ' align="center" rowspan="2" sort="id" height="60">#<img /></td>\n                    <td ' + $t.stats.getWidth(1) + ' align="center" rowspan="2" sort="sNumber">№<img /></td>\n                    <td ' + $t.stats.getWidth(2) + ' align="center" rowspan="2" sort="name">Имя<img /></td>\n                    <td ' + $t.stats.getWidth(3) + ' align="center" rowspan="2" sort="member"><img /></td>\n                    <td align="center" colspan="2">Темы</td>\n                    <td align="center" colspan="2">Посты</td>\n                    <td align="center" colspan="4">Процент</td>\n                    <td ' + $t.stats.getWidth(12) + ' align="center" rowspan="2" sort="status">Статус<img /></td>\n                    <td ' + $t.stats.getWidth(13) + ' align="center" rowspan="2" sort="enter">Принят<img /></td>\n                    <td ' + $t.stats.getWidth(14) + ' align="center" rowspan="2" sort="exit">Покинул<img /></td>\n                    <td ' + $t.stats.getWidth(15) + ' align="center" rowspan="2" sort="invite">Звал<img /></td>\n                    <td align="center" colspan="2">Слов в постах</td>\n                    <td ' + $t.stats.getWidth(18) + ' align="center" rowspan="2" sort="checked" width="45">@<img /></td>\n                </tr>\n                <tr type="header">\n                    <td ' + $t.stats.getWidth(4) + ' align="center" sort="startThemes">Начато<img /></td>\n                    <td ' + $t.stats.getWidth(5) + ' align="center" sort="writeThemes">Участия<img /></td>\n                    <td ' + $t.stats.getWidth(6) + ' align="center" sort="lastMessage">Последний<img /></td>\n                    <td ' + $t.stats.getWidth(7) + ' align="center" sort="posts">Кол-во<img /></td>\n                    <td ' + $t.stats.getWidth(8) + ' align="center" sort="percentStartThemes">Нач.тем<img /></td>\n                    <td ' + $t.stats.getWidth(9) + ' align="center" sort="percentWriteThemes">Участия<img /></td>\n                    <td ' + $t.stats.getWidth(10) + ' align="center" sort="percentPosts">Постов<img /></td>\n                    <td ' + $t.stats.getWidth(11) + ' align="center" sort="percentWords">Слов<img /></td>\n                    <td ' + $t.stats.getWidth(16) + ' align="center" sort="words">Всего<img /></td>\n                    <td ' + $t.stats.getWidth(17) + ' align="center" sort="wordsAverage" title="Среднее количесвто слов в одном сообщении">В среднем<img /></td>\n                </tr>\n            </table>';

  footer = '<table align="center" style="width: 100%;" type="padding">\n                <tr style="background-color: #d0eed0;" type="filters">\n                    <td align="center" ' + $t.stats.getWidth(0) + ' filter="id"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(1) + ' filter="sNumber"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(2) + ' filter="name"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(3) + ' filter="member"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(4) + ' filter="startThemes"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(5) + ' filter="writeThemes"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(6) + ' filter="lastMessage"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(7) + ' filter="posts"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(8) + ' filter="percentStartThemes"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(9) + ' filter="percentWriteThemes"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(10) + ' filter="percentPosts"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(11) + ' filter="percentWords"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(12) + ' filter="status"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(13) + ' filter="enter"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(14) + ' filter="exit"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(15) + ' filter="invite"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(16) + ' filter="words"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(17) + ' filter="wordsAverage"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.stats.getWidth(18) + ' ></td>\n                </tr>\n                <tr style="height: 35px; background-color: #d0eed0;">\n                    <td colspan="12" id="sf_currentFilters"></td>\n                    <td colspan="2">\n                        Всего тем: <b> ' + $forum.themes[1] + '</b>, всего постов: <b>' + $forum.posts + '</b>\n                    </td>\n                    <td colspan="5">\n                        Позиций в таблице: <b id="sf_SI_ListCount">0</b>, отмечено: <b id="sf_SI_ListChecked">0</b>\n                    </td>\n                </tr>\n            </table>\n            <span id="sf_bCheckAllMembers">[отметить всё]</span>';

  $('#sf_header_SI').html(header);
  $('#sf_footer_SI').html(footer);

  $t.stats.setControl($ico);

  b1 = $('#sf_bCheckAllMembers').node();
  bindEvent(b1, 'onclick', function () {
    checkAllMembers(b1, '#sf_content_SI');
  });

  //header =
  //    `<table align="center" style="width: 100%" type="padding">
  //        <tr style="height: 35px; font-style: italic;">
  //            <td align="center" colspan="2">Данные по начатым игроком темам</td>
  //        </tr>
  //        <tr type="header" height="48">
  //            <td align="center" style="width: 100px;">Имя игрока:</td>
  //            <td align="left">${createSelect()}</td>
  //        </tr>
  //        <tr>
  //            <td id="sf_STI" colspan="2" valign="top"></td>
  //        </tr>
  //    </table>`;
  //
  //$('#sf_header_STI').html(header);

  $t.themes.setWidth([70, -1, 250, 80, 100, 100, 43]);
  $t.themes.setStructure([["paths", "$cd.f.themes[id]", "$checked.themes[id]"], ["id", 0, "Number(id)", "number", "ID"], ["name", 1, ".name", "check", "Названии темы"], ["author", 1, ".author", "check", "Имени автора"], ["date", 1, ".date", "date", "Дате создания"], ["check", 2, "", null, null], ["postsDone", 1, ".posts[0]", "number", "Обработано сообщений"], ["postsAll", 1, ".posts[1]", "number", "Всего сообщений"]]);

  header = '<table align="center" style="width: 100%;" type="padding">\n                <tr style="height: 35px; font-style: italic;">\n                    <td align="center" colspan="7">Данные по обработанным темам</td>\n                </tr>\n                <tr type="header">\n                    <td align="center" ' + $t.themes.getWidth(0) + ' sort="id" rowspan="2" style="height: 50px;">#<img /></td>\n                    <td align="center" ' + $t.themes.getWidth(1) + ' sort="name" rowspan="2">Тема<img /></td>\n                    <td align="center" ' + $t.themes.getWidth(2) + ' sort="author" rowspan="2">Автор<img /></td>\n                    <td align="center" ' + $t.themes.getWidth(3) + ' sort="date" rowspan="2">Создана<img /></td>\n                    <td align="center" colspan="2">Сообщений</td>\n                    <td align="center" ' + $t.themes.getWidth(6) + ' sort="check" rowspan="2">@<img /></td>\n                </tr>\n                <tr type="header">\n                    <td align="center" ' + $t.themes.getWidth(4) + ' sort="postsDone">Обработано<img /></td>\n                    <td align="center" ' + $t.themes.getWidth(5) + ' sort="postsAll">Всего<img /></td>\n                </tr>\n            </table>';

  footer = '<table align="center" style="width: 100%;" type="padding">\n                <tr style="background-color: #d0eed0;" type="filters">\n                    <td align="center" ' + $t.themes.getWidth(0) + ' filter="id"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.themes.getWidth(1) + ' filter="name"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.themes.getWidth(2) + ' filter="author"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.themes.getWidth(3) + ' filter="date"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.themes.getWidth(4) + ' filter="postsDone"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.themes.getWidth(5) + ' filter="postsAll"><img src="' + $ico.filter + '"></td>\n                    <td align="center" ' + $t.themes.getWidth(6) + ' ></td>\n                </tr>\n                <tr style="height: 35px; background-color: #d0eed0;">\n                    <td colspan="4">\n                    </td>\n                    <td colspan="3">\n                    </td>\n                </tr>\n            </table>\n            <span style="float: right; margin-right: 5px; font-size: 10px; cursor: pointer;" id="sf_bCheckAllThemes">[отметить всё]</span>';

  $('#sf_header_TL').html(header);
  $('#sf_footer_TL').html(footer);

  $t.themes.setControl($ico);

  b2 = $('#sf_bCheckAllThemes').node();
  bindEvent(b2, 'onclick', function () {
    checkAllMembers(b2, '#sf_content_TL');
  });

  /////////////////////////////

  function checkAllMembers(button, id) {
    var cn = $('#sf_SI_ListChecked');

    if (button.textContent == "[отметить всё]") {
      button.textContent = "[снять всё]";
      if (id == "#sf_content_SI") cn.html($cd.statsCount);
    } else {
      button.textContent = "[отметить всё]";
      if (id == "#sf_content_SI") cn.html(0);
    }

    $(id).find('input[type="checkbox"]').nodeArr().forEach(function (box) {
      if (button.textContent != "[отметить всё]") {
        doThis(box, "lightChecked", true, $ico.boxOn, true);
      } else {
        doThis(box, "light", false, $ico.boxOff, false);
      }
    });
    /////////////////////////////

    function doThis(box, type, c, img, check) {
      $(box).up('tr').node().setAttribute("type", type);
      box.checked = c;
      box.nextElementSibling.style.background = 'url("' + img + '")';
      if (id == "#sf_content_SI") $checked.players[box.value] = check;
      if (id == "#sf_content_TL") $checked.themes[box.value] = check;
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderStatsTable(sorted) {
  var table = $t.stats;

  if (!sorted) {
    table.clearContent();
    prepareRenders("players", table);
    table.sorting();
  }

  $cd.statsCount = 0;
  showStats(table);
  bindCheckingOnRows('#sf_content_SI');
}

function renderThemesTable(sorted) {
  var table = $t.themes;

  if (!sorted) {
    table.clearContent();
    prepareRenders("themes", table);
    table.sorting();
  }

  $cd.themesCount = 0;
  showThemeList(table);
  bindCheckingOnRows('#sf_content_TL');
}

function renderTables() {
  renderStatsTable();
  renderThemesTable();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doFilter(td, tName, type, name) {
  console.log(td);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function prepareRenders(value, table) {
  var m = [],
      f = [],
      added;

  if (value == "players") {
    _Object$keys($sd[value]).forEach(processing);
    //Object.keys($ss.show.stats).forEach(prepareFilters);
  } else {
      _Object$keys($sd.forums[$cd.fid].themes).forEach(processing);
    }

  if (added && $mode) saveToLocalStorage('data');

  return { m: m, f: f };

  function processing(id) {
    var p, pf, kicked, invite, f;

    if ($checked[value][id] == null) {
      $checked[value][id] = false;
    }

    if (value == "players") {
      p = $sd.players[id];
      pf = p.forums[$cd.fid];

      if (pf != null) {
        //kicked = $mode ? $sd.kicked[$cd.fid] : $tsd.kicked[$cd.fid];
        //if(kicked != null && pf != null && kicked[p.name] != null){
        //    if(pf.exit <= kicked[p.name]){
        //        pf.goAway = 1;
        //        pf.exit = kicked[p.name];
        //        if($mode) delete kicked[p.name];
        //        added = true;
        //    }
        //}
        //
        //invite = $mode ? $sd.invite[$cd.fid] : $tsd.invite[$cd.fid];
        //
        //if(invite != null && invite[p.name] != null){
        //    pf.invite = 1;
        //    if($mode) delete invite[p.name];
        //    added = true;
        //}
        //
        //if(!$mode && $tsd.players[id] && $tsd.players[id].forums['17930']){
        //    f = $tsd.players[id].forums['17930'];
        //    pf.sn = f.sn;
        //    pf.enter = f.enter;
        //    pf.exit = f.exit;
        //    pf.invite = f.invite;
        //    pf.member = f.member;
        //    pf.goAway = f.goAway;
        //}
        //
        //m.push(id);

        table.setContent(id);
      }
    } else {
      table.setContent(id);
    }
  }
  /////////////////////////////////////

  function prepareFilters(value) {
    if ($ss.show.stats[value] != null) f.push(value);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doSort(td, table) {
  var cell,
      name = table.getName();

  table.setSort($ico);

  cell = td.getAttribute("sort");
  if (cell == $ss.sort[name].cell) {
    $ss.sort[name].type = $ss.sort[name].type == 0 ? 1 : 0;
  } else {
    $ss.sort[name].cell = cell;
    $ss.sort[name].type = 1;
  }

  table.changeSortImage($ico);
  table.sorting();

  saveToLocalStorage('settings');

  if (name == "stats") renderStatsTable(true);
  if (name == "themes") renderThemesTable(true);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bindCheckingOnRows(id) {
  $(id).find('tr').nodeArr().forEach(function (node) {
    bindEvent(node, 'onclick', function () {
      checkedId(node);
    });
  });

  function checkedId(node) {
    if (node.getAttribute("type") == "light") {
      node.setAttribute("type", "lightChecked");
    } else {
      node.setAttribute("type", "light");
    }
    node = $(node).find('input[type="checkbox"]').node();
    node.nextSibling.style.background = node.checked ? 'url("' + $ico.boxOff + '")' : 'url("' + $ico.boxOn + '")';
    node.checked = !node.checked;

    if (id == "#sf_content_SI") {
      $checked.players[node.value] = !$checked.players[node.value];
      changeCount('#sf_SI_ListChecked', node.checked);
    }
    if (id == "#sf_content_TL") {
      $checked.themes[node.value] = !$checked.themes[node.value];
    }
  }

  function changeCount(id, state) {
    var count, cn;

    cn = $(id);
    count = Number(cn.text());
    cn.html(state ? count + 1 : count - 1);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showStats(table) {
  var code;

  code = '<div style="max-height: 477px; overflow-y: scroll;">\n                <table align="center" style="width: 100%;" type="padding">';

  table.getContent().forEach(function (tr) {
    var memberIco, inviteIco, light, check, box, kickedColor;

    if (tr.check) {
      light = "lightChecked";
      check = "checked";
      box = $ico.boxOn;
    } else {
      light = "light";
      check = "";
      box = $ico.boxOff;
    }

    memberIco = tr.member ? $ico.inTeam : $ico.outTeam;
    inviteIco = tr.invite ? $ico.inTeam : $ico.outTeam;
    kickedColor = tr.goAway ? 'style="color: brown; font-weight: bold;"' : "";

    code += '<tr height="28" type="' + light + '">\n                            <td ' + table.getWidth(0) + ' align="right">' + convertID(tr.id) + '</td>\n                            <td ' + table.getWidth(1) + ' align="center">' + hz(tr.sNumber) + '</td>\n                            <td ' + table.getWidth(2) + ' style="text-indent: 5px;"><a style="text-decoration: none; font-weight: bold;" target="_blank" href="http://www.ganjawars.ru/info.php?id=' + tr.id + '">' + tr.name + '</a></td>\n                            <td ' + table.getWidth(3) + ' align="center"><img src="' + memberIco + '" /></td>\n                            <td ' + table.getWidth(4) + ' align="center">' + hz(tr.startThemes) + '</td>\n                            <td ' + table.getWidth(5) + ' align="center">' + hz(tr.writeThemes) + '</td>\n                            <td ' + table.getWidth(6) + ' align="center">' + getNormalDate(tr.lastMessage).d + '</td>\n                            <td ' + table.getWidth(7) + ' align="center">' + hz(tr.posts) + '</td>\n                            <td ' + table.getWidth(8) + ' align="center">' + hz(tr.percentStartThemes, 1) + '</td>\n                            <td ' + table.getWidth(9) + ' align="center">' + hz(tr.percentWriteThemes, 1) + '</td>\n                            <td ' + table.getWidth(10) + ' align="center">' + hz(tr.percentPosts, 1) + '</td>\n                            <td ' + table.getWidth(11) + ' align="center">' + hz(tr.percentWords, 1) + '</td>\n                            <td ' + table.getWidth(12) + ' align="center">' + statusMember(tr.status) + '</td>\n                            <td ' + table.getWidth(13) + ' align="center">' + getNormalDate(tr.enter).d + '</td>\n                            <td ' + table.getWidth(14) + ' align="center" ' + kickedColor + '>' + getNormalDate(tr.exit).d + '</td>\n                            <td ' + table.getWidth(15) + ' align="center"><img src="' + inviteIco + '" /></td>\n                            <td ' + table.getWidth(16) + ' align="center">' + hz(tr.words) + '</td>\n                            <td ' + table.getWidth(17) + ' align="center">' + hz(tr.wordsAverage) + '</td>\n                            <td ' + table.getWidth(18, true) + '><input type="checkbox" ' + check + ' name="sf_membersList" value="' + tr.id + '"/><div style="margin: auto; width: 13px; height: 13px; background: url(\'' + box + '\')"></div></td>\n                        </tr>\n                    ';

    $cd.statsCount++;
  });

  code += '</table>\n            </div>';

  $('#sf_content_SI').html(code);
  $('#sf_SI_ListCount').html($cd.statsCount);

  /////////////////////////////

  function hz(value, p) {
    return value == 0 ? "-" : p != null ? value + '<span style="font-size: 9px;"> %</span>' : value;
  }
  /////////////////////////////

  function statusMember(s) {
    if (s.text == '') return "-";
    if (s.text == "Ok") return '<div style="width: 100%; height: 100%; background: url(\'' + $ico.ok + '\') no-repeat 38px 0; line-height: 28px; text-indent: 25px;">[' + getNormalDate(s.date).d + ']</div>';
    if (s.date != 0) return $date > s.date ? "?" : '<span style="' + $statusStyle[s.text] + '">' + s.text + '</span> [' + getNormalDate(s.date).d + ']';

    return '<span style="' + $statusStyle[s.text] + '">' + s.text + '</span>';
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showThemeList(table) {
  var code, light, check, box;

  code = '<div style="max-height: 495px; overflow-y: scroll;">\n                <table align="center" style="width: 100%;" type="padding">';

  table.getContent().forEach(function (tr) {
    if (tr.check) {
      light = "lightChecked";
      check = "checked";
      box = $ico.boxOn;
    } else {
      light = "light";
      check = "";
      box = $ico.boxOff;
    }

    code += '<tr height="28" type="' + light + '">\n                        <td ' + table.getWidth(0) + ' align="right">' + convertID(tr.id) + ' </td>\n                        <td ' + table.getWidth(1) + ' style="text-indent: 5px;"><a style="text-decoration: none; font-weight: bold;" target="_blank" href="http://www.ganjawars.ru/messages.php?fid=' + $cd.fid + '&tid=' + tr.id + '">' + tr.name + '</a></td>\n                        <td ' + table.getWidth(2) + ' style="text-indent: 5px;" width="250"><a style="text-decoration: none; font-weight: bold;" href="http://www.ganjawars.ru/info.php?id=' + tr.author.id + '">' + tr.author.name + '</a></td>\n                        <td ' + table.getWidth(3) + ' align="center">' + getNormalDate(tr.date).d + '</td>\n                        <td ' + table.getWidth(4) + ' align="center">' + tr.postsDone + '</td>\n                        <td ' + table.getWidth(5) + ' align="center">' + tr.postsAll + '</td>\n                        <td ' + table.getWidth(6, true) + ' align="center"><input type="checkbox" ' + check + ' name="sf_themesList" value="' + tr.id + '" /><div style="width: 13px; height: 13px; background: url(\'' + box + '\')"></div></td>\n                    </tr>';
  });

  code += '</table>\n            </div>';

  $('#sf_content_TL').html(code);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getCurrentFilters() {
  var list, l, result;

  list = _Object$keys($ss.show.stats).reverse();
  l = list.length;
  result = [];

  while (l--) {
    if ($ss.show.stats[list[l]] != null) {
      result.push('[' + $cd.values.stats[list[l]][0] + ']');
    }
  }
  result = result.length ? '<span style="font-weight: bold;">Активные фильтры:</span> ' + result.join(' ') : '';

  $('#sf_currentFilters').html(result);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getTimeRequest(type) {
  if (!type) {
    $cd.timeRequest = new Date().getTime();
  } else {
    $cd.timeRequest = new Date().getTime() - $cd.timeRequest;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function correctionTime() {
  var node, time, t;

  t = $cd.timeRequest;
  node = $('#sf_progressTime');
  time = Number(node.text());

  if (t > 500) {
    node.html(time - (500 - t));
  } else if (t < 500) {
    node.html(time + (t - 500));
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function errorLog(text, full, e) {
  if (full) {
    console.groupCollapsed($nameScript);
    console.error('Случилась при: ' + text + '. Ошибка: %s, строка: %d"', e.name, e.lineNumber);
    console.groupEnd();
  } else {
    console.error('Запрос завершился неудачно. ' + text + '.');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// АПИ для работы с LS

function saveToLocalStorage(type) {
  var string;

  if (type == 'data' && $mode) {
    string = JSON.stringify($sd);
    localStorage.setItem("gk_SF_data", string);
  }
  if (type == 'settings') {
    string = JSON.stringify($ss);
    localStorage.setItem("gk_SF_settings", string);
  }
}

function loadFromLocalStorage(type) {
  var string;

  if (type == 'data') {
    string = localStorage.getItem("gk_SF_data");

    if (string) {
      if ($mode) {
        $sd = JSON.parse(string);
      } else {
        $tsd = JSON.parse(string);
      }
    } else {
      saveToLocalStorage('data');
    }
  }
  if (type == 'settings') {
    string = localStorage.getItem("gk_SF_settings");

    if (string) {
      $ss = JSON.parse(string);
    } else {
      saveToLocalStorage('settings');
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// АПИ запроса

function REQ(url, method, param, async, onsuccess, onfailure) {
  var request = new XMLHttpRequest();

  getTimeRequest();

  request.open(method, url, async);
  if (method == 'POST') request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send(param);

  if (async == true) {
    request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200 && typeof onsuccess != 'undefined') {
        getTimeRequest(1);
        onsuccess(request);
      } else if (request.readyState == 4 && request.status != 200 && typeof onfailure != 'undefined') onfailure(request);
    };
  }

  if (async == false) {
    if (request.status == 200 && typeof onsuccess != 'undefined') onsuccess(request);else if (request.status != 200 && typeof onfailure != 'undefined') onfailure(request);
  }
}

function repack(o, key) {
  var r = {};

  _Object$keys(o).forEach(function (value) {
    r[$ts[key][value]] = o[value];
  });

  return r;
}

/////////////////////////////

/////////////////////////////

/////////////////////////////

/////////////////////////////

/////////////////////////////

/////////////////////////////

/////////////////////////////

},{"./../../../lib/common":1,"./../../../lib/dom":2,"./../../../lib/events":3,"./../../../lib/idb":4,"./../../../lib/prototypes":5,"./../../../lib/request":6,"./../../../lib/table":7,"./../src/icons":83,"./../src/structure":84,"babel-runtime/core-js/object/keys":9,"babel-runtime/regenerator":13}]},{},[85])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9jb21tb24uanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9kb20uanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9ldmVudHMuanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9pZGIuanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9wcm90b3R5cGVzLmpzIiwidzovU2NyaXB0cy91cy9saWIvcmVxdWVzdC5qcyIsInc6L1NjcmlwdHMvdXMvbGliL3RhYmxlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qva2V5cy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3IvcnVudGltZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2tleXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hLWZ1bmN0aW9uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYW4tb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY2xhc3NvZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvcmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jdHguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kZWZpbmVkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZGVzY3JpcHRvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kb20tY3JlYXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZW51bS1rZXlzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZXhwb3J0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZmFpbHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5mb3Itb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nZXQtbmFtZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nbG9iYWwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oYXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oaWRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaHRtbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmludm9rZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlvYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1hcnJheS1pdGVyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXMtYXJyYXkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1vYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNhbGwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXItZGVmaW5lLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZXRlY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLXN0ZXAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyYXRvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmtleW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQubGlicmFyeS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm1pY3JvdGFzay5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm9iamVjdC1zYXAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5wcm9wZXJ0eS1kZXNjLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUtYWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zYW1lLXZhbHVlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXNwZWNpZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNoYXJlZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNwZWNpZXMtY29uc3RydWN0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zdHJpY3QtbmV3LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudGFzay5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWludGVnZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50by1pb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tbGVuZ3RoLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudWlkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQud2tzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5rZXlzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3Oi9TY3JpcHRzL3VzL3NjcmlwdHMvU3RhdHMgRm9ydW0vc3JjL2ljb25zLmpzIiwidzovU2NyaXB0cy91cy9zY3JpcHRzL1N0YXRzIEZvcnVtL3NyYy9zdHJ1Y3R1cmUuanMiLCJ3Oi9TY3JpcHRzL3VzL3NjcmlwdHMvU3RhdHMgRm9ydW0vdG1wX3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsU0FBUyxNQUFNLEdBQUUsRUFFaEI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7QUFRakIsWUFBVSxFQUFFLG9CQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDO0FBQ2xDLFFBQUksT0FBTyxDQUFDOztBQUVaLFFBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFDO0FBQ3RCLGFBQU8sQ0FBQyxDQUFDO0tBQ1Y7O0FBRUQsV0FBTyxHQUFHLEFBQUMsR0FBRyxHQUFHLEdBQUcsR0FBSSxHQUFHLENBQUM7QUFDNUIsUUFBRyxHQUFHLEVBQUM7QUFDTCxhQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNqQyxNQUFJO0FBQ0gsYUFBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDMUM7O0FBRUQsV0FBTyxPQUFPLENBQUM7R0FDaEI7Ozs7Ozs7O0FBUUQsZUFBYSxF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QUFDOzs7Ozs7OztBQVFGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQztBQUN4RCxTQUFPLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDbEQsQ0FBQzs7O0FDblVGOztBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RvQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBOztBQ0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE9BO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDM0ZBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDYixXQUFPLEVBQUUsNDdJQUE0N0k7QUFDcjhJLFVBQU0sRUFBRSx3cUJBQXdxQjtBQUNockIsV0FBTyxFQUFFLG9xQkFBb3FCO0FBQzdxQixNQUFFLEVBQUUsNHFCQUE0cUI7QUFDaHJCLFVBQU0sRUFBRSw0V0FBNFc7QUFDcFgsU0FBSyxFQUFFLHdYQUF3WDtBQUMvWCxZQUFRLEVBQUUsb0dBQW9HO0FBQzlHLFVBQU0sRUFBRSxvR0FBb0c7QUFDNUcsWUFBUSxFQUFFLDRHQUE0RztBQUN0SCxVQUFNLEVBQUUsZ3hFQUFneEU7QUFDeHhFLGFBQVMsRUFBRSxpMkVBQWkyRTtDQUMvMkUsQ0FBQzs7Ozs7Ozs7Ozs7O0FDUEYsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFVO0FBQ3pCLE1BQUksRUFBRSxDQUFDOztBQUVQLElBQUUsR0FBRztBQUNILFVBQU0sRUFBRTtBQUNOLFFBQUUsRUFBRSxJQUFJO0FBQ1IsVUFBSSxFQUFFLEdBQUc7QUFDVCxZQUFNLEVBQUUsR0FBRztBQUNYLFVBQUksRUFBRSxHQUFHO0FBQ1QsWUFBTSxFQUFFLEdBQUc7S0FDWjtBQUNELFNBQUssRUFBRTtBQUNMLFFBQUUsRUFBRSxJQUFJO0FBQ1IsVUFBSSxFQUFFLEdBQUc7QUFDVCxTQUFHLEVBQUUsR0FBRztBQUNSLFdBQUssRUFBRSxHQUFHO0FBQ1YsV0FBSyxFQUFFLEdBQUc7QUFDVixVQUFJLEVBQUUsR0FBRztBQUNULFlBQU0sRUFBRSxHQUFHO0FBQ1gsU0FBRyxFQUFFLEdBQUc7S0FDVDtBQUNELFNBQUssRUFBQztBQUNKLFFBQUUsRUFBRSxJQUFJO0FBQ1IsVUFBSSxFQUFFLEdBQUc7QUFDVCxZQUFNLEVBQUUsR0FBRztBQUNYLFdBQUssRUFBRSxHQUFHO0FBQ1YsV0FBSyxFQUFFLEdBQUc7QUFDVixXQUFLLEVBQUUsR0FBRztLQUNYO0FBQ0QsVUFBTSxFQUFFO0FBQ04sUUFBRSxFQUFFLElBQUk7QUFDUixXQUFLLEVBQUUsR0FBRztBQUNWLFVBQUksRUFBRSxHQUFHO0FBQ1QsV0FBSyxFQUFFLEdBQUc7QUFDVixXQUFLLEVBQUUsR0FBRztBQUNWLFdBQUssRUFBRSxHQUFHO0FBQ1Ysa0JBQVksRUFBRSxHQUFHO0FBQ2pCLFdBQUssRUFBRSxHQUFHO0FBQ1Ysa0JBQVksRUFBRSxHQUFHO0FBQ2pCLFFBQUUsRUFBRSxHQUFHO0FBQ1AsV0FBSyxFQUFFLEdBQUc7QUFDVixVQUFJLEVBQUUsR0FBRztBQUNULFVBQUksRUFBRSxHQUFHO0FBQ1QsWUFBTSxFQUFFLEdBQUc7S0FDWjtBQUNELGFBQVMsRUFBRTtBQUNULFFBQUUsRUFBRSxJQUFJO0FBQ1IsVUFBSSxFQUFFLEdBQUc7QUFDVCxVQUFJLEVBQUUsR0FBRztLQUNWO0dBQ0YsQ0FBQzs7QUFFRixRQUFNLEVBQUUsQ0FBQzs7QUFFVCxTQUFPLEVBQUUsQ0FBQzs7QUFFVixXQUFTLE1BQU0sR0FBRTtBQUNmLGlCQUFZLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFTLENBQUMsRUFBQztBQUNqQyxtQkFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFHLEVBQUM7QUFDdEMsVUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztPQUN6QixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSjtDQUNGLENBQUM7Ozs7Ozs7OztBQ3BFRixPQUFPLENBQUMsMkJBQTJCLENBQUMsRUFBRSxDQUFDO0FBQ3ZDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3RDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3ZDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2pELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQzdDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUdsRCxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUFDO0FBQzlDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUM7QUFDNUMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBR3ZDLElBQUksV0FBVyxHQUFHLG1CQUFtQixDQUFDO0FBQ3RDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQzs7QUFFbkYsSUFBSSxJQUFJLEVBQUUsTUFBTSxDQUFDOztBQUVqQixJQUFNLFlBQVksR0FBRztBQUNuQixNQUFJLEVBQUUsRUFBRTtBQUNSLFlBQVUsRUFBRSxvQkFBb0I7QUFDaEMsYUFBVyxFQUFFLGNBQWM7QUFDM0IsWUFBVSxFQUFFLGFBQWE7QUFDekIsYUFBVyxFQUFFLGtDQUFrQztBQUMvQyxnQkFBYyxFQUFFLGdDQUFnQztDQUNqRCxDQUFDOztBQUVGLFFBQVEsR0FBRztBQUNULFFBQU0sRUFBRSxFQUFFO0FBQ1YsU0FBTyxFQUFFLEVBQUU7Q0FDWixDQUFDOztBQUVGLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUN6QyxhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7O0FBRTNDLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDN0IsS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFbEQsR0FBRyxHQUFHO0FBQ0osUUFBTSxFQUFFLEVBQUU7QUFDVixTQUFPLEVBQUUsRUFBRTtBQUNYLFFBQU0sRUFBRSxFQUFFO0FBQ1YsUUFBTSxFQUFFLEVBQUU7Q0FDWCxDQUFDOztBQUVGLEdBQUcsR0FBRztBQUNKLE1BQUksRUFBRTtBQUNKLFNBQUssRUFBRTtBQUNMLFVBQUksRUFBRSxDQUFDO0FBQ1AsVUFBSSxFQUFFLE1BQU07S0FDYjtBQUNELFVBQU0sRUFBRTtBQUNOLFVBQUksRUFBRSxDQUFDO0FBQ1AsVUFBSSxFQUFFLElBQUk7S0FDWDtHQUNGO0FBQ0QsTUFBSSxFQUFDO0FBQ0gsU0FBSyxFQUFDLEVBQUU7QUFDUixVQUFNLEVBQUMsRUFBRTtHQUNWO0NBQ0YsQ0FBQzs7QUFFRixHQUFHLEdBQUc7QUFDSixLQUFHLEVBQUUsQ0FBQztBQUNOLE9BQUssRUFBRSxFQUFFO0FBQ1QsS0FBRyxFQUFFLENBQUM7QUFDTixPQUFLLEVBQUUsRUFBRTtBQUNULE9BQUssRUFBRSxFQUFFO0FBQ1QsT0FBSyxFQUFFLENBQUM7QUFDUixPQUFLLEVBQUUsQ0FBQztBQUNSLEdBQUMsRUFBRSxJQUFJO0FBQ1AsS0FBRyxFQUFFLElBQUk7QUFDVCxVQUFRLEVBQUUsRUFBRTtBQUNaLFNBQU8sRUFBRSxFQUFFO0FBQ1gsY0FBWSxFQUFFLENBQUM7QUFDZixRQUFNLEVBQUM7QUFDTCxTQUFLLEVBQUM7QUFDSixRQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEIsV0FBSyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFdBQUssRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QixVQUFJLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyQyxXQUFLLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUIsa0JBQVksRUFBRSxDQUFDLHlCQUF5QixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pELFdBQUssRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLFlBQU0sRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFlBQU0sRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25DLFlBQU0sRUFBRSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFlBQU0sRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoQyxZQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUIsV0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFVBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixZQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUIsWUFBTSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzlCO0FBQ0QsVUFBTSxFQUFDO0FBQ0wsUUFBRSxFQUFFLEVBQUU7QUFDTixVQUFJLEVBQUUsRUFBRTtBQUNSLFdBQUssRUFBRSxFQUFFO0FBQ1QsY0FBUSxFQUFFLEVBQUU7S0FDYjtHQUNGO0FBQ0Qsa0JBQWdCLEVBQUUsS0FBSztBQUN2QixhQUFXLEVBQUUsQ0FBQztBQUNkLFlBQVUsRUFBRSxDQUFDO0FBQ2IsYUFBVyxFQUFFLENBQUM7Q0FDZixDQUFDOzs7O0FBTUYsUUFBUSxFQUFFLENBQUM7QUFDWCxtQkFBbUIsRUFBRSxDQUFDOzs7O0FBSXRCLFNBQVMsUUFBUSxHQUFFO0FBQ2pCLE1BQUksR0FBRyxFQUFFLElBQUksQ0FBQzs7QUFFZCxNQUFJLDZqR0F1SkosQ0FBQztBQUNELE1BQUksK0RBR3dCLElBQUksQ0FBQyxTQUFTLG9JQUs5QixZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQSx1QkFDdkIsYUFBYSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUEsOERBR3BCLFlBQVksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBLHlCQUN2QixhQUFhLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQSx5REFHdEIsWUFBWSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUEseUJBQ3ZCLGFBQWEsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBLHlEQUd0QixZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQSx5QkFDdkIsYUFBYSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUEsYUFDaEMsQ0FBQztBQUNMLEtBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ25DLEtBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLEtBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVuQyxVQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNoQzs7QUFFRCxTQUFTLG1CQUFtQixHQUFFO0FBQzVCLE1BQUksR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDOztBQUVoQyxLQUFHLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckMsS0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFckIsVUFBUSxHQUFHLENBQUMsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0RSxNQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFL0MsUUFBTSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLG9GQUVsQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2YsVUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFcEMsS0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZCxLQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFakIsTUFBRyxHQUFHLEdBQUcsR0FBRyxFQUFDO0FBQ1gsT0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDekIsT0FBRyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztHQUNwRCxNQUFJO0FBQ0gsU0FBSyxHQUFHLEtBQUssQ0FBQztHQUNmOztBQUVELFdBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQVU7QUFDckMsZUFBVyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQTtHQUNuQyxDQUFDLENBQUM7Q0FDSjs7O0FBR0QsU0FBZSxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUs7TUFDaEMsR0FBRzs7Ozs7QUFFUCxXQUFHLEdBQUcsQ0FDSixFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBQyxFQUMxRCxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUM1QixDQUFDOzthQUVDLEtBQUs7Ozs7Ozt5Q0FDTyxFQUFFLENBQUMsSUFBSSxDQUFDOzs7QUFBckIsWUFBSTs7QUFDSixZQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzs7O3lDQUVmLElBQUksQ0FBQyxTQUFTLEVBQUU7OztBQUE3QixZQUFJOzs7O0FBR0osZUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQixlQUFPLEVBQUUsQ0FBQzs7Ozs7OztDQUNYOztBQUdELFNBQVMsZUFBZSxDQUFDLEVBQUUsRUFBQztBQUMxQixTQUFPO0FBQ0wsTUFBRSxFQUFFLEVBQUU7QUFDTixRQUFJLEVBQUUsRUFBRTtBQUNSLFVBQU0sRUFBRSxFQUFFO0FBQ1YsUUFBSSxFQUFFLENBQUM7QUFDUCxVQUFNLEVBQUUsRUFBRTtHQUNYLENBQUE7Q0FDRjs7QUFFRCxTQUFTLGVBQWUsQ0FBQyxFQUFFLEVBQUM7QUFDMUIsU0FBTztBQUNMLE1BQUUsRUFBRSxFQUFFO0FBQ04sU0FBSyxFQUFFLENBQUM7QUFDUixRQUFJLEVBQUUsQ0FBQztBQUNQLFNBQUssRUFBRSxFQUFFO0FBQ1QsU0FBSyxFQUFFLEVBQUU7QUFDVCxTQUFLLEVBQUUsQ0FBQztBQUNSLGdCQUFZLEVBQUUsQ0FBQztBQUNmLFNBQUssRUFBRSxDQUFDO0FBQ1IsZ0JBQVksRUFBRSxDQUFDO0FBQ2YsTUFBRSxFQUFFLENBQUM7QUFDTCxTQUFLLEVBQUUsQ0FBQztBQUNSLFFBQUksRUFBRSxDQUFDO0FBQ1AsUUFBSSxFQUFFLENBQUM7QUFDUCxVQUFNLEVBQUUsQ0FBQztHQUNWLENBQUE7Q0FDRjs7QUFFRCxTQUFTLGNBQWMsQ0FBQyxFQUFFLEVBQUM7QUFDekIsU0FBTztBQUNMLE1BQUUsRUFBRSxFQUFFO0FBQ04sUUFBSSxFQUFFLEVBQUU7QUFDUixPQUFHLEVBQUUsQ0FBQztBQUNOLFNBQUssRUFBRSxDQUFDO0FBQ1IsU0FBSyxFQUFFLENBQUM7QUFDUixRQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ1osVUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNkLE9BQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7R0FDWixDQUFBO0NBQ0Y7O0FBRUQsU0FBUyxjQUFjLENBQUMsRUFBRSxFQUFDO0FBQ3pCLFNBQU87QUFDTCxNQUFFLEVBQUUsRUFBRTtBQUNOLFFBQUksRUFBRSxFQUFFO0FBQ1IsVUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNmLFNBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDYixTQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVCxDQUFBO0NBQ0Y7O0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxFQUFFLEVBQUM7QUFDN0IsU0FBTztBQUNMLE1BQUUsRUFBRSxFQUFFO0FBQ04sUUFBSSxFQUFFLEVBQUU7QUFDUixRQUFJLEVBQUUsRUFBRTtHQUNULENBQUE7Q0FDRjs7O0FBR0QsU0FBZSxPQUFPO01BQ2hCLEtBQUs7Ozs7WUFFTCxJQUFJLENBQUMsS0FBSyxhQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUc7Ozs7O0FBQ2pDLGFBQUssR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLGFBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUN2QixhQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7QUFDcEIsYUFBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRS9CLFlBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFCLFlBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUN6QixFQUFDLElBQUksY0FBWSxHQUFHLENBQUMsR0FBRyxBQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUN0QyxFQUFDLElBQUksZUFBYSxHQUFHLENBQUMsR0FBRyxBQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUN2QyxFQUFDLElBQUksaUJBQWUsR0FBRyxDQUFDLEdBQUcsQUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FDMUMsQ0FBQyxDQUFDO0FBQ0gsWUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoQixZQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkIsbUJBQVcsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7O0FBRXBDLDRCQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVqQyxVQUFFLEdBQUc7QUFDSCxlQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUM7QUFDdEYsZ0JBQU0sRUFBRSxXQUFXLENBQUMsQ0FBQyxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQztTQUN6RixDQUFDOzs7eUNBRWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUM7OztBQUFuRCxjQUFNOztBQUNOLGNBQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVqQyxpQkFBUyxFQUFFLENBQUM7Ozs7Ozs7Q0FFZjs7O0FBR0QsU0FBUyxTQUFTLEdBQUU7QUFDbEIsTUFBSSxLQUFLLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUM7O0FBRTdCLE9BQUssR0FBRyxDQUFDLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3hGLElBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFNUIsS0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLHlGQUF1RixHQUFHLENBQUMsS0FBSyxvcUNBYzVFLGtCQUFrQixFQUFFLDhEQUNkLGtCQUFrQixFQUFFLDBHQUV6QixtQkFBbUIsRUFBRSx3REFDcEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFbEQsSUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDOUIsT0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRS9CLGdCQUFjLEVBQUUsQ0FBQzs7O0FBR2pCLG1CQUFpQixFQUFFLENBQUM7O0FBRXBCLFdBQVMsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxTQUFTLEVBQUUsc0JBQXNCLENBQUMsQ0FBQzs7OztBQUszRSxHQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FDeEIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQzVCLE9BQU8sRUFBRSxDQUNULE9BQU8sQ0FDTixVQUFTLElBQUksRUFBQztBQUNaLGFBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFlBQVU7QUFBQyxtQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQUMsQ0FBQyxDQUFDO0dBQzdELENBQ0YsQ0FBQzs7OztBQUlKLFVBQVEsR0FBRyxDQUFDLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqRCxXQUFTLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxZQUFVO0FBQUMsa0JBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQUFDLENBQUMsQ0FBQztDQUN0RTs7O0FBR0QsU0FBUyxjQUFjLENBQUMsWUFBWSxFQUFDO0FBQ25DLE1BQUksSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQzs7QUFFcEMsVUFBUSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFcEMsTUFBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxPQUFPLEVBQUM7QUFDbkMsWUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ2hDLFdBQU87R0FDUjtBQUNELE1BQUcsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBQztBQUMxQyxXQUFPO0dBQ1I7O0FBRUQsTUFBSSxHQUFHLFlBQVksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzVDLE1BQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ25DLEtBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQzs7QUFFbkIsVUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNsQyxVQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hDLFVBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFakMsTUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXJELGdCQUFjLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0NBQ3BDOzs7QUFHRCxTQUFTLGlCQUFpQixHQUFFO0FBQzFCLE1BQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUNsRCxNQUFJLFVBQVUsR0FBRyxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUM3RSxNQUFJLFdBQVcsQ0FBQzs7QUFFaEIsYUFBVyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzFDLGFBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDdEMsYUFBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDOztBQUV0QyxXQUFTLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztDQUNqRDs7O0FBR0QsU0FBUyxrQkFBa0IsR0FBRTtBQUMzQiw2L0NBbUNRO0NBQ1Q7OztBQUdELFNBQVMsa0JBQWtCLEdBQUU7QUFDM0IsTUFBSSxJQUFJLEVBQUUsUUFBUSxDQUFDOztBQUVuQixVQUFRLEdBQUcsS0FBSyxHQUFHLEVBQUUsR0FBRyxVQUFVLENBQUM7QUFDbkMsTUFBSSwwYUFPcUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyx5SEFDQSxLQUFLLG95REErQ3RELFFBQVEsZ05BTVAsUUFBUSwyTEFNVCxRQUFRLG9KQUlZLFFBQVEsZ1ZBUUcsUUFBUSwrTEFJTixRQUFRLGlVQVd6RixDQUFDOztBQUVSLFNBQU8sSUFBSSxDQUFDO0NBQ2I7OztBQUdELFNBQVMsbUJBQW1CLEdBQUU7QUFDNUIsMGlFQThDUTtDQUNUOzs7QUFHRCxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFDO0FBQzFDLE1BQUksTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7O0FBRTlHLFFBQU0sR0FBSSxDQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsV0FBVyxFQUFDLFNBQVMsRUFBQyxRQUFRLEVBQUMsU0FBUyxDQUFDLENBQUM7QUFDckgsTUFBSSxHQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMzRCxNQUFJLEdBQU0sS0FBSyxDQUFDOztBQUVoQixNQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3JDLE1BQUksR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwQyxNQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXpCLEtBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEIsUUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixPQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLE1BQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXZCLE1BQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFL0IsTUFBSSxpTkFJbUUsTUFBTSxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLDJXQVcxRSxDQUFDOztBQUVyQixXQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsY0FBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUksS0FBSyxXQUFNLElBQUksQ0FBRyxDQUFDO0FBQ2hELGNBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxBQUFDLFlBQVksRUFBRSxDQUFDO0FBQy9ELE1BQUcsWUFBWSxJQUFJLENBQUMsQ0FBQyxFQUFFLFlBQVksR0FBRyxDQUFDLENBQUM7O0FBRXhDLE9BQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFDO0FBQzFCLFFBQUcsSUFBSSxFQUFFLE1BQU07QUFDZixRQUFJLFVBQVUsQ0FBQztBQUNmLFNBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFDO0FBQzdCLFVBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsWUFBWSxFQUFDO0FBQ2pDLFlBQUksc0JBQW9CLFlBQVksWUFBUyxDQUFDO0FBQzlDLFlBQUksR0FBRyxZQUFZLENBQUM7T0FDckI7QUFDRCxVQUFHLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxFQUFDO0FBQzVCLFlBQUcsU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ3hELFlBQUksR0FBRyxTQUFTLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQ3BELGFBQUssR0FBRyxTQUFTLElBQUksR0FBRyxHQUFHLG9DQUFvQyxHQUFHLEVBQUUsQ0FBQztBQUNyRSxZQUFJLHdCQUFzQixLQUFLLGVBQVUsSUFBSSxTQUFJLE1BQU0sU0FBSSxJQUFJLGlCQUFZLE1BQU0sU0FBSSxJQUFJLFNBQUksSUFBSSxnQkFBVyxTQUFTLFVBQU8sQ0FBQztBQUM3SCxpQkFBUyxFQUFFLENBQUM7T0FDYixNQUFJO0FBQ0gsWUFBSSx1QkFBb0IsQ0FBQyxHQUFDLElBQUksQ0FBQSxZQUFTLENBQUM7QUFDeEMsWUFBSSxHQUFHLElBQUksQ0FBQztBQUNaLGNBQU07T0FDUDtLQUNGO0FBQ0QsUUFBSSxXQUFXLENBQUM7R0FDakI7O0FBRUQsTUFBSSw2REFFNEIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxnREFFaEQsQ0FBQzs7OztBQUloQixHQUFDLENBQUMsY0FBYyxDQUFDLENBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUNWLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUN2QyxPQUFPLEVBQUUsQ0FDVCxPQUFPLENBQ04sVUFBUyxNQUFNLEVBQUM7QUFDZCxRQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksU0FBUyxFQUFDO0FBQzFDLFVBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxhQUFhLEVBQUM7QUFDL0IsaUJBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQVU7QUFBQyxpQkFBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUFDLENBQUMsQ0FBQztPQUNoRSxNQUFLO0FBQ0osaUJBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQVU7QUFBQyxtQkFBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FBQyxDQUFDLENBQUM7T0FDMUU7S0FDRixNQUFJO0FBQ0gsZUFBUyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsWUFBVTtBQUFDLHVCQUFlLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFBO09BQUMsQ0FBQyxDQUFDO0tBQ2pGO0dBQ0YsQ0FDRixDQUFDOzs7QUFHSixXQUFTLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztBQUNyQyxRQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksR0FBRyxFQUFDO0FBQzNCLFdBQUssRUFBRSxDQUFDO0FBQ1IsVUFBRyxLQUFLLElBQUksQ0FBQyxFQUFDO0FBQ1osWUFBSSxFQUFFLENBQUM7QUFDUCxhQUFLLEdBQUcsRUFBRSxDQUFDO09BQ1o7S0FDRixNQUFJO0FBQ0gsV0FBSyxFQUFFLENBQUM7QUFDUixVQUFHLEtBQUssSUFBSSxFQUFFLEVBQUM7QUFDYixZQUFJLEVBQUUsQ0FBQztBQUNQLGFBQUssR0FBRyxDQUFDLENBQUM7T0FDWDtLQUNGO0FBQ0QsU0FBSyxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUM7O0FBRXpDLGtCQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBSSxLQUFLLFlBQU8sSUFBSSxDQUFHLEdBQUcsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0dBQ3hFOzs7QUFHRCxXQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFDO0FBQzNCLFFBQUksS0FBSyxDQUFDOztBQUVWLFNBQUssR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFcEMsUUFBRyxLQUFLLElBQUksRUFBRSxFQUFDO0FBQ2IsV0FBSyxHQUFHLElBQUksQ0FBQztBQUNiLFdBQUssR0FBRyxJQUFJLENBQUM7S0FDZCxNQUFJO0FBQ0gsV0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDNUIsVUFBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQztLQUMvQjtBQUNELFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRW5CLGtCQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBSSxLQUFLLFlBQU8sS0FBSyxDQUFHLEdBQUcsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0dBQ3pFOzs7QUFHRCxXQUFTLGVBQWUsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFDO0FBQzVDLGdCQUFZLENBQUMsa0JBQWtCLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN4RSxLQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNsRCxLQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7R0FDakQ7Q0FDRjs7O0FBR0QsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFDOztBQUUxQixrQkFBZ0IsRUFBRSxDQUFDOztBQUVuQixVQUFRLElBQUksQ0FBQyxJQUFJO0FBQ2YsU0FBSyxlQUFlO0FBQUUsV0FBSyxFQUFFLENBQUMsQUFBQyxNQUFNO0FBQUEsQUFDckMsU0FBSyxnQkFBZ0I7QUFBRSxZQUFNLEVBQUUsQ0FBQyxBQUFDLE1BQU07QUFBQSxBQUN2QyxTQUFLLGlCQUFpQjtBQUFFLGFBQU8sRUFBRSxDQUFDLEFBQUMsTUFBTTtBQUFBLEFBQ3pDLFNBQUssZUFBZTtBQUFFLG9CQUFjLEVBQUUsQ0FBQyxBQUFDLE1BQU07QUFBQSxBQUM5QyxTQUFLLGlCQUFpQjtBQUFFLDRCQUFzQixFQUFFLENBQUMsQUFBQyxNQUFNO0FBQUEsR0FDekQ7OztBQUdELFdBQVMsS0FBSyxHQUFFO0FBQ2QsUUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVsQyxZQUFPLENBQUMsQ0FBQyxJQUFJO0FBQ1gsV0FBSyxPQUFPO0FBQ1YsdUJBQWUsQ0FBQyxPQUFPLG1DQUFpQyxNQUFNLENBQUMsRUFBRSxVQUFLLE1BQU0sQ0FBQyxJQUFJLFFBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzlGLGtCQUFVLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsY0FBTTs7QUFBQSxBQUVSLFdBQUssS0FBSztBQUNSLHVCQUFlLEVBQUUsQ0FBQztBQUNsQixjQUFNO0FBQUEsS0FDVDtHQUNGOzs7QUFHRCxXQUFTLE1BQU0sR0FBRTtBQUNmLFFBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztRQUFFLENBQUMsQ0FBQzs7QUFFdEMsWUFBTyxDQUFDLENBQUMsSUFBSTtBQUNYLFdBQUssT0FBTztBQUNWLHVCQUFlLENBQUMsT0FBTyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0RCwwQkFBa0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUIsY0FBTTs7QUFBQSxBQUVSLFdBQUssUUFBUTtBQUNYLFNBQUMsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDN0IsdUJBQWUsQ0FBQyxPQUFPLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RELDJCQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QixtQkFBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyxjQUFNOztBQUFBLEFBRVIsV0FBSyxLQUFLO0FBQ1IsdUJBQWUsQ0FBQyxPQUFPLG1CQUFtQixDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLE9BQUksQ0FBQyxDQUFDO0FBQ2hFLDBCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLGNBQU07QUFBQSxLQUNUO0dBQ0Y7OztBQUdELFdBQVMsT0FBTyxHQUFFO0FBQ2hCLFFBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFVCxLQUFDLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRWhDLFlBQU8sQ0FBQyxDQUFDLElBQUk7QUFDWCxXQUFLLE9BQU87QUFDVix1QkFBZSxDQUFDLE9BQU8sMEJBQTBCLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0QsMkJBQW1CLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdCLGNBQU07O0FBQUEsQUFFUixXQUFLLFFBQVE7QUFDWCxTQUFDLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDOUIsdUJBQWUsQ0FBQyxPQUFPLDBCQUEwQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdELDJCQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QixvQkFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxjQUFNOztBQUFBLEFBRVIsV0FBSyxLQUFLO0FBQ1IsdUJBQWUsQ0FBQyxPQUFPLDBCQUEwQixDQUFDLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RFLDJCQUFtQixFQUFFLENBQUM7QUFDdEIsY0FBTTtBQUFBLEtBQ1Q7R0FDRjs7O0FBR0QsV0FBUyxRQUFRLENBQUMsSUFBSSxFQUFDO0FBQ3JCLFFBQUksSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7O0FBRXZCLFNBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ25DLFFBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxnQ0FBOEIsSUFBSSxnQkFBYSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztBQUNqRixTQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksK0JBQTZCLElBQUksUUFBSyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztBQUN6RSxTQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV0QixXQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUM7R0FDbkM7OztBQUdELFdBQVMsT0FBTyxDQUFDLElBQUksRUFBQztBQUNwQixRQUFJLElBQUksR0FBRyxFQUFFO1FBQUUsS0FBSyxHQUFHLENBQUM7UUFBRSxFQUFFLENBQUM7O0FBRTdCLEtBQUMsbUNBQWlDLElBQUksZ0JBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQ25FLFVBQVMsSUFBSSxFQUFDO0FBQ1osUUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsVUFBRyxJQUFJLElBQUksZUFBZSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDbkYsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEIsYUFBSyxJQUFJLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztPQUN4QyxNQUFJO0FBQ0gsWUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNkLGFBQUssRUFBRSxDQUFDO09BQ1Q7S0FDRixDQUNGLENBQUM7O0FBRUYsUUFBRyxJQUFJLElBQUksZUFBZSxFQUFDO0FBQ3pCLFdBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsSUFBSSxHQUFHLEdBQUcsQ0FBQztLQUNoRCxNQUFJO0FBQ0gsV0FBSyxHQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7S0FDdkI7O0FBRUQsV0FBTyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBQyxDQUFDO0dBQ3BEO0NBQ0Y7OztBQUdELFNBQVMsV0FBVyxHQUFFO0FBQ3BCLE1BQUksRUFBRSxDQUFDOztBQUVQLE1BQUcsT0FBTyxDQUFDLHlEQUF5RCxDQUFDLEVBQUM7QUFDcEUsV0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixTQUFLLEVBQUUsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO0FBQ3RCLFVBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ25DLGVBQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ3hDO0tBQ0Y7QUFDRCxTQUFLLEVBQUUsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFDO0FBQ3BCLGFBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDNUI7QUFDRCxzQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixZQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7R0FDbkI7Q0FDRjs7O0FBR0QsU0FBUyxlQUFlLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFDO0FBQy9DLE1BQUksT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQzs7QUFFcEMsS0FBRywrREFBNkQsSUFBSSxDQUFDLE9BQU8sZUFBWSxDQUFDOztBQUV6RixHQUFDLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDN0IsR0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3pCLEdBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN6QixHQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDekIsR0FBQyxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzFCLElBQUUsR0FBRyxDQUFDLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7QUFFaEMsTUFBRyxHQUFHLElBQUksT0FBTyxFQUFDO0FBQ2hCLEtBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWixLQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2IsS0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNaLEtBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDaEIsS0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUU1QixPQUFHLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0dBQzdCO0FBQ0QsTUFBRyxHQUFHLElBQUksTUFBTSxFQUFDO0FBQ2YsV0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLE9BQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUU3QixXQUFPLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzdDLEtBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDckMsS0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUNqQjtBQUNELE1BQUcsR0FBRyxJQUFJLE9BQU8sRUFBQztBQUNoQixNQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ2Y7QUFDRCxNQUFHLEdBQUcsSUFBSSxNQUFNLEVBQUM7QUFDZixNQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ1osS0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQzlCLEtBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDakIsS0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU1QixPQUFHLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0dBQzlCO0NBQ0Y7OztBQUdELFNBQVMsbUJBQW1CLENBQUMsQ0FBQyxFQUFDO0FBQzdCLE1BQUksSUFBSSxFQUFFLElBQUksQ0FBQzs7QUFFZixNQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLE9BQU87O0FBRWpDLE1BQUksR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM3QixNQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzFDLE1BQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLE1BQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4RSxNQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hCLHFCQUFtQixDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0NBQzdDOztBQUVELFNBQVMsZ0JBQWdCLEdBQUU7QUFDekIsR0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDMUQsR0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDckQsR0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7O0FBRXJELEdBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0NBQ3REOzs7QUFHRCxTQUFTLHNCQUFzQixHQUFFO0FBQy9CLEdBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOztBQUVwRCxHQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV0RSxHQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztDQUM1RDs7O0FBR0QsU0FBUyxpQkFBaUIsR0FBRTtBQUMxQixHQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUNwRCxHQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztDQUN2RDs7O0FBR0QsU0FBUyxpQkFBaUIsR0FBRTtBQUMxQixNQUFJLE1BQU0sRUFBRSxDQUFDLENBQUM7O0FBRWQsR0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDcEQsUUFBTSxHQUFHLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3ZDLEdBQUMsR0FBRyxDQUFDLENBQUM7O0FBRU4sR0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7QUFDOUQsR0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO0FBQzdELEdBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTdDLFFBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7O0FBRy9CLFdBQVMsZUFBZSxHQUFFO0FBQ3hCLFFBQUksSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUM7O0FBRXBCLFFBQUksR0FBRyx3Q0FBd0MsQ0FBQztBQUNoRCxRQUFJLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFeEMsaUJBQVksSUFBSSxDQUFDLENBQUMsT0FBTyxDQUN2QixVQUFTLEVBQUUsRUFBQztBQUNWLFNBQUcsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakMsVUFBSSx3QkFBc0IsR0FBRyxZQUFPLEdBQUcsVUFBSyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxjQUFXLENBQUM7S0FDdEUsQ0FDRixDQUFDOztBQUVGLFdBQU8sSUFBSSxDQUFDO0dBQ2I7OztBQUdELFdBQVMsZ0JBQWdCLEdBQUU7QUFDekIsUUFBSSxJQUFJLENBQUM7O0FBRVQsUUFBSSxHQUFHLHVDQUF1QyxDQUFDOztBQUUvQyxLQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FDOUUsT0FBTyxFQUFFLENBQ1QsT0FBTyxDQUNOLFVBQVMsR0FBRyxFQUFDO0FBQ1gsT0FBQyxFQUFFLENBQUM7QUFDSixVQUFJLHdCQUFzQixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLFNBQUksR0FBRyxDQUFDLEtBQUssVUFBSyxDQUFDLFVBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxjQUFXLENBQUM7S0FDckgsQ0FDRixDQUFDOztBQUVKLFdBQU8sSUFBSSxDQUFDO0dBQ2I7Q0FDRjs7O0FBR0QsU0FBUyxZQUFZLEdBQUU7QUFDckIsTUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDekMsTUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRTFDLE1BQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksT0FBTyxJQUFJLE1BQU0sSUFBSSxZQUFZLEVBQUUsT0FBTzs7QUFFckUsR0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7O0FBRW5ELEdBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQzFELEdBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3JELEdBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3JELEdBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUNoRCxRQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Q0FDL0I7OztBQUdELFNBQVMsY0FBYyxHQUFFO0FBQ3ZCLE1BQUksR0FBRyxDQUFDOztBQUVSLE1BQUcsR0FBRyxDQUFDLEdBQUcsRUFBQztBQUNULE9BQUcsaURBQStDLEdBQUcsQ0FBQyxHQUFHLGtCQUFlLENBQUM7QUFDekUsbUJBQWUsQ0FBQyxPQUFPLEVBQUUsaURBQWlELEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVsRixRQUFHO0FBQ0QsU0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDeEIsVUFBVSxHQUFHLEVBQUM7QUFDWixlQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7QUFDckMsYUFBSyxFQUFFLENBQUM7QUFDUiwwQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQix3QkFBZ0IsRUFBRSxDQUFDO0FBQ25CLHVCQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDekIsRUFDRCxZQUFXO0FBQ1QsZ0JBQVEsQ0FBQyxxQ0FBcUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDdkQsQ0FDRixDQUFDO0tBQ0gsQ0FBQSxPQUFPLENBQUMsRUFBQztBQUNSLGNBQVEsQ0FBQyxzQ0FBc0MsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDeEQ7R0FDRjs7O0FBR0QsV0FBUyxLQUFLLEdBQUU7QUFDZCxRQUFJLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7O0FBRTNCLFFBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUUzRyxpQkFBWSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVMsRUFBRSxFQUFDO0FBQzNDLFFBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckMsVUFBRyxFQUFFLElBQUksSUFBSSxFQUFDO0FBQ1osVUFBRSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDbEIsVUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7T0FDWDtLQUNGLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsT0FBTyxDQUFDLFVBQVMsSUFBSSxFQUFDO0FBQ3pCLFFBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxVQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUN4QixRQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQ2xELFFBQUUsR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUV0QixVQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFDO0FBQ3pCLFdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3hDOztBQUVELFVBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBQztBQUN6QyxXQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztPQUN6RDs7QUFFRCxTQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUM5QyxTQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztLQUN6QyxDQUFDLENBQUM7R0FDSjtDQUNGOzs7QUFHRCxTQUFTLHNCQUFzQixHQUFFO0FBQy9CLE1BQUksR0FBRyxFQUFFLElBQUksQ0FBQzs7QUFFZCxLQUFHLHFEQUFtRCxHQUFHLENBQUMsR0FBRyxzQkFBbUIsQ0FBQzs7QUFFakYsTUFBRztBQUNELE9BQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQ3hCLFVBQVUsR0FBRyxFQUFDO0FBQ1osYUFBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO0FBQ3JDLFNBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxFQUFFLENBQUM7QUFDcEIsVUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7O0FBRTdCLHFCQUFlLENBQUMsT0FBTyxzQ0FBb0MsR0FBRyxDQUFDLEdBQUcsVUFBSyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQUssQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqSCx5QkFBbUIsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsQ0FBQztBQUN2Qyx1QkFBaUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDOUMsRUFDRCxZQUFXO0FBQ1QsY0FBUSxDQUFDLDZEQUE2RCxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMvRSxDQUNGLENBQUM7R0FDSCxDQUFBLE9BQU8sQ0FBQyxFQUFDO0FBQ1IsWUFBUSxDQUFDLDhEQUE4RCxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUNoRjs7O0FBR0QsV0FBUyxLQUFLLEdBQUU7QUFDZCxRQUFJLElBQUksQ0FBQzs7QUFFVCxRQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksdUNBQXFDLEdBQUcsQ0FBQyxHQUFHLFFBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzRyxRQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRS9DLFdBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3JCO0NBQ0Y7OztBQUdELFNBQVMsaUJBQWlCLENBQUMsS0FBSyxFQUFDO0FBQy9CLE1BQUksR0FBRyxDQUFDOztBQUVSLE1BQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxFQUFDO0FBQ2IsT0FBRyxxREFBbUQsR0FBRyxDQUFDLEdBQUcsaUJBQVksS0FBSyxBQUFFLENBQUM7O0FBRWpGLFFBQUc7QUFDRCxTQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUN4QixVQUFVLEdBQUcsRUFBQztBQUNaLHVCQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsZUFBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO0FBQ3JDLFNBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDUCxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FDM0IsT0FBTyxFQUFFLENBQ1QsT0FBTyxFQUFFLENBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2xCLGFBQUssRUFBRSxDQUFDOztBQUVSLFlBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUV2QyxzQkFBYyxFQUFFLENBQUM7QUFDakIsMEJBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IseUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO09BQy9DLEVBQ0QsWUFBVztBQUNULGdCQUFRLENBQUMsdUNBQXVDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ3pELENBQ0YsQ0FBQztLQUNILENBQUEsT0FBTyxDQUFDLEVBQUM7QUFDUixjQUFRLENBQUMsd0NBQXdDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzFEO0dBQ0YsTUFBSTtBQUNILG9CQUFnQixFQUFFLENBQUM7QUFDbkIsbUJBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN6Qjs7O0FBR0QsV0FBUyxLQUFLLENBQUMsSUFBSSxFQUFDO0FBQ2xCLFFBQUksSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDOztBQUV6QixRQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUN2QixRQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQzs7QUFFOUUsUUFBRyxJQUFJLEVBQUM7QUFDTixVQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFbkMsVUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDO0FBQzdDLGVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQixlQUFPO09BQ1I7QUFDRCxVQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEVBQUM7QUFDOUMsZUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hCLGVBQU87T0FDUjtBQUNELFVBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsRUFBQztBQUM1QyxlQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDakI7QUFDRCxVQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLHNCQUFzQixDQUFDLEVBQUM7QUFDaEQsaUJBQVMsRUFBRSxDQUFDO09BQ2I7S0FDRjs7O0FBR0QsYUFBUyxPQUFPLENBQUMsR0FBRyxFQUFDO0FBQ25CLFVBQUksS0FBSyxDQUFDOztBQUVWLFFBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDekMsVUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqQixVQUFJLFFBQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxBQUFFLENBQUM7QUFDckgsVUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDOztBQUUvQixVQUFHLEVBQUUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFDO0FBQ2hCLFVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDO0FBQ3BCLFVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ25DLE1BQUk7QUFDSCxZQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRSxVQUFFLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QixhQUFLLEdBQUcsSUFBSSxDQUFDO09BQ2Q7O0FBRUQsVUFBRyxFQUFFLElBQUksSUFBSSxFQUFDO0FBQ1osWUFBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRSxZQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLG1CQUFtQixFQUFFLENBQUM7O0FBRXBHLFdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkQsV0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztPQUM3QyxNQUFLLElBQUcsSUFBSSxJQUFJLElBQUksRUFBQztBQUNwQixZQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekQsV0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO09BQ2xDO0tBQ0Y7OztBQUdELGFBQVMsU0FBUyxHQUFFO0FBQ2xCLFVBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQztBQUNiLFVBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25FLFFBQUUsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV4QixVQUFHLEVBQUUsSUFBSSxJQUFJLEVBQUM7QUFDWixZQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BFLFlBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQzs7QUFFckcsV0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7T0FDNUMsTUFBSyxJQUFHLElBQUksSUFBSSxJQUFJLEVBQUM7QUFDcEIsWUFBRyxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUN2QyxZQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDekQsV0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQy9CO0tBQ0Y7R0FDRjtDQUNGOzs7QUFHRCxTQUFlLGVBQWU7TUFDeEIsR0FBRyxFQUFFLElBQUksRUFrQkosS0FBSzs7OztBQUFMLGFBQUssWUFBTCxLQUFLLEdBQUU7QUFDZCxjQUFJLElBQUksQ0FBQzs7QUFFVCxjQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pHLGNBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFL0MsaUJBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JCOztBQXZCRCxXQUFHLEdBQUcsMENBQTBDLEdBQUcsTUFBTSxDQUFDLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQzs7O3lDQUV6RCxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUM7OztBQUFoRCxlQUFPLENBQUMsU0FBUzs7QUFFakIsY0FBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQztBQUN6QixZQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV2QyxZQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7O0FBRTVDLHVCQUFlLENBQUMsT0FBTyxtQ0FBaUMsTUFBTSxDQUFDLEVBQUUsVUFBSyxNQUFNLENBQUMsSUFBSSxRQUFLLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbkcsMkJBQW1CLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQzs7QUFFeEMsa0JBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Q0FZN0M7Ozs7QUFJRCxTQUFlLFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVE7TUFDekMsR0FBRyxFQUFFLEtBQUssRUFnRUMsS0FBSyxFQW1KWCxhQUFhOzs7O0FBQWIscUJBQWEsWUFBYixhQUFhLEdBQUU7QUFDdEIsY0FBSSxNQUFNLENBQUM7O0FBRVgsZ0JBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN0QixhQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sT0FBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQzs7QUFFdEMsdUJBQVksTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVMsR0FBRyxFQUFDO0FBQ3ZDLGdCQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQztBQUM5QyxpQkFBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLE9BQUksRUFBRSxDQUFDO2FBQ3JCO1dBQ0YsQ0FBQyxDQUFDO1NBQ0o7O0FBOUpjLGFBQUssWUFBTCxLQUFLLENBQUMsRUFBRTtjQUNqQixFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQTREOUIsQ0FBQyxFQXFCSSxLQUFLLEVBVUwsT0FBTyxFQUtQLFFBQVEsRUFjUixRQUFRLEVBWVIsT0FBTyxFQVlQLFNBQVM7Ozs7QUFBVCx5QkFBUyxZQUFULFNBQVMsR0FBRTtBQUNsQixzQkFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQzs7QUFFaEIsbUJBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDekMsc0JBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEIsb0JBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFckMseUJBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQzNCOztBQXBCUSx1QkFBTyxZQUFQLE9BQU8sR0FBRTtBQUNoQixzQkFBSSxJQUFJLENBQUM7O0FBRVQsc0JBQUksR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztBQUMvQixzQkFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsc0JBQUksR0FBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQUFBRSxDQUFDO0FBQzNFLHNCQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7O0FBRS9CLHlCQUFPLElBQUksQ0FBQztpQkFDYjs7QUFyQlEsd0JBQVEsWUFBUixRQUFRLEdBQUU7QUFDakIsc0JBQUksSUFBSSxDQUFDOztBQUVULHNCQUFJLEdBQUcsQ0FDTCxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQ2pDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FDbEMsQ0FBQzs7QUFFRix5QkFBTyxJQUFJLENBQUM7aUJBQ2I7O0FBdkJRLHdCQUFRLFlBQVIsUUFBUSxHQUFFO0FBQ2pCLHNCQUFJLEtBQUssQ0FBQzs7QUFFVix1QkFBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLHVCQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV0QixzQkFBRyxLQUFLLElBQUksSUFBSSxFQUFDO0FBQ2YsMkJBQU8sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7bUJBQ25CLE1BQUk7QUFDSCwyQkFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7bUJBQ2hDO2lCQUNGOztBQWhCUSx1QkFBTyxZQUFQLE9BQU8sR0FBRTtBQUNoQix5QkFBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNsQzs7QUFaUSxxQkFBSyxZQUFMLEtBQUssR0FBRTtBQUNkLHNCQUFJLEVBQUUsQ0FBQzs7QUFFUCxvQkFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0Isb0JBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFOUIseUJBQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUNuQjs7QUF0RkQsa0JBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO0FBQ2QsbUJBQUcsR0FBRyxLQUFLLEVBQUUsQ0FBQzs7Ozs7aURBSUEsSUFBSSxDQUFDLE1BQU0sYUFBVyxNQUFNLENBQUMsRUFBRSxFQUFJLElBQUksRUFBRSxHQUFHLENBQUM7OztBQUEzRCxxQkFBSzs7QUFFTCx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFdEIsb0JBQUcsS0FBSyxJQUFJLElBQUksRUFBQztBQUNmLHdCQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDbkIsc0JBQUksQ0FBQyxHQUFHLFdBQVcsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDOztBQUU1Qyx1QkFBSyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1Qix1QkFBSyxDQUFDLElBQUksR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUN2Qix1QkFBSyxDQUFDLE1BQU0sR0FBRyxTQUFTLEVBQUUsQ0FBQztBQUMzQix1QkFBSyxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztBQUN6Qix1QkFBSyxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztBQUN6Qix1QkFBSyxDQUFDLEtBQUssR0FBRyxPQUFPLEVBQUUsQ0FBQztpQkFDekIsTUFBSTtBQUNILHVCQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMvQix1QkFBSyxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztBQUN6Qix1QkFBSyxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztpQkFDMUI7O0FBRUQsb0JBQUksQ0FBQyxHQUFHLGFBQVcsTUFBTSxDQUFDLEVBQUUsRUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7O2lEQUN6QyxJQUFJLENBQUMsTUFBTSxZQUFZLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7QUFBNUQsc0JBQU07O3NCQUVILE1BQU0sSUFBSSxJQUFJLENBQUE7Ozs7O0FBQ2Ysc0JBQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLHNCQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsc0JBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFOUIsc0JBQU0sR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLHNCQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7Ozs7O0FBRTVCLHNCQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNsQyxvQkFBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs7aURBRXZELElBQUksQ0FBQyxNQUFNLGNBQVksTUFBTSxDQUFDLEVBQUUsRUFBSSxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQzs7O0FBQW5FLHNCQUFNOztBQUNOLHNCQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFbEMsb0JBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFDO0FBQ25DLHdCQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUIseUJBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEIseUJBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3JCLE1BQUk7QUFDSCx5QkFBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDdEI7Ozs7QUFHSCxvQkFBSSxDQUFDLEdBQUcsWUFBWSxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7O0FBRTlDLHNCQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNsQyx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFcEIsb0JBQUksQ0FBQyxHQUFHLGNBQVksTUFBTSxDQUFDLEVBQUUsRUFBSSxNQUFNLENBQUMsQ0FBQzs7O2lEQUUzQixJQUFJLENBQUMsTUFBTSxjQUFZLE1BQU0sQ0FBQyxFQUFFLEVBQUksSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUM7OztBQUE5RCxpQkFBQzs7QUFDTCx1QkFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQix1QkFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztBQUlmLHVCQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBakkxQixXQUFHLGdEQUE4QyxHQUFHLENBQUMsR0FBRyxpQkFBWSxLQUFLLEFBQUUsQ0FBQztBQUM1RSxhQUFLLEdBQUcsQ0FBQyxDQUFDOztjQUVQLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQTs7Ozs7O3lDQUVjLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQzs7O0FBQWhELGVBQU8sQ0FBQyxTQUFTOztBQUNqQix1QkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV4QixTQUFDLENBQUMsT0FBTyxDQUFDLENBQ1AsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQ25ELEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FDWCxJQUFJLENBQUMsMkNBQTJDLENBQUMsQ0FDakQsT0FBTyxFQUFFLENBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVsQixhQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDM0MsWUFBRyxNQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlDcEUsdUJBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7OztDQW9LM0I7OztBQUdELFNBQVMsa0JBQWtCLENBQUMsR0FBRyxFQUFDO0FBQzlCLE1BQUksTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDOztBQUU3QixRQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDdEIsTUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNWLE9BQUssR0FBRyxDQUFDLENBQUM7O0FBRVYsT0FBSSxHQUFHLElBQUksTUFBTSxFQUFDO0FBQ2hCLFFBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQzlDLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZixXQUFLLElBQUksbUJBQW1CLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ2hELFVBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUUsTUFBTTtLQUM5QjtHQUNGO0FBQ0QsT0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQy9DLHFCQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNCLGFBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztDQUNuQzs7O0FBR0QsU0FBUyxtQkFBbUIsQ0FBQyxFQUFFLEVBQUM7QUFDOUIsTUFBSSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7O0FBRS9CLE9BQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFekIsT0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzVCLE9BQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUU1QyxPQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDNUIsT0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRTVDLE9BQUssR0FBRyxBQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFJLENBQUMsQ0FBQzs7QUFFbEMsU0FBTyxFQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUcsS0FBSyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDO0NBQ3JEOzs7QUFHRCxTQUFTLFdBQVcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQztBQUNwQyxNQUFJLElBQUksRUFBRSxLQUFLLENBQUM7O0FBRWhCLEtBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzlCLE9BQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTlCLE1BQUcsS0FBSyxHQUFHLEdBQUcsRUFBQztBQUNiLFFBQUksR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsY0FBVSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDN0MsTUFBSTtBQUNILHNCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLGdCQUFZLEVBQUUsQ0FBQztBQUNmLG1CQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDekI7OztBQUdELFdBQVMsVUFBVSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDO0FBQ25DLFFBQUksR0FBRyxDQUFDOztBQUVSLE9BQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2YsT0FBRyxHQUFHLDJDQUEyQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsT0FBTyxHQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUUsV0FBVyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7O0FBRXhHLFFBQUcsRUFBRSxHQUFHLEtBQUssRUFBQztBQUNaLFVBQUc7QUFDRCxXQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUN4QixVQUFVLEdBQUcsRUFBQztBQUNaLGlCQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7QUFDckMsZUFBSyxFQUFFLENBQUM7QUFDUix3QkFBYyxFQUFFLENBQUM7U0FDbEIsRUFDRCxZQUFXO0FBQ1Qsa0JBQVEsQ0FBQyw4QkFBOEIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0MsdUJBQWEsRUFBRSxDQUFDO1NBQ2pCLENBQ0YsQ0FBQztPQUNILENBQUEsT0FBTyxDQUFDLEVBQUM7QUFDUixnQkFBUSxDQUFDLCtCQUErQixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoRCxxQkFBYSxFQUFFLENBQUM7T0FDakI7S0FDRixNQUFJO0FBQ0gsZUFBUyxFQUFFLENBQUM7S0FDYjs7O0FBR0QsYUFBUyxLQUFLLEdBQUU7QUFDZCxVQUFJLEtBQUssRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQzs7QUFFZCxXQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFM0YsT0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FDL0QsVUFBUyxJQUFJLEVBQUM7QUFDWixZQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMvQixZQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNuQyxDQUNGLENBQUM7QUFDRixRQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUNoQixZQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQzs7QUFFbkIsV0FBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUM7QUFDN0IsV0FBRyxHQUFHLEtBQUssRUFBRSxDQUFDOztBQUVkLFlBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUM7QUFDMUIsYUFBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUM5QztBQUNELGNBQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUxQixZQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBQztBQUNoQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztTQUNoRDtBQUNELFVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFNUIsYUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ2pCLFdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWQsVUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ1gsVUFBRSxDQUFDLElBQUksR0FBRyxXQUFXLEVBQUUsQ0FBQzs7QUFFeEIsU0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDO0FBQ2YsV0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQ2pCLFVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pCLFVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFbkQsWUFBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBQztBQUM3QixZQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7T0FDRjs7QUFFRCxtQkFBYSxFQUFFLENBQUM7OztBQUdoQixlQUFTLEtBQUssR0FBRTtBQUNkLFlBQUksRUFBRSxDQUFDOztBQUVQLFVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzFELFVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixVQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVoQixlQUFPLEVBQUUsQ0FBQztPQUNYOzs7QUFHRCxlQUFTLE9BQU8sR0FBRTtBQUNoQixlQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDN0Q7OztBQUdELGVBQVMsV0FBVyxHQUFFO0FBQ3BCLFlBQUksSUFBSSxDQUFDOztBQUVULFlBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUUvRSxZQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ25ELFlBQUksR0FBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEFBQUUsQ0FBQztBQUNyRCxZQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7O0FBRS9CLGVBQU8sSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7T0FDeEM7O0FBRUQsZUFBUyxRQUFRLEdBQUU7QUFDakIsWUFBSSxLQUFLLENBQUM7O0FBRVYsYUFBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDaEUsYUFBSyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFBLENBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQzs7QUFFaEYsZUFBTyxLQUFLLENBQUM7T0FDZDtLQUNGOzs7QUFHRCxhQUFTLFNBQVMsR0FBRTtBQUNsQixXQUFLLEVBQUUsQ0FBQztBQUNSLFNBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxPQUFJLEVBQUUsQ0FBQztBQUNwQixxQkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLHdCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLGlCQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDcEQ7OztBQUdELGFBQVMsYUFBYSxHQUFFO0FBQ3RCLFFBQUUsRUFBRSxDQUFDO0FBQ0wscUJBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLE9BQU8sMkJBQXlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLGNBQVMsRUFBRSxTQUFJLEtBQUssT0FBSSxDQUFDLENBQUM7QUFDeEgsZ0JBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvQzs7R0FFRjtDQUNGOzs7QUFHRCxTQUFTLG1CQUFtQixDQUFDLEtBQUssRUFBQztBQUNqQyxNQUFJLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDOztBQUV6QixRQUFNLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQztBQUNsRCxNQUFJLEdBQUcsRUFBRSxDQUFDOztBQUVWLFNBQU0sTUFBTSxFQUFFLEVBQUM7QUFDYixVQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDMUMsUUFBRyxLQUFLLElBQUksSUFBSSxFQUFDO0FBQ2YsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDaEMsTUFBSTtBQUNILFVBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFDO0FBQzFCLFlBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO09BQ2hDO0tBQ0Y7R0FDRjtBQUNELE9BQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDaEMscUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTNCLGNBQVksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztDQUNwQzs7O0FBR0QsU0FBUyxZQUFZLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7QUFDcEMsTUFBSSxHQUFHLEVBQUUsTUFBTSxDQUFDOztBQUVoQixNQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUM7QUFDWixVQUFNLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQixPQUFHLDRDQUEwQyxJQUFJLENBQUMsRUFBRSxDQUFDLEFBQUUsQ0FBQztBQUN4RCxRQUFHO0FBQ0QsU0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDeEIsVUFBVSxHQUFHLEVBQUM7QUFDWixlQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7QUFDckMsYUFBSyxFQUFFLENBQUM7QUFDUiwwQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixzQkFBYyxFQUFFLENBQUM7QUFDakIsa0JBQVUsRUFBRSxDQUFDO09BQ2QsRUFDRCxZQUFXO0FBQ1QsZ0JBQVEsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsa0JBQVUsRUFBRSxDQUFDO09BQ2QsQ0FDRixDQUFDO0tBQ0gsQ0FBQSxPQUFPLENBQUMsRUFBQztBQUNSLGNBQVEsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDM0M7R0FDRixNQUFJO0FBQ0gsb0JBQWdCLEVBQUUsQ0FBQztBQUNuQixtQkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3pCOzs7QUFHRCxXQUFTLFVBQVUsR0FBRTtBQUNuQixNQUFFLEVBQUUsQ0FBQztBQUNMLG1CQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzdDLGdCQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7R0FDcEQ7OztBQUdELFdBQVMsS0FBSyxHQUFFO0FBQ2QsUUFBSSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUM7O0FBRWpFLFVBQU0sR0FBRyxJQUFJLENBQUM7QUFDZCxRQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUVqRCxTQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO0FBQy9FLFVBQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLDBEQUEwRCxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDbkgsY0FBVSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsc0VBQXNFLENBQUMsQ0FBQztBQUNyRyxhQUFTLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQzFHLFlBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLDJEQUEyRCxDQUFDLENBQUM7O0FBRXhGLFFBQUcsUUFBUSxDQUFDLE1BQU0sRUFBQztBQUNqQixVQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLFlBQU0sR0FBRyxVQUFVLENBQUM7S0FDckI7QUFDRCxRQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUM7QUFDZixVQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ1QsWUFBTSxHQUFHLFdBQVcsQ0FBQztLQUN0QjtBQUNELFFBQUcsVUFBVSxDQUFDLE1BQU0sRUFBQztBQUNuQixVQUFJLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2xDLFlBQU0sR0FBRyxVQUFVLENBQUM7S0FDckI7QUFDRCxRQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUM7QUFDbEIsVUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNqQyxZQUFNLEdBQUcsV0FBVyxDQUFDO0tBQ3RCO0FBQ0QsUUFBRyxLQUFLLENBQUMsTUFBTSxFQUFDO0FBQ2QsVUFBSSxHQUFHLENBQUMsQ0FBQztBQUNULFlBQU0sR0FBRyxjQUFjLENBQUM7S0FDekI7O0FBRUQsVUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO0FBQzVCLFVBQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztHQUMzQjs7O0FBR0QsV0FBUyxPQUFPLENBQUMsTUFBTSxFQUFDO0FBQ3RCLFFBQUksSUFBSSxDQUFDOztBQUVULFFBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlCLFFBQUksR0FBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxBQUFFLENBQUM7QUFDbEUsUUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDOztBQUUvQixXQUFPLElBQUksQ0FBQztHQUNiO0NBQ0Y7OztBQUdELFNBQVMsZ0JBQWdCLEdBQUU7QUFDekIsTUFBSSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsQ0FBQztBQUN4QyxNQUFJLEtBQUs7TUFBRSxDQUFDO01BQUUsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFM0IsT0FBSyxHQUFHO0FBQ04sUUFBSSxFQUFFLEVBQUU7QUFDUixZQUFRLEVBQUUsRUFBRTtBQUNaLFVBQU0sRUFBRSxFQUFFO0FBQ1YsT0FBRyxFQUFFLENBQUM7QUFDTixXQUFPLEVBQUUsRUFBRTtBQUNYLFdBQU8sRUFBRSxFQUFFO0FBQ1gsT0FBRyxFQUFFLENBQUM7QUFDTixRQUFJLEVBQUUsRUFBRTtHQUNULENBQUM7O0FBRUYsSUFBRSxHQUFHO0FBQ0gsUUFBSSxFQUFFLGdCQUFnQjtBQUN0QixVQUFNLEVBQUUsOEJBQThCO0FBQ3RDLFVBQU0sRUFBRSwyQkFBMkI7R0FDcEMsQ0FBQzs7QUFFRixPQUFLLEdBQUcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDOUIsR0FBQyxHQUFHO0FBQ0YsZ0JBQVksRUFBRSx3QkFBVTtBQUFDLG1CQUFZLEVBQUUsQ0FBQTtLQUFDO0FBQ3hDLGVBQVcsRUFBRSx1QkFBVTtBQUFDLGtCQUFXLEVBQUUsQ0FBQTtLQUFDO0FBQ3RDLGFBQVMsRUFBRSxxQkFBVTtBQUFDLGdCQUFTLEVBQUUsQ0FBQTtLQUFDO0FBQ2xDLFFBQUksRUFBRSxnQkFBVTtBQUFDLFdBQUksRUFBRSxDQUFBO0tBQUM7R0FDekIsQ0FBQzs7QUFHRixRQUFNLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkMsT0FBSyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEcsT0FBSyxDQUFDLE9BQU8sR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUYsT0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO0FBQzNGLEtBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDekUsT0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEFBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7O0FBRXJELE1BQUcsS0FBSyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUM7QUFDdEIsUUFBRyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBQztBQUNoQixXQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM3QixhQUFPO0tBQ1I7QUFDRCxRQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDekQsUUFBRyxLQUFLLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0dBQ3pEOztBQUVELE1BQUcsS0FBSyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUM7QUFDdEIsUUFBRyxDQUFDLE9BQU8sYUFBVyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyx5QkFBc0IsRUFBRSxPQUFPO0dBQ3BFLE1BQUk7QUFDSCxRQUFHLENBQUMsT0FBTyxtQkFBaUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMscUJBQWdCLEdBQUcseUJBQXNCLEVBQUUsT0FBTztHQUM3Rjs7QUFFRCxNQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7OztBQUdSLFdBQVMsS0FBSSxHQUFFO0FBQ2IsS0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDckIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUNyQixPQUFPLEVBQUUsQ0FDVCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXBCLFNBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7QUFFMUIsb0JBQWdCLEVBQUUsQ0FBQztBQUNuQixtQkFBZSxDQUFDLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDM0UsdUJBQW1CLENBQUMsQUFBQyxLQUFLLEdBQUcsS0FBSyxHQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQzNDLGFBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzVCOzs7O0FBSUQsV0FBUyxPQUFPLENBQUMsTUFBTSxFQUFDO0FBQ3RCLFFBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQzs7QUFFYixNQUFFLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsUUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRVgsUUFBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFDO0FBQ3ZCLFdBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2QsVUFBRSxFQUFFLEVBQUU7QUFDTixZQUFJLEVBQUUsSUFBSTtBQUNWLGNBQU0sRUFBRSxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7T0FDakMsQ0FBQyxDQUFDO0tBQ0o7R0FDRjs7O0FBR0QsV0FBUyxVQUFTLEdBQUU7QUFDbEIsUUFBRztBQUNELFNBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDN0QsVUFBVSxHQUFHLEVBQUM7QUFDWixlQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7QUFDckMsYUFBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3pGLGFBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQzs7QUFFbkYsWUFBSSxFQUFFLENBQUM7T0FDUixFQUNELFlBQVc7QUFDVCxnQkFBUSxDQUFDLGtCQUFrQixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUNwQyxDQUNGLENBQUM7S0FDSCxDQUFBLE9BQU0sQ0FBQyxFQUFDO0FBQ1AsY0FBUSxDQUFDLGtCQUFrQixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNwQztHQUNGOzs7QUFHRCxXQUFTLFlBQVcsR0FBRztBQUNyQixRQUFHO0FBQ0QsU0FBRyxDQUFDLDBEQUEwRCxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzNGLFVBQVUsR0FBRyxFQUFDO0FBQ1osZUFBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO0FBQ3JDLGFBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVwQixTQUFDLENBQUMsT0FBTyxDQUFDLENBQ1AsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDZCxPQUFPLEVBQUUsQ0FDVCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWxCLFlBQUksRUFBRSxDQUFDO09BQ1IsRUFDRCxZQUFXO0FBQ1QsZ0JBQVEsK0NBQStDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUM5RCxDQUNGLENBQUM7S0FDSCxDQUFBLE9BQU8sQ0FBQyxFQUFDO0FBQ1IsY0FBUSwrQ0FBK0MsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzlEOzs7QUFHRCxhQUFTLEtBQUssQ0FBQyxNQUFNLEVBQUM7QUFDcEIsVUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDOztBQUViLFFBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLFVBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQzFCLFVBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDN0MsVUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFZixXQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUMzQjtHQUNGOzs7QUFHRCxXQUFTLGFBQVksR0FBRTtBQUNyQixRQUFHO0FBQ0QsU0FBRyxDQUFDLDREQUE0RCxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzdGLFVBQVUsR0FBRyxFQUFDO0FBQ1osZUFBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO0FBQ3JDLGFBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVwQixTQUFDLENBQUMsT0FBTyxDQUFDLENBQ1AsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQzNDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FDUixJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FDM0IsT0FBTyxFQUFFLENBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVsQixZQUFJLEVBQUUsQ0FBQztPQUNSLEVBQ0QsWUFBVztBQUNULGdCQUFRLCtDQUErQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDOUQsQ0FDRixDQUFDO0tBQ0gsQ0FBQSxPQUFPLENBQUMsRUFBQztBQUNSLGNBQVEsK0NBQStDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM5RDs7QUFFRCxhQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUM7QUFDbEIsYUFBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNyRDtHQUNGOzs7QUFHRCxXQUFTLElBQUksQ0FBQyxJQUFJLEVBQUM7QUFDakIsUUFBRyxJQUFJLElBQUksSUFBSSxFQUFDO0FBQ2QsT0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7QUFDbkIsYUFBTztLQUNSOztBQUVELEtBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztHQUN6QztDQUNGOzs7QUFHRCxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBQztBQUNyQyxNQUFHLEtBQUssR0FBRyxLQUFLLEVBQUM7QUFDZixRQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFDO0FBQ3hCLGdCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzFCO0FBQ0QsUUFBRyxLQUFLLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBQztBQUN4QixVQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDaEg7O0FBRUQsWUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7O0FBRTdDLFNBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNaLFNBQUssRUFBRSxDQUFDOztBQUVSLG1CQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsYUFBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7R0FDeEUsTUFBSTtBQUNILG1CQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDekI7Q0FDRjs7O0FBR0QsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBQztBQUM3QixNQUFJLElBQUksQ0FBQzs7QUFFVCxNQUFJLDJCQUF5QixLQUFLLENBQUMsR0FBRyxnQkFBVyxLQUFLLENBQUMsTUFBTSxnQkFBVyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0saUJBQVksS0FBSyxDQUFDLE9BQU8sYUFBUSxLQUFLLENBQUMsT0FBTyxBQUFFLENBQUM7O0FBRWpKLE1BQUc7QUFDRCxPQUFHLENBQUMsd0NBQXdDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlELFlBQVc7QUFDVCxvQkFBYyxFQUFFLENBQUM7S0FDbEIsRUFDRCxZQUFXO0FBQ1QsY0FBUSxzQkFBb0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzdELENBQ0YsQ0FBQztHQUNILENBQUEsT0FBTyxDQUFDLEVBQUM7QUFDUixZQUFRLHNCQUFvQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDN0Q7Q0FDRjs7O0FBR0QsU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBQztBQUMvQixNQUFJLElBQUksRUFBRSxNQUFNLENBQUM7O0FBRWpCLE1BQUksdUJBQXFCLEtBQUssQ0FBQyxHQUFHLGdCQUFXLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxBQUFFLENBQUM7QUFDeEUsUUFBTSxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFFBQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFFLENBQUMsTUFBTSxDQUFDOztBQUUvRSxNQUFHO0FBQ0QsT0FBRyxDQUFDLDRDQUE0QyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUNsRSxZQUFXO0FBQ1Qsb0JBQWMsRUFBRSxDQUFDO0FBQ2pCLFlBQU0sR0FBRyxDQUFDLENBQUM7QUFDWCx3QkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM1QixFQUNELFlBQVc7QUFDVCxjQUFRLDJCQUF5QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbEUsQ0FDRixDQUFDO0dBQ0gsQ0FBQSxPQUFPLENBQUMsRUFBQztBQUNSLFlBQVEsMkJBQXlCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUNsRTtDQUNGOzs7O0FBSUQsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQztBQUN4QixNQUFJLElBQUksV0FBUyxHQUFHLDBCQUFxQixFQUFFLEFBQUUsQ0FBQzs7QUFFOUMsTUFBRztBQUNELE9BQUcsQ0FBQyw0Q0FBNEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDbEUsWUFBVztBQUNULG9CQUFjLEVBQUUsQ0FBQztLQUNsQixFQUNELFlBQVc7QUFDVCxjQUFRLGdCQUFjLEVBQUUsRUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbkMsQ0FDRixDQUFDO0dBQ0gsQ0FBQSxPQUFPLENBQUMsRUFBQztBQUNSLFlBQVEsZUFBYSxFQUFFLEVBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQ2xDO0NBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQkQsU0FBUyxjQUFjLEdBQUU7QUFDdkIsTUFBSSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDOztBQUVsQyxJQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFakcsSUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FDcEIsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsaUNBQWlDLEVBQUUsc0JBQXNCLEVBQUUsNENBQTRDLENBQUMsRUFDckksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQ3ZDLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLDBCQUEwQixDQUFDLEVBQzNELENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUNwQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsRUFDaEQsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLEVBQzlDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxFQUN4QyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFDdkMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLEVBQzdDLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUM5QixDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsRUFDM0QsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQyxFQUNyRSxDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxFQUMxRCxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxFQUNuRCxDQUFDLG9CQUFvQixFQUFFLENBQUMsRUFBRSwyQ0FBMkMsRUFBRSxRQUFRLEVBQUUscUJBQXFCLENBQUMsRUFDdkcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsNENBQTRDLEVBQUUsUUFBUSxFQUFFLHlCQUF5QixDQUFDLEVBQzVHLENBQUMsY0FBYyxFQUFFLENBQUMsRUFBRSw4QkFBOEIsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLENBQUMsRUFDbEYsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLGlDQUFpQyxFQUFFLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxFQUMzRixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxFQUM1RCxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxvQ0FBb0MsQ0FBQyxDQUNqRixDQUFDLENBQUM7Ozs7QUFJSCxRQUFNLDBNQUdnRSxHQUFHLENBQUMsR0FBRyxhQUFRLE1BQU0sQ0FBQyxJQUFJLHVHQUd4RSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUdBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywwRkFDcEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHlGQUNwQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsc1JBSXBCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyw4RkFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLDZGQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsNkZBQ3JCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxtS0FFckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGdLQUdyQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUZBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3RkFDcEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLDBGQUNwQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUZBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywrRkFDcEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLCtGQUNwQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsd0ZBQ3JCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxzRkFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGdGQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsNkpBRTFCLENBQUM7O0FBRXBCLFFBQU0sbUxBR2lDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywrQkFBMEIsSUFBSSxDQUFDLE1BQU0sd0RBQ3pELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxvQ0FBK0IsSUFBSSxDQUFDLE1BQU0sd0RBQzlELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxpQ0FBNEIsSUFBSSxDQUFDLE1BQU0sd0RBQzNELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQ0FBOEIsSUFBSSxDQUFDLE1BQU0sd0RBQzdELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3Q0FBbUMsSUFBSSxDQUFDLE1BQU0sd0RBQ2xFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3Q0FBbUMsSUFBSSxDQUFDLE1BQU0sd0RBQ2xFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3Q0FBbUMsSUFBSSxDQUFDLE1BQU0sd0RBQ2xFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxrQ0FBNkIsSUFBSSxDQUFDLE1BQU0sd0RBQzVELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywrQ0FBMEMsSUFBSSxDQUFDLE1BQU0sd0RBQ3pFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywrQ0FBMEMsSUFBSSxDQUFDLE1BQU0sd0RBQ3pFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx5Q0FBb0MsSUFBSSxDQUFDLE1BQU0sd0RBQ3BFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx5Q0FBb0MsSUFBSSxDQUFDLE1BQU0sd0RBQ3BFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxtQ0FBOEIsSUFBSSxDQUFDLE1BQU0sd0RBQzlELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxrQ0FBNkIsSUFBSSxDQUFDLE1BQU0sd0RBQzdELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxpQ0FBNEIsSUFBSSxDQUFDLE1BQU0sd0RBQzVELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxtQ0FBOEIsSUFBSSxDQUFDLE1BQU0sd0RBQzlELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxrQ0FBNkIsSUFBSSxDQUFDLE1BQU0sd0RBQzdELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx5Q0FBb0MsSUFBSSxDQUFDLE1BQU0sd0RBQ3BFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQywrUEFLckIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsK0JBQTBCLE1BQU0sQ0FBQyxLQUFLLHlVQU85QixDQUFDOztBQUVoRSxHQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLEdBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWhDLElBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUxQixJQUFFLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdEMsV0FBUyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsWUFBVTtBQUFDLG1CQUFlLENBQUMsRUFBRSxFQUFFLGdCQUFnQixDQUFDLENBQUE7R0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCNUUsSUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDcEQsSUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FDckIsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUscUJBQXFCLENBQUMsRUFDcEQsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQ3ZDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxFQUM5QyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsRUFDakQsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsZUFBZSxDQUFDLEVBQzdDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUM1QixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxFQUMvRCxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUMxRCxDQUFDLENBQUM7O0FBRUgsUUFBTSw0VEFNaUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLDJHQUNyQixFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsMEZBQ3JCLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyw2RkFDckIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGdLQUVyQixFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsbUpBR3JCLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx5RkFDckIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLG9GQUV6QyxDQUFDOztBQUVwQixRQUFNLG1MQUdpQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsK0JBQTBCLElBQUksQ0FBQyxNQUFNLHdEQUMxRCxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUNBQTRCLElBQUksQ0FBQyxNQUFNLHdEQUM1RCxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsbUNBQThCLElBQUksQ0FBQyxNQUFNLHdEQUM5RCxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUNBQTRCLElBQUksQ0FBQyxNQUFNLHdEQUM1RCxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsc0NBQWlDLElBQUksQ0FBQyxNQUFNLHdEQUNqRSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMscUNBQWdDLElBQUksQ0FBQyxNQUFNLHdEQUNoRSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMscWFBUzZFLENBQUM7O0FBRTFJLEdBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsR0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFaEMsSUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLElBQUUsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNyQyxXQUFTLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxZQUFVO0FBQUMsbUJBQWUsQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTtHQUFDLENBQUMsQ0FBQzs7OztBQUk1RSxXQUFTLGVBQWUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFDO0FBQ2xDLFFBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQUVqQyxRQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksZ0JBQWdCLEVBQUM7QUFDeEMsWUFBTSxDQUFDLFdBQVcsR0FBRyxhQUFhLENBQUM7QUFDbkMsVUFBRyxFQUFFLElBQUksZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDcEQsTUFBSTtBQUNILFlBQU0sQ0FBQyxXQUFXLEdBQUcsZ0JBQWdCLENBQUM7QUFDdEMsVUFBRyxFQUFFLElBQUksZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN2Qzs7QUFFRCxLQUFDLENBQUMsRUFBRSxDQUFDLENBQ0YsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQzlCLE9BQU8sRUFBRSxDQUNULE9BQU8sQ0FDTixVQUFTLEdBQUcsRUFBQztBQUNYLFVBQUcsTUFBTSxDQUFDLFdBQVcsSUFBSSxnQkFBZ0IsRUFBQztBQUN4QyxjQUFNLENBQUMsR0FBRyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNyRCxNQUFJO0FBQ0gsY0FBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDakQ7S0FDRixDQUNGLENBQUM7OztBQUdKLGFBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUM7QUFDdkMsT0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xELFNBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFNBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxhQUFXLEdBQUcsT0FBSSxDQUFDO0FBQzFELFVBQUcsRUFBRSxJQUFJLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUMvRCxVQUFHLEVBQUUsSUFBSSxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDL0Q7R0FDRjtDQUNGOzs7QUFHRCxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBQztBQUMvQixNQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDOztBQUVyQixNQUFHLENBQUMsTUFBTSxFQUFFO0FBQ1YsU0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3JCLGtCQUFjLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLFNBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNqQjs7QUFFRCxLQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQixXQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakIsb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztDQUN0Qzs7QUFFRCxTQUFTLGlCQUFpQixDQUFDLE1BQU0sRUFBQztBQUNoQyxNQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDOztBQUV0QixNQUFHLENBQUMsTUFBTSxFQUFDO0FBQ1QsU0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3JCLGtCQUFjLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLFNBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNqQjs7QUFFRCxLQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNwQixlQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztDQUN0Qzs7QUFFRCxTQUFTLFlBQVksR0FBRTtBQUNyQixrQkFBZ0IsRUFBRSxDQUFDO0FBQ25CLG1CQUFpQixFQUFFLENBQUM7Q0FDckI7OztBQUdELFNBQVMsUUFBUSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUN0QyxTQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQ2pCOzs7QUFHRCxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFDO0FBQ25DLE1BQUksQ0FBQyxHQUFHLEVBQUU7TUFBRSxDQUFDLEdBQUcsRUFBRTtNQUFFLEtBQUssQ0FBQzs7QUFFMUIsTUFBRyxLQUFLLElBQUksU0FBUyxFQUFDO0FBQ3BCLGlCQUFZLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7R0FFN0MsTUFBSTtBQUNILG1CQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDs7QUFFRCxNQUFHLEtBQUssSUFBSSxLQUFLLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTlDLFNBQU8sRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQzs7QUFFcEIsV0FBUyxVQUFVLENBQUMsRUFBRSxFQUFDO0FBQ3JCLFFBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzs7QUFFN0IsUUFBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFDO0FBQzdCLGNBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDN0I7O0FBRUQsUUFBRyxLQUFLLElBQUksU0FBUyxFQUFDO0FBQ3BCLE9BQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BCLFFBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdkIsVUFBRyxFQUFFLElBQUksSUFBSSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0JaLGFBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDdEI7S0FDRixNQUFJO0FBQ0gsV0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN0QjtHQUNGOzs7QUFHRCxXQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUM7QUFDNUIsUUFBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNqRDtDQUNGOzs7QUFHRCxTQUFTLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFDO0FBQ3hCLE1BQUksSUFBSTtNQUFFLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRWpDLE9BQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBCLE1BQUksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLE1BQUcsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFDO0FBQzdCLE9BQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3hELE1BQUk7QUFDSCxPQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDM0IsT0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0dBQ3pCOztBQUVELE9BQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsT0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVoQixvQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFL0IsTUFBRyxJQUFJLElBQUksT0FBTyxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLE1BQUcsSUFBSSxJQUFJLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUU5Qzs7O0FBR0QsU0FBUyxrQkFBa0IsQ0FBQyxFQUFFLEVBQUM7QUFDN0IsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDVixPQUFPLEVBQUUsQ0FDVCxPQUFPLENBQ04sVUFBUyxJQUFJLEVBQUU7QUFDYixhQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxZQUFVO0FBQUMsZUFBUyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQUMsQ0FBQyxDQUFDO0dBQ3hELENBQ0YsQ0FBQzs7QUFFSixXQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUM7QUFDdEIsUUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sRUFBQztBQUN0QyxVQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztLQUMzQyxNQUFJO0FBQ0gsVUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDcEM7QUFDRCxRQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3JELFFBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxhQUFXLElBQUksQ0FBQyxNQUFNLG9CQUFlLElBQUksQ0FBQyxLQUFLLE9BQUksQ0FBQztBQUNwRyxRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7QUFFN0IsUUFBRyxFQUFFLElBQUksZ0JBQWdCLEVBQUM7QUFDeEIsY0FBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3RCxpQkFBVyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNELFFBQUcsRUFBRSxJQUFJLGdCQUFnQixFQUFDO0FBQ3hCLGNBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUQ7R0FDRjs7QUFFRCxXQUFTLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFDO0FBQzdCLFFBQUksS0FBSyxFQUFFLEVBQUUsQ0FBQzs7QUFFZCxNQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ1gsU0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMxQixNQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztHQUN4QztDQUNGOzs7QUFHRCxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUM7QUFDdkIsTUFBSSxJQUFJLENBQUM7O0FBRVQsTUFBSSxxSUFFcUUsQ0FBQzs7QUFHMUUsT0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUUsRUFBQztBQUNyQyxRQUFJLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsV0FBVyxDQUFDOztBQUV6RCxRQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUM7QUFDWCxXQUFLLEdBQUcsY0FBYyxDQUFDO0FBQ3ZCLFdBQUssR0FBRyxTQUFTLENBQUM7QUFDbEIsU0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbEIsTUFDSTtBQUNILFdBQUssR0FBRyxPQUFPLENBQUM7QUFDaEIsV0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLFNBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ25COztBQUVELGFBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUNuRCxhQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDbkQsZUFBVyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsMENBQTBDLEdBQUcsRUFBRSxDQUFDOztBQUUxRSxRQUFJLCtCQUN1QixLQUFLLDRDQUNGLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHVCQUFrQixTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQywrQ0FDbkQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsd0JBQW1CLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLCtDQUNsRCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxrSkFBNkksRUFBRSxDQUFDLEVBQUUsVUFBSyxFQUFFLENBQUMsSUFBSSxtREFDL0ssS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsa0NBQTZCLFNBQVMsbURBQ3ZELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHdCQUFtQixFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQywrQ0FDdEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsd0JBQW1CLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLCtDQUN0RCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3QkFBbUIsYUFBYSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLCtDQUNuRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3QkFBbUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsK0NBQ2hELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHdCQUFtQixFQUFFLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQywrQ0FDaEUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsd0JBQW1CLEVBQUUsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLCtDQUNoRSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx3QkFBbUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLCtDQUMzRCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx3QkFBbUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLCtDQUMzRCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx3QkFBbUIsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsK0NBQzVELEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLHdCQUFtQixhQUFhLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsK0NBQzlELEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLHdCQUFtQixXQUFXLFNBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLCtDQUM1RSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxrQ0FBNkIsU0FBUyxtREFDeEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsd0JBQW1CLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLCtDQUNqRCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx3QkFBbUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsK0NBQ3hELEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxnQ0FBMkIsS0FBSyxzQ0FBaUMsRUFBRSxDQUFDLEVBQUUsa0ZBQTRFLEdBQUcsMEVBRTFMLENBQUM7O0FBRWxCLE9BQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNsQixDQUFDLENBQUM7O0FBRUgsTUFBSSxrQ0FDYSxDQUFDOztBQUVsQixHQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsR0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7OztBQUkzQyxXQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDO0FBQ25CLFdBQU8sS0FBSyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxLQUFLLEdBQUcseUNBQXlDLEdBQUcsS0FBSyxDQUFDO0dBQ2pHOzs7QUFHRCxXQUFTLFlBQVksQ0FBQyxDQUFDLEVBQUM7QUFDdEIsUUFBRyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFDYixPQUFPLEdBQUcsQ0FBQztBQUNiLFFBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQ2YscUVBQWtFLElBQUksQ0FBQyxFQUFFLHNFQUFnRSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBVTtBQUM1SyxRQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUNaLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxxQkFBbUIsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBSyxDQUFDLENBQUMsSUFBSSxpQkFBWSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBRyxDQUFDOztBQUV0SCw2QkFBc0IsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBSyxDQUFDLENBQUMsSUFBSSxhQUFVO0dBQ2hFO0NBQ0Y7OztBQUdELFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBQztBQUMzQixNQUFJLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQzs7QUFFNUIsTUFBSSxxSUFFcUUsQ0FBQzs7QUFFMUUsT0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUUsRUFBQztBQUNyQyxRQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUM7QUFDVixXQUFLLEdBQUcsY0FBYyxDQUFDO0FBQ3ZCLFdBQUssR0FBRyxTQUFTLENBQUM7QUFDbEIsU0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbEIsTUFDRztBQUNGLFdBQUssR0FBRyxPQUFPLENBQUM7QUFDaEIsV0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLFNBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ25COztBQUVELFFBQUksK0JBQ3VCLEtBQUssd0NBQ04sS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUJBQWtCLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLDRDQUNuRCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx1SkFBa0osR0FBRyxDQUFDLEdBQUcsYUFBUSxFQUFFLENBQUMsRUFBRSxVQUFLLEVBQUUsQ0FBQyxJQUFJLCtDQUNuTSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyw4SUFBeUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLCtDQUN6TCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3QkFBbUIsYUFBYSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLDJDQUM1RCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3QkFBbUIsRUFBRSxDQUFDLFNBQVMsMkNBQ2hELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHdCQUFtQixFQUFFLENBQUMsUUFBUSwyQ0FDL0MsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLCtDQUEwQyxLQUFLLHFDQUFnQyxFQUFFLENBQUMsRUFBRSxxRUFBK0QsR0FBRyxnREFDakwsQ0FBQztHQUN4QixDQUFDLENBQUM7O0FBRUgsTUFBSSxrQ0FDYSxDQUFDOztBQUVsQixHQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDaEM7O0FBRUQsU0FBUyxpQkFBaUIsR0FBRTtBQUMxQixNQUFJLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDOztBQUVwQixNQUFJLEdBQUcsYUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdDLEdBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ2hCLFFBQU0sR0FBRyxFQUFFLENBQUM7O0FBRVosU0FBTSxDQUFDLEVBQUUsRUFBQztBQUNSLFFBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFDO0FBQ2pDLFlBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZEO0dBQ0Y7QUFDRCxRQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyw0REFBNEQsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFOUcsR0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQ3RDOzs7QUFHRCxTQUFTLGNBQWMsQ0FBQyxJQUFJLEVBQUM7QUFDM0IsTUFBRyxDQUFDLElBQUksRUFBQztBQUNQLE9BQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUN4QyxNQUFJO0FBQ0gsT0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7R0FDMUQ7Q0FDRjs7O0FBR0QsU0FBUyxjQUFjLEdBQUU7QUFDdkIsTUFBSSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzs7QUFFbEIsR0FBQyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDcEIsTUFBSSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzdCLE1BQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7O0FBRTNCLE1BQUcsQ0FBQyxHQUFHLEdBQUcsRUFBQztBQUNULFFBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7R0FDN0IsTUFBSyxJQUFHLENBQUMsR0FBRyxHQUFHLEVBQUM7QUFDZixRQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0dBQzdCO0NBQ0Y7OztBQUdELFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFDO0FBQzlCLE1BQUcsSUFBSSxFQUFDO0FBQ04sV0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwQyxXQUFPLENBQUMsS0FBSyxxQkFBbUIsSUFBSSxnQ0FBNkIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkYsV0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBQ3BCLE1BQUk7QUFDSCxXQUFPLENBQUMsS0FBSyxrQ0FBZ0MsSUFBSSxPQUFJLENBQUM7R0FDdkQ7Q0FDRjs7Ozs7QUFLRCxTQUFTLGtCQUFrQixDQUFDLElBQUksRUFBQztBQUMvQixNQUFJLE1BQU0sQ0FBQzs7QUFFWCxNQUFHLElBQUksSUFBSSxNQUFNLElBQUksS0FBSyxFQUFDO0FBQ3pCLFVBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLGdCQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztHQUM1QztBQUNELE1BQUcsSUFBSSxJQUFJLFVBQVUsRUFBQztBQUNwQixVQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixnQkFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztHQUNoRDtDQUNGOztBQUVELFNBQVMsb0JBQW9CLENBQUMsSUFBSSxFQUFDO0FBQ2pDLE1BQUksTUFBTSxDQUFDOztBQUVYLE1BQUcsSUFBSSxJQUFJLE1BQU0sRUFBQztBQUNoQixVQUFNLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFNUMsUUFBRyxNQUFNLEVBQUM7QUFDUixVQUFHLEtBQUssRUFBRTtBQUNSLFdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQzFCLE1BQUk7QUFDSCxZQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUMzQjtLQUNGLE1BQUk7QUFDSCx3QkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM1QjtHQUNGO0FBQ0QsTUFBRyxJQUFJLElBQUksVUFBVSxFQUFDO0FBQ3BCLFVBQU0sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRWhELFFBQUcsTUFBTSxFQUFDO0FBQ1IsU0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDMUIsTUFBSTtBQUNILHdCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ2hDO0dBQ0Y7Q0FDRjs7Ozs7QUFLRCxTQUFTLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUM1RCxNQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDOztBQUVuQyxnQkFBYyxFQUFFLENBQUM7O0FBRWpCLFNBQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxNQUFJLE1BQU0sSUFBSSxNQUFNLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3BHLFNBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXBCLE1BQUksS0FBSyxJQUFJLElBQUksRUFBRTtBQUNqQixXQUFPLENBQUMsa0JBQWtCLEdBQUcsWUFBVTtBQUNyQyxVQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sU0FBUyxJQUFJLFdBQVcsRUFBQztBQUN0RixzQkFBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDcEIsTUFBSyxJQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sU0FBUyxJQUFJLFdBQVcsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbkgsQ0FBQTtHQUNGOztBQUVELE1BQUksS0FBSyxJQUFJLEtBQUssRUFBRTtBQUNsQixRQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sU0FBUyxJQUFJLFdBQVcsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FDNUUsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxPQUFPLFNBQVMsSUFBSSxXQUFXLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3ZGO0NBQ0Y7O0FBRUQsU0FBUyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBQztBQUNyQixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRVgsZUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUM7QUFDcEMsS0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUMvQixDQUFDLENBQUM7O0FBRUgsU0FBTyxDQUFDLENBQUM7Q0FDViIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBDb21tb24oKXtcclxuXHJcbn1cclxuXHJcbkNvbW1vbi5wcm90b3R5cGUgPSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBub3dcclxuICAgKiBAcGFyYW0ge251bWJlcn0gbWF4XHJcbiAgICogQHBhcmFtIHtib29sZWFufSBpbnRcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldFBlcmNlbnQ6IGZ1bmN0aW9uIChub3csIG1heCwgaW50KXtcclxuICAgIHZhciBwZXJjZW50O1xyXG5cclxuICAgIGlmKG5vdyA9PSAwIHx8IG1heCA9PSAwKXtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgcGVyY2VudCA9IChub3cgLyBtYXgpICogMTAwO1xyXG4gICAgaWYoaW50KXtcclxuICAgICAgcGVyY2VudCA9IHBhcnNlSW50KHBlcmNlbnQsIDEwKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBwZXJjZW50ID0gcGFyc2VGbG9hdChwZXJjZW50LnRvRml4ZWQoMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwZXJjZW50O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGVcclxuICAgKiBAcGFyYW0ge251bGx8Ym9vbGVhbn0gZnVsbFxyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAgICovXHJcbiAgZ2V0Tm9ybWFsRGF0ZTogZnVuY3Rpb24gKGRhdGUsIGZ1bGwpe1xyXG4gICAgaWYoaXNOYU4oZGF0ZSkpIHJldHVybiB7ZDogZGF0ZSwgdDogJy0nfTtcclxuICAgIGlmKGRhdGUgPT0gMCkgcmV0dXJuIHtkOiAnLScsIHQ6ICctJ307XHJcblxyXG4gICAgZGF0ZSA9IGRhdGUgKiAxMDAwO1xyXG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgZGF0ZSA9IGRhdGUudG9Mb2NhbGVTdHJpbmcoKTtcclxuXHJcbiAgICBkYXRlID0gZGF0ZS5tYXRjaCgvKFxcZCspLihcXGQrKS4oXFxkKyksIChcXGQrKTooXFxkKyk6KC4rKS8pO1xyXG5cclxuICAgIGlmKGZ1bGwgIT0gbnVsbCkge1xyXG4gICAgICBkYXRlID0ge1xyXG4gICAgICAgIGQ6IGAke2RhdGVbMV19LiR7ZGF0ZVsyXX0uJHtkYXRlWzNdfWAsXHJcbiAgICAgICAgdDogYCR7ZGF0ZVs0XX06JHtkYXRlWzVdfWBcclxuICAgICAgfTtcclxuICAgIH1lbHNle1xyXG4gICAgICBkYXRlID0ge1xyXG4gICAgICAgIGQ6IGAke2RhdGVbMV19LiR7ZGF0ZVsyXX0uJHtkYXRlWzNdLmNoYXJBdCgyKX0ke2RhdGVbM10uY2hhckF0KDMpfWAsXHJcbiAgICAgICAgdDogYCR7ZGF0ZVs0XX06JHtkYXRlWzVdfWBcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0ZTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0XHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICBnZXROb3JtYWxUaW1lOiBmdW5jdGlvbiAodCl7XHJcbiAgICB2YXIgcmVzdWx0LCBoaCwgbW0sIHNzO1xyXG5cclxuICAgIGhoID0gMDtcclxuICAgIHQgPSBwYXJzZUludCh0IC8gMTAwMCwgMTApO1xyXG5cclxuICAgIGlmKHQgPiAzNjAwKXtcclxuICAgICAgaGggPSBwYXJzZUludCh0IC8gMzYwMCwgMTApO1xyXG4gICAgICB0ID0gdCAlIDM2MDA7XHJcbiAgICB9XHJcbiAgICBtbSA9IHBhcnNlSW50KHQgLyA2MCwgMTApO1xyXG4gICAgc3MgPSBwYXJzZUludCh0ICUgNjAsIDEwKTtcclxuXHJcbiAgICBpZihtbSA8IDEwKSBtbSA9IFwiMFwiICsgbW07XHJcbiAgICBpZihzcyA8IDEwKSBzcyA9IFwiMFwiICsgc3M7XHJcblxyXG4gICAgcmVzdWx0ID0gYCR7bW19OiR7c3N9YDtcclxuXHJcbiAgICBpZihoaCA+IDApe1xyXG4gICAgICBpZihoaCA8IDEwKSBoaCA9IFwiMFwiICsgaGg7XHJcbiAgICAgIHJlc3VsdCA9IGAke2hofToke3Jlc3VsdH1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGNvbnZlcnRJRDogZnVuY3Rpb24gKHZhbHVlKXtcclxuICAgIHZhciByZXN1bHQsIGksIGo7XHJcblxyXG4gICAgaWYodmFsdWUgPCAxMDAwKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgaiA9IDE7IGkgPSB2YWx1ZS5sZW5ndGg7XHJcbiAgICByZXN1bHQgPSBcIlwiO1xyXG5cclxuICAgIHdoaWxlKGktLSl7XHJcbiAgICAgIHJlc3VsdCA9IHZhbHVlLmNoYXJBdChpKSArIHJlc3VsdDtcclxuICAgICAgaWYoaiUzID09IDAgJiYgaiAhPSAwICYmIGkgIT0gMCl7XHJcbiAgICAgICAgcmVzdWx0ID0gJywnICsgcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICAgIGorK1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICBlbmNvZGVIZWFkZXI6IGZ1bmN0aW9uIChzdHIpe1xyXG4gICAgdmFyIGEsIHN0cmluZztcclxuXHJcbiAgICBpZighc3RyKSByZXR1cm4gc3RyO1xyXG5cclxuICAgIHN0cmluZyA9IFN0cmluZyhzdHIpLnJlcGxhY2UoLyUvZywgJyUyNScpLnJlcGxhY2UoL1xcKy9nLCAnJTJCJykucmVwbGFjZSgvXFxuL2csICclMEEnKTtcclxuICAgIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBhLmhyZWYgPSBcImh0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L2VuY29kZWRfc3RyPT9cIiArIHN0cmluZztcclxuICAgIHN0cmluZyA9IGEuaHJlZi5zcGxpdCgnZW5jb2RlZF9zdHI9PycpWzFdO1xyXG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoLyUyMC9nLCAnKycpLnJlcGxhY2UoLz0vZywgJyUzRCcpLnJlcGxhY2UoLyYvZywgJyUyNicpO1xyXG5cclxuICAgIHJldHVybiBzdHJpbmc7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IG1pblxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIHJhbmRvbU51bWJlcjogZnVuY3Rpb24gKG1pbiwgbWF4KXtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxyXG4gICAqIEBwYXJhbSB7KltdfSBhcnJheVxyXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAqL1xyXG4gIGV4aXN0OiBmdW5jdGlvbih2YWx1ZSwgYXJyYXkpe1xyXG4gICAgdmFyIGxlbmd0aDtcclxuXHJcbiAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XHJcblxyXG4gICAgd2hpbGUobGVuZ3RoLS0pe1xyXG4gICAgICBpZihhcnJheVtsZW5ndGhdID09IHZhbHVlKXtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCl7XHJcbiAgcmV0dXJuIG5ldyBDb21tb24oKTtcclxufTtcclxuIiwiZnVuY3Rpb24gQXBpKHBhcmFtKSB7XHJcbiAgdGhpcy5zZWxlY3RvciA9IHBhcmFtO1xyXG4gIHRoaXMubm9kZUxpc3QgPSBbXTtcclxuICB0aGlzLmxlbmd0aCA9IDA7XHJcbn1cclxuXHJcbkFwaS5wcm90b3R5cGUgPSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVsbHxudW1iZXJ9IHBhcmFtXHJcbiAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAqL1xyXG4gIG5vZGU6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgaWYgKHBhcmFtICE9IG51bGwpIHtcclxuICAgICAgaWYgKHBhcmFtID09IC0xKSB7XHJcbiAgICAgICAgcGFyYW0gPSB0aGlzLmxlbmd0aCAtIDE7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBhcmFtID0gMDtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLm5vZGVMaXN0W3BhcmFtXSA/IHRoaXMubm9kZUxpc3RbcGFyYW1dIDogbnVsbDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyB7W119XHJcbiAgICovXHJcbiAgbm9kZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLm5vZGVMaXN0O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtbXX1cclxuICAgKi9cclxuICBub2RlQXJyOiBmdW5jdGlvbigpe1xyXG4gICAgdmFyIG5vZGVzLCBsZW5ndGg7XHJcblxyXG4gICAgbGVuZ3RoID0gdGhpcy5ub2RlTGlzdC5sZW5ndGg7XHJcbiAgICBub2RlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xyXG5cclxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xyXG4gICAgICBub2Rlc1tsZW5ndGhdID0gdGhpcy5ub2RlTGlzdFtsZW5ndGhdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBub2RlcztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGdldFNlbGVjdG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RvcjtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge251bGx8Kn0gcGFyYW1cclxuICAgKiBAcmV0dXJucyB7QXBpfHN0cmluZ31cclxuICAgKi9cclxuICBodG1sOiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgIGlmIChwYXJhbSAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMubm9kZUxpc3RbMF0uaW5uZXJIVE1MID0gcGFyYW07XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMubm9kZUxpc3RbMF0gPyB0aGlzLm5vZGVMaXN0WzBdLmlubmVySFRNTCA6IFwiVGhpcyBub2RlIGlzIG51bGwuIFNlbGVjdG9yOiBcIiArIHRoaXMuc2VsZWN0b3I7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICB0ZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlTGlzdFswXSA/IHRoaXMubm9kZUxpc3RbMF0udGV4dENvbnRlbnQgOiBcIlRoaXMgbm9kZSBpcyBudWxsLiBTZWxlY3RvcjogXCIgKyB0aGlzLnNlbGVjdG9yO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcclxuICAgKiBAcmV0dXJucyB7QXBpfVxyXG4gICAqL1xyXG4gIGF0dHI6IGZ1bmN0aW9uKGF0dHJpYnV0ZSwgdmFsdWUpe1xyXG4gICAgdGhpcy5ub2RlTGlzdFswXS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cclxuICAgKiBAcmV0dXJucyB7QXBpfVxyXG4gICAqL1xyXG4gIGZpbmQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgdmFyIHRleHQsIHNlbGVjdG9yLCBub2RlLCBrZXkgPSBmYWxzZTtcclxuICAgIHZhciBpLCBsZW5ndGgsIG5vZGVzQXJyYXkgPSBbXTtcclxuXHJcbiAgICB0aGlzLnNlbGVjdG9yID0gcGFyYW07XHJcbiAgICBub2RlID0gdGhpcy5ub2RlTGlzdFswXSA/IHRoaXMubm9kZUxpc3RbMF0gOiBkb2N1bWVudDtcclxuXHJcbiAgICB0ZXh0ID0gcGFyYW0ubWF0Y2goLyguKyk6Y29udGFpbnNcXChcIn4oLispXCJcXCkvaSk7XHJcbiAgICBpZiAoIXRleHQpIHtcclxuICAgICAga2V5ID0gdHJ1ZTtcclxuICAgICAgdGV4dCA9IHBhcmFtLm1hdGNoKC8oLispOmNvbnRhaW5zXFwoXCIoLispXCJcXCkvKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGV4dCkge1xyXG4gICAgICBzZWxlY3RvciA9IHRleHRbMV07XHJcbiAgICAgIHRleHQgPSB0ZXh0WzJdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZWN0b3IgPSBwYXJhbTtcclxuICAgICAgdGV4dCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRleHQpIHtcclxuICAgICAgbm9kZXNBcnJheSA9IG5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgIHRoaXMubm9kZUxpc3QgPSBbXTtcclxuXHJcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG5vZGVzQXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgICBpZiAobm9kZXNBcnJheVtpXS50ZXh0Q29udGVudCA9PSB0ZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZUxpc3QucHVzaChub2Rlc0FycmF5W2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKG5vZGVzQXJyYXlbaV0udGV4dENvbnRlbnQuc2VhcmNoKHRleHQpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZUxpc3QucHVzaChub2Rlc0FycmF5W2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubm9kZUxpc3QgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5sZW5ndGggPSB0aGlzLm5vZGVMaXN0Lmxlbmd0aDtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cclxuICAgKiBAcmV0dXJucyB7QXBpfVxyXG4gICAqL1xyXG4gIHVwOiBmdW5jdGlvbiAocGFyYW0pe1xyXG4gICAgdmFyIG5vZGU7XHJcblxyXG4gICAgdGhpcy5zZWxlY3RvciArPSBcIiA+IHVwW1wiICsgcGFyYW0gKyBcIl1cIjtcclxuICAgIHBhcmFtID0gcGFyYW0udG9VcHBlckNhc2UoKTtcclxuICAgIG5vZGUgPSB0aGlzLm5vZGVMaXN0WzBdLnBhcmVudE5vZGU7XHJcbiAgICB0aGlzLm5vZGVMaXN0ID0gW107XHJcblxyXG4gICAgd2hpbGUgKG5vZGUubm9kZU5hbWUgIT0gcGFyYW0pIHtcclxuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcclxuICAgICAgaWYgKG5vZGUgPT0gZG9jdW1lbnQpIHtcclxuICAgICAgICB0aGlzLm5vZGVMaXN0WzBdID0gbnVsbDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLm5vZGVMaXN0WzBdID0gbm9kZTtcclxuICAgIHRoaXMubGVuZ3RoID0gMTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cclxuICAgKiBAcmV0dXJucyB7QXBpfVxyXG4gICAqL1xyXG4gIG5leHQ6IGZ1bmN0aW9uIChwYXJhbSl7XHJcbiAgICB2YXIgbm9kZSwgbGFzdE5vZGU7XHJcblxyXG4gICAgdGhpcy5zZWxlY3RvciArPSBcIiA+IG5leHRbXCIgKyBwYXJhbSArIFwiXVwiO1xyXG4gICAgcGFyYW0gPSBwYXJhbS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgbm9kZSA9IHRoaXMubm9kZUxpc3RbMF0ubmV4dFNpYmxpbmc7XHJcbiAgICBsYXN0Tm9kZSA9IG5vZGUucGFyZW50Tm9kZS5sYXN0Q2hpbGQ7XHJcbiAgICB0aGlzLm5vZGVMaXN0ID0gW107XHJcblxyXG4gICAgd2hpbGUgKG5vZGUubm9kZU5hbWUgIT0gcGFyYW0pIHtcclxuICAgICAgbm9kZSA9IG5vZGUubmV4dFNpYmxpbmc7XHJcbiAgICAgIGlmIChub2RlID09IGxhc3ROb2RlKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlTGlzdFswXSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5ub2RlTGlzdFswXSA9IG5vZGU7XHJcbiAgICB0aGlzLmxlbmd0aCA9IDE7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7Kn0gcGFyYW1cclxuICogQHJldHVybnMge0FwaX1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gJChwYXJhbSkge1xyXG4gIHZhciBhcGksIHN0cjtcclxuXHJcbiAgaWYgKHR5cGVvZiBwYXJhbSA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICBzdHIgPSBwYXJhbS5tYXRjaCgvPCguKyk+Lyk7XHJcbiAgICBpZiAoc3RyKSB7XHJcbiAgICAgIGFwaSA9IG5ldyBBcGkoJ2NyZWF0ZShcIicgKyBzdHJbMV0gKyAnXCIpJyk7XHJcbiAgICAgIGFwaS5ub2RlTGlzdFswXSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoc3RyWzFdKTtcclxuICAgICAgYXBpLmxlbmd0aCA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcGkgPSBuZXcgQXBpKHBhcmFtKS5maW5kKHBhcmFtKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgYXBpID0gbmV3IEFwaSgnc2V0KFwiJyArIHBhcmFtLm5vZGVOYW1lICsgJ1wiKScpO1xyXG4gICAgYXBpLm5vZGVMaXN0WzBdID0gcGFyYW07XHJcbiAgICBhcGkubGVuZ3RoID0gMTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhcGk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZEV2ZW50KGVsZW1lbnQsIGV2ZW50LCBjYWxsYmFjaykge1xyXG4gIGlmICghZWxlbWVudCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICBpZiAoZXZlbnQuc3Vic3RyKDAsIDIpID09ICdvbicpIHtcclxuICAgICAgZXZlbnQgPSBldmVudC5zdWJzdHIoMik7XHJcbiAgICB9XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XHJcbiAgfSBlbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuc3Vic3RyKDAsIDIpICE9ICdvbicpIHtcclxuICAgICAgZXZlbnQgPSAnb24nK2V2ZW50O1xyXG4gICAgfVxyXG4gICAgZWxlbWVudC5hdHRhY2hFdmVudChldmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcclxuICB9XHJcbn07IiwiZnVuY3Rpb24gREIobmFtZSl7XHJcbiAgdGhpcy5vID0gd2luZG93LmluZGV4ZWREQiB8fCB3aW5kb3cubW96SW5kZXhlZERCIHx8IHdpbmRvdy53ZWJraXRJbmRleGVkREIgfHwgd2luZG93Lm1zSW5kZXhlZERCO1xyXG4gIHRoaXMudCA9IHdpbmRvdy5JREJUcmFuc2FjdGlvbiB8fCB3aW5kb3cud2Via2l0SURCVHJhbnNhY3Rpb24gfHwgd2luZG93Lm1zSURCVHJhbnNhY3Rpb247XHJcbiAgdGhpcy5rciA9IHdpbmRvdy5JREJLZXlSYW5nZSA9IHdpbmRvdy5JREJLZXlSYW5nZSB8fCB3aW5kb3cud2Via2l0SURCS2V5UmFuZ2UgfHwgd2luZG93Lm1zSURCS2V5UmFuZ2U7XHJcbiAgdGhpcy5yID0gbnVsbDtcclxuICB0aGlzLmRiID0gbnVsbDtcclxuICB0aGlzLnR4ID0gbnVsbDtcclxuICB0aGlzLnN0b3JlID0gbnVsbDtcclxuICB0aGlzLmluZGV4ID0gbnVsbDtcclxuICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gIHRoaXMubW9kaWZ5aW5nVGFibGUgPSBudWxsO1xyXG4gIHRoaXMucmVtb3ZlVGFibGUgPSBudWxsO1xyXG4gIHRoaXMuaW5pQmFzZSA9IG51bGw7XHJcbiAgdGhpcy52ZXJzaW9uID0gMTtcclxufVxyXG5cclxuREIucHJvdG90eXBlID0ge1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqL1xyXG4gIGNvbm5lY3REQjogZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob25zdWNjZXNzKSA9PntcclxuICAgICAgdmFyIGlkYiA9IHRoaXM7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZyhcIlJ1biBjb25uZWN0LCB2ZXJzaW9uIFwiICsgaWRiLnZlcnNpb24pO1xyXG5cclxuICAgICAgaWRiLnIgPSBpZGIuby5vcGVuKHRoaXMubmFtZSwgaWRiLnZlcnNpb24pO1xyXG5cclxuICAgICAgaWRiLnIub25lcnJvciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciFcIik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZGIuci5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlkYi5kYiA9IGlkYi5yLnJlc3VsdDtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3MgY29ubmVjdCFcIik7XHJcbiAgICAgICAgb25zdWNjZXNzKGlkYik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLnIub251cGdyYWRlbmVlZGVkID0gZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgaWRiLmRiID0gZS5jdXJyZW50VGFyZ2V0LnJlc3VsdDtcclxuXHJcbiAgICAgICAgaWYoaWRiLnZlcnNpb24gPT0gMil7XHJcbiAgICAgICAgICBpZGIudXBncmFkZSh0cnVlKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRlOiBkZWZhdWx0c1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWRiLnVwZ3JhZGUoZmFsc2UpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXBncmFkZWQhXCIpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHsqW119IGxpc3RcclxuICAgKi9cclxuICBzZXRNb2RpZnlpbmdUYWJsZUxpc3Q6IGZ1bmN0aW9uKGxpc3Qpe1xyXG4gICAgdGhpcy5tb2RpZnlpbmdUYWJsZSA9IGxpc3Q7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHsqW119IGxpc3RcclxuICAgKi9cclxuICBzZXRJbmlUYWJsZUxpc3Q6IGZ1bmN0aW9uKGxpc3Qpe1xyXG4gICAgdGhpcy5pbmlCYXNlID0gbGlzdDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGxpc3RcclxuICAgKi9cclxuICBzZXRSZW1vdmVUYWJsZUxpc3Q6IGZ1bmN0aW9uKGxpc3Qpe1xyXG4gICAgdGhpcy5yZW1vdmVUYWJsZSA9IGxpc3Q7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBpbmlcclxuICAgKi9cclxuICB1cGdyYWRlOiBmdW5jdGlvbihpbmkpe1xyXG4gICAgdmFyIHRhYmxlLCB0b2RvLCBpZGIgPSB0aGlzO1xyXG5cclxuICAgIHRvZG8gPSBpbmkgPyBpZGIuaW5pQmFzZSA6IGlkYi5tb2RpZnlpbmdUYWJsZTtcclxuXHJcbiAgICBpZih0b2RvKXtcclxuICAgICAgdG9kby5mb3JFYWNoKGZ1bmN0aW9uKHQpe1xyXG4gICAgICAgIGlmKGlkYi5leGlzdCh0Lm5hbWUpKXtcclxuICAgICAgICAgIHRhYmxlID0gaWRiLnIudHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodC5uYW1lKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHRhYmxlID0gaWRiLmRiLmNyZWF0ZU9iamVjdFN0b3JlKHQubmFtZSwge2tleVBhdGg6IHQua2V5fSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3MgY3JlYXRlZDogXCIgKyB0Lm5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodC5pbmRleCl7XHJcbiAgICAgICAgICB0LmluZGV4LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG4gICAgICAgICAgICB0YWJsZS5jcmVhdGVJbmRleChpbmRleFswXSwgaW5kZXhbMV0sIHt1bmlxdWU6IGluZGV4WzJdfSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2VzcyBjcmVhdGVkIGluZGV4OiBcIiArIGluZGV4LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgdG9kbyA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBpZihpZGIucmVtb3ZlVGFibGUpe1xyXG4gICAgICBpZGIucmVtb3ZlVGFibGUuZm9yRWFjaChmdW5jdGlvbih0KXtcclxuICAgICAgICBpZGIuZGIuZGVsZXRlT2JqZWN0U3RvcmUodCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzIHJlbW92ZWQ6IFwiICsgdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZGIucmVtb3ZlVGFibGUgPSBudWxsO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBleGlzdDogZnVuY3Rpb24gKG5hbWUpe1xyXG4gICAgdmFyIGxlbmd0aCwgYXJyYXk7XHJcblxyXG4gICAgYXJyYXkgPSB0aGlzLmRiLm9iamVjdFN0b3JlTmFtZXM7XHJcbiAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XHJcblxyXG4gICAgd2hpbGUobGVuZ3RoLS0pe1xyXG4gICAgICBpZihhcnJheVtsZW5ndGhdID09IG5hbWUpe1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKi9cclxuICBuZXh0VmVyc2lvbjogZnVuY3Rpb24oKXtcclxuICAgIHRoaXMudmVyc2lvbisrO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICovXHJcbiAgZGVsZXRlREI6IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLm8uZGVsZXRlRGF0YWJhc2UodGhpcy5uYW1lKTtcclxuICAgIGNvbnNvbGUubG9nKFwiU3VjY2VzcyBkZWxldGVkOiBcIiArIHRoaXMubmFtZSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhYmxlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGluZGV4XHJcbiAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSB2YWx1ZVxyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAgICovXHJcbiAgZ2V0T25lOiBmdW5jdGlvbih0YWJsZSwgaW5kZXgsIHZhbHVlKXtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob25zdWNjZXNzKSA9PiB7XHJcbiAgICAgIHRoaXMudHggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFt0YWJsZV0sIFwicmVhZG9ubHlcIik7XHJcbiAgICAgIHRoaXMuc3RvcmUgPSB0aGlzLnR4Lm9iamVjdFN0b3JlKHRhYmxlKTtcclxuXHJcbiAgICAgIGlmKGluZGV4ID09IFwiaWRcIil7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5nZXQodmFsdWUpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgb25zdWNjZXNzKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuc3RvcmUuaW5kZXgoaW5kZXgpO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmluZGV4LmdldCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5kZXgub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgb25zdWNjZXNzKGV2ZW50LnRhcmdldC5yZXN1bHQpOyAvLyDQt9C00LXRgdGMINCy0L7Qt9Cy0YDQsNGJ0LDQtdGC0YHRjyDRgNC10LfRg9C70YzRgtCw0YJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhYmxlXHJcbiAgICogQHBhcmFtIHtudW1iZXJbXXxudWxsfSByYW5nZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IGluZGV4XHJcbiAgICovXHJcbiAgZ2V0RmV3OiBmdW5jdGlvbih0YWJsZSwgcmFuZ2UsIGluZGV4KXtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob25zdWNjZXNzKSA9PntcclxuICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcclxuICAgICAgdmFyIGtydiA9IHJhbmdlID8gdGhpcy5rci5ib3VuZChyYW5nZVswXSwgcmFuZ2VbMV0pIDogbnVsbDtcclxuXHJcbiAgICAgIHRoaXMudHggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFt0YWJsZV0sIFwicmVhZG9ubHlcIik7XHJcbiAgICAgIHRoaXMuc3RvcmUgPSB0aGlzLnR4Lm9iamVjdFN0b3JlKHRhYmxlKTtcclxuXHJcbiAgICAgIGlmKGluZGV4KXtcclxuICAgICAgICB0aGlzLnN0b3JlID0gdGhpcy5zdG9yZS5pbmRleChpbmRleCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RvcmUub3BlbkN1cnNvcihrcnYpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICB2YXIgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHJcbiAgICAgICAgaWYoY3Vyc29yKXtcclxuICAgICAgICAgIHJlc3VsdHMucHVzaChjdXJzb3IudmFsdWUpO1xyXG4gICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBhbGwgcmVzdWx0czogXCIpO1xyXG4gICAgICAgICAgb25zdWNjZXNzKHJlc3VsdHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0YWJsZVxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXHJcbiAgICovXHJcbiAgYWRkOiBmdW5jdGlvbih0YWJsZSwgZGF0YSl7XHJcbiAgICB0cnl7XHJcbiAgICAgIHRoaXMudHggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFt0YWJsZV0sIFwicmVhZHdyaXRlXCIpO1xyXG4gICAgICB0aGlzLnN0b3JlID0gdGhpcy50eC5vYmplY3RTdG9yZSh0YWJsZSk7XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLnB1dChkYXRhKTtcclxuICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzIGFkZGVkXCIpO1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgIH1jYXRjaChlKXtcclxuICAgICAgY29uc29sZS5sb2coXCJGYWlsZWQgYWRkZWRcIik7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gKlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKG9uc3VjY2VzcykgPT4ge1xyXG4gICAgICB2YXIgZGIsIGlkYjtcclxuXHJcbiAgICAgIGlkYiA9IG5ldyBEQihuYW1lKTtcclxuICAgICAgZGIgPSBpZGIuby5vcGVuKG5hbWUpO1xyXG5cclxuICAgICAgZGIub25zdWNjZXNzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZGIudmVyc2lvbiA9IGRiLnJlc3VsdC52ZXJzaW9uID09IDEgPyAyIDogZGIucmVzdWx0LnZlcnNpb247XHJcbiAgICAgICAgZGIucmVzdWx0LmNsb3NlKCk7XHJcblxyXG4gICAgICAgIG9uc3VjY2VzcyhpZGIpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIClcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG4gIC8qKlxyXG4gICAqINCS0YvQt9GL0LLQsNC10YIg0YTRg9C90LrRhtC40Y4g0YfQtdGA0LXQtyDRg9C60LDQt9Cw0L3QvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQuNC70LvQuNGB0LXQutGD0L3QtCDQsiDQutC+0L3RgtC10LrRgdGC0LUgY3R4INGBINCw0YDQs9GD0LzQtdC90YLQsNC80LggYXJncy5cclxuICAgKiBAcGFyYW0ge2ludH0gdGltZW91dFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcclxuICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzXHJcbiAgICogQHJldHVybiB7TnVtYmVyfSDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDRgtCw0LnQvNCw0YPRgtCwLlxyXG4gICAqL1xyXG4gIEZ1bmN0aW9uLnByb3RvdHlwZS5na0RlbGF5ID0gZnVuY3Rpb24odGltZW91dCwgY3R4LCBhcmdzKXtcclxuICAgIHZhciBmdW5jID0gdGhpcztcclxuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICBmdW5jLmFwcGx5KGN0eCwgYXJncyB8fCBbXSk7XHJcbiAgICB9LCB0aW1lb3V0KTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0geyp9IHZhbHVlXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgQXJyYXkucHJvdG90eXBlLmdrRXhpc3QgPSBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICB2YXIgbGVuZ3RoLCBhcnJheTtcclxuXHJcbiAgICBhcnJheSA9IHRoaXM7XHJcbiAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XHJcblxyXG4gICAgd2hpbGUobGVuZ3RoLS0pe1xyXG4gICAgICBpZihhcnJheVtsZW5ndGhdID09IHZhbHVlKXtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG1ldGhvZCwgcGFyYW0pIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKG9uc3VjY2Vzcywgb25mYWlsdXJlKSA9PiB7XHJcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgIHJlcXVlc3Qub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XHJcbiAgICBpZiAobWV0aG9kID09ICdQT1NUJykgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICByZXF1ZXN0LnNlbmQocGFyYW0pO1xyXG5cclxuICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09IDQgJiYgcmVxdWVzdC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgb25zdWNjZXNzKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT0gNCAmJiByZXF1ZXN0LnN0YXR1cyAhPSAyMDApIHtcclxuICAgICAgICBvbmZhaWx1cmUocmVxdWVzdCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vZG9tJyk7XHJcbnZhciBiaW5kRXZlbnQgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xyXG5cclxuZnVuY3Rpb24gVGFibGUobm9kZXNJRCwgc2V0dGluZ3NLZXksIHNldHRpbmdzKXtcclxuICB0aGlzLmhlYWRlciA9IG5vZGVzSURbMF07XHJcbiAgdGhpcy5ib2R5ID0gbm9kZXNJRFsxXTtcclxuICB0aGlzLmZvb3RlciA9IG5vZGVzSURbMl07XHJcbiAgdGhpcy5uYW1lID0gc2V0dGluZ3NLZXk7XHJcbiAgdGhpcy5zdHJ1Y3R1cmUgPSB7fTtcclxuICB0aGlzLmNvbnRlbnQgPSBbXTtcclxuICB0aGlzLnNpemUgPSBbXTtcclxuICAvL3RoaXMudGhlbWVzID0gJHNkLmZvcnVtc1skY2QuZmlkXS50aGVtZXM7XHJcbiAgLy90aGlzLnBsYXllcnMgPSAkc2QucGxheWVycztcclxuICB0aGlzLnNvcnQgPSB7XHJcbiAgICBjZWxsOiBudWxsLFxyXG4gICAgdHlwZTogbnVsbFxyXG4gIH07XHJcbiAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gIHRoaXMucm93cyA9IDA7XHJcbn1cclxuXHJcblRhYmxlLnByb3RvdHlwZSA9IHtcclxuICAvKipcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGdldE5hbWU6IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtvYmplY3RbXX1cclxuICAgKi9cclxuICBnZXRDb250ZW50OiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldExhc3RSb3dDb250ZW50OiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMucm93cyAtIDE7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRcclxuICAgKi9cclxuICBwdXNoQ29udGVudDogZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgICB0aGlzLmNvbnRlbnQucHVzaChlbGVtZW50KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKi9cclxuICBjbGVhckNvbnRlbnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmNvbnRlbnQgPSBbXTtcclxuICAgIHRoaXMucm93cyA9IDA7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGljb25zXHJcbiAgICovXHJcbiAgc2V0Q29udHJvbDogZnVuY3Rpb24oaWNvbnMpe1xyXG4gICAgdGhpcy5zZXRTb3J0cyhpY29ucyk7XHJcbiAgICB0aGlzLnNldEZpbHRlcnMoaWNvbnMpO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAgICovXHJcbiAgZ2V0U3RydWN0dXJlOiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuc3RydWN0dXJlO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IGFycmF5XHJcbiAgICovXHJcbiAgc2V0V2lkdGg6IGZ1bmN0aW9uKGFycmF5KXtcclxuICAgIHZhciB0YWJsZSA9IHRoaXM7XHJcblxyXG4gICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50LCBpZCl7XHJcbiAgICAgIHRhYmxlLnNpemVbaWRdID0gZWxlbWVudDtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbnxudWxsfSBjaGVja1xyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZ2V0V2lkdGg6IGZ1bmN0aW9uKGluZGV4LCBjaGVjayl7XHJcbiAgICB2YXIgd2lkdGg7XHJcblxyXG4gICAgaWYodGhpcy5zaXplW2luZGV4XSl7XHJcbiAgICAgIHdpZHRoID0gY2hlY2sgPyB0aGlzLnNpemVbaW5kZXhdIC0gMTcgOiB0aGlzLnNpemVbaW5kZXhdO1xyXG4gICAgICByZXR1cm4gd2lkdGggIT0gLTEgPyBgd2lkdGg9XCIke3dpZHRofVwiYCA6IFwiXCI7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGlkXHJcbiAgICogQHJldHVybnMge29iamVjdFtdfVxyXG4gICAqL1xyXG4gIHNldENvbnRlbnQ6IGZ1bmN0aW9uKGlkKXtcclxuICAgIHZhciB0YWJsZSwgbztcclxuXHJcbiAgICB0YWJsZSA9IHRoaXM7XHJcbiAgICBvID0ge307XHJcblxyXG4gICAgT2JqZWN0LmtleXModGFibGUuZ2V0U3RydWN0dXJlKCkpLmZvckVhY2goZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICBpZih0YWJsZS5zdHJ1Y3R1cmVbdmFsdWVdLnBhdGgubGVuZ3RoID09IDIpe1xyXG4gICAgICAgIG9bdmFsdWVdID0gZXZhbCh0YWJsZS5zdHJ1Y3R1cmVbdmFsdWVdLnBhdGhbMF0gKyBcIlsnXCIgKyBpZCArIFwiJ11cIiArIHRhYmxlLnN0cnVjdHVyZVt2YWx1ZV0ucGF0aFsxXSk7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIGlmKHRhYmxlLnN0cnVjdHVyZVt2YWx1ZV0ucGF0aFswXSA9PSBcIk51bWJlcihpZClcIil7XHJcbiAgICAgICAgICBvW3ZhbHVlXSA9IE51bWJlcihpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZighdGFibGUuZmlsdGVyaW5nKG8pKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICB0YWJsZS5wdXNoQ29udGVudChvKTtcclxuICAgIHJldHVybiB0YWJsZS5jb250ZW50W3RhYmxlLmdldExhc3RSb3dDb250ZW50KCldO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpY29uc1xyXG4gICAqL1xyXG4gIGNoYW5nZVNvcnRJbWFnZTogZnVuY3Rpb24oaWNvbnMpe1xyXG4gICAgdmFyIHZhbHVlLCB0eXBlLCBvbGRJbWcsIG5ld0ltZztcclxuXHJcbiAgICB2YWx1ZSA9IHRoaXMuc2V0dGluZ3Muc29ydFt0aGlzLm5hbWVdLmNlbGw7XHJcbiAgICB0eXBlID0gdGhpcy5zZXR0aW5ncy5zb3J0W3RoaXMubmFtZV0udHlwZTtcclxuXHJcbiAgICBpZih2YWx1ZSAhPSB0aGlzLnNvcnQuY2VsbCl7XHJcbiAgICAgIG9sZEltZyA9ICQodGhpcy5oZWFkZXIpLmZpbmQoYHRkW3NvcnQ9XCIke3RoaXMuc29ydC5jZWxsfVwiXWApLm5vZGUoKS5sYXN0Q2hpbGQ7XHJcbiAgICAgIG9sZEltZy5zcmMgPSBpY29ucy5zb3J0TnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBuZXdJbWcgPSAkKHRoaXMuaGVhZGVyKS5maW5kKGB0ZFtzb3J0PVwiJHt2YWx1ZX1cIl1gKS5ub2RlKCkubGFzdENoaWxkO1xyXG4gICAgbmV3SW1nLnNyYyA9IHR5cGUgPyBpY29ucy5zb3J0RG93biA6IGljb25zLnNvcnRVcDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGRcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2VsbFxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpY29uc1xyXG4gICAqL1xyXG4gIHNldFNvcnRJbWFnZTogZnVuY3Rpb24odGQsIGNlbGwsIGljb25zKXtcclxuICAgIHZhciBpbWcgPSAkKHRkKS5maW5kKCdpbWcnKS5ub2RlKCk7XHJcblxyXG4gICAgaWYodGhpcy5zZXR0aW5ncy5zb3J0W3RoaXMubmFtZV0uY2VsbCAhPSBjZWxsKXtcclxuICAgICAgaW1nLnNyYyA9IGljb25zLnNvcnROdWxsO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGltZy5zcmMgPSB0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS50eXBlID8gaWNvbnMuc29ydERvd24gOiBpY29ucy5zb3J0VXA7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKi9cclxuICBzZXRTb3J0OiBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5zb3J0LmNlbGwgPSB0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS5jZWxsO1xyXG4gICAgdGhpcy5zb3J0LnR5cGUgPSB0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS50eXBlO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICovXHJcbiAgc29ydGluZzogZnVuY3Rpb24oKXtcclxuICAgIHZhciB2YWx1ZSwgdHlwZSwgYXJyYXk7XHJcblxyXG4gICAgYXJyYXkgPSB0aGlzLmdldENvbnRlbnQoKTtcclxuICAgIHZhbHVlID0gdGhpcy5zZXR0aW5ncy5zb3J0W3RoaXMubmFtZV0uY2VsbDtcclxuICAgIHR5cGUgPSB0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS50eXBlO1xyXG5cclxuICAgIGFycmF5LnNvcnQoXHJcbiAgICAgIGZ1bmN0aW9uKGUxLCBlMil7XHJcbiAgICAgICAgdmFyIHAxLCBwMiwgcmVzO1xyXG5cclxuICAgICAgICBwMSA9IGUxW3ZhbHVlXTsgcDIgPSBlMlt2YWx1ZV07XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwMSA9PSBcIm9iamVjdFwiKXtcclxuICAgICAgICAgIGlmKHAxLm5hbWUpe1xyXG4gICAgICAgICAgICBwMSA9IHAxLm5hbWU7XHJcbiAgICAgICAgICAgIHAyID0gcDIubmFtZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKHAxLnRleHQpe1xyXG4gICAgICAgICAgICBwMSA9IHAxLnRleHQ7XHJcbiAgICAgICAgICAgIHAyID0gcDIudGV4dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlcyA9IGNvbXBhcmUocDEsIHAyKTtcclxuICAgICAgICBpZih0eXBlKSByZXMgPSByZXMgPT0gLTEgPyAxIDogLTE7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb21wYXJlKGUxLCBlMil7XHJcbiAgICAgIGlmIChlMSA+IGUyKSByZXR1cm4gMTtcclxuICAgICAgZWxzZSBpZiAoZTEgPCBlMikgcmV0dXJuIC0xO1xyXG4gICAgICBlbHNlIHJldHVybiAwO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpY29uc1xyXG4gICAqL1xyXG4gIHNldFNvcnRzOiBmdW5jdGlvbihpY29ucyl7XHJcbiAgICB2YXIgdGFibGUgPSB0aGlzO1xyXG5cclxuICAgICQodGFibGUuaGVhZGVyKS5maW5kKCd0ZFtzb3J0XScpLm5vZGVBcnIoKS5mb3JFYWNoKGZ1bmN0aW9uKHRkKXtcclxuICAgICAgdmFyIHZhbHVlO1xyXG5cclxuICAgICAgdmFsdWUgPSB0ZC5nZXRBdHRyaWJ1dGUoXCJzb3J0XCIpO1xyXG4gICAgICB0YWJsZS5zZXRTb3J0SW1hZ2UodGQsIHZhbHVlLCBpY29ucyk7XHJcbiAgICAgIGJpbmRFdmVudCh0ZCwgJ29uY2xpY2snLCBmdW5jdGlvbigpe2RvU29ydCh0ZCwgdGFibGUpfSk7XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0geypbXX0gdmFsdWVzXHJcbiAgICovXHJcbiAgc2V0U3RydWN0dXJlOiBmdW5jdGlvbih2YWx1ZXMpe1xyXG4gICAgdmFyIHRhYmxlLCBwYXRocztcclxuXHJcbiAgICB0YWJsZSA9IHRoaXM7XHJcbiAgICBwYXRocyA9IHZhbHVlc1swXTtcclxuXHJcbiAgICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuICAgICAgaWYoZWxlbVswXSAhPSBcInBhdGhzXCIpIHtcclxuICAgICAgICB0YWJsZS5zdHJ1Y3R1cmVbZWxlbVswXV0gPSB7XHJcbiAgICAgICAgICBwYXRoOiBnZXRQYXRoKGVsZW1bMV0sIGVsZW1bMl0pLFxyXG4gICAgICAgICAgZmlsdGVyVHlwZTogZWxlbVszXSxcclxuICAgICAgICAgIGZpbHRlck5hbWU6IGVsZW1bNF1cclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRQYXRoKGUxLCBlMil7XHJcbiAgICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgICBpZihlMSl7XHJcbiAgICAgICAgcmVzdWx0ID0gcGF0aHNbZTFdICsgZTI7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnNwbGl0KFwiW2lkXVwiKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcmVzdWx0ID0gW2UyXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpY29uc1xyXG4gICAqL1xyXG4gIHNldEZpbHRlcnM6IGZ1bmN0aW9uKGljb25zKXtcclxuICAgIHZhciB0YWJsZSA9IHRoaXM7XHJcblxyXG4gICAgJCh0YWJsZS5mb290ZXIpLmZpbmQoJ3RkW2ZpbHRlcl0nKS5ub2RlQXJyKCkuZm9yRWFjaChmdW5jdGlvbih0ZCl7XHJcbiAgICAgIHZhciB2YWx1ZSwgaWNvO1xyXG5cclxuICAgICAgdmFsdWUgPSB0ZC5nZXRBdHRyaWJ1dGUoXCJmaWx0ZXJcIik7XHJcblxyXG4gICAgICBpZih0YWJsZS5zdHJ1Y3R1cmVbdmFsdWVdLmZpbHRlclR5cGUpe1xyXG4gICAgICAgIGljbyA9IHRhYmxlLnNldHRpbmdzLnNob3cudGhlbWVzW3ZhbHVlXSA/IGljb25zLmJveE9uIDogaWNvbnMuYm94T2ZmO1xyXG4gICAgICAgIGljbyA9IGA8aW1nIHN0eWxlPVwibWFyZ2luLWxlZnQ6IDFweDtcIiBzcmM9XCIke2ljb31cIi8+YDtcclxuICAgICAgICB0ZC5pbm5lckhUTUwgKz0gaWNvO1xyXG5cclxuICAgICAgICBiaW5kRXZlbnQodGQsICdvbmNsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgIGRvRmlsdGVyKHRkLCB0YWJsZS5zZXR0aW5ncywgdGFibGUuc3RydWN0dXJlW3ZhbHVlXS5maWx0ZXJUeXBlLCB0YWJsZS5zdHJ1Y3R1cmVbdmFsdWVdLmZpbHRlck5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge29iamVjdH0gcm93XHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgZmlsdGVyaW5nOiBmdW5jdGlvbihyb3cpe1xyXG4gICAgdmFyIGZpbHRlciwgdmFsdWUsIGxlbmd0aCwgbGlzdDtcclxuXHJcbiAgICBmaWx0ZXIgPSB0aGlzLnNldHRpbmdzLnNob3dbdGhpcy5uYW1lXTtcclxuICAgIGxpc3QgPSBPYmplY3Qua2V5cyhmaWx0ZXIpO1xyXG4gICAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XHJcblxyXG4gICAgd2hpbGUobGVuZ3RoLS0pe1xyXG4gICAgICB2YWx1ZSA9IGxpc3RbbGVuZ3RoXTtcclxuXHJcbiAgICAgIHN3aXRjaCAoZmlsdGVyW3ZhbHVlXS50eXBlKXtcclxuICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxyXG4gICAgICAgICAgaWYgKGZpbHRlclt2YWx1ZV0udmFsdWUgIT0gcm93W3ZhbHVlXSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgXCJtdWx0aXBsZVwiOlxyXG4gICAgICAgICAgaWYoIWV4aXN0KHJvd1t2YWx1ZV0udGV4dCwgZmlsdGVyW3ZhbHVlXS52YWx1ZSkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFwiY2hlY2tcIjpcclxuICAgICAgICAgIGlmKCFleGlzdChyb3dbdmFsdWVdLm5hbWUsIGZpbHRlclt2YWx1ZV0udmFsdWUpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGlmIChjb21wYXJlKGZpbHRlclt2YWx1ZV0udmFsdWUgLCByb3dbdmFsdWVdKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb21wYXJlKGssIG4pe1xyXG4gICAgICAvL2lmKGsgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZihpc05hTihuKSkgbiA9IHBhcnNlSW50KG4sIDEwKTtcclxuICAgICAgcmV0dXJuICEoa1swXSA8PSBuICYmIG4gPD0ga1sxXSk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119IG5vZGVzSURcclxuICogQHBhcmFtIHtzdHJpbmd9IHNldHRpbmdzS2V5XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xyXG4gKiBAcmV0dXJucyB7VGFibGV9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChub2Rlc0lELCBzZXR0aW5nc0tleSwgc2V0dGluZ3Mpe1xyXG4gIHJldHVybiBuZXcgVGFibGUobm9kZXNJRCwgc2V0dGluZ3NLZXksIHNldHRpbmdzKTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qva2V5c1wiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZlwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIi8vIFRoaXMgbWV0aG9kIG9mIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBuZWVkcyB0byBiZVxuLy8ga2VwdCBpZGVudGljYWwgdG8gdGhlIHdheSBpdCBpcyBvYnRhaW5lZCBpbiBydW50aW1lLmpzXG52YXIgZyA9XG4gIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgPyBnbG9iYWwgOlxuICB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiID8gd2luZG93IDpcbiAgdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgPyBzZWxmIDogdGhpcztcblxuLy8gVXNlIGBnZXRPd25Qcm9wZXJ0eU5hbWVzYCBiZWNhdXNlIG5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCBjYWxsaW5nXG4vLyBgaGFzT3duUHJvcGVydHlgIG9uIHRoZSBnbG9iYWwgYHNlbGZgIG9iamVjdCBpbiBhIHdvcmtlci4gU2VlICMxODMuXG52YXIgaGFkUnVudGltZSA9IGcucmVnZW5lcmF0b3JSdW50aW1lICYmXG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGcpLmluZGV4T2YoXCJyZWdlbmVyYXRvclJ1bnRpbWVcIikgPj0gMDtcblxuLy8gU2F2ZSB0aGUgb2xkIHJlZ2VuZXJhdG9yUnVudGltZSBpbiBjYXNlIGl0IG5lZWRzIHRvIGJlIHJlc3RvcmVkIGxhdGVyLlxudmFyIG9sZFJ1bnRpbWUgPSBoYWRSdW50aW1lICYmIGcucmVnZW5lcmF0b3JSdW50aW1lO1xuXG4vLyBGb3JjZSByZWV2YWx1dGF0aW9uIG9mIHJ1bnRpbWUuanMuXG5nLnJlZ2VuZXJhdG9yUnVudGltZSA9IHVuZGVmaW5lZDtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9ydW50aW1lXCIpO1xuXG5pZiAoaGFkUnVudGltZSkge1xuICAvLyBSZXN0b3JlIHRoZSBvcmlnaW5hbCBydW50aW1lLlxuICBnLnJlZ2VuZXJhdG9yUnVudGltZSA9IG9sZFJ1bnRpbWU7XG59IGVsc2Uge1xuICAvLyBSZW1vdmUgdGhlIGdsb2JhbCBwcm9wZXJ0eSBhZGRlZCBieSBydW50aW1lLmpzLlxuICB0cnkge1xuICAgIGRlbGV0ZSBnLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBtb2R1bGUuZXhwb3J0cywgX19lc01vZHVsZTogdHJ1ZSB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfU3ltYm9sID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2xcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX09iamVjdCRjcmVhdGUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGVcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX09iamVjdCRzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX1Byb21pc2UgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2VcIilbXCJkZWZhdWx0XCJdO1xuXG4hKGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBfU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBfU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgZ2VuZXJhdG9yID0gX09iamVjdCRjcmVhdGUoKG91dGVyRm4gfHwgR2VuZXJhdG9yKS5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9IEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24gKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvciA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCIgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbiAoZ2VuRnVuKSB7XG4gICAgaWYgKF9PYmplY3Qkc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IF9PYmplY3QkY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgdmFsdWUgaW5zdGFuY2VvZiBBd2FpdEFyZ3VtZW50YCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC4gU29tZSBtYXkgY29uc2lkZXIgdGhlIG5hbWUgb2YgdGhpcyBtZXRob2QgdG9vXG4gIC8vIGN1dGVzeSwgYnV0IHRoZXkgYXJlIGN1cm11ZGdlb25zLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiBuZXcgQXdhaXRBcmd1bWVudChhcmcpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEF3YWl0QXJndW1lbnQoYXJnKSB7XG4gICAgdGhpcy5hcmcgPSBhcmc7XG4gIH1cblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEF3YWl0QXJndW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gX1Byb21pc2UucmVzb2x2ZSh2YWx1ZS5hcmcpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG4gICAgICAgICAgLy8gcmVzdWx0IGZvciB0aGlzIGl0ZXJhdGlvbiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHNhbWVcbiAgICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuICAgICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2VcbiAgICAgICAgICAvLyB3aGVuIGFuIGF3YWl0ZWQgUHJvbWlzZSBpcyByZWplY3RlZC4gVGhpcyBkaWZmZXJlbmNlIGluXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG4gICAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIChzd2FsbG93IGl0IGFuZCBjb250aW51ZSwgbWFudWFsbHkgLnRocm93IGl0IGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcbiAgICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIHJlYXNvbiBvdXRzaWRlIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIHNvIHRoZVxuICAgICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuICAgICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MuZG9tYWluKSB7XG4gICAgICBpbnZva2UgPSBwcm9jZXNzLmRvbWFpbi5iaW5kKGludm9rZSk7XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IF9Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZykgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbiAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpKTtcblxuICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbikgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIgfHwgbWV0aG9kID09PSBcInRocm93XCIgJiYgZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBBIHJldHVybiBvciB0aHJvdyAod2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIHRocm93XG4gICAgICAgICAgICAvLyBtZXRob2QpIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgICB2YXIgcmV0dXJuTWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl07XG4gICAgICAgICAgICBpZiAocmV0dXJuTWV0aG9kKSB7XG4gICAgICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChyZXR1cm5NZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBhcmcpO1xuICAgICAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSByZXR1cm4gbWV0aG9kIHRocmV3IGFuIGV4Y2VwdGlvbiwgbGV0IHRoYXRcbiAgICAgICAgICAgICAgICAvLyBleGNlcHRpb24gcHJldmFpbCBvdmVyIHRoZSBvcmlnaW5hbCByZXR1cm4gb3IgdGhyb3cuXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgICAgICAvLyBDb250aW51ZSB3aXRoIHRoZSBvdXRlciByZXR1cm4sIG5vdyB0aGF0IHRoZSBkZWxlZ2F0ZVxuICAgICAgICAgICAgICAvLyBpdGVyYXRvciBoYXMgYmVlbiB0ZXJtaW5hdGVkLlxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSwgZGVsZWdhdGUuaXRlcmF0b3IsIGFyZyk7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIExpa2UgcmV0dXJuaW5nIGdlbmVyYXRvci50aHJvdyh1bmNhdWdodCksIGJ1dCB3aXRob3V0IHRoZVxuICAgICAgICAgICAgLy8gb3ZlcmhlYWQgb2YgYW4gZXh0cmEgZnVuY3Rpb24gY2FsbC5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEZWxlZ2F0ZSBnZW5lcmF0b3IgcmFuIGFuZCBoYW5kbGVkIGl0cyBvd24gZXhjZXB0aW9ucyBzb1xuICAgICAgICAgIC8vIHJlZ2FyZGxlc3Mgb2Ygd2hhdCB0aGUgbWV0aG9kIHdhcywgd2UgY29udGludWUgYXMgaWYgaXQgaXNcbiAgICAgICAgICAvLyBcIm5leHRcIiB3aXRoIGFuIHVuZGVmaW5lZCBhcmcuXG4gICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuICAgICAgICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuICAgICAgICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCkge1xuICAgICAgICAgICAgY29udGV4dC5zZW50ID0gYXJnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZSA/IEdlblN0YXRlQ29tcGxldGVkIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmRlbGVnYXRlICYmIG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihhcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldChza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIHRoaXMuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uIGRpc3BhdGNoRXhjZXB0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuICAgICAgICByZXR1cm4gISFjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24gYWJydXB0KHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiYgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmICh0eXBlID09PSBcImJyZWFrXCIgfHwgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJiBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJiBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fCByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uIGZpbmlzaChmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uIF9jYXRjaCh0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24gZGVsZWdhdGVZaWVsZChpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuLy8gQW1vbmcgdGhlIHZhcmlvdXMgdHJpY2tzIGZvciBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbFxuLy8gb2JqZWN0LCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBtb3N0IHJlbGlhYmxlIHRlY2huaXF1ZSB0aGF0IGRvZXMgbm90XG4vLyB1c2UgaW5kaXJlY3QgZXZhbCAod2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kpLlxudHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6IHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB1bmRlZmluZWQpOyIsInZhciAkID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKXtcbiAgcmV0dXJuICQuY3JlYXRlKFAsIEQpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQuY29yZScpLk9iamVjdC5rZXlzOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJC5jb3JlJykuT2JqZWN0LnNldFByb3RvdHlwZU9mOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvJC5jb3JlJykuUHJvbWlzZTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zeW1ib2wnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5TeW1ib2w7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtUQUddKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcxLjIuNid9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCIvLyBhbGwgZW51bWVyYWJsZSBvYmplY3Qga2V5cywgaW5jbHVkZXMgc3ltYm9sc1xudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIga2V5cyAgICAgICA9ICQuZ2V0S2V5cyhpdClcbiAgICAsIGdldFN5bWJvbHMgPSAkLmdldFN5bWJvbHM7XG4gIGlmKGdldFN5bWJvbHMpe1xuICAgIHZhciBzeW1ib2xzID0gZ2V0U3ltYm9scyhpdClcbiAgICAgICwgaXNFbnVtICA9ICQuaXNFbnVtXG4gICAgICAsIGkgICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShzeW1ib2xzLmxlbmd0aCA+IGkpaWYoaXNFbnVtLmNhbGwoaXQsIGtleSA9IHN5bWJvbHNbaSsrXSkpa2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuLyQuY29yZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0LldcbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKHBhcmFtKXtcbiAgICAgICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBDID8gbmV3IEMocGFyYW0pIDogQyhwYXJhbSk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIGlmKElTX1BST1RPKShleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KSlba2V5XSA9IG91dDtcbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgLy8gd3JhcFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsInZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuLyQuaXMtYXJyYXktaXRlcicpXG4gICwgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vJC50by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0KXtcbiAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvcjtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICB9XG59OyIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpXG4gICwgZ2V0TmFtZXMgID0gcmVxdWlyZSgnLi8kJykuZ2V0TmFtZXNcbiAgLCB0b1N0cmluZyAgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24oaXQpe1xuICB0cnkge1xuICAgIHJldHVybiBnZXROYW1lcyhpdCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmdldCA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICBpZih3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJylyZXR1cm4gZ2V0V2luZG93TmFtZXMoaXQpO1xuICByZXR1cm4gZ2V0TmFtZXModG9JT2JqZWN0KGl0KSk7XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTsiLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi8kLnByb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLmhpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSAkLmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vJC5saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuLyQuaXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90byAgICAgICA9IHJlcXVpcmUoJy4vJCcpLmdldFByb3RvXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCBtZXRob2RzLCBrZXk7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJG5hdGl2ZSl7XG4gICAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8oJGRlZmF1bHQuY2FsbChuZXcgQmFzZSkpO1xuICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAvLyBGRiBmaXhcbiAgICBpZighTElCUkFSWSAmJiBoYXMocHJvdG8sIEZGX0lURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICAgIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICAgIH1cbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJylcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgc2FmZSA9IHRydWU7IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsInZhciAkT2JqZWN0ID0gT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogICAgICRPYmplY3QuY3JlYXRlLFxuICBnZXRQcm90bzogICAkT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuICBpc0VudW06ICAgICB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgZ2V0RGVzYzogICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIHNldERlc2M6ICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgICRPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgZ2V0S2V5czogICAgJE9iamVjdC5rZXlzLFxuICBnZXROYW1lczogICAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6ICRPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICBlYWNoOiAgICAgICBbXS5mb3JFYWNoXG59OyIsInZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhPKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlOyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuLyQudGFzaycpLnNldFxuICAsIE9ic2VydmVyICA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyXG4gICwgcHJvY2VzcyAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBQcm9taXNlICAgPSBnbG9iYWwuUHJvbWlzZVxuICAsIGlzTm9kZSAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbnZhciBmbHVzaCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBwYXJlbnQsIGRvbWFpbiwgZm47XG4gIGlmKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKXtcbiAgICBwcm9jZXNzLmRvbWFpbiA9IG51bGw7XG4gICAgcGFyZW50LmV4aXQoKTtcbiAgfVxuICB3aGlsZShoZWFkKXtcbiAgICBkb21haW4gPSBoZWFkLmRvbWFpbjtcbiAgICBmbiAgICAgPSBoZWFkLmZuO1xuICAgIGlmKGRvbWFpbilkb21haW4uZW50ZXIoKTtcbiAgICBmbigpOyAvLyA8LSBjdXJyZW50bHkgd2UgdXNlIGl0IG9ubHkgZm9yIFByb21pc2UgLSB0cnkgLyBjYXRjaCBub3QgcmVxdWlyZWRcbiAgICBpZihkb21haW4pZG9tYWluLmV4aXQoKTtcbiAgICBoZWFkID0gaGVhZC5uZXh0O1xuICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gIGlmKHBhcmVudClwYXJlbnQuZW50ZXIoKTtcbn07XG5cbi8vIE5vZGUuanNcbmlmKGlzTm9kZSl7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG4vLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcbn0gZWxzZSBpZihPYnNlcnZlcil7XG4gIHZhciB0b2dnbGUgPSAxXG4gICAgLCBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9IC10b2dnbGU7XG4gIH07XG4vLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxufSBlbHNlIGlmKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKXtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZsdXNoKTtcbiAgfTtcbi8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4vLyAtIHNldEltbWVkaWF0ZVxuLy8gLSBNZXNzYWdlQ2hhbm5lbFxuLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2Vcbi8vIC0gc2V0VGltZW91dFxufSBlbHNlIHtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXNhcChmbil7XG4gIHZhciB0YXNrID0ge2ZuOiBmbiwgbmV4dDogdW5kZWZpbmVkLCBkb21haW46IGlzTm9kZSAmJiBwcm9jZXNzLmRvbWFpbn07XG4gIGlmKGxhc3QpbGFzdC5uZXh0ID0gdGFzaztcbiAgaWYoIWhlYWQpe1xuICAgIGhlYWQgPSB0YXNrO1xuICAgIG5vdGlmeSgpO1xuICB9IGxhc3QgPSB0YXNrO1xufTsiLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgY29yZSAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCBmYWlscyAgID0gcmVxdWlyZSgnLi8kLmZhaWxzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgZXhlYyl7XG4gIHZhciBmbiAgPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuaGlkZScpOyIsIi8vIDcuMi45IFNhbWVWYWx1ZSh4LCB5KVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaXMgfHwgZnVuY3Rpb24gaXMoeCwgeSl7XG4gIHJldHVybiB4ID09PSB5ID8geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHkgOiB4ICE9IHggJiYgeSAhPSB5O1xufTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgZ2V0RGVzYyAgPSByZXF1aXJlKCcuLyQnKS5nZXREZXNjXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uKE8sIHByb3RvKXtcbiAgYW5PYmplY3QoTyk7XG4gIGlmKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24odGVzdCwgYnVnZ3ksIHNldCl7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuLyQuY3R4JykoRnVuY3Rpb24uY2FsbCwgZ2V0RGVzYyhPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90byl7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjb3JlICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCAkICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKVxuICAsIFNQRUNJRVMgICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSBjb3JlW0tFWV07XG4gIGlmKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pJC5zZXREZXNjKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vJCcpLnNldERlc2NcbiAgLCBoYXMgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKVxuICAsIFNQRUNJRVMgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpdGhyb3cgVHlwZUVycm9yKG5hbWUgKyBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vJC50by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgaW52b2tlICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmh0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdG5lciA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIXNldFRhc2sgfHwgIWNsZWFyVGFzayl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihyZXF1aXJlKCcuLyQuY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0bmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuLyQuaW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuLyQudG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsIFN5bWJvbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5TeW1ib2w7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBTeW1ib2wgJiYgU3ltYm9sW25hbWVdIHx8IChTeW1ib2wgfHwgdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59OyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vJC5hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwiLy8gMTkuMS4yLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLyQudG8tb2JqZWN0Jyk7XG5cbnJlcXVpcmUoJy4vJC5vYmplY3Qtc2FwJykoJ2tleXMnLCBmdW5jdGlvbigka2V5cyl7XG4gIHJldHVybiBmdW5jdGlvbiBrZXlzKGl0KXtcbiAgICByZXR1cm4gJGtleXModG9PYmplY3QoaXQpKTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge3NldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuLyQuc2V0LXByb3RvJykuc2V0fSk7IiwiIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIExJQlJBUlkgICAgPSByZXF1aXJlKCcuLyQubGlicmFyeScpXG4gICwgZ2xvYmFsICAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGN0eCAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjbGFzc29mICAgID0gcmVxdWlyZSgnLi8kLmNsYXNzb2YnKVxuICAsICRleHBvcnQgICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBpc09iamVjdCAgID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiAgPSByZXF1aXJlKCcuLyQuYS1mdW5jdGlvbicpXG4gICwgc3RyaWN0TmV3ICA9IHJlcXVpcmUoJy4vJC5zdHJpY3QtbmV3JylcbiAgLCBmb3JPZiAgICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgc2V0UHJvdG8gICA9IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXRcbiAgLCBzYW1lICAgICAgID0gcmVxdWlyZSgnLi8kLnNhbWUtdmFsdWUnKVxuICAsIFNQRUNJRVMgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKVxuICAsIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vJC5zcGVjaWVzLWNvbnN0cnVjdG9yJylcbiAgLCBhc2FwICAgICAgID0gcmVxdWlyZSgnLi8kLm1pY3JvdGFzaycpXG4gICwgUFJPTUlTRSAgICA9ICdQcm9taXNlJ1xuICAsIHByb2Nlc3MgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIGlzTm9kZSAgICAgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJ1xuICAsIFAgICAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cbiAgLCBXcmFwcGVyO1xuXG52YXIgdGVzdFJlc29sdmUgPSBmdW5jdGlvbihzdWIpe1xuICB2YXIgdGVzdCA9IG5ldyBQKGZ1bmN0aW9uKCl7fSk7XG4gIGlmKHN1Yil0ZXN0LmNvbnN0cnVjdG9yID0gT2JqZWN0O1xuICByZXR1cm4gUC5yZXNvbHZlKHRlc3QpID09PSB0ZXN0O1xufTtcblxudmFyIFVTRV9OQVRJVkUgPSBmdW5jdGlvbigpe1xuICB2YXIgd29ya3MgPSBmYWxzZTtcbiAgZnVuY3Rpb24gUDIoeCl7XG4gICAgdmFyIHNlbGYgPSBuZXcgUCh4KTtcbiAgICBzZXRQcm90byhzZWxmLCBQMi5wcm90b3R5cGUpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG4gIHRyeSB7XG4gICAgd29ya3MgPSBQICYmIFAucmVzb2x2ZSAmJiB0ZXN0UmVzb2x2ZSgpO1xuICAgIHNldFByb3RvKFAyLCBQKTtcbiAgICBQMi5wcm90b3R5cGUgPSAkLmNyZWF0ZShQLnByb3RvdHlwZSwge2NvbnN0cnVjdG9yOiB7dmFsdWU6IFAyfX0pO1xuICAgIC8vIGFjdHVhbCBGaXJlZm94IGhhcyBicm9rZW4gc3ViY2xhc3Mgc3VwcG9ydCwgdGVzdCB0aGF0XG4gICAgaWYoIShQMi5yZXNvbHZlKDUpLnRoZW4oZnVuY3Rpb24oKXt9KSBpbnN0YW5jZW9mIFAyKSl7XG4gICAgICB3b3JrcyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBhY3R1YWwgVjggYnVnLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDE2MlxuICAgIGlmKHdvcmtzICYmIHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpKXtcbiAgICAgIHZhciB0aGVuYWJsZVRoZW5Hb3R0ZW4gPSBmYWxzZTtcbiAgICAgIFAucmVzb2x2ZSgkLnNldERlc2Moe30sICd0aGVuJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHRoZW5hYmxlVGhlbkdvdHRlbiA9IHRydWU7IH1cbiAgICAgIH0pKTtcbiAgICAgIHdvcmtzID0gdGhlbmFibGVUaGVuR290dGVuO1xuICAgIH1cbiAgfSBjYXRjaChlKXsgd29ya3MgPSBmYWxzZTsgfVxuICByZXR1cm4gd29ya3M7XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBzYW1lQ29uc3RydWN0b3IgPSBmdW5jdGlvbihhLCBiKXtcbiAgLy8gbGlicmFyeSB3cmFwcGVyIHNwZWNpYWwgY2FzZVxuICBpZihMSUJSQVJZICYmIGEgPT09IFAgJiYgYiA9PT0gV3JhcHBlcilyZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIHNhbWUoYSwgYik7XG59O1xudmFyIGdldENvbnN0cnVjdG9yID0gZnVuY3Rpb24oQyl7XG4gIHZhciBTID0gYW5PYmplY3QoQylbU1BFQ0lFU107XG4gIHJldHVybiBTICE9IHVuZGVmaW5lZCA/IFMgOiBDO1xufTtcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbigkJHJlc29sdmUsICQkcmVqZWN0KXtcbiAgICBpZihyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ICA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpLFxuICB0aGlzLnJlamVjdCAgPSBhRnVuY3Rpb24ocmVqZWN0KVxufTtcbnZhciBwZXJmb3JtID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB7ZXJyb3I6IGV9O1xuICB9XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uKHJlY29yZCwgaXNSZWplY3Qpe1xuICBpZihyZWNvcmQubilyZXR1cm47XG4gIHJlY29yZC5uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcmVjb3JkLmM7XG4gIGFzYXAoZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSByZWNvcmQudlxuICAgICAgLCBvayAgICA9IHJlY29yZC5zID09IDFcbiAgICAgICwgaSAgICAgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbihyZWFjdGlvbil7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsXG4gICAgICAgICwgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmVcbiAgICAgICAgLCByZWplY3QgID0gcmVhY3Rpb24ucmVqZWN0XG4gICAgICAgICwgcmVzdWx0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoaGFuZGxlcil7XG4gICAgICAgICAgaWYoIW9rKXJlY29yZC5oID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyID09PSB0cnVlID8gdmFsdWUgOiBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICBpZihyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2Upe1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSlydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgY2hhaW4ubGVuZ3RoID0gMDtcbiAgICByZWNvcmQubiA9IGZhbHNlO1xuICAgIGlmKGlzUmVqZWN0KXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHZhciBwcm9taXNlID0gcmVjb3JkLnBcbiAgICAgICAgLCBoYW5kbGVyLCBjb25zb2xlO1xuICAgICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xuICAgICAgICBpZihpc05vZGUpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbil7XG4gICAgICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IHJlY29yZC5hID0gdW5kZWZpbmVkO1xuICAgIH0sIDEpO1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdmFyIHJlY29yZCA9IHByb21pc2UuX2RcbiAgICAsIGNoYWluICA9IHJlY29yZC5hIHx8IHJlY29yZC5jXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZWFjdGlvbjtcbiAgaWYocmVjb3JkLmgpcmV0dXJuIGZhbHNlO1xuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcbiAgICByZWFjdGlvbiA9IGNoYWluW2krK107XG4gICAgaWYocmVhY3Rpb24uZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3Rpb24ucHJvbWlzZSkpcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcmVjb3JkID0gdGhpcztcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xuICByZWNvcmQuZCA9IHRydWU7XG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXG4gIHJlY29yZC52ID0gdmFsdWU7XG4gIHJlY29yZC5zID0gMjtcbiAgcmVjb3JkLmEgPSByZWNvcmQuYy5zbGljZSgpO1xuICBub3RpZnkocmVjb3JkLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzXG4gICAgLCB0aGVuO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZihyZWNvcmQucCA9PT0gdmFsdWUpdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIGFzYXAoZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7cjogcmVjb3JkLCBkOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgICAgIHJlY29yZC5zID0gMTtcbiAgICAgIG5vdGlmeShyZWNvcmQsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtyOiByZWNvcmQsIGQ6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCFVU0VfTkFUSVZFKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgUCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgdmFyIHJlY29yZCA9IHRoaXMuX2QgPSB7XG4gICAgICBwOiBzdHJpY3ROZXcodGhpcywgUCwgUFJPTUlTRSksICAgICAgICAgLy8gPC0gcHJvbWlzZVxuICAgICAgYzogW10sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgICAgYTogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgICBzOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICAgIGQ6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBkb25lXG4gICAgICB2OiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgIGg6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBoYW5kbGVkIHJlamVjdGlvblxuICAgICAgbjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgcmVjb3JkLCAxKSwgY3R4KCRyZWplY3QsIHJlY29yZCwgMSkpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICRyZWplY3QuY2FsbChyZWNvcmQsIGVycik7XG4gICAgfVxuICB9O1xuICByZXF1aXJlKCcuLyQucmVkZWZpbmUtYWxsJykoUC5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xuICAgICAgdmFyIHJlYWN0aW9uID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBQKSlcbiAgICAgICAgLCBwcm9taXNlICA9IHJlYWN0aW9uLnByb21pc2VcbiAgICAgICAgLCByZWNvcmQgICA9IHRoaXMuX2Q7XG4gICAgICByZWFjdGlvbi5vayAgID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVjb3JkLmMucHVzaChyZWFjdGlvbik7XG4gICAgICBpZihyZWNvcmQuYSlyZWNvcmQuYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHJlY29yZC5zKW5vdGlmeShyZWNvcmQsIGZhbHNlKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7UHJvbWlzZTogUH0pO1xucmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJykoUCwgUFJPTUlTRSk7XG5yZXF1aXJlKCcuLyQuc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuLyQuY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVqZWN0ICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAkJHJlamVjdChyKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8IHRlc3RSZXNvbHZlKHRydWUpKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICAvLyBpbnN0YW5jZW9mIGluc3RlYWQgb2YgaW50ZXJuYWwgc2xvdCBjaGVjayBiZWNhdXNlIHdlIHNob3VsZCBmaXggaXQgd2l0aG91dCByZXBsYWNlbWVudCBuYXRpdmUgUHJvbWlzZSBjb3JlXG4gICAgaWYoeCBpbnN0YW5jZW9mIFAgJiYgc2FtZUNvbnN0cnVjdG9yKHguY29uc3RydWN0b3IsIHRoaXMpKXJldHVybiB4O1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVzb2x2ZSAgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgJCRyZXNvbHZlKHgpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gIFAuYWxsKGl0ZXIpWydjYXRjaCddKGZ1bmN0aW9uKCl7fSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IGdldENvbnN0cnVjdG9yKHRoaXMpXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVzb2x2ZSAgICA9IGNhcGFiaWxpdHkucmVzb2x2ZVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3RcbiAgICAgICwgdmFsdWVzICAgICA9IFtdO1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIHZhbHVlcy5wdXNoLCB2YWx1ZXMpO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHZhbHVlcy5sZW5ndGhcbiAgICAgICAgLCByZXN1bHRzICAgPSBBcnJheShyZW1haW5pbmcpO1xuICAgICAgaWYocmVtYWluaW5nKSQuZWFjaC5jYWxsKHZhbHVlcywgZnVuY3Rpb24ocHJvbWlzZSwgaW5kZXgpe1xuICAgICAgICB2YXIgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgaWYoYWxyZWFkeUNhbGxlZClyZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICBlbHNlIHJlc29sdmUocmVzdWx0cyk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKVxuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgID0gcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGluZGV4ID0gdGhpcy5faVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiB7dmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZX07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7dmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZX07XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgJCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZScpXG4gICwgJGZhaWxzICAgICAgICAgPSByZXF1aXJlKCcuLyQuZmFpbHMnKVxuICAsIHNoYXJlZCAgICAgICAgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuLyQuc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIHVpZCAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpXG4gICwgd2tzICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQud2tzJylcbiAgLCBrZXlPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5rZXlvZicpXG4gICwgJG5hbWVzICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2V0LW5hbWVzJylcbiAgLCBlbnVtS2V5cyAgICAgICA9IHJlcXVpcmUoJy4vJC5lbnVtLWtleXMnKVxuICAsIGlzQXJyYXkgICAgICAgID0gcmVxdWlyZSgnLi8kLmlzLWFycmF5JylcbiAgLCBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi8kLnByb3BlcnR5LWRlc2MnKVxuICAsIGdldERlc2MgICAgICAgID0gJC5nZXREZXNjXG4gICwgc2V0RGVzYyAgICAgICAgPSAkLnNldERlc2NcbiAgLCBfY3JlYXRlICAgICAgICA9ICQuY3JlYXRlXG4gICwgZ2V0TmFtZXMgICAgICAgPSAkbmFtZXMuZ2V0XG4gICwgJFN5bWJvbCAgICAgICAgPSBnbG9iYWwuU3ltYm9sXG4gICwgJEpTT04gICAgICAgICAgPSBnbG9iYWwuSlNPTlxuICAsIF9zdHJpbmdpZnkgICAgID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5XG4gICwgc2V0dGVyICAgICAgICAgPSBmYWxzZVxuICAsIEhJRERFTiAgICAgICAgID0gd2tzKCdfaGlkZGVuJylcbiAgLCBpc0VudW0gICAgICAgICA9ICQuaXNFbnVtXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyAgICAgPSBzaGFyZWQoJ3N5bWJvbHMnKVxuICAsIHVzZU5hdGl2ZSAgICAgID0gdHlwZW9mICRTeW1ib2wgPT0gJ2Z1bmN0aW9uJ1xuICAsIE9iamVjdFByb3RvICAgID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0NSSVBUT1JTICYmICRmYWlscyhmdW5jdGlvbigpe1xuICByZXR1cm4gX2NyZWF0ZShzZXREZXNjKHt9LCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBzZXREZXNjKHRoaXMsICdhJywge3ZhbHVlOiA3fSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbihpdCwga2V5LCBEKXtcbiAgdmFyIHByb3RvRGVzYyA9IGdldERlc2MoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmKHByb3RvRGVzYylkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgc2V0RGVzYyhpdCwga2V5LCBEKTtcbiAgaWYocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bylzZXREZXNjKE9iamVjdFByb3RvLCBrZXksIHByb3RvRGVzYyk7XG59IDogc2V0RGVzYztcblxudmFyIHdyYXAgPSBmdW5jdGlvbih0YWcpe1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sLnByb3RvdHlwZSk7XG4gIHN5bS5fayA9IHRhZztcbiAgREVTQ1JJUFRPUlMgJiYgc2V0dGVyICYmIHNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIGlmKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSl7XG4gICAgaWYoIUQuZW51bWVyYWJsZSl7XG4gICAgICBpZighaGFzKGl0LCBISURERU4pKXNldERlc2MoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHtlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKX0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIHNldERlc2MoaXQsIGtleSwgRCk7XG59O1xudmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCl7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKVxuICAgICwgaSAgICA9IDBcbiAgICAsIGwgPSBrZXlzLmxlbmd0aFxuICAgICwga2V5O1xuICB3aGlsZShsID4gaSkkZGVmaW5lUHJvcGVydHkoaXQsIGtleSA9IGtleXNbaSsrXSwgUFtrZXldKTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciAkY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGl0LCBQKXtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpe1xuICB2YXIgRSA9IGlzRW51bS5jYWxsKHRoaXMsIGtleSk7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV1cbiAgICA/IEUgOiB0cnVlO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICB2YXIgRCA9IGdldERlc2MoaXQgPSB0b0lPYmplY3QoaXQpLCBrZXkpO1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnZXROYW1lcyh0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZighaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4pcmVzdWx0LnB1c2goa2V5KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnZXROYW1lcyh0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkpcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJHN0cmluZ2lmeSA9IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7XG4gIGlmKGl0ID09PSB1bmRlZmluZWQgfHwgaXNTeW1ib2woaXQpKXJldHVybjsgLy8gSUU4IHJldHVybnMgc3RyaW5nIG9uIHVuZGVmaW5lZFxuICB2YXIgYXJncyA9IFtpdF1cbiAgICAsIGkgICAgPSAxXG4gICAgLCAkJCAgID0gYXJndW1lbnRzXG4gICAgLCByZXBsYWNlciwgJHJlcGxhY2VyO1xuICB3aGlsZSgkJC5sZW5ndGggPiBpKWFyZ3MucHVzaCgkJFtpKytdKTtcbiAgcmVwbGFjZXIgPSBhcmdzWzFdO1xuICBpZih0eXBlb2YgcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykkcmVwbGFjZXIgPSByZXBsYWNlcjtcbiAgaWYoJHJlcGxhY2VyIHx8ICFpc0FycmF5KHJlcGxhY2VyKSlyZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgIGlmKCRyZXBsYWNlcil2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgIGlmKCFpc1N5bWJvbCh2YWx1ZSkpcmV0dXJuIHZhbHVlO1xuICB9O1xuICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gIHJldHVybiBfc3RyaW5naWZ5LmFwcGx5KCRKU09OLCBhcmdzKTtcbn07XG52YXIgYnVnZ3lKU09OID0gJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHZhciBTID0gJFN5bWJvbCgpO1xuICAvLyBNUyBFZGdlIGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyB7fVxuICAvLyBXZWJLaXQgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIG51bGxcbiAgLy8gVjggdGhyb3dzIG9uIGJveGVkIHN5bWJvbHNcbiAgcmV0dXJuIF9zdHJpbmdpZnkoW1NdKSAhPSAnW251bGxdJyB8fCBfc3RyaW5naWZ5KHthOiBTfSkgIT0gJ3t9JyB8fCBfc3RyaW5naWZ5KE9iamVjdChTKSkgIT0gJ3t9Jztcbn0pO1xuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmKCF1c2VOYXRpdmUpe1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCl7XG4gICAgaWYoaXNTeW1ib2wodGhpcykpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcbiAgICByZXR1cm4gd3JhcCh1aWQoYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gIGlzU3ltYm9sID0gZnVuY3Rpb24oaXQpe1xuICAgIHJldHVybiBpdCBpbnN0YW5jZW9mICRTeW1ib2w7XG4gIH07XG5cbiAgJC5jcmVhdGUgICAgID0gJGNyZWF0ZTtcbiAgJC5pc0VudW0gICAgID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICAkLmdldERlc2MgICAgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkLnNldERlc2MgICAgPSAkZGVmaW5lUHJvcGVydHk7XG4gICQuc2V0RGVzY3MgICA9ICRkZWZpbmVQcm9wZXJ0aWVzO1xuICAkLmdldE5hbWVzICAgPSAkbmFtZXMuZ2V0ID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gICQuZ2V0U3ltYm9scyA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYoREVTQ1JJUFRPUlMgJiYgIXJlcXVpcmUoJy4vJC5saWJyYXJ5Jykpe1xuICAgIHJlZGVmaW5lKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xuICB9XG59XG5cbnZhciBzeW1ib2xTdGF0aWNzID0ge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihrZXkpe1xuICAgIHJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uKCl7IHNldHRlciA9IGZhbHNlOyB9XG59O1xuLy8gMTkuNC4yLjIgU3ltYm9sLmhhc0luc3RhbmNlXG4vLyAxOS40LjIuMyBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlXG4vLyAxOS40LjIuNCBTeW1ib2wuaXRlcmF0b3Jcbi8vIDE5LjQuMi42IFN5bWJvbC5tYXRjaFxuLy8gMTkuNC4yLjggU3ltYm9sLnJlcGxhY2Vcbi8vIDE5LjQuMi45IFN5bWJvbC5zZWFyY2hcbi8vIDE5LjQuMi4xMCBTeW1ib2wuc3BlY2llc1xuLy8gMTkuNC4yLjExIFN5bWJvbC5zcGxpdFxuLy8gMTkuNC4yLjEyIFN5bWJvbC50b1ByaW1pdGl2ZVxuLy8gMTkuNC4yLjEzIFN5bWJvbC50b1N0cmluZ1RhZ1xuLy8gMTkuNC4yLjE0IFN5bWJvbC51bnNjb3BhYmxlc1xuJC5lYWNoLmNhbGwoKFxuICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLCcgK1xuICAnc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcbikuc3BsaXQoJywnKSwgZnVuY3Rpb24oaXQpe1xuICB2YXIgc3ltID0gd2tzKGl0KTtcbiAgc3ltYm9sU3RhdGljc1tpdF0gPSB1c2VOYXRpdmUgPyBzeW0gOiB3cmFwKHN5bSk7XG59KTtcblxuc2V0dGVyID0gdHJ1ZTtcblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcsIHtTeW1ib2w6ICRTeW1ib2x9KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdTeW1ib2wnLCBzeW1ib2xTdGF0aWNzKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhdXNlTmF0aXZlLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuMiBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAkZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gMjQuMy4yIEpTT04uc3RyaW5naWZ5KHZhbHVlIFssIHJlcGxhY2VyIFssIHNwYWNlXV0pXG4kSlNPTiAmJiAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghdXNlTmF0aXZlIHx8IGJ1Z2d5SlNPTiksICdKU09OJywge3N0cmluZ2lmeTogJHN0cmluZ2lmeX0pO1xuXG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xuSXRlcmF0b3JzLk5vZGVMaXN0ID0gSXRlcmF0b3JzLkhUTUxDb2xsZWN0aW9uID0gSXRlcmF0b3JzLkFycmF5OyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBsb2FkaW5nOiBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEdRQVpBS1VBQUF4ZURJU3loRXlPVkx6YXZDUnlMR3lpYk5UdTFLVEtwQnhxSEdTYVpNem16RHgrUE9UNjVMVFN0QnhtSEhTcWRCUm1IRnlXWE1UaXhEUjZOQlJpRkp6Q25GU1NWTVRleEN4eUxIU21kT1QyNUt6T3JDUnVKR1NlWk96NjdMVFd0QXhlRkl5NmpMemV2R3lpZE56eTNLVEtyQnhxSk5UcTFEeUNSSHl1ZkZTU1hDeDJOR1NlYk96KzdMVFd2UEQvOEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFDSC9DMDVGVkZORFFWQkZNaTR3QXdFQUFBQWgrUVFKRFFBdkFDd0FBQUFBR1FBWkFBQUd6c0NYY0Vnc0dvL0lwSExKZkowVTBPaFEwMnB1UUlBc0FGSjlaU1loRGZPcTVRcEgyWlZrcVpsb0tWMTBGakpRUnJSYmo5QlEwSEpJU0I5YUtDQU9YVUprQUNOSUFsa0xMUnNtaDBJQldSUmlSUm9VV1J0Q2Raa09XU1ZHRWxrZ2Vra3FXUTlHRFZrY2swWnlpMFVpQUNCbVNRbFpHVVlrV0FBWFJnWkNIZ1JaRlVjTFdSRkdMTWtIcGlkSEZWckpSTHNCQ0ZrQ1NDM0x2Smd2RWNDM0Nra0tKbG9ZUXl4NDErZ1lXQnhESFZvZzhFa2FLU1lFUTd2Mzh1a1RNV1JBaFJBSEsxUmcwS1NodzRjUWh3UUJBQ0g1QkFrTkFERUFMQUFBQUFBWkFCa0FoUXhlRElTeWhFeUtUTHpldkR4K1BKekduR3lpYk56eTNDUnVKRnlXWE5UcTFLelNyQlJtSEpTK2xIU3FmT1Q2NUZTU1ZNem16RVNHUkt6T3JCUmlGSXk2ak1UZXhLVEtwSFNtZEN4eUxHU2FaTnp1M0xUU3RCeG1IT3o2N0F4ZUZJUzJoRXlPVkR5Q1JHeWlkT1QyNUNSeUxGeWFaTlR1MUp6Q25IeXVmRlNTWEVTR1RNVGl4S1RLckxUV3RCeHFIT3orN1BELzhBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFiWXdKaHdTQ3dhajhXS0JZWnNGaHNBQW9ya2RKSTZBTUFMczZrZU9ZZ3M0QlB4RWtrSmNYWTFMTENxSkpFNjJ4SjZTcDJCTTUwbE9MUWVRaE5aQ0FkSUxtSW1NQjRJQVVNY0gxa2pTQ0Y5Z1RFQlhVTUJXUlJVUlNRVVdSTkRUR2NNZEVZc1dSK1hTQ3BaS1VZY1dTV21TQmlTUmdOWkhiZEhmQmhHQjVFQUZrMHdKVmtOUndSWkNVOURMYXdLUnloaXpFSW5GR1VSTDFraFNCNEVrUUpES1I4R0Z4MlJaRTNlSDZReER3akZZaWhWRVNHbTAyb2ZCV2FJckZBVG9reEFPeHBFWmRGemtNaUdGQ1UrUUd0WXhNT0VCSjhvbWdrQ0FDSDVCQWtOQURBQUxBQUFBQUFaQUJrQWhReGVESVMyaEV5S1RMemV2Q3gyTEd5aWJLVEtwTnp5M0NSdUpIU3FkTFRXdE5UcTFEeUNSQlJtSEZ5V1hMVFN0T1Q2NUp6Q25Nem16S3pTckh5dWZCUmlGRlNTVk1UZXhEeCtQSFNtZEt6T3JDeHlMRVNHUk96NjdKekduQXhlRkV5T1ZEUjZOR3lpZEtUS3JPVDI1Q1J5TEhTcWZMemF2TlR1MUJ4cUhGeWFaSHl1aE1UaXhFU0dUT3orN0p6R3BQRC84QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQWJYUUpod1NCUXVVTVdrc2pqWUxKWlE1c2NaaFI1T0FRQmdnNndTSDYyS2RzejF3a2lPc1JydzBYaEpESFVEb2YyOHpHa3RSdEU1ZlQ0UlF4MGtTd3BqQlIxQ2ZuZENIU0FGU3dKYUlZbENMQWFDSUFBTmhFVWtZZ0FUVUNRcFdwaEZMSFdWU3haYUZFa1BXaVV1VVJsYUlra25XaW1yU2c0ZkFCbEpCOEFmRjFBdWRBQ0JTUmhzSjBNa29rTWpkVTlKRVIvVFp3SUpReEtsQUNCTExzZENKQzBBM2gwdjRSOFNiK2tBSVJiS2JNeFJFUEpyOTJZa3ptcytXTGhtNWtDSVNTWmVIREJUeE9BSFlReVZITUJnSXVLU0F5TzhCQUVBSWZrRUNRMEFQQUFzQUFBQUFCa0FHUUNGREY0TWhMS0VUSXBNdk5xOExIWTBuTWFjWko1azFPN1VKRzRrck5Lc2RLcDhsTDZVek9iTVBJSkU1UHJrRkdZY1hKWmN4T0xFck02c2pMcU1WSkpVUEg0OHBNYWtkS1owNVBia3ROSzBmS3A4RkdJVXhON0VOSDQ4YktKczNPN2NMSElzbk1LY1JJSkU3UHJzSEdZY3ROYTBmSzU4REY0VWhMYUVUSTVVdk42OE5IbzBuTWFrSkhJc2xNS2MxT3JVWEpwa3hPTE1qTHFVVkpKY3BNcWtiS0owM1BMY1JJWkU3UDdzSEdvY3ROYThmSzZFOFAvd0FBQUFBQUFBQUFBQUJ0RkFubkJJTEJxUFNDTW55U1JpRUpobTBUYVFaRjY0Q1dBaEZTWUVKNEFZUU1pZE9yZ21aalp1dHdkTVRLUDlBQ0hjRUNaazNOQ05lQ002YlFSL1J5VmpCb1ZDR21JTk5JcEdBbUlWa0NNck5ReHFHMklKUlNOUm5rWVJZaWVRUmlNU0tRRkdHV0l0YVVtTUFCNUdBeWNRY0V3d1lncEdEalpHc0VNakxXSWhVZ01RR1VVV3BDOUpEZ3NWQUMyUUREbGlLVWtUSkdNYVF6Z0YzUUFubVVnTGJTY0NCak4zcE1kSkdBOXViaWNzVWg2a1lXTW5NK1pOTVFDQXdKQWd3QVVGRmc1MEdYSkR4c0lrRWtBOW5JZ2tDQUFoK1FRSkRRQXhBQ3dBQUFBQUdRQVpBSVVNWGd5RXNvUk1pa3k4MnJ3c2RqU2N4cHhrbm1UVTd0UWtiaVNzMHF3VVpoeGNsbHc4Z2tSMHFuemsrdVNzenF5Y3dweFVrbFRNNXN5a3hxUjBwblRrOXVSRWdrUVVZaFNNdW94c29temM3dHdzY2l5MDByUWNhaHhFaGtRTVhoU010b3hNamxURTRzUTBlalNjeHFRa2NpeGttbVI4cm56cy91eFVrbHpVNnRTa3lxUnNvblRjOHR5MDFyUWNhaVJFaGt6dy8vQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR3Q4Q1ljRWdzR28vSXBITEpQTFlHRDQ0SzFTUW1ZQmVBRmtEQVZJU1NWYktTMnBxMUJKSGtoVUZXR0diRjV2WFpYbDRBRUhLeFpReW9LQklzWjNwR0hGc21WRVVnWmdGSElWb01pa1JyalVZT0RDTWpMa1lhREFnbG9DVVFWYVdtcDZneExTa0xFYXdwbkVVb0ZBWUdJa1lxWnhtVFF4TmFId2U0WmhhOFlCMWFLVWU1WmhRdFF5Z1FlQUFmRXNxL1d4OENKaWtJMktUV3RodDFaNy9meWl4VUZRM1MyQ2txU2lpOEZRa0JGQ2NrR3FuNisveENRUUFoK1FRSkRRQTFBQ3dBQUFBQUdRQVpBSVVNWGd5RXNvUk1pa3k4MnJ5Y3hweGtubVFzZGpUYzd0eXMwcXdjYWh4Y2xseDBxblRNNXN6ayt1U1V3cHlzenF4RWhrUVVaaHhVa2xURTRzU2t5cVIwcG5TMDByUWtjaXdVWWhTTXVvekUzc1Jzb213OGZqems5dVFrYmlSa21tUjhxbnpzK3V5MDFyUU1YaFNNdG94VWpsUzgzcnljeHFRMGVqVGM4dHdjYWlSY21tVFU2dFNjd3B4RWhreFVrbHlreXF4c29uUjhybnpzL3V5MDFyencvL0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR3hjQ2FjRWdzR28vSXBITEpQS1lHTUF0cjFpUWlYQmlBRm1ESWRKcWQxM2FzTlV5V0hjNDRZdkNNTVNabFpxVGxERUsxRUtOQUIzaFNTaXd4QzFSRkQzMHhJUlFGaFZVMUFWb2pLZ0FrUkRONFNqTXdiNEJERGg0QkxFZ1BCbVFLbG1vQUl3b2lqVUtLTG1NRFJBTmtBQnVZUlJNeEdCeXVDbU1DR3E1R0hReEVLVmw5TDQ1REpDOFdEbHNPUnd3a25VVU5yeWlJWDY4dENRQVlHOFJFTEpOYUdDNGZFbTViTFVzTXBiYVJKMkFnRVdRakw2S09EUllCS3NnNGNhQ1p3WU1JcXdRQkFDSDVCQWtOQURBQUxBQUFBQUFaQUJrQWhReGVESVN5aEV5S1RMemF2Q3gyTkd5aWJOenUzQ1J1SktUS3BCUm1IRnlXWE9UNjVKUytsTXptekR5Q1JIeXFmTFRTdEZTU1ZCeG1IQlJpRkl5NmpNVGl4RHgrUE9UMjVDeHlMS3pPckdTYVpPejY3SHl1ZkJ4cUhBeGVGSXkyakZTT1ZMemV2RFI2TkhTbWROenkzQ1J5TEtUS3JGeWFaSnpDbk5UcTFFU0dUTFRXdEZTU1hPeis3SHl1aEJ4cUpQRC84QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQWJSUUpod1NDd2FqOGlrY3NrOGtnWW1TS3JWSExZeXFnbGdDeUJRTHRXTGlFdnVWcW9HQWlCQk9KQW5vV1FyTlRRTU5yQk5RK1BaSGtoSExRb2RaMGdtZlFBRlJvSjlFb1ZIQVZzVFlGWUtaSTVJRndsYkpwV0lYQW1QUlN4YkQwTVZMaHlXQUI0dUFReFVRdzBaRUNCYkFoQVpjVUlEV3hLeFJTa1laV3NEUXlSOUhxSkVEU1ZrSHNaRUZsc0tTYzFiSGl0R0tGd01TU2tIRTlwR0c5TmJCWlI1Z0VJcDBVY05MNGdUS2hvUkJ3Y05WUTFxeEFBSGRFMHV1SkJReG9NQ2dHRWdCQmpod2dUQ0toQWpTcHdJSXdnQUlma0VDUTBBTndBc0FBQUFBQmtBR1FDRkRGNE1oTEtFVElwTXZOcThMSFlzWko1c25NYWMxTzdVSkc0a2RLcDhGR1ljWEpaYzVQcmtsTUtjUElKRXROSzB6T2JNakxxTVZKSlVkS1owck02czVQYmtmS3A4SEdZY0ZHSVVqTGFNeE9MRU5IbzBiS0pzcE1xczNPN2NMSElzWkpwazdQcnNSSUpFZks1OEhHb2NERjRVaExhRVZJNVV2TjY4TEhZMG5NYWtKSElzWEpwa25NS2N0TmEwMU9yVVZKSmNiS0owM1BMYzdQN3NSSVpFZks2RUhHb2s4UC93QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCdFhBbTNCSUxCcVB5S1J5eVR6T0JwM0hhOVkwemtTQWJDcFNZWVlNSU9yTmtDMm5OTWxYd3BaMUNTc09SQm1BUVJraGd0TDhSSnhCWW1VSU1rVXpMakJ6SlFkR0hYb0FIRWdDY3haSEFWa1lYVVVWR0ZrVElpc2hSaFZzQUIxR0dsa2xERGNRSGtlSEFBbEdEMWtyWWtpQUFERkdBMWtYdGtTdE55eWNSaktOYUVZTE1DNXlBQzFIRGxrd1I3TmxKUzlITFdVTlJpRUVjd1hJUkNIUldUR1lReGx6ZE54RkVLTjBOQ0FRUXNhMEFZTkhFQ25yajBJRkFpaUFVbEtoeG9VeUNqQU5yRkxoUVlBRU5ZSlZtVWl4b3NVaFFRQUFPdz09XCIsXHJcbiAgICBpblRlYW06IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCd0FBQUFjQ0FNQUFBQkYweSttQUFBQUJHZEJUVUVBQUsvSU53V0s2UUFBQUJsMFJWaDBVMjltZEhkaGNtVUFRV1J2WW1VZ1NXMWhaMlZTWldGa2VYSEpaVHdBQUFCZ1VFeFVSYUhDcGREbHo1bTJuSjY5b3JMVnM1cTVucGF3bUtuTHEvMy8vZmI4OWFQRnA1U3RsNWUwbXBLeGxxWElxZWp4NXB5N29KN0FvcGE0bVp1Nm42dkdySnk4b0kra2tjTFp3NHV0anQzdDNaKy9vK1AyNFBMNDhhN1FyN2ZWdC8vLy8xRCs2VzBBQUFBZ2RGSk9VLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy84QVhGd2I3UUFBQU9SSlJFRlVlTnJNMHRHU2d5QU1CZENZQ0dwRUY0bWhLNjMyLy85eThhVWp0TE92dS9mMXpHVXlDZkQ4SmZDSEdDMitNc1lTWTllK2NyUVVyeGpuSFJJQTg1elQ3YTNHQytLc0lsNkpGbEJsN2pwN1FiZUlKOHBkU04yZSt3VmE5ZDVUU292aCs1M1RQQmZvalFxYUpLSHBtd1c0UkVFUlZabU8vZ3VJS3pUb2VMdDk4K094QnFpYUkrTEV3N0J2L2VFbzVYY3JkTk90SDRZbXlEbjFHNDVoNjdmZ0tHT3EwRG1jMW1hZHZDb2xnZ0t6NVhKQThaTDNWS1BONml5S0VkSzhqaXRHTk5hZGJYTjJEYmhZbkV5WGxBYzV0OHZNUGxiSHhrdmlQL2g5SC9NandBQjVMMGJDR1FHZzJnQUFBQUJKUlU1RXJrSmdnZz09XCIsXHJcbiAgICBvdXRUZWFtOiBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQndBQUFBY0NBTUFBQUJGMHkrbUFBQUFCR2RCVFVFQUFLL0lOd1dLNlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBUVdSdlltVWdTVzFoWjJWU1pXRmtlWEhKWlR3QUFBQmdVRXhVUmN5Nm83ZUxnOEtxbGJxVWlNV3JtUDc5L2NteW5yMmRqY0tsbE1DaWtzV2pqTG1SaDhDbGtyK2drTDJaamI2ZGo4ekFvdUhXd3Z2NTlidVhpOTNNdXNTbGxzR2Rqc1NubUxKOWZMeWNpOE9qbHNTbWtMdVppN3ljamVMWXd2Ly8vL0FDZUc0QUFBQWdkRkpPVS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vOEFYRndiN1FBQUFPTkpSRUZVZU5yTTB0R09neUFRQlZBRU9qTEtnSllxVUlYKy8xOHViTk5HN0daZmQyL203U1JrNE1JZXY0VDlJWVpPdk5PRkZnTk1FNXRlNmNNUmcyUklxRFhuc2d5ODlJa2pqN3RGMUVwVjVRRGRFYW1ZbEp2V0VxQndpekZhekJrM0wrZGNUejVpRi9lZThpV0RuSytmdUx0a29XaVp4WHZPRzNRbUpWWDBrdjJpemlpTVNaWlZaTDZzZkVKbjRqSi9Id3ZlcXhNS2M3OWQ4ekRrc3BCQzNlQTR1dVdXbDIyQWNpSDhRR0hjU3V2cUFSUmFhckdXWW95bHUxZEl0ajlpRUU2VW5aS3RyMDlXajZHcExKbmVFaEhXYWxRTXA3TEZJZUVmL0w0Zjh5WEFBSzNLUitvZGFDTUlBQUFBQUVsRlRrU3VRbUNDXCIsXHJcbiAgICBvazogXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJ3QUFBQWNDQU1BQUFCRjB5K21BQUFBQkdkQlRVRUFBSy9JTndXSzZRQUFBQmwwUlZoMFUyOW1kSGRoY21VQVFXUnZZbVVnU1cxaFoyVlNaV0ZrZVhISlpUd0FBQUJnVUV4VVJjZlp5WnEybk5uazJyYk10NkMrbytUczVLTEJwWjY4b2FURnFMSFZzcXJGcmFyTXJKcTRucVRCcHBTc2w2WElxWmF3bUtMRHByM1J2dkwxOHM3ZXo1KytwUG42K1p5NW9PM3k3Wi9Bb3YvKy80K2trWnU3b0xUWXRhREFwUC8vLzlnb1h0WUFBQUFnZEZKT1UvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLzhBWEZ3YjdRQUFBT2hKUkVGVWVOck0wdHR1aENBUWdHR1E0YkFncStDZzdvRHMrNzlsc1drYU1VMXYyei9jZlpsa0FyRDNMN0UveER6ejc1NjV4K3lPeDFmSDhZQjh4VHk1QUNvRU01MjVvK1FMOHFtVVZGTU54Z1FWakhQekZWOGxnV29GNDgvNUR1ZFN3Q0pUSGhFam9wdDZIQVh0cS9TU0pOSXVicmd0RE96T1BGazVHTlBqS0JZTndLU2lmZkUzZkhJaE5hZ29QUTBMdHAxN3RPdVdGQTZLdkZpdHVpR1hnNDlyRkJUOWdEYmMwQzVFQ0N1UmlJUWR6ak1mTjJIaE0xK2huenhSZzI0YmE2Z0FyeXRtUG82bFNXcW5wWGp1bnF5OHpybFVhN3Rhby9QdHNmbWwvQTkrMzQ5OUNEQUFNVWxJNk11ZWVMNEFBQUFBU1VWT1JLNUNZSUk9XCIsXHJcbiAgICBib3hPZmY6IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBMEFBQUFOQ0FNQUFBQkZOUlJPQUFBQUJHZEJUVUVBQUsvSU53V0s2UUFBQUJsMFJWaDBVMjltZEhkaGNtVUFRV1J2WW1VZ1NXMWhaMlZTWldGa2VYSEpaVHdBQUFBd1VFeFVSY1hHeUxPNHZlbnA2ZHZjM3RQVzJ1WG01dURoNHRUVjFycTl3YzNSMS9MeTh1M3Q3Y3ZQMWE2enVmVDA5STZQanhkR1BjZ0FBQUJUU1VSQlZIamFaTTdMRHNBZ0NFUlJSTVVIRnYvL2J6dEttNXIwcmppYkNUVFBhTnJYMHVXRjZocW9wVWl2Y0lzOGFnbklQTFlDYmxiVnNsVmpadTI5UjljQzltV0xISlpkQlJ2S3l2Yjc1ZXdXWUFDeEtBZDZ0RkdvTXdBQUFBQkpSVTVFcmtKZ2dnPT1cIixcclxuICAgIGJveE9uOiBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQTBBQUFBTkNBTUFBQUJGTlJST0FBQUFCR2RCVFVFQUFLL0lOd1dLNlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBUVdSdlltVWdTVzFoWjJWU1pXRmtlWEhKWlR3QUFBQXdVRXhVUmJTODBlcnI3UGo1K2RqYTIyZDVwc3JNenMvVTR0L2g1VTVqbVVkZGxjREYwZmIyOXN2UDFhNnp1ZlQwOUk2UGorWS9OSXNBQUFCZVNVUkJWSGphVE01QkRzQWdDQUJCVUN3aUN2Ly9iVkdheHIxTklBVHdPM0RMU2xIYldydTJpUFZvUnRobC9HSVF3dHlzWEkwRTZ0R1lDMk9rS1NaNXFNT255U0pDeGZpb29mY1lhVjVwL0N3M3hGVDhvVmIyUDZHN1Y0QUJBSnJmQnpGbXI4SnlBQUFBQUVsRlRrU3VRbUNDXCIsXHJcbiAgICBzb3J0RG93bjogXCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhCd0FVQUlBQkFBUnJBZi8vL3lINUJBRUFBQUVBTEFBQUFBQUhBQlFBQUFJUWpJK3B5KzBCb2dSd0hwbm8yN3l6QWdBN1wiLFxyXG4gICAgc29ydFVwOiBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEJ3QVVBSUFCQUFSckFmLy8veUg1QkFFQUFBRUFMQUFBQUFBSEFCUUFBQUlRakkrcHkrMElFcGhuMm1EejI3eXJBZ0E3XCIsXHJcbiAgICBzb3J0TnVsbDogXCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhCd0FVQUlBQkFBUnJBZi8vL3lINUJBRUFBQUVBTEFBQUFBQUhBQlFBQUFJVWpJK3B5d1lKNG9rMDBOdmdsWHRLOUdUaWlCUUFPdz09XCIsXHJcbiAgICBmaWx0ZXI6IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCZ0FBQUFZQ0FZQUFBRGdkejM0QUFBQUJHZEJUVUVBQUsvSU53V0s2UUFBQUJsMFJWaDBVMjltZEhkaGNtVUFRV1J2WW1VZ1NXMWhaMlZTWldGa2VYSEpaVHdBQUFaTVNVUkJWRWpIdFpWcFVCTm5HTWVmSkVRTWdpaUlkS0FxQWxhT1dwR1oxcU8yVTFzZHJTSnFSMFZCbEpzUVFFVU9RUkhFS3FBaWFFVEZBeEJFcXkyWGlyZUFndEtpakZpMFJxQ1ltTVNRa0pDRW1CQUU0dlo5RjFodzJuNzB3NU5OTnZ2K2Y4KzlRQkFFZkV3alAvb01mWlM5Sjk2RG9GMEF6YSthSWY5NlBpeUtXd2p1N0ZuZ3ZubVdrM21VcWNnc3lrUXlObXFNWkh6RTJGV3NZR01ZSFdnTTBZWGI0RVhMQ3hESlJLRHQxb0pPcjROK1EvOS9BL0J2ZVdjSHZHeDdDUUtSQU9xZjE4Tlc3aFp3RFhWMnBJY0JRZU1BUVVmR0RHS3NucC95Tlp5dk9ROHRnaFo0L3ZJNUtGUUtVdngvQWZpN1dxODJZeGVFSHE1cXJKcmNMbWtIc1VRTTFRMVZsbXNQcmZHanNjSEFDRWNRTmhDemt0M1M3enk2YmFOVmEwRXBWOEt4RzlsTEUwcmlkL2YxOWtQUHU1NFBBUWJDUUY0VldvWGxFdTdpVytBTHhNdzlNeHBLNm9xLzIzUm1JOWM2eGtyQ2pHQVFSdUUweXBqaGRHSkNsSVVpOWxKMGNuNTFucWZaRmxNTitBTVJWeHliMnRQM2p2bEJEY1J5TWNpVmNnZ3VETXlHRFVBS0FQS1NobElDd2NqUUZYcytFa0ErZy84UEdmZ2ZQNHRUQ0p1QXlLL0ord25yVVFCUnV3aUViNFJRL2JUSzNpM2xpM3FjQWl6QTRBeGVrVGlFampBc3loNEdVcyt4NlliMUo3M09OTDl1TnVPTCtjT0FzemZ5b1FNVlZ0bXBoUEpINVhPTXdoajk5TUZEWkJSSTFIMlBXODNhSTZ0MytoL2JGTG95eS9PQVhjTGtGaHpka0RnR1RrNzRWSWc2YWJSU3JZUVBJdmdoOW50b2s3UkJQeW9RcDRqTmhhQmhjVmFFY1hmbXRjd05JcEVJOHE3bG1TY1ZKVTJ0cUsxZ0NzVkNSbmdSNXlDT2hrRkdpU3lFYnJoWS84dEtyRm41NU80d3dDMWtKc1NjaUFHaFZNaXkyVzR0dzk3Z0F6VGsrZkc3eDd4eE42MDV2anFmenFhUjBaaEdtbXIyWDAvZmdzOEdud3M4UGVRUXZpN2xMcmt1YmhlRHg0Nmx3d0QzU0RjbmwxRG56d055L1AxR1JUSkljUnorTnhuekhoQUdBdGFkOGlwZ2hqR0kwUHpnUkU1T21PZktveXNLY01jVTFoV3NFOGxGNDhkdEhkdEZHeXowSjNGV1N1K005ZlBzQTZZNlU0QnhVV1lpMUFIOUErRU9lb01Bb2JuQjJ5dWZWSnJqb3U4b2pkL0phMzBCM0V0Y2FPRzN3T3kwTDJ1bkpUcndIajk3RERPU1hldXc5emh5c3V1UW9UYnVvQUJvOUdWNFFrZTJJazRGKzFSbzRLSFNEQWNNL3ZuWFBRdkxxa29odS9nbzNIcDRDNVpuZVhCUmZYUlhIbHhtN0w2WTlPT2FqRFcrWGxsclExWWNXWDVtUXJTRkNnRU5Jd0ZkR0lCRktRRHlLQ0RYUDQzM2lqZHF6R2FXM2pmWHA3RHhSU09jS0Q0QnRVMDF0dDhlbUY5NS9tR1JoMFFxZ2FMYjV5d0Rqd1k0SnhYdW10TFExQUE4UHMvU0wzZmpRUW93UHNKOEZUMFF2TjFUM1BZYlJReEhNRDNaOFcrZFRrZFBxMGlOeERsSHFhaGRzSGRCOXR6VXJ5cnZQYjMzV1ZOcjA4VEZtWXZMUm5HTWVzalpRR2RzWTJ4ZUhiNlo1ZGZmTTJKVnNJS01ZVzdLYkhnbWVHWm1IVHRCT1RSRU9JcUk4NXlEdmQyOWNMSXF4OGMrZnVxZkpoeVRqc3VONWN2NEVyN2x2UFE1OTJ5MzIwanRFaWNKSFhiWkNleDNUUkZNU3JDVk9PNXdhRXU3bGhwRkFjQVBvT2hoRVJEdkNVaTV1anVlRmt4N1B6Q2hOSEpxZlUvNzVOUTAxa3k4ZU9zQ0ZONHVOT3A5MXd1cmNqeXZ6azJmWGFmVUtFMDdOUXFXVkNVMWthbGxKbHFkbGxGUWU5WnJOTWRZUlFHaUNyWkNNNzhaRkIyZGNQWit2Z2VhWkFNMS9weUJyakRkek5JNHhUdFY3UzlOWDFyOXBOckNkQXRMRHdGQWJQdHRhd2JXNk5aM2cxNm5oenJlUXlmcmFDczVTcGVPQXZCYWVlUStSeXZYWSt4bU14VmVXa2JoQTIwMzFGbGtFNkNVK1J4Wjc3OHROOHFWV203b1h0YWR6SWkrdm40UWRRcHRYSktkL2hvY1BBVUY0TC9oZzFRdWhmaVN1QlJjVEx5SHNQaWtlQnN4MmRzaEF5OGFYTVNRazhHQng2OW0yMkVvZmZBZW1pT05WQ2xsN2JxY3VCdHYwOEZPN0tRQTZyZGRvTkZxeUYwVVZ4S2JpbXBDZUoveXltMFR0MWxrVmh4YU4zZmZuSnVXMFJhZEVJanFrYnZodEVxbEFzZkVxVzFEcXhxOVNyWHRxbmJUMk9Mb05KeTJ3ZVgzbGdJb3U1U2s2YnAxb05mckllOSs3cXJXMTYzTURua0h2QmFoTlY1ZkRTdjNycGhQUTdXd2lySFV5THZrbGtWL25QUENRQnlCUmJSNXQvcXQybmhuZWNJKzhoNUtrVXZ5OU1mL0F1QW84UHRVcHBDQlFDd0FTWWNFeXU2WGdVZkNNcGdXNURBTmp6OFNVQWNWQmh6QTU1S3ZKQ1V3MlV5WmNZU1JiQWwzMFFVME4vV29JVHBkazF4K2IrSTNPVkNBajJuL0FGV0pwYmx5K1JPWEFBQUFBRWxGVGtTdVFtQ0NcIixcclxuICAgIG1lbWJlckljbzogXCIgZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCZ0FBQUFZQ0FZQUFBRGdkejM0QUFBQUJHZEJUVUVBQUsvSU53V0s2UUFBQUJsMFJWaDBVMjltZEhkaGNtVUFRV1J2WW1VZ1NXMWhaMlZTWldGa2VYSEpaVHdBQUFhSFNVUkJWSGphMUZacmNCUFhGVDY3MmwyOVpRbkp5TEpsU1RZMnRzSEdTckFOR0VOc0lBa1ROOURVNldBYTRrbEtZY3FRRG1rU1RESnRaNXAyMmpJdFNadmhYMm95eWRDUUlTU09xV25OSXpZQkc1dEFMTnVBYkdITDhWdVM5YmEwV3ExV1dtMnYzR2xta3BMcHIvem8vYlAzem4yY2M3NXp2dThzSmdnQ2ZKY0RoKzk0RURhN0hjSjBGT3pPY2FCcEdnRERnQ0FJQUJUWjBmMEhsdysxbmppdS9lTXJyd2ErZWZuOTh4Mnd5bUtCTEpVSzB1azBTTVJpc0UvY2h6ZmZiWVBXQTRmQm9OTUI4WlVsWEFTTEFUOFVXUW9nVDU4RHFWUUt6bDc4QnpLRVFZeGwxOWJ0Mi9QaTJNelVGb1pqcFNWR2svMkpMZlZ0ZW0zMk84WWt4K1BJcWZTM1JmQVZWamkrYk9DaDhnb29NcGtoenJKQUlZKyt1SGUzK1Z4WDUzR2YyMlVHcVF5QUZNSEluYUdhR2VkNDhmWnRPNHFyMTFYK0Z0Mk5Bczh2djBHSVJDQTh5TUR5SXJPSm9FbWh3eUkwZDB4TmJqNSs4c1FKMzl4MFh1M1c3Ziswcmk0N2xSWUUyaFAwN2J6dzZjVkRuZWMvZWFXNnd1cmFVYlBwTFJ3d1ljdzVBWmNIK2tDZWNlUkJTY1pRcUd3aUFUR0dnU1dhRm5mM2ZyWjNjc2lXMTlLeS84ekJwNXYzNmRUcWRxVlVkdG1TYTN5NWFYZlRVYmxTa1c0N2MvcVFOeGl3cE5NQ1JGRU9vN0VZWkNCN2NBUW91YU1UNDlBM05BZzBHMTg1N2hqYktzODFSbXNxck85b2xNcVFTcUdFVkRLRjhNYUVpcUxWSHk5VVdKdjcrcTl2dGp1ZHhTSHQwcFRiNXdlU0VQMTNtV1pnSVFreVV3VWloVlNHUlpsWUJrZHhNQkxSa1RKWkpKM2lQU3ZWT3FpMXJnZFgwQStsNWdJdzZ3MDBSbEZCNE5NdzczWmxjWHdLMEYwUVU1VGtQMUF2R3hEUVV6S3BGQjJhZitMcXJac2RsL3A3eitab3RadWFkelo2TFRrNTk1bEZsMDRrcGlxakRBM3ZYbWlINGNseFVFbWtrRXJ6QnA5cm9SUklFcXpsNWJQbS9QenN6dDZlTjYvWmJsK2E4N2hiRlhLNVBBTTVMcGZJWUc3UjgrUzU3a3QvTGpVWFRxKzJGUGp1T01iK29wWXI5QnVyYXpxNFpFcDg2dXo3dnh4MjN0ODJjSGNFSkJRRm9XZ2svNzIvdDcvdXZIZW5lTWVXaG90MVZkVXpmLzNrdzVNTUczOTQ2MFBWWFZ3eThhUGUyd090WEpJalJZeGNJdW01MmY5U2tka3kvLzF0ang1Q25uWFpaNloyMC9HNDd2RGVaMDlOZUJlcmJsenVxaG1jL3ZKN1VxbThsazF4dTY3ZS92em95SzJCaGp5anlmM3lUMS80K2FMWGk1OCsvL0hQWHRqVDhrT0ZUSG9oQ2NEMkR0bGFoc1pHZXdpdFJwT09zckVFU3FwK3p1MlNSV00wamlwSmxreWxoQUtEMGYvYWdjTUhFb25FSDJ4ajlzY25wcHlOR0NvUmtTQndKYVZyQmgrcHEzL2RsSnQzemVOeFYxSWtoZnNqSVYwa0dsa0loRUpaRkVXbUFNTlRva3Nkblh5eHBYRHBkR2Y3MHdzZWwzVXBGbXRVU0NTeW56VHQrZDFkNTNnWXlVZElMcForWkRJWXIwYlorREJKVUo4MjFHeHFLeWxZZFN4RVJ4d05WUnZoMGRxNjBPak1kR0hYOVo2OXFHb0taMXp6VHpYdDJQbWVUclBpaXVqWWE2L0M1OE5EYytGdzJEWXk0ZGlwa3NxNXV2WFZ4Nlk4cnFrci9YMkExamsyeDJpVlB4TE9SL3dnV0k3alZRcUZDRVZvU0NZNVBFZWpDVVNaT0UvZytNWHVtd05teElYTktKZW5OcFJiMnphc3F3UU1KUXgvcHZYRjUrY1h2YnUwV3ExSVFsQjhNQnlrWlFyRlI1UklKRTR4OFlPMjRVSHJVcHpXcEZFcEk3SUFobVJFSlpFa05EcTlzM0g3WTM4VGl5VzNoeHoyM2NpNGFZVmFUWGk4WHN5WXJSODZzdSs1dDdCZm5IempwUXM5M2ZzRmdud2I1V0VRcWFKNGZVblpsdUVKeDBHdmUxNGU5UWRVcHNLaXVUS3pwWnRKcHR5UldJdzNaYS9VT09kbk40NU4zRjlQVXBSZ01PVDZjblB5cnZpV1FoK2toWFRJa3BPYnl5WFlJMnExeGs4TWpvMGFadjFlZzFLWlZlY0xCRXBJTVVrNDVxYU5rM096QmlWSnBuN2M4dnl2cFJKNUc4Ynp2bGlNNFhoRUtJbGNScXd0WGF0K1p0Y1BIbnY3M0puanN6TlQrU2k2TlRFbTloUVRqeWNSbXlWSWpRMnVZSkFnTmxSWWYxVmZXZFZ4NVZiL0pwTmVyeGRUWW9abWFCMXdDWWpqT09vWG8vVXJOU3NvSkJXTGJJS2pFWGVFQ010STNkN0Y3Q1U2dWk0VWk2M0l3Q1lJdlB6aGtySlpKSVpLamt1NE5wUlZ0TS80dkwwRVlodUxxSDBEeC9BYk9PSjFwbkhzMzkyVXExZHBvZ01qdGdhNzQxN3RjSkt2QnhHZWtkdC9Dd3lTQjlRd1VBL0JlSVZhRTZ5cHFPd3ptU3gvOG9WQzNTU1NDZlRXc2pKbm1FeDhzMEZrcEFONTRkcjdlT056bWl4VkE5TFlldnVYaytVTGZwOGVKVnFCdGpFcEpZNGJ0ZG0rTllXcnhwa0VlNzNVVlBCWklMb1U1cEhNaHpOZDhkdjZ3YlcyMDErejFmemtyaDcwN2ZsZmZmZkk3MzhEYXBsaWVZNEU4bXQ3MlAvOVg4Vy9CQmdBR0RvWmV2QlNZbm9BQUFBQVNVVk9SSzVDWUlJPVwiXHJcbn07IiwiLyoqXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG4gIHZhciB0cztcclxuXHJcbiAgdHMgPSB7XHJcbiAgICBwbGF5ZXI6IHtcclxuICAgICAgaWQ6IFwiaWRcIixcclxuICAgICAgbmFtZTogXCJhXCIsXHJcbiAgICAgIHN0YXR1czogXCJiXCIsXHJcbiAgICAgIGRhdGU6IFwiY1wiLFxyXG4gICAgICBmb3J1bXM6IFwiZFwiXHJcbiAgICB9LFxyXG4gICAgZm9ydW06IHtcclxuICAgICAgaWQ6IFwiaWRcIixcclxuICAgICAgbmFtZTogXCJhXCIsXHJcbiAgICAgIHNpZDogXCJiXCIsXHJcbiAgICAgIHBvc3RzOiBcImNcIixcclxuICAgICAgd29yZHM6IFwiZFwiLFxyXG4gICAgICBwYWdlOiBcImVcIixcclxuICAgICAgdGhlbWVzOiBcImZcIixcclxuICAgICAgbG9nOiBcImdcIlxyXG4gICAgfSxcclxuICAgIHRoZW1lOntcclxuICAgICAgaWQ6IFwiaWRcIixcclxuICAgICAgbmFtZTogXCJhXCIsXHJcbiAgICAgIGF1dGhvcjogXCJiXCIsXHJcbiAgICAgIHBvc3RzOiBcImNcIixcclxuICAgICAgcGFnZXM6IFwiZFwiLFxyXG4gICAgICBzdGFydDogXCJlXCJcclxuICAgIH0sXHJcbiAgICBtZW1iZXI6IHtcclxuICAgICAgaWQ6IFwiaWRcIixcclxuICAgICAgcG9zdHM6IFwiYVwiLFxyXG4gICAgICBsYXN0OiBcImJcIixcclxuICAgICAgc3RhcnQ6IFwiY1wiLFxyXG4gICAgICB3cml0ZTogXCJkXCIsXHJcbiAgICAgIHdvcmRzOiBcImVcIixcclxuICAgICAgd29yZHNBdmVyYWdlOiBcImZcIixcclxuICAgICAgY2FybWE6IFwiZ1wiLFxyXG4gICAgICBjYXJtYUF2ZXJhZ2U6IFwiaFwiLFxyXG4gICAgICBzbjogXCJpXCIsXHJcbiAgICAgIGVudGVyOiBcImpcIixcclxuICAgICAgZXhpdDogXCJrXCIsXHJcbiAgICAgIGtpY2s6IFwibFwiLFxyXG4gICAgICBpbnZpdGU6IFwibVwiXHJcbiAgICB9LFxyXG4gICAgdGltZXN0YW1wOiB7XHJcbiAgICAgIGlkOiBcImlkXCIsXHJcbiAgICAgIHRpbWU6IFwiYVwiLFxyXG4gICAgICBkYXRhOiBcImJcIlxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG1ha2VUUygpO1xyXG5cclxuICByZXR1cm4gdHM7XHJcblxyXG4gIGZ1bmN0aW9uIG1ha2VUUygpe1xyXG4gICAgT2JqZWN0LmtleXModHMpLmZvckVhY2goZnVuY3Rpb24odCl7XHJcbiAgICAgIE9iamVjdC5rZXlzKHRzW3RdKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICAgdHNbdF1bdHNbdF1ba2V5XV0gPSBrZXk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuIiwicmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvcHJvdG90eXBlcycpKCk7XHJcbnZhciAkID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvZG9tJyk7XHJcbnZhciBkYiA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbGliL2lkYicpO1xyXG52YXIgYmluZEV2ZW50ID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvZXZlbnRzJyk7XHJcbnZhciBhamF4ID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvcmVxdWVzdCcpO1xyXG52YXIgY3JlYXRlVGFibGUgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2xpYi90YWJsZScpO1xyXG5cclxuXHJcbmNvbnN0ICRjID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvY29tbW9uJykoKTtcclxuY29uc3QgJHRzID0gcmVxdWlyZSgnLi8uLi9zcmMvc3RydWN0dXJlJykoKTtcclxuY29uc3QgJGljbyA9IHJlcXVpcmUoJy4vLi4vc3JjL2ljb25zJyk7XHJcblxyXG5cclxudmFyICRuYW1lU2NyaXB0ID0gXCJTdGF0cyBmb3J1bXMgW0dXXVwiO1xyXG52YXIgJG1vZGUgPSB0cnVlO1xyXG52YXIgJHNkLCAkY2QsICRzcywgJHRzZCwgJGFuc3dlciwgJHNjcmVlbldpZHRoLCAkc2NyZWVuSGVpZ2h0LCAkZGF0ZSwgJGNoZWNrZWQsICR0O1xyXG5cclxudmFyICRpZGIsICRmb3J1bTtcclxuXHJcbmNvbnN0ICRzdGF0dXNTdHlsZSA9IHtcclxuICBcIk9rXCI6IFwiXCIsXHJcbiAgXCLQotC+0YDQs9C+0LLRi9C5XCI6IFwiZm9udC13ZWlnaHQ6IGJvbGQ7XCIsXHJcbiAgXCLQkNGA0LXRgdGC0L7QstCw0L1cIjogXCJjb2xvcjogYmx1ZTtcIixcclxuICBcItCk0L7RgNGD0LzQvdGL0LlcIjogXCJjb2xvcjogcmVkO1wiLFxyXG4gIFwi0J7QsdGJ0LjQuSDQsdCw0L1cIjogXCJjb2xvcjogZ3JlZW47IGZvbnQtd2VpZ2h0OiBib2xkO1wiLFxyXG4gIFwi0JfQsNCx0LvQvtC60LjRgNC+0LLQsNC9XCI6IFwiY29sb3I6IHJlZDsgZm9udC13ZWlnaHQ6IGJvbGQ7XCJcclxufTtcclxuXHJcbiRjaGVja2VkID0ge1xyXG4gIHRoZW1lczoge30sXHJcbiAgcGxheWVyczoge31cclxufTtcclxuXHJcbiRzY3JlZW5XaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiRzY3JlZW5IZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcclxuXHJcbiRhbnN3ZXIgPSAkKCc8c3Bhbj4nKS5ub2RlKCk7XHJcbiRkYXRlID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwLCAxMCk7XHJcblxyXG4kc2QgPSB7XHJcbiAgZm9ydW1zOiB7fSxcclxuICBwbGF5ZXJzOiB7fSxcclxuICBraWNrZWQ6IHt9LFxyXG4gIGludml0ZToge31cclxufTtcclxuXHJcbiRzcyA9IHtcclxuICBzb3J0OiB7XHJcbiAgICBzdGF0czoge1xyXG4gICAgICB0eXBlOiAxLFxyXG4gICAgICBjZWxsOiAnbmFtZSdcclxuICAgIH0sXHJcbiAgICB0aGVtZXM6IHtcclxuICAgICAgdHlwZTogMSxcclxuICAgICAgY2VsbDogJ2lkJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2hvdzp7XHJcbiAgICBzdGF0czp7fSxcclxuICAgIHRoZW1lczp7fVxyXG4gIH1cclxufTtcclxuXHJcbiRjZCA9IHtcclxuICBmaWQ6IDAsXHJcbiAgZk5hbWU6IFwiXCIsXHJcbiAgdGlkOiAwLFxyXG4gIHROYW1lOiBcIlwiLFxyXG4gIGZQYWdlOiAyNyxcclxuICB0UGFnZTogMCxcclxuICBsUGFnZTogMCxcclxuICBmOiBudWxsLFxyXG4gIHNpZDogbnVsbCxcclxuICBuYW1lVG9JZDoge30sXHJcbiAgbWVtYmVyczogW10sXHJcbiAgY291bnRNZW1iZXJzOiAwLFxyXG4gIHZhbHVlczp7XHJcbiAgICBzdGF0czp7XHJcbiAgICAgIGlkOiBbJ0lEJywgLTEsIC0xXSxcclxuICAgICAgc3RhcnQ6IFsn0KLQtdC8INC90LDRh9Cw0YLQvicsIC0xLCAtMV0sXHJcbiAgICAgIHdyaXRlOiBbJ9Cj0YfQsNGB0YLQstC+0LLQsNC7JywgLTEsIC0xXSxcclxuICAgICAgZGF0ZTogWyfQn9C+0YHQu9C10LTQvdC10LUg0YHQvtC+0LHRidC10L3QuNC1JywgLTEsIC0xXSxcclxuICAgICAgcG9zdHM6IFsn0KHQvtC+0LHRidC10L3QuNC5JywgLTEsIC0xXSxcclxuICAgICAgYXZlcmFnZVdvcmRzOiBbJ9Ch0YDQtdC00L3QtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INGB0LvQvtCyJywgLTEsIC0xXSxcclxuICAgICAgd29yZHM6IFsn0JrQvtC70LjRh9C10YHRgtCy0L4g0YHQu9C+0LInLCAtMSwgLTFdLFxyXG4gICAgICBwU3RhcnQ6IFsn0J/RgNC+0YbQtdC90YIg0L3QsNGH0LDRgtGL0YUg0YLQtdC8JywgLTEsIC0xXSxcclxuICAgICAgcFdyaXRlOiBbJ9Cf0YDQvtGG0LXQvdGCINGD0YfQsNGB0YLQuNGPJywgLTEsIC0xXSxcclxuICAgICAgcFBvc3RzOiBbJ9Cf0YDQvtGG0LXQvdGCINGB0L7QvtCx0YnQtdC90LjQuScsIC0xLCAtMV0sXHJcbiAgICAgIHBXb3JkczogWyfQn9GA0L7RhtC10L3RgiDRgdC70L7QsicsIC0xLCAtMV0sXHJcbiAgICAgIHN0YXR1czogWyfQodGC0LDRgtGD0YEnLCAtMSwgLTFdLFxyXG4gICAgICBlbnRlcjogWyfQn9GA0LjQvdGP0YInLCAtMSwgLTFdLFxyXG4gICAgICBleGl0OiBbJ9Cf0L7QutC40L3Rg9C7JywgLTEsIC0xXSxcclxuICAgICAgZ29Bd2F5OiBbJ9CY0LfQs9C90LDQvScsIC0xLCAtMV0sXHJcbiAgICAgIG1lbWJlcjogWyfQkiDRgdC+0YHRgtCw0LLQtScsIC0xLCAtMV1cclxuICAgIH0sXHJcbiAgICB0aGVtZXM6e1xyXG4gICAgICBpZDogJycsXHJcbiAgICAgIGRhdGU6ICcnLFxyXG4gICAgICBwb3N0czogJycsXHJcbiAgICAgIHBvc3RzQWxsOiAnJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2hvd1Byb2dyZXNzVGltZTogZmFsc2UsXHJcbiAgdGltZVJlcXVlc3Q6IDAsXHJcbiAgc3RhdHNDb3VudDogMCxcclxuICB0aGVtZXNDb3VudDogMFxyXG59O1xyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuYWRkU3R5bGUoKTtcclxuY3JlYXRlU3RhdEdVSUJ1dHRvbigpO1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlKCl7XHJcbiAgdmFyIGNzcywgY29kZTtcclxuXHJcbiAgY29kZSA9IGB0YWJsZVt0eXBlPVwicGFkZGluZ1wiXSB0ZCB7XHJcbiAgICBwYWRkaW5nOiAycHggNXB4IDJweCA1cHg7XHJcbn1cclxudHJbdHlwZT1cImxpZ2h0XCJdIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNkOGU4ZDg7XHJcbn1cclxudHJbdHlwZT1cImxpZ2h0Q2hlY2tlZFwiXSB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzdkZmM3O1xyXG59XHJcbnRyW3R5cGVePVwibGlnaHRcIl06aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2JlY2NiZTtcclxufVxyXG50clt0eXBlPVwiaGVhZGVyXCJdIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNkMGVlZDA7IGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcbiNzZl9oZWFkZXJfU0kgaW1nLCAjc2ZfaGVhZGVyX1RMIGltZ3tcclxuICAgIGZsb2F0OiByaWdodDtcclxufVxyXG50ZFtzb3J0XSwgdGRbZmlsdGVyXXtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG50ZFtzb3J0XTpob3ZlciwgdGRbZmlsdGVyXTpob3ZlcntcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNjYWUxY2E7XHJcbn1cclxuLnNmX2xlZnQge1xyXG4gICAgcGFkZGluZy1sZWZ0OiA1cHg7XHJcbn1cclxuI3NmX1NUSSB7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG59XHJcbiNzZl9zaGFkb3dMYXllcntcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHdpZHRoOiAwO1xyXG4gICAgaGVpZ2h0OiAwO1xyXG4gICAgei1pbmRleDogMTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgb3BhY2l0eTogMC43O1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5kaXZbdHlwZT1cIndpbmRvd1wiXXtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIC1tb3otYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO1xyXG4gICAgei1pbmRleDogMjtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbmlucHV0W3R5cGU9XCJidXR0b25cIl17XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgZm9udC1mYW1pbHk6IFZlcmRhbmE7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjA4LDIzOCwyMDgpO1xyXG4gICAgZm9udC1zaXplOiAxMHB4O1xyXG4gICAgaGVpZ2h0OiAyMHB4O1xyXG59XHJcbmlucHV0W3R5cGU9XCJ0ZXh0XCJdW2NsYXNzPVwic2ZfaGlkZUlucHV0XCJde1xyXG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgIGZvbnQtZmFtaWx5OiBWZXJkYW5hO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2YwZmZmMDtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xyXG59XHJcbmlucHV0W3R5cGU9XCJjaGVja2JveFwiXVtuYW1lPVwic2ZfbWVtYmVyc0xpc3RcIl0sW25hbWU9XCJzZl90aGVtZXNMaXN0XCJde1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5kaXZbY2xhc3NePVwic2ZfY291bnRcIl17XHJcbiAgICBib3JkZXI6IHNvbGlkIDFweCAjMDAwMDAwO1xyXG4gICAgd2lkdGg6IDEwMHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDI0cHg7XHJcbiAgICBmbG9hdDogbGVmdDtcclxuICAgIGhlaWdodDogMjRweDtcclxufVxyXG5kaXZbY2xhc3M9XCJzZl9jb3VudCBkaXNhYmxlZFwiXXtcclxuICAgIGJvcmRlcjogc29saWQgMXB4ICNDMGMwYzA7XHJcbiAgICBjb2xvcjogI2MwYzBjMDtcclxufVxyXG5kaXZbY2xhc3M9XCJzZl9zcGFjZVwiXXtcclxuICAgIGJvcmRlcjogbm9uZTtcclxuICAgIHdpZHRoOiAxNXB4O1xyXG4gICAgaGVpZ2h0OiAyNHB4O1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbn1cclxuaW5wdXRbdHlwZT1cInRleHRcIl1bY2xhc3M9XCJzZl9jb3VudCBkaXNhYmxlZFwiXXtcclxuICAgIGNvbG9yOiAjYzBjMGMwO1xyXG4gICAgd2lkdGg6IDY1cHg7XHJcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XHJcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIG1hcmdpbjogMDtcclxufVxyXG5pbnB1dFt0eXBlPVwidGV4dFwiXVtjbGFzcz1cInNmX2NvdW50IGVuYWJsZWRcIl17XHJcbiAgICB3aWR0aDogNjVweDtcclxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcclxuICAgIGJhY2tncm91bmQ6IG5vbmU7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgbWFyZ2luOiAwO1xyXG59XHJcbiNzZl9jYWxlbmRhcntcclxuICAgIGxlZnQ6IDA7XHJcbiAgICB0b3A6IDA7XHJcbn1cclxuI3NmX2NhbGVuZGFyIHRke1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgaGVpZ2h0OiAyMHB4O1xyXG4gICAgYm9yZGVyOiBzb2xpZCAxcHggIzMzOTkzMztcclxuICAgIHBhZGRpbmc6IDVweDtcclxufVxyXG4jc2ZfY2FsZW5kYXIgdGRbdHlwZT1cImRheVwiXTpob3ZlciwgI3NmX2NhbGVuZGFyIHRkW3R5cGU9XCJjb250cm9sXCJdOmhvdmVye1xyXG4gICAgYmFja2dyb3VuZDogI0Q4RThEODtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5zcGFuW3R5cGU9XCJjYWxlbmRhckNhbGxcIl17XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuZGl2W3R5cGVePVwibXVsdGlwbGVTZWxlY3RcIl17XHJcbiAgICBiYWNrZ3JvdW5kOiAjZjBmZmYwO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgaGVpZ2h0OiAyNHB4O1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG59XHJcbmRpdlt0eXBlPVwibXVsdGlwbGVTZWxlY3QgZW5hYmxlZFwiXTpob3ZlcntcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIG92ZXJmbG93LXk6IHZpc2libGU7XHJcbiAgICBoZWlnaHQ6IDE3NHB4O1xyXG4gICAgYm9yZGVyOiBzb2xpZCAxcHggIzAwMDAwMDtcclxuICAgIG1hcmdpbi1sZWZ0OiAtMXB4O1xyXG4gICAgbWFyZ2luLXRvcDogLTFweDtcclxufVxyXG5kaXZbdHlwZV49XCJvcHRpb25cIl17XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDEwcHg7XHJcbiAgICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xyXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgIGJvcmRlci10b3A6IGRvdHRlZCAxcHggI2MwYzBjMDtcclxufVxyXG5kaXZbdHlwZT1cIm9wdGlvbiBzZWxlY3RlZFwiXXtcclxuICAgIGJhY2tncm91bmQ6ICNjM2U1YzM7XHJcbn1cclxuZGl2W3R5cGVePVwib3B0aW9uXCJdOmhvdmVye1xyXG4gICAgYmFja2dyb3VuZDogI2Q5ZWNkOTtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5zcGFuW2lkXj1cInNmX2JDaGVja0FsbFwiXXtcclxuICAgIGZsb2F0OiByaWdodDtcclxuICAgIG1hcmdpbi1yaWdodDogNXB4O1xyXG4gICAgZm9udC1zaXplOiA5cHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1gO1xyXG4gIGNvZGUgKz1cclxuICAgIGBcclxuICAgIHRkW3NvcnQ9XCJtZW1iZXJcIl17XHJcbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCgkeyRpY28ubWVtYmVySWNvfSk7XHJcbiAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xyXG4gICAgICBiYWNrZ3JvdW5kLXJlcGVhdDpuby1yZXBlYXQ7XHJcbiAgICB9XHJcbiAgICAjc2Zfc3RhdHVzV2luZG93e1xyXG4gICAgICBsZWZ0OiAkeyRzY3JlZW5XaWR0aCAvIDIgLSAzMjV9O1xyXG4gICAgICB0b3A6ICR7JHNjcmVlbkhlaWdodCAvIDIgLSAxMjB9O1xyXG4gICAgfVxyXG4gICAgI3NmX2NvbnRyb2xQYW5lbFdpbmRvd3tcclxuICAgICAgICBsZWZ0OiAkeyRzY3JlZW5XaWR0aCAvIDIgLSAxNzV9O1xyXG4gICAgICAgIHRvcDogJHskc2NyZWVuSGVpZ2h0IC8gMiAtIDI2MH07XHJcbiAgICB9XHJcbiAgICAjc2ZfZmlsdGVyc1dpbmRvd3tcclxuICAgICAgICBsZWZ0OiAkeyRzY3JlZW5XaWR0aCAvIDIgLSAyNTB9O1xyXG4gICAgICAgIHRvcDogJHskc2NyZWVuSGVpZ2h0IC8gMiAtIDM2M307XHJcbiAgICB9XHJcbiAgICAjc2ZfbWVzc2FnZVdpbmRvd3tcclxuICAgICAgICBsZWZ0OiAkeyRzY3JlZW5XaWR0aCAvIDIgLSAzNzB9O1xyXG4gICAgICAgIHRvcDogJHskc2NyZWVuSGVpZ2h0IC8gMiAtIDIyMn07XHJcbiAgICB9YDtcclxuICBjc3MgPSAkKFwic3R5bGVcIikuaHRtbChjb2RlKS5ub2RlKCk7XHJcbiAgY3NzLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0L2Nzc1wiKTtcclxuICBjc3Muc2V0QXR0cmlidXRlKFwic2NyaXB0XCIsIFwidHJ1ZVwiKTtcclxuXHJcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjc3MpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTdGF0R1VJQnV0dG9uKCl7XHJcbiAgdmFyIGZpZCwgbmFtZSwgbmF2aWdhdGUsIGJ1dHRvbjtcclxuXHJcbiAgZmlkID0gbG9jYXRpb24uc2VhcmNoLm1hdGNoKC8oXFxkKykvKTtcclxuICBmaWQgPSBOdW1iZXIoZmlkWzFdKTtcclxuXHJcbiAgbmF2aWdhdGUgPSAkKCdhW3N0eWxlPVwiY29sb3I6ICM5OTAwMDBcIl06Y29udGFpbnMoXCJ+0KTQvtGA0YPQvNGLXCIpJykudXAoJ2InKTtcclxuICBuYW1lID0gbmF2aWdhdGUudGV4dCgpLm1hdGNoKC8oLispIMK7ICguKykvKVsyXTtcclxuXHJcbiAgYnV0dG9uID0gJCgnPHNwYW4+JykuaHRtbChgIDo6IDxzcGFuIGlkPVwic2ZfYnV0dG9uU3RhdHNcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjtcIj5cclxuICAgINCh0YLQsNGC0LjRgdGC0LjQutCwXHJcbjwvc3Bhbj5gKS5ub2RlKCk7XHJcbiAgbmF2aWdhdGUubm9kZSgpLmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcblxyXG4gICRjZC5maWQgPSBmaWQ7XHJcbiAgJGNkLmZOYW1lID0gbmFtZTtcclxuXHJcbiAgaWYoZmlkID4gMTAwKXtcclxuICAgICRjZC5zaWQgPSBmaWQudG9TdHJpbmcoKTtcclxuICAgICRjZC5zaWQgPSBOdW1iZXIoJGNkLnNpZC5zbGljZSgxLCAkY2Quc2lkLmxlbmd0aCkpO1xyXG4gIH1lbHNle1xyXG4gICAgJG1vZGUgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudChidXR0b24sICdvbmNsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgIG1ha2VDb25uZWN0KFwiZ2tfU3RhdHNGb3J1bVwiLCB0cnVlKVxyXG4gIH0pO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5hc3luYyBmdW5jdGlvbiBtYWtlQ29ubmVjdChuYW1lLCBmaXJzdCl7XHJcbiAgdmFyIGluaTtcclxuXHJcbiAgaW5pID0gW1xyXG4gICAge25hbWU6IFwicGxheWVyc1wiLCBrZXk6IFwiaWRcIiwgaW5kZXg6IFtbXCJuYW1lXCIsIFwiYVwiLCB0cnVlXV19LFxyXG4gICAge25hbWU6IFwiZm9ydW1zXCIsIGtleTogXCJpZFwifVxyXG4gIF07XHJcblxyXG4gIGlmKGZpcnN0KXtcclxuICAgICRpZGIgPSBhd2FpdCBkYihuYW1lKTtcclxuICAgICRpZGIuc2V0SW5pVGFibGVMaXN0KGluaSk7XHJcbiAgfVxyXG4gICRpZGIgPSBhd2FpdCAkaWRiLmNvbm5lY3REQigpO1xyXG4gIC8vJGlkYi5kZWxldGVEQigpO1xyXG5cclxuICBjb25zb2xlLmxvZygkaWRiKTtcclxuICBhZGRUb0RCKCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVBsYXllcnMoaWQpe1xyXG4gIHJldHVybiB7XHJcbiAgICBpZDogaWQsXHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgc3RhdHVzOiBcIlwiLFxyXG4gICAgZGF0ZTogMCxcclxuICAgIGZvcnVtczogW11cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlTWVtYmVycyhpZCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiBpZCxcclxuICAgIHBvc3RzOiAwLFxyXG4gICAgbGFzdDogMCxcclxuICAgIHN0YXJ0OiBbXSxcclxuICAgIHdyaXRlOiBbXSxcclxuICAgIHdvcmRzOiAwLFxyXG4gICAgd29yZHNBdmVyYWdlOiAwLFxyXG4gICAgY2FybWE6IDAsXHJcbiAgICBjYXJtYUF2ZXJhZ2U6IDAsXHJcbiAgICBzbjogMCxcclxuICAgIGVudGVyOiAwLFxyXG4gICAgZXhpdDogMCxcclxuICAgIGtpY2s6IDAsXHJcbiAgICBpbnZpdGU6IDBcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlRm9ydW1zKGlkKXtcclxuICByZXR1cm4ge1xyXG4gICAgaWQ6IGlkLFxyXG4gICAgbmFtZTogXCJcIixcclxuICAgIHNpZDogMCxcclxuICAgIHBvc3RzOiAwLFxyXG4gICAgd29yZHM6IDAsXHJcbiAgICBwYWdlOiBbMCwgMF0sXHJcbiAgICB0aGVtZXM6IFswLCAwXSxcclxuICAgIGxvZzogWzAsIDBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVRoZW1lcyhpZCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiBpZCxcclxuICAgIG5hbWU6IFwiXCIsXHJcbiAgICBhdXRob3I6IFswLCBcIlwiXSxcclxuICAgIHBvc3RzOiBbMCwgMF0sXHJcbiAgICBwYWdlczogWzAsIDBdLFxyXG4gICAgc3RhcnQ6IDBcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlVGltZXN0YW1wcyhpZCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiBpZCxcclxuICAgIHRpbWU6IFtdLFxyXG4gICAgZGF0YTogW11cclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGFkZFRvREIoKXtcclxuICB2YXIgZm9ydW07XHJcblxyXG4gIGlmKCEkaWRiLmV4aXN0KGB0aGVtZXNfJHskY2QuZmlkfWApKXtcclxuICAgIGZvcnVtID0gZ2VuZXJhdGVGb3J1bXMoJGNkLmZpZCk7XHJcbiAgICBmb3J1bS5uYW1lID0gJGNkLmZOYW1lO1xyXG4gICAgZm9ydW0uc2lkID0gJGNkLnNpZDtcclxuICAgIGZvcnVtID0gcmVwYWNrKGZvcnVtLCBcImZvcnVtXCIpO1xyXG5cclxuICAgICRpZGIuYWRkKFwiZm9ydW1zXCIsIGZvcnVtKTtcclxuICAgICRpZGIuc2V0TW9kaWZ5aW5nVGFibGVMaXN0KFtcclxuICAgICAge25hbWU6IGB0aGVtZXNfJHskY2QuZmlkfWAsIGtleTogXCJpZFwifSxcclxuICAgICAge25hbWU6IGBtZW1iZXJzXyR7JGNkLmZpZH1gLCBrZXk6IFwiaWRcIn0sXHJcbiAgICAgIHtuYW1lOiBgdGltZXN0YW1wXyR7JGNkLmZpZH1gLCBrZXk6IFwiaWRcIn1cclxuICAgIF0pO1xyXG4gICAgJGlkYi5kYi5jbG9zZSgpO1xyXG4gICAgJGlkYi5uZXh0VmVyc2lvbigpO1xyXG4gICAgbWFrZUNvbm5lY3QoXCJna19TdGF0c0ZvcnVtXCIsIGZhbHNlKTtcclxuICB9ZWxzZXtcclxuICAgIGxvYWRGcm9tTG9jYWxTdG9yYWdlKCdzZXR0aW5ncycpO1xyXG5cclxuICAgICR0ID0ge1xyXG4gICAgICBzdGF0czogY3JlYXRlVGFibGUoW1wiI3NmX2hlYWRlcl9TSVwiLCBcIiNzZl9jb250ZW50X1NJXCIsIFwiI3NmX2Zvb3Rlcl9TSVwiXSwgXCJzdGF0c1wiLCAkc3MpLFxyXG4gICAgICB0aGVtZXM6IGNyZWF0ZVRhYmxlKFtcIiNzZl9oZWFkZXJfVExcIiwgXCIjc2ZfY29udGVudF9UTFwiLCBcIiNzZl9mb290ZXJfVExcIl0sIFwidGhlbWVzXCIsICRzcylcclxuICAgIH07XHJcblxyXG4gICAgJGZvcnVtID0gYXdhaXQgJGlkYi5nZXRPbmUoXCJmb3J1bXNcIiwgXCJpZFwiLCAkY2QuZmlkKTtcclxuICAgICRmb3J1bSA9IHJlcGFjaygkZm9ydW0sIFwiZm9ydW1cIik7XHJcblxyXG4gICAgY3JlYXRlR1VJKCk7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVHVUkoKXtcclxuICB2YXIgdGFibGUsIHRkLCBndWksIGNhbGVuZGFyO1xyXG5cclxuICB0YWJsZSA9ICQoJ3RkW3N0eWxlPVwiY29sb3I6ICM5OTAwMDBcIl06Y29udGFpbnMoXCLQotC10LzQsFwiKScpLnVwKCd0YWJsZScpLnVwKCd0YWJsZScpLm5vZGUoKTtcclxuICB0ZCA9IHRhYmxlLnJvd3NbMF0uY2VsbHNbMF07XHJcblxyXG4gIGd1aSA9ICQoJzx0ZD4nKS5odG1sKGA8Yj48YSBzdHlsZT1cImNvbG9yOiAjOTkwMDAwXCIgaHJlZj1cImh0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L2ZvcnVtLnBocFwiPtCk0L7RgNGD0LzRizwvYT4gwrsgJHskY2QuZk5hbWV9PC9iPlxyXG46OiA8c3BhbiBpZD1cInNmX2d1aV9zZXR0aW5nc1wiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyOyBmb250LXdlaWdodDogYm9sZDtcIj7Qn9Cw0L3QtdC70Ywg0YPQv9GA0LDQstC70LXQvdC40Y88L3NwYW4+XHJcbuKWoSA8c3BhbiBpZD1cInNmX2d1aV9maWx0ZXJzXCIgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7IGZvbnQtd2VpZ2h0OiBib2xkO1wiPtCk0LjQu9GM0YLRgNGLPC9zcGFuPlxyXG7ilqEgPHNwYW4gaWQ9XCJzZl9ndWlfbWVzc2FnZVwiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyOyBmb250LXdlaWdodDogYm9sZDtcIj7QoNCw0YHRgdGL0LvQutCwINC/0L7Rh9GC0Ys8L3NwYW4+XHJcbjxicj5cclxuPHRhYmxlIHdpZHRoPVwiOTclXCIgY2VsbHNwYWNpbmc9XCIwXCIgY2VsbHBhZGRpbmc9XCIwXCIgc3R5bGU9XCJib3JkZXItc3R5bGU6IG5vbmU7IGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XCIgYWxpZ249XCJjZW50ZXJcIj5cclxuICAgIDx0cj48dGQgY2xhc3M9XCJzZl9sZWZ0XCIgaWQ9XCJzZl9oZWFkZXJfU0lcIiB2YWxpZ249XCJ0b3BcIiBjb2xzcGFuPVwiMlwiPjwvdGQ+PC90cj5cclxuICAgIDx0cj48dGQgY2xhc3M9XCJzZl9sZWZ0XCIgaWQ9XCJzZl9jb250ZW50X1NJXCIgdmFsaWduPVwidG9wXCIgY29sc3Bhbj1cIjJcIj48L3RkPjwvdHI+XHJcbiAgICA8dHI+PHRkIGNsYXNzPVwic2ZfbGVmdFwiIGlkPVwic2ZfZm9vdGVyX1NJXCIgdmFsaWduPVwidG9wXCIgY29sc3Bhbj1cIjJcIj48L3RkPjwvdHI+XHJcbiAgICA8dHI+PHRkIGNsYXNzPVwic2ZfbGVmdFwiIGFsaWduPVwiY2VudGVyXCIgaWQ9XCJzZl9oZWFkZXJfVExcIiB3aWR0aD1cIjEyNTBcIj48L3RkPjx0ZCBjbGFzcz1cInNmX2xlZnRcIiB2YWxpZ249XCJ0b3BcIiBhbGlnbj1cImNlbnRlclwiIGlkPVwic2ZfaGVhZGVyX1NUSVwiPjwvdGQ+PC90cj5cclxuICAgIDx0cj48dGQgY2xhc3M9XCJzZl9sZWZ0XCIgYWxpZ249XCJjZW50ZXJcIiBpZD1cInNmX2NvbnRlbnRfVExcIiB3aWR0aD1cIjEyNTBcIj48L3RkPjx0ZCBjbGFzcz1cInNmX2xlZnRcIiB2YWxpZ249XCJ0b3BcIiBhbGlnbj1cImNlbnRlclwiIGlkPVwic2ZfY29udGVudF9TVElcIiByb3dzcGFuPVwiMlwiPjwvdGQ+PC90cj5cclxuICAgIDx0cj48dGQgY2xhc3M9XCJzZl9sZWZ0XCIgYWxpZ249XCJjZW50ZXJcIiBpZD1cInNmX2Zvb3Rlcl9UTFwiPjwvdGQ+PC90cj5cclxuPC90YWJsZT5cclxuPGRpdiBpZD1cInNmX3NoYWRvd0xheWVyXCIgdGl0bGU9XCLQmtC70LjQuiDQt9Cw0LrRgNC+0LXRgiDQvtC60L3QvlwiPjwvZGl2PlxyXG48ZGl2IHR5cGU9XCJ3aW5kb3dcIiBpZD1cInNmX3N0YXR1c1dpbmRvd1wiPiR7Y3JlYXRlU3RhdHVzV2luZG93KCl9PC9kaXY+XHJcbjxkaXYgdHlwZT1cIndpbmRvd1wiIGlkPVwic2ZfY29udHJvbFBhbmVsV2luZG93XCI+JHtjcmVhdGVDb250cm9sUGFuZWwoKX08L2Rpdj5cclxuPGRpdiB0eXBlPVwid2luZG93XCIgaWQ9XCJzZl9maWx0ZXJzV2luZG93XCI+PC9kaXY+XHJcbjxkaXYgdHlwZT1cIndpbmRvd1wiIGlkPVwic2ZfbWVzc2FnZVdpbmRvd1wiPiR7Y3JlYXRlTWVzc2FnZVdpbmRvdygpfTwvZGl2PlxyXG48ZGl2IHR5cGU9XCJ3aW5kb3dcIiBpZD1cInNmX2NhbGVuZGFyXCI+PC9kaXY+YCkubm9kZSgpO1xyXG5cclxuICB0ZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRkKTtcclxuICB0YWJsZS5yb3dzWzBdLmFwcGVuZENoaWxkKGd1aSk7XHJcblxyXG4gIHJlbmRlckJhc2VIVE1MKCk7XHJcbiAgLy9yZW5kZXJTdGF0c1RhYmxlKCk7XHJcbiAgLy9yZW5kZXJUaGVtZXNUYWJsZSgpO1xyXG4gIGNyZWF0ZVNoYWRvd0xheWVyKCk7XHJcblxyXG4gIGJpbmRFdmVudCgkKCcjc2ZfZ3VpX3NldHRpbmdzJykubm9kZSgpLCAnb25jbGljaycsIG9wZW5Db250cm9sUGFuZWxXaW5kb3cpO1xyXG4gIC8vYmluZEV2ZW50KCQoJyNzZl9ndWlfbWVzc2FnZScpLm5vZGUoKSwgJ29uY2xpY2snLCBvcGVuTWVzc2FnZVdpbmRvdyk7XHJcbiAgLy9iaW5kRXZlbnQoJCgnI3NmX2ZvcmdldEZvcnVtJykubm9kZSgpLCAnb25jbGljaycsIGZvcmdldEZvcnVtKTtcclxuXHJcblxyXG4gICQoJyNzZl9jb250cm9sUGFuZWxXaW5kb3cnKVxyXG4gICAgLmZpbmQoJ2lucHV0W3R5cGU9XCJidXR0b25cIl0nKVxyXG4gICAgLm5vZGVBcnIoKVxyXG4gICAgLmZvckVhY2goXHJcbiAgICAgIGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIGJpbmRFdmVudChub2RlLCAnb25jbGljaycsIGZ1bmN0aW9uKCl7cHJlcGFyZURvVGFzayhub2RlKX0pO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAvL2JpbmRFdmVudCgkKCcjc2Zfc2VuZE1lc3NhZ2VzJykubm9kZSgpLCAnb25jbGljaycsIHByZXBhcmVTZW5kTWFpbHMpO1xyXG5cclxuICBjYWxlbmRhciA9ICQoJ3NwYW5bdHlwZT1cImNhbGVuZGFyQ2FsbFwiXScpLm5vZGUoKTtcclxuICBiaW5kRXZlbnQoY2FsZW5kYXIsICdvbmNsaWNrJywgZnVuY3Rpb24oKXtyZW5kZXJDYWxlbmRhcihjYWxlbmRhcil9KTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyQ2FsZW5kYXIobm9kZVRleHREYXRlKXtcclxuICB2YXIgc2l6ZSwgbGVmdCwgdG9wLCBjYWxlbmRhciwgZGF0ZTtcclxuXHJcbiAgY2FsZW5kYXIgPSAkKCcjc2ZfY2FsZW5kYXInKS5ub2RlKCk7XHJcblxyXG4gIGlmKGNhbGVuZGFyLnN0eWxlLmRpc3BsYXkgPT0gXCJibG9ja1wiKXtcclxuICAgIGNhbGVuZGFyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGlmKG5vZGVUZXh0RGF0ZS5uZXh0RWxlbWVudFNpYmxpbmcuZGlzYWJsZWQpe1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgc2l6ZSA9IG5vZGVUZXh0RGF0ZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICBsZWZ0ID0gc2l6ZS5sZWZ0ICsgc2l6ZS53aWR0aCArIDEwO1xyXG4gIHRvcCA9IHNpemUudG9wIC0gNTtcclxuXHJcbiAgY2FsZW5kYXIuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xyXG4gIGNhbGVuZGFyLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XHJcbiAgY2FsZW5kYXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblxyXG4gIGRhdGUgPSBOdW1iZXIobm9kZVRleHREYXRlLm5leHRFbGVtZW50U2libGluZy52YWx1ZSk7XHJcblxyXG4gIGNyZWF0ZUNhbGVuZGFyKGRhdGUsIG5vZGVUZXh0RGF0ZSk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVNoYWRvd0xheWVyKCl7XHJcbiAgdmFyIGJCb2R5ID0gZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICB2YXIgZnVsbEhlaWdodCA9ICRzY3JlZW5IZWlnaHQgPiBiQm9keS5oZWlnaHQgPyAkc2NyZWVuSGVpZ2h0IDogYkJvZHkuaGVpZ2h0O1xyXG4gIHZhciBzaGFkb3dMYXllcjtcclxuXHJcbiAgc2hhZG93TGF5ZXIgPSAkKCcjc2Zfc2hhZG93TGF5ZXInKS5ub2RlKCk7XHJcbiAgc2hhZG93TGF5ZXIuc3R5bGUud2lkdGggPSBiQm9keS53aWR0aDtcclxuICBzaGFkb3dMYXllci5zdHlsZS5oZWlnaHQgPSBmdWxsSGVpZ2h0O1xyXG5cclxuICBiaW5kRXZlbnQoc2hhZG93TGF5ZXIsICdvbmNsaWNrJywgY2xvc2VXaW5kb3dzKTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlU3RhdHVzV2luZG93KCl7XHJcbiAgcmV0dXJuIGA8dGFibGUgd2lkdGg9XCI2MDBcIiBoZWlnaHQ9XCI1MFwiIHN0eWxlPVwibWFyZ2luOiAyMHB4IDI1cHg7IGJhY2tncm91bmQtY29sb3I6ICNmMGZmZjBcIiB0eXBlPVwicGFkZGluZ1wiPlxyXG4gICAgPHRyIHR5cGU9XCJoZWFkZXJcIiBoZWlnaHQ9XCIzNVwiPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwiY29sb3I6ICM5OTAwMDA7XCI+0J/RgNC+0LPRgNC10YHRgSDQt9Cw0LTQsNGH0Lg8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0ciBoZWlnaHQ9XCIxNVwiPlxyXG4gICAgICAgIDx0ZD48L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nLWxlZnQ6IDMwcHg7XCI+XHJcbiAgICAgICAgICAgIDxiPtCX0LDQtNCw0YfQsDo8L2I+IDxzcGFuIGlkPVwic2ZfcHJvZ3Jlc3NUZXh0XCIgc3R5bGU9XCJmb250LXN0eWxlOiBpdGFsaWM7XCI+PC9zcGFuPiBbPHNwYW4gaWQ9XCJzZl9wcm9ncmVzc0N1cnJlbnRcIj48L3NwYW4+LzxzcGFuIGlkPVwic2ZfcHJvZ3Jlc3NNYXhcIj48L3NwYW4+XVxyXG4gICAgICAgICAgICA8c3BhbiBpZD1cInNmX3Byb2dyZXNzVGV4dEV4dHJhXCI+PC9zcGFuPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmctbGVmdDogMzBweDtcIj5cclxuICAgICAgICAgICAgPGI+0JLRgNC10LzQtdC90Lgg0L7RgdGC0LDQu9C+0YHRjDo8L2I+IDxzcGFuPjAwOjAwPC9zcGFuPjxzcGFuIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiBpZD1cInNmX3Byb2dyZXNzVGltZVwiPjA8L3NwYW4+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZy1sZWZ0OiAzMHB4O1wiPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6IDUxMHB4OyBoZWlnaHQ6IDEwcHg7IGJvcmRlcjogc29saWQgMXB4ICMwMDAwMDA7IGZsb2F0OiBsZWZ0OyBtYXJnaW4tdG9wOiA4cHg7XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6IDA7IGhlaWdodDogMTAwJTsgYmFja2dyb3VuZC1jb2xvcjogYnJvd247XCIgaWQ9XCJzZl9wcm9ncmVzc0JhclwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0OyB3aWR0aDogNXB4OyBoZWlnaHQ6IDI1cHg7XCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbG9hdDogbGVmdDsgd2lkdGg6IDI1cHg7IGhlaWdodDogMjVweDtcIiBpZD1cInNmX3Byb2dyZXNzSWNvXCI+PC9kaXY+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiMjVcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIHN0eWxlPVwicGFkZGluZzogMTVweCAzMHB4IDEwcHggMDtcIj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cItCf0LDRg9C30LBcIiAvPiA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwi0J7RgtC80LXQvdCwXCIgLz5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0ciBoZWlnaHQ9XCI1XCIgYmdjb2xvcj1cIiNkMGVlZDBcIj5cclxuICAgICAgICA8dGQ+PC90ZD5cclxuICAgIDwvdHI+XHJcbjwvdGFibGU+YDtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ29udHJvbFBhbmVsKCl7XHJcbiAgdmFyIGNvZGUsIGRpc2FibGVkO1xyXG5cclxuICBkaXNhYmxlZCA9ICRtb2RlID8gJycgOiAnZGlzYWJsZWQnO1xyXG4gIGNvZGUgPSBgPHRhYmxlIGNlbGxzcGFjaW5nPVwiMFwiIHdpZHRoPVwiMzAwXCIgc3R5bGU9XCJib3JkZXI6IHNvbGlkIDAgIzAwMDAwMDsgYmFja2dyb3VuZC1jb2xvcjogI2YwZmZmMDsgbWFyZ2luOiAyMHB4IDI1cHg7XCIgdHlwZT1cInNtYWxsUGFkZGluZ1wiPlxyXG4gICAgPHRyIGhlaWdodD1cIjMwXCIgdHlwZT1cImhlYWRlclwiPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGJnY29sb3I9XCIjZDBlZWQwXCIgY29sc3Bhbj1cIjJcIj7QodCx0L7RgCDQtNCw0L3QvdGL0YUg0L4g0YLQtdC80LDRhTwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5cclxuICAgICAgICAgICAg0J/QviDQutCw0LrQvtC1INGH0LjRgdC70L46XHJcbiAgICAgICAgICAgIDxzcGFuIHR5cGU9XCJjYWxlbmRhckNhbGxcIiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XCI+JHskYy5nZXROb3JtYWxEYXRlKCRkYXRlLCB0cnVlKS5kfTwvc3Bhbj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgIG5hbWU9XCJzZl9wYXJzZUZvcnVtXCIgY2xhc3M9XCJzZl9oaWRlSW5wdXRcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCIgdmFsdWU9XCIkeyRkYXRlfVwiIC8+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2ZfcGFyc2VGb3J1bVwiIHZhbHVlPVwiY291bnRcIiBjaGVja2VkIC8+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIiBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICDQktGB0LUg0YHRgtGA0LDQvdC40YbRiyDRhNC+0YDRg9C80LA6XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2ZfcGFyc2VGb3J1bVwiIHZhbHVlPVwiYWxsXCIgLz5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0ciBoZWlnaHQ9XCIzMFwiPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIyXCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cItCd0LDRh9Cw0YLRjFwiIG5hbWU9XCJzZl9wYXJzZUZvcnVtXCIgLz48L3RkPlxyXG4gICAgPC90cj5cclxuXHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIiB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgYmdjb2xvcj1cIiNkMGVlZDBcIiBjb2xzcGFuPVwiMlwiPtCQ0L3QsNC70LjQtyDQuNC30LLQtdGB0YLQvdGL0YUg0YLQtdC8PC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIiBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICDQmtC+0LvQuNGH0LXRgdGC0LLQviDRgtC10Lw6XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJzZl9wYXJzZVRoZW1lc1wiIGNsYXNzPVwic2ZfaGlkZUlucHV0XCIgdmFsdWU9XCIwXCIgLz4vIFs8c3BhbiBpZD1cInNmX2NvdW50VGhyZWFkc1wiIHRpdGxlPVwi0J3QtdC+0LHRgNCw0LHQvtGC0LDQvdC90YvRhSDRgtC10LwgLyDQktGB0LXQs9C+INGC0LXQvFwiPlswLzBdPC9zcGFuPl1cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZVRoZW1lc1wiIHZhbHVlPVwiY291bnRcIiBjaGVja2VkIC8+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIiBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICDQotC+0LvRjNC60L4g0L7RgtC80LXRh9C10L3QvdGL0LUg0LIg0YHQv9C40YHQutC1OlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNmX3BhcnNlVGhlbWVzXCIgdmFsdWU9XCJzZWxlY3RcIiAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5cclxuICAgICAgICAgICAg0JLRgdC1INC40LfQstC10YHRgtC90YvQtSDRgtC10LzRizpcclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZVRoZW1lc1wiIHZhbHVlPVwiYWxsXCIgLz5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0ciBoZWlnaHQ9XCIzMFwiPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIyXCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cItCd0LDRh9Cw0YLRjFwiIG5hbWU9XCJzZl9wYXJzZVRoZW1lc1wiIC8+PC90ZD5cclxuICAgIDwvdHI+XHJcblxyXG4gICAgPHRyIGhlaWdodD1cIjMwXCIgdHlwZT1cImhlYWRlclwiPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGJnY29sb3I9XCIjZDBlZWQwXCIgY29sc3Bhbj1cIjJcIj7QodGC0LDRgtGD0YEg0L/QtdGA0YHQvtC90LDQttC10Lk8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIGNvbHNwYW49XCIyXCI+XHJcbiAgICAgICAgICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INC/0LXRgNGB0L7QvdCw0LbQtdC5OlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwic2ZfcGFyc2VQbGF5ZXJzXCIgY2xhc3M9XCJzZl9oaWRlSW5wdXRcIiB2YWx1ZT1cIjBcIiAvPi88c3BhbiBpZD1cInNmX2NvdW50TWVtYmVyc1wiPjA8L3NwYW4+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2ZfcGFyc2VQbGF5ZXJzXCIgJHtkaXNhYmxlZH0gdmFsdWU9XCJjb3VudFwiIGNoZWNrZWQgLz5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIGNvbHNwYW49XCIyXCI+XHJcbiAgICAgICAgICAgINCi0L7Qu9GM0LrQviDQvtGC0LzQtdGH0LXQvdC90YvQtSDQsiDRgdC/0LjRgdC60LU6XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2ZfcGFyc2VQbGF5ZXJzXCIgICR7ZGlzYWJsZWR9IHZhbHVlPVwic2VsZWN0XCIgLz5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIGNvbHNwYW49XCIyXCI+XHJcbiAgICAgICAgICAgINCS0YHQtSDQv9C10YDRgdC+0L3QsNC20Lg6XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2ZfcGFyc2VQbGF5ZXJzXCIgJHtkaXNhYmxlZH0gdmFsdWU9XCJhbGxcIiAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjMwXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjJcIj48aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwi0J3QsNGH0LDRgtGMXCIgJHtkaXNhYmxlZH0gbmFtZT1cInNmX3BhcnNlUGxheWVyc1wiIC8+PC90ZD5cclxuICAgIDwvdHI+XHJcblxyXG4gICAgPHRyIGhlaWdodD1cIjMwXCIgdHlwZT1cImhlYWRlclwiPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGJnY29sb3I9XCIjZDBlZWQwXCIgY29sc3Bhbj1cIjJcIj7QlNC+0L/QvtC70L3QuNGC0LXQu9GM0L3QvjwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjI1XCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIj7QodC+0YHRgtCw0LIg0YHQuNC90LTQuNC60LDRgtCwOjwvdGQ+XHJcbiAgICAgICAgPHRkIGFsaWduPVwibGVmdFwiPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCLQntCx0YDQsNCx0L7RgtCw0YLRjFwiIG5hbWU9XCJzZl9tZW1iZXJMaXN0XCIgJHtkaXNhYmxlZH0gLz48L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0ciBoZWlnaHQ9XCIyNVwiPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCI+0J/RgNC+0YLQvtC60L7QuyDRgdC40L3QtNC40LrQsNGC0LA6PC90ZD5cclxuICAgICAgICA8dGQgYWxpZ249XCJsZWZ0XCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cItCe0LHRgNCw0LHQvtGC0LDRgtGMXCIgbmFtZT1cInNmX3NpbmRpY2F0ZUxvZ1wiICR7ZGlzYWJsZWR9IC8+PC90ZD5cclxuICAgIDwvdHI+XHJcblxyXG4gICAgPHRyIGhlaWdodD1cIjQwXCI+XHJcbiAgICAgICAgPHRkIGNvbHNwYW49XCIyXCIgc3R5bGU9XCJmb250LXNpemU6IDlweDtcIiBhbGlnbj1cImNlbnRlclwiPlxyXG4gICAgICAgICAgICA8c3BhbiBpZD1cInNmX2ZvcmdldEZvcnVtXCIgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7XCI+W9C30LDQsdGL0YLRjCDRjdGC0L7RgiDRhNC+0YDRg9C8XTwvc3Bhbj5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0ciBoZWlnaHQ9XCI1XCIgYmdjb2xvcj1cIiNkMGVlZDBcIj5cclxuICAgICAgICA8dGQgY29sc3Bhbj1cIjJcIj48L3RkPlxyXG4gICAgPC90cj5cclxuPC90YWJsZT5gO1xyXG5cclxuICByZXR1cm4gY29kZTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTWVzc2FnZVdpbmRvdygpe1xyXG4gIHJldHVybiBgPHRhYmxlIHdpZHRoPVwiNzAwXCIgaGVpZ2h0PVwiMzk1XCIgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIm1hcmdpbjogMjBweCAyNXB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmZmYwO1wiIHR5cGU9XCJwYWRkaW5nXCI+XHJcbiAgICA8dHIgdHlwZT1cImhlYWRlclwiIGhlaWdodD1cIjM1XCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgc3R5bGU9XCJjb2xvcjogIzk5MDAwMDtcIiBjb2xzcGFuPVwiM1wiPtCg0LDRgdGB0YvQu9C60LAg0L/QvtGH0YLRizwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDhweCA1cHggMnB4IDVweDtcIiBhbGlnbj1cInJpZ2h0XCI+0JrQvtC80YM6PC90ZD5cclxuICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiA4cHggNXB4IDJweCA1cHg7IHdpZHRoOiAyMDBweDtcIj48c2VsZWN0IHN0eWxlPVwid2lkdGg6IDIwMHB4O1wiIG5hbWU9XCJtaWRcIj48L3NlbGVjdD48L3RkPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDhweCA1cHggMnB4IDVweDsgd2lkdGg6IDM1MHB4O1wiIGFsaWduPVwibGVmdFwiPiDQktGB0LXQs9C+OiA8c3BhbiB0eXBlPVwiY291bnRcIj48L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiPtCi0LXQvNCwOjwvdGQ+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogMnB4IDVweCA4cHggNXB4O1wiIGNvbHNwYW49XCIyXCI+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgbWF4bGVuZ3RoPVwiNTBcIiBzdHlsZT1cIndpZHRoOjEwMCVcIiB2YWx1ZT1cIlwiIG5hbWU9XCJzdWJqZWN0XCI+PC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIiB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgYmdjb2xvcj1cIiNkMGVlZDBcIiBjb2xzcGFuPVwiM1wiPtCj0YLQuNC70LjRgtGLPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIiBzdHlsZT1cInBhZGRpbmc6IDhweCA1cHggMnB4IDVweDtcIj7QoNC10LbQuNC8OjwvdGQ+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogOHB4IDVweCAycHggNXB4OyB3aWR0aDogMjAwcHg7XCIgY29sc3Bhbj1cIjJcIj5cclxuICAgICAgICAgICAgPHNlbGVjdCBzdHlsZT1cIndpZHRoOiAzMDBweDtcIiBuYW1lPVwid29ya01vZGVcIj5cclxuICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJtYWlsXCI+0J/QvtGH0YLQsDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImludml0ZVwiPtCf0L7Rh9GC0LAg0Lgg0L/RgNC40LPQu9Cw0YjQtdC90LjQtTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImdvQXdheVwiPtCf0L7Rh9GC0LAg0Lgg0LjQt9Cz0L3QsNC90LjQtTwvb3B0aW9uPlxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiPtCh0LjQvdC00LjQutCw0YI6PC90ZD5cclxuICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiAycHggNXB4IDhweCA1cHg7IHdpZHRoOiAyMDBweDtcIiBjb2xzcGFuPVwiMlwiPjxzZWxlY3Qgc3R5bGU9XCJ3aWR0aDogMzAwcHg7XCIgbmFtZT1cInNpZFwiPjwvc2VsZWN0PjwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjMwXCIgdHlwZT1cImhlYWRlclwiPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGJnY29sb3I9XCIjZDBlZWQwXCIgY29sc3Bhbj1cIjNcIj7QodC+0L7QsdGJ0LXQvdC40LU8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgY29sc3Bhbj1cIjNcIiBzdHlsZT1cInBhZGRpbmc6IDhweCA4cHggMnB4IDhweDtcIj5cclxuICAgICAgICAgICAgPHRleHRhcmVhIHN0eWxlPVwid2lkdGg6MTAwJVwiIHJvd3M9XCIxMFwiIG5hbWU9XCJtZXNzYWdlXCI+PC90ZXh0YXJlYT5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBjb2xzcGFuPVwiM1wiIGhlaWdodD1cIjM1XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJzZl9zZW5kTWVzc2FnZXNcIiB2YWx1ZT1cItCX0LDQv9GD0YHRgtC40YLRjFwiPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjVcIiBiZ2NvbG9yPVwiI2QwZWVkMFwiPlxyXG4gICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG48L3RhYmxlPmA7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNhbGVuZGFyKGNEYXRlLCBub2RlVGV4dERhdGUpe1xyXG4gIHZhciBtb250aHMsIGRheXMsIGRhdGUsIHllYXIsIG1vbnRoLCBkYXksIGNvZGUsIHJvdywgY29sbCwgZGF5TnVtYmVyLCBmaXJzdERheVdlZWssIGV4aXQsIHRNb250aCwgdERheSwgY29sb3I7XHJcblxyXG4gIG1vbnRocyAgPSBbJ9Cv0L3QstCw0YDRjCcsJ9Ck0LXQstGA0LDQu9GMJywn0JzQsNGA0YInLCfQkNC/0YDQtdC70YwnLCfQnNCw0LknLCfQmNGO0L3RjCcsJ9CY0Y7Qu9GMJywn0JDQstCz0YPRgdGCJywn0KHQtdC90YLRgNGP0LHRgNGMJywn0J7QutGC0Y/QsdGA0YwnLCfQndC+0Y/QsdGA0YwnLCfQlNC10LrQsNCx0YDRjCddO1xyXG4gIGRheXMgICAgPSBbMzEsIDI4LCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMV07XHJcbiAgZXhpdCAgICA9IGZhbHNlO1xyXG5cclxuICBkYXRlID0gY0RhdGUgPT0gbnVsbCA/ICRkYXRlIDogY0RhdGU7XHJcbiAgZGF0ZSA9ICRjLmdldE5vcm1hbERhdGUoZGF0ZSwgdHJ1ZSk7XHJcbiAgZGF0ZSA9IGRhdGUuZC5zcGxpdCgnLicpO1xyXG5cclxuICBkYXkgPSBOdW1iZXIoZGF0ZVswXSk7XHJcbiAgdE1vbnRoID0gZGF0ZVsxXTtcclxuICBtb250aCA9IE51bWJlcihkYXRlWzFdKTtcclxuICB5ZWFyID0gTnVtYmVyKGRhdGVbMl0pO1xyXG5cclxuICBpZih5ZWFyICUgNCA9PSAwKSBkYXlzWzFdID0gMjk7XHJcblxyXG4gIGNvZGUgPVxyXG4gICAgYDx0YWJsZSBjbGFzcz1cIndiXCIgc3R5bGU9XCJtYXJnaW46IDIwcHggMjVweDtcIj5cclxuICAgICAgICAgICAgICAgIDx0ciB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIHR5cGU9XCJjb250cm9sXCI+wqs8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCB0eXBlPVwiY29udHJvbFwiIHRpdGxlPVwi0JLRi9Cx0YDQsNGC0Ywg0LPQvtC0XCIgY29sc3Bhbj1cIjVcIj4ke21vbnRoc1ttb250aC0xXX0gJHt5ZWFyfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIHR5cGU9XCJjb250cm9sXCI+wrs8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0ciB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPtCfPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+0JI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD7QoTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPtCnPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+0J88L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD7QoTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPtCSPC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+YDtcclxuXHJcbiAgZGF5TnVtYmVyID0gMTtcclxuICBmaXJzdERheVdlZWsgPSBEYXRlLnBhcnNlKGAke21vbnRofS8xLyR7eWVhcn1gKTtcclxuICBmaXJzdERheVdlZWsgPSBuZXcgRGF0ZShmaXJzdERheVdlZWspLmdldERheSgpOyBmaXJzdERheVdlZWstLTtcclxuICBpZihmaXJzdERheVdlZWsgPT0gLTEpIGZpcnN0RGF5V2VlayA9IDY7XHJcblxyXG4gIGZvcihyb3cgPSAwOyByb3cgPCA2OyByb3crKyl7XHJcbiAgICBpZihleGl0KSBicmVhaztcclxuICAgIGNvZGUgKz0gYDx0cj5gO1xyXG4gICAgZm9yKGNvbGwgPSAwOyBjb2xsIDwgNzsgY29sbCsrKXtcclxuICAgICAgaWYocm93ID09IDAgJiYgY29sbCA8IGZpcnN0RGF5V2Vlayl7XHJcbiAgICAgICAgY29kZSArPSBgPHRkIGNvbHNwYW49XCIke2ZpcnN0RGF5V2Vla31cIj48L3RkPmA7XHJcbiAgICAgICAgY29sbCA9IGZpcnN0RGF5V2VlaztcclxuICAgICAgfVxyXG4gICAgICBpZihkYXlOdW1iZXIgPD0gZGF5c1ttb250aC0xXSl7XHJcbiAgICAgICAgaWYoZGF5TnVtYmVyID09IGRheXNbbW9udGgtMV0gJiYgY29sbCA9PSA2KSBleGl0ID0gdHJ1ZTtcclxuICAgICAgICB0RGF5ID0gZGF5TnVtYmVyIDwgMTAgPyAnMCcgKyBkYXlOdW1iZXIgOiBkYXlOdW1iZXI7XHJcbiAgICAgICAgY29sb3IgPSBkYXlOdW1iZXIgPT0gZGF5ID8gJ3N0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2QwZWVkMDtcIicgOiAnJztcclxuICAgICAgICBjb2RlICs9IGA8dGQgdHlwZT1cImRheVwiICR7Y29sb3J9IG5hbWU9XCIke3REYXl9LiR7dE1vbnRofS4ke3llYXJ9XCIgdGl0bGU9XCIke3RNb250aH0vJHt0RGF5fS8ke3llYXJ9IDAwOjAwXCI+JHtkYXlOdW1iZXJ9PC90ZD5gO1xyXG4gICAgICAgIGRheU51bWJlcisrO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBjb2RlICs9IGA8dGQgY29sc3Bhbj1cIiR7Ny1jb2xsfVwiPjwvdGQ+YDtcclxuICAgICAgICBleGl0ID0gdHJ1ZTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29kZSArPSBgPC90cj5gO1xyXG4gIH1cclxuXHJcbiAgY29kZSArPVxyXG4gICAgYDx0ciB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjdcIj4keyRjLmdldE5vcm1hbERhdGUoJGRhdGUsIHRydWUpLmR9PC90ZD5cclxuICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgPC90YWJsZT5gO1xyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAkKCcjc2ZfY2FsZW5kYXInKVxyXG4gICAgLmh0bWwoY29kZSlcclxuICAgIC5maW5kKCd0ZFt0eXBlPVwiY29udHJvbFwiXSxbdHlwZT1cImRheVwiXScpXHJcbiAgICAubm9kZUFycigpXHJcbiAgICAuZm9yRWFjaChcclxuICAgICAgZnVuY3Rpb24oYnV0dG9uKXtcclxuICAgICAgICBpZihidXR0b24uZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PSBcImNvbnRyb2xcIil7XHJcbiAgICAgICAgICBpZihidXR0b24udGl0bGUgPT0gXCLQktGL0LHRgNCw0YLRjCDQs9C+0LRcIil7XHJcbiAgICAgICAgICAgIGJpbmRFdmVudChidXR0b24sICdvbmNsaWNrJywgZnVuY3Rpb24oKXtzZXRZZWFyKG1vbnRoLCB5ZWFyKX0pO1xyXG4gICAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBiaW5kRXZlbnQoYnV0dG9uLCAnb25jbGljaycsIGZ1bmN0aW9uKCl7bW92ZU1vbnRoKGJ1dHRvbiwgbW9udGgsIHllYXIpfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBiaW5kRXZlbnQoYnV0dG9uLCAnb25jbGljaycsIGZ1bmN0aW9uKCl7Y2FsZW5kYXJTZXREYXRlKGJ1dHRvbiwgbm9kZVRleHREYXRlKX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgKTtcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBtb3ZlTW9udGgoYnV0dG9uLCBtb250aCwgeWVhcil7XHJcbiAgICBpZihidXR0b24udGV4dENvbnRlbnQgPT0gXCLCq1wiKXtcclxuICAgICAgbW9udGgtLTtcclxuICAgICAgaWYobW9udGggPT0gMCl7XHJcbiAgICAgICAgeWVhci0tO1xyXG4gICAgICAgIG1vbnRoID0gMTI7XHJcbiAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICBtb250aCsrO1xyXG4gICAgICBpZihtb250aCA9PSAxMyl7XHJcbiAgICAgICAgeWVhcisrO1xyXG4gICAgICAgIG1vbnRoID0gMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbW9udGggPSBtb250aCA8IDEwID8gJzAnICsgbW9udGggOiBtb250aDtcclxuXHJcbiAgICBjcmVhdGVDYWxlbmRhcihEYXRlLnBhcnNlKGAke21vbnRofS8wMS8ke3llYXJ9YCkgLyAxMDAwLCBub2RlVGV4dERhdGUpO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBzZXRZZWFyKG1vbnRoLCB5ZWFyKXtcclxuICAgIHZhciBuWWVhcjtcclxuXHJcbiAgICBuWWVhciA9IHByb21wdChcItCS0LLQtdC00LjRgtC1INC/0L7QvdGL0Lkg0LPQvtC0XCIpO1xyXG5cclxuICAgIGlmKG5ZZWFyID09IFwiXCIpe1xyXG4gICAgICBuWWVhciA9IDE5NzA7XHJcbiAgICAgIG1vbnRoID0gXCIwMVwiO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIG5ZZWFyID0gcGFyc2VJbnQoblllYXIsIDEwKTtcclxuICAgICAgaWYoaXNOYU4oblllYXIpKSBuWWVhciA9IHllYXI7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhuWWVhcik7XHJcblxyXG4gICAgY3JlYXRlQ2FsZW5kYXIoRGF0ZS5wYXJzZShgJHttb250aH0vMDEvJHtuWWVhcn1gKSAvIDEwMDAsIG5vZGVUZXh0RGF0ZSk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIGNhbGVuZGFyU2V0RGF0ZShidXR0b24sIG5vZGVUZXh0RGF0ZSl7XHJcbiAgICBub2RlVGV4dERhdGUubmV4dEVsZW1lbnRTaWJsaW5nLnZhbHVlID0gRGF0ZS5wYXJzZShidXR0b24udGl0bGUpIC8gMTAwMDtcclxuICAgICQobm9kZVRleHREYXRlKS5odG1sKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ25hbWUnKSk7XHJcbiAgICAkKFwiI3NmX2NhbGVuZGFyXCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwcmVwYXJlRG9UYXNrKG5vZGUpe1xyXG5cclxuICBvcGVuU3RhdHVzV2luZG93KCk7XHJcblxyXG4gIHN3aXRjaCAobm9kZS5uYW1lKXtcclxuICAgIGNhc2UgJ3NmX3BhcnNlRm9ydW0nOiBmb3J1bSgpOyBicmVhaztcclxuICAgIGNhc2UgJ3NmX3BhcnNlVGhlbWVzJzogdGhlbWVzKCk7IGJyZWFrO1xyXG4gICAgY2FzZSAnc2ZfcGFyc2VQbGF5ZXJzJzogcGxheWVycygpOyBicmVhaztcclxuICAgIGNhc2UgJ3NmX21lbWJlckxpc3QnOiBnZXRNZW1iZXJzTGlzdCgpOyBicmVhaztcclxuICAgIGNhc2UgJ3NmX3NpbmRpY2F0ZUxvZyc6IGdldE1heFBhZ2VTaW5kaWNhdGVMb2coKTsgYnJlYWs7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIGZvcnVtKCl7XHJcbiAgICB2YXIgcCA9IGdldFBhcmFtKCdzZl9wYXJzZUZvcnVtJyk7XHJcblxyXG4gICAgc3dpdGNoKHAudHlwZSl7XHJcbiAgICAgIGNhc2UgJ2NvdW50JzpcclxuICAgICAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgYNCe0LHRgNCw0LHQvtGC0LrQsCDRhNC+0YDRg9C80LAg0YHQuNC90LTQuNC60LDRgtCwICMkeyRmb3J1bS5pZH0gwqskeyRmb3J1bS5uYW1lfcK7YCwgMCwgMTAwKTtcclxuICAgICAgICBwYXJzZUZvcnVtKDAsIGZhbHNlLCBwLmNvdW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ2FsbCc6XHJcbiAgICAgICAgZ2V0TWF4UGFnZUZvcnVtKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHRoZW1lcygpe1xyXG4gICAgdmFyIHAgPSBnZXRQYXJhbSgnc2ZfcGFyc2VUaGVtZXMnKSwgbDtcclxuXHJcbiAgICBzd2l0Y2gocC50eXBlKXtcclxuICAgICAgY2FzZSAnY291bnQnOlxyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzcygnc3RhcnQnLCBg0J7QsdGA0LDQsdC+0YLQutCwINGC0LXQvGAsIDAsIHAuY291bnQpO1xyXG4gICAgICAgIHByZXBhcmVQYXJzZVRoZW1lcyhwLmNvdW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XHJcbiAgICAgICAgbCA9IGdldExpc3QoJ3NmX3RoZW1lc0xpc3QnKTtcclxuICAgICAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgYNCe0LHRgNCw0LHQvtGC0LrQsCDRgtC10LxgLCAwLCBsLmNvdW50KTtcclxuICAgICAgICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKGwuYyk7XHJcbiAgICAgICAgcGFyc2VUaGVtZXMoMCwgbC5jb3VudCwgbC5hcnJheSk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlICdhbGwnOlxyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzcygnc3RhcnQnLCBg0J7QsdGA0LDQsdC+0YLQutCwINGC0LXQvGAsIDAsICRjZC5mLnRocmVhZHMubmV3KTtcclxuICAgICAgICBwcmVwYXJlUGFyc2VUaGVtZXMoMCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHBsYXllcnMoKXtcclxuICAgIHZhciBwLCBsO1xyXG5cclxuICAgIHAgPSBnZXRQYXJhbSgnc2ZfcGFyc2VQbGF5ZXJzJyk7XHJcblxyXG4gICAgc3dpdGNoKHAudHlwZSl7XHJcbiAgICAgIGNhc2UgJ2NvdW50JzpcclxuICAgICAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgYNCe0LHRgNCw0LHQvtGC0LrQsCDQv9C10YDRgdC+0L3QsNC20LXQuWAsIDAsIHAuY291bnQpO1xyXG4gICAgICAgIHByZXBhcmVQYXJzZU1lbWJlcnMocC5jb3VudCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBjYXNlICdzZWxlY3QnOlxyXG4gICAgICAgIGwgPSBnZXRMaXN0KCdzZl9tZW1iZXJzTGlzdCcpO1xyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzcygnc3RhcnQnLCBg0J7QsdGA0LDQsdC+0YLQutCwINC/0LXRgNGB0L7QvdCw0LbQtdC5YCwgMCwgbC5jb3VudCk7XHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzVGltZShsLmMpO1xyXG4gICAgICAgIHBhcnNlTWVtYmVycygwLCBsLmNvdW50LCBsLmFycmF5KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ2FsbCc6XHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsIGDQntCx0YDQsNCx0L7RgtC60LAg0L/QtdGA0YHQvtC90LDQttC10LlgLCAwLCAkY2QuY291bnRNZW1iZXJzKTtcclxuICAgICAgICBwcmVwYXJlUGFyc2VNZW1iZXJzKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIGdldFBhcmFtKG5hbWUpe1xyXG4gICAgdmFyIHR5cGUsIGNvdW50LCB0YWJsZTtcclxuXHJcbiAgICB0YWJsZSA9ICQobm9kZSkudXAoJ3RhYmxlJykubm9kZSgpO1xyXG4gICAgdHlwZSA9ICQodGFibGUpLmZpbmQoYGlucHV0W3R5cGU9XCJyYWRpb1wiXVtuYW1lPVwiJHtuYW1lfVwiXTpjaGVja2VkYCkubm9kZSgpLnZhbHVlO1xyXG4gICAgY291bnQgPSAkKHRhYmxlKS5maW5kKGBpbnB1dFt0eXBlPVwidGV4dFwiXVtuYW1lPVwiJHtuYW1lfVwiXWApLm5vZGUoKS52YWx1ZTtcclxuICAgIGNvdW50ID0gTnVtYmVyKGNvdW50KTtcclxuXHJcbiAgICByZXR1cm4ge2NvdW50OiBjb3VudCwgdHlwZTogdHlwZX07XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIGdldExpc3QobmFtZSl7XHJcbiAgICB2YXIgbGlzdCA9IFtdLCBjb3VudCA9IDAsIGlkO1xyXG5cclxuICAgICQoYGlucHV0W3R5cGU9XCJjaGVja2JveFwiXVtuYW1lPVwiJHtuYW1lfVwiXTpjaGVja2VkYCkubm9kZUFycigpLmZvckVhY2goXHJcbiAgICAgIGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICAgIGlkID0gTnVtYmVyKG5vZGUudmFsdWUpO1xyXG4gICAgICAgIGlmKG5hbWUgPT0gXCJzZl90aGVtZXNMaXN0XCIgJiYgJGNkLmYudGhlbWVzW2lkXS5wb3N0c1swXSAhPSAkY2QuZi50aGVtZXNbaWRdLnBvc3RzWzFdKXtcclxuICAgICAgICAgIGxpc3QucHVzaChub2RlLnZhbHVlKTtcclxuICAgICAgICAgIGNvdW50ICs9IGNhbGN1bGF0ZVRoZW1lUGFnZXMoaWQpLmNvdW50O1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgbGlzdC5wdXNoKGlkKTtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIGlmKG5hbWUgPT0gXCJzZl90aGVtZXNMaXN0XCIpe1xyXG4gICAgICBjb3VudCA9IGxpc3QubGVuZ3RoICogNzUwICsgY291bnQgKiAxMjUwICsgNTAwO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvdW50ID0gIGNvdW50ICogMTI1MDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge2FycmF5OiBsaXN0LCBjb3VudDogbGlzdC5sZW5ndGgsIGM6IGNvdW50fTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGZvcmdldEZvcnVtKCl7XHJcbiAgdmFyIGlkO1xyXG5cclxuICBpZihjb25maXJtKCfQktGLINGD0LLRgNC10L3RiyDRh9GC0L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMINCy0YHQtSDQtNCw0L3QvdGL0LUg0L7QsSDRjdGC0L7QvCDRhNC+0YDRg9C80LU/Jykpe1xyXG4gICAgZGVsZXRlICRzZC5mb3J1bXNbJGNkLmZpZF07XHJcbiAgICBmb3IgKGlkIGluICRzZC5wbGF5ZXJzKSB7XHJcbiAgICAgIGlmICgkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdKSB7XHJcbiAgICAgICAgZGVsZXRlICRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAoaWQgaW4gJHNkLmtpY2tlZCl7XHJcbiAgICAgIGRlbGV0ZSAkc2Qua2lja2VkWyRjZC5maWRdO1xyXG4gICAgfVxyXG4gICAgc2F2ZVRvTG9jYWxTdG9yYWdlKCdkYXRhJyk7XHJcbiAgICBsb2NhdGlvbi5yZWxvYWQoKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlQcm9ncmVzcyhpbmksIHRleHQsIGN1cnJlbnQsIG1heCl7XHJcbiAgdmFyIHBlcmNlbnQsIGMsIG0sIGIsIGksIHQsIHRlLCBpbWc7XHJcblxyXG4gIGltZyA9IGA8ZGl2IHN0eWxlPVwid2lkdGg6IDI1cHg7IGhlaWdodDogMjVweDsgYmFja2dyb3VuZDogdXJsKCR7JGljby5sb2FkaW5nfSk7XCI+PC9kaXY+YDtcclxuXHJcbiAgYyA9ICQoXCIjc2ZfcHJvZ3Jlc3NDdXJyZW50XCIpO1xyXG4gIG0gPSAkKFwiI3NmX3Byb2dyZXNzTWF4XCIpO1xyXG4gIGIgPSAkKFwiI3NmX3Byb2dyZXNzQmFyXCIpO1xyXG4gIGkgPSAkKFwiI3NmX3Byb2dyZXNzSWNvXCIpO1xyXG4gIHQgPSAkKFwiI3NmX3Byb2dyZXNzVGV4dFwiKTtcclxuICB0ZSA9ICQoXCIjc2ZfcHJvZ3Jlc3NUZXh0RXh0cmFcIik7XHJcblxyXG4gIGlmKGluaSA9PSAnc3RhcnQnKXtcclxuICAgIGkuaHRtbChpbWcpO1xyXG4gICAgdC5odG1sKHRleHQpO1xyXG4gICAgbS5odG1sKG1heCk7XHJcbiAgICBjLmh0bWwoY3VycmVudCk7XHJcbiAgICBiLm5vZGUoKS5zdHlsZS53aWR0aCA9ICcwJSc7XHJcblxyXG4gICAgJGNkLnNob3dQcm9ncmVzc1RpbWUgPSB0cnVlO1xyXG4gIH1cclxuICBpZihpbmkgPT0gJ3dvcmsnKXtcclxuICAgIGN1cnJlbnQgPSBwYXJzZUludChjLnRleHQoKSwgMTApICsgMTtcclxuICAgIG1heCA9IHBhcnNlSW50KG0udGV4dCgpLCAxMCk7XHJcblxyXG4gICAgcGVyY2VudCA9ICRjLmdldFBlcmNlbnQoY3VycmVudCwgbWF4LCBmYWxzZSk7XHJcbiAgICBiLm5vZGUoKS5zdHlsZS53aWR0aCA9IHBlcmNlbnQgKyAnJSc7XHJcbiAgICBjLmh0bWwoY3VycmVudCk7XHJcbiAgfVxyXG4gIGlmKGluaSA9PSAnZXh0cmEnKXtcclxuICAgIHRlLmh0bWwodGV4dCk7XHJcbiAgfVxyXG4gIGlmKGluaSA9PSAnZG9uZScpe1xyXG4gICAgdGUuaHRtbCgnJyk7XHJcbiAgICBiLm5vZGUoKS5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgIGMuaHRtbChtLnRleHQoKSk7XHJcbiAgICBpLmh0bWwoJzxiPtCX0LDQstC10YDRiNC10L3QviE8L2I+Jyk7XHJcblxyXG4gICAgJGNkLnNob3dQcm9ncmVzc1RpbWUgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGRpc3BsYXlQcm9ncmVzc1RpbWUodCl7XHJcbiAgdmFyIG5vZGUsIHRpbWU7XHJcblxyXG4gIGlmKCEkY2Quc2hvd1Byb2dyZXNzVGltZSkgcmV0dXJuO1xyXG5cclxuICBub2RlID0gJCgnI3NmX3Byb2dyZXNzVGltZScpO1xyXG4gIHRpbWUgPSB0ID8gdCA6IE51bWJlcihub2RlLnRleHQoKSkgLSAxMDAwO1xyXG4gIGlmKHRpbWUgPCAwKSB0aW1lID0gMDtcclxuICBub2RlLm5vZGUoKS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnRleHRDb250ZW50ID0gJGMuZ2V0Tm9ybWFsVGltZSh0aW1lKTtcclxuICBub2RlLmh0bWwodGltZSk7XHJcbiAgZGlzcGxheVByb2dyZXNzVGltZS5na0RlbGF5KDEwMDAsIHRoaXMsIFtdKTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5mdW5jdGlvbiBvcGVuU3RhdHVzV2luZG93KCl7XHJcbiAgJChcIiNzZl9jb250cm9sUGFuZWxXaW5kb3dcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAkKFwiI3NmX2ZpbHRlcnNXaW5kb3dcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAkKFwiI3NmX21lc3NhZ2VXaW5kb3dcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgJChcIiNzZl9zdGF0dXNXaW5kb3dcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIG9wZW5Db250cm9sUGFuZWxXaW5kb3coKXtcclxuICAkKFwiI3NmX3NoYWRvd0xheWVyXCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG5cclxuICAkKFwiI3NmX2NvdW50VGhyZWFkc1wiKS5odG1sKCRmb3J1bS50aGVtZXNbMF0gKyAnLycgKyAkZm9ydW0udGhlbWVzWzFdKTtcclxuICAvLyQoXCIjc2ZfY291bnRNZW1iZXJzXCIpLmh0bWwoJGNkLmNvdW50TWVtYmVycyk7XHJcbiAgJChcIiNzZl9jb250cm9sUGFuZWxXaW5kb3dcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIG9wZW5GaWx0ZXJzV2luZG93KCl7XHJcbiAgJChcIiNzZl9zaGFkb3dMYXllclwiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAkKFwiI3NmX2ZpbHRlcnNXaW5kb3dcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIG9wZW5NZXNzYWdlV2luZG93KCl7XHJcbiAgdmFyIHdpbmRvdywgbjtcclxuXHJcbiAgJChcIiNzZl9zaGFkb3dMYXllclwiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICB3aW5kb3cgPSAkKFwiI3NmX21lc3NhZ2VXaW5kb3dcIikubm9kZSgpO1xyXG4gIG4gPSAwO1xyXG5cclxuICAkKHdpbmRvdykuZmluZCgnc2VsZWN0W25hbWU9XCJtaWRcIl0nKS5odG1sKGNyZWF0ZVNlbGVjdExpc3QoKSk7XHJcbiAgJCh3aW5kb3cpLmZpbmQoJ3NlbGVjdFtuYW1lPVwic2lkXCJdJykuaHRtbChjcmVhdGVTZWxlY3RTSUQoKSk7XHJcbiAgJCh3aW5kb3cpLmZpbmQoJ3NwYW5bdHlwZT1cImNvdW50XCJdJykuaHRtbChuKTtcclxuXHJcbiAgd2luZG93LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlU2VsZWN0U0lEKCl7XHJcbiAgICB2YXIgY29kZSwgbGlzdCwgc2lkO1xyXG5cclxuICAgIGNvZGUgPSAnPG9wdGlvbiB2YWx1ZT1cIjBcIj7QktGL0LHQtdGA0LjRgtC1Li4uPC9vcHRpb24+JztcclxuICAgIGxpc3QgPSAkbW9kZSA/ICRzZC5mb3J1bXMgOiAkdHNkLmZvcnVtcztcclxuXHJcbiAgICBPYmplY3Qua2V5cyhsaXN0KS5mb3JFYWNoKFxyXG4gICAgICBmdW5jdGlvbihpZCl7XHJcbiAgICAgICAgc2lkID0gaWQuc3Vic3RyaW5nKDEsIGlkLmxlbmd0aCk7XHJcbiAgICAgICAgY29kZSArPSBgPG9wdGlvbiB2YWx1ZT1cIiR7c2lkfVwiPlsjJHtzaWR9XSAke2xpc3RbaWRdLm5hbWV9PC9vcHRpb24+YDtcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICByZXR1cm4gY29kZTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gY3JlYXRlU2VsZWN0TGlzdCgpe1xyXG4gICAgdmFyIGNvZGU7XHJcblxyXG4gICAgY29kZSA9ICc8b3B0aW9uPtCf0L7RgdC80L7RgtGA0LXRgtGMINGB0L/QuNGB0L7Qui4uLjwvb3B0aW9uPic7XHJcblxyXG4gICAgJCgnI3NmX2NvbnRlbnRfU0knKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl1bbmFtZT1cInNmX21lbWJlcnNMaXN0XCJdOmNoZWNrZWQnKVxyXG4gICAgICAubm9kZUFycigpXHJcbiAgICAgIC5mb3JFYWNoKFxyXG4gICAgICAgIGZ1bmN0aW9uKGJveCl7XHJcbiAgICAgICAgICBuKys7XHJcbiAgICAgICAgICBjb2RlICs9IGA8b3B0aW9uIHZhbHVlPVwiJHskc2QucGxheWVyc1tib3gudmFsdWVdLm5hbWV9fCR7Ym94LnZhbHVlfVwiPiR7bn0uICR7JHNkLnBsYXllcnNbYm94LnZhbHVlXS5uYW1lfTwvb3B0aW9uPmA7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG5cclxuICAgIHJldHVybiBjb2RlO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gY2xvc2VXaW5kb3dzKCl7XHJcbiAgdmFyIHN0YXR1cyA9ICQoXCIjc2ZfcHJvZ3Jlc3NJY29cIikudGV4dCgpO1xyXG4gIHZhciB3aW5kb3cgPSAkKFwiI3NmX3N0YXR1c1dpbmRvd1wiKS5ub2RlKCk7XHJcblxyXG4gIGlmKHdpbmRvdy5zdHlsZS5kaXNwbGF5ID09IFwiYmxvY2tcIiAmJiBzdGF0dXMgIT0gXCLQl9Cw0LLQtdGA0YjQtdC90L4hXCIpIHJldHVybjtcclxuXHJcbiAgJChcIiNzZl9zaGFkb3dMYXllclwiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICAkKFwiI3NmX2NvbnRyb2xQYW5lbFdpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICQoXCIjc2ZfZmlsdGVyc1dpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICQoXCIjc2ZfbWVzc2FnZVdpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICQoXCIjc2ZfY2FsZW5kYXJcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICB3aW5kb3cuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBnZXRNZW1iZXJzTGlzdCgpe1xyXG4gIHZhciB1cmw7XHJcblxyXG4gIGlmKCRjZC5zaWQpe1xyXG4gICAgdXJsID0gYGh0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L3N5bmRpY2F0ZS5waHA/aWQ9JHskY2Quc2lkfSZwYWdlPW1lbWJlcnNgO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsICfQodCx0L7RgCDQuCDQvtCx0YDQsNCx0L7RgtC60LAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YHQvtGB0YLQsNCy0LUg0YHQuNC90LTQuNC60LDRgtCwJywgMCwgMSk7XHJcblxyXG4gICAgdHJ5e1xyXG4gICAgICBSRVEodXJsLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgIHBhcnNlKCk7XHJcbiAgICAgICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgICAgICAgIHJlbmRlclN0YXRzVGFibGUoKTtcclxuICAgICAgICAgIGRpc3BsYXlQcm9ncmVzcygnZG9uZScpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICBlcnJvckxvZyhcItCh0LHQvtGAINC40L3RhNC+0YDQvNCw0YbQuNC4INC+INGB0L7RgdGC0LDQstC1INGB0LjQvdC00LjQutCw0YLQsFwiLCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9Y2F0Y2ggKGUpe1xyXG4gICAgICBlcnJvckxvZyhcItGB0LHQvtGA0LUg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YHQvtGB0YLQsNCy0LUg0YHQuNC90LTQuNC60LDRgtCwXCIsIDEsIGUpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZSgpe1xyXG4gICAgdmFyIGxpc3QsIGlkLCBuYW1lLCBzbiwgcGY7XHJcblxyXG4gICAgbGlzdCA9ICQoJGFuc3dlcikuZmluZCgnYjpjb250YWlucyhcItCh0L7RgdGC0LDQsiDRgdC40L3QtNC40LrQsNGC0LBcIiknKS51cCgndGFibGUnKS5maW5kKCdhW2hyZWYqPVwiaW5mby5waHBcIl0nKS5ub2RlQXJyKCk7XHJcblxyXG4gICAgT2JqZWN0LmtleXMoJHNkLnBsYXllcnMpLmZvckVhY2goZnVuY3Rpb24oaWQpe1xyXG4gICAgICBwZiA9ICRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF07XHJcbiAgICAgIGlmKHBmICE9IG51bGwpe1xyXG4gICAgICAgIHBmLm1lbWJlciA9IGZhbHNlO1xyXG4gICAgICAgIHBmLnNuID0gMDtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgICBpZCA9IE51bWJlcihub2RlLmhyZWYubWF0Y2goLyhcXGQrKS8pWzFdKTtcclxuICAgICAgbmFtZSA9IG5vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgIHNuID0gJChub2RlKS51cCgndHInKS5ub2RlKCkuY2VsbHNbMF0udGV4dENvbnRlbnQ7XHJcbiAgICAgIHNuID0gcGFyc2VJbnQoc24sIDEwKTtcclxuXHJcbiAgICAgIGlmKCRzZC5wbGF5ZXJzW2lkXSA9PSBudWxsKXtcclxuICAgICAgICAkc2QucGxheWVyc1tpZF0gPSBnZW5lcmF0ZVBsYXllcihuYW1lKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXSA9PSBudWxsKXtcclxuICAgICAgICAkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdID0gZ2VuZXJhdGVGb3J1bVBsYXllcigpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdLm1lbWJlciA9IHRydWU7XHJcbiAgICAgICRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF0uc24gPSBzbjtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gZ2V0TWF4UGFnZVNpbmRpY2F0ZUxvZygpe1xyXG4gIHZhciB1cmwsIHBhZ2U7XHJcblxyXG4gIHVybCA9IGBodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9zeW5kaWNhdGUubG9nLnBocD9pZD0keyRjZC5zaWR9JnBhZ2VfaWQ9MTAwMDAwMDBgO1xyXG5cclxuICB0cnl7XHJcbiAgICBSRVEodXJsLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgZnVuY3Rpb24gKHJlcSl7XHJcbiAgICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICRjZC5sUGFnZSA9IHBhcnNlKCk7XHJcbiAgICAgICAgcGFnZSA9ICRjZC5sUGFnZSAtICRjZC5mLmxvZztcclxuXHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsIGDQntCx0YDQsNCx0L7RgtC60LAg0L/RgNC+0YLQvtC60L7Qu9CwINGB0LjQvdC00LjQutCw0YLQsCAjJHskY2QuZmlkfSDCqyR7JHNkLmZvcnVtc1skY2QuZmlkXS5uYW1lfcK7YCwgMCwgcGFnZSArIDEpO1xyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzc1RpbWUoKHBhZ2UgKyAxKSAqIDEyNTApO1xyXG4gICAgICAgIHBhcnNlU2luZGljYXRlTG9nLmdrRGVsYXkoNzUwLCB0aGlzLCBbcGFnZV0pO1xyXG4gICAgICB9LFxyXG4gICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICBlcnJvckxvZyhcItCh0LHQvtGAINC40L3RhNC+0YDQvNCw0YbQuNC4INC+INC80LDQutGB0LjQvNCw0LvRjNC90L7QuSDRgdGC0YDQsNC90YbQuNC1INC/0YDQvtGC0L7QutC+0LvQsCDRgdC40L3QtNC40LrQsNGC0LBcIiwgMCwgMCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfWNhdGNoIChlKXtcclxuICAgIGVycm9yTG9nKFwi0YHQsdC+0YDQtSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDQvNCw0LrRgdC40LzQsNC70YzQvdC+0Lkg0YHRgtGA0LDQvdGG0LjQtSDQv9GA0L7RgtC+0LrQvtC70LAg0YHQuNC90LTQuNC60LDRgtCwXCIsIDEsIGUpO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZSgpe1xyXG4gICAgdmFyIHBhZ2U7XHJcblxyXG4gICAgcGFnZSA9ICQoJGFuc3dlcikuZmluZChgYjpjb250YWlucyhcIn7Qn9GA0L7RgtC+0LrQvtC7INGB0LjQvdC00LjQutCw0YLQsCAjJHskY2Quc2lkfVwiKWApLnVwKCdkaXYnKS5uZXh0KCdjZW50ZXInKS5maW5kKCdhJyk7XHJcbiAgICBwYWdlID0gcGFnZS5ub2RlKC0xKS5ocmVmLnNwbGl0KCdwYWdlX2lkPScpWzFdO1xyXG5cclxuICAgIHJldHVybiBOdW1iZXIocGFnZSk7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwYXJzZVNpbmRpY2F0ZUxvZyhpbmRleCl7XHJcbiAgdmFyIHVybDtcclxuXHJcbiAgaWYoaW5kZXggIT0gLTEpe1xyXG4gICAgdXJsID0gYGh0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L3N5bmRpY2F0ZS5sb2cucGhwP2lkPSR7JGNkLnNpZH0mcGFnZV9pZD0ke2luZGV4fWA7XHJcblxyXG4gICAgdHJ5e1xyXG4gICAgICBSRVEodXJsLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgIGRpc3BsYXlQcm9ncmVzcygnd29yaycpO1xyXG4gICAgICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgJCgkYW5zd2VyKVxyXG4gICAgICAgICAgICAuZmluZCgnZm9udFtjb2xvcj1cImdyZWVuXCJdJylcclxuICAgICAgICAgICAgLm5vZGVBcnIoKVxyXG4gICAgICAgICAgICAucmV2ZXJzZSgpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKHBhcnNlKTtcclxuICAgICAgICAgIGluZGV4LS07XHJcblxyXG4gICAgICAgICAgaWYoJGNkLmxQYWdlICE9ICRjZC5mLmxvZykgJGNkLmYubG9nKys7XHJcblxyXG4gICAgICAgICAgY29ycmVjdGlvblRpbWUoKTtcclxuICAgICAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgnZGF0YScpO1xyXG4gICAgICAgICAgcGFyc2VTaW5kaWNhdGVMb2cuZ2tEZWxheSg3NTAsIHRoaXMsIFtpbmRleF0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICBlcnJvckxvZyhcItCh0LHQvtGAINC40L3RhNC+0YDQvNCw0YbQuNC4INGBINC/0YDQvtGC0L7QutC+0LvQsCDRgdC40L3QtNC40LrQsNGC0LBcIiwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfWNhdGNoIChlKXtcclxuICAgICAgZXJyb3JMb2coXCLRgdCx0L7RgNC1INC40L3RhNC+0YDQvNCw0YbQuNC4INGBINC/0YDQvtGC0L7QutC+0LvQsCDRgdC40L3QtNC40LrQsNGC0LBcIiwgMSwgZSk7XHJcbiAgICB9XHJcbiAgfWVsc2V7XHJcbiAgICByZW5kZXJTdGF0c1RhYmxlKCk7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ2RvbmUnKTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2Uobm9kZSl7XHJcbiAgICB2YXIgbmV4dCwgaWQsIGRhdGUsIG5hbWU7XHJcblxyXG4gICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcclxuICAgIGRhdGUgPSBub2RlLnRleHRDb250ZW50Lm1hdGNoKC8oXFxkKShcXGQpLihcXGQpKFxcZCkuKFxcZCkoXFxkKSAoXFxkKShcXGQpOihcXGQpKFxcZCkvKTtcclxuXHJcbiAgICBpZihkYXRlKXtcclxuICAgICAgbmV4dCA9ICQobm9kZSkubmV4dCgnbm9icicpLm5vZGUoKTtcclxuXHJcbiAgICAgIGlmKG5leHQudGV4dENvbnRlbnQubWF0Y2goL9C/0YDQuNC90Y/RgiDQsiDRgdC40L3QtNC40LrQsNGCLykpe1xyXG4gICAgICAgIHNldERhdGUoJ2VudGVyJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKG5leHQudGV4dENvbnRlbnQubWF0Y2goL9Cy0YvRiNC10Lsg0LjQtyDRgdC40L3QtNC40LrQsNGC0LAvKSl7XHJcbiAgICAgICAgc2V0RGF0ZSgnZXhpdCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBpZihuZXh0LnRleHRDb250ZW50Lm1hdGNoKC/Qv9C+0LrQuNC90YPQuyDRgdC40L3QtNC40LrQsNGCLykpe1xyXG4gICAgICAgIHNldERhdGUoJ2V4aXQnKTtcclxuICAgICAgfVxyXG4gICAgICBpZihuZXh0LnRleHRDb250ZW50Lm1hdGNoKC/Qv9GA0LjQs9C70LDRgdC40Lsg0LIg0YHQuNC90LTQuNC60LDRgi8pKXtcclxuICAgICAgICBzZXRJbnZpdGUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBzZXREYXRlKGtleSl7XHJcbiAgICAgIHZhciBleHRyYTtcclxuXHJcbiAgICAgIGlkID0gJChuZXh0KS5maW5kKCdhW2hyZWYqPVwiaW5mby5waHBcIl0nKTtcclxuICAgICAgbmFtZSA9IGlkLnRleHQoKTtcclxuICAgICAgZGF0ZSA9IGAke2RhdGVbM119JHtkYXRlWzRdfS8ke2RhdGVbMV19JHtkYXRlWzJdfS8yMCR7ZGF0ZVs1XX0ke2RhdGVbNl19ICR7ZGF0ZVs3XX0ke2RhdGVbOF19OiR7ZGF0ZVs5XX0ke2RhdGVbMTBdfWA7XHJcbiAgICAgIGRhdGUgPSBEYXRlLnBhcnNlKGRhdGUpIC8gMTAwMDtcclxuXHJcbiAgICAgIGlmKGlkLmxlbmd0aCAhPSAwKXtcclxuICAgICAgICBpZCA9IGlkLm5vZGUoKS5ocmVmO1xyXG4gICAgICAgIGlkID0gTnVtYmVyKGlkLm1hdGNoKC8oXFxkKykvKVsxXSk7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIG5hbWUgPSBuZXh0LnRleHRDb250ZW50Lm1hdGNoKC8oLispINC/0L7QutC40L3Rg9C7INGB0LjQvdC00LjQutCw0YIgXFwoKC4rKVxcKS8pWzFdO1xyXG4gICAgICAgIGlkID0gJGNkLm5hbWVUb0lkW25hbWVdO1xyXG4gICAgICAgIGV4dHJhID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYoaWQgIT0gbnVsbCl7XHJcbiAgICAgICAgaWYoJHNkLnBsYXllcnNbaWRdID09IG51bGwpICRzZC5wbGF5ZXJzW2lkXSA9IGdlbmVyYXRlUGxheWVyKG5hbWUpO1xyXG4gICAgICAgIGlmKCRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF0gPT0gbnVsbCkgJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXSA9IGdlbmVyYXRlRm9ydW1QbGF5ZXIoKTtcclxuXHJcbiAgICAgICAgJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXS5nb0F3YXkgPSBleHRyYSA/IDEgOiAwO1xyXG4gICAgICAgICRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF1ba2V5XSA9IGRhdGU7XHJcbiAgICAgIH1lbHNlIGlmKG5hbWUgIT0gbnVsbCl7XHJcbiAgICAgICAgaWYoJHNkLmtpY2tlZFskY2QuZmlkXSA9PSBudWxsKSAkc2Qua2lja2VkWyRjZC5maWRdID0ge307XHJcbiAgICAgICAgJHNkLmtpY2tlZFskY2QuZmlkXVtuYW1lXSA9IGRhdGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gc2V0SW52aXRlKCl7XHJcbiAgICAgIHZhciBuYW1lLCBpZDtcclxuICAgICAgbmFtZSA9IG5leHQudGV4dENvbnRlbnQubWF0Y2goLyguKykg0L/RgNC40LPQu9Cw0YHQuNC7INCyINGB0LjQvdC00LjQutCw0YIgKC4rKS8pWzJdO1xyXG4gICAgICBpZCA9ICRjZC5uYW1lVG9JZFtuYW1lXTtcclxuXHJcbiAgICAgIGlmKGlkICE9IG51bGwpe1xyXG4gICAgICAgIGlmICgkc2QucGxheWVyc1tpZF0gPT0gbnVsbCkgJHNkLnBsYXllcnNbaWRdID0gZ2VuZXJhdGVQbGF5ZXIobmFtZSk7XHJcbiAgICAgICAgaWYgKCRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF0gPT0gbnVsbCkgJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXSA9IGdlbmVyYXRlRm9ydW1QbGF5ZXIoKTtcclxuXHJcbiAgICAgICAgJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXS5pbnZpdGUgPSAxO1xyXG4gICAgICB9ZWxzZSBpZihuYW1lICE9IG51bGwpe1xyXG4gICAgICAgIGlmKCRzZC5pbnZpdGUgPT0gbnVsbCkgJHNkLmludml0ZSA9IHt9O1xyXG4gICAgICAgIGlmKCRzZC5pbnZpdGVbJGNkLmZpZF0gPT0gbnVsbCkgJHNkLmludml0ZVskY2QuZmlkXSA9IHt9O1xyXG4gICAgICAgICRzZC5pbnZpdGVbJGNkLmZpZF1bbmFtZV0gPSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRNYXhQYWdlRm9ydW0oKXtcclxuICB2YXIgdXJsLCBwYWdlO1xyXG5cclxuICB1cmwgPSBcImh0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L3RocmVhZHMucGhwP2ZpZD1cIiArICRmb3J1bS5pZCArIFwiJnBhZ2VfaWQ9MTAwMDAwMDBcIjtcclxuXHJcbiAgJGFuc3dlci5pbm5lckhUTUwgPSBhd2FpdCBhamF4KHVybCwgXCJHRVRcIiwgbnVsbCk7XHJcblxyXG4gICRmb3J1bS5wYWdlWzFdID0gcGFyc2UoKTtcclxuICBwYWdlID0gJGZvcnVtLnBhZ2VbMV0gLSAkZm9ydW0ucGFnZVswXTtcclxuXHJcbiAgJGlkYi5hZGQoXCJmb3J1bXNcIiwgcmVwYWNrKCRmb3J1bSwgXCJmb3J1bVwiKSk7XHJcblxyXG4gIGRpc3BsYXlQcm9ncmVzcygnc3RhcnQnLCBg0J7QsdGA0LDQsdC+0YLQutCwINGE0L7RgNGD0LzQsCDRgdC40L3QtNC40LrQsNGC0LAgIyR7JGZvcnVtLmlkfSDCqyR7JGZvcnVtLm5hbWV9wrtgLCAwLCBwYWdlICsgMSk7XHJcbiAgZGlzcGxheVByb2dyZXNzVGltZShwYWdlICogMTI1MCArIDE1MDApO1xyXG5cclxuICBwYXJzZUZvcnVtLmdrRGVsYXkoNzUwLCB0aGlzLCBbcGFnZSwgdHJ1ZV0pO1xyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZSgpe1xyXG4gICAgdmFyIHBhZ2U7XHJcblxyXG4gICAgcGFnZSA9ICQoJGFuc3dlcikuZmluZCgnYVtzdHlsZT1cImNvbG9yOiAjOTkwMDAwXCJdOmNvbnRhaW5zKFwiftCk0L7RgNGD0LzRi1wiKScpLnVwKCdiJykubmV4dCgnY2VudGVyJykuZmluZCgnYScpO1xyXG4gICAgcGFnZSA9IHBhZ2Uubm9kZSgtMSkuaHJlZi5zcGxpdCgncGFnZV9pZD0nKVsxXTtcclxuXHJcbiAgICByZXR1cm4gTnVtYmVyKHBhZ2UpO1xyXG4gIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHBhcnNlRm9ydW0oaW5kZXgsIG1vZGUsIHN0b3BEYXRlKXtcclxuICB2YXIgdXJsLCBjb3VudDtcclxuXHJcbiAgdXJsID0gYGh0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L3RocmVhZHMucGhwP2ZpZD0keyRjZC5maWR9JnBhZ2VfaWQ9JHtpbmRleH1gO1xyXG4gIGNvdW50ID0gMDtcclxuXHJcbiAgaWYoaW5kZXggIT0gLTEpIHtcclxuXHJcbiAgICAkYW5zd2VyLmlubmVySFRNTCA9IGF3YWl0IGFqYXgodXJsLCBcIkdFVFwiLCBudWxsKTtcclxuICAgIGRpc3BsYXlQcm9ncmVzcygnd29yaycpO1xyXG5cclxuICAgICQoJGFuc3dlcilcclxuICAgICAgLmZpbmQoJ3RkW3N0eWxlPVwiY29sb3I6ICM5OTAwMDBcIl06Y29udGFpbnMoXCLQotC10LzQsFwiKScpXHJcbiAgICAgIC51cCgndGFibGUnKVxyXG4gICAgICAuZmluZCgndHJbYmdjb2xvcj1cIiNlMGVlZTBcIl0sW2JnY29sb3I9XCIjZDBmNWQwXCJdJylcclxuICAgICAgLm5vZGVBcnIoKVxyXG4gICAgICAuZm9yRWFjaChwYXJzZSk7XHJcblxyXG4gICAgaW5kZXggPSAkZm9ydW0uc2lkID8gaW5kZXggLSAxIDogaW5kZXggKyAxO1xyXG4gICAgaWYoJGZvcnVtLnNpZCAmJiAkZm9ydW0ucGFnZVswXSAhPSAkZm9ydW0ucGFnZVsxXSkgJGZvcnVtLnBhZ2VbMF0rKztcclxuXHJcbiAgICAvL2NvcnJlY3Rpb25UaW1lKCk7XHJcbiAgICAvL2NhbGNOZXdUaGVtZXMoKTtcclxuICAgIC8vc2F2ZVRvTG9jYWxTdG9yYWdlKCdkYXRhJyk7XHJcblxyXG5cclxuXHJcbiAgICAvL3BhcnNlRm9ydW0uZ2tEZWxheSg3NTAsIHRoaXMsIFtpbmRleCwgbW9kZSwgc3RvcERhdGVdKTtcclxuXHJcbiAgICAvL3RyeXtcclxuICAgIC8vICBSRVEodXJsLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgIC8vICAgIGZ1bmN0aW9uKHJlcSl7XHJcbiAgICAvLyAgICAgIGRpc3BsYXlQcm9ncmVzcygnd29yaycpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgLy8gICAgICAkKCRhbnN3ZXIpXHJcbiAgICAvLyAgICAgICAgLmZpbmQoJ3RkW3N0eWxlPVwiY29sb3I6ICM5OTAwMDBcIl06Y29udGFpbnMoXCLQotC10LzQsFwiKScpXHJcbiAgICAvLyAgICAgICAgLnVwKCd0YWJsZScpXHJcbiAgICAvLyAgICAgICAgLmZpbmQoJ3RyW2JnY29sb3I9XCIjZTBlZWUwXCJdLFtiZ2NvbG9yPVwiI2QwZjVkMFwiXScpXHJcbiAgICAvLyAgICAgICAgLm5vZGVBcnIoKVxyXG4gICAgLy8gICAgICAgIC5mb3JFYWNoKHBhcnNlKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgIGluZGV4ID0gbW9kZSA/IGluZGV4IC0gMSA6IGluZGV4ICsgMTtcclxuICAgIC8vICAgICAgaWYobW9kZSAmJiAkY2QuZlBhZ2UgIT0gJGNkLmYucGFnZSkgJGNkLmYucGFnZSsrO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgY29ycmVjdGlvblRpbWUoKTtcclxuICAgIC8vICAgICAgY2FsY05ld1RoZW1lcygpO1xyXG4gICAgLy8gICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgIC8vICAgICAgcGFyc2VGb3J1bS5na0RlbGF5KDc1MCwgdGhpcywgW2luZGV4LCBtb2RlLCBzdG9wRGF0ZV0pO1xyXG4gICAgLy8gICAgfSxcclxuICAgIC8vICAgIGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgIGVycm9yTG9nKFwi0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YLQtdC80LDRhVwiLCAwLCAwKTtcclxuICAgIC8vICAgIH1cclxuICAgIC8vICApO1xyXG4gICAgLy99Y2F0Y2goZSl7XHJcbiAgICAvLyAgZXJyb3JMb2coXCLRgdCx0L7RgNC1INC40L3RhNC+0YDQvNCw0YbQuNC4INC+INGC0LXQvNCw0YVcIiwgMSwgZSk7XHJcbiAgICAvL31cclxuICB9ZWxzZXtcclxuICAgIC8vc2F2ZVRvTG9jYWxTdG9yYWdlKCdkYXRhJyk7XHJcbiAgICAvL3JlbmRlclRhYmxlcygpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcblxyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBhc3luYyBmdW5jdGlvbiBwYXJzZSh0cil7XHJcbiAgICB2YXIgdGQsIHRpZCwgdGhlbWUsIHBsYXllciwgbWVtYmVyO1xyXG5cclxuICAgIHRkID0gdHIuY2VsbHM7XHJcbiAgICB0aWQgPSBnZXRJZCgpO1xyXG5cclxuICAgIC8vZGF0ZSA9IGdldERhdGUoKTtcclxuXHJcbiAgICB0aGVtZSA9IGF3YWl0ICRpZGIuZ2V0T25lKGB0aGVtZXNfJHskZm9ydW0uaWR9YCwgXCJpZFwiLCB0aWQpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiQmVnaW46XCIpO1xyXG5cclxuICAgIGlmKHRoZW1lID09IG51bGwpe1xyXG4gICAgICAkZm9ydW0udGhlbWVzWzFdKys7XHJcbiAgICAgICRpZGIuYWRkKGBmb3J1bXNgLCByZXBhY2soJGZvcnVtLCBcImZvcnVtXCIpKTtcclxuXHJcbiAgICAgIHRoZW1lID0gZ2VuZXJhdGVUaGVtZXModGlkKTtcclxuICAgICAgdGhlbWUubmFtZSA9IGdldE5hbWUoKTtcclxuICAgICAgdGhlbWUuYXV0aG9yID0gZ2V0QXV0aG9yKCk7XHJcbiAgICAgIHRoZW1lLnBvc3RzID0gZ2V0UG9zdHMoKTtcclxuICAgICAgdGhlbWUucGFnZXMgPSBnZXRQYWdlcygpO1xyXG4gICAgICB0aGVtZS5zdGFydCA9IGdldERhdGUoKTtcclxuICAgIH1lbHNle1xyXG4gICAgICB0aGVtZSA9IHJlcGFjayh0aGVtZSwgXCJ0aGVtZVwiKTtcclxuICAgICAgdGhlbWUucG9zdHMgPSBnZXRQb3N0cygpO1xyXG4gICAgICB0aGVtZS5wYWdlcyA9IGdldFBhZ2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgJGlkYi5hZGQoYHRoZW1lc18keyRmb3J1bS5pZH1gLCByZXBhY2sodGhlbWUsIFwidGhlbWVcIikpO1xyXG4gICAgcGxheWVyID0gYXdhaXQgJGlkYi5nZXRPbmUoYHBsYXllcnNgLCBcImlkXCIsIHRoZW1lLmF1dGhvclswXSk7XHJcblxyXG4gICAgaWYocGxheWVyID09IG51bGwpe1xyXG4gICAgICBwbGF5ZXIgPSBnZW5lcmF0ZVBsYXllcnModGhlbWUuYXV0aG9yWzBdKTtcclxuICAgICAgcGxheWVyLm5hbWUgPSB0aGVtZS5hdXRob3JbMV07XHJcbiAgICAgIHBsYXllci5mb3J1bXMucHVzaCgkZm9ydW0uaWQpO1xyXG5cclxuICAgICAgbWVtYmVyID0gZ2VuZXJhdGVNZW1iZXJzKHRoZW1lLmF1dGhvclswXSk7XHJcbiAgICAgIG1lbWJlci5zdGFydC5wdXNoKHRoZW1lLmlkKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBwbGF5ZXIgPSByZXBhY2socGxheWVyLCBcInBsYXllclwiKTtcclxuICAgICAgaWYoISRjLmV4aXN0KCRmb3J1bS5pZCwgcGxheWVyLmZvcnVtcykpIHBsYXllci5mb3J1bXMucHVzaCgkZm9ydW0uaWQpO1xyXG5cclxuICAgICAgbWVtYmVyID0gYXdhaXQgJGlkYi5nZXRPbmUoYG1lbWJlcnNfJHskZm9ydW0uaWR9YCwgXCJpZFwiLCBwbGF5ZXIuaWQpO1xyXG4gICAgICBtZW1iZXIgPSByZXBhY2sobWVtYmVyLCBcIm1lbWJlclwiKTtcclxuXHJcbiAgICAgIGlmKCEkYy5leGlzdCh0aGVtZS5pZCwgbWVtYmVyLnN0YXJ0KSl7XHJcbiAgICAgICAgbWVtYmVyLnN0YXJ0LnB1c2godGhlbWUuaWQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG1lbWJlcik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUUlVFXCIpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkZBTFNFXCIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgJGlkYi5hZGQoYHBsYXllcnNgLCByZXBhY2socGxheWVyLCBcInBsYXllclwiKSk7XHJcblxyXG4gICAgbWVtYmVyID0gcmVwYWNrKG1lbWJlciwgXCJtZW1iZXJcIik7XHJcbiAgICBjb25zb2xlLmxvZyhtZW1iZXIpO1xyXG5cclxuICAgICRpZGIuYWRkKGBtZW1iZXJzXyR7JGZvcnVtLmlkfWAsIG1lbWJlcik7XHJcblxyXG4gICAgdmFyIHQgPSBhd2FpdCAkaWRiLmdldE9uZShgbWVtYmVyc18keyRmb3J1bS5pZH1gLCBcImlkXCIsIHBsYXllci5pZCk7XHJcbiAgICBjb25zb2xlLmxvZyhcIk06XCIpO1xyXG4gICAgY29uc29sZS5sb2codCk7XHJcblxyXG4gICAgLy9jb25zb2xlLmxvZyh0aGVtZSk7XHJcbiAgICAvL2NvbnNvbGUubG9nKHBsYXllcik7XHJcbiAgICBjb25zb2xlLmxvZyhcIkVuZCAtLS0tXCIpO1xyXG4gICAgLy9pZihtb2RlKXtcclxuICAgIC8vICBhZGRUaGVtZSgpO1xyXG4gICAgLy99ZWxzZXtcclxuICAgIC8vICBpZihzdG9wRGF0ZSAhPSBudWxsICYmIHN0b3BEYXRlIDwgZGF0ZSl7XHJcbiAgICAvLyAgICBhZGRUaGVtZSgpO1xyXG4gICAgLy8gIH1lbHNle1xyXG4gICAgLy8gICAgY291bnQrKztcclxuICAgIC8vICAgIGlmKGNvdW50ID09IDUpe1xyXG4gICAgLy8gICAgICBpbmRleCA9IC0yO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gIH1cclxuICAgIC8vfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRJZCgpe1xyXG4gICAgICB2YXIgaWQ7XHJcblxyXG4gICAgICBpZCA9ICQodGRbMF0pLmZpbmQoJ2EnKS5ub2RlKCk7XHJcbiAgICAgIGlkID0gaWQuaHJlZi5zcGxpdCgndGlkPScpWzFdO1xyXG5cclxuICAgICAgcmV0dXJuIE51bWJlcihpZCk7XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldE5hbWUoKXtcclxuICAgICAgcmV0dXJuICQodGRbMF0pLmZpbmQoJ2EnKS50ZXh0KCk7XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFBvc3RzKCl7XHJcbiAgICAgIHZhciBwb3N0cztcclxuXHJcbiAgICAgIHBvc3RzID0gJCh0ZFsyXSkudGV4dCgpLnJlcGxhY2UoLywvZywgJycpO1xyXG4gICAgICBwb3N0cyA9IE51bWJlcihwb3N0cyk7XHJcblxyXG4gICAgICBpZih0aGVtZSA9PSBudWxsKXtcclxuICAgICAgICByZXR1cm4gWzAsIHBvc3RzXTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIFt0aGVtZS5wb3N0c1swXSwgcG9zdHNdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFBhZ2VzKCl7XHJcbiAgICAgIHZhciBwYWdlO1xyXG5cclxuICAgICAgcGFnZSA9IFtcclxuICAgICAgICBwYXJzZUludCh0aGVtZS5wb3N0c1swXSAvIDIwLCAxMCksXHJcbiAgICAgICAgcGFyc2VJbnQodGhlbWUucG9zdHNbMV0gLyAyMCwgMTApXHJcbiAgICAgIF07XHJcblxyXG4gICAgICByZXR1cm4gcGFnZTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0RGF0ZSgpe1xyXG4gICAgICB2YXIgZGF0ZTtcclxuXHJcbiAgICAgIGRhdGUgPSB0ci5wcmV2aW91c1NpYmxpbmcuZGF0YTtcclxuICAgICAgZGF0ZSA9IGRhdGUubWF0Y2goLyhcXGQrKS9nKTtcclxuICAgICAgZGF0ZSA9IGAke2RhdGVbMV19LyR7ZGF0ZVsyXX0vJHtkYXRlWzBdfSAke2RhdGVbM119OiR7ZGF0ZVs0XX06JHtkYXRlWzVdfWA7XHJcbiAgICAgIGRhdGUgPSBEYXRlLnBhcnNlKGRhdGUpIC8gMTAwMDtcclxuXHJcbiAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRBdXRob3IoKXtcclxuICAgICAgdmFyIGEsIG5hbWUsIGlkO1xyXG5cclxuICAgICAgYSA9ICQodGRbM10pLmZpbmQoJ2FbaHJlZio9XCJpbmZvLnBocFwiXScpO1xyXG4gICAgICBuYW1lID0gYS50ZXh0KCk7XHJcbiAgICAgIGlkID0gYS5ub2RlKCkuaHJlZi5tYXRjaCgvKFxcZCspLylbMF07XHJcblxyXG4gICAgICByZXR1cm4gW051bWJlcihpZCksIG5hbWVdO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBjYWxjTmV3VGhlbWVzKCl7XHJcbiAgICB2YXIgdGhlbWVzO1xyXG5cclxuICAgIHRoZW1lcyA9ICRjZC5mLnRoZW1lcztcclxuICAgICRjZC5mLnRocmVhZHMubmV3ID0gJGNkLmYudGhyZWFkcy5hbGw7XHJcblxyXG4gICAgT2JqZWN0LmtleXModGhlbWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHRpZCl7XHJcbiAgICAgIGlmKHRoZW1lc1t0aWRdLnBvc3RzWzBdID09IHRoZW1lc1t0aWRdLnBvc3RzWzFdKXtcclxuICAgICAgICAkY2QuZi50aHJlYWRzLm5ldy0tO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHByZXBhcmVQYXJzZVRoZW1lcyhtYXgpe1xyXG4gIHZhciB0aGVtZXMsIHRpZCwgbGlzdCwgY291bnQ7XHJcblxyXG4gIHRoZW1lcyA9ICRjZC5mLnRoZW1lcztcclxuICBsaXN0ID0gW107XHJcbiAgY291bnQgPSAwO1xyXG5cclxuICBmb3IodGlkIGluIHRoZW1lcyl7XHJcbiAgICBpZih0aGVtZXNbdGlkXS5wb3N0c1swXSAhPSB0aGVtZXNbdGlkXS5wb3N0c1sxXSl7XHJcbiAgICAgIGxpc3QucHVzaCh0aWQpO1xyXG4gICAgICBjb3VudCArPSBjYWxjdWxhdGVUaGVtZVBhZ2VzKE51bWJlcih0aWQpKS5jb3VudDtcclxuICAgICAgaWYobGlzdC5sZW5ndGggPT0gbWF4KSBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgY291bnQgPSBsaXN0Lmxlbmd0aCAqIDc1MCArIGNvdW50ICogMTI1MCArIDUwMDtcclxuICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKGNvdW50KTtcclxuICBwYXJzZVRoZW1lcygwLCBsaXN0Lmxlbmd0aCwgbGlzdCk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVRoZW1lUGFnZXMoaWQpe1xyXG4gIHZhciB0aGVtZSwgcGFnZXMsIHNQYWdlLCBzdGFydDtcclxuXHJcbiAgdGhlbWUgPSAkY2QuZi50aGVtZXNbaWRdO1xyXG5cclxuICBwYWdlcyA9IHRoZW1lLnBvc3RzWzFdIC8gMjA7XHJcbiAgcGFnZXMgPSBwYWdlcyA8IDEgPyAwIDogcGFyc2VJbnQocGFnZXMsIDEwKTtcclxuXHJcbiAgc1BhZ2UgPSB0aGVtZS5wb3N0c1swXSAvIDIwO1xyXG4gIHNQYWdlID0gc1BhZ2UgPCAxID8gMCA6IHBhcnNlSW50KHNQYWdlLCAxMCk7XHJcblxyXG4gIHN0YXJ0ID0gKHRoZW1lLnBvc3RzWzBdICUgMjApICsgMTtcclxuXHJcbiAgcmV0dXJuIHtpZDogc1BhZ2UgLCBjb3VudDogcGFnZXMgKyAxLCBzdGFydDogc3RhcnR9O1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwYXJzZVRoZW1lcyhpbmRleCwgbWF4LCBsaXN0KXtcclxuICB2YXIgaW5mbywgdGhlbWU7XHJcblxyXG4gICRjZC50aWQgPSBOdW1iZXIobGlzdFtpbmRleF0pO1xyXG4gIHRoZW1lID0gJGNkLmYudGhlbWVzWyRjZC50aWRdO1xyXG5cclxuICBpZihpbmRleCA8IG1heCl7XHJcbiAgICBpbmZvID0gY2FsY3VsYXRlVGhlbWVQYWdlcygkY2QudGlkKTtcclxuICAgIHBhcnNlVGhlbWUoaW5mby5pZCwgaW5mby5jb3VudCwgaW5mby5zdGFydCk7XHJcbiAgfWVsc2V7XHJcbiAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgIHJlbmRlclRhYmxlcygpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VUaGVtZShpZCwgY291bnQsIHN0YXJ0KXtcclxuICAgIHZhciB1cmw7XHJcblxyXG4gICAgJGNkLnRQYWdlID0gaWQ7XHJcbiAgICB1cmwgPSAnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvbWVzc2FnZXMucGhwP2ZpZD0nICsgJGNkLmZpZCArICcmdGlkPScrICRjZC50aWQgKycmcGFnZV9pZD0nICsgJGNkLnRQYWdlO1xyXG5cclxuICAgIGlmKGlkIDwgY291bnQpe1xyXG4gICAgICB0cnl7XHJcbiAgICAgICAgUkVRKHVybCwgJ0dFVCcsIG51bGwsIHRydWUsXHJcbiAgICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICBwYXJzZSgpO1xyXG4gICAgICAgICAgICBjb3JyZWN0aW9uVGltZSgpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgICBlcnJvckxvZygn0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YHQvtC+0LHRidC10L3QuNGP0YUnLCAwLCAwKTtcclxuICAgICAgICAgICAgbmV4dFBhZ2VUaGVtZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgICAgZXJyb3JMb2coJ9GB0LHQvtGA0LUg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YHQvtC+0LHRidC10L3QuNGP0YUnLCAxLCBlKTtcclxuICAgICAgICBuZXh0UGFnZVRoZW1lKCk7XHJcbiAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICBuZXh0VGhlbWUoKTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlKCl7XHJcbiAgICAgIHZhciB0YWJsZSwgdHIsIHBpZCwgcGxheWVyLCBwZiwgdztcclxuICAgICAgdmFyIGksIGxlbmd0aDtcclxuXHJcbiAgICAgIHRhYmxlID0gJCgkYW5zd2VyKS5maW5kKCd0ZFtzdHlsZT1cImNvbG9yOiAjOTkwMDAwXCJdOmNvbnRhaW5zKFwi0JDQstGC0L7RgFwiKScpLnVwKCd0YWJsZScpLm5vZGUoKTtcclxuXHJcbiAgICAgICQodGFibGUpLmZpbmQoJ2ZvbnQ6Y29udGFpbnMoXCJ+0KLQtdC80LAg0LfQsNC60YDRi9GC0LBcIiknKS5ub2RlQXJyKCkuZm9yRWFjaChcclxuICAgICAgICBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICAgIG5vZGUgPSAkKG5vZGUpLnVwKCd0cicpLm5vZGUoKTtcclxuICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICAgIHRyID0gdGFibGUucm93cztcclxuICAgICAgbGVuZ3RoID0gdHIubGVuZ3RoO1xyXG5cclxuICAgICAgZm9yKGkgPSBzdGFydDsgaSA8IGxlbmd0aDsgaSsrKXtcclxuICAgICAgICBwaWQgPSBnZXRJZCgpO1xyXG5cclxuICAgICAgICBpZigkc2QucGxheWVyc1twaWRdID09IG51bGwpe1xyXG4gICAgICAgICAgJHNkLnBsYXllcnNbcGlkXSA9IGdlbmVyYXRlUGxheWVyKGdldE5hbWUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBsYXllciA9ICRzZC5wbGF5ZXJzW3BpZF07XHJcblxyXG4gICAgICAgIGlmKHBsYXllci5mb3J1bXNbJGNkLmZpZF0gPT0gbnVsbCl7XHJcbiAgICAgICAgICBwbGF5ZXIuZm9ydW1zWyRjZC5maWRdID0gZ2VuZXJhdGVGb3J1bVBsYXllcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwZiA9IHBsYXllci5mb3J1bXNbJGNkLmZpZF07XHJcblxyXG4gICAgICAgIHRoZW1lLnBvc3RzWzBdKys7XHJcbiAgICAgICAgJGNkLmYucG9zdHMrKztcclxuXHJcbiAgICAgICAgcGYucG9zdHMrKztcclxuICAgICAgICBwZi5sYXN0ID0gZ2V0TGFzdERhdGUoKTtcclxuXHJcbiAgICAgICAgdyA9IGdldFdvcmRzKCk7XHJcbiAgICAgICAgJGNkLmYud29yZHMgKz0gdztcclxuICAgICAgICBwZi53b3Jkc1swXSArPSB3O1xyXG4gICAgICAgIHBmLndvcmRzWzFdID0gcGFyc2VJbnQocGYud29yZHNbMF0gLyBwZi5wb3N0cywgMTApO1xyXG5cclxuICAgICAgICBpZighcGYudGhlbWVzLmdrRXhpc3QoJGNkLnRpZCkpe1xyXG4gICAgICAgICAgcGYudGhlbWVzLnB1c2goJGNkLnRpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBuZXh0UGFnZVRoZW1lKCk7XHJcbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRJZCgpe1xyXG4gICAgICAgIHZhciBpZDtcclxuXHJcbiAgICAgICAgaWQgPSAkKHRyW2ldLmNlbGxzWzBdKS5maW5kKCdhW2hyZWYqPVwiaW5mby5waHBcIl0nKS5ub2RlKCk7XHJcbiAgICAgICAgaWQgPSBpZC5ocmVmLm1hdGNoKC8oXFxkKykvKVsxXTtcclxuICAgICAgICBpZCA9IE51bWJlcihpZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgICAgfVxyXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0TmFtZSgpe1xyXG4gICAgICAgIHJldHVybiAkKHRyW2ldLmNlbGxzWzBdKS5maW5kKCdhW2hyZWYqPVwiaW5mby5waHBcIl0nKS50ZXh0KCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldExhc3REYXRlKCl7XHJcbiAgICAgICAgdmFyIGRhdGU7XHJcblxyXG4gICAgICAgIGRhdGUgPSAkKHRyW2ldLmNlbGxzWzFdKS5maW5kKCd0ZFthbGlnbj1cImxlZnRcIl06Y29udGFpbnMoXCJ+0L3QsNC/0LjRgdCw0L3QvlwiKScpLnRleHQoKTtcclxuXHJcbiAgICAgICAgZGF0ZSA9IGRhdGUubWF0Y2goLyguKyk6IChcXGQrKS0oXFxkKyktKFxcZCspICguKynCoC8pO1xyXG4gICAgICAgIGRhdGUgPSBgJHtkYXRlWzNdfS8ke2RhdGVbNF19LyR7ZGF0ZVsyXX0gJHtkYXRlWzVdfWA7XHJcbiAgICAgICAgZGF0ZSA9IERhdGUucGFyc2UoZGF0ZSkgLyAxMDAwO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0ZSA+IHBmLmxhc3QgPyBkYXRlIDogcGYubGFzdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0V29yZHMoKXtcclxuICAgICAgICB2YXIgd29yZHM7XHJcblxyXG4gICAgICAgIHdvcmRzID0gJCh0cltpXS5jZWxsc1sxXSkuZmluZCgndGFibGVbY2VsbHBhZGRpbmc9XCI1XCJdJykudGV4dCgpO1xyXG4gICAgICAgIHdvcmRzID0gKHdvcmRzLnJlcGxhY2UoL1xcc1snXCI7OiwuP8K/XFwtIcKhXS9nLCAnJykubWF0Y2goL1xccysvZykgfHwgW10pLmxlbmd0aCArIDE7XHJcblxyXG4gICAgICAgIHJldHVybiB3b3JkcztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBuZXh0VGhlbWUoKXtcclxuICAgICAgaW5kZXgrKztcclxuICAgICAgJGNkLmYudGhyZWFkcy5uZXctLTtcclxuICAgICAgZGlzcGxheVByb2dyZXNzKCd3b3JrJyk7XHJcbiAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgnZGF0YScpO1xyXG4gICAgICBwYXJzZVRoZW1lcy5na0RlbGF5KDc1MCwgdGhpcywgW2luZGV4LCBtYXgsIGxpc3RdKTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gbmV4dFBhZ2VUaGVtZSgpe1xyXG4gICAgICBpZCsrO1xyXG4gICAgICBkaXNwbGF5UHJvZ3Jlc3MuZ2tEZWxheSg3NTAsIHRoaXMsIFsnZXh0cmEnLCBgPGJyPjxiPtCi0LXQvNCwOjwvYj4gPGk+JHskY2QuZi50aGVtZXNbJGNkLnRpZF0ubmFtZX08L2k+IFske2lkfS8ke2NvdW50fV1gXSk7XHJcbiAgICAgIHBhcnNlVGhlbWUuZ2tEZWxheSg3NTAsIHRoaXMsIFtpZCwgY291bnQsIDFdKTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwcmVwYXJlUGFyc2VNZW1iZXJzKGNvdW50KXtcclxuICB2YXIgbGVuZ3RoLCBwbGF5ZXIsIGxpc3Q7XHJcblxyXG4gIGxlbmd0aCA9IGNvdW50ICE9IG51bGwgPyBjb3VudCA6ICRjZC5jb3VudE1lbWJlcnM7XHJcbiAgbGlzdCA9IFtdO1xyXG5cclxuICB3aGlsZShsZW5ndGgtLSl7XHJcbiAgICBwbGF5ZXIgPSAkc2QucGxheWVyc1skY2QubWVtYmVyc1tsZW5ndGhdXTtcclxuICAgIGlmKGNvdW50ID09IG51bGwpe1xyXG4gICAgICBsaXN0LnB1c2goJGNkLm1lbWJlcnNbbGVuZ3RoXSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgaWYocGxheWVyLnN0YXR1cy50ZXh0ID09ICcnKXtcclxuICAgICAgICBsaXN0LnB1c2goJGNkLm1lbWJlcnNbbGVuZ3RoXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgY291bnQgPSBsaXN0Lmxlbmd0aCAqIDc1MCArIDUwMDtcclxuICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKGNvdW50KTtcclxuXHJcbiAgcGFyc2VNZW1iZXJzKDAsIGxpc3QubGVuZ3RoLCBsaXN0KTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gcGFyc2VNZW1iZXJzKGlkLCBjb3VudCwgbGlzdCl7XHJcbiAgdmFyIHVybCwgcGxheWVyO1xyXG5cclxuICBpZihpZCA8IGNvdW50KXtcclxuICAgIHBsYXllciA9ICRzZC5wbGF5ZXJzW2xpc3RbaWRdXTtcclxuICAgIHVybCA9IGBodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9pbmZvLnBocD9pZD0ke2xpc3RbaWRdfWA7XHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSh1cmwsICdHRVQnLCBudWxsLCB0cnVlLFxyXG4gICAgICAgIGZ1bmN0aW9uIChyZXEpe1xyXG4gICAgICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgcGFyc2UoKTtcclxuICAgICAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgnZGF0YScpO1xyXG4gICAgICAgICAgY29ycmVjdGlvblRpbWUoKTtcclxuICAgICAgICAgIG5leHRNZW1iZXIoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgZXJyb3JMb2coJ9Ch0LHQvtGAINGB0YLQsNGC0YPRgdCwINC/0LXRgNGB0L7QvdCw0LbQsCcsIDAsIDApO1xyXG4gICAgICAgICAgbmV4dE1lbWJlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgIGVycm9yTG9nKCfRgdCx0L7RgNC1INGB0YLQsNGC0YPRgdCwINC/0LXRgNGB0L7QvdCw0LbQsCcsIDEsIGUpO1xyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgcmVuZGVyU3RhdHNUYWJsZSgpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIG5leHRNZW1iZXIoKXtcclxuICAgIGlkKys7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MuZ2tEZWxheSg3NTAsIHRoaXMsIFsnd29yayddKTtcclxuICAgIHBhcnNlTWVtYmVycy5na0RlbGF5KDc1MCwgdGhpcywgW2lkLCBjb3VudCwgbGlzdF0pO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZSgpe1xyXG4gICAgdmFyIGJsb2NrLCBhcnJlc3QsIGJhbkRlZmF1bHQsIGJhbkNvbW1vbiwgYmFuVHJhZGUsIHN0YXR1cywgZGF0ZTtcclxuXHJcbiAgICBzdGF0dXMgPSAnT2snO1xyXG4gICAgZGF0ZSA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCwgMTApO1xyXG5cclxuICAgIGJsb2NrID0gJCgkYW5zd2VyKS5maW5kKCdmb250W2NvbG9yPVwicmVkXCJdOmNvbnRhaW5zKFwi0J/QtdGA0YHQvtC90LDQtiDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cIiknKTtcclxuICAgIGFycmVzdCA9ICQoJGFuc3dlcikuZmluZCgnY2VudGVyOmNvbnRhaW5zKFwi0J/QtdGA0YHQvtC90LDQtiDQsNGA0LXRgdGC0L7QstCw0L0sINC40L3RhNC+0YDQvNCw0YbQuNGPINGB0LrRgNGL0YLQsFwiKScpLmZpbmQoJ2ZvbnRbY29sb3I9XCIjMDAwMDk5XCJdJyk7XHJcbiAgICBiYW5EZWZhdWx0ID0gJCgkYW5zd2VyKS5maW5kKCdmb250W2NvbG9yPVwicmVkXCJdOmNvbnRhaW5zKFwiftCy0YDQtdC80LXQvdC90L4g0LfQsNCx0LDQvdC10L0g0LIg0YTQvtGA0YPQvNC1INC80L7QtNC10YDQsNGC0L7RgNC+0LxcIiknKTtcclxuICAgIGJhbkNvbW1vbiA9ICQoJGFuc3dlcikuZmluZCgnY2VudGVyOmNvbnRhaW5zKFwiftCf0LXRgNGB0L7QvdCw0LYg0L/QvtC0INC+0LHRidC40Lwg0LHQsNC90L7QvFwiKScpLmZpbmQoJ2ZvbnRbY29sb3I9XCIjMDA5OTAwXCJdJyk7XHJcbiAgICBiYW5UcmFkZSA9ICQoJGFuc3dlcikuZmluZCgnZm9udFtjb2xvcj1cInJlZFwiXTpjb250YWlucyhcIn7Qt9Cw0LHQsNC90LXQvSDQsiDRgtC+0YDQs9C+0LLRi9GFINGE0L7RgNGD0LzQsNGFXCIpJyk7XHJcblxyXG4gICAgaWYoYmFuVHJhZGUubGVuZ3RoKXtcclxuICAgICAgZGF0ZSA9IGdldERhdGUoYmFuVHJhZGUudGV4dCgpKTtcclxuICAgICAgc3RhdHVzID0gJ9Ci0L7RgNCz0L7QstGL0LknO1xyXG4gICAgfVxyXG4gICAgaWYoYXJyZXN0Lmxlbmd0aCl7XHJcbiAgICAgIGRhdGUgPSAwO1xyXG4gICAgICBzdGF0dXMgPSAn0JDRgNC10YHRgtC+0LLQsNC9JztcclxuICAgIH1cclxuICAgIGlmKGJhbkRlZmF1bHQubGVuZ3RoKXtcclxuICAgICAgZGF0ZSA9IGdldERhdGUoYmFuRGVmYXVsdC50ZXh0KCkpO1xyXG4gICAgICBzdGF0dXMgPSAn0KTQvtGA0YPQvNC90YvQuSc7XHJcbiAgICB9XHJcbiAgICBpZihiYW5Db21tb24ubGVuZ3RoKXtcclxuICAgICAgZGF0ZSA9IGdldERhdGUoYmFuQ29tbW9uLnRleHQoKSk7XHJcbiAgICAgIHN0YXR1cyA9ICfQntCx0YnQuNC5INCx0LDQvSc7XHJcbiAgICB9XHJcbiAgICBpZihibG9jay5sZW5ndGgpe1xyXG4gICAgICBkYXRlID0gMDtcclxuICAgICAgc3RhdHVzID0gJ9CX0LDQsdC70L7QutC40YDQvtCy0LDQvSc7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheWVyLnN0YXR1cy50ZXh0ID0gc3RhdHVzO1xyXG4gICAgcGxheWVyLnN0YXR1cy5kYXRlID0gZGF0ZTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0RGF0ZShzdHJpbmcpe1xyXG4gICAgdmFyIGRhdGU7XHJcblxyXG4gICAgZGF0ZSA9IHN0cmluZy5tYXRjaCgvKFxcZCspL2cpO1xyXG4gICAgZGF0ZSA9IGAke2RhdGVbM119LyR7ZGF0ZVsyXX0vMjAke2RhdGVbNF19ICR7ZGF0ZVswXX06JHtkYXRlWzFdfWA7XHJcbiAgICBkYXRlID0gRGF0ZS5wYXJzZShkYXRlKSAvIDEwMDA7XHJcblxyXG4gICAgcmV0dXJuIGRhdGU7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwcmVwYXJlU2VuZE1haWxzKCl7XHJcbiAgdmFyIHBhcmFtLCB3aW5kb3csIGNvdW50LCBtb2RlLCB0bSwgc2lkO1xyXG4gIHZhciBxdWV1ZSwgZiwgaW52aXRlcyA9IHt9O1xyXG5cclxuICBwYXJhbSA9IHtcclxuICAgIGxpc3Q6IFtdLFxyXG4gICAgYXdheUxpc3Q6IHt9LFxyXG4gICAgbG9wYXRhOiAnJyxcclxuICAgIG91dDogMCxcclxuICAgIHN1YmplY3Q6ICcnLFxyXG4gICAgbWVzc2FnZTogJycsXHJcbiAgICBzaWQ6IDAsXHJcbiAgICBtb2RlOiAnJ1xyXG4gIH07XHJcblxyXG4gIHRtID0ge1xyXG4gICAgbWFpbDogXCLQntGC0L/RgNCw0LLQutCwINC/0L7Rh9GC0YtcIixcclxuICAgIGludml0ZTogXCLQntGC0L/RgNCw0LLQutCwINC/0L7Rh9GC0Ysg0Lgg0L/RgNC40LPQu9Cw0YjQtdC90LjQuVwiLFxyXG4gICAgZ29Bd2F5OiBcItCe0YLQv9GA0LDQstC60LAg0L/QvtGH0YLRiyDQuCDQuNC30LPQvdCw0L3QuNC1XCJcclxuICB9O1xyXG5cclxuICBxdWV1ZSA9IFtcImdldExvcGF0YVwiLCBcInN0b3BcIl07XHJcbiAgZiA9IHtcclxuICAgIGdldEludml0ZXNJZDogZnVuY3Rpb24oKXtnZXRJbnZpdGVzSWQoKX0sXHJcbiAgICBnZXRHb0F3YXlJZDogZnVuY3Rpb24oKXtnZXRHb0F3YXlJZCgpfSxcclxuICAgIGdldExvcGF0YTogZnVuY3Rpb24oKXtnZXRMb3BhdGEoKX0sXHJcbiAgICBzdG9wOiBmdW5jdGlvbigpe3N0b3AoKX1cclxuICB9O1xyXG5cclxuXHJcbiAgd2luZG93ID0gJChcIiNzZl9tZXNzYWdlV2luZG93XCIpLm5vZGUoKTtcclxuICBwYXJhbS5zdWJqZWN0ID0gZW5jb2RlVVJJQ29tcG9uZW50KCQod2luZG93KS5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXVtuYW1lPVwic3ViamVjdFwiXScpLm5vZGUoKS52YWx1ZSk7XHJcbiAgcGFyYW0ubWVzc2FnZSA9IGVuY29kZVVSSUNvbXBvbmVudCgkKHdpbmRvdykuZmluZCgndGV4dGFyZWFbbmFtZT1cIm1lc3NhZ2VcIl0nKS5ub2RlKCkudmFsdWUpO1xyXG4gIHBhcmFtLm1vZGUgPSAkKHdpbmRvdykuZmluZCgnc2VsZWN0W25hbWU9XCJ3b3JrTW9kZVwiXScpLmZpbmQoJ29wdGlvbjpjaGVja2VkJykubm9kZSgpLnZhbHVlO1xyXG4gIHNpZCA9ICQod2luZG93KS5maW5kKCdzZWxlY3RbbmFtZT1cInNpZFwiXScpLmZpbmQoJ29wdGlvbjpjaGVja2VkJykubm9kZSgpO1xyXG4gIHBhcmFtLnNpZCA9IE51bWJlcihzaWQudmFsdWUpOyBzaWQgPSBzaWQudGV4dENvbnRlbnQ7XHJcblxyXG4gIGlmKHBhcmFtLm1vZGUgIT0gXCJtYWlsXCIpe1xyXG4gICAgaWYocGFyYW0uc2lkID09IDApe1xyXG4gICAgICBhbGVydChcItCd0LUg0LLRi9Cx0YDQsNC9INGB0LjQvdC00LjQutCw0YIhXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZihwYXJhbS5tb2RlID09IFwiaW52aXRlXCIpIHF1ZXVlLnVuc2hpZnQoXCJnZXRJbnZpdGVzSWRcIik7XHJcbiAgICBpZihwYXJhbS5tb2RlID09IFwiZ29Bd2F5XCIpIHF1ZXVlLnVuc2hpZnQoXCJnZXRHb0F3YXlJZFwiKTtcclxuICB9XHJcblxyXG4gIGlmKHBhcmFtLm1vZGUgPT0gXCJtYWlsXCIpe1xyXG4gICAgaWYoIWNvbmZpcm0oYNCg0LXQttC40Lw6ICR7dG1bcGFyYW0ubW9kZV19XFxuXFxuINCS0YHQtSDQv9GA0LDQstC40LvRjNC90L4/YCkpIHJldHVybjtcclxuICB9ZWxzZXtcclxuICAgIGlmKCFjb25maXJtKGDQoNC10LbQuNC8OiDCoMKgwqDCoMKgwqAke3RtW3BhcmFtLm1vZGVdfVxcbtCh0LjQvdC00LjQutCw0YI6wqDCoCR7c2lkfVxcblxcbiDQktGB0LUg0L/RgNCw0LLQuNC70YzQvdC+P2ApKSByZXR1cm47XHJcbiAgfVxyXG5cclxuICBuZXh0KDApO1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHN0b3AoKXtcclxuICAgICQod2luZG93KS5maW5kKCdzZWxlY3QnKVxyXG4gICAgICAuZmluZCgnb3B0aW9uW3ZhbHVlXScpXHJcbiAgICAgIC5ub2RlQXJyKClcclxuICAgICAgLmZvckVhY2goZ2V0TGlzdCk7XHJcblxyXG4gICAgY291bnQgPSBwYXJhbS5saXN0Lmxlbmd0aDtcclxuXHJcbiAgICBvcGVuU3RhdHVzV2luZG93KCk7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgJ9Cg0LDRgdGB0YvQu9C60LAg0YHQvtC+0LHRidC10L3QuNC5INCy0YvQsdGA0LDQvdC90YvQvCDQuNCz0YDQvtC60LDQvCcsIDAsIGNvdW50KTtcclxuICAgIGRpc3BsYXlQcm9ncmVzc1RpbWUoKGNvdW50ICogMzk1MDApICsgNTAwKTtcclxuICAgIGRvQWN0aW9ucygwLCBjb3VudCwgcGFyYW0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TGlzdChvcHRpb24pe1xyXG4gICAgdmFyIG5hbWUsIGlkO1xyXG5cclxuICAgIGlkID0gb3B0aW9uLnZhbHVlLnNwbGl0KFwifFwiKTtcclxuICAgIG5hbWUgPSBpZFswXTtcclxuICAgIGlkID0gaWRbMV07XHJcblxyXG4gICAgaWYoaW52aXRlc1tuYW1lXSA9PSBudWxsKXtcclxuICAgICAgcGFyYW0ubGlzdC5wdXNoKHtcclxuICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICBlbmNvZGU6IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TG9wYXRhKCl7XHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSgnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc21zLWNyZWF0ZS5waHAnLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgIHBhcmFtLm91dCA9IE51bWJlcigkKCRhbnN3ZXIpLmZpbmQoJ2lucHV0W3R5cGU9XCJoaWRkZW5cIl1bbmFtZT1cIm91dG1haWxcIl0nKS5ub2RlKCkudmFsdWUpO1xyXG4gICAgICAgICAgcGFyYW0ubG9wYXRhID0gJCgkYW5zd2VyKS5maW5kKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdW25hbWU9XCJsb3BhdGFcIl0nKS5ub2RlKCkudmFsdWU7XHJcblxyXG4gICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICBlcnJvckxvZygn0J/QvtC70YPRh9C10L3QuNC4INC70L7Qv9Cw0YLRiycsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaChlKXtcclxuICAgICAgZXJyb3JMb2coJ9C/0L7Qu9GD0YfQtdC90LjQuCDQu9C+0L/QsNGC0YsnLCAxLCBlKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0R29Bd2F5SWQgKCl7XHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSgnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc3luZGljYXRlLmVkaXQucGhwP2tleT11c2VycyZpZD0nICsgcGFyYW0uc2lkLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgIHBhcmFtLmF3YXlMaXN0ID0ge307XHJcblxyXG4gICAgICAgICAgJCgkYW5zd2VyKVxyXG4gICAgICAgICAgICAuZmluZCgnc2VsZWN0W25hbWU9XCJjaWRcIl0nKVxyXG4gICAgICAgICAgICAuZmluZChcIm9wdGlvblwiKVxyXG4gICAgICAgICAgICAubm9kZUFycigpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKHBhcnNlKTtcclxuXHJcbiAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgIGVycm9yTG9nKGDQn9C+0LvRg9GH0LXQvdC40Lgg0YHQv9C40YHQutCwIGlkINC90LAg0LjQt9Cz0L3QsNC90LjQtSDQv9C10YDRgdC+0L3QsNC20LXQuWAsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgIGVycm9yTG9nKGDQv9C+0LvRg9GH0LXQvdC40Lgg0YHQv9C40YHQutCwIGlkINC90LAg0LjQt9Cz0L3QsNC90LjQtSDQv9C10YDRgdC+0L3QsNC20LXQuWAsIDEsIGUpO1xyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZShvcHRpb24pe1xyXG4gICAgICB2YXIgaWQsIG5hbWU7XHJcblxyXG4gICAgICBpZCA9IE51bWJlcihvcHRpb24udmFsdWUpO1xyXG4gICAgICBuYW1lID0gb3B0aW9uLnRleHRDb250ZW50O1xyXG4gICAgICBuYW1lID0gbmFtZS5tYXRjaCgvKFxcZCspXFwuICguKykgXFwvIFxcJChcXGQrKS8pO1xyXG4gICAgICBuYW1lID0gbmFtZVsyXTtcclxuXHJcbiAgICAgIHBhcmFtLmF3YXlMaXN0W25hbWVdID0gaWQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIGdldEludml0ZXNJZCgpe1xyXG4gICAgdHJ5e1xyXG4gICAgICBSRVEoJ2h0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L3N5bmRpY2F0ZS5lZGl0LnBocD9rZXk9aW52aXRlcyZpZD0nICsgcGFyYW0uc2lkLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgIHBhcmFtLmF3YXlMaXN0ID0ge307XHJcblxyXG4gICAgICAgICAgJCgkYW5zd2VyKVxyXG4gICAgICAgICAgICAuZmluZCgnYjpjb250YWlucyhcItCf0YDQuNCz0LvQsNGI0LXQvdC90YvQtSDQv9C10YDRgdC+0L3RizpcIiknKVxyXG4gICAgICAgICAgICAudXAoJ3RkJylcclxuICAgICAgICAgICAgLmZpbmQoJ2FbaHJlZio9XCJpbmZvLnBocFwiXScpXHJcbiAgICAgICAgICAgIC5ub2RlQXJyKClcclxuICAgICAgICAgICAgLmZvckVhY2gocGFyc2UpO1xyXG5cclxuICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgZXJyb3JMb2coYNCf0L7Qu9GD0YfQtdC90LjQuCDRgdC/0LjRgdC60LAgaWQg0L3QsCDQuNC30LPQvdCw0L3QuNC1INC/0LXRgNGB0L7QvdCw0LbQtdC5YCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfWNhdGNoIChlKXtcclxuICAgICAgZXJyb3JMb2coYNC/0L7Qu9GD0YfQtdC90LjQuCDRgdC/0LjRgdC60LAgaWQg0L3QsCDQuNC30LPQvdCw0L3QuNC1INC/0LXRgNGB0L7QvdCw0LbQtdC5YCwgMSwgZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2Uobm9kZSl7XHJcbiAgICAgIGludml0ZXNbbm9kZS50ZXh0Q29udGVudF0gPSBub2RlLmhyZWYuc3BsaXQoJz0nKVsxXTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gbmV4dCh0eXBlKXtcclxuICAgIGlmKHR5cGUgIT0gbnVsbCl7XHJcbiAgICAgIGZbcXVldWUuc2hpZnQoKV0oKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZbcXVldWUuc2hpZnQoKV0uZ2tEZWxheSg3NTAsIHRoaXMsIFtdKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGRvQWN0aW9ucyhpbmRleCwgY291bnQsIHBhcmFtKXtcclxuICBpZihpbmRleCA8IGNvdW50KXtcclxuICAgIGlmKHBhcmFtLm1vZGUgPT0gXCJpbnZpdGVcIil7XHJcbiAgICAgIHNlbmRJbnZpdGUoaW5kZXgsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGlmKHBhcmFtLm1vZGUgPT0gXCJnb0F3YXlcIil7XHJcbiAgICAgIGlmKHBhcmFtLmF3YXlMaXN0W3BhcmFtLmxpc3RbaW5kZXhdLm5hbWVdICE9IG51bGwpIGRvR29Bd2F5KHBhcmFtLnNpZCwgcGFyYW0uYXdheUxpc3RbcGFyYW0ubGlzdFtpbmRleF0ubmFtZV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRNYWlsLmdrRGVsYXkoMTI1MCwgdGhpcywgW2luZGV4LCBwYXJhbV0pO1xyXG5cclxuICAgIHBhcmFtLm91dCsrO1xyXG4gICAgaW5kZXgrKztcclxuXHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3dvcmsnKTtcclxuICAgIGRvQWN0aW9ucy5na0RlbGF5KHJhbmRvbSgzNjAsIDM4MCkgKiAxMDAsIHRoaXMsIFtpbmRleCwgY291bnQsIHBhcmFtXSk7XHJcbiAgfWVsc2V7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ2RvbmUnKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHNlbmRNYWlsKGluZGV4LCBwYXJhbSl7XHJcbiAgdmFyIGRhdGE7XHJcblxyXG4gIGRhdGEgPSBgcG9zdGZvcm09MSZvdXRtYWlsPSR7cGFyYW0ub3V0fSZsb3BhdGE9JHtwYXJhbS5sb3BhdGF9Jm1haWx0bz0ke3BhcmFtLmxpc3RbaW5kZXhdLmVuY29kZX0mc3ViamVjdD0ke3BhcmFtLnN1YmplY3R9Jm1zZz0ke3BhcmFtLm1lc3NhZ2V9YDtcclxuXHJcbiAgdHJ5e1xyXG4gICAgUkVRKCdodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9zbXMtY3JlYXRlLnBocCcsICdQT1NUJywgZGF0YSwgdHJ1ZSxcclxuICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgY29ycmVjdGlvblRpbWUoKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgZXJyb3JMb2coYNCe0YLQv9GA0LDQstC60LUg0L/QuNGB0YzQvNCwICR7cGFyYW0ubGlzdFtpbmRleF0ubmFtZX1gLCAwLCAwKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9Y2F0Y2ggKGUpe1xyXG4gICAgZXJyb3JMb2coYNC+0YLQv9GA0LDQstC60LUg0L/QuNGB0YzQvNCwICR7cGFyYW0ubGlzdFtpbmRleF0ubmFtZX1gLCAxLCBlKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHNlbmRJbnZpdGUoaW5kZXgsIHBhcmFtKXtcclxuICB2YXIgZGF0YSwgaW52aXRlO1xyXG5cclxuICBkYXRhID0gYGtleT1pbnZpdGVzJmlkPSR7cGFyYW0uc2lkfSZpbnZpdGU9JHtwYXJhbS5saXN0W2luZGV4XS5lbmNvZGV9YDtcclxuICBpbnZpdGUgPSAkbW9kZSA/ICRzZCA6ICR0c2Q7XHJcbiAgaW52aXRlID0gaW52aXRlLnBsYXllcnNbcGFyYW0ubGlzdFtpbmRleF0uaWRdLmZvcnVtc1soXCIxXCIgKyBwYXJhbS5zaWQpXS5pbnZpdGU7XHJcblxyXG4gIHRyeXtcclxuICAgIFJFUSgnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc3luZGljYXRlLmVkaXQucGhwJywgJ1BPU1QnLCBkYXRhLCB0cnVlLFxyXG4gICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICBjb3JyZWN0aW9uVGltZSgpO1xyXG4gICAgICAgIGludml0ZSA9IDE7ICAgICAgICAvLy8vINCf0LXQtdGA0LXQtNC10LvQsNGC0YxcclxuICAgICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgZXJyb3JMb2coYNCe0YLQv9GA0LDQstC60LUg0L/RgNC40LPQu9Cw0YjQtdC90LjRjyAke3BhcmFtLmxpc3RbaW5kZXhdLm5hbWV9YCwgMCwgMCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfWNhdGNoIChlKXtcclxuICAgIGVycm9yTG9nKGDQvtGC0L/RgNCw0LLQutC1INC/0YDQuNCz0LvQsNGI0LXQvdC40Y8gJHtwYXJhbS5saXN0W2luZGV4XS5uYW1lfWAsIDEsIGUpO1xyXG4gIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGRvR29Bd2F5KHNpZCwgaWQpe1xyXG4gIHZhciBkYXRhID0gYGlkPSR7c2lkfSZrZXk9dXNlcnMmcmVtb3ZlPSR7aWR9YDtcclxuXHJcbiAgdHJ5e1xyXG4gICAgUkVRKCdodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9zeW5kaWNhdGUuZWRpdC5waHAnLCAnUE9TVCcsIGRhdGEsIHRydWUsXHJcbiAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIGNvcnJlY3Rpb25UaW1lKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIGVycm9yTG9nKGDQmNC30LPQvdCw0L3QvdC40LUgJHtpZH1gLCAwLCAwKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9Y2F0Y2ggKGUpe1xyXG4gICAgZXJyb3JMb2coYNC40LfQs9C90LDQvdC40LggJHtpZH1gLCAxLCBlKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy9cclxuLy9mdW5jdGlvbiBnZW5lcmF0ZVBsYXllcihuYW1lKXtcclxuLy8gIHJldHVybiB7XHJcbi8vICAgIG5hbWU6IG5hbWUsXHJcbi8vICAgIHN0YXR1czoge1xyXG4vLyAgICAgIHRleHQ6ICcnLFxyXG4vLyAgICAgIGRhdGU6IDBcclxuLy8gICAgfSxcclxuLy8gICAgZm9ydW1zOnt9XHJcbi8vICB9O1xyXG4vL31cclxuLy9cclxuLy9mdW5jdGlvbiBnZW5lcmF0ZUZvcnVtUGxheWVyKCl7XHJcbi8vICByZXR1cm4ge1xyXG4vLyAgICBzbjogMCxcclxuLy8gICAgZW50ZXI6IDAsXHJcbi8vICAgIGV4aXQ6IDAsXHJcbi8vICAgIGdvQXdheTogMCxcclxuLy8gICAgaW52aXRlOiAwLFxyXG4vLyAgICBtZW1iZXI6IGZhbHNlLFxyXG4vLyAgICBwb3N0czogMCxcclxuLy8gICAgbGFzdDogMCxcclxuLy8gICAgd29yZHM6IFswLCAwXSxcclxuLy8gICAgc3RhcnQ6IFtdLFxyXG4vLyAgICB0aGVtZXM6IFtdXHJcbi8vICB9O1xyXG4vL31cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckJhc2VIVE1MKCl7XHJcbiAgdmFyIGhlYWRlciwgZm9vdGVyLCBiMSwgYjIsIHdpZHRoO1xyXG5cclxuICAkdC5zdGF0cy5zZXRXaWR0aChbNjUsIDQ1LCAtMSwgNDAsIDc1LCA3NSwgOTUsIDgwLCA3NSwgNzUsIDc1LCA3NSwgMTcyLCA4MCwgODAsIDUwLCA3NSwgOTUsIDQ1XSk7XHJcblxyXG4gICR0LnN0YXRzLnNldFN0cnVjdHVyZShbXHJcbiAgICBbXCJwYXRoc1wiLCBcIiRzZC5wbGF5ZXJzW2lkXVwiLCBcIiRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF1cIiwgXCIkY2hlY2tlZC5wbGF5ZXJzW2lkXVwiLCBcImdldFBlcmNlbnQoJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXVwiXSxcclxuICAgIFtcImlkXCIsIDAsIFwiTnVtYmVyKGlkKVwiLCBcIm51bWJlclwiLCBcIklEXCJdLFxyXG4gICAgW1wic051bWJlclwiLCAyLCBcIi5zblwiLCBcIm51bWJlclwiLCBcItCd0L7QvNC10YAg0LIg0YHQv9C40YHQutC1INGB0LjQvdC00LjQutCw0YLQsFwiXSxcclxuICAgIFtcIm5hbWVcIiwgMSwgXCIubmFtZVwiLCBcImNoZWNrXCIsIFwi0JjQvNGPXCJdLFxyXG4gICAgW1wibWVtYmVyXCIsIDIsIFwiLm1lbWJlclwiLCBcImJvb2xlYW5cIiwgXCLQkiDRgdC+0YHRgtCw0LLQtVwiXSxcclxuICAgIFtcInN0YXR1c1wiLCAxLCBcIi5zdGF0dXNcIiwgXCJtdWx0aXBsZVwiLCBcItCh0YLQsNGC0YPRgVwiXSxcclxuICAgIFtcImVudGVyXCIsIDIsIFwiLmVudGVyXCIsIFwiZGF0ZVwiLCBcItCf0YDQuNC90Y/RglwiXSxcclxuICAgIFtcImV4aXRcIiwgMiwgXCIuZXhpdFwiLCBcImRhdGVcIiwgXCLQn9C+0LrQuNC90YPQu1wiXSxcclxuICAgIFtcImludml0ZVwiLCAyLCBcIi5pbnZpdGVcIiwgXCJkYXRlXCIsIFwi0J/RgNC40LPQu9Cw0YjQtdC9XCJdLFxyXG4gICAgW1wiY2hlY2tlZFwiLCAzLCBcIlwiLCBudWxsLCBudWxsXSxcclxuICAgIFtcInN0YXJ0VGhlbWVzXCIsIDIsIFwiLnN0YXJ0Lmxlbmd0aFwiLCBcIm51bWJlclwiLCBcItCd0LDRh9Cw0YLQviDRgtC10LxcIl0sXHJcbiAgICBbXCJ3cml0ZVRoZW1lc1wiLCAyLCBcIi50aGVtZXMubGVuZ3RoXCIsIFwibnVtYmVyXCIsIFwi0KPRh9Cw0LLRgdGC0LLQvtCy0LDQuyDQsiDRgtC10LzQsNGFXCJdLFxyXG4gICAgW1wibGFzdE1lc3NhZ2VcIiwgMiwgXCIubGFzdFwiLCBcImRhdGVcIiwgXCLQn9C+0YHQu9C10LTQvdC10LUg0YHQvtC+0LHRidC10L3QuNC1XCJdLFxyXG4gICAgW1wicG9zdHNcIiwgMiwgXCIucG9zdHNcIiwgXCJudW1iZXJcIiwgXCLQktGB0LXQs9C+INGB0L7QvtCx0YnQtdC90LjQuVwiXSxcclxuICAgIFtcInBlcmNlbnRTdGFydFRoZW1lc1wiLCA0LCBcIi5zdGFydC5sZW5ndGgsICRjZC5mLnRocmVhZHMuYWxsLCBmYWxzZSk7XCIsIFwibnVtYmVyXCIsIFwi0J/RgNC+0YbQtdC90YIg0L3QsNGH0LDRgtGL0YUg0YLQtdC8XCJdLFxyXG4gICAgW1wicGVyY2VudFdyaXRlVGhlbWVzXCIsIDQsIFwiLnRoZW1lcy5sZW5ndGgsICRjZC5mLnRocmVhZHMuYWxsLCBmYWxzZSk7XCIsIFwibnVtYmVyXCIsIFwi0J/RgNC+0YbQtdC90YIg0YPRh9Cw0YHRgtC40Y8g0LIg0YLQtdC80LDRhVwiXSxcclxuICAgIFtcInBlcmNlbnRQb3N0c1wiLCA0LCBcIi5wb3N0cywgJGNkLmYucG9zdHMsIGZhbHNlKTtcIiwgXCJudW1iZXJcIiwgXCLQn9GA0L7RhtC10L3RgiDRgdC+0L7QsdGJ0LXQvdC40LlcIl0sXHJcbiAgICBbXCJwZXJjZW50V29yZHNcIiwgNCwgXCIud29yZHNbMF0sICRjZC5mLndvcmRzLCBmYWxzZSk7XCIsIFwibnVtYmVyXCIsIFwi0J/RgNC+0YbQtdC90YIg0L3QsNC/0LjRgdCw0L3QvdGL0YUg0YHQu9C+0LJcIl0sXHJcbiAgICBbXCJ3b3Jkc1wiLCAyLCBcIi53b3Jkc1swXVwiLCBcIm51bWJlclwiLCBcItCS0YHQtdCz0L4g0L3QsNC/0LjRgdCw0L3QvdGL0YUg0YHQu9C+0LJcIl0sXHJcbiAgICBbXCJ3b3Jkc0F2ZXJhZ2VcIiwgMiwgXCIud29yZHNbMV1cIiwgXCJudW1iZXJcIiwgXCLQodGA0LXQtNC90LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQvdCw0L/QuNGB0LDQvdC90YvRhSDRgdC70L7QslwiXVxyXG4gIF0pO1xyXG5cclxuICAvLzxkaXYgc3R5bGU9XCJ3aWR0aDogMjRweDsgaGVpZ2h0OiAyNHB4OyBtYXJnaW4tbGVmdDogNXB4OyBmbG9hdDogbGVmdDsgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7JGljby5tZW1iZXJJY299KVwiPjwvZGl2PlxyXG5cclxuICBoZWFkZXIgPVxyXG4gICAgYDx0YWJsZSBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgdHlwZT1cInBhZGRpbmdcIj5cclxuICAgICAgICAgICAgICAgIDx0ciBzdHlsZT1cImhlaWdodDogMzVweDsgZm9udC1zdHlsZTogaXRhbGljO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIxN1wiPtCU0LDQvdC90YvQtSDQv9C+INGE0L7RgNGD0LzRgyAjJHskY2QuZmlkfTxiPiDCqyR7JGZvcnVtLm5hbWV9wrs8L2I+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHIgdHlwZT1cImhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDApfSBhbGlnbj1cImNlbnRlclwiIHJvd3NwYW49XCIyXCIgc29ydD1cImlkXCIgaGVpZ2h0PVwiNjBcIj4jPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMSl9IGFsaWduPVwiY2VudGVyXCIgcm93c3Bhbj1cIjJcIiBzb3J0PVwic051bWJlclwiPuKEljxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDIpfSBhbGlnbj1cImNlbnRlclwiIHJvd3NwYW49XCIyXCIgc29ydD1cIm5hbWVcIj7QmNC80Y88aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCgzKX0gYWxpZ249XCJjZW50ZXJcIiByb3dzcGFuPVwiMlwiIHNvcnQ9XCJtZW1iZXJcIj48aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBjb2xzcGFuPVwiMlwiPtCi0LXQvNGLPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBjb2xzcGFuPVwiMlwiPtCf0L7RgdGC0Ys8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCI0XCI+0J/RgNC+0YbQtdC90YI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDEyKX0gYWxpZ249XCJjZW50ZXJcIiByb3dzcGFuPVwiMlwiIHNvcnQ9XCJzdGF0dXNcIj7QodGC0LDRgtGD0YE8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCgxMyl9IGFsaWduPVwiY2VudGVyXCIgcm93c3Bhbj1cIjJcIiBzb3J0PVwiZW50ZXJcIj7Qn9GA0LjQvdGP0YI8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCgxNCl9IGFsaWduPVwiY2VudGVyXCIgcm93c3Bhbj1cIjJcIiBzb3J0PVwiZXhpdFwiPtCf0L7QutC40L3Rg9C7PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTUpfSBhbGlnbj1cImNlbnRlclwiIHJvd3NwYW49XCIyXCIgc29ydD1cImludml0ZVwiPtCX0LLQsNC7PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjJcIj7QodC70L7QsiDQsiDQv9C+0YHRgtCw0YU8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDE4KX0gYWxpZ249XCJjZW50ZXJcIiByb3dzcGFuPVwiMlwiIHNvcnQ9XCJjaGVja2VkXCIgd2lkdGg9XCI0NVwiPkA8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHIgdHlwZT1cImhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDQpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJzdGFydFRoZW1lc1wiPtCd0LDRh9Cw0YLQvjxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDUpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJ3cml0ZVRoZW1lc1wiPtCj0YfQsNGB0YLQuNGPPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoNil9IGFsaWduPVwiY2VudGVyXCIgc29ydD1cImxhc3RNZXNzYWdlXCI+0J/QvtGB0LvQtdC00L3QuNC5PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoNyl9IGFsaWduPVwiY2VudGVyXCIgc29ydD1cInBvc3RzXCI+0JrQvtC7LdCy0L48aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCg4KX0gYWxpZ249XCJjZW50ZXJcIiBzb3J0PVwicGVyY2VudFN0YXJ0VGhlbWVzXCI+0J3QsNGHLtGC0LXQvDxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDkpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJwZXJjZW50V3JpdGVUaGVtZXNcIj7Qo9GH0LDRgdGC0LjRjzxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDEwKX0gYWxpZ249XCJjZW50ZXJcIiBzb3J0PVwicGVyY2VudFBvc3RzXCI+0J/QvtGB0YLQvtCyPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTEpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJwZXJjZW50V29yZHNcIj7QodC70L7QsjxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDE2KX0gYWxpZ249XCJjZW50ZXJcIiBzb3J0PVwid29yZHNcIj7QktGB0LXQs9C+PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTcpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJ3b3Jkc0F2ZXJhZ2VcIiB0aXRsZT1cItCh0YDQtdC00L3QtdC1INC60L7Qu9C40YfQtdGB0LLRgtC+INGB0LvQvtCyINCyINC+0LTQvdC+0Lwg0YHQvtC+0LHRidC10L3QuNC4XCI+0JIg0YHRgNC10LTQvdC10Lw8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgIDwvdGFibGU+YDtcclxuXHJcbiAgZm9vdGVyID1cclxuICAgIGA8dGFibGUgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHR5cGU9XCJwYWRkaW5nXCI+XHJcbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZDBlZWQwO1wiIHR5cGU9XCJmaWx0ZXJzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgwKX0gZmlsdGVyPVwiaWRcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDEpfSBmaWx0ZXI9XCJzTnVtYmVyXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgyKX0gZmlsdGVyPVwibmFtZVwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoMyl9IGZpbHRlcj1cIm1lbWJlclwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoNCl9IGZpbHRlcj1cInN0YXJ0VGhlbWVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCg1KX0gZmlsdGVyPVwid3JpdGVUaGVtZXNcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDYpfSBmaWx0ZXI9XCJsYXN0TWVzc2FnZVwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoNyl9IGZpbHRlcj1cInBvc3RzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCg4KX0gZmlsdGVyPVwicGVyY2VudFN0YXJ0VGhlbWVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCg5KX0gZmlsdGVyPVwicGVyY2VudFdyaXRlVGhlbWVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxMCl9IGZpbHRlcj1cInBlcmNlbnRQb3N0c1wiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTEpfSBmaWx0ZXI9XCJwZXJjZW50V29yZHNcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDEyKX0gZmlsdGVyPVwic3RhdHVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxMyl9IGZpbHRlcj1cImVudGVyXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxNCl9IGZpbHRlcj1cImV4aXRcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDE1KX0gZmlsdGVyPVwiaW52aXRlXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxNil9IGZpbHRlcj1cIndvcmRzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxNyl9IGZpbHRlcj1cIndvcmRzQXZlcmFnZVwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTgpfSA+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XCJoZWlnaHQ6IDM1cHg7IGJhY2tncm91bmQtY29sb3I6ICNkMGVlZDA7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIxMlwiIGlkPVwic2ZfY3VycmVudEZpbHRlcnNcIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICDQktGB0LXQs9C+INGC0LXQvDogPGI+ICR7JGZvcnVtLnRoZW1lc1sxXX08L2I+LCDQstGB0LXQs9C+INC/0L7RgdGC0L7QsjogPGI+JHskZm9ydW0ucG9zdHN9PC9iPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI1XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgINCf0L7Qt9C40YbQuNC5INCyINGC0LDQsdC70LjRhtC1OiA8YiBpZD1cInNmX1NJX0xpc3RDb3VudFwiPjA8L2I+LCDQvtGC0LzQtdGH0LXQvdC+OiA8YiBpZD1cInNmX1NJX0xpc3RDaGVja2VkXCI+MDwvYj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPHNwYW4gaWQ9XCJzZl9iQ2hlY2tBbGxNZW1iZXJzXCI+W9C+0YLQvNC10YLQuNGC0Ywg0LLRgdGRXTwvc3Bhbj5gO1xyXG5cclxuICAkKCcjc2ZfaGVhZGVyX1NJJykuaHRtbChoZWFkZXIpO1xyXG4gICQoJyNzZl9mb290ZXJfU0knKS5odG1sKGZvb3Rlcik7XHJcblxyXG4gICR0LnN0YXRzLnNldENvbnRyb2woJGljbyk7XHJcblxyXG4gIGIxID0gJCgnI3NmX2JDaGVja0FsbE1lbWJlcnMnKS5ub2RlKCk7XHJcbiAgYmluZEV2ZW50KGIxLCAnb25jbGljaycsIGZ1bmN0aW9uKCl7Y2hlY2tBbGxNZW1iZXJzKGIxLCAnI3NmX2NvbnRlbnRfU0knKX0pO1xyXG5cclxuICAvL2hlYWRlciA9XHJcbiAgLy8gICAgYDx0YWJsZSBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIiB0eXBlPVwicGFkZGluZ1wiPlxyXG4gIC8vICAgICAgICA8dHIgc3R5bGU9XCJoZWlnaHQ6IDM1cHg7IGZvbnQtc3R5bGU6IGl0YWxpYztcIj5cclxuICAvLyAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIyXCI+0JTQsNC90L3Ri9C1INC/0L4g0L3QsNGH0LDRgtGL0Lwg0LjQs9GA0L7QutC+0Lwg0YLQtdC80LDQvDwvdGQ+XHJcbiAgLy8gICAgICAgIDwvdHI+XHJcbiAgLy8gICAgICAgIDx0ciB0eXBlPVwiaGVhZGVyXCIgaGVpZ2h0PVwiNDhcIj5cclxuICAvLyAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMHB4O1wiPtCY0LzRjyDQuNCz0YDQvtC60LA6PC90ZD5cclxuICAvLyAgICAgICAgICAgIDx0ZCBhbGlnbj1cImxlZnRcIj4ke2NyZWF0ZVNlbGVjdCgpfTwvdGQ+XHJcbiAgLy8gICAgICAgIDwvdHI+XHJcbiAgLy8gICAgICAgIDx0cj5cclxuICAvLyAgICAgICAgICAgIDx0ZCBpZD1cInNmX1NUSVwiIGNvbHNwYW49XCIyXCIgdmFsaWduPVwidG9wXCI+PC90ZD5cclxuICAvLyAgICAgICAgPC90cj5cclxuICAvLyAgICA8L3RhYmxlPmA7XHJcbiAgLy9cclxuICAvLyQoJyNzZl9oZWFkZXJfU1RJJykuaHRtbChoZWFkZXIpO1xyXG5cclxuICAkdC50aGVtZXMuc2V0V2lkdGgoWzcwLCAtMSwgMjUwLCA4MCwgMTAwLCAxMDAsIDQzXSk7XHJcbiAgJHQudGhlbWVzLnNldFN0cnVjdHVyZShbXHJcbiAgICBbXCJwYXRoc1wiLCBcIiRjZC5mLnRoZW1lc1tpZF1cIiwgXCIkY2hlY2tlZC50aGVtZXNbaWRdXCJdLFxyXG4gICAgW1wiaWRcIiwgMCwgXCJOdW1iZXIoaWQpXCIsIFwibnVtYmVyXCIsIFwiSURcIl0sXHJcbiAgICBbXCJuYW1lXCIsIDEsIFwiLm5hbWVcIiwgXCJjaGVja1wiLCBcItCd0LDQt9Cy0LDQvdC40Lgg0YLQtdC80YtcIl0sXHJcbiAgICBbXCJhdXRob3JcIiwgMSwgXCIuYXV0aG9yXCIsIFwiY2hlY2tcIiwgXCLQmNC80LXQvdC4INCw0LLRgtC+0YDQsFwiXSxcclxuICAgIFtcImRhdGVcIiwgMSwgXCIuZGF0ZVwiLCBcImRhdGVcIiwgXCLQlNCw0YLQtSDRgdC+0LfQtNCw0L3QuNGPXCJdLFxyXG4gICAgW1wiY2hlY2tcIiwgMiwgXCJcIiwgbnVsbCwgbnVsbF0sXHJcbiAgICBbXCJwb3N0c0RvbmVcIiwgMSwgXCIucG9zdHNbMF1cIiwgXCJudW1iZXJcIiwgXCLQntCx0YDQsNCx0L7RgtCw0L3QviDRgdC+0L7QsdGJ0LXQvdC40LlcIl0sXHJcbiAgICBbXCJwb3N0c0FsbFwiLCAxLCBcIi5wb3N0c1sxXVwiLCBcIm51bWJlclwiLCBcItCS0YHQtdCz0L4g0YHQvtC+0LHRidC10L3QuNC5XCJdXHJcbiAgXSk7XHJcblxyXG4gIGhlYWRlciA9XHJcbiAgICBgPHRhYmxlIGFsaWduPVwiY2VudGVyXCIgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIiB0eXBlPVwicGFkZGluZ1wiPlxyXG4gICAgICAgICAgICAgICAgPHRyIHN0eWxlPVwiaGVpZ2h0OiAzNXB4OyBmb250LXN0eWxlOiBpdGFsaWM7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjdcIj7QlNCw0L3QvdGL0LUg0L/QviDQvtCx0YDQsNCx0L7RgtCw0L3QvdGL0Lwg0YLQtdC80LDQvDwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCgwKX0gc29ydD1cImlkXCIgcm93c3Bhbj1cIjJcIiBzdHlsZT1cImhlaWdodDogNTBweDtcIj4jPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMSl9IHNvcnQ9XCJuYW1lXCIgcm93c3Bhbj1cIjJcIj7QotC10LzQsDxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQudGhlbWVzLmdldFdpZHRoKDIpfSBzb3J0PVwiYXV0aG9yXCIgcm93c3Bhbj1cIjJcIj7QkNCy0YLQvtGAPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMyl9IHNvcnQ9XCJkYXRlXCIgcm93c3Bhbj1cIjJcIj7QodC+0LfQtNCw0L3QsDxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIyXCI+0KHQvtC+0LHRidC10L3QuNC5PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCg2KX0gc29ydD1cImNoZWNrXCIgcm93c3Bhbj1cIjJcIj5APGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCg0KX0gc29ydD1cInBvc3RzRG9uZVwiPtCe0LHRgNCw0LHQvtGC0LDQvdC+PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoNSl9IHNvcnQ9XCJwb3N0c0FsbFwiPtCS0YHQtdCz0L48aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgIDwvdGFibGU+YDtcclxuXHJcbiAgZm9vdGVyID1cclxuICAgIGA8dGFibGUgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHR5cGU9XCJwYWRkaW5nXCI+XHJcbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZDBlZWQwO1wiIHR5cGU9XCJmaWx0ZXJzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMCl9IGZpbHRlcj1cImlkXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMSl9IGZpbHRlcj1cIm5hbWVcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCgyKX0gZmlsdGVyPVwiYXV0aG9yXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMyl9IGZpbHRlcj1cImRhdGVcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCg0KX0gZmlsdGVyPVwicG9zdHNEb25lXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoNSl9IGZpbHRlcj1cInBvc3RzQWxsXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoNil9ID48L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0ciBzdHlsZT1cImhlaWdodDogMzVweDsgYmFja2dyb3VuZC1jb2xvcjogI2QwZWVkMDtcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT1cImZsb2F0OiByaWdodDsgbWFyZ2luLXJpZ2h0OiA1cHg7IGZvbnQtc2l6ZTogMTBweDsgY3Vyc29yOiBwb2ludGVyO1wiIGlkPVwic2ZfYkNoZWNrQWxsVGhlbWVzXCI+W9C+0YLQvNC10YLQuNGC0Ywg0LLRgdGRXTwvc3Bhbj5gO1xyXG5cclxuICAkKCcjc2ZfaGVhZGVyX1RMJykuaHRtbChoZWFkZXIpO1xyXG4gICQoJyNzZl9mb290ZXJfVEwnKS5odG1sKGZvb3Rlcik7XHJcblxyXG4gICR0LnRoZW1lcy5zZXRDb250cm9sKCRpY28pO1xyXG5cclxuICBiMiA9ICQoJyNzZl9iQ2hlY2tBbGxUaGVtZXMnKS5ub2RlKCk7XHJcbiAgYmluZEV2ZW50KGIyLCAnb25jbGljaycsIGZ1bmN0aW9uKCl7Y2hlY2tBbGxNZW1iZXJzKGIyLCAnI3NmX2NvbnRlbnRfVEwnKX0pO1xyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBjaGVja0FsbE1lbWJlcnMoYnV0dG9uLCBpZCl7XHJcbiAgICB2YXIgY24gPSAkKCcjc2ZfU0lfTGlzdENoZWNrZWQnKTtcclxuXHJcbiAgICBpZihidXR0b24udGV4dENvbnRlbnQgPT0gXCJb0L7RgtC80LXRgtC40YLRjCDQstGB0ZFdXCIpe1xyXG4gICAgICBidXR0b24udGV4dENvbnRlbnQgPSBcIlvRgdC90Y/RgtGMINCy0YHRkV1cIjtcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9TSVwiKSBjbi5odG1sKCRjZC5zdGF0c0NvdW50KTtcclxuICAgIH1lbHNle1xyXG4gICAgICBidXR0b24udGV4dENvbnRlbnQgPSBcIlvQvtGC0LzQtdGC0LjRgtGMINCy0YHRkV1cIjtcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9TSVwiKSBjbi5odG1sKDApO1xyXG4gICAgfVxyXG5cclxuICAgICQoaWQpXHJcbiAgICAgIC5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKVxyXG4gICAgICAubm9kZUFycigpXHJcbiAgICAgIC5mb3JFYWNoKFxyXG4gICAgICAgIGZ1bmN0aW9uKGJveCl7XHJcbiAgICAgICAgICBpZihidXR0b24udGV4dENvbnRlbnQgIT0gXCJb0L7RgtC80LXRgtC40YLRjCDQstGB0ZFdXCIpe1xyXG4gICAgICAgICAgICBkb1RoaXMoYm94LCBcImxpZ2h0Q2hlY2tlZFwiLCB0cnVlLCAkaWNvLmJveE9uLCB0cnVlKTtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBkb1RoaXMoYm94LCBcImxpZ2h0XCIsIGZhbHNlLCAkaWNvLmJveE9mZiwgZmFsc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gZG9UaGlzKGJveCwgdHlwZSwgYywgaW1nLCBjaGVjayl7XHJcbiAgICAgICQoYm94KS51cCgndHInKS5ub2RlKCkuc2V0QXR0cmlidXRlKFwidHlwZVwiLCB0eXBlKTtcclxuICAgICAgYm94LmNoZWNrZWQgPSBjO1xyXG4gICAgICBib3gubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLmJhY2tncm91bmQgPSBgdXJsKFwiJHtpbWd9XCIpYDtcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9TSVwiKSAkY2hlY2tlZC5wbGF5ZXJzW2JveC52YWx1ZV0gPSBjaGVjaztcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9UTFwiKSAkY2hlY2tlZC50aGVtZXNbYm94LnZhbHVlXSA9IGNoZWNrO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyU3RhdHNUYWJsZShzb3J0ZWQpe1xyXG4gIHZhciB0YWJsZSA9ICR0LnN0YXRzO1xyXG5cclxuICBpZighc29ydGVkKSB7XHJcbiAgICB0YWJsZS5jbGVhckNvbnRlbnQoKTtcclxuICAgIHByZXBhcmVSZW5kZXJzKFwicGxheWVyc1wiLCB0YWJsZSk7XHJcbiAgICB0YWJsZS5zb3J0aW5nKCk7XHJcbiAgfVxyXG5cclxuICAkY2Quc3RhdHNDb3VudCA9IDA7XHJcbiAgc2hvd1N0YXRzKHRhYmxlKTtcclxuICBiaW5kQ2hlY2tpbmdPblJvd3MoJyNzZl9jb250ZW50X1NJJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlclRoZW1lc1RhYmxlKHNvcnRlZCl7XHJcbiAgdmFyIHRhYmxlID0gJHQudGhlbWVzO1xyXG5cclxuICBpZighc29ydGVkKXtcclxuICAgIHRhYmxlLmNsZWFyQ29udGVudCgpO1xyXG4gICAgcHJlcGFyZVJlbmRlcnMoXCJ0aGVtZXNcIiwgdGFibGUpO1xyXG4gICAgdGFibGUuc29ydGluZygpO1xyXG4gIH1cclxuXHJcbiAgJGNkLnRoZW1lc0NvdW50ID0gMDtcclxuICBzaG93VGhlbWVMaXN0KHRhYmxlKTtcclxuICBiaW5kQ2hlY2tpbmdPblJvd3MoJyNzZl9jb250ZW50X1RMJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlclRhYmxlcygpe1xyXG4gIHJlbmRlclN0YXRzVGFibGUoKTtcclxuICByZW5kZXJUaGVtZXNUYWJsZSgpO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBkb0ZpbHRlcih0ZCwgdE5hbWUsIHR5cGUsIG5hbWUpe1xyXG4gIGNvbnNvbGUubG9nKHRkKTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gcHJlcGFyZVJlbmRlcnModmFsdWUsIHRhYmxlKXtcclxuICB2YXIgbSA9IFtdLCBmID0gW10sIGFkZGVkO1xyXG5cclxuICBpZih2YWx1ZSA9PSBcInBsYXllcnNcIil7XHJcbiAgICBPYmplY3Qua2V5cygkc2RbdmFsdWVdKS5mb3JFYWNoKHByb2Nlc3NpbmcpO1xyXG4gICAgLy9PYmplY3Qua2V5cygkc3Muc2hvdy5zdGF0cykuZm9yRWFjaChwcmVwYXJlRmlsdGVycyk7XHJcbiAgfWVsc2V7XHJcbiAgICBPYmplY3Qua2V5cygkc2QuZm9ydW1zWyRjZC5maWRdLnRoZW1lcykuZm9yRWFjaChwcm9jZXNzaW5nKTtcclxuICB9XHJcblxyXG4gIGlmKGFkZGVkICYmICRtb2RlKSBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuXHJcbiAgcmV0dXJuIHttOiBtLCBmOiBmfTtcclxuXHJcbiAgZnVuY3Rpb24gcHJvY2Vzc2luZyhpZCl7XHJcbiAgICB2YXIgcCwgcGYsIGtpY2tlZCwgaW52aXRlLCBmO1xyXG5cclxuICAgIGlmKCRjaGVja2VkW3ZhbHVlXVtpZF0gPT0gbnVsbCl7XHJcbiAgICAgICRjaGVja2VkW3ZhbHVlXVtpZF0gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZih2YWx1ZSA9PSBcInBsYXllcnNcIil7XHJcbiAgICAgIHAgPSAkc2QucGxheWVyc1tpZF07XHJcbiAgICAgIHBmID0gcC5mb3J1bXNbJGNkLmZpZF07XHJcblxyXG4gICAgICBpZihwZiAhPSBudWxsKXtcclxuICAgICAgICAvL2tpY2tlZCA9ICRtb2RlID8gJHNkLmtpY2tlZFskY2QuZmlkXSA6ICR0c2Qua2lja2VkWyRjZC5maWRdO1xyXG4gICAgICAgIC8vaWYoa2lja2VkICE9IG51bGwgJiYgcGYgIT0gbnVsbCAmJiBraWNrZWRbcC5uYW1lXSAhPSBudWxsKXtcclxuICAgICAgICAvLyAgICBpZihwZi5leGl0IDw9IGtpY2tlZFtwLm5hbWVdKXtcclxuICAgICAgICAvLyAgICAgICAgcGYuZ29Bd2F5ID0gMTtcclxuICAgICAgICAvLyAgICAgICAgcGYuZXhpdCA9IGtpY2tlZFtwLm5hbWVdO1xyXG4gICAgICAgIC8vICAgICAgICBpZigkbW9kZSkgZGVsZXRlIGtpY2tlZFtwLm5hbWVdO1xyXG4gICAgICAgIC8vICAgICAgICBhZGRlZCA9IHRydWU7XHJcbiAgICAgICAgLy8gICAgfVxyXG4gICAgICAgIC8vfVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy9pbnZpdGUgPSAkbW9kZSA/ICRzZC5pbnZpdGVbJGNkLmZpZF0gOiAkdHNkLmludml0ZVskY2QuZmlkXTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vaWYoaW52aXRlICE9IG51bGwgJiYgaW52aXRlW3AubmFtZV0gIT0gbnVsbCl7XHJcbiAgICAgICAgLy8gICAgcGYuaW52aXRlID0gMTtcclxuICAgICAgICAvLyAgICBpZigkbW9kZSkgZGVsZXRlIGludml0ZVtwLm5hbWVdO1xyXG4gICAgICAgIC8vICAgIGFkZGVkID0gdHJ1ZTtcclxuICAgICAgICAvL31cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vaWYoISRtb2RlICYmICR0c2QucGxheWVyc1tpZF0gJiYgJHRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJzE3OTMwJ10pe1xyXG4gICAgICAgIC8vICAgIGYgPSAkdHNkLnBsYXllcnNbaWRdLmZvcnVtc1snMTc5MzAnXTtcclxuICAgICAgICAvLyAgICBwZi5zbiA9IGYuc247XHJcbiAgICAgICAgLy8gICAgcGYuZW50ZXIgPSBmLmVudGVyO1xyXG4gICAgICAgIC8vICAgIHBmLmV4aXQgPSBmLmV4aXQ7XHJcbiAgICAgICAgLy8gICAgcGYuaW52aXRlID0gZi5pbnZpdGU7XHJcbiAgICAgICAgLy8gICAgcGYubWVtYmVyID0gZi5tZW1iZXI7XHJcbiAgICAgICAgLy8gICAgcGYuZ29Bd2F5ID0gZi5nb0F3YXk7XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvL20ucHVzaChpZCk7XHJcblxyXG4gICAgICAgIHRhYmxlLnNldENvbnRlbnQoaWQpO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdGFibGUuc2V0Q29udGVudChpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gcHJlcGFyZUZpbHRlcnModmFsdWUpe1xyXG4gICAgaWYoJHNzLnNob3cuc3RhdHNbdmFsdWVdICE9IG51bGwpIGYucHVzaCh2YWx1ZSk7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBkb1NvcnQodGQsIHRhYmxlKXtcclxuICB2YXIgY2VsbCwgbmFtZSA9IHRhYmxlLmdldE5hbWUoKTtcclxuXHJcbiAgdGFibGUuc2V0U29ydCgkaWNvKTtcclxuXHJcbiAgY2VsbCA9IHRkLmdldEF0dHJpYnV0ZShcInNvcnRcIik7XHJcbiAgaWYoY2VsbCA9PSAkc3Muc29ydFtuYW1lXS5jZWxsKXtcclxuICAgICRzcy5zb3J0W25hbWVdLnR5cGUgPSAkc3Muc29ydFtuYW1lXS50eXBlID09IDAgPyAxIDogMDtcclxuICB9ZWxzZXtcclxuICAgICRzcy5zb3J0W25hbWVdLmNlbGwgPSBjZWxsO1xyXG4gICAgJHNzLnNvcnRbbmFtZV0udHlwZSA9IDE7XHJcbiAgfVxyXG5cclxuICB0YWJsZS5jaGFuZ2VTb3J0SW1hZ2UoJGljbyk7XHJcbiAgdGFibGUuc29ydGluZygpO1xyXG5cclxuICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ3NldHRpbmdzJyk7XHJcblxyXG4gIGlmKG5hbWUgPT0gXCJzdGF0c1wiKSByZW5kZXJTdGF0c1RhYmxlKHRydWUpO1xyXG4gIGlmKG5hbWUgPT0gXCJ0aGVtZXNcIikgcmVuZGVyVGhlbWVzVGFibGUodHJ1ZSk7XHJcblxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBiaW5kQ2hlY2tpbmdPblJvd3MoaWQpe1xyXG4gICQoaWQpXHJcbiAgICAuZmluZCgndHInKVxyXG4gICAgLm5vZGVBcnIoKVxyXG4gICAgLmZvckVhY2goXHJcbiAgICAgIGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICBiaW5kRXZlbnQobm9kZSwgJ29uY2xpY2snLGZ1bmN0aW9uKCl7Y2hlY2tlZElkKG5vZGUpfSk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gIGZ1bmN0aW9uIGNoZWNrZWRJZChub2RlKXtcclxuICAgIGlmKG5vZGUuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PSBcImxpZ2h0XCIpe1xyXG4gICAgICBub2RlLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJsaWdodENoZWNrZWRcIik7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwibGlnaHRcIik7XHJcbiAgICB9XHJcbiAgICBub2RlID0gJChub2RlKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5ub2RlKCk7XHJcbiAgICBub2RlLm5leHRTaWJsaW5nLnN0eWxlLmJhY2tncm91bmQgPSBub2RlLmNoZWNrZWQgPyBgdXJsKFwiJHskaWNvLmJveE9mZn1cIilgIDogYHVybChcIiR7JGljby5ib3hPbn1cIilgO1xyXG4gICAgbm9kZS5jaGVja2VkID0gIW5vZGUuY2hlY2tlZDtcclxuXHJcbiAgICBpZihpZCA9PSBcIiNzZl9jb250ZW50X1NJXCIpe1xyXG4gICAgICAkY2hlY2tlZC5wbGF5ZXJzW25vZGUudmFsdWVdID0gISRjaGVja2VkLnBsYXllcnNbbm9kZS52YWx1ZV07XHJcbiAgICAgIGNoYW5nZUNvdW50KCcjc2ZfU0lfTGlzdENoZWNrZWQnLCBub2RlLmNoZWNrZWQpO1xyXG4gICAgfVxyXG4gICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9UTFwiKXtcclxuICAgICAgJGNoZWNrZWQudGhlbWVzW25vZGUudmFsdWVdID0gISRjaGVja2VkLnRoZW1lc1tub2RlLnZhbHVlXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNoYW5nZUNvdW50KGlkLCBzdGF0ZSl7XHJcbiAgICB2YXIgY291bnQsIGNuO1xyXG5cclxuICAgIGNuID0gJChpZCk7XHJcbiAgICBjb3VudCA9IE51bWJlcihjbi50ZXh0KCkpO1xyXG4gICAgY24uaHRtbChzdGF0ZSA/IGNvdW50ICsgMSA6IGNvdW50IC0gMSk7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBzaG93U3RhdHModGFibGUpe1xyXG4gIHZhciBjb2RlO1xyXG5cclxuICBjb2RlID1cclxuICAgIGA8ZGl2IHN0eWxlPVwibWF4LWhlaWdodDogNDc3cHg7IG92ZXJmbG93LXk6IHNjcm9sbDtcIj5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgdHlwZT1cInBhZGRpbmdcIj5gO1xyXG5cclxuXHJcbiAgdGFibGUuZ2V0Q29udGVudCgpLmZvckVhY2goZnVuY3Rpb24odHIpe1xyXG4gICAgdmFyIG1lbWJlckljbywgaW52aXRlSWNvLCBsaWdodCwgY2hlY2ssIGJveCwga2lja2VkQ29sb3I7XHJcblxyXG4gICAgaWYgKHRyLmNoZWNrKXtcclxuICAgICAgbGlnaHQgPSBcImxpZ2h0Q2hlY2tlZFwiO1xyXG4gICAgICBjaGVjayA9IFwiY2hlY2tlZFwiO1xyXG4gICAgICBib3ggPSAkaWNvLmJveE9uO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGxpZ2h0ID0gXCJsaWdodFwiO1xyXG4gICAgICBjaGVjayA9IFwiXCI7XHJcbiAgICAgIGJveCA9ICRpY28uYm94T2ZmO1xyXG4gICAgfVxyXG5cclxuICAgIG1lbWJlckljbyA9IHRyLm1lbWJlciA/ICRpY28uaW5UZWFtIDogJGljby5vdXRUZWFtO1xyXG4gICAgaW52aXRlSWNvID0gdHIuaW52aXRlID8gJGljby5pblRlYW0gOiAkaWNvLm91dFRlYW07XHJcbiAgICBraWNrZWRDb2xvciA9IHRyLmdvQXdheSA/ICdzdHlsZT1cImNvbG9yOiBicm93bjsgZm9udC13ZWlnaHQ6IGJvbGQ7XCInIDogXCJcIjtcclxuXHJcbiAgICBjb2RlICs9XHJcbiAgICAgIGA8dHIgaGVpZ2h0PVwiMjhcIiB0eXBlPVwiJHtsaWdodH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDApfSBhbGlnbj1cInJpZ2h0XCI+JHtjb252ZXJ0SUQodHIuaWQpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgxKX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnNOdW1iZXIpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgyKX0gc3R5bGU9XCJ0ZXh0LWluZGVudDogNXB4O1wiPjxhIHN0eWxlPVwidGV4dC1kZWNvcmF0aW9uOiBub25lOyBmb250LXdlaWdodDogYm9sZDtcIiB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvaW5mby5waHA/aWQ9JHt0ci5pZH1cIj4ke3RyLm5hbWV9PC9hPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgzKX0gYWxpZ249XCJjZW50ZXJcIj48aW1nIHNyYz1cIiR7bWVtYmVySWNvfVwiIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDQpfSBhbGlnbj1cImNlbnRlclwiPiR7aHoodHIuc3RhcnRUaGVtZXMpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg1KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLndyaXRlVGhlbWVzKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoNil9IGFsaWduPVwiY2VudGVyXCI+JHtnZXROb3JtYWxEYXRlKHRyLmxhc3RNZXNzYWdlKS5kfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg3KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBvc3RzKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoOCl9IGFsaWduPVwiY2VudGVyXCI+JHtoeih0ci5wZXJjZW50U3RhcnRUaGVtZXMsIDEpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg5KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBlcmNlbnRXcml0ZVRoZW1lcywgMSl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDEwKX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBlcmNlbnRQb3N0cywgMSl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDExKX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBlcmNlbnRXb3JkcywgMSl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDEyKX0gYWxpZ249XCJjZW50ZXJcIj4ke3N0YXR1c01lbWJlcih0ci5zdGF0dXMpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgxMyl9IGFsaWduPVwiY2VudGVyXCI+JHtnZXROb3JtYWxEYXRlKHRyLmVudGVyKS5kfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgxNCl9IGFsaWduPVwiY2VudGVyXCIgJHtraWNrZWRDb2xvcn0+JHtnZXROb3JtYWxEYXRlKHRyLmV4aXQpLmR9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDE1KX0gYWxpZ249XCJjZW50ZXJcIj48aW1nIHNyYz1cIiR7aW52aXRlSWNvfVwiIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDE2KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLndvcmRzKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoMTcpfSBhbGlnbj1cImNlbnRlclwiPiR7aHoodHIud29yZHNBdmVyYWdlKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoMTgsIHRydWUpfT48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgJHtjaGVja30gbmFtZT1cInNmX21lbWJlcnNMaXN0XCIgdmFsdWU9XCIke3RyLmlkfVwiLz48ZGl2IHN0eWxlPVwibWFyZ2luOiBhdXRvOyB3aWR0aDogMTNweDsgaGVpZ2h0OiAxM3B4OyBiYWNrZ3JvdW5kOiB1cmwoJyR7Ym94fScpXCI+PC9kaXY+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICBgO1xyXG5cclxuICAgICRjZC5zdGF0c0NvdW50Kys7XHJcbiAgfSk7XHJcblxyXG4gIGNvZGUgKz0gYDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PmA7XHJcblxyXG4gICQoJyNzZl9jb250ZW50X1NJJykuaHRtbChjb2RlKTtcclxuICAkKCcjc2ZfU0lfTGlzdENvdW50JykuaHRtbCgkY2Quc3RhdHNDb3VudCk7XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIGh6KHZhbHVlLCBwKXtcclxuICAgIHJldHVybiB2YWx1ZSA9PSAwID8gXCItXCIgOiBwICE9IG51bGwgPyB2YWx1ZSArICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogOXB4O1wiPiAlPC9zcGFuPicgOiB2YWx1ZTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gc3RhdHVzTWVtYmVyKHMpe1xyXG4gICAgaWYocy50ZXh0ID09ICcnKVxyXG4gICAgICByZXR1cm4gXCItXCI7XHJcbiAgICBpZihzLnRleHQgPT0gXCJPa1wiKVxyXG4gICAgICByZXR1cm4gYDxkaXYgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBiYWNrZ3JvdW5kOiB1cmwoJyR7JGljby5va30nKSBuby1yZXBlYXQgMzhweCAwOyBsaW5lLWhlaWdodDogMjhweDsgdGV4dC1pbmRlbnQ6IDI1cHg7XCI+WyR7Z2V0Tm9ybWFsRGF0ZShzLmRhdGUpLmR9XTwvZGl2PmA7XHJcbiAgICBpZihzLmRhdGUgIT0gMClcclxuICAgICAgcmV0dXJuICRkYXRlID4gcy5kYXRlID8gXCI/XCIgOiBgPHNwYW4gc3R5bGU9XCIkeyRzdGF0dXNTdHlsZVtzLnRleHRdfVwiPiR7cy50ZXh0fTwvc3Bhbj4gWyR7Z2V0Tm9ybWFsRGF0ZShzLmRhdGUpLmR9XWA7XHJcblxyXG4gICAgcmV0dXJuYDxzcGFuIHN0eWxlPVwiJHskc3RhdHVzU3R5bGVbcy50ZXh0XX1cIj4ke3MudGV4dH08L3NwYW4+YDtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHNob3dUaGVtZUxpc3QodGFibGUpe1xyXG4gIHZhciBjb2RlLCBsaWdodCwgY2hlY2ssIGJveDtcclxuXHJcbiAgY29kZSA9XHJcbiAgICBgPGRpdiBzdHlsZT1cIm1heC1oZWlnaHQ6IDQ5NXB4OyBvdmVyZmxvdy15OiBzY3JvbGw7XCI+XHJcbiAgICAgICAgICAgICAgICA8dGFibGUgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHR5cGU9XCJwYWRkaW5nXCI+YDtcclxuXHJcbiAgdGFibGUuZ2V0Q29udGVudCgpLmZvckVhY2goZnVuY3Rpb24odHIpe1xyXG4gICAgaWYodHIuY2hlY2spe1xyXG4gICAgICBsaWdodCA9IFwibGlnaHRDaGVja2VkXCI7XHJcbiAgICAgIGNoZWNrID0gXCJjaGVja2VkXCI7XHJcbiAgICAgIGJveCA9ICRpY28uYm94T247XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBsaWdodCA9IFwibGlnaHRcIjtcclxuICAgICAgY2hlY2sgPSBcIlwiO1xyXG4gICAgICBib3ggPSAkaWNvLmJveE9mZjtcclxuICAgIH1cclxuXHJcbiAgICBjb2RlICs9XHJcbiAgICAgIGA8dHIgaGVpZ2h0PVwiMjhcIiB0eXBlPVwiJHtsaWdodH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoMCl9IGFsaWduPVwicmlnaHRcIj4ke2NvbnZlcnRJRCh0ci5pZCl9IDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDEpfSBzdHlsZT1cInRleHQtaW5kZW50OiA1cHg7XCI+PGEgc3R5bGU9XCJ0ZXh0LWRlY29yYXRpb246IG5vbmU7IGZvbnQtd2VpZ2h0OiBib2xkO1wiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9tZXNzYWdlcy5waHA/ZmlkPSR7JGNkLmZpZH0mdGlkPSR7dHIuaWR9XCI+JHt0ci5uYW1lfTwvYT48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgyKX0gc3R5bGU9XCJ0ZXh0LWluZGVudDogNXB4O1wiIHdpZHRoPVwiMjUwXCI+PGEgc3R5bGU9XCJ0ZXh0LWRlY29yYXRpb246IG5vbmU7IGZvbnQtd2VpZ2h0OiBib2xkO1wiIGhyZWY9XCJodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9pbmZvLnBocD9pZD0ke3RyLmF1dGhvci5pZH1cIj4ke3RyLmF1dGhvci5uYW1lfTwvYT48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgzKX0gYWxpZ249XCJjZW50ZXJcIj4ke2dldE5vcm1hbERhdGUodHIuZGF0ZSkuZH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg0KX0gYWxpZ249XCJjZW50ZXJcIj4ke3RyLnBvc3RzRG9uZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg1KX0gYWxpZ249XCJjZW50ZXJcIj4ke3RyLnBvc3RzQWxsfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDYsIHRydWUpfSBhbGlnbj1cImNlbnRlclwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAke2NoZWNrfSBuYW1lPVwic2ZfdGhlbWVzTGlzdFwiIHZhbHVlPVwiJHt0ci5pZH1cIiAvPjxkaXYgc3R5bGU9XCJ3aWR0aDogMTNweDsgaGVpZ2h0OiAxM3B4OyBiYWNrZ3JvdW5kOiB1cmwoJyR7Ym94fScpXCI+PC9kaXY+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8L3RyPmA7XHJcbiAgfSk7XHJcblxyXG4gIGNvZGUgKz0gYDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PmA7XHJcblxyXG4gICQoJyNzZl9jb250ZW50X1RMJykuaHRtbChjb2RlKTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5mdW5jdGlvbiBnZXRDdXJyZW50RmlsdGVycygpe1xyXG4gIHZhciBsaXN0LCBsLCByZXN1bHQ7XHJcblxyXG4gIGxpc3QgPSBPYmplY3Qua2V5cygkc3Muc2hvdy5zdGF0cykucmV2ZXJzZSgpO1xyXG4gIGwgPSBsaXN0Lmxlbmd0aDtcclxuICByZXN1bHQgPSBbXTtcclxuXHJcbiAgd2hpbGUobC0tKXtcclxuICAgIGlmKCRzcy5zaG93LnN0YXRzW2xpc3RbbF1dICE9IG51bGwpe1xyXG4gICAgICByZXN1bHQucHVzaCgnWycgKyAkY2QudmFsdWVzLnN0YXRzW2xpc3RbbF1dWzBdICsgJ10nKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmVzdWx0ID0gcmVzdWx0Lmxlbmd0aCA/ICc8c3BhbiBzdHlsZT1cImZvbnQtd2VpZ2h0OiBib2xkO1wiPtCQ0LrRgtC40LLQvdGL0LUg0YTQuNC70YzRgtGA0Ys6PC9zcGFuPiAnICsgcmVzdWx0LmpvaW4oJyAnKSA6ICcnO1xyXG5cclxuICAkKCcjc2ZfY3VycmVudEZpbHRlcnMnKS5odG1sKHJlc3VsdCk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGdldFRpbWVSZXF1ZXN0KHR5cGUpe1xyXG4gIGlmKCF0eXBlKXtcclxuICAgICRjZC50aW1lUmVxdWVzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gIH1lbHNle1xyXG4gICAgJGNkLnRpbWVSZXF1ZXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAkY2QudGltZVJlcXVlc3Q7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjb3JyZWN0aW9uVGltZSgpe1xyXG4gIHZhciBub2RlLCB0aW1lLCB0O1xyXG5cclxuICB0ID0gJGNkLnRpbWVSZXF1ZXN0O1xyXG4gIG5vZGUgPSAkKCcjc2ZfcHJvZ3Jlc3NUaW1lJyk7XHJcbiAgdGltZSA9IE51bWJlcihub2RlLnRleHQoKSk7XHJcblxyXG4gIGlmKHQgPiA1MDApe1xyXG4gICAgbm9kZS5odG1sKHRpbWUgLSAoNTAwIC0gdCkpO1xyXG4gIH1lbHNlIGlmKHQgPCA1MDApe1xyXG4gICAgbm9kZS5odG1sKHRpbWUgKyAodCAtIDUwMCkpO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gZXJyb3JMb2codGV4dCwgZnVsbCwgZSl7XHJcbiAgaWYoZnVsbCl7XHJcbiAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKCRuYW1lU2NyaXB0KTtcclxuICAgIGNvbnNvbGUuZXJyb3IoYNCh0LvRg9GH0LjQu9Cw0YHRjCDQv9GA0Lg6ICR7dGV4dH0uINCe0YjQuNCx0LrQsDogJXMsINGB0YLRgNC+0LrQsDogJWRcImAsIGUubmFtZSwgZS5saW5lTnVtYmVyKTtcclxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuICB9ZWxzZXtcclxuICAgIGNvbnNvbGUuZXJyb3IoYNCX0LDQv9GA0L7RgSDQt9Cw0LLQtdGA0YjQuNC70YHRjyDQvdC10YPQtNCw0YfQvdC+LiAke3RleHR9LmApO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8g0JDQn9CYINC00LvRjyDRgNCw0LHQvtGC0Ysg0YEgTFNcclxuXHJcbmZ1bmN0aW9uIHNhdmVUb0xvY2FsU3RvcmFnZSh0eXBlKXtcclxuICB2YXIgc3RyaW5nO1xyXG5cclxuICBpZih0eXBlID09ICdkYXRhJyAmJiAkbW9kZSl7XHJcbiAgICBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSgkc2QpO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJna19TRl9kYXRhXCIsIHN0cmluZyk7XHJcbiAgfVxyXG4gIGlmKHR5cGUgPT0gJ3NldHRpbmdzJyl7XHJcbiAgICBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSgkc3MpO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJna19TRl9zZXR0aW5nc1wiLCBzdHJpbmcpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZEZyb21Mb2NhbFN0b3JhZ2UodHlwZSl7XHJcbiAgdmFyIHN0cmluZztcclxuXHJcbiAgaWYodHlwZSA9PSAnZGF0YScpe1xyXG4gICAgc3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJna19TRl9kYXRhXCIpO1xyXG5cclxuICAgIGlmKHN0cmluZyl7XHJcbiAgICAgIGlmKCRtb2RlKSB7XHJcbiAgICAgICAgJHNkID0gSlNPTi5wYXJzZShzdHJpbmcpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAkdHNkID0gSlNPTi5wYXJzZShzdHJpbmcpO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgc2F2ZVRvTG9jYWxTdG9yYWdlKCdkYXRhJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKHR5cGUgPT0gJ3NldHRpbmdzJyl7XHJcbiAgICBzdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdrX1NGX3NldHRpbmdzXCIpO1xyXG5cclxuICAgIGlmKHN0cmluZyl7XHJcbiAgICAgICRzcyA9IEpTT04ucGFyc2Uoc3RyaW5nKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ3NldHRpbmdzJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyDQkNCf0Jgg0LfQsNC/0YDQvtGB0LBcclxuXHJcbmZ1bmN0aW9uIFJFUSh1cmwsIG1ldGhvZCwgcGFyYW0sIGFzeW5jLCBvbnN1Y2Nlc3MsIG9uZmFpbHVyZSkge1xyXG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gIGdldFRpbWVSZXF1ZXN0KCk7XHJcblxyXG4gIHJlcXVlc3Qub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xyXG4gIGlmIChtZXRob2QgPT0gJ1BPU1QnKSByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICByZXF1ZXN0LnNlbmQocGFyYW0pO1xyXG5cclxuICBpZiAoYXN5bmMgPT0gdHJ1ZSkge1xyXG4gICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xyXG4gICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09IDQgJiYgcmVxdWVzdC5zdGF0dXMgPT0gMjAwICYmIHR5cGVvZiBvbnN1Y2Nlc3MgIT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgIGdldFRpbWVSZXF1ZXN0KDEpO1xyXG4gICAgICAgIG9uc3VjY2VzcyhyZXF1ZXN0KTtcclxuICAgICAgfWVsc2UgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcXVlc3Quc3RhdHVzICE9IDIwMCAmJiB0eXBlb2Ygb25mYWlsdXJlICE9ICd1bmRlZmluZWQnKSBvbmZhaWx1cmUocmVxdWVzdCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoYXN5bmMgPT0gZmFsc2UpIHtcclxuICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDAgJiYgdHlwZW9mIG9uc3VjY2VzcyAhPSAndW5kZWZpbmVkJykgb25zdWNjZXNzKHJlcXVlc3QpO1xyXG4gICAgZWxzZSBpZiAocmVxdWVzdC5zdGF0dXMgIT0gMjAwICYmIHR5cGVvZiBvbmZhaWx1cmUgIT0gJ3VuZGVmaW5lZCcpIG9uZmFpbHVyZShyZXF1ZXN0KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlcGFjayhvLCBrZXkpe1xyXG4gIHZhciByID0ge307XHJcblxyXG4gIE9iamVjdC5rZXlzKG8pLmZvckVhY2goZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgclskdHNba2V5XVt2YWx1ZV1dID0gb1t2YWx1ZV07XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiByO1xyXG59Il19
