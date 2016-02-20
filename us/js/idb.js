const $c = require('./common')();

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
    var idb = this;

    return new Promise((onsuccess) =>{
      //console.log("Run connect, version " + idb.version);

      idb.r = idb.o.open(this.name, idb.version);

      idb.r.onerror = function(){
        console.log("Error!");
      };

      idb.r.onsuccess = function(){
        idb.db = idb.r.result;
        //console.log("Success connect!");
        onsuccess(idb);
      };

      this.r.onupgradeneeded = function(e){
        idb.db = e.currentTarget.result;

        if(idb.version == 2){
          idb.upgrade(true);
          //console.log("Create: defaults");
        }
        idb.upgrade(false);
        //console.log("Upgraded!");
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
          //console.log("Success created: " + t.name);
        }

        if(t.index){
          t.index.forEach(function(index){
            table.createIndex(index[0], index[1], {unique: index[2]});
            //console.log("Success created index: " + index.toString());
          });
        }
      });
      todo = null;
    }
    if(idb.removeTable){
      idb.removeTable.forEach(function(t){
        idb.db.deleteObjectStore(t);
        //console.log("Success removed: " + t);
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
   * @param {string=} type - Тип возвращаемого значения
   * @param {string=} index
   * @param {*[]|*=} range
   * @returns {Promise}
   */
  getFew: function(table, type, index, range){
    var f, krv, results;

    results = type == "{}" ? {} : [];

    f = (onsuccess) => {
      if(range){
        krv = typeof range == 'object' ? this.kr.bound(range[0], range[1]) : this.kr.only(range);
      }

      this.tx = this.db.transaction([table], "readonly");
      this.store = this.tx.objectStore(table);

      if(index){
        this.store = this.store.index(index);
      }

      this.store.openCursor(krv).onsuccess = function(event){
        var cursor = event.target.result;

        if(cursor){
          if(type == "{}"){
            results[cursor.value.id] = cursor.value;
          }else{
            results.push(cursor.value);
          }
          cursor.continue();
        }else{
          //console.log("Got all results: ");
          onsuccess(results);
        }
      };
    };

    return new Promise(f);
  },

  /**
   * @param {string} table
   * @param {object} data
   */
  add: function(table, data){
    try{
      this.tx = this.db.transaction([table], "readwrite");
      this.store = this.tx.objectStore(table);

      if(data._ch != null){
        if(data._ch){
          delete data._ch;
          this.store.put(data);
          //console.log(`Success added to "${table}", id[${data.id}]!`);
        }
      }
    }catch(e){
      console.log(`Failed added to table "${table}", id[${data.id}]:`);
      console.log(data);
      console.log(e);
    }
  },

  /**
   * @param {string} table
   */
  clear: function(table){
    try{
      this.tx = this.db.transaction([table], "readwrite");
      this.store = this.tx.objectStore(table);
      this.store.clear();
      //console.log(`Success clear table "${table}"`);
    }catch(e){
      console.log(`Failed clear table "${table}"`);
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
  });
};
