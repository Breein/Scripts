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
    memberIco: " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAaHSURBVHja1FZrcBPXFT672l29ZQnJyLJlSTY2tsHGSrANGENsIAkTN9DU6WAa4klKYcqQDmkSTDJtZ5p22jItSZvhX2oyydCQISSOqWnNIzYBG5tALNuAbGHL8VuS9ba0Wq1WWm2v3GlmkpLpr/zo/bP3zn2cc75zvu8sJggCfJcDh+94EDa7HcJ0FOzOcaBpGgDDgCAIABTZ0f0Hlw+1njiu/eMrrwa+efn98x2wymKBLJUK0uk0SMRisE/chzffbYPWA4fBoNMB8ZUlXASLAT8UWQogT58DqVQKzl78BzKEQYxl19bt2/Pi2MzUFoZjpSVGk/2JLfVtem32O8Ykx+PIqfS3RfAVVji+bOCh8gooMpkhzrJAIY++uHe3+VxX53Gf22UGqQyAFMHInaGaGed48fZtO4qr11X+Ft2NAs8vv0GIRCA8yMDyIrOJoEmhwyI0d0xNbj5+8sQJ39x0Xu3W7f+0ri47lRYE2hP07bzw6cVDnec/eaW6wuraUbPpLRwwYcw5AZcH+kCeceRBScZQqGwiATGGgSWaFnf3frZ3csiW19Ky/8zBp5v36dTqdqVUdtmSa3y5aXfTUblSkW47c/qQNxiwpNMCRFEOo7EYZCB7cAQouaMT49A3NAg0G1857hjbKs81RmsqrO9olMqQSqGEVDKF8MaEiqLVHy9UWJv7+q9vtjudxSHt0pTb5weSEP13mWZgIQkyUwUihVSGRZlYBkdxMBLRkTJZJJ3iPSvVOqi1rgdX0A+l5gIw6w00RlFB4NMw73ZlcXwK0F0QU5TkP1AvGxDQUzKpFB2af+LqrZsdl/p7z+ZotZuadzZ6LTk595lFl04kpiqjDA3vXmiH4clxUEmkkErzBp9roRRIEqzl5bPm/Pzszt6eN6/Zbl+a87hbFXK5PAM5LpfIYG7R8+S57kt/LjUXTq+2FPjuOMb+opYr9Burazq4ZEp86uz7vxx23t82cHcEJBQFoWgk/72/t7/uvHeneMeWhot1VdUzf/3kw5MMG39460PVXVwy8aPe2wOtXJIjRYxcIum52f9Skdky//1tjx5CnnXZZ6Z20/G47vDeZ09NeBerblzuqhmc/vJ7Uqm8lk1xu67e/vzoyK2Bhjyjyf3yT1/4+aLXi58+//HPXtjT8kOFTHohCcD2DtlahsZGewitRpOOsrEESqp+zu2SRWM0jipJlkylhAKD0f/agcMHEonEH2xj9scnppyNGCoRkSBwJaVrBh+pq3/dlJt3zeNxV1IkhfsjIV0kGlkIhEJZFEWmAMNToksdnXyxpXDpdGf70wsel3UpFmtUSCSynzTt+d1d53gYyUdILpZ+ZDIYr0bZ+DBJUJ821GxqKylYdSxERxwNVRvh0dq60OjMdGHX9Z69qGoKZ1zzTzXt2PmeTrPiiujYa6/C58NDc+Fw2DYy4dipksq5uvXVx6Y8rqkr/X2A1jk2x2iVPxLOR/wgWI7jVQqFCEVoSCY5PEejCUSZOE/g+MXumwNmxIXNKJenNpRb2zasqwQMJQx/pvXF5+cXvbu0Wq1IQlB8MBykZQrFR5RIJE4x8YO24UHrUpzWpFEpI7IAhmREJZEkNDq9s3H7Y38TiyW3hxz23ci4aYVaTXi8XsyYrR86su+5t7BfnHzjpQs93fsFgnwb5WEQqaJ4fUnZluEJx0Gve14e9QdUpsKiuTKzpZtJptyRWIw3Za/UOOdnN45N3F9PUpRgMOT6cnPyrviWQh+khXTIkpObyyXYI2q1xk8Mjo0aZv1eg1KZVecLBEpIMUk45qaNk3OzBiVJpn7c8vyvpRJ5G8bzvliM4XhEKIlcRqwtXat+ZtcPHnv73JnjszNT+Si6NTEm9hQTjycRmyVIjQ2uYJAgNlRYf1VfWdVx5Vb/JpNerxdTYoZmaB1wCYjjOOoXo/UrNSsoJBWLbIKjEXeECMtI3d7F7CU6ui4Ui63IwCYIvPzhkrJZJIZKjku4NpRVtM/4vL0EYhuLqH0Dx/AbOOJ1pnHs392Uq1dpogMjtga7417tcJKvBxGekdt/CwySB9QwUA/BeIVaE6ypqOwzmSx/8oVC3SSSCfTWsjJnmEx8s0FkpAN54dr7eONzmixVA9LYevuXk+ULfp8eJVqBtjEpJY4btdm+NYWrxpkEe73UVPBZILoU5pHMhzNd8dv6wbW201+z1fzkrh707flffffI738DaplieY4E8mt72P/9X8W/BBgAGDoZevBSYnoAAAAASUVORK5CYII="
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9jb21tb24uanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9kb20uanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9ldmVudHMuanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9pZGIuanMiLCJ3Oi9TY3JpcHRzL3VzL2xpYi9wcm90b3R5cGVzLmpzIiwidzovU2NyaXB0cy91cy9saWIvcmVxdWVzdC5qcyIsInc6L1NjcmlwdHMvdXMvbGliL3RhYmxlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qva2V5cy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yL2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvcmVnZW5lcmF0b3IvcnVudGltZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2tleXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hLWZ1bmN0aW9uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuYW4tb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY2xhc3NvZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmNvcmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jdHguanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kZWZpbmVkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZGVzY3JpcHRvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5kb20tY3JlYXRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZW51bS1rZXlzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZXhwb3J0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZmFpbHMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5mb3Itb2YuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nZXQtbmFtZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nbG9iYWwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oYXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oaWRlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaHRtbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmludm9rZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlvYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1hcnJheS1pdGVyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXMtYXJyYXkuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pcy1vYmplY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNhbGwuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLWNyZWF0ZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLml0ZXItZGVmaW5lLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXRlci1kZXRlY3QuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyLXN0ZXAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5pdGVyYXRvcnMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmtleW9mLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQubGlicmFyeS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm1pY3JvdGFzay5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLm9iamVjdC1zYXAuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5wcm9wZXJ0eS1kZXNjLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUtYWxsLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zYW1lLXZhbHVlLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc2V0LXNwZWNpZXMuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNoYXJlZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNwZWNpZXMtY29uc3RydWN0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zdHJpY3QtbmV3LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudGFzay5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWludGVnZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC50by1pb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tbGVuZ3RoLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudG8tb2JqZWN0LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQudWlkLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQud2tzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5rZXlzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZi5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3Oi9TY3JpcHRzL3VzL3NjcmlwdHMvU3RhdHMgRm9ydW0vc3JjL2ljb25zLmpzIiwidzovU2NyaXB0cy91cy9zY3JpcHRzL1N0YXRzIEZvcnVtL3NyYy9zdHJ1Y3R1cmUuanMiLCJ3Oi9TY3JpcHRzL3VzL3NjcmlwdHMvU3RhdHMgRm9ydW0vdG1wX3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsU0FBUyxNQUFNLEdBQUUsRUFFaEI7O0FBRUQsTUFBTSxDQUFDLFNBQVMsR0FBRzs7Ozs7Ozs7QUFRakIsWUFBVSxFQUFFLG9CQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDO0FBQ2xDLFFBQUksT0FBTyxDQUFDOztBQUVaLFFBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFDO0FBQ3RCLGFBQU8sQ0FBQyxDQUFDO0tBQ1Y7O0FBRUQsV0FBTyxHQUFHLEFBQUMsR0FBRyxHQUFHLEdBQUcsR0FBSSxHQUFHLENBQUM7QUFDNUIsUUFBRyxHQUFHLEVBQUM7QUFDTCxhQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNqQyxNQUFJO0FBQ0gsYUFBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDMUM7O0FBRUQsV0FBTyxPQUFPLENBQUM7R0FDaEI7Ozs7Ozs7O0FBUUQsZUFBYSxF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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN0b0JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBOztBQ0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzNGQSxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2IsV0FBTyxFQUFFLDQ3SUFBNDdJO0FBQ3I4SSxVQUFNLEVBQUUsd3FCQUF3cUI7QUFDaHJCLFdBQU8sRUFBRSxvcUJBQW9xQjtBQUM3cUIsTUFBRSxFQUFFLDRxQkFBNHFCO0FBQ2hyQixVQUFNLEVBQUUsNFdBQTRXO0FBQ3BYLFNBQUssRUFBRSx3WEFBd1g7QUFDL1gsWUFBUSxFQUFFLG9HQUFvRztBQUM5RyxVQUFNLEVBQUUsb0dBQW9HO0FBQzVHLFlBQVEsRUFBRSw0R0FBNEc7QUFDdEgsVUFBTSxFQUFFLGd4RUFBZ3hFO0FBQ3h4RSxhQUFTLEVBQUUsaTJFQUFpMkU7Q0FDLzJFLENBQUM7Ozs7Ozs7Ozs7OztBQ1BGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBVTtBQUN6QixNQUFJLEVBQUUsQ0FBQzs7QUFFUCxJQUFFLEdBQUc7QUFDSCxVQUFNLEVBQUU7QUFDTixRQUFFLEVBQUUsSUFBSTtBQUNSLFVBQUksRUFBRSxHQUFHO0FBQ1QsWUFBTSxFQUFFLEdBQUc7QUFDWCxVQUFJLEVBQUUsR0FBRztBQUNULFlBQU0sRUFBRSxHQUFHO0tBQ1o7QUFDRCxTQUFLLEVBQUU7QUFDTCxRQUFFLEVBQUUsSUFBSTtBQUNSLFVBQUksRUFBRSxHQUFHO0FBQ1QsU0FBRyxFQUFFLEdBQUc7QUFDUixXQUFLLEVBQUUsR0FBRztBQUNWLFdBQUssRUFBRSxHQUFHO0FBQ1YsVUFBSSxFQUFFLEdBQUc7QUFDVCxZQUFNLEVBQUUsR0FBRztBQUNYLFNBQUcsRUFBRSxHQUFHO0tBQ1Q7QUFDRCxTQUFLLEVBQUM7QUFDSixRQUFFLEVBQUUsSUFBSTtBQUNSLFVBQUksRUFBRSxHQUFHO0FBQ1QsWUFBTSxFQUFFLEdBQUc7QUFDWCxXQUFLLEVBQUUsR0FBRztBQUNWLFdBQUssRUFBRSxHQUFHO0FBQ1YsV0FBSyxFQUFFLEdBQUc7S0FDWDtBQUNELFVBQU0sRUFBRTtBQUNOLFFBQUUsRUFBRSxJQUFJO0FBQ1IsV0FBSyxFQUFFLEdBQUc7QUFDVixVQUFJLEVBQUUsR0FBRztBQUNULFdBQUssRUFBRSxHQUFHO0FBQ1YsV0FBSyxFQUFFLEdBQUc7QUFDVixXQUFLLEVBQUUsR0FBRztBQUNWLGtCQUFZLEVBQUUsR0FBRztBQUNqQixXQUFLLEVBQUUsR0FBRztBQUNWLGtCQUFZLEVBQUUsR0FBRztBQUNqQixRQUFFLEVBQUUsR0FBRztBQUNQLFdBQUssRUFBRSxHQUFHO0FBQ1YsVUFBSSxFQUFFLEdBQUc7QUFDVCxVQUFJLEVBQUUsR0FBRztBQUNULFlBQU0sRUFBRSxHQUFHO0tBQ1o7QUFDRCxhQUFTLEVBQUU7QUFDVCxRQUFFLEVBQUUsSUFBSTtBQUNSLFVBQUksRUFBRSxHQUFHO0FBQ1QsVUFBSSxFQUFFLEdBQUc7S0FDVjtHQUNGLENBQUM7O0FBRUYsUUFBTSxFQUFFLENBQUM7O0FBRVQsU0FBTyxFQUFFLENBQUM7O0FBRVYsV0FBUyxNQUFNLEdBQUU7QUFDZixpQkFBWSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxDQUFDLEVBQUM7QUFDakMsbUJBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVMsR0FBRyxFQUFDO0FBQ3RDLFVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7T0FDekIsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0o7Q0FDRixDQUFDOzs7Ozs7Ozs7QUNwRUYsT0FBTyxDQUFDLDJCQUEyQixDQUFDLEVBQUUsQ0FBQztBQUN2QyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN0QyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN2QyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNqRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUM3QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFHbEQsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLEVBQUUsQ0FBQztBQUM5QyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDO0FBQzVDLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUd2QyxJQUFJLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQztBQUN0QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUM7O0FBRW5GLElBQUksSUFBSSxFQUFFLE1BQU0sQ0FBQzs7QUFFakIsSUFBTSxZQUFZLEdBQUc7QUFDbkIsTUFBSSxFQUFFLEVBQUU7QUFDUixZQUFVLEVBQUUsb0JBQW9CO0FBQ2hDLGFBQVcsRUFBRSxjQUFjO0FBQzNCLFlBQVUsRUFBRSxhQUFhO0FBQ3pCLGFBQVcsRUFBRSxrQ0FBa0M7QUFDL0MsZ0JBQWMsRUFBRSxnQ0FBZ0M7Q0FDakQsQ0FBQzs7QUFFRixRQUFRLEdBQUc7QUFDVCxRQUFNLEVBQUUsRUFBRTtBQUNWLFNBQU8sRUFBRSxFQUFFO0NBQ1osQ0FBQzs7QUFFRixZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDekMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDOztBQUUzQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzdCLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRWxELEdBQUcsR0FBRztBQUNKLFFBQU0sRUFBRSxFQUFFO0FBQ1YsU0FBTyxFQUFFLEVBQUU7QUFDWCxRQUFNLEVBQUUsRUFBRTtBQUNWLFFBQU0sRUFBRSxFQUFFO0NBQ1gsQ0FBQzs7QUFFRixHQUFHLEdBQUc7QUFDSixNQUFJLEVBQUU7QUFDSixTQUFLLEVBQUU7QUFDTCxVQUFJLEVBQUUsQ0FBQztBQUNQLFVBQUksRUFBRSxNQUFNO0tBQ2I7QUFDRCxVQUFNLEVBQUU7QUFDTixVQUFJLEVBQUUsQ0FBQztBQUNQLFVBQUksRUFBRSxJQUFJO0tBQ1g7R0FDRjtBQUNELE1BQUksRUFBQztBQUNILFNBQUssRUFBQyxFQUFFO0FBQ1IsVUFBTSxFQUFDLEVBQUU7R0FDVjtDQUNGLENBQUM7O0FBRUYsR0FBRyxHQUFHO0FBQ0osS0FBRyxFQUFFLENBQUM7QUFDTixPQUFLLEVBQUUsRUFBRTtBQUNULEtBQUcsRUFBRSxDQUFDO0FBQ04sT0FBSyxFQUFFLEVBQUU7QUFDVCxPQUFLLEVBQUUsRUFBRTtBQUNULE9BQUssRUFBRSxDQUFDO0FBQ1IsT0FBSyxFQUFFLENBQUM7QUFDUixHQUFDLEVBQUUsSUFBSTtBQUNQLEtBQUcsRUFBRSxJQUFJO0FBQ1QsVUFBUSxFQUFFLEVBQUU7QUFDWixTQUFPLEVBQUUsRUFBRTtBQUNYLGNBQVksRUFBRSxDQUFDO0FBQ2YsUUFBTSxFQUFDO0FBQ0wsU0FBSyxFQUFDO0FBQ0osUUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLFdBQUssRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM3QixXQUFLLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0IsVUFBSSxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDckMsV0FBSyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzVCLGtCQUFZLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRCxXQUFLLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsQyxZQUFNLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QyxZQUFNLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuQyxZQUFNLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyQyxZQUFNLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEMsWUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFCLFdBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixVQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsWUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFCLFlBQU0sRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM5QjtBQUNELFVBQU0sRUFBQztBQUNMLFFBQUUsRUFBRSxFQUFFO0FBQ04sVUFBSSxFQUFFLEVBQUU7QUFDUixXQUFLLEVBQUUsRUFBRTtBQUNULGNBQVEsRUFBRSxFQUFFO0tBQ2I7R0FDRjtBQUNELGtCQUFnQixFQUFFLEtBQUs7QUFDdkIsYUFBVyxFQUFFLENBQUM7QUFDZCxZQUFVLEVBQUUsQ0FBQztBQUNiLGFBQVcsRUFBRSxDQUFDO0NBQ2YsQ0FBQzs7OztBQU1GLFFBQVEsRUFBRSxDQUFDO0FBQ1gsbUJBQW1CLEVBQUUsQ0FBQzs7OztBQUl0QixTQUFTLFFBQVEsR0FBRTtBQUNqQixNQUFJLEdBQUcsRUFBRSxJQUFJLENBQUM7O0FBRWQsTUFBSSw2akdBdUpKLENBQUM7QUFDRCxNQUFJLCtEQUd3QixJQUFJLENBQUMsU0FBUyxvSUFLOUIsWUFBWSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUEsdUJBQ3ZCLGFBQWEsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBLDhEQUdwQixZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQSx5QkFDdkIsYUFBYSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUEseURBR3RCLFlBQVksR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBLHlCQUN2QixhQUFhLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQSx5REFHdEIsWUFBWSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUEseUJBQ3ZCLGFBQWEsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBLGFBQ2hDLENBQUM7QUFDTCxLQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuQyxLQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNyQyxLQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbkMsVUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDaEM7O0FBRUQsU0FBUyxtQkFBbUIsR0FBRTtBQUM1QixNQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQzs7QUFFaEMsS0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLEtBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXJCLFVBQVEsR0FBRyxDQUFDLENBQUMsK0NBQStDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEUsTUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRS9DLFFBQU0sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxvRkFFbEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNmLFVBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXBDLEtBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2QsS0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLE1BQUcsR0FBRyxHQUFHLEdBQUcsRUFBQztBQUNYLE9BQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3pCLE9BQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7R0FDcEQsTUFBSTtBQUNILFNBQUssR0FBRyxLQUFLLENBQUM7R0FDZjs7QUFFRCxXQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFVO0FBQ3JDLGVBQVcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUE7R0FDbkMsQ0FBQyxDQUFDO0NBQ0o7OztBQUdELFNBQWUsV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLO01BQ2hDLEdBQUc7Ozs7O0FBRVAsV0FBRyxHQUFHLENBQ0osRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUMsRUFDMUQsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FDNUIsQ0FBQzs7YUFFQyxLQUFLOzs7Ozs7eUNBQ08sRUFBRSxDQUFDLElBQUksQ0FBQzs7O0FBQXJCLFlBQUk7O0FBQ0osWUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Ozt5Q0FFZixJQUFJLENBQUMsU0FBUyxFQUFFOzs7QUFBN0IsWUFBSTs7OztBQUdKLGVBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEIsZUFBTyxFQUFFLENBQUM7Ozs7Ozs7Q0FDWDs7QUFHRCxTQUFTLGVBQWUsQ0FBQyxFQUFFLEVBQUM7QUFDMUIsU0FBTztBQUNMLE1BQUUsRUFBRSxFQUFFO0FBQ04sUUFBSSxFQUFFLEVBQUU7QUFDUixVQUFNLEVBQUUsRUFBRTtBQUNWLFFBQUksRUFBRSxDQUFDO0FBQ1AsVUFBTSxFQUFFLEVBQUU7R0FDWCxDQUFBO0NBQ0Y7O0FBRUQsU0FBUyxlQUFlLENBQUMsRUFBRSxFQUFDO0FBQzFCLFNBQU87QUFDTCxNQUFFLEVBQUUsRUFBRTtBQUNOLFNBQUssRUFBRSxDQUFDO0FBQ1IsUUFBSSxFQUFFLENBQUM7QUFDUCxTQUFLLEVBQUUsRUFBRTtBQUNULFNBQUssRUFBRSxFQUFFO0FBQ1QsU0FBSyxFQUFFLENBQUM7QUFDUixnQkFBWSxFQUFFLENBQUM7QUFDZixTQUFLLEVBQUUsQ0FBQztBQUNSLGdCQUFZLEVBQUUsQ0FBQztBQUNmLE1BQUUsRUFBRSxDQUFDO0FBQ0wsU0FBSyxFQUFFLENBQUM7QUFDUixRQUFJLEVBQUUsQ0FBQztBQUNQLFFBQUksRUFBRSxDQUFDO0FBQ1AsVUFBTSxFQUFFLENBQUM7R0FDVixDQUFBO0NBQ0Y7O0FBRUQsU0FBUyxjQUFjLENBQUMsRUFBRSxFQUFDO0FBQ3pCLFNBQU87QUFDTCxNQUFFLEVBQUUsRUFBRTtBQUNOLFFBQUksRUFBRSxFQUFFO0FBQ1IsT0FBRyxFQUFFLENBQUM7QUFDTixTQUFLLEVBQUUsQ0FBQztBQUNSLFNBQUssRUFBRSxDQUFDO0FBQ1IsUUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNaLFVBQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDZCxPQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQ1osQ0FBQTtDQUNGOztBQUVELFNBQVMsY0FBYyxDQUFDLEVBQUUsRUFBQztBQUN6QixTQUFPO0FBQ0wsTUFBRSxFQUFFLEVBQUU7QUFDTixRQUFJLEVBQUUsRUFBRTtBQUNSLFVBQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDZixTQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2IsU0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1QsQ0FBQTtDQUNGOztBQUVELFNBQVMsa0JBQWtCLENBQUMsRUFBRSxFQUFDO0FBQzdCLFNBQU87QUFDTCxNQUFFLEVBQUUsRUFBRTtBQUNOLFFBQUksRUFBRSxFQUFFO0FBQ1IsUUFBSSxFQUFFLEVBQUU7R0FDVCxDQUFBO0NBQ0Y7OztBQUdELFNBQWUsT0FBTztNQUNoQixLQUFLOzs7O1lBRUwsSUFBSSxDQUFDLEtBQUssYUFBVyxHQUFHLENBQUMsR0FBRyxDQUFHOzs7OztBQUNqQyxhQUFLLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNoQyxhQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDdkIsYUFBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQ3BCLGFBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUUvQixZQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQixZQUFJLENBQUMscUJBQXFCLENBQUMsQ0FDekIsRUFBQyxJQUFJLGNBQVksR0FBRyxDQUFDLEdBQUcsQUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFDdEMsRUFBQyxJQUFJLGVBQWEsR0FBRyxDQUFDLEdBQUcsQUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFDdkMsRUFBQyxJQUFJLGlCQUFlLEdBQUcsQ0FBQyxHQUFHLEFBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQzFDLENBQUMsQ0FBQztBQUNILFlBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDaEIsWUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25CLG1CQUFXLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7OztBQUVwQyw0QkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFakMsVUFBRSxHQUFHO0FBQ0gsZUFBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDO0FBQ3RGLGdCQUFNLEVBQUUsV0FBVyxDQUFDLENBQUMsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUM7U0FDekYsQ0FBQzs7O3lDQUVhLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDOzs7QUFBbkQsY0FBTTs7QUFDTixjQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFakMsaUJBQVMsRUFBRSxDQUFDOzs7Ozs7O0NBRWY7OztBQUdELFNBQVMsU0FBUyxHQUFFO0FBQ2xCLE1BQUksS0FBSyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDOztBQUU3QixPQUFLLEdBQUcsQ0FBQyxDQUFDLDZDQUE2QyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN4RixJQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTVCLEtBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSx5RkFBdUYsR0FBRyxDQUFDLEtBQUssb3FDQWM1RSxrQkFBa0IsRUFBRSw4REFDZCxrQkFBa0IsRUFBRSwwR0FFekIsbUJBQW1CLEVBQUUsd0RBQ3BCLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWxELElBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzlCLE9BQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUvQixnQkFBYyxFQUFFLENBQUM7OztBQUdqQixtQkFBaUIsRUFBRSxDQUFDOztBQUVwQixXQUFTLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUM7Ozs7QUFLM0UsR0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQ3hCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUM1QixPQUFPLEVBQUUsQ0FDVCxPQUFPLENBQ04sVUFBUyxJQUFJLEVBQUM7QUFDWixhQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxZQUFVO0FBQUMsbUJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUFDLENBQUMsQ0FBQztHQUM3RCxDQUNGLENBQUM7Ozs7QUFJSixVQUFRLEdBQUcsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakQsV0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsWUFBVTtBQUFDLGtCQUFjLENBQUMsUUFBUSxDQUFDLENBQUE7R0FBQyxDQUFDLENBQUM7Q0FDdEU7OztBQUdELFNBQVMsY0FBYyxDQUFDLFlBQVksRUFBQztBQUNuQyxNQUFJLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUM7O0FBRXBDLFVBQVEsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRXBDLE1BQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksT0FBTyxFQUFDO0FBQ25DLFlBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUNoQyxXQUFPO0dBQ1I7QUFDRCxNQUFHLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEVBQUM7QUFDMUMsV0FBTztHQUNSOztBQUVELE1BQUksR0FBRyxZQUFZLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM1QyxNQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNuQyxLQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7O0FBRW5CLFVBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbEMsVUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNoQyxVQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRWpDLE1BQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVyRCxnQkFBYyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztDQUNwQzs7O0FBR0QsU0FBUyxpQkFBaUIsR0FBRTtBQUMxQixNQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDbEQsTUFBSSxVQUFVLEdBQUcsYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDN0UsTUFBSSxXQUFXLENBQUM7O0FBRWhCLGFBQVcsR0FBRyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUMxQyxhQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ3RDLGFBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQzs7QUFFdEMsV0FBUyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7Q0FDakQ7OztBQUdELFNBQVMsa0JBQWtCLEdBQUU7QUFDM0IsNi9DQW1DUTtDQUNUOzs7QUFHRCxTQUFTLGtCQUFrQixHQUFFO0FBQzNCLE1BQUksSUFBSSxFQUFFLFFBQVEsQ0FBQzs7QUFFbkIsVUFBUSxHQUFHLEtBQUssR0FBRyxFQUFFLEdBQUcsVUFBVSxDQUFDO0FBQ25DLE1BQUksMGFBT3FFLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMseUhBQ0EsS0FBSyxveURBK0N0RCxRQUFRLGdOQU1QLFFBQVEsMkxBTVQsUUFBUSxvSkFJWSxRQUFRLGdWQVFHLFFBQVEsK0xBSU4sUUFBUSxpVUFXekYsQ0FBQzs7QUFFUixTQUFPLElBQUksQ0FBQztDQUNiOzs7QUFHRCxTQUFTLG1CQUFtQixHQUFFO0FBQzVCLDBpRUE4Q1E7Q0FDVDs7O0FBR0QsU0FBUyxjQUFjLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBQztBQUMxQyxNQUFJLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDOztBQUU5RyxRQUFNLEdBQUksQ0FBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFdBQVcsRUFBQyxTQUFTLEVBQUMsUUFBUSxFQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3JILE1BQUksR0FBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDM0QsTUFBSSxHQUFNLEtBQUssQ0FBQzs7QUFFaEIsTUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNyQyxNQUFJLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEMsTUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV6QixLQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLFFBQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsT0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QixNQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV2QixNQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRS9CLE1BQUksaU5BSW1FLE1BQU0sQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSwyV0FXMUUsQ0FBQzs7QUFFckIsV0FBUyxHQUFHLENBQUMsQ0FBQztBQUNkLGNBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFJLEtBQUssV0FBTSxJQUFJLENBQUcsQ0FBQztBQUNoRCxjQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQUFBQyxZQUFZLEVBQUUsQ0FBQztBQUMvRCxNQUFHLFlBQVksSUFBSSxDQUFDLENBQUMsRUFBRSxZQUFZLEdBQUcsQ0FBQyxDQUFDOztBQUV4QyxPQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBQztBQUMxQixRQUFHLElBQUksRUFBRSxNQUFNO0FBQ2YsUUFBSSxVQUFVLENBQUM7QUFDZixTQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBQztBQUM3QixVQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxHQUFHLFlBQVksRUFBQztBQUNqQyxZQUFJLHNCQUFvQixZQUFZLFlBQVMsQ0FBQztBQUM5QyxZQUFJLEdBQUcsWUFBWSxDQUFDO09BQ3JCO0FBQ0QsVUFBRyxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsRUFBQztBQUM1QixZQUFHLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksQ0FBQztBQUN4RCxZQUFJLEdBQUcsU0FBUyxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUNwRCxhQUFLLEdBQUcsU0FBUyxJQUFJLEdBQUcsR0FBRyxvQ0FBb0MsR0FBRyxFQUFFLENBQUM7QUFDckUsWUFBSSx3QkFBc0IsS0FBSyxlQUFVLElBQUksU0FBSSxNQUFNLFNBQUksSUFBSSxpQkFBWSxNQUFNLFNBQUksSUFBSSxTQUFJLElBQUksZ0JBQVcsU0FBUyxVQUFPLENBQUM7QUFDN0gsaUJBQVMsRUFBRSxDQUFDO09BQ2IsTUFBSTtBQUNILFlBQUksdUJBQW9CLENBQUMsR0FBQyxJQUFJLENBQUEsWUFBUyxDQUFDO0FBQ3hDLFlBQUksR0FBRyxJQUFJLENBQUM7QUFDWixjQUFNO09BQ1A7S0FDRjtBQUNELFFBQUksV0FBVyxDQUFDO0dBQ2pCOztBQUVELE1BQUksNkRBRTRCLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsZ0RBRWhELENBQUM7Ozs7QUFJaEIsR0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDVixJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FDdkMsT0FBTyxFQUFFLENBQ1QsT0FBTyxDQUNOLFVBQVMsTUFBTSxFQUFDO0FBQ2QsUUFBRyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQVMsRUFBQztBQUMxQyxVQUFHLE1BQU0sQ0FBQyxLQUFLLElBQUksYUFBYSxFQUFDO0FBQy9CLGlCQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFVO0FBQUMsaUJBQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FBQyxDQUFDLENBQUM7T0FDaEUsTUFBSztBQUNKLGlCQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFVO0FBQUMsbUJBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQUMsQ0FBQyxDQUFDO09BQzFFO0tBQ0YsTUFBSTtBQUNILGVBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQVU7QUFBQyx1QkFBZSxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQTtPQUFDLENBQUMsQ0FBQztLQUNqRjtHQUNGLENBQ0YsQ0FBQzs7O0FBR0osV0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUM7QUFDckMsUUFBRyxNQUFNLENBQUMsV0FBVyxJQUFJLEdBQUcsRUFBQztBQUMzQixXQUFLLEVBQUUsQ0FBQztBQUNSLFVBQUcsS0FBSyxJQUFJLENBQUMsRUFBQztBQUNaLFlBQUksRUFBRSxDQUFDO0FBQ1AsYUFBSyxHQUFHLEVBQUUsQ0FBQztPQUNaO0tBQ0YsTUFBSTtBQUNILFdBQUssRUFBRSxDQUFDO0FBQ1IsVUFBRyxLQUFLLElBQUksRUFBRSxFQUFDO0FBQ2IsWUFBSSxFQUFFLENBQUM7QUFDUCxhQUFLLEdBQUcsQ0FBQyxDQUFDO09BQ1g7S0FDRjtBQUNELFNBQUssR0FBRyxLQUFLLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDOztBQUV6QyxrQkFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUksS0FBSyxZQUFPLElBQUksQ0FBRyxHQUFHLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztHQUN4RTs7O0FBR0QsV0FBUyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksRUFBQztBQUMzQixRQUFJLEtBQUssQ0FBQzs7QUFFVixTQUFLLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0FBRXBDLFFBQUcsS0FBSyxJQUFJLEVBQUUsRUFBQztBQUNiLFdBQUssR0FBRyxJQUFJLENBQUM7QUFDYixXQUFLLEdBQUcsSUFBSSxDQUFDO0tBQ2QsTUFBSTtBQUNILFdBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLFVBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUM7S0FDL0I7QUFDRCxXQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVuQixrQkFBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUksS0FBSyxZQUFPLEtBQUssQ0FBRyxHQUFHLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztHQUN6RTs7O0FBR0QsV0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBQztBQUM1QyxnQkFBWSxDQUFDLGtCQUFrQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDeEUsS0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDbEQsS0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0dBQ2pEO0NBQ0Y7OztBQUdELFNBQVMsYUFBYSxDQUFDLElBQUksRUFBQzs7QUFFMUIsa0JBQWdCLEVBQUUsQ0FBQzs7QUFFbkIsVUFBUSxJQUFJLENBQUMsSUFBSTtBQUNmLFNBQUssZUFBZTtBQUFFLFdBQUssRUFBRSxDQUFDLEFBQUMsTUFBTTtBQUFBLEFBQ3JDLFNBQUssZ0JBQWdCO0FBQUUsWUFBTSxFQUFFLENBQUMsQUFBQyxNQUFNO0FBQUEsQUFDdkMsU0FBSyxpQkFBaUI7QUFBRSxhQUFPLEVBQUUsQ0FBQyxBQUFDLE1BQU07QUFBQSxBQUN6QyxTQUFLLGVBQWU7QUFBRSxvQkFBYyxFQUFFLENBQUMsQUFBQyxNQUFNO0FBQUEsQUFDOUMsU0FBSyxpQkFBaUI7QUFBRSw0QkFBc0IsRUFBRSxDQUFDLEFBQUMsTUFBTTtBQUFBLEdBQ3pEOzs7QUFHRCxXQUFTLEtBQUssR0FBRTtBQUNkLFFBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFbEMsWUFBTyxDQUFDLENBQUMsSUFBSTtBQUNYLFdBQUssT0FBTztBQUNWLHVCQUFlLENBQUMsT0FBTyxtQ0FBaUMsTUFBTSxDQUFDLEVBQUUsVUFBSyxNQUFNLENBQUMsSUFBSSxRQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM5RixrQkFBVSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLGNBQU07O0FBQUEsQUFFUixXQUFLLEtBQUs7QUFDUix1QkFBZSxFQUFFLENBQUM7QUFDbEIsY0FBTTtBQUFBLEtBQ1Q7R0FDRjs7O0FBR0QsV0FBUyxNQUFNLEdBQUU7QUFDZixRQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUM7UUFBRSxDQUFDLENBQUM7O0FBRXRDLFlBQU8sQ0FBQyxDQUFDLElBQUk7QUFDWCxXQUFLLE9BQU87QUFDVix1QkFBZSxDQUFDLE9BQU8sbUJBQW1CLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEQsMEJBQWtCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLGNBQU07O0FBQUEsQUFFUixXQUFLLFFBQVE7QUFDWCxTQUFDLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzdCLHVCQUFlLENBQUMsT0FBTyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0RCwyQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsbUJBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMsY0FBTTs7QUFBQSxBQUVSLFdBQUssS0FBSztBQUNSLHVCQUFlLENBQUMsT0FBTyxtQkFBbUIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxPQUFJLENBQUMsQ0FBQztBQUNoRSwwQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QixjQUFNO0FBQUEsS0FDVDtHQUNGOzs7QUFHRCxXQUFTLE9BQU8sR0FBRTtBQUNoQixRQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRVQsS0FBQyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztBQUVoQyxZQUFPLENBQUMsQ0FBQyxJQUFJO0FBQ1gsV0FBSyxPQUFPO0FBQ1YsdUJBQWUsQ0FBQyxPQUFPLDBCQUEwQixDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdELDJCQUFtQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QixjQUFNOztBQUFBLEFBRVIsV0FBSyxRQUFRO0FBQ1gsU0FBQyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlCLHVCQUFlLENBQUMsT0FBTywwQkFBMEIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3RCwyQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsb0JBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEMsY0FBTTs7QUFBQSxBQUVSLFdBQUssS0FBSztBQUNSLHVCQUFlLENBQUMsT0FBTywwQkFBMEIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN0RSwyQkFBbUIsRUFBRSxDQUFDO0FBQ3RCLGNBQU07QUFBQSxLQUNUO0dBQ0Y7OztBQUdELFdBQVMsUUFBUSxDQUFDLElBQUksRUFBQztBQUNyQixRQUFJLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDOztBQUV2QixTQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuQyxRQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksZ0NBQThCLElBQUksZ0JBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDakYsU0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLCtCQUE2QixJQUFJLFFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDekUsU0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFdEIsV0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO0dBQ25DOzs7QUFHRCxXQUFTLE9BQU8sQ0FBQyxJQUFJLEVBQUM7QUFDcEIsUUFBSSxJQUFJLEdBQUcsRUFBRTtRQUFFLEtBQUssR0FBRyxDQUFDO1FBQUUsRUFBRSxDQUFDOztBQUU3QixLQUFDLG1DQUFpQyxJQUFJLGdCQUFhLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUNuRSxVQUFTLElBQUksRUFBQztBQUNaLFFBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hCLFVBQUcsSUFBSSxJQUFJLGVBQWUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ25GLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RCLGFBQUssSUFBSSxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7T0FDeEMsTUFBSTtBQUNILFlBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDZCxhQUFLLEVBQUUsQ0FBQztPQUNUO0tBQ0YsQ0FDRixDQUFDOztBQUVGLFFBQUcsSUFBSSxJQUFJLGVBQWUsRUFBQztBQUN6QixXQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7S0FDaEQsTUFBSTtBQUNILFdBQUssR0FBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0tBQ3ZCOztBQUVELFdBQU8sRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUMsQ0FBQztHQUNwRDtDQUNGOzs7QUFHRCxTQUFTLFdBQVcsR0FBRTtBQUNwQixNQUFJLEVBQUUsQ0FBQzs7QUFFUCxNQUFHLE9BQU8sQ0FBQyx5REFBeUQsQ0FBQyxFQUFDO0FBQ3BFLFdBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsU0FBSyxFQUFFLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtBQUN0QixVQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNuQyxlQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUN4QztLQUNGO0FBQ0QsU0FBSyxFQUFFLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBQztBQUNwQixhQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzVCO0FBQ0Qsc0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsWUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ25CO0NBQ0Y7OztBQUdELFNBQVMsZUFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBQztBQUMvQyxNQUFJLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUM7O0FBRXBDLEtBQUcsK0RBQTZELElBQUksQ0FBQyxPQUFPLGVBQVksQ0FBQzs7QUFFekYsR0FBQyxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzdCLEdBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN6QixHQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDekIsR0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3pCLEdBQUMsR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUMxQixJQUFFLEdBQUcsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRWhDLE1BQUcsR0FBRyxJQUFJLE9BQU8sRUFBQztBQUNoQixLQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1osS0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNiLEtBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWixLQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hCLEtBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFNUIsT0FBRyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztHQUM3QjtBQUNELE1BQUcsR0FBRyxJQUFJLE1BQU0sRUFBQztBQUNmLFdBQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQyxPQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFN0IsV0FBTyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3QyxLQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDO0FBQ3JDLEtBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDakI7QUFDRCxNQUFHLEdBQUcsSUFBSSxPQUFPLEVBQUM7QUFDaEIsTUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNmO0FBQ0QsTUFBRyxHQUFHLElBQUksTUFBTSxFQUFDO0FBQ2YsTUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNaLEtBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztBQUM5QixLQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2pCLEtBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFNUIsT0FBRyxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztHQUM5QjtDQUNGOzs7QUFHRCxTQUFTLG1CQUFtQixDQUFDLENBQUMsRUFBQztBQUM3QixNQUFJLElBQUksRUFBRSxJQUFJLENBQUM7O0FBRWYsTUFBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPOztBQUVqQyxNQUFJLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDN0IsTUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMxQyxNQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUN0QixNQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsc0JBQXNCLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEUsTUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQixxQkFBbUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztDQUM3Qzs7QUFFRCxTQUFTLGdCQUFnQixHQUFFO0FBQ3pCLEdBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQzFELEdBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3JELEdBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztBQUVyRCxHQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztDQUN0RDs7O0FBR0QsU0FBUyxzQkFBc0IsR0FBRTtBQUMvQixHQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFcEQsR0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdEUsR0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Q0FDNUQ7OztBQUdELFNBQVMsaUJBQWlCLEdBQUU7QUFDMUIsR0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDcEQsR0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Q0FDdkQ7OztBQUdELFNBQVMsaUJBQWlCLEdBQUU7QUFDMUIsTUFBSSxNQUFNLEVBQUUsQ0FBQyxDQUFDOztBQUVkLEdBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3BELFFBQU0sR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN2QyxHQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVOLEdBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0FBQzlELEdBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztBQUM3RCxHQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU3QyxRQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7OztBQUcvQixXQUFTLGVBQWUsR0FBRTtBQUN4QixRQUFJLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDOztBQUVwQixRQUFJLEdBQUcsd0NBQXdDLENBQUM7QUFDaEQsUUFBSSxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7O0FBRXhDLGlCQUFZLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FDdkIsVUFBUyxFQUFFLEVBQUM7QUFDVixTQUFHLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLFVBQUksd0JBQXNCLEdBQUcsWUFBTyxHQUFHLFVBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksY0FBVyxDQUFDO0tBQ3RFLENBQ0YsQ0FBQzs7QUFFRixXQUFPLElBQUksQ0FBQztHQUNiOzs7QUFHRCxXQUFTLGdCQUFnQixHQUFFO0FBQ3pCLFFBQUksSUFBSSxDQUFDOztBQUVULFFBQUksR0FBRyx1Q0FBdUMsQ0FBQzs7QUFFL0MsS0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQzlFLE9BQU8sRUFBRSxDQUNULE9BQU8sQ0FDTixVQUFTLEdBQUcsRUFBQztBQUNYLE9BQUMsRUFBRSxDQUFDO0FBQ0osVUFBSSx3QkFBc0IsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxTQUFJLEdBQUcsQ0FBQyxLQUFLLFVBQUssQ0FBQyxVQUFLLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksY0FBVyxDQUFDO0tBQ3JILENBQ0YsQ0FBQzs7QUFFSixXQUFPLElBQUksQ0FBQztHQUNiO0NBQ0Y7OztBQUdELFNBQVMsWUFBWSxHQUFFO0FBQ3JCLE1BQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3pDLE1BQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUUxQyxNQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLE9BQU8sSUFBSSxNQUFNLElBQUksWUFBWSxFQUFFLE9BQU87O0FBRXJFLEdBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOztBQUVuRCxHQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUMxRCxHQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUNyRCxHQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUNyRCxHQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDaEQsUUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0NBQy9COzs7QUFHRCxTQUFTLGNBQWMsR0FBRTtBQUN2QixNQUFJLEdBQUcsQ0FBQzs7QUFFUixNQUFHLEdBQUcsQ0FBQyxHQUFHLEVBQUM7QUFDVCxPQUFHLGlEQUErQyxHQUFHLENBQUMsR0FBRyxrQkFBZSxDQUFDO0FBQ3pFLG1CQUFlLENBQUMsT0FBTyxFQUFFLGlEQUFpRCxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFbEYsUUFBRztBQUNELFNBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQ3hCLFVBQVUsR0FBRyxFQUFDO0FBQ1osZUFBTyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO0FBQ3JDLGFBQUssRUFBRSxDQUFDO0FBQ1IsMEJBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0Isd0JBQWdCLEVBQUUsQ0FBQztBQUNuQix1QkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3pCLEVBQ0QsWUFBVztBQUNULGdCQUFRLENBQUMscUNBQXFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ3ZELENBQ0YsQ0FBQztLQUNILENBQUEsT0FBTyxDQUFDLEVBQUM7QUFDUixjQUFRLENBQUMsc0NBQXNDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3hEO0dBQ0Y7OztBQUdELFdBQVMsS0FBSyxHQUFFO0FBQ2QsUUFBSSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDOztBQUUzQixRQUFJLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFM0csaUJBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUUsRUFBQztBQUMzQyxRQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JDLFVBQUcsRUFBRSxJQUFJLElBQUksRUFBQztBQUNaLFVBQUUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ2xCLFVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO09BQ1g7S0FDRixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFTLElBQUksRUFBQztBQUN6QixRQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsVUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDeEIsUUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUNsRCxRQUFFLEdBQUcsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFdEIsVUFBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBQztBQUN6QixXQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN4Qzs7QUFFRCxVQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUM7QUFDekMsV0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLG1CQUFtQixFQUFFLENBQUM7T0FDekQ7O0FBRUQsU0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDOUMsU0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7S0FDekMsQ0FBQyxDQUFDO0dBQ0o7Q0FDRjs7O0FBR0QsU0FBUyxzQkFBc0IsR0FBRTtBQUMvQixNQUFJLEdBQUcsRUFBRSxJQUFJLENBQUM7O0FBRWQsS0FBRyxxREFBbUQsR0FBRyxDQUFDLEdBQUcsc0JBQW1CLENBQUM7O0FBRWpGLE1BQUc7QUFDRCxPQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUN4QixVQUFVLEdBQUcsRUFBQztBQUNaLGFBQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQztBQUNyQyxTQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssRUFBRSxDQUFDO0FBQ3BCLFVBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDOztBQUU3QixxQkFBZSxDQUFDLE9BQU8sc0NBQW9DLEdBQUcsQ0FBQyxHQUFHLFVBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFLLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDakgseUJBQW1CLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxDQUFDLENBQUM7QUFDdkMsdUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQzlDLEVBQ0QsWUFBVztBQUNULGNBQVEsQ0FBQyw2REFBNkQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDL0UsQ0FDRixDQUFDO0dBQ0gsQ0FBQSxPQUFPLENBQUMsRUFBQztBQUNSLFlBQVEsQ0FBQyw4REFBOEQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDaEY7OztBQUdELFdBQVMsS0FBSyxHQUFFO0FBQ2QsUUFBSSxJQUFJLENBQUM7O0FBRVQsUUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLHVDQUFxQyxHQUFHLENBQUMsR0FBRyxRQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0csUUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUvQyxXQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNyQjtDQUNGOzs7QUFHRCxTQUFTLGlCQUFpQixDQUFDLEtBQUssRUFBQztBQUMvQixNQUFJLEdBQUcsQ0FBQzs7QUFFUixNQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsRUFBQztBQUNiLE9BQUcscURBQW1ELEdBQUcsQ0FBQyxHQUFHLGlCQUFZLEtBQUssQUFBRSxDQUFDOztBQUVqRixRQUFHO0FBQ0QsU0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDeEIsVUFBVSxHQUFHLEVBQUM7QUFDWix1QkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hCLGVBQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQztBQUNyQyxTQUFDLENBQUMsT0FBTyxDQUFDLENBQ1AsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQzNCLE9BQU8sRUFBRSxDQUNULE9BQU8sRUFBRSxDQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQixhQUFLLEVBQUUsQ0FBQzs7QUFFUixZQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFdkMsc0JBQWMsRUFBRSxDQUFDO0FBQ2pCLDBCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLHlCQUFpQixDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztPQUMvQyxFQUNELFlBQVc7QUFDVCxnQkFBUSxDQUFDLHVDQUF1QyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUN6RCxDQUNGLENBQUM7S0FDSCxDQUFBLE9BQU8sQ0FBQyxFQUFDO0FBQ1IsY0FBUSxDQUFDLHdDQUF3QyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMxRDtHQUNGLE1BQUk7QUFDSCxvQkFBZ0IsRUFBRSxDQUFDO0FBQ25CLG1CQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDekI7OztBQUdELFdBQVMsS0FBSyxDQUFDLElBQUksRUFBQztBQUNsQixRQUFJLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQzs7QUFFekIsUUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDdkIsUUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7O0FBRTlFLFFBQUcsSUFBSSxFQUFDO0FBQ04sVUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRW5DLFVBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsRUFBQztBQUM3QyxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDakIsZUFBTztPQUNSO0FBQ0QsVUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxFQUFDO0FBQzlDLGVBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoQixlQUFPO09BQ1I7QUFDRCxVQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEVBQUM7QUFDNUMsZUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ2pCO0FBQ0QsVUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDO0FBQ2hELGlCQUFTLEVBQUUsQ0FBQztPQUNiO0tBQ0Y7OztBQUdELGFBQVMsT0FBTyxDQUFDLEdBQUcsRUFBQztBQUNuQixVQUFJLEtBQUssQ0FBQzs7QUFFVixRQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3pDLFVBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDakIsVUFBSSxRQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQUFBRSxDQUFDO0FBQ3JILFVBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzs7QUFFL0IsVUFBRyxFQUFFLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBQztBQUNoQixVQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQztBQUNwQixVQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNuQyxNQUFJO0FBQ0gsWUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkUsVUFBRSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEIsYUFBSyxHQUFHLElBQUksQ0FBQztPQUNkOztBQUVELFVBQUcsRUFBRSxJQUFJLElBQUksRUFBQztBQUNaLFlBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbkUsWUFBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxtQkFBbUIsRUFBRSxDQUFDOztBQUVwRyxXQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZELFdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7T0FDN0MsTUFBSyxJQUFHLElBQUksSUFBSSxJQUFJLEVBQUM7QUFDcEIsWUFBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3pELFdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztPQUNsQztLQUNGOzs7QUFHRCxhQUFTLFNBQVMsR0FBRTtBQUNsQixVQUFJLElBQUksRUFBRSxFQUFFLENBQUM7QUFDYixVQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRSxRQUFFLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFeEIsVUFBRyxFQUFFLElBQUksSUFBSSxFQUFDO0FBQ1osWUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRSxZQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLG1CQUFtQixFQUFFLENBQUM7O0FBRXJHLFdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO09BQzVDLE1BQUssSUFBRyxJQUFJLElBQUksSUFBSSxFQUFDO0FBQ3BCLFlBQUcsR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDdkMsWUFBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3pELFdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUMvQjtLQUNGO0dBQ0Y7Q0FDRjs7O0FBR0QsU0FBZSxlQUFlO01BQ3hCLEdBQUcsRUFBRSxJQUFJLEVBa0JKLEtBQUs7Ozs7QUFBTCxhQUFLLFlBQUwsS0FBSyxHQUFFO0FBQ2QsY0FBSSxJQUFJLENBQUM7O0FBRVQsY0FBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6RyxjQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRS9DLGlCQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyQjs7QUF2QkQsV0FBRyxHQUFHLDBDQUEwQyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEdBQUcsbUJBQW1CLENBQUM7Ozt5Q0FFekQsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDOzs7QUFBaEQsZUFBTyxDQUFDLFNBQVM7O0FBRWpCLGNBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUM7QUFDekIsWUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdkMsWUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDOztBQUU1Qyx1QkFBZSxDQUFDLE9BQU8sbUNBQWlDLE1BQU0sQ0FBQyxFQUFFLFVBQUssTUFBTSxDQUFDLElBQUksUUFBSyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ25HLDJCQUFtQixDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7O0FBRXhDLGtCQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7O0NBWTdDOzs7O0FBSUQsU0FBZSxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRO01BQ3pDLEdBQUcsRUFBRSxLQUFLLEVBZ0VMLEtBQUssRUE2SUwsYUFBYTs7OztBQUFiLHFCQUFhLFlBQWIsYUFBYSxHQUFFO0FBQ3RCLGNBQUksTUFBTSxDQUFDOztBQUVYLGdCQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDdEIsYUFBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLE9BQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7O0FBRXRDLHVCQUFZLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFTLEdBQUcsRUFBQztBQUN2QyxnQkFBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDOUMsaUJBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxPQUFJLEVBQUUsQ0FBQzthQUNyQjtXQUNGLENBQUMsQ0FBQztTQUNKOztBQXhKUSxhQUFLLFlBQUwsS0FBSyxDQUFDLEVBQUUsRUFBQztBQUNoQixjQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDO0FBQ3pDLGNBQUksS0FBSyxDQUFDOztBQUVWLFlBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO0FBQ2QsYUFBRyxHQUFHLEtBQUssRUFBRSxDQUFDOzs7O0FBSWQsZUFBSyxHQUFHLElBQUksQ0FBQyxNQUFNLGFBQVcsTUFBTSxDQUFDLEVBQUUsRUFBSSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRXRELGlCQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVuQixjQUFHLEtBQUssSUFBSSxJQUFJLEVBQUM7QUFDZixrQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDOztBQUVuQixpQkFBSyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM1QixpQkFBSyxDQUFDLElBQUksR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUN2QixpQkFBSyxDQUFDLE1BQU0sR0FBRyxTQUFTLEVBQUUsQ0FBQztBQUMzQixpQkFBSyxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztBQUN6QixpQkFBSyxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztBQUN6QixpQkFBSyxDQUFDLEtBQUssR0FBRyxPQUFPLEVBQUUsQ0FBQztXQUN6QixNQUFJO0FBQ0gsaUJBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLGlCQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO0FBQ3pCLGlCQUFLLENBQUMsS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO1dBQzFCOztBQUVELGlCQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JuQixtQkFBUyxRQUFRLEdBQUU7QUFDakIsZ0JBQUksTUFBTSxJQUFJLElBQUksRUFBRTtBQUNsQixpQkFBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDcEIsaUJBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDM0Isb0JBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRS9CLG9CQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNqQixvQkFBTSxDQUFDLElBQUksR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUN4QixvQkFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUUsQ0FBQztBQUMxQixvQkFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDbkIsb0JBQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUyxFQUFFLENBQUM7YUFDN0IsTUFBTTtBQUNMLG9CQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDO2FBQzNCO0FBQ0Qsa0JBQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRXZDLGdCQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFDbEIsaUJBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNuRSxvQkFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUN4Qzs7QUFFRCxnQkFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDbEMsb0JBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLG1CQUFtQixFQUFFLENBQUM7YUFDaEQ7QUFDRCxpQkFBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFckMsZ0JBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUMzQixtQkFBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDckI7V0FDRjs7O0FBR0QsbUJBQVMsS0FBSyxHQUFFO0FBQ2QsZ0JBQUksRUFBRSxDQUFDOztBQUVQLGNBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9CLGNBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFOUIsbUJBQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1dBQ25COzs7QUFHRCxtQkFBUyxPQUFPLEdBQUU7QUFDaEIsbUJBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztXQUNsQzs7O0FBR0QsbUJBQVMsUUFBUSxHQUFFO0FBQ2pCLGdCQUFJLEtBQUssQ0FBQzs7QUFFVixpQkFBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzFDLGlCQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV0QixnQkFBRyxLQUFLLElBQUksSUFBSSxFQUFDO0FBQ2YscUJBQU8sQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDbkIsTUFBSTtBQUNILHFCQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNoQztXQUNGOzs7QUFHRCxtQkFBUyxRQUFRLEdBQUU7QUFDakIsZ0JBQUksSUFBSSxDQUFDOztBQUVULGdCQUFJLEdBQUcsQ0FDTCxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQ2pDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FDbEMsQ0FBQzs7QUFFRixtQkFBTyxJQUFJLENBQUM7V0FDYjs7O0FBR0QsbUJBQVMsT0FBTyxHQUFFO0FBQ2hCLGdCQUFJLElBQUksQ0FBQzs7QUFFVCxnQkFBSSxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO0FBQy9CLGdCQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QixnQkFBSSxHQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFHLENBQUM7QUFDNUUsZ0JBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV4QixtQkFBTyxJQUFJLENBQUM7V0FDYjs7O0FBR0QsbUJBQVMsU0FBUyxHQUFFO0FBQ2xCLGdCQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDOztBQUVoQixhQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ3pDLGdCQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hCLGNBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFckMsbUJBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7V0FDM0I7U0FDRjs7QUF4TUQsV0FBRyxnREFBOEMsR0FBRyxDQUFDLEdBQUcsaUJBQVksS0FBSyxBQUFFLENBQUM7QUFDNUUsYUFBSyxHQUFHLENBQUMsQ0FBQzs7Y0FFUCxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUE7Ozs7Ozt5Q0FFYyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUM7OztBQUFoRCxlQUFPLENBQUMsU0FBUzs7QUFDakIsdUJBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEIsU0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNQLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUNuRCxFQUFFLENBQUMsT0FBTyxDQUFDLENBQ1gsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQ2pELE9BQU8sRUFBRSxDQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbEIsYUFBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQzNDLFlBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDOzs7Ozs7QUFRcEUsa0JBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUN2RCx1QkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7Ozs7O0NBOEozQjs7O0FBR0QsU0FBUyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUM7QUFDOUIsTUFBSSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7O0FBRTdCLFFBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN0QixNQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ1YsT0FBSyxHQUFHLENBQUMsQ0FBQzs7QUFFVixPQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUM7QUFDaEIsUUFBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDOUMsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLFdBQUssSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDaEQsVUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRSxNQUFNO0tBQzlCO0dBQ0Y7QUFDRCxPQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7QUFDL0MscUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsYUFBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ25DOzs7QUFHRCxTQUFTLG1CQUFtQixDQUFDLEVBQUUsRUFBQztBQUM5QixNQUFJLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQzs7QUFFL0IsT0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUV6QixPQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDNUIsT0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRTVDLE9BQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM1QixPQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFNUMsT0FBSyxHQUFHLEFBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUksQ0FBQyxDQUFDOztBQUVsQyxTQUFPLEVBQUMsRUFBRSxFQUFFLEtBQUssRUFBRyxLQUFLLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7Q0FDckQ7OztBQUdELFNBQVMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDO0FBQ3BDLE1BQUksSUFBSSxFQUFFLEtBQUssQ0FBQzs7QUFFaEIsS0FBRyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDOUIsT0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFOUIsTUFBRyxLQUFLLEdBQUcsR0FBRyxFQUFDO0FBQ2IsUUFBSSxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNwQyxjQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUM3QyxNQUFJO0FBQ0gsc0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsZ0JBQVksRUFBRSxDQUFDO0FBQ2YsbUJBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN6Qjs7O0FBR0QsV0FBUyxVQUFVLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUM7QUFDbkMsUUFBSSxHQUFHLENBQUM7O0FBRVIsT0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixPQUFHLEdBQUcsMkNBQTJDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxPQUFPLEdBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRSxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQzs7QUFFeEcsUUFBRyxFQUFFLEdBQUcsS0FBSyxFQUFDO0FBQ1osVUFBRztBQUNELFdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQ3hCLFVBQVUsR0FBRyxFQUFDO0FBQ1osaUJBQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQztBQUNyQyxlQUFLLEVBQUUsQ0FBQztBQUNSLHdCQUFjLEVBQUUsQ0FBQztTQUNsQixFQUNELFlBQVc7QUFDVCxrQkFBUSxDQUFDLDhCQUE4QixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQyx1QkFBYSxFQUFFLENBQUM7U0FDakIsQ0FDRixDQUFDO09BQ0gsQ0FBQSxPQUFPLENBQUMsRUFBQztBQUNSLGdCQUFRLENBQUMsK0JBQStCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2hELHFCQUFhLEVBQUUsQ0FBQztPQUNqQjtLQUNGLE1BQUk7QUFDSCxlQUFTLEVBQUUsQ0FBQztLQUNiOzs7QUFHRCxhQUFTLEtBQUssR0FBRTtBQUNkLFVBQUksS0FBSyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbEMsVUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDOztBQUVkLFdBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLDhDQUE4QyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUUzRixPQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUMvRCxVQUFTLElBQUksRUFBQztBQUNaLFlBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQy9CLFlBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ25DLENBQ0YsQ0FBQztBQUNGLFFBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ2hCLFlBQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDOztBQUVuQixXQUFJLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQztBQUM3QixXQUFHLEdBQUcsS0FBSyxFQUFFLENBQUM7O0FBRWQsWUFBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBQztBQUMxQixhQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQzlDO0FBQ0QsY0FBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTFCLFlBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFDO0FBQ2hDLGdCQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxtQkFBbUIsRUFBRSxDQUFDO1NBQ2hEO0FBQ0QsVUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUU1QixhQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDakIsV0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFZCxVQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDWCxVQUFFLENBQUMsSUFBSSxHQUFHLFdBQVcsRUFBRSxDQUFDOztBQUV4QixTQUFDLEdBQUcsUUFBUSxFQUFFLENBQUM7QUFDZixXQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7QUFDakIsVUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakIsVUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUVuRCxZQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFDO0FBQzdCLFlBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtPQUNGOztBQUVELG1CQUFhLEVBQUUsQ0FBQzs7O0FBR2hCLGVBQVMsS0FBSyxHQUFFO0FBQ2QsWUFBSSxFQUFFLENBQUM7O0FBRVAsVUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDMUQsVUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRWhCLGVBQU8sRUFBRSxDQUFDO09BQ1g7OztBQUdELGVBQVMsT0FBTyxHQUFFO0FBQ2hCLGVBQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUM3RDs7O0FBR0QsZUFBUyxXQUFXLEdBQUU7QUFDcEIsWUFBSSxJQUFJLENBQUM7O0FBRVQsWUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRS9FLFlBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDbkQsWUFBSSxHQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQUFBRSxDQUFDO0FBQ3JELFlBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzs7QUFFL0IsZUFBTyxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQztPQUN4Qzs7QUFFRCxlQUFTLFFBQVEsR0FBRTtBQUNqQixZQUFJLEtBQUssQ0FBQzs7QUFFVixhQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoRSxhQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUEsQ0FBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoRixlQUFPLEtBQUssQ0FBQztPQUNkO0tBQ0Y7OztBQUdELGFBQVMsU0FBUyxHQUFFO0FBQ2xCLFdBQUssRUFBRSxDQUFDO0FBQ1IsU0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLE9BQUksRUFBRSxDQUFDO0FBQ3BCLHFCQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEIsd0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsaUJBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNwRDs7O0FBR0QsYUFBUyxhQUFhLEdBQUU7QUFDdEIsUUFBRSxFQUFFLENBQUM7QUFDTCxxQkFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTywyQkFBeUIsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksY0FBUyxFQUFFLFNBQUksS0FBSyxPQUFJLENBQUMsQ0FBQztBQUN4SCxnQkFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9DOztHQUVGO0NBQ0Y7OztBQUdELFNBQVMsbUJBQW1CLENBQUMsS0FBSyxFQUFDO0FBQ2pDLE1BQUksTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUM7O0FBRXpCLFFBQU0sR0FBRyxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDO0FBQ2xELE1BQUksR0FBRyxFQUFFLENBQUM7O0FBRVYsU0FBTSxNQUFNLEVBQUUsRUFBQztBQUNiLFVBQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMxQyxRQUFHLEtBQUssSUFBSSxJQUFJLEVBQUM7QUFDZixVQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNoQyxNQUFJO0FBQ0gsVUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUM7QUFDMUIsWUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7T0FDaEM7S0FDRjtHQUNGO0FBQ0QsT0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNoQyxxQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFM0IsY0FBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ3BDOzs7QUFHRCxTQUFTLFlBQVksQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQztBQUNwQyxNQUFJLEdBQUcsRUFBRSxNQUFNLENBQUM7O0FBRWhCLE1BQUcsRUFBRSxHQUFHLEtBQUssRUFBQztBQUNaLFVBQU0sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9CLE9BQUcsNENBQTBDLElBQUksQ0FBQyxFQUFFLENBQUMsQUFBRSxDQUFDO0FBQ3hELFFBQUc7QUFDRCxTQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUN4QixVQUFVLEdBQUcsRUFBQztBQUNaLGVBQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQztBQUNyQyxhQUFLLEVBQUUsQ0FBQztBQUNSLDBCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLHNCQUFjLEVBQUUsQ0FBQztBQUNqQixrQkFBVSxFQUFFLENBQUM7T0FDZCxFQUNELFlBQVc7QUFDVCxnQkFBUSxDQUFDLHdCQUF3QixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QyxrQkFBVSxFQUFFLENBQUM7T0FDZCxDQUNGLENBQUM7S0FDSCxDQUFBLE9BQU8sQ0FBQyxFQUFDO0FBQ1IsY0FBUSxDQUFDLHlCQUF5QixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMzQztHQUNGLE1BQUk7QUFDSCxvQkFBZ0IsRUFBRSxDQUFDO0FBQ25CLG1CQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDekI7OztBQUdELFdBQVMsVUFBVSxHQUFFO0FBQ25CLE1BQUUsRUFBRSxDQUFDO0FBQ0wsbUJBQWUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDN0MsZ0JBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztHQUNwRDs7O0FBR0QsV0FBUyxLQUFLLEdBQUU7QUFDZCxRQUFJLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQzs7QUFFakUsVUFBTSxHQUFHLElBQUksQ0FBQztBQUNkLFFBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRWpELFNBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLHFEQUFxRCxDQUFDLENBQUM7QUFDL0UsVUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsMERBQTBELENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNuSCxjQUFVLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO0FBQ3JHLGFBQVMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLDhDQUE4QyxDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDMUcsWUFBUSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsMkRBQTJELENBQUMsQ0FBQzs7QUFFeEYsUUFBRyxRQUFRLENBQUMsTUFBTSxFQUFDO0FBQ2pCLFVBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEMsWUFBTSxHQUFHLFVBQVUsQ0FBQztLQUNyQjtBQUNELFFBQUcsTUFBTSxDQUFDLE1BQU0sRUFBQztBQUNmLFVBQUksR0FBRyxDQUFDLENBQUM7QUFDVCxZQUFNLEdBQUcsV0FBVyxDQUFDO0tBQ3RCO0FBQ0QsUUFBRyxVQUFVLENBQUMsTUFBTSxFQUFDO0FBQ25CLFVBQUksR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDbEMsWUFBTSxHQUFHLFVBQVUsQ0FBQztLQUNyQjtBQUNELFFBQUcsU0FBUyxDQUFDLE1BQU0sRUFBQztBQUNsQixVQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2pDLFlBQU0sR0FBRyxXQUFXLENBQUM7S0FDdEI7QUFDRCxRQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUM7QUFDZCxVQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ1QsWUFBTSxHQUFHLGNBQWMsQ0FBQztLQUN6Qjs7QUFFRCxVQUFNLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7QUFDNUIsVUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0dBQzNCOzs7QUFHRCxXQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUM7QUFDdEIsUUFBSSxJQUFJLENBQUM7O0FBRVQsUUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDOUIsUUFBSSxHQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEFBQUUsQ0FBQztBQUNsRSxRQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7O0FBRS9CLFdBQU8sSUFBSSxDQUFDO0dBQ2I7Q0FDRjs7O0FBR0QsU0FBUyxnQkFBZ0IsR0FBRTtBQUN6QixNQUFJLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDO0FBQ3hDLE1BQUksS0FBSztNQUFFLENBQUM7TUFBRSxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUUzQixPQUFLLEdBQUc7QUFDTixRQUFJLEVBQUUsRUFBRTtBQUNSLFlBQVEsRUFBRSxFQUFFO0FBQ1osVUFBTSxFQUFFLEVBQUU7QUFDVixPQUFHLEVBQUUsQ0FBQztBQUNOLFdBQU8sRUFBRSxFQUFFO0FBQ1gsV0FBTyxFQUFFLEVBQUU7QUFDWCxPQUFHLEVBQUUsQ0FBQztBQUNOLFFBQUksRUFBRSxFQUFFO0dBQ1QsQ0FBQzs7QUFFRixJQUFFLEdBQUc7QUFDSCxRQUFJLEVBQUUsZ0JBQWdCO0FBQ3RCLFVBQU0sRUFBRSw4QkFBOEI7QUFDdEMsVUFBTSxFQUFFLDJCQUEyQjtHQUNwQyxDQUFDOztBQUVGLE9BQUssR0FBRyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM5QixHQUFDLEdBQUc7QUFDRixnQkFBWSxFQUFFLHdCQUFVO0FBQUMsbUJBQVksRUFBRSxDQUFBO0tBQUM7QUFDeEMsZUFBVyxFQUFFLHVCQUFVO0FBQUMsa0JBQVcsRUFBRSxDQUFBO0tBQUM7QUFDdEMsYUFBUyxFQUFFLHFCQUFVO0FBQUMsZ0JBQVMsRUFBRSxDQUFBO0tBQUM7QUFDbEMsUUFBSSxFQUFFLGdCQUFVO0FBQUMsV0FBSSxFQUFFLENBQUE7S0FBQztHQUN6QixDQUFDOztBQUdGLFFBQU0sR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN2QyxPQUFLLENBQUMsT0FBTyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0RyxPQUFLLENBQUMsT0FBTyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1RixPQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDM0YsS0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN6RSxPQUFLLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQUFBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQzs7QUFFckQsTUFBRyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBQztBQUN0QixRQUFHLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFDO0FBQ2hCLFdBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzdCLGFBQU87S0FDUjtBQUNELFFBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN6RCxRQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7R0FDekQ7O0FBRUQsTUFBRyxLQUFLLENBQUMsSUFBSSxJQUFJLE1BQU0sRUFBQztBQUN0QixRQUFHLENBQUMsT0FBTyxhQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHlCQUFzQixFQUFFLE9BQU87R0FDcEUsTUFBSTtBQUNILFFBQUcsQ0FBQyxPQUFPLG1CQUFpQixFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxxQkFBZ0IsR0FBRyx5QkFBc0IsRUFBRSxPQUFPO0dBQzdGOztBQUVELE1BQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O0FBR1IsV0FBUyxLQUFJLEdBQUU7QUFDYixLQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUNyQixJQUFJLENBQUMsZUFBZSxDQUFDLENBQ3JCLE9BQU8sRUFBRSxDQUNULE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFcEIsU0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUUxQixvQkFBZ0IsRUFBRSxDQUFDO0FBQ25CLG1CQUFlLENBQUMsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMzRSx1QkFBbUIsQ0FBQyxBQUFDLEtBQUssR0FBRyxLQUFLLEdBQUksR0FBRyxDQUFDLENBQUM7QUFDM0MsYUFBUyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDNUI7Ozs7QUFJRCxXQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUM7QUFDdEIsUUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDOztBQUViLE1BQUUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixRQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFWCxRQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUM7QUFDdkIsV0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDZCxVQUFFLEVBQUUsRUFBRTtBQUNOLFlBQUksRUFBRSxJQUFJO0FBQ1YsY0FBTSxFQUFFLGtCQUFrQixDQUFDLElBQUksQ0FBQztPQUNqQyxDQUFDLENBQUM7S0FDSjtHQUNGOzs7QUFHRCxXQUFTLFVBQVMsR0FBRTtBQUNsQixRQUFHO0FBQ0QsU0FBRyxDQUFDLHdDQUF3QyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM3RCxVQUFVLEdBQUcsRUFBQztBQUNaLGVBQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQztBQUNyQyxhQUFLLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDekYsYUFBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDOztBQUVuRixZQUFJLEVBQUUsQ0FBQztPQUNSLEVBQ0QsWUFBVztBQUNULGdCQUFRLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ3BDLENBQ0YsQ0FBQztLQUNILENBQUEsT0FBTSxDQUFDLEVBQUM7QUFDUCxjQUFRLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3BDO0dBQ0Y7OztBQUdELFdBQVMsWUFBVyxHQUFHO0FBQ3JCLFFBQUc7QUFDRCxTQUFHLENBQUMsMERBQTBELEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDM0YsVUFBVSxHQUFHLEVBQUM7QUFDWixlQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7QUFDckMsYUFBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFNBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDUCxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUNkLE9BQU8sRUFBRSxDQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbEIsWUFBSSxFQUFFLENBQUM7T0FDUixFQUNELFlBQVc7QUFDVCxnQkFBUSwrQ0FBK0MsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQzlELENBQ0YsQ0FBQztLQUNILENBQUEsT0FBTyxDQUFDLEVBQUM7QUFDUixjQUFRLCtDQUErQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDOUQ7OztBQUdELGFBQVMsS0FBSyxDQUFDLE1BQU0sRUFBQztBQUNwQixVQUFJLEVBQUUsRUFBRSxJQUFJLENBQUM7O0FBRWIsUUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsVUFBSSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDMUIsVUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUM3QyxVQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVmLFdBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQzNCO0dBQ0Y7OztBQUdELFdBQVMsYUFBWSxHQUFFO0FBQ3JCLFFBQUc7QUFDRCxTQUFHLENBQUMsNERBQTRELEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDN0YsVUFBVSxHQUFHLEVBQUM7QUFDWixlQUFPLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7QUFDckMsYUFBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFNBQUMsQ0FBQyxPQUFPLENBQUMsQ0FDUCxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FDM0MsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUNSLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUMzQixPQUFPLEVBQUUsQ0FDVCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWxCLFlBQUksRUFBRSxDQUFDO09BQ1IsRUFDRCxZQUFXO0FBQ1QsZ0JBQVEsK0NBQStDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztPQUM5RCxDQUNGLENBQUM7S0FDSCxDQUFBLE9BQU8sQ0FBQyxFQUFDO0FBQ1IsY0FBUSwrQ0FBK0MsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzlEOztBQUVELGFBQVMsS0FBSyxDQUFDLElBQUksRUFBQztBQUNsQixhQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3JEO0dBQ0Y7OztBQUdELFdBQVMsSUFBSSxDQUFDLElBQUksRUFBQztBQUNqQixRQUFHLElBQUksSUFBSSxJQUFJLEVBQUM7QUFDZCxPQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUNuQixhQUFPO0tBQ1I7O0FBRUQsS0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ3pDO0NBQ0Y7OztBQUdELFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDO0FBQ3JDLE1BQUcsS0FBSyxHQUFHLEtBQUssRUFBQztBQUNmLFFBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUM7QUFDeEIsZ0JBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDMUI7QUFDRCxRQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFDO0FBQ3hCLFVBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNoSDs7QUFFRCxZQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzs7QUFFN0MsU0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ1osU0FBSyxFQUFFLENBQUM7O0FBRVIsbUJBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4QixhQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztHQUN4RSxNQUFJO0FBQ0gsbUJBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN6QjtDQUNGOzs7QUFHRCxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFDO0FBQzdCLE1BQUksSUFBSSxDQUFDOztBQUVULE1BQUksMkJBQXlCLEtBQUssQ0FBQyxHQUFHLGdCQUFXLEtBQUssQ0FBQyxNQUFNLGdCQUFXLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxpQkFBWSxLQUFLLENBQUMsT0FBTyxhQUFRLEtBQUssQ0FBQyxPQUFPLEFBQUUsQ0FBQzs7QUFFakosTUFBRztBQUNELE9BQUcsQ0FBQyx3Q0FBd0MsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUQsWUFBVztBQUNULG9CQUFjLEVBQUUsQ0FBQztLQUNsQixFQUNELFlBQVc7QUFDVCxjQUFRLHNCQUFvQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDN0QsQ0FDRixDQUFDO0dBQ0gsQ0FBQSxPQUFPLENBQUMsRUFBQztBQUNSLFlBQVEsc0JBQW9CLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztHQUM3RDtDQUNGOzs7QUFHRCxTQUFTLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFDO0FBQy9CLE1BQUksSUFBSSxFQUFFLE1BQU0sQ0FBQzs7QUFFakIsTUFBSSx1QkFBcUIsS0FBSyxDQUFDLEdBQUcsZ0JBQVcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEFBQUUsQ0FBQztBQUN4RSxRQUFNLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDNUIsUUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUUsQ0FBQyxNQUFNLENBQUM7O0FBRS9FLE1BQUc7QUFDRCxPQUFHLENBQUMsNENBQTRDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQ2xFLFlBQVc7QUFDVCxvQkFBYyxFQUFFLENBQUM7QUFDakIsWUFBTSxHQUFHLENBQUMsQ0FBQztBQUNYLHdCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzVCLEVBQ0QsWUFBVztBQUNULGNBQVEsMkJBQXlCLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNsRSxDQUNGLENBQUM7R0FDSCxDQUFBLE9BQU8sQ0FBQyxFQUFDO0FBQ1IsWUFBUSwyQkFBeUIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQ2xFO0NBQ0Y7Ozs7QUFJRCxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFDO0FBQ3hCLE1BQUksSUFBSSxXQUFTLEdBQUcsMEJBQXFCLEVBQUUsQUFBRSxDQUFDOztBQUU5QyxNQUFHO0FBQ0QsT0FBRyxDQUFDLDRDQUE0QyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUNsRSxZQUFXO0FBQ1Qsb0JBQWMsRUFBRSxDQUFDO0tBQ2xCLEVBQ0QsWUFBVztBQUNULGNBQVEsZ0JBQWMsRUFBRSxFQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNuQyxDQUNGLENBQUM7R0FDSCxDQUFBLE9BQU8sQ0FBQyxFQUFDO0FBQ1IsWUFBUSxlQUFhLEVBQUUsRUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDbEM7Q0FDRjs7O0FBR0QsU0FBUyxjQUFjLENBQUMsSUFBSSxFQUFDO0FBQzNCLFNBQU87QUFDTCxRQUFJLEVBQUUsSUFBSTtBQUNWLFVBQU0sRUFBRTtBQUNOLFVBQUksRUFBRSxFQUFFO0FBQ1IsVUFBSSxFQUFFLENBQUM7S0FDUjtBQUNELFVBQU0sRUFBQyxFQUFFO0dBQ1YsQ0FBQztDQUNIOztBQUVELFNBQVMsbUJBQW1CLEdBQUU7QUFDNUIsU0FBTztBQUNMLE1BQUUsRUFBRSxDQUFDO0FBQ0wsU0FBSyxFQUFFLENBQUM7QUFDUixRQUFJLEVBQUUsQ0FBQztBQUNQLFVBQU0sRUFBRSxDQUFDO0FBQ1QsVUFBTSxFQUFFLENBQUM7QUFDVCxVQUFNLEVBQUUsS0FBSztBQUNiLFNBQUssRUFBRSxDQUFDO0FBQ1IsUUFBSSxFQUFFLENBQUM7QUFDUCxTQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2IsU0FBSyxFQUFFLEVBQUU7QUFDVCxVQUFNLEVBQUUsRUFBRTtHQUNYLENBQUM7Q0FDSDs7O0FBR0QsU0FBUyxjQUFjLEdBQUU7QUFDdkIsTUFBSSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDOztBQUVsQyxJQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFakcsSUFBRSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FDcEIsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsaUNBQWlDLEVBQUUsc0JBQXNCLEVBQUUsNENBQTRDLENBQUMsRUFDckksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQ3ZDLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLDBCQUEwQixDQUFDLEVBQzNELENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUNwQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsRUFDaEQsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLEVBQzlDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxFQUN4QyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFDdkMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLEVBQzdDLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUM5QixDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsRUFDM0QsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxxQkFBcUIsQ0FBQyxFQUNyRSxDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxFQUMxRCxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxFQUNuRCxDQUFDLG9CQUFvQixFQUFFLENBQUMsRUFBRSwyQ0FBMkMsRUFBRSxRQUFRLEVBQUUscUJBQXFCLENBQUMsRUFDdkcsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEVBQUUsNENBQTRDLEVBQUUsUUFBUSxFQUFFLHlCQUF5QixDQUFDLEVBQzVHLENBQUMsY0FBYyxFQUFFLENBQUMsRUFBRSw4QkFBOEIsRUFBRSxRQUFRLEVBQUUsbUJBQW1CLENBQUMsRUFDbEYsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLGlDQUFpQyxFQUFFLFFBQVEsRUFBRSx5QkFBeUIsQ0FBQyxFQUMzRixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSx1QkFBdUIsQ0FBQyxFQUM1RCxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxvQ0FBb0MsQ0FBQyxDQUNqRixDQUFDLENBQUM7Ozs7QUFJSCxRQUFNLDBNQUdnRSxHQUFHLENBQUMsR0FBRyxhQUFRLE1BQU0sQ0FBQyxJQUFJLHVHQUd4RSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUdBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywwRkFDcEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHlGQUNwQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsc1JBSXBCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyw4RkFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLDZGQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsNkZBQ3JCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxtS0FFckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGdLQUdyQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUZBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3RkFDcEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLDBGQUNwQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUZBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywrRkFDcEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLCtGQUNwQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsd0ZBQ3JCLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxzRkFDckIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGdGQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsNkpBRTFCLENBQUM7O0FBRXBCLFFBQU0sbUxBR2lDLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywrQkFBMEIsSUFBSSxDQUFDLE1BQU0sd0RBQ3pELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxvQ0FBK0IsSUFBSSxDQUFDLE1BQU0sd0RBQzlELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxpQ0FBNEIsSUFBSSxDQUFDLE1BQU0sd0RBQzNELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQ0FBOEIsSUFBSSxDQUFDLE1BQU0sd0RBQzdELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3Q0FBbUMsSUFBSSxDQUFDLE1BQU0sd0RBQ2xFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3Q0FBbUMsSUFBSSxDQUFDLE1BQU0sd0RBQ2xFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3Q0FBbUMsSUFBSSxDQUFDLE1BQU0sd0RBQ2xFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxrQ0FBNkIsSUFBSSxDQUFDLE1BQU0sd0RBQzVELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywrQ0FBMEMsSUFBSSxDQUFDLE1BQU0sd0RBQ3pFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQywrQ0FBMEMsSUFBSSxDQUFDLE1BQU0sd0RBQ3pFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx5Q0FBb0MsSUFBSSxDQUFDLE1BQU0sd0RBQ3BFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx5Q0FBb0MsSUFBSSxDQUFDLE1BQU0sd0RBQ3BFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxtQ0FBOEIsSUFBSSxDQUFDLE1BQU0sd0RBQzlELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxrQ0FBNkIsSUFBSSxDQUFDLE1BQU0sd0RBQzdELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxpQ0FBNEIsSUFBSSxDQUFDLE1BQU0sd0RBQzVELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxtQ0FBOEIsSUFBSSxDQUFDLE1BQU0sd0RBQzlELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxrQ0FBNkIsSUFBSSxDQUFDLE1BQU0sd0RBQzdELEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx5Q0FBb0MsSUFBSSxDQUFDLE1BQU0sd0RBQ3BFLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQywrUEFLckIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsK0JBQTBCLE1BQU0sQ0FBQyxLQUFLLHlVQU85QixDQUFDOztBQUVoRSxHQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLEdBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRWhDLElBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUxQixJQUFFLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdEMsV0FBUyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsWUFBVTtBQUFDLG1CQUFlLENBQUMsRUFBRSxFQUFFLGdCQUFnQixDQUFDLENBQUE7R0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCNUUsSUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDcEQsSUFBRSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FDckIsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUscUJBQXFCLENBQUMsRUFDcEQsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQ3ZDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxFQUM5QyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxjQUFjLENBQUMsRUFDakQsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsZUFBZSxDQUFDLEVBQzdDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUM1QixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxzQkFBc0IsQ0FBQyxFQUMvRCxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUMxRCxDQUFDLENBQUM7O0FBRUgsUUFBTSw0VEFNaUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLDJHQUNyQixFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsMEZBQ3JCLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyw2RkFDckIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGdLQUVyQixFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsbUpBR3JCLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx5RkFDckIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLG9GQUV6QyxDQUFDOztBQUVwQixRQUFNLG1MQUdpQyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsK0JBQTBCLElBQUksQ0FBQyxNQUFNLHdEQUMxRCxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUNBQTRCLElBQUksQ0FBQyxNQUFNLHdEQUM1RCxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsbUNBQThCLElBQUksQ0FBQyxNQUFNLHdEQUM5RCxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUNBQTRCLElBQUksQ0FBQyxNQUFNLHdEQUM1RCxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsc0NBQWlDLElBQUksQ0FBQyxNQUFNLHdEQUNqRSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMscUNBQWdDLElBQUksQ0FBQyxNQUFNLHdEQUNoRSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMscWFBUzZFLENBQUM7O0FBRTFJLEdBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsR0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFaEMsSUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLElBQUUsR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNyQyxXQUFTLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxZQUFVO0FBQUMsbUJBQWUsQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTtHQUFDLENBQUMsQ0FBQzs7OztBQUk1RSxXQUFTLGVBQWUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFDO0FBQ2xDLFFBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQUVqQyxRQUFHLE1BQU0sQ0FBQyxXQUFXLElBQUksZ0JBQWdCLEVBQUM7QUFDeEMsWUFBTSxDQUFDLFdBQVcsR0FBRyxhQUFhLENBQUM7QUFDbkMsVUFBRyxFQUFFLElBQUksZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDcEQsTUFBSTtBQUNILFlBQU0sQ0FBQyxXQUFXLEdBQUcsZ0JBQWdCLENBQUM7QUFDdEMsVUFBRyxFQUFFLElBQUksZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN2Qzs7QUFFRCxLQUFDLENBQUMsRUFBRSxDQUFDLENBQ0YsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQzlCLE9BQU8sRUFBRSxDQUNULE9BQU8sQ0FDTixVQUFTLEdBQUcsRUFBQztBQUNYLFVBQUcsTUFBTSxDQUFDLFdBQVcsSUFBSSxnQkFBZ0IsRUFBQztBQUN4QyxjQUFNLENBQUMsR0FBRyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNyRCxNQUFJO0FBQ0gsY0FBTSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDakQ7S0FDRixDQUNGLENBQUM7OztBQUdKLGFBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUM7QUFDdkMsT0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2xELFNBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLFNBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxhQUFXLEdBQUcsT0FBSSxDQUFDO0FBQzFELFVBQUcsRUFBRSxJQUFJLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztBQUMvRCxVQUFHLEVBQUUsSUFBSSxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDL0Q7R0FDRjtDQUNGOzs7QUFHRCxTQUFTLGdCQUFnQixDQUFDLE1BQU0sRUFBQztBQUMvQixNQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDOztBQUVyQixNQUFHLENBQUMsTUFBTSxFQUFFO0FBQ1YsU0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3JCLGtCQUFjLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLFNBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNqQjs7QUFFRCxLQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQixXQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakIsb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztDQUN0Qzs7QUFFRCxTQUFTLGlCQUFpQixDQUFDLE1BQU0sRUFBQztBQUNoQyxNQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDOztBQUV0QixNQUFHLENBQUMsTUFBTSxFQUFDO0FBQ1QsU0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3JCLGtCQUFjLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLFNBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNqQjs7QUFFRCxLQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNwQixlQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsb0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztDQUN0Qzs7QUFFRCxTQUFTLFlBQVksR0FBRTtBQUNyQixrQkFBZ0IsRUFBRSxDQUFDO0FBQ25CLG1CQUFpQixFQUFFLENBQUM7Q0FDckI7OztBQUdELFNBQVMsUUFBUSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQztBQUN0QyxTQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQ2pCOzs7QUFHRCxTQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFDO0FBQ25DLE1BQUksQ0FBQyxHQUFHLEVBQUU7TUFBRSxDQUFDLEdBQUcsRUFBRTtNQUFFLEtBQUssQ0FBQzs7QUFFMUIsTUFBRyxLQUFLLElBQUksU0FBUyxFQUFDO0FBQ3BCLGlCQUFZLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs7R0FFN0MsTUFBSTtBQUNILG1CQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDs7QUFFRCxNQUFHLEtBQUssSUFBSSxLQUFLLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTlDLFNBQU8sRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQzs7QUFFcEIsV0FBUyxVQUFVLENBQUMsRUFBRSxFQUFDO0FBQ3JCLFFBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzs7QUFFN0IsUUFBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFDO0FBQzdCLGNBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDN0I7O0FBRUQsUUFBRyxLQUFLLElBQUksU0FBUyxFQUFDO0FBQ3BCLE9BQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3BCLFFBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdkIsVUFBRyxFQUFFLElBQUksSUFBSSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0JaLGFBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7T0FDdEI7S0FDRixNQUFJO0FBQ0gsV0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN0QjtHQUNGOzs7QUFHRCxXQUFTLGNBQWMsQ0FBQyxLQUFLLEVBQUM7QUFDNUIsUUFBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNqRDtDQUNGOzs7QUFHRCxTQUFTLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFDO0FBQ3hCLE1BQUksSUFBSTtNQUFFLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7O0FBRWpDLE9BQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXBCLE1BQUksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLE1BQUcsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFDO0FBQzdCLE9BQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3hELE1BQUk7QUFDSCxPQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDM0IsT0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0dBQ3pCOztBQUVELE9BQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsT0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUVoQixvQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFL0IsTUFBRyxJQUFJLElBQUksT0FBTyxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNDLE1BQUcsSUFBSSxJQUFJLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUU5Qzs7O0FBR0QsU0FBUyxrQkFBa0IsQ0FBQyxFQUFFLEVBQUM7QUFDN0IsR0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDVixPQUFPLEVBQUUsQ0FDVCxPQUFPLENBQ04sVUFBUyxJQUFJLEVBQUU7QUFDYixhQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBQyxZQUFVO0FBQUMsZUFBUyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQUMsQ0FBQyxDQUFDO0dBQ3hELENBQ0YsQ0FBQzs7QUFFSixXQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUM7QUFDdEIsUUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sRUFBQztBQUN0QyxVQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztLQUMzQyxNQUFJO0FBQ0gsVUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDcEM7QUFDRCxRQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3JELFFBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxhQUFXLElBQUksQ0FBQyxNQUFNLG9CQUFlLElBQUksQ0FBQyxLQUFLLE9BQUksQ0FBQztBQUNwRyxRQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7QUFFN0IsUUFBRyxFQUFFLElBQUksZ0JBQWdCLEVBQUM7QUFDeEIsY0FBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3RCxpQkFBVyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNqRDtBQUNELFFBQUcsRUFBRSxJQUFJLGdCQUFnQixFQUFDO0FBQ3hCLGNBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUQ7R0FDRjs7QUFFRCxXQUFTLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFDO0FBQzdCLFFBQUksS0FBSyxFQUFFLEVBQUUsQ0FBQzs7QUFFZCxNQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ1gsU0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMxQixNQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztHQUN4QztDQUNGOzs7QUFHRCxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUM7QUFDdkIsTUFBSSxJQUFJLENBQUM7O0FBRVQsTUFBSSxxSUFFcUUsQ0FBQzs7QUFHMUUsT0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUUsRUFBQztBQUNyQyxRQUFJLFNBQVMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsV0FBVyxDQUFDOztBQUV6RCxRQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUM7QUFDWCxXQUFLLEdBQUcsY0FBYyxDQUFDO0FBQ3ZCLFdBQUssR0FBRyxTQUFTLENBQUM7QUFDbEIsU0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbEIsTUFDSTtBQUNILFdBQUssR0FBRyxPQUFPLENBQUM7QUFDaEIsV0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLFNBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ25COztBQUVELGFBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUNuRCxhQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDbkQsZUFBVyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsMENBQTBDLEdBQUcsRUFBRSxDQUFDOztBQUUxRSxRQUFJLCtCQUN1QixLQUFLLDRDQUNGLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHVCQUFrQixTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQywrQ0FDbkQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsd0JBQW1CLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLCtDQUNsRCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxrSkFBNkksRUFBRSxDQUFDLEVBQUUsVUFBSyxFQUFFLENBQUMsSUFBSSxtREFDL0ssS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsa0NBQTZCLFNBQVMsbURBQ3ZELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHdCQUFtQixFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQywrQ0FDdEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsd0JBQW1CLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLCtDQUN0RCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3QkFBbUIsYUFBYSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLCtDQUNuRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3QkFBbUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsK0NBQ2hELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHdCQUFtQixFQUFFLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQywrQ0FDaEUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsd0JBQW1CLEVBQUUsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLCtDQUNoRSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx3QkFBbUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLCtDQUMzRCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx3QkFBbUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLCtDQUMzRCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx3QkFBbUIsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsK0NBQzVELEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLHdCQUFtQixhQUFhLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsK0NBQzlELEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLHdCQUFtQixXQUFXLFNBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLCtDQUM1RSxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxrQ0FBNkIsU0FBUyxtREFDeEQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsd0JBQW1CLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLCtDQUNqRCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx3QkFBbUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsK0NBQ3hELEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxnQ0FBMkIsS0FBSyxzQ0FBaUMsRUFBRSxDQUFDLEVBQUUsa0ZBQTRFLEdBQUcsMEVBRTFMLENBQUM7O0FBRWxCLE9BQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNsQixDQUFDLENBQUM7O0FBRUgsTUFBSSxrQ0FDYSxDQUFDOztBQUVsQixHQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDL0IsR0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7OztBQUkzQyxXQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDO0FBQ25CLFdBQU8sS0FBSyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxLQUFLLEdBQUcseUNBQXlDLEdBQUcsS0FBSyxDQUFDO0dBQ2pHOzs7QUFHRCxXQUFTLFlBQVksQ0FBQyxDQUFDLEVBQUM7QUFDdEIsUUFBRyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFDYixPQUFPLEdBQUcsQ0FBQztBQUNiLFFBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQ2YscUVBQWtFLElBQUksQ0FBQyxFQUFFLHNFQUFnRSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBVTtBQUM1SyxRQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUNaLE9BQU8sS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxxQkFBbUIsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBSyxDQUFDLENBQUMsSUFBSSxpQkFBWSxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBRyxDQUFDOztBQUV0SCw2QkFBc0IsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBSyxDQUFDLENBQUMsSUFBSSxhQUFVO0dBQ2hFO0NBQ0Y7OztBQUdELFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBQztBQUMzQixNQUFJLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQzs7QUFFNUIsTUFBSSxxSUFFcUUsQ0FBQzs7QUFFMUUsT0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEVBQUUsRUFBQztBQUNyQyxRQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUM7QUFDVixXQUFLLEdBQUcsY0FBYyxDQUFDO0FBQ3ZCLFdBQUssR0FBRyxTQUFTLENBQUM7QUFDbEIsU0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbEIsTUFDRztBQUNGLFdBQUssR0FBRyxPQUFPLENBQUM7QUFDaEIsV0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNYLFNBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ25COztBQUVELFFBQUksK0JBQ3VCLEtBQUssd0NBQ04sS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsdUJBQWtCLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLDRDQUNuRCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx1SkFBa0osR0FBRyxDQUFDLEdBQUcsYUFBUSxFQUFFLENBQUMsRUFBRSxVQUFLLEVBQUUsQ0FBQyxJQUFJLCtDQUNuTSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyw4SUFBeUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLCtDQUN6TCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3QkFBbUIsYUFBYSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLDJDQUM1RCxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyx3QkFBbUIsRUFBRSxDQUFDLFNBQVMsMkNBQ2hELEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHdCQUFtQixFQUFFLENBQUMsUUFBUSwyQ0FDL0MsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLCtDQUEwQyxLQUFLLHFDQUFnQyxFQUFFLENBQUMsRUFBRSxxRUFBK0QsR0FBRyxnREFDakwsQ0FBQztHQUN4QixDQUFDLENBQUM7O0FBRUgsTUFBSSxrQ0FDYSxDQUFDOztBQUVsQixHQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDaEM7O0FBRUQsU0FBUyxpQkFBaUIsR0FBRTtBQUMxQixNQUFJLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDOztBQUVwQixNQUFJLEdBQUcsYUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdDLEdBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ2hCLFFBQU0sR0FBRyxFQUFFLENBQUM7O0FBRVosU0FBTSxDQUFDLEVBQUUsRUFBQztBQUNSLFFBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFDO0FBQ2pDLFlBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZEO0dBQ0Y7QUFDRCxRQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyw0REFBNEQsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFOUcsR0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQ3RDOzs7QUFHRCxTQUFTLGNBQWMsQ0FBQyxJQUFJLEVBQUM7QUFDM0IsTUFBRyxDQUFDLElBQUksRUFBQztBQUNQLE9BQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUN4QyxNQUFJO0FBQ0gsT0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7R0FDMUQ7Q0FDRjs7O0FBR0QsU0FBUyxjQUFjLEdBQUU7QUFDdkIsTUFBSSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzs7QUFFbEIsR0FBQyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDcEIsTUFBSSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzdCLE1BQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7O0FBRTNCLE1BQUcsQ0FBQyxHQUFHLEdBQUcsRUFBQztBQUNULFFBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7R0FDN0IsTUFBSyxJQUFHLENBQUMsR0FBRyxHQUFHLEVBQUM7QUFDZixRQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0dBQzdCO0NBQ0Y7OztBQUdELFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFDO0FBQzlCLE1BQUcsSUFBSSxFQUFDO0FBQ04sV0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwQyxXQUFPLENBQUMsS0FBSyxxQkFBbUIsSUFBSSxnQ0FBNkIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkYsV0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0dBQ3BCLE1BQUk7QUFDSCxXQUFPLENBQUMsS0FBSyxrQ0FBZ0MsSUFBSSxPQUFJLENBQUM7R0FDdkQ7Q0FDRjs7Ozs7QUFLRCxTQUFTLGtCQUFrQixDQUFDLElBQUksRUFBQztBQUMvQixNQUFJLE1BQU0sQ0FBQzs7QUFFWCxNQUFHLElBQUksSUFBSSxNQUFNLElBQUksS0FBSyxFQUFDO0FBQ3pCLFVBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLGdCQUFZLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztHQUM1QztBQUNELE1BQUcsSUFBSSxJQUFJLFVBQVUsRUFBQztBQUNwQixVQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM3QixnQkFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztHQUNoRDtDQUNGOztBQUVELFNBQVMsb0JBQW9CLENBQUMsSUFBSSxFQUFDO0FBQ2pDLE1BQUksTUFBTSxDQUFDOztBQUVYLE1BQUcsSUFBSSxJQUFJLE1BQU0sRUFBQztBQUNoQixVQUFNLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFNUMsUUFBRyxNQUFNLEVBQUM7QUFDUixVQUFHLEtBQUssRUFBRTtBQUNSLFdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQzFCLE1BQUk7QUFDSCxZQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUMzQjtLQUNGLE1BQUk7QUFDSCx3QkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM1QjtHQUNGO0FBQ0QsTUFBRyxJQUFJLElBQUksVUFBVSxFQUFDO0FBQ3BCLFVBQU0sR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRWhELFFBQUcsTUFBTSxFQUFDO0FBQ1IsU0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDMUIsTUFBSTtBQUNILHdCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ2hDO0dBQ0Y7Q0FDRjs7Ozs7QUFLRCxTQUFTLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUM1RCxNQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDOztBQUVuQyxnQkFBYyxFQUFFLENBQUM7O0FBRWpCLFNBQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNqQyxNQUFJLE1BQU0sSUFBSSxNQUFNLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3BHLFNBQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXBCLE1BQUksS0FBSyxJQUFJLElBQUksRUFBRTtBQUNqQixXQUFPLENBQUMsa0JBQWtCLEdBQUcsWUFBVTtBQUNyQyxVQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sU0FBUyxJQUFJLFdBQVcsRUFBQztBQUN0RixzQkFBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xCLGlCQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDcEIsTUFBSyxJQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sU0FBUyxJQUFJLFdBQVcsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbkgsQ0FBQTtHQUNGOztBQUVELE1BQUksS0FBSyxJQUFJLEtBQUssRUFBRTtBQUNsQixRQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sU0FBUyxJQUFJLFdBQVcsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FDNUUsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxPQUFPLFNBQVMsSUFBSSxXQUFXLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3ZGO0NBQ0Y7O0FBRUQsU0FBUyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBQztBQUNyQixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRVgsZUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUM7QUFDcEMsS0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUMvQixDQUFDLENBQUM7O0FBRUgsU0FBTyxDQUFDLENBQUM7Q0FDViIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBDb21tb24oKXtcclxuXHJcbn1cclxuXHJcbkNvbW1vbi5wcm90b3R5cGUgPSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBub3dcclxuICAgKiBAcGFyYW0ge251bWJlcn0gbWF4XHJcbiAgICogQHBhcmFtIHtib29sZWFufSBpbnRcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldFBlcmNlbnQ6IGZ1bmN0aW9uIChub3csIG1heCwgaW50KXtcclxuICAgIHZhciBwZXJjZW50O1xyXG5cclxuICAgIGlmKG5vdyA9PSAwIHx8IG1heCA9PSAwKXtcclxuICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgcGVyY2VudCA9IChub3cgLyBtYXgpICogMTAwO1xyXG4gICAgaWYoaW50KXtcclxuICAgICAgcGVyY2VudCA9IHBhcnNlSW50KHBlcmNlbnQsIDEwKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBwZXJjZW50ID0gcGFyc2VGbG9hdChwZXJjZW50LnRvRml4ZWQoMSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwZXJjZW50O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGRhdGVcclxuICAgKiBAcGFyYW0ge251bGx8Ym9vbGVhbn0gZnVsbFxyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAgICovXHJcbiAgZ2V0Tm9ybWFsRGF0ZTogZnVuY3Rpb24gKGRhdGUsIGZ1bGwpe1xyXG4gICAgaWYoaXNOYU4oZGF0ZSkpIHJldHVybiB7ZDogZGF0ZSwgdDogJy0nfTtcclxuICAgIGlmKGRhdGUgPT0gMCkgcmV0dXJuIHtkOiAnLScsIHQ6ICctJ307XHJcblxyXG4gICAgZGF0ZSA9IGRhdGUgKiAxMDAwO1xyXG4gICAgZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgZGF0ZSA9IGRhdGUudG9Mb2NhbGVTdHJpbmcoKTtcclxuXHJcbiAgICBkYXRlID0gZGF0ZS5tYXRjaCgvKFxcZCspLihcXGQrKS4oXFxkKyksIChcXGQrKTooXFxkKyk6KC4rKS8pO1xyXG5cclxuICAgIGlmKGZ1bGwgIT0gbnVsbCkge1xyXG4gICAgICBkYXRlID0ge1xyXG4gICAgICAgIGQ6IGAke2RhdGVbMV19LiR7ZGF0ZVsyXX0uJHtkYXRlWzNdfWAsXHJcbiAgICAgICAgdDogYCR7ZGF0ZVs0XX06JHtkYXRlWzVdfWBcclxuICAgICAgfTtcclxuICAgIH1lbHNle1xyXG4gICAgICBkYXRlID0ge1xyXG4gICAgICAgIGQ6IGAke2RhdGVbMV19LiR7ZGF0ZVsyXX0uJHtkYXRlWzNdLmNoYXJBdCgyKX0ke2RhdGVbM10uY2hhckF0KDMpfWAsXHJcbiAgICAgICAgdDogYCR7ZGF0ZVs0XX06JHtkYXRlWzVdfWBcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0ZTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0XHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICBnZXROb3JtYWxUaW1lOiBmdW5jdGlvbiAodCl7XHJcbiAgICB2YXIgcmVzdWx0LCBoaCwgbW0sIHNzO1xyXG5cclxuICAgIGhoID0gMDtcclxuICAgIHQgPSBwYXJzZUludCh0IC8gMTAwMCwgMTApO1xyXG5cclxuICAgIGlmKHQgPiAzNjAwKXtcclxuICAgICAgaGggPSBwYXJzZUludCh0IC8gMzYwMCwgMTApO1xyXG4gICAgICB0ID0gdCAlIDM2MDA7XHJcbiAgICB9XHJcbiAgICBtbSA9IHBhcnNlSW50KHQgLyA2MCwgMTApO1xyXG4gICAgc3MgPSBwYXJzZUludCh0ICUgNjAsIDEwKTtcclxuXHJcbiAgICBpZihtbSA8IDEwKSBtbSA9IFwiMFwiICsgbW07XHJcbiAgICBpZihzcyA8IDEwKSBzcyA9IFwiMFwiICsgc3M7XHJcblxyXG4gICAgcmVzdWx0ID0gYCR7bW19OiR7c3N9YDtcclxuXHJcbiAgICBpZihoaCA+IDApe1xyXG4gICAgICBpZihoaCA8IDEwKSBoaCA9IFwiMFwiICsgaGg7XHJcbiAgICAgIHJlc3VsdCA9IGAke2hofToke3Jlc3VsdH1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge251bWJlcn0gdmFsdWVcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGNvbnZlcnRJRDogZnVuY3Rpb24gKHZhbHVlKXtcclxuICAgIHZhciByZXN1bHQsIGksIGo7XHJcblxyXG4gICAgaWYodmFsdWUgPCAxMDAwKSByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgaiA9IDE7IGkgPSB2YWx1ZS5sZW5ndGg7XHJcbiAgICByZXN1bHQgPSBcIlwiO1xyXG5cclxuICAgIHdoaWxlKGktLSl7XHJcbiAgICAgIHJlc3VsdCA9IHZhbHVlLmNoYXJBdChpKSArIHJlc3VsdDtcclxuICAgICAgaWYoaiUzID09IDAgJiYgaiAhPSAwICYmIGkgIT0gMCl7XHJcbiAgICAgICAgcmVzdWx0ID0gJywnICsgcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICAgIGorK1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICBlbmNvZGVIZWFkZXI6IGZ1bmN0aW9uIChzdHIpe1xyXG4gICAgdmFyIGEsIHN0cmluZztcclxuXHJcbiAgICBpZighc3RyKSByZXR1cm4gc3RyO1xyXG5cclxuICAgIHN0cmluZyA9IFN0cmluZyhzdHIpLnJlcGxhY2UoLyUvZywgJyUyNScpLnJlcGxhY2UoL1xcKy9nLCAnJTJCJykucmVwbGFjZSgvXFxuL2csICclMEEnKTtcclxuICAgIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICBhLmhyZWYgPSBcImh0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L2VuY29kZWRfc3RyPT9cIiArIHN0cmluZztcclxuICAgIHN0cmluZyA9IGEuaHJlZi5zcGxpdCgnZW5jb2RlZF9zdHI9PycpWzFdO1xyXG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoLyUyMC9nLCAnKycpLnJlcGxhY2UoLz0vZywgJyUzRCcpLnJlcGxhY2UoLyYvZywgJyUyNicpO1xyXG5cclxuICAgIHJldHVybiBzdHJpbmc7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IG1pblxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxyXG4gICAqL1xyXG4gIHJhbmRvbU51bWJlcjogZnVuY3Rpb24gKG1pbiwgbWF4KXtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCl7XHJcbiAgcmV0dXJuIG5ldyBDb21tb24oKTtcclxufTtcclxuIiwiZnVuY3Rpb24gQXBpKHBhcmFtKSB7XHJcbiAgdGhpcy5zZWxlY3RvciA9IHBhcmFtO1xyXG4gIHRoaXMubm9kZUxpc3QgPSBbXTtcclxuICB0aGlzLmxlbmd0aCA9IDA7XHJcbn1cclxuXHJcbkFwaS5wcm90b3R5cGUgPSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7bnVsbHxudW1iZXJ9IHBhcmFtXHJcbiAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAqL1xyXG4gIG5vZGU6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgaWYgKHBhcmFtICE9IG51bGwpIHtcclxuICAgICAgaWYgKHBhcmFtID09IC0xKSB7XHJcbiAgICAgICAgcGFyYW0gPSB0aGlzLmxlbmd0aCAtIDE7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBhcmFtID0gMDtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLm5vZGVMaXN0W3BhcmFtXSA/IHRoaXMubm9kZUxpc3RbcGFyYW1dIDogbnVsbDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyB7W119XHJcbiAgICovXHJcbiAgbm9kZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB0aGlzLm5vZGVMaXN0O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtbXX1cclxuICAgKi9cclxuICBub2RlQXJyOiBmdW5jdGlvbigpe1xyXG4gICAgdmFyIG5vZGVzLCBsZW5ndGg7XHJcblxyXG4gICAgbGVuZ3RoID0gdGhpcy5ub2RlTGlzdC5sZW5ndGg7XHJcbiAgICBub2RlcyA9IG5ldyBBcnJheShsZW5ndGgpO1xyXG5cclxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xyXG4gICAgICBub2Rlc1tsZW5ndGhdID0gdGhpcy5ub2RlTGlzdFtsZW5ndGhdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBub2RlcztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICAqL1xyXG4gIGdldFNlbGVjdG9yOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RvcjtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge251bGx8Kn0gcGFyYW1cclxuICAgKiBAcmV0dXJucyB7QXBpfHN0cmluZ31cclxuICAgKi9cclxuICBodG1sOiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgIGlmIChwYXJhbSAhPSBudWxsKSB7XHJcbiAgICAgIHRoaXMubm9kZUxpc3RbMF0uaW5uZXJIVE1MID0gcGFyYW07XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMubm9kZUxpc3RbMF0gPyB0aGlzLm5vZGVMaXN0WzBdLmlubmVySFRNTCA6IFwiVGhpcyBub2RlIGlzIG51bGwuIFNlbGVjdG9yOiBcIiArIHRoaXMuc2VsZWN0b3I7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICB0ZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlTGlzdFswXSA/IHRoaXMubm9kZUxpc3RbMF0udGV4dENvbnRlbnQgOiBcIlRoaXMgbm9kZSBpcyBudWxsLiBTZWxlY3RvcjogXCIgKyB0aGlzLnNlbGVjdG9yO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcclxuICAgKiBAcmV0dXJucyB7QXBpfVxyXG4gICAqL1xyXG4gIGF0dHI6IGZ1bmN0aW9uKGF0dHJpYnV0ZSwgdmFsdWUpe1xyXG4gICAgdGhpcy5ub2RlTGlzdFswXS5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cclxuICAgKiBAcmV0dXJucyB7QXBpfVxyXG4gICAqL1xyXG4gIGZpbmQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgdmFyIHRleHQsIHNlbGVjdG9yLCBub2RlLCBrZXkgPSBmYWxzZTtcclxuICAgIHZhciBpLCBsZW5ndGgsIG5vZGVzQXJyYXkgPSBbXTtcclxuXHJcbiAgICB0aGlzLnNlbGVjdG9yID0gcGFyYW07XHJcbiAgICBub2RlID0gdGhpcy5ub2RlTGlzdFswXSA/IHRoaXMubm9kZUxpc3RbMF0gOiBkb2N1bWVudDtcclxuXHJcbiAgICB0ZXh0ID0gcGFyYW0ubWF0Y2goLyguKyk6Y29udGFpbnNcXChcIn4oLispXCJcXCkvaSk7XHJcbiAgICBpZiAoIXRleHQpIHtcclxuICAgICAga2V5ID0gdHJ1ZTtcclxuICAgICAgdGV4dCA9IHBhcmFtLm1hdGNoKC8oLispOmNvbnRhaW5zXFwoXCIoLispXCJcXCkvKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGV4dCkge1xyXG4gICAgICBzZWxlY3RvciA9IHRleHRbMV07XHJcbiAgICAgIHRleHQgPSB0ZXh0WzJdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2VsZWN0b3IgPSBwYXJhbTtcclxuICAgICAgdGV4dCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRleHQpIHtcclxuICAgICAgbm9kZXNBcnJheSA9IG5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcbiAgICAgIHRoaXMubm9kZUxpc3QgPSBbXTtcclxuXHJcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG5vZGVzQXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgICBpZiAobm9kZXNBcnJheVtpXS50ZXh0Q29udGVudCA9PSB0ZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZUxpc3QucHVzaChub2Rlc0FycmF5W2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKG5vZGVzQXJyYXlbaV0udGV4dENvbnRlbnQuc2VhcmNoKHRleHQpICE9IC0xKSB7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZUxpc3QucHVzaChub2Rlc0FycmF5W2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubm9kZUxpc3QgPSBub2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5sZW5ndGggPSB0aGlzLm5vZGVMaXN0Lmxlbmd0aDtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cclxuICAgKiBAcmV0dXJucyB7QXBpfVxyXG4gICAqL1xyXG4gIHVwOiBmdW5jdGlvbiAocGFyYW0pe1xyXG4gICAgdmFyIG5vZGU7XHJcblxyXG4gICAgdGhpcy5zZWxlY3RvciArPSBcIiA+IHVwW1wiICsgcGFyYW0gKyBcIl1cIjtcclxuICAgIHBhcmFtID0gcGFyYW0udG9VcHBlckNhc2UoKTtcclxuICAgIG5vZGUgPSB0aGlzLm5vZGVMaXN0WzBdLnBhcmVudE5vZGU7XHJcbiAgICB0aGlzLm5vZGVMaXN0ID0gW107XHJcblxyXG4gICAgd2hpbGUgKG5vZGUubm9kZU5hbWUgIT0gcGFyYW0pIHtcclxuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcclxuICAgICAgaWYgKG5vZGUgPT0gZG9jdW1lbnQpIHtcclxuICAgICAgICB0aGlzLm5vZGVMaXN0WzBdID0gbnVsbDtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLm5vZGVMaXN0WzBdID0gbm9kZTtcclxuICAgIHRoaXMubGVuZ3RoID0gMTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyYW1cclxuICAgKiBAcmV0dXJucyB7QXBpfVxyXG4gICAqL1xyXG4gIG5leHQ6IGZ1bmN0aW9uIChwYXJhbSl7XHJcbiAgICB2YXIgbm9kZSwgbGFzdE5vZGU7XHJcblxyXG4gICAgdGhpcy5zZWxlY3RvciArPSBcIiA+IG5leHRbXCIgKyBwYXJhbSArIFwiXVwiO1xyXG4gICAgcGFyYW0gPSBwYXJhbS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgbm9kZSA9IHRoaXMubm9kZUxpc3RbMF0ubmV4dFNpYmxpbmc7XHJcbiAgICBsYXN0Tm9kZSA9IG5vZGUucGFyZW50Tm9kZS5sYXN0Q2hpbGQ7XHJcbiAgICB0aGlzLm5vZGVMaXN0ID0gW107XHJcblxyXG4gICAgd2hpbGUgKG5vZGUubm9kZU5hbWUgIT0gcGFyYW0pIHtcclxuICAgICAgbm9kZSA9IG5vZGUubmV4dFNpYmxpbmc7XHJcbiAgICAgIGlmIChub2RlID09IGxhc3ROb2RlKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlTGlzdFswXSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5ub2RlTGlzdFswXSA9IG5vZGU7XHJcbiAgICB0aGlzLmxlbmd0aCA9IDE7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7Kn0gcGFyYW1cclxuICogQHJldHVybnMge0FwaX1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gJChwYXJhbSkge1xyXG4gIHZhciBhcGksIHN0cjtcclxuXHJcbiAgaWYgKHR5cGVvZiBwYXJhbSA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICBzdHIgPSBwYXJhbS5tYXRjaCgvPCguKyk+Lyk7XHJcbiAgICBpZiAoc3RyKSB7XHJcbiAgICAgIGFwaSA9IG5ldyBBcGkoJ2NyZWF0ZShcIicgKyBzdHJbMV0gKyAnXCIpJyk7XHJcbiAgICAgIGFwaS5ub2RlTGlzdFswXSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoc3RyWzFdKTtcclxuICAgICAgYXBpLmxlbmd0aCA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcGkgPSBuZXcgQXBpKHBhcmFtKS5maW5kKHBhcmFtKTtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgYXBpID0gbmV3IEFwaSgnc2V0KFwiJyArIHBhcmFtLm5vZGVOYW1lICsgJ1wiKScpO1xyXG4gICAgYXBpLm5vZGVMaXN0WzBdID0gcGFyYW07XHJcbiAgICBhcGkubGVuZ3RoID0gMTtcclxuICB9XHJcblxyXG4gIHJldHVybiBhcGk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZEV2ZW50KGVsZW1lbnQsIGV2ZW50LCBjYWxsYmFjaykge1xyXG4gIGlmICghZWxlbWVudCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAoZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XHJcbiAgICBpZiAoZXZlbnQuc3Vic3RyKDAsIDIpID09ICdvbicpIHtcclxuICAgICAgZXZlbnQgPSBldmVudC5zdWJzdHIoMik7XHJcbiAgICB9XHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XHJcbiAgfSBlbHNlIGlmIChlbGVtZW50LmF0dGFjaEV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuc3Vic3RyKDAsIDIpICE9ICdvbicpIHtcclxuICAgICAgZXZlbnQgPSAnb24nK2V2ZW50O1xyXG4gICAgfVxyXG4gICAgZWxlbWVudC5hdHRhY2hFdmVudChldmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcclxuICB9XHJcbn07IiwiZnVuY3Rpb24gREIobmFtZSl7XHJcbiAgdGhpcy5vID0gd2luZG93LmluZGV4ZWREQiB8fCB3aW5kb3cubW96SW5kZXhlZERCIHx8IHdpbmRvdy53ZWJraXRJbmRleGVkREIgfHwgd2luZG93Lm1zSW5kZXhlZERCO1xyXG4gIHRoaXMudCA9IHdpbmRvdy5JREJUcmFuc2FjdGlvbiB8fCB3aW5kb3cud2Via2l0SURCVHJhbnNhY3Rpb24gfHwgd2luZG93Lm1zSURCVHJhbnNhY3Rpb247XHJcbiAgdGhpcy5rciA9IHdpbmRvdy5JREJLZXlSYW5nZSA9IHdpbmRvdy5JREJLZXlSYW5nZSB8fCB3aW5kb3cud2Via2l0SURCS2V5UmFuZ2UgfHwgd2luZG93Lm1zSURCS2V5UmFuZ2U7XHJcbiAgdGhpcy5yID0gbnVsbDtcclxuICB0aGlzLmRiID0gbnVsbDtcclxuICB0aGlzLnR4ID0gbnVsbDtcclxuICB0aGlzLnN0b3JlID0gbnVsbDtcclxuICB0aGlzLmluZGV4ID0gbnVsbDtcclxuICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gIHRoaXMubW9kaWZ5aW5nVGFibGUgPSBudWxsO1xyXG4gIHRoaXMucmVtb3ZlVGFibGUgPSBudWxsO1xyXG4gIHRoaXMuaW5pQmFzZSA9IG51bGw7XHJcbiAgdGhpcy52ZXJzaW9uID0gMTtcclxufVxyXG5cclxuREIucHJvdG90eXBlID0ge1xyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqL1xyXG4gIGNvbm5lY3REQjogZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob25zdWNjZXNzKSA9PntcclxuICAgICAgdmFyIGlkYiA9IHRoaXM7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZyhcIlJ1biBjb25uZWN0LCB2ZXJzaW9uIFwiICsgaWRiLnZlcnNpb24pO1xyXG5cclxuICAgICAgaWRiLnIgPSBpZGIuby5vcGVuKHRoaXMubmFtZSwgaWRiLnZlcnNpb24pO1xyXG5cclxuICAgICAgaWRiLnIub25lcnJvciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciFcIik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZGIuci5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlkYi5kYiA9IGlkYi5yLnJlc3VsdDtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3MgY29ubmVjdCFcIik7XHJcbiAgICAgICAgb25zdWNjZXNzKGlkYik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLnIub251cGdyYWRlbmVlZGVkID0gZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgaWRiLmRiID0gZS5jdXJyZW50VGFyZ2V0LnJlc3VsdDtcclxuXHJcbiAgICAgICAgaWYoaWRiLnZlcnNpb24gPT0gMil7XHJcbiAgICAgICAgICBpZGIudXBncmFkZSh0cnVlKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRlOiBkZWZhdWx0c1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWRiLnVwZ3JhZGUoZmFsc2UpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVXBncmFkZWQhXCIpO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHsqW119IGxpc3RcclxuICAgKi9cclxuICBzZXRNb2RpZnlpbmdUYWJsZUxpc3Q6IGZ1bmN0aW9uKGxpc3Qpe1xyXG4gICAgdGhpcy5tb2RpZnlpbmdUYWJsZSA9IGxpc3Q7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHsqW119IGxpc3RcclxuICAgKi9cclxuICBzZXRJbmlUYWJsZUxpc3Q6IGZ1bmN0aW9uKGxpc3Qpe1xyXG4gICAgdGhpcy5pbmlCYXNlID0gbGlzdDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGxpc3RcclxuICAgKi9cclxuICBzZXRSZW1vdmVUYWJsZUxpc3Q6IGZ1bmN0aW9uKGxpc3Qpe1xyXG4gICAgdGhpcy5yZW1vdmVUYWJsZSA9IGxpc3Q7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtib29sZWFufSBpbmlcclxuICAgKi9cclxuICB1cGdyYWRlOiBmdW5jdGlvbihpbmkpe1xyXG4gICAgdmFyIHRhYmxlLCB0b2RvLCBpZGIgPSB0aGlzO1xyXG5cclxuICAgIHRvZG8gPSBpbmkgPyBpZGIuaW5pQmFzZSA6IGlkYi5tb2RpZnlpbmdUYWJsZTtcclxuXHJcbiAgICBpZih0b2RvKXtcclxuICAgICAgdG9kby5mb3JFYWNoKGZ1bmN0aW9uKHQpe1xyXG4gICAgICAgIGlmKGlkYi5leGlzdCh0Lm5hbWUpKXtcclxuICAgICAgICAgIHRhYmxlID0gaWRiLnIudHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUodC5uYW1lKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIHRhYmxlID0gaWRiLmRiLmNyZWF0ZU9iamVjdFN0b3JlKHQubmFtZSwge2tleVBhdGg6IHQua2V5fSk7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3MgY3JlYXRlZDogXCIgKyB0Lm5hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodC5pbmRleCl7XHJcbiAgICAgICAgICB0LmluZGV4LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG4gICAgICAgICAgICB0YWJsZS5jcmVhdGVJbmRleChpbmRleFswXSwgaW5kZXhbMV0sIHt1bmlxdWU6IGluZGV4WzJdfSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2VzcyBjcmVhdGVkIGluZGV4OiBcIiArIGluZGV4LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgdG9kbyA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBpZihpZGIucmVtb3ZlVGFibGUpe1xyXG4gICAgICBpZGIucmVtb3ZlVGFibGUuZm9yRWFjaChmdW5jdGlvbih0KXtcclxuICAgICAgICBpZGIuZGIuZGVsZXRlT2JqZWN0U3RvcmUodCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzIHJlbW92ZWQ6IFwiICsgdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZGIucmVtb3ZlVGFibGUgPSBudWxsO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBleGlzdDogZnVuY3Rpb24gKG5hbWUpe1xyXG4gICAgdmFyIGxlbmd0aCwgYXJyYXk7XHJcblxyXG4gICAgYXJyYXkgPSB0aGlzLmRiLm9iamVjdFN0b3JlTmFtZXM7XHJcbiAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XHJcblxyXG4gICAgd2hpbGUobGVuZ3RoLS0pe1xyXG4gICAgICBpZihhcnJheVtsZW5ndGhdID09IG5hbWUpe1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKi9cclxuICBuZXh0VmVyc2lvbjogZnVuY3Rpb24oKXtcclxuICAgIHRoaXMudmVyc2lvbisrO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICovXHJcbiAgZGVsZXRlREI6IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLm8uZGVsZXRlRGF0YWJhc2UodGhpcy5uYW1lKTtcclxuICAgIGNvbnNvbGUubG9nKFwiU3VjY2VzcyBkZWxldGVkOiBcIiArIHRoaXMubmFtZSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhYmxlXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGluZGV4XHJcbiAgICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSB2YWx1ZVxyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9XHJcbiAgICovXHJcbiAgZ2V0T25lOiBmdW5jdGlvbih0YWJsZSwgaW5kZXgsIHZhbHVlKXtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob25zdWNjZXNzKSA9PiB7XHJcbiAgICAgIHRoaXMudHggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFt0YWJsZV0sIFwicmVhZG9ubHlcIik7XHJcbiAgICAgIHRoaXMuc3RvcmUgPSB0aGlzLnR4Lm9iamVjdFN0b3JlKHRhYmxlKTtcclxuXHJcbiAgICAgIGlmKGluZGV4ID09IFwiaWRcIil7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5nZXQodmFsdWUpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgIGlmKGV2ZW50LnRhcmdldC5yZXN1bHQpe1xyXG4gICAgICAgICAgICBvbnN1Y2Nlc3MoZXZlbnQudGFyZ2V0LnJlc3VsdCk7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgb25zdWNjZXNzKG51bGwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5pbmRleCA9IHRoaXMuc3RvcmUuaW5kZXgoaW5kZXgpO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSB0aGlzLmluZGV4LmdldCh2YWx1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuaW5kZXgub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgb25zdWNjZXNzKGV2ZW50LnRhcmdldC5yZXN1bHQpOyAvLyDQt9C00LXRgdGMINCy0L7Qt9Cy0YDQsNGJ0LDQtdGC0YHRjyDRgNC10LfRg9C70YzRgtCw0YJcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRhYmxlXHJcbiAgICogQHBhcmFtIHtudW1iZXJbXXxudWxsfSByYW5nZVxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfG51bGx9IGluZGV4XHJcbiAgICovXHJcbiAgZ2V0RmV3OiBmdW5jdGlvbih0YWJsZSwgcmFuZ2UsIGluZGV4KXtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob25zdWNjZXNzKSA9PntcclxuICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcclxuICAgICAgdmFyIGtydiA9IHJhbmdlID8gdGhpcy5rci5ib3VuZChyYW5nZVswXSwgcmFuZ2VbMV0pIDogbnVsbDtcclxuXHJcbiAgICAgIHRoaXMudHggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFt0YWJsZV0sIFwicmVhZG9ubHlcIik7XHJcbiAgICAgIHRoaXMuc3RvcmUgPSB0aGlzLnR4Lm9iamVjdFN0b3JlKHRhYmxlKTtcclxuXHJcbiAgICAgIGlmKGluZGV4KXtcclxuICAgICAgICB0aGlzLnN0b3JlID0gdGhpcy5zdG9yZS5pbmRleChpbmRleCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RvcmUub3BlbkN1cnNvcihrcnYpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICB2YXIgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuXHJcbiAgICAgICAgaWYoY3Vyc29yKXtcclxuICAgICAgICAgIHJlc3VsdHMucHVzaChjdXJzb3IudmFsdWUpO1xyXG4gICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBhbGwgcmVzdWx0czogXCIpO1xyXG4gICAgICAgICAgb25zdWNjZXNzKHJlc3VsdHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0YWJsZVxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXHJcbiAgICovXHJcbiAgYWRkOiBmdW5jdGlvbih0YWJsZSwgZGF0YSl7XHJcbiAgICB0cnl7XHJcbiAgICAgIHRoaXMudHggPSB0aGlzLmRiLnRyYW5zYWN0aW9uKFt0YWJsZV0sIFwicmVhZHdyaXRlXCIpO1xyXG4gICAgICB0aGlzLnN0b3JlID0gdGhpcy50eC5vYmplY3RTdG9yZSh0YWJsZSk7XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLnB1dChkYXRhKTtcclxuICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzIGFkZGVkXCIpO1xyXG4gICAgfWNhdGNoKGUpe1xyXG4gICAgICBjb25zb2xlLmxvZyhcIkZhaWxlZCBhZGRlZFwiKTtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXHJcbiAqXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgob25zdWNjZXNzKSA9PiB7XHJcbiAgICAgIHZhciBkYiwgaWRiO1xyXG5cclxuICAgICAgaWRiID0gbmV3IERCKG5hbWUpO1xyXG4gICAgICBkYiA9IGlkYi5vLm9wZW4obmFtZSk7XHJcblxyXG4gICAgICBkYi5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlkYi52ZXJzaW9uID0gZGIucmVzdWx0LnZlcnNpb24gPT0gMSA/IDIgOiBkYi5yZXN1bHQudmVyc2lvbjtcclxuICAgICAgICBkYi5yZXN1bHQuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgb25zdWNjZXNzKGlkYik7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgKVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgLyoqXHJcbiAgICog0JLRi9C30YvQstCw0LXRgiDRhNGD0L3QutGG0LjRjiDRh9C10YDQtdC3INGD0LrQsNC30LDQvdC90L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQvNC40LvQu9C40YHQtdC60YPQvdC0INCyINC60L7QvdGC0LXQutGB0YLQtSBjdHgg0YEg0LDRgNCz0YPQvNC10L3RgtCw0LzQuCBhcmdzLlxyXG4gICAqIEBwYXJhbSB7aW50fSB0aW1lb3V0XHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGN0eFxyXG4gICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3NcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9INCY0LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINGC0LDQudC80LDRg9GC0LAuXHJcbiAgICovXHJcbiAgRnVuY3Rpb24ucHJvdG90eXBlLmdrRGVsYXkgPSBmdW5jdGlvbih0aW1lb3V0LCBjdHgsIGFyZ3Mpe1xyXG4gICAgdmFyIGZ1bmMgPSB0aGlzO1xyXG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgIGZ1bmMuYXBwbHkoY3R4LCBhcmdzIHx8IFtdKTtcclxuICAgIH0sIHRpbWVvdXQpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBBcnJheS5wcm90b3R5cGUuZ2tFeGlzdCA9IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgIHZhciBsZW5ndGgsIGFycmF5O1xyXG5cclxuICAgIGFycmF5ID0gdGhpcztcclxuICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcclxuXHJcbiAgICB3aGlsZShsZW5ndGgtLSl7XHJcbiAgICAgIGlmKGFycmF5W2xlbmd0aF0gPT0gdmFsdWUpe1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgbWV0aG9kLCBwYXJhbSkge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgob25zdWNjZXNzLCBvbmZhaWx1cmUpID0+IHtcclxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgcmVxdWVzdC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcclxuICAgIGlmIChtZXRob2QgPT0gJ1BPU1QnKSByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgIHJlcXVlc3Quc2VuZChwYXJhbSk7XHJcblxyXG4gICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT0gNCAmJiByZXF1ZXN0LnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICBvbnN1Y2Nlc3MocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICB9IGVsc2UgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcXVlc3Quc3RhdHVzICE9IDIwMCkge1xyXG4gICAgICAgIG9uZmFpbHVyZShyZXF1ZXN0KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59OyIsInZhciAkID0gcmVxdWlyZSgnLi9kb20nKTtcclxudmFyIGJpbmRFdmVudCA9IHJlcXVpcmUoJy4vZXZlbnRzJyk7XHJcblxyXG5mdW5jdGlvbiBUYWJsZShub2Rlc0lELCBzZXR0aW5nc0tleSwgc2V0dGluZ3Mpe1xyXG4gIHRoaXMuaGVhZGVyID0gbm9kZXNJRFswXTtcclxuICB0aGlzLmJvZHkgPSBub2Rlc0lEWzFdO1xyXG4gIHRoaXMuZm9vdGVyID0gbm9kZXNJRFsyXTtcclxuICB0aGlzLm5hbWUgPSBzZXR0aW5nc0tleTtcclxuICB0aGlzLnN0cnVjdHVyZSA9IHt9O1xyXG4gIHRoaXMuY29udGVudCA9IFtdO1xyXG4gIHRoaXMuc2l6ZSA9IFtdO1xyXG4gIC8vdGhpcy50aGVtZXMgPSAkc2QuZm9ydW1zWyRjZC5maWRdLnRoZW1lcztcclxuICAvL3RoaXMucGxheWVycyA9ICRzZC5wbGF5ZXJzO1xyXG4gIHRoaXMuc29ydCA9IHtcclxuICAgIGNlbGw6IG51bGwsXHJcbiAgICB0eXBlOiBudWxsXHJcbiAgfTtcclxuICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XHJcbiAgdGhpcy5yb3dzID0gMDtcclxufVxyXG5cclxuVGFibGUucHJvdG90eXBlID0ge1xyXG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZ2V0TmFtZTogZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLm5hbWU7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHJldHVybnMge29iamVjdFtdfVxyXG4gICAqL1xyXG4gIGdldENvbnRlbnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5jb250ZW50O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0TGFzdFJvd0NvbnRlbnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5yb3dzIC0gMTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge29iamVjdH0gZWxlbWVudFxyXG4gICAqL1xyXG4gIHB1c2hDb250ZW50OiBmdW5jdGlvbihlbGVtZW50KXtcclxuICAgIHRoaXMuY29udGVudC5wdXNoKGVsZW1lbnQpO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqL1xyXG4gIGNsZWFyQ29udGVudDogZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuY29udGVudCA9IFtdO1xyXG4gICAgdGhpcy5yb3dzID0gMDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge29iamVjdH0gaWNvbnNcclxuICAgKi9cclxuICBzZXRDb250cm9sOiBmdW5jdGlvbihpY29ucyl7XHJcbiAgICB0aGlzLnNldFNvcnRzKGljb25zKTtcclxuICAgIHRoaXMuc2V0RmlsdGVycyhpY29ucyk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHJldHVybnMge29iamVjdH1cclxuICAgKi9cclxuICBnZXRTdHJ1Y3R1cmU6IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5zdHJ1Y3R1cmU7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJbXX0gYXJyYXlcclxuICAgKi9cclxuICBzZXRXaWR0aDogZnVuY3Rpb24oYXJyYXkpe1xyXG4gICAgdmFyIHRhYmxlID0gdGhpcztcclxuXHJcbiAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGVsZW1lbnQsIGlkKXtcclxuICAgICAgdGFibGUuc2l6ZVtpZF0gPSBlbGVtZW50O1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAgICogQHBhcmFtIHtib29sZWFufG51bGx9IGNoZWNrXHJcbiAgICogQHJldHVybnMge3N0cmluZ31cclxuICAgKi9cclxuICBnZXRXaWR0aDogZnVuY3Rpb24oaW5kZXgsIGNoZWNrKXtcclxuICAgIHZhciB3aWR0aDtcclxuXHJcbiAgICBpZih0aGlzLnNpemVbaW5kZXhdKXtcclxuICAgICAgd2lkdGggPSBjaGVjayA/IHRoaXMuc2l6ZVtpbmRleF0gLSAxNyA6IHRoaXMuc2l6ZVtpbmRleF07XHJcbiAgICAgIHJldHVybiB3aWR0aCAhPSAtMSA/IGB3aWR0aD1cIiR7d2lkdGh9XCJgIDogXCJcIjtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBAcGFyYW0ge251bWJlcn0gaWRcclxuICAgKiBAcmV0dXJucyB7b2JqZWN0W119XHJcbiAgICovXHJcbiAgc2V0Q29udGVudDogZnVuY3Rpb24oaWQpe1xyXG4gICAgdmFyIHRhYmxlLCBvO1xyXG5cclxuICAgIHRhYmxlID0gdGhpcztcclxuICAgIG8gPSB7fTtcclxuXHJcbiAgICBPYmplY3Qua2V5cyh0YWJsZS5nZXRTdHJ1Y3R1cmUoKSkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgIGlmKHRhYmxlLnN0cnVjdHVyZVt2YWx1ZV0ucGF0aC5sZW5ndGggPT0gMil7XHJcbiAgICAgICAgb1t2YWx1ZV0gPSBldmFsKHRhYmxlLnN0cnVjdHVyZVt2YWx1ZV0ucGF0aFswXSArIFwiWydcIiArIGlkICsgXCInXVwiICsgdGFibGUuc3RydWN0dXJlW3ZhbHVlXS5wYXRoWzFdKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgaWYodGFibGUuc3RydWN0dXJlW3ZhbHVlXS5wYXRoWzBdID09IFwiTnVtYmVyKGlkKVwiKXtcclxuICAgICAgICAgIG9bdmFsdWVdID0gTnVtYmVyKGlkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGlmKCF0YWJsZS5maWx0ZXJpbmcobykpIHJldHVybiBudWxsO1xyXG5cclxuICAgIHRhYmxlLnB1c2hDb250ZW50KG8pO1xyXG4gICAgcmV0dXJuIHRhYmxlLmNvbnRlbnRbdGFibGUuZ2V0TGFzdFJvd0NvbnRlbnQoKV07XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGljb25zXHJcbiAgICovXHJcbiAgY2hhbmdlU29ydEltYWdlOiBmdW5jdGlvbihpY29ucyl7XHJcbiAgICB2YXIgdmFsdWUsIHR5cGUsIG9sZEltZywgbmV3SW1nO1xyXG5cclxuICAgIHZhbHVlID0gdGhpcy5zZXR0aW5ncy5zb3J0W3RoaXMubmFtZV0uY2VsbDtcclxuICAgIHR5cGUgPSB0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS50eXBlO1xyXG5cclxuICAgIGlmKHZhbHVlICE9IHRoaXMuc29ydC5jZWxsKXtcclxuICAgICAgb2xkSW1nID0gJCh0aGlzLmhlYWRlcikuZmluZChgdGRbc29ydD1cIiR7dGhpcy5zb3J0LmNlbGx9XCJdYCkubm9kZSgpLmxhc3RDaGlsZDtcclxuICAgICAgb2xkSW1nLnNyYyA9IGljb25zLnNvcnROdWxsO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld0ltZyA9ICQodGhpcy5oZWFkZXIpLmZpbmQoYHRkW3NvcnQ9XCIke3ZhbHVlfVwiXWApLm5vZGUoKS5sYXN0Q2hpbGQ7XHJcbiAgICBuZXdJbWcuc3JjID0gdHlwZSA/IGljb25zLnNvcnREb3duIDogaWNvbnMuc29ydFVwO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjZWxsXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGljb25zXHJcbiAgICovXHJcbiAgc2V0U29ydEltYWdlOiBmdW5jdGlvbih0ZCwgY2VsbCwgaWNvbnMpe1xyXG4gICAgdmFyIGltZyA9ICQodGQpLmZpbmQoJ2ltZycpLm5vZGUoKTtcclxuXHJcbiAgICBpZih0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS5jZWxsICE9IGNlbGwpe1xyXG4gICAgICBpbWcuc3JjID0gaWNvbnMuc29ydE51bGw7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgaW1nLnNyYyA9IHRoaXMuc2V0dGluZ3Muc29ydFt0aGlzLm5hbWVdLnR5cGUgPyBpY29ucy5zb3J0RG93biA6IGljb25zLnNvcnRVcDtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqL1xyXG4gIHNldFNvcnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLnNvcnQuY2VsbCA9IHRoaXMuc2V0dGluZ3Muc29ydFt0aGlzLm5hbWVdLmNlbGw7XHJcbiAgICB0aGlzLnNvcnQudHlwZSA9IHRoaXMuc2V0dGluZ3Muc29ydFt0aGlzLm5hbWVdLnR5cGU7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKi9cclxuICBzb3J0aW5nOiBmdW5jdGlvbigpe1xyXG4gICAgdmFyIHZhbHVlLCB0eXBlLCBhcnJheTtcclxuXHJcbiAgICBhcnJheSA9IHRoaXMuZ2V0Q29udGVudCgpO1xyXG4gICAgdmFsdWUgPSB0aGlzLnNldHRpbmdzLnNvcnRbdGhpcy5uYW1lXS5jZWxsO1xyXG4gICAgdHlwZSA9IHRoaXMuc2V0dGluZ3Muc29ydFt0aGlzLm5hbWVdLnR5cGU7XHJcblxyXG4gICAgYXJyYXkuc29ydChcclxuICAgICAgZnVuY3Rpb24oZTEsIGUyKXtcclxuICAgICAgICB2YXIgcDEsIHAyLCByZXM7XHJcblxyXG4gICAgICAgIHAxID0gZTFbdmFsdWVdOyBwMiA9IGUyW3ZhbHVlXTtcclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHAxID09IFwib2JqZWN0XCIpe1xyXG4gICAgICAgICAgaWYocDEubmFtZSl7XHJcbiAgICAgICAgICAgIHAxID0gcDEubmFtZTtcclxuICAgICAgICAgICAgcDIgPSBwMi5uYW1lO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYocDEudGV4dCl7XHJcbiAgICAgICAgICAgIHAxID0gcDEudGV4dDtcclxuICAgICAgICAgICAgcDIgPSBwMi50ZXh0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzID0gY29tcGFyZShwMSwgcDIpO1xyXG4gICAgICAgIGlmKHR5cGUpIHJlcyA9IHJlcyA9PSAtMSA/IDEgOiAtMTtcclxuICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBhcmUoZTEsIGUyKXtcclxuICAgICAgaWYgKGUxID4gZTIpIHJldHVybiAxO1xyXG4gICAgICBlbHNlIGlmIChlMSA8IGUyKSByZXR1cm4gLTE7XHJcbiAgICAgIGVsc2UgcmV0dXJuIDA7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGljb25zXHJcbiAgICovXHJcbiAgc2V0U29ydHM6IGZ1bmN0aW9uKGljb25zKXtcclxuICAgIHZhciB0YWJsZSA9IHRoaXM7XHJcblxyXG4gICAgJCh0YWJsZS5oZWFkZXIpLmZpbmQoJ3RkW3NvcnRdJykubm9kZUFycigpLmZvckVhY2goZnVuY3Rpb24odGQpe1xyXG4gICAgICB2YXIgdmFsdWU7XHJcblxyXG4gICAgICB2YWx1ZSA9IHRkLmdldEF0dHJpYnV0ZShcInNvcnRcIik7XHJcbiAgICAgIHRhYmxlLnNldFNvcnRJbWFnZSh0ZCwgdmFsdWUsIGljb25zKTtcclxuICAgICAgYmluZEV2ZW50KHRkLCAnb25jbGljaycsIGZ1bmN0aW9uKCl7ZG9Tb3J0KHRkLCB0YWJsZSl9KTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7KltdfSB2YWx1ZXNcclxuICAgKi9cclxuICBzZXRTdHJ1Y3R1cmU6IGZ1bmN0aW9uKHZhbHVlcyl7XHJcbiAgICB2YXIgdGFibGUsIHBhdGhzO1xyXG5cclxuICAgIHRhYmxlID0gdGhpcztcclxuICAgIHBhdGhzID0gdmFsdWVzWzBdO1xyXG5cclxuICAgIHZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0pe1xyXG4gICAgICBpZihlbGVtWzBdICE9IFwicGF0aHNcIikge1xyXG4gICAgICAgIHRhYmxlLnN0cnVjdHVyZVtlbGVtWzBdXSA9IHtcclxuICAgICAgICAgIHBhdGg6IGdldFBhdGgoZWxlbVsxXSwgZWxlbVsyXSksXHJcbiAgICAgICAgICBmaWx0ZXJUeXBlOiBlbGVtWzNdLFxyXG4gICAgICAgICAgZmlsdGVyTmFtZTogZWxlbVs0XVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFBhdGgoZTEsIGUyKXtcclxuICAgICAgdmFyIHJlc3VsdDtcclxuXHJcbiAgICAgIGlmKGUxKXtcclxuICAgICAgICByZXN1bHQgPSBwYXRoc1tlMV0gKyBlMjtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQuc3BsaXQoXCJbaWRdXCIpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICByZXN1bHQgPSBbZTJdO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IGljb25zXHJcbiAgICovXHJcbiAgc2V0RmlsdGVyczogZnVuY3Rpb24oaWNvbnMpe1xyXG4gICAgdmFyIHRhYmxlID0gdGhpcztcclxuXHJcbiAgICAkKHRhYmxlLmZvb3RlcikuZmluZCgndGRbZmlsdGVyXScpLm5vZGVBcnIoKS5mb3JFYWNoKGZ1bmN0aW9uKHRkKXtcclxuICAgICAgdmFyIHZhbHVlLCBpY287XHJcblxyXG4gICAgICB2YWx1ZSA9IHRkLmdldEF0dHJpYnV0ZShcImZpbHRlclwiKTtcclxuXHJcbiAgICAgIGlmKHRhYmxlLnN0cnVjdHVyZVt2YWx1ZV0uZmlsdGVyVHlwZSl7XHJcbiAgICAgICAgaWNvID0gdGFibGUuc2V0dGluZ3Muc2hvdy50aGVtZXNbdmFsdWVdID8gaWNvbnMuYm94T24gOiBpY29ucy5ib3hPZmY7XHJcbiAgICAgICAgaWNvID0gYDxpbWcgc3R5bGU9XCJtYXJnaW4tbGVmdDogMXB4O1wiIHNyYz1cIiR7aWNvfVwiLz5gO1xyXG4gICAgICAgIHRkLmlubmVySFRNTCArPSBpY287XHJcblxyXG4gICAgICAgIGJpbmRFdmVudCh0ZCwgJ29uY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgZG9GaWx0ZXIodGQsIHRhYmxlLnNldHRpbmdzLCB0YWJsZS5zdHJ1Y3R1cmVbdmFsdWVdLmZpbHRlclR5cGUsIHRhYmxlLnN0cnVjdHVyZVt2YWx1ZV0uZmlsdGVyTmFtZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwYXJhbSB7b2JqZWN0fSByb3dcclxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgKi9cclxuICBmaWx0ZXJpbmc6IGZ1bmN0aW9uKHJvdyl7XHJcbiAgICB2YXIgZmlsdGVyLCB2YWx1ZSwgbGVuZ3RoLCBsaXN0O1xyXG5cclxuICAgIGZpbHRlciA9IHRoaXMuc2V0dGluZ3Muc2hvd1t0aGlzLm5hbWVdO1xyXG4gICAgbGlzdCA9IE9iamVjdC5rZXlzKGZpbHRlcik7XHJcbiAgICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcclxuXHJcbiAgICB3aGlsZShsZW5ndGgtLSl7XHJcbiAgICAgIHZhbHVlID0gbGlzdFtsZW5ndGhdO1xyXG5cclxuICAgICAgc3dpdGNoIChmaWx0ZXJbdmFsdWVdLnR5cGUpe1xyXG4gICAgICAgIGNhc2UgXCJib29sZWFuXCI6XHJcbiAgICAgICAgICBpZiAoZmlsdGVyW3ZhbHVlXS52YWx1ZSAhPSByb3dbdmFsdWVdKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgY2FzZSBcIm11bHRpcGxlXCI6XHJcbiAgICAgICAgICBpZighZXhpc3Qocm93W3ZhbHVlXS50ZXh0LCBmaWx0ZXJbdmFsdWVdLnZhbHVlKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgIGNhc2UgXCJjaGVja1wiOlxyXG4gICAgICAgICAgaWYoIWV4aXN0KHJvd1t2YWx1ZV0ubmFtZSwgZmlsdGVyW3ZhbHVlXS52YWx1ZSkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgaWYgKGNvbXBhcmUoZmlsdGVyW3ZhbHVlXS52YWx1ZSAsIHJvd1t2YWx1ZV0pKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbXBhcmUoaywgbil7XHJcbiAgICAgIC8vaWYoayA9PSBudWxsKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIGlmKGlzTmFOKG4pKSBuID0gcGFyc2VJbnQobiwgMTApO1xyXG4gICAgICByZXR1cm4gIShrWzBdIDw9IG4gJiYgbiA8PSBrWzFdKTtcclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmdbXX0gbm9kZXNJRFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc2V0dGluZ3NLZXlcclxuICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXHJcbiAqIEByZXR1cm5zIHtUYWJsZX1cclxuICovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5vZGVzSUQsIHNldHRpbmdzS2V5LCBzZXR0aW5ncyl7XHJcbiAgcmV0dXJuIG5ldyBUYWJsZShub2Rlc0lELCBzZXR0aW5nc0tleSwgc2V0dGluZ3MpO1xyXG59OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvY3JlYXRlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2VcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiLy8gVGhpcyBtZXRob2Qgb2Ygb2J0YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0IG5lZWRzIHRvIGJlXG4vLyBrZXB0IGlkZW50aWNhbCB0byB0aGUgd2F5IGl0IGlzIG9idGFpbmVkIGluIHJ1bnRpbWUuanNcbnZhciBnID1cbiAgdHlwZW9mIGdsb2JhbCA9PT0gXCJvYmplY3RcIiA/IGdsb2JhbCA6XG4gIHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIgPyB3aW5kb3cgOlxuICB0eXBlb2Ygc2VsZiA9PT0gXCJvYmplY3RcIiA/IHNlbGYgOiB0aGlzO1xuXG4vLyBVc2UgYGdldE93blByb3BlcnR5TmFtZXNgIGJlY2F1c2Ugbm90IGFsbCBicm93c2VycyBzdXBwb3J0IGNhbGxpbmdcbi8vIGBoYXNPd25Qcm9wZXJ0eWAgb24gdGhlIGdsb2JhbCBgc2VsZmAgb2JqZWN0IGluIGEgd29ya2VyLiBTZWUgIzE4My5cbnZhciBoYWRSdW50aW1lID0gZy5yZWdlbmVyYXRvclJ1bnRpbWUgJiZcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoZykuaW5kZXhPZihcInJlZ2VuZXJhdG9yUnVudGltZVwiKSA+PSAwO1xuXG4vLyBTYXZlIHRoZSBvbGQgcmVnZW5lcmF0b3JSdW50aW1lIGluIGNhc2UgaXQgbmVlZHMgdG8gYmUgcmVzdG9yZWQgbGF0ZXIuXG52YXIgb2xkUnVudGltZSA9IGhhZFJ1bnRpbWUgJiYgZy5yZWdlbmVyYXRvclJ1bnRpbWU7XG5cbi8vIEZvcmNlIHJlZXZhbHV0YXRpb24gb2YgcnVudGltZS5qcy5cbmcucmVnZW5lcmF0b3JSdW50aW1lID0gdW5kZWZpbmVkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3J1bnRpbWVcIik7XG5cbmlmIChoYWRSdW50aW1lKSB7XG4gIC8vIFJlc3RvcmUgdGhlIG9yaWdpbmFsIHJ1bnRpbWUuXG4gIGcucmVnZW5lcmF0b3JSdW50aW1lID0gb2xkUnVudGltZTtcbn0gZWxzZSB7XG4gIC8vIFJlbW92ZSB0aGUgZ2xvYmFsIHByb3BlcnR5IGFkZGVkIGJ5IHJ1bnRpbWUuanMuXG4gIHRyeSB7XG4gICAgZGVsZXRlIGcucmVnZW5lcmF0b3JSdW50aW1lO1xuICB9IGNhdGNoKGUpIHtcbiAgICBnLnJlZ2VuZXJhdG9yUnVudGltZSA9IHVuZGVmaW5lZDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IG1vZHVsZS5leHBvcnRzLCBfX2VzTW9kdWxlOiB0cnVlIH07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF9TeW1ib2wgPSByZXF1aXJlKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbFwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfT2JqZWN0JGNyZWF0ZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2NyZWF0ZVwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfT2JqZWN0JHNldFByb3RvdHlwZU9mID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZlwiKVtcImRlZmF1bHRcIl07XG5cbnZhciBfUHJvbWlzZSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvcHJvbWlzZVwiKVtcImRlZmF1bHRcIl07XG5cbiEoZnVuY3Rpb24gKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIF9TeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IF9TeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICB2YXIgaW5Nb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiO1xuICB2YXIgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIGlmIChydW50aW1lKSB7XG4gICAgaWYgKGluTW9kdWxlKSB7XG4gICAgICAvLyBJZiByZWdlbmVyYXRvclJ1bnRpbWUgaXMgZGVmaW5lZCBnbG9iYWxseSBhbmQgd2UncmUgaW4gYSBtb2R1bGUsXG4gICAgICAvLyBtYWtlIHRoZSBleHBvcnRzIG9iamVjdCBpZGVudGljYWwgdG8gcmVnZW5lcmF0b3JSdW50aW1lLlxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBydW50aW1lO1xuICAgIH1cbiAgICAvLyBEb24ndCBib3RoZXIgZXZhbHVhdGluZyB0aGUgcmVzdCBvZiB0aGlzIGZpbGUgaWYgdGhlIHJ1bnRpbWUgd2FzXG4gICAgLy8gYWxyZWFkeSBkZWZpbmVkIGdsb2JhbGx5LlxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERlZmluZSB0aGUgcnVudGltZSBnbG9iYWxseSAoYXMgZXhwZWN0ZWQgYnkgZ2VuZXJhdGVkIGNvZGUpIGFzIGVpdGhlclxuICAvLyBtb2R1bGUuZXhwb3J0cyAoaWYgd2UncmUgaW4gYSBtb2R1bGUpIG9yIGEgbmV3LCBlbXB0eSBvYmplY3QuXG4gIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lID0gaW5Nb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA6IHt9O1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkLCB0aGVuIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yLlxuICAgIHZhciBnZW5lcmF0b3IgPSBfT2JqZWN0JGNyZWF0ZSgob3V0ZXJGbiB8fCBHZW5lcmF0b3IpLnByb3RvdHlwZSk7XG4gICAgdmFyIGNvbnRleHQgPSBuZXcgQ29udGV4dCh0cnlMb2NzTGlzdCB8fCBbXSk7XG5cbiAgICAvLyBUaGUgLl9pbnZva2UgbWV0aG9kIHVuaWZpZXMgdGhlIGltcGxlbWVudGF0aW9ucyBvZiB0aGUgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiBtZXRob2RzLlxuICAgIGdlbmVyYXRvci5faW52b2tlID0gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcblxuICAgIHJldHVybiBnZW5lcmF0b3I7XG4gIH1cbiAgcnVudGltZS53cmFwID0gd3JhcDtcblxuICAvLyBUcnkvY2F0Y2ggaGVscGVyIHRvIG1pbmltaXplIGRlb3B0aW1pemF0aW9ucy4gUmV0dXJucyBhIGNvbXBsZXRpb25cbiAgLy8gcmVjb3JkIGxpa2UgY29udGV4dC50cnlFbnRyaWVzW2ldLmNvbXBsZXRpb24uIFRoaXMgaW50ZXJmYWNlIGNvdWxkXG4gIC8vIGhhdmUgYmVlbiAoYW5kIHdhcyBwcmV2aW91c2x5KSBkZXNpZ25lZCB0byB0YWtlIGEgY2xvc3VyZSB0byBiZVxuICAvLyBpbnZva2VkIHdpdGhvdXQgYXJndW1lbnRzLCBidXQgaW4gYWxsIHRoZSBjYXNlcyB3ZSBjYXJlIGFib3V0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhbiBleGlzdGluZyBtZXRob2Qgd2Ugd2FudCB0byBjYWxsLCBzbyB0aGVyZSdzIG5vIG5lZWRcbiAgLy8gdG8gY3JlYXRlIGEgbmV3IGZ1bmN0aW9uIG9iamVjdC4gV2UgY2FuIGV2ZW4gZ2V0IGF3YXkgd2l0aCBhc3N1bWluZ1xuICAvLyB0aGUgbWV0aG9kIHRha2VzIGV4YWN0bHkgb25lIGFyZ3VtZW50LCBzaW5jZSB0aGF0IGhhcHBlbnMgdG8gYmUgdHJ1ZVxuICAvLyBpbiBldmVyeSBjYXNlLCBzbyB3ZSBkb24ndCBoYXZlIHRvIHRvdWNoIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBUaGVcbiAgLy8gb25seSBhZGRpdGlvbmFsIGFsbG9jYXRpb24gcmVxdWlyZWQgaXMgdGhlIGNvbXBsZXRpb24gcmVjb3JkLCB3aGljaFxuICAvLyBoYXMgYSBzdGFibGUgc2hhcGUgYW5kIHNvIGhvcGVmdWxseSBzaG91bGQgYmUgY2hlYXAgdG8gYWxsb2NhdGUuXG4gIGZ1bmN0aW9uIHRyeUNhdGNoKGZuLCBvYmosIGFyZykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcIm5vcm1hbFwiLCBhcmc6IGZuLmNhbGwob2JqLCBhcmcpIH07XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4geyB0eXBlOiBcInRocm93XCIsIGFyZzogZXJyIH07XG4gICAgfVxuICB9XG5cbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkU3RhcnQgPSBcInN1c3BlbmRlZFN0YXJ0XCI7XG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkID0gXCJzdXNwZW5kZWRZaWVsZFwiO1xuICB2YXIgR2VuU3RhdGVFeGVjdXRpbmcgPSBcImV4ZWN1dGluZ1wiO1xuICB2YXIgR2VuU3RhdGVDb21wbGV0ZWQgPSBcImNvbXBsZXRlZFwiO1xuXG4gIC8vIFJldHVybmluZyB0aGlzIG9iamVjdCBmcm9tIHRoZSBpbm5lckZuIGhhcyB0aGUgc2FtZSBlZmZlY3QgYXNcbiAgLy8gYnJlYWtpbmcgb3V0IG9mIHRoZSBkaXNwYXRjaCBzd2l0Y2ggc3RhdGVtZW50LlxuICB2YXIgQ29udGludWVTZW50aW5lbCA9IHt9O1xuXG4gIC8vIER1bW15IGNvbnN0cnVjdG9yIGZ1bmN0aW9ucyB0aGF0IHdlIHVzZSBhcyB0aGUgLmNvbnN0cnVjdG9yIGFuZFxuICAvLyAuY29uc3RydWN0b3IucHJvdG90eXBlIHByb3BlcnRpZXMgZm9yIGZ1bmN0aW9ucyB0aGF0IHJldHVybiBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0cy4gRm9yIGZ1bGwgc3BlYyBjb21wbGlhbmNlLCB5b3UgbWF5IHdpc2ggdG8gY29uZmlndXJlIHlvdXJcbiAgLy8gbWluaWZpZXIgbm90IHRvIG1hbmdsZSB0aGUgbmFtZXMgb2YgdGhlc2UgdHdvIGZ1bmN0aW9ucy5cbiAgZnVuY3Rpb24gR2VuZXJhdG9yKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb24oKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSgpIHt9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID0gR2VuZXJhdG9yLnByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb24ucHJvdG90eXBlID0gR3AuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUuY29uc3RydWN0b3IgPSBHZW5lcmF0b3JGdW5jdGlvbjtcbiAgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGVbdG9TdHJpbmdUYWdTeW1ib2xdID0gR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24gKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faW52b2tlKG1ldGhvZCwgYXJnKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbiAoZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIiA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uIChnZW5GdW4pIHtcbiAgICBpZiAoX09iamVjdCRzZXRQcm90b3R5cGVPZikge1xuICAgICAgX09iamVjdCRzZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gX09iamVjdCRjcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgLy8gV2l0aGluIHRoZSBib2R5IG9mIGFueSBhc3luYyBmdW5jdGlvbiwgYGF3YWl0IHhgIGlzIHRyYW5zZm9ybWVkIHRvXG4gIC8vIGB5aWVsZCByZWdlbmVyYXRvclJ1bnRpbWUuYXdyYXAoeClgLCBzbyB0aGF0IHRoZSBydW50aW1lIGNhbiB0ZXN0XG4gIC8vIGB2YWx1ZSBpbnN0YW5jZW9mIEF3YWl0QXJndW1lbnRgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLiBTb21lIG1heSBjb25zaWRlciB0aGUgbmFtZSBvZiB0aGlzIG1ldGhvZCB0b29cbiAgLy8gY3V0ZXN5LCBidXQgdGhleSBhcmUgY3VybXVkZ2VvbnMuXG4gIHJ1bnRpbWUuYXdyYXAgPSBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIG5ldyBBd2FpdEFyZ3VtZW50KGFyZyk7XG4gIH07XG5cbiAgZnVuY3Rpb24gQXdhaXRBcmd1bWVudChhcmcpIHtcbiAgICB0aGlzLmFyZyA9IGFyZztcbiAgfVxuXG4gIGZ1bmN0aW9uIEFzeW5jSXRlcmF0b3IoZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQXdhaXRBcmd1bWVudCkge1xuICAgICAgICAgIHJldHVybiBfUHJvbWlzZS5yZXNvbHZlKHZhbHVlLmFyZykudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGludm9rZShcIm5leHRcIiwgdmFsdWUsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF9Qcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24gKHVud3JhcHBlZCkge1xuICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgLy8gdGhlIC52YWx1ZSBvZiB0aGUgUHJvbWlzZTx7dmFsdWUsZG9uZX0+IHJlc3VsdCBmb3IgdGhlXG4gICAgICAgICAgLy8gY3VycmVudCBpdGVyYXRpb24uIElmIHRoZSBQcm9taXNlIGlzIHJlamVjdGVkLCBob3dldmVyLCB0aGVcbiAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAgIC8vIHJlYXNvbi4gTm90ZSB0aGF0IHJlamVjdGlvbnMgb2YgeWllbGRlZCBQcm9taXNlcyBhcmUgbm90XG4gICAgICAgICAgLy8gdGhyb3duIGJhY2sgaW50byB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBhcyBpcyB0aGUgY2FzZVxuICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgICAvLyBiZWhhdmlvciBiZXR3ZWVuIHlpZWxkIGFuZCBhd2FpdCBpcyBpbXBvcnRhbnQsIGJlY2F1c2UgaXRcbiAgICAgICAgICAvLyBhbGxvd3MgdGhlIGNvbnN1bWVyIHRvIGRlY2lkZSB3aGF0IHRvIGRvIHdpdGggdGhlIHlpZWxkZWRcbiAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAgIC8vIGludG8gdGhlIGdlbmVyYXRvciwgYWJhbmRvbiBpdGVyYXRpb24sIHdoYXRldmVyKS4gV2l0aFxuICAgICAgICAgIC8vIGF3YWl0LCBieSBjb250cmFzdCwgdGhlcmUgaXMgbm8gb3Bwb3J0dW5pdHkgdG8gZXhhbWluZSB0aGVcbiAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgICAgLy8gb25seSBvcHRpb24gaXMgdG8gdGhyb3cgaXQgZnJvbSB0aGUgYXdhaXQgZXhwcmVzc2lvbiwgYW5kXG4gICAgICAgICAgLy8gbGV0IHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gaGFuZGxlIHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy5kb21haW4pIHtcbiAgICAgIGludm9rZSA9IHByb2Nlc3MuZG9tYWluLmJpbmQoaW52b2tlKTtcbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgX1Byb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uIChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3Iod3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkpO1xuXG4gICAgcmV0dXJuIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKSA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIiB8fCBtZXRob2QgPT09IFwidGhyb3dcIiAmJiBkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2RdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIEEgcmV0dXJuIG9yIHRocm93ICh3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gdGhyb3dcbiAgICAgICAgICAgIC8vIG1ldGhvZCkgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICAgIHZhciByZXR1cm5NZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXTtcbiAgICAgICAgICAgIGlmIChyZXR1cm5NZXRob2QpIHtcbiAgICAgICAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKHJldHVybk1ldGhvZCwgZGVsZWdhdGUuaXRlcmF0b3IsIGFyZyk7XG4gICAgICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJldHVybiBtZXRob2QgdGhyZXcgYW4gZXhjZXB0aW9uLCBsZXQgdGhhdFxuICAgICAgICAgICAgICAgIC8vIGV4Y2VwdGlvbiBwcmV2YWlsIG92ZXIgdGhlIG9yaWdpbmFsIHJldHVybiBvciB0aHJvdy5cbiAgICAgICAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgICAgIC8vIENvbnRpbnVlIHdpdGggdGhlIG91dGVyIHJldHVybiwgbm93IHRoYXQgdGhlIGRlbGVnYXRlXG4gICAgICAgICAgICAgIC8vIGl0ZXJhdG9yIGhhcyBiZWVuIHRlcm1pbmF0ZWQuXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChkZWxlZ2F0ZS5pdGVyYXRvclttZXRob2RdLCBkZWxlZ2F0ZS5pdGVyYXRvciwgYXJnKTtcblxuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gTGlrZSByZXR1cm5pbmcgZ2VuZXJhdG9yLnRocm93KHVuY2F1Z2h0KSwgYnV0IHdpdGhvdXQgdGhlXG4gICAgICAgICAgICAvLyBvdmVyaGVhZCBvZiBhbiBleHRyYSBmdW5jdGlvbiBjYWxsLlxuICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERlbGVnYXRlIGdlbmVyYXRvciByYW4gYW5kIGhhbmRsZWQgaXRzIG93biBleGNlcHRpb25zIHNvXG4gICAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGF0IHRoZSBtZXRob2Qgd2FzLCB3ZSBjb250aW51ZSBhcyBpZiBpdCBpc1xuICAgICAgICAgIC8vIFwibmV4dFwiIHdpdGggYW4gdW5kZWZpbmVkIGFyZy5cbiAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG4gICAgICAgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSBhcmc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHQuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oYXJnKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lID8gR2VuU3RhdGVDb21wbGV0ZWQgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgdmFyIGluZm8gPSB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQuZGVsZWdhdGUgJiYgbWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGluZm87XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBtZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICAgIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uIHJlc2V0KHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgdGhpcy5zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiYgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiYgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24gZGlzcGF0Y2hFeGNlcHRpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG4gICAgICAgIHJldHVybiAhIWNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbiBhYnJ1cHQodHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiYgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJiB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiYgKHR5cGUgPT09IFwiYnJlYWtcIiB8fCB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8IHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24gZmluaXNoKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24gX2NhdGNoKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbiBkZWxlZ2F0ZVlpZWxkKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4vLyBBbW9uZyB0aGUgdmFyaW91cyB0cmlja3MgZm9yIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsXG4vLyBvYmplY3QsIHRoaXMgc2VlbXMgdG8gYmUgdGhlIG1vc3QgcmVsaWFibGUgdGVjaG5pcXVlIHRoYXQgZG9lcyBub3Rcbi8vIHVzZSBpbmRpcmVjdCBldmFsICh3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSkuXG50eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDogdHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIiA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiID8gc2VsZiA6IHVuZGVmaW5lZCk7IiwidmFyICQgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlKFAsIEQpe1xuICByZXR1cm4gJC5jcmVhdGUoUCwgRCk7XG59OyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5rZXlzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJC5jb3JlJykuT2JqZWN0LmtleXM7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5PYmplY3Quc2V0UHJvdG90eXBlT2Y7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnByb21pc2UnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy8kLmNvcmUnKS5Qcm9taXNlOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQuY29yZScpLlN5bWJvbDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi8kLmNvZicpXG4gICwgVEFHID0gcmVxdWlyZSgnLi8kLndrcycpKCd0b1N0cmluZ1RhZycpXG4gIC8vIEVTMyB3cm9uZyBoZXJlXG4gICwgQVJHID0gY29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSAoTyA9IE9iamVjdChpdCkpW1RBR10pID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzEuMi42J307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi8kLmZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBrZXlzICAgICAgID0gJC5nZXRLZXlzKGl0KVxuICAgICwgZ2V0U3ltYm9scyA9ICQuZ2V0U3ltYm9scztcbiAgaWYoZ2V0U3ltYm9scyl7XG4gICAgdmFyIHN5bWJvbHMgPSBnZXRTeW1ib2xzKGl0KVxuICAgICAgLCBpc0VudW0gID0gJC5pc0VudW1cbiAgICAgICwgaSAgICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKHN5bWJvbHMubGVuZ3RoID4gaSlpZihpc0VudW0uY2FsbChpdCwga2V5ID0gc3ltYm9sc1tpKytdKSlrZXlzLnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4ga2V5cztcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vJC5jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgSVNfV1JBUCAgID0gdHlwZSAmICRleHBvcnQuV1xuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGtleSwgb3duLCBvdXQ7XG4gIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYga2V5IGluIHRhcmdldDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbihDKXtcbiAgICAgIHZhciBGID0gZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIEMgPyBuZXcgQyhwYXJhbSkgOiBDKHBhcmFtKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgaWYoSVNfUFJPVE8pKGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pKVtrZXldID0gb3V0O1xuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7IC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAvLyB3cmFwXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwidmFyIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgY2FsbCAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vJC5pcy1hcnJheS1pdGVyJylcbiAgLCBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi8kLnRvLWxlbmd0aCcpXG4gICwgZ2V0SXRlckZuICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQpe1xuICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKGl0ZXJhYmxlKVxuICAgICwgZiAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yO1xuICBpZih0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZihpc0FycmF5SXRlcihpdGVyRm4pKWZvcihsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKyl7XG4gICAgZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICB9IGVsc2UgZm9yKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7ICl7XG4gICAgY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gIH1cbn07IiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0JylcbiAgLCBnZXROYW1lcyAgPSByZXF1aXJlKCcuLyQnKS5nZXROYW1lc1xuICAsIHRvU3RyaW5nICA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xuXG52YXIgZ2V0V2luZG93TmFtZXMgPSBmdW5jdGlvbihpdCl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGdldE5hbWVzKGl0KTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZ2V0ID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIGlmKHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nKXJldHVybiBnZXRXaW5kb3dOYW1lcyhpdCk7XG4gIHJldHVybiBnZXROYW1lcyh0b0lPYmplY3QoaXQpKTtcbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi8kLnByb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gJC5zZXREZXNjKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJykuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgYXJncywgdGhhdCl7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgfSByZXR1cm4gICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTsiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyAgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJylcbiAgLCBJVEVSQVRPUiAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59OyIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi8kLmNvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07IiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoKGUpe1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYocmV0ICE9PSB1bmRlZmluZWQpYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZGVzY3JpcHRvciAgICAgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuLyQuc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuLyQuaGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9ICQuY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7bmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KX0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi8kLmxpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUnKVxuICAsIGhpZGUgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhhcycpXG4gICwgSXRlcmF0b3JzICAgICAgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJylcbiAgLCAkaXRlckNyZWF0ZSAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuLyQuc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIGdldFByb3RvICAgICAgID0gcmVxdWlyZSgnLi8kJykuZ2V0UHJvdG9cbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEJVR0dZICAgICAgICAgID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbiAgLCBGRl9JVEVSQVRPUiAgICA9ICdAQGl0ZXJhdG9yJ1xuICAsIEtFWVMgICAgICAgICAgID0gJ2tleXMnXG4gICwgVkFMVUVTICAgICAgICAgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpe1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbihraW5kKXtcbiAgICBpZighQlVHR1kgJiYga2luZCBpbiBwcm90bylyZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgICAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXG4gICAgLCBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVNcbiAgICAsIFZBTFVFU19CVUcgPSBmYWxzZVxuICAgICwgcHJvdG8gICAgICA9IEJhc2UucHJvdG90eXBlXG4gICAgLCAkbmF0aXZlICAgID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXG4gICAgLCAkZGVmYXVsdCAgID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVClcbiAgICAsIG1ldGhvZHMsIGtleTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZigkbmF0aXZlKXtcbiAgICB2YXIgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90bygkZGVmYXVsdC5jYWxsKG5ldyBCYXNlKSk7XG4gICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgIC8vIEZGIGZpeFxuICAgIGlmKCFMSUJSQVJZICYmIGhhcyhwcm90bywgRkZfSVRFUkFUT1IpKWhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gICAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUyl7XG4gICAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCl7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gICAgfVxuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogICAgSVNfU0VUICAgICAgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKVxuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTsiLCJ2YXIgSVRFUkFUT1IgICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYywgc2tpcENsb3Npbmcpe1xuICBpZighc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciAgPSBbN11cbiAgICAgICwgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbigpeyBzYWZlID0gdHJ1ZTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24oKXsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwidmFyICRPYmplY3QgPSBPYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlOiAgICAgJE9iamVjdC5jcmVhdGUsXG4gIGdldFByb3RvOiAgICRPYmplY3QuZ2V0UHJvdG90eXBlT2YsXG4gIGlzRW51bTogICAgIHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlLFxuICBnZXREZXNjOiAgICAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgc2V0RGVzYzogICAgJE9iamVjdC5kZWZpbmVQcm9wZXJ0eSxcbiAgc2V0RGVzY3M6ICAgJE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzLFxuICBnZXRLZXlzOiAgICAkT2JqZWN0LmtleXMsXG4gIGdldE5hbWVzOiAgICRPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgZ2V0U3ltYm9sczogJE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gIGVhY2g6ICAgICAgIFtdLmZvckVhY2hcbn07IiwidmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwga2V5cyAgID0gJC5nZXRLZXlzKE8pXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaW5kZXggID0gMFxuICAgICwga2V5O1xuICB3aGlsZShsZW5ndGggPiBpbmRleClpZihPW2tleSA9IGtleXNbaW5kZXgrK11dID09PSBlbClyZXR1cm4ga2V5O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHRydWU7IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vJC50YXNrJykuc2V0XG4gICwgT2JzZXJ2ZXIgID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXJcbiAgLCBwcm9jZXNzICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIFByb21pc2UgICA9IGdsb2JhbC5Qcm9taXNlXG4gICwgaXNOb2RlICAgID0gcmVxdWlyZSgnLi8kLmNvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJ1xuICAsIGhlYWQsIGxhc3QsIG5vdGlmeTtcblxudmFyIGZsdXNoID0gZnVuY3Rpb24oKXtcbiAgdmFyIHBhcmVudCwgZG9tYWluLCBmbjtcbiAgaWYoaXNOb2RlICYmIChwYXJlbnQgPSBwcm9jZXNzLmRvbWFpbikpe1xuICAgIHByb2Nlc3MuZG9tYWluID0gbnVsbDtcbiAgICBwYXJlbnQuZXhpdCgpO1xuICB9XG4gIHdoaWxlKGhlYWQpe1xuICAgIGRvbWFpbiA9IGhlYWQuZG9tYWluO1xuICAgIGZuICAgICA9IGhlYWQuZm47XG4gICAgaWYoZG9tYWluKWRvbWFpbi5lbnRlcigpO1xuICAgIGZuKCk7IC8vIDwtIGN1cnJlbnRseSB3ZSB1c2UgaXQgb25seSBmb3IgUHJvbWlzZSAtIHRyeSAvIGNhdGNoIG5vdCByZXF1aXJlZFxuICAgIGlmKGRvbWFpbilkb21haW4uZXhpdCgpO1xuICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgaWYocGFyZW50KXBhcmVudC5lbnRlcigpO1xufTtcblxuLy8gTm9kZS5qc1xuaWYoaXNOb2RlKXtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgfTtcbi8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlclxufSBlbHNlIGlmKE9ic2VydmVyKXtcbiAgdmFyIHRvZ2dsZSA9IDFcbiAgICAsIG5vZGUgICA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgbm9kZS5kYXRhID0gdG9nZ2xlID0gLXRvZ2dsZTtcbiAgfTtcbi8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG59IGVsc2UgaWYoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpe1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZmx1c2gpO1xuICB9O1xuLy8gZm9yIG90aGVyIGVudmlyb25tZW50cyAtIG1hY3JvdGFzayBiYXNlZCBvbjpcbi8vIC0gc2V0SW1tZWRpYXRlXG4vLyAtIE1lc3NhZ2VDaGFubmVsXG4vLyAtIHdpbmRvdy5wb3N0TWVzc2FnXG4vLyAtIG9ucmVhZHlzdGF0ZWNoYW5nZVxuLy8gLSBzZXRUaW1lb3V0XG59IGVsc2Uge1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICBtYWNyb3Rhc2suY2FsbChnbG9iYWwsIGZsdXNoKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBhc2FwKGZuKXtcbiAgdmFyIHRhc2sgPSB7Zm46IGZuLCBuZXh0OiB1bmRlZmluZWQsIGRvbWFpbjogaXNOb2RlICYmIHByb2Nlc3MuZG9tYWlufTtcbiAgaWYobGFzdClsYXN0Lm5leHQgPSB0YXNrO1xuICBpZighaGVhZCl7XG4gICAgaGVhZCA9IHRhc2s7XG4gICAgbm90aWZ5KCk7XG4gIH0gbGFzdCA9IHRhc2s7XG59OyIsIi8vIG1vc3QgT2JqZWN0IG1ldGhvZHMgYnkgRVM2IHNob3VsZCBhY2NlcHQgcHJpbWl0aXZlc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBjb3JlICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsIGZhaWxzICAgPSByZXF1aXJlKCcuLyQuZmFpbHMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZLCBleGVjKXtcbiAgdmFyIGZuICA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXVxuICAgICwgZXhwID0ge307XG4gIGV4cFtLRVldID0gZXhlYyhmbik7XG4gICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24oKXsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsInZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YXJnZXQsIHNyYyl7XG4gIGZvcih2YXIga2V5IGluIHNyYylyZWRlZmluZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICByZXR1cm4gdGFyZ2V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5oaWRlJyk7IiwiLy8gNy4yLjkgU2FtZVZhbHVlKHgsIHkpXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5pcyB8fCBmdW5jdGlvbiBpcyh4LCB5KXtcbiAgcmV0dXJuIHggPT09IHkgPyB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geSA6IHggIT0geCAmJiB5ICE9IHk7XG59OyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBnZXREZXNjICA9IHJlcXVpcmUoJy4vJCcpLmdldERlc2NcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24oTywgcHJvdG8pe1xuICBhbk9iamVjdChPKTtcbiAgaWYoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCl0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbih0ZXN0LCBidWdneSwgc2V0KXtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBnZXREZXNjKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNvcmUgICAgICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsICQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpXG4gICwgU1BFQ0lFUyAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVkpe1xuICB2YXIgQyA9IGNvcmVbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkkLnNldERlc2MoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9XG4gIH0pO1xufTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi8kJykuc2V0RGVzY1xuICAsIGhhcyA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcbiAgaWYoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSlkZWYoaXQsIFRBRywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZ30pO1xufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYS1mdW5jdGlvbicpXG4gICwgU1BFQ0lFUyAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE8sIEQpe1xuICB2YXIgQyA9IGFuT2JqZWN0KE8pLmNvbnN0cnVjdG9yLCBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lKXtcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSl0aHJvdyBUeXBlRXJyb3IobmFtZSArIFwiOiB1c2UgdGhlICduZXcnIG9wZXJhdG9yIVwiKTtcbiAgcmV0dXJuIGl0O1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi8kLnRvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xuICByZXR1cm4gZnVuY3Rpb24odGhhdCwgcG9zKXtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICAgLCBpID0gdG9JbnRlZ2VyKHBvcylcbiAgICAgICwgbCA9IHMubGVuZ3RoXG4gICAgICAsIGEsIGI7XG4gICAgaWYoaSA8IDAgfHwgaSA+PSBsKXJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59OyIsInZhciBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcbiAgLCBpbnZva2UgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcbiAgLCBodG1sICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaHRtbCcpXG4gICwgY2VsICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmRvbS1jcmVhdGUnKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgc2V0VGFzayAgICAgICAgICAgID0gZ2xvYmFsLnNldEltbWVkaWF0ZVxuICAsIGNsZWFyVGFzayAgICAgICAgICA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZVxuICAsIE1lc3NhZ2VDaGFubmVsICAgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxuICAsIGNvdW50ZXIgICAgICAgICAgICA9IDBcbiAgLCBxdWV1ZSAgICAgICAgICAgICAgPSB7fVxuICAsIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnXG4gICwgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG52YXIgcnVuID0gZnVuY3Rpb24oKXtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIGlmKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcbnZhciBsaXN0bmVyID0gZnVuY3Rpb24oZXZlbnQpe1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZighc2V0VGFzayB8fCAhY2xlYXJUYXNrKXtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbil7XG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCl7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmKHJlcXVpcmUoJy4vJC5jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcycpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmKE1lc3NhZ2VDaGFubmVsKXtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xuICAgIHBvcnQgICAgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdG5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0Jykpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6ICAgc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vJC5pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi8kLmRlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vJC50by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsInZhciBpZCA9IDBcbiAgLCBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59OyIsInZhciBzdG9yZSAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJykoJ3drcycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpXG4gICwgU3ltYm9sID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLlN5bWJvbDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFN5bWJvbCAmJiBTeW1ib2xbbmFtZV0gfHwgKFN5bWJvbCB8fCB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vJC5jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi8kLmFkZC10by11bnNjb3BhYmxlcycpXG4gICwgc3RlcCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJylcbiAgLCB0b0lPYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCIvLyAxOS4xLjIuMTQgT2JqZWN0LmtleXMoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vJC50by1vYmplY3QnKTtcblxucmVxdWlyZSgnLi8kLm9iamVjdC1zYXAnKSgna2V5cycsIGZ1bmN0aW9uKCRrZXlzKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIGtleXMoaXQpe1xuICAgIHJldHVybiAka2V5cyh0b09iamVjdChpdCkpO1xuICB9O1xufSk7IiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7c2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKS5zZXR9KTsiLCIiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgTElCUkFSWSAgICA9IHJlcXVpcmUoJy4vJC5saWJyYXJ5JylcbiAgLCBnbG9iYWwgICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgY3R4ICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGNsYXNzb2YgICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgJGV4cG9ydCAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICA9IHJlcXVpcmUoJy4vJC5hLWZ1bmN0aW9uJylcbiAgLCBzdHJpY3ROZXcgID0gcmVxdWlyZSgnLi8kLnN0cmljdC1uZXcnKVxuICAsIGZvck9mICAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzZXRQcm90byAgID0gcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldFxuICAsIHNhbWUgICAgICAgPSByZXF1aXJlKCcuLyQuc2FtZS12YWx1ZScpXG4gICwgU1BFQ0lFUyAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMtY29uc3RydWN0b3InKVxuICAsIGFzYXAgICAgICAgPSByZXF1aXJlKCcuLyQubWljcm90YXNrJylcbiAgLCBQUk9NSVNFICAgID0gJ1Byb21pc2UnXG4gICwgcHJvY2VzcyAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgaXNOb2RlICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgUCAgICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIFdyYXBwZXI7XG5cbnZhciB0ZXN0UmVzb2x2ZSA9IGZ1bmN0aW9uKHN1Yil7XG4gIHZhciB0ZXN0ID0gbmV3IFAoZnVuY3Rpb24oKXt9KTtcbiAgaWYoc3ViKXRlc3QuY29uc3RydWN0b3IgPSBPYmplY3Q7XG4gIHJldHVybiBQLnJlc29sdmUodGVzdCkgPT09IHRlc3Q7XG59O1xuXG52YXIgVVNFX05BVElWRSA9IGZ1bmN0aW9uKCl7XG4gIHZhciB3b3JrcyA9IGZhbHNlO1xuICBmdW5jdGlvbiBQMih4KXtcbiAgICB2YXIgc2VsZiA9IG5ldyBQKHgpO1xuICAgIHNldFByb3RvKHNlbGYsIFAyLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cbiAgdHJ5IHtcbiAgICB3b3JrcyA9IFAgJiYgUC5yZXNvbHZlICYmIHRlc3RSZXNvbHZlKCk7XG4gICAgc2V0UHJvdG8oUDIsIFApO1xuICAgIFAyLnByb3RvdHlwZSA9ICQuY3JlYXRlKFAucHJvdG90eXBlLCB7Y29uc3RydWN0b3I6IHt2YWx1ZTogUDJ9fSk7XG4gICAgLy8gYWN0dWFsIEZpcmVmb3ggaGFzIGJyb2tlbiBzdWJjbGFzcyBzdXBwb3J0LCB0ZXN0IHRoYXRcbiAgICBpZighKFAyLnJlc29sdmUoNSkudGhlbihmdW5jdGlvbigpe30pIGluc3RhbmNlb2YgUDIpKXtcbiAgICAgIHdvcmtzID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIGFjdHVhbCBWOCBidWcsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTYyXG4gICAgaWYod29ya3MgJiYgcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJykpe1xuICAgICAgdmFyIHRoZW5hYmxlVGhlbkdvdHRlbiA9IGZhbHNlO1xuICAgICAgUC5yZXNvbHZlKCQuc2V0RGVzYyh7fSwgJ3RoZW4nLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKXsgdGhlbmFibGVUaGVuR290dGVuID0gdHJ1ZTsgfVxuICAgICAgfSkpO1xuICAgICAgd29ya3MgPSB0aGVuYWJsZVRoZW5Hb3R0ZW47XG4gICAgfVxuICB9IGNhdGNoKGUpeyB3b3JrcyA9IGZhbHNlOyB9XG4gIHJldHVybiB3b3Jrcztcbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIHNhbWVDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKGEsIGIpe1xuICAvLyBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIGlmKExJQlJBUlkgJiYgYSA9PT0gUCAmJiBiID09PSBXcmFwcGVyKXJldHVybiB0cnVlO1xuICByZXR1cm4gc2FtZShhLCBiKTtcbn07XG52YXIgZ2V0Q29uc3RydWN0b3IgPSBmdW5jdGlvbihDKXtcbiAgdmFyIFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXTtcbiAgcmV0dXJuIFMgIT0gdW5kZWZpbmVkID8gUyA6IEM7XG59O1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uKCQkcmVzb2x2ZSwgJCRyZWplY3Qpe1xuICAgIGlmKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSksXG4gIHRoaXMucmVqZWN0ICA9IGFGdW5jdGlvbihyZWplY3QpXG59O1xudmFyIHBlcmZvcm0gPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHtlcnJvcjogZX07XG4gIH1cbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24ocmVjb3JkLCBpc1JlamVjdCl7XG4gIGlmKHJlY29yZC5uKXJldHVybjtcbiAgcmVjb3JkLm4gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSByZWNvcmQuYztcbiAgYXNhcChmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHJlY29yZC52XG4gICAgICAsIG9rICAgID0gcmVjb3JkLnMgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uKHJlYWN0aW9uKXtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWxcbiAgICAgICAgLCByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZVxuICAgICAgICAsIHJlamVjdCAgPSByZWFjdGlvbi5yZWplY3RcbiAgICAgICAgLCByZXN1bHQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihoYW5kbGVyKXtcbiAgICAgICAgICBpZighb2spcmVjb3JkLmggPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIgPT09IHRydWUgPyB2YWx1ZSA6IGhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgIGlmKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSl7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKXtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBjaGFpbi5sZW5ndGggPSAwO1xuICAgIHJlY29yZC5uID0gZmFsc2U7XG4gICAgaWYoaXNSZWplY3Qpc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgdmFyIHByb21pc2UgPSByZWNvcmQucFxuICAgICAgICAsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgICBpZihpc1VuaGFuZGxlZChwcm9taXNlKSl7XG4gICAgICAgIGlmKGlzTm9kZSl7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKXtcbiAgICAgICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZigoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gcmVjb3JkLmEgPSB1bmRlZmluZWQ7XG4gICAgfSwgMSk7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB2YXIgcmVjb3JkID0gcHJvbWlzZS5fZFxuICAgICwgY2hhaW4gID0gcmVjb3JkLmEgfHwgcmVjb3JkLmNcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlYWN0aW9uO1xuICBpZihyZWNvcmQuaClyZXR1cm4gZmFsc2U7XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgcmVjb3JkLnMgPSAyO1xuICByZWNvcmQuYSA9IHJlY29yZC5jLnNsaWNlKCk7XG4gIG5vdGlmeShyZWNvcmQsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHJlY29yZCA9IHRoaXNcbiAgICAsIHRoZW47XG4gIGlmKHJlY29yZC5kKXJldHVybjtcbiAgcmVjb3JkLmQgPSB0cnVlO1xuICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmKHJlY29yZC5wID09PSB2YWx1ZSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgYXNhcChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgd3JhcHBlciA9IHtyOiByZWNvcmQsIGQ6IGZhbHNlfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvcmQudiA9IHZhbHVlO1xuICAgICAgcmVjb3JkLnMgPSAxO1xuICAgICAgbm90aWZ5KHJlY29yZCwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe3I6IHJlY29yZCwgZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIVVTRV9OQVRJVkUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICBQID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICB2YXIgcmVjb3JkID0gdGhpcy5fZCA9IHtcbiAgICAgIHA6IHN0cmljdE5ldyh0aGlzLCBQLCBQUk9NSVNFKSwgICAgICAgICAvLyA8LSBwcm9taXNlXG4gICAgICBjOiBbXSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgICBhOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICAgIHM6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgICAgZDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICAgIHY6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgaDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGhhbmRsZWQgcmVqZWN0aW9uXG4gICAgICBuOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCByZWNvcmQsIDEpLCBjdHgoJHJlamVjdCwgcmVjb3JkLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHJlY29yZCwgZXJyKTtcbiAgICB9XG4gIH07XG4gIHJlcXVpcmUoJy4vJC5yZWRlZmluZS1hbGwnKShQLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIFApKVxuICAgICAgICAsIHByb21pc2UgID0gcmVhY3Rpb24ucHJvbWlzZVxuICAgICAgICAsIHJlY29yZCAgID0gdGhpcy5fZDtcbiAgICAgIHJlYWN0aW9uLm9rICAgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWNvcmQuYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHJlY29yZC5hKXJlY29yZC5hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYocmVjb3JkLnMpbm90aWZ5KHJlY29yZCwgZmFsc2UpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtQcm9taXNlOiBQfSk7XG5yZXF1aXJlKCcuLyQuc2V0LXRvLXN0cmluZy10YWcnKShQLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vJC5zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vJC5jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZWplY3QgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgdGVzdFJlc29sdmUodHJ1ZSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xuICAgIC8vIGluc3RhbmNlb2YgaW5zdGVhZCBvZiBpbnRlcm5hbCBzbG90IGNoZWNrIGJlY2F1c2Ugd2Ugc2hvdWxkIGZpeCBpdCB3aXRob3V0IHJlcGxhY2VtZW50IG5hdGl2ZSBQcm9taXNlIGNvcmVcbiAgICBpZih4IGluc3RhbmNlb2YgUCAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcykpcmV0dXJuIHg7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZXNvbHZlICA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICAkJHJlc29sdmUoeCk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgUC5hbGwoaXRlcilbJ2NhdGNoJ10oZnVuY3Rpb24oKXt9KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gZ2V0Q29uc3RydWN0b3IodGhpcylcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZXNvbHZlICAgID0gY2FwYWJpbGl0eS5yZXNvbHZlXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdFxuICAgICAgLCB2YWx1ZXMgICAgID0gW107XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgdmFsdWVzLnB1c2gsIHZhbHVlcyk7XG4gICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aFxuICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XG4gICAgICBpZihyZW1haW5pbmcpJC5lYWNoLmNhbGwodmFsdWVzLCBmdW5jdGlvbihwcm9taXNlLCBpbmRleCl7XG4gICAgICAgIHZhciBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBpZihhbHJlYWR5Q2FsbGVkKXJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIGVsc2UgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IGdldENvbnN0cnVjdG9yKHRoaXMpXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciAkICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIERFU0NSSVBUT1JTICAgID0gcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lJylcbiAgLCAkZmFpbHMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5mYWlscycpXG4gICwgc2hhcmVkICAgICAgICAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgdWlkICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJylcbiAgLCB3a3MgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKVxuICAsIGtleU9mICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmtleW9mJylcbiAgLCAkbmFtZXMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5nZXQtbmFtZXMnKVxuICAsIGVudW1LZXlzICAgICAgID0gcmVxdWlyZSgnLi8kLmVudW0ta2V5cycpXG4gICwgaXNBcnJheSAgICAgICAgPSByZXF1aXJlKCcuLyQuaXMtYXJyYXknKVxuICAsIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgdG9JT2JqZWN0ICAgICAgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpXG4gICwgY3JlYXRlRGVzYyAgICAgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpXG4gICwgZ2V0RGVzYyAgICAgICAgPSAkLmdldERlc2NcbiAgLCBzZXREZXNjICAgICAgICA9ICQuc2V0RGVzY1xuICAsIF9jcmVhdGUgICAgICAgID0gJC5jcmVhdGVcbiAgLCBnZXROYW1lcyAgICAgICA9ICRuYW1lcy5nZXRcbiAgLCAkU3ltYm9sICAgICAgICA9IGdsb2JhbC5TeW1ib2xcbiAgLCAkSlNPTiAgICAgICAgICA9IGdsb2JhbC5KU09OXG4gICwgX3N0cmluZ2lmeSAgICAgPSAkSlNPTiAmJiAkSlNPTi5zdHJpbmdpZnlcbiAgLCBzZXR0ZXIgICAgICAgICA9IGZhbHNlXG4gICwgSElEREVOICAgICAgICAgPSB3a3MoJ19oaWRkZW4nKVxuICAsIGlzRW51bSAgICAgICAgID0gJC5pc0VudW1cbiAgLCBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5JylcbiAgLCBBbGxTeW1ib2xzICAgICA9IHNoYXJlZCgnc3ltYm9scycpXG4gICwgdXNlTmF0aXZlICAgICAgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nXG4gICwgT2JqZWN0UHJvdG8gICAgPSBPYmplY3QucHJvdG90eXBlO1xuXG4vLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWQsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD02ODdcbnZhciBzZXRTeW1ib2xEZXNjID0gREVTQ1JJUFRPUlMgJiYgJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBfY3JlYXRlKHNldERlc2Moe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHNldERlc2ModGhpcywgJ2EnLCB7dmFsdWU6IDd9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uKGl0LCBrZXksIEQpe1xuICB2YXIgcHJvdG9EZXNjID0gZ2V0RGVzYyhPYmplY3RQcm90bywga2V5KTtcbiAgaWYocHJvdG9EZXNjKWRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICBzZXREZXNjKGl0LCBrZXksIEQpO1xuICBpZihwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKXNldERlc2MoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBzZXREZXNjO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uKHRhZyl7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2wucHJvdG90eXBlKTtcbiAgc3ltLl9rID0gdGFnO1xuICBERVNDUklQVE9SUyAmJiBzZXR0ZXIgJiYgc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgaWYoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSl0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpe1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpc2V0RGVzYyhpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKWl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwge2VudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gc2V0RGVzYyhpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKXtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpXG4gICAgLCBpICAgID0gMFxuICAgICwgbCA9IGtleXMubGVuZ3RoXG4gICAgLCBrZXk7XG4gIHdoaWxlKGwgPiBpKSRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSl7XG4gIHZhciBFID0gaXNFbnVtLmNhbGwodGhpcywga2V5KTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XVxuICAgID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIHZhciBEID0gZ2V0RGVzYyhpdCA9IHRvSU9iamVjdChpdCksIGtleSk7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSlELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn07XG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTilyZXN1bHQucHVzaChrZXkpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSlyZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KGl0KXtcbiAgaWYoaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gIHZhciBhcmdzID0gW2l0XVxuICAgICwgaSAgICA9IDFcbiAgICAsICQkICAgPSBhcmd1bWVudHNcbiAgICAsIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gIHdoaWxlKCQkLmxlbmd0aCA+IGkpYXJncy5wdXNoKCQkW2krK10pO1xuICByZXBsYWNlciA9IGFyZ3NbMV07XG4gIGlmKHR5cGVvZiByZXBsYWNlciA9PSAnZnVuY3Rpb24nKSRyZXBsYWNlciA9IHJlcGxhY2VyO1xuICBpZigkcmVwbGFjZXIgfHwgIWlzQXJyYXkocmVwbGFjZXIpKXJlcGxhY2VyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgaWYoJHJlcGxhY2VyKXZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgaWYoIWlzU3ltYm9sKHZhbHVlKSlyZXR1cm4gdmFsdWU7XG4gIH07XG4gIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xufTtcbnZhciBidWdneUpTT04gPSAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoe2E6IFN9KSAhPSAne30nIHx8IF9zdHJpbmdpZnkoT2JqZWN0KFMpKSAhPSAne30nO1xufSk7XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIXVzZU5hdGl2ZSl7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKXtcbiAgICBpZihpc1N5bWJvbCh0aGlzKSl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgIHJldHVybiB3cmFwKHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCkpO1xuICB9O1xuICByZWRlZmluZSgkU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgaXNTeW1ib2wgPSBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbiAgfTtcblxuICAkLmNyZWF0ZSAgICAgPSAkY3JlYXRlO1xuICAkLmlzRW51bSAgICAgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gICQuZ2V0RGVzYyAgICA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICQuc2V0RGVzYyAgICA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgJC5zZXREZXNjcyAgID0gJGRlZmluZVByb3BlcnRpZXM7XG4gICQuZ2V0TmFtZXMgICA9ICRuYW1lcy5nZXQgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgJC5nZXRTeW1ib2xzID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZihERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi8kLmxpYnJhcnknKSl7XG4gICAgcmVkZWZpbmUoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG4gIH1cbn1cblxudmFyIHN5bWJvbFN0YXRpY3MgPSB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKGtleSl7XG4gICAgcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cbn07XG4vLyAxOS40LjIuMiBTeW1ib2wuaGFzSW5zdGFuY2Vcbi8vIDE5LjQuMi4zIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVcbi8vIDE5LjQuMi40IFN5bWJvbC5pdGVyYXRvclxuLy8gMTkuNC4yLjYgU3ltYm9sLm1hdGNoXG4vLyAxOS40LjIuOCBTeW1ib2wucmVwbGFjZVxuLy8gMTkuNC4yLjkgU3ltYm9sLnNlYXJjaFxuLy8gMTkuNC4yLjEwIFN5bWJvbC5zcGVjaWVzXG4vLyAxOS40LjIuMTEgU3ltYm9sLnNwbGl0XG4vLyAxOS40LjIuMTIgU3ltYm9sLnRvUHJpbWl0aXZlXG4vLyAxOS40LjIuMTMgU3ltYm9sLnRvU3RyaW5nVGFnXG4vLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXG4kLmVhY2guY2FsbCgoXG4gICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsJyArXG4gICdzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihpdCl7XG4gIHZhciBzeW0gPSB3a3MoaXQpO1xuICBzeW1ib2xTdGF0aWNzW2l0XSA9IHVzZU5hdGl2ZSA/IHN5bSA6IHdyYXAoc3ltKTtcbn0pO1xuXG5zZXR0ZXIgPSB0cnVlO1xuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVywge1N5bWJvbDogJFN5bWJvbH0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1N5bWJvbCcsIHN5bWJvbFN0YXRpY3MpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICF1c2VOYXRpdmUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCF1c2VOYXRpdmUgfHwgYnVnZ3lKU09OKSwgJ0pTT04nLCB7c3RyaW5naWZ5OiAkc3RyaW5naWZ5fSk7XG5cbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJyk7XG5JdGVyYXRvcnMuTm9kZUxpc3QgPSBJdGVyYXRvcnMuSFRNTENvbGxlY3Rpb24gPSBJdGVyYXRvcnMuQXJyYXk7IiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGxvYWRpbmc6IFwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoR1FBWkFLVUFBQXhlRElTeWhFeU9WTHphdkNSeUxHeWliTlR1MUtUS3BCeHFIR1NhWk16bXpEeCtQT1Q2NUxUU3RCeG1ISFNxZEJSbUhGeVdYTVRpeERSNk5CUmlGSnpDbkZTU1ZNVGV4Q3h5TEhTbWRPVDI1S3pPckNSdUpHU2VaT3o2N0xUV3RBeGVGSXk2akx6ZXZHeWlkTnp5M0tUS3JCeHFKTlRxMUR5Q1JIeXVmRlNTWEN4Mk5HU2ViT3orN0xUV3ZQRC84QUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUNIL0MwNUZWRk5EUVZCRk1pNHdBd0VBQUFBaCtRUUpEUUF2QUN3QUFBQUFHUUFaQUFBR3pzQ1hjRWdzR28vSXBITEpmSjBVME9oUTAycHVRSUFzQUZKOVpTWWhEZk9xNVFwSDJaVmtxWmxvS1YxMEZqSlFSclJiajlCUTBISklTQjlhS0NBT1hVSmtBQ05JQWxrTExSc21oMElCV1JSaVJSb1VXUnRDZFprT1dTVkdFbGtnZWtrcVdROUdEVmtjazBaeWkwVWlBQ0JtU1FsWkdVWWtXQUFYUmdaQ0hnUlpGVWNMV1JGR0xNa0hwaWRIRlZySlJMc0JDRmtDU0MzTHZKZ3ZFY0MzQ2trS0psb1lReXg0MStnWVdCeERIVm9nOEVrYUtTWUVRN3YzOHVrVE1XUkFoUkFISzFSZzBLU2h3NGNRaHdRQkFDSDVCQWtOQURFQUxBQUFBQUFaQUJrQWhReGVESVN5aEV5S1RMemV2RHgrUEp6R25HeWliTnp5M0NSdUpGeVdYTlRxMUt6U3JCUm1ISlMrbEhTcWZPVDY1RlNTVk16bXpFU0dSS3pPckJSaUZJeTZqTVRleEtUS3BIU21kQ3h5TEdTYVpOenUzTFRTdEJ4bUhPejY3QXhlRklTMmhFeU9WRHlDUkd5aWRPVDI1Q1J5TEZ5YVpOVHUxSnpDbkh5dWZGU1NYRVNHVE1UaXhLVEtyTFRXdEJ4cUhPeis3UEQvOEFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQWJZd0pod1NDd2FqOFdLQllac0Zoc0FBb3JrZEpJNkFNQUxzNmtlT1lnczRCUHhFa2tKY1hZMUxMQ3FKSkU2MnhKNlNwMkJNNTBsT0xRZVFoTlpDQWRJTG1JbU1CNElBVU1jSDFralNDRjlnVEVCWFVNQldSUlVSU1FVV1JORFRHY01kRVlzV1IrWFNDcFpLVVljV1NXbVNCaVNSZ05aSGJkSGZCaEdCNUVBRmswd0pWa05Sd1JaQ1U5RExhd0tSeWhpekVJbkZHVVJMMWtoU0I0RWtRSkRLUjhHRngyUlpFM2VINlF4RHdqRllpaFZFU0dtMDJvZkJXYUlyRkFUb2t4QU94cEVaZEZ6a01pR0ZDVStRR3RZeE1PRUJKOG9tZ2tDQUNINUJBa05BREFBTEFBQUFBQVpBQmtBaFF4ZURJUzJoRXlLVEx6ZXZDeDJMR3lpYktUS3BOenkzQ1J1SkhTcWRMVFd0TlRxMUR5Q1JCUm1IRnlXWExUU3RPVDY1SnpDbk16bXpLelNySHl1ZkJSaUZGU1NWTVRleER4K1BIU21kS3pPckN4eUxFU0dST3o2N0p6R25BeGVGRXlPVkRSNk5HeWlkS1RLck9UMjVDUnlMSFNxZkx6YXZOVHUxQnhxSEZ5YVpIeXVoTVRpeEVTR1RPeis3SnpHcFBELzhBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBYlhRSmh3U0JRdVVNV2tzampZTEpaUTVzY1poUjVPQVFCZ2c2d1NINjJLZHN6MXdraU9zUnJ3MFhoSkRIVURvZjI4ekdrdFJ0RTVmVDRSUXgwa1N3cGpCUjFDZm5kQ0hTQUZTd0phSVlsQ0xBYUNJQUFOaEVVa1lnQVRVQ1FwV3BoRkxIV1ZTeFphRkVrUFdpVXVVUmxhSWtrbldpbXJTZzRmQUJsSkI4QWZGMUF1ZEFDQlNSaHNKME1rb2tNamRVOUpFUi9UWndJSlF4S2xBQ0JMTHNkQ0pDMEEzaDB2NFI4U2Ira0FJUmJLYk14UkVQSnI5Mllrem1zK1dMaG01a0NJU1NaZUhEQlR4T0FIWVF5VkhNQmdJdUtTQXlPOEJBRUFJZmtFQ1EwQVBBQXNBQUFBQUJrQUdRQ0ZERjRNaExLRVRJcE12TnE4TEhZMG5NYWNaSjVrMU83VUpHNGtyTktzZEtwOGxMNlV6T2JNUElKRTVQcmtGR1ljWEpaY3hPTEVyTTZzakxxTVZKSlVQSDQ4cE1ha2RLWjA1UGJrdE5LMGZLcDhGR0lVeE43RU5INDhiS0pzM083Y0xISXNuTUtjUklKRTdQcnNIR1ljdE5hMGZLNThERjRVaExhRVRJNVV2TjY4TkhvMG5NYWtKSElzbE1LYzFPclVYSnBreE9MTWpMcVVWSkpjcE1xa2JLSjAzUExjUklaRTdQN3NIR29jdE5hOGZLNkU4UC93QUFBQUFBQUFBQUFBQnRGQW5uQklMQnFQU0NNbnlTUmlFSmhtMFRhUVpGNjRDV0FoRlNZRUo0QVlRTWlkT3JnbVpqWnV0d2RNVEtQOUFDSGNFQ1prM05DTmVDTTZiUVIvUnlWakJvVkNHbUlOTklwR0FtSVZrQ01yTlF4cUcySUpSU05SbmtZUllpZVFSaU1TS1FGR0dXSXRhVW1NQUI1R0F5Y1FjRXd3WWdwR0RqWkdzRU1qTFdJaFVnTVFHVVVXcEM5SkRnc1ZBQzJRRERsaUtVa1RKR01hUXpnRjNRQW5tVWdMYlNjQ0JqTjNwTWRKR0E5dWJpY3NVaDZrWVdNbk0rWk5NUUNBd0pBZ3dBVUZGZzUwR1hKRHhzSWtFa0E5bklna0NBQWgrUVFKRFFBeEFDd0FBQUFBR1FBWkFJVU1YZ3lFc29STWlreTgycndzZGpTY3hweGtubVRVN3RRa2JpU3MwcXdVWmh4Y2xsdzhna1IwcW56ayt1U3N6cXljd3B4VWtsVE01c3lreHFSMHBuVGs5dVJFZ2tRVVloU011b3hzb216Yzd0d3NjaXkwMHJRY2FoeEVoa1FNWGhTTXRveE1qbFRFNHNRMGVqU2N4cVFrY2l4a21tUjhybnpzL3V4VWtselU2dFNreXFSc29uVGM4dHkwMXJRY2FpUkVoa3p3Ly9BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFHdDhDWWNFZ3NHby9JcEhMSlBMWUdENDRLMVNRbVlCZUFGa0RBVklTU1ZiS1MycHExQkpIa2hVRldHR2JGNXZYWlhsNEFFSEt4WlF5b0tCSXNaM3BHSEZzbVZFVWdaZ0ZISVZvTWlrUnJqVVlPRENNakxrWWFEQWdsb0NVUVZhV21wNmd4TFNrTEVhd3BuRVVvRkFZR0lrWXFaeG1UUXhOYUh3ZTRaaGE4WUIxYUtVZTVaaFF0UXlnUWVBQWZFc3EvV3g4Q0ppa0kyS1RXdGh0MVo3L2Z5aXhVRlEzUzJDa3FTaWk4RlFrQkZDY2tHcW42Ky94Q1FRQWgrUVFKRFFBMUFDd0FBQUFBR1FBWkFJVU1YZ3lFc29STWlreTgycnljeHB4a25tUXNkalRjN3R5czBxd2NhaHhjbGx4MHFuVE01c3prK3VTVXdweXN6cXhFaGtRVVpoeFVrbFRFNHNTa3lxUjBwblMwMHJRa2Npd1VZaFNNdW96RTNzUnNvbXc4Zmp6azl1UWtiaVJrbW1SOHFuenMrdXkwMXJRTVhoU010b3hVamxTODNyeWN4cVEwZWpUYzh0d2NhaVJjbW1UVTZ0U2N3cHhFaGt4VWtseWt5cXhzb25SOHJuenMvdXkwMXJ6dy8vQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFHeGNDYWNFZ3NHby9JcEhMSlBLWUdNQXRyMWlRaVhCaUFGbURJZEpxZDEzYXNOVXlXSGM0NFl2Q01NU1psWnFUbERFSzFFS05BQjNoU1Npd3hDMVJGRDMweElSUUZoVlUxQVZvaktnQWtSRE40U2pNd2I0QkREaDRCTEVnUEJtUUtsbW9BSXdvaWpVS0tMbU1EUkFOa0FCdVlSUk14R0J5dUNtTUNHcTVHSFF4RUtWbDlMNDVESkM4V0Rsc09Sd3drblVVTnJ5aUlYNjh0Q1FBWUc4UkVMSk5hR0M0ZkVtNWJMVXNNcGJhUkoyQWdFV1FqTDZLT0RSWUJLc2c0Y2FDWndZTUlxd1FCQUNINUJBa05BREFBTEFBQUFBQVpBQmtBaFF4ZURJU3loRXlLVEx6YXZDeDJOR3lpYk56dTNDUnVKS1RLcEJSbUhGeVdYT1Q2NUpTK2xNem16RHlDUkh5cWZMVFN0RlNTVkJ4bUhCUmlGSXk2ak1UaXhEeCtQT1QyNUN4eUxLek9yR1NhWk96NjdIeXVmQnhxSEF4ZUZJeTJqRlNPVkx6ZXZEUjZOSFNtZE56eTNDUnlMS1RLckZ5YVpKekNuTlRxMUVTR1RMVFd0RlNTWE96KzdIeXVoQnhxSlBELzhBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBYlJRSmh3U0N3YWo4aWtjc2s4a2dZbVNLclZITFl5cWdsZ0N5QlFMdFdMaUV2dVZxb0dBaUJCT0pBbm9XUXJOVFFNTnJCTlErUFpIa2hITFFvZFowZ21mUUFGUm9KOUVvVkhBVnNUWUZZS1pJNUlGd2xiSnBXSVhBbVBSU3hiRDBNVkxoeVdBQjR1QVF4VVF3MFpFQ0JiQWhBWmNVSURXeEt4UlNrWVpXc0RReVI5SHFKRURTVmtIc1pFRmxzS1NjMWJIaXRHS0Z3TVNTa0hFOXBHRzlOYkJaUjVnRUlwMFVjTkw0Z1RLaG9SQndjTlZRMXF4QUFIZEUwdXVKQlF4b01DZ0dFZ0JCamh3Z1RDS2hBalNwd0lJd2dBSWZrRUNRMEFOd0FzQUFBQUFCa0FHUUNGREY0TWhMS0VUSXBNdk5xOExIWXNaSjVzbk1hYzFPN1VKRzRrZEtwOEZHWWNYSlpjNVBya2xNS2NQSUpFdE5LMHpPYk1qTHFNVkpKVWRLWjByTTZzNVBia2ZLcDhIR1ljRkdJVWpMYU14T0xFTkhvMGJLSnNwTXFzM083Y0xISXNaSnBrN1Byc1JJSkVmSzU4SEdvY0RGNFVoTGFFVkk1VXZONjhMSFkwbk1ha0pISXNYSnBrbk1LY3ROYTAxT3JVVkpKY2JLSjAzUExjN1A3c1JJWkVmSzZFSEdvazhQL3dBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUJ0WEFtM0JJTEJxUHlLUnl5VHpPQnAzSGE5WTB6a1NBYkNwU1lZWU1JT3JOa0Mybk5NbFh3cFoxQ1NzT1JCbUFRUmtoZ3RMOFJKeEJZbVVJTWtVekxqQnpKUWRHSFhvQUhFZ0NjeFpIQVZrWVhVVVZHRmtUSWlzaFJoVnNBQjFHR2xrbEREY1FIa2VIQUFsR0Qxa3JZa2lBQURGR0Exa1h0a1N0Tnl5Y1JqS05hRVlMTUM1eUFDMUhEbGt3UjdObEpTOUhMV1VOUmlFRWN3WElSQ0hSV1RHWVF4bHpkTnhGRUtOME5DQVFRc2EwQVlOSEVDbnJqMElGQWlpQVVsS2h4b1V5Q2pBTnJGTGhRWUFFTllKVm1VaXhvc1VoUVFBQU93PT1cIixcclxuICAgIGluVGVhbTogXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJ3QUFBQWNDQU1BQUFCRjB5K21BQUFBQkdkQlRVRUFBSy9JTndXSzZRQUFBQmwwUlZoMFUyOW1kSGRoY21VQVFXUnZZbVVnU1cxaFoyVlNaV0ZrZVhISlpUd0FBQUJnVUV4VVJhSENwZERsejVtMm5KNjlvckxWczVxNW5wYXdtS25McS8zLy9mYjg5YVBGcDVTdGw1ZTBtcEt4bHFYSXFlang1cHk3b0o3QW9wYTRtWnU2bjZ2R3JKeThvSStra2NMWnc0dXRqdDN0M1orL28rUDI0UEw0OGE3UXI3ZlZ0Ly8vLzFEKzZXMEFBQUFnZEZKT1UvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLzhBWEZ3YjdRQUFBT1JKUkVGVWVOck0wdEdTZ3lBTUJkQ1lDR3BFRjRtaEs2MzIvLzl5OGFVanRMT3Z1L2YxekdVeUNmRDhKZkNIR0MyK01zWVNZOWUrY3JRVXJ4am5IUklBODV6VDdhM0dDK0tzSWw2SkZsQmw3anA3UWJlSUo4cGRTTjJlK3dWYTlkNVRTb3ZoKzUzVFBCZm9qUXFhSktIcG13VzRSRUVSVlptTy9ndUlLelRvZUx0OTgrT3hCcWlhSStMRXc3QnYvZUVvNVhjcmROT3RINFlteURuMUc0NWg2N2ZnS0dPcTBEbWMxbWFkdkNvbGdnS3o1WEpBOFpMM1ZLUE42aXlLRWRLOGppdEdOTmFkYlhOMkRiaFluRXlYbEFjNXQ4dk1QbGJIeGt2aVAvaDlIL01qd0FCNUwwYkNHUUdnMmdBQUFBQkpSVTVFcmtKZ2dnPT1cIixcclxuICAgIG91dFRlYW06IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCd0FBQUFjQ0FNQUFBQkYweSttQUFBQUJHZEJUVUVBQUsvSU53V0s2UUFBQUJsMFJWaDBVMjltZEhkaGNtVUFRV1J2WW1VZ1NXMWhaMlZTWldGa2VYSEpaVHdBQUFCZ1VFeFVSY3k2bzdlTGc4S3FsYnFVaU1Xcm1QNzkvY215bnIyZGpjS2xsTUNpa3NXampMbVJoOENsa3IrZ2tMMlpqYjZkajh6QW91SFd3dnY1OWJ1WGk5M011c1NsbHNHZGpzU25tTEo5Zkx5Y2k4T2psc1Nta0x1Wmk3eWNqZUxZd3YvLy8vQUNlRzRBQUFBZ2RGSk9VLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy84QVhGd2I3UUFBQU9OSlJFRlVlTnJNMHRHT2d5QVFCVkFFT2pMS2dKWXFVSVgrLzE4dWJOTkc3R1pmZDIvbTdTUms0TUlldjRUOUlZWk92Tk9GRmdOTUU1dGU2Y01SZzJSSXFEWG5zZ3k4OUlramo3dEYxRXBWNVFEZEVhbVlsSnZXRXFCd2l6RmF6QmszTCtkY1R6NWlGL2VlOGlXRG5LK2Z1THRrb1dpWnhYdk9HM1FtSlZYMGt2Mml6aWlNU1paVlpMNnNmRUpuNGpKL0h3dmVxeE1LYzc5ZDh6RGtzcEJDM2VBNHV1V1dsMjJBY2lIOFFHSGNTdXZxQVJSYWFyR1dZb3lsdTFkSXRqOWlFRTZVblpLdHIwOVdqNkdwTEpuZUVoSFdhbFFNcDdMRkllRWYvTDRmOHlYQUFLM0tSK29kYUNNSUFBQUFBRWxGVGtTdVFtQ0NcIixcclxuICAgIG9rOiBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQndBQUFBY0NBTUFBQUJGMHkrbUFBQUFCR2RCVFVFQUFLL0lOd1dLNlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBUVdSdlltVWdTVzFoWjJWU1pXRmtlWEhKWlR3QUFBQmdVRXhVUmNmWnlacTJuTm5rMnJiTXQ2QytvK1RzNUtMQnBaNjhvYVRGcUxIVnNxckZyYXJNckpxNG5xVEJwcFNzbDZYSXFaYXdtS0xEcHIzUnZ2TDE4czdlejUrK3BQbjYrWnk1b08zeTdaL0Fvdi8rLzQra2tadTdvTFRZdGFEQXBQLy8vOWdvWHRZQUFBQWdkRkpPVS8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vOEFYRndiN1FBQUFPaEpSRUZVZU5yTTB0dHVoQ0FRZ0dHUTRiQWdxK0NnN29Ecys3OWxzV2thTVUxdjJ6L2NmWmxrQXJEM0w3RS94RHp6NzU2NXgreU94MWZIOFlCOHhUeTVBQ29FTTUyNW8rUUw4cW1VVkZNTnhnUVZqSFB6RlY4bGdXb0Y0OC81RHVkU3dDSlRIaEVqb3B0NkhBWHRxL1NTSk5JdWJyZ3RET3pPUEZrNUdOUGpLQllOd0tTaWZmRTNmSEloTmFnb1BRMEx0cDE3dE91V0ZBNkt2Rml0dWlHWGc0OXJGQlQ5Z0RiYzBDNUVDQ3VSaUlRZHpqTWZOMkhoTTEraG56eFJnMjRiYTZnQXJ5dG1QbzZsU1dxbnBYanVucXk4enJsVWE3dGFvL1B0c2ZtbC9BOSszNDk5Q0RBQU1VbEk2TXVlZUw0QUFBQUFTVVZPUks1Q1lJST1cIixcclxuICAgIGJveE9mZjogXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUEwQUFBQU5DQU1BQUFCRk5SUk9BQUFBQkdkQlRVRUFBSy9JTndXSzZRQUFBQmwwUlZoMFUyOW1kSGRoY21VQVFXUnZZbVVnU1cxaFoyVlNaV0ZrZVhISlpUd0FBQUF3VUV4VVJjWEd5TE80dmVucDZkdmMzdFBXMnVYbTV1RGg0dFRWMXJxOXdjM1IxL0x5OHUzdDdjdlAxYTZ6dWZUMDlJNlBqeGRHUGNnQUFBQlRTVVJCVkhqYVpNN0xEc0FnQ0VSUlJNVUhGdi8vYnp0S201cjByamliQ1RUUGFOclgwdVdGNmhxb3BVaXZjSXM4YWduSVBMWUNibGJWc2xWalp1MjlSOWNDOW1XTEhKWmRCUnZLeXZiNzVld1dZQUN4S0FkNnRGR29Nd0FBQUFCSlJVNUVya0pnZ2c9PVwiLFxyXG4gICAgYm94T246IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBMEFBQUFOQ0FNQUFBQkZOUlJPQUFBQUJHZEJUVUVBQUsvSU53V0s2UUFBQUJsMFJWaDBVMjltZEhkaGNtVUFRV1J2WW1VZ1NXMWhaMlZTWldGa2VYSEpaVHdBQUFBd1VFeFVSYlM4MGVycjdQajUrZGphMjJkNXBzck16cy9VNHQvaDVVNWptVWRkbGNERjBmYjI5c3ZQMWE2enVmVDA5STZQaitZL05Jc0FBQUJlU1VSQlZIamFUTTVCRHNBZ0NBQkJVQ3dpQ3YvL2JWR2F4cjFOSUFUd08zRExTbEhiV3J1MmlQVm9SdGhsL0dJUXd0eXNYSTBFNnRHWUMyT2tLU1o1cU1PbnlTSkN4Zmlvb2ZjWWFWNXAvQ3czeEZUOG9WYjJQNkc3VjRBQkFKcmZCekZtcjhKeUFBQUFBRWxGVGtTdVFtQ0NcIixcclxuICAgIHNvcnREb3duOiBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEJ3QVVBSUFCQUFSckFmLy8veUg1QkFFQUFBRUFMQUFBQUFBSEFCUUFBQUlRakkrcHkrMEJvZ1J3SHBubzI3eXpBZ0E3XCIsXHJcbiAgICBzb3J0VXA6IFwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQndBVUFJQUJBQVJyQWYvLy95SDVCQUVBQUFFQUxBQUFBQUFIQUJRQUFBSVFqSStweSswSUVwaG4ybUR6Mjd5ckFnQTdcIixcclxuICAgIHNvcnROdWxsOiBcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEJ3QVVBSUFCQUFSckFmLy8veUg1QkFFQUFBRUFMQUFBQUFBSEFCUUFBQUlVakkrcHl3WUo0b2swME52Z2xYdEs5R1RpaUJRQU93PT1cIixcclxuICAgIGZpbHRlcjogXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJnQUFBQVlDQVlBQUFEZ2R6MzRBQUFBQkdkQlRVRUFBSy9JTndXSzZRQUFBQmwwUlZoMFUyOW1kSGRoY21VQVFXUnZZbVVnU1cxaFoyVlNaV0ZrZVhISlpUd0FBQVpNU1VSQlZFakh0WlZwVUJObkdNZWZKRVFNZ2lpSWRLQXFBbGFPV3BHWjFxTzJVMXNkclNKcVIwVkJsSnNRUUVVT1FSSEVLcUFpYUVURkF4QkVxeTJYaXJlQWd0S2lqRmkwUnFDWW1NU1FrSkNFbUJBRTR2WjlGMWh3Mm43MHc1Tk5OdnYrZjgrOVFCQUVmRXdqUC9vTWZaUzlKOTZEb0YwQXphK2FJZjk2UGl5S1d3anU3Rm5ndm5tV2szbVVxY2dzeWtReU5tcU1aSHpFMkZXc1lHTVlIV2dNMFlYYjRFWExDeERKUktEdDFvSk9yNE4rUS85L0EvQnZlV2NIdkd4N0NRS1JBT3FmMThOVzdoWndEWFYycEljQlFlTUFRVWZHREdLc25wL3lOWnl2T1E4dGdoWjQvdkk1S0ZRS1V2eC9BZmk3V3E4Mll4ZUVIcTVxckpyY0xta0hzVVFNMVExVmxtc1ByZkdqc2NIQUNFY1FOaEN6a3QzUzd6eTZiYU5WYTBFcFY4S3hHOWxMRTByaWQvZjE5a1BQdTU0UEFRYkNRRjRWV29YbEV1N2lXK0FMeE13OU14cEs2b3EvMjNSbUk5YzZ4a3JDakdBUVJ1RTB5cGpoZEdKQ2xJVWk5bEowY241MW5xZlpGbE1OK0FNUlZ4eWIydFAzanZsQkRjUnlNY2lWY2dndURNeUdEVUFLQVBLU2hsSUN3Y2pRRlhzK0VrQStnLzhQR2ZnZlA0dFRDSnVBeUsvSit3bnJVUUJSdXdpRWI0UlEvYlRLM2kzbGkzcWNBaXpBNEF4ZWtUaUVqakFzeWg0R1VzK3g2WWIxSjczT05MOXVOdU9MK2NPQXN6ZnlvUU1WVnRtcGhQSkg1WE9Nd2hqOTlNRkRaQlJJMUgyUFc4M2FJNnQzK2gvYkZMb3l5L09BWGNMa0ZoemRrRGdHVGs3NFZJZzZhYlJTcllRUEl2Z2g5bnRvazdSQlB5b1FwNGpOaGFCaGNWYUVjWGZtdGN3TklwRUk4cTdsbVNjVkpVMnRxSzFnQ3NWQ1JuZ1I1eUNPaGtGR2lTeUVicmhZLzh0S3JGbjU1TzR3d0Mxa0pzU2NpQUdoVk1peTJXNHR3OTdnQXpUaytmRzd4N3h4TjYwNXZqcWZ6cWFSMFpoR21tcjJYMC9mZ3M4R253czhQZVFRdmk3bExya3ViaGVEeDQ2bHd3RDNTRGNubDFEbnp3TnkvUDFHUlRKSWNSeitOeG56SGhBR0F0YWQ4aXBnaGpHSTBQemdSRTVPbU9mS295c0tjTWNVMWhXc0U4bEY0OGR0SGR0Rkd5ejBKM0ZXU3UrTTlmUHNBNlk2VTRCeFVXWWkxQUg5QStFT2VvTUFvYm5CMnl1ZlZKcmpvdThvamQvSmEzMEIzRXRjYU9HM3dPeTBMMnVuSlRyd0hqOTdERE9TWGV1dzl6aHlzdXVRb1RidW9BQm85R1Y0UWtlMklrNEYrMVJvNEtIU0RBY00vdm5YUFF2THFrb2h1L2dvM0hwNEM1Wm5lWEJSZlhSWEhseG03TDZZOU9PYWpEVytYbGxyUTFZY1dYNW1RclNGQ2dFTkl3RmRHSUJGS1FEeUtDRFhQNDMzaWpkcXpHYVczamZYcDdEeFJTT2NLRDRCdFUwMXR0OGVtRjk1L21HUmgwUXFnYUxiNXl3RGp3WTRKeFh1bXRMUTFBQThQcy9TTDNmalFRb3dQc0o4RlQwUXZOMVQzUFliUlF4SE1EM1o4VytkVGtkUHEwaU54RGxIcWFoZHNIZEI5dHpVcnlydlBiMzNXVk5yMDhURm1ZdkxSbkdNZXNqWlFHZHNZMnhlSGI2WjVkZmZNMkpWc0lLTVlXN0tiSGdtZUdabUhUdEJPVFJFT0lxSTg1eUR2ZDI5Y0xJcXg4YytmdXFmSmh5VGpzdU41Y3Y0RXI3bHZQUTU5MnkzMjBqdEVpY0pIWGJaQ2V4M1RSRk1TckNWT081d2FFdTdsaHBGQWNBUG9PaGhFUkR2Q1VpNXVqdWVGa3g3UHpDaE5ISnFmVS83NU5RMDFreThlT3NDRk40dU5PcDkxd3VyY2p5dnprMmZYYWZVS0UwN05RcVdWQ1Uxa2FsbEpscWRsbEZRZTlack5NZFlSUUdpQ3JaQ003OFpGQjJkY1BaK3ZnZWFaQU0xL3B5QnJqRGR6Tkk0eFR0VjdTOU5YMXI5cE5yQ2RBdExEd0ZBYlB0dGF3Ylc2TlozZzE2bmh6cmVReWZyYUNzNVNwZU9BdkJhZWVRK1J5dlhZK3htTXhWZVdrYmhBMjAzMUZsa0U2Q1UrUnhaNzc4dE44cVZXbTdvWHRhZHpJaSt2bjRRZFFwdFhKS2QvaG9jUEFVRjRML2hnMVF1aGZpU3VCUmNUTHlIc1Bpa2VCc3gyZHNoQXk4YVhNU1FrOEdCeDY5bTIyRW9mZkFlbWlPTlZDbGw3YnFjdUJ0djA4Rk83S1FBNnJkZG9ORnF5RjBVVnhLYmltcENlSi95eW0wVHQxbGtWaHhhTjNmZm5KdVcwUmFkRUlqcWtidmh0RXFsQXNmRXFXMURxeHE5U3JYdHFuYlQyT0xvTkp5MndlWDNsZ0lvdTVTazZicDFvTmZySWU5KzdxclcxNjNNRG5rSHZCYWhOVjVmRFN2M3JwaFBRN1d3aXJIVXlMdmtsa1YvblBQQ1FCeUJSYlI1dC9xdDJuaG5lY0krOGg1S2tVdnk5TWYvQXVBbzhQdFVwcENCUUN3QVNZY0V5dTZYZ1VmQ01wZ1c1REFOano4U1VBY1ZCaHpBNTVLdkpDVXcyVXlaY1lTUmJBbDMwUVUwTi9Xb0lUcGRrMXgrYitJM09WQ0FqMm4vQUZXSnBibHkrUk9YQUFBQUFFbEZUa1N1UW1DQ1wiLFxyXG4gICAgbWVtYmVySWNvOiBcIiBkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJnQUFBQVlDQVlBQUFEZ2R6MzRBQUFBQkdkQlRVRUFBSy9JTndXSzZRQUFBQmwwUlZoMFUyOW1kSGRoY21VQVFXUnZZbVVnU1cxaFoyVlNaV0ZrZVhISlpUd0FBQWFIU1VSQlZIamExRlpyY0JQWEZUNjcybDI5WlFuSnlMSmxTVFkydHNIR1NyQU5HRU5zSUFrVE45RFU2V0FhNGtsS1ljcVFEbWtTVERKdFo1cDIyakl0U1p2aFgyb3l5ZENRSVNTT3FXbk5JellCRzV0QUxOdUFiR0hMOFZ1UzliYTBXcTFXV20ydjNHbG1rcExwci96by9iUDN6bjJjYzc1enZ1OHNKZ2dDZkpjRGgrOTRFRGE3SGNKMEZPek9jYUJwR2dERGdDQUlBQlRaMGYwSGx3KzFuaml1L2VNcnJ3YStlZm45OHgyd3ltS0JMSlVLMHVrMFNNUmlzRS9jaHpmZmJZUFdBNGZCb05NQjhaVWxYQVNMQVQ4VVdRb2dUNThEcVZRS3psNzhCektFUVl4bDE5YnQyL1BpMk16VUZvWmpwU1ZHay8ySkxmVnRlbTMyTzhZa3grUElxZlMzUmZBVlZqaStiT0NoOGdvb01wa2h6ckpBSVkrK3VIZTMrVnhYNTNHZjIyVUdxUXlBRk1ISW5hR2FHZWQ0OGZadE80cXIxMVgrRnQyTkFzOHZ2MEdJUkNBOHlNRHlJck9Kb0VtaHd5STBkMHhOYmo1KzhzUUozOXgwWHUzVzdmKzByaTQ3bFJZRTJoUDA3Ynp3NmNWRG5lYy9lYVc2d3VyYVViUHBMUnd3WWN3NUFaY0gra0NlY2VSQlNjWlFxR3dpQVRHR2dTV2FGbmYzZnJaM2NzaVcxOUt5Lzh6QnA1djM2ZFRxZHFWVWR0bVNhM3k1YVhmVFVibFNrVzQ3Yy9xUU54aXdwTk1DUkZFT283RVlaQ0I3Y0FRb3VhTVQ0OUEzTkFnMEcxODU3aGpiS3M4MVJtc3FyTzlvbE1xUVNxR0VWREtGOE1hRWlxTFZIeTlVV0p2NytxOXZ0anVkeFNIdDBwVGI1d2VTRVAxM21XWmdJUWt5VXdVaWhWU0dSWmxZQmtkeE1CTFJrVEpaSkozaVBTdlZPcWkxcmdkWDBBK2w1Z0l3NncwMFJsRkI0Tk13NzNabGNYd0swRjBRVTVUa1AxQXZHeERRVXpLcEZCMmFmK0xxclpzZGwvcDd6K1pvdFp1YWR6WjZMVGs1OTVsRmwwNGtwaXFqREEzdlhtaUg0Y2x4VUVta2tFcnpCcDlyb1JSSUVxemw1YlBtL1B6c3p0NmVONi9aYmwrYTg3aGJGWEs1UEFNNUxwZklZRzdSOCtTNTdrdC9MalVYVHErMkZQanVPTWIrb3BZcjlCdXJhenE0WkVwODZ1ejd2eHgyM3Q4MmNIY0VKQlFGb1dnay83Mi90Ny91dkhlbmVNZVdob3QxVmRVemYvM2t3NU1NRzM5NDYwUFZYVnd5OGFQZTJ3T3RYSklqUll4Y0l1bTUyZjlTa2RreS8vMXRqeDVDbm5YWlo2WjIwL0c0N3ZEZVowOU5lQmVyYmx6dXFobWMvdko3VXFtOGxrMXh1NjdlL3Z6b3lLMkJoanlqeWYzeVQxLzQrYUxYaTU4Ky8vSFBYdGpUOGtPRlRIb2hDY0QyRHRsYWhzWkdld2l0UnBPT3NyRUVTcXArenUyU1JXTTBqaXBKbGt5bGhBS0QwZi9hZ2NNSEVvbkVIMnhqOXNjbnBweU5HQ29Sa1NCd0phVnJCaCtwcTMvZGxKdDN6ZU54VjFJa2hmc2pJVjBrR2xrSWhFSlpGRVdtQU1OVG9rc2RuWHl4cFhEcGRHZjcwd3NlbDNVcEZtdFVTQ1N5bnpUdCtkMWQ1M2dZeVVkSUxwWitaRElZcjBiWitEQkpVSjgyMUd4cUt5bFlkU3hFUnh3TlZSdmgwZHE2ME9qTWRHSFg5WjY5cUdvS1oxenpUelh0MlBtZVRyUGlpdWpZYTYvQzU4TkRjK0Z3MkRZeTRkaXBrc3E1dXZYVng2WThycWtyL1gyQTFqazJ4MmlWUHhMT1Ivd2dXSTdqVlFxRkNFVm9TQ1k1UEVlakNVU1pPRS9nK01YdW13Tm14SVhOS0plbk5wUmIyemFzcXdRTUpReC9wdlhGNStjWHZidTBXcTFJUWxCOE1CeWtaUXJGUjVSSUpFNHg4WU8yNFVIclVweldwRkVwSTdJQWhtUkVKWkVrTkRxOXMzSDdZMzhUaXlXM2h4ejIzY2k0YVlWYVRYaThYc3lZclI4NnN1KzV0N0Jmbkh6anBRczkzZnNGZ253YjVXRVFxYUo0ZlVuWmx1RUp4MEd2ZTE0ZTlRZFVwc0tpdVRLenBadEpwdHlSV0l3M1phL1VPT2RuTjQ1TjNGOVBVcFJnTU9UNmNuUHlydmlXUWgra2hYVElrcE9ieXlYWUkycTF4azhNam8wYVp2MWVnMUtaVmVjTEJFcElNVWs0NXFhTmszT3pCaVZKcG43Yzh2eXZwUko1RzhienZsaU00WGhFS0lsY1Jxd3RYYXQrWnRjUEhudjczSm5qc3pOVCtTaTZOVEVtOWhRVGp5Y1JteVZJalEydVlKQWdObFJZZjFWZldkVng1VmIvSnBOZXJ4ZFRZb1ptYUIxd0NZampPT29Yby9Vck5Tc29KQldMYklLakVYZUVDTXRJM2Q3RjdDVTZ1aTRVaTYzSXdDWUl2UHpoa3JKWkpJWktqa3U0TnBSVnRNLzR2TDBFWWh1THFIMER4L0FiT09KMXBuSHMzOTJVcTFkcG9nTWp0Z2E3NDE3dGNKS3ZCeEdla2R0L0N3eVNCOVF3VUEvQmVJVmFFNnlwcU93em1TeC84b1ZDM1NTU0NmVFdzakpubUV4OHMwRmtwQU41NGRyN2VPTnptaXhWQTlMWWV2dVhrK1VMZnA4ZUpWcUJ0akVwSlk0YnRkbStOWVdyeHBrRWU3M1VWUEJaSUxvVTVwSE1oek5kOGR2NndiVzIwMSt6MWZ6a3JoNzA3ZmxmZmZmSTczOERhcGxpZVk0RThtdDcyUC85WDhXL0JCZ0FHRG9aZXZCU1lub0FBQUFBU1VWT1JLNUNZSUk9XCJcclxufTsiLCIvKipcclxuICpcclxuICogQHJldHVybnMge29iamVjdH1cclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHRzO1xyXG5cclxuICB0cyA9IHtcclxuICAgIHBsYXllcjoge1xyXG4gICAgICBpZDogXCJpZFwiLFxyXG4gICAgICBuYW1lOiBcImFcIixcclxuICAgICAgc3RhdHVzOiBcImJcIixcclxuICAgICAgZGF0ZTogXCJjXCIsXHJcbiAgICAgIGZvcnVtczogXCJkXCJcclxuICAgIH0sXHJcbiAgICBmb3J1bToge1xyXG4gICAgICBpZDogXCJpZFwiLFxyXG4gICAgICBuYW1lOiBcImFcIixcclxuICAgICAgc2lkOiBcImJcIixcclxuICAgICAgcG9zdHM6IFwiY1wiLFxyXG4gICAgICB3b3JkczogXCJkXCIsXHJcbiAgICAgIHBhZ2U6IFwiZVwiLFxyXG4gICAgICB0aGVtZXM6IFwiZlwiLFxyXG4gICAgICBsb2c6IFwiZ1wiXHJcbiAgICB9LFxyXG4gICAgdGhlbWU6e1xyXG4gICAgICBpZDogXCJpZFwiLFxyXG4gICAgICBuYW1lOiBcImFcIixcclxuICAgICAgYXV0aG9yOiBcImJcIixcclxuICAgICAgcG9zdHM6IFwiY1wiLFxyXG4gICAgICBwYWdlczogXCJkXCIsXHJcbiAgICAgIHN0YXJ0OiBcImVcIlxyXG4gICAgfSxcclxuICAgIG1lbWJlcjoge1xyXG4gICAgICBpZDogXCJpZFwiLFxyXG4gICAgICBwb3N0czogXCJhXCIsXHJcbiAgICAgIGxhc3Q6IFwiYlwiLFxyXG4gICAgICBzdGFydDogXCJjXCIsXHJcbiAgICAgIHdyaXRlOiBcImRcIixcclxuICAgICAgd29yZHM6IFwiZVwiLFxyXG4gICAgICB3b3Jkc0F2ZXJhZ2U6IFwiZlwiLFxyXG4gICAgICBjYXJtYTogXCJnXCIsXHJcbiAgICAgIGNhcm1hQXZlcmFnZTogXCJoXCIsXHJcbiAgICAgIHNuOiBcImlcIixcclxuICAgICAgZW50ZXI6IFwialwiLFxyXG4gICAgICBleGl0OiBcImtcIixcclxuICAgICAga2ljazogXCJsXCIsXHJcbiAgICAgIGludml0ZTogXCJtXCJcclxuICAgIH0sXHJcbiAgICB0aW1lc3RhbXA6IHtcclxuICAgICAgaWQ6IFwiaWRcIixcclxuICAgICAgdGltZTogXCJhXCIsXHJcbiAgICAgIGRhdGE6IFwiYlwiXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgbWFrZVRTKCk7XHJcblxyXG4gIHJldHVybiB0cztcclxuXHJcbiAgZnVuY3Rpb24gbWFrZVRTKCl7XHJcbiAgICBPYmplY3Qua2V5cyh0cykuZm9yRWFjaChmdW5jdGlvbih0KXtcclxuICAgICAgT2JqZWN0LmtleXModHNbdF0pLmZvckVhY2goZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICB0c1t0XVt0c1t0XVtrZXldXSA9IGtleTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn07XHJcblxyXG4iLCJyZXF1aXJlKCcuLy4uLy4uLy4uL2xpYi9wcm90b3R5cGVzJykoKTtcclxudmFyICQgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2xpYi9kb20nKTtcclxudmFyIGRiID0gcmVxdWlyZSgnLi8uLi8uLi8uLi9saWIvaWRiJyk7XHJcbnZhciBiaW5kRXZlbnQgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2xpYi9ldmVudHMnKTtcclxudmFyIGFqYXggPSByZXF1aXJlKCcuLy4uLy4uLy4uL2xpYi9yZXF1ZXN0Jyk7XHJcbnZhciBjcmVhdGVUYWJsZSA9IHJlcXVpcmUoJy4vLi4vLi4vLi4vbGliL3RhYmxlJyk7XHJcblxyXG5cclxuY29uc3QgJGMgPSByZXF1aXJlKCcuLy4uLy4uLy4uL2xpYi9jb21tb24nKSgpO1xyXG5jb25zdCAkdHMgPSByZXF1aXJlKCcuLy4uL3NyYy9zdHJ1Y3R1cmUnKSgpO1xyXG5jb25zdCAkaWNvID0gcmVxdWlyZSgnLi8uLi9zcmMvaWNvbnMnKTtcclxuXHJcblxyXG52YXIgJG5hbWVTY3JpcHQgPSBcIlN0YXRzIGZvcnVtcyBbR1ddXCI7XHJcbnZhciAkbW9kZSA9IHRydWU7XHJcbnZhciAkc2QsICRjZCwgJHNzLCAkdHNkLCAkYW5zd2VyLCAkc2NyZWVuV2lkdGgsICRzY3JlZW5IZWlnaHQsICRkYXRlLCAkY2hlY2tlZCwgJHQ7XHJcblxyXG52YXIgJGlkYiwgJGZvcnVtO1xyXG5cclxuY29uc3QgJHN0YXR1c1N0eWxlID0ge1xyXG4gIFwiT2tcIjogXCJcIixcclxuICBcItCi0L7RgNCz0L7QstGL0LlcIjogXCJmb250LXdlaWdodDogYm9sZDtcIixcclxuICBcItCQ0YDQtdGB0YLQvtCy0LDQvVwiOiBcImNvbG9yOiBibHVlO1wiLFxyXG4gIFwi0KTQvtGA0YPQvNC90YvQuVwiOiBcImNvbG9yOiByZWQ7XCIsXHJcbiAgXCLQntCx0YnQuNC5INCx0LDQvVwiOiBcImNvbG9yOiBncmVlbjsgZm9udC13ZWlnaHQ6IGJvbGQ7XCIsXHJcbiAgXCLQl9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cIjogXCJjb2xvcjogcmVkOyBmb250LXdlaWdodDogYm9sZDtcIlxyXG59O1xyXG5cclxuJGNoZWNrZWQgPSB7XHJcbiAgdGhlbWVzOiB7fSxcclxuICBwbGF5ZXJzOiB7fVxyXG59O1xyXG5cclxuJHNjcmVlbldpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcclxuJHNjcmVlbkhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cclxuJGFuc3dlciA9ICQoJzxzcGFuPicpLm5vZGUoKTtcclxuJGRhdGUgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDAsIDEwKTtcclxuXHJcbiRzZCA9IHtcclxuICBmb3J1bXM6IHt9LFxyXG4gIHBsYXllcnM6IHt9LFxyXG4gIGtpY2tlZDoge30sXHJcbiAgaW52aXRlOiB7fVxyXG59O1xyXG5cclxuJHNzID0ge1xyXG4gIHNvcnQ6IHtcclxuICAgIHN0YXRzOiB7XHJcbiAgICAgIHR5cGU6IDEsXHJcbiAgICAgIGNlbGw6ICduYW1lJ1xyXG4gICAgfSxcclxuICAgIHRoZW1lczoge1xyXG4gICAgICB0eXBlOiAxLFxyXG4gICAgICBjZWxsOiAnaWQnXHJcbiAgICB9XHJcbiAgfSxcclxuICBzaG93OntcclxuICAgIHN0YXRzOnt9LFxyXG4gICAgdGhlbWVzOnt9XHJcbiAgfVxyXG59O1xyXG5cclxuJGNkID0ge1xyXG4gIGZpZDogMCxcclxuICBmTmFtZTogXCJcIixcclxuICB0aWQ6IDAsXHJcbiAgdE5hbWU6IFwiXCIsXHJcbiAgZlBhZ2U6IDI3LFxyXG4gIHRQYWdlOiAwLFxyXG4gIGxQYWdlOiAwLFxyXG4gIGY6IG51bGwsXHJcbiAgc2lkOiBudWxsLFxyXG4gIG5hbWVUb0lkOiB7fSxcclxuICBtZW1iZXJzOiBbXSxcclxuICBjb3VudE1lbWJlcnM6IDAsXHJcbiAgdmFsdWVzOntcclxuICAgIHN0YXRzOntcclxuICAgICAgaWQ6IFsnSUQnLCAtMSwgLTFdLFxyXG4gICAgICBzdGFydDogWyfQotC10Lwg0L3QsNGH0LDRgtC+JywgLTEsIC0xXSxcclxuICAgICAgd3JpdGU6IFsn0KPRh9Cw0YHRgtCy0L7QstCw0LsnLCAtMSwgLTFdLFxyXG4gICAgICBkYXRlOiBbJ9Cf0L7RgdC70LXQtNC90LXQtSDRgdC+0L7QsdGJ0LXQvdC40LUnLCAtMSwgLTFdLFxyXG4gICAgICBwb3N0czogWyfQodC+0L7QsdGJ0LXQvdC40LknLCAtMSwgLTFdLFxyXG4gICAgICBhdmVyYWdlV29yZHM6IFsn0KHRgNC10LTQvdC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHQu9C+0LInLCAtMSwgLTFdLFxyXG4gICAgICB3b3JkczogWyfQmtC+0LvQuNGH0LXRgdGC0LLQviDRgdC70L7QsicsIC0xLCAtMV0sXHJcbiAgICAgIHBTdGFydDogWyfQn9GA0L7RhtC10L3RgiDQvdCw0YfQsNGC0YvRhSDRgtC10LwnLCAtMSwgLTFdLFxyXG4gICAgICBwV3JpdGU6IFsn0J/RgNC+0YbQtdC90YIg0YPRh9Cw0YHRgtC40Y8nLCAtMSwgLTFdLFxyXG4gICAgICBwUG9zdHM6IFsn0J/RgNC+0YbQtdC90YIg0YHQvtC+0LHRidC10L3QuNC5JywgLTEsIC0xXSxcclxuICAgICAgcFdvcmRzOiBbJ9Cf0YDQvtGG0LXQvdGCINGB0LvQvtCyJywgLTEsIC0xXSxcclxuICAgICAgc3RhdHVzOiBbJ9Ch0YLQsNGC0YPRgScsIC0xLCAtMV0sXHJcbiAgICAgIGVudGVyOiBbJ9Cf0YDQuNC90Y/RgicsIC0xLCAtMV0sXHJcbiAgICAgIGV4aXQ6IFsn0J/QvtC60LjQvdGD0LsnLCAtMSwgLTFdLFxyXG4gICAgICBnb0F3YXk6IFsn0JjQt9Cz0L3QsNC9JywgLTEsIC0xXSxcclxuICAgICAgbWVtYmVyOiBbJ9CSINGB0L7RgdGC0LDQstC1JywgLTEsIC0xXVxyXG4gICAgfSxcclxuICAgIHRoZW1lczp7XHJcbiAgICAgIGlkOiAnJyxcclxuICAgICAgZGF0ZTogJycsXHJcbiAgICAgIHBvc3RzOiAnJyxcclxuICAgICAgcG9zdHNBbGw6ICcnXHJcbiAgICB9XHJcbiAgfSxcclxuICBzaG93UHJvZ3Jlc3NUaW1lOiBmYWxzZSxcclxuICB0aW1lUmVxdWVzdDogMCxcclxuICBzdGF0c0NvdW50OiAwLFxyXG4gIHRoZW1lc0NvdW50OiAwXHJcbn07XHJcblxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5hZGRTdHlsZSgpO1xyXG5jcmVhdGVTdGF0R1VJQnV0dG9uKCk7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gYWRkU3R5bGUoKXtcclxuICB2YXIgY3NzLCBjb2RlO1xyXG5cclxuICBjb2RlID0gYHRhYmxlW3R5cGU9XCJwYWRkaW5nXCJdIHRkIHtcclxuICAgIHBhZGRpbmc6IDJweCA1cHggMnB4IDVweDtcclxufVxyXG50clt0eXBlPVwibGlnaHRcIl0ge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2Q4ZThkODtcclxufVxyXG50clt0eXBlPVwibGlnaHRDaGVja2VkXCJdIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNjN2RmYzc7XHJcbn1cclxudHJbdHlwZV49XCJsaWdodFwiXTpob3ZlciB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYmVjY2JlO1xyXG59XHJcbnRyW3R5cGU9XCJoZWFkZXJcIl0ge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2QwZWVkMDsgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbn1cclxuI3NmX2hlYWRlcl9TSSBpbWcsICNzZl9oZWFkZXJfVEwgaW1ne1xyXG4gICAgZmxvYXQ6IHJpZ2h0O1xyXG59XHJcbnRkW3NvcnRdLCB0ZFtmaWx0ZXJde1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcbnRkW3NvcnRdOmhvdmVyLCB0ZFtmaWx0ZXJdOmhvdmVye1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2NhZTFjYTtcclxufVxyXG4uc2ZfbGVmdCB7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDVweDtcclxufVxyXG4jc2ZfU1RJIHtcclxuICAgIHBhZGRpbmc6IDA7XHJcbn1cclxuI3NmX3NoYWRvd0xheWVye1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgd2lkdGg6IDA7XHJcbiAgICBoZWlnaHQ6IDA7XHJcbiAgICB6LWluZGV4OiAxO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBvcGFjaXR5OiAwLjc7XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcbmRpdlt0eXBlPVwid2luZG93XCJde1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgLW1vei1ib3JkZXItcmFkaXVzOiAxMHB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7XHJcbiAgICB6LWluZGV4OiAyO1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxufVxyXG5cclxuaW5wdXRbdHlwZT1cImJ1dHRvblwiXXtcclxuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgICBmb250LWZhbWlseTogVmVyZGFuYTtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyMDgsMjM4LDIwOCk7XHJcbiAgICBmb250LXNpemU6IDEwcHg7XHJcbiAgICBoZWlnaHQ6IDIwcHg7XHJcbn1cclxuaW5wdXRbdHlwZT1cInRleHRcIl1bY2xhc3M9XCJzZl9oaWRlSW5wdXRcIl17XHJcbiAgICBmb250LXdlaWdodDogNTAwO1xyXG4gICAgZm9udC1mYW1pbHk6IFZlcmRhbmE7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmZmYwO1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgd2lkdGg6IDUwcHg7XHJcbiAgICBib3JkZXItc3R5bGU6IG5vbmU7XHJcbn1cclxuaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdW25hbWU9XCJzZl9tZW1iZXJzTGlzdFwiXSxbbmFtZT1cInNmX3RoZW1lc0xpc3RcIl17XHJcbiAgICBkaXNwbGF5OiBub25lO1xyXG59XHJcbmRpdltjbGFzc149XCJzZl9jb3VudFwiXXtcclxuICAgIGJvcmRlcjogc29saWQgMXB4ICMwMDAwMDA7XHJcbiAgICB3aWR0aDogMTAwcHg7XHJcbiAgICBsaW5lLWhlaWdodDogMjRweDtcclxuICAgIGZsb2F0OiBsZWZ0O1xyXG4gICAgaGVpZ2h0OiAyNHB4O1xyXG59XHJcbmRpdltjbGFzcz1cInNmX2NvdW50IGRpc2FibGVkXCJde1xyXG4gICAgYm9yZGVyOiBzb2xpZCAxcHggI0MwYzBjMDtcclxuICAgIGNvbG9yOiAjYzBjMGMwO1xyXG59XHJcbmRpdltjbGFzcz1cInNmX3NwYWNlXCJde1xyXG4gICAgYm9yZGVyOiBub25lO1xyXG4gICAgd2lkdGg6IDE1cHg7XHJcbiAgICBoZWlnaHQ6IDI0cHg7XHJcbiAgICBmbG9hdDogbGVmdDtcclxufVxyXG5pbnB1dFt0eXBlPVwidGV4dFwiXVtjbGFzcz1cInNmX2NvdW50IGRpc2FibGVkXCJde1xyXG4gICAgY29sb3I6ICNjMGMwYzA7XHJcbiAgICB3aWR0aDogNjVweDtcclxuICAgIGJvcmRlci1zdHlsZTogbm9uZTtcclxuICAgIGJhY2tncm91bmQ6IG5vbmU7XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgbWFyZ2luOiAwO1xyXG59XHJcbmlucHV0W3R5cGU9XCJ0ZXh0XCJdW2NsYXNzPVwic2ZfY291bnQgZW5hYmxlZFwiXXtcclxuICAgIHdpZHRoOiA2NXB4O1xyXG4gICAgYm9yZGVyLXN0eWxlOiBub25lO1xyXG4gICAgYmFja2dyb3VuZDogbm9uZTtcclxuICAgIHBhZGRpbmc6IDA7XHJcbiAgICBtYXJnaW46IDA7XHJcbn1cclxuI3NmX2NhbGVuZGFye1xyXG4gICAgbGVmdDogMDtcclxuICAgIHRvcDogMDtcclxufVxyXG4jc2ZfY2FsZW5kYXIgdGR7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICBib3JkZXI6IHNvbGlkIDFweCAjMzM5OTMzO1xyXG4gICAgcGFkZGluZzogNXB4O1xyXG59XHJcbiNzZl9jYWxlbmRhciB0ZFt0eXBlPVwiZGF5XCJdOmhvdmVyLCAjc2ZfY2FsZW5kYXIgdGRbdHlwZT1cImNvbnRyb2xcIl06aG92ZXJ7XHJcbiAgICBiYWNrZ3JvdW5kOiAjRDhFOEQ4O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcbnNwYW5bdHlwZT1cImNhbGVuZGFyQ2FsbFwiXXtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5kaXZbdHlwZV49XCJtdWx0aXBsZVNlbGVjdFwiXXtcclxuICAgIGJhY2tncm91bmQ6ICNmMGZmZjA7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICBoZWlnaHQ6IDI0cHg7XHJcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47XHJcbn1cclxuZGl2W3R5cGU9XCJtdWx0aXBsZVNlbGVjdCBlbmFibGVkXCJdOmhvdmVye1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgb3ZlcmZsb3cteTogdmlzaWJsZTtcclxuICAgIGhlaWdodDogMTc0cHg7XHJcbiAgICBib3JkZXI6IHNvbGlkIDFweCAjMDAwMDAwO1xyXG4gICAgbWFyZ2luLWxlZnQ6IC0xcHg7XHJcbiAgICBtYXJnaW4tdG9wOiAtMXB4O1xyXG59XHJcbmRpdlt0eXBlXj1cIm9wdGlvblwiXXtcclxuICAgIHBhZGRpbmctbGVmdDogMTBweDtcclxuICAgIHBhZGRpbmctcmlnaHQ6IDEwcHg7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgYm9yZGVyLXRvcDogZG90dGVkIDFweCAjYzBjMGMwO1xyXG59XHJcbmRpdlt0eXBlPVwib3B0aW9uIHNlbGVjdGVkXCJde1xyXG4gICAgYmFja2dyb3VuZDogI2MzZTVjMztcclxufVxyXG5kaXZbdHlwZV49XCJvcHRpb25cIl06aG92ZXJ7XHJcbiAgICBiYWNrZ3JvdW5kOiAjZDllY2Q5O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcbnNwYW5baWRePVwic2ZfYkNoZWNrQWxsXCJde1xyXG4gICAgZmxvYXQ6IHJpZ2h0O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiA1cHg7XHJcbiAgICBmb250LXNpemU6IDlweDtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufWA7XHJcbiAgY29kZSArPVxyXG4gICAgYFxyXG4gICAgdGRbc29ydD1cIm1lbWJlclwiXXtcclxuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7JGljby5tZW1iZXJJY299KTtcclxuICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMTBweCBjZW50ZXI7XHJcbiAgICAgIGJhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdDtcclxuICAgIH1cclxuICAgICNzZl9zdGF0dXNXaW5kb3d7XHJcbiAgICAgIGxlZnQ6ICR7JHNjcmVlbldpZHRoIC8gMiAtIDMyNX07XHJcbiAgICAgIHRvcDogJHskc2NyZWVuSGVpZ2h0IC8gMiAtIDEyMH07XHJcbiAgICB9XHJcbiAgICAjc2ZfY29udHJvbFBhbmVsV2luZG93e1xyXG4gICAgICAgIGxlZnQ6ICR7JHNjcmVlbldpZHRoIC8gMiAtIDE3NX07XHJcbiAgICAgICAgdG9wOiAkeyRzY3JlZW5IZWlnaHQgLyAyIC0gMjYwfTtcclxuICAgIH1cclxuICAgICNzZl9maWx0ZXJzV2luZG93e1xyXG4gICAgICAgIGxlZnQ6ICR7JHNjcmVlbldpZHRoIC8gMiAtIDI1MH07XHJcbiAgICAgICAgdG9wOiAkeyRzY3JlZW5IZWlnaHQgLyAyIC0gMzYzfTtcclxuICAgIH1cclxuICAgICNzZl9tZXNzYWdlV2luZG93e1xyXG4gICAgICAgIGxlZnQ6ICR7JHNjcmVlbldpZHRoIC8gMiAtIDM3MH07XHJcbiAgICAgICAgdG9wOiAkeyRzY3JlZW5IZWlnaHQgLyAyIC0gMjIyfTtcclxuICAgIH1gO1xyXG4gIGNzcyA9ICQoXCJzdHlsZVwiKS5odG1sKGNvZGUpLm5vZGUoKTtcclxuICBjc3Muc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHQvY3NzXCIpO1xyXG4gIGNzcy5zZXRBdHRyaWJ1dGUoXCJzY3JpcHRcIiwgXCJ0cnVlXCIpO1xyXG5cclxuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGNzcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVN0YXRHVUlCdXR0b24oKXtcclxuICB2YXIgZmlkLCBuYW1lLCBuYXZpZ2F0ZSwgYnV0dG9uO1xyXG5cclxuICBmaWQgPSBsb2NhdGlvbi5zZWFyY2gubWF0Y2goLyhcXGQrKS8pO1xyXG4gIGZpZCA9IE51bWJlcihmaWRbMV0pO1xyXG5cclxuICBuYXZpZ2F0ZSA9ICQoJ2Fbc3R5bGU9XCJjb2xvcjogIzk5MDAwMFwiXTpjb250YWlucyhcIn7QpNC+0YDRg9C80YtcIiknKS51cCgnYicpO1xyXG4gIG5hbWUgPSBuYXZpZ2F0ZS50ZXh0KCkubWF0Y2goLyguKykgwrsgKC4rKS8pWzJdO1xyXG5cclxuICBidXR0b24gPSAkKCc8c3Bhbj4nKS5odG1sKGAgOjogPHNwYW4gaWQ9XCJzZl9idXR0b25TdGF0c1wiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyO1wiPlxyXG4gICAg0KHRgtCw0YLQuNGB0YLQuNC60LBcclxuPC9zcGFuPmApLm5vZGUoKTtcclxuICBuYXZpZ2F0ZS5ub2RlKCkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuXHJcbiAgJGNkLmZpZCA9IGZpZDtcclxuICAkY2QuZk5hbWUgPSBuYW1lO1xyXG5cclxuICBpZihmaWQgPiAxMDApe1xyXG4gICAgJGNkLnNpZCA9IGZpZC50b1N0cmluZygpO1xyXG4gICAgJGNkLnNpZCA9IE51bWJlcigkY2Quc2lkLnNsaWNlKDEsICRjZC5zaWQubGVuZ3RoKSk7XHJcbiAgfWVsc2V7XHJcbiAgICAkbW9kZSA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgYmluZEV2ZW50KGJ1dHRvbiwgJ29uY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgbWFrZUNvbm5lY3QoXCJna19TdGF0c0ZvcnVtXCIsIHRydWUpXHJcbiAgfSk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIG1ha2VDb25uZWN0KG5hbWUsIGZpcnN0KXtcclxuICB2YXIgaW5pO1xyXG5cclxuICBpbmkgPSBbXHJcbiAgICB7bmFtZTogXCJwbGF5ZXJzXCIsIGtleTogXCJpZFwiLCBpbmRleDogW1tcIm5hbWVcIiwgXCJhXCIsIHRydWVdXX0sXHJcbiAgICB7bmFtZTogXCJmb3J1bXNcIiwga2V5OiBcImlkXCJ9XHJcbiAgXTtcclxuXHJcbiAgaWYoZmlyc3Qpe1xyXG4gICAgJGlkYiA9IGF3YWl0IGRiKG5hbWUpO1xyXG4gICAgJGlkYi5zZXRJbmlUYWJsZUxpc3QoaW5pKTtcclxuICB9XHJcbiAgJGlkYiA9IGF3YWl0ICRpZGIuY29ubmVjdERCKCk7XHJcbiAgLy8kaWRiLmRlbGV0ZURCKCk7XHJcblxyXG4gIGNvbnNvbGUubG9nKCRpZGIpO1xyXG4gIGFkZFRvREIoKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlUGxheWVycyhpZCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGlkOiBpZCxcclxuICAgIG5hbWU6IFwiXCIsXHJcbiAgICBzdGF0dXM6IFwiXCIsXHJcbiAgICBkYXRlOiAwLFxyXG4gICAgZm9ydW1zOiBbXVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVNZW1iZXJzKGlkKXtcclxuICByZXR1cm4ge1xyXG4gICAgaWQ6IGlkLFxyXG4gICAgcG9zdHM6IDAsXHJcbiAgICBsYXN0OiAwLFxyXG4gICAgc3RhcnQ6IFtdLFxyXG4gICAgd3JpdGU6IFtdLFxyXG4gICAgd29yZHM6IDAsXHJcbiAgICB3b3Jkc0F2ZXJhZ2U6IDAsXHJcbiAgICBjYXJtYTogMCxcclxuICAgIGNhcm1hQXZlcmFnZTogMCxcclxuICAgIHNuOiAwLFxyXG4gICAgZW50ZXI6IDAsXHJcbiAgICBleGl0OiAwLFxyXG4gICAga2ljazogMCxcclxuICAgIGludml0ZTogMFxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVGb3J1bXMoaWQpe1xyXG4gIHJldHVybiB7XHJcbiAgICBpZDogaWQsXHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgc2lkOiAwLFxyXG4gICAgcG9zdHM6IDAsXHJcbiAgICB3b3JkczogMCxcclxuICAgIHBhZ2U6IFswLCAwXSxcclxuICAgIHRoZW1lczogWzAsIDBdLFxyXG4gICAgbG9nOiBbMCwgMF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlVGhlbWVzKGlkKXtcclxuICByZXR1cm4ge1xyXG4gICAgaWQ6IGlkLFxyXG4gICAgbmFtZTogXCJcIixcclxuICAgIGF1dGhvcjogWzAsIFwiXCJdLFxyXG4gICAgcG9zdHM6IFswLCAwXSxcclxuICAgIHBhZ2VzOiBbMCwgMF0sXHJcbiAgICBzdGFydDogMFxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVUaW1lc3RhbXBzKGlkKXtcclxuICByZXR1cm4ge1xyXG4gICAgaWQ6IGlkLFxyXG4gICAgdGltZTogW10sXHJcbiAgICBkYXRhOiBbXVxyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gYWRkVG9EQigpe1xyXG4gIHZhciBmb3J1bTtcclxuXHJcbiAgaWYoISRpZGIuZXhpc3QoYHRoZW1lc18keyRjZC5maWR9YCkpe1xyXG4gICAgZm9ydW0gPSBnZW5lcmF0ZUZvcnVtcygkY2QuZmlkKTtcclxuICAgIGZvcnVtLm5hbWUgPSAkY2QuZk5hbWU7XHJcbiAgICBmb3J1bS5zaWQgPSAkY2Quc2lkO1xyXG4gICAgZm9ydW0gPSByZXBhY2soZm9ydW0sIFwiZm9ydW1cIik7XHJcblxyXG4gICAgJGlkYi5hZGQoXCJmb3J1bXNcIiwgZm9ydW0pO1xyXG4gICAgJGlkYi5zZXRNb2RpZnlpbmdUYWJsZUxpc3QoW1xyXG4gICAgICB7bmFtZTogYHRoZW1lc18keyRjZC5maWR9YCwga2V5OiBcImlkXCJ9LFxyXG4gICAgICB7bmFtZTogYG1lbWJlcnNfJHskY2QuZmlkfWAsIGtleTogXCJpZFwifSxcclxuICAgICAge25hbWU6IGB0aW1lc3RhbXBfJHskY2QuZmlkfWAsIGtleTogXCJpZFwifVxyXG4gICAgXSk7XHJcbiAgICAkaWRiLmRiLmNsb3NlKCk7XHJcbiAgICAkaWRiLm5leHRWZXJzaW9uKCk7XHJcbiAgICBtYWtlQ29ubmVjdChcImdrX1N0YXRzRm9ydW1cIiwgZmFsc2UpO1xyXG4gIH1lbHNle1xyXG4gICAgbG9hZEZyb21Mb2NhbFN0b3JhZ2UoJ3NldHRpbmdzJyk7XHJcblxyXG4gICAgJHQgPSB7XHJcbiAgICAgIHN0YXRzOiBjcmVhdGVUYWJsZShbXCIjc2ZfaGVhZGVyX1NJXCIsIFwiI3NmX2NvbnRlbnRfU0lcIiwgXCIjc2ZfZm9vdGVyX1NJXCJdLCBcInN0YXRzXCIsICRzcyksXHJcbiAgICAgIHRoZW1lczogY3JlYXRlVGFibGUoW1wiI3NmX2hlYWRlcl9UTFwiLCBcIiNzZl9jb250ZW50X1RMXCIsIFwiI3NmX2Zvb3Rlcl9UTFwiXSwgXCJ0aGVtZXNcIiwgJHNzKVxyXG4gICAgfTtcclxuXHJcbiAgICAkZm9ydW0gPSBhd2FpdCAkaWRiLmdldE9uZShcImZvcnVtc1wiLCBcImlkXCIsICRjZC5maWQpO1xyXG4gICAgJGZvcnVtID0gcmVwYWNrKCRmb3J1bSwgXCJmb3J1bVwiKTtcclxuXHJcbiAgICBjcmVhdGVHVUkoKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUdVSSgpe1xyXG4gIHZhciB0YWJsZSwgdGQsIGd1aSwgY2FsZW5kYXI7XHJcblxyXG4gIHRhYmxlID0gJCgndGRbc3R5bGU9XCJjb2xvcjogIzk5MDAwMFwiXTpjb250YWlucyhcItCi0LXQvNCwXCIpJykudXAoJ3RhYmxlJykudXAoJ3RhYmxlJykubm9kZSgpO1xyXG4gIHRkID0gdGFibGUucm93c1swXS5jZWxsc1swXTtcclxuXHJcbiAgZ3VpID0gJCgnPHRkPicpLmh0bWwoYDxiPjxhIHN0eWxlPVwiY29sb3I6ICM5OTAwMDBcIiBocmVmPVwiaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvZm9ydW0ucGhwXCI+0KTQvtGA0YPQvNGLPC9hPiDCuyAkeyRjZC5mTmFtZX08L2I+XHJcbjo6IDxzcGFuIGlkPVwic2ZfZ3VpX3NldHRpbmdzXCIgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7IGZvbnQtd2VpZ2h0OiBib2xkO1wiPtCf0LDQvdC10LvRjCDRg9C/0YDQsNCy0LvQtdC90LjRjzwvc3Bhbj5cclxu4pahIDxzcGFuIGlkPVwic2ZfZ3VpX2ZpbHRlcnNcIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjsgZm9udC13ZWlnaHQ6IGJvbGQ7XCI+0KTQuNC70YzRgtGA0Ys8L3NwYW4+XHJcbuKWoSA8c3BhbiBpZD1cInNmX2d1aV9tZXNzYWdlXCIgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXI7IGZvbnQtd2VpZ2h0OiBib2xkO1wiPtCg0LDRgdGB0YvQu9C60LAg0L/QvtGH0YLRizwvc3Bhbj5cclxuPGJyPlxyXG48dGFibGUgd2lkdGg9XCI5NyVcIiBjZWxsc3BhY2luZz1cIjBcIiBjZWxscGFkZGluZz1cIjBcIiBzdHlsZT1cImJvcmRlci1zdHlsZTogbm9uZTsgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcIiBhbGlnbj1cImNlbnRlclwiPlxyXG4gICAgPHRyPjx0ZCBjbGFzcz1cInNmX2xlZnRcIiBpZD1cInNmX2hlYWRlcl9TSVwiIHZhbGlnbj1cInRvcFwiIGNvbHNwYW49XCIyXCI+PC90ZD48L3RyPlxyXG4gICAgPHRyPjx0ZCBjbGFzcz1cInNmX2xlZnRcIiBpZD1cInNmX2NvbnRlbnRfU0lcIiB2YWxpZ249XCJ0b3BcIiBjb2xzcGFuPVwiMlwiPjwvdGQ+PC90cj5cclxuICAgIDx0cj48dGQgY2xhc3M9XCJzZl9sZWZ0XCIgaWQ9XCJzZl9mb290ZXJfU0lcIiB2YWxpZ249XCJ0b3BcIiBjb2xzcGFuPVwiMlwiPjwvdGQ+PC90cj5cclxuICAgIDx0cj48dGQgY2xhc3M9XCJzZl9sZWZ0XCIgYWxpZ249XCJjZW50ZXJcIiBpZD1cInNmX2hlYWRlcl9UTFwiIHdpZHRoPVwiMTI1MFwiPjwvdGQ+PHRkIGNsYXNzPVwic2ZfbGVmdFwiIHZhbGlnbj1cInRvcFwiIGFsaWduPVwiY2VudGVyXCIgaWQ9XCJzZl9oZWFkZXJfU1RJXCI+PC90ZD48L3RyPlxyXG4gICAgPHRyPjx0ZCBjbGFzcz1cInNmX2xlZnRcIiBhbGlnbj1cImNlbnRlclwiIGlkPVwic2ZfY29udGVudF9UTFwiIHdpZHRoPVwiMTI1MFwiPjwvdGQ+PHRkIGNsYXNzPVwic2ZfbGVmdFwiIHZhbGlnbj1cInRvcFwiIGFsaWduPVwiY2VudGVyXCIgaWQ9XCJzZl9jb250ZW50X1NUSVwiIHJvd3NwYW49XCIyXCI+PC90ZD48L3RyPlxyXG4gICAgPHRyPjx0ZCBjbGFzcz1cInNmX2xlZnRcIiBhbGlnbj1cImNlbnRlclwiIGlkPVwic2ZfZm9vdGVyX1RMXCI+PC90ZD48L3RyPlxyXG48L3RhYmxlPlxyXG48ZGl2IGlkPVwic2Zfc2hhZG93TGF5ZXJcIiB0aXRsZT1cItCa0LvQuNC6INC30LDQutGA0L7QtdGCINC+0LrQvdC+XCI+PC9kaXY+XHJcbjxkaXYgdHlwZT1cIndpbmRvd1wiIGlkPVwic2Zfc3RhdHVzV2luZG93XCI+JHtjcmVhdGVTdGF0dXNXaW5kb3coKX08L2Rpdj5cclxuPGRpdiB0eXBlPVwid2luZG93XCIgaWQ9XCJzZl9jb250cm9sUGFuZWxXaW5kb3dcIj4ke2NyZWF0ZUNvbnRyb2xQYW5lbCgpfTwvZGl2PlxyXG48ZGl2IHR5cGU9XCJ3aW5kb3dcIiBpZD1cInNmX2ZpbHRlcnNXaW5kb3dcIj48L2Rpdj5cclxuPGRpdiB0eXBlPVwid2luZG93XCIgaWQ9XCJzZl9tZXNzYWdlV2luZG93XCI+JHtjcmVhdGVNZXNzYWdlV2luZG93KCl9PC9kaXY+XHJcbjxkaXYgdHlwZT1cIndpbmRvd1wiIGlkPVwic2ZfY2FsZW5kYXJcIj48L2Rpdj5gKS5ub2RlKCk7XHJcblxyXG4gIHRkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGQpO1xyXG4gIHRhYmxlLnJvd3NbMF0uYXBwZW5kQ2hpbGQoZ3VpKTtcclxuXHJcbiAgcmVuZGVyQmFzZUhUTUwoKTtcclxuICAvL3JlbmRlclN0YXRzVGFibGUoKTtcclxuICAvL3JlbmRlclRoZW1lc1RhYmxlKCk7XHJcbiAgY3JlYXRlU2hhZG93TGF5ZXIoKTtcclxuXHJcbiAgYmluZEV2ZW50KCQoJyNzZl9ndWlfc2V0dGluZ3MnKS5ub2RlKCksICdvbmNsaWNrJywgb3BlbkNvbnRyb2xQYW5lbFdpbmRvdyk7XHJcbiAgLy9iaW5kRXZlbnQoJCgnI3NmX2d1aV9tZXNzYWdlJykubm9kZSgpLCAnb25jbGljaycsIG9wZW5NZXNzYWdlV2luZG93KTtcclxuICAvL2JpbmRFdmVudCgkKCcjc2ZfZm9yZ2V0Rm9ydW0nKS5ub2RlKCksICdvbmNsaWNrJywgZm9yZ2V0Rm9ydW0pO1xyXG5cclxuXHJcbiAgJCgnI3NmX2NvbnRyb2xQYW5lbFdpbmRvdycpXHJcbiAgICAuZmluZCgnaW5wdXRbdHlwZT1cImJ1dHRvblwiXScpXHJcbiAgICAubm9kZUFycigpXHJcbiAgICAuZm9yRWFjaChcclxuICAgICAgZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgYmluZEV2ZW50KG5vZGUsICdvbmNsaWNrJywgZnVuY3Rpb24oKXtwcmVwYXJlRG9UYXNrKG5vZGUpfSk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gIC8vYmluZEV2ZW50KCQoJyNzZl9zZW5kTWVzc2FnZXMnKS5ub2RlKCksICdvbmNsaWNrJywgcHJlcGFyZVNlbmRNYWlscyk7XHJcblxyXG4gIGNhbGVuZGFyID0gJCgnc3Bhblt0eXBlPVwiY2FsZW5kYXJDYWxsXCJdJykubm9kZSgpO1xyXG4gIGJpbmRFdmVudChjYWxlbmRhciwgJ29uY2xpY2snLCBmdW5jdGlvbigpe3JlbmRlckNhbGVuZGFyKGNhbGVuZGFyKX0pO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiByZW5kZXJDYWxlbmRhcihub2RlVGV4dERhdGUpe1xyXG4gIHZhciBzaXplLCBsZWZ0LCB0b3AsIGNhbGVuZGFyLCBkYXRlO1xyXG5cclxuICBjYWxlbmRhciA9ICQoJyNzZl9jYWxlbmRhcicpLm5vZGUoKTtcclxuXHJcbiAgaWYoY2FsZW5kYXIuc3R5bGUuZGlzcGxheSA9PSBcImJsb2NrXCIpe1xyXG4gICAgY2FsZW5kYXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYobm9kZVRleHREYXRlLm5leHRFbGVtZW50U2libGluZy5kaXNhYmxlZCl7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBzaXplID0gbm9kZVRleHREYXRlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIGxlZnQgPSBzaXplLmxlZnQgKyBzaXplLndpZHRoICsgMTA7XHJcbiAgdG9wID0gc2l6ZS50b3AgLSA1O1xyXG5cclxuICBjYWxlbmRhci5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XHJcbiAgY2FsZW5kYXIuc3R5bGUudG9wID0gdG9wICsgJ3B4JztcclxuICBjYWxlbmRhci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHJcbiAgZGF0ZSA9IE51bWJlcihub2RlVGV4dERhdGUubmV4dEVsZW1lbnRTaWJsaW5nLnZhbHVlKTtcclxuXHJcbiAgY3JlYXRlQ2FsZW5kYXIoZGF0ZSwgbm9kZVRleHREYXRlKTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlU2hhZG93TGF5ZXIoKXtcclxuICB2YXIgYkJvZHkgPSBkb2N1bWVudC5ib2R5LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIHZhciBmdWxsSGVpZ2h0ID0gJHNjcmVlbkhlaWdodCA+IGJCb2R5LmhlaWdodCA/ICRzY3JlZW5IZWlnaHQgOiBiQm9keS5oZWlnaHQ7XHJcbiAgdmFyIHNoYWRvd0xheWVyO1xyXG5cclxuICBzaGFkb3dMYXllciA9ICQoJyNzZl9zaGFkb3dMYXllcicpLm5vZGUoKTtcclxuICBzaGFkb3dMYXllci5zdHlsZS53aWR0aCA9IGJCb2R5LndpZHRoO1xyXG4gIHNoYWRvd0xheWVyLnN0eWxlLmhlaWdodCA9IGZ1bGxIZWlnaHQ7XHJcblxyXG4gIGJpbmRFdmVudChzaGFkb3dMYXllciwgJ29uY2xpY2snLCBjbG9zZVdpbmRvd3MpO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTdGF0dXNXaW5kb3coKXtcclxuICByZXR1cm4gYDx0YWJsZSB3aWR0aD1cIjYwMFwiIGhlaWdodD1cIjUwXCIgc3R5bGU9XCJtYXJnaW46IDIwcHggMjVweDsgYmFja2dyb3VuZC1jb2xvcjogI2YwZmZmMFwiIHR5cGU9XCJwYWRkaW5nXCI+XHJcbiAgICA8dHIgdHlwZT1cImhlYWRlclwiIGhlaWdodD1cIjM1XCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgc3R5bGU9XCJjb2xvcjogIzk5MDAwMDtcIj7Qn9GA0L7Qs9GA0LXRgdGBINC30LDQtNCw0YfQuDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjE1XCI+XHJcbiAgICAgICAgPHRkPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmctbGVmdDogMzBweDtcIj5cclxuICAgICAgICAgICAgPGI+0JfQsNC00LDRh9CwOjwvYj4gPHNwYW4gaWQ9XCJzZl9wcm9ncmVzc1RleHRcIiBzdHlsZT1cImZvbnQtc3R5bGU6IGl0YWxpYztcIj48L3NwYW4+IFs8c3BhbiBpZD1cInNmX3Byb2dyZXNzQ3VycmVudFwiPjwvc3Bhbj4vPHNwYW4gaWQ9XCJzZl9wcm9ncmVzc01heFwiPjwvc3Bhbj5dXHJcbiAgICAgICAgICAgIDxzcGFuIGlkPVwic2ZfcHJvZ3Jlc3NUZXh0RXh0cmFcIj48L3NwYW4+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZy1sZWZ0OiAzMHB4O1wiPlxyXG4gICAgICAgICAgICA8Yj7QktGA0LXQvNC10L3QuCDQvtGB0YLQsNC70L7RgdGMOjwvYj4gPHNwYW4+MDA6MDA8L3NwYW4+PHNwYW4gc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiIGlkPVwic2ZfcHJvZ3Jlc3NUaW1lXCI+MDwvc3Bhbj5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nLWxlZnQ6IDMwcHg7XCI+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogNTEwcHg7IGhlaWdodDogMTBweDsgYm9yZGVyOiBzb2xpZCAxcHggIzAwMDAwMDsgZmxvYXQ6IGxlZnQ7IG1hcmdpbi10b3A6IDhweDtcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJ3aWR0aDogMDsgaGVpZ2h0OiAxMDAlOyBiYWNrZ3JvdW5kLWNvbG9yOiBicm93bjtcIiBpZD1cInNmX3Byb2dyZXNzQmFyXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6IGxlZnQ7IHdpZHRoOiA1cHg7IGhlaWdodDogMjVweDtcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZsb2F0OiBsZWZ0OyB3aWR0aDogMjVweDsgaGVpZ2h0OiAyNXB4O1wiIGlkPVwic2ZfcHJvZ3Jlc3NJY29cIj48L2Rpdj5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0ciBoZWlnaHQ9XCIyNVwiPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCIgc3R5bGU9XCJwYWRkaW5nOiAxNXB4IDMwcHggMTBweCAwO1wiPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwi0J/QsNGD0LfQsFwiIC8+IDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCLQntGC0LzQtdC90LBcIiAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjVcIiBiZ2NvbG9yPVwiI2QwZWVkMFwiPlxyXG4gICAgICAgIDx0ZD48L3RkPlxyXG4gICAgPC90cj5cclxuPC90YWJsZT5gO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDb250cm9sUGFuZWwoKXtcclxuICB2YXIgY29kZSwgZGlzYWJsZWQ7XHJcblxyXG4gIGRpc2FibGVkID0gJG1vZGUgPyAnJyA6ICdkaXNhYmxlZCc7XHJcbiAgY29kZSA9IGA8dGFibGUgY2VsbHNwYWNpbmc9XCIwXCIgd2lkdGg9XCIzMDBcIiBzdHlsZT1cImJvcmRlcjogc29saWQgMCAjMDAwMDAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjZjBmZmYwOyBtYXJnaW46IDIwcHggMjVweDtcIiB0eXBlPVwic21hbGxQYWRkaW5nXCI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIiB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgYmdjb2xvcj1cIiNkMGVlZDBcIiBjb2xzcGFuPVwiMlwiPtCh0LHQvtGAINC00LDQvdC90YvRhSDQviDRgtC10LzQsNGFPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIiBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICDQn9C+INC60LDQutC+0LUg0YfQuNGB0LvQvjpcclxuICAgICAgICAgICAgPHNwYW4gdHlwZT1cImNhbGVuZGFyQ2FsbFwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcIj4keyRjLmdldE5vcm1hbERhdGUoJGRhdGUsIHRydWUpLmR9PC9zcGFuPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiAgbmFtZT1cInNmX3BhcnNlRm9ydW1cIiBjbGFzcz1cInNmX2hpZGVJbnB1dFwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiB2YWx1ZT1cIiR7JGRhdGV9XCIgLz5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZUZvcnVtXCIgdmFsdWU9XCJjb3VudFwiIGNoZWNrZWQgLz5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIGNvbHNwYW49XCIyXCI+XHJcbiAgICAgICAgICAgINCS0YHQtSDRgdGC0YDQsNC90LjRhtGLINGE0L7RgNGD0LzQsDpcclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZUZvcnVtXCIgdmFsdWU9XCJhbGxcIiAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjMwXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjJcIj48aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwi0J3QsNGH0LDRgtGMXCIgbmFtZT1cInNmX3BhcnNlRm9ydW1cIiAvPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG5cclxuICAgIDx0ciBoZWlnaHQ9XCIzMFwiIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBiZ2NvbG9yPVwiI2QwZWVkMFwiIGNvbHNwYW49XCIyXCI+0JDQvdCw0LvQuNC3INC40LfQstC10YHRgtC90YvRhSDRgtC10Lw8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIGNvbHNwYW49XCIyXCI+XHJcbiAgICAgICAgICAgINCa0L7Qu9C40YfQtdGB0YLQstC+INGC0LXQvDpcclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInNmX3BhcnNlVGhlbWVzXCIgY2xhc3M9XCJzZl9oaWRlSW5wdXRcIiB2YWx1ZT1cIjBcIiAvPi8gWzxzcGFuIGlkPVwic2ZfY291bnRUaHJlYWRzXCIgdGl0bGU9XCLQndC10L7QsdGA0LDQsdC+0YLQsNC90L3Ri9GFINGC0LXQvCAvINCS0YHQtdCz0L4g0YLQtdC8XCI+WzAvMF08L3NwYW4+XVxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNmX3BhcnNlVGhlbWVzXCIgdmFsdWU9XCJjb3VudFwiIGNoZWNrZWQgLz5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIGNvbHNwYW49XCIyXCI+XHJcbiAgICAgICAgICAgINCi0L7Qu9GM0LrQviDQvtGC0LzQtdGH0LXQvdC90YvQtSDQsiDRgdC/0LjRgdC60LU6XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwic2ZfcGFyc2VUaGVtZXNcIiB2YWx1ZT1cInNlbGVjdFwiIC8+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIiBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICDQktGB0LUg0LjQt9Cy0LXRgdGC0L3Ri9C1INGC0LXQvNGLOlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cInNmX3BhcnNlVGhlbWVzXCIgdmFsdWU9XCJhbGxcIiAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjMwXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjJcIj48aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwi0J3QsNGH0LDRgtGMXCIgbmFtZT1cInNmX3BhcnNlVGhlbWVzXCIgLz48L3RkPlxyXG4gICAgPC90cj5cclxuXHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIiB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgYmdjb2xvcj1cIiNkMGVlZDBcIiBjb2xzcGFuPVwiMlwiPtCh0YLQsNGC0YPRgSDQv9C10YDRgdC+0L3QsNC20LXQuTwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5cclxuICAgICAgICAgICAg0JrQvtC70LjRh9C10YHRgtCy0L4g0L/QtdGA0YHQvtC90LDQttC10Lk6XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJzZl9wYXJzZVBsYXllcnNcIiBjbGFzcz1cInNmX2hpZGVJbnB1dFwiIHZhbHVlPVwiMFwiIC8+LzxzcGFuIGlkPVwic2ZfY291bnRNZW1iZXJzXCI+MDwvc3Bhbj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZVBsYXllcnNcIiAke2Rpc2FibGVkfSB2YWx1ZT1cImNvdW50XCIgY2hlY2tlZCAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5cclxuICAgICAgICAgICAg0KLQvtC70YzQutC+INC+0YLQvNC10YfQtdC90L3Ri9C1INCyINGB0L/QuNGB0LrQtTpcclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZVBsYXllcnNcIiAgJHtkaXNhYmxlZH0gdmFsdWU9XCJzZWxlY3RcIiAvPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCIgY29sc3Bhbj1cIjJcIj5cclxuICAgICAgICAgICAg0JLRgdC1INC/0LXRgNGB0L7QvdCw0LbQuDpcclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJzZl9wYXJzZVBsYXllcnNcIiAke2Rpc2FibGVkfSB2YWx1ZT1cImFsbFwiIC8+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBjb2xzcGFuPVwiMlwiPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCLQndCw0YfQsNGC0YxcIiAke2Rpc2FibGVkfSBuYW1lPVwic2ZfcGFyc2VQbGF5ZXJzXCIgLz48L3RkPlxyXG4gICAgPC90cj5cclxuXHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIiB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgYmdjb2xvcj1cIiNkMGVlZDBcIiBjb2xzcGFuPVwiMlwiPtCU0L7Qv9C+0LvQvdC40YLQtdC70YzQvdC+PC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiMjVcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiPtCh0L7RgdGC0LDQsiDRgdC40L3QtNC40LrQsNGC0LA6PC90ZD5cclxuICAgICAgICA8dGQgYWxpZ249XCJsZWZ0XCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cItCe0LHRgNCw0LHQvtGC0LDRgtGMXCIgbmFtZT1cInNmX21lbWJlckxpc3RcIiAke2Rpc2FibGVkfSAvPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjI1XCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwicmlnaHRcIj7Qn9GA0L7RgtC+0LrQvtC7INGB0LjQvdC00LjQutCw0YLQsDo8L3RkPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImxlZnRcIj48aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwi0J7QsdGA0LDQsdC+0YLQsNGC0YxcIiBuYW1lPVwic2Zfc2luZGljYXRlTG9nXCIgJHtkaXNhYmxlZH0gLz48L3RkPlxyXG4gICAgPC90cj5cclxuXHJcbiAgICA8dHIgaGVpZ2h0PVwiNDBcIj5cclxuICAgICAgICA8dGQgY29sc3Bhbj1cIjJcIiBzdHlsZT1cImZvbnQtc2l6ZTogOXB4O1wiIGFsaWduPVwiY2VudGVyXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGlkPVwic2ZfZm9yZ2V0Rm9ydW1cIiBzdHlsZT1cImN1cnNvcjogcG9pbnRlcjtcIj5b0LfQsNCx0YvRgtGMINGN0YLQvtGCINGE0L7RgNGD0LxdPC9zcGFuPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyIGhlaWdodD1cIjVcIiBiZ2NvbG9yPVwiI2QwZWVkMFwiPlxyXG4gICAgICAgIDx0ZCBjb2xzcGFuPVwiMlwiPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG48L3RhYmxlPmA7XHJcblxyXG4gIHJldHVybiBjb2RlO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNZXNzYWdlV2luZG93KCl7XHJcbiAgcmV0dXJuIGA8dGFibGUgd2lkdGg9XCI3MDBcIiBoZWlnaHQ9XCIzOTVcIiBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwibWFyZ2luOiAyMHB4IDI1cHg7IGJhY2tncm91bmQtY29sb3I6ICNmMGZmZjA7XCIgdHlwZT1cInBhZGRpbmdcIj5cclxuICAgIDx0ciB0eXBlPVwiaGVhZGVyXCIgaGVpZ2h0PVwiMzVcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cImNvbG9yOiAjOTkwMDAwO1wiIGNvbHNwYW49XCIzXCI+0KDQsNGB0YHRi9C70LrQsCDQv9C+0YfRgtGLPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHI+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogOHB4IDVweCAycHggNXB4O1wiIGFsaWduPVwicmlnaHRcIj7QmtC+0LzRgzo8L3RkPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDhweCA1cHggMnB4IDVweDsgd2lkdGg6IDIwMHB4O1wiPjxzZWxlY3Qgc3R5bGU9XCJ3aWR0aDogMjAwcHg7XCIgbmFtZT1cIm1pZFwiPjwvc2VsZWN0PjwvdGQ+XHJcbiAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogOHB4IDVweCAycHggNXB4OyB3aWR0aDogMzUwcHg7XCIgYWxpZ249XCJsZWZ0XCI+INCS0YHQtdCz0L46IDxzcGFuIHR5cGU9XCJjb3VudFwiPjwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCI+0KLQtdC80LA6PC90ZD5cclxuICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiAycHggNXB4IDhweCA1cHg7XCIgY29sc3Bhbj1cIjJcIj48aW5wdXQgdHlwZT1cInRleHRcIiBtYXhsZW5ndGg9XCI1MFwiIHN0eWxlPVwid2lkdGg6MTAwJVwiIHZhbHVlPVwiXCIgbmFtZT1cInN1YmplY3RcIj48L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0ciBoZWlnaHQ9XCIzMFwiIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBiZ2NvbG9yPVwiI2QwZWVkMFwiIGNvbHNwYW49XCIzXCI+0KPRgtC40LvQuNGC0Ys8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIDx0cj5cclxuICAgICAgICA8dGQgYWxpZ249XCJyaWdodFwiIHN0eWxlPVwicGFkZGluZzogOHB4IDVweCAycHggNXB4O1wiPtCg0LXQttC40Lw6PC90ZD5cclxuICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiA4cHggNXB4IDJweCA1cHg7IHdpZHRoOiAyMDBweDtcIiBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICA8c2VsZWN0IHN0eWxlPVwid2lkdGg6IDMwMHB4O1wiIG5hbWU9XCJ3b3JrTW9kZVwiPlxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm1haWxcIj7Qn9C+0YfRgtCwPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiaW52aXRlXCI+0J/QvtGH0YLQsCDQuCDQv9GA0LjQs9C70LDRiNC10L3QuNC1PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ29Bd2F5XCI+0J/QvtGH0YLQsCDQuCDQuNC30LPQvdCw0L3QuNC1PC9vcHRpb24+XHJcbiAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cInJpZ2h0XCI+0KHQuNC90LTQuNC60LDRgjo8L3RkPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDJweCA1cHggOHB4IDVweDsgd2lkdGg6IDIwMHB4O1wiIGNvbHNwYW49XCIyXCI+PHNlbGVjdCBzdHlsZT1cIndpZHRoOiAzMDBweDtcIiBuYW1lPVwic2lkXCI+PC9zZWxlY3Q+PC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiMzBcIiB0eXBlPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgYmdjb2xvcj1cIiNkMGVlZDBcIiBjb2xzcGFuPVwiM1wiPtCh0L7QvtCx0YnQtdC90LjQtTwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiIHN0eWxlPVwicGFkZGluZzogOHB4IDhweCAycHggOHB4O1wiPlxyXG4gICAgICAgICAgICA8dGV4dGFyZWEgc3R5bGU9XCJ3aWR0aDoxMDAlXCIgcm93cz1cIjEwXCIgbmFtZT1cIm1lc3NhZ2VcIj48L3RleHRhcmVhPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgPHRyPlxyXG4gICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIzXCIgaGVpZ2h0PVwiMzVcIj5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBpZD1cInNmX3NlbmRNZXNzYWdlc1wiIHZhbHVlPVwi0JfQsNC/0YPRgdGC0LjRgtGMXCI+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICA8dHIgaGVpZ2h0PVwiNVwiIGJnY29sb3I9XCIjZDBlZWQwXCI+XHJcbiAgICAgICAgPHRkIGNvbHNwYW49XCIzXCI+PC90ZD5cclxuICAgIDwvdHI+XHJcbjwvdGFibGU+YDtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ2FsZW5kYXIoY0RhdGUsIG5vZGVUZXh0RGF0ZSl7XHJcbiAgdmFyIG1vbnRocywgZGF5cywgZGF0ZSwgeWVhciwgbW9udGgsIGRheSwgY29kZSwgcm93LCBjb2xsLCBkYXlOdW1iZXIsIGZpcnN0RGF5V2VlaywgZXhpdCwgdE1vbnRoLCB0RGF5LCBjb2xvcjtcclxuXHJcbiAgbW9udGhzICA9IFsn0K/QvdCy0LDRgNGMJywn0KTQtdCy0YDQsNC70YwnLCfQnNCw0YDRgicsJ9CQ0L/RgNC10LvRjCcsJ9Cc0LDQuScsJ9CY0Y7QvdGMJywn0JjRjtC70YwnLCfQkNCy0LPRg9GB0YInLCfQodC10L3RgtGA0Y/QsdGA0YwnLCfQntC60YLRj9Cx0YDRjCcsJ9Cd0L7Rj9Cx0YDRjCcsJ9CU0LXQutCw0LHRgNGMJ107XHJcbiAgZGF5cyAgICA9IFszMSwgMjgsIDMxLCAzMCwgMzEsIDMwLCAzMSwgMzEsIDMwLCAzMSwgMzAsIDMxXTtcclxuICBleGl0ICAgID0gZmFsc2U7XHJcblxyXG4gIGRhdGUgPSBjRGF0ZSA9PSBudWxsID8gJGRhdGUgOiBjRGF0ZTtcclxuICBkYXRlID0gJGMuZ2V0Tm9ybWFsRGF0ZShkYXRlLCB0cnVlKTtcclxuICBkYXRlID0gZGF0ZS5kLnNwbGl0KCcuJyk7XHJcblxyXG4gIGRheSA9IE51bWJlcihkYXRlWzBdKTtcclxuICB0TW9udGggPSBkYXRlWzFdO1xyXG4gIG1vbnRoID0gTnVtYmVyKGRhdGVbMV0pO1xyXG4gIHllYXIgPSBOdW1iZXIoZGF0ZVsyXSk7XHJcblxyXG4gIGlmKHllYXIgJSA0ID09IDApIGRheXNbMV0gPSAyOTtcclxuXHJcbiAgY29kZSA9XHJcbiAgICBgPHRhYmxlIGNsYXNzPVwid2JcIiBzdHlsZT1cIm1hcmdpbjogMjBweCAyNXB4O1wiPlxyXG4gICAgICAgICAgICAgICAgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgdHlwZT1cImNvbnRyb2xcIj7CqzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIHR5cGU9XCJjb250cm9sXCIgdGl0bGU9XCLQktGL0LHRgNCw0YLRjCDQs9C+0LRcIiBjb2xzcGFuPVwiNVwiPiR7bW9udGhzW21vbnRoLTFdfSAke3llYXJ9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgdHlwZT1cImNvbnRyb2xcIj7CuzwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+0J88L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD7QkjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPtChPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+0Kc8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZD7QnzwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkPtChPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQ+0JI8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5gO1xyXG5cclxuICBkYXlOdW1iZXIgPSAxO1xyXG4gIGZpcnN0RGF5V2VlayA9IERhdGUucGFyc2UoYCR7bW9udGh9LzEvJHt5ZWFyfWApO1xyXG4gIGZpcnN0RGF5V2VlayA9IG5ldyBEYXRlKGZpcnN0RGF5V2VlaykuZ2V0RGF5KCk7IGZpcnN0RGF5V2Vlay0tO1xyXG4gIGlmKGZpcnN0RGF5V2VlayA9PSAtMSkgZmlyc3REYXlXZWVrID0gNjtcclxuXHJcbiAgZm9yKHJvdyA9IDA7IHJvdyA8IDY7IHJvdysrKXtcclxuICAgIGlmKGV4aXQpIGJyZWFrO1xyXG4gICAgY29kZSArPSBgPHRyPmA7XHJcbiAgICBmb3IoY29sbCA9IDA7IGNvbGwgPCA3OyBjb2xsKyspe1xyXG4gICAgICBpZihyb3cgPT0gMCAmJiBjb2xsIDwgZmlyc3REYXlXZWVrKXtcclxuICAgICAgICBjb2RlICs9IGA8dGQgY29sc3Bhbj1cIiR7Zmlyc3REYXlXZWVrfVwiPjwvdGQ+YDtcclxuICAgICAgICBjb2xsID0gZmlyc3REYXlXZWVrO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKGRheU51bWJlciA8PSBkYXlzW21vbnRoLTFdKXtcclxuICAgICAgICBpZihkYXlOdW1iZXIgPT0gZGF5c1ttb250aC0xXSAmJiBjb2xsID09IDYpIGV4aXQgPSB0cnVlO1xyXG4gICAgICAgIHREYXkgPSBkYXlOdW1iZXIgPCAxMCA/ICcwJyArIGRheU51bWJlciA6IGRheU51bWJlcjtcclxuICAgICAgICBjb2xvciA9IGRheU51bWJlciA9PSBkYXkgPyAnc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZDBlZWQwO1wiJyA6ICcnO1xyXG4gICAgICAgIGNvZGUgKz0gYDx0ZCB0eXBlPVwiZGF5XCIgJHtjb2xvcn0gbmFtZT1cIiR7dERheX0uJHt0TW9udGh9LiR7eWVhcn1cIiB0aXRsZT1cIiR7dE1vbnRofS8ke3REYXl9LyR7eWVhcn0gMDA6MDBcIj4ke2RheU51bWJlcn08L3RkPmA7XHJcbiAgICAgICAgZGF5TnVtYmVyKys7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIGNvZGUgKz0gYDx0ZCBjb2xzcGFuPVwiJHs3LWNvbGx9XCI+PC90ZD5gO1xyXG4gICAgICAgIGV4aXQgPSB0cnVlO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb2RlICs9IGA8L3RyPmA7XHJcbiAgfVxyXG5cclxuICBjb2RlICs9XHJcbiAgICBgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiN1wiPiR7JGMuZ2V0Tm9ybWFsRGF0ZSgkZGF0ZSwgdHJ1ZSkuZH08L3RkPlxyXG4gICAgICAgICAgICAgPC90cj5cclxuICAgICAgICA8L3RhYmxlPmA7XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICQoJyNzZl9jYWxlbmRhcicpXHJcbiAgICAuaHRtbChjb2RlKVxyXG4gICAgLmZpbmQoJ3RkW3R5cGU9XCJjb250cm9sXCJdLFt0eXBlPVwiZGF5XCJdJylcclxuICAgIC5ub2RlQXJyKClcclxuICAgIC5mb3JFYWNoKFxyXG4gICAgICBmdW5jdGlvbihidXR0b24pe1xyXG4gICAgICAgIGlmKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpID09IFwiY29udHJvbFwiKXtcclxuICAgICAgICAgIGlmKGJ1dHRvbi50aXRsZSA9PSBcItCS0YvQsdGA0LDRgtGMINCz0L7QtFwiKXtcclxuICAgICAgICAgICAgYmluZEV2ZW50KGJ1dHRvbiwgJ29uY2xpY2snLCBmdW5jdGlvbigpe3NldFllYXIobW9udGgsIHllYXIpfSk7XHJcbiAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGJpbmRFdmVudChidXR0b24sICdvbmNsaWNrJywgZnVuY3Rpb24oKXttb3ZlTW9udGgoYnV0dG9uLCBtb250aCwgeWVhcil9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGJpbmRFdmVudChidXR0b24sICdvbmNsaWNrJywgZnVuY3Rpb24oKXtjYWxlbmRhclNldERhdGUoYnV0dG9uLCBub2RlVGV4dERhdGUpfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIG1vdmVNb250aChidXR0b24sIG1vbnRoLCB5ZWFyKXtcclxuICAgIGlmKGJ1dHRvbi50ZXh0Q29udGVudCA9PSBcIsKrXCIpe1xyXG4gICAgICBtb250aC0tO1xyXG4gICAgICBpZihtb250aCA9PSAwKXtcclxuICAgICAgICB5ZWFyLS07XHJcbiAgICAgICAgbW9udGggPSAxMjtcclxuICAgICAgfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIG1vbnRoKys7XHJcbiAgICAgIGlmKG1vbnRoID09IDEzKXtcclxuICAgICAgICB5ZWFyKys7XHJcbiAgICAgICAgbW9udGggPSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBtb250aCA9IG1vbnRoIDwgMTAgPyAnMCcgKyBtb250aCA6IG1vbnRoO1xyXG5cclxuICAgIGNyZWF0ZUNhbGVuZGFyKERhdGUucGFyc2UoYCR7bW9udGh9LzAxLyR7eWVhcn1gKSAvIDEwMDAsIG5vZGVUZXh0RGF0ZSk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHNldFllYXIobW9udGgsIHllYXIpe1xyXG4gICAgdmFyIG5ZZWFyO1xyXG5cclxuICAgIG5ZZWFyID0gcHJvbXB0KFwi0JLQstC10LTQuNGC0LUg0L/QvtC90YvQuSDQs9C+0LRcIik7XHJcblxyXG4gICAgaWYoblllYXIgPT0gXCJcIil7XHJcbiAgICAgIG5ZZWFyID0gMTk3MDtcclxuICAgICAgbW9udGggPSBcIjAxXCI7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgblllYXIgPSBwYXJzZUludChuWWVhciwgMTApO1xyXG4gICAgICBpZihpc05hTihuWWVhcikpIG5ZZWFyID0geWVhcjtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKG5ZZWFyKTtcclxuXHJcbiAgICBjcmVhdGVDYWxlbmRhcihEYXRlLnBhcnNlKGAke21vbnRofS8wMS8ke25ZZWFyfWApIC8gMTAwMCwgbm9kZVRleHREYXRlKTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gY2FsZW5kYXJTZXREYXRlKGJ1dHRvbiwgbm9kZVRleHREYXRlKXtcclxuICAgIG5vZGVUZXh0RGF0ZS5uZXh0RWxlbWVudFNpYmxpbmcudmFsdWUgPSBEYXRlLnBhcnNlKGJ1dHRvbi50aXRsZSkgLyAxMDAwO1xyXG4gICAgJChub2RlVGV4dERhdGUpLmh0bWwoYnV0dG9uLmdldEF0dHJpYnV0ZSgnbmFtZScpKTtcclxuICAgICQoXCIjc2ZfY2FsZW5kYXJcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHByZXBhcmVEb1Rhc2sobm9kZSl7XHJcblxyXG4gIG9wZW5TdGF0dXNXaW5kb3coKTtcclxuXHJcbiAgc3dpdGNoIChub2RlLm5hbWUpe1xyXG4gICAgY2FzZSAnc2ZfcGFyc2VGb3J1bSc6IGZvcnVtKCk7IGJyZWFrO1xyXG4gICAgY2FzZSAnc2ZfcGFyc2VUaGVtZXMnOiB0aGVtZXMoKTsgYnJlYWs7XHJcbiAgICBjYXNlICdzZl9wYXJzZVBsYXllcnMnOiBwbGF5ZXJzKCk7IGJyZWFrO1xyXG4gICAgY2FzZSAnc2ZfbWVtYmVyTGlzdCc6IGdldE1lbWJlcnNMaXN0KCk7IGJyZWFrO1xyXG4gICAgY2FzZSAnc2Zfc2luZGljYXRlTG9nJzogZ2V0TWF4UGFnZVNpbmRpY2F0ZUxvZygpOyBicmVhaztcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZm9ydW0oKXtcclxuICAgIHZhciBwID0gZ2V0UGFyYW0oJ3NmX3BhcnNlRm9ydW0nKTtcclxuXHJcbiAgICBzd2l0Y2gocC50eXBlKXtcclxuICAgICAgY2FzZSAnY291bnQnOlxyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzcygnc3RhcnQnLCBg0J7QsdGA0LDQsdC+0YLQutCwINGE0L7RgNGD0LzQsCDRgdC40L3QtNC40LrQsNGC0LAgIyR7JGZvcnVtLmlkfSDCqyR7JGZvcnVtLm5hbWV9wrtgLCAwLCAxMDApO1xyXG4gICAgICAgIHBhcnNlRm9ydW0oMCwgZmFsc2UsIHAuY291bnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnYWxsJzpcclxuICAgICAgICBnZXRNYXhQYWdlRm9ydW0oKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gdGhlbWVzKCl7XHJcbiAgICB2YXIgcCA9IGdldFBhcmFtKCdzZl9wYXJzZVRoZW1lcycpLCBsO1xyXG5cclxuICAgIHN3aXRjaChwLnR5cGUpe1xyXG4gICAgICBjYXNlICdjb3VudCc6XHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsIGDQntCx0YDQsNCx0L7RgtC60LAg0YLQtdC8YCwgMCwgcC5jb3VudCk7XHJcbiAgICAgICAgcHJlcGFyZVBhcnNlVGhlbWVzKHAuY291bnQpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnc2VsZWN0JzpcclxuICAgICAgICBsID0gZ2V0TGlzdCgnc2ZfdGhlbWVzTGlzdCcpO1xyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzcygnc3RhcnQnLCBg0J7QsdGA0LDQsdC+0YLQutCwINGC0LXQvGAsIDAsIGwuY291bnQpO1xyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzc1RpbWUobC5jKTtcclxuICAgICAgICBwYXJzZVRoZW1lcygwLCBsLmNvdW50LCBsLmFycmF5KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ2FsbCc6XHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsIGDQntCx0YDQsNCx0L7RgtC60LAg0YLQtdC8YCwgMCwgJGNkLmYudGhyZWFkcy5uZXcpO1xyXG4gICAgICAgIHByZXBhcmVQYXJzZVRoZW1lcygwKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gcGxheWVycygpe1xyXG4gICAgdmFyIHAsIGw7XHJcblxyXG4gICAgcCA9IGdldFBhcmFtKCdzZl9wYXJzZVBsYXllcnMnKTtcclxuXHJcbiAgICBzd2l0Y2gocC50eXBlKXtcclxuICAgICAgY2FzZSAnY291bnQnOlxyXG4gICAgICAgIGRpc3BsYXlQcm9ncmVzcygnc3RhcnQnLCBg0J7QsdGA0LDQsdC+0YLQutCwINC/0LXRgNGB0L7QvdCw0LbQtdC5YCwgMCwgcC5jb3VudCk7XHJcbiAgICAgICAgcHJlcGFyZVBhcnNlTWVtYmVycyhwLmNvdW50KTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ3NlbGVjdCc6XHJcbiAgICAgICAgbCA9IGdldExpc3QoJ3NmX21lbWJlcnNMaXN0Jyk7XHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsIGDQntCx0YDQsNCx0L7RgtC60LAg0L/QtdGA0YHQvtC90LDQttC10LlgLCAwLCBsLmNvdW50KTtcclxuICAgICAgICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKGwuYyk7XHJcbiAgICAgICAgcGFyc2VNZW1iZXJzKDAsIGwuY291bnQsIGwuYXJyYXkpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSAnYWxsJzpcclxuICAgICAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgYNCe0LHRgNCw0LHQvtGC0LrQsCDQv9C10YDRgdC+0L3QsNC20LXQuWAsIDAsICRjZC5jb3VudE1lbWJlcnMpO1xyXG4gICAgICAgIHByZXBhcmVQYXJzZU1lbWJlcnMoKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0UGFyYW0obmFtZSl7XHJcbiAgICB2YXIgdHlwZSwgY291bnQsIHRhYmxlO1xyXG5cclxuICAgIHRhYmxlID0gJChub2RlKS51cCgndGFibGUnKS5ub2RlKCk7XHJcbiAgICB0eXBlID0gJCh0YWJsZSkuZmluZChgaW5wdXRbdHlwZT1cInJhZGlvXCJdW25hbWU9XCIke25hbWV9XCJdOmNoZWNrZWRgKS5ub2RlKCkudmFsdWU7XHJcbiAgICBjb3VudCA9ICQodGFibGUpLmZpbmQoYGlucHV0W3R5cGU9XCJ0ZXh0XCJdW25hbWU9XCIke25hbWV9XCJdYCkubm9kZSgpLnZhbHVlO1xyXG4gICAgY291bnQgPSBOdW1iZXIoY291bnQpO1xyXG5cclxuICAgIHJldHVybiB7Y291bnQ6IGNvdW50LCB0eXBlOiB0eXBlfTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TGlzdChuYW1lKXtcclxuICAgIHZhciBsaXN0ID0gW10sIGNvdW50ID0gMCwgaWQ7XHJcblxyXG4gICAgJChgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdW25hbWU9XCIke25hbWV9XCJdOmNoZWNrZWRgKS5ub2RlQXJyKCkuZm9yRWFjaChcclxuICAgICAgZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgICAgaWQgPSBOdW1iZXIobm9kZS52YWx1ZSk7XHJcbiAgICAgICAgaWYobmFtZSA9PSBcInNmX3RoZW1lc0xpc3RcIiAmJiAkY2QuZi50aGVtZXNbaWRdLnBvc3RzWzBdICE9ICRjZC5mLnRoZW1lc1tpZF0ucG9zdHNbMV0pe1xyXG4gICAgICAgICAgbGlzdC5wdXNoKG5vZGUudmFsdWUpO1xyXG4gICAgICAgICAgY291bnQgKz0gY2FsY3VsYXRlVGhlbWVQYWdlcyhpZCkuY291bnQ7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBsaXN0LnB1c2goaWQpO1xyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgaWYobmFtZSA9PSBcInNmX3RoZW1lc0xpc3RcIil7XHJcbiAgICAgIGNvdW50ID0gbGlzdC5sZW5ndGggKiA3NTAgKyBjb3VudCAqIDEyNTAgKyA1MDA7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY291bnQgPSAgY291bnQgKiAxMjUwO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7YXJyYXk6IGxpc3QsIGNvdW50OiBsaXN0Lmxlbmd0aCwgYzogY291bnR9O1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gZm9yZ2V0Rm9ydW0oKXtcclxuICB2YXIgaWQ7XHJcblxyXG4gIGlmKGNvbmZpcm0oJ9CS0Ysg0YPQstGA0LXQvdGLINGH0YLQviDRhdC+0YLQuNGC0LUg0YPQtNCw0LvQuNGC0Ywg0LLRgdC1INC00LDQvdC90YvQtSDQvtCxINGN0YLQvtC8INGE0L7RgNGD0LzQtT8nKSl7XHJcbiAgICBkZWxldGUgJHNkLmZvcnVtc1skY2QuZmlkXTtcclxuICAgIGZvciAoaWQgaW4gJHNkLnBsYXllcnMpIHtcclxuICAgICAgaWYgKCRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF0pIHtcclxuICAgICAgICBkZWxldGUgJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChpZCBpbiAkc2Qua2lja2VkKXtcclxuICAgICAgZGVsZXRlICRzZC5raWNrZWRbJGNkLmZpZF07XHJcbiAgICB9XHJcbiAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gZGlzcGxheVByb2dyZXNzKGluaSwgdGV4dCwgY3VycmVudCwgbWF4KXtcclxuICB2YXIgcGVyY2VudCwgYywgbSwgYiwgaSwgdCwgdGUsIGltZztcclxuXHJcbiAgaW1nID0gYDxkaXYgc3R5bGU9XCJ3aWR0aDogMjVweDsgaGVpZ2h0OiAyNXB4OyBiYWNrZ3JvdW5kOiB1cmwoJHskaWNvLmxvYWRpbmd9KTtcIj48L2Rpdj5gO1xyXG5cclxuICBjID0gJChcIiNzZl9wcm9ncmVzc0N1cnJlbnRcIik7XHJcbiAgbSA9ICQoXCIjc2ZfcHJvZ3Jlc3NNYXhcIik7XHJcbiAgYiA9ICQoXCIjc2ZfcHJvZ3Jlc3NCYXJcIik7XHJcbiAgaSA9ICQoXCIjc2ZfcHJvZ3Jlc3NJY29cIik7XHJcbiAgdCA9ICQoXCIjc2ZfcHJvZ3Jlc3NUZXh0XCIpO1xyXG4gIHRlID0gJChcIiNzZl9wcm9ncmVzc1RleHRFeHRyYVwiKTtcclxuXHJcbiAgaWYoaW5pID09ICdzdGFydCcpe1xyXG4gICAgaS5odG1sKGltZyk7XHJcbiAgICB0Lmh0bWwodGV4dCk7XHJcbiAgICBtLmh0bWwobWF4KTtcclxuICAgIGMuaHRtbChjdXJyZW50KTtcclxuICAgIGIubm9kZSgpLnN0eWxlLndpZHRoID0gJzAlJztcclxuXHJcbiAgICAkY2Quc2hvd1Byb2dyZXNzVGltZSA9IHRydWU7XHJcbiAgfVxyXG4gIGlmKGluaSA9PSAnd29yaycpe1xyXG4gICAgY3VycmVudCA9IHBhcnNlSW50KGMudGV4dCgpLCAxMCkgKyAxO1xyXG4gICAgbWF4ID0gcGFyc2VJbnQobS50ZXh0KCksIDEwKTtcclxuXHJcbiAgICBwZXJjZW50ID0gJGMuZ2V0UGVyY2VudChjdXJyZW50LCBtYXgsIGZhbHNlKTtcclxuICAgIGIubm9kZSgpLnN0eWxlLndpZHRoID0gcGVyY2VudCArICclJztcclxuICAgIGMuaHRtbChjdXJyZW50KTtcclxuICB9XHJcbiAgaWYoaW5pID09ICdleHRyYScpe1xyXG4gICAgdGUuaHRtbCh0ZXh0KTtcclxuICB9XHJcbiAgaWYoaW5pID09ICdkb25lJyl7XHJcbiAgICB0ZS5odG1sKCcnKTtcclxuICAgIGIubm9kZSgpLnN0eWxlLndpZHRoID0gJzEwMCUnO1xyXG4gICAgYy5odG1sKG0udGV4dCgpKTtcclxuICAgIGkuaHRtbCgnPGI+0JfQsNCy0LXRgNGI0LXQvdC+ITwvYj4nKTtcclxuXHJcbiAgICAkY2Quc2hvd1Byb2dyZXNzVGltZSA9IGZhbHNlO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gZGlzcGxheVByb2dyZXNzVGltZSh0KXtcclxuICB2YXIgbm9kZSwgdGltZTtcclxuXHJcbiAgaWYoISRjZC5zaG93UHJvZ3Jlc3NUaW1lKSByZXR1cm47XHJcblxyXG4gIG5vZGUgPSAkKCcjc2ZfcHJvZ3Jlc3NUaW1lJyk7XHJcbiAgdGltZSA9IHQgPyB0IDogTnVtYmVyKG5vZGUudGV4dCgpKSAtIDEwMDA7XHJcbiAgaWYodGltZSA8IDApIHRpbWUgPSAwO1xyXG4gIG5vZGUubm9kZSgpLnByZXZpb3VzRWxlbWVudFNpYmxpbmcudGV4dENvbnRlbnQgPSAkYy5nZXROb3JtYWxUaW1lKHRpbWUpO1xyXG4gIG5vZGUuaHRtbCh0aW1lKTtcclxuICBkaXNwbGF5UHJvZ3Jlc3NUaW1lLmdrRGVsYXkoMTAwMCwgdGhpcywgW10pO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmZ1bmN0aW9uIG9wZW5TdGF0dXNXaW5kb3coKXtcclxuICAkKFwiI3NmX2NvbnRyb2xQYW5lbFdpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICQoXCIjc2ZfZmlsdGVyc1dpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICQoXCIjc2ZfbWVzc2FnZVdpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICAkKFwiI3NmX3N0YXR1c1dpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gb3BlbkNvbnRyb2xQYW5lbFdpbmRvdygpe1xyXG4gICQoXCIjc2Zfc2hhZG93TGF5ZXJcIikubm9kZSgpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICQoXCIjc2ZfY291bnRUaHJlYWRzXCIpLmh0bWwoJGZvcnVtLnRoZW1lc1swXSArICcvJyArICRmb3J1bS50aGVtZXNbMV0pO1xyXG4gIC8vJChcIiNzZl9jb3VudE1lbWJlcnNcIikuaHRtbCgkY2QuY291bnRNZW1iZXJzKTtcclxuICAkKFwiI3NmX2NvbnRyb2xQYW5lbFdpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gb3BlbkZpbHRlcnNXaW5kb3coKXtcclxuICAkKFwiI3NmX3NoYWRvd0xheWVyXCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICQoXCIjc2ZfZmlsdGVyc1dpbmRvd1wiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gb3Blbk1lc3NhZ2VXaW5kb3coKXtcclxuICB2YXIgd2luZG93LCBuO1xyXG5cclxuICAkKFwiI3NmX3NoYWRvd0xheWVyXCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIHdpbmRvdyA9ICQoXCIjc2ZfbWVzc2FnZVdpbmRvd1wiKS5ub2RlKCk7XHJcbiAgbiA9IDA7XHJcblxyXG4gICQod2luZG93KS5maW5kKCdzZWxlY3RbbmFtZT1cIm1pZFwiXScpLmh0bWwoY3JlYXRlU2VsZWN0TGlzdCgpKTtcclxuICAkKHdpbmRvdykuZmluZCgnc2VsZWN0W25hbWU9XCJzaWRcIl0nKS5odG1sKGNyZWF0ZVNlbGVjdFNJRCgpKTtcclxuICAkKHdpbmRvdykuZmluZCgnc3Bhblt0eXBlPVwiY291bnRcIl0nKS5odG1sKG4pO1xyXG5cclxuICB3aW5kb3cuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVTZWxlY3RTSUQoKXtcclxuICAgIHZhciBjb2RlLCBsaXN0LCBzaWQ7XHJcblxyXG4gICAgY29kZSA9ICc8b3B0aW9uIHZhbHVlPVwiMFwiPtCS0YvQsdC10YDQuNGC0LUuLi48L29wdGlvbj4nO1xyXG4gICAgbGlzdCA9ICRtb2RlID8gJHNkLmZvcnVtcyA6ICR0c2QuZm9ydW1zO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKGxpc3QpLmZvckVhY2goXHJcbiAgICAgIGZ1bmN0aW9uKGlkKXtcclxuICAgICAgICBzaWQgPSBpZC5zdWJzdHJpbmcoMSwgaWQubGVuZ3RoKTtcclxuICAgICAgICBjb2RlICs9IGA8b3B0aW9uIHZhbHVlPVwiJHtzaWR9XCI+WyMke3NpZH1dICR7bGlzdFtpZF0ubmFtZX08L29wdGlvbj5gO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIHJldHVybiBjb2RlO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBjcmVhdGVTZWxlY3RMaXN0KCl7XHJcbiAgICB2YXIgY29kZTtcclxuXHJcbiAgICBjb2RlID0gJzxvcHRpb24+0J/QvtGB0LzQvtGC0YDQtdGC0Ywg0YHQv9C40YHQvtC6Li4uPC9vcHRpb24+JztcclxuXHJcbiAgICAkKCcjc2ZfY29udGVudF9TSScpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXVtuYW1lPVwic2ZfbWVtYmVyc0xpc3RcIl06Y2hlY2tlZCcpXHJcbiAgICAgIC5ub2RlQXJyKClcclxuICAgICAgLmZvckVhY2goXHJcbiAgICAgICAgZnVuY3Rpb24oYm94KXtcclxuICAgICAgICAgIG4rKztcclxuICAgICAgICAgIGNvZGUgKz0gYDxvcHRpb24gdmFsdWU9XCIkeyRzZC5wbGF5ZXJzW2JveC52YWx1ZV0ubmFtZX18JHtib3gudmFsdWV9XCI+JHtufS4gJHskc2QucGxheWVyc1tib3gudmFsdWVdLm5hbWV9PC9vcHRpb24+YDtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcblxyXG4gICAgcmV0dXJuIGNvZGU7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjbG9zZVdpbmRvd3MoKXtcclxuICB2YXIgc3RhdHVzID0gJChcIiNzZl9wcm9ncmVzc0ljb1wiKS50ZXh0KCk7XHJcbiAgdmFyIHdpbmRvdyA9ICQoXCIjc2Zfc3RhdHVzV2luZG93XCIpLm5vZGUoKTtcclxuXHJcbiAgaWYod2luZG93LnN0eWxlLmRpc3BsYXkgPT0gXCJibG9ja1wiICYmIHN0YXR1cyAhPSBcItCX0LDQstC10YDRiNC10L3QviFcIikgcmV0dXJuO1xyXG5cclxuICAkKFwiI3NmX3NoYWRvd0xheWVyXCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICQoXCIjc2ZfY29udHJvbFBhbmVsV2luZG93XCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgJChcIiNzZl9maWx0ZXJzV2luZG93XCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgJChcIiNzZl9tZXNzYWdlV2luZG93XCIpLm5vZGUoKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgJChcIiNzZl9jYWxlbmRhclwiKS5ub2RlKCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIHdpbmRvdy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGdldE1lbWJlcnNMaXN0KCl7XHJcbiAgdmFyIHVybDtcclxuXHJcbiAgaWYoJGNkLnNpZCl7XHJcbiAgICB1cmwgPSBgaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc3luZGljYXRlLnBocD9pZD0keyRjZC5zaWR9JnBhZ2U9bWVtYmVyc2A7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgJ9Ch0LHQvtGAINC4INC+0LHRgNCw0LHQvtGC0LrQsCDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDRgdC+0YHRgtCw0LLQtSDRgdC40L3QtNC40LrQsNGC0LAnLCAwLCAxKTtcclxuXHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSh1cmwsICdHRVQnLCBudWxsLCB0cnVlLFxyXG4gICAgICAgIGZ1bmN0aW9uIChyZXEpe1xyXG4gICAgICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgcGFyc2UoKTtcclxuICAgICAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgnZGF0YScpO1xyXG4gICAgICAgICAgcmVuZGVyU3RhdHNUYWJsZSgpO1xyXG4gICAgICAgICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgIGVycm9yTG9nKFwi0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YHQvtGB0YLQsNCy0LUg0YHQuNC90LTQuNC60LDRgtCwXCIsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgIGVycm9yTG9nKFwi0YHQsdC+0YDQtSDQuNC90YTQvtGA0LzQsNGG0LjQuCDQviDRgdC+0YHRgtCw0LLQtSDRgdC40L3QtNC40LrQsNGC0LBcIiwgMSwgZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlKCl7XHJcbiAgICB2YXIgbGlzdCwgaWQsIG5hbWUsIHNuLCBwZjtcclxuXHJcbiAgICBsaXN0ID0gJCgkYW5zd2VyKS5maW5kKCdiOmNvbnRhaW5zKFwi0KHQvtGB0YLQsNCyINGB0LjQvdC00LjQutCw0YLQsFwiKScpLnVwKCd0YWJsZScpLmZpbmQoJ2FbaHJlZio9XCJpbmZvLnBocFwiXScpLm5vZGVBcnIoKTtcclxuXHJcbiAgICBPYmplY3Qua2V5cygkc2QucGxheWVycykuZm9yRWFjaChmdW5jdGlvbihpZCl7XHJcbiAgICAgIHBmID0gJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXTtcclxuICAgICAgaWYocGYgIT0gbnVsbCl7XHJcbiAgICAgICAgcGYubWVtYmVyID0gZmFsc2U7XHJcbiAgICAgICAgcGYuc24gPSAwO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24obm9kZSl7XHJcbiAgICAgIGlkID0gTnVtYmVyKG5vZGUuaHJlZi5tYXRjaCgvKFxcZCspLylbMV0pO1xyXG4gICAgICBuYW1lID0gbm9kZS50ZXh0Q29udGVudDtcclxuICAgICAgc24gPSAkKG5vZGUpLnVwKCd0cicpLm5vZGUoKS5jZWxsc1swXS50ZXh0Q29udGVudDtcclxuICAgICAgc24gPSBwYXJzZUludChzbiwgMTApO1xyXG5cclxuICAgICAgaWYoJHNkLnBsYXllcnNbaWRdID09IG51bGwpe1xyXG4gICAgICAgICRzZC5wbGF5ZXJzW2lkXSA9IGdlbmVyYXRlUGxheWVyKG5hbWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZigkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdID09IG51bGwpe1xyXG4gICAgICAgICRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF0gPSBnZW5lcmF0ZUZvcnVtUGxheWVyKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF0ubWVtYmVyID0gdHJ1ZTtcclxuICAgICAgJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXS5zbiA9IHNuO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBnZXRNYXhQYWdlU2luZGljYXRlTG9nKCl7XHJcbiAgdmFyIHVybCwgcGFnZTtcclxuXHJcbiAgdXJsID0gYGh0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L3N5bmRpY2F0ZS5sb2cucGhwP2lkPSR7JGNkLnNpZH0mcGFnZV9pZD0xMDAwMDAwMGA7XHJcblxyXG4gIHRyeXtcclxuICAgIFJFUSh1cmwsICdHRVQnLCBudWxsLCB0cnVlLFxyXG4gICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAkYW5zd2VyLmlubmVySFRNTCA9IHJlcS5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgJGNkLmxQYWdlID0gcGFyc2UoKTtcclxuICAgICAgICBwYWdlID0gJGNkLmxQYWdlIC0gJGNkLmYubG9nO1xyXG5cclxuICAgICAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgYNCe0LHRgNCw0LHQvtGC0LrQsCDQv9GA0L7RgtC+0LrQvtC70LAg0YHQuNC90LTQuNC60LDRgtCwICMkeyRjZC5maWR9IMKrJHskc2QuZm9ydW1zWyRjZC5maWRdLm5hbWV9wrtgLCAwLCBwYWdlICsgMSk7XHJcbiAgICAgICAgZGlzcGxheVByb2dyZXNzVGltZSgocGFnZSArIDEpICogMTI1MCk7XHJcbiAgICAgICAgcGFyc2VTaW5kaWNhdGVMb2cuZ2tEZWxheSg3NTAsIHRoaXMsIFtwYWdlXSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIGVycm9yTG9nKFwi0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0LzQsNC60YHQuNC80LDQu9GM0L3QvtC5INGB0YLRgNCw0L3RhtC40LUg0L/RgNC+0YLQvtC60L7Qu9CwINGB0LjQvdC00LjQutCw0YLQsFwiLCAwLCAwKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9Y2F0Y2ggKGUpe1xyXG4gICAgZXJyb3JMb2coXCLRgdCx0L7RgNC1INC40L3RhNC+0YDQvNCw0YbQuNC4INC+INC80LDQutGB0LjQvNCw0LvRjNC90L7QuSDRgdGC0YDQsNC90YbQuNC1INC/0YDQvtGC0L7QutC+0LvQsCDRgdC40L3QtNC40LrQsNGC0LBcIiwgMSwgZSk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlKCl7XHJcbiAgICB2YXIgcGFnZTtcclxuXHJcbiAgICBwYWdlID0gJCgkYW5zd2VyKS5maW5kKGBiOmNvbnRhaW5zKFwiftCf0YDQvtGC0L7QutC+0Lsg0YHQuNC90LTQuNC60LDRgtCwICMkeyRjZC5zaWR9XCIpYCkudXAoJ2RpdicpLm5leHQoJ2NlbnRlcicpLmZpbmQoJ2EnKTtcclxuICAgIHBhZ2UgPSBwYWdlLm5vZGUoLTEpLmhyZWYuc3BsaXQoJ3BhZ2VfaWQ9JylbMV07XHJcblxyXG4gICAgcmV0dXJuIE51bWJlcihwYWdlKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHBhcnNlU2luZGljYXRlTG9nKGluZGV4KXtcclxuICB2YXIgdXJsO1xyXG5cclxuICBpZihpbmRleCAhPSAtMSl7XHJcbiAgICB1cmwgPSBgaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc3luZGljYXRlLmxvZy5waHA/aWQ9JHskY2Quc2lkfSZwYWdlX2lkPSR7aW5kZXh9YDtcclxuXHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSh1cmwsICdHRVQnLCBudWxsLCB0cnVlLFxyXG4gICAgICAgIGZ1bmN0aW9uIChyZXEpe1xyXG4gICAgICAgICAgZGlzcGxheVByb2dyZXNzKCd3b3JrJyk7XHJcbiAgICAgICAgICAkYW5zd2VyLmlubmVySFRNTCA9IHJlcS5yZXNwb25zZVRleHQ7XHJcbiAgICAgICAgICAkKCRhbnN3ZXIpXHJcbiAgICAgICAgICAgIC5maW5kKCdmb250W2NvbG9yPVwiZ3JlZW5cIl0nKVxyXG4gICAgICAgICAgICAubm9kZUFycigpXHJcbiAgICAgICAgICAgIC5yZXZlcnNlKClcclxuICAgICAgICAgICAgLmZvckVhY2gocGFyc2UpO1xyXG4gICAgICAgICAgaW5kZXgtLTtcclxuXHJcbiAgICAgICAgICBpZigkY2QubFBhZ2UgIT0gJGNkLmYubG9nKSAkY2QuZi5sb2crKztcclxuXHJcbiAgICAgICAgICBjb3JyZWN0aW9uVGltZSgpO1xyXG4gICAgICAgICAgc2F2ZVRvTG9jYWxTdG9yYWdlKCdkYXRhJyk7XHJcbiAgICAgICAgICBwYXJzZVNpbmRpY2F0ZUxvZy5na0RlbGF5KDc1MCwgdGhpcywgW2luZGV4XSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgIGVycm9yTG9nKFwi0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0YEg0L/RgNC+0YLQvtC60L7Qu9CwINGB0LjQvdC00LjQutCw0YLQsFwiLCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9Y2F0Y2ggKGUpe1xyXG4gICAgICBlcnJvckxvZyhcItGB0LHQvtGA0LUg0LjQvdGE0L7RgNC80LDRhtC40Lgg0YEg0L/RgNC+0YLQvtC60L7Qu9CwINGB0LjQvdC00LjQutCw0YLQsFwiLCAxLCBlKTtcclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIHJlbmRlclN0YXRzVGFibGUoKTtcclxuICAgIGRpc3BsYXlQcm9ncmVzcygnZG9uZScpO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZShub2RlKXtcclxuICAgIHZhciBuZXh0LCBpZCwgZGF0ZSwgbmFtZTtcclxuXHJcbiAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xyXG4gICAgZGF0ZSA9IG5vZGUudGV4dENvbnRlbnQubWF0Y2goLyhcXGQpKFxcZCkuKFxcZCkoXFxkKS4oXFxkKShcXGQpIChcXGQpKFxcZCk6KFxcZCkoXFxkKS8pO1xyXG5cclxuICAgIGlmKGRhdGUpe1xyXG4gICAgICBuZXh0ID0gJChub2RlKS5uZXh0KCdub2JyJykubm9kZSgpO1xyXG5cclxuICAgICAgaWYobmV4dC50ZXh0Q29udGVudC5tYXRjaCgv0L/RgNC40L3Rj9GCINCyINGB0LjQvdC00LjQutCw0YIvKSl7XHJcbiAgICAgICAgc2V0RGF0ZSgnZW50ZXInKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYobmV4dC50ZXh0Q29udGVudC5tYXRjaCgv0LLRi9GI0LXQuyDQuNC3INGB0LjQvdC00LjQutCw0YLQsC8pKXtcclxuICAgICAgICBzZXREYXRlKCdleGl0Jyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKG5leHQudGV4dENvbnRlbnQubWF0Y2goL9C/0L7QutC40L3Rg9C7INGB0LjQvdC00LjQutCw0YIvKSl7XHJcbiAgICAgICAgc2V0RGF0ZSgnZXhpdCcpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKG5leHQudGV4dENvbnRlbnQubWF0Y2goL9C/0YDQuNCz0LvQsNGB0LjQuyDQsiDRgdC40L3QtNC40LrQsNGCLykpe1xyXG4gICAgICAgIHNldEludml0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldERhdGUoa2V5KXtcclxuICAgICAgdmFyIGV4dHJhO1xyXG5cclxuICAgICAgaWQgPSAkKG5leHQpLmZpbmQoJ2FbaHJlZio9XCJpbmZvLnBocFwiXScpO1xyXG4gICAgICBuYW1lID0gaWQudGV4dCgpO1xyXG4gICAgICBkYXRlID0gYCR7ZGF0ZVszXX0ke2RhdGVbNF19LyR7ZGF0ZVsxXX0ke2RhdGVbMl19LzIwJHtkYXRlWzVdfSR7ZGF0ZVs2XX0gJHtkYXRlWzddfSR7ZGF0ZVs4XX06JHtkYXRlWzldfSR7ZGF0ZVsxMF19YDtcclxuICAgICAgZGF0ZSA9IERhdGUucGFyc2UoZGF0ZSkgLyAxMDAwO1xyXG5cclxuICAgICAgaWYoaWQubGVuZ3RoICE9IDApe1xyXG4gICAgICAgIGlkID0gaWQubm9kZSgpLmhyZWY7XHJcbiAgICAgICAgaWQgPSBOdW1iZXIoaWQubWF0Y2goLyhcXGQrKS8pWzFdKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgbmFtZSA9IG5leHQudGV4dENvbnRlbnQubWF0Y2goLyguKykg0L/QvtC60LjQvdGD0Lsg0YHQuNC90LTQuNC60LDRgiBcXCgoLispXFwpLylbMV07XHJcbiAgICAgICAgaWQgPSAkY2QubmFtZVRvSWRbbmFtZV07XHJcbiAgICAgICAgZXh0cmEgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZihpZCAhPSBudWxsKXtcclxuICAgICAgICBpZigkc2QucGxheWVyc1tpZF0gPT0gbnVsbCkgJHNkLnBsYXllcnNbaWRdID0gZ2VuZXJhdGVQbGF5ZXIobmFtZSk7XHJcbiAgICAgICAgaWYoJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXSA9PSBudWxsKSAkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdID0gZ2VuZXJhdGVGb3J1bVBsYXllcigpO1xyXG5cclxuICAgICAgICAkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdLmdvQXdheSA9IGV4dHJhID8gMSA6IDA7XHJcbiAgICAgICAgJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXVtrZXldID0gZGF0ZTtcclxuICAgICAgfWVsc2UgaWYobmFtZSAhPSBudWxsKXtcclxuICAgICAgICBpZigkc2Qua2lja2VkWyRjZC5maWRdID09IG51bGwpICRzZC5raWNrZWRbJGNkLmZpZF0gPSB7fTtcclxuICAgICAgICAkc2Qua2lja2VkWyRjZC5maWRdW25hbWVdID0gZGF0ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBzZXRJbnZpdGUoKXtcclxuICAgICAgdmFyIG5hbWUsIGlkO1xyXG4gICAgICBuYW1lID0gbmV4dC50ZXh0Q29udGVudC5tYXRjaCgvKC4rKSDQv9GA0LjQs9C70LDRgdC40Lsg0LIg0YHQuNC90LTQuNC60LDRgiAoLispLylbMl07XHJcbiAgICAgIGlkID0gJGNkLm5hbWVUb0lkW25hbWVdO1xyXG5cclxuICAgICAgaWYoaWQgIT0gbnVsbCl7XHJcbiAgICAgICAgaWYgKCRzZC5wbGF5ZXJzW2lkXSA9PSBudWxsKSAkc2QucGxheWVyc1tpZF0gPSBnZW5lcmF0ZVBsYXllcihuYW1lKTtcclxuICAgICAgICBpZiAoJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXSA9PSBudWxsKSAkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdID0gZ2VuZXJhdGVGb3J1bVBsYXllcigpO1xyXG5cclxuICAgICAgICAkc2QucGxheWVyc1tpZF0uZm9ydW1zWyRjZC5maWRdLmludml0ZSA9IDE7XHJcbiAgICAgIH1lbHNlIGlmKG5hbWUgIT0gbnVsbCl7XHJcbiAgICAgICAgaWYoJHNkLmludml0ZSA9PSBudWxsKSAkc2QuaW52aXRlID0ge307XHJcbiAgICAgICAgaWYoJHNkLmludml0ZVskY2QuZmlkXSA9PSBudWxsKSAkc2QuaW52aXRlWyRjZC5maWRdID0ge307XHJcbiAgICAgICAgJHNkLmludml0ZVskY2QuZmlkXVtuYW1lXSA9IDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldE1heFBhZ2VGb3J1bSgpe1xyXG4gIHZhciB1cmwsIHBhZ2U7XHJcblxyXG4gIHVybCA9IFwiaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvdGhyZWFkcy5waHA/ZmlkPVwiICsgJGZvcnVtLmlkICsgXCImcGFnZV9pZD0xMDAwMDAwMFwiO1xyXG5cclxuICAkYW5zd2VyLmlubmVySFRNTCA9IGF3YWl0IGFqYXgodXJsLCBcIkdFVFwiLCBudWxsKTtcclxuXHJcbiAgJGZvcnVtLnBhZ2VbMV0gPSBwYXJzZSgpO1xyXG4gIHBhZ2UgPSAkZm9ydW0ucGFnZVsxXSAtICRmb3J1bS5wYWdlWzBdO1xyXG5cclxuICAkaWRiLmFkZChcImZvcnVtc1wiLCByZXBhY2soJGZvcnVtLCBcImZvcnVtXCIpKTtcclxuXHJcbiAgZGlzcGxheVByb2dyZXNzKCdzdGFydCcsIGDQntCx0YDQsNCx0L7RgtC60LAg0YTQvtGA0YPQvNCwINGB0LjQvdC00LjQutCw0YLQsCAjJHskZm9ydW0uaWR9IMKrJHskZm9ydW0ubmFtZX3Cu2AsIDAsIHBhZ2UgKyAxKTtcclxuICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKHBhZ2UgKiAxMjUwICsgMTUwMCk7XHJcblxyXG4gIHBhcnNlRm9ydW0uZ2tEZWxheSg3NTAsIHRoaXMsIFtwYWdlLCB0cnVlXSk7XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHBhcnNlKCl7XHJcbiAgICB2YXIgcGFnZTtcclxuXHJcbiAgICBwYWdlID0gJCgkYW5zd2VyKS5maW5kKCdhW3N0eWxlPVwiY29sb3I6ICM5OTAwMDBcIl06Y29udGFpbnMoXCJ+0KTQvtGA0YPQvNGLXCIpJykudXAoJ2InKS5uZXh0KCdjZW50ZXInKS5maW5kKCdhJyk7XHJcbiAgICBwYWdlID0gcGFnZS5ub2RlKC0xKS5ocmVmLnNwbGl0KCdwYWdlX2lkPScpWzFdO1xyXG5cclxuICAgIHJldHVybiBOdW1iZXIocGFnZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gcGFyc2VGb3J1bShpbmRleCwgbW9kZSwgc3RvcERhdGUpe1xyXG4gIHZhciB1cmwsIGNvdW50O1xyXG5cclxuICB1cmwgPSBgaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvdGhyZWFkcy5waHA/ZmlkPSR7JGNkLmZpZH0mcGFnZV9pZD0ke2luZGV4fWA7XHJcbiAgY291bnQgPSAwO1xyXG5cclxuICBpZihpbmRleCAhPSAtMSkge1xyXG5cclxuICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gYXdhaXQgYWpheCh1cmwsIFwiR0VUXCIsIG51bGwpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCd3b3JrJyk7XHJcblxyXG4gICAgJCgkYW5zd2VyKVxyXG4gICAgICAuZmluZCgndGRbc3R5bGU9XCJjb2xvcjogIzk5MDAwMFwiXTpjb250YWlucyhcItCi0LXQvNCwXCIpJylcclxuICAgICAgLnVwKCd0YWJsZScpXHJcbiAgICAgIC5maW5kKCd0cltiZ2NvbG9yPVwiI2UwZWVlMFwiXSxbYmdjb2xvcj1cIiNkMGY1ZDBcIl0nKVxyXG4gICAgICAubm9kZUFycigpXHJcbiAgICAgIC5mb3JFYWNoKHBhcnNlKTtcclxuXHJcbiAgICBpbmRleCA9ICRmb3J1bS5zaWQgPyBpbmRleCAtIDEgOiBpbmRleCArIDE7XHJcbiAgICBpZigkZm9ydW0uc2lkICYmICRmb3J1bS5wYWdlWzBdICE9ICRmb3J1bS5wYWdlWzFdKSAkZm9ydW0ucGFnZVswXSsrO1xyXG5cclxuICAgIC8vY29ycmVjdGlvblRpbWUoKTtcclxuICAgIC8vY2FsY05ld1RoZW1lcygpO1xyXG4gICAgLy9zYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuXHJcblxyXG5cclxuICAgIHBhcnNlRm9ydW0uZ2tEZWxheSg3NTAsIHRoaXMsIFtpbmRleCwgbW9kZSwgc3RvcERhdGVdKTtcclxuXHJcbiAgICAvL3RyeXtcclxuICAgIC8vICBSRVEodXJsLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgIC8vICAgIGZ1bmN0aW9uKHJlcSl7XHJcbiAgICAvLyAgICAgIGRpc3BsYXlQcm9ncmVzcygnd29yaycpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgLy8gICAgICAkKCRhbnN3ZXIpXHJcbiAgICAvLyAgICAgICAgLmZpbmQoJ3RkW3N0eWxlPVwiY29sb3I6ICM5OTAwMDBcIl06Y29udGFpbnMoXCLQotC10LzQsFwiKScpXHJcbiAgICAvLyAgICAgICAgLnVwKCd0YWJsZScpXHJcbiAgICAvLyAgICAgICAgLmZpbmQoJ3RyW2JnY29sb3I9XCIjZTBlZWUwXCJdLFtiZ2NvbG9yPVwiI2QwZjVkMFwiXScpXHJcbiAgICAvLyAgICAgICAgLm5vZGVBcnIoKVxyXG4gICAgLy8gICAgICAgIC5mb3JFYWNoKHBhcnNlKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgIGluZGV4ID0gbW9kZSA/IGluZGV4IC0gMSA6IGluZGV4ICsgMTtcclxuICAgIC8vICAgICAgaWYobW9kZSAmJiAkY2QuZlBhZ2UgIT0gJGNkLmYucGFnZSkgJGNkLmYucGFnZSsrO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgY29ycmVjdGlvblRpbWUoKTtcclxuICAgIC8vICAgICAgY2FsY05ld1RoZW1lcygpO1xyXG4gICAgLy8gICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgIC8vICAgICAgcGFyc2VGb3J1bS5na0RlbGF5KDc1MCwgdGhpcywgW2luZGV4LCBtb2RlLCBzdG9wRGF0ZV0pO1xyXG4gICAgLy8gICAgfSxcclxuICAgIC8vICAgIGZ1bmN0aW9uKCl7XHJcbiAgICAvLyAgICAgIGVycm9yTG9nKFwi0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YLQtdC80LDRhVwiLCAwLCAwKTtcclxuICAgIC8vICAgIH1cclxuICAgIC8vICApO1xyXG4gICAgLy99Y2F0Y2goZSl7XHJcbiAgICAvLyAgZXJyb3JMb2coXCLRgdCx0L7RgNC1INC40L3RhNC+0YDQvNCw0YbQuNC4INC+INGC0LXQvNCw0YVcIiwgMSwgZSk7XHJcbiAgICAvL31cclxuICB9ZWxzZXtcclxuICAgIC8vc2F2ZVRvTG9jYWxTdG9yYWdlKCdkYXRhJyk7XHJcbiAgICAvL3JlbmRlclRhYmxlcygpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcblxyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZSh0cil7XHJcbiAgICB2YXIgdGQsIHRocmVhZCwgcGxheWVyLCBzdGFydCwgZGF0ZSwgdGlkO1xyXG4gICAgdmFyIHRoZW1lO1xyXG5cclxuICAgIHRkID0gdHIuY2VsbHM7XHJcbiAgICB0aWQgPSBnZXRJZCgpO1xyXG5cclxuICAgIC8vZGF0ZSA9IGdldERhdGUoKTtcclxuXHJcbiAgICB0aGVtZSA9ICRpZGIuZ2V0T25lKGB0aGVtZXNfJHskZm9ydW0uaWR9YCwgXCJpZFwiLCB0aWQpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKHRoZW1lKTtcclxuXHJcbiAgICBpZih0aGVtZSA9PSBudWxsKXtcclxuICAgICAgJGZvcnVtLnRoZW1lc1sxXSsrO1xyXG5cclxuICAgICAgdGhlbWUgPSBnZW5lcmF0ZVRoZW1lcyh0aWQpO1xyXG4gICAgICB0aGVtZS5uYW1lID0gZ2V0TmFtZSgpO1xyXG4gICAgICB0aGVtZS5hdXRob3IgPSBnZXRBdXRob3IoKTtcclxuICAgICAgdGhlbWUucG9zdHMgPSBnZXRQb3N0cygpO1xyXG4gICAgICB0aGVtZS5wYWdlcyA9IGdldFBhZ2VzKCk7XHJcbiAgICAgIHRoZW1lLnN0YXJ0ID0gZ2V0RGF0ZSgpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIHRoZW1lID0gcmVwYWNrKHRoZW1lLCBcInRoZW1lXCIpO1xyXG4gICAgICB0aGVtZS5wb3N0cyA9IGdldFBvc3RzKCk7XHJcbiAgICAgIHRoZW1lLnBhZ2VzID0gZ2V0UGFnZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZyh0aGVtZSk7XHJcblxyXG4gICAgLy9pZihtb2RlKXtcclxuICAgIC8vICBhZGRUaGVtZSgpO1xyXG4gICAgLy99ZWxzZXtcclxuICAgIC8vICBpZihzdG9wRGF0ZSAhPSBudWxsICYmIHN0b3BEYXRlIDwgZGF0ZSl7XHJcbiAgICAvLyAgICBhZGRUaGVtZSgpO1xyXG4gICAgLy8gIH1lbHNle1xyXG4gICAgLy8gICAgY291bnQrKztcclxuICAgIC8vICAgIGlmKGNvdW50ID09IDUpe1xyXG4gICAgLy8gICAgICBpbmRleCA9IC0yO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gIH1cclxuICAgIC8vfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRUaGVtZSgpe1xyXG4gICAgICBpZiAodGhyZWFkID09IG51bGwpIHtcclxuICAgICAgICAkY2QuZi50aHJlYWRzLmFsbCsrO1xyXG4gICAgICAgICRjZC5mLnRoZW1lc1skY2QudGlkXSA9IHt9O1xyXG4gICAgICAgIHRocmVhZCA9ICRjZC5mLnRoZW1lc1skY2QudGlkXTtcclxuXHJcbiAgICAgICAgdGhyZWFkLmNoZWNrID0gMDtcclxuICAgICAgICB0aHJlYWQubmFtZSA9IGdldE5hbWUoKTtcclxuICAgICAgICB0aHJlYWQucG9zdHMgPSBnZXRQb3N0cygpO1xyXG4gICAgICAgIHRocmVhZC5kYXRlID0gZGF0ZTtcclxuICAgICAgICB0aHJlYWQuYXV0aG9yID0gZ2V0QXV0aG9yKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyZWFkLnBvc3RzID0gZ2V0UG9zdHMoKTtcclxuICAgICAgfVxyXG4gICAgICBwbGF5ZXIgPSAkc2QucGxheWVyc1t0aHJlYWQuYXV0aG9yLmlkXTtcclxuXHJcbiAgICAgIGlmIChwbGF5ZXIgPT0gbnVsbCkge1xyXG4gICAgICAgICRzZC5wbGF5ZXJzW3RocmVhZC5hdXRob3IuaWRdID0gZ2VuZXJhdGVQbGF5ZXIodGhyZWFkLmF1dGhvci5uYW1lKTtcclxuICAgICAgICBwbGF5ZXIgPSAkc2QucGxheWVyc1t0aHJlYWQuYXV0aG9yLmlkXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBsYXllci5mb3J1bXNbJGNkLmZpZF0gPT0gbnVsbCkge1xyXG4gICAgICAgIHBsYXllci5mb3J1bXNbJGNkLmZpZF0gPSBnZW5lcmF0ZUZvcnVtUGxheWVyKCk7XHJcbiAgICAgIH1cclxuICAgICAgc3RhcnQgPSBwbGF5ZXIuZm9ydW1zWyRjZC5maWRdLnN0YXJ0O1xyXG5cclxuICAgICAgaWYgKCFzdGFydC5na0V4aXN0KCRjZC50aWQpKSB7XHJcbiAgICAgICAgc3RhcnQucHVzaCgkY2QudGlkKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRJZCgpe1xyXG4gICAgICB2YXIgaWQ7XHJcblxyXG4gICAgICBpZCA9ICQodGRbMF0pLmZpbmQoJ2EnKS5ub2RlKCk7XHJcbiAgICAgIGlkID0gaWQuaHJlZi5zcGxpdCgndGlkPScpWzFdO1xyXG5cclxuICAgICAgcmV0dXJuIE51bWJlcihpZCk7XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldE5hbWUoKXtcclxuICAgICAgcmV0dXJuICQodGRbMF0pLmZpbmQoJ2EnKS50ZXh0KCk7XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFBvc3RzKCl7XHJcbiAgICAgIHZhciBwb3N0cztcclxuXHJcbiAgICAgIHBvc3RzID0gJCh0ZFsyXSkudGV4dCgpLnJlcGxhY2UoLywvZywgJycpO1xyXG4gICAgICBwb3N0cyA9IE51bWJlcihwb3N0cyk7XHJcblxyXG4gICAgICBpZih0aGVtZSA9PSBudWxsKXtcclxuICAgICAgICByZXR1cm4gWzAsIHBvc3RzXTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIFt0aGVtZS5wb3N0c1swXSwgcG9zdHNdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFBhZ2VzKCl7XHJcbiAgICAgIHZhciBwYWdlO1xyXG5cclxuICAgICAgcGFnZSA9IFtcclxuICAgICAgICBwYXJzZUludCh0aGVtZS5wb3N0c1swXSAvIDIwLCAxMCksXHJcbiAgICAgICAgcGFyc2VJbnQodGhlbWUucG9zdHNbMV0gLyAyMCwgMTApXHJcbiAgICAgIF07XHJcblxyXG4gICAgICByZXR1cm4gcGFnZTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0RGF0ZSgpe1xyXG4gICAgICB2YXIgZGF0ZTtcclxuXHJcbiAgICAgIGRhdGUgPSB0ci5wcmV2aW91c1NpYmxpbmcuZGF0YTtcclxuICAgICAgZGF0ZSA9IGRhdGUubWF0Y2goLyhcXGQrKS9nKTtcclxuICAgICAgZGF0ZSA9IGAke2RhdGVbMV19LyR7ZGF0ZVsyXX0vJHtkYXRlWzBdfSAke2RhdGVbM119OiR7ZGF0ZVs0XX06JHtkYXRlWzVdfX1gO1xyXG4gICAgICBkYXRlID0gRGF0ZS5wYXJzZShkYXRlKTtcclxuXHJcbiAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRBdXRob3IoKXtcclxuICAgICAgdmFyIGEsIG5hbWUsIGlkO1xyXG5cclxuICAgICAgYSA9ICQodGRbM10pLmZpbmQoJ2FbaHJlZio9XCJpbmZvLnBocFwiXScpO1xyXG4gICAgICBuYW1lID0gYS50ZXh0KCk7XHJcbiAgICAgIGlkID0gYS5ub2RlKCkuaHJlZi5tYXRjaCgvKFxcZCspLylbMF07XHJcblxyXG4gICAgICByZXR1cm4gW051bWJlcihpZCksIG5hbWVdO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBjYWxjTmV3VGhlbWVzKCl7XHJcbiAgICB2YXIgdGhlbWVzO1xyXG5cclxuICAgIHRoZW1lcyA9ICRjZC5mLnRoZW1lcztcclxuICAgICRjZC5mLnRocmVhZHMubmV3ID0gJGNkLmYudGhyZWFkcy5hbGw7XHJcblxyXG4gICAgT2JqZWN0LmtleXModGhlbWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHRpZCl7XHJcbiAgICAgIGlmKHRoZW1lc1t0aWRdLnBvc3RzWzBdID09IHRoZW1lc1t0aWRdLnBvc3RzWzFdKXtcclxuICAgICAgICAkY2QuZi50aHJlYWRzLm5ldy0tO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHByZXBhcmVQYXJzZVRoZW1lcyhtYXgpe1xyXG4gIHZhciB0aGVtZXMsIHRpZCwgbGlzdCwgY291bnQ7XHJcblxyXG4gIHRoZW1lcyA9ICRjZC5mLnRoZW1lcztcclxuICBsaXN0ID0gW107XHJcbiAgY291bnQgPSAwO1xyXG5cclxuICBmb3IodGlkIGluIHRoZW1lcyl7XHJcbiAgICBpZih0aGVtZXNbdGlkXS5wb3N0c1swXSAhPSB0aGVtZXNbdGlkXS5wb3N0c1sxXSl7XHJcbiAgICAgIGxpc3QucHVzaCh0aWQpO1xyXG4gICAgICBjb3VudCArPSBjYWxjdWxhdGVUaGVtZVBhZ2VzKE51bWJlcih0aWQpKS5jb3VudDtcclxuICAgICAgaWYobGlzdC5sZW5ndGggPT0gbWF4KSBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgY291bnQgPSBsaXN0Lmxlbmd0aCAqIDc1MCArIGNvdW50ICogMTI1MCArIDUwMDtcclxuICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKGNvdW50KTtcclxuICBwYXJzZVRoZW1lcygwLCBsaXN0Lmxlbmd0aCwgbGlzdCk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGNhbGN1bGF0ZVRoZW1lUGFnZXMoaWQpe1xyXG4gIHZhciB0aGVtZSwgcGFnZXMsIHNQYWdlLCBzdGFydDtcclxuXHJcbiAgdGhlbWUgPSAkY2QuZi50aGVtZXNbaWRdO1xyXG5cclxuICBwYWdlcyA9IHRoZW1lLnBvc3RzWzFdIC8gMjA7XHJcbiAgcGFnZXMgPSBwYWdlcyA8IDEgPyAwIDogcGFyc2VJbnQocGFnZXMsIDEwKTtcclxuXHJcbiAgc1BhZ2UgPSB0aGVtZS5wb3N0c1swXSAvIDIwO1xyXG4gIHNQYWdlID0gc1BhZ2UgPCAxID8gMCA6IHBhcnNlSW50KHNQYWdlLCAxMCk7XHJcblxyXG4gIHN0YXJ0ID0gKHRoZW1lLnBvc3RzWzBdICUgMjApICsgMTtcclxuXHJcbiAgcmV0dXJuIHtpZDogc1BhZ2UgLCBjb3VudDogcGFnZXMgKyAxLCBzdGFydDogc3RhcnR9O1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwYXJzZVRoZW1lcyhpbmRleCwgbWF4LCBsaXN0KXtcclxuICB2YXIgaW5mbywgdGhlbWU7XHJcblxyXG4gICRjZC50aWQgPSBOdW1iZXIobGlzdFtpbmRleF0pO1xyXG4gIHRoZW1lID0gJGNkLmYudGhlbWVzWyRjZC50aWRdO1xyXG5cclxuICBpZihpbmRleCA8IG1heCl7XHJcbiAgICBpbmZvID0gY2FsY3VsYXRlVGhlbWVQYWdlcygkY2QudGlkKTtcclxuICAgIHBhcnNlVGhlbWUoaW5mby5pZCwgaW5mby5jb3VudCwgaW5mby5zdGFydCk7XHJcbiAgfWVsc2V7XHJcbiAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgIHJlbmRlclRhYmxlcygpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gcGFyc2VUaGVtZShpZCwgY291bnQsIHN0YXJ0KXtcclxuICAgIHZhciB1cmw7XHJcblxyXG4gICAgJGNkLnRQYWdlID0gaWQ7XHJcbiAgICB1cmwgPSAnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvbWVzc2FnZXMucGhwP2ZpZD0nICsgJGNkLmZpZCArICcmdGlkPScrICRjZC50aWQgKycmcGFnZV9pZD0nICsgJGNkLnRQYWdlO1xyXG5cclxuICAgIGlmKGlkIDwgY291bnQpe1xyXG4gICAgICB0cnl7XHJcbiAgICAgICAgUkVRKHVybCwgJ0dFVCcsIG51bGwsIHRydWUsXHJcbiAgICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICBwYXJzZSgpO1xyXG4gICAgICAgICAgICBjb3JyZWN0aW9uVGltZSgpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgICBlcnJvckxvZygn0KHQsdC+0YAg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YHQvtC+0LHRidC10L3QuNGP0YUnLCAwLCAwKTtcclxuICAgICAgICAgICAgbmV4dFBhZ2VUaGVtZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgICAgZXJyb3JMb2coJ9GB0LHQvtGA0LUg0LjQvdGE0L7RgNC80LDRhtC40Lgg0L4g0YHQvtC+0LHRidC10L3QuNGP0YUnLCAxLCBlKTtcclxuICAgICAgICBuZXh0UGFnZVRoZW1lKCk7XHJcbiAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICBuZXh0VGhlbWUoKTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlKCl7XHJcbiAgICAgIHZhciB0YWJsZSwgdHIsIHBpZCwgcGxheWVyLCBwZiwgdztcclxuICAgICAgdmFyIGksIGxlbmd0aDtcclxuXHJcbiAgICAgIHRhYmxlID0gJCgkYW5zd2VyKS5maW5kKCd0ZFtzdHlsZT1cImNvbG9yOiAjOTkwMDAwXCJdOmNvbnRhaW5zKFwi0JDQstGC0L7RgFwiKScpLnVwKCd0YWJsZScpLm5vZGUoKTtcclxuXHJcbiAgICAgICQodGFibGUpLmZpbmQoJ2ZvbnQ6Y29udGFpbnMoXCJ+0KLQtdC80LAg0LfQsNC60YDRi9GC0LBcIiknKS5ub2RlQXJyKCkuZm9yRWFjaChcclxuICAgICAgICBmdW5jdGlvbihub2RlKXtcclxuICAgICAgICAgIG5vZGUgPSAkKG5vZGUpLnVwKCd0cicpLm5vZGUoKTtcclxuICAgICAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICAgIHRyID0gdGFibGUucm93cztcclxuICAgICAgbGVuZ3RoID0gdHIubGVuZ3RoO1xyXG5cclxuICAgICAgZm9yKGkgPSBzdGFydDsgaSA8IGxlbmd0aDsgaSsrKXtcclxuICAgICAgICBwaWQgPSBnZXRJZCgpO1xyXG5cclxuICAgICAgICBpZigkc2QucGxheWVyc1twaWRdID09IG51bGwpe1xyXG4gICAgICAgICAgJHNkLnBsYXllcnNbcGlkXSA9IGdlbmVyYXRlUGxheWVyKGdldE5hbWUoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBsYXllciA9ICRzZC5wbGF5ZXJzW3BpZF07XHJcblxyXG4gICAgICAgIGlmKHBsYXllci5mb3J1bXNbJGNkLmZpZF0gPT0gbnVsbCl7XHJcbiAgICAgICAgICBwbGF5ZXIuZm9ydW1zWyRjZC5maWRdID0gZ2VuZXJhdGVGb3J1bVBsYXllcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwZiA9IHBsYXllci5mb3J1bXNbJGNkLmZpZF07XHJcblxyXG4gICAgICAgIHRoZW1lLnBvc3RzWzBdKys7XHJcbiAgICAgICAgJGNkLmYucG9zdHMrKztcclxuXHJcbiAgICAgICAgcGYucG9zdHMrKztcclxuICAgICAgICBwZi5sYXN0ID0gZ2V0TGFzdERhdGUoKTtcclxuXHJcbiAgICAgICAgdyA9IGdldFdvcmRzKCk7XHJcbiAgICAgICAgJGNkLmYud29yZHMgKz0gdztcclxuICAgICAgICBwZi53b3Jkc1swXSArPSB3O1xyXG4gICAgICAgIHBmLndvcmRzWzFdID0gcGFyc2VJbnQocGYud29yZHNbMF0gLyBwZi5wb3N0cywgMTApO1xyXG5cclxuICAgICAgICBpZighcGYudGhlbWVzLmdrRXhpc3QoJGNkLnRpZCkpe1xyXG4gICAgICAgICAgcGYudGhlbWVzLnB1c2goJGNkLnRpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBuZXh0UGFnZVRoZW1lKCk7XHJcbiAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICBmdW5jdGlvbiBnZXRJZCgpe1xyXG4gICAgICAgIHZhciBpZDtcclxuXHJcbiAgICAgICAgaWQgPSAkKHRyW2ldLmNlbGxzWzBdKS5maW5kKCdhW2hyZWYqPVwiaW5mby5waHBcIl0nKS5ub2RlKCk7XHJcbiAgICAgICAgaWQgPSBpZC5ocmVmLm1hdGNoKC8oXFxkKykvKVsxXTtcclxuICAgICAgICBpZCA9IE51bWJlcihpZCk7XHJcblxyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgICAgfVxyXG4gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0TmFtZSgpe1xyXG4gICAgICAgIHJldHVybiAkKHRyW2ldLmNlbGxzWzBdKS5maW5kKCdhW2hyZWYqPVwiaW5mby5waHBcIl0nKS50ZXh0KCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldExhc3REYXRlKCl7XHJcbiAgICAgICAgdmFyIGRhdGU7XHJcblxyXG4gICAgICAgIGRhdGUgPSAkKHRyW2ldLmNlbGxzWzFdKS5maW5kKCd0ZFthbGlnbj1cImxlZnRcIl06Y29udGFpbnMoXCJ+0L3QsNC/0LjRgdCw0L3QvlwiKScpLnRleHQoKTtcclxuXHJcbiAgICAgICAgZGF0ZSA9IGRhdGUubWF0Y2goLyguKyk6IChcXGQrKS0oXFxkKyktKFxcZCspICguKynCoC8pO1xyXG4gICAgICAgIGRhdGUgPSBgJHtkYXRlWzNdfS8ke2RhdGVbNF19LyR7ZGF0ZVsyXX0gJHtkYXRlWzVdfWA7XHJcbiAgICAgICAgZGF0ZSA9IERhdGUucGFyc2UoZGF0ZSkgLyAxMDAwO1xyXG5cclxuICAgICAgICByZXR1cm4gZGF0ZSA+IHBmLmxhc3QgPyBkYXRlIDogcGYubGFzdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0V29yZHMoKXtcclxuICAgICAgICB2YXIgd29yZHM7XHJcblxyXG4gICAgICAgIHdvcmRzID0gJCh0cltpXS5jZWxsc1sxXSkuZmluZCgndGFibGVbY2VsbHBhZGRpbmc9XCI1XCJdJykudGV4dCgpO1xyXG4gICAgICAgIHdvcmRzID0gKHdvcmRzLnJlcGxhY2UoL1xcc1snXCI7OiwuP8K/XFwtIcKhXS9nLCAnJykubWF0Y2goL1xccysvZykgfHwgW10pLmxlbmd0aCArIDE7XHJcblxyXG4gICAgICAgIHJldHVybiB3b3JkcztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBuZXh0VGhlbWUoKXtcclxuICAgICAgaW5kZXgrKztcclxuICAgICAgJGNkLmYudGhyZWFkcy5uZXctLTtcclxuICAgICAgZGlzcGxheVByb2dyZXNzKCd3b3JrJyk7XHJcbiAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgnZGF0YScpO1xyXG4gICAgICBwYXJzZVRoZW1lcy5na0RlbGF5KDc1MCwgdGhpcywgW2luZGV4LCBtYXgsIGxpc3RdKTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gbmV4dFBhZ2VUaGVtZSgpe1xyXG4gICAgICBpZCsrO1xyXG4gICAgICBkaXNwbGF5UHJvZ3Jlc3MuZ2tEZWxheSg3NTAsIHRoaXMsIFsnZXh0cmEnLCBgPGJyPjxiPtCi0LXQvNCwOjwvYj4gPGk+JHskY2QuZi50aGVtZXNbJGNkLnRpZF0ubmFtZX08L2k+IFske2lkfS8ke2NvdW50fV1gXSk7XHJcbiAgICAgIHBhcnNlVGhlbWUuZ2tEZWxheSg3NTAsIHRoaXMsIFtpZCwgY291bnQsIDFdKTtcclxuICAgIH1cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwcmVwYXJlUGFyc2VNZW1iZXJzKGNvdW50KXtcclxuICB2YXIgbGVuZ3RoLCBwbGF5ZXIsIGxpc3Q7XHJcblxyXG4gIGxlbmd0aCA9IGNvdW50ICE9IG51bGwgPyBjb3VudCA6ICRjZC5jb3VudE1lbWJlcnM7XHJcbiAgbGlzdCA9IFtdO1xyXG5cclxuICB3aGlsZShsZW5ndGgtLSl7XHJcbiAgICBwbGF5ZXIgPSAkc2QucGxheWVyc1skY2QubWVtYmVyc1tsZW5ndGhdXTtcclxuICAgIGlmKGNvdW50ID09IG51bGwpe1xyXG4gICAgICBsaXN0LnB1c2goJGNkLm1lbWJlcnNbbGVuZ3RoXSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgaWYocGxheWVyLnN0YXR1cy50ZXh0ID09ICcnKXtcclxuICAgICAgICBsaXN0LnB1c2goJGNkLm1lbWJlcnNbbGVuZ3RoXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgY291bnQgPSBsaXN0Lmxlbmd0aCAqIDc1MCArIDUwMDtcclxuICBkaXNwbGF5UHJvZ3Jlc3NUaW1lKGNvdW50KTtcclxuXHJcbiAgcGFyc2VNZW1iZXJzKDAsIGxpc3QubGVuZ3RoLCBsaXN0KTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gcGFyc2VNZW1iZXJzKGlkLCBjb3VudCwgbGlzdCl7XHJcbiAgdmFyIHVybCwgcGxheWVyO1xyXG5cclxuICBpZihpZCA8IGNvdW50KXtcclxuICAgIHBsYXllciA9ICRzZC5wbGF5ZXJzW2xpc3RbaWRdXTtcclxuICAgIHVybCA9IGBodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9pbmZvLnBocD9pZD0ke2xpc3RbaWRdfWA7XHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSh1cmwsICdHRVQnLCBudWxsLCB0cnVlLFxyXG4gICAgICAgIGZ1bmN0aW9uIChyZXEpe1xyXG4gICAgICAgICAgJGFuc3dlci5pbm5lckhUTUwgPSByZXEucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgcGFyc2UoKTtcclxuICAgICAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgnZGF0YScpO1xyXG4gICAgICAgICAgY29ycmVjdGlvblRpbWUoKTtcclxuICAgICAgICAgIG5leHRNZW1iZXIoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgZXJyb3JMb2coJ9Ch0LHQvtGAINGB0YLQsNGC0YPRgdCwINC/0LXRgNGB0L7QvdCw0LbQsCcsIDAsIDApO1xyXG4gICAgICAgICAgbmV4dE1lbWJlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgIGVycm9yTG9nKCfRgdCx0L7RgNC1INGB0YLQsNGC0YPRgdCwINC/0LXRgNGB0L7QvdCw0LbQsCcsIDEsIGUpO1xyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgcmVuZGVyU3RhdHNUYWJsZSgpO1xyXG4gICAgZGlzcGxheVByb2dyZXNzKCdkb25lJyk7XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIG5leHRNZW1iZXIoKXtcclxuICAgIGlkKys7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MuZ2tEZWxheSg3NTAsIHRoaXMsIFsnd29yayddKTtcclxuICAgIHBhcnNlTWVtYmVycy5na0RlbGF5KDc1MCwgdGhpcywgW2lkLCBjb3VudCwgbGlzdF0pO1xyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZSgpe1xyXG4gICAgdmFyIGJsb2NrLCBhcnJlc3QsIGJhbkRlZmF1bHQsIGJhbkNvbW1vbiwgYmFuVHJhZGUsIHN0YXR1cywgZGF0ZTtcclxuXHJcbiAgICBzdGF0dXMgPSAnT2snO1xyXG4gICAgZGF0ZSA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCwgMTApO1xyXG5cclxuICAgIGJsb2NrID0gJCgkYW5zd2VyKS5maW5kKCdmb250W2NvbG9yPVwicmVkXCJdOmNvbnRhaW5zKFwi0J/QtdGA0YHQvtC90LDQtiDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L1cIiknKTtcclxuICAgIGFycmVzdCA9ICQoJGFuc3dlcikuZmluZCgnY2VudGVyOmNvbnRhaW5zKFwi0J/QtdGA0YHQvtC90LDQtiDQsNGA0LXRgdGC0L7QstCw0L0sINC40L3RhNC+0YDQvNCw0YbQuNGPINGB0LrRgNGL0YLQsFwiKScpLmZpbmQoJ2ZvbnRbY29sb3I9XCIjMDAwMDk5XCJdJyk7XHJcbiAgICBiYW5EZWZhdWx0ID0gJCgkYW5zd2VyKS5maW5kKCdmb250W2NvbG9yPVwicmVkXCJdOmNvbnRhaW5zKFwiftCy0YDQtdC80LXQvdC90L4g0LfQsNCx0LDQvdC10L0g0LIg0YTQvtGA0YPQvNC1INC80L7QtNC10YDQsNGC0L7RgNC+0LxcIiknKTtcclxuICAgIGJhbkNvbW1vbiA9ICQoJGFuc3dlcikuZmluZCgnY2VudGVyOmNvbnRhaW5zKFwiftCf0LXRgNGB0L7QvdCw0LYg0L/QvtC0INC+0LHRidC40Lwg0LHQsNC90L7QvFwiKScpLmZpbmQoJ2ZvbnRbY29sb3I9XCIjMDA5OTAwXCJdJyk7XHJcbiAgICBiYW5UcmFkZSA9ICQoJGFuc3dlcikuZmluZCgnZm9udFtjb2xvcj1cInJlZFwiXTpjb250YWlucyhcIn7Qt9Cw0LHQsNC90LXQvSDQsiDRgtC+0YDQs9C+0LLRi9GFINGE0L7RgNGD0LzQsNGFXCIpJyk7XHJcblxyXG4gICAgaWYoYmFuVHJhZGUubGVuZ3RoKXtcclxuICAgICAgZGF0ZSA9IGdldERhdGUoYmFuVHJhZGUudGV4dCgpKTtcclxuICAgICAgc3RhdHVzID0gJ9Ci0L7RgNCz0L7QstGL0LknO1xyXG4gICAgfVxyXG4gICAgaWYoYXJyZXN0Lmxlbmd0aCl7XHJcbiAgICAgIGRhdGUgPSAwO1xyXG4gICAgICBzdGF0dXMgPSAn0JDRgNC10YHRgtC+0LLQsNC9JztcclxuICAgIH1cclxuICAgIGlmKGJhbkRlZmF1bHQubGVuZ3RoKXtcclxuICAgICAgZGF0ZSA9IGdldERhdGUoYmFuRGVmYXVsdC50ZXh0KCkpO1xyXG4gICAgICBzdGF0dXMgPSAn0KTQvtGA0YPQvNC90YvQuSc7XHJcbiAgICB9XHJcbiAgICBpZihiYW5Db21tb24ubGVuZ3RoKXtcclxuICAgICAgZGF0ZSA9IGdldERhdGUoYmFuQ29tbW9uLnRleHQoKSk7XHJcbiAgICAgIHN0YXR1cyA9ICfQntCx0YnQuNC5INCx0LDQvSc7XHJcbiAgICB9XHJcbiAgICBpZihibG9jay5sZW5ndGgpe1xyXG4gICAgICBkYXRlID0gMDtcclxuICAgICAgc3RhdHVzID0gJ9CX0LDQsdC70L7QutC40YDQvtCy0LDQvSc7XHJcbiAgICB9XHJcblxyXG4gICAgcGxheWVyLnN0YXR1cy50ZXh0ID0gc3RhdHVzO1xyXG4gICAgcGxheWVyLnN0YXR1cy5kYXRlID0gZGF0ZTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0RGF0ZShzdHJpbmcpe1xyXG4gICAgdmFyIGRhdGU7XHJcblxyXG4gICAgZGF0ZSA9IHN0cmluZy5tYXRjaCgvKFxcZCspL2cpO1xyXG4gICAgZGF0ZSA9IGAke2RhdGVbM119LyR7ZGF0ZVsyXX0vMjAke2RhdGVbNF19ICR7ZGF0ZVswXX06JHtkYXRlWzFdfWA7XHJcbiAgICBkYXRlID0gRGF0ZS5wYXJzZShkYXRlKSAvIDEwMDA7XHJcblxyXG4gICAgcmV0dXJuIGRhdGU7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBwcmVwYXJlU2VuZE1haWxzKCl7XHJcbiAgdmFyIHBhcmFtLCB3aW5kb3csIGNvdW50LCBtb2RlLCB0bSwgc2lkO1xyXG4gIHZhciBxdWV1ZSwgZiwgaW52aXRlcyA9IHt9O1xyXG5cclxuICBwYXJhbSA9IHtcclxuICAgIGxpc3Q6IFtdLFxyXG4gICAgYXdheUxpc3Q6IHt9LFxyXG4gICAgbG9wYXRhOiAnJyxcclxuICAgIG91dDogMCxcclxuICAgIHN1YmplY3Q6ICcnLFxyXG4gICAgbWVzc2FnZTogJycsXHJcbiAgICBzaWQ6IDAsXHJcbiAgICBtb2RlOiAnJ1xyXG4gIH07XHJcblxyXG4gIHRtID0ge1xyXG4gICAgbWFpbDogXCLQntGC0L/RgNCw0LLQutCwINC/0L7Rh9GC0YtcIixcclxuICAgIGludml0ZTogXCLQntGC0L/RgNCw0LLQutCwINC/0L7Rh9GC0Ysg0Lgg0L/RgNC40LPQu9Cw0YjQtdC90LjQuVwiLFxyXG4gICAgZ29Bd2F5OiBcItCe0YLQv9GA0LDQstC60LAg0L/QvtGH0YLRiyDQuCDQuNC30LPQvdCw0L3QuNC1XCJcclxuICB9O1xyXG5cclxuICBxdWV1ZSA9IFtcImdldExvcGF0YVwiLCBcInN0b3BcIl07XHJcbiAgZiA9IHtcclxuICAgIGdldEludml0ZXNJZDogZnVuY3Rpb24oKXtnZXRJbnZpdGVzSWQoKX0sXHJcbiAgICBnZXRHb0F3YXlJZDogZnVuY3Rpb24oKXtnZXRHb0F3YXlJZCgpfSxcclxuICAgIGdldExvcGF0YTogZnVuY3Rpb24oKXtnZXRMb3BhdGEoKX0sXHJcbiAgICBzdG9wOiBmdW5jdGlvbigpe3N0b3AoKX1cclxuICB9O1xyXG5cclxuXHJcbiAgd2luZG93ID0gJChcIiNzZl9tZXNzYWdlV2luZG93XCIpLm5vZGUoKTtcclxuICBwYXJhbS5zdWJqZWN0ID0gZW5jb2RlVVJJQ29tcG9uZW50KCQod2luZG93KS5maW5kKCdpbnB1dFt0eXBlPVwidGV4dFwiXVtuYW1lPVwic3ViamVjdFwiXScpLm5vZGUoKS52YWx1ZSk7XHJcbiAgcGFyYW0ubWVzc2FnZSA9IGVuY29kZVVSSUNvbXBvbmVudCgkKHdpbmRvdykuZmluZCgndGV4dGFyZWFbbmFtZT1cIm1lc3NhZ2VcIl0nKS5ub2RlKCkudmFsdWUpO1xyXG4gIHBhcmFtLm1vZGUgPSAkKHdpbmRvdykuZmluZCgnc2VsZWN0W25hbWU9XCJ3b3JrTW9kZVwiXScpLmZpbmQoJ29wdGlvbjpjaGVja2VkJykubm9kZSgpLnZhbHVlO1xyXG4gIHNpZCA9ICQod2luZG93KS5maW5kKCdzZWxlY3RbbmFtZT1cInNpZFwiXScpLmZpbmQoJ29wdGlvbjpjaGVja2VkJykubm9kZSgpO1xyXG4gIHBhcmFtLnNpZCA9IE51bWJlcihzaWQudmFsdWUpOyBzaWQgPSBzaWQudGV4dENvbnRlbnQ7XHJcblxyXG4gIGlmKHBhcmFtLm1vZGUgIT0gXCJtYWlsXCIpe1xyXG4gICAgaWYocGFyYW0uc2lkID09IDApe1xyXG4gICAgICBhbGVydChcItCd0LUg0LLRi9Cx0YDQsNC9INGB0LjQvdC00LjQutCw0YIhXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZihwYXJhbS5tb2RlID09IFwiaW52aXRlXCIpIHF1ZXVlLnVuc2hpZnQoXCJnZXRJbnZpdGVzSWRcIik7XHJcbiAgICBpZihwYXJhbS5tb2RlID09IFwiZ29Bd2F5XCIpIHF1ZXVlLnVuc2hpZnQoXCJnZXRHb0F3YXlJZFwiKTtcclxuICB9XHJcblxyXG4gIGlmKHBhcmFtLm1vZGUgPT0gXCJtYWlsXCIpe1xyXG4gICAgaWYoIWNvbmZpcm0oYNCg0LXQttC40Lw6ICR7dG1bcGFyYW0ubW9kZV19XFxuXFxuINCS0YHQtSDQv9GA0LDQstC40LvRjNC90L4/YCkpIHJldHVybjtcclxuICB9ZWxzZXtcclxuICAgIGlmKCFjb25maXJtKGDQoNC10LbQuNC8OiDCoMKgwqDCoMKgwqAke3RtW3BhcmFtLm1vZGVdfVxcbtCh0LjQvdC00LjQutCw0YI6wqDCoCR7c2lkfVxcblxcbiDQktGB0LUg0L/RgNCw0LLQuNC70YzQvdC+P2ApKSByZXR1cm47XHJcbiAgfVxyXG5cclxuICBuZXh0KDApO1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIHN0b3AoKXtcclxuICAgICQod2luZG93KS5maW5kKCdzZWxlY3QnKVxyXG4gICAgICAuZmluZCgnb3B0aW9uW3ZhbHVlXScpXHJcbiAgICAgIC5ub2RlQXJyKClcclxuICAgICAgLmZvckVhY2goZ2V0TGlzdCk7XHJcblxyXG4gICAgY291bnQgPSBwYXJhbS5saXN0Lmxlbmd0aDtcclxuXHJcbiAgICBvcGVuU3RhdHVzV2luZG93KCk7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3N0YXJ0JywgJ9Cg0LDRgdGB0YvQu9C60LAg0YHQvtC+0LHRidC10L3QuNC5INCy0YvQsdGA0LDQvdC90YvQvCDQuNCz0YDQvtC60LDQvCcsIDAsIGNvdW50KTtcclxuICAgIGRpc3BsYXlQcm9ncmVzc1RpbWUoKGNvdW50ICogMzk1MDApICsgNTAwKTtcclxuICAgIGRvQWN0aW9ucygwLCBjb3VudCwgcGFyYW0pO1xyXG4gIH1cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TGlzdChvcHRpb24pe1xyXG4gICAgdmFyIG5hbWUsIGlkO1xyXG5cclxuICAgIGlkID0gb3B0aW9uLnZhbHVlLnNwbGl0KFwifFwiKTtcclxuICAgIG5hbWUgPSBpZFswXTtcclxuICAgIGlkID0gaWRbMV07XHJcblxyXG4gICAgaWYoaW52aXRlc1tuYW1lXSA9PSBudWxsKXtcclxuICAgICAgcGFyYW0ubGlzdC5wdXNoKHtcclxuICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICBlbmNvZGU6IGVuY29kZVVSSUNvbXBvbmVudChuYW1lKVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TG9wYXRhKCl7XHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSgnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc21zLWNyZWF0ZS5waHAnLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgIHBhcmFtLm91dCA9IE51bWJlcigkKCRhbnN3ZXIpLmZpbmQoJ2lucHV0W3R5cGU9XCJoaWRkZW5cIl1bbmFtZT1cIm91dG1haWxcIl0nKS5ub2RlKCkudmFsdWUpO1xyXG4gICAgICAgICAgcGFyYW0ubG9wYXRhID0gJCgkYW5zd2VyKS5maW5kKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdW25hbWU9XCJsb3BhdGFcIl0nKS5ub2RlKCkudmFsdWU7XHJcblxyXG4gICAgICAgICAgbmV4dCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgICBlcnJvckxvZygn0J/QvtC70YPRh9C10L3QuNC4INC70L7Qv9Cw0YLRiycsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaChlKXtcclxuICAgICAgZXJyb3JMb2coJ9C/0L7Qu9GD0YfQtdC90LjQuCDQu9C+0L/QsNGC0YsnLCAxLCBlKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gZ2V0R29Bd2F5SWQgKCl7XHJcbiAgICB0cnl7XHJcbiAgICAgIFJFUSgnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc3luZGljYXRlLmVkaXQucGhwP2tleT11c2VycyZpZD0nICsgcGFyYW0uc2lkLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgIHBhcmFtLmF3YXlMaXN0ID0ge307XHJcblxyXG4gICAgICAgICAgJCgkYW5zd2VyKVxyXG4gICAgICAgICAgICAuZmluZCgnc2VsZWN0W25hbWU9XCJjaWRcIl0nKVxyXG4gICAgICAgICAgICAuZmluZChcIm9wdGlvblwiKVxyXG4gICAgICAgICAgICAubm9kZUFycigpXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKHBhcnNlKTtcclxuXHJcbiAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICAgIGVycm9yTG9nKGDQn9C+0LvRg9GH0LXQvdC40Lgg0YHQv9C40YHQutCwIGlkINC90LAg0LjQt9Cz0L3QsNC90LjQtSDQv9C10YDRgdC+0L3QsNC20LXQuWAsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIH1jYXRjaCAoZSl7XHJcbiAgICAgIGVycm9yTG9nKGDQv9C+0LvRg9GH0LXQvdC40Lgg0YHQv9C40YHQutCwIGlkINC90LAg0LjQt9Cz0L3QsNC90LjQtSDQv9C10YDRgdC+0L3QsNC20LXQuWAsIDEsIGUpO1xyXG4gICAgfVxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICBmdW5jdGlvbiBwYXJzZShvcHRpb24pe1xyXG4gICAgICB2YXIgaWQsIG5hbWU7XHJcblxyXG4gICAgICBpZCA9IE51bWJlcihvcHRpb24udmFsdWUpO1xyXG4gICAgICBuYW1lID0gb3B0aW9uLnRleHRDb250ZW50O1xyXG4gICAgICBuYW1lID0gbmFtZS5tYXRjaCgvKFxcZCspXFwuICguKykgXFwvIFxcJChcXGQrKS8pO1xyXG4gICAgICBuYW1lID0gbmFtZVsyXTtcclxuXHJcbiAgICAgIHBhcmFtLmF3YXlMaXN0W25hbWVdID0gaWQ7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIGdldEludml0ZXNJZCgpe1xyXG4gICAgdHJ5e1xyXG4gICAgICBSRVEoJ2h0dHA6Ly93d3cuZ2FuamF3YXJzLnJ1L3N5bmRpY2F0ZS5lZGl0LnBocD9rZXk9aW52aXRlcyZpZD0nICsgcGFyYW0uc2lkLCAnR0VUJywgbnVsbCwgdHJ1ZSxcclxuICAgICAgICBmdW5jdGlvbiAocmVxKXtcclxuICAgICAgICAgICRhbnN3ZXIuaW5uZXJIVE1MID0gcmVxLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgIHBhcmFtLmF3YXlMaXN0ID0ge307XHJcblxyXG4gICAgICAgICAgJCgkYW5zd2VyKVxyXG4gICAgICAgICAgICAuZmluZCgnYjpjb250YWlucyhcItCf0YDQuNCz0LvQsNGI0LXQvdC90YvQtSDQv9C10YDRgdC+0L3RizpcIiknKVxyXG4gICAgICAgICAgICAudXAoJ3RkJylcclxuICAgICAgICAgICAgLmZpbmQoJ2FbaHJlZio9XCJpbmZvLnBocFwiXScpXHJcbiAgICAgICAgICAgIC5ub2RlQXJyKClcclxuICAgICAgICAgICAgLmZvckVhY2gocGFyc2UpO1xyXG5cclxuICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgICAgZXJyb3JMb2coYNCf0L7Qu9GD0YfQtdC90LjQuCDRgdC/0LjRgdC60LAgaWQg0L3QsCDQuNC30LPQvdCw0L3QuNC1INC/0LXRgNGB0L7QvdCw0LbQtdC5YCwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfWNhdGNoIChlKXtcclxuICAgICAgZXJyb3JMb2coYNC/0L7Qu9GD0YfQtdC90LjQuCDRgdC/0LjRgdC60LAgaWQg0L3QsCDQuNC30LPQvdCw0L3QuNC1INC/0LXRgNGB0L7QvdCw0LbQtdC5YCwgMSwgZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2Uobm9kZSl7XHJcbiAgICAgIGludml0ZXNbbm9kZS50ZXh0Q29udGVudF0gPSBub2RlLmhyZWYuc3BsaXQoJz0nKVsxXTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gbmV4dCh0eXBlKXtcclxuICAgIGlmKHR5cGUgIT0gbnVsbCl7XHJcbiAgICAgIGZbcXVldWUuc2hpZnQoKV0oKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZbcXVldWUuc2hpZnQoKV0uZ2tEZWxheSg3NTAsIHRoaXMsIFtdKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGRvQWN0aW9ucyhpbmRleCwgY291bnQsIHBhcmFtKXtcclxuICBpZihpbmRleCA8IGNvdW50KXtcclxuICAgIGlmKHBhcmFtLm1vZGUgPT0gXCJpbnZpdGVcIil7XHJcbiAgICAgIHNlbmRJbnZpdGUoaW5kZXgsIHBhcmFtKTtcclxuICAgIH1cclxuICAgIGlmKHBhcmFtLm1vZGUgPT0gXCJnb0F3YXlcIil7XHJcbiAgICAgIGlmKHBhcmFtLmF3YXlMaXN0W3BhcmFtLmxpc3RbaW5kZXhdLm5hbWVdICE9IG51bGwpIGRvR29Bd2F5KHBhcmFtLnNpZCwgcGFyYW0uYXdheUxpc3RbcGFyYW0ubGlzdFtpbmRleF0ubmFtZV0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbmRNYWlsLmdrRGVsYXkoMTI1MCwgdGhpcywgW2luZGV4LCBwYXJhbV0pO1xyXG5cclxuICAgIHBhcmFtLm91dCsrO1xyXG4gICAgaW5kZXgrKztcclxuXHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ3dvcmsnKTtcclxuICAgIGRvQWN0aW9ucy5na0RlbGF5KHJhbmRvbSgzNjAsIDM4MCkgKiAxMDAsIHRoaXMsIFtpbmRleCwgY291bnQsIHBhcmFtXSk7XHJcbiAgfWVsc2V7XHJcbiAgICBkaXNwbGF5UHJvZ3Jlc3MoJ2RvbmUnKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHNlbmRNYWlsKGluZGV4LCBwYXJhbSl7XHJcbiAgdmFyIGRhdGE7XHJcblxyXG4gIGRhdGEgPSBgcG9zdGZvcm09MSZvdXRtYWlsPSR7cGFyYW0ub3V0fSZsb3BhdGE9JHtwYXJhbS5sb3BhdGF9Jm1haWx0bz0ke3BhcmFtLmxpc3RbaW5kZXhdLmVuY29kZX0mc3ViamVjdD0ke3BhcmFtLnN1YmplY3R9Jm1zZz0ke3BhcmFtLm1lc3NhZ2V9YDtcclxuXHJcbiAgdHJ5e1xyXG4gICAgUkVRKCdodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9zbXMtY3JlYXRlLnBocCcsICdQT1NUJywgZGF0YSwgdHJ1ZSxcclxuICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgY29ycmVjdGlvblRpbWUoKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgZXJyb3JMb2coYNCe0YLQv9GA0LDQstC60LUg0L/QuNGB0YzQvNCwICR7cGFyYW0ubGlzdFtpbmRleF0ubmFtZX1gLCAwLCAwKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9Y2F0Y2ggKGUpe1xyXG4gICAgZXJyb3JMb2coYNC+0YLQv9GA0LDQstC60LUg0L/QuNGB0YzQvNCwICR7cGFyYW0ubGlzdFtpbmRleF0ubmFtZX1gLCAxLCBlKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHNlbmRJbnZpdGUoaW5kZXgsIHBhcmFtKXtcclxuICB2YXIgZGF0YSwgaW52aXRlO1xyXG5cclxuICBkYXRhID0gYGtleT1pbnZpdGVzJmlkPSR7cGFyYW0uc2lkfSZpbnZpdGU9JHtwYXJhbS5saXN0W2luZGV4XS5lbmNvZGV9YDtcclxuICBpbnZpdGUgPSAkbW9kZSA/ICRzZCA6ICR0c2Q7XHJcbiAgaW52aXRlID0gaW52aXRlLnBsYXllcnNbcGFyYW0ubGlzdFtpbmRleF0uaWRdLmZvcnVtc1soXCIxXCIgKyBwYXJhbS5zaWQpXS5pbnZpdGU7XHJcblxyXG4gIHRyeXtcclxuICAgIFJFUSgnaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvc3luZGljYXRlLmVkaXQucGhwJywgJ1BPU1QnLCBkYXRhLCB0cnVlLFxyXG4gICAgICBmdW5jdGlvbiAoKXtcclxuICAgICAgICBjb3JyZWN0aW9uVGltZSgpO1xyXG4gICAgICAgIGludml0ZSA9IDE7ICAgICAgICAvLy8vINCf0LXQtdGA0LXQtNC10LvQsNGC0YxcclxuICAgICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgZXJyb3JMb2coYNCe0YLQv9GA0LDQstC60LUg0L/RgNC40LPQu9Cw0YjQtdC90LjRjyAke3BhcmFtLmxpc3RbaW5kZXhdLm5hbWV9YCwgMCwgMCk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfWNhdGNoIChlKXtcclxuICAgIGVycm9yTG9nKGDQvtGC0L/RgNCw0LLQutC1INC/0YDQuNCz0LvQsNGI0LXQvdC40Y8gJHtwYXJhbS5saXN0W2luZGV4XS5uYW1lfWAsIDEsIGUpO1xyXG4gIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGRvR29Bd2F5KHNpZCwgaWQpe1xyXG4gIHZhciBkYXRhID0gYGlkPSR7c2lkfSZrZXk9dXNlcnMmcmVtb3ZlPSR7aWR9YDtcclxuXHJcbiAgdHJ5e1xyXG4gICAgUkVRKCdodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9zeW5kaWNhdGUuZWRpdC5waHAnLCAnUE9TVCcsIGRhdGEsIHRydWUsXHJcbiAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIGNvcnJlY3Rpb25UaW1lKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uICgpe1xyXG4gICAgICAgIGVycm9yTG9nKGDQmNC30LPQvdCw0L3QvdC40LUgJHtpZH1gLCAwLCAwKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9Y2F0Y2ggKGUpe1xyXG4gICAgZXJyb3JMb2coYNC40LfQs9C90LDQvdC40LggJHtpZH1gLCAxLCBlKTtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGdlbmVyYXRlUGxheWVyKG5hbWUpe1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBuYW1lLFxyXG4gICAgc3RhdHVzOiB7XHJcbiAgICAgIHRleHQ6ICcnLFxyXG4gICAgICBkYXRlOiAwXHJcbiAgICB9LFxyXG4gICAgZm9ydW1zOnt9XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVGb3J1bVBsYXllcigpe1xyXG4gIHJldHVybiB7XHJcbiAgICBzbjogMCxcclxuICAgIGVudGVyOiAwLFxyXG4gICAgZXhpdDogMCxcclxuICAgIGdvQXdheTogMCxcclxuICAgIGludml0ZTogMCxcclxuICAgIG1lbWJlcjogZmFsc2UsXHJcbiAgICBwb3N0czogMCxcclxuICAgIGxhc3Q6IDAsXHJcbiAgICB3b3JkczogWzAsIDBdLFxyXG4gICAgc3RhcnQ6IFtdLFxyXG4gICAgdGhlbWVzOiBbXVxyXG4gIH07XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHJlbmRlckJhc2VIVE1MKCl7XHJcbiAgdmFyIGhlYWRlciwgZm9vdGVyLCBiMSwgYjIsIHdpZHRoO1xyXG5cclxuICAkdC5zdGF0cy5zZXRXaWR0aChbNjUsIDQ1LCAtMSwgNDAsIDc1LCA3NSwgOTUsIDgwLCA3NSwgNzUsIDc1LCA3NSwgMTcyLCA4MCwgODAsIDUwLCA3NSwgOTUsIDQ1XSk7XHJcblxyXG4gICR0LnN0YXRzLnNldFN0cnVjdHVyZShbXHJcbiAgICBbXCJwYXRoc1wiLCBcIiRzZC5wbGF5ZXJzW2lkXVwiLCBcIiRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJGNkLmZpZF1cIiwgXCIkY2hlY2tlZC5wbGF5ZXJzW2lkXVwiLCBcImdldFBlcmNlbnQoJHNkLnBsYXllcnNbaWRdLmZvcnVtc1skY2QuZmlkXVwiXSxcclxuICAgIFtcImlkXCIsIDAsIFwiTnVtYmVyKGlkKVwiLCBcIm51bWJlclwiLCBcIklEXCJdLFxyXG4gICAgW1wic051bWJlclwiLCAyLCBcIi5zblwiLCBcIm51bWJlclwiLCBcItCd0L7QvNC10YAg0LIg0YHQv9C40YHQutC1INGB0LjQvdC00LjQutCw0YLQsFwiXSxcclxuICAgIFtcIm5hbWVcIiwgMSwgXCIubmFtZVwiLCBcImNoZWNrXCIsIFwi0JjQvNGPXCJdLFxyXG4gICAgW1wibWVtYmVyXCIsIDIsIFwiLm1lbWJlclwiLCBcImJvb2xlYW5cIiwgXCLQkiDRgdC+0YHRgtCw0LLQtVwiXSxcclxuICAgIFtcInN0YXR1c1wiLCAxLCBcIi5zdGF0dXNcIiwgXCJtdWx0aXBsZVwiLCBcItCh0YLQsNGC0YPRgVwiXSxcclxuICAgIFtcImVudGVyXCIsIDIsIFwiLmVudGVyXCIsIFwiZGF0ZVwiLCBcItCf0YDQuNC90Y/RglwiXSxcclxuICAgIFtcImV4aXRcIiwgMiwgXCIuZXhpdFwiLCBcImRhdGVcIiwgXCLQn9C+0LrQuNC90YPQu1wiXSxcclxuICAgIFtcImludml0ZVwiLCAyLCBcIi5pbnZpdGVcIiwgXCJkYXRlXCIsIFwi0J/RgNC40LPQu9Cw0YjQtdC9XCJdLFxyXG4gICAgW1wiY2hlY2tlZFwiLCAzLCBcIlwiLCBudWxsLCBudWxsXSxcclxuICAgIFtcInN0YXJ0VGhlbWVzXCIsIDIsIFwiLnN0YXJ0Lmxlbmd0aFwiLCBcIm51bWJlclwiLCBcItCd0LDRh9Cw0YLQviDRgtC10LxcIl0sXHJcbiAgICBbXCJ3cml0ZVRoZW1lc1wiLCAyLCBcIi50aGVtZXMubGVuZ3RoXCIsIFwibnVtYmVyXCIsIFwi0KPRh9Cw0LLRgdGC0LLQvtCy0LDQuyDQsiDRgtC10LzQsNGFXCJdLFxyXG4gICAgW1wibGFzdE1lc3NhZ2VcIiwgMiwgXCIubGFzdFwiLCBcImRhdGVcIiwgXCLQn9C+0YHQu9C10LTQvdC10LUg0YHQvtC+0LHRidC10L3QuNC1XCJdLFxyXG4gICAgW1wicG9zdHNcIiwgMiwgXCIucG9zdHNcIiwgXCJudW1iZXJcIiwgXCLQktGB0LXQs9C+INGB0L7QvtCx0YnQtdC90LjQuVwiXSxcclxuICAgIFtcInBlcmNlbnRTdGFydFRoZW1lc1wiLCA0LCBcIi5zdGFydC5sZW5ndGgsICRjZC5mLnRocmVhZHMuYWxsLCBmYWxzZSk7XCIsIFwibnVtYmVyXCIsIFwi0J/RgNC+0YbQtdC90YIg0L3QsNGH0LDRgtGL0YUg0YLQtdC8XCJdLFxyXG4gICAgW1wicGVyY2VudFdyaXRlVGhlbWVzXCIsIDQsIFwiLnRoZW1lcy5sZW5ndGgsICRjZC5mLnRocmVhZHMuYWxsLCBmYWxzZSk7XCIsIFwibnVtYmVyXCIsIFwi0J/RgNC+0YbQtdC90YIg0YPRh9Cw0YHRgtC40Y8g0LIg0YLQtdC80LDRhVwiXSxcclxuICAgIFtcInBlcmNlbnRQb3N0c1wiLCA0LCBcIi5wb3N0cywgJGNkLmYucG9zdHMsIGZhbHNlKTtcIiwgXCJudW1iZXJcIiwgXCLQn9GA0L7RhtC10L3RgiDRgdC+0L7QsdGJ0LXQvdC40LlcIl0sXHJcbiAgICBbXCJwZXJjZW50V29yZHNcIiwgNCwgXCIud29yZHNbMF0sICRjZC5mLndvcmRzLCBmYWxzZSk7XCIsIFwibnVtYmVyXCIsIFwi0J/RgNC+0YbQtdC90YIg0L3QsNC/0LjRgdCw0L3QvdGL0YUg0YHQu9C+0LJcIl0sXHJcbiAgICBbXCJ3b3Jkc1wiLCAyLCBcIi53b3Jkc1swXVwiLCBcIm51bWJlclwiLCBcItCS0YHQtdCz0L4g0L3QsNC/0LjRgdCw0L3QvdGL0YUg0YHQu9C+0LJcIl0sXHJcbiAgICBbXCJ3b3Jkc0F2ZXJhZ2VcIiwgMiwgXCIud29yZHNbMV1cIiwgXCJudW1iZXJcIiwgXCLQodGA0LXQtNC90LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQvdCw0L/QuNGB0LDQvdC90YvRhSDRgdC70L7QslwiXVxyXG4gIF0pO1xyXG5cclxuICAvLzxkaXYgc3R5bGU9XCJ3aWR0aDogMjRweDsgaGVpZ2h0OiAyNHB4OyBtYXJnaW4tbGVmdDogNXB4OyBmbG9hdDogbGVmdDsgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7JGljby5tZW1iZXJJY299KVwiPjwvZGl2PlxyXG5cclxuICBoZWFkZXIgPVxyXG4gICAgYDx0YWJsZSBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgdHlwZT1cInBhZGRpbmdcIj5cclxuICAgICAgICAgICAgICAgIDx0ciBzdHlsZT1cImhlaWdodDogMzVweDsgZm9udC1zdHlsZTogaXRhbGljO1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIxN1wiPtCU0LDQvdC90YvQtSDQv9C+INGE0L7RgNGD0LzRgyAjJHskY2QuZmlkfTxiPiDCqyR7JGZvcnVtLm5hbWV9wrs8L2I+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHIgdHlwZT1cImhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDApfSBhbGlnbj1cImNlbnRlclwiIHJvd3NwYW49XCIyXCIgc29ydD1cImlkXCIgaGVpZ2h0PVwiNjBcIj4jPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMSl9IGFsaWduPVwiY2VudGVyXCIgcm93c3Bhbj1cIjJcIiBzb3J0PVwic051bWJlclwiPuKEljxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDIpfSBhbGlnbj1cImNlbnRlclwiIHJvd3NwYW49XCIyXCIgc29ydD1cIm5hbWVcIj7QmNC80Y88aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCgzKX0gYWxpZ249XCJjZW50ZXJcIiByb3dzcGFuPVwiMlwiIHNvcnQ9XCJtZW1iZXJcIj48aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBjb2xzcGFuPVwiMlwiPtCi0LXQvNGLPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiBjb2xzcGFuPVwiMlwiPtCf0L7RgdGC0Ys8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCI0XCI+0J/RgNC+0YbQtdC90YI8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDEyKX0gYWxpZ249XCJjZW50ZXJcIiByb3dzcGFuPVwiMlwiIHNvcnQ9XCJzdGF0dXNcIj7QodGC0LDRgtGD0YE8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCgxMyl9IGFsaWduPVwiY2VudGVyXCIgcm93c3Bhbj1cIjJcIiBzb3J0PVwiZW50ZXJcIj7Qn9GA0LjQvdGP0YI8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCgxNCl9IGFsaWduPVwiY2VudGVyXCIgcm93c3Bhbj1cIjJcIiBzb3J0PVwiZXhpdFwiPtCf0L7QutC40L3Rg9C7PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTUpfSBhbGlnbj1cImNlbnRlclwiIHJvd3NwYW49XCIyXCIgc29ydD1cImludml0ZVwiPtCX0LLQsNC7PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjJcIj7QodC70L7QsiDQsiDQv9C+0YHRgtCw0YU8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDE4KX0gYWxpZ249XCJjZW50ZXJcIiByb3dzcGFuPVwiMlwiIHNvcnQ9XCJjaGVja2VkXCIgd2lkdGg9XCI0NVwiPkA8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHIgdHlwZT1cImhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDQpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJzdGFydFRoZW1lc1wiPtCd0LDRh9Cw0YLQvjxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDUpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJ3cml0ZVRoZW1lc1wiPtCj0YfQsNGB0YLQuNGPPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoNil9IGFsaWduPVwiY2VudGVyXCIgc29ydD1cImxhc3RNZXNzYWdlXCI+0J/QvtGB0LvQtdC00L3QuNC5PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoNyl9IGFsaWduPVwiY2VudGVyXCIgc29ydD1cInBvc3RzXCI+0JrQvtC7LdCy0L48aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgJHskdC5zdGF0cy5nZXRXaWR0aCg4KX0gYWxpZ249XCJjZW50ZXJcIiBzb3J0PVwicGVyY2VudFN0YXJ0VGhlbWVzXCI+0J3QsNGHLtGC0LXQvDxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDkpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJwZXJjZW50V3JpdGVUaGVtZXNcIj7Qo9GH0LDRgdGC0LjRjzxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDEwKX0gYWxpZ249XCJjZW50ZXJcIiBzb3J0PVwicGVyY2VudFBvc3RzXCI+0J/QvtGB0YLQvtCyPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTEpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJwZXJjZW50V29yZHNcIj7QodC70L7QsjxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCAkeyR0LnN0YXRzLmdldFdpZHRoKDE2KX0gYWxpZ249XCJjZW50ZXJcIiBzb3J0PVwid29yZHNcIj7QktGB0LXQs9C+PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTcpfSBhbGlnbj1cImNlbnRlclwiIHNvcnQ9XCJ3b3Jkc0F2ZXJhZ2VcIiB0aXRsZT1cItCh0YDQtdC00L3QtdC1INC60L7Qu9C40YfQtdGB0LLRgtC+INGB0LvQvtCyINCyINC+0LTQvdC+0Lwg0YHQvtC+0LHRidC10L3QuNC4XCI+0JIg0YHRgNC10LTQvdC10Lw8aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgIDwvdGFibGU+YDtcclxuXHJcbiAgZm9vdGVyID1cclxuICAgIGA8dGFibGUgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHR5cGU9XCJwYWRkaW5nXCI+XHJcbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZDBlZWQwO1wiIHR5cGU9XCJmaWx0ZXJzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgwKX0gZmlsdGVyPVwiaWRcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDEpfSBmaWx0ZXI9XCJzTnVtYmVyXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgyKX0gZmlsdGVyPVwibmFtZVwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoMyl9IGZpbHRlcj1cIm1lbWJlclwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoNCl9IGZpbHRlcj1cInN0YXJ0VGhlbWVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCg1KX0gZmlsdGVyPVwid3JpdGVUaGVtZXNcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDYpfSBmaWx0ZXI9XCJsYXN0TWVzc2FnZVwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoNyl9IGZpbHRlcj1cInBvc3RzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCg4KX0gZmlsdGVyPVwicGVyY2VudFN0YXJ0VGhlbWVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCg5KX0gZmlsdGVyPVwicGVyY2VudFdyaXRlVGhlbWVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxMCl9IGZpbHRlcj1cInBlcmNlbnRQb3N0c1wiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTEpfSBmaWx0ZXI9XCJwZXJjZW50V29yZHNcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDEyKX0gZmlsdGVyPVwic3RhdHVzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxMyl9IGZpbHRlcj1cImVudGVyXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxNCl9IGZpbHRlcj1cImV4aXRcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnN0YXRzLmdldFdpZHRoKDE1KX0gZmlsdGVyPVwiaW52aXRlXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxNil9IGZpbHRlcj1cIndvcmRzXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC5zdGF0cy5nZXRXaWR0aCgxNyl9IGZpbHRlcj1cIndvcmRzQXZlcmFnZVwiPjxpbWcgc3JjPVwiJHskaWNvLmZpbHRlcn1cIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQuc3RhdHMuZ2V0V2lkdGgoMTgpfSA+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XCJoZWlnaHQ6IDM1cHg7IGJhY2tncm91bmQtY29sb3I6ICNkMGVlZDA7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCIxMlwiIGlkPVwic2ZfY3VycmVudEZpbHRlcnNcIj48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICDQktGB0LXQs9C+INGC0LXQvDogPGI+ICR7JGZvcnVtLnRoZW1lc1sxXX08L2I+LCDQstGB0LXQs9C+INC/0L7RgdGC0L7QsjogPGI+JHskZm9ydW0ucG9zdHN9PC9iPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI1XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgINCf0L7Qt9C40YbQuNC5INCyINGC0LDQsdC70LjRhtC1OiA8YiBpZD1cInNmX1NJX0xpc3RDb3VudFwiPjA8L2I+LCDQvtGC0LzQtdGH0LXQvdC+OiA8YiBpZD1cInNmX1NJX0xpc3RDaGVja2VkXCI+MDwvYj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgPHNwYW4gaWQ9XCJzZl9iQ2hlY2tBbGxNZW1iZXJzXCI+W9C+0YLQvNC10YLQuNGC0Ywg0LLRgdGRXTwvc3Bhbj5gO1xyXG5cclxuICAkKCcjc2ZfaGVhZGVyX1NJJykuaHRtbChoZWFkZXIpO1xyXG4gICQoJyNzZl9mb290ZXJfU0knKS5odG1sKGZvb3Rlcik7XHJcblxyXG4gICR0LnN0YXRzLnNldENvbnRyb2woJGljbyk7XHJcblxyXG4gIGIxID0gJCgnI3NmX2JDaGVja0FsbE1lbWJlcnMnKS5ub2RlKCk7XHJcbiAgYmluZEV2ZW50KGIxLCAnb25jbGljaycsIGZ1bmN0aW9uKCl7Y2hlY2tBbGxNZW1iZXJzKGIxLCAnI3NmX2NvbnRlbnRfU0knKX0pO1xyXG5cclxuICAvL2hlYWRlciA9XHJcbiAgLy8gICAgYDx0YWJsZSBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMCVcIiB0eXBlPVwicGFkZGluZ1wiPlxyXG4gIC8vICAgICAgICA8dHIgc3R5bGU9XCJoZWlnaHQ6IDM1cHg7IGZvbnQtc3R5bGU6IGl0YWxpYztcIj5cclxuICAvLyAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIyXCI+0JTQsNC90L3Ri9C1INC/0L4g0L3QsNGH0LDRgtGL0Lwg0LjQs9GA0L7QutC+0Lwg0YLQtdC80LDQvDwvdGQ+XHJcbiAgLy8gICAgICAgIDwvdHI+XHJcbiAgLy8gICAgICAgIDx0ciB0eXBlPVwiaGVhZGVyXCIgaGVpZ2h0PVwiNDhcIj5cclxuICAvLyAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMHB4O1wiPtCY0LzRjyDQuNCz0YDQvtC60LA6PC90ZD5cclxuICAvLyAgICAgICAgICAgIDx0ZCBhbGlnbj1cImxlZnRcIj4ke2NyZWF0ZVNlbGVjdCgpfTwvdGQ+XHJcbiAgLy8gICAgICAgIDwvdHI+XHJcbiAgLy8gICAgICAgIDx0cj5cclxuICAvLyAgICAgICAgICAgIDx0ZCBpZD1cInNmX1NUSVwiIGNvbHNwYW49XCIyXCIgdmFsaWduPVwidG9wXCI+PC90ZD5cclxuICAvLyAgICAgICAgPC90cj5cclxuICAvLyAgICA8L3RhYmxlPmA7XHJcbiAgLy9cclxuICAvLyQoJyNzZl9oZWFkZXJfU1RJJykuaHRtbChoZWFkZXIpO1xyXG5cclxuICAkdC50aGVtZXMuc2V0V2lkdGgoWzcwLCAtMSwgMjUwLCA4MCwgMTAwLCAxMDAsIDQzXSk7XHJcbiAgJHQudGhlbWVzLnNldFN0cnVjdHVyZShbXHJcbiAgICBbXCJwYXRoc1wiLCBcIiRjZC5mLnRoZW1lc1tpZF1cIiwgXCIkY2hlY2tlZC50aGVtZXNbaWRdXCJdLFxyXG4gICAgW1wiaWRcIiwgMCwgXCJOdW1iZXIoaWQpXCIsIFwibnVtYmVyXCIsIFwiSURcIl0sXHJcbiAgICBbXCJuYW1lXCIsIDEsIFwiLm5hbWVcIiwgXCJjaGVja1wiLCBcItCd0LDQt9Cy0LDQvdC40Lgg0YLQtdC80YtcIl0sXHJcbiAgICBbXCJhdXRob3JcIiwgMSwgXCIuYXV0aG9yXCIsIFwiY2hlY2tcIiwgXCLQmNC80LXQvdC4INCw0LLRgtC+0YDQsFwiXSxcclxuICAgIFtcImRhdGVcIiwgMSwgXCIuZGF0ZVwiLCBcImRhdGVcIiwgXCLQlNCw0YLQtSDRgdC+0LfQtNCw0L3QuNGPXCJdLFxyXG4gICAgW1wiY2hlY2tcIiwgMiwgXCJcIiwgbnVsbCwgbnVsbF0sXHJcbiAgICBbXCJwb3N0c0RvbmVcIiwgMSwgXCIucG9zdHNbMF1cIiwgXCJudW1iZXJcIiwgXCLQntCx0YDQsNCx0L7RgtCw0L3QviDRgdC+0L7QsdGJ0LXQvdC40LlcIl0sXHJcbiAgICBbXCJwb3N0c0FsbFwiLCAxLCBcIi5wb3N0c1sxXVwiLCBcIm51bWJlclwiLCBcItCS0YHQtdCz0L4g0YHQvtC+0LHRidC10L3QuNC5XCJdXHJcbiAgXSk7XHJcblxyXG4gIGhlYWRlciA9XHJcbiAgICBgPHRhYmxlIGFsaWduPVwiY2VudGVyXCIgc3R5bGU9XCJ3aWR0aDogMTAwJTtcIiB0eXBlPVwicGFkZGluZ1wiPlxyXG4gICAgICAgICAgICAgICAgPHRyIHN0eWxlPVwiaGVpZ2h0OiAzNXB4OyBmb250LXN0eWxlOiBpdGFsaWM7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgY29sc3Bhbj1cIjdcIj7QlNCw0L3QvdGL0LUg0L/QviDQvtCx0YDQsNCx0L7RgtCw0L3QvdGL0Lwg0YLQtdC80LDQvDwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCgwKX0gc29ydD1cImlkXCIgcm93c3Bhbj1cIjJcIiBzdHlsZT1cImhlaWdodDogNTBweDtcIj4jPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMSl9IHNvcnQ9XCJuYW1lXCIgcm93c3Bhbj1cIjJcIj7QotC10LzQsDxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiICR7JHQudGhlbWVzLmdldFdpZHRoKDIpfSBzb3J0PVwiYXV0aG9yXCIgcm93c3Bhbj1cIjJcIj7QkNCy0YLQvtGAPGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMyl9IHNvcnQ9XCJkYXRlXCIgcm93c3Bhbj1cIjJcIj7QodC+0LfQtNCw0L3QsDxpbWcgLz48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj1cImNlbnRlclwiIGNvbHNwYW49XCIyXCI+0KHQvtC+0LHRidC10L3QuNC5PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCg2KX0gc29ydD1cImNoZWNrXCIgcm93c3Bhbj1cIjJcIj5APGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgPHRyIHR5cGU9XCJoZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCg0KX0gc29ydD1cInBvc3RzRG9uZVwiPtCe0LHRgNCw0LHQvtGC0LDQvdC+PGltZyAvPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoNSl9IHNvcnQ9XCJwb3N0c0FsbFwiPtCS0YHQtdCz0L48aW1nIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgIDwvdGFibGU+YDtcclxuXHJcbiAgZm9vdGVyID1cclxuICAgIGA8dGFibGUgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHR5cGU9XCJwYWRkaW5nXCI+XHJcbiAgICAgICAgICAgICAgICA8dHIgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZDBlZWQwO1wiIHR5cGU9XCJmaWx0ZXJzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMCl9IGZpbHRlcj1cImlkXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMSl9IGZpbHRlcj1cIm5hbWVcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCgyKX0gZmlsdGVyPVwiYXV0aG9yXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoMyl9IGZpbHRlcj1cImRhdGVcIj48aW1nIHNyYz1cIiR7JGljby5maWx0ZXJ9XCI+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249XCJjZW50ZXJcIiAkeyR0LnRoZW1lcy5nZXRXaWR0aCg0KX0gZmlsdGVyPVwicG9zdHNEb25lXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoNSl9IGZpbHRlcj1cInBvc3RzQWxsXCI+PGltZyBzcmM9XCIkeyRpY28uZmlsdGVyfVwiPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPVwiY2VudGVyXCIgJHskdC50aGVtZXMuZ2V0V2lkdGgoNil9ID48L3RkPlxyXG4gICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDx0ciBzdHlsZT1cImhlaWdodDogMzVweDsgYmFja2dyb3VuZC1jb2xvcjogI2QwZWVkMDtcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGQgY29sc3Bhbj1cIjRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT1cImZsb2F0OiByaWdodDsgbWFyZ2luLXJpZ2h0OiA1cHg7IGZvbnQtc2l6ZTogMTBweDsgY3Vyc29yOiBwb2ludGVyO1wiIGlkPVwic2ZfYkNoZWNrQWxsVGhlbWVzXCI+W9C+0YLQvNC10YLQuNGC0Ywg0LLRgdGRXTwvc3Bhbj5gO1xyXG5cclxuICAkKCcjc2ZfaGVhZGVyX1RMJykuaHRtbChoZWFkZXIpO1xyXG4gICQoJyNzZl9mb290ZXJfVEwnKS5odG1sKGZvb3Rlcik7XHJcblxyXG4gICR0LnRoZW1lcy5zZXRDb250cm9sKCRpY28pO1xyXG5cclxuICBiMiA9ICQoJyNzZl9iQ2hlY2tBbGxUaGVtZXMnKS5ub2RlKCk7XHJcbiAgYmluZEV2ZW50KGIyLCAnb25jbGljaycsIGZ1bmN0aW9uKCl7Y2hlY2tBbGxNZW1iZXJzKGIyLCAnI3NmX2NvbnRlbnRfVEwnKX0pO1xyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICBmdW5jdGlvbiBjaGVja0FsbE1lbWJlcnMoYnV0dG9uLCBpZCl7XHJcbiAgICB2YXIgY24gPSAkKCcjc2ZfU0lfTGlzdENoZWNrZWQnKTtcclxuXHJcbiAgICBpZihidXR0b24udGV4dENvbnRlbnQgPT0gXCJb0L7RgtC80LXRgtC40YLRjCDQstGB0ZFdXCIpe1xyXG4gICAgICBidXR0b24udGV4dENvbnRlbnQgPSBcIlvRgdC90Y/RgtGMINCy0YHRkV1cIjtcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9TSVwiKSBjbi5odG1sKCRjZC5zdGF0c0NvdW50KTtcclxuICAgIH1lbHNle1xyXG4gICAgICBidXR0b24udGV4dENvbnRlbnQgPSBcIlvQvtGC0LzQtdGC0LjRgtGMINCy0YHRkV1cIjtcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9TSVwiKSBjbi5odG1sKDApO1xyXG4gICAgfVxyXG5cclxuICAgICQoaWQpXHJcbiAgICAgIC5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKVxyXG4gICAgICAubm9kZUFycigpXHJcbiAgICAgIC5mb3JFYWNoKFxyXG4gICAgICAgIGZ1bmN0aW9uKGJveCl7XHJcbiAgICAgICAgICBpZihidXR0b24udGV4dENvbnRlbnQgIT0gXCJb0L7RgtC80LXRgtC40YLRjCDQstGB0ZFdXCIpe1xyXG4gICAgICAgICAgICBkb1RoaXMoYm94LCBcImxpZ2h0Q2hlY2tlZFwiLCB0cnVlLCAkaWNvLmJveE9uLCB0cnVlKTtcclxuICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBkb1RoaXMoYm94LCBcImxpZ2h0XCIsIGZhbHNlLCAkaWNvLmJveE9mZiwgZmFsc2UpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgKTtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gZG9UaGlzKGJveCwgdHlwZSwgYywgaW1nLCBjaGVjayl7XHJcbiAgICAgICQoYm94KS51cCgndHInKS5ub2RlKCkuc2V0QXR0cmlidXRlKFwidHlwZVwiLCB0eXBlKTtcclxuICAgICAgYm94LmNoZWNrZWQgPSBjO1xyXG4gICAgICBib3gubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLmJhY2tncm91bmQgPSBgdXJsKFwiJHtpbWd9XCIpYDtcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9TSVwiKSAkY2hlY2tlZC5wbGF5ZXJzW2JveC52YWx1ZV0gPSBjaGVjaztcclxuICAgICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9UTFwiKSAkY2hlY2tlZC50aGVtZXNbYm94LnZhbHVlXSA9IGNoZWNrO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyU3RhdHNUYWJsZShzb3J0ZWQpe1xyXG4gIHZhciB0YWJsZSA9ICR0LnN0YXRzO1xyXG5cclxuICBpZighc29ydGVkKSB7XHJcbiAgICB0YWJsZS5jbGVhckNvbnRlbnQoKTtcclxuICAgIHByZXBhcmVSZW5kZXJzKFwicGxheWVyc1wiLCB0YWJsZSk7XHJcbiAgICB0YWJsZS5zb3J0aW5nKCk7XHJcbiAgfVxyXG5cclxuICAkY2Quc3RhdHNDb3VudCA9IDA7XHJcbiAgc2hvd1N0YXRzKHRhYmxlKTtcclxuICBiaW5kQ2hlY2tpbmdPblJvd3MoJyNzZl9jb250ZW50X1NJJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlclRoZW1lc1RhYmxlKHNvcnRlZCl7XHJcbiAgdmFyIHRhYmxlID0gJHQudGhlbWVzO1xyXG5cclxuICBpZighc29ydGVkKXtcclxuICAgIHRhYmxlLmNsZWFyQ29udGVudCgpO1xyXG4gICAgcHJlcGFyZVJlbmRlcnMoXCJ0aGVtZXNcIiwgdGFibGUpO1xyXG4gICAgdGFibGUuc29ydGluZygpO1xyXG4gIH1cclxuXHJcbiAgJGNkLnRoZW1lc0NvdW50ID0gMDtcclxuICBzaG93VGhlbWVMaXN0KHRhYmxlKTtcclxuICBiaW5kQ2hlY2tpbmdPblJvd3MoJyNzZl9jb250ZW50X1RMJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlclRhYmxlcygpe1xyXG4gIHJlbmRlclN0YXRzVGFibGUoKTtcclxuICByZW5kZXJUaGVtZXNUYWJsZSgpO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBkb0ZpbHRlcih0ZCwgdE5hbWUsIHR5cGUsIG5hbWUpe1xyXG4gIGNvbnNvbGUubG9nKHRkKTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gcHJlcGFyZVJlbmRlcnModmFsdWUsIHRhYmxlKXtcclxuICB2YXIgbSA9IFtdLCBmID0gW10sIGFkZGVkO1xyXG5cclxuICBpZih2YWx1ZSA9PSBcInBsYXllcnNcIil7XHJcbiAgICBPYmplY3Qua2V5cygkc2RbdmFsdWVdKS5mb3JFYWNoKHByb2Nlc3NpbmcpO1xyXG4gICAgLy9PYmplY3Qua2V5cygkc3Muc2hvdy5zdGF0cykuZm9yRWFjaChwcmVwYXJlRmlsdGVycyk7XHJcbiAgfWVsc2V7XHJcbiAgICBPYmplY3Qua2V5cygkc2QuZm9ydW1zWyRjZC5maWRdLnRoZW1lcykuZm9yRWFjaChwcm9jZXNzaW5nKTtcclxuICB9XHJcblxyXG4gIGlmKGFkZGVkICYmICRtb2RlKSBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ2RhdGEnKTtcclxuXHJcbiAgcmV0dXJuIHttOiBtLCBmOiBmfTtcclxuXHJcbiAgZnVuY3Rpb24gcHJvY2Vzc2luZyhpZCl7XHJcbiAgICB2YXIgcCwgcGYsIGtpY2tlZCwgaW52aXRlLCBmO1xyXG5cclxuICAgIGlmKCRjaGVja2VkW3ZhbHVlXVtpZF0gPT0gbnVsbCl7XHJcbiAgICAgICRjaGVja2VkW3ZhbHVlXVtpZF0gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZih2YWx1ZSA9PSBcInBsYXllcnNcIil7XHJcbiAgICAgIHAgPSAkc2QucGxheWVyc1tpZF07XHJcbiAgICAgIHBmID0gcC5mb3J1bXNbJGNkLmZpZF07XHJcblxyXG4gICAgICBpZihwZiAhPSBudWxsKXtcclxuICAgICAgICAvL2tpY2tlZCA9ICRtb2RlID8gJHNkLmtpY2tlZFskY2QuZmlkXSA6ICR0c2Qua2lja2VkWyRjZC5maWRdO1xyXG4gICAgICAgIC8vaWYoa2lja2VkICE9IG51bGwgJiYgcGYgIT0gbnVsbCAmJiBraWNrZWRbcC5uYW1lXSAhPSBudWxsKXtcclxuICAgICAgICAvLyAgICBpZihwZi5leGl0IDw9IGtpY2tlZFtwLm5hbWVdKXtcclxuICAgICAgICAvLyAgICAgICAgcGYuZ29Bd2F5ID0gMTtcclxuICAgICAgICAvLyAgICAgICAgcGYuZXhpdCA9IGtpY2tlZFtwLm5hbWVdO1xyXG4gICAgICAgIC8vICAgICAgICBpZigkbW9kZSkgZGVsZXRlIGtpY2tlZFtwLm5hbWVdO1xyXG4gICAgICAgIC8vICAgICAgICBhZGRlZCA9IHRydWU7XHJcbiAgICAgICAgLy8gICAgfVxyXG4gICAgICAgIC8vfVxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy9pbnZpdGUgPSAkbW9kZSA/ICRzZC5pbnZpdGVbJGNkLmZpZF0gOiAkdHNkLmludml0ZVskY2QuZmlkXTtcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vaWYoaW52aXRlICE9IG51bGwgJiYgaW52aXRlW3AubmFtZV0gIT0gbnVsbCl7XHJcbiAgICAgICAgLy8gICAgcGYuaW52aXRlID0gMTtcclxuICAgICAgICAvLyAgICBpZigkbW9kZSkgZGVsZXRlIGludml0ZVtwLm5hbWVdO1xyXG4gICAgICAgIC8vICAgIGFkZGVkID0gdHJ1ZTtcclxuICAgICAgICAvL31cclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vaWYoISRtb2RlICYmICR0c2QucGxheWVyc1tpZF0gJiYgJHRzZC5wbGF5ZXJzW2lkXS5mb3J1bXNbJzE3OTMwJ10pe1xyXG4gICAgICAgIC8vICAgIGYgPSAkdHNkLnBsYXllcnNbaWRdLmZvcnVtc1snMTc5MzAnXTtcclxuICAgICAgICAvLyAgICBwZi5zbiA9IGYuc247XHJcbiAgICAgICAgLy8gICAgcGYuZW50ZXIgPSBmLmVudGVyO1xyXG4gICAgICAgIC8vICAgIHBmLmV4aXQgPSBmLmV4aXQ7XHJcbiAgICAgICAgLy8gICAgcGYuaW52aXRlID0gZi5pbnZpdGU7XHJcbiAgICAgICAgLy8gICAgcGYubWVtYmVyID0gZi5tZW1iZXI7XHJcbiAgICAgICAgLy8gICAgcGYuZ29Bd2F5ID0gZi5nb0F3YXk7XHJcbiAgICAgICAgLy99XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvL20ucHVzaChpZCk7XHJcblxyXG4gICAgICAgIHRhYmxlLnNldENvbnRlbnQoaWQpO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdGFibGUuc2V0Q29udGVudChpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gcHJlcGFyZUZpbHRlcnModmFsdWUpe1xyXG4gICAgaWYoJHNzLnNob3cuc3RhdHNbdmFsdWVdICE9IG51bGwpIGYucHVzaCh2YWx1ZSk7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBkb1NvcnQodGQsIHRhYmxlKXtcclxuICB2YXIgY2VsbCwgbmFtZSA9IHRhYmxlLmdldE5hbWUoKTtcclxuXHJcbiAgdGFibGUuc2V0U29ydCgkaWNvKTtcclxuXHJcbiAgY2VsbCA9IHRkLmdldEF0dHJpYnV0ZShcInNvcnRcIik7XHJcbiAgaWYoY2VsbCA9PSAkc3Muc29ydFtuYW1lXS5jZWxsKXtcclxuICAgICRzcy5zb3J0W25hbWVdLnR5cGUgPSAkc3Muc29ydFtuYW1lXS50eXBlID09IDAgPyAxIDogMDtcclxuICB9ZWxzZXtcclxuICAgICRzcy5zb3J0W25hbWVdLmNlbGwgPSBjZWxsO1xyXG4gICAgJHNzLnNvcnRbbmFtZV0udHlwZSA9IDE7XHJcbiAgfVxyXG5cclxuICB0YWJsZS5jaGFuZ2VTb3J0SW1hZ2UoJGljbyk7XHJcbiAgdGFibGUuc29ydGluZygpO1xyXG5cclxuICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ3NldHRpbmdzJyk7XHJcblxyXG4gIGlmKG5hbWUgPT0gXCJzdGF0c1wiKSByZW5kZXJTdGF0c1RhYmxlKHRydWUpO1xyXG4gIGlmKG5hbWUgPT0gXCJ0aGVtZXNcIikgcmVuZGVyVGhlbWVzVGFibGUodHJ1ZSk7XHJcblxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBiaW5kQ2hlY2tpbmdPblJvd3MoaWQpe1xyXG4gICQoaWQpXHJcbiAgICAuZmluZCgndHInKVxyXG4gICAgLm5vZGVBcnIoKVxyXG4gICAgLmZvckVhY2goXHJcbiAgICAgIGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICBiaW5kRXZlbnQobm9kZSwgJ29uY2xpY2snLGZ1bmN0aW9uKCl7Y2hlY2tlZElkKG5vZGUpfSk7XHJcbiAgICAgIH1cclxuICAgICk7XHJcblxyXG4gIGZ1bmN0aW9uIGNoZWNrZWRJZChub2RlKXtcclxuICAgIGlmKG5vZGUuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSA9PSBcImxpZ2h0XCIpe1xyXG4gICAgICBub2RlLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJsaWdodENoZWNrZWRcIik7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwibGlnaHRcIik7XHJcbiAgICB9XHJcbiAgICBub2RlID0gJChub2RlKS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKS5ub2RlKCk7XHJcbiAgICBub2RlLm5leHRTaWJsaW5nLnN0eWxlLmJhY2tncm91bmQgPSBub2RlLmNoZWNrZWQgPyBgdXJsKFwiJHskaWNvLmJveE9mZn1cIilgIDogYHVybChcIiR7JGljby5ib3hPbn1cIilgO1xyXG4gICAgbm9kZS5jaGVja2VkID0gIW5vZGUuY2hlY2tlZDtcclxuXHJcbiAgICBpZihpZCA9PSBcIiNzZl9jb250ZW50X1NJXCIpe1xyXG4gICAgICAkY2hlY2tlZC5wbGF5ZXJzW25vZGUudmFsdWVdID0gISRjaGVja2VkLnBsYXllcnNbbm9kZS52YWx1ZV07XHJcbiAgICAgIGNoYW5nZUNvdW50KCcjc2ZfU0lfTGlzdENoZWNrZWQnLCBub2RlLmNoZWNrZWQpO1xyXG4gICAgfVxyXG4gICAgaWYoaWQgPT0gXCIjc2ZfY29udGVudF9UTFwiKXtcclxuICAgICAgJGNoZWNrZWQudGhlbWVzW25vZGUudmFsdWVdID0gISRjaGVja2VkLnRoZW1lc1tub2RlLnZhbHVlXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGNoYW5nZUNvdW50KGlkLCBzdGF0ZSl7XHJcbiAgICB2YXIgY291bnQsIGNuO1xyXG5cclxuICAgIGNuID0gJChpZCk7XHJcbiAgICBjb3VudCA9IE51bWJlcihjbi50ZXh0KCkpO1xyXG4gICAgY24uaHRtbChzdGF0ZSA/IGNvdW50ICsgMSA6IGNvdW50IC0gMSk7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBzaG93U3RhdHModGFibGUpe1xyXG4gIHZhciBjb2RlO1xyXG5cclxuICBjb2RlID1cclxuICAgIGA8ZGl2IHN0eWxlPVwibWF4LWhlaWdodDogNDc3cHg7IG92ZXJmbG93LXk6IHNjcm9sbDtcIj5cclxuICAgICAgICAgICAgICAgIDx0YWJsZSBhbGlnbj1cImNlbnRlclwiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgdHlwZT1cInBhZGRpbmdcIj5gO1xyXG5cclxuXHJcbiAgdGFibGUuZ2V0Q29udGVudCgpLmZvckVhY2goZnVuY3Rpb24odHIpe1xyXG4gICAgdmFyIG1lbWJlckljbywgaW52aXRlSWNvLCBsaWdodCwgY2hlY2ssIGJveCwga2lja2VkQ29sb3I7XHJcblxyXG4gICAgaWYgKHRyLmNoZWNrKXtcclxuICAgICAgbGlnaHQgPSBcImxpZ2h0Q2hlY2tlZFwiO1xyXG4gICAgICBjaGVjayA9IFwiY2hlY2tlZFwiO1xyXG4gICAgICBib3ggPSAkaWNvLmJveE9uO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGxpZ2h0ID0gXCJsaWdodFwiO1xyXG4gICAgICBjaGVjayA9IFwiXCI7XHJcbiAgICAgIGJveCA9ICRpY28uYm94T2ZmO1xyXG4gICAgfVxyXG5cclxuICAgIG1lbWJlckljbyA9IHRyLm1lbWJlciA/ICRpY28uaW5UZWFtIDogJGljby5vdXRUZWFtO1xyXG4gICAgaW52aXRlSWNvID0gdHIuaW52aXRlID8gJGljby5pblRlYW0gOiAkaWNvLm91dFRlYW07XHJcbiAgICBraWNrZWRDb2xvciA9IHRyLmdvQXdheSA/ICdzdHlsZT1cImNvbG9yOiBicm93bjsgZm9udC13ZWlnaHQ6IGJvbGQ7XCInIDogXCJcIjtcclxuXHJcbiAgICBjb2RlICs9XHJcbiAgICAgIGA8dHIgaGVpZ2h0PVwiMjhcIiB0eXBlPVwiJHtsaWdodH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDApfSBhbGlnbj1cInJpZ2h0XCI+JHtjb252ZXJ0SUQodHIuaWQpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgxKX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnNOdW1iZXIpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgyKX0gc3R5bGU9XCJ0ZXh0LWluZGVudDogNXB4O1wiPjxhIHN0eWxlPVwidGV4dC1kZWNvcmF0aW9uOiBub25lOyBmb250LXdlaWdodDogYm9sZDtcIiB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cDovL3d3dy5nYW5qYXdhcnMucnUvaW5mby5waHA/aWQ9JHt0ci5pZH1cIj4ke3RyLm5hbWV9PC9hPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgzKX0gYWxpZ249XCJjZW50ZXJcIj48aW1nIHNyYz1cIiR7bWVtYmVySWNvfVwiIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDQpfSBhbGlnbj1cImNlbnRlclwiPiR7aHoodHIuc3RhcnRUaGVtZXMpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg1KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLndyaXRlVGhlbWVzKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoNil9IGFsaWduPVwiY2VudGVyXCI+JHtnZXROb3JtYWxEYXRlKHRyLmxhc3RNZXNzYWdlKS5kfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg3KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBvc3RzKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoOCl9IGFsaWduPVwiY2VudGVyXCI+JHtoeih0ci5wZXJjZW50U3RhcnRUaGVtZXMsIDEpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg5KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBlcmNlbnRXcml0ZVRoZW1lcywgMSl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDEwKX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBlcmNlbnRQb3N0cywgMSl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDExKX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLnBlcmNlbnRXb3JkcywgMSl9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDEyKX0gYWxpZ249XCJjZW50ZXJcIj4ke3N0YXR1c01lbWJlcih0ci5zdGF0dXMpfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgxMyl9IGFsaWduPVwiY2VudGVyXCI+JHtnZXROb3JtYWxEYXRlKHRyLmVudGVyKS5kfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgxNCl9IGFsaWduPVwiY2VudGVyXCIgJHtraWNrZWRDb2xvcn0+JHtnZXROb3JtYWxEYXRlKHRyLmV4aXQpLmR9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDE1KX0gYWxpZ249XCJjZW50ZXJcIj48aW1nIHNyYz1cIiR7aW52aXRlSWNvfVwiIC8+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDE2KX0gYWxpZ249XCJjZW50ZXJcIj4ke2h6KHRyLndvcmRzKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoMTcpfSBhbGlnbj1cImNlbnRlclwiPiR7aHoodHIud29yZHNBdmVyYWdlKX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoMTgsIHRydWUpfT48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgJHtjaGVja30gbmFtZT1cInNmX21lbWJlcnNMaXN0XCIgdmFsdWU9XCIke3RyLmlkfVwiLz48ZGl2IHN0eWxlPVwibWFyZ2luOiBhdXRvOyB3aWR0aDogMTNweDsgaGVpZ2h0OiAxM3B4OyBiYWNrZ3JvdW5kOiB1cmwoJyR7Ym94fScpXCI+PC9kaXY+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICBgO1xyXG5cclxuICAgICRjZC5zdGF0c0NvdW50Kys7XHJcbiAgfSk7XHJcblxyXG4gIGNvZGUgKz0gYDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PmA7XHJcblxyXG4gICQoJyNzZl9jb250ZW50X1NJJykuaHRtbChjb2RlKTtcclxuICAkKCcjc2ZfU0lfTGlzdENvdW50JykuaHRtbCgkY2Quc3RhdHNDb3VudCk7XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gIGZ1bmN0aW9uIGh6KHZhbHVlLCBwKXtcclxuICAgIHJldHVybiB2YWx1ZSA9PSAwID8gXCItXCIgOiBwICE9IG51bGwgPyB2YWx1ZSArICc8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogOXB4O1wiPiAlPC9zcGFuPicgOiB2YWx1ZTtcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgZnVuY3Rpb24gc3RhdHVzTWVtYmVyKHMpe1xyXG4gICAgaWYocy50ZXh0ID09ICcnKVxyXG4gICAgICByZXR1cm4gXCItXCI7XHJcbiAgICBpZihzLnRleHQgPT0gXCJPa1wiKVxyXG4gICAgICByZXR1cm4gYDxkaXYgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlOyBiYWNrZ3JvdW5kOiB1cmwoJyR7JGljby5va30nKSBuby1yZXBlYXQgMzhweCAwOyBsaW5lLWhlaWdodDogMjhweDsgdGV4dC1pbmRlbnQ6IDI1cHg7XCI+WyR7Z2V0Tm9ybWFsRGF0ZShzLmRhdGUpLmR9XTwvZGl2PmA7XHJcbiAgICBpZihzLmRhdGUgIT0gMClcclxuICAgICAgcmV0dXJuICRkYXRlID4gcy5kYXRlID8gXCI/XCIgOiBgPHNwYW4gc3R5bGU9XCIkeyRzdGF0dXNTdHlsZVtzLnRleHRdfVwiPiR7cy50ZXh0fTwvc3Bhbj4gWyR7Z2V0Tm9ybWFsRGF0ZShzLmRhdGUpLmR9XWA7XHJcblxyXG4gICAgcmV0dXJuYDxzcGFuIHN0eWxlPVwiJHskc3RhdHVzU3R5bGVbcy50ZXh0XX1cIj4ke3MudGV4dH08L3NwYW4+YDtcclxuICB9XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIHNob3dUaGVtZUxpc3QodGFibGUpe1xyXG4gIHZhciBjb2RlLCBsaWdodCwgY2hlY2ssIGJveDtcclxuXHJcbiAgY29kZSA9XHJcbiAgICBgPGRpdiBzdHlsZT1cIm1heC1oZWlnaHQ6IDQ5NXB4OyBvdmVyZmxvdy15OiBzY3JvbGw7XCI+XHJcbiAgICAgICAgICAgICAgICA8dGFibGUgYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIndpZHRoOiAxMDAlO1wiIHR5cGU9XCJwYWRkaW5nXCI+YDtcclxuXHJcbiAgdGFibGUuZ2V0Q29udGVudCgpLmZvckVhY2goZnVuY3Rpb24odHIpe1xyXG4gICAgaWYodHIuY2hlY2spe1xyXG4gICAgICBsaWdodCA9IFwibGlnaHRDaGVja2VkXCI7XHJcbiAgICAgIGNoZWNrID0gXCJjaGVja2VkXCI7XHJcbiAgICAgIGJveCA9ICRpY28uYm94T247XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBsaWdodCA9IFwibGlnaHRcIjtcclxuICAgICAgY2hlY2sgPSBcIlwiO1xyXG4gICAgICBib3ggPSAkaWNvLmJveE9mZjtcclxuICAgIH1cclxuXHJcbiAgICBjb2RlICs9XHJcbiAgICAgIGA8dHIgaGVpZ2h0PVwiMjhcIiB0eXBlPVwiJHtsaWdodH1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkICR7dGFibGUuZ2V0V2lkdGgoMCl9IGFsaWduPVwicmlnaHRcIj4ke2NvbnZlcnRJRCh0ci5pZCl9IDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDEpfSBzdHlsZT1cInRleHQtaW5kZW50OiA1cHg7XCI+PGEgc3R5bGU9XCJ0ZXh0LWRlY29yYXRpb246IG5vbmU7IGZvbnQtd2VpZ2h0OiBib2xkO1wiIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9tZXNzYWdlcy5waHA/ZmlkPSR7JGNkLmZpZH0mdGlkPSR7dHIuaWR9XCI+JHt0ci5uYW1lfTwvYT48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgyKX0gc3R5bGU9XCJ0ZXh0LWluZGVudDogNXB4O1wiIHdpZHRoPVwiMjUwXCI+PGEgc3R5bGU9XCJ0ZXh0LWRlY29yYXRpb246IG5vbmU7IGZvbnQtd2VpZ2h0OiBib2xkO1wiIGhyZWY9XCJodHRwOi8vd3d3Lmdhbmphd2Fycy5ydS9pbmZvLnBocD9pZD0ke3RyLmF1dGhvci5pZH1cIj4ke3RyLmF1dGhvci5uYW1lfTwvYT48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCgzKX0gYWxpZ249XCJjZW50ZXJcIj4ke2dldE5vcm1hbERhdGUodHIuZGF0ZSkuZH08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg0KX0gYWxpZ249XCJjZW50ZXJcIj4ke3RyLnBvc3RzRG9uZX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgJHt0YWJsZS5nZXRXaWR0aCg1KX0gYWxpZ249XCJjZW50ZXJcIj4ke3RyLnBvc3RzQWxsfTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCAke3RhYmxlLmdldFdpZHRoKDYsIHRydWUpfSBhbGlnbj1cImNlbnRlclwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAke2NoZWNrfSBuYW1lPVwic2ZfdGhlbWVzTGlzdFwiIHZhbHVlPVwiJHt0ci5pZH1cIiAvPjxkaXYgc3R5bGU9XCJ3aWR0aDogMTNweDsgaGVpZ2h0OiAxM3B4OyBiYWNrZ3JvdW5kOiB1cmwoJyR7Ym94fScpXCI+PC9kaXY+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICA8L3RyPmA7XHJcbiAgfSk7XHJcblxyXG4gIGNvZGUgKz0gYDwvdGFibGU+XHJcbiAgICAgICAgICAgIDwvZGl2PmA7XHJcblxyXG4gICQoJyNzZl9jb250ZW50X1RMJykuaHRtbChjb2RlKTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5mdW5jdGlvbiBnZXRDdXJyZW50RmlsdGVycygpe1xyXG4gIHZhciBsaXN0LCBsLCByZXN1bHQ7XHJcblxyXG4gIGxpc3QgPSBPYmplY3Qua2V5cygkc3Muc2hvdy5zdGF0cykucmV2ZXJzZSgpO1xyXG4gIGwgPSBsaXN0Lmxlbmd0aDtcclxuICByZXN1bHQgPSBbXTtcclxuXHJcbiAgd2hpbGUobC0tKXtcclxuICAgIGlmKCRzcy5zaG93LnN0YXRzW2xpc3RbbF1dICE9IG51bGwpe1xyXG4gICAgICByZXN1bHQucHVzaCgnWycgKyAkY2QudmFsdWVzLnN0YXRzW2xpc3RbbF1dWzBdICsgJ10nKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmVzdWx0ID0gcmVzdWx0Lmxlbmd0aCA/ICc8c3BhbiBzdHlsZT1cImZvbnQtd2VpZ2h0OiBib2xkO1wiPtCQ0LrRgtC40LLQvdGL0LUg0YTQuNC70YzRgtGA0Ys6PC9zcGFuPiAnICsgcmVzdWx0LmpvaW4oJyAnKSA6ICcnO1xyXG5cclxuICAkKCcjc2ZfY3VycmVudEZpbHRlcnMnKS5odG1sKHJlc3VsdCk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmZ1bmN0aW9uIGdldFRpbWVSZXF1ZXN0KHR5cGUpe1xyXG4gIGlmKCF0eXBlKXtcclxuICAgICRjZC50aW1lUmVxdWVzdCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gIH1lbHNle1xyXG4gICAgJGNkLnRpbWVSZXF1ZXN0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSAkY2QudGltZVJlcXVlc3Q7XHJcbiAgfVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5mdW5jdGlvbiBjb3JyZWN0aW9uVGltZSgpe1xyXG4gIHZhciBub2RlLCB0aW1lLCB0O1xyXG5cclxuICB0ID0gJGNkLnRpbWVSZXF1ZXN0O1xyXG4gIG5vZGUgPSAkKCcjc2ZfcHJvZ3Jlc3NUaW1lJyk7XHJcbiAgdGltZSA9IE51bWJlcihub2RlLnRleHQoKSk7XHJcblxyXG4gIGlmKHQgPiA1MDApe1xyXG4gICAgbm9kZS5odG1sKHRpbWUgLSAoNTAwIC0gdCkpO1xyXG4gIH1lbHNlIGlmKHQgPCA1MDApe1xyXG4gICAgbm9kZS5odG1sKHRpbWUgKyAodCAtIDUwMCkpO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZnVuY3Rpb24gZXJyb3JMb2codGV4dCwgZnVsbCwgZSl7XHJcbiAgaWYoZnVsbCl7XHJcbiAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKCRuYW1lU2NyaXB0KTtcclxuICAgIGNvbnNvbGUuZXJyb3IoYNCh0LvRg9GH0LjQu9Cw0YHRjCDQv9GA0Lg6ICR7dGV4dH0uINCe0YjQuNCx0LrQsDogJXMsINGB0YLRgNC+0LrQsDogJWRcImAsIGUubmFtZSwgZS5saW5lTnVtYmVyKTtcclxuICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuICB9ZWxzZXtcclxuICAgIGNvbnNvbGUuZXJyb3IoYNCX0LDQv9GA0L7RgSDQt9Cw0LLQtdGA0YjQuNC70YHRjyDQvdC10YPQtNCw0YfQvdC+LiAke3RleHR9LmApO1xyXG4gIH1cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8g0JDQn9CYINC00LvRjyDRgNCw0LHQvtGC0Ysg0YEgTFNcclxuXHJcbmZ1bmN0aW9uIHNhdmVUb0xvY2FsU3RvcmFnZSh0eXBlKXtcclxuICB2YXIgc3RyaW5nO1xyXG5cclxuICBpZih0eXBlID09ICdkYXRhJyAmJiAkbW9kZSl7XHJcbiAgICBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSgkc2QpO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJna19TRl9kYXRhXCIsIHN0cmluZyk7XHJcbiAgfVxyXG4gIGlmKHR5cGUgPT0gJ3NldHRpbmdzJyl7XHJcbiAgICBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeSgkc3MpO1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJna19TRl9zZXR0aW5nc1wiLCBzdHJpbmcpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZEZyb21Mb2NhbFN0b3JhZ2UodHlwZSl7XHJcbiAgdmFyIHN0cmluZztcclxuXHJcbiAgaWYodHlwZSA9PSAnZGF0YScpe1xyXG4gICAgc3RyaW5nID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJna19TRl9kYXRhXCIpO1xyXG5cclxuICAgIGlmKHN0cmluZyl7XHJcbiAgICAgIGlmKCRtb2RlKSB7XHJcbiAgICAgICAgJHNkID0gSlNPTi5wYXJzZShzdHJpbmcpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAkdHNkID0gSlNPTi5wYXJzZShzdHJpbmcpO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgc2F2ZVRvTG9jYWxTdG9yYWdlKCdkYXRhJyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKHR5cGUgPT0gJ3NldHRpbmdzJyl7XHJcbiAgICBzdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImdrX1NGX3NldHRpbmdzXCIpO1xyXG5cclxuICAgIGlmKHN0cmluZyl7XHJcbiAgICAgICRzcyA9IEpTT04ucGFyc2Uoc3RyaW5nKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoJ3NldHRpbmdzJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyDQkNCf0Jgg0LfQsNC/0YDQvtGB0LBcclxuXHJcbmZ1bmN0aW9uIFJFUSh1cmwsIG1ldGhvZCwgcGFyYW0sIGFzeW5jLCBvbnN1Y2Nlc3MsIG9uZmFpbHVyZSkge1xyXG4gIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gIGdldFRpbWVSZXF1ZXN0KCk7XHJcblxyXG4gIHJlcXVlc3Qub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xyXG4gIGlmIChtZXRob2QgPT0gJ1BPU1QnKSByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICByZXF1ZXN0LnNlbmQocGFyYW0pO1xyXG5cclxuICBpZiAoYXN5bmMgPT0gdHJ1ZSkge1xyXG4gICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpe1xyXG4gICAgICBpZiAocmVxdWVzdC5yZWFkeVN0YXRlID09IDQgJiYgcmVxdWVzdC5zdGF0dXMgPT0gMjAwICYmIHR5cGVvZiBvbnN1Y2Nlc3MgIT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgIGdldFRpbWVSZXF1ZXN0KDEpO1xyXG4gICAgICAgIG9uc3VjY2VzcyhyZXF1ZXN0KTtcclxuICAgICAgfWVsc2UgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PSA0ICYmIHJlcXVlc3Quc3RhdHVzICE9IDIwMCAmJiB0eXBlb2Ygb25mYWlsdXJlICE9ICd1bmRlZmluZWQnKSBvbmZhaWx1cmUocmVxdWVzdCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAoYXN5bmMgPT0gZmFsc2UpIHtcclxuICAgIGlmIChyZXF1ZXN0LnN0YXR1cyA9PSAyMDAgJiYgdHlwZW9mIG9uc3VjY2VzcyAhPSAndW5kZWZpbmVkJykgb25zdWNjZXNzKHJlcXVlc3QpO1xyXG4gICAgZWxzZSBpZiAocmVxdWVzdC5zdGF0dXMgIT0gMjAwICYmIHR5cGVvZiBvbmZhaWx1cmUgIT0gJ3VuZGVmaW5lZCcpIG9uZmFpbHVyZShyZXF1ZXN0KTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlcGFjayhvLCBrZXkpe1xyXG4gIHZhciByID0ge307XHJcblxyXG4gIE9iamVjdC5rZXlzKG8pLmZvckVhY2goZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgclskdHNba2V5XVt2YWx1ZV1dID0gb1t2YWx1ZV07XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiByO1xyXG59Il19
