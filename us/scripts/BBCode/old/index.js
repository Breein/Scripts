// ==UserScript==
// @name        BBCode [GW]
// @namespace   гном убийца
// @description BB-коды на форуме. Два режима: продвинутый и упрощенный. (25.04.15.2102)
// @include     http://www.ganjawars.ru/object-messages.php*
// @include     http://www.ganjawars.ru/threads-new.php*
// @include     http://www.ganjawars.ru/messages.php*
// @include     http://www.ganjawars.ru/info.edit.php?type=pinfo
// @version     1.00
// @grant       none
// ==/UserScript==


(function() {

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var key = getKey();
  var address = location.pathname;
  var node;
  var colors;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  if(address == "/messages.php" || address == "/object-messages.php"){
    node = $('b:contains("Новое сообщение:")');

    if(node.length){
      node = node.up('td').node();
      createBBcode_GUI(node, "");
    }
    replaceBBCode();
  }

  if(address == "/threads-new.php"){
    node = $('td:contains("Текст сообщения:")').node();

    if(node) createBBcode_GUI(node, '<br><div style="width: 100%; height: 5px;"></div>');
  }

  if( address == "/info.edit.php"){
    node = $('textarea[name="about"]').node();
    console.log(node);
    if(node) createBBcode_GUI(node, '<br><div style="width: 100%; height: 5px;"></div>');
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function createBBcode_GUI(node, br){
    var buttons, code;
    var i, length;

    if(br == "") node.setAttribute("valign", "middle");

    node.innerHTML += "&nbsp;&nbsp;" + br;
    if(key) node.innerHTML += '<input type="button" value="b" title="Жирный" style="font-weight: 500; font-family:Verdana; background-color:rgb(208,238,208); width: 20px; font-size:10px; height: 20px;" /> ';
    node.innerHTML += '<input type="button" value="i" title="Курсив" style="font-weight: 500; font-family:Verdana; background-color:rgb(208,238,208); width: 20px; font-size:10px; height: 20px;" /> ';
    if(key) node.innerHTML += '<input type="button" value="s" title="Зачеркнутый" style="font-weight: 500; font-family:Verdana; background-color:rgb(208,238,208); width: 20px; font-size:10px; height: 20px;" /> ';
    if(key) node.innerHTML += '<input type="button" value="c" title="Центрированный" style="font-weight: 500; font-family:Verdana; background-color:rgb(208,238,208); width: 20px; font-size:10px; height: 20px;" /> ';
    node.innerHTML += '<input type="button" value="q" title="Цитата" style="font-weight: 500; font-family:Verdana; background-color:rgb(208,238,208); width: 20px; font-size:10px; height: 20px;" /> ';

    if(br == "")
      node.innerHTML += '<input type="button" value="@" title="Изменить режим работы скрипта" style="float: right; font-weight: 500; font-family:Verdana; background-color:rgb(208,238,208); width: 20px; font-size:10px; height: 20px;" /> ';

    buttons = $(node).find('input[type="button"]').nodes();

    for(i = 0, length = buttons.length; i < length; i++){
      code = buttons[i].value;
      code = {
        open: "[" + code + "]",
        close: "[/" + code + "]"
      };
      bindEvent(buttons[i], 'onclick', (function(open, close){return function(){insertBBCode(open, close)}}(code.open, code.close)));
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function insertBBCode(open, close){
    var input = $('textarea[name="message"]').node();
    var text, clearText;
    var start, stop;

    if(open == "[@]"){
      setKey();
      return;
    }

    start = input.selectionStart;
    stop = input.selectionEnd;
    clearText = input.value;
    text = "";

    if(start != stop){
      if(start == 0 && stop == clearText.length){
        clearText = open + clearText + close;
        input.value = clearText;
        return;
      }else{
        text = clearText.substring(start, stop);
      }
    }

    start = clearText.substring(0, start);
    stop = clearText.substring(stop, clearText.length);
    clearText = start + open + text + close + stop;

    input.value = clearText;
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function replaceBBCode(){
    var posts, post, text;

    posts = $('b:contains("Автор")').up('table').node().rows;

    for(var i = 1, length = posts.length; i < length; i++){
      post = $(posts[i]).find('table[cellpadding="5"]').find('td');
      text = post.html();
      if(key){
        text = text.replace(/\[b\]/g, "<b>");
        text = text.replace(/\[\/b\]/g, "</b>");

        text = text.replace(/\[s\]/g, "<s>");
        text = text.replace(/\[\/s\]/g, "</s>");

        text = text.replace(/\[c\]/g, "<center>");
        text = text.replace(/\[\/c\]/g, "</center>");

        if(address == "/object-messages.php"){
          text = text.replace(/\[i\]/g, "<i>");
          text = text.replace(/\[\/i\]/g, "</i>");

          text = text.replace(/\[q\]/g, "<div style='background-color: #d0eed0; border: 1px dashed #66BB66; padding: 2px;'>");
          text = text.replace(/\[\/q\]/g, "</div>");
        }
      }else{
        text = text.replace(/\[b\]|\[\/b\]|\[s\]|\[\/s\]|\[c\]|\[\/c\]|\[i\]|\[\/i\]|\[q\]|\[\/q\]/g, "");
      }
      post.html(text);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function getKey(){
    var key;

    key = localStorage.getItem("gk_bbCode");
    if(key){
      key = JSON.parse(key);
    }else{
      key = true;
      localStorage.setItem("gk_bbCode", key);
    }

    return key;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function setKey(){
    key = !key;
    localStorage.setItem("gk_bbCode", key);
    location.reload();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    return;
  }

  function $(param){
    var obj, str;

    function Object(param){
      this.selector = param;
      this.nodeList = [];
      this.length = 0;
    }

    Object.prototype = {
      node: function (){
        return this.nodeList[0] ? this.nodeList[0] : null;
      },

      nodes: function(){
        return this.nodeList;
      },

      getSelector: function(){
        return this.selector;
      },

      html: function(param){
        if(param){
          this.nodeList[0].innerHTML = param;
          return this;
        }else{
          return this.nodeList[0] ? this.nodeList[0].innerHTML : "This node is null. Selector: " + this.selector;
        }
      },

      text: function(){
        return this.nodeList[0] ? this.nodeList[0].textContent : "This node is null. Selector: " + this.selector;
      },

      find: function(param){
        var text, selector, node, key = false;
        var i, length, nodesArray = [];

        this.selector = param;
        node = this.nodeList[0] ? this.nodeList[0] : document;

        text = param.match(/(.+):contains\("~(.+)"\)/i);
        if(!text){
          key = true;
          text = param.match(/(.+):contains\("(.+)"\)/);
        }

        if(text){
          selector = text[1];
          text = text[2];
        }else{
          selector = param;
          text = null;
        }

        if(text){
          nodesArray = node.querySelectorAll(selector);
          this.nodeList = [];

          for(i = 0, length = nodesArray.length; i < length; i++){
            if(key){
              if(nodesArray[i].textContent == text){
                this.nodeList.push(nodesArray[i]);
              }
            }else{
              if(nodesArray[i].textContent.search(text) != -1){
                this.nodeList.push(nodesArray[i]);
              }
            }
          }
        }else{
          this.nodeList = node.querySelectorAll(selector);
        }
        this.length = this.nodeList.length;

        return this;
      },

      up: function(value){
        var node;

        this.selector += " > up[" + value + "]";
        value = value.toUpperCase();
        node = this.nodeList[0].parentNode;
        this.nodeList = [];

        while(node.nodeName != value){
          node = node.parentNode;
          if(node == document){
            this.nodeList[0] = null;
            this.length = 0;

            return this;
          }
        }
        this.nodeList[0] = node;
        this.length = 1;

        return this;
      },

      next: function(value){
        var node, lastNode;

        this.selector += " > next[" + value + "]";
        value = value.toUpperCase();
        node = this.nodeList[0].nextSibling;
        lastNode = node.parentNode.lastChild;
        this.nodeList = [];

        while(node.nodeName != value){
          node = node.nextSibling;
          if(node == lastNode){
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

    if(typeof param == "string"){
      str = param.match(/<(.+)>/);
      if(str){
        obj = new Object('create("' + str[1] + '")');
        obj.nodeList[0] = document.createElement(str[1]);
        obj.length = 1;
      }else{
        obj = new Object(param).find(param);
      }
    }else{
      obj = new Object('set("' + param.nodeName + '")');
      obj.nodeList[0] = param;
      obj.length = 1;
    }

    return obj
  }

})();
