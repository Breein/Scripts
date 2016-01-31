(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  node: function (param) {
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
  nodes: function () {
    return this.nodeList;
  },

  /**
   * @returns {[]}
   */
  nodeArr: function(){
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
  getSelector: function () {
    return this.selector;
  },

  /**
   * @param {null|*} param
   * @returns {Api|string}
   */
  html: function (param) {
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
  text: function () {
    return this.nodeList[0] ? this.nodeList[0].textContent : "This node is null. Selector: " + this.selector;
  },

  /**
   * @param {string} attribute
   * @param {string} value
   * @returns {Api}
   */
  attr: function(attribute, value){
    this.nodeList[0].setAttribute(attribute, value);
    return this;
  },

  /**
   * @param {string} param
   * @returns {Api}
   */
  find: function (param) {
    var text, selector, node, key = false;
    var i, length, nodesArray = [];

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
  up: function (param){
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
  next: function (param){
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

},{}],2:[function(require,module,exports){
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
      event = 'on'+event;
    }
    element.attachEvent(event, callback, false);
  }
};
},{}],3:[function(require,module,exports){
function DB(name){
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
  connectDB: function(){
    return new Promise((onsuccess) =>{
      var idb = this;

      console.log("Run connect, version " + idb.version);

      idb.r = idb.o.open(this.name, idb.version);

      idb.r.onerror = function(){
        console.log("Error!");
      };

      idb.r.onsuccess = function(){
        idb.db = idb.r.result;
        console.log("Success connect!");
        onsuccess(idb);
      };

      this.r.onupgradeneeded = function(e){
        idb.db = e.currentTarget.result;

        if(idb.version == 2){
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
  setModifyingTableList: function(list){
    this.modifyingTable = list;
  },

  /**
   * @param {*[]} list
   */
  setIniTableList: function(list){
    this.iniBase = list;
  },
  /**
   * @param {string[]} list
   */
  setRemoveTableList: function(list){
    this.removeTable = list;
  },

  /**
   * @param {boolean} ini
   */
  upgrade: function(ini){
    var table, todo, idb = this;

    todo = ini ? idb.iniBase : idb.modifyingTable;

    if(todo){
      todo.forEach(function(t){
        if(idb.exist(t.name)){
          table = idb.r.transaction.objectStore(t.name);
        }else{
          table = idb.db.createObjectStore(t.name, {keyPath: t.key});
          console.log("Success created: " + t.name);
        }

        if(t.index){
          t.index.forEach(function(index){
            table.createIndex(index[0], index[1], {unique: index[2]});
            console.log("Success created index: " + index.toString());
          });
        }
      });
      todo = null;
    }
    if(idb.removeTable){
      idb.removeTable.forEach(function(t){
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
  exist: function (name){
    var length, array;

    array = this.db.objectStoreNames;
    length = array.length;

    while(length--){
      if(array[length] == name){
        return true;
      }
    }
    return false;
  },

  /**
   *
   */
  nextVersion: function(){
    this.version++;
  },

  /**
   *
   */
  deleteDB: function(){
    this.o.deleteDatabase(this.name);
    console.log("Success deleted: " + this.name);
  },

  /**
   * @param {string} table
   * @param {string} index
   * @param {string|number} value
   * @returns {object}
   */
  getOne: function(table, index, value){
    return new Promise((onsuccess) => {
      this.tx = this.db.transaction([table], "readonly");
      this.store = this.tx.objectStore(table);

      if(index == "id"){
        this.store.get(value).onsuccess = function(event){
            onsuccess(event.target.result);
        }
      }else{
        this.index = this.store.index(index);
        this.index = this.index.get(value);

        this.index.onsuccess = function(event){
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
  getFew: function(table, range, index){
    return new Promise((onsuccess) =>{
      var results = [];
      var krv = range ? this.kr.bound(range[0], range[1]) : null;

      this.tx = this.db.transaction([table], "readonly");
      this.store = this.tx.objectStore(table);

      if(index){
        this.store = this.store.index(index);
      }

      this.store.openCursor(krv).onsuccess = function(event){
        var cursor = event.target.result;

        if(cursor){
          results.push(cursor.value);
          cursor.continue();
        }else{
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
  add: function(table, data){
    try{
      this.tx = this.db.transaction([table], "readwrite");
      this.store = this.tx.objectStore(table);

      this.store.put(data);
      console.log("Success added to " + table);
    }catch(e){
      console.log("Failed added");
      console.log(e);
    }
  }
};

/**
 * @param {string} name
 *
 */
module.exports = function(name){
  return new Promise((onsuccess) => {
      var db, idb;

      idb = new DB(name);
      db = idb.o.open(name);

      db.onsuccess = function(){
        idb.version = db.result.version == 1 ? 2 : db.result.version;
        db.result.close();

        onsuccess(idb);
      };
    }
  )
};

},{}],4:[function(require,module,exports){
module.exports = function(){
  /**
   * Вызывает функцию через указанное количество миллисекунд в контексте ctx с аргументами args.
   * @param {int} timeout
   * @param {Object} ctx
   * @param {Array} args
   * @return {Number} Идентификатор таймаута.
   */
  Function.prototype.gkDelay = function(timeout, ctx, args){
    var func = this;
    return setTimeout(function() {
      func.apply(ctx, args || []);
    }, timeout);
  };

  /**
   * @param {*} value
   * @returns {boolean}
   */
  Array.prototype.gkExist = function(value){
    var length, array;

    array = this;
    length = array.length;

    while(length--){
      if(array[length] == value){
        return true;
      }
    }
    return false;
  };

  /**
   * @param {Function} generator
   * @param {*[]}args
   */
  Function.prototype.gkWait = function(generator, args){
    var f = this;
    f.apply(null, args || []).then((result)=>{
      generator.next(result);
    });
  };
};
},{}],5:[function(require,module,exports){
module.exports = function (url, method, param) {
  return new Promise((onsuccess, onfailure) => {
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
    }
  });
};
},{}],6:[function(require,module,exports){
require('./../../../lib/prototypes')();
var db = require('./../../../lib/idb');
var $ = require('./../../../lib/dom');
var ajax = require('./../../../lib/request');
var bindEvent = require('./../../../lib/events');

var $idb, $ts, $dbAnswer;


var arr = ["/me/", "/syndicates.php", "/shop.php"];

arr.reduce((sequence, u) => {
  return sequence.then(()=>{
    return forEach(u);
  });
}, Promise.resolve()).then(()=>{
  console.log("ForEach - Ok");
});

function forEach(u){
  var g, f;

  f = (resolve) => {
    g = parse();
    g.next();

    function* parse(){
      console.log("Start");
      var a;

      a = yield ajax.gkWait(g, ["http://www.ganjawars.ru" + u, "GET", null]);

      // some code;

      console.log(a);
      console.log("End\n\n");
      resolve();
    }
  };

  return new Promise(f);
}
},{"./../../../lib/dom":1,"./../../../lib/events":2,"./../../../lib/idb":3,"./../../../lib/prototypes":4,"./../../../lib/request":5}]},{},[6]);
