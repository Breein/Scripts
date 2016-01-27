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
          if (event.target.result) {
            onsuccess(event.target.result);
          } else {
            onsuccess(null);
          }
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
        context$1$0.next = 18;
        break;

      case 12:
        loadFromLocalStorage('settings');

        $t = {
          stats: createTable(["#sf_header_SI", "#sf_content_SI", "#sf_footer_SI"], "stats", $ss),
          themes: createTable(["#sf_header_TL", "#sf_content_TL", "#sf_footer_TL"], "themes", $ss)
        };

        context$1$0.next = 16;
        return _regeneratorRuntime.awrap($idb.getOne("forums", "id", 54845));

      case 16:
        $forum = context$1$0.sent;

        console.log($forum);

        //$forum = repack($forum, "forum");

        //createGUI();

      case 18:
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
          var td, thread, player, start, date, tid;
          var theme;

          td = tr.cells;
          tid = getId();

          //date = getDate();

          theme = $idb.getOne('themes_' + $forum.id, "id", tid);

          console.log(theme);

          if (theme == null) {
            $forum.themes[1]++;

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

          console.log(theme);

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

          function addTheme() {
            if (thread == null) {
              $cd.f.threads.all++;
              $cd.f.themes[$cd.tid] = {};
              thread = $cd.f.themes[$cd.tid];

              thread.check = 0;
              thread.name = getName();
              thread.posts = getPosts();
              thread.date = date;
              thread.author = getAuthor();
            } else {
              thread.posts = getPosts();
            }
            player = $sd.players[thread.author.id];

            if (player == null) {
              $sd.players[thread.author.id] = generatePlayer(thread.author.name);
              player = $sd.players[thread.author.id];
            }

            if (player.forums[$cd.fid] == null) {
              player.forums[$cd.fid] = generateForumPlayer();
            }
            start = player.forums[$cd.fid].start;

            if (!start.gkExist($cd.tid)) {
              start.push($cd.tid);
            }
          }
          /////////////////////////////

          function getId() {
            var id;

            id = $(td[0]).find('a').node();
            id = id.href.split('tid=')[1];

            return Number(id);
          }
          /////////////////////////////

          function getName() {
            return $(td[0]).find('a').text();
          }
          /////////////////////////////

          function getPosts() {
            var posts;

            posts = $(td[2]).text().replace(/,/g, '');
            posts = Number(posts);

            if (theme == null) {
              return [0, posts];
            } else {
              return [theme.posts[0], posts];
            }
          }
          /////////////////////////////

          function getPages() {
            var page;

            page = [parseInt(theme.posts[0] / 20, 10), parseInt(theme.posts[1] / 20, 10)];

            return page;
          }
          /////////////////////////////

          function getDate() {
            var date;

            date = tr.previousSibling.data;
            date = date.match(/(\d+)/g);
            date = date[1] + '/' + date[2] + '/' + date[0] + ' ' + date[3] + ':' + date[4] + ':' + date[5] + '}';
            date = Date.parse(date);

            return date;
          }
          /////////////////////////////

          function getAuthor() {
            var a, name, id;

            a = $(td[3]).find('a[href*="info.php"]');
            name = a.text();
            id = a.node().href.match(/(\d+)/)[0];

            return [Number(id), name];
          }
        };

        url = 'http://www.ganjawars.ru/threads.php?fid=' + $cd.fid + '&page_id=' + index;
        count = 0;

        if (!(index != -1)) {
          context$1$0.next = 15;
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

        parseForum.gkDelay(750, this, [index, mode, stopDate]);

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
        context$1$0.next = 16;
        break;

      case 15:
        //saveToLocalStorage('data');
        //renderTables();
        displayProgress('done');

      case 16:
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

function generatePlayer(name) {
  return {
    name: name,
    status: {
      text: '',
      date: 0
    },
    forums: {}
  };
}

function generateForumPlayer() {
  return {
    sn: 0,
    enter: 0,
    exit: 0,
    goAway: 0,
    invite: 0,
    member: false,
    posts: 0,
    last: 0,
    words: [0, 0],
    start: [],
    themes: []
  };
}
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

},{"./../../../lib/common":1,"./../../../lib/dom":2,"./../../../lib/events":3,"./../../../lib/idb":4,"./../../../lib/prototypes":5,"./../../../lib/request":6,"./../../../lib/table":7,"./../src/icons":83,"./../src/structure":84,"babel-runtime/core-js/object/keys":9,"babel-runtime/regenerator":13}]},{},[85])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9jb21tb24uanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9kb20uanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9ldmVudHMuanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9pZGIuanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9wcm90b3R5cGVzLmpzIiwidzovU2NyaXB0cy91cy9saWIvcmVxdWVzdC5qcyIsInc6L1NjcmlwdHMvdXMvbGliL3RhYmxlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qva2V5cy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3IvcnVudGltZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2tleXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hLWZ1bmN0aW9uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYW4tb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY2xhc3NvZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvcmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jdHguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kZWZpbmVkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZGVzY3JpcHRvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kb20tY3JlYXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZW51bS1rZXlzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZXhwb3J0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZmFpbHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5mb3Itb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nZXQtbmFtZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nbG9iYWwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oYXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oaWRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaHRtbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmludm9rZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlvYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1hcnJheS1pdGVyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXMtYXJyYXkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1vYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNhbGwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXItZGVmaW5lLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZXRlY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLXN0ZXAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyYXRvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmtleW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQubGlicmFyeS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm1pY3JvdGFzay5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm9iamVjdC1zYXAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5wcm9wZXJ0eS1kZXNjLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUtYWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zYW1lLXZhbHVlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXNwZWNpZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNoYXJlZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNwZWNpZXMtY29uc3RydWN0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zdHJpY3QtbmV3LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudGFzay5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWludGVnZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50by1pb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tbGVuZ3RoLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudWlkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQud2tzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5rZXlzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3Oi9TY3JpcHRzL3VzL3NjcmlwdHMvU3RhdHMgRm9ydW0vc3JjL2ljb25zLmpzIiwidzovU2NyaXB0cy91cy9zY3JpcHRzL1N0YXRzIEZvcnVtL3NyYy9zdHJ1Y3R1cmUuanMiLCJ3Oi9TY3JpcHRzL3VzL3NjcmlwdHMvU3RhdHMgRm9ydW0vdG1wX3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsU0FBUyxNQUFNLEdBQUUsRUFFaEI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7QUFRakIsWUFBVSxFQUFFLG9CQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDO0FBQ2xDLFFBQUksT0FBTyxDQUFDOztBQUVaLFFBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFDO0FBQ3RCLGFBQU8sQ0FBQyxDQUFDO0tBQ1Y7O0FBRUQsV0FBTyxHQUFHLEFBQUMsR0FBRyxHQUFHLEdBQUcsR0FBSSxHQUFHLENBQUM7QUFDNUIsUUFBRyxHQUFHLEVBQUM7QUFDTCxhQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNqQyxNQUFJO0FBQ0gsYUFBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDMUM7O0FBRUQsV0FBTyxPQUFPLENBQUM7R0FDaEI7Ozs7Ozs7O0FBUUQsZUFBYSxF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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0b0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBOztBQ0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDOztBQUVYLGVBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVMsS0FBSyxFQUFDO0FBQ3BDLEtBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDL0IsQ0FBQyxDQUFDOztBQUVILFNBQU8sQ0FBQyxDQUFDO0NBQ1YiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gQ29tbW9uKCl7XHJcblxyXG59XHJcblxyXG5Db21tb24ucHJvdG90eXBlID0ge1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge251bWJlcn0gbm93XHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IG1heFxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW50XHJcbiAgICogQHJldHVybnMge251bWJlcn1cclxuICAgKi9cclxuICBnZXRQZXJjZW50OiBmdW5jdGlvbiAobm93LCBtYXgsIGludCl7XHJcbiAgICB2YXIgcGVyY2VudDtcclxuXHJcbiAgICBpZihub3cgPT0gMCB8fCBtYXggPT0gMCl7XHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIHBlcmNlbnQgPSAobm93IC8gbWF4KSAqIDEwMDtcclxuICAgIGlmKGludCl7XHJcbiAgICAgIHBlcmNlbnQgPSBwYXJzZUludChwZXJjZW50LCAxMCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgcGVyY2VudCA9IHBhcnNlRmxvYXQocGVyY2VudC50b0ZpeGVkKDEpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGVyY2VudDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBkYXRlXHJcbiAgICogQHBhcmFtIHtudWxsfGJvb2xlYW59IGZ1bGxcclxuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxyXG4gICAqL1xyXG4gIGdldE5vcm1hbERhdGU6IGZ1bmN0aW9uIChkYXRlLCBmdWxsKXtcclxuICAgIGlmKGlzTmFOKGRhdGUpKSByZXR1cm4ge2Q6IGRhdGUsIHQ6ICctJ307XHJcbiAgICBpZihkYXRlID09IDApIHJldHVybiB7ZDogJy0nLCB0OiAnLSd9O1xyXG5cclxuICAgIGRhdGUgPSBkYXRlICogMTAwMDtcclxuICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlKTtcclxuICAgIGRhdGUgPSBkYXRlLnRvTG9jYWxlU3RyaW5nKCk7XHJcblxyXG4gICAgZGF0ZSA9IGRhdGUubWF0Y2goLyhcXGQrKS4oXFxkKykuKFxcZCspLCAoXFxkKyk6KFxcZCspOiguKykvKTtcclxuXHJcbiAgICBpZihmdWxsICE9IG51bGwpIHtcclxuICAgICAgZGF0ZSA9IHtcclxuICAgICAgICBkOiBgJHtkYXRlWzFdfS4ke2RhdGVbMl19LiR7ZGF0ZVszXX1gLFxyXG4gICAgICAgIHQ6IGAke2RhdGVbNF19OiR7ZGF0ZVs1XX1gXHJcbiAgICAgIH07XHJcbiAgICB9ZWxzZXtcclxuICAgICAgZGF0ZSA9IHtcclxuICAgICAgICBkOiBgJHtkYXRlWzFdfS4ke2RhdGVbMl19LiR7ZGF0ZVszXS5jaGFyQXQoMil9JHtkYXRlWzNdLmNoYXJBdCgzKX1gLFxyXG4gICAgICAgIHQ6IGAke2RhdGVbNF19OiR7ZGF0ZVs1XX1gXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGU7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gdFxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZ2V0Tm9ybWFsVGltZTogZnVuY3Rpb24gKHQpe1xyXG4gICAgdmFyIHJlc3VsdCwgaGgsIG1tLCBzcztcclxuXHJcbiAgICBoaCA9IDA7XHJcbiAgICB0ID0gcGFyc2VJbnQodCAvIDEwMDAsIDEwKTtcclxuXHJcbiAgICBpZih0ID4gMzYwMCl7XHJcbiAgICAgIGhoID0gcGFyc2VJbnQodCAvIDM2MDAsIDEwKTtcclxuICAgICAgdCA9IHQgJSAzNjAwO1xyXG4gICAgfVxyXG4gICAgbW0gPSBwYXJzZUludCh0IC8gNjAsIDEwKTtcclxuICAgIHNzID0gcGFyc2VJbnQodCAlIDYwLCAxMCk7XHJcblxyXG4gICAgaWYobW0gPCAxMCkgbW0gPSBcIjBcIiArIG1tO1xyXG4gICAgaWYoc3MgPCAxMCkgc3MgPSBcIjBcIiArIHNzO1xyXG5cclxuICAgIHJlc3VsdCA9IGAke21tfToke3NzfWA7XHJcblxyXG4gICAgaWYoaGggPiAwKXtcclxuICAgICAgaWYoaGggPCAxMCkgaGggPSBcIjBcIiArIGhoO1xyXG4gICAgICByZXN1bHQgPSBgJHtoaH06JHtyZXN1bHR9YDtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICBjb252ZXJ0SUQ6IGZ1bmN0aW9uICh2YWx1ZSl7XHJcbiAgICB2YXIgcmVzdWx0LCBpLCBqO1xyXG5cclxuICAgIGlmKHZhbHVlIDwgMTAwMCkgcmV0dXJuIHZhbHVlO1xyXG5cclxuICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgIGogPSAxOyBpID0gdmFsdWUubGVuZ3RoO1xyXG4gICAgcmVzdWx0ID0gXCJcIjtcclxuXHJcbiAgICB3aGlsZShpLS0pe1xyXG4gICAgICByZXN1bHQgPSB2YWx1ZS5jaGFyQXQoaSkgKyByZXN1bHQ7XHJcbiAgICAgIGlmKGolMyA9PSAwICYmIGogIT0gMCAmJiBpICE9IDApe1xyXG4gICAgICAgIHJlc3VsdCA9ICcsJyArIHJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgICBqKytcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZW5jb2RlSGVhZGVyOiBmdW5jdGlvbiAoc3RyKXtcclxuICAgIHZhciBhLCBzdHJpbmc7XHJcblxyXG4gICAgaWYoIXN0cikgcmV0dXJuIHN0cjtcclxuXHJcbiAgICBzdHJpbmcgPSBTdHJpbmcoc3RyKS5yZXBsYWNlKC8lL2csICclMjUnKS5yZXBsYWNlKC9cXCsvZywgJyUyQicpLnJlcGxhY2UoL1xcbi9nLCAnJTBBJyk7XHJcbiAgICBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgYS5ocmVmID0gXCJodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9lbmNvZGVkX3N0cj0/XCIgKyBzdHJpbmc7XHJcbiAgICBzdHJpbmcgPSBhLmhyZWYuc3BsaXQoJ2VuY29kZWRfc3RyPT8nKVsxXTtcclxuICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC8lMjAvZywgJysnKS5yZXBsYWNlKC89L2csICclM0QnKS5yZXBsYWNlKC8mL2csICclMjYnKTtcclxuXHJcbiAgICByZXR1cm4gc3RyaW5nO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtaW5cclxuICAgKiBAcGFyYW0ge251bWJlcn0gbWF4XHJcbiAgICogQHJldHVybnMge251bWJlcn1cclxuICAgKi9cclxuICByYW5kb21OdW1iZXI6IGZ1bmN0aW9uIChtaW4sIG1heCl7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpe1xyXG4gIHJldHVybiBuZXcgQ29tbW9uKCk7XHJcbn07XHJcbiIsImZ1bmN0aW9uIEFwaShwYXJhbSkge1xyXG4gIHRoaXMuc2VsZWN0b3IgPSBwYXJhbTtcclxuICB0aGlzLm5vZGVMaXN0ID0gW107XHJcbiAgdGhpcy5sZW5ndGggPSAwO1xyXG59XHJcblxyXG5BcGkucHJvdG90eXBlID0ge1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge251bGx8bnVtYmVyfSBwYXJhbVxyXG4gICAqIEByZXR1cm5zIHtBcnJheX1cclxuICAgKi9cclxuICBub2RlOiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgIGlmIChwYXJhbSAhPSBudWxsKSB7XHJcbiAgICAgIGlmIChwYXJhbSA9PSAtMSkge1xyXG4gICAgICAgIHBhcmFtID0gdGhpcy5sZW5ndGggLSAxO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwYXJhbSA9IDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlTGlzdFtwYXJhbV0gPyB0aGlzLm5vZGVMaXN0W3BhcmFtXSA6IG51bGw7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHJldHVybnMge1tdfVxyXG4gICAqL1xyXG4gIG5vZGVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlTGlzdDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyB7W119XHJcbiAgICovXHJcbiAgbm9kZUFycjogZnVuY3Rpb24oKXtcclxuICAgIHZhciBub2RlcywgbGVuZ3RoO1xyXG5cclxuICAgIGxlbmd0aCA9IHRoaXMubm9kZUxpc3QubGVuZ3RoO1xyXG4gICAgbm9kZXMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcclxuXHJcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcclxuICAgICAgbm9kZXNbbGVuZ3RoXSA9IHRoaXMubm9kZUxpc3RbbGVuZ3RoXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbm9kZXM7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICBnZXRTZWxlY3RvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2VsZWN0b3I7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudWxsfCp9IHBhcmFtXHJcbiAgICogQHJldHVybnMge0FwaXxzdHJpbmd9XHJcbiAgICovXHJcbiAgaHRtbDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICBpZiAocGFyYW0gIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLm5vZGVMaXN0WzBdLmlubmVySFRNTCA9IHBhcmFtO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm5vZGVMaXN0WzBdID8gdGhpcy5ub2RlTGlzdFswXS5pbm5lckhUTUwgOiBcIlRoaXMgbm9kZSBpcyBudWxsLiBTZWxlY3RvcjogXCIgKyB0aGlzLnNlbGVjdG9yO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgdGV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRoaXMubm9kZUxpc3RbMF0gPyB0aGlzLm5vZGVMaXN0WzBdLnRleHRDb250ZW50IDogXCJUaGlzIG5vZGUgaXMgbnVsbC4gU2VsZWN0b3I6IFwiICsgdGhpcy5zZWxlY3RvcjtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXHJcbiAgICogQHJldHVybnMge0FwaX1cclxuICAgKi9cclxuICBhdHRyOiBmdW5jdGlvbihhdHRyaWJ1dGUsIHZhbHVlKXtcclxuICAgIHRoaXMubm9kZUxpc3RbMF0uc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXHJcbiAgICogQHJldHVybnMge0FwaX1cclxuICAgKi9cclxuICBmaW5kOiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgIHZhciB0ZXh0LCBzZWxlY3Rvciwgbm9kZSwga2V5ID0gZmFsc2U7XHJcbiAgICB2YXIgaSwgbGVuZ3RoLCBub2Rlc0FycmF5ID0gW107XHJcblxyXG4gICAgdGhpcy5zZWxlY3RvciA9IHBhcmFtO1xyXG4gICAgbm9kZSA9IHRoaXMubm9kZUxpc3RbMF0gPyB0aGlzLm5vZGVMaXN0WzBdIDogZG9jdW1lbnQ7XHJcblxyXG4gICAgdGV4dCA9IHBhcmFtLm1hdGNoKC8oLispOmNvbnRhaW5zXFwoXCJ+KC4rKVwiXFwpL2kpO1xyXG4gICAgaWYgKCF0ZXh0KSB7XHJcbiAgICAgIGtleSA9IHRydWU7XHJcbiAgICAgIHRleHQgPSBwYXJhbS5tYXRjaCgvKC4rKTpjb250YWluc1xcKFwiKC4rKVwiXFwpLyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRleHQpIHtcclxuICAgICAgc2VsZWN0b3IgPSB0ZXh0WzFdO1xyXG4gICAgICB0ZXh0ID0gdGV4dFsyXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNlbGVjdG9yID0gcGFyYW07XHJcbiAgICAgIHRleHQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgIG5vZGVzQXJyYXkgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gICAgICB0aGlzLm5vZGVMaXN0ID0gW107XHJcblxyXG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBub2Rlc0FycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGtleSkge1xyXG4gICAgICAgICAgaWYgKG5vZGVzQXJyYXlbaV0udGV4dENvbnRlbnQgPT0gdGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVMaXN0LnB1c2gobm9kZXNBcnJheVtpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChub2Rlc0FycmF5W2ldLnRleHRDb250ZW50LnNlYXJjaCh0ZXh0KSAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVMaXN0LnB1c2gobm9kZXNBcnJheVtpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm5vZGVMaXN0ID0gbm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuICAgIH1cclxuICAgIHRoaXMubGVuZ3RoID0gdGhpcy5ub2RlTGlzdC5sZW5ndGg7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXHJcbiAgICogQHJldHVybnMge0FwaX1cclxuICAgKi9cclxuICB1cDogZnVuY3Rpb24gKHBhcmFtKXtcclxuICAgIHZhciBub2RlO1xyXG5cclxuICAgIHRoaXMuc2VsZWN0b3IgKz0gXCIgPiB1cFtcIiArIHBhcmFtICsgXCJdXCI7XHJcbiAgICBwYXJhbSA9IHBhcmFtLnRvVXBwZXJDYXNlKCk7XHJcbiAgICBub2RlID0gdGhpcy5ub2RlTGlzdFswXS5wYXJlbnROb2RlO1xyXG4gICAgdGhpcy5ub2RlTGlzdCA9IFtdO1xyXG5cclxuICAgIHdoaWxlIChub2RlLm5vZGVOYW1lICE9IHBhcmFtKSB7XHJcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XHJcbiAgICAgIGlmIChub2RlID09IGRvY3VtZW50KSB7XHJcbiAgICAgICAgdGhpcy5ub2RlTGlzdFswXSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5ub2RlTGlzdFswXSA9IG5vZGU7XHJcbiAgICB0aGlzLmxlbmd0aCA9IDE7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmFtXHJcbiAgICogQHJldHVybnMge0FwaX1cclxuICAgKi9cclxuICBuZXh0OiBmdW5jdGlvbiAocGFyYW0pe1xyXG4gICAgdmFyIG5vZGUsIGxhc3ROb2RlO1xyXG5cclxuICAgIHRoaXMuc2VsZWN0b3IgKz0gXCIgPiBuZXh0W1wiICsgcGFyYW0gKyBcIl1cIjtcclxuICAgIHBhcmFtID0gcGFyYW0udG9VcHBlckNhc2UoKTtcclxuICAgIG5vZGUgPSB0aGlzLm5vZGVMaXN0WzBdLm5leHRTaWJsaW5nO1xyXG4gICAgbGFzdE5vZGUgPSBub2RlLnBhcmVudE5vZGUubGFzdENoaWxkO1xyXG4gICAgdGhpcy5ub2RlTGlzdCA9IFtdO1xyXG5cclxuICAgIHdoaWxlIChub2RlLm5vZGVOYW1lICE9IHBhcmFtKSB7XHJcbiAgICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xyXG4gICAgICBpZiAobm9kZSA9PSBsYXN0Tm9kZSkge1xyXG4gICAgICAgIHRoaXMubm9kZUxpc3RbMF0gPSBudWxsO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMubm9kZUxpc3RbMF0gPSBub2RlO1xyXG4gICAgdGhpcy5sZW5ndGggPSAxO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0geyp9IHBhcmFtXHJcbiAqIEByZXR1cm5zIHtBcGl9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICQocGFyYW0pIHtcclxuICB2YXIgYXBpLCBzdHI7XHJcblxyXG4gIGlmICh0eXBlb2YgcGFyYW0gPT0gXCJzdHJpbmdcIikge1xyXG4gICAgc3RyID0gcGFyYW0ubWF0Y2goLzwoLispPi8pO1xyXG4gICAgaWYgKHN0cikge1xyXG4gICAgICBhcGkgPSBuZXcgQXBpKCdjcmVhdGUoXCInICsgc3RyWzFdICsgJ1wiKScpO1xyXG4gICAgICBhcGkubm9kZUxpc3RbMF0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHN0clsxXSk7XHJcbiAgICAgIGFwaS5sZW5ndGggPSAxO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXBpID0gbmV3IEFwaShwYXJhbSkuZmluZChwYXJhbSk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGFwaSA9IG5ldyBBcGkoJ3NldChcIicgKyBwYXJhbS5ub2RlTmFtZSArICdcIiknKTtcclxuICAgIGFwaS5ub2RlTGlzdFswXSA9IHBhcmFtO1xyXG4gICAgYXBpLmxlbmd0aCA9IDE7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXBpO1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmRFdmVudChlbGVtZW50LCBldmVudCwgY2FsbGJhY2spIHtcclxuICBpZiAoIWVsZW1lbnQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgaWYgKGV2ZW50LnN1YnN0cigwLCAyKSA9PSAnb24nKSB7XHJcbiAgICAgIGV2ZW50ID0gZXZlbnQuc3Vic3RyKDIpO1xyXG4gICAgfVxyXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaywgZmFsc2UpO1xyXG4gIH0gZWxzZSBpZiAoZWxlbWVudC5hdHRhY2hFdmVudCkge1xyXG4gICAgaWYgKGV2ZW50LnN1YnN0cigwLCAyKSAhPSAnb24nKSB7XHJcbiAgICAgIGV2ZW50ID0gJ29uJytldmVudDtcclxuICAgIH1cclxuICAgIGVsZW1lbnQuYXR0YWNoRXZlbnQoZXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XHJcbiAgfVxyXG59OyIsImZ1bmN0aW9uIERCKG5hbWUpe1xyXG4gIHRoaXMubyA9IHdpbmRvdy5pbmRleGVkREIgfHwgd2luZG93Lm1vekluZGV4ZWREQiB8fCB3aW5kb3cud2Via2l0SW5kZXhlZERCIHx8IHdpbmRvdy5tc0luZGV4ZWREQjtcclxuICB0aGlzLnQgPSB3aW5kb3cuSURCVHJhbnNhY3Rpb24gfHwgd2luZG93LndlYmtpdElEQlRyYW5zYWN0aW9uIHx8IHdpbmRvdy5tc0lEQlRyYW5zYWN0aW9uO1xyXG4gIHRoaXMua3IgPSB3aW5kb3cuSURCS2V5UmFuZ2UgPSB3aW5kb3cuSURCS2V5UmFuZ2UgfHwgd2luZG93LndlYmtpdElEQktleVJhbmdlIHx8IHdpbmRvdy5tc0lEQktleVJhbmdlO1xyXG4gIHRoaXMuciA9IG51bGw7XHJcbiAgdGhpcy5kYiA9IG51bGw7XHJcbiAgdGhpcy50eCA9IG51bGw7XHJcbiAgdGhpcy5zdG9yZSA9IG51bGw7XHJcbiAgdGhpcy5pbmRleCA9IG51bGw7XHJcbiAgdGhpcy5uYW1lID0gbmFtZTtcclxuICB0aGlzLm1vZGlmeWluZ1RhYmxlID0gbnVsbDtcclxuICB0aGlzLnJlbW92ZVRhYmxlID0gbnVsbDtcclxuICB0aGlzLmluaUJhc2UgPSBudWxsO1xyXG4gIHRoaXMudmVyc2lvbiA9IDE7XHJcbn1cclxuXHJcbkRCLnByb3RvdHlwZSA9IHtcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKi9cclxuICBjb25uZWN0REI6IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG9uc3VjY2VzcykgPT57XHJcbiAgICAgIHZhciBpZGIgPSB0aGlzO1xyXG5cclxuICAgICAgY29uc29sZS5sb2coXCJSdW4gY29ubmVjdCwgdmVyc2lvbiBcIiArIGlkYi52ZXJzaW9uKTtcclxuXHJcbiAgICAgIGlkYi5yID0gaWRiLm8ub3Blbih0aGlzLm5hbWUsIGlkYi52ZXJzaW9uKTtcclxuXHJcbiAgICAgIGlkYi5yLm9uZXJyb3IgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IhXCIpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWRiLnIub25zdWNjZXNzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZGIuZGIgPSBpZGIuci5yZXN1bHQ7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzIGNvbm5lY3QhXCIpO1xyXG4gICAgICAgIG9uc3VjY2VzcyhpZGIpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy5yLm9udXBncmFkZW5lZWRlZCA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGlkYi5kYiA9IGUuY3VycmVudFRhcmdldC5yZXN1bHQ7XHJcblxyXG4gICAgICAgIGlmKGlkYi52ZXJzaW9uID09IDIpe1xyXG4gICAgICAgICAgaWRiLnVwZ3JhZGUodHJ1ZSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNyZWF0ZTogZGVmYXVsdHNcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlkYi51cGdyYWRlKGZhbHNlKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlVwZ3JhZGVkIVwiKTtcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7KltdfSBsaXN0XHJcbiAgICovXHJcbiAgc2V0TW9kaWZ5aW5nVGFibGVMaXN0OiBmdW5jdGlvbihsaXN0KXtcclxuICAgIHRoaXMubW9kaWZ5aW5nVGFibGUgPSBsaXN0O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7KltdfSBsaXN0XHJcbiAgICovXHJcbiAgc2V0SW5pVGFibGVMaXN0OiBmdW5jdGlvbihsaXN0KXtcclxuICAgIHRoaXMuaW5pQmFzZSA9IGxpc3Q7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBsaXN0XHJcbiAgICovXHJcbiAgc2V0UmVtb3ZlVGFibGVMaXN0OiBmdW5jdGlvbihsaXN0KXtcclxuICAgIHRoaXMucmVtb3ZlVGFibGUgPSBsaXN0O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pXHJcbiAgICovXHJcbiAgdXBncmFkZTogZnVuY3Rpb24oaW5pKXtcclxuICAgIHZhciB0YWJsZSwgdG9kbywgaWRiID0gdGhpcztcclxuXHJcbiAgICB0b2RvID0gaW5pID8gaWRiLmluaUJhc2UgOiBpZGIubW9kaWZ5aW5nVGFibGU7XHJcblxyXG4gICAgaWYodG9kbyl7XHJcbiAgICAgIHRvZG8uZm9yRWFjaChmdW5jdGlvbih0KXtcclxuICAgICAgICBpZihpZGIuZXhpc3QodC5uYW1lKSl7XHJcbiAgICAgICAgICB0YWJsZSA9IGlkYi5yLnRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKHQubmFtZSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICB0YWJsZSA9IGlkYi5kYi5jcmVhdGVPYmplY3RTdG9yZSh0Lm5hbWUsIHtrZXlQYXRoOiB0LmtleX0pO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzIGNyZWF0ZWQ6IFwiICsgdC5uYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHQuaW5kZXgpe1xyXG4gICAgICAgICAgdC5pbmRleC5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuICAgICAgICAgICAgdGFibGUuY3JlYXRlSW5kZXgoaW5kZXhbMF0sIGluZGV4WzFdLCB7dW5pcXVlOiBpbmRleFsyXX0pO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3MgY3JlYXRlZCBpbmRleDogXCIgKyBpbmRleC50b1N0cmluZygpKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHRvZG8gPSBudWxsO1xyXG4gICAgfVxyXG4gICAgaWYoaWRiLnJlbW92ZVRhYmxlKXtcclxuICAgICAgaWRiLnJlbW92ZVRhYmxlLmZvckVhY2goZnVuY3Rpb24odCl7XHJcbiAgICAgICAgaWRiLmRiLmRlbGV0ZU9iamVjdFN0b3JlKHQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2VzcyByZW1vdmVkOiBcIiArIHQpO1xyXG4gICAgICB9KTtcclxuICAgICAgaWRiLnJlbW92ZVRhYmxlID0gbnVsbDtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgZXhpc3Q6IGZ1bmN0aW9uIChuYW1lKXtcclxuICAgIHZhciBsZW5ndGgsIGFycmF5O1xyXG5cclxuICAgIGFycmF5ID0gdGhpcy5kYi5vYmplY3RTdG9yZU5hbWVzO1xyXG4gICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xyXG5cclxuICAgIHdoaWxlKGxlbmd0aC0tKXtcclxuICAgICAgaWYoYXJyYXlbbGVuZ3RoXSA9PSBuYW1lKXtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICovXHJcbiAgbmV4dFZlcnNpb246IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLnZlcnNpb24rKztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqL1xyXG4gIGRlbGV0ZURCOiBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5vLmRlbGV0ZURhdGFiYXNlKHRoaXMubmFtZSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3MgZGVsZXRlZDogXCIgKyB0aGlzLm5hbWUpO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0YWJsZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbmRleFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gdmFsdWVcclxuICAgKiBAcmV0dXJucyB7b2JqZWN0fVxyXG4gICAqL1xyXG4gIGdldE9uZTogZnVuY3Rpb24odGFibGUsIGluZGV4LCB2YWx1ZSl7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG9uc3VjY2VzcykgPT4ge1xyXG4gICAgICB0aGlzLnR4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbdGFibGVdLCBcInJlYWRvbmx5XCIpO1xyXG4gICAgICB0aGlzLnN0b3JlID0gdGhpcy50eC5vYmplY3RTdG9yZSh0YWJsZSk7XHJcblxyXG4gICAgICBpZihpbmRleCA9PSBcImlkXCIpe1xyXG4gICAgICAgIHRoaXMuc3RvcmUuZ2V0KHZhbHVlKS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICBpZihldmVudC50YXJnZXQucmVzdWx0KXtcclxuICAgICAgICAgICAgb25zdWNjZXNzKGV2ZW50LnRhcmdldC5yZXN1bHQpO1xyXG4gICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIG9uc3VjY2VzcyhudWxsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLnN0b3JlLmluZGV4KGluZGV4KTtcclxuICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy5pbmRleC5nZXQodmFsdWUpO1xyXG5cclxuICAgICAgICB0aGlzLmluZGV4Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgIG9uc3VjY2VzcyhldmVudC50YXJnZXQucmVzdWx0KTsgLy8g0LfQtNC10YHRjCDQstC+0LfQstGA0LDRidCw0LXRgtGB0Y8g0YDQtdC30YPQu9GM0YLQsNGCXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0YWJsZVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyW118bnVsbH0gcmFuZ2VcclxuICAgKiBAcGFyYW0ge3N0cmluZ3xudWxsfSBpbmRleFxyXG4gICAqL1xyXG4gIGdldEZldzogZnVuY3Rpb24odGFibGUsIHJhbmdlLCBpbmRleCl7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKG9uc3VjY2VzcykgPT57XHJcbiAgICAgIHZhciByZXN1bHRzID0gW107XHJcbiAgICAgIHZhciBrcnYgPSByYW5nZSA/IHRoaXMua3IuYm91bmQocmFuZ2VbMF0sIHJhbmdlWzFdKSA6IG51bGw7XHJcblxyXG4gICAgICB0aGlzLnR4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbdGFibGVdLCBcInJlYWRvbmx5XCIpO1xyXG4gICAgICB0aGlzLnN0b3JlID0gdGhpcy50eC5vYmplY3RTdG9yZSh0YWJsZSk7XHJcblxyXG4gICAgICBpZihpbmRleCl7XHJcbiAgICAgICAgdGhpcy5zdG9yZSA9IHRoaXMuc3RvcmUuaW5kZXgoaW5kZXgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLm9wZW5DdXJzb3Ioa3J2KS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgdmFyIGN1cnNvciA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XHJcblxyXG4gICAgICAgIGlmKGN1cnNvcil7XHJcbiAgICAgICAgICByZXN1bHRzLnB1c2goY3Vyc29yLnZhbHVlKTtcclxuICAgICAgICAgIGN1cnNvci5jb250aW51ZSgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJHb3QgYWxsIHJlc3VsdHM6IFwiKTtcclxuICAgICAgICAgIG9uc3VjY2VzcyhyZXN1bHRzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGFibGVcclxuICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YVxyXG4gICAqL1xyXG4gIGFkZDogZnVuY3Rpb24odGFibGUsIGRhdGEpe1xyXG4gICAgdHJ5e1xyXG4gICAgICB0aGlzLnR4ID0gdGhpcy5kYi50cmFuc2FjdGlvbihbdGFibGVdLCBcInJlYWR3cml0ZVwiKTtcclxuICAgICAgdGhpcy5zdG9yZSA9IHRoaXMudHgub2JqZWN0U3RvcmUodGFibGUpO1xyXG5cclxuICAgICAgdGhpcy5zdG9yZS5wdXQoZGF0YSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2VzcyBhZGRlZFwiKTtcclxuICAgIH1jYXRjaChlKXtcclxuICAgICAgY29uc29sZS5sb2coXCJGYWlsZWQgYWRkZWRcIik7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxyXG4gKlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKG9uc3VjY2VzcykgPT4ge1xyXG4gICAgICB2YXIgZGIsIGlkYjtcclxuXHJcbiAgICAgIGlkYiA9IG5ldyBEQihuYW1lKTtcclxuICAgICAgZGIgPSBpZGIuby5vcGVuKG5hbWUpO1xyXG5cclxuICAgICAgZGIub25zdWNjZXNzID0gZnVuY3Rpb24oKXtcclxuICAgICAgICBpZGIudmVyc2lvbiA9IGRiLnJlc3VsdC52ZXJzaW9uID09IDEgPyAyIDogZGIucmVzdWx0LnZlcnNpb247XHJcbiAgICAgICAgZGIucmVzdWx0LmNsb3NlKCk7XHJcblxyXG4gICAgICAgIG9uc3VjY2VzcyhpZGIpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIClcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG4gIC8qKlxyXG4gICAqINCS0YvQt9GL0LLQsNC10YIg0YTRg9C90LrRhtC40Y4g0YfQtdGA0LXQtyDRg9C60LDQt9Cw0L3QvdC+0LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0LzQuNC70LvQuNGB0LXQutGD0L3QtCDQsiDQutC+0L3RgtC10LrRgdGC0LUgY3R4INGBINCw0YDQs9GD0LzQtdC90YLQsNC80LggYXJncy5cclxuICAgKiBAcGFyYW0ge2ludH0gdGltZW91dFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjdHhcclxuICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzXHJcbiAgICogQHJldHVybiB7TnVtYmVyfSDQmNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDRgtCw0LnQvNCw0YPRgtCwLlxyXG4gICAqL1xyXG4gIEZ1bmN0aW9uLnByb3RvdHlwZS5na0RlbGF5ID0gZnVuY3Rpb24odGltZW91dCwgY3R4LCBhcmdzKXtcclxuICAgIHZhciBmdW5jID0gdGhpcztcclxuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICBmdW5jLmFwcGx5KGN0eCwgYXJncyB8fCBbXSk7XHJcbiAgICB9LCB0aW1lb3V0KTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0geyp9IHZhbHVlXHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgQXJyYXkucHJvdG90eXBlLmdrRXhpc3QgPSBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICB2YXIgbGVuZ3RoLCBhcnJheTtcclxuXHJcbiAgICBhcnJheSA9IHRoaXM7XHJcbiAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XHJcblxyXG4gICAgd2hpbGUobGVuZ3RoLS0pe1xyXG4gICAgICBpZihhcnJheVtsZW5ndGhdID09IHZhbHVlKXtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG1ldGhvZCwgcGFyYW0pIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKG9uc3VjY2Vzcywgb25mYWlsdXJlKSA9PiB7XHJcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgIHJlcXVlc3Qub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XHJcbiAgICBpZiAobWV0aG9kID09ICdQT1NUJykgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICByZXF1ZXN0LnNlbmQocGFyYW0pO1xyXG5cclxuICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09IDQgJiYgcmVxdWVzdC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgb25zdWNjZXNzKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT0gNCAmJiByZXF1ZXN0LnN0YXR1cyAhPSAyMDApIHtcclxuICAgICAgICBvbmZhaWx1cmUocmVxdWVzdCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vZG9tJyk7XHJcbnZhciBiaW5kRXZlbnQgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xyXG5cclxuZnVuY3Rpb24gVGFibGUobm9kZXNJRCwgc2V0dGluZ3NLZXksIHNldHRpbmdzKXtcclxuICB0aGlzLmhlYWRlciA9IG5vZGVzSURbMF07XHJcbiAgdGhpcy5ib2R5ID0gbm9kZXNJRFsxXTtcclxuICB0aGlzLmZvb3RlciA9IG5vZGVzSURbMl07XHJcbiAgdGhpcy5uYW1lID0gc2V0dGluZ3NLZXk7XHJcbiAgdGhpcy5zdHJ1Y3R1cmUgPSB7fTtcclxuICB0aGlzLmNvbnRlbnQgPSBbXTtcclxuICB0aGlzLnNpemUgPSBbXTtcclxuICAvL3RoaXMudGhlbWVzID0gJHNkLmZvcnVtc1skY2QuZmlkXS50aGVtZXM7XHJcbiAgLy90aGlzLnBsYXllcnMgPSAkc2QucGxheWVycztcclxuICB0aGlzLnNvcnQgPSB7XHJcbiAgICBjZWxsOiBudWxsLFxyXG4gICAgdHlwZTogbnVsbFxyXG4gIH07XHJcbiAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xyXG4gIHRoaXMucm93cyA9IDA7XHJcbn1cclxuXHJcblRhYmxlLnByb3RvdHlwZSA9IHtcclxuICAvKipcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGdldE5hbWU6IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtvYmplY3RbXX1cclxuICAgKi9cclxuICBnZXRDb250ZW50OiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuY29udGVudDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldExhc3RSb3dDb250ZW50OiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMucm93cyAtIDE7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGVsZW1lbnRcclxuICAgKi9cclxuICBwdXNoQ29udGVudDogZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgICB0aGlzLmNvbnRlbnQucHVzaChlbGVtZW50KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKi9cclxuICBjbGVhckNvbnRlbnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmNvbnRlbnQgPSBbXTtcclxuICAgIHRoaXMucm93cyA9IDA7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGljb25zXHJcbiAgICovXHJcbiAgc2V0Q29udHJvbDogZnVuY3Rpb24oaWNvbnMpe1xyXG4gICAgdGhpcy5zZXRTb3J0cyhpY29ucyk7XHJcbiAgICB0aGlzLnNldEZpbHRlcnMoaWNvbnMpO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAgICovXHJcbiAgZ2V0U3RydWN0dXJlOiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXMuc3RydWN0dXJlO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyW119IGFycmF5XHJcbiAgICovXHJcbiAgc2V0V2lkdGg6IGZ1bmN0aW9uKGFycmF5KXtcclxuICAgIHZhciB0YWJsZSA9IHRoaXM7XHJcblxyXG4gICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50LCBpZCl7XHJcbiAgICAgIHRhYmxlLnNpemVbaWRdID0gZWxlbWVudDtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbnxudWxsfSBjaGVja1xyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZ2V0V2lkdGg6IGZ1bmN0aW9uKGluZGV4LCBjaGVjayl7XHJcbiAgICB2YXIgd2lkdGg7XHJcblxyXG4gICAgaWYodGhpcy5zaXplW2luZGV4XSl7XHJcbiAgICAgIHdpZHRoID0gY2hlY2sgPyB0aGlzLnNpemVbaW5kZXhdIC0gMTcgOiB0aGlzLnNpemVbaW5kZXhdO1xyXG4gICAgICByZXR1cm4gd2lkdGggIT0gLTEgPyBgd2lkdGg9XCIke3dpZHRofVwiYCA6IFwiXCI7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGlkXHJcbiAgICogQHJldHVybnMge29iamVjdFtdfVxyXG4gICAqL1xyXG4gIHNldENvbnRlbnQ6IGZ1bmN0aW9uKGlkKXtcclxuICAgIHZhciB0YWJsZSwgbztcclxuXHJcbiAgICB0YWJsZSA9IHRoaXM7XHJcbiAgICBvID0ge307XHJcblxyXG4gICAgT2JqZWN0LmtleXModGFibGUuZ2V0U3RydWN0dXJlKCkpLmZvckVhY2goZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICBpZih0YWJsZS5zdHJ1Y3R1cmVbdmFsdWVdLnBhdGgubGVuZ3RoID09IDIpe1xyXG4gICAgICAgIG9bdmFsdWVdID0gZXZhbCh0YWJsZS5zdHJ1Y3R1cmVbdmFsdWVdLnBhdGhbMF0gKyBcIlsnXCIgKyBpZCArIFwiJ11cIiArIHRhYmxlLnN0cnVjdHVyZVt2YWx1ZV0ucGF0aFsxXSk7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIGlmKHRhYmxlLnN0cnVjdHVyZVt2YWx1ZV0ucGF0aFswXSA9PSBcIk51bWJlcihpZClcIil7XHJcbiAgICAgICAgICBvW3ZhbHVlXSA9IE51bWJlcihpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZighdGFibGUuZmlsdGVyaW5nKG8pKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICB0YWJsZS5wdXNoQ29udGVudChvKTtcclxuICAgIHJldHVybiB0YWJsZS5jb250ZW50W3RhYmxlLmdldExhc3RSb3dDb250ZW50KCldO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpY29uc1xyXG4gICAqL1xyXG4gIGNoYW5nZVNvcnRJbWFnZTogZnVuY3Rpb24oaWNvbnMpe1xyXG4gICAgdmFyIHZhbHVlLCB0eXBlLCBvbGRJbWcsIG5ld0ltZztcclxuXHJcbiAgICB2YWx1ZSA9IHRoaXMuc2V0dGluZ3Muc29ydFt0aGlzLm5hbWVdLmNlbGw7XHJcbiAgICB0eXBlID0gdGhpcy5zZXR0aW5ncy5zb3J0W3RoaXMubmFtZV0udHlwZTtcclxuXHJcbiAgICBpZih2YWx1ZSAhPSB0aGlzLnNvcnQuY2VsbCl7XHJcbiAgICAgIG9sZEltZyA9ICQodGhpcy5oZWFkZXIpLmZpbmQoYHRkW3NvcnQ9XCIke3RoaXMuc29ydC5jZWxsfVwiXWApLm5vZGUoKS5sYXN0Q2hpbGQ7XHJcbiAgICAgIG9sZEltZy5zcmMgPSBpY29ucy5zb3J0TnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBuZXdJbWcgPSAkKHRoaXMuaGVhZGVyKS5maW5kKGB0ZFtzb3J0PVwiJHt2YWx1ZX1cIl1gKS5ub2RlKCkubGFzdENoaWxkO1xyXG4gICAgbmV3SW1nLnNyYyA9IHR5cGUgPyBpY29ucy5zb3J0RG93biA6IGljb25zLnNvcnRVcDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGRcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2VsbFxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpY29uc1xyXG4gICAqL1xyXG4gIHNldFNvcnRJbWFnZTogZnVuY3Rpb24odGQsIGNlbGwsIGljb25zKXtcclxuICAgIHZhciBpbWcgPSAkKHRkKS5maW5kKCdpbWcnKS5ub2RlKCk7XHJcblxyXG4gICAgaWYodGhpcy5zZXR0aW5ncy5zb3J0W3RoaXMubmFtZV0uY2VsbCAhPSBjZWxsKXtcclxuICAgICAgaW1nLnNyYyA9IGljb25zLnNvcnROdWxsO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGltZy5zcmMgPSB0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS50eXBlID8gaWNvbnMuc29ydERvd24gOiBpY29ucy5zb3J0VXA7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKi9cclxuICBzZXRTb3J0OiBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5zb3J0LmNlbGwgPSB0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS5jZWxsO1xyXG4gICAgdGhpcy5zb3J0LnR5cGUgPSB0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS50eXBlO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICovXHJcbiAgc29ydGluZzogZnVuY3Rpb24oKXtcclxuICAgIHZhciB2YWx1ZSwgdHlwZSwgYXJyYXk7XHJcblxyXG4gICAgYXJyYXkgPSB0aGlzLmdldENvbnRlbnQoKTtcclxuICAgIHZhbHVlID0gdGhpcy5zZXR0aW5ncy5zb3J0W3RoaXMubmFtZV0uY2VsbDtcclxuICAgIHR5cGUgPSB0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS50eXBlO1xyXG5cclxuICAgIGFycmF5LnNvcnQoXHJcbiAgICAgIGZ1bmN0aW9uKGUxLCBlMil7XHJcbiAgICAgICAgdmFyIHAxLCBwMiwgcmVzO1xyXG5cclxuICAgICAgICBwMSA9IGUxW3ZhbHVlXTsgcDIgPSBlMlt2YWx1ZV07XHJcblxyXG4gICAgICAgIGlmKHR5cGVvZiBwMSA9PSBcIm9iamVjdFwiKXtcclxuICAgICAgICAgIGlmKHAxLm5hbWUpe1xyXG4gICAgICAgICAgICBwMSA9IHAxLm5hbWU7XHJcbiAgICAgICAgICAgIHAyID0gcDIubmFtZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKHAxLnRleHQpe1xyXG4gICAgICAgICAgICBwMSA9IHAxLnRleHQ7XHJcbiAgICAgICAgICAgIHAyID0gcDIudGV4dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlcyA9IGNvbXBhcmUocDEsIHAyKTtcclxuICAgICAgICBpZih0eXBlKSByZXMgPSByZXMgPT0gLTEgPyAxIDogLTE7XHJcbiAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb21wYXJlKGUxLCBlMil7XHJcbiAgICAgIGlmIChlMSA+IGUyKSByZXR1cm4gMTtcclxuICAgICAgZWxzZSBpZiAoZTEgPCBlMikgcmV0dXJuIC0xO1xyXG4gICAgICBlbHNlIHJldHVybiAwO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpY29uc1xyXG4gICAqL1xyXG4gIHNldFNvcnRzOiBmdW5jdGlvbihpY29ucyl7XHJcbiAgICB2YXIgdGFibGUgPSB0aGlzO1xyXG5cclxuICAgICQodGFibGUuaGVhZGVyKS5maW5kKCd0ZFtzb3J0XScpLm5vZGVBcnIoKS5mb3JFYWNoKGZ1bmN0aW9uKHRkKXtcclxuICAgICAgdmFyIHZhbHVlO1xyXG5cclxuICAgICAgdmFsdWUgPSB0ZC5nZXRBdHRyaWJ1dGUoXCJzb3J0XCIpO1xyXG4gICAgICB0YWJsZS5zZXRTb3J0SW1hZ2UodGQsIHZhbHVlLCBpY29ucyk7XHJcbiAgICAgIGJpbmRFdmVudCh0ZCwgJ29uY2xpY2snLCBmdW5jdGlvbigpe2RvU29ydCh0ZCwgdGFibGUpfSk7XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0geypbXX0gdmFsdWVzXHJcbiAgICovXHJcbiAgc2V0U3RydWN0dXJlOiBmdW5jdGlvbih2YWx1ZXMpe1xyXG4gICAgdmFyIHRhYmxlLCBwYXRocztcclxuXHJcbiAgICB0YWJsZSA9IHRoaXM7XHJcbiAgICBwYXRocyA9IHZhbHVlc1swXTtcclxuXHJcbiAgICB2YWx1ZXMuZm9yRWFjaChmdW5jdGlvbihlbGVtKXtcclxuICAgICAgaWYoZWxlbVswXSAhPSBcInBhdGhzXCIpIHtcclxuICAgICAgICB0YWJsZS5zdHJ1Y3R1cmVbZWxlbVswXV0gPSB7XHJcbiAgICAgICAgICBwYXRoOiBnZXRQYXRoKGVsZW1bMV0sIGVsZW1bMl0pLFxyXG4gICAgICAgICAgZmlsdGVyVHlwZTogZWxlbVszXSxcclxuICAgICAgICAgIGZpbHRlck5hbWU6IGVsZW1bNF1cclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRQYXRoKGUxLCBlMil7XHJcbiAgICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgICBpZihlMSl7XHJcbiAgICAgICAgcmVzdWx0ID0gcGF0aHNbZTFdICsgZTI7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnNwbGl0KFwiW2lkXVwiKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcmVzdWx0ID0gW2UyXTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpY29uc1xyXG4gICAqL1xyXG4gIHNldEZpbHRlcnM6IGZ1bmN0aW9uKGljb25zKXtcclxuICAgIHZhciB0YWJsZSA9IHRoaXM7XHJcblxyXG4gICAgJCh0YWJsZS5mb290ZXIpLmZpbmQoJ3RkW2ZpbHRlcl0nKS5ub2RlQXJyKCkuZm9yRWFjaChmdW5jdGlvbih0ZCl7XHJcbiAgICAgIHZhciB2YWx1ZSwgaWNvO1xyXG5cclxuICAgICAgdmFsdWUgPSB0ZC5nZXRBdHRyaWJ1dGUoXCJmaWx0ZXJcIik7XHJcblxyXG4gICAgICBpZih0YWJsZS5zdHJ1Y3R1cmVbdmFsdWVdLmZpbHRlclR5cGUpe1xyXG4gICAgICAgIGljbyA9IHRhYmxlLnNldHRpbmdzLnNob3cudGhlbWVzW3ZhbHVlXSA/IGljb25zLmJveE9uIDogaWNvbnMuYm94T2ZmO1xyXG4gICAgICAgIGljbyA9IGA8aW1nIHN0eWxlPVwibWFyZ2luLWxlZnQ6IDFweDtcIiBzcmM9XCIke2ljb31cIi8+YDtcclxuICAgICAgICB0ZC5pbm5lckhUTUwgKz0gaWNvO1xyXG5cclxuICAgICAgICBiaW5kRXZlbnQodGQsICdvbmNsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgICAgIGRvRmlsdGVyKHRkLCB0YWJsZS5zZXR0aW5ncywgdGFibGUuc3RydWN0dXJlW3ZhbHVlXS5maWx0ZXJUeXBlLCB0YWJsZS5zdHJ1Y3R1cmVbdmFsdWVdLmZpbHRlck5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge29iamVjdH0gcm93XHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgZmlsdGVyaW5nOiBmdW5jdGlvbihyb3cpe1xyXG4gICAgdmFyIGZpbHRlciwgdmFsdWUsIGxlbmd0aCwgbGlzdDtcclxuXHJcbiAgICBmaWx0ZXIgPSB0aGlzLnNldHRpbmdzLnNob3dbdGhpcy5uYW1lXTtcclxuICAgIGxpc3QgPSBPYmplY3Qua2V5cyhmaWx0ZXIpO1xyXG4gICAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XHJcblxyXG4gICAgd2hpbGUobGVuZ3RoLS0pe1xyXG4gICAgICB2YWx1ZSA9IGxpc3RbbGVuZ3RoXTtcclxuXHJcbiAgICAgIHN3aXRjaCAoZmlsdGVyW3ZhbHVlXS50eXBlKXtcclxuICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxyXG4gICAgICAgICAgaWYgKGZpbHRlclt2YWx1ZV0udmFsdWUgIT0gcm93W3ZhbHVlXSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgXCJtdWx0aXBsZVwiOlxyXG4gICAgICAgICAgaWYoIWV4aXN0KHJvd1t2YWx1ZV0udGV4dCwgZmlsdGVyW3ZhbHVlXS52YWx1ZSkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBjYXNlIFwiY2hlY2tcIjpcclxuICAgICAgICAgIGlmKCFleGlzdChyb3dbdmFsdWVdLm5hbWUsIGZpbHRlclt2YWx1ZV0udmFsdWUpKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGlmIChjb21wYXJlKGZpbHRlclt2YWx1ZV0udmFsdWUgLCByb3dbdmFsdWVdKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb21wYXJlKGssIG4pe1xyXG4gICAgICAvL2lmKGsgPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZihpc05hTihuKSkgbiA9IHBhcnNlSW50KG4sIDEwKTtcclxuICAgICAgcmV0dXJuICEoa1swXSA8PSBuICYmIG4gPD0ga1sxXSk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nW119IG5vZGVzSURcclxuICogQHBhcmFtIHtzdHJpbmd9IHNldHRpbmdzS2V5XHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xyXG4gKiBAcmV0dXJucyB7VGFibGV9XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChub2Rlc0lELCBzZXR0aW5nc0tleSwgc2V0dGluZ3Mpe1xyXG4gIHJldHVybiBuZXcgVGFibGUobm9kZXNJRCwgc2V0dGluZ3NLZXksIHNldHRpbmdzKTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qva2V5c1wiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZlwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIi8vIFRoaXMgbWV0aG9kIG9mIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBuZWVkcyB0byBiZVxuLy8ga2VwdCBpZGVudGljYWwgdG8gdGhlIHdheSBpdCBpcyBvYnRhaW5lZCBpbiBydW50aW1lLmpzXG52YXIgZyA9XG4gIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgPyBnbG9iYWwgOlxuICB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiID8gd2luZG93IDpcbiAgdHlwZW9mIHNlbGYgPT09IFwib2JqZWN0XCIgPyBzZWxmIDogdGhpcztcblxuLy8gVXNlIGBnZXRPd25Qcm9wZXJ0eU5hbWVzYCBiZWNhdXNlIG5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCBjYWxsaW5nXG4vLyBgaGFzT3duUHJvcGVydHlgIG9uIHRoZSBnbG9iYWwgYHNlbGZgIG9iamVjdCBpbiBhIHdvcmtlci4gU2VlICMxODMuXG52YXIgaGFkUnVudGltZSA9IGcucmVnZW5lcmF0b3JSdW50aW1lICYmXG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGcpLmluZGV4T2YoXCJyZWdlbmVyYXRvclJ1bnRpbWVcIikgPj0gMDtcblxuLy8gU2F2ZSB0aGUgb2xkIHJlZ2VuZXJhdG9yUnVudGltZSBpbiBjYXNlIGl0IG5lZWRzIHRvIGJlIHJlc3RvcmVkIGxhdGVyLlxudmFyIG9sZFJ1bnRpbWUgPSBoYWRSdW50aW1lICYmIGcucmVnZW5lcmF0b3JSdW50aW1lO1xuXG4vLyBGb3JjZSByZWV2YWx1dGF0aW9uIG9mIHJ1bnRpbWUuanMuXG5nLnJlZ2VuZXJhdG9yUnVudGltZSA9IHVuZGVmaW5lZDtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9ydW50aW1lXCIpO1xuXG5pZiAoaGFkUnVudGltZSkge1xuICAvLyBSZXN0b3JlIHRoZSBvcmlnaW5hbCBydW50aW1lLlxuICBnLnJlZ2VuZXJhdG9yUnVudGltZSA9IG9sZFJ1bnRpbWU7XG59IGVsc2Uge1xuICAvLyBSZW1vdmUgdGhlIGdsb2JhbCBwcm9wZXJ0eSBhZGRlZCBieSBydW50aW1lLmpzLlxuICB0cnkge1xuICAgIGRlbGV0ZSBnLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgfSBjYXRjaChlKSB7XG4gICAgZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSB1bmRlZmluZWQ7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiBtb2R1bGUuZXhwb3J0cywgX19lc01vZHVsZTogdHJ1ZSB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9tYXN0ZXIvTElDRU5TRSBmaWxlLiBBblxuICogYWRkaXRpb25hbCBncmFudCBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluXG4gKiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfU3ltYm9sID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2xcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX09iamVjdCRjcmVhdGUgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9jcmVhdGVcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX09iamVjdCRzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIilbXCJkZWZhdWx0XCJdO1xuXG52YXIgX1Byb21pc2UgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2VcIilbXCJkZWZhdWx0XCJdO1xuXG4hKGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBfU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBfU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgZ2VuZXJhdG9yID0gX09iamVjdCRjcmVhdGUoKG91dGVyRm4gfHwgR2VuZXJhdG9yKS5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9IEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICBwcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24gKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvciA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCIgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbiAoZ2VuRnVuKSB7XG4gICAgaWYgKF9PYmplY3Qkc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIF9PYmplY3Qkc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGlmICghKHRvU3RyaW5nVGFnU3ltYm9sIGluIGdlbkZ1bikpIHtcbiAgICAgICAgZ2VuRnVuW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IF9PYmplY3QkY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgdmFsdWUgaW5zdGFuY2VvZiBBd2FpdEFyZ3VtZW50YCB0byBkZXRlcm1pbmUgaWYgdGhlIHlpZWxkZWQgdmFsdWUgaXNcbiAgLy8gbWVhbnQgdG8gYmUgYXdhaXRlZC4gU29tZSBtYXkgY29uc2lkZXIgdGhlIG5hbWUgb2YgdGhpcyBtZXRob2QgdG9vXG4gIC8vIGN1dGVzeSwgYnV0IHRoZXkgYXJlIGN1cm11ZGdlb25zLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24gKGFyZykge1xuICAgIHJldHVybiBuZXcgQXdhaXRBcmd1bWVudChhcmcpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEF3YWl0QXJndW1lbnQoYXJnKSB7XG4gICAgdGhpcy5hcmcgPSBhcmc7XG4gIH1cblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEF3YWl0QXJndW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gX1Byb21pc2UucmVzb2x2ZSh2YWx1ZS5hcmcpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfUHJvbWlzZS5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG4gICAgICAgICAgLy8gcmVzdWx0IGZvciB0aGlzIGl0ZXJhdGlvbiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHNhbWVcbiAgICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuICAgICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2VcbiAgICAgICAgICAvLyB3aGVuIGFuIGF3YWl0ZWQgUHJvbWlzZSBpcyByZWplY3RlZC4gVGhpcyBkaWZmZXJlbmNlIGluXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG4gICAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIChzd2FsbG93IGl0IGFuZCBjb250aW51ZSwgbWFudWFsbHkgLnRocm93IGl0IGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcbiAgICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIHJlYXNvbiBvdXRzaWRlIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIHNvIHRoZVxuICAgICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuICAgICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MuZG9tYWluKSB7XG4gICAgICBpbnZva2UgPSBwcm9jZXNzLmRvbWFpbi5iaW5kKGludm9rZSk7XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IF9Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZykgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbiAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpKTtcblxuICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbikgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIgfHwgbWV0aG9kID09PSBcInRocm93XCIgJiYgZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBBIHJldHVybiBvciB0aHJvdyAod2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIHRocm93XG4gICAgICAgICAgICAvLyBtZXRob2QpIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgICAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIGEgcmV0dXJuIG1ldGhvZCwgZ2l2ZSBpdCBhXG4gICAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgICB2YXIgcmV0dXJuTWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbXCJyZXR1cm5cIl07XG4gICAgICAgICAgICBpZiAocmV0dXJuTWV0aG9kKSB7XG4gICAgICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChyZXR1cm5NZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBhcmcpO1xuICAgICAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSByZXR1cm4gbWV0aG9kIHRocmV3IGFuIGV4Y2VwdGlvbiwgbGV0IHRoYXRcbiAgICAgICAgICAgICAgICAvLyBleGNlcHRpb24gcHJldmFpbCBvdmVyIHRoZSBvcmlnaW5hbCByZXR1cm4gb3IgdGhyb3cuXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgICAgICAvLyBDb250aW51ZSB3aXRoIHRoZSBvdXRlciByZXR1cm4sIG5vdyB0aGF0IHRoZSBkZWxlZ2F0ZVxuICAgICAgICAgICAgICAvLyBpdGVyYXRvciBoYXMgYmVlbiB0ZXJtaW5hdGVkLlxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSwgZGVsZWdhdGUuaXRlcmF0b3IsIGFyZyk7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIExpa2UgcmV0dXJuaW5nIGdlbmVyYXRvci50aHJvdyh1bmNhdWdodCksIGJ1dCB3aXRob3V0IHRoZVxuICAgICAgICAgICAgLy8gb3ZlcmhlYWQgb2YgYW4gZXh0cmEgZnVuY3Rpb24gY2FsbC5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBEZWxlZ2F0ZSBnZW5lcmF0b3IgcmFuIGFuZCBoYW5kbGVkIGl0cyBvd24gZXhjZXB0aW9ucyBzb1xuICAgICAgICAgIC8vIHJlZ2FyZGxlc3Mgb2Ygd2hhdCB0aGUgbWV0aG9kIHdhcywgd2UgY29udGludWUgYXMgaWYgaXQgaXNcbiAgICAgICAgICAvLyBcIm5leHRcIiB3aXRoIGFuIHVuZGVmaW5lZCBhcmcuXG4gICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuICAgICAgICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgICAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuICAgICAgICAgICAgY29udGV4dC5uZXh0ID0gZGVsZWdhdGUubmV4dExvYztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCkge1xuICAgICAgICAgICAgY29udGV4dC5zZW50ID0gYXJnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZSA/IEdlblN0YXRlQ29tcGxldGVkIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmRlbGVnYXRlICYmIG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihhcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcFt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvclwiO1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsXG4gICAgICAgICAgICBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbiByZXNldChza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIHRoaXMuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uIGRpc3BhdGNoRXhjZXB0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuICAgICAgICByZXR1cm4gISFjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24gYWJydXB0KHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiYgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmICh0eXBlID09PSBcImJyZWFrXCIgfHwgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJiBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJiBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fCByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uIGZpbmlzaChmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uIF9jYXRjaCh0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24gZGVsZWdhdGVZaWVsZChpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuLy8gQW1vbmcgdGhlIHZhcmlvdXMgdHJpY2tzIGZvciBvYnRhaW5pbmcgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbFxuLy8gb2JqZWN0LCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBtb3N0IHJlbGlhYmxlIHRlY2huaXF1ZSB0aGF0IGRvZXMgbm90XG4vLyB1c2UgaW5kaXJlY3QgZXZhbCAod2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kpLlxudHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6IHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB1bmRlZmluZWQpOyIsInZhciAkID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKXtcbiAgcmV0dXJuICQuY3JlYXRlKFAsIEQpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQuY29yZScpLk9iamVjdC5rZXlzOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJC5jb3JlJykuT2JqZWN0LnNldFByb3RvdHlwZU9mOyIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvJC5jb3JlJykuUHJvbWlzZTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zeW1ib2wnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5TeW1ib2w7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtUQUddKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcxLjIuNid9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmKHRoYXQgPT09IHVuZGVmaW5lZClyZXR1cm4gZm47XG4gIHN3aXRjaChsZW5ndGgpe1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07IiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5kb2N1bWVudFxuICAvLyBpbiBvbGQgSUUgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCdcbiAgLCBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTsiLCIvLyBhbGwgZW51bWVyYWJsZSBvYmplY3Qga2V5cywgaW5jbHVkZXMgc3ltYm9sc1xudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIga2V5cyAgICAgICA9ICQuZ2V0S2V5cyhpdClcbiAgICAsIGdldFN5bWJvbHMgPSAkLmdldFN5bWJvbHM7XG4gIGlmKGdldFN5bWJvbHMpe1xuICAgIHZhciBzeW1ib2xzID0gZ2V0U3ltYm9scyhpdClcbiAgICAgICwgaXNFbnVtICA9ICQuaXNFbnVtXG4gICAgICAsIGkgICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShzeW1ib2xzLmxlbmd0aCA+IGkpaWYoaXNFbnVtLmNhbGwoaXQsIGtleSA9IHN5bWJvbHNbaSsrXSkpa2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuLyQuY29yZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0LldcbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKHBhcmFtKXtcbiAgICAgICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBDID8gbmV3IEMocGFyYW0pIDogQyhwYXJhbSk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIGlmKElTX1BST1RPKShleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KSlba2V5XSA9IG91dDtcbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgLy8gd3JhcFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59OyIsInZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuLyQuaXMtYXJyYXktaXRlcicpXG4gICwgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vJC50by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0KXtcbiAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvcjtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICB9XG59OyIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpXG4gICwgZ2V0TmFtZXMgID0gcmVxdWlyZSgnLi8kJykuZ2V0TmFtZXNcbiAgLCB0b1N0cmluZyAgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24oaXQpe1xuICB0cnkge1xuICAgIHJldHVybiBnZXROYW1lcyhpdCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmdldCA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICBpZih3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJylyZXR1cm4gZ2V0V2luZG93TmFtZXMoaXQpO1xuICByZXR1cm4gZ2V0TmFtZXModG9JT2JqZWN0KGl0KSk7XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTsiLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcyl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaChlKXtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmKHJldCAhPT0gdW5kZWZpbmVkKWFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi8kLnByb3BlcnR5LWRlc2MnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLmhpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpe1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSAkLmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vJC5saWJyYXJ5JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oaWRlJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIEl0ZXJhdG9ycyAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuLyQuaXRlci1jcmVhdGUnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCBnZXRQcm90byAgICAgICA9IHJlcXVpcmUoJy4vJCcpLmdldFByb3RvXG4gICwgSVRFUkFUT1IgICAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBCVUdHWSAgICAgICAgICA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKSAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gICwgRkZfSVRFUkFUT1IgICAgPSAnQEBpdGVyYXRvcidcbiAgLCBLRVlTICAgICAgICAgICA9ICdrZXlzJ1xuICAsIFZBTFVFUyAgICAgICAgID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKXtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24oa2luZCl7XG4gICAgaWYoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaChraW5kKXtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHICAgICAgICA9IE5BTUUgKyAnIEl0ZXJhdG9yJ1xuICAgICwgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTXG4gICAgLCBWQUxVRVNfQlVHID0gZmFsc2VcbiAgICAsIHByb3RvICAgICAgPSBCYXNlLnByb3RvdHlwZVxuICAgICwgJG5hdGl2ZSAgICA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXVxuICAgICwgJGRlZmF1bHQgICA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpXG4gICAgLCBtZXRob2RzLCBrZXk7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYoJG5hdGl2ZSl7XG4gICAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG8oJGRlZmF1bHQuY2FsbChuZXcgQmFzZSkpO1xuICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAvLyBGRiBmaXhcbiAgICBpZighTElCUkFSWSAmJiBoYXMocHJvdG8sIEZGX0lURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICAgIGlmKERFRl9WQUxVRVMgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpe1xuICAgICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICAgIH1cbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpe1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gID0gcmV0dXJuVGhpcztcbiAgaWYoREVGQVVMVCl7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogIERFRl9WQUxVRVMgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6ICAgIElTX1NFVCAgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJylcbiAgICB9O1xuICAgIGlmKEZPUkNFRClmb3Ioa2V5IGluIG1ldGhvZHMpe1xuICAgICAgaWYoIShrZXkgaW4gcHJvdG8pKXJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07IiwidmFyIElURVJBVE9SICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uKCl7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xufSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMsIHNraXBDbG9zaW5nKXtcbiAgaWYoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgID0gWzddXG4gICAgICAsIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24oKXsgc2FmZSA9IHRydWU7IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uKCl7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb25lLCB2YWx1ZSl7XG4gIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHt9OyIsInZhciAkT2JqZWN0ID0gT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZTogICAgICRPYmplY3QuY3JlYXRlLFxuICBnZXRQcm90bzogICAkT2JqZWN0LmdldFByb3RvdHlwZU9mLFxuICBpc0VudW06ICAgICB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZSxcbiAgZ2V0RGVzYzogICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIHNldERlc2M6ICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgICRPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgZ2V0S2V5czogICAgJE9iamVjdC5rZXlzLFxuICBnZXROYW1lczogICAkT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6ICRPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICBlYWNoOiAgICAgICBbXS5mb3JFYWNoXG59OyIsInZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhPKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlOyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuLyQudGFzaycpLnNldFxuICAsIE9ic2VydmVyICA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyXG4gICwgcHJvY2VzcyAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBQcm9taXNlICAgPSBnbG9iYWwuUHJvbWlzZVxuICAsIGlzTm9kZSAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbnZhciBmbHVzaCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBwYXJlbnQsIGRvbWFpbiwgZm47XG4gIGlmKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKXtcbiAgICBwcm9jZXNzLmRvbWFpbiA9IG51bGw7XG4gICAgcGFyZW50LmV4aXQoKTtcbiAgfVxuICB3aGlsZShoZWFkKXtcbiAgICBkb21haW4gPSBoZWFkLmRvbWFpbjtcbiAgICBmbiAgICAgPSBoZWFkLmZuO1xuICAgIGlmKGRvbWFpbilkb21haW4uZW50ZXIoKTtcbiAgICBmbigpOyAvLyA8LSBjdXJyZW50bHkgd2UgdXNlIGl0IG9ubHkgZm9yIFByb21pc2UgLSB0cnkgLyBjYXRjaCBub3QgcmVxdWlyZWRcbiAgICBpZihkb21haW4pZG9tYWluLmV4aXQoKTtcbiAgICBoZWFkID0gaGVhZC5uZXh0O1xuICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gIGlmKHBhcmVudClwYXJlbnQuZW50ZXIoKTtcbn07XG5cbi8vIE5vZGUuanNcbmlmKGlzTm9kZSl7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG4vLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcbn0gZWxzZSBpZihPYnNlcnZlcil7XG4gIHZhciB0b2dnbGUgPSAxXG4gICAgLCBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9IC10b2dnbGU7XG4gIH07XG4vLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxufSBlbHNlIGlmKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKXtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZsdXNoKTtcbiAgfTtcbi8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4vLyAtIHNldEltbWVkaWF0ZVxuLy8gLSBNZXNzYWdlQ2hhbm5lbFxuLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2Vcbi8vIC0gc2V0VGltZW91dFxufSBlbHNlIHtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXNhcChmbil7XG4gIHZhciB0YXNrID0ge2ZuOiBmbiwgbmV4dDogdW5kZWZpbmVkLCBkb21haW46IGlzTm9kZSAmJiBwcm9jZXNzLmRvbWFpbn07XG4gIGlmKGxhc3QpbGFzdC5uZXh0ID0gdGFzaztcbiAgaWYoIWhlYWQpe1xuICAgIGhlYWQgPSB0YXNrO1xuICAgIG5vdGlmeSgpO1xuICB9IGxhc3QgPSB0YXNrO1xufTsiLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgY29yZSAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCBmYWlscyAgID0gcmVxdWlyZSgnLi8kLmZhaWxzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgZXhlYyl7XG4gIHZhciBmbiAgPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuaGlkZScpOyIsIi8vIDcuMi45IFNhbWVWYWx1ZSh4LCB5KVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuaXMgfHwgZnVuY3Rpb24gaXMoeCwgeSl7XG4gIHJldHVybiB4ID09PSB5ID8geCAhPT0gMCB8fCAxIC8geCA9PT0gMSAvIHkgOiB4ICE9IHggJiYgeSAhPSB5O1xufTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgZ2V0RGVzYyAgPSByZXF1aXJlKCcuLyQnKS5nZXREZXNjXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uKE8sIHByb3RvKXtcbiAgYW5PYmplY3QoTyk7XG4gIGlmKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24odGVzdCwgYnVnZ3ksIHNldCl7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuLyQuY3R4JykoRnVuY3Rpb24uY2FsbCwgZ2V0RGVzYyhPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90byl7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYoYnVnZ3kpTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjb3JlICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCAkICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKVxuICAsIFNQRUNJRVMgICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSBjb3JlW0tFWV07XG4gIGlmKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pJC5zZXREZXNjKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vJCcpLnNldERlc2NcbiAgLCBoYXMgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKVxuICAsIFNQRUNJRVMgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpdGhyb3cgVHlwZUVycm9yKG5hbWUgKyBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vJC50by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgaW52b2tlICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmh0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdG5lciA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIXNldFRhc2sgfHwgIWNsZWFyVGFzayl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihyZXF1aXJlKCcuLyQuY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0bmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuLyQuaW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuLyQudG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsIFN5bWJvbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5TeW1ib2w7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBTeW1ib2wgJiYgU3ltYm9sW25hbWVdIHx8IChTeW1ib2wgfHwgdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59OyIsInZhciBjbGFzc29mICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vJC5hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgdG9JT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwiLy8gMTkuMS4yLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLyQudG8tb2JqZWN0Jyk7XG5cbnJlcXVpcmUoJy4vJC5vYmplY3Qtc2FwJykoJ2tleXMnLCBmdW5jdGlvbigka2V5cyl7XG4gIHJldHVybiBmdW5jdGlvbiBrZXlzKGl0KXtcbiAgICByZXR1cm4gJGtleXModG9PYmplY3QoaXQpKTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge3NldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuLyQuc2V0LXByb3RvJykuc2V0fSk7IiwiIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIExJQlJBUlkgICAgPSByZXF1aXJlKCcuLyQubGlicmFyeScpXG4gICwgZ2xvYmFsICAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGN0eCAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBjbGFzc29mICAgID0gcmVxdWlyZSgnLi8kLmNsYXNzb2YnKVxuICAsICRleHBvcnQgICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBpc09iamVjdCAgID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsIGFGdW5jdGlvbiAgPSByZXF1aXJlKCcuLyQuYS1mdW5jdGlvbicpXG4gICwgc3RyaWN0TmV3ICA9IHJlcXVpcmUoJy4vJC5zdHJpY3QtbmV3JylcbiAgLCBmb3JPZiAgICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgc2V0UHJvdG8gICA9IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXRcbiAgLCBzYW1lICAgICAgID0gcmVxdWlyZSgnLi8kLnNhbWUtdmFsdWUnKVxuICAsIFNQRUNJRVMgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKVxuICAsIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vJC5zcGVjaWVzLWNvbnN0cnVjdG9yJylcbiAgLCBhc2FwICAgICAgID0gcmVxdWlyZSgnLi8kLm1pY3JvdGFzaycpXG4gICwgUFJPTUlTRSAgICA9ICdQcm9taXNlJ1xuICAsIHByb2Nlc3MgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIGlzTm9kZSAgICAgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJ1xuICAsIFAgICAgICAgICAgPSBnbG9iYWxbUFJPTUlTRV1cbiAgLCBXcmFwcGVyO1xuXG52YXIgdGVzdFJlc29sdmUgPSBmdW5jdGlvbihzdWIpe1xuICB2YXIgdGVzdCA9IG5ldyBQKGZ1bmN0aW9uKCl7fSk7XG4gIGlmKHN1Yil0ZXN0LmNvbnN0cnVjdG9yID0gT2JqZWN0O1xuICByZXR1cm4gUC5yZXNvbHZlKHRlc3QpID09PSB0ZXN0O1xufTtcblxudmFyIFVTRV9OQVRJVkUgPSBmdW5jdGlvbigpe1xuICB2YXIgd29ya3MgPSBmYWxzZTtcbiAgZnVuY3Rpb24gUDIoeCl7XG4gICAgdmFyIHNlbGYgPSBuZXcgUCh4KTtcbiAgICBzZXRQcm90byhzZWxmLCBQMi5wcm90b3R5cGUpO1xuICAgIHJldHVybiBzZWxmO1xuICB9XG4gIHRyeSB7XG4gICAgd29ya3MgPSBQICYmIFAucmVzb2x2ZSAmJiB0ZXN0UmVzb2x2ZSgpO1xuICAgIHNldFByb3RvKFAyLCBQKTtcbiAgICBQMi5wcm90b3R5cGUgPSAkLmNyZWF0ZShQLnByb3RvdHlwZSwge2NvbnN0cnVjdG9yOiB7dmFsdWU6IFAyfX0pO1xuICAgIC8vIGFjdHVhbCBGaXJlZm94IGhhcyBicm9rZW4gc3ViY2xhc3Mgc3VwcG9ydCwgdGVzdCB0aGF0XG4gICAgaWYoIShQMi5yZXNvbHZlKDUpLnRoZW4oZnVuY3Rpb24oKXt9KSBpbnN0YW5jZW9mIFAyKSl7XG4gICAgICB3b3JrcyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBhY3R1YWwgVjggYnVnLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9NDE2MlxuICAgIGlmKHdvcmtzICYmIHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpKXtcbiAgICAgIHZhciB0aGVuYWJsZVRoZW5Hb3R0ZW4gPSBmYWxzZTtcbiAgICAgIFAucmVzb2x2ZSgkLnNldERlc2Moe30sICd0aGVuJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHRoZW5hYmxlVGhlbkdvdHRlbiA9IHRydWU7IH1cbiAgICAgIH0pKTtcbiAgICAgIHdvcmtzID0gdGhlbmFibGVUaGVuR290dGVuO1xuICAgIH1cbiAgfSBjYXRjaChlKXsgd29ya3MgPSBmYWxzZTsgfVxuICByZXR1cm4gd29ya3M7XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBzYW1lQ29uc3RydWN0b3IgPSBmdW5jdGlvbihhLCBiKXtcbiAgLy8gbGlicmFyeSB3cmFwcGVyIHNwZWNpYWwgY2FzZVxuICBpZihMSUJSQVJZICYmIGEgPT09IFAgJiYgYiA9PT0gV3JhcHBlcilyZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIHNhbWUoYSwgYik7XG59O1xudmFyIGdldENvbnN0cnVjdG9yID0gZnVuY3Rpb24oQyl7XG4gIHZhciBTID0gYW5PYmplY3QoQylbU1BFQ0lFU107XG4gIHJldHVybiBTICE9IHVuZGVmaW5lZCA/IFMgOiBDO1xufTtcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uKEMpe1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbigkJHJlc29sdmUsICQkcmVqZWN0KXtcbiAgICBpZihyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ICA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpLFxuICB0aGlzLnJlamVjdCAgPSBhRnVuY3Rpb24ocmVqZWN0KVxufTtcbnZhciBwZXJmb3JtID0gZnVuY3Rpb24oZXhlYyl7XG4gIHRyeSB7XG4gICAgZXhlYygpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB7ZXJyb3I6IGV9O1xuICB9XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uKHJlY29yZCwgaXNSZWplY3Qpe1xuICBpZihyZWNvcmQubilyZXR1cm47XG4gIHJlY29yZC5uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcmVjb3JkLmM7XG4gIGFzYXAoZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSByZWNvcmQudlxuICAgICAgLCBvayAgICA9IHJlY29yZC5zID09IDFcbiAgICAgICwgaSAgICAgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbihyZWFjdGlvbil7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsXG4gICAgICAgICwgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmVcbiAgICAgICAgLCByZWplY3QgID0gcmVhY3Rpb24ucmVqZWN0XG4gICAgICAgICwgcmVzdWx0LCB0aGVuO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYoaGFuZGxlcil7XG4gICAgICAgICAgaWYoIW9rKXJlY29yZC5oID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyID09PSB0cnVlID8gdmFsdWUgOiBoYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICBpZihyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2Upe1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSl7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSlydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgY2hhaW4ubGVuZ3RoID0gMDtcbiAgICByZWNvcmQubiA9IGZhbHNlO1xuICAgIGlmKGlzUmVqZWN0KXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHZhciBwcm9taXNlID0gcmVjb3JkLnBcbiAgICAgICAgLCBoYW5kbGVyLCBjb25zb2xlO1xuICAgICAgaWYoaXNVbmhhbmRsZWQocHJvbWlzZSkpe1xuICAgICAgICBpZihpc05vZGUpe1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbil7XG4gICAgICAgICAgaGFuZGxlcih7cHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZX0pO1xuICAgICAgICB9IGVsc2UgaWYoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcil7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IHJlY29yZC5hID0gdW5kZWZpbmVkO1xuICAgIH0sIDEpO1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdmFyIHJlY29yZCA9IHByb21pc2UuX2RcbiAgICAsIGNoYWluICA9IHJlY29yZC5hIHx8IHJlY29yZC5jXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCByZWFjdGlvbjtcbiAgaWYocmVjb3JkLmgpcmV0dXJuIGZhbHNlO1xuICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXtcbiAgICByZWFjdGlvbiA9IGNoYWluW2krK107XG4gICAgaWYocmVhY3Rpb24uZmFpbCB8fCAhaXNVbmhhbmRsZWQocmVhY3Rpb24ucHJvbWlzZSkpcmV0dXJuIGZhbHNlO1xuICB9IHJldHVybiB0cnVlO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB2YXIgcmVjb3JkID0gdGhpcztcbiAgaWYocmVjb3JkLmQpcmV0dXJuO1xuICByZWNvcmQuZCA9IHRydWU7XG4gIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXG4gIHJlY29yZC52ID0gdmFsdWU7XG4gIHJlY29yZC5zID0gMjtcbiAgcmVjb3JkLmEgPSByZWNvcmQuYy5zbGljZSgpO1xuICBub3RpZnkocmVjb3JkLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzXG4gICAgLCB0aGVuO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZihyZWNvcmQucCA9PT0gdmFsdWUpdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKXtcbiAgICAgIGFzYXAoZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7cjogcmVjb3JkLCBkOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgICAgIHJlY29yZC5zID0gMTtcbiAgICAgIG5vdGlmeShyZWNvcmQsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2goZSl7XG4gICAgJHJlamVjdC5jYWxsKHtyOiByZWNvcmQsIGQ6IGZhbHNlfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmKCFVU0VfTkFUSVZFKXtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgUCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgdmFyIHJlY29yZCA9IHRoaXMuX2QgPSB7XG4gICAgICBwOiBzdHJpY3ROZXcodGhpcywgUCwgUFJPTUlTRSksICAgICAgICAgLy8gPC0gcHJvbWlzZVxuICAgICAgYzogW10sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgICAgYTogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgICBzOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICAgIGQ6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBkb25lXG4gICAgICB2OiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgIGg6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBoYW5kbGVkIHJlamVjdGlvblxuICAgICAgbjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgcmVjb3JkLCAxKSwgY3R4KCRyZWplY3QsIHJlY29yZCwgMSkpO1xuICAgIH0gY2F0Y2goZXJyKXtcbiAgICAgICRyZWplY3QuY2FsbChyZWNvcmQsIGVycik7XG4gICAgfVxuICB9O1xuICByZXF1aXJlKCcuLyQucmVkZWZpbmUtYWxsJykoUC5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xuICAgICAgdmFyIHJlYWN0aW9uID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBQKSlcbiAgICAgICAgLCBwcm9taXNlICA9IHJlYWN0aW9uLnByb21pc2VcbiAgICAgICAgLCByZWNvcmQgICA9IHRoaXMuX2Q7XG4gICAgICByZWFjdGlvbi5vayAgID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVjb3JkLmMucHVzaChyZWFjdGlvbik7XG4gICAgICBpZihyZWNvcmQuYSlyZWNvcmQuYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHJlY29yZC5zKW5vdGlmeShyZWNvcmQsIGZhbHNlKTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbihvblJlamVjdGVkKXtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7UHJvbWlzZTogUH0pO1xucmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJykoUCwgUFJPTUlTRSk7XG5yZXF1aXJlKCcuLyQuc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuLyQuY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpe1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVqZWN0ICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAkJHJlamVjdChyKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8IHRlc3RSZXNvbHZlKHRydWUpKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICAvLyBpbnN0YW5jZW9mIGluc3RlYWQgb2YgaW50ZXJuYWwgc2xvdCBjaGVjayBiZWNhdXNlIHdlIHNob3VsZCBmaXggaXQgd2l0aG91dCByZXBsYWNlbWVudCBuYXRpdmUgUHJvbWlzZSBjb3JlXG4gICAgaWYoeCBpbnN0YW5jZW9mIFAgJiYgc2FtZUNvbnN0cnVjdG9yKHguY29uc3RydWN0b3IsIHRoaXMpKXJldHVybiB4O1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVzb2x2ZSAgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgJCRyZXNvbHZlKHgpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7XG4gIFAuYWxsKGl0ZXIpWydjYXRjaCddKGZ1bmN0aW9uKCl7fSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IGdldENvbnN0cnVjdG9yKHRoaXMpXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVzb2x2ZSAgICA9IGNhcGFiaWxpdHkucmVzb2x2ZVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3RcbiAgICAgICwgdmFsdWVzICAgICA9IFtdO1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIHZhbHVlcy5wdXNoLCB2YWx1ZXMpO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHZhbHVlcy5sZW5ndGhcbiAgICAgICAgLCByZXN1bHRzICAgPSBBcnJheShyZW1haW5pbmcpO1xuICAgICAgaWYocmVtYWluaW5nKSQuZWFjaC5jYWxsKHZhbHVlcywgZnVuY3Rpb24ocHJvbWlzZSwgaW5kZXgpe1xuICAgICAgICB2YXIgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgaWYoYWxyZWFkeUNhbGxlZClyZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICBlbHNlIHJlc29sdmUocmVzdWx0cyk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKVxuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgYWJydXB0ID0gcGVyZm9ybShmdW5jdGlvbigpe1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgID0gcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGluZGV4ID0gdGhpcy5faVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiB7dmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZX07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7dmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZX07XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgJCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZScpXG4gICwgJGZhaWxzICAgICAgICAgPSByZXF1aXJlKCcuLyQuZmFpbHMnKVxuICAsIHNoYXJlZCAgICAgICAgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuLyQuc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIHVpZCAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpXG4gICwgd2tzICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQud2tzJylcbiAgLCBrZXlPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5rZXlvZicpXG4gICwgJG5hbWVzICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2V0LW5hbWVzJylcbiAgLCBlbnVtS2V5cyAgICAgICA9IHJlcXVpcmUoJy4vJC5lbnVtLWtleXMnKVxuICAsIGlzQXJyYXkgICAgICAgID0gcmVxdWlyZSgnLi8kLmlzLWFycmF5JylcbiAgLCBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi8kLnByb3BlcnR5LWRlc2MnKVxuICAsIGdldERlc2MgICAgICAgID0gJC5nZXREZXNjXG4gICwgc2V0RGVzYyAgICAgICAgPSAkLnNldERlc2NcbiAgLCBfY3JlYXRlICAgICAgICA9ICQuY3JlYXRlXG4gICwgZ2V0TmFtZXMgICAgICAgPSAkbmFtZXMuZ2V0XG4gICwgJFN5bWJvbCAgICAgICAgPSBnbG9iYWwuU3ltYm9sXG4gICwgJEpTT04gICAgICAgICAgPSBnbG9iYWwuSlNPTlxuICAsIF9zdHJpbmdpZnkgICAgID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5XG4gICwgc2V0dGVyICAgICAgICAgPSBmYWxzZVxuICAsIEhJRERFTiAgICAgICAgID0gd2tzKCdfaGlkZGVuJylcbiAgLCBpc0VudW0gICAgICAgICA9ICQuaXNFbnVtXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyAgICAgPSBzaGFyZWQoJ3N5bWJvbHMnKVxuICAsIHVzZU5hdGl2ZSAgICAgID0gdHlwZW9mICRTeW1ib2wgPT0gJ2Z1bmN0aW9uJ1xuICAsIE9iamVjdFByb3RvICAgID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0NSSVBUT1JTICYmICRmYWlscyhmdW5jdGlvbigpe1xuICByZXR1cm4gX2NyZWF0ZShzZXREZXNjKHt9LCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBzZXREZXNjKHRoaXMsICdhJywge3ZhbHVlOiA3fSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbihpdCwga2V5LCBEKXtcbiAgdmFyIHByb3RvRGVzYyA9IGdldERlc2MoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmKHByb3RvRGVzYylkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgc2V0RGVzYyhpdCwga2V5LCBEKTtcbiAgaWYocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bylzZXREZXNjKE9iamVjdFByb3RvLCBrZXksIHByb3RvRGVzYyk7XG59IDogc2V0RGVzYztcblxudmFyIHdyYXAgPSBmdW5jdGlvbih0YWcpe1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sLnByb3RvdHlwZSk7XG4gIHN5bS5fayA9IHRhZztcbiAgREVTQ1JJUFRPUlMgJiYgc2V0dGVyICYmIHNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIGlmKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSl7XG4gICAgaWYoIUQuZW51bWVyYWJsZSl7XG4gICAgICBpZighaGFzKGl0LCBISURERU4pKXNldERlc2MoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHtlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKX0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIHNldERlc2MoaXQsIGtleSwgRCk7XG59O1xudmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCl7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKVxuICAgICwgaSAgICA9IDBcbiAgICAsIGwgPSBrZXlzLmxlbmd0aFxuICAgICwga2V5O1xuICB3aGlsZShsID4gaSkkZGVmaW5lUHJvcGVydHkoaXQsIGtleSA9IGtleXNbaSsrXSwgUFtrZXldKTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciAkY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGl0LCBQKXtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpe1xuICB2YXIgRSA9IGlzRW51bS5jYWxsKHRoaXMsIGtleSk7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV1cbiAgICA/IEUgOiB0cnVlO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICB2YXIgRCA9IGdldERlc2MoaXQgPSB0b0lPYmplY3QoaXQpLCBrZXkpO1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnZXROYW1lcyh0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZighaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4pcmVzdWx0LnB1c2goa2V5KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnZXROYW1lcyh0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkpcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJHN0cmluZ2lmeSA9IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7XG4gIGlmKGl0ID09PSB1bmRlZmluZWQgfHwgaXNTeW1ib2woaXQpKXJldHVybjsgLy8gSUU4IHJldHVybnMgc3RyaW5nIG9uIHVuZGVmaW5lZFxuICB2YXIgYXJncyA9IFtpdF1cbiAgICAsIGkgICAgPSAxXG4gICAgLCAkJCAgID0gYXJndW1lbnRzXG4gICAgLCByZXBsYWNlciwgJHJlcGxhY2VyO1xuICB3aGlsZSgkJC5sZW5ndGggPiBpKWFyZ3MucHVzaCgkJFtpKytdKTtcbiAgcmVwbGFjZXIgPSBhcmdzWzFdO1xuICBpZih0eXBlb2YgcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykkcmVwbGFjZXIgPSByZXBsYWNlcjtcbiAgaWYoJHJlcGxhY2VyIHx8ICFpc0FycmF5KHJlcGxhY2VyKSlyZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgIGlmKCRyZXBsYWNlcil2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgIGlmKCFpc1N5bWJvbCh2YWx1ZSkpcmV0dXJuIHZhbHVlO1xuICB9O1xuICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gIHJldHVybiBfc3RyaW5naWZ5LmFwcGx5KCRKU09OLCBhcmdzKTtcbn07XG52YXIgYnVnZ3lKU09OID0gJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHZhciBTID0gJFN5bWJvbCgpO1xuICAvLyBNUyBFZGdlIGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyB7fVxuICAvLyBXZWJLaXQgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIG51bGxcbiAgLy8gVjggdGhyb3dzIG9uIGJveGVkIHN5bWJvbHNcbiAgcmV0dXJuIF9zdHJpbmdpZnkoW1NdKSAhPSAnW251bGxdJyB8fCBfc3RyaW5naWZ5KHthOiBTfSkgIT0gJ3t9JyB8fCBfc3RyaW5naWZ5KE9iamVjdChTKSkgIT0gJ3t9Jztcbn0pO1xuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmKCF1c2VOYXRpdmUpe1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCl7XG4gICAgaWYoaXNTeW1ib2wodGhpcykpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcbiAgICByZXR1cm4gd3JhcCh1aWQoYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gIGlzU3ltYm9sID0gZnVuY3Rpb24oaXQpe1xuICAgIHJldHVybiBpdCBpbnN0YW5jZW9mICRTeW1ib2w7XG4gIH07XG5cbiAgJC5jcmVhdGUgICAgID0gJGNyZWF0ZTtcbiAgJC5pc0VudW0gICAgID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICAkLmdldERlc2MgICAgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkLnNldERlc2MgICAgPSAkZGVmaW5lUHJvcGVydHk7XG4gICQuc2V0RGVzY3MgICA9ICRkZWZpbmVQcm9wZXJ0aWVzO1xuICAkLmdldE5hbWVzICAgPSAkbmFtZXMuZ2V0ID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gICQuZ2V0U3ltYm9scyA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYoREVTQ1JJUFRPUlMgJiYgIXJlcXVpcmUoJy4vJC5saWJyYXJ5Jykpe1xuICAgIHJlZGVmaW5lKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xuICB9XG59XG5cbnZhciBzeW1ib2xTdGF0aWNzID0ge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihrZXkpe1xuICAgIHJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uKCl7IHNldHRlciA9IGZhbHNlOyB9XG59O1xuLy8gMTkuNC4yLjIgU3ltYm9sLmhhc0luc3RhbmNlXG4vLyAxOS40LjIuMyBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlXG4vLyAxOS40LjIuNCBTeW1ib2wuaXRlcmF0b3Jcbi8vIDE5LjQuMi42IFN5bWJvbC5tYXRjaFxuLy8gMTkuNC4yLjggU3ltYm9sLnJlcGxhY2Vcbi8vIDE5LjQuMi45IFN5bWJvbC5zZWFyY2hcbi8vIDE5LjQuMi4xMCBTeW1ib2wuc3BlY2llc1xuLy8gMTkuNC4yLjExIFN5bWJvbC5zcGxpdFxuLy8gMTkuNC4yLjEyIFN5bWJvbC50b1ByaW1pdGl2ZVxuLy8gMTkuNC4yLjEzIFN5bWJvbC50b1N0cmluZ1RhZ1xuLy8gMTkuNC4yLjE0IFN5bWJvbC51bnNjb3BhYmxlc1xuJC5lYWNoLmNhbGwoKFxuICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLCcgK1xuICAnc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcbikuc3BsaXQoJywnKSwgZnVuY3Rpb24oaXQpe1xuICB2YXIgc3ltID0gd2tzKGl0KTtcbiAgc3ltYm9sU3RhdGljc1tpdF0gPSB1c2VOYXRpdmUgPyBzeW0gOiB3cmFwKHN5bSk7XG59KTtcblxuc2V0dGVyID0gdHJ1ZTtcblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcsIHtTeW1ib2w6ICRTeW1ib2x9KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdTeW1ib2wnLCBzeW1ib2xTdGF0aWNzKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhdXNlTmF0aXZlLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuMiBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAkZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gMjQuMy4yIEpTT04uc3RyaW5naWZ5KHZhbHVlIFssIHJlcGxhY2VyIFssIHNwYWNlXV0pXG4kSlNPTiAmJiAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghdXNlTmF0aXZlIHx8IGJ1Z2d5SlNPTiksICdKU09OJywge3N0cmluZ2lmeTogJHN0cmluZ2lmeX0pO1xuXG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpO1xuSXRlcmF0b3JzLk5vZGVMaXN0ID0gSXRlcmF0b3JzLkhUTUxDb2xsZWN0aW9uID0gSXRlcmF0b3JzLkFycmF5OyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBsb2FkaW5nOiBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEdRQVpBS1VBQUF4ZURJU3loRXlPVkx6YXZDUnlMR3lpYk5UdTFLVEtwQnhxSEdTYVpNem16RHgrUE9UNjVMVFN0QnhtSEhTcWRCUm1IRnlXWE1UaXhEUjZOQlJpRkp6Q25GU1NWTVRleEN4eUxIU21kT1QyNUt6T3JDUnVKR1NlWk96NjdMVFd0QXhlRkl5NmpMemV2R3lpZE56eTNLVEtyQnhxSk5UcTFEeUNSSHl1ZkZTU1hDeDJOR1NlYk96KzdMVFd2UEQvOEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFDSC9DMDVGVkZORFFWQkZNaTR3QXdFQUFBQWgrUVFKRFFBdkFDd0FBQUFBR1FBWkFBQUd6c0NYY0Vnc0dvL0lwSExKZkowVTBPaFEwMnB1UUlBc0FGSjlaU1loRGZPcTVRcEgyWlZrcVpsb0tWMTBGakpRUnJSYmo5QlEwSEpJU0I5YUtDQU9YVUprQUNOSUFsa0xMUnNtaDBJQldSUmlSUm9VV1J0Q2Raa09XU1ZHRWxrZ2Vra3FXUTlHRFZrY2swWnlpMFVpQUNCbVNRbFpHVVlrV0FBWFJnWkNIZ1JaRlVjTFdSRkdMTWtIcGlkSEZWckpSTHNCQ0ZrQ1NDM0x2Smd2RWNDM0Nra0tKbG9ZUXl4NDErZ1lXQnhESFZvZzhFa2FLU1lFUTd2Mzh1a1RNV1JBaFJBSEsxUmcwS1NodzRjUWh3UUJBQ0g1QkFrTkFERUFMQUFBQUFBWkFCa0FoUXhlRElTeWhFeUtUTHpldkR4K1BKekduR3lpYk56eTNDUnVKRnlXWE5UcTFLelNyQlJtSEpTK2xIU3FmT1Q2NUZTU1ZNem16RVNHUkt6T3JCUmlGSXk2ak1UZXhLVEtwSFNtZEN4eUxHU2FaTnp1M0xUU3RCeG1IT3o2N0F4ZUZJUzJoRXlPVkR5Q1JHeWlkT1QyNUNSeUxGeWFaTlR1MUp6Q25IeXVmRlNTWEVTR1RNVGl4S1RLckxUV3RCeHFIT3orN1BELzhBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFiWXdKaHdTQ3dhajhXS0JZWnNGaHNBQW9ya2RKSTZBTUFMczZrZU9ZZ3M0QlB4RWtrSmNYWTFMTENxSkpFNjJ4SjZTcDJCTTUwbE9MUWVRaE5aQ0FkSUxtSW1NQjRJQVVNY0gxa2pTQ0Y5Z1RFQlhVTUJXUlJVUlNRVVdSTkRUR2NNZEVZc1dSK1hTQ3BaS1VZY1dTV21TQmlTUmdOWkhiZEhmQmhHQjVFQUZrMHdKVmtOUndSWkNVOURMYXdLUnloaXpFSW5GR1VSTDFraFNCNEVrUUpES1I4R0Z4MlJaRTNlSDZReER3akZZaWhWRVNHbTAyb2ZCV2FJckZBVG9reEFPeHBFWmRGemtNaUdGQ1UrUUd0WXhNT0VCSjhvbWdrQ0FDSDVCQWtOQURBQUxBQUFBQUFaQUJrQWhReGVESVMyaEV5S1RMemV2Q3gyTEd5aWJLVEtwTnp5M0NSdUpIU3FkTFRXdE5UcTFEeUNSQlJtSEZ5V1hMVFN0T1Q2NUp6Q25Nem16S3pTckh5dWZCUmlGRlNTVk1UZXhEeCtQSFNtZEt6T3JDeHlMRVNHUk96NjdKekduQXhlRkV5T1ZEUjZOR3lpZEtUS3JPVDI1Q1J5TEhTcWZMemF2TlR1MUJ4cUhGeWFaSHl1aE1UaXhFU0dUT3orN0p6R3BQRC84QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQWJYUUpod1NCUXVVTVdrc2pqWUxKWlE1c2NaaFI1T0FRQmdnNndTSDYyS2RzejF3a2lPc1JydzBYaEpESFVEb2YyOHpHa3RSdEU1ZlQ0UlF4MGtTd3BqQlIxQ2ZuZENIU0FGU3dKYUlZbENMQWFDSUFBTmhFVWtZZ0FUVUNRcFdwaEZMSFdWU3haYUZFa1BXaVV1VVJsYUlra25XaW1yU2c0ZkFCbEpCOEFmRjFBdWRBQ0JTUmhzSjBNa29rTWpkVTlKRVIvVFp3SUpReEtsQUNCTExzZENKQzBBM2gwdjRSOFNiK2tBSVJiS2JNeFJFUEpyOTJZa3ptcytXTGhtNWtDSVNTWmVIREJUeE9BSFlReVZITUJnSXVLU0F5TzhCQUVBSWZrRUNRMEFQQUFzQUFBQUFCa0FHUUNGREY0TWhMS0VUSXBNdk5xOExIWTBuTWFjWko1azFPN1VKRzRrck5Lc2RLcDhsTDZVek9iTVBJSkU1UHJrRkdZY1hKWmN4T0xFck02c2pMcU1WSkpVUEg0OHBNYWtkS1owNVBia3ROSzBmS3A4RkdJVXhON0VOSDQ4YktKczNPN2NMSElzbk1LY1JJSkU3UHJzSEdZY3ROYTBmSzU4REY0VWhMYUVUSTVVdk42OE5IbzBuTWFrSkhJc2xNS2MxT3JVWEpwa3hPTE1qTHFVVkpKY3BNcWtiS0owM1BMY1JJWkU3UDdzSEdvY3ROYThmSzZFOFAvd0FBQUFBQUFBQUFBQUJ0RkFubkJJTEJxUFNDTW55U1JpRUpobTBUYVFaRjY0Q1dBaEZTWUVKNEFZUU1pZE9yZ21aalp1dHdkTVRLUDlBQ0hjRUNaazNOQ05lQ002YlFSL1J5VmpCb1ZDR21JTk5JcEdBbUlWa0NNck5ReHFHMklKUlNOUm5rWVJZaWVRUmlNU0tRRkdHV0l0YVVtTUFCNUdBeWNRY0V3d1lncEdEalpHc0VNakxXSWhVZ01RR1VVV3BDOUpEZ3NWQUMyUUREbGlLVWtUSkdNYVF6Z0YzUUFubVVnTGJTY0NCak4zcE1kSkdBOXViaWNzVWg2a1lXTW5NK1pOTVFDQXdKQWd3QVVGRmc1MEdYSkR4c0lrRWtBOW5JZ2tDQUFoK1FRSkRRQXhBQ3dBQUFBQUdRQVpBSVVNWGd5RXNvUk1pa3k4MnJ3c2RqU2N4cHhrbm1UVTd0UWtiaVNzMHF3VVpoeGNsbHc4Z2tSMHFuemsrdVNzenF5Y3dweFVrbFRNNXN5a3hxUjBwblRrOXVSRWdrUVVZaFNNdW94c29temM3dHdzY2l5MDByUWNhaHhFaGtRTVhoU010b3hNamxURTRzUTBlalNjeHFRa2NpeGttbVI4cm56cy91eFVrbHpVNnRTa3lxUnNvblRjOHR5MDFyUWNhaVJFaGt6dy8vQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR3Q4Q1ljRWdzR28vSXBITEpQTFlHRDQ0SzFTUW1ZQmVBRmtEQVZJU1NWYktTMnBxMUJKSGtoVUZXR0diRjV2WFpYbDRBRUhLeFpReW9LQklzWjNwR0hGc21WRVVnWmdGSElWb01pa1JyalVZT0RDTWpMa1lhREFnbG9DVVFWYVdtcDZneExTa0xFYXdwbkVVb0ZBWUdJa1lxWnhtVFF4TmFId2U0WmhhOFlCMWFLVWU1WmhRdFF5Z1FlQUFmRXNxL1d4OENKaWtJMktUV3RodDFaNy9meWl4VUZRM1MyQ2txU2lpOEZRa0JGQ2NrR3FuNisveENRUUFoK1FRSkRRQTFBQ3dBQUFBQUdRQVpBSVVNWGd5RXNvUk1pa3k4MnJ5Y3hweGtubVFzZGpUYzd0eXMwcXdjYWh4Y2xseDBxblRNNXN6ayt1U1V3cHlzenF4RWhrUVVaaHhVa2xURTRzU2t5cVIwcG5TMDByUWtjaXdVWWhTTXVvekUzc1Jzb213OGZqems5dVFrYmlSa21tUjhxbnpzK3V5MDFyUU1YaFNNdG94VWpsUzgzcnljeHFRMGVqVGM4dHdjYWlSY21tVFU2dFNjd3B4RWhreFVrbHlreXF4c29uUjhybnpzL3V5MDFyencvL0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBR3hjQ2FjRWdzR28vSXBITEpQS1lHTUF0cjFpUWlYQmlBRm1ESWRKcWQxM2FzTlV5V0hjNDRZdkNNTVNabFpxVGxERUsxRUtOQUIzaFNTaXd4QzFSRkQzMHhJUlFGaFZVMUFWb2pLZ0FrUkRONFNqTXdiNEJERGg0QkxFZ1BCbVFLbG1vQUl3b2lqVUtLTG1NRFJBTmtBQnVZUlJNeEdCeXVDbU1DR3E1R0hReEVLVmw5TDQ1REpDOFdEbHNPUnd3a25VVU5yeWlJWDY4dENRQVlHOFJFTEpOYUdDNGZFbTViTFVzTXBiYVJKMkFnRVdRakw2S09EUllCS3NnNGNhQ1p3WU1JcXdRQkFDSDVCQWtOQURBQUxBQUFBQUFaQUJrQWhReGVESVN5aEV5S1RMemF2Q3gyTkd5aWJOenUzQ1J1SktUS3BCUm1IRnlXWE9UNjVKUytsTXptekR5Q1JIeXFmTFRTdEZTU1ZCeG1IQlJpRkl5NmpNVGl4RHgrUE9UMjVDeHlMS3pPckdTYVpPejY3SHl1ZkJ4cUhBeGVGSXkyakZTT1ZMemV2RFI2TkhTbWROenkzQ1J5TEtUS3JGeWFaSnpDbk5UcTFFU0dUTFRXdEZTU1hPeis3SHl1aEJ4cUpQRC84QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQWJSUUpod1NDd2FqOGlrY3NrOGtnWW1TS3JWSExZeXFnbGdDeUJRTHRXTGlFdnVWcW9HQWlCQk9KQW5vV1FyTlRRTU5yQk5RK1BaSGtoSExRb2RaMGdtZlFBRlJvSjlFb1ZIQVZzVFlGWUtaSTVJRndsYkpwV0lYQW1QUlN4YkQwTVZMaHlXQUI0dUFReFVRdzBaRUNCYkFoQVpjVUlEV3hLeFJTa1laV3NEUXlSOUhxSkVEU1ZrSHNaRUZsc0tTYzFiSGl0R0tGd01TU2tIRTlwR0c5TmJCWlI1Z0VJcDBVY05MNGdUS2hvUkJ3Y05WUTFxeEFBSGRFMHV1SkJReG9NQ2dHRWdCQmpod2dUQ0toQWpTcHdJSXdnQUlma0VDUTBBTndBc0FBQUFBQmtBR1FDRkRGNE1oTEtFVElwTXZOcThMSFlzWko1c25NYWMxTzdVSkc0a2RLcDhGR1ljWEpaYzVQcmtsTUtjUElKRXROSzB6T2JNakxxTVZKSlVkS1owck02czVQYmtmS3A4SEdZY0ZHSVVqTGFNeE9MRU5IbzBiS0pzcE1xczNPN2NMSElzWkpwazdQcnNSSUpFZks1OEhHb2NERjRVaExhRVZJNVV2TjY4TEhZMG5NYWtKSElzWEpwa25NS2N0TmEwMU9yVVZKSmNiS0owM1BMYzdQN3NSSVpFZks2RUhHb2s4UC93QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFCdFhBbTNCSUxCcVB5S1J5eVR6T0JwM0hhOVkwemtTQWJDcFNZWVlNSU9yTmtDMm5OTWxYd3BaMUNTc09SQm1BUVJraGd0TDhSSnhCWW1VSU1rVXpMakJ6SlFkR0hYb0FIRWdDY3haSEFWa1lYVVVWR0ZrVElpc2hSaFZzQUIxR0dsa2xERGNRSGtlSEFBbEdEMWtyWWtpQUFERkdBMWtYdGtTdE55eWNSaktOYUVZTE1DNXlBQzFIRGxrd1I3TmxKUzlITFdVTlJpRUVjd1hJUkNIUldUR1lReGx6ZE54RkVLTjBOQ0FRUXNhMEFZTkhFQ25yajBJRkFpaUFVbEtoeG9VeUNqQU5yRkxoUVlBRU5ZSlZtVWl4b3NVaFFRQUFPdz09XCIsXHJcbiAgICBpblRlYW06IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCd0FBQUFjQ0FNQUFBQkYweSttQUFBQUJHZEJUVUVBQUsvSU53V0s2UUFBQUJsMFJWaDBVMjltZEhkaGNtVUFRV1J2WW1VZ1NXMWhaMlZTWldGa2VYSEpaVHdBQUFCZ1VFeFVSYUhDcGREbHo1bTJuSjY5b3JMVnM1cTVucGF3bUtuTHEvMy8vZmI4OWFQRnA1U3RsNWUwbXBLeGxxWElxZWp4NXB5N29KN0FvcGE0bVp1Nm42dkdySnk4b0kra2tjTFp3NHV0anQzdDNaKy9vK1AyNFBMNDhhN1FyN2ZWdC8vLy8xRCs2VzBBQUFBZ2RGSk9VLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy84QVhGd2I3UUFBQU9SSlJFRlVlTnJNMHRHU2d5QU1CZENZQ0dwRUY0bWhLNjMyLy85eThhVWp0TE92dS9mMXpHVXlDZkQ4SmZDSEdDMitNc1lTWTllK2NyUVVyeGpuSFJJQTg1elQ3YTNHQytLc0lsNkpGbEJsN2pwN1FiZUlKOHBkU04yZSt3VmE5ZDVUU292aCs1M1RQQmZvalFxYUpLSHBtd1c0UkVFUlZabU8vZ3VJS3pUb2VMdDk4K094QnFpYUkrTEV3N0J2L2VFbzVYY3JkTk90SDRZbXlEbjFHNDVoNjdmZ0tHT3EwRG1jMW1hZHZDb2xnZ0t6NVhKQThaTDNWS1BONml5S0VkSzhqaXRHTk5hZGJYTjJEYmhZbkV5WGxBYzV0OHZNUGxiSHhrdmlQL2g5SC9NandBQjVMMGJDR1FHZzJnQUFBQUJKUlU1RXJrSmdnZz09XCIsXHJcbiAgICBvdXRUZWFtOiBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQndBQUFBY0NBTUFBQUJGMHkrbUFBQUFCR2RCVFVFQUFLL0lOd1dLNlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBUVdSdlltVWdTVzFoWjJWU1pXRmtlWEhKWlR3QUFBQmdVRXhVUmN5Nm83ZUxnOEtxbGJxVWlNV3JtUDc5L2NteW5yMmRqY0tsbE1DaWtzV2pqTG1SaDhDbGtyK2drTDJaamI2ZGo4ekFvdUhXd3Z2NTlidVhpOTNNdXNTbGxzR2Rqc1NubUxKOWZMeWNpOE9qbHNTbWtMdVppN3ljamVMWXd2Ly8vL0FDZUc0QUFBQWdkRkpPVS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vOEFYRndiN1FBQUFPTkpSRUZVZU5yTTB0R09neUFRQlZBRU9qTEtnSllxVUlYKy8xOHViTk5HN0daZmQyL203U1JrNE1JZXY0VDlJWVpPdk5PRkZnTk1FNXRlNmNNUmcyUklxRFhuc2d5ODlJa2pqN3RGMUVwVjVRRGRFYW1ZbEp2V0VxQndpekZhekJrM0wrZGNUejVpRi9lZThpV0RuSytmdUx0a29XaVp4WHZPRzNRbUpWWDBrdjJpemlpTVNaWlZaTDZzZkVKbjRqSi9Id3ZlcXhNS2M3OWQ4ekRrc3BCQzNlQTR1dVdXbDIyQWNpSDhRR0hjU3V2cUFSUmFhckdXWW95bHUxZEl0ajlpRUU2VW5aS3RyMDlXajZHcExKbmVFaEhXYWxRTXA3TEZJZUVmL0w0Zjh5WEFBSzNLUitvZGFDTUlBQUFBQUVsRlRrU3VRbUNDXCIsXHJcbiAgICBvazogXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJ3QUFBQWNDQU1BQUFCRjB5K21BQUFBQkdkQlRVRUFBSy9JTndXSzZRQUFBQmwwUlZoMFUyOW1kSGRoY21VQVFXUnZZbVVnU1cxaFoyVlNaV0ZrZVhISlpUd0FBQUJnVUV4VVJjZlp5WnEybk5uazJyYk10NkMrbytUczVLTEJwWjY4b2FURnFMSFZzcXJGcmFyTXJKcTRucVRCcHBTc2w2WElxWmF3bUtMRHByM1J2dkwxOHM3ZXo1KytwUG42K1p5NW9PM3k3Wi9Bb3YvKy80K2trWnU3b0xUWXRhREFwUC8vLzlnb1h0WUFBQUFnZEZKT1UvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLzhBWEZ3YjdRQUFBT2hKUkVGVWVOck0wdHR1aENBUWdHR1E0YkFncStDZzdvRHMrNzlsc1drYU1VMXYyei9jZlpsa0FyRDNMN0UveER6ejc1NjV4K3lPeDFmSDhZQjh4VHk1QUNvRU01MjVvK1FMOHFtVVZGTU54Z1FWakhQekZWOGxnV29GNDgvNUR1ZFN3Q0pUSGhFam9wdDZIQVh0cS9TU0pOSXVicmd0RE96T1BGazVHTlBqS0JZTndLU2lmZkUzZkhJaE5hZ29QUTBMdHAxN3RPdVdGQTZLdkZpdHVpR1hnNDlyRkJUOWdEYmMwQzVFQ0N1UmlJUWR6ak1mTjJIaE0xK2huenhSZzI0YmE2Z0FyeXRtUG82bFNXcW5wWGp1bnF5OHpybFVhN3Rhby9QdHNmbWwvQTkrMzQ5OUNEQUFNVWxJNk11ZWVMNEFBQUFBU1VWT1JLNUNZSUk9XCIsXHJcbiAgICBib3hPZmY6IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBMEFBQUFOQ0FNQUFBQkZOUlJPQUFBQUJHZEJUVUVBQUsvSU53V0s2UUFBQUJsMFJWaDBVMjltZEhkaGNtVUFRV1J2WW1VZ1NXMWhaMlZTWldGa2VYSEpaVHdBQUFBd1VFeFVSY1hHeUxPNHZlbnA2ZHZjM3RQVzJ1WG01dURoNHRUVjFycTl3YzNSMS9MeTh1M3Q3Y3ZQMWE2enVmVDA5STZQanhkR1BjZ0FBQUJUU1VSQlZIamFaTTdMRHNBZ0NFUlJSTVVIRnYvL2J6dEttNXIwcmppYkNUVFBhTnJYMHVXRjZocW9wVWl2Y0lzOGFnbklQTFlDYmxiVnNsVmpadTI5UjljQzltV0xISlpkQlJ2S3l2Yjc1ZXdXWUFDeEtBZDZ0RkdvTXdBQUFBQkpSVTVFcmtKZ2dnPT1cIixcclxuICAgIGJveE9uOiBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQTBBQUFBTkNBTUFBQUJGTlJST0FBQUFCR2RCVFVFQUFLL0lOd1dLNlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBUVdSdlltVWdTVzFoWjJWU1pXRmtlWEhKWlR3QUFBQXdVRXhVUmJTODBlcnI3UGo1K2RqYTIyZDVwc3JNenMvVTR0L2g1VTVqbVVkZGxjREYwZmIyOXN2UDFhNnp1ZlQwOUk2UGorWS9OSXNBQUFCZVNVUkJWSGphVE01QkRzQWdDQUJCVUN3aUN2Ly9iVkdheHIxTklBVHdPM0RMU2xIYldydTJpUFZvUnRobC9HSVF3dHlzWEkwRTZ0R1lDMk9rS1NaNXFNT255U0pDeGZpb29mY1lhVjVwL0N3M3hGVDhvVmIyUDZHN1Y0QUJBSnJmQnpGbXI4SnlBQUFBQUVsRlRrU3VRbUNDXCIsXHJcbiAgICBzb3J0RG93bjogXCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhCd0FVQUlBQkFBUnJBZi8vL3lINUJBRUFBQUVBTEFBQUFBQUhBQlFBQUFJUWpJK3B5KzBCb2dSd0hwbm8yN3l6QWdBN1wiLFxyXG4gICAgc29ydFVwOiBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEJ3QVVBSUFCQUFSckFmLy8veUg1QkFFQUFBRUFMQUFBQUFBSEFCUUFBQUlRakkrcHkrMElFcGhuMm1EejI3eXJBZ0E3XCIsXHJcbiAgICBzb3J0TnVsbDogXCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhCd0FVQUlBQkFBUnJBZi8vL3lINUJBRUFBQUVBTEFBQUFBQUhBQlFBQUFJVWpJK3B5d1lKNG9rMDBOdmdsWHRLOUdUaWlCUUFPdz09XCIsXHJcbiAgICBmaWx0ZXI6IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCZ0FBQUFZQ0FZQUFBRGdkejM0QUFBQUJHZEJUVUVBQUsvSU53V0s2UUFBQUJsMFJWaDBVMjltZEhkaGNtVUFRV1J2WW1VZ1NXMWhaMlZTWldGa2VYSEpaVHdBQUFaTVNVUkJWRWpIdFpWcFVCTm5HTWVmSkVRTWdpaUlkS0FxQWxhT1dwR1oxcU8yVTFzZHJTSnFSMFZCbEpzUVFFVU9RUkhFS3FBaWFFVEZBeEJFcXkyWGlyZUFndEtpakZpMFJxQ1ltTVNRa0pDRW1CQUU0dlo5RjFodzJuNzB3NU5OTnZ2K2Y4KzlRQkFFZkV3alAvb01mWlM5Sjk2RG9GMEF6YSthSWY5NlBpeUtXd2p1N0ZuZ3ZubVdrM21VcWNnc3lrUXlObXFNWkh6RTJGV3NZR01ZSFdnTTBZWGI0RVhMQ3hESlJLRHQxb0pPcjROK1EvOS9BL0J2ZVdjSHZHeDdDUUtSQU9xZjE4Tlc3aFp3RFhWMnBJY0JRZU1BUVVmR0RHS3NucC95Tlp5dk9ROHRnaFo0L3ZJNUtGUUtVdngvQWZpN1dxODJZeGVFSHE1cXJKcmNMbWtIc1VRTTFRMVZsbXNQcmZHanNjSEFDRWNRTmhDemt0M1M3enk2YmFOVmEwRXBWOEt4RzlsTEUwcmlkL2YxOWtQUHU1NFBBUWJDUUY0VldvWGxFdTdpVytBTHhNdzlNeHBLNm9xLzIzUm1JOWM2eGtyQ2pHQVFSdUUweXBqaGRHSkNsSVVpOWxKMGNuNTFucWZaRmxNTitBTVJWeHliMnRQM2p2bEJEY1J5TWNpVmNnZ3VETXlHRFVBS0FQS1NobElDd2NqUUZYcytFa0ErZy84UEdmZ2ZQNHRUQ0p1QXlLL0ord25yVVFCUnV3aUViNFJRL2JUSzNpM2xpM3FjQWl6QTRBeGVrVGlFampBc3loNEdVcyt4NlliMUo3M09OTDl1TnVPTCtjT0FzemZ5b1FNVlZ0bXBoUEpINVhPTXdoajk5TUZEWkJSSTFIMlBXODNhSTZ0MytoL2JGTG95eS9PQVhjTGtGaHpka0RnR1RrNzRWSWc2YWJSU3JZUVBJdmdoOW50b2s3UkJQeW9RcDRqTmhhQmhjVmFFY1hmbXRjd05JcEVJOHE3bG1TY1ZKVTJ0cUsxZ0NzVkNSbmdSNXlDT2hrRkdpU3lFYnJoWS84dEtyRm41NU80d3dDMWtKc1NjaUFHaFZNaXkyVzR0dzk3Z0F6VGsrZkc3eDd4eE42MDV2anFmenFhUjBaaEdtbXIyWDAvZmdzOEdud3M4UGVRUXZpN2xMcmt1YmhlRHg0Nmx3d0QzU0RjbmwxRG56d055L1AxR1JUSkljUnorTnhuekhoQUdBdGFkOGlwZ2hqR0kwUHpnUkU1T21PZktveXNLY01jVTFoV3NFOGxGNDhkdEhkdEZHeXowSjNGV1N1K005ZlBzQTZZNlU0QnhVV1lpMUFIOUErRU9lb01Bb2JuQjJ5dWZWSnJqb3U4b2pkL0phMzBCM0V0Y2FPRzN3T3kwTDJ1bkpUcndIajk3RERPU1hldXc5emh5c3V1UW9UYnVvQUJvOUdWNFFrZTJJazRGKzFSbzRLSFNEQWNNL3ZuWFBRdkxxa29odS9nbzNIcDRDNVpuZVhCUmZYUlhIbHhtN0w2WTlPT2FqRFcrWGxsclExWWNXWDVtUXJTRkNnRU5Jd0ZkR0lCRktRRHlLQ0RYUDQzM2lqZHF6R2FXM2pmWHA3RHhSU09jS0Q0QnRVMDF0dDhlbUY5NS9tR1JoMFFxZ2FMYjV5d0Rqd1k0SnhYdW10TFExQUE4UHMvU0wzZmpRUW93UHNKOEZUMFF2TjFUM1BZYlJReEhNRDNaOFcrZFRrZFBxMGlOeERsSHFhaGRzSGRCOXR6VXJ5cnZQYjMzV1ZOcjA4VEZtWXZMUm5HTWVzalpRR2RzWTJ4ZUhiNlo1ZGZmTTJKVnNJS01ZVzdLYkhnbWVHWm1IVHRCT1RSRU9JcUk4NXlEdmQyOWNMSXF4OGMrZnVxZkpoeVRqc3VONWN2NEVyN2x2UFE1OTJ5MzIwanRFaWNKSFhiWkNleDNUUkZNU3JDVk9PNXdhRXU3bGhwRkFjQVBvT2hoRVJEdkNVaTV1anVlRmt4N1B6Q2hOSEpxZlUvNzVOUTAxa3k4ZU9zQ0ZONHVOT3A5MXd1cmNqeXZ6azJmWGFmVUtFMDdOUXFXVkNVMWthbGxKbHFkbGxGUWU5WnJOTWRZUlFHaUNyWkNNNzhaRkIyZGNQWit2Z2VhWkFNMS9weUJyakRkek5JNHhUdFY3UzlOWDFyOXBOckNkQXRMRHdGQWJQdHRhd2JXNk5aM2cxNm5oenJlUXlmcmFDczVTcGVPQXZCYWVlUStSeXZYWSt4bU14VmVXa2JoQTIwMzFGbGtFNkNVK1J4Wjc3OHROOHFWV203b1h0YWR6SWkrdm40UWRRcHRYSktkL2hvY1BBVUY0TC9oZzFRdWhmaVN1QlJjVEx5SHNQaWtlQnN4MmRzaEF5OGFYTVNRazhHQng2OW0yMkVvZmZBZW1pT05WQ2xsN2JxY3VCdHYwOEZPN0tRQTZyZGRvTkZxeUYwVVZ4S2JpbXBDZUoveXltMFR0MWxrVmh4YU4zZmZuSnVXMFJhZEVJanFrYnZodEVxbEFzZkVxVzFEcXhxOVNyWHRxbmJUMk9Mb05KeTJ3ZVgzbGdJb3U1U2s2YnAxb05mckllOSs3cXJXMTYzTURua0h2QmFoTlY1ZkRTdjNycGhQUTdXd2lySFV5THZrbGtWL25QUENRQnlCUmJSNXQvcXQybmhuZWNJKzhoNUtrVXZ5OU1mL0F1QW84UHRVcHBDQlFDd0FTWWNFeXU2WGdVZkNNcGdXNURBTmp6OFNVQWNWQmh6QTU1S3ZKQ1V3MlV5WmNZU1JiQWwzMFFVME4vV29JVHBkazF4K2IrSTNPVkNBajJuL0FGV0pwYmx5K1JPWEFBQUFBRWxGVGtTdVFtQ0NcIixcclxuICAgIG1lbWJlckljbzogXCIgZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCZ0FBQUFZQ0FZQUFBRGdkejM0QUFBQUJHZEJUVUVBQUsvSU53V0s2UUFBQUJsMFJWaDBVMjltZEhkaGNtVUFRV1J2WW1VZ1NXMWhaMlZTWldGa2VYSEpaVHdBQUFhSFNVUkJWSGphMUZacmNCUFhGVDY3MmwyOVpRbkp5TEpsU1RZMnRzSEdTckFOR0VOc0lBa1ROOURVNldBYTRrbEtZY3FRRG1rU1RESnRaNXAyMmpJdFNadmhYMm95eWRDUUlTU09xV25OSXpZQkc1dEFMTnVBYkdITDhWdVM5YmEwV3ExV1dtMnYzR2xta3BMcHIvem8vYlAzem4yY2M3NXp2dThzSmdnQ2ZKY0RoKzk0RURhN0hjSjBGT3pPY2FCcEdnRERnQ0FJQUJUWjBmMEhsdysxbmppdS9lTXJyd2ErZWZuOTh4Mnd5bUtCTEpVSzB1azBTTVJpc0UvY2h6ZmZiWVBXQTRmQm9OTUI4WlVsWEFTTEFUOFVXUW9nVDU4RHFWUUt6bDc4QnpLRVFZeGwxOWJ0Mi9QaTJNelVGb1pqcFNWR2svMkpMZlZ0ZW0zMk84WWt4K1BJcWZTM1JmQVZWamkrYk9DaDhnb29NcGtoenJKQUlZKyt1SGUzK1Z4WDUzR2YyMlVHcVF5QUZNSEluYUdhR2VkNDhmWnRPNHFyMTFYK0Z0Mk5Bczh2djBHSVJDQTh5TUR5SXJPSm9FbWh3eUkwZDB4TmJqNSs4c1FKMzl4MFh1M1c3Ziswcmk0N2xSWUUyaFAwN2J6dzZjVkRuZWMvZWFXNnd1cmFVYlBwTFJ3d1ljdzVBWmNIK2tDZWNlUkJTY1pRcUd3aUFUR0dnU1dhRm5mM2ZyWjNjc2lXMTlLeS84ekJwNXYzNmRUcWRxVlVkdG1TYTN5NWFYZlRVYmxTa1c0N2MvcVFOeGl3cE5NQ1JGRU9vN0VZWkNCN2NBUW91YU1UNDlBM05BZzBHMTg1N2hqYktzODFSbXNxck85b2xNcVFTcUdFVkRLRjhNYUVpcUxWSHk5VVdKdjcrcTl2dGp1ZHhTSHQwcFRiNXdlU0VQMTNtV1pnSVFreVV3VWloVlNHUlpsWUJrZHhNQkxSa1RKWkpKM2lQU3ZWT3FpMXJnZFgwQStsNWdJdzZ3MDBSbEZCNE5NdzczWmxjWHdLMEYwUVU1VGtQMUF2R3hEUVV6S3BGQjJhZitMcXJac2RsL3A3eitab3RadWFkelo2TFRrNTk1bEZsMDRrcGlxakRBM3ZYbWlINGNseFVFbWtrRXJ6QnA5cm9SUklFcXpsNWJQbS9QenN6dDZlTjYvWmJsK2E4N2hiRlhLNVBBTTVMcGZJWUc3UjgrUzU3a3QvTGpVWFRxKzJGUGp1T01iK29wWXI5QnVyYXpxNFpFcDg2dXo3dnh4MjN0ODJjSGNFSkJRRm9XZ2svNzIvdDcvdXZIZW5lTWVXaG90MVZkVXpmLzNrdzVNTUczOTQ2MFBWWFZ3eThhUGUyd090WEpJalJZeGNJdW01MmY5U2tka3kvLzF0ang1Q25uWFpaNloyMC9HNDd2RGVaMDlOZUJlcmJsenVxaG1jL3ZKN1VxbThsazF4dTY3ZS92em95SzJCaGp5anlmM3lUMS80K2FMWGk1OCsvL0hQWHRqVDhrT0ZUSG9oQ2NEMkR0bGFoc1pHZXdpdFJwT09zckVFU3FwK3p1MlNSV00wamlwSmxreWxoQUtEMGYvYWdjTUhFb25FSDJ4ajlzY25wcHlOR0NvUmtTQndKYVZyQmgrcHEzL2RsSnQzemVOeFYxSWtoZnNqSVYwa0dsa0loRUpaRkVXbUFNTlRva3Nkblh5eHBYRHBkR2Y3MHdzZWwzVXBGbXRVU0NTeW56VHQrZDFkNTNnWXlVZElMcForWkRJWXIwYlorREJKVUo4MjFHeHFLeWxZZFN4RVJ4d05WUnZoMGRxNjBPak1kR0hYOVo2OXFHb0taMXp6VHpYdDJQbWVUclBpaXVqWWE2L0M1OE5EYytGdzJEWXk0ZGlwa3NxNXV2WFZ4Nlk4cnFrci9YMkExamsyeDJpVlB4TE9SL3dnV0k3alZRcUZDRVZvU0NZNVBFZWpDVVNaT0UvZytNWHVtd05teElYTktKZW5OcFJiMnphc3F3UU1KUXgvcHZYRjUrY1h2YnUwV3ExSVFsQjhNQnlrWlFyRlI1UklKRTR4OFlPMjRVSHJVcHpXcEZFcEk3SUFobVJFSlpFa05EcTlzM0g3WTM4VGl5VzNoeHoyM2NpNGFZVmFUWGk4WHN5WXJSODZzdSs1dDdCZm5IempwUXM5M2ZzRmdud2I1V0VRcWFKNGZVblpsdUVKeDBHdmUxNGU5UWRVcHNLaXVUS3pwWnRKcHR5UldJdzNaYS9VT09kbk40NU4zRjlQVXBSZ01PVDZjblB5cnZpV1FoK2toWFRJa3BPYnl5WFlJMnExeGs4TWpvMGFadjFlZzFLWlZlY0xCRXBJTVVrNDVxYU5rM096QmlWSnBuN2M4dnl2cFJKNUc4Ynp2bGlNNFhoRUtJbGNScXd0WGF0K1p0Y1BIbnY3M0puanN6TlQrU2k2TlRFbTloUVRqeWNSbXlWSWpRMnVZSkFnTmxSWWYxVmZXZFZ4NVZiL0pwTmVyeGRUWW9abWFCMXdDWWpqT09vWG8vVXJOU3NvSkJXTGJJS2pFWGVFQ010STNkN0Y3Q1U2dWk0VWk2M0l3Q1lJdlB6aGtySlpKSVpLamt1NE5wUlZ0TS80dkwwRVlodUxxSDBEeC9BYk9PSjFwbkhzMzkyVXExZHBvZ01qdGdhNzQxN3RjSkt2QnhHZWtkdC9Dd3lTQjlRd1VBL0JlSVZhRTZ5cHFPd3ptU3gvOG9WQzNTU1NDZlRXc2pKbm1FeDhzMEZrcEFONTRkcjdlT056bWl4VkE5TFlldnVYaytVTGZwOGVKVnFCdGpFcEpZNGJ0ZG0rTllXcnhwa0VlNzNVVlBCWklMb1U1cEhNaHpOZDhkdjZ3YlcyMDErejFmemtyaDcwN2ZsZmZmZkk3MzhEYXBsaWVZNEU4bXQ3MlAvOVg4Vy9CQmdBR0RvWmV2QlNZbm9BQUFBQVNVVk9SSzVDWUlJPVwiXHJcbn07IiwiLyoqXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG4gIHZhciB0cztcclxuXHJcbiAgdHMgPSB7XHJcbiAgICBwbGF5ZXI6IHtcclxuICAgICAgaWQ6IFwiaWRcIixcclxuICAgICAgbmFtZTogXCJhXCIsXHJcbiAgICAgIHN0YXR1czogXCJiXCIsXHJcbiAgICAgIGRhdGU6IFwiY1wiLFxyXG4gICAgICBmb3J1bXM6IFwiZFwiXHJcbiAgICB9LFxyXG4gICAgZm9ydW06IHtcclxuICAgICAgaWQ6IFwiaWRcIixcclxuICAgICAgbmFtZTogXCJhXCIsXHJcbiAgICAgIHNpZDogXCJiXCIsXHJcbiAgICAgIHBvc3RzOiBcImNcIixcclxuICAgICAgd29yZHM6IFwiZFwiLFxyXG4gICAgICBwYWdlOiBcImVcIixcclxuICAgICAgdGhlbWVzOiBcImZcIixcclxuICAgICAgbG9nOiBcImdcIlxyXG4gICAgfSxcclxuICAgIHRoZW1lOntcclxuICAgICAgaWQ6IFwiaWRcIixcclxuICAgICAgbmFtZTogXCJhXCIsXHJcbiAgICAgIGF1dGhvcjogXCJiXCIsXHJcbiAgICAgIHBvc3RzOiBcImNcIixcclxuICAgICAgcGFnZXM6IFwiZFwiLFxyXG4gICAgICBzdGFydDogXCJlXCJcclxuICAgIH0sXHJcbiAgICBtZW1iZXI6IHtcclxuICAgICAgaWQ6IFwiaWRcIixcclxuICAgICAgcG9zdHM6IFwiYVwiLFxyXG4gICAgICBsYXN0OiBcImJcIixcclxuICAgICAgc3RhcnQ6IFwiY1wiLFxyXG4gICAgICB3cml0ZTogXCJkXCIsXHJcbiAgICAgIHdvcmRzOiBcImVcIixcclxuICAgICAgd29yZHNBdmVyYWdlOiBcImZcIixcclxuICAgICAgY2FybWE6IFwiZ1wiLFxyXG4gICAgICBjYXJtYUF2ZXJhZ2U6IFwiaFwiLFxyXG4gICAgICBzbjogXCJpXCIsXHJcbiAgICAgIGVudGVyOiBcImpcIixcclxuICAgICAgZXhpdDogXCJrXCIsXHJcbiAgICAgIGtpY2s6IFwibFwiLFxyXG4gICAgICBpbnZpdGU6IFwibVwiXHJcbiAgICB9LFxyXG4gICAgdGltZXN0YW1wOiB7XHJcbiAgICAgIGlkOiBcImlkXCIsXHJcbiAgICAgIHRpbWU6IFwiYVwiLFxyXG4gICAgICBkYXRhOiBcImJcIlxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG1ha2VUUygpO1xyXG5cclxuICByZXR1cm4gdHM7XHJcblxyXG4gIGZ1bmN0aW9uIG1ha2VUUygpe1xyXG4gICAgT2JqZWN0LmtleXModHMpLmZvckVhY2goZnVuY3Rpb24odCl7XHJcbiAgICAgIE9iamVjdC5rZXlzKHRzW3RdKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICAgdHNbdF1bdHNbdF1ba2V5XV0gPSBrZXk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuIiwicmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvcHJvdG90eXBlcycpKCk7XHJcbnZhciAkID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvZG9tJyk7XHJcbnZhciBkYiA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbGliL2lkYicpO1xyXG52YXIgYmluZEV2ZW50ID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvZXZlbnRzJyk7XHJcbnZhciBhamF4ID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvcmVxdWVzdCcpO1xyXG52YXIgY3JlYXRlVGFibGUgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2xpYi90YWJsZScpO1xyXG5cclxuXHJcbmNvbnN0ICRjID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvY29tbW9uJykoKTtcclxuY29uc3QgJHRzID0gcmVxdWlyZSgnLi8uLi9zcmMvc3RydWN0dXJlJykoKTtcclxuY29uc3QgJGljbyA9IHJlcXVpcmUoJy4vLi4vc3JjL2ljb25zJyk7XHJcblxyXG5cclxudmFyICRuYW1lU2NyaXB0ID0gXCJTdGF0cyBmb3J1bXMgW0dXXVwiO1xyXG52YXIgJG1vZGUgPSB0cnVlO1xyXG52YXIgJHNkLCAkY2QsICRzcywgJHRzZCwgJGFuc3dlciwgJHNjcmVlbldpZHRoLCAkc2NyZWVuSGVpZ2h0LCAkZGF0ZSwgJGNoZWNrZWQsICR0O1xyXG5cclxudmFyICRpZGIsICRmb3J1bTtcclxuXHJcbmNvbnN0ICRzdGF0dXNTdHlsZSA9IHtcclxuICBcIk9rXCI6IFwiXCIsXHJcbiAgXCLQotC+0YDQs9C+0LLRi9C5XCI6IFwiZm9udC13ZWlnaHQ6IGJvbGQ7XCIsXHJcbiAgXCLQkNGA0LXRgdGC0L7QstCw0L1cIjogXCJjb2xvcjogYmx1ZTtcIixcclxuICBcItCk0L7RgNGD0LzQvdGL0LlcIjogXCJjb2xvcjogcmVkO1wiLFxyXG4gIFwi0J7QsdGJ0LjQuSDQsdCw0L1cIjogXCJjb2xvcjogZ3JlZW47IGZvbnQtd2VpZ2h0OiBib2xkO1wiLFxyXG4gIFwi0JfQsNCx0LvQvtC60LjRgNC+0LLQsNC9XCI6IFwiY29sb3I6IHJlZDsgZm9udC13ZWlnaHQ6IGJvbGQ7XCJcclxufTtcclxuXHJcbiRjaGVja2VkID0ge1xyXG4gIHRoZW1lczoge30sXHJcbiAgcGxheWVyczoge31cclxufTtcclxuXHJcbiRzY3JlZW5XaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiRzY3JlZW5IZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcclxuXHJcbiRhbnN3ZXIgPSAkKCc8c3Bhbj4nKS5ub2RlKCk7XHJcbiRkYXRlID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwLCAxMCk7XHJcblxyXG4kc2QgPSB7XHJcbiAgZm9ydW1zOiB7fSxcclxuICBwbGF5ZXJzOiB7fSxcclxuICBraWNrZWQ6IHt9LFxyXG4gIGludml0ZToge31cclxufTtcclxuXHJcbiRzcyA9IHtcclxuICBzb3J0OiB7XHJcbiAgICBzdGF0czoge1xyXG4gICAgICB0eXBlOiAxLFxyXG4gICAgICBjZWxsOiAnbmFtZSdcclxuICAgIH0sXHJcbiAgICB0aGVtZXM6IHtcclxuICAgICAgdHlwZTogMSxcclxuICAgICAgY2VsbDogJ2lkJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2hvdzp7XHJcbiAgICBzdGF0czp7fSxcclxuICAgIHRoZW1lczp7fVxyXG4gIH1cclxufTtcclxuXHJcbiRjZCA9IHtcclxuICBmaWQ6IDAsXHJcbiAgZk5hbWU6IFwiXCIsXHJcbiAgdGlkOiAwLFxyXG4gIHROYW1lOiBcIlwiLFxyXG4gIGZQYWdlOiAyNyxcclxuICB0UGFnZTogMCxcclxuICBsUGFnZTogMCxcclxuICBmOiBudWxsLFxyXG4gIHNpZDogbnVsbCxcclxuICBuYW1lVG9JZDoge30sXHJcbiAgbWVtYmVyczogW10sXHJcbiAgY291bnRNZW1iZXJzOiAwLFxyXG4gIHZhbHVlczp7XHJcbiAgICBzdGF0czp7XHJcbiAgICAgIGlkOiBbJ0lEJywgLTEsIC0xXSxcclxuICAgICAgc3RhcnQ6IFsn0KLQtdC8INC90LDRh9Cw0YLQvicsIC0xLCAtMV0sXHJcbiAgICAgIHdyaXRlOiBbJ9Cj0YfQsNGB0YLQstC+0LLQsNC7JywgLTEsIC0xXSxcclxuICAgICAgZGF0ZTogWyfQn9C+0YHQu9C10LTQvdC10LUg0YHQvtC+0LHRidC10L3QuNC1JywgLTEsIC0xXSxcclxuICAgICAgcG9zdHM6IFsn0KHQvtC+0LHRidC10L3QuNC5JywgLTEsIC0xXSxcclxuICAgICAgYXZlcmFnZVdvcmRzOiBbJ9Ch0YDQtdC00L3QtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INGB0LvQvtCyJywgLTEsIC0xXSxcclxuICAgICAgd29yZHM6IFsn0JrQvtC70LjRh9C10YHRgtCy0L4g0YHQu9C+0LInLCAtMSwgLTFdLFxyXG4gICAgICBwU3RhcnQ6IFsn0J/RgNC+0YbQtdC90YIg0L3QsNGH0LDRgtGL0YUg0YLQtdC8JywgLTEsIC0xXSxcclxuICAgICAgcFdyaXRlOiBbJ9Cf0YDQvtGG0LXQvdGCINGD0YfQsNGB0YLQuNGPJywgLTEsIC0xXSxcclxuICAgICAgcFBvc3RzOiBbJ9Cf0YDQvtGG0LXQvdGCINGB0L7QvtCx0YnQtdC90LjQuScsIC0xLCAtMV0sXHJcbiAgICAgIHBXb3JkczogWyfQn9GA0L7RhtC10L3RgiDRgdC70L7QsicsIC0xLCAtMV0sXHJcbiAgICAgIHN0YXR1czogWyfQodGC0LDRgtGD0YEnLCAtMSwgLTFdLFxyXG4gICAgICBlbnRlcjogWyfQn9GA0LjQvdGP0YInLCAtMSwgLTFdLFxyXG4gICAgICBleGl0OiBbJ9Cf0L7QutC40L3Rg9C7JywgLTEsIC0xXSxcclxuICAgICAgZ29Bd2F5OiBbJ9CY0LfQs9C90LDQvScsIC0xLCAtMV0sXHJcbiAgICAgIG1lbWJlcjogWyfQkiDRgdC+0YHRgtCw0LLQtScsIC0xLCAtMV1cclxuICAgIH0sXHJcbiAgICB0aGVtZXM6e1xyXG4gICAgICBpZDogJycsXHJcbiAgICAgIGRhdGU6ICcnLFxyXG4gICAgICBwb3N0czogJycsXHJcbiAgICAgIHBvc3RzQWxsOiAnJ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2hvd1Byb2dyZXNzVGltZTogZmFsc2UsXHJcbiAgdGltZVJlcXVlc3Q6IDAsXHJcbiAgc3RhdHNDb3VudDogMCxcclxuICB0aGVtZXNDb3VudDogMFxyXG59O1xyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuYWRkU3R5bGUoKTtcclxuY3JlYXRlU3RhdEdVSUJ1dHRvbigpO1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlKCl7XHJcbiAgdmFyIGNzcywgY29kZTtcclxuXHJcbiAgY29kZSA9IGB0YWJsZVt0eXBlPVwicGFkZGluZ1wiXSB0ZCB7XHJcbiAgICBwYWRkaW5nOiAycHggNXB4IDJweCA1cHg7XHJcbn1cclxudHJbdHlwZT1cImxpZ2h0XCJdIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNkOGU4ZDg7XHJcbn1cclxudHJbdHlwZT1cImxpZ2h0Q2hlY2tlZFwiXSB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYzdkZmM3O1xyXG59XHJcbnRyW3R5cGVePVwibGlnaHRcIl06aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2JlY2NiZTtcclxufVxyXG50clt0eXBlPVwiaGVhZGVyXCJdIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNkMGVlZDA7IGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcbiNzZl9oZWFkZXJfU0kgaW1nLCAjc2ZfaGVhZGVyX1RMIGltZ3tcclxuICAgIGZsb2F0OiByaWdodDtcclxufVxyXG50ZFtzb3J0XSwgdGRbZmlsdGVyXXtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG50ZFtzb3J0XTpob3ZlciwgdGRbZmlsdGVyXTpob3ZlcntcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNjYWUxY2E7XHJcbn1cclxuLnNmX2xlZnQge1xyXG4gICAgcGFkZGluZy1sZWZ0OiA1cHg7XHJcbn1cclxuI3NmX1NUSSB7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG59XHJcbiNzZl9zaGFkb3dMYXllcntcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHdpZHRoOiAwO1xyXG4gICAgaGVpZ2h0OiAwO1xyXG4gICAgei1pbmRleDogMTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgdG9wOiAwO1xyXG4gICAgb3BhY2l0eTogMC43O1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5kaXZbdHlwZT1cIndpbmRvd1wiXXtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIC1tb3otYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGO1xyXG4gICAgei1pbmRleDogMjtcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbmlucHV0W3R5cGU9XCJidXR0b25cIl17XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgZm9udC1mYW1pbHk6IFZlcmRhbmE7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjA4LDIzOCwyMDgpO1xyXG4gICAgZm9udC1zaXplOiAxMHB4O1xyXG4gICAgaGVpZ2h0OiAyMHB4O1xyXG59XHJcbmlucHV0W3R5cGU9XCJ0ZXh0XCJdW2NsYXNzPVwic2ZfaGlkZUlucHV0XCJde1xyXG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcclxuICAgIGZvbnQtZmFtaWx5OiBWZXJkYW5hO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2YwZmZmMDtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xyXG59XHJcbmlucHV0W3R5cGU9XCJjaGVja2JveFwiXVtuYW1lPVwic2ZfbWVtYmVyc0xpc3RcIl0sW25hbWU9XCJzZl90aGVtZXNMaXN0XCJde1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5kaXZbY2xhc3NePVwic2ZfY291bnRcIl17XHJcbiAgICBib3JkZXI6IHNvbGlkIDFweCAjMDAwMDAwO1xyXG4gICAgd2lkdGg6IDEwMHB4O1xyXG4gICAgbGluZS1oZWlnaHQ6IDI0cHg7XHJcbiAgICBmbG9hdDogbGVmdDtcclxuICAgIGhlaWdodDogMjRweDtcclxufVxyXG5kaXZbY2xhc3M9XCJzZl9jb3VudCBkaXNhYmxlZFwiXXtcclxuICAgIGJvcmRlcjogc29saWQgMXB4ICNDMGMwYzA7XHJcbiAgICBjb2xvcjogI2MwYzBjMDtcclxufVxyXG5kaXZbY2xhc3M9XCJzZl9zcGFjZVwiXXtcclxuICAgIGJvcmRlcjogbm9uZTtcclxuICAgIHdpZHRoOiAxNXB4O1xyXG4gICAgaGVpZ2h0OiAyNHB4O1xyXG4gICAgZmxvYXQ6IGxlZnQ7XHJcbn1cclxuaW5wdXRbdHlwZT1cInRleHRcIl1bY2xhc3M9XCJzZl9jb3VudCBkaXNhYmxlZFwiXXtcclxuICAgIGNvbG9yOiAjYzBjMGMwO1xyXG4gICAgd2lkdGg6IDY1cHg7XHJcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XHJcbiAgICBiYWNrZ3JvdW5kOiBub25lO1xyXG4gICAgcGFkZGluZzogMDtcclxuICAgIG1hcmdpbjogMDtcclxufVxyXG5pbnB1dFt0eXBlPVwidGV4dFwiXVtjbGFzcz1cInNmX2NvdW50IGVuYWJsZWRcIl17XHJcbiAgICB3aWR0aDogNjVweDtcclxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcclxuICAgIGJhY2tncm91bmQ6IG5vbmU7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgbWFyZ2luOiAwO1xyXG59XHJcbiNzZl9jYWxlbmRhcntcclxuICAgIGxlZnQ6IDA7XHJcbiAgICB0b3A6IDA7XHJcbn1cclxuI3NmX2NhbGVuZGFyIHRke1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgaGVpZ2h0OiAyMHB4O1xyXG4gICAgYm9yZGVyOiBzb2xpZCAxcHggIzMzOTkzMztcclxuICAgIHBhZGRpbmc6IDVweDtcclxufVxyXG4jc2ZfY2FsZW5kYXIgdGRbdHlwZT1cImRheVwiXTpob3ZlciwgI3NmX2NhbGVuZGFyIHRkW3R5cGU9XCJjb250cm9sXCJdOmhvdmVye1xyXG4gICAgYmFja2dyb3VuZDogI0Q4RThEODtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5zcGFuW3R5cGU9XCJjYWxlbmRhckNhbGxcIl17XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuZGl2W3R5cGVePVwibXVsdGlwbGVTZWxlY3RcIl17XHJcbiAgICBiYWNrZ3JvdW5kOiAjZjBmZmYwO1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgaGVpZ2h0OiAyNHB4O1xyXG4gICAgb3ZlcmZsb3cteTogaGlkZGVuO1xyXG59XHJcbmRpdlt0eXBlPVwibXVsdGlwbGVTZWxlY3QgZW5hYmxlZFwiXTpob3ZlcntcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIG92ZXJmbG93LXk6IHZpc2libGU7XHJcbiAgICBoZWlnaHQ6IDE3NHB4O1xyXG4gICAgYm9yZGVyOiBzb2xpZCAxcHggIzAwMDAwMDtcclxuICAgIG1hcmdpbi1sZWZ0OiAtMXB4O1xyXG4gICAgbWFyZ2luLXRvcDogLTFweDtcclxufVxyXG5kaXZbdHlwZV49XCJvcHRpb25cIl17XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDEwcHg7XHJcbiAgICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xyXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcclxuICAgIGJvcmRlci10b3A6IGRvdHRlZCAxcHggI2MwYzBjMDtcclxufVxyXG5kaXZbdHlwZT1cIm9wdGlvbiBzZWxlY3RlZFwiXXtcclxuICAgIGJhY2tncm91bmQ6ICNjM2U1YzM7XHJcbn1cclxuZGl2W3R5cGVePVwib3B0aW9uXCJdOmhvdmVye1xyXG4gICAgYmFja2dyb3VuZDogI2Q5ZWNkOTtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5zcGFuW2lkXj1cInNmX2JDaGVja0FsbFwiXXtcclxuICAgIGZsb2F0OiByaWdodDtcclxuICAgIG1hcmdpbi1yaWdodDogNXB4O1xyXG4gICAgZm9udC1zaXplOiA5cHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1gO1xyXG4gIGNvZGUgKz1cclxuICAgIGBcclxuICAgIHRkW3NvcnQ9XCJtZW1iZXJcIl17XHJcbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybCgkeyRpY28ubWVtYmVySWNvfSk7XHJcbiAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IDEwcHggY2VudGVyO1xyXG4gICAgICBiYWNrZ3JvdW5kLXJlcGVhdDpuby1yZXBlYXQ7XHJcbiAgICB9XHJcbiAgICAjc2Zfc3RhdHVzV2luZG93e1xyXG4gICAgICBsZWZ0OiAkeyRzY3JlZW5XaWR0aCAvIDIgLSAzMjV9O1xyXG4gICAgICB0b3A6ICR7JHNjcmVlbkhlaWdodCAvIDIgLSAxMjB9O1xyXG4gICAgfVxyXG4gICAgI3NmX2NvbnRyb2xQYW5lbFdpbmRvd3tcclxuICAgICAgICBsZWZ0OiAkeyRzY3JlZW5XaWR0aCAvIDIgLSAxNzV9O1xyXG4gICAgICAgIHRvcDogJHskc2NyZWVuSGVpZ2h0IC8gMiAtIDI2MH07XHJcbiAgICB9XHJcbiAgICAjc2ZfZmlsdGVyc1dpbmRvd3tcclxuICAgICAgICBsZWZ0OiAkeyRzY3JlZW5XaWR0aCAvIDIgLSAyNTB9O1xyXG4gICAgICAgIHRvcDogJHskc2NyZWVuSGVpZ2h0IC8gMiAtIDM2M307XHJcbiAgICB9XHJcbiAgICAjc2ZfbWVzc2FnZVdpbmRvd3tcclxuICAgICAgICBsZWZ0OiAkeyRzY3JlZW5XaWR0aCAvIDIgLSAzNzB9O1xyXG4gICAgICAgIHRvcDogJHskc2NyZWVuSGVpZ2h0IC8gMiAtIDIyMn07XHJcbiAgICB9YDtcclxuICBjc3MgPSAkKFwic3R5bGVcIikuaHRtbChjb2RlKS5ub2RlKCk7XHJcbiAgY3NzLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0L2Nzc1wiKTtcclxuICBjc3Muc2V0QXR0cmlidXRlKFwic2NyaXB0XCIsIFwidHJ1ZVwiKTtcclxuXHJcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChjc3MpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTdGF0R1VJQnV0dG9uKCl7XHJcbiAgdmFyIGZpZCwgbmFtZSwgbmF2aWdhdGUsIGJ1dHRvbjtcclxuXHJcbiAgZmlkID0gbG9jYXRpb24uc2VhcmNoLm1hdGNoKC8oXFxkKykvKTtcclxuICBmaWQgPSBOdW1iZXIoZmlkWzFdKTtcclxuXHJcbiAgbmF2aWdhdGUgPSAkKCdhW3N0eWxlPVwiY29sb3I6ICM5OTAwMDBcIl06Y29udGFpbnMoXCJ+0KTQvtGA0YPQvNGLXCIpJykudXAoJ2InKTtcclxuICBuYW1lID0gbmF2aWdhdGUudGV4dCgpLm1hdGNoKC8oLispIMK7ICguKykvKVsyXTtcclxuXHJcbiAgYnV0dG9uID0gJCgnPHNwYW4+JykuaHRtbChgIDo6IDxzcGFuIGlkPVwic2ZfYnV0dG9uU3RhdHNcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjtcIj5cclxuICAgINCh0YLQsNGC0LjRgdGC0LjQutCwXHJcbjwvc3Bhbj5gKS5ub2RlKCk7XHJcbiAgbmF2aWdhdGUubm9kZSgpLmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcblxyXG4gICRjZC5maWQgPSBmaWQ7XHJcbiAgJGNkLmZOYW1lID0gbmFtZTtcclxuXHJcbiAgaWYoZmlkID4gMTAwKXtcclxuICAgICRjZC5zaWQgPSBmaWQudG9TdHJpbmcoKTtcclxuICAgICRjZC5zaWQgPSBOdW1iZXIoJGNkLnNpZC5zbGljZSgxLCAkY2Quc2lkLmxlbmd0aCkpO1xyXG4gIH1lbHNle1xyXG4gICAgJG1vZGUgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGJpbmRFdmVudChidXR0b24sICdvbmNsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgIG1ha2VDb25uZWN0KFwiZ2tfU3RhdHNGb3J1bVwiLCB0cnVlKVxyXG4gIH0pO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5hc3luYyBmdW5jdGlvbiBtYWtlQ29ubmVjdChuYW1lLCBmaXJzdCl7XHJcbiAgdmFyIGluaTtcclxuXHJcbiAgaW5pID0gW1xyXG4gICAge25hbWU6IFwicGxheWVyc1wiLCBrZXk6IFwiaWRcIiwgaW5kZXg6IFtbXCJuYW1lXCIsIFwiYVwiLCB0cnVlXV19LFxyXG4gICAge25hbWU6IFwiZm9ydW1zXCIsIGtleTogXCJpZFwifVxyXG4gIF07XHJcblxyXG4gIGlmKGZpcnN0KXtcclxuICAgICRpZGIgPSBhd2FpdCBkYihuYW1lKTtcclxuICAgICRpZGIuc2V0SW5pVGFibGVMaXN0KGluaSk7XHJcbiAgfVxyXG4gICRpZGIgPSBhd2FpdCAkaWRiLmNvbm5lY3REQigpO1xyXG4gIC8vJGlkYi5kZWxldGVEQigpO1xyXG5cclxuICBjb25zb2xlLmxvZygkaWRiKTtcclxuICBhZGRUb0RCKCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVBsYXllcnMoaWQpe1xyXG4gIHJldHVybiB7XHJcbiAgICBpZDogaWQsXHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgc3RhdHVzOiBcIlwiLFxyXG4gICAgZGF0ZTogMCxcclxuICAgIGZvcnVtczogW11cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlTWVtYmVycyhpZCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiBpZCxcclxuICAgIHBvc3RzOiAwLFxyXG4gICAgbGFzdDogMCxcclxuICAgIHN0YXJ0OiBbXSxcclxuICAgIHdyaXRlOiBbXSxcclxuICAgIHdvcmRzOiAwLFxyXG4gICAgd29yZHNBdmVyYWdlOiAwLFxyXG4gICAgY2FybWE6IDAsXHJcbiAgICBjYXJtYUF2ZXJhZ2U6IDAsXHJcbiAgICBzbjogMCxcclxuICAgIGVudGVyOiAwLFxyXG4gICAgZXhpdDogMCxcclxuICAgIGtpY2s6IDAsXHJcbiAgICBpbnZpdGU6IDBcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlRm9ydW1zKGlkKXtcclxuICByZXR1cm4ge1xyXG4gICAgaWQ6IGlkLFxyXG4gICAgbmFtZTogXCJcIixcclxuICAgIHNpZDogMCxcclxuICAgIHBvc3RzOiAwLFxyXG4gICAgd29yZHM6IDAsXHJcbiAgICBwYWdlOiBbMCwgMF0sXHJcbiAgICB0aGVtZXM6IFswLCAwXSxcclxuICAgIGxvZzogWzAsIDBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZVRoZW1lcyhpZCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiBpZCxcclxuICAgIG5hbWU6IFwiXCIsXHJcbiAgICBhdXRob3I6IFswLCBcIlwiXSxcclxuICAgIHBvc3RzOiBbMCwgMF0sXHJcbiAgICBwYWdlczogWzAsIDBdLFxyXG4gICAgc3RhcnQ6IDBcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlVGltZXN0YW1wcyhpZCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiBpZCxcclxuICAgIHRpbWU6IFtdLFxyXG4gICAgZGF0YTogW11cclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGFkZFRvREIoKXtcclxuICB2YXIgZm9ydW07XHJcblxyXG4gIGlmKCEkaWRiLmV4aXN0KGB0aGVtZXNfJHskY2QuZmlkfWApKXtcclxuICAgIGZvcnVtID0gZ2VuZXJhdGVGb3J1bXMoJGNkLmZpZCk7XHJcbiAgICBmb3J1bS5uYW1lID0gJGNkLmZOYW1lO1xyXG4gICAgZm9ydW0uc2lkID0gJGNkLnNpZDtcclxuICAgIGZvcnVtID0gcmVwYWNrKGZvcnVtLCBcImZvcnVtXCIpO1xyXG5cclxuICAgICRpZGIuYWRkKFwiZm9ydW1zXCIsIGZvcnVtKTtcclxuICAgICRpZGIuc2V0TW9kaWZ5aW5nVGFibGVMaXN0KFtcclxuICAgICAge25hbWU6IGB0aGVtZXNfJHskY2QuZmlkfWAsIGtleTogXCJpZFwifSxcclxuICAgICAge25hbWU6IGBtZW1iZXJzXyR7JGNkLmZpZH1gLCBrZXk6IFwiaWRcIn0sXHJcbiAgICAgIHtuYW1lOiBgdGltZXN0YW1wXyR7JGNkLmZpZH1gLCBrZXk6IFwiaWRcIn1cclxuICAgIF0pO1xyXG4gICAgJGlkYi5kYi5jbG9zZSgpO1xyXG4gICAgJGlkYi5uZXh0VmVyc2lvbigpO1xyXG4gICAgbWFrZUNvbm5lY3QoXCJna19TdGF0c0ZvcnVtXCIsIGZhbHNlKTtcclxuICB9ZWxzZXtcclxuICAgIGxvYWRGcm9tTG9jYWxTdG9yYWdlKCdzZXR0aW5ncycpO1xyXG5cclxuICAgICR0ID0ge1xyXG4gICAgICBzdGF0czogY3JlYXRlVGFibGUoW1wiI3NmX2hlYWRlcl9TSVwiLCBcIiNzZl9jb250ZW50X1NJXCIsIFwiI3NmX2Zvb3Rlcl9TSVwiXSwgXCJzdGF0c1wiLCAkc3MpLFxyXG4gICAgICB0aGVtZXM6IGNyZWF0ZVRhYmxlKFtcIiNzZl9oZWFkZXJfVExcIiwgXCIjc2ZfY29udGVudF9UTFwiLCBcIiNzZl9mb290ZXJfVExcIl0sIFwidGhlbWVzXCIsICRzcylcclxuICAgIH07XHJcblxyXG4gICAgJGZvcnVtID0gYXdhaXQgJGlkYi5nZXRPbmUoXCJmb3J1bXNcIiwgXCJpZFwiLCA1NDg0NSk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJGZvcnVtKTtcclxuXHJcbiAgICAvLyRmb3J1bSA9IHJlcGFjaygkZm9ydW0sIFwiZm9ydW1cIik7XHJcblxyXG4gICAgLy9jcmVhdGVHVUkoKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUdVSSgpe1xyXG4gIHZhciB0YWJsZSwgdGQsIGd1aSwgY2FsZW5kYXI7XHJcblxyXG4gIHRhYmxlID0gJCgndGRbc3R5bGU9XCJjb2xvcjogIzk5MDAwMFwiXTpjb250YWlucyhcItCi0LXQvNCwXCIpJykudXAoJ3RhYmxlJykudXAoJ3RhYmxlJykubm9kZSgpO1xyXG4gIHRkID0gdGFibGUucm93c1swXS5jZWxsc1swXTtcclxuXHJcbiAgZ3VpID0gJCgnPHRkPicpLmh0bWwoYDxiPjxhIHN0eWxlPVwiY29sb3I6ICM5OTAwMDBcIiBocmVmPVwiaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvZm9ydW0ucGhwXCI+0KTQvtGA0YPQvNGLPC9hPiDCuyAkeyRjZC5mTmFtZX08L2I+XHJcbjo6IDxzcGFuIGlkPVwic2ZfZ3VpX3NldHRpbmdzXCIgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7IGZvbnQtd2VpZ2h0OiBib2xkO1wiPtCf0LDQvdC10LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjzwvc3Bhbj5cclxu4pahIDxzcGFuIGlkPVwic2ZfZ3VpX2ZpbHRlcnNcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjsgZm9udC13ZWlnaHQ6IGJvbGQ7XCI+0KTQuNC70YzRgtGA0Ys8L3NwYW4+XHJcbuKWoSA8c3BhbiBpZD1cInNmX2d1aV9tZXNzYWdlXCIgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7IGZvbnQtd2VpZ2h0OiBib2xkO1wiPtCg0LDRgdGB0YvQu9C60LAg0L/QvtGH0YLRizwvc3Bhbj5cclxuPGJyPlxyXG48dGFibGUgd2lkdGg9XCI5NyVcIiBjZWxsc3BhY2luZz1cIjBcIiBjZWxscGFkZGluZz1cIjBcIiBzdHlsZT1cImJvcmRlci1zdHlsZTogbm9uZTsgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcIiBhbGlnbj1cImNlbnRlclwiPlxyXG4gICAgPHRyPjx0ZCBjbGFzcz1cInNmX2xlZnRcIiBpZD1cInNmX2hlYWRlcl9TSVwiIHZhbGlnbj1cInRvcFwiIGNvbHNwYW49XCIyXCI+PC90ZD48L3RyPlxyXG4gICAgPHRyPjx0ZCBjbGFzcz1cInNmX2xlZnRcIiBpZD1cInNmX2NvbnRlbnRfU0lcIiB2YWxpZ249XCJ0b3BcIiBjb2xzcGFuPVwiMlwiPjwvdGQ+PC90cj5cclxuICAgIDx0cj48dGQgY2xhc3M9XCJzZl9sZWZ0XCIgaWQ9XCJzZl9mb290ZXJfU0lcIiB2YWxpZ249XCJ0b3BcIiBjb2xzcGFuPVwiMlwiPjwvdGQ+PC90cj5cclxuICAgIDx0cj48dGQgY2xhc3M9XCJzZl9sZWZ0XCIgYWxpZ249XCJjZW50ZXJcIiBpZD1cInNmX2hlYWRlcl9UTFwiIHdpZHRoPVwiMTI1MFwiPjwvdGQ+PHRkIGNsYXNzPVwic2ZfbGVmdFwiIHZhbGlnbj1cInRvcFwiIGFsaWduPVwiY2VudGVyXCIgaWQ9XCJzZl9oZWFkZXJfU1RJXCI+PC90ZD48L3RyPlxyXG4gICAgPHRyPjx0ZCBjbGFzcz1cInNmX2xlZnRcIiBhbGlnbj1cImNlbnRlclwiIGlkPVwic2ZfY29udGVudF9UTFwiIHdpZHRoPVwiMTI1MFwiPjwvdGQ+PHRkIGNsYXNzPVwic2ZfbGVmdFwiIHZhbGlnbj1cInRvcFwiIGFsaWduPVwiY2VudGVyXCIgaWQ9XCJzZl9jb250ZW50X1NUSVwiIHJvd3NwYW49XCIyXCI+PC90ZD48L3RyPlxyXG4gICAgPHRyPjx0ZCBjbGFzcz1cInNmX2xlZnRcIiBhbGlnbj1cImNlbnRlclwiIGlkPVwic2ZfZm9vdGVyX1RMXCI+PC90ZD48L3RyPlxyXG48L3RhYmxlPlxyXG48ZGl2IGlkPVwic2Zfc2hhZG93TGF5ZXJcIiB0aXRsZT1cItCa0LvQuNC6INC30LDQutGA0L7QtdGCINC+0LrQvdC+XCI+PC9kaXY+XHJcbjxkaXYgdHlwZT1cIndpbmRvd1wiIGlkPVwic2Zfc3RhdHVzV2luZG93XCI+JHtjcmVhdGVTdGF0dXNXaW5kb3coKX08L2Rpdj5cclxuPGRpdiB0eXBlPVwid2luZG93XCIgaWQ9XCJzZl9jb250cm9sUGFuZWxXaW5kb3dcIj4ke2NyZWF0ZUNvbnRyb2xQYW5lbCgpfTwvZGl2PlxyXG48ZGl2IHR5cGU9XCJ3aW5kb3dcIiBpZD1cInNmX2ZpbHRlcnNXaW5kb3dcIj48L2Rpdj5cclxuPGRpdiB0eXBlPVwid2luZG93XCIgaWQ9XCJzZl9tZXNzYWdlV2luZG93XCI+JHtjcmVhdGVNZXNzYWdlV2luZG93KCl9PC9kaXY+XHJcbjxkaXYgdHlwZT1cIndpbmRvd1wiIGlkPVwic2ZfY2FsZW5kYXJcIj48L2Rpdj5gKS5ub2RlKCk7XHJcblxyXG4gIHRkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGQpO1xyXG4gIHRhYmxlLnJvd3NbMF0uYXBwZW5kQ2hpbGQoZ3VpKTtcclxuXHJcbiAgcmVuZGVyQmFzZUhUTUwoKTtcclxuICAvL3JlbmRlclN0YXRzVGFibGUoKTtcclxuICAvL3JlbmRlclRoZW1lc1RhYmxlKCk7XHJcbiAgY3JlYXRlU2hhZG93TGF5ZXIoKTtcclxuXHJcbiAgYmluZEV2ZW50KCQoJyNzZl9ndWlfc2V0dGluZ3MnKS5ub2RlKCksICdvbmNsaWNrJywgb3BlbkNvbnRyb2xQYW5lbFdpbmRvdyk7XHJcbiAgLy9iaW5kRXZlbnQoJCgnI3NmX2d1aV9tZXNzYWdlJykubm9kZSgpLCAnb25jbGljaycsIG9wZW5NZXNzYWdlV2luZG93KTtcclxuICAvL2JpbmRFdmVudCgkKCcjc2ZfZm9yZ2V0Rm9ydW0nKS5ub2RlKCksICdvbmNsaWNrJywgZm9yZ2V0Rm9ydW0pO1xyXG5cclxuXHJcbiAgJCgnI3NmX2NvbnRyb2xQYW5lbFdpbmRvdycpXHJcbiAgICAuZmluZCgnaW5wdXRbdHlwZT1cImJ1dHRvblwiXScpXHJcbiAgICAubm9kZUFycigpXHJcbiAgICAuZm9yRWFjaChcclxuICAgICAgZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgYmluZEV2ZW50KG5vZGUsICdvbmNsaWNrJywgZnVuY3Rpb24oKXtwcmVwYXJlRG9UYXNrKG5vZGUpfSk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gIC8vYmluZEV2ZW50KCQoJyNzZl9zZW5kTWVzc2FnZXMnKS5ub2RlKCksICdvbmNsaWNrJywgcHJlcGFyZVNlbmRNYWlscyk7XHJcblxyXG4gIGNhbGVuZGFyID0gJCgnc3Bhblt0eXBlPVwiY2FsZW5kYXJDYWxsXCJdJykubm9kZSgpO1xyXG4gIGJpbmRFdmVudChjYWxlbmRhciwgJ29uY2xpY2snLCBmdW5jdGlvbigpe3JlbmRlckNhbGVuZGFyKGNhbGVuZGFyKX0pO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiByZW5kZXJDYWxlbmRhcihub2RlVGV4dERhdGUpe1xyXG4gIHZhciBzaXplLCBsZWZ0LCB0b3AsIGNhbGVuZGFyLCBkYXRlO1xyXG5cclxuICBjYWxlbmRhciA9ICQoJyNzZl9jYWxlbmRhcicpLm5vZGUoKTtcclxuXHJcbiAgaWYoY2FsZW5kYXIuc3R5bGUuZGlzcGxheSA9PSBcImJsb2NrXCIpe1xyXG4gICAgY2FsZW5kYXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYobm9kZVRleHREYXRlLm5leHRFbGVtZW50U2libGluZy5kaXNhYmxlZCl7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBzaXplID0gbm9kZVRleHREYXRlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIGxlZnQgPSBzaXplLmxlZnQgKyBzaXplLndpZHRoICsgMTA7XHJcbiAgdG9wID0gc2l6ZS50b3AgLSA1O1xyXG5cclxuICBjYWxlbmRhci5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XHJcbiAgY2FsZW5kYXIuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcclxuICBjYWxlbmRhci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHJcbiAgZGF0ZSA9IE51bWJlcihub2RlVGV4dERhdGUubmV4dEVsZW1lbnRTaWJsaW5nLnZhbHVlKTtcclxuXHJcbiAgY3JlYXRlQ2FsZW5kYXIoZGF0ZSwgbm9kZVRleHREYXRlKTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlU2hhZG93TGF5ZXIoKXtcclxuICB2YXIgYkJvZHkgPSBkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIHZhciBmdWxsSGVpZ2h0ID0gJHNjcmVlbkhlaWdodCA+IGJCb2R5LmhlaWdodCA/ICRzY3JlZW5IZWlnaHQgOiBiQm9keS5oZWlnaHQ7XHJcbiAgdmFyIHNoYWRvd0xheWVyO1xyXG5cclxuICBzaGFkb3dMYXllciA9ICQoJyNzZl9zaGFkb3dMYXllcicpLm5vZGUoKTtcclxuICBzaGFkb3dMYXllci5zdHlsZS53aWR0aCA9IGJCb2R5LndpZHRoO1xyXG4gIHNoYWRvd0xheWVyLnN0eWxlLmhlaWdodCA9IGZ1bGxIZWlnaHQ7XHJcblxyXG4gIGJpbmRFdmVudChzaGFkb3dMYXllciwgJ29uY2xpY2snLCBjbG9zZVdpbmRvd3MpO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTdGF0dXNXaW5kb3coKXtcclxuICByZXR1cm4gYDx0YWJsZSB3aWR0aD1cIjYwMFwiIGhlaWdodD1cIjUwXCIgc3R5bGU9XCJtYXJnaW46IDIwcHggMjVweDsgYmFja2dyb3VuZC1jb2xvcjogI2YwZmZmMFwiIHR5cGU9XCJwYWRkaW5nXCI+XHJcbiAgICA8dHIgdHlwZT1cImhlYWRlclwiIGhlaWdodD1cIjM1XCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgc3R5bGU9XCJjb2xvcjogIzk5MDAwMDtcIj7Qn9GA0L7Qs9GA0LXRgdGBINC30LDQtNCw0YfQuDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjE1XCI+XHJcbiAgICAgICAgPHRkPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmctbGVmdDogMzBweDtcIj5cclxuICAgICAgICAgICAgPGI+0JfQsNC00LDRh9CwOjwvYj4gPHNwYW4gaWQ9XCJzZl9wcm9ncmVzc1RleHRcIiBzdHlsZT1cImZvbnQtc3R5bGU6IGl0YWxpYztcIj48L3NwYW4+IFs8c3BhbiBpZD1cInNmX3Byb2dyZXNzQ3VycmVudFwiPjwvc3Bhbj4vPHNwYW4gaWQ9XCJzZl9wcm9ncmVzc01heFwiPjwvc3Bhbj5dXHJcbiAgICAgICAgICAgIDxzcGFuIGlkPVwic2ZfcHJvZ3Jlc3NUZXh0RXh0cmFcIj48L3NwYW4+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZy1sZWZ0OiAzMHB4O1wiPlxyXG4gICAgICAgICAgICA8Yj7QktGA0LXQvNC10L3QuCDQvtGB0YLQsNC70L7RgdGMOjwvYj4gPHNwYW4+MDA6MDA8L3NwYW4+PHNwYW4gc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiIGlkPVwic2ZfcHJvZ3Jlc3NUaW1lXCI+MDwvc3Bhbj5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nLWxlZnQ6IDMwcHg7XCI+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogNTEwcHg7IGhlaWdodDogMTBweDsgYm9yZGVyOiBzb2xpZCAxcHggIzAwMDAwMDsgZmxvYXQ6IGxlZnQ7IG1hcmdpbi10b3A6IDhweDtcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAxMDAlOyBiYWNrZ3JvdW5kLWNvbG9yOiBicm93bjtcIiBpZD1cInNmX3Byb2dyZXNzQmFyXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnQ7IHdpZHRoOiA1cHg7IGhlaWdodDogMjVweDtcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0OyB3aWR0aDogMjVweDsgaGVpZ2h0OiAyNXB4O1wiIGlkPVwic2ZfcHJvZ3Jlc3NJY29cIj48L2Rpdj5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0ciBoZWlnaHQ9XCIyNVwiPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCIgc3R5bGU9XCJwYWRkaW5nOiAxNXB4IDMwcHggMTBweCAwO1wiPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwi0J/QsNGD0LfQsFwiIC8+IDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCLQntGC0LzQtdC90LBcIiAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjVcIiBiZ2NvbG9yPVwiI2QwZWVkMFwiPlxyXG4gICAgICAgIDx0ZD48L3RkPlxyXG4gICAgPC90cj5cclxuPC90YWJsZT5gO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDb250cm9sUGFuZWwoKXtcclxuICB2YXIgY29kZSwgZGlzYWJsZWQ7XHJcblxyXG4gIGRpc2FibGVkID0gJG1vZGUgPyAnJyA6ICdkaXNhYmxlZCc7XHJcbiAgY29kZSA9IGA8dGFibGUgY2VsbHNwYWNpbmc9XCIwXCIgd2lkdGg9XCIzMDBcIiBzdHlsZT1cImJvcmRlcjogc29saWQgMCAjMDAwMDAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmZmYwOyBtYXJnaW46IDIwcHggMjVweDtcIiB0eXBlPVwic21hbGxQYWRkaW5nXCI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIiB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgYmdjb2xvcj1cIiNkMGVlZDBcIiBjb2xzcGFuPVwiMlwiPtCh0LHQvtGAINC00LDQvdC90YvRhSDQviDRgtC10LzQsNGFPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIiBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICDQn9C+INC60LDQutC+0LUg0YfQuNGB0LvQvjpcclxuICAgICAgICAgICAgPHNwYW4gdHlwZT1cImNhbGVuZGFyQ2FsbFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcIj4keyRjLmdldE5vcm1hbERhdGUoJGRhdGUsIHRydWUpLmR9PC9zcGFuPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiAgbmFtZT1cInNmX3BhcnNlRm9ydW1cIiBjbGFzcz1cInNmX2hpZGVJbnB1dFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiB2YWx1ZT1cIiR7JGRhdGV9XCIgLz5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZUZvcnVtXCIgdmFsdWU9XCJjb3VudFwiIGNoZWNrZWQgLz5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIGNvbHNwYW49XCIyXCI+XHJcbiAgICAgICAgICAgINCS0YHQtSDRgdGC0YDQsNC90LjRhtGLINGE0L7RgNGD0LzQsDpcclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZUZvcnVtXCIgdmFsdWU9XCJhbGxcIiAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjMwXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjJcIj48aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwi0J3QsNGH0LDRgtGMXCIgbmFtZT1cInNmX3BhcnNlRm9ydW1cIiAvPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG5cclxuICAgIDx0ciBoZWlnaHQ9XCIzMFwiIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBiZ2NvbG9yPVwiI2QwZWVkMFwiIGNvbHNwYW49XCIyXCI+0JDQvdCw0LvQuNC3INC40LfQstC10YHRgtC90YvRhSDRgtC10Lw8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIGNvbHNwYW49XCIyXCI+XHJcbiAgICAgICAgICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INGC0LXQvDpcclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInNmX3BhcnNlVGhlbWVzXCIgY2xhc3M9XCJzZl9oaWRlSW5wdXRcIiB2YWx1ZT1cIjBcIiAvPi8gWzxzcGFuIGlkPVwic2ZfY291bnRUaHJlYWRzXCIgdGl0bGU9XCLQndC10L7QsdGA0LDQsdC+0YLQsNC90L3Ri9GFINGC0LXQvCAvINCS0YHQtdCz0L4g0YLQtdC8XCI+WzAvMF08L3NwYW4+XVxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNmX3BhcnNlVGhlbWVzXCIgdmFsdWU9XCJjb3VudFwiIGNoZWNrZWQgLz5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIGNvbHNwYW49XCIyXCI+XHJcbiAgICAgICAgICAgINCi0L7Qu9GM0LrQviDQvtGC0LzQtdGH0LXQvdC90YvQtSDQsiDRgdC/0LjRgdC60LU6XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2ZfcGFyc2VUaGVtZXNcIiB2YWx1ZT1cInNlbGVjdFwiIC8+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIiBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICDQktGB0LUg0LjQt9Cy0LXRgdGC0L3Ri9C1INGC0LXQvNGLOlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNmX3BhcnNlVGhlbWVzXCIgdmFsdWU9XCJhbGxcIiAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjMwXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjJcIj48aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwi0J3QsNGH0LDRgtGMXCIgbmFtZT1cInNmX3BhcnNlVGhlbWVzXCIgLz48L3RkPlxyXG4gICAgPC90cj5cclxuXHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIiB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgYmdjb2xvcj1cIiNkMGVlZDBcIiBjb2xzcGFuPVwiMlwiPtCh0YLQsNGC0YPRgSDQv9C10YDRgdC+0L3QsNC20LXQuTwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5cclxuICAgICAgICAgICAg0JrQvtC70LjRh9C10YHRgtCy0L4g0L/QtdGA0YHQvtC90LDQttC10Lk6XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJzZl9wYXJzZVBsYXllcnNcIiBjbGFzcz1cInNmX2hpZGVJbnB1dFwiIHZhbHVlPVwiMFwiIC8+LzxzcGFuIGlkPVwic2ZfY291bnRNZW1iZXJzXCI+MDwvc3Bhbj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZVBsYXllcnNcIiAke2Rpc2FibGVkfSB2YWx1ZT1cImNvdW50XCIgY2hlY2tlZCAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5cclxuICAgICAgICAgICAg0KLQvtC70YzQutC+INC+0YLQvNC10YfQtdC90L3Ri9C1INCyINGB0L/QuNGB0LrQtTpcclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZVBsYXllcnNcIiAgJHtkaXNhYmxlZH0gdmFsdWU9XCJzZWxlY3RcIiAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5cclxuICAgICAgICAgICAg0JLRgdC1INC/0LXRgNGB0L7QvdCw0LbQuDpcclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZVBsYXllcnNcIiAke2Rpc2FibGVkfSB2YWx1ZT1cImFsbFwiIC8+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBjb2xzcGFuPVwiMlwiPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCLQndCw0YfQsNGC0YxcIiAke2Rpc2FibGVkfSBuYW1lPVwic2ZfcGFyc2VQbGF5ZXJzXCIgLz48L3RkPlxyXG4gICAgPC90cj5cclxuXHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIiB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgYmdjb2xvcj1cIiNkMGVlZDBcIiBjb2xzcGFuPVwiMlwiPtCU0L7Qv9C+0LvQvdC40YLQtdC70YzQvdC+PC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiMjVcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiPtCh0L7RgdGC0LDQsiDRgdC40L3QtNC40LrQsNGC0LA6PC90ZD5cclxuICAgICAgICA8dGQgYWxpZ249XCJsZWZ0XCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cItCe0LHRgNCw0LHQvtGC0LDRgtGMXCIgbmFtZT1cInNmX21lbWJlckxpc3RcIiAke2Rpc2FibGVkfSAvPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjI1XCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIj7Qn9GA0L7RgtC+0LrQvtC7INGB0LjQvdC00LjQutCw0YLQsDo8L3RkPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImxlZnRcIj48aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwi0J7QsdGA0LDQsdC+0YLQsNGC0YxcIiBuYW1lPVwic2Zfc2luZGljYXRlTG9nXCIgJHtkaXNhYmxlZH0gLz48L3RkPlxyXG4gICAgPC90cj5cclxuXHJcbiAgICA8dHIgaGVpZ2h0PVwiNDBcIj5cclxuICAgICAgICA8dGQgY29sc3Bhbj1cIjJcIiBzdHlsZT1cImZvbnQtc2l6ZTogOXB4O1wiIGFsaWduPVwiY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGlkPVwic2ZfZm9yZ2V0Rm9ydW1cIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjtcIj5b0LfQsNCx0YvRgtGMINGN0YLQvtGCINGE0L7RgNGD0LxdPC9zcGFuPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjVcIiBiZ2NvbG9yPVwiI2QwZWVkMFwiPlxyXG4gICAgICAgIDx0ZCBjb2xzcGFuPVwiMlwiPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG48L3RhYmxlPmA7XHJcblxyXG4gIHJldHVybiBjb2RlO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNZXNzYWdlV2luZG93KCl7XHJcbiAgcmV0dXJuIGA8dGFibGUgd2lkdGg9XCI3MDBcIiBoZWlnaHQ9XCIzOTVcIiBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwibWFyZ2luOiAyMHB4IDI1cHg7IGJhY2tncm91bmQtY29sb3I6ICNmMGZmZjA7XCIgdHlwZT1cInBhZGRpbmdcIj5cclxuICAgIDx0ciB0eXBlPVwiaGVhZGVyXCIgaGVpZ2h0PVwiMzVcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cImNvbG9yOiAjOTkwMDAwO1wiIGNvbHNwYW49XCIzXCI+0KDQsNGB0YHRi9C70LrQsCDQv9C+0YfRgtGLPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogOHB4IDVweCAycHggNXB4O1wiIGFsaWduPVwicmlnaHRcIj7QmtC+0LzRgzo8L3RkPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDhweCA1cHggMnB4IDVweDsgd2lkdGg6IDIwMHB4O1wiPjxzZWxlY3Qgc3R5bGU9XCJ3aWR0aDogMjAwcHg7XCIgbmFtZT1cIm1pZFwiPjwvc2VsZWN0PjwvdGQ+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogOHB4IDVweCAycHggNXB4OyB3aWR0aDogMzUwcHg7XCIgYWxpZ249XCJsZWZ0XCI+INCS0YHQtdCz0L46IDxzcGFuIHR5cGU9XCJjb3VudFwiPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCI+0KLQtdC80LA6PC90ZD5cclxuICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiAycHggNXB4IDhweCA1cHg7XCIgY29sc3Bhbj1cIjJcIj48aW5wdXQgdHlwZT1cInRleHRcIiBtYXhsZW5ndGg9XCI1MFwiIHN0eWxlPVwid2lkdGg6MTAwJVwiIHZhbHVlPVwiXCIgbmFtZT1cInN1YmplY3RcIj48L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0ciBoZWlnaHQ9XCIzMFwiIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBiZ2NvbG9yPVwiI2QwZWVkMFwiIGNvbHNwYW49XCIzXCI+0KPRgtC40LvQuNGC0Ys8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIHN0eWxlPVwicGFkZGluZzogOHB4IDVweCAycHggNXB4O1wiPtCg0LXQttC40Lw6PC90ZD5cclxuICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiA4cHggNXB4IDJweCA1cHg7IHdpZHRoOiAyMDBweDtcIiBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICA8c2VsZWN0IHN0eWxlPVwid2lkdGg6IDMwMHB4O1wiIG5hbWU9XCJ3b3JrTW9kZVwiPlxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm1haWxcIj7Qn9C+0YfRgtCwPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiaW52aXRlXCI+0J/QvtGH0YLQsCDQuCDQv9GA0LjQs9C70LDRiNC10L3QuNC1PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ29Bd2F5XCI+0J/QvtGH0YLQsCDQuCDQuNC30LPQvdCw0L3QuNC1PC9vcHRpb24+XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCI+0KHQuNC90LTQuNC60LDRgjo8L3RkPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDJweCA1cHggOHB4IDVweDsgd2lkdGg6IDIwMHB4O1wiIGNvbHNwYW49XCIyXCI+PHNlbGVjdCBzdHlsZT1cIndpZHRoOiAzMDBweDtcIiBuYW1lPVwic2lkXCI+PC9zZWxlY3Q+PC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIiB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgYmdjb2xvcj1cIiNkMGVlZDBcIiBjb2xzcGFuPVwiM1wiPtCh0L7QvtCx0YnQtdC90LjQtTwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiIHN0eWxlPVwicGFkZGluZzogOHB4IDhweCAycHggOHB4O1wiPlxyXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XCJ3aWR0aDoxMDAlXCIgcm93cz1cIjEwXCIgbmFtZT1cIm1lc3NhZ2VcIj48L3RleHRhcmVhPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIzXCIgaGVpZ2h0PVwiMzVcIj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBpZD1cInNmX3NlbmRNZXNzYWdlc1wiIHZhbHVlPVwi0JfQsNC/0YPRgdGC0LjRgtGMXCI+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiNVwiIGJnY29sb3I9XCIjZDBlZWQwXCI+XHJcbiAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+PC90ZD5cclxuICAgIDwvdHI+XHJcbjwvdGFibGU+YDtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ2FsZW5kYXIoY0RhdGUsIG5vZGVUZXh0RGF0ZSl7XHJcbiAgdmFyIG1vbnRocywgZGF5cywgZGF0ZSwgeWVhciwgbW9udGgsIGRheSwgY29kZSwgcm93LCBjb2xsLCBkYXlOdW1iZXIsIGZpcnN0RGF5V2VlaywgZXhpdCwgdE1vbnRoLCB0RGF5LCBjb2xvcjtcclxuXHJcbiAgbW9udGhzICA9IFsn0K/QvdCy0LDRgNGMJywn0KTQtdCy0YDQsNC70YwnLCfQnNCw0YDRgicsJ9CQ0L/RgNC10LvRjCcsJ9Cc0LDQuScsJ9CY0Y7QvdGMJywn0JjRjtC70YwnLCfQkNCy0LPRg9GB0YInLCfQodC10L3RgtGA0Y/QsdGA0YwnLCfQntC60YLRj9Cx0YDRjCcsJ9Cd0L7Rj9Cx0YDRjCcsJ9CU0LXQutCw0LHRgNGMJ107XHJcbiAgZGF5cyAgICA9IFszMSwgMjgsIDMxLCAzMCwgMzEsIDMwLCAzMSwgMzEsIDMwLCAzMSwgMzAsIDMxXTtcclxuICBleGl0ICAgID0gZmFsc2U7XHJcblxyXG4gIGRhdGUgPSBjRGF0ZSA9PSBudWxsID8gJGRhdGUgOiBjRGF0ZTtcclxuICBkYXRlID0gJGMuZ2V0Tm9ybWFsRGF0ZShkYXRlLCB0cnVlKTtcclxuICBkYXRlID0gZGF0ZS5kLnNwbGl0KCcuJyk7XHJcblxyXG4gIGRheSA9IE51bWJlcihkYXRlWzBdKTtcclxuICB0TW9udGggPSBkYXRlWzFdO1xyXG4gIG1vbnRoID0gTnVtYmVyKGRhdGVbMV0pO1xyXG4gIHllYXIgPSBOdW1iZXIoZGF0ZVsyXSk7XHJcblxyXG4gIGlmKHllYXIgJSA0ID09IDApIGRheXNbMV0gPSAyOTtcclxuXHJcbiAgY29kZSA9XHJcbiAgICBgPHRhYmxlIGNsYXNzPVwid2JcIiBzdHlsZT1cIm1hcmdpbjogMjBweCAyNXB4O1wiPlxyXG4gICAgICAgICAgICAgICAgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgdHlwZT1cImNvbnRyb2xcIj7CqzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIHR5cGU9XCJjb250cm9sXCIgdGl0bGU9XCLQktGL0LHRgNCw0YLRjCDQs9C+0LRcIiBjb2xzcGFuPVwiNVwiPiR7bW9udGhzW21vbnRoLTFdfSAke3llYXJ9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgdHlwZT1cImNvbnRyb2xcIj7CuzwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+0J88L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD7QkjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPtChPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+0Kc8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD7QnzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPtChPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+0JI8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5gO1xyXG5cclxuICBkYXlOdW1iZXIgPSAxO1xyXG4gIGZpcnN0RGF5V2VlayA9IERhdGUucGFyc2UoYCR7bW9udGh9LzEvJHt5ZWFyfWApO1xyXG4gIGZpcnN0RGF5V2VlayA9IG5ldyBEYXRlKGZpcnN0RGF5V2VlaykuZ2V0RGF5KCk7IGZpcnN0RGF5V2Vlay0tO1xyXG4gIGlmKGZpcnN0RGF5V2VlayA9PSAtMSkgZmlyc3REYXlXZWVrID0gNjtcclxuXHJcbiAgZm9yKHJvdyA9IDA7IHJvdyA8IDY7IHJvdysrKXtcclxuICAgIGlmKGV4aXQpIGJyZWFrO1xyXG4gICAgY29kZSArPSBgPHRyPmA7XHJcbiAgICBmb3IoY29sbCA9IDA7IGNvbGwgPCA3OyBjb2xsKyspe1xyXG4gICAgICBpZihyb3cgPT0gMCAmJiBjb2xsIDwgZmlyc3REYXlXZWVrKXtcclxuICAgICAgICBjb2RlICs9IGA8dGQgY29sc3Bhbj1cIiR7Zmlyc3REYXlXZWVrfVwiPjwvdGQ+YDtcclxuICAgICAgICBjb2xsID0gZmlyc3REYXlXZWVrO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGRheU51bWJlciA8PSBkYXlzW21vbnRoLTFdKXtcclxuICAgICAgICBpZihkYXlOdW1iZXIgPT0gZGF5c1ttb250aC0xXSAmJiBjb2xsID09IDYpIGV4aXQgPSB0cnVlO1xyXG4gICAgICAgIHREYXkgPSBkYXlOdW1iZXIgPCAxMCA/ICcwJyArIGRheU51bWJlciA6IGRheU51bWJlcjtcclxuICAgICAgICBjb2xvciA9IGRheU51bWJlciA9PSBkYXkgPyAnc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZDBlZWQwO1wiJyA6ICcnO1xyXG4gICAgICAgIGNvZGUgKz0gYDx0ZCB0eXBlPVwiZGF5XCIgJHtjb2xvcn0gbmFtZT1cIiR7dERheX0uJHt0TW9udGh9LiR7eWVhcn1cIiB0aXRsZT1cIiR7dE1vbnRofS8ke3REYXl9LyR7eWVhcn0gMDA6MDBcIj4ke2RheU51bWJlcn08L3RkPmA7XHJcbiAgICAgICAgZGF5TnVtYmVyKys7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIGNvZGUgKz0gYDx0ZCBjb2xzcGFuPVwiJHs3LWNvbGx9XCI+PC90ZD5gO1xyXG4gICAgICAgIGV4aXQgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb2RlICs9IGA8L3RyPmA7XHJcbiAgfVxyXG5cclxuICBjb2RlICs9XHJcbiAgICBgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiN1wiPiR7JGMuZ2V0Tm9ybWFsRGF0ZSgkZGF0ZSwgdHJ1ZSkuZH08L3RkPlxyXG4gICAgICAgICAgICAgPC90cj5cclxuICAgICAgICA8L3RhYmxlPmA7XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICQoJyNzZl9jYWxlbmRhcicpXHJcbiAgICAuaHRtbChjb2RlKVxyXG4gICAgLmZpbmQoJ3RkW3R5cGU9XCJjb250cm9sXCJdLFt0eXBlPVwiZGF5XCJdJylcclxuICAgIC5ub2RlQXJyKClcclxuICAgIC5mb3JFYWNoKFxyXG4gICAgICBmdW5jdGlvbihidXR0b24pe1xyXG4gICAgICAgIGlmKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09IFwiY29udHJvbFwiKXtcclxuICAgICAgICAgIGlmKGJ1dHRvbi50aXRsZSA9PSBcItCS0YvQsdGA0LDRgtGMINCz0L7QtFwiKXtcclxuICAgICAgICAgICAgYmluZEV2ZW50KGJ1dHRvbiwgJ29uY2xpY2snLCBmdW5jdGlvbigpe3NldFllYXIobW9udGgsIHllYXIpfSk7XHJcbiAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGJpbmRFdmVudChidXR0b24sICdvbmNsaWNrJywgZnVuY3Rpb24oKXttb3ZlTW9udGgoYnV0dG9uLCBtb250aCwgeWVhcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGJpbmRFdmVudChidXR0b24sICdvbmNsaWNrJywgZnVuY3Rpb24oKXtjYWxlbmRhclNldERhdGUoYnV0dG9uLCBub2RlVGV4dERhdGUpfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIG1vdmVNb250aChidXR0b24sIG1vbnRoLCB5ZWFyKXtcclxuICAgIGlmKGJ1dHRvbi50ZXh0Q29udGVudCA9PSBcIsKrXCIpe1xyXG4gICAgICBtb250aC0tO1xyXG4gICAgICBpZihtb250aCA9PSAwKXtcclxuICAgICAgICB5ZWFyLS07XHJcbiAgICAgICAgbW9udGggPSAxMjtcclxuICAgICAgfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIG1vbnRoKys7XHJcbiAgICAgIGlmKG1vbnRoID09IDEzKXtcclxuICAgICAgICB5ZWFyKys7XHJcbiAgICAgICAgbW9udGggPSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBtb250aCA9IG1vbnRoIDwgMTAgPyAnMCcgKyBtb250aCA6IG1vbnRoO1xyXG5cclxuICAgIGNyZWF0ZUNhbGVuZGFyKERhdGUucGFyc2UoYCR7bW9udGh9LzAxLyR7eWVhcn1gKSAvIDEwMDAsIG5vZGVUZXh0RGF0ZSk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHNldFllYXIobW9udGgsIHllYXIpe1xyXG4gICAgdmFyIG5ZZWFyO1xyXG5cclxuICAgIG5ZZWFyID0gcHJvbXB0KFwi0JLQstC10LTQuNGC0LUg0L/QvtC90YvQuSDQs9C+0LRcIik7XHJcblxyXG4gICAgaWYoblllYXIgPT0gXCJcIil7XHJcbiAgICAgIG5ZZWFyID0gMTk3MDtcclxuICAgICAgbW9udGggPSBcIjAxXCI7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgblllYXIgPSBwYXJzZUludChuWWVhciwgMTApO1xyXG4gICAgICBpZihpc05hTihuWWVhcikpIG5ZZWFyID0geWVhcjtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKG5ZZWFyKTtcclxuXHJcbiAgICBjcmVhdGVDYWxlbmRhcihEYXRlLnBhcnNlKGAke21vbnRofS8wMS8ke25ZZWFyfWApIC8gMTAwMCwgbm9kZVRleHREYXRlKTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gY2FsZW5kYXJTZXREYXRlKGJ1dHRvbiwgbm9kZVRleHREYXRlKXtcclxuICAgIG5vZGVUZXh0RGF0ZS5uZXh0RWxlbWVudFNpYmxpbmcudmFsdWUgPSBEYXRlLnBhcnNlKGJ1dHRvbi50aXRsZSkgLyAxMDAwO1xyXG4gICAgJChub2RlVGV4dERhdGUpLmh0bWwoYnV0dG9uLmdldEF0dHJpYnV0ZSgnbmFtZScpKTtcclxuICAgICQoXCIjc2ZfY2FsZW5kYXJcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHByZXBhcmVEb1Rhc2sobm9kZSl7XHJcblxyXG4gIG9wZW5TdGF0dXNXaW5kb3coKTtcclxuXHJcbiAgc3dpdGNoIChub2RlLm5hbWUpe1xyXG4gICAgY2FzZSAnc2ZfcGFyc2VGb3J1bSc6IGZvcnVtKCk7IGJyZWFrO1xyXG4gICAgY2FzZSAnc2ZfcGFyc2VUaGVtZXMnOiB0aGVtZXMoKTsgYnJlYWs7XHJcbiAgICBjYXNlICdzZl9wYXJzZVBsYXllcnMnOiBwbGF5ZXJzKCk7IGJyZWFrO1xyXG4gICAgY2FzZSAnc2ZfbWVtYmVyTGlzdCc6IGdldE1lbWJlcnNMaXN0KCk7IGJyZWFrO1xyXG4gICAgY2FzZSAnc2Zfc2luZGljYXRlTG9nJzogZ2V0TWF4UGFnZVNpbmRpY2F0ZUxvZygpOyBicmVhaztcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZm9ydW0oKXtcclxuICAgIHZhciBwID0gZ2V0UGFyYW0oJ3NmX3BhcnNlRm9ydW0nKTtcclxuXHJcbiAgICBzd2l0Y2gocC50eXBlKXtcclxuICAgICAgY2FzZSAnY291bnQnOlxyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzcygnc3RhcnQnLCBg0J7QsdGA0LDQsdC+0YLQutCwINGE0L7RgNGD0LzQsCDRgdC40L3QtNC40LrQsNGC0LAgIyR7JGZvcnVtLmlkfSDCqyR7JGZvcnVtLm5hbWV9wrtgLCAwLCAxMDApO1xyXG4gICAgICAgIHBhcnNlRm9ydW0oMCwgZmFsc2UsIHAuY291bnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnYWxsJzpcclxuICAgICAgICBnZXRNYXhQYWdlRm9ydW0oKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gdGhlbWVzKCl7XHJcbiAgICB2YXIgcCA9IGdldFBhcmFtKCdzZl9wYXJzZVRoZW1lcycpLCBsO1xyXG5cclxuICAgIHN3aXRjaChwLnR5cGUpe1xyXG4gICAgICBjYXNlICdjb3VudCc6XHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsIGDQntCx0YDQsNCx0L7RgtC60LAg0YLQtdC8YCwgMCwgcC5jb3VudCk7XHJcbiAgICAgICAgcHJlcGFyZVBhcnNlVGhlbWVzKHAuY291bnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnc2VsZWN0JzpcclxuICAgICAgICBsID0gZ2V0TGlzdCgnc2ZfdGhlbWVzTGlzdCcpO1xyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzcygnc3RhcnQnLCBg0J7QsdGA0LDQsdC+0YLQutCwINGC0LXQvGAsIDAsIGwuY291bnQpO1xyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzc1RpbWUobC5jKTtcclxuICAgICAgICBwYXJzZVRoZW1lcygwLCBsLmNvdW50LCBsLmFycmF5KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ2FsbCc6XHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsIGDQntCx0YDQsNCx0L7RgtC60LAg0YLQtdC8YCwgMCwgJGNkLmYudGhyZWFkcy5uZXcpO1xyXG4gICAgICAgIHByZXBhcmVQYXJzZVRoZW1lcygwKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gcGxheWVycygpe1xyXG4gICAgdmFyIHAsIGw7XHJcblxyXG4gICAgcCA9IGdldFBhcmFtKCdzZl9wYXJzZVBsYXllcnMnKTtcclxuXHJcbiAgICBzd2l0Y2gocC50eXBlKXtcclxuICAgICAgY2FzZSAnY291bnQnOlxyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzcygnc3RhcnQnLCBg0J7QsdGA0LDQsdC+0YLQutCwINC/0LXRgNGB0L7QvdCw0LbQtdC5YCwgMCwgcC5jb3VudCk7XHJcbiAgICAgICAgcHJlcGFyZVBhcnNlTWVtYmVycyhwLmNvdW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XHJcbiAgICAgICAgbCA9IGdldExpc3QoJ3NmX21lbWJlcnNMaXN0Jyk7XHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsIGDQntCx0YDQsNCx0L7RgtC60LAg0L/QtdGA0YHQvtC90LDQttC10LlgLCAwLCBsLmNvdW50KTtcclxuICAgICAgICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKGwuYyk7XHJcbiAgICAgICAgcGFyc2VNZW1iZXJzKDAsIGwuY291bnQsIGwuYXJyYXkpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnYWxsJzpcclxuICAgICAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgYNCe0LHRgNCw0LHQvtGC0LrQsCDQv9C10YDRgdC+0L3QsNC20LXQuWAsIDAsICRjZC5jb3VudE1lbWJlcnMpO1xyXG4gICAgICAgIHByZXBhcmVQYXJzZU1lbWJlcnMoKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0UGFyYW0obmFtZSl7XHJcbiAgICB2YXIgdHlwZSwgY291bnQsIHRhYmxlO1xyXG5cclxuICAgIHRhYmxlID0gJChub2RlKS51cCgndGFibGUnKS5ub2RlKCk7XHJcbiAgICB0eXBlID0gJCh0YWJsZSkuZmluZChgaW5wdXRbdHlwZT1cInJhZGlvXCJdW25hbWU9XCIke25hbWV9XCJdOmNoZWNrZWRgKS5ub2RlKCkudmFsdWU7XHJcbiAgICBjb3VudCA9ICQodGFibGUpLmZpbmQoYGlucHV0W3R5cGU9XCJ0ZXh0XCJdW25hbWU9XCIke25hbWV9XCJdYCkubm9kZSgpLnZhbHVlO1xyXG4gICAgY291bnQgPSBOdW1iZXIoY291bnQpO1xyXG5cclxuICAgIHJldHVybiB7Y291bnQ6IGNvdW50LCB0eXBlOiB0eXBlfTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TGlzdChuYW1lKXtcclxuICAgIHZhciBsaXN0ID0gW10sIGNvdW50ID0gMCwgaWQ7XHJcblxyXG4gICAgJChgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdW25hbWU9XCIke25hbWV9XCJdOmNoZWNrZWRgKS5ub2RlQXJyKCkuZm9yRWFjaChcclxuICAgICAgZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgaWQgPSBOdW1iZXIobm9kZS52YWx1ZSk7XHJcbiAgICAgICAgaWYobmFtZSA9PSBcInNmX3RoZW1lc0xpc3RcIiAmJiAkY2QuZi50aGVtZXNbaWRdLnBvc3RzWzBdICE9ICRjZC5mLnRoZW1lc1tpZF0ucG9zdHNbMV0pe1xyXG4gICAgICAgICAgbGlzdC5wdXNoKG5vZGUudmFsdWUpO1xyXG4gICAgICAgICAgY291bnQgKz0gY2FsY3VsYXRlVGhlbWVQYWdlcyhpZCkuY291bnQ7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBsaXN0LnB1c2goaWQpO1xyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgaWYobmFtZSA9PSBcInNmX3RoZW1lc0xpc3RcIil7XHJcbiAgICAgIGNvdW50ID0gbGlzdC5sZW5ndGggKiA3NTAgKyBjb3VudCAqIDEyNTAgKyA1MDA7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY291bnQgPSAgY291bnQgKiAxMjUwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7YXJyYXk6IGxpc3QsIGNvdW50OiBsaXN0Lmxlbmd0aCwgYzogY291bnR9O1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gZm9yZ2V0Rm9ydW0oKXtcclxuICB2YXIgaWQ7XHJcblxyXG4gIGlmKGNvbmZpcm0oJ9CS0Ysg0YPQstGA0LXQvdGLINGH0YLQviDRhdC+0YLQuNGC0LUg0YPQtNCw0LvQuNGC0Ywg0LLRgdC1INC00LDQvdC90YvQtSDQvtCxINGN0YLQvtC8INGE0L7RgNGD0LzQtT8nKSl7XHJcbiAgICBkZWxldGUgJHNkLmZvcnVtc1skY2QuZmlkXTtcclxuICAgIGZvciAoaWQgaW4gJHNkLnBsYXllcnMpIHtcclxuICAgICAgaWYgKCRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF0pIHtcclxuICAgICAgICBkZWxldGUgJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChpZCBpbiAkc2Qua2lja2VkKXtcclxuICAgICAgZGVsZXRlICRzZC5raWNrZWRbJGNkLmZpZF07XHJcbiAgICB9XHJcbiAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gZGlzcGxheVByb2dyZXNzKGluaSwgdGV4dCwgY3VycmVudCwgbWF4KXtcclxuICB2YXIgcGVyY2VudCwgYywgbSwgYiwgaSwgdCwgdGUsIGltZztcclxuXHJcbiAgaW1nID0gYDxkaXYgc3R5bGU9XCJ3aWR0aDogMjVweDsgaGVpZ2h0OiAyNXB4OyBiYWNrZ3JvdW5kOiB1cmwoJHskaWNvLmxvYWRpbmd9KTtcIj48L2Rpdj5gO1xyXG5cclxuICBjID0gJChcIiNzZl9wcm9ncmVzc0N1cnJlbnRcIik7XHJcbiAgbSA9ICQoXCIjc2ZfcHJvZ3Jlc3NNYXhcIik7XHJcbiAgYiA9ICQoXCIjc2ZfcHJvZ3Jlc3NCYXJcIik7XHJcbiAgaSA9ICQoXCIjc2ZfcHJvZ3Jlc3NJY29cIik7XHJcbiAgdCA9ICQoXCIjc2ZfcHJvZ3Jlc3NUZXh0XCIpO1xyXG4gIHRlID0gJChcIiNzZl9wcm9ncmVzc1RleHRFeHRyYVwiKTtcclxuXHJcbiAgaWYoaW5pID09ICdzdGFydCcpe1xyXG4gICAgaS5odG1sKGltZyk7XHJcbiAgICB0Lmh0bWwodGV4dCk7XHJcbiAgICBtLmh0bWwobWF4KTtcclxuICAgIGMuaHRtbChjdXJyZW50KTtcclxuICAgIGIubm9kZSgpLnN0eWxlLndpZHRoID0gJzAlJztcclxuXHJcbiAgICAkY2Quc2hvd1Byb2dyZXNzVGltZSA9IHRydWU7XHJcbiAgfVxyXG4gIGlmKGluaSA9PSAnd29yaycpe1xyXG4gICAgY3VycmVudCA9IHBhcnNlSW50KGMudGV4dCgpLCAxMCkgKyAxO1xyXG4gICAgbWF4ID0gcGFyc2VJbnQobS50ZXh0KCksIDEwKTtcclxuXHJcbiAgICBwZXJjZW50ID0gJGMuZ2V0UGVyY2VudChjdXJyZW50LCBtYXgsIGZhbHNlKTtcclxuICAgIGIubm9kZSgpLnN0eWxlLndpZHRoID0gcGVyY2VudCArICclJztcclxuICAgIGMuaHRtbChjdXJyZW50KTtcclxuICB9XHJcbiAgaWYoaW5pID09ICdleHRyYScpe1xyXG4gICAgdGUuaHRtbCh0ZXh0KTtcclxuICB9XHJcbiAgaWYoaW5pID09ICdkb25lJyl7XHJcbiAgICB0ZS5odG1sKCcnKTtcclxuICAgIGIubm9kZSgpLnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgYy5odG1sKG0udGV4dCgpKTtcclxuICAgIGkuaHRtbCgnPGI+0JfQsNCy0LXRgNGI0LXQvdC+ITwvYj4nKTtcclxuXHJcbiAgICAkY2Quc2hvd1Byb2dyZXNzVGltZSA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gZGlzcGxheVByb2dyZXNzVGltZSh0KXtcclxuICB2YXIgbm9kZSwgdGltZTtcclxuXHJcbiAgaWYoISRjZC5zaG93UHJvZ3Jlc3NUaW1lKSByZXR1cm47XHJcblxyXG4gIG5vZGUgPSAkKCcjc2ZfcHJvZ3Jlc3NUaW1lJyk7XHJcbiAgdGltZSA9IHQgPyB0IDogTnVtYmVyKG5vZGUudGV4dCgpKSAtIDEwMDA7XHJcbiAgaWYodGltZSA8IDApIHRpbWUgPSAwO1xyXG4gIG5vZGUubm9kZSgpLnByZXZpb3VzRWxlbWVudFNpYmxpbmcudGV4dENvbnRlbnQgPSAkYy5nZXROb3JtYWxUaW1lKHRpbWUpO1xyXG4gIG5vZGUuaHRtbCh0aW1lKTtcclxuICBkaXNwbGF5UHJvZ3Jlc3NUaW1lLmdrRGVsYXkoMTAwMCwgdGhpcywgW10pO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmZ1bmN0aW9uIG9wZW5TdGF0dXNXaW5kb3coKXtcclxuICAkKFwiI3NmX2NvbnRyb2xQYW5lbFdpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICQoXCIjc2ZfZmlsdGVyc1dpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICQoXCIjc2ZfbWVzc2FnZVdpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICAkKFwiI3NmX3N0YXR1c1dpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gb3BlbkNvbnRyb2xQYW5lbFdpbmRvdygpe1xyXG4gICQoXCIjc2Zfc2hhZG93TGF5ZXJcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICQoXCIjc2ZfY291bnRUaHJlYWRzXCIpLmh0bWwoJGZvcnVtLnRoZW1lc1swXSArICcvJyArICRmb3J1bS50aGVtZXNbMV0pO1xyXG4gIC8vJChcIiNzZl9jb3VudE1lbWJlcnNcIikuaHRtbCgkY2QuY291bnRNZW1iZXJzKTtcclxuICAkKFwiI3NmX2NvbnRyb2xQYW5lbFdpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gb3BlbkZpbHRlcnNXaW5kb3coKXtcclxuICAkKFwiI3NmX3NoYWRvd0xheWVyXCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICQoXCIjc2ZfZmlsdGVyc1dpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gb3Blbk1lc3NhZ2VXaW5kb3coKXtcclxuICB2YXIgd2luZG93LCBuO1xyXG5cclxuICAkKFwiI3NmX3NoYWRvd0xheWVyXCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIHdpbmRvdyA9ICQoXCIjc2ZfbWVzc2FnZVdpbmRvd1wiKS5ub2RlKCk7XHJcbiAgbiA9IDA7XHJcblxyXG4gICQod2luZG93KS5maW5kKCdzZWxlY3RbbmFtZT1cIm1pZFwiXScpLmh0bWwoY3JlYXRlU2VsZWN0TGlzdCgpKTtcclxuICAkKHdpbmRvdykuZmluZCgnc2VsZWN0W25hbWU9XCJzaWRcIl0nKS5odG1sKGNyZWF0ZVNlbGVjdFNJRCgpKTtcclxuICAkKHdpbmRvdykuZmluZCgnc3Bhblt0eXBlPVwiY291bnRcIl0nKS5odG1sKG4pO1xyXG5cclxuICB3aW5kb3cuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVTZWxlY3RTSUQoKXtcclxuICAgIHZhciBjb2RlLCBsaXN0LCBzaWQ7XHJcblxyXG4gICAgY29kZSA9ICc8b3B0aW9uIHZhbHVlPVwiMFwiPtCS0YvQsdC10YDQuNGC0LUuLi48L29wdGlvbj4nO1xyXG4gICAgbGlzdCA9ICRtb2RlID8gJHNkLmZvcnVtcyA6ICR0c2QuZm9ydW1zO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKGxpc3QpLmZvckVhY2goXHJcbiAgICAgIGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICBzaWQgPSBpZC5zdWJzdHJpbmcoMSwgaWQubGVuZ3RoKTtcclxuICAgICAgICBjb2RlICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtzaWR9XCI+WyMke3NpZH1dICR7bGlzdFtpZF0ubmFtZX08L29wdGlvbj5gO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBjb2RlO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVTZWxlY3RMaXN0KCl7XHJcbiAgICB2YXIgY29kZTtcclxuXHJcbiAgICBjb2RlID0gJzxvcHRpb24+0J/QvtGB0LzQvtGC0YDQtdGC0Ywg0YHQv9C40YHQvtC6Li4uPC9vcHRpb24+JztcclxuXHJcbiAgICAkKCcjc2ZfY29udGVudF9TSScpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXVtuYW1lPVwic2ZfbWVtYmVyc0xpc3RcIl06Y2hlY2tlZCcpXHJcbiAgICAgIC5ub2RlQXJyKClcclxuICAgICAgLmZvckVhY2goXHJcbiAgICAgICAgZnVuY3Rpb24oYm94KXtcclxuICAgICAgICAgIG4rKztcclxuICAgICAgICAgIGNvZGUgKz0gYDxvcHRpb24gdmFsdWU9XCIkeyRzZC5wbGF5ZXJzW2JveC52YWx1ZV0ubmFtZX18JHtib3gudmFsdWV9XCI+JHtufS4gJHskc2QucGxheWVyc1tib3gudmFsdWVdLm5hbWV9PC9vcHRpb24+YDtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGNvZGU7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjbG9zZVdpbmRvd3MoKXtcclxuICB2YXIgc3RhdHVzID0gJChcIiNzZl9wcm9ncmVzc0ljb1wiKS50ZXh0KCk7XHJcbiAgdmFyIHdpbmRvdyA9ICQoXCIjc2Zfc3RhdHVzV2luZG93XCIpLm5vZGUoKTtcclxuXHJcbiAgaWYod2luZG93LnN0eWxlLmRpc3BsYXkgPT0gXCJibG9ja1wiICYmIHN0YXR1cyAhPSBcItCX0LDQstC10YDRiNC10L3QviFcIikgcmV0dXJuO1xyXG5cclxuICAkKFwiI3NmX3NoYWRvd0xheWVyXCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICQoXCIjc2ZfY29udHJvbFBhbmVsV2luZG93XCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgJChcIiNzZl9maWx0ZXJzV2luZG93XCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgJChcIiNzZl9tZXNzYWdlV2luZG93XCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgJChcIiNzZl9jYWxlbmRhclwiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIHdpbmRvdy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGdldE1lbWJlcnNMaXN0KCl7XHJcbiAgdmFyIHVybDtcclxuXHJcbiAgaWYoJGNkLnNpZCl7XHJcbiAgICB1cmwgPSBgaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc3luZGljYXRlLnBocD9pZD0keyRjZC5zaWR9JnBhZ2U9bWVtYmVyc2A7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgJ9Ch0LHQvtGAINC4INC+0LHRgNCw0LHQvtGC0LrQsCDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDRgdC+0YHRgtCw0LLQtSDRgdC40L3QtNC40LrQsNGC0LAnLCAwLCAxKTtcclxuXHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSh1cmwsICdHRVQnLCBudWxsLCB0cnVlLFxyXG4gICAgICAgIGZ1bmN0aW9uIChyZXEpe1xyXG4gICAgICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgcGFyc2UoKTtcclxuICAgICAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgnZGF0YScpO1xyXG4gICAgICAgICAgcmVuZGVyU3RhdHNUYWJsZSgpO1xyXG4gICAgICAgICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgIGVycm9yTG9nKFwi0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YHQvtGB0YLQsNCy0LUg0YHQuNC90LTQuNC60LDRgtCwXCIsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgIGVycm9yTG9nKFwi0YHQsdC+0YDQtSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDRgdC+0YHRgtCw0LLQtSDRgdC40L3QtNC40LrQsNGC0LBcIiwgMSwgZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlKCl7XHJcbiAgICB2YXIgbGlzdCwgaWQsIG5hbWUsIHNuLCBwZjtcclxuXHJcbiAgICBsaXN0ID0gJCgkYW5zd2VyKS5maW5kKCdiOmNvbnRhaW5zKFwi0KHQvtGB0YLQsNCyINGB0LjQvdC00LjQutCw0YLQsFwiKScpLnVwKCd0YWJsZScpLmZpbmQoJ2FbaHJlZio9XCJpbmZvLnBocFwiXScpLm5vZGVBcnIoKTtcclxuXHJcbiAgICBPYmplY3Qua2V5cygkc2QucGxheWVycykuZm9yRWFjaChmdW5jdGlvbihpZCl7XHJcbiAgICAgIHBmID0gJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXTtcclxuICAgICAgaWYocGYgIT0gbnVsbCl7XHJcbiAgICAgICAgcGYubWVtYmVyID0gZmFsc2U7XHJcbiAgICAgICAgcGYuc24gPSAwO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgIGlkID0gTnVtYmVyKG5vZGUuaHJlZi5tYXRjaCgvKFxcZCspLylbMV0pO1xyXG4gICAgICBuYW1lID0gbm9kZS50ZXh0Q29udGVudDtcclxuICAgICAgc24gPSAkKG5vZGUpLnVwKCd0cicpLm5vZGUoKS5jZWxsc1swXS50ZXh0Q29udGVudDtcclxuICAgICAgc24gPSBwYXJzZUludChzbiwgMTApO1xyXG5cclxuICAgICAgaWYoJHNkLnBsYXllcnNbaWRdID09IG51bGwpe1xyXG4gICAgICAgICRzZC5wbGF5ZXJzW2lkXSA9IGdlbmVyYXRlUGxheWVyKG5hbWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZigkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdID09IG51bGwpe1xyXG4gICAgICAgICRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF0gPSBnZW5lcmF0ZUZvcnVtUGxheWVyKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF0ubWVtYmVyID0gdHJ1ZTtcclxuICAgICAgJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXS5zbiA9IHNuO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBnZXRNYXhQYWdlU2luZGljYXRlTG9nKCl7XHJcbiAgdmFyIHVybCwgcGFnZTtcclxuXHJcbiAgdXJsID0gYGh0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L3N5bmRpY2F0ZS5sb2cucGhwP2lkPSR7JGNkLnNpZH0mcGFnZV9pZD0xMDAwMDAwMGA7XHJcblxyXG4gIHRyeXtcclxuICAgIFJFUSh1cmwsICdHRVQnLCBudWxsLCB0cnVlLFxyXG4gICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAkYW5zd2VyLmlubmVySFRNTCA9IHJlcS5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgJGNkLmxQYWdlID0gcGFyc2UoKTtcclxuICAgICAgICBwYWdlID0gJGNkLmxQYWdlIC0gJGNkLmYubG9nO1xyXG5cclxuICAgICAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgYNCe0LHRgNCw0LHQvtGC0LrQsCDQv9GA0L7RgtC+0LrQvtC70LAg0YHQuNC90LTQuNC60LDRgtCwICMkeyRjZC5maWR9IMKrJHskc2QuZm9ydW1zWyRjZC5maWRdLm5hbWV9wrtgLCAwLCBwYWdlICsgMSk7XHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzVGltZSgocGFnZSArIDEpICogMTI1MCk7XHJcbiAgICAgICAgcGFyc2VTaW5kaWNhdGVMb2cuZ2tEZWxheSg3NTAsIHRoaXMsIFtwYWdlXSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIGVycm9yTG9nKFwi0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0LzQsNC60YHQuNC80LDQu9GM0L3QvtC5INGB0YLRgNCw0L3RhtC40LUg0L/RgNC+0YLQvtC60L7Qu9CwINGB0LjQvdC00LjQutCw0YLQsFwiLCAwLCAwKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9Y2F0Y2ggKGUpe1xyXG4gICAgZXJyb3JMb2coXCLRgdCx0L7RgNC1INC40L3RhNC+0YDQvNCw0YbQuNC4INC+INC80LDQutGB0LjQvNCw0LvRjNC90L7QuSDRgdGC0YDQsNC90YbQuNC1INC/0YDQvtGC0L7QutC+0LvQsCDRgdC40L3QtNC40LrQsNGC0LBcIiwgMSwgZSk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlKCl7XHJcbiAgICB2YXIgcGFnZTtcclxuXHJcbiAgICBwYWdlID0gJCgkYW5zd2VyKS5maW5kKGBiOmNvbnRhaW5zKFwiftCf0YDQvtGC0L7QutC+0Lsg0YHQuNC90LTQuNC60LDRgtCwICMkeyRjZC5zaWR9XCIpYCkudXAoJ2RpdicpLm5leHQoJ2NlbnRlcicpLmZpbmQoJ2EnKTtcclxuICAgIHBhZ2UgPSBwYWdlLm5vZGUoLTEpLmhyZWYuc3BsaXQoJ3BhZ2VfaWQ9JylbMV07XHJcblxyXG4gICAgcmV0dXJuIE51bWJlcihwYWdlKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHBhcnNlU2luZGljYXRlTG9nKGluZGV4KXtcclxuICB2YXIgdXJsO1xyXG5cclxuICBpZihpbmRleCAhPSAtMSl7XHJcbiAgICB1cmwgPSBgaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc3luZGljYXRlLmxvZy5waHA/aWQ9JHskY2Quc2lkfSZwYWdlX2lkPSR7aW5kZXh9YDtcclxuXHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSh1cmwsICdHRVQnLCBudWxsLCB0cnVlLFxyXG4gICAgICAgIGZ1bmN0aW9uIChyZXEpe1xyXG4gICAgICAgICAgZGlzcGxheVByb2dyZXNzKCd3b3JrJyk7XHJcbiAgICAgICAgICAkYW5zd2VyLmlubmVySFRNTCA9IHJlcS5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgICAkKCRhbnN3ZXIpXHJcbiAgICAgICAgICAgIC5maW5kKCdmb250W2NvbG9yPVwiZ3JlZW5cIl0nKVxyXG4gICAgICAgICAgICAubm9kZUFycigpXHJcbiAgICAgICAgICAgIC5yZXZlcnNlKClcclxuICAgICAgICAgICAgLmZvckVhY2gocGFyc2UpO1xyXG4gICAgICAgICAgaW5kZXgtLTtcclxuXHJcbiAgICAgICAgICBpZigkY2QubFBhZ2UgIT0gJGNkLmYubG9nKSAkY2QuZi5sb2crKztcclxuXHJcbiAgICAgICAgICBjb3JyZWN0aW9uVGltZSgpO1xyXG4gICAgICAgICAgc2F2ZVRvTG9jYWxTdG9yYWdlKCdkYXRhJyk7XHJcbiAgICAgICAgICBwYXJzZVNpbmRpY2F0ZUxvZy5na0RlbGF5KDc1MCwgdGhpcywgW2luZGV4XSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgIGVycm9yTG9nKFwi0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0YEg0L/RgNC+0YLQvtC60L7Qu9CwINGB0LjQvdC00LjQutCw0YLQsFwiLCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9Y2F0Y2ggKGUpe1xyXG4gICAgICBlcnJvckxvZyhcItGB0LHQvtGA0LUg0LjQvdGE0L7RgNC80LDRhtC40Lgg0YEg0L/RgNC+0YLQvtC60L7Qu9CwINGB0LjQvdC00LjQutCw0YLQsFwiLCAxLCBlKTtcclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIHJlbmRlclN0YXRzVGFibGUoKTtcclxuICAgIGRpc3BsYXlQcm9ncmVzcygnZG9uZScpO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZShub2RlKXtcclxuICAgIHZhciBuZXh0LCBpZCwgZGF0ZSwgbmFtZTtcclxuXHJcbiAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xyXG4gICAgZGF0ZSA9IG5vZGUudGV4dENvbnRlbnQubWF0Y2goLyhcXGQpKFxcZCkuKFxcZCkoXFxkKS4oXFxkKShcXGQpIChcXGQpKFxcZCk6KFxcZCkoXFxkKS8pO1xyXG5cclxuICAgIGlmKGRhdGUpe1xyXG4gICAgICBuZXh0ID0gJChub2RlKS5uZXh0KCdub2JyJykubm9kZSgpO1xyXG5cclxuICAgICAgaWYobmV4dC50ZXh0Q29udGVudC5tYXRjaCgv0L/RgNC40L3Rj9GCINCyINGB0LjQvdC00LjQutCw0YIvKSl7XHJcbiAgICAgICAgc2V0RGF0ZSgnZW50ZXInKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYobmV4dC50ZXh0Q29udGVudC5tYXRjaCgv0LLRi9GI0LXQuyDQuNC3INGB0LjQvdC00LjQutCw0YLQsC8pKXtcclxuICAgICAgICBzZXREYXRlKCdleGl0Jyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKG5leHQudGV4dENvbnRlbnQubWF0Y2goL9C/0L7QutC40L3Rg9C7INGB0LjQvdC00LjQutCw0YIvKSl7XHJcbiAgICAgICAgc2V0RGF0ZSgnZXhpdCcpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKG5leHQudGV4dENvbnRlbnQubWF0Y2goL9C/0YDQuNCz0LvQsNGB0LjQuyDQsiDRgdC40L3QtNC40LrQsNGCLykpe1xyXG4gICAgICAgIHNldEludml0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldERhdGUoa2V5KXtcclxuICAgICAgdmFyIGV4dHJhO1xyXG5cclxuICAgICAgaWQgPSAkKG5leHQpLmZpbmQoJ2FbaHJlZio9XCJpbmZvLnBocFwiXScpO1xyXG4gICAgICBuYW1lID0gaWQudGV4dCgpO1xyXG4gICAgICBkYXRlID0gYCR7ZGF0ZVszXX0ke2RhdGVbNF19LyR7ZGF0ZVsxXX0ke2RhdGVbMl19LzIwJHtkYXRlWzVdfSR7ZGF0ZVs2XX0gJHtkYXRlWzddfSR7ZGF0ZVs4XX06JHtkYXRlWzldfSR7ZGF0ZVsxMF19YDtcclxuICAgICAgZGF0ZSA9IERhdGUucGFyc2UoZGF0ZSkgLyAxMDAwO1xyXG5cclxuICAgICAgaWYoaWQubGVuZ3RoICE9IDApe1xyXG4gICAgICAgIGlkID0gaWQubm9kZSgpLmhyZWY7XHJcbiAgICAgICAgaWQgPSBOdW1iZXIoaWQubWF0Y2goLyhcXGQrKS8pWzFdKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgbmFtZSA9IG5leHQudGV4dENvbnRlbnQubWF0Y2goLyguKykg0L/QvtC60LjQvdGD0Lsg0YHQuNC90LTQuNC60LDRgiBcXCgoLispXFwpLylbMV07XHJcbiAgICAgICAgaWQgPSAkY2QubmFtZVRvSWRbbmFtZV07XHJcbiAgICAgICAgZXh0cmEgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZihpZCAhPSBudWxsKXtcclxuICAgICAgICBpZigkc2QucGxheWVyc1tpZF0gPT0gbnVsbCkgJHNkLnBsYXllcnNbaWRdID0gZ2VuZXJhdGVQbGF5ZXIobmFtZSk7XHJcbiAgICAgICAgaWYoJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXSA9PSBudWxsKSAkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdID0gZ2VuZXJhdGVGb3J1bVBsYXllcigpO1xyXG5cclxuICAgICAgICAkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdLmdvQXdheSA9IGV4dHJhID8gMSA6IDA7XHJcbiAgICAgICAgJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXVtrZXldID0gZGF0ZTtcclxuICAgICAgfWVsc2UgaWYobmFtZSAhPSBudWxsKXtcclxuICAgICAgICBpZigkc2Qua2lja2VkWyRjZC5maWRdID09IG51bGwpICRzZC5raWNrZWRbJGNkLmZpZF0gPSB7fTtcclxuICAgICAgICAkc2Qua2lja2VkWyRjZC5maWRdW25hbWVdID0gZGF0ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBzZXRJbnZpdGUoKXtcclxuICAgICAgdmFyIG5hbWUsIGlkO1xyXG4gICAgICBuYW1lID0gbmV4dC50ZXh0Q29udGVudC5tYXRjaCgvKC4rKSDQv9GA0LjQs9C70LDRgdC40Lsg0LIg0YHQuNC90LTQuNC60LDRgiAoLispLylbMl07XHJcbiAgICAgIGlkID0gJGNkLm5hbWVUb0lkW25hbWVdO1xyXG5cclxuICAgICAgaWYoaWQgIT0gbnVsbCl7XHJcbiAgICAgICAgaWYgKCRzZC5wbGF5ZXJzW2lkXSA9PSBudWxsKSAkc2QucGxheWVyc1tpZF0gPSBnZW5lcmF0ZVBsYXllcihuYW1lKTtcclxuICAgICAgICBpZiAoJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXSA9PSBudWxsKSAkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdID0gZ2VuZXJhdGVGb3J1bVBsYXllcigpO1xyXG5cclxuICAgICAgICAkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdLmludml0ZSA9IDE7XHJcbiAgICAgIH1lbHNlIGlmKG5hbWUgIT0gbnVsbCl7XHJcbiAgICAgICAgaWYoJHNkLmludml0ZSA9PSBudWxsKSAkc2QuaW52aXRlID0ge307XHJcbiAgICAgICAgaWYoJHNkLmludml0ZVskY2QuZmlkXSA9PSBudWxsKSAkc2QuaW52aXRlWyRjZC5maWRdID0ge307XHJcbiAgICAgICAgJHNkLmludml0ZVskY2QuZmlkXVtuYW1lXSA9IDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldE1heFBhZ2VGb3J1bSgpe1xyXG4gIHZhciB1cmwsIHBhZ2U7XHJcblxyXG4gIHVybCA9IFwiaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvdGhyZWFkcy5waHA/ZmlkPVwiICsgJGZvcnVtLmlkICsgXCImcGFnZV9pZD0xMDAwMDAwMFwiO1xyXG5cclxuICAkYW5zd2VyLmlubmVySFRNTCA9IGF3YWl0IGFqYXgodXJsLCBcIkdFVFwiLCBudWxsKTtcclxuXHJcbiAgJGZvcnVtLnBhZ2VbMV0gPSBwYXJzZSgpO1xyXG4gIHBhZ2UgPSAkZm9ydW0ucGFnZVsxXSAtICRmb3J1bS5wYWdlWzBdO1xyXG5cclxuICAkaWRiLmFkZChcImZvcnVtc1wiLCByZXBhY2soJGZvcnVtLCBcImZvcnVtXCIpKTtcclxuXHJcbiAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsIGDQntCx0YDQsNCx0L7RgtC60LAg0YTQvtGA0YPQvNCwINGB0LjQvdC00LjQutCw0YLQsCAjJHskZm9ydW0uaWR9IMKrJHskZm9ydW0ubmFtZX3Cu2AsIDAsIHBhZ2UgKyAxKTtcclxuICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKHBhZ2UgKiAxMjUwICsgMTUwMCk7XHJcblxyXG4gIHBhcnNlRm9ydW0uZ2tEZWxheSg3NTAsIHRoaXMsIFtwYWdlLCB0cnVlXSk7XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlKCl7XHJcbiAgICB2YXIgcGFnZTtcclxuXHJcbiAgICBwYWdlID0gJCgkYW5zd2VyKS5maW5kKCdhW3N0eWxlPVwiY29sb3I6ICM5OTAwMDBcIl06Y29udGFpbnMoXCJ+0KTQvtGA0YPQvNGLXCIpJykudXAoJ2InKS5uZXh0KCdjZW50ZXInKS5maW5kKCdhJyk7XHJcbiAgICBwYWdlID0gcGFnZS5ub2RlKC0xKS5ocmVmLnNwbGl0KCdwYWdlX2lkPScpWzFdO1xyXG5cclxuICAgIHJldHVybiBOdW1iZXIocGFnZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gcGFyc2VGb3J1bShpbmRleCwgbW9kZSwgc3RvcERhdGUpe1xyXG4gIHZhciB1cmwsIGNvdW50O1xyXG5cclxuICB1cmwgPSBgaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvdGhyZWFkcy5waHA/ZmlkPSR7JGNkLmZpZH0mcGFnZV9pZD0ke2luZGV4fWA7XHJcbiAgY291bnQgPSAwO1xyXG5cclxuICBpZihpbmRleCAhPSAtMSkge1xyXG5cclxuICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gYXdhaXQgYWpheCh1cmwsIFwiR0VUXCIsIG51bGwpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCd3b3JrJyk7XHJcblxyXG4gICAgJCgkYW5zd2VyKVxyXG4gICAgICAuZmluZCgndGRbc3R5bGU9XCJjb2xvcjogIzk5MDAwMFwiXTpjb250YWlucyhcItCi0LXQvNCwXCIpJylcclxuICAgICAgLnVwKCd0YWJsZScpXHJcbiAgICAgIC5maW5kKCd0cltiZ2NvbG9yPVwiI2UwZWVlMFwiXSxbYmdjb2xvcj1cIiNkMGY1ZDBcIl0nKVxyXG4gICAgICAubm9kZUFycigpXHJcbiAgICAgIC5mb3JFYWNoKHBhcnNlKTtcclxuXHJcbiAgICBpbmRleCA9ICRmb3J1bS5zaWQgPyBpbmRleCAtIDEgOiBpbmRleCArIDE7XHJcbiAgICBpZigkZm9ydW0uc2lkICYmICRmb3J1bS5wYWdlWzBdICE9ICRmb3J1bS5wYWdlWzFdKSAkZm9ydW0ucGFnZVswXSsrO1xyXG5cclxuICAgIC8vY29ycmVjdGlvblRpbWUoKTtcclxuICAgIC8vY2FsY05ld1RoZW1lcygpO1xyXG4gICAgLy9zYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuXHJcblxyXG5cclxuICAgIHBhcnNlRm9ydW0uZ2tEZWxheSg3NTAsIHRoaXMsIFtpbmRleCwgbW9kZSwgc3RvcERhdGVdKTtcclxuXHJcbiAgICAvL3RyeXtcclxuICAgIC8vICBSRVEodXJsLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgIC8vICAgIGZ1bmN0aW9uKHJlcSl7XHJcbiAgICAvLyAgICAgIGRpc3BsYXlQcm9ncmVzcygnd29yaycpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgLy8gICAgICAkKCRhbnN3ZXIpXHJcbiAgICAvLyAgICAgICAgLmZpbmQoJ3RkW3N0eWxlPVwiY29sb3I6ICM5OTAwMDBcIl06Y29udGFpbnMoXCLQotC10LzQsFwiKScpXHJcbiAgICAvLyAgICAgICAgLnVwKCd0YWJsZScpXHJcbiAgICAvLyAgICAgICAgLmZpbmQoJ3RyW2JnY29sb3I9XCIjZTBlZWUwXCJdLFtiZ2NvbG9yPVwiI2QwZjVkMFwiXScpXHJcbiAgICAvLyAgICAgICAgLm5vZGVBcnIoKVxyXG4gICAgLy8gICAgICAgIC5mb3JFYWNoKHBhcnNlKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgIGluZGV4ID0gbW9kZSA/IGluZGV4IC0gMSA6IGluZGV4ICsgMTtcclxuICAgIC8vICAgICAgaWYobW9kZSAmJiAkY2QuZlBhZ2UgIT0gJGNkLmYucGFnZSkgJGNkLmYucGFnZSsrO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgY29ycmVjdGlvblRpbWUoKTtcclxuICAgIC8vICAgICAgY2FsY05ld1RoZW1lcygpO1xyXG4gICAgLy8gICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgIC8vICAgICAgcGFyc2VGb3J1bS5na0RlbGF5KDc1MCwgdGhpcywgW2luZGV4LCBtb2RlLCBzdG9wRGF0ZV0pO1xyXG4gICAgLy8gICAgfSxcclxuICAgIC8vICAgIGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgIGVycm9yTG9nKFwi0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YLQtdC80LDRhVwiLCAwLCAwKTtcclxuICAgIC8vICAgIH1cclxuICAgIC8vICApO1xyXG4gICAgLy99Y2F0Y2goZSl7XHJcbiAgICAvLyAgZXJyb3JMb2coXCLRgdCx0L7RgNC1INC40L3RhNC+0YDQvNCw0YbQuNC4INC+INGC0LXQvNCw0YVcIiwgMSwgZSk7XHJcbiAgICAvL31cclxuICB9ZWxzZXtcclxuICAgIC8vc2F2ZVRvTG9jYWxTdG9yYWdlKCdkYXRhJyk7XHJcbiAgICAvL3JlbmRlclRhYmxlcygpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcblxyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZSh0cil7XHJcbiAgICB2YXIgdGQsIHRocmVhZCwgcGxheWVyLCBzdGFydCwgZGF0ZSwgdGlkO1xyXG4gICAgdmFyIHRoZW1lO1xyXG5cclxuICAgIHRkID0gdHIuY2VsbHM7XHJcbiAgICB0aWQgPSBnZXRJZCgpO1xyXG5cclxuICAgIC8vZGF0ZSA9IGdldERhdGUoKTtcclxuXHJcbiAgICB0aGVtZSA9ICRpZGIuZ2V0T25lKGB0aGVtZXNfJHskZm9ydW0uaWR9YCwgXCJpZFwiLCB0aWQpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKHRoZW1lKTtcclxuXHJcbiAgICBpZih0aGVtZSA9PSBudWxsKXtcclxuICAgICAgJGZvcnVtLnRoZW1lc1sxXSsrO1xyXG5cclxuICAgICAgdGhlbWUgPSBnZW5lcmF0ZVRoZW1lcyh0aWQpO1xyXG4gICAgICB0aGVtZS5uYW1lID0gZ2V0TmFtZSgpO1xyXG4gICAgICB0aGVtZS5hdXRob3IgPSBnZXRBdXRob3IoKTtcclxuICAgICAgdGhlbWUucG9zdHMgPSBnZXRQb3N0cygpO1xyXG4gICAgICB0aGVtZS5wYWdlcyA9IGdldFBhZ2VzKCk7XHJcbiAgICAgIHRoZW1lLnN0YXJ0ID0gZ2V0RGF0ZSgpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIHRoZW1lID0gcmVwYWNrKHRoZW1lLCBcInRoZW1lXCIpO1xyXG4gICAgICB0aGVtZS5wb3N0cyA9IGdldFBvc3RzKCk7XHJcbiAgICAgIHRoZW1lLnBhZ2VzID0gZ2V0UGFnZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyh0aGVtZSk7XHJcblxyXG4gICAgLy9pZihtb2RlKXtcclxuICAgIC8vICBhZGRUaGVtZSgpO1xyXG4gICAgLy99ZWxzZXtcclxuICAgIC8vICBpZihzdG9wRGF0ZSAhPSBudWxsICYmIHN0b3BEYXRlIDwgZGF0ZSl7XHJcbiAgICAvLyAgICBhZGRUaGVtZSgpO1xyXG4gICAgLy8gIH1lbHNle1xyXG4gICAgLy8gICAgY291bnQrKztcclxuICAgIC8vICAgIGlmKGNvdW50ID09IDUpe1xyXG4gICAgLy8gICAgICBpbmRleCA9IC0yO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gIH1cclxuICAgIC8vfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRUaGVtZSgpe1xyXG4gICAgICBpZiAodGhyZWFkID09IG51bGwpIHtcclxuICAgICAgICAkY2QuZi50aHJlYWRzLmFsbCsrO1xyXG4gICAgICAgICRjZC5mLnRoZW1lc1skY2QudGlkXSA9IHt9O1xyXG4gICAgICAgIHRocmVhZCA9ICRjZC5mLnRoZW1lc1skY2QudGlkXTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmNoZWNrID0gMDtcclxuICAgICAgICB0aHJlYWQubmFtZSA9IGdldE5hbWUoKTtcclxuICAgICAgICB0aHJlYWQucG9zdHMgPSBnZXRQb3N0cygpO1xyXG4gICAgICAgIHRocmVhZC5kYXRlID0gZGF0ZTtcclxuICAgICAgICB0aHJlYWQuYXV0aG9yID0gZ2V0QXV0aG9yKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyZWFkLnBvc3RzID0gZ2V0UG9zdHMoKTtcclxuICAgICAgfVxyXG4gICAgICBwbGF5ZXIgPSAkc2QucGxheWVyc1t0aHJlYWQuYXV0aG9yLmlkXTtcclxuXHJcbiAgICAgIGlmIChwbGF5ZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICRzZC5wbGF5ZXJzW3RocmVhZC5hdXRob3IuaWRdID0gZ2VuZXJhdGVQbGF5ZXIodGhyZWFkLmF1dGhvci5uYW1lKTtcclxuICAgICAgICBwbGF5ZXIgPSAkc2QucGxheWVyc1t0aHJlYWQuYXV0aG9yLmlkXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBsYXllci5mb3J1bXNbJGNkLmZpZF0gPT0gbnVsbCkge1xyXG4gICAgICAgIHBsYXllci5mb3J1bXNbJGNkLmZpZF0gPSBnZW5lcmF0ZUZvcnVtUGxheWVyKCk7XHJcbiAgICAgIH1cclxuICAgICAgc3RhcnQgPSBwbGF5ZXIuZm9ydW1zWyRjZC5maWRdLnN0YXJ0O1xyXG5cclxuICAgICAgaWYgKCFzdGFydC5na0V4aXN0KCRjZC50aWQpKSB7XHJcbiAgICAgICAgc3RhcnQucHVzaCgkY2QudGlkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRJZCgpe1xyXG4gICAgICB2YXIgaWQ7XHJcblxyXG4gICAgICBpZCA9ICQodGRbMF0pLmZpbmQoJ2EnKS5ub2RlKCk7XHJcbiAgICAgIGlkID0gaWQuaHJlZi5zcGxpdCgndGlkPScpWzFdO1xyXG5cclxuICAgICAgcmV0dXJuIE51bWJlcihpZCk7XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldE5hbWUoKXtcclxuICAgICAgcmV0dXJuICQodGRbMF0pLmZpbmQoJ2EnKS50ZXh0KCk7XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFBvc3RzKCl7XHJcbiAgICAgIHZhciBwb3N0cztcclxuXHJcbiAgICAgIHBvc3RzID0gJCh0ZFsyXSkudGV4dCgpLnJlcGxhY2UoLywvZywgJycpO1xyXG4gICAgICBwb3N0cyA9IE51bWJlcihwb3N0cyk7XHJcblxyXG4gICAgICBpZih0aGVtZSA9PSBudWxsKXtcclxuICAgICAgICByZXR1cm4gWzAsIHBvc3RzXTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIFt0aGVtZS5wb3N0c1swXSwgcG9zdHNdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFBhZ2VzKCl7XHJcbiAgICAgIHZhciBwYWdlO1xyXG5cclxuICAgICAgcGFnZSA9IFtcclxuICAgICAgICBwYXJzZUludCh0aGVtZS5wb3N0c1swXSAvIDIwLCAxMCksXHJcbiAgICAgICAgcGFyc2VJbnQodGhlbWUucG9zdHNbMV0gLyAyMCwgMTApXHJcbiAgICAgIF07XHJcblxyXG4gICAgICByZXR1cm4gcGFnZTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0RGF0ZSgpe1xyXG4gICAgICB2YXIgZGF0ZTtcclxuXHJcbiAgICAgIGRhdGUgPSB0ci5wcmV2aW91c1NpYmxpbmcuZGF0YTtcclxuICAgICAgZGF0ZSA9IGRhdGUubWF0Y2goLyhcXGQrKS9nKTtcclxuICAgICAgZGF0ZSA9IGAke2RhdGVbMV19LyR7ZGF0ZVsyXX0vJHtkYXRlWzBdfSAke2RhdGVbM119OiR7ZGF0ZVs0XX06JHtkYXRlWzVdfX1gO1xyXG4gICAgICBkYXRlID0gRGF0ZS5wYXJzZShkYXRlKTtcclxuXHJcbiAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRBdXRob3IoKXtcclxuICAgICAgdmFyIGEsIG5hbWUsIGlkO1xyXG5cclxuICAgICAgYSA9ICQodGRbM10pLmZpbmQoJ2FbaHJlZio9XCJpbmZvLnBocFwiXScpO1xyXG4gICAgICBuYW1lID0gYS50ZXh0KCk7XHJcbiAgICAgIGlkID0gYS5ub2RlKCkuaHJlZi5tYXRjaCgvKFxcZCspLylbMF07XHJcblxyXG4gICAgICByZXR1cm4gW051bWJlcihpZCksIG5hbWVdO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBjYWxjTmV3VGhlbWVzKCl7XHJcbiAgICB2YXIgdGhlbWVzO1xyXG5cclxuICAgIHRoZW1lcyA9ICRjZC5mLnRoZW1lcztcclxuICAgICRjZC5mLnRocmVhZHMubmV3ID0gJGNkLmYudGhyZWFkcy5hbGw7XHJcblxyXG4gICAgT2JqZWN0LmtleXModGhlbWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHRpZCl7XHJcbiAgICAgIGlmKHRoZW1lc1t0aWRdLnBvc3RzWzBdID09IHRoZW1lc1t0aWRdLnBvc3RzWzFdKXtcclxuICAgICAgICAkY2QuZi50aHJlYWRzLm5ldy0tO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHByZXBhcmVQYXJzZVRoZW1lcyhtYXgpe1xyXG4gIHZhciB0aGVtZXMsIHRpZCwgbGlzdCwgY291bnQ7XHJcblxyXG4gIHRoZW1lcyA9ICRjZC5mLnRoZW1lcztcclxuICBsaXN0ID0gW107XHJcbiAgY291bnQgPSAwO1xyXG5cclxuICBmb3IodGlkIGluIHRoZW1lcyl7XHJcbiAgICBpZih0aGVtZXNbdGlkXS5wb3N0c1swXSAhPSB0aGVtZXNbdGlkXS5wb3N0c1sxXSl7XHJcbiAgICAgIGxpc3QucHVzaCh0aWQpO1xyXG4gICAgICBjb3VudCArPSBjYWxjdWxhdGVUaGVtZVBhZ2VzKE51bWJlcih0aWQpKS5jb3VudDtcclxuICAgICAgaWYobGlzdC5sZW5ndGggPT0gbWF4KSBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgY291bnQgPSBsaXN0Lmxlbmd0aCAqIDc1MCArIGNvdW50ICogMTI1MCArIDUwMDtcclxuICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKGNvdW50KTtcclxuICBwYXJzZVRoZW1lcygwLCBsaXN0Lmxlbmd0aCwgbGlzdCk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVRoZW1lUGFnZXMoaWQpe1xyXG4gIHZhciB0aGVtZSwgcGFnZXMsIHNQYWdlLCBzdGFydDtcclxuXHJcbiAgdGhlbWUgPSAkY2QuZi50aGVtZXNbaWRdO1xyXG5cclxuICBwYWdlcyA9IHRoZW1lLnBvc3RzWzFdIC8gMjA7XHJcbiAgcGFnZXMgPSBwYWdlcyA8IDEgPyAwIDogcGFyc2VJbnQocGFnZXMsIDEwKTtcclxuXHJcbiAgc1BhZ2UgPSB0aGVtZS5wb3N0c1swXSAvIDIwO1xyXG4gIHNQYWdlID0gc1BhZ2UgPCAxID8gMCA6IHBhcnNlSW50KHNQYWdlLCAxMCk7XHJcblxyXG4gIHN0YXJ0ID0gKHRoZW1lLnBvc3RzWzBdICUgMjApICsgMTtcclxuXHJcbiAgcmV0dXJuIHtpZDogc1BhZ2UgLCBjb3VudDogcGFnZXMgKyAxLCBzdGFydDogc3RhcnR9O1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwYXJzZVRoZW1lcyhpbmRleCwgbWF4LCBsaXN0KXtcclxuICB2YXIgaW5mbywgdGhlbWU7XHJcblxyXG4gICRjZC50aWQgPSBOdW1iZXIobGlzdFtpbmRleF0pO1xyXG4gIHRoZW1lID0gJGNkLmYudGhlbWVzWyRjZC50aWRdO1xyXG5cclxuICBpZihpbmRleCA8IG1heCl7XHJcbiAgICBpbmZvID0gY2FsY3VsYXRlVGhlbWVQYWdlcygkY2QudGlkKTtcclxuICAgIHBhcnNlVGhlbWUoaW5mby5pZCwgaW5mby5jb3VudCwgaW5mby5zdGFydCk7XHJcbiAgfWVsc2V7XHJcbiAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgIHJlbmRlclRhYmxlcygpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VUaGVtZShpZCwgY291bnQsIHN0YXJ0KXtcclxuICAgIHZhciB1cmw7XHJcblxyXG4gICAgJGNkLnRQYWdlID0gaWQ7XHJcbiAgICB1cmwgPSAnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvbWVzc2FnZXMucGhwP2ZpZD0nICsgJGNkLmZpZCArICcmdGlkPScrICRjZC50aWQgKycmcGFnZV9pZD0nICsgJGNkLnRQYWdlO1xyXG5cclxuICAgIGlmKGlkIDwgY291bnQpe1xyXG4gICAgICB0cnl7XHJcbiAgICAgICAgUkVRKHVybCwgJ0dFVCcsIG51bGwsIHRydWUsXHJcbiAgICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICBwYXJzZSgpO1xyXG4gICAgICAgICAgICBjb3JyZWN0aW9uVGltZSgpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgICBlcnJvckxvZygn0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YHQvtC+0LHRidC10L3QuNGP0YUnLCAwLCAwKTtcclxuICAgICAgICAgICAgbmV4dFBhZ2VUaGVtZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgICAgZXJyb3JMb2coJ9GB0LHQvtGA0LUg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YHQvtC+0LHRidC10L3QuNGP0YUnLCAxLCBlKTtcclxuICAgICAgICBuZXh0UGFnZVRoZW1lKCk7XHJcbiAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICBuZXh0VGhlbWUoKTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlKCl7XHJcbiAgICAgIHZhciB0YWJsZSwgdHIsIHBpZCwgcGxheWVyLCBwZiwgdztcclxuICAgICAgdmFyIGksIGxlbmd0aDtcclxuXHJcbiAgICAgIHRhYmxlID0gJCgkYW5zd2VyKS5maW5kKCd0ZFtzdHlsZT1cImNvbG9yOiAjOTkwMDAwXCJdOmNvbnRhaW5zKFwi0JDQstGC0L7RgFwiKScpLnVwKCd0YWJsZScpLm5vZGUoKTtcclxuXHJcbiAgICAgICQodGFibGUpLmZpbmQoJ2ZvbnQ6Y29udGFpbnMoXCJ+0KLQtdC80LAg0LfQsNC60YDRi9GC0LBcIiknKS5ub2RlQXJyKCkuZm9yRWFjaChcclxuICAgICAgICBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICAgIG5vZGUgPSAkKG5vZGUpLnVwKCd0cicpLm5vZGUoKTtcclxuICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICAgIHRyID0gdGFibGUucm93cztcclxuICAgICAgbGVuZ3RoID0gdHIubGVuZ3RoO1xyXG5cclxuICAgICAgZm9yKGkgPSBzdGFydDsgaSA8IGxlbmd0aDsgaSsrKXtcclxuICAgICAgICBwaWQgPSBnZXRJZCgpO1xyXG5cclxuICAgICAgICBpZigkc2QucGxheWVyc1twaWRdID09IG51bGwpe1xyXG4gICAgICAgICAgJHNkLnBsYXllcnNbcGlkXSA9IGdlbmVyYXRlUGxheWVyKGdldE5hbWUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBsYXllciA9ICRzZC5wbGF5ZXJzW3BpZF07XHJcblxyXG4gICAgICAgIGlmKHBsYXllci5mb3J1bXNbJGNkLmZpZF0gPT0gbnVsbCl7XHJcbiAgICAgICAgICBwbGF5ZXIuZm9ydW1zWyRjZC5maWRdID0gZ2VuZXJhdGVGb3J1bVBsYXllcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwZiA9IHBsYXllci5mb3J1bXNbJGNkLmZpZF07XHJcblxyXG4gICAgICAgIHRoZW1lLnBvc3RzWzBdKys7XHJcbiAgICAgICAgJGNkLmYucG9zdHMrKztcclxuXHJcbiAgICAgICAgcGYucG9zdHMrKztcclxuICAgICAgICBwZi5sYXN0ID0gZ2V0TGFzdERhdGUoKTtcclxuXHJcbiAgICAgICAgdyA9IGdldFdvcmRzKCk7XHJcbiAgICAgICAgJGNkLmYud29yZHMgKz0gdztcclxuICAgICAgICBwZi53b3Jkc1swXSArPSB3O1xyXG4gICAgICAgIHBmLndvcmRzWzFdID0gcGFyc2VJbnQocGYud29yZHNbMF0gLyBwZi5wb3N0cywgMTApO1xyXG5cclxuICAgICAgICBpZighcGYudGhlbWVzLmdrRXhpc3QoJGNkLnRpZCkpe1xyXG4gICAgICAgICAgcGYudGhlbWVzLnB1c2goJGNkLnRpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBuZXh0UGFnZVRoZW1lKCk7XHJcbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRJZCgpe1xyXG4gICAgICAgIHZhciBpZDtcclxuXHJcbiAgICAgICAgaWQgPSAkKHRyW2ldLmNlbGxzWzBdKS5maW5kKCdhW2hyZWYqPVwiaW5mby5waHBcIl0nKS5ub2RlKCk7XHJcbiAgICAgICAgaWQgPSBpZC5ocmVmLm1hdGNoKC8oXFxkKykvKVsxXTtcclxuICAgICAgICBpZCA9IE51bWJlcihpZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgICAgfVxyXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0TmFtZSgpe1xyXG4gICAgICAgIHJldHVybiAkKHRyW2ldLmNlbGxzWzBdKS5maW5kKCdhW2hyZWYqPVwiaW5mby5waHBcIl0nKS50ZXh0KCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldExhc3REYXRlKCl7XHJcbiAgICAgICAgdmFyIGRhdGU7XHJcblxyXG4gICAgICAgIGRhdGUgPSAkKHRyW2ldLmNlbGxzWzFdKS5maW5kKCd0ZFthbGlnbj1cImxlZnRcIl06Y29udGFpbnMoXCJ+0L3QsNC/0LjRgdCw0L3QvlwiKScpLnRleHQoKTtcclxuXHJcbiAgICAgICAgZGF0ZSA9IGRhdGUubWF0Y2goLyguKyk6IChcXGQrKS0oXFxkKyktKFxcZCspICguKynCoC8pO1xyXG4gICAgICAgIGRhdGUgPSBgJHtkYXRlWzNdfS8ke2RhdGVbNF19LyR7ZGF0ZVsyXX0gJHtkYXRlWzVdfWA7XHJcbiAgICAgICAgZGF0ZSA9IERhdGUucGFyc2UoZGF0ZSkgLyAxMDAwO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0ZSA+IHBmLmxhc3QgPyBkYXRlIDogcGYubGFzdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0V29yZHMoKXtcclxuICAgICAgICB2YXIgd29yZHM7XHJcblxyXG4gICAgICAgIHdvcmRzID0gJCh0cltpXS5jZWxsc1sxXSkuZmluZCgndGFibGVbY2VsbHBhZGRpbmc9XCI1XCJdJykudGV4dCgpO1xyXG4gICAgICAgIHdvcmRzID0gKHdvcmRzLnJlcGxhY2UoL1xcc1snXCI7OiwuP8K/XFwtIcKhXS9nLCAnJykubWF0Y2goL1xccysvZykgfHwgW10pLmxlbmd0aCArIDE7XHJcblxyXG4gICAgICAgIHJldHVybiB3b3JkcztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBuZXh0VGhlbWUoKXtcclxuICAgICAgaW5kZXgrKztcclxuICAgICAgJGNkLmYudGhyZWFkcy5uZXctLTtcclxuICAgICAgZGlzcGxheVByb2dyZXNzKCd3b3JrJyk7XHJcbiAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgnZGF0YScpO1xyXG4gICAgICBwYXJzZVRoZW1lcy5na0RlbGF5KDc1MCwgdGhpcywgW2luZGV4LCBtYXgsIGxpc3RdKTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gbmV4dFBhZ2VUaGVtZSgpe1xyXG4gICAgICBpZCsrO1xyXG4gICAgICBkaXNwbGF5UHJvZ3Jlc3MuZ2tEZWxheSg3NTAsIHRoaXMsIFsnZXh0cmEnLCBgPGJyPjxiPtCi0LXQvNCwOjwvYj4gPGk+JHskY2QuZi50aGVtZXNbJGNkLnRpZF0ubmFtZX08L2k+IFske2lkfS8ke2NvdW50fV1gXSk7XHJcbiAgICAgIHBhcnNlVGhlbWUuZ2tEZWxheSg3NTAsIHRoaXMsIFtpZCwgY291bnQsIDFdKTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwcmVwYXJlUGFyc2VNZW1iZXJzKGNvdW50KXtcclxuICB2YXIgbGVuZ3RoLCBwbGF5ZXIsIGxpc3Q7XHJcblxyXG4gIGxlbmd0aCA9IGNvdW50ICE9IG51bGwgPyBjb3VudCA6ICRjZC5jb3VudE1lbWJlcnM7XHJcbiAgbGlzdCA9IFtdO1xyXG5cclxuICB3aGlsZShsZW5ndGgtLSl7XHJcbiAgICBwbGF5ZXIgPSAkc2QucGxheWVyc1skY2QubWVtYmVyc1tsZW5ndGhdXTtcclxuICAgIGlmKGNvdW50ID09IG51bGwpe1xyXG4gICAgICBsaXN0LnB1c2goJGNkLm1lbWJlcnNbbGVuZ3RoXSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgaWYocGxheWVyLnN0YXR1cy50ZXh0ID09ICcnKXtcclxuICAgICAgICBsaXN0LnB1c2goJGNkLm1lbWJlcnNbbGVuZ3RoXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgY291bnQgPSBsaXN0Lmxlbmd0aCAqIDc1MCArIDUwMDtcclxuICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKGNvdW50KTtcclxuXHJcbiAgcGFyc2VNZW1iZXJzKDAsIGxpc3QubGVuZ3RoLCBsaXN0KTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gcGFyc2VNZW1iZXJzKGlkLCBjb3VudCwgbGlzdCl7XHJcbiAgdmFyIHVybCwgcGxheWVyO1xyXG5cclxuICBpZihpZCA8IGNvdW50KXtcclxuICAgIHBsYXllciA9ICRzZC5wbGF5ZXJzW2xpc3RbaWRdXTtcclxuICAgIHVybCA9IGBodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9pbmZvLnBocD9pZD0ke2xpc3RbaWRdfWA7XHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSh1cmwsICdHRVQnLCBudWxsLCB0cnVlLFxyXG4gICAgICAgIGZ1bmN0aW9uIChyZXEpe1xyXG4gICAgICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgcGFyc2UoKTtcclxuICAgICAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgnZGF0YScpO1xyXG4gICAgICAgICAgY29ycmVjdGlvblRpbWUoKTtcclxuICAgICAgICAgIG5leHRNZW1iZXIoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgZXJyb3JMb2coJ9Ch0LHQvtGAINGB0YLQsNGC0YPRgdCwINC/0LXRgNGB0L7QvdCw0LbQsCcsIDAsIDApO1xyXG4gICAgICAgICAgbmV4dE1lbWJlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgIGVycm9yTG9nKCfRgdCx0L7RgNC1INGB0YLQsNGC0YPRgdCwINC/0LXRgNGB0L7QvdCw0LbQsCcsIDEsIGUpO1xyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgcmVuZGVyU3RhdHNUYWJsZSgpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIG5leHRNZW1iZXIoKXtcclxuICAgIGlkKys7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MuZ2tEZWxheSg3NTAsIHRoaXMsIFsnd29yayddKTtcclxuICAgIHBhcnNlTWVtYmVycy5na0RlbGF5KDc1MCwgdGhpcywgW2lkLCBjb3VudCwgbGlzdF0pO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZSgpe1xyXG4gICAgdmFyIGJsb2NrLCBhcnJlc3QsIGJhbkRlZmF1bHQsIGJhbkNvbW1vbiwgYmFuVHJhZGUsIHN0YXR1cywgZGF0ZTtcclxuXHJcbiAgICBzdGF0dXMgPSAnT2snO1xyXG4gICAgZGF0ZSA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCwgMTApO1xyXG5cclxuICAgIGJsb2NrID0gJCgkYW5zd2VyKS5maW5kKCdmb250W2NvbG9yPVwicmVkXCJdOmNvbnRhaW5zKFwi0J/QtdGA0YHQvtC90LDQtiDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cIiknKTtcclxuICAgIGFycmVzdCA9ICQoJGFuc3dlcikuZmluZCgnY2VudGVyOmNvbnRhaW5zKFwi0J/QtdGA0YHQvtC90LDQtiDQsNGA0LXRgdGC0L7QstCw0L0sINC40L3RhNC+0YDQvNCw0YbQuNGPINGB0LrRgNGL0YLQsFwiKScpLmZpbmQoJ2ZvbnRbY29sb3I9XCIjMDAwMDk5XCJdJyk7XHJcbiAgICBiYW5EZWZhdWx0ID0gJCgkYW5zd2VyKS5maW5kKCdmb250W2NvbG9yPVwicmVkXCJdOmNvbnRhaW5zKFwiftCy0YDQtdC80LXQvdC90L4g0LfQsNCx0LDQvdC10L0g0LIg0YTQvtGA0YPQvNC1INC80L7QtNC10YDQsNGC0L7RgNC+0LxcIiknKTtcclxuICAgIGJhbkNvbW1vbiA9ICQoJGFuc3dlcikuZmluZCgnY2VudGVyOmNvbnRhaW5zKFwiftCf0LXRgNGB0L7QvdCw0LYg0L/QvtC0INC+0LHRidC40Lwg0LHQsNC90L7QvFwiKScpLmZpbmQoJ2ZvbnRbY29sb3I9XCIjMDA5OTAwXCJdJyk7XHJcbiAgICBiYW5UcmFkZSA9ICQoJGFuc3dlcikuZmluZCgnZm9udFtjb2xvcj1cInJlZFwiXTpjb250YWlucyhcIn7Qt9Cw0LHQsNC90LXQvSDQsiDRgtC+0YDQs9C+0LLRi9GFINGE0L7RgNGD0LzQsNGFXCIpJyk7XHJcblxyXG4gICAgaWYoYmFuVHJhZGUubGVuZ3RoKXtcclxuICAgICAgZGF0ZSA9IGdldERhdGUoYmFuVHJhZGUudGV4dCgpKTtcclxuICAgICAgc3RhdHVzID0gJ9Ci0L7RgNCz0L7QstGL0LknO1xyXG4gICAgfVxyXG4gICAgaWYoYXJyZXN0Lmxlbmd0aCl7XHJcbiAgICAgIGRhdGUgPSAwO1xyXG4gICAgICBzdGF0dXMgPSAn0JDRgNC10YHRgtC+0LLQsNC9JztcclxuICAgIH1cclxuICAgIGlmKGJhbkRlZmF1bHQubGVuZ3RoKXtcclxuICAgICAgZGF0ZSA9IGdldERhdGUoYmFuRGVmYXVsdC50ZXh0KCkpO1xyXG4gICAgICBzdGF0dXMgPSAn0KTQvtGA0YPQvNC90YvQuSc7XHJcbiAgICB9XHJcbiAgICBpZihiYW5Db21tb24ubGVuZ3RoKXtcclxuICAgICAgZGF0ZSA9IGdldERhdGUoYmFuQ29tbW9uLnRleHQoKSk7XHJcbiAgICAgIHN0YXR1cyA9ICfQntCx0YnQuNC5INCx0LDQvSc7XHJcbiAgICB9XHJcbiAgICBpZihibG9jay5sZW5ndGgpe1xyXG4gICAgICBkYXRlID0gMDtcclxuICAgICAgc3RhdHVzID0gJ9CX0LDQsdC70L7QutC40YDQvtCy0LDQvSc7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheWVyLnN0YXR1cy50ZXh0ID0gc3RhdHVzO1xyXG4gICAgcGxheWVyLnN0YXR1cy5kYXRlID0gZGF0ZTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0RGF0ZShzdHJpbmcpe1xyXG4gICAgdmFyIGRhdGU7XHJcblxyXG4gICAgZGF0ZSA9IHN0cmluZy5tYXRjaCgvKFxcZCspL2cpO1xyXG4gICAgZGF0ZSA9IGAke2RhdGVbM119LyR7ZGF0ZVsyXX0vMjAke2RhdGVbNF19ICR7ZGF0ZVswXX06JHtkYXRlWzFdfWA7XHJcbiAgICBkYXRlID0gRGF0ZS5wYXJzZShkYXRlKSAvIDEwMDA7XHJcblxyXG4gICAgcmV0dXJuIGRhdGU7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwcmVwYXJlU2VuZE1haWxzKCl7XHJcbiAgdmFyIHBhcmFtLCB3aW5kb3csIGNvdW50LCBtb2RlLCB0bSwgc2lkO1xyXG4gIHZhciBxdWV1ZSwgZiwgaW52aXRlcyA9IHt9O1xyXG5cclxuICBwYXJhbSA9IHtcclxuICAgIGxpc3Q6IFtdLFxyXG4gICAgYXdheUxpc3Q6IHt9LFxyXG4gICAgbG9wYXRhOiAnJyxcclxuICAgIG91dDogMCxcclxuICAgIHN1YmplY3Q6ICcnLFxyXG4gICAgbWVzc2FnZTogJycsXHJcbiAgICBzaWQ6IDAsXHJcbiAgICBtb2RlOiAnJ1xyXG4gIH07XHJcblxyXG4gIHRtID0ge1xyXG4gICAgbWFpbDogXCLQntGC0L/RgNCw0LLQutCwINC/0L7Rh9GC0YtcIixcclxuICAgIGludml0ZTogXCLQntGC0L/RgNCw0LLQutCwINC/0L7Rh9GC0Ysg0Lgg0L/RgNC40LPQu9Cw0YjQtdC90LjQuVwiLFxyXG4gICAgZ29Bd2F5OiBcItCe0YLQv9GA0LDQstC60LAg0L/QvtGH0YLRiyDQuCDQuNC30LPQvdCw0L3QuNC1XCJcclxuICB9O1xyXG5cclxuICBxdWV1ZSA9IFtcImdldExvcGF0YVwiLCBcInN0b3BcIl07XHJcbiAgZiA9IHtcclxuICAgIGdldEludml0ZXNJZDogZnVuY3Rpb24oKXtnZXRJbnZpdGVzSWQoKX0sXHJcbiAgICBnZXRHb0F3YXlJZDogZnVuY3Rpb24oKXtnZXRHb0F3YXlJZCgpfSxcclxuICAgIGdldExvcGF0YTogZnVuY3Rpb24oKXtnZXRMb3BhdGEoKX0sXHJcbiAgICBzdG9wOiBmdW5jdGlvbigpe3N0b3AoKX1cclxuICB9O1xyXG5cclxuXHJcbiAgd2luZG93ID0gJChcIiNzZl9tZXNzYWdlV2luZG93XCIpLm5vZGUoKTtcclxuICBwYXJhbS5zdWJqZWN0ID0gZW5jb2RlVVJJQ29tcG9uZW50KCQod2luZG93KS5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXVtuYW1lPVwic3ViamVjdFwiXScpLm5vZGUoKS52YWx1ZSk7XHJcbiAgcGFyYW0ubWVzc2FnZSA9IGVuY29kZVVSSUNvbXBvbmVudCgkKHdpbmRvdykuZmluZCgndGV4dGFyZWFbbmFtZT1cIm1lc3NhZ2VcIl0nKS5ub2RlKCkudmFsdWUpO1xyXG4gIHBhcmFtLm1vZGUgPSAkKHdpbmRvdykuZmluZCgnc2VsZWN0W25hbWU9XCJ3b3JrTW9kZVwiXScpLmZpbmQoJ29wdGlvbjpjaGVja2VkJykubm9kZSgpLnZhbHVlO1xyXG4gIHNpZCA9ICQod2luZG93KS5maW5kKCdzZWxlY3RbbmFtZT1cInNpZFwiXScpLmZpbmQoJ29wdGlvbjpjaGVja2VkJykubm9kZSgpO1xyXG4gIHBhcmFtLnNpZCA9IE51bWJlcihzaWQudmFsdWUpOyBzaWQgPSBzaWQudGV4dENvbnRlbnQ7XHJcblxyXG4gIGlmKHBhcmFtLm1vZGUgIT0gXCJtYWlsXCIpe1xyXG4gICAgaWYocGFyYW0uc2lkID09IDApe1xyXG4gICAgICBhbGVydChcItCd0LUg0LLRi9Cx0YDQsNC9INGB0LjQvdC00LjQutCw0YIhXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZihwYXJhbS5tb2RlID09IFwiaW52aXRlXCIpIHF1ZXVlLnVuc2hpZnQoXCJnZXRJbnZpdGVzSWRcIik7XHJcbiAgICBpZihwYXJhbS5tb2RlID09IFwiZ29Bd2F5XCIpIHF1ZXVlLnVuc2hpZnQoXCJnZXRHb0F3YXlJZFwiKTtcclxuICB9XHJcblxyXG4gIGlmKHBhcmFtLm1vZGUgPT0gXCJtYWlsXCIpe1xyXG4gICAgaWYoIWNvbmZpcm0oYNCg0LXQttC40Lw6ICR7dG1bcGFyYW0ubW9kZV19XFxuXFxuINCS0YHQtSDQv9GA0LDQstC40LvRjNC90L4/YCkpIHJldHVybjtcclxuICB9ZWxzZXtcclxuICAgIGlmKCFjb25maXJtKGDQoNC10LbQuNC8OiDCoMKgwqDCoMKgwqAke3RtW3BhcmFtLm1vZGVdfVxcbtCh0LjQvdC00LjQutCw0YI6wqDCoCR7c2lkfVxcblxcbiDQktGB0LUg0L/RgNCw0LLQuNC70YzQvdC+P2ApKSByZXR1cm47XHJcbiAgfVxyXG5cclxuICBuZXh0KDApO1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHN0b3AoKXtcclxuICAgICQod2luZG93KS5maW5kKCdzZWxlY3QnKVxyXG4gICAgICAuZmluZCgnb3B0aW9uW3ZhbHVlXScpXHJcbiAgICAgIC5ub2RlQXJyKClcclxuICAgICAgLmZvckVhY2goZ2V0TGlzdCk7XHJcblxyXG4gICAgY291bnQgPSBwYXJhbS5saXN0Lmxlbmd0aDtcclxuXHJcbiAgICBvcGVuU3RhdHVzV2luZG93KCk7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgJ9Cg0LDRgdGB0YvQu9C60LAg0YHQvtC+0LHRidC10L3QuNC5INCy0YvQsdGA0LDQvdC90YvQvCDQuNCz0YDQvtC60LDQvCcsIDAsIGNvdW50KTtcclxuICAgIGRpc3BsYXlQcm9ncmVzc1RpbWUoKGNvdW50ICogMzk1MDApICsgNTAwKTtcclxuICAgIGRvQWN0aW9ucygwLCBjb3VudCwgcGFyYW0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TGlzdChvcHRpb24pe1xyXG4gICAgdmFyIG5hbWUsIGlkO1xyXG5cclxuICAgIGlkID0gb3B0aW9uLnZhbHVlLnNwbGl0KFwifFwiKTtcclxuICAgIG5hbWUgPSBpZFswXTtcclxuICAgIGlkID0gaWRbMV07XHJcblxyXG4gICAgaWYoaW52aXRlc1tuYW1lXSA9PSBudWxsKXtcclxuICAgICAgcGFyYW0ubGlzdC5wdXNoKHtcclxuICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICBlbmNvZGU6IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TG9wYXRhKCl7XHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSgnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc21zLWNyZWF0ZS5waHAnLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgIHBhcmFtLm91dCA9IE51bWJlcigkKCRhbnN3ZXIpLmZpbmQoJ2lucHV0W3R5cGU9XCJoaWRkZW5cIl1bbmFtZT1cIm91dG1haWxcIl0nKS5ub2RlKCkudmFsdWUpO1xyXG4gICAgICAgICAgcGFyYW0ubG9wYXRhID0gJCgkYW5zd2VyKS5maW5kKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdW25hbWU9XCJsb3BhdGFcIl0nKS5ub2RlKCkudmFsdWU7XHJcblxyXG4gICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICBlcnJvckxvZygn0J/QvtC70YPRh9C10L3QuNC4INC70L7Qv9Cw0YLRiycsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaChlKXtcclxuICAgICAgZXJyb3JMb2coJ9C/0L7Qu9GD0YfQtdC90LjQuCDQu9C+0L/QsNGC0YsnLCAxLCBlKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0R29Bd2F5SWQgKCl7XHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSgnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc3luZGljYXRlLmVkaXQucGhwP2tleT11c2VycyZpZD0nICsgcGFyYW0uc2lkLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgIHBhcmFtLmF3YXlMaXN0ID0ge307XHJcblxyXG4gICAgICAgICAgJCgkYW5zd2VyKVxyXG4gICAgICAgICAgICAuZmluZCgnc2VsZWN0W25hbWU9XCJjaWRcIl0nKVxyXG4gICAgICAgICAgICAuZmluZChcIm9wdGlvblwiKVxyXG4gICAgICAgICAgICAubm9kZUFycigpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKHBhcnNlKTtcclxuXHJcbiAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgIGVycm9yTG9nKGDQn9C+0LvRg9GH0LXQvdC40Lgg0YHQv9C40YHQutCwIGlkINC90LAg0LjQt9Cz0L3QsNC90LjQtSDQv9C10YDRgdC+0L3QsNC20LXQuWAsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgIGVycm9yTG9nKGDQv9C+0LvRg9GH0LXQvdC40Lgg0YHQv9C40YHQutCwIGlkINC90LAg0LjQt9Cz0L3QsNC90LjQtSDQv9C10YDRgdC+0L3QsNC20LXQuWAsIDEsIGUpO1xyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZShvcHRpb24pe1xyXG4gICAgICB2YXIgaWQsIG5hbWU7XHJcblxyXG4gICAgICBpZCA9IE51bWJlcihvcHRpb24udmFsdWUpO1xyXG4gICAgICBuYW1lID0gb3B0aW9uLnRleHRDb250ZW50O1xyXG4gICAgICBuYW1lID0gbmFtZS5tYXRjaCgvKFxcZCspXFwuICguKykgXFwvIFxcJChcXGQrKS8pO1xyXG4gICAgICBuYW1lID0gbmFtZVsyXTtcclxuXHJcbiAgICAgIHBhcmFtLmF3YXlMaXN0W25hbWVdID0gaWQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIGdldEludml0ZXNJZCgpe1xyXG4gICAgdHJ5e1xyXG4gICAgICBSRVEoJ2h0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L3N5bmRpY2F0ZS5lZGl0LnBocD9rZXk9aW52aXRlcyZpZD0nICsgcGFyYW0uc2lkLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgIHBhcmFtLmF3YXlMaXN0ID0ge307XHJcblxyXG4gICAgICAgICAgJCgkYW5zd2VyKVxyXG4gICAgICAgICAgICAuZmluZCgnYjpjb250YWlucyhcItCf0YDQuNCz0LvQsNGI0LXQvdC90YvQtSDQv9C10YDRgdC+0L3RizpcIiknKVxyXG4gICAgICAgICAgICAudXAoJ3RkJylcclxuICAgICAgICAgICAgLmZpbmQoJ2FbaHJlZio9XCJpbmZvLnBocFwiXScpXHJcbiAgICAgICAgICAgIC5ub2RlQXJyKClcclxuICAgICAgICAgICAgLmZvckVhY2gocGFyc2UpO1xyXG5cclxuICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgZXJyb3JMb2coYNCf0L7Qu9GD0YfQtdC90LjQuCDRgdC/0LjRgdC60LAgaWQg0L3QsCDQuNC30LPQvdCw0L3QuNC1INC/0LXRgNGB0L7QvdCw0LbQtdC5YCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfWNhdGNoIChlKXtcclxuICAgICAgZXJyb3JMb2coYNC/0L7Qu9GD0YfQtdC90LjQuCDRgdC/0LjRgdC60LAgaWQg0L3QsCDQuNC30LPQvdCw0L3QuNC1INC/0LXRgNGB0L7QvdCw0LbQtdC5YCwgMSwgZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2Uobm9kZSl7XHJcbiAgICAgIGludml0ZXNbbm9kZS50ZXh0Q29udGVudF0gPSBub2RlLmhyZWYuc3BsaXQoJz0nKVsxXTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gbmV4dCh0eXBlKXtcclxuICAgIGlmKHR5cGUgIT0gbnVsbCl7XHJcbiAgICAgIGZbcXVldWUuc2hpZnQoKV0oKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZbcXVldWUuc2hpZnQoKV0uZ2tEZWxheSg3NTAsIHRoaXMsIFtdKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGRvQWN0aW9ucyhpbmRleCwgY291bnQsIHBhcmFtKXtcclxuICBpZihpbmRleCA8IGNvdW50KXtcclxuICAgIGlmKHBhcmFtLm1vZGUgPT0gXCJpbnZpdGVcIil7XHJcbiAgICAgIHNlbmRJbnZpdGUoaW5kZXgsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGlmKHBhcmFtLm1vZGUgPT0gXCJnb0F3YXlcIil7XHJcbiAgICAgIGlmKHBhcmFtLmF3YXlMaXN0W3BhcmFtLmxpc3RbaW5kZXhdLm5hbWVdICE9IG51bGwpIGRvR29Bd2F5KHBhcmFtLnNpZCwgcGFyYW0uYXdheUxpc3RbcGFyYW0ubGlzdFtpbmRleF0ubmFtZV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRNYWlsLmdrRGVsYXkoMTI1MCwgdGhpcywgW2luZGV4LCBwYXJhbV0pO1xyXG5cclxuICAgIHBhcmFtLm91dCsrO1xyXG4gICAgaW5kZXgrKztcclxuXHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3dvcmsnKTtcclxuICAgIGRvQWN0aW9ucy5na0RlbGF5KHJhbmRvbSgzNjAsIDM4MCkgKiAxMDAsIHRoaXMsIFtpbmRleCwgY291bnQsIHBhcmFtXSk7XHJcbiAgfWVsc2V7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ2RvbmUnKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHNlbmRNYWlsKGluZGV4LCBwYXJhbSl7XHJcbiAgdmFyIGRhdGE7XHJcblxyXG4gIGRhdGEgPSBgcG9zdGZvcm09MSZvdXRtYWlsPSR7cGFyYW0ub3V0fSZsb3BhdGE9JHtwYXJhbS5sb3BhdGF9Jm1haWx0bz0ke3BhcmFtLmxpc3RbaW5kZXhdLmVuY29kZX0mc3ViamVjdD0ke3BhcmFtLnN1YmplY3R9Jm1zZz0ke3BhcmFtLm1lc3NhZ2V9YDtcclxuXHJcbiAgdHJ5e1xyXG4gICAgUkVRKCdodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9zbXMtY3JlYXRlLnBocCcsICdQT1NUJywgZGF0YSwgdHJ1ZSxcclxuICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgY29ycmVjdGlvblRpbWUoKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgZXJyb3JMb2coYNCe0YLQv9GA0LDQstC60LUg0L/QuNGB0YzQvNCwICR7cGFyYW0ubGlzdFtpbmRleF0ubmFtZX1gLCAwLCAwKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9Y2F0Y2ggKGUpe1xyXG4gICAgZXJyb3JMb2coYNC+0YLQv9GA0LDQstC60LUg0L/QuNGB0YzQvNCwICR7cGFyYW0ubGlzdFtpbmRleF0ubmFtZX1gLCAxLCBlKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHNlbmRJbnZpdGUoaW5kZXgsIHBhcmFtKXtcclxuICB2YXIgZGF0YSwgaW52aXRlO1xyXG5cclxuICBkYXRhID0gYGtleT1pbnZpdGVzJmlkPSR7cGFyYW0uc2lkfSZpbnZpdGU9JHtwYXJhbS5saXN0W2luZGV4XS5lbmNvZGV9YDtcclxuICBpbnZpdGUgPSAkbW9kZSA/ICRzZCA6ICR0c2Q7XHJcbiAgaW52aXRlID0gaW52aXRlLnBsYXllcnNbcGFyYW0ubGlzdFtpbmRleF0uaWRdLmZvcnVtc1soXCIxXCIgKyBwYXJhbS5zaWQpXS5pbnZpdGU7XHJcblxyXG4gIHRyeXtcclxuICAgIFJFUSgnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc3luZGljYXRlLmVkaXQucGhwJywgJ1BPU1QnLCBkYXRhLCB0cnVlLFxyXG4gICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICBjb3JyZWN0aW9uVGltZSgpO1xyXG4gICAgICAgIGludml0ZSA9IDE7ICAgICAgICAvLy8vINCf0LXQtdGA0LXQtNC10LvQsNGC0YxcclxuICAgICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgZXJyb3JMb2coYNCe0YLQv9GA0LDQstC60LUg0L/RgNC40LPQu9Cw0YjQtdC90LjRjyAke3BhcmFtLmxpc3RbaW5kZXhdLm5hbWV9YCwgMCwgMCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfWNhdGNoIChlKXtcclxuICAgIGVycm9yTG9nKGDQvtGC0L/RgNCw0LLQutC1INC/0YDQuNCz0LvQsNGI0LXQvdC40Y8gJHtwYXJhbS5saXN0W2luZGV4XS5uYW1lfWAsIDEsIGUpO1xyXG4gIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGRvR29Bd2F5KHNpZCwgaWQpe1xyXG4gIHZhciBkYXRhID0gYGlkPSR7c2lkfSZrZXk9dXNlcnMmcmVtb3ZlPSR7aWR9YDtcclxuXHJcbiAgdHJ5e1xyXG4gICAgUkVRKCdodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9zeW5kaWNhdGUuZWRpdC5waHAnLCAnUE9TVCcsIGRhdGEsIHRydWUsXHJcbiAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIGNvcnJlY3Rpb25UaW1lKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIGVycm9yTG9nKGDQmNC30LPQvdCw0L3QvdC40LUgJHtpZH1gLCAwLCAwKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9Y2F0Y2ggKGUpe1xyXG4gICAgZXJyb3JMb2coYNC40LfQs9C90LDQvdC40LggJHtpZH1gLCAxLCBlKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlUGxheWVyKG5hbWUpe1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBuYW1lLFxyXG4gICAgc3RhdHVzOiB7XHJcbiAgICAgIHRleHQ6ICcnLFxyXG4gICAgICBkYXRlOiAwXHJcbiAgICB9LFxyXG4gICAgZm9ydW1zOnt9XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVGb3J1bVBsYXllcigpe1xyXG4gIHJldHVybiB7XHJcbiAgICBzbjogMCxcclxuICAgIGVudGVyOiAwLFxyXG4gICAgZXhpdDogMCxcclxuICAgIGdvQXdheTogMCxcclxuICAgIGludml0ZTogMCxcclxuICAgIG1lbWJlcjogZmFsc2UsXHJcbiAgICBwb3N0czogMCxcclxuICAgIGxhc3Q6IDAsXHJcbiAgICB3b3JkczogWzAsIDBdLFxyXG4gICAgc3RhcnQ6IFtdLFxyXG4gICAgdGhlbWVzOiBbXVxyXG4gIH07XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckJhc2VIVE1MKCl7XHJcbiAgdmFyIGhlYWRlciwgZm9vdGVyLCBiMSwgYjIsIHdpZHRoO1xyXG5cclxuICAkdC5zdGF0cy5zZXRXaWR0aChbNjUsIDQ1LCAtMSwgNDAsIDc1LCA3NSwgOTUsIDgwLCA3NSwgNzUsIDc1LCA3NSwgMTcyLCA4MCwgODAsIDUwLCA3NSwgOTUsIDQ1XSk7XHJcblxyXG4gICR0LnN0YXRzLnNldFN0cnVjdHVyZShbXHJcbiAgICBbXCJwYXRoc1wiLCBcIiRzZC5wbGF5ZXJzW2lkXVwiLCBcIiRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF1cIiwgXCIkY2hlY2tlZC5wbGF5ZXJzW2lkXVwiLCBcImdldFBlcmNlbnQoJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXVwiXSxcclxuICAgIFtcImlkXCIsIDAsIFwiTnVtYmVyKGlkKVwiLCBcIm51bWJlclwiLCBcIklEXCJdLFxyXG4gICAgW1wic051bWJlclwiLCAyLCBcIi5zblwiLCBcIm51bWJlclwiLCBcItCd0L7QvNC10YAg0LIg0YHQv9C40YHQutC1INGB0LjQvdC00LjQutCw0YLQsFwiXSxcclxuICAgIFtcIm5hbWVcIiwgMSwgXCIubmFtZVwiLCBcImNoZWNrXCIsIFwi0JjQvNGPXCJdLFxyXG4gICAgW1wibWVtYmVyXCIsIDIsIFwiLm1lbWJlclwiLCBcImJvb2xlYW5cIiwgXCLQkiDRgdC+0YHRgtCw0LLQtVwiXSxcclxuICAgIFtcInN0YXR1c1wiLCAxLCBcIi5zdGF0dXNcIiwgXCJtdWx0aXBsZVwiLCBcItCh0YLQsNGC0YPRgVwiXSxcclxuICAgIFtcImVudGVyXCIsIDIsIFwiLmVudGVyXCIsIFwiZGF0ZVwiLCBcItCf0YDQuNC90Y/RglwiXSxcclxuICAgIFtcImV4aXRcIiwgMiwgXCIuZXhpdFwiLCBcImRhdGVcIiwgXCLQn9C+0LrQuNC90YPQu1wiXSxcclxuICAgIFtcImludml0ZVwiLCAyLCBcIi5pbnZpdGVcIiwgXCJkYXRlXCIsIFwi0J/RgNC40LPQu9Cw0YjQtdC9XCJdLFxyXG4gICAgW1wiY2hlY2tlZFwiLCAzLCBcIlwiLCBudWxsLCBudWxsXSxcclxuICAgIFtcInN0YXJ0VGhlbWVzXCIsIDIsIFwiLnN0YXJ0Lmxlbmd0aFwiLCBcIm51bWJlclwiLCBcItCd0LDRh9Cw0YLQviDRgtC10LxcIl0sXHJcbiAgICBbXCJ3cml0ZVRoZW1lc1wiLCAyLCBcIi50aGVtZXMubGVuZ3RoXCIsIFwibnVtYmVyXCIsIFwi0KPRh9Cw0LLRgdGC0LLQvtCy0LDQuyDQsiDRgtC10LzQsNGFXCJdLFxyXG4gICAgW1wibGFzdE1lc3NhZ2VcIiwgMiwgXCIubGFzdFwiLCBcImRhdGVcIiwgXCLQn9C+0YHQu9C10LTQvdC10LUg0YHQvtC+0LHRidC10L3QuNC1XCJdLFxyXG4gICAgW1wicG9zdHNcIiwgMiwgXCIucG9zdHNcIiwgXCJudW1iZXJcIiwgXCLQktGB0LXQs9C+INGB0L7QvtCx0YnQtdC90LjQuVwiXSxcclxuICAgIFtcInBlcmNlbnRTdGFydFRoZW1lc1wiLCA0LCBcIi5zdGFydC5sZW5ndGgsICRjZC5mLnRocmVhZHMuYWxsLCBmYWxzZSk7XCIsIFwibnVtYmVyXCIsIFwi0J/RgNC+0YbQtdC90YIg0L3QsNGH0LDRgtGL0YUg0YLQtdC8XCJdLFxyXG4gICAgW1wicGVyY2VudFdyaXRlVGhlbWVzXCIsIDQsIFwiLnRoZW1lcy5sZW5ndGgsICRjZC5mLnRocmVhZHMuYWxsLCBmYWxzZSk7XCIsIFwibnVtYmVyXCIsIFwi0J/RgNC+0YbQtdC90YIg0YPRh9Cw0YHRgtC40Y8g0LIg0YLQtdC80LDRhVwiXSxcclxuICAgIFtcInBlcmNlbnRQb3N0c1wiLCA0LCBcIi5wb3N0cywgJGNkLmYucG9zdHMsIGZhbHNlKTtcIiwgXCJudW1iZXJcIiwgXCLQn9GA0L7RhtC10L3RgiDRgdC+0L7QsdGJ0LXQvdC40LlcIl0sXHJcbiAgICBbXCJwZXJjZW50V29yZHNcIiwgNCwgXCIud29yZHNbMF0sICRjZC5mLndvcmRzLCBmYWxzZSk7XCIsIFwibnVtYmVyXCIsIFwi0J/RgNC+0YbQtdC90YIg0L3QsNC/0LjRgdCw0L3QvdGL0YUg0YHQu9C+0LJcIl0sXHJcbiAgICBbXCJ3b3Jkc1wiLCAyLCBcIi53b3Jkc1swXVwiLCBcIm51bWJlclwiLCBcItCS0YHQtdCz0L4g0L3QsNC/0LjRgdCw0L3QvdGL0YUg0YHQu9C+0LJcIl0sXHJcbiAgICBbXCJ3b3Jkc0F2ZXJhZ2VcIiwgMiwgXCIud29yZHNbMV1cIiwgXCJudW1iZXJcIiwgXCLQodGA0LXQtNC90LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQvdCw0L/QuNGB0LDQvdC90YvRhSDRgdC70L7QslwiXVxyXG4gIF0pO1xyXG5cclxuICAvLzxkaXYgc3R5bGU9XCJ3aWR0aDogMjRweDsgaGVpZ2h0OiAyNHB4OyBtYXJnaW4tbGVmdDogNXB4OyBmbG9hdDogbGVmdDsgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7JGljby5tZW1iZXJJY299KVwiPjwvZGl2PlxyXG5cclxuICBoZWFkZXIgPVxyXG4gICAgYDx0YWJsZSBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgdHlwZT1cInBhZGRpbmdcIj5cclxuICAgICAgICAgICAgICAgIDx0ciBzdHlsZT1cImhlaWdodDogMzVweDsgZm9udC1zdHlsZTogaXRhbGljO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIxN1wiPtCU0LDQvdC90YvQtSDQv9C+INGE0L7RgNGD0LzRgyAjJHskY2QuZmlkfTxiPiDCqyR7JGZvcnVtLm5hbWV9wrs8L2I+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHIgdHlwZT1cImhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDApfSBhbGlnbj1cImNlbnRlclwiIHJvd3NwYW49XCIyXCIgc29ydD1cImlkXCIgaGVpZ2h0PVwiNjBcIj4jPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMSl9IGFsaWduPVwiY2VudGVyXCIgcm93c3Bhbj1cIjJcIiBzb3J0PVwic051bWJlclwiPuKEljxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDIpfSBhbGlnbj1cImNlbnRlclwiIHJvd3NwYW49XCIyXCIgc29ydD1cIm5hbWVcIj7QmNC80Y88aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCgzKX0gYWxpZ249XCJjZW50ZXJcIiByb3dzcGFuPVwiMlwiIHNvcnQ9XCJtZW1iZXJcIj48aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBjb2xzcGFuPVwiMlwiPtCi0LXQvNGLPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBjb2xzcGFuPVwiMlwiPtCf0L7RgdGC0Ys8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCI0XCI+0J/RgNC+0YbQtdC90YI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDEyKX0gYWxpZ249XCJjZW50ZXJcIiByb3dzcGFuPVwiMlwiIHNvcnQ9XCJzdGF0dXNcIj7QodGC0LDRgtGD0YE8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCgxMyl9IGFsaWduPVwiY2VudGVyXCIgcm93c3Bhbj1cIjJcIiBzb3J0PVwiZW50ZXJcIj7Qn9GA0LjQvdGP0YI8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCgxNCl9IGFsaWduPVwiY2VudGVyXCIgcm93c3Bhbj1cIjJcIiBzb3J0PVwiZXhpdFwiPtCf0L7QutC40L3Rg9C7PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTUpfSBhbGlnbj1cImNlbnRlclwiIHJvd3NwYW49XCIyXCIgc29ydD1cImludml0ZVwiPtCX0LLQsNC7PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjJcIj7QodC70L7QsiDQsiDQv9C+0YHRgtCw0YU8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDE4KX0gYWxpZ249XCJjZW50ZXJcIiByb3dzcGFuPVwiMlwiIHNvcnQ9XCJjaGVja2VkXCIgd2lkdGg9XCI0NVwiPkA8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHIgdHlwZT1cImhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDQpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJzdGFydFRoZW1lc1wiPtCd0LDRh9Cw0YLQvjxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDUpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJ3cml0ZVRoZW1lc1wiPtCj0YfQsNGB0YLQuNGPPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoNil9IGFsaWduPVwiY2VudGVyXCIgc29ydD1cImxhc3RNZXNzYWdlXCI+0J/QvtGB0LvQtdC00L3QuNC5PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoNyl9IGFsaWduPVwiY2VudGVyXCIgc29ydD1cInBvc3RzXCI+0JrQvtC7LdCy0L48aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCg4KX0gYWxpZ249XCJjZW50ZXJcIiBzb3J0PVwicGVyY2VudFN0YXJ0VGhlbWVzXCI+0J3QsNGHLtGC0LXQvDxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDkpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJwZXJjZW50V3JpdGVUaGVtZXNcIj7Qo9GH0LDRgdGC0LjRjzxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDEwKX0gYWxpZ249XCJjZW50ZXJcIiBzb3J0PVwicGVyY2VudFBvc3RzXCI+0J/QvtGB0YLQvtCyPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTEpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJwZXJjZW50V29yZHNcIj7QodC70L7QsjxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDE2KX0gYWxpZ249XCJjZW50ZXJcIiBzb3J0PVwid29yZHNcIj7QktGB0LXQs9C+PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTcpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJ3b3Jkc0F2ZXJhZ2VcIiB0aXRsZT1cItCh0YDQtdC00L3QtdC1INC60L7Qu9C40YfQtdGB0LLRgtC+INGB0LvQvtCyINCyINC+0LTQvdC+0Lwg0YHQvtC+0LHRidC10L3QuNC4XCI+0JIg0YHRgNC10LTQvdC10Lw8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgIDwvdGFibGU+YDtcclxuXHJcbiAgZm9vdGVyID1cclxuICAgIGA8dGFibGUgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHR5cGU9XCJwYWRkaW5nXCI+XHJcbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZDBlZWQwO1wiIHR5cGU9XCJmaWx0ZXJzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgwKX0gZmlsdGVyPVwiaWRcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDEpfSBmaWx0ZXI9XCJzTnVtYmVyXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgyKX0gZmlsdGVyPVwibmFtZVwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoMyl9IGZpbHRlcj1cIm1lbWJlclwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoNCl9IGZpbHRlcj1cInN0YXJ0VGhlbWVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCg1KX0gZmlsdGVyPVwid3JpdGVUaGVtZXNcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDYpfSBmaWx0ZXI9XCJsYXN0TWVzc2FnZVwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoNyl9IGZpbHRlcj1cInBvc3RzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCg4KX0gZmlsdGVyPVwicGVyY2VudFN0YXJ0VGhlbWVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCg5KX0gZmlsdGVyPVwicGVyY2VudFdyaXRlVGhlbWVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxMCl9IGZpbHRlcj1cInBlcmNlbnRQb3N0c1wiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTEpfSBmaWx0ZXI9XCJwZXJjZW50V29yZHNcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDEyKX0gZmlsdGVyPVwic3RhdHVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxMyl9IGZpbHRlcj1cImVudGVyXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxNCl9IGZpbHRlcj1cImV4aXRcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDE1KX0gZmlsdGVyPVwiaW52aXRlXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxNil9IGZpbHRlcj1cIndvcmRzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxNyl9IGZpbHRlcj1cIndvcmRzQXZlcmFnZVwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTgpfSA+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XCJoZWlnaHQ6IDM1cHg7IGJhY2tncm91bmQtY29sb3I6ICNkMGVlZDA7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIxMlwiIGlkPVwic2ZfY3VycmVudEZpbHRlcnNcIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICDQktGB0LXQs9C+INGC0LXQvDogPGI+ICR7JGZvcnVtLnRoZW1lc1sxXX08L2I+LCDQstGB0LXQs9C+INC/0L7RgdGC0L7QsjogPGI+JHskZm9ydW0ucG9zdHN9PC9iPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI1XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgINCf0L7Qt9C40YbQuNC5INCyINGC0LDQsdC70LjRhtC1OiA8YiBpZD1cInNmX1NJX0xpc3RDb3VudFwiPjA8L2I+LCDQvtGC0LzQtdGH0LXQvdC+OiA8YiBpZD1cInNmX1NJX0xpc3RDaGVja2VkXCI+MDwvYj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPHNwYW4gaWQ9XCJzZl9iQ2hlY2tBbGxNZW1iZXJzXCI+W9C+0YLQvNC10YLQuNGC0Ywg0LLRgdGRXTwvc3Bhbj5gO1xyXG5cclxuICAkKCcjc2ZfaGVhZGVyX1NJJykuaHRtbChoZWFkZXIpO1xyXG4gICQoJyNzZl9mb290ZXJfU0knKS5odG1sKGZvb3Rlcik7XHJcblxyXG4gICR0LnN0YXRzLnNldENvbnRyb2woJGljbyk7XHJcblxyXG4gIGIxID0gJCgnI3NmX2JDaGVja0FsbE1lbWJlcnMnKS5ub2RlKCk7XHJcbiAgYmluZEV2ZW50KGIxLCAnb25jbGljaycsIGZ1bmN0aW9uKCl7Y2hlY2tBbGxNZW1iZXJzKGIxLCAnI3NmX2NvbnRlbnRfU0knKX0pO1xyXG5cclxuICAvL2hlYWRlciA9XHJcbiAgLy8gICAgYDx0YWJsZSBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIiB0eXBlPVwicGFkZGluZ1wiPlxyXG4gIC8vICAgICAgICA8dHIgc3R5bGU9XCJoZWlnaHQ6IDM1cHg7IGZvbnQtc3R5bGU6IGl0YWxpYztcIj5cclxuICAvLyAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIyXCI+0JTQsNC90L3Ri9C1INC/0L4g0L3QsNGH0LDRgtGL0Lwg0LjQs9GA0L7QutC+0Lwg0YLQtdC80LDQvDwvdGQ+XHJcbiAgLy8gICAgICAgIDwvdHI+XHJcbiAgLy8gICAgICAgIDx0ciB0eXBlPVwiaGVhZGVyXCIgaGVpZ2h0PVwiNDhcIj5cclxuICAvLyAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMHB4O1wiPtCY0LzRjyDQuNCz0YDQvtC60LA6PC90ZD5cclxuICAvLyAgICAgICAgICAgIDx0ZCBhbGlnbj1cImxlZnRcIj4ke2NyZWF0ZVNlbGVjdCgpfTwvdGQ+XHJcbiAgLy8gICAgICAgIDwvdHI+XHJcbiAgLy8gICAgICAgIDx0cj5cclxuICAvLyAgICAgICAgICAgIDx0ZCBpZD1cInNmX1NUSVwiIGNvbHNwYW49XCIyXCIgdmFsaWduPVwidG9wXCI+PC90ZD5cclxuICAvLyAgICAgICAgPC90cj5cclxuICAvLyAgICA8L3RhYmxlPmA7XHJcbiAgLy9cclxuICAvLyQoJyNzZl9oZWFkZXJfU1RJJykuaHRtbChoZWFkZXIpO1xyXG5cclxuICAkdC50aGVtZXMuc2V0V2lkdGgoWzcwLCAtMSwgMjUwLCA4MCwgMTAwLCAxMDAsIDQzXSk7XHJcbiAgJHQudGhlbWVzLnNldFN0cnVjdHVyZShbXHJcbiAgICBbXCJwYXRoc1wiLCBcIiRjZC5mLnRoZW1lc1tpZF1cIiwgXCIkY2hlY2tlZC50aGVtZXNbaWRdXCJdLFxyXG4gICAgW1wiaWRcIiwgMCwgXCJOdW1iZXIoaWQpXCIsIFwibnVtYmVyXCIsIFwiSURcIl0sXHJcbiAgICBbXCJuYW1lXCIsIDEsIFwiLm5hbWVcIiwgXCJjaGVja1wiLCBcItCd0LDQt9Cy0LDQvdC40Lgg0YLQtdC80YtcIl0sXHJcbiAgICBbXCJhdXRob3JcIiwgMSwgXCIuYXV0aG9yXCIsIFwiY2hlY2tcIiwgXCLQmNC80LXQvdC4INCw0LLRgtC+0YDQsFwiXSxcclxuICAgIFtcImRhdGVcIiwgMSwgXCIuZGF0ZVwiLCBcImRhdGVcIiwgXCLQlNCw0YLQtSDRgdC+0LfQtNCw0L3QuNGPXCJdLFxyXG4gICAgW1wiY2hlY2tcIiwgMiwgXCJcIiwgbnVsbCwgbnVsbF0sXHJcbiAgICBbXCJwb3N0c0RvbmVcIiwgMSwgXCIucG9zdHNbMF1cIiwgXCJudW1iZXJcIiwgXCLQntCx0YDQsNCx0L7RgtCw0L3QviDRgdC+0L7QsdGJ0LXQvdC40LlcIl0sXHJcbiAgICBbXCJwb3N0c0FsbFwiLCAxLCBcIi5wb3N0c1sxXVwiLCBcIm51bWJlclwiLCBcItCS0YHQtdCz0L4g0YHQvtC+0LHRidC10L3QuNC5XCJdXHJcbiAgXSk7XHJcblxyXG4gIGhlYWRlciA9XHJcbiAgICBgPHRhYmxlIGFsaWduPVwiY2VudGVyXCIgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIiB0eXBlPVwicGFkZGluZ1wiPlxyXG4gICAgICAgICAgICAgICAgPHRyIHN0eWxlPVwiaGVpZ2h0OiAzNXB4OyBmb250LXN0eWxlOiBpdGFsaWM7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjdcIj7QlNCw0L3QvdGL0LUg0L/QviDQvtCx0YDQsNCx0L7RgtCw0L3QvdGL0Lwg0YLQtdC80LDQvDwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCgwKX0gc29ydD1cImlkXCIgcm93c3Bhbj1cIjJcIiBzdHlsZT1cImhlaWdodDogNTBweDtcIj4jPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMSl9IHNvcnQ9XCJuYW1lXCIgcm93c3Bhbj1cIjJcIj7QotC10LzQsDxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQudGhlbWVzLmdldFdpZHRoKDIpfSBzb3J0PVwiYXV0aG9yXCIgcm93c3Bhbj1cIjJcIj7QkNCy0YLQvtGAPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMyl9IHNvcnQ9XCJkYXRlXCIgcm93c3Bhbj1cIjJcIj7QodC+0LfQtNCw0L3QsDxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIyXCI+0KHQvtC+0LHRidC10L3QuNC5PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCg2KX0gc29ydD1cImNoZWNrXCIgcm93c3Bhbj1cIjJcIj5APGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCg0KX0gc29ydD1cInBvc3RzRG9uZVwiPtCe0LHRgNCw0LHQvtGC0LDQvdC+PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoNSl9IHNvcnQ9XCJwb3N0c0FsbFwiPtCS0YHQtdCz0L48aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgIDwvdGFibGU+YDtcclxuXHJcbiAgZm9vdGVyID1cclxuICAgIGA8dGFibGUgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHR5cGU9XCJwYWRkaW5nXCI+XHJcbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZDBlZWQwO1wiIHR5cGU9XCJmaWx0ZXJzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMCl9IGZpbHRlcj1cImlkXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMSl9IGZpbHRlcj1cIm5hbWVcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCgyKX0gZmlsdGVyPVwiYXV0aG9yXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMyl9IGZpbHRlcj1cImRhdGVcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCg0KX0gZmlsdGVyPVwicG9zdHNEb25lXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoNSl9IGZpbHRlcj1cInBvc3RzQWxsXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoNil9ID48L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0ciBzdHlsZT1cImhlaWdodDogMzVweDsgYmFja2dyb3VuZC1jb2xvcjogI2QwZWVkMDtcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT1cImZsb2F0OiByaWdodDsgbWFyZ2luLXJpZ2h0OiA1cHg7IGZvbnQtc2l6ZTogMTBweDsgY3Vyc29yOiBwb2ludGVyO1wiIGlkPVwic2ZfYkNoZWNrQWxsVGhlbWVzXCI+W9C+0YLQvNC10YLQuNGC0Ywg0LLRgdGRXTwvc3Bhbj5gO1xyXG5cclxuICAkKCcjc2ZfaGVhZGVyX1RMJykuaHRtbChoZWFkZXIpO1xyXG4gICQoJyNzZl9mb290ZXJfVEwnKS5odG1sKGZvb3Rlcik7XHJcblxyXG4gICR0LnRoZW1lcy5zZXRDb250cm9sKCRpY28pO1xyXG5cclxuICBiMiA9ICQoJyNzZl9iQ2hlY2tBbGxUaGVtZXMnKS5ub2RlKCk7XHJcbiAgYmluZEV2ZW50KGIyLCAnb25jbGljaycsIGZ1bmN0aW9uKCl7Y2hlY2tBbGxNZW1iZXJzKGIyLCAnI3NmX2NvbnRlbnRfVEwnKX0pO1xyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBjaGVja0FsbE1lbWJlcnMoYnV0dG9uLCBpZCl7XHJcbiAgICB2YXIgY24gPSAkKCcjc2ZfU0lfTGlzdENoZWNrZWQnKTtcclxuXHJcbiAgICBpZihidXR0b24udGV4dENvbnRlbnQgPT0gXCJb0L7RgtC80LXRgtC40YLRjCDQstGB0ZFdXCIpe1xyXG4gICAgICBidXR0b24udGV4dENvbnRlbnQgPSBcIlvRgdC90Y/RgtGMINCy0YHRkV1cIjtcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9TSVwiKSBjbi5odG1sKCRjZC5zdGF0c0NvdW50KTtcclxuICAgIH1lbHNle1xyXG4gICAgICBidXR0b24udGV4dENvbnRlbnQgPSBcIlvQvtGC0LzQtdGC0LjRgtGMINCy0YHRkV1cIjtcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9TSVwiKSBjbi5odG1sKDApO1xyXG4gICAgfVxyXG5cclxuICAgICQoaWQpXHJcbiAgICAgIC5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKVxyXG4gICAgICAubm9kZUFycigpXHJcbiAgICAgIC5mb3JFYWNoKFxyXG4gICAgICAgIGZ1bmN0aW9uKGJveCl7XHJcbiAgICAgICAgICBpZihidXR0b24udGV4dENvbnRlbnQgIT0gXCJb0L7RgtC80LXRgtC40YLRjCDQstGB0ZFdXCIpe1xyXG4gICAgICAgICAgICBkb1RoaXMoYm94LCBcImxpZ2h0Q2hlY2tlZFwiLCB0cnVlLCAkaWNvLmJveE9uLCB0cnVlKTtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBkb1RoaXMoYm94LCBcImxpZ2h0XCIsIGZhbHNlLCAkaWNvLmJveE9mZiwgZmFsc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gZG9UaGlzKGJveCwgdHlwZSwgYywgaW1nLCBjaGVjayl7XHJcbiAgICAgICQoYm94KS51cCgndHInKS5ub2RlKCkuc2V0QXR0cmlidXRlKFwidHlwZVwiLCB0eXBlKTtcclxuICAgICAgYm94LmNoZWNrZWQgPSBjO1xyXG4gICAgICBib3gubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLmJhY2tncm91bmQgPSBgdXJsKFwiJHtpbWd9XCIpYDtcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9TSVwiKSAkY2hlY2tlZC5wbGF5ZXJzW2JveC52YWx1ZV0gPSBjaGVjaztcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9UTFwiKSAkY2hlY2tlZC50aGVtZXNbYm94LnZhbHVlXSA9IGNoZWNrO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyU3RhdHNUYWJsZShzb3J0ZWQpe1xyXG4gIHZhciB0YWJsZSA9ICR0LnN0YXRzO1xyXG5cclxuICBpZighc29ydGVkKSB7XHJcbiAgICB0YWJsZS5jbGVhckNvbnRlbnQoKTtcclxuICAgIHByZXBhcmVSZW5kZXJzKFwicGxheWVyc1wiLCB0YWJsZSk7XHJcbiAgICB0YWJsZS5zb3J0aW5nKCk7XHJcbiAgfVxyXG5cclxuICAkY2Quc3RhdHNDb3VudCA9IDA7XHJcbiAgc2hvd1N0YXRzKHRhYmxlKTtcclxuICBiaW5kQ2hlY2tpbmdPblJvd3MoJyNzZl9jb250ZW50X1NJJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlclRoZW1lc1RhYmxlKHNvcnRlZCl7XHJcbiAgdmFyIHRhYmxlID0gJHQudGhlbWVzO1xyXG5cclxuICBpZighc29ydGVkKXtcclxuICAgIHRhYmxlLmNsZWFyQ29udGVudCgpO1xyXG4gICAgcHJlcGFyZVJlbmRlcnMoXCJ0aGVtZXNcIiwgdGFibGUpO1xyXG4gICAgdGFibGUuc29ydGluZygpO1xyXG4gIH1cclxuXHJcbiAgJGNkLnRoZW1lc0NvdW50ID0gMDtcclxuICBzaG93VGhlbWVMaXN0KHRhYmxlKTtcclxuICBiaW5kQ2hlY2tpbmdPblJvd3MoJyNzZl9jb250ZW50X1RMJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlclRhYmxlcygpe1xyXG4gIHJlbmRlclN0YXRzVGFibGUoKTtcclxuICByZW5kZXJUaGVtZXNUYWJsZSgpO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBkb0ZpbHRlcih0ZCwgdE5hbWUsIHR5cGUsIG5hbWUpe1xyXG4gIGNvbnNvbGUubG9nKHRkKTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gcHJlcGFyZVJlbmRlcnModmFsdWUsIHRhYmxlKXtcclxuICB2YXIgbSA9IFtdLCBmID0gW10sIGFkZGVkO1xyXG5cclxuICBpZih2YWx1ZSA9PSBcInBsYXllcnNcIil7XHJcbiAgICBPYmplY3Qua2V5cygkc2RbdmFsdWVdKS5mb3JFYWNoKHByb2Nlc3NpbmcpO1xyXG4gICAgLy9PYmplY3Qua2V5cygkc3Muc2hvdy5zdGF0cykuZm9yRWFjaChwcmVwYXJlRmlsdGVycyk7XHJcbiAgfWVsc2V7XHJcbiAgICBPYmplY3Qua2V5cygkc2QuZm9ydW1zWyRjZC5maWRdLnRoZW1lcykuZm9yRWFjaChwcm9jZXNzaW5nKTtcclxuICB9XHJcblxyXG4gIGlmKGFkZGVkICYmICRtb2RlKSBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuXHJcbiAgcmV0dXJuIHttOiBtLCBmOiBmfTtcclxuXHJcbiAgZnVuY3Rpb24gcHJvY2Vzc2luZyhpZCl7XHJcbiAgICB2YXIgcCwgcGYsIGtpY2tlZCwgaW52aXRlLCBmO1xyXG5cclxuICAgIGlmKCRjaGVja2VkW3ZhbHVlXVtpZF0gPT0gbnVsbCl7XHJcbiAgICAgICRjaGVja2VkW3ZhbHVlXVtpZF0gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZih2YWx1ZSA9PSBcInBsYXllcnNcIil7XHJcbiAgICAgIHAgPSAkc2QucGxheWVyc1tpZF07XHJcbiAgICAgIHBmID0gcC5mb3J1bXNbJGNkLmZpZF07XHJcblxyXG4gICAgICBpZihwZiAhPSBudWxsKXtcclxuICAgICAgICAvL2tpY2tlZCA9ICRtb2RlID8gJHNkLmtpY2tlZFskY2QuZmlkXSA6ICR0c2Qua2lja2VkWyRjZC5maWRdO1xyXG4gICAgICAgIC8vaWYoa2lja2VkICE9IG51bGwgJiYgcGYgIT0gbnVsbCAmJiBraWNrZWRbcC5uYW1lXSAhPSBudWxsKXtcclxuICAgICAgICAvLyAgICBpZihwZi5leGl0IDw9IGtpY2tlZFtwLm5hbWVdKXtcclxuICAgICAgICAvLyAgICAgICAgcGYuZ29Bd2F5ID0gMTtcclxuICAgICAgICAvLyAgICAgICAgcGYuZXhpdCA9IGtpY2tlZFtwLm5hbWVdO1xyXG4gICAgICAgIC8vICAgICAgICBpZigkbW9kZSkgZGVsZXRlIGtpY2tlZFtwLm5hbWVdO1xyXG4gICAgICAgIC8vICAgICAgICBhZGRlZCA9IHRydWU7XHJcbiAgICAgICAgLy8gICAgfVxyXG4gICAgICAgIC8vfVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy9pbnZpdGUgPSAkbW9kZSA/ICRzZC5pbnZpdGVbJGNkLmZpZF0gOiAkdHNkLmludml0ZVskY2QuZmlkXTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vaWYoaW52aXRlICE9IG51bGwgJiYgaW52aXRlW3AubmFtZV0gIT0gbnVsbCl7XHJcbiAgICAgICAgLy8gICAgcGYuaW52aXRlID0gMTtcclxuICAgICAgICAvLyAgICBpZigkbW9kZSkgZGVsZXRlIGludml0ZVtwLm5hbWVdO1xyXG4gICAgICAgIC8vICAgIGFkZGVkID0gdHJ1ZTtcclxuICAgICAgICAvL31cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vaWYoISRtb2RlICYmICR0c2QucGxheWVyc1tpZF0gJiYgJHRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJzE3OTMwJ10pe1xyXG4gICAgICAgIC8vICAgIGYgPSAkdHNkLnBsYXllcnNbaWRdLmZvcnVtc1snMTc5MzAnXTtcclxuICAgICAgICAvLyAgICBwZi5zbiA9IGYuc247XHJcbiAgICAgICAgLy8gICAgcGYuZW50ZXIgPSBmLmVudGVyO1xyXG4gICAgICAgIC8vICAgIHBmLmV4aXQgPSBmLmV4aXQ7XHJcbiAgICAgICAgLy8gICAgcGYuaW52aXRlID0gZi5pbnZpdGU7XHJcbiAgICAgICAgLy8gICAgcGYubWVtYmVyID0gZi5tZW1iZXI7XHJcbiAgICAgICAgLy8gICAgcGYuZ29Bd2F5ID0gZi5nb0F3YXk7XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvL20ucHVzaChpZCk7XHJcblxyXG4gICAgICAgIHRhYmxlLnNldENvbnRlbnQoaWQpO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdGFibGUuc2V0Q29udGVudChpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gcHJlcGFyZUZpbHRlcnModmFsdWUpe1xyXG4gICAgaWYoJHNzLnNob3cuc3RhdHNbdmFsdWVdICE9IG51bGwpIGYucHVzaCh2YWx1ZSk7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBkb1NvcnQodGQsIHRhYmxlKXtcclxuICB2YXIgY2VsbCwgbmFtZSA9IHRhYmxlLmdldE5hbWUoKTtcclxuXHJcbiAgdGFibGUuc2V0U29ydCgkaWNvKTtcclxuXHJcbiAgY2VsbCA9IHRkLmdldEF0dHJpYnV0ZShcInNvcnRcIik7XHJcbiAgaWYoY2VsbCA9PSAkc3Muc29ydFtuYW1lXS5jZWxsKXtcclxuICAgICRzcy5zb3J0W25hbWVdLnR5cGUgPSAkc3Muc29ydFtuYW1lXS50eXBlID09IDAgPyAxIDogMDtcclxuICB9ZWxzZXtcclxuICAgICRzcy5zb3J0W25hbWVdLmNlbGwgPSBjZWxsO1xyXG4gICAgJHNzLnNvcnRbbmFtZV0udHlwZSA9IDE7XHJcbiAgfVxyXG5cclxuICB0YWJsZS5jaGFuZ2VTb3J0SW1hZ2UoJGljbyk7XHJcbiAgdGFibGUuc29ydGluZygpO1xyXG5cclxuICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ3NldHRpbmdzJyk7XHJcblxyXG4gIGlmKG5hbWUgPT0gXCJzdGF0c1wiKSByZW5kZXJTdGF0c1RhYmxlKHRydWUpO1xyXG4gIGlmKG5hbWUgPT0gXCJ0aGVtZXNcIikgcmVuZGVyVGhlbWVzVGFibGUodHJ1ZSk7XHJcblxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBiaW5kQ2hlY2tpbmdPblJvd3MoaWQpe1xyXG4gICQoaWQpXHJcbiAgICAuZmluZCgndHInKVxyXG4gICAgLm5vZGVBcnIoKVxyXG4gICAgLmZvckVhY2goXHJcbiAgICAgIGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICBiaW5kRXZlbnQobm9kZSwgJ29uY2xpY2snLGZ1bmN0aW9uKCl7Y2hlY2tlZElkKG5vZGUpfSk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gIGZ1bmN0aW9uIGNoZWNrZWRJZChub2RlKXtcclxuICAgIGlmKG5vZGUuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PSBcImxpZ2h0XCIpe1xyXG4gICAgICBub2RlLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJsaWdodENoZWNrZWRcIik7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwibGlnaHRcIik7XHJcbiAgICB9XHJcbiAgICBub2RlID0gJChub2RlKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5ub2RlKCk7XHJcbiAgICBub2RlLm5leHRTaWJsaW5nLnN0eWxlLmJhY2tncm91bmQgPSBub2RlLmNoZWNrZWQgPyBgdXJsKFwiJHskaWNvLmJveE9mZn1cIilgIDogYHVybChcIiR7JGljby5ib3hPbn1cIilgO1xyXG4gICAgbm9kZS5jaGVja2VkID0gIW5vZGUuY2hlY2tlZDtcclxuXHJcbiAgICBpZihpZCA9PSBcIiNzZl9jb250ZW50X1NJXCIpe1xyXG4gICAgICAkY2hlY2tlZC5wbGF5ZXJzW25vZGUudmFsdWVdID0gISRjaGVja2VkLnBsYXllcnNbbm9kZS52YWx1ZV07XHJcbiAgICAgIGNoYW5nZUNvdW50KCcjc2ZfU0lfTGlzdENoZWNrZWQnLCBub2RlLmNoZWNrZWQpO1xyXG4gICAgfVxyXG4gICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9UTFwiKXtcclxuICAgICAgJGNoZWNrZWQudGhlbWVzW25vZGUudmFsdWVdID0gISRjaGVja2VkLnRoZW1lc1tub2RlLnZhbHVlXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNoYW5nZUNvdW50KGlkLCBzdGF0ZSl7XHJcbiAgICB2YXIgY291bnQsIGNuO1xyXG5cclxuICAgIGNuID0gJChpZCk7XHJcbiAgICBjb3VudCA9IE51bWJlcihjbi50ZXh0KCkpO1xyXG4gICAgY24uaHRtbChzdGF0ZSA/IGNvdW50ICsgMSA6IGNvdW50IC0gMSk7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBzaG93U3RhdHModGFibGUpe1xyXG4gIHZhciBjb2RlO1xyXG5cclxuICBjb2RlID1cclxuICAgIGA8ZGl2IHN0eWxlPVwibWF4LWhlaWdodDogNDc3cHg7IG92ZXJmbG93LXk6IHNjcm9sbDtcIj5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgdHlwZT1cInBhZGRpbmdcIj5gO1xyXG5cclxuXHJcbiAgdGFibGUuZ2V0Q29udGVudCgpLmZvckVhY2goZnVuY3Rpb24odHIpe1xyXG4gICAgdmFyIG1lbWJlckljbywgaW52aXRlSWNvLCBsaWdodCwgY2hlY2ssIGJveCwga2lja2VkQ29sb3I7XHJcblxyXG4gICAgaWYgKHRyLmNoZWNrKXtcclxuICAgICAgbGlnaHQgPSBcImxpZ2h0Q2hlY2tlZFwiO1xyXG4gICAgICBjaGVjayA9IFwiY2hlY2tlZFwiO1xyXG4gICAgICBib3ggPSAkaWNvLmJveE9uO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGxpZ2h0ID0gXCJsaWdodFwiO1xyXG4gICAgICBjaGVjayA9IFwiXCI7XHJcbiAgICAgIGJveCA9ICRpY28uYm94T2ZmO1xyXG4gICAgfVxyXG5cclxuICAgIG1lbWJlckljbyA9IHRyLm1lbWJlciA/ICRpY28uaW5UZWFtIDogJGljby5vdXRUZWFtO1xyXG4gICAgaW52aXRlSWNvID0gdHIuaW52aXRlID8gJGljby5pblRlYW0gOiAkaWNvLm91dFRlYW07XHJcbiAgICBraWNrZWRDb2xvciA9IHRyLmdvQXdheSA/ICdzdHlsZT1cImNvbG9yOiBicm93bjsgZm9udC13ZWlnaHQ6IGJvbGQ7XCInIDogXCJcIjtcclxuXHJcbiAgICBjb2RlICs9XHJcbiAgICAgIGA8dHIgaGVpZ2h0PVwiMjhcIiB0eXBlPVwiJHtsaWdodH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDApfSBhbGlnbj1cInJpZ2h0XCI+JHtjb252ZXJ0SUQodHIuaWQpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgxKX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnNOdW1iZXIpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgyKX0gc3R5bGU9XCJ0ZXh0LWluZGVudDogNXB4O1wiPjxhIHN0eWxlPVwidGV4dC1kZWNvcmF0aW9uOiBub25lOyBmb250LXdlaWdodDogYm9sZDtcIiB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvaW5mby5waHA/aWQ9JHt0ci5pZH1cIj4ke3RyLm5hbWV9PC9hPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgzKX0gYWxpZ249XCJjZW50ZXJcIj48aW1nIHNyYz1cIiR7bWVtYmVySWNvfVwiIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDQpfSBhbGlnbj1cImNlbnRlclwiPiR7aHoodHIuc3RhcnRUaGVtZXMpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg1KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLndyaXRlVGhlbWVzKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoNil9IGFsaWduPVwiY2VudGVyXCI+JHtnZXROb3JtYWxEYXRlKHRyLmxhc3RNZXNzYWdlKS5kfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg3KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBvc3RzKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoOCl9IGFsaWduPVwiY2VudGVyXCI+JHtoeih0ci5wZXJjZW50U3RhcnRUaGVtZXMsIDEpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg5KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBlcmNlbnRXcml0ZVRoZW1lcywgMSl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDEwKX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBlcmNlbnRQb3N0cywgMSl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDExKX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBlcmNlbnRXb3JkcywgMSl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDEyKX0gYWxpZ249XCJjZW50ZXJcIj4ke3N0YXR1c01lbWJlcih0ci5zdGF0dXMpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgxMyl9IGFsaWduPVwiY2VudGVyXCI+JHtnZXROb3JtYWxEYXRlKHRyLmVudGVyKS5kfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgxNCl9IGFsaWduPVwiY2VudGVyXCIgJHtraWNrZWRDb2xvcn0+JHtnZXROb3JtYWxEYXRlKHRyLmV4aXQpLmR9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDE1KX0gYWxpZ249XCJjZW50ZXJcIj48aW1nIHNyYz1cIiR7aW52aXRlSWNvfVwiIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDE2KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLndvcmRzKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoMTcpfSBhbGlnbj1cImNlbnRlclwiPiR7aHoodHIud29yZHNBdmVyYWdlKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoMTgsIHRydWUpfT48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgJHtjaGVja30gbmFtZT1cInNmX21lbWJlcnNMaXN0XCIgdmFsdWU9XCIke3RyLmlkfVwiLz48ZGl2IHN0eWxlPVwibWFyZ2luOiBhdXRvOyB3aWR0aDogMTNweDsgaGVpZ2h0OiAxM3B4OyBiYWNrZ3JvdW5kOiB1cmwoJyR7Ym94fScpXCI+PC9kaXY+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICBgO1xyXG5cclxuICAgICRjZC5zdGF0c0NvdW50Kys7XHJcbiAgfSk7XHJcblxyXG4gIGNvZGUgKz0gYDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PmA7XHJcblxyXG4gICQoJyNzZl9jb250ZW50X1NJJykuaHRtbChjb2RlKTtcclxuICAkKCcjc2ZfU0lfTGlzdENvdW50JykuaHRtbCgkY2Quc3RhdHNDb3VudCk7XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIGh6KHZhbHVlLCBwKXtcclxuICAgIHJldHVybiB2YWx1ZSA9PSAwID8gXCItXCIgOiBwICE9IG51bGwgPyB2YWx1ZSArICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogOXB4O1wiPiAlPC9zcGFuPicgOiB2YWx1ZTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gc3RhdHVzTWVtYmVyKHMpe1xyXG4gICAgaWYocy50ZXh0ID09ICcnKVxyXG4gICAgICByZXR1cm4gXCItXCI7XHJcbiAgICBpZihzLnRleHQgPT0gXCJPa1wiKVxyXG4gICAgICByZXR1cm4gYDxkaXYgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBiYWNrZ3JvdW5kOiB1cmwoJyR7JGljby5va30nKSBuby1yZXBlYXQgMzhweCAwOyBsaW5lLWhlaWdodDogMjhweDsgdGV4dC1pbmRlbnQ6IDI1cHg7XCI+WyR7Z2V0Tm9ybWFsRGF0ZShzLmRhdGUpLmR9XTwvZGl2PmA7XHJcbiAgICBpZihzLmRhdGUgIT0gMClcclxuICAgICAgcmV0dXJuICRkYXRlID4gcy5kYXRlID8gXCI/XCIgOiBgPHNwYW4gc3R5bGU9XCIkeyRzdGF0dXNTdHlsZVtzLnRleHRdfVwiPiR7cy50ZXh0fTwvc3Bhbj4gWyR7Z2V0Tm9ybWFsRGF0ZShzLmRhdGUpLmR9XWA7XHJcblxyXG4gICAgcmV0dXJuYDxzcGFuIHN0eWxlPVwiJHskc3RhdHVzU3R5bGVbcy50ZXh0XX1cIj4ke3MudGV4dH08L3NwYW4+YDtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHNob3dUaGVtZUxpc3QodGFibGUpe1xyXG4gIHZhciBjb2RlLCBsaWdodCwgY2hlY2ssIGJveDtcclxuXHJcbiAgY29kZSA9XHJcbiAgICBgPGRpdiBzdHlsZT1cIm1heC1oZWlnaHQ6IDQ5NXB4OyBvdmVyZmxvdy15OiBzY3JvbGw7XCI+XHJcbiAgICAgICAgICAgICAgICA8dGFibGUgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHR5cGU9XCJwYWRkaW5nXCI+YDtcclxuXHJcbiAgdGFibGUuZ2V0Q29udGVudCgpLmZvckVhY2goZnVuY3Rpb24odHIpe1xyXG4gICAgaWYodHIuY2hlY2spe1xyXG4gICAgICBsaWdodCA9IFwibGlnaHRDaGVja2VkXCI7XHJcbiAgICAgIGNoZWNrID0gXCJjaGVja2VkXCI7XHJcbiAgICAgIGJveCA9ICRpY28uYm94T247XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBsaWdodCA9IFwibGlnaHRcIjtcclxuICAgICAgY2hlY2sgPSBcIlwiO1xyXG4gICAgICBib3ggPSAkaWNvLmJveE9mZjtcclxuICAgIH1cclxuXHJcbiAgICBjb2RlICs9XHJcbiAgICAgIGA8dHIgaGVpZ2h0PVwiMjhcIiB0eXBlPVwiJHtsaWdodH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoMCl9IGFsaWduPVwicmlnaHRcIj4ke2NvbnZlcnRJRCh0ci5pZCl9IDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDEpfSBzdHlsZT1cInRleHQtaW5kZW50OiA1cHg7XCI+PGEgc3R5bGU9XCJ0ZXh0LWRlY29yYXRpb246IG5vbmU7IGZvbnQtd2VpZ2h0OiBib2xkO1wiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9tZXNzYWdlcy5waHA/ZmlkPSR7JGNkLmZpZH0mdGlkPSR7dHIuaWR9XCI+JHt0ci5uYW1lfTwvYT48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgyKX0gc3R5bGU9XCJ0ZXh0LWluZGVudDogNXB4O1wiIHdpZHRoPVwiMjUwXCI+PGEgc3R5bGU9XCJ0ZXh0LWRlY29yYXRpb246IG5vbmU7IGZvbnQtd2VpZ2h0OiBib2xkO1wiIGhyZWY9XCJodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9pbmZvLnBocD9pZD0ke3RyLmF1dGhvci5pZH1cIj4ke3RyLmF1dGhvci5uYW1lfTwvYT48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgzKX0gYWxpZ249XCJjZW50ZXJcIj4ke2dldE5vcm1hbERhdGUodHIuZGF0ZSkuZH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg0KX0gYWxpZ249XCJjZW50ZXJcIj4ke3RyLnBvc3RzRG9uZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg1KX0gYWxpZ249XCJjZW50ZXJcIj4ke3RyLnBvc3RzQWxsfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDYsIHRydWUpfSBhbGlnbj1cImNlbnRlclwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAke2NoZWNrfSBuYW1lPVwic2ZfdGhlbWVzTGlzdFwiIHZhbHVlPVwiJHt0ci5pZH1cIiAvPjxkaXYgc3R5bGU9XCJ3aWR0aDogMTNweDsgaGVpZ2h0OiAxM3B4OyBiYWNrZ3JvdW5kOiB1cmwoJyR7Ym94fScpXCI+PC9kaXY+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8L3RyPmA7XHJcbiAgfSk7XHJcblxyXG4gIGNvZGUgKz0gYDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PmA7XHJcblxyXG4gICQoJyNzZl9jb250ZW50X1RMJykuaHRtbChjb2RlKTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5mdW5jdGlvbiBnZXRDdXJyZW50RmlsdGVycygpe1xyXG4gIHZhciBsaXN0LCBsLCByZXN1bHQ7XHJcblxyXG4gIGxpc3QgPSBPYmplY3Qua2V5cygkc3Muc2hvdy5zdGF0cykucmV2ZXJzZSgpO1xyXG4gIGwgPSBsaXN0Lmxlbmd0aDtcclxuICByZXN1bHQgPSBbXTtcclxuXHJcbiAgd2hpbGUobC0tKXtcclxuICAgIGlmKCRzcy5zaG93LnN0YXRzW2xpc3RbbF1dICE9IG51bGwpe1xyXG4gICAgICByZXN1bHQucHVzaCgnWycgKyAkY2QudmFsdWVzLnN0YXRzW2xpc3RbbF1dWzBdICsgJ10nKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmVzdWx0ID0gcmVzdWx0Lmxlbmd0aCA/ICc8c3BhbiBzdHlsZT1cImZvbnQtd2VpZ2h0OiBib2xkO1wiPtCQ0LrRgtC40LLQvdGL0LUg0YTQuNC70YzRgtGA0Ys6PC9zcGFuPiAnICsgcmVzdWx0LmpvaW4oJyAnKSA6ICcnO1xyXG5cclxuICAkKCcjc2ZfY3VycmVudEZpbHRlcnMnKS5odG1sKHJlc3VsdCk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGdldFRpbWVSZXF1ZXN0KHR5cGUpe1xyXG4gIGlmKCF0eXBlKXtcclxuICAgICRjZC50aW1lUmVxdWVzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gIH1lbHNle1xyXG4gICAgJGNkLnRpbWVSZXF1ZXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAkY2QudGltZVJlcXVlc3Q7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjb3JyZWN0aW9uVGltZSgpe1xyXG4gIHZhciBub2RlLCB0aW1lLCB0O1xyXG5cclxuICB0ID0gJGNkLnRpbWVSZXF1ZXN0O1xyXG4gIG5vZGUgPSAkKCcjc2ZfcHJvZ3Jlc3NUaW1lJyk7XHJcbiAgdGltZSA9IE51bWJlcihub2RlLnRleHQoKSk7XHJcblxyXG4gIGlmKHQgPiA1MDApe1xyXG4gICAgbm9kZS5odG1sKHRpbWUgLSAoNTAwIC0gdCkpO1xyXG4gIH1lbHNlIGlmKHQgPCA1MDApe1xyXG4gICAgbm9kZS5odG1sKHRpbWUgKyAodCAtIDUwMCkpO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gZXJyb3JMb2codGV4dCwgZnVsbCwgZSl7XHJcbiAgaWYoZnVsbCl7XHJcbiAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKCRuYW1lU2NyaXB0KTtcclxuICAgIGNvbnNvbGUuZXJyb3IoYNCh0LvRg9GH0LjQu9Cw0YHRjCDQv9GA0Lg6ICR7dGV4dH0uINCe0YjQuNCx0LrQsDogJXMsINGB0YLRgNC+0LrQsDogJWRcImAsIGUubmFtZSwgZS5saW5lTnVtYmVyKTtcclxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuICB9ZWxzZXtcclxuICAgIGNvbnNvbGUuZXJyb3IoYNCX0LDQv9GA0L7RgSDQt9Cw0LLQtdGA0YjQuNC70YHRjyDQvdC10YPQtNCw0YfQvdC+LiAke3RleHR9LmApO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8g0JDQn9CYINC00LvRjyDRgNCw0LHQvtGC0Ysg0YEgTFNcclxuXHJcbmZ1bmN0aW9uIHNhdmVUb0xvY2FsU3RvcmFnZSh0eXBlKXtcclxuICB2YXIgc3RyaW5nO1xyXG5cclxuICBpZih0eXBlID09ICdkYXRhJyAmJiAkbW9kZSl7XHJcbiAgICBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSgkc2QpO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJna19TRl9kYXRhXCIsIHN0cmluZyk7XHJcbiAgfVxyXG4gIGlmKHR5cGUgPT0gJ3NldHRpbmdzJyl7XHJcbiAgICBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSgkc3MpO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJna19TRl9zZXR0aW5nc1wiLCBzdHJpbmcpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZEZyb21Mb2NhbFN0b3JhZ2UodHlwZSl7XHJcbiAgdmFyIHN0cmluZztcclxuXHJcbiAgaWYodHlwZSA9PSAnZGF0YScpe1xyXG4gICAgc3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJna19TRl9kYXRhXCIpO1xyXG5cclxuICAgIGlmKHN0cmluZyl7XHJcbiAgICAgIGlmKCRtb2RlKSB7XHJcbiAgICAgICAgJHNkID0gSlNPTi5wYXJzZShzdHJpbmcpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAkdHNkID0gSlNPTi5wYXJzZShzdHJpbmcpO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgc2F2ZVRvTG9jYWxTdG9yYWdlKCdkYXRhJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKHR5cGUgPT0gJ3NldHRpbmdzJyl7XHJcbiAgICBzdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdrX1NGX3NldHRpbmdzXCIpO1xyXG5cclxuICAgIGlmKHN0cmluZyl7XHJcbiAgICAgICRzcyA9IEpTT04ucGFyc2Uoc3RyaW5nKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ3NldHRpbmdzJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyDQkNCf0Jgg0LfQsNC/0YDQvtGB0LBcclxuXHJcbmZ1bmN0aW9uIFJFUSh1cmwsIG1ldGhvZCwgcGFyYW0sIGFzeW5jLCBvbnN1Y2Nlc3MsIG9uZmFpbHVyZSkge1xyXG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gIGdldFRpbWVSZXF1ZXN0KCk7XHJcblxyXG4gIHJlcXVlc3Qub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xyXG4gIGlmIChtZXRob2QgPT0gJ1BPU1QnKSByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICByZXF1ZXN0LnNlbmQocGFyYW0pO1xyXG5cclxuICBpZiAoYXN5bmMgPT0gdHJ1ZSkge1xyXG4gICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xyXG4gICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09IDQgJiYgcmVxdWVzdC5zdGF0dXMgPT0gMjAwICYmIHR5cGVvZiBvbnN1Y2Nlc3MgIT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgIGdldFRpbWVSZXF1ZXN0KDEpO1xyXG4gICAgICAgIG9uc3VjY2VzcyhyZXF1ZXN0KTtcclxuICAgICAgfWVsc2UgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcXVlc3Quc3RhdHVzICE9IDIwMCAmJiB0eXBlb2Ygb25mYWlsdXJlICE9ICd1bmRlZmluZWQnKSBvbmZhaWx1cmUocmVxdWVzdCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoYXN5bmMgPT0gZmFsc2UpIHtcclxuICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDAgJiYgdHlwZW9mIG9uc3VjY2VzcyAhPSAndW5kZWZpbmVkJykgb25zdWNjZXNzKHJlcXVlc3QpO1xyXG4gICAgZWxzZSBpZiAocmVxdWVzdC5zdGF0dXMgIT0gMjAwICYmIHR5cGVvZiBvbmZhaWx1cmUgIT0gJ3VuZGVmaW5lZCcpIG9uZmFpbHVyZShyZXF1ZXN0KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlcGFjayhvLCBrZXkpe1xyXG4gIHZhciByID0ge307XHJcblxyXG4gIE9iamVjdC5rZXlzKG8pLmZvckVhY2goZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgclskdHNba2V5XVt2YWx1ZV1dID0gb1t2YWx1ZV07XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiByO1xyXG59Il19
