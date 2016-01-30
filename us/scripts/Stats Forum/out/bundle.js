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

    return new Promise(function (onsuccess) {
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

    return new Promise(function (onsuccess) {
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

    return new Promise(function (onsuccess) {
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
      console.log("Success added to " + table);
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
  return new Promise(function (onsuccess) {
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

},{}],5:[function(require,module,exports){
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

module.exports = function (url, method, param) {
  return new Promise(function (onsuccess, onfailure) {
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

},{}],7:[function(require,module,exports){
'use strict';

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

    Object.keys(table.getStructure()).forEach(function (value) {
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
    list = Object.keys(filter);
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

},{"./dom":2,"./events":3}],8:[function(require,module,exports){
"use strict";

function GeneratorData() {
  this.object = null;
}

GeneratorData.prototype = {
  /**
   * @param {number} id
   * @returns {object}
   */
  player: function player(id) {
    return {
      id: id,
      name: "",
      status: "",
      date: 0,
      forums: []
    };
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  forum: function forum(id) {
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
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  theme: function theme(id) {
    return {
      id: id,
      name: "",
      author: [0, ""],
      posts: [0, 0],
      pages: [0, 0],
      start: 0
    };
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  member: function member(id) {
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
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  timestamp: function timestamp(id) {
    return {
      id: id,
      time: [],
      data: []
    };
  }
};

/**
 * @returns {GeneratorData}
 */
module.exports = function () {
  return new GeneratorData();
};

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";

function PackerData() {
  this.object = null;
}

PackerData.prototype = {
  /**
   * @param {object} o
   * @returns {object}
   */
  isPacked: function isPacked(o) {
    return o.a ? true : false;
  },

  /**
   * @param {object} o
   * @returns {object}
   */
  player: function player(o) {
    return this.isPacked(o) ? { id: o.id, name: o.a, status: o.b, date: o.c, forums: o.d } : { id: o.id, a: o.name, b: o.status, c: o.date, d: o.forums };
  },

  /**
   * @param {object} o
   * @returns {object}
   */
  forum: function forum(o) {
    return this.isPacked(o) ? { id: o.id, name: o.a, sid: o.b, posts: o.c, words: o.d, page: o.e, themes: o.f, log: o.g } : { id: o.id, a: o.name, b: o.sid, c: o.posts, d: o.words, e: o.page, f: o.themes, g: o.log };
  },

  /**
   * @param {object} o
   * @returns {object}
   */
  theme: function theme(o) {
    return this.isPacked(o) ? { id: o.id, name: o.a, author: o.b, posts: o.c, pages: o.d, start: o.e } : { id: o.id, a: o.name, b: o.author, c: o.posts, d: o.pages, e: o.start };
  },

  /**
   * @param {object} o
   * @returns {object}
   */
  member: function member(o) {
    return this.isPacked(o) ? { id: o.id, posts: o.a, last: o.b, start: o.c, write: o.d, words: o.e, wordsAverage: o.f, carma: o.g, carmaAverage: o.h, sn: o.i, enter: o.j, exit: o.k, kick: o.l, invite: o.m } : { id: o.id, a: o.posts, b: o.last, c: o.start, d: o.write, e: o.words, f: o.wordsAverage, g: o.carma, h: o.carmaAverage, i: o.sn, j: o.enter, k: o.exit, l: o.kick, m: o.invite };
  },

  /**
   * @param {object} o
   * @returns {object}
   */
  timestamp: function timestamp(o) {
    return this.isPacked(o) ? { id: o.id, time: o.a, data: o.b } : { id: o.id, a: o.time, b: o.data };
  }
};

/**
 * @returns {PackerData}
 */
module.exports = function () {
  return new PackerData();
};

},{}],11:[function(require,module,exports){
'use strict';

require('./../../../lib/prototypes')();
var $ = require('./../../../lib/dom');
var db = require('./../../../lib/idb');
var bindEvent = require('./../../../lib/events');
var ajax = require('./../../../lib/request');
var createTable = require('./../../../lib/table');

var $c = require('./../../../lib/common')();
var Create = require('./../src/generator')();
var Pack = require('./../src/packer')();
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

  ini = [{ name: "players", key: "id", index: [["name", "a", true]] }, { name: "forums", key: "id" }];

  if (first) {
    db(name).then(function (db) {
      $idb = db;
      $idb.setIniTableList(ini);

      return db;
    }).then(function () {
      if (first) return $idb.connectDB();
    }).then(function () {
      console.log("All done 1");
      addToDB();
    });
  } else {
    $idb.connectDB().then(function () {
      console.log("All done 2");
      addToDB();
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addToDB() {
  var forum;

  if (!$idb.exist('themes_' + $cd.fid)) {
    forum = Create.forum($cd.fid);
    forum.name = $cd.fName;
    forum.sid = $cd.sid;
    forum = Pack.forum(forum);

    $idb.add("forums", forum);
    $idb.setModifyingTableList([{ name: 'themes_' + $cd.fid, key: "id" }, { name: 'members_' + $cd.fid, key: "id" }, { name: 'timestamp_' + $cd.fid, key: "id" }]);
    $idb.db.close();
    $idb.nextVersion();
    makeConnect("gk_StatsForum", false);
  } else {
    loadFromLocalStorage('settings');

    $t = {
      stats: createTable(["#sf_header_SI", "#sf_content_SI", "#sf_footer_SI"], "stats", $ss),
      themes: createTable(["#sf_header_TL", "#sf_content_TL", "#sf_footer_TL"], "themes", $ss)
    };

    $idb.getOne("forums", "id", $cd.fid).then(function (res) {
      $forum = res;
      $forum = Pack.forum($forum);
      createGUI();
    });
  }
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

    Object.keys(list).forEach(function (id) {
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

    Object.keys($sd.players).forEach(function (id) {
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
  var _this = this;

  var url, page;

  url = "http://www.ganjawars.ru/threads.php?fid=" + $forum.id + "&page_id=10000000";

  ajax(url, "GET", null).then(function (res) {
    $answer.innerHTML = res;

    $forum.page[1] = parse();
    page = $forum.page[1] - $forum.page[0];

    $idb.add("forums", Pack.forum($forum));

    displayProgress('start', 'Обработка форума синдиката #' + $forum.id + ' «' + $forum.name + '»', 0, page + 1);
    displayProgressTime(page * 1250 + 1500);

    parseForum.gkDelay(750, _this, [page, true]);
  });
  /////////////////////////////

  function parse() {
    var page;

    page = $($answer).find('a[style="color: #990000"]:contains("~Форумы")').up('b').next('center').find('a');
    page = page.node(-1).href.split('page_id=')[1];

    return Number(page);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function parseForum(index, mode, stopDate) {
  var url, count;

  url = 'http://www.ganjawars.ru/threads.php?fid=' + $cd.fid + '&page_id=' + index;
  count = 0;

  if (index != -1) {

    ajax(url, "GET", null).then(function (res) {
      $answer.innerHTML = res;

      displayProgress('work');

      $($answer).find('td[style="color: #990000"]:contains("Тема")').up('table').find('tr[bgcolor="#e0eee0"],[bgcolor="#d0f5d0"]').nodeArr().reduce(function (sequence, tr) {
        return sequence.then(function () {
          return parse(tr);
        });
      }, Promise.resolve()).then(function () {

        index = mode ? index - 1 : index + 1;
        if (mode && $forum.page[0] != $forum.page[1]) $forum.page[0]++;

        console.log("Done");
      });

      //.forEach((tr) => {
      //  sequence = sequence.then((r) => {
      //    console.log("Res: " + r);
      //    return parse(tr);
      //  }).then(() =>{
      //
      //    index = $forum.sid ? index - 1 : index + 1;
      //    if($forum.sid && $forum.page[0] != $forum.page[1]) $forum.page[0]++;
      //
      //    console.log("All done");
      //  });
      //});
    });

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
  } else {
      //saveToLocalStorage('data');
      //renderTables();
      displayProgress('done');
    }
  /////////////////////////////

  function parse(tr) {
    var td, tid, theme, player, member;

    td = tr.cells;
    tid = getId();

    //date = getDate();

    return $idb.getOne('themes_' + $forum.id, "id", tid).then(function (res) {
      theme = Pack.theme(res);

      if (theme == null) {
        $forum.themes[1]++;
        $idb.add('forums', Pack.forum($forum));

        theme = Create.theme(tid);
        theme.name = getName();
        theme.author = getAuthor();
        theme.posts = getPosts();
        theme.pages = getPages();
        theme.start = getDate();
      } else {
        theme.posts = getPosts();
        theme.pages = getPages();
      }
      $idb.add('themes_' + $forum.id, Pack.theme(theme));

      return $idb.getOne('players', "id", theme.author[0]);
    }).then(function (res) {
      player = Pack.player(res);

      if (player == null) {
        player = Create.player(theme.author[0]);
        player.name = theme.author[1];
        player.forums.push($forum.id);

        member = Create.member(theme.author[0]);
        member.start.push(theme.id);

        return null;
      } else {
        if (!$c.exist($forum.id, player.forums)) player.forums.push($forum.id);

        return $idb.getOne('members_' + $forum.id, "id", player.id);
      }
    }).then(function (res) {
      if (res) {
        member = Pack.member(res);

        if (!$c.exist(theme.id, member.start)) member.start.push(theme.id);
      }

      $idb.add('players', Pack.player(player));
      $idb.add('members_' + $forum.id, Pack.member(member));
    });

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
      date = date[1] + '/' + date[2] + '/' + date[0] + ' ' + date[3] + ':' + date[4] + ':' + date[5];
      date = Date.parse(date) / 1000;

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
  }
  /////////////////////////////

  function calcNewThemes() {
    var themes;

    themes = $cd.f.themes;
    $cd.f.threads['new'] = $cd.f.threads.all;

    Object.keys(themes).forEach(function (tid) {
      if (themes[tid].posts[0] == themes[tid].posts[1]) {
        $cd.f.threads['new']--;
      }
    });
  }
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
    Object.keys($sd[value]).forEach(processing);
    //Object.keys($ss.show.stats).forEach(prepareFilters);
  } else {
      Object.keys($sd.forums[$cd.fid].themes).forEach(processing);
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

  list = Object.keys($ss.show.stats).reverse();
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

},{"./../../../lib/common":1,"./../../../lib/dom":2,"./../../../lib/events":3,"./../../../lib/idb":4,"./../../../lib/prototypes":5,"./../../../lib/request":6,"./../../../lib/table":7,"./../src/generator":8,"./../src/icons":9,"./../src/packer":10}]},{},[11]);
