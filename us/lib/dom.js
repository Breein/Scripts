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
