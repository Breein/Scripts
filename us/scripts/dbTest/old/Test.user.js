// ==UserScript==
// @name        Test
// @description Test
// @author      гном убийца
// @version     1.0
// @include     http://www.ganjawars.ru/iski.php
// ==/UserScript==

(function() {
    var b;
    var $idb = {
        o: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
        t: window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
        r: null,
        db: null,
        tx: null,
        store: null,
        version: 1,
        name: "Test"
    };

    //$idb.o.deleteDatabase($idb.name);

    getVersionIDB();

    console.log($idb);


    b = document.createElement('input');
    b.setAttribute("type", "button");
    b.setAttribute("value", "Bbbbb");
    b.setAttribute("id", "gk_button");

    document.body.appendChild(b);

    bindEvent(b, 'onclick', change);

    function getVersionIDB(){
        var db = $idb.o.open($idb.name);
        db.onsuccess = function(){
            $idb.version = db.result.version == 1 ? 2 : db.result.version;
            db.result.close();
            connectDB();
        };
    }

    setTimeout(function(){
        add();
        show();
    }, 2000);


    function connectDB(){
        console.log("Run Connect, version " + $idb.version);

        $idb.r = $idb.o.open($idb.name, $idb.version);

        $idb.r.onerror = logerr;
        $idb.r.onsuccess = function(){
            $idb.db = $idb.r.result;
            console.log("Success!");
        };
        $idb.r.onupgradeneeded = function(e){
            var members, forum;

            $idb.db = e.currentTarget.result;

            if($idb.version == 2){
                members = $idb.db.createObjectStore("members", {keyPath: "id"});
                forum = $idb.db.createObjectStore("forums", {keyPath: "id"});

                members.createIndex("name", "a", { unique: true });
                members.createIndex("status", "b.text", { unique: false });
                forum.createIndex("name", "name", { unique: true });
                forum.createIndex("author", "author", { unique: false });

                console.log("Create: members, forums;");
            }

            $idb.db.createObjectStore("members[" + $idb.version + "]", {keyPath: "id"});
            $idb.db.createObjectStore("themes[" + $idb.version + "]", {keyPath: "id"});
            console.log("Create: members[" + $idb.version + "], forum[" + $idb.version + "]");
            console.log("Upgraded!");
        };
    }

    function change(){
        console.log("Click!");
        $idb.db.close();
        $idb.version++;
        connectDB();
    }


    function add(){
        var member, members;

        members = localStorage.getItem("gk_SF_data");
        members = JSON.parse(members);
        members = members.players;

        try{
            console.log($idb.db);
            $idb.tx = $idb.db.transaction(["members"], "readwrite");
            $idb.store = $idb.tx.objectStore("members");

            Object.keys(members).forEach(function(id){
                member = {
                    id: Number(id),
                    a: members[id].name,
                    b: members[id].status
                };

                $idb.store.put(member);
            });

            console.log("Added!");
        }catch (e){
            l(e);
        }
    }


    function show(){
        var index;
        try {
            console.log($idb.db);
            $idb.tx = $idb.db.transaction(["members"], "readonly");
            $idb.store = $idb.tx.objectStore("members");

            index = $idb.store.index("status");
            index = index.get("Ok");

            index.onsuccess = function(event){
                console.log(event.target.result);
            };
        }catch (e){
            l(e);
        }
    }

    function showAll(){
        var customers = [];
        var keyRangeValue = IDBKeyRange.bound(1, 100000);

        tx = db.transaction([tableMembers], "readonly");
        store = tx.objectStore(tableMembers);

        store.openCursor(keyRangeValue).onsuccess = function(event){
            var cursor = event.target.result;

            if(cursor){
                customers.push(cursor.value);
                cursor.continue();
            }else{
                console.log("Got all customers: ");
                console.log(customers);
            }
        };
    }



    function logerr(event) {
        try{
            //console.log($idb.o);
            console.error("Error");
            console.error("Database error: " + event.target.errorCode);
        }catch (e){
            console.log(e);
        }
    }

    function l(e){
        console.error(e);
        console.error(e.lineNumber);
    }


    function bindEvent(element, event, callback) {
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
    }



})();