function Api(param) {
  this.selector = param;
  this.nodeList = [];
  this.length = 0;
}

Api.prototype = {

  /**
   * @param {number=} param
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
   * @param {Function} callback
   * @param {Number=} start
   * @param {Number=} end
   * @returns {Api}
   */
  each: function(callback, start, end){
    var i, length;

    i = start ? start : 0;
    length = end && end < this.length ? end : this.length;

    while(i < length){
      callback(this.nodeList[i], i, length, this.nodeList);
      i++;
    }

    return this;
  },

  /**
   * @returns {string}
   */
  getSelector: function () {
    return this.selector;
  },

  /**
   * @param {*=} param - Без параметра для получения, с параметром для вставки
   * @param {*=} add - Добавление к коду.
   * @returns {Api|string} - Строка HTML исходного кода или объект API
   */
  html: function (param, add) {
    if (param != null) {
      if(add){
        this.nodeList[0].innerHTML += param;
      }else{
        this.nodeList[0].innerHTML = param;
      }
      return this;
    } else {
      return this.nodeList[0] ? this.nodeList[0].innerHTML : "This node is null. Selector: " + this.selector;
    }
  },

  /**
   * @param {*=} param - Без параметра для получения, с параметром для вставки
   * @returns {string|Api}
   */
  text: function (param){
    if(param != null){
      this.html(param);
    }else{
      return this.nodeList[0] ? this.nodeList[0].textContent : "This node is null. Selector: " + this.selector;
    }
  },

  /**
   * @param {string} attribute
   * @param {string|number=} value
   * @returns {Api|string}
   */
  attr: function(attribute, value){
    if(value != null){
      this.nodeList[0].setAttribute(attribute, value);
      return this;
    }else{
      return this.nodeList[0].getAttribute(attribute);
    }
  },

  /**
   * @param {string=} action
   * @param {string=} param
   * @returns {string|Api}
   */
  class: function(action, param){
    if(action == null){
      this.selector += " > get Class Name";
      return this.nodeList[0].className;
    }

    this.selector += " > class-" + action + " [" + param + "]";

    if(action == "set"){
      this.nodeList[0].className = param;
      return this;
    }
    if(action == "add"){
      if(this.nodeList[0].className.indexOf(param) == -1){
        this.nodeList[0].className = this.nodeList[0].className + " " + param;
      }
      return this;
    }
    if(action == "remove"){
      this.nodeList[0].className = this.nodeList[0].className.replace(new RegExp(" " + param), '');
      return this;
    }
    if(action == "delete"){
      this.nodeList[0].removeAttribute("class");
      return this;
    }
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
    if(node == null) return this.nodeNull();

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
          if(nodesArray[i].textContent.indexOf(text) != -1){
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
      if (node == document) return this.nodeNull();
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
    var node, lNode;

    this.selector += " > next[" + param + "]";
    param = param.toUpperCase();

    node = this.nodeList[0].nextElementSibling;
    if(node == null) return this.nodeNull();

    lNode = node.parentNode.lastChild;
    this.nodeList = [];

    while (node.nodeName != param){
      node = node.nextElementSibling;
      if (node == lNode) return this.nodeNull();
    }
    this.nodeList[0] = node;
    this.length = 1;

    return this;
  },

  /**
   *
   * @param {string} param
   * @returns {Api}
   */
  prev: function (param){
    var node, fNode;

    this.selector += " > prev[" + param + "]";
    param = param.toUpperCase();

    node = this.nodeList[0].previousElementSibling;
    if(node == null) return this.nodeNull();

    fNode = node.parentNode.firstChild;
    this.nodeList = [];

    while(node.nodeName != param){
      node = node.previousElementSibling;
      if(node == fNode) return this.nodeNull();
    }
    this.nodeList[0] = node;
    this.length = 1;

    return this;
  },

  nodeNull: function(){
    this.nodeList[0] = null;
    this.length = 0;
    console.log(this.selector);

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
