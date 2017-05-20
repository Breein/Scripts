const setStyle = require('./style.js');
const bindEvent = require('./events');
var $ = require('./dom');

function Tabs(tabs, name, menu){
  this._tabs = tabs;
  this._tabsNodes = [];
  this._tabNodeNames = {};
  this._active = 0;
  this._header = null;
  this._content = null;
  this._menu = null;
  this._menuOpen = false;
  this._name = name;
  this._button = menu;
  this._data = {};

  this._loadActiveTab();
  this._create();
}

Tabs.prototype = {
  _loadActiveTab: function(){
    var data;

    data = localStorage.getItem("gk_tabs-settings");
    if(data == null){
      this._saveActiveTab();
    }else{
      this._data = JSON.parse(data);

      if(this._data[this._name] == null){
       this._saveActiveTab();
      }else{
        this._active = this._data[this._name];
      }
    }
  },

  _saveActiveTab: function(){
    this._data[this._name] = this._active;
    localStorage.setItem("gk_tabs-settings", JSON.stringify(this._data));
  },

  _create: function(){
    var code, Tabs = this;

    this._header = $('<table>')
      .class("set", "tabs")
      .attr("cellspacing", "0")
      .attr("cellpadding", "0")
      .attr("align", "center")
      .node();

    code = this._createTabs("tab-top");
    code += this._createTabs("tab-text");
    this._header.innerHTML = code;

    this._content = $('<table>')
      .class("set", "tabs-content")
      .attr("cellspacing", "0")
      .attr("cellpadding", "0")
      .attr("align", "center")
      .node();

    code = this._createTabsContent();
    this._content.innerHTML = code;

    $(Tabs._header).find('td[class^="tab-text"]').each((tab)=>{
      Tabs._tabsNodes.push(tab);
      bindEvent(tab, 'onclick', Tabs._selectTab, [], Tabs);
    });

    if(this._button){
      this._menu = $('<div>')
        .class("set", "tab-menu hidden")
        .node();
      code = this._createMenu();
      this._menu.innerHTML = code;

      bindEvent($(Tabs._header).find('td[class="tab-button"]'), 'onclick', Tabs._showMenu, [], Tabs);
    }
  },

  _createTabs: function (type){
    var content, code, active, width, index, Tabs = this;

    code = type == "tab-top" ? `<tr><td class="tab-top"></td>` : `<tr><td class="tab-begin-end" width="15"></td>`;
    if(Tabs._button) code += type == "tab-top" ? `<td class="tab-top"></td>` : `<td class="tab-button" width="70">Меню</td>`;
    index = 0;

    Tabs._tabs.forEach((tab, i)=>{
      if(tab.charAt(0) == "!"){
        Tabs._tabs.splice(i, 1);
      }else{
        Tabs._tabNodeNames[tab] = index;
        index++;
      }
    });

    this._tabs.forEach(function(tab, index){
      active = Tabs._active == index ? " active" : "";
      if(type == "tab-top"){
        content = "";
        width = "";
      }else{
        content = tab;
        width = parseInt(tab.length * 8.5 + 28);
        width = `width="${width}"`;
      }
      code += `<td class="${type}${active}" ${width}>${content}</td>`;
    });

    code += type == "tab-top" ? `<td class="tab-top"></td></tr>` : `<td class="tab-begin-end"></td></tr>`;

    return code;
  },

  _createMenu: function(){
    var code, text;

    code = `<div><div></div><div></div></div><ul>`;
    for(text in this._button) code += `<li id="${this._button[text]}">${text}</li>`;
    return code + '</ul>';
  },

  _createTabsContent: function(){
    var code, active, Tabs = this;

    code = "";
    this._tabs.forEach(function(tab, index){
      active = Tabs._active == index ? "" : " none-active";
      code += `<tr class="tab-row${active}"><td class="tab-content"></td></tr>`;
    });

    return code;
  },

  _selectTab: function(tab){
    var active, ai, filter, menu;

    menu = this._button ? 1 : 0;
    ai = this._active + 1 + menu;
    active = this._header.rows[1].cells[ai];
    if(tab == active) return;

    $(active).class("remove", "active");
    $(this._header.rows[0].cells[ai]).class("remove", "active");
    $(this._content.rows[this._active]).class("add", "none-active");

    this._active = tab.cellIndex - 1 - menu;
    ai = this._active + 1 + menu;

    $(tab).class("add", "active");
    $(this._header.rows[0].cells[ai]).class("add", "active");
    $(this._content.rows[this._active]).class("remove", "none-active");

    filter = $('#filtersWindow').node();
    if(filter) filter.style.visibility = "hidden";
    this.closeMenu();
    this._saveActiveTab();
  },

  _showMenu: function(){
    if(this._menuOpen){
      $(this._menu).class("add", "hidden");
      this._menuOpen = false;
    }else{
      $(this._menu).class("remove", "hidden");
      this._menuOpen = true;
    }
  },

  _appendMenu: function(node){
    var pos;

    if(this._button){
      pos = $(node).find('td.tab-button').node().getBoundingClientRect();
      this._menu.style.left = pos.left - 1 + window.scrollX;
      this._menu.style.top = pos.top + pos.height - 1 + window.scrollY;
      node.appendChild(this._menu);
    }
  },

  /**
   * @param node
   */
  append: function(node){
    node.appendChild(this._header);
    node.appendChild(this._content);
    this._appendMenu(node);
  },

  /**
   * @param {string} tabNme
   * @param {string} code
   */
  insert: function(tabNme, code){
    var index, Tabs = this;

    index = Tabs._tabNodeNames[tabNme];

    if(index != null)
      Tabs._content.rows[index].cells[0].innerHTML = code;
  },

  /**
   * @param {string} name
   */
  select: function(name){
    var index = null;

    this._tabs.forEach(function(tab, i){
      if(tab == name) index = i;
    });

    if(index != null){
      if(index == this._active) return;
      this._selectTab(this._tabsNodes[index]);
    }else{
      console.log("Нет такой вкладки!");
    }
  },

  closeMenu: function(){
    if(this._menuOpen){
      $(this._menu).class("add", "hidden");
      this._menuOpen = false;
    }
  },

  /**
   * @param {string} button
   * @param {string} window
   * @param {Shadow} shadow
   * @param {function=} f
   */
  menuBindOpenWindow: function(button, window, shadow, f){
    var tabs = this;

    button = "#" + tabs._button[button];
    bindEvent($(button).class("remove", "hidden"), "onclick", openWindow);

    function openWindow(){
      shadow.open(window);
      tabs.closeMenu();
      if(f) f.apply();
    }
  }
};

/**
 * @param {[string, ...]}tabs
 * @param {string} name
 * @param {object=} menu
 * @returns {Tabs}
 */
module.exports = function(tabs, name, menu){
  setStyle('tabs.js', '@include: ./../../css/tabs.css, true');
  return new Tabs(tabs, name, menu);
};