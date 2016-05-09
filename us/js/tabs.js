const setStyle = require('./style.js');
const bindEvent = require('./events');
var $ = require('./dom');

function Tabs(tabs, active){
  this._tabs = tabs;
  this._tabsNodes = [];
  this._active = active ? active : 0;
  this._header = null;
  this._content = null;

  this._create();
}

Tabs.prototype = {
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

    $(this._header).html(code);

    this._content = $('<table>')
      .class("set", "tabs-content")
      .attr("cellspacing", "0")
      .attr("cellpadding", "0")
      .attr("align", "center")
      .node();

    code = this._createTabsContent();
    $(this._content).html(code);

    $(Tabs._header).find('td[class="tab-text"],[class="tab-text active"]').each((tab)=>{
      Tabs._tabsNodes.push(tab);
      bindEvent(tab, 'onclick', Tabs._selectTab, [], Tabs);
    });
  },

  _createTabs: function (type){
    var content, code, active, width, Tabs = this;

    code = type == "tab-top" ? `<tr><td class="tab-top"></td>` : `<tr><td class="tab-begin-end" width="15"></td>`;

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
    var active, ai, filter;

    ai = this._active + 1;
    active = this._header.rows[1].cells[ai];
    if(tab == active) return;

    $(active).class("remove", "active");
    $(this._header.rows[0].cells[ai]).class("remove", "active");
    $(this._content.rows[this._active]).class("add", "none-active");

    this._active = tab.cellIndex - 1;
    ai = this._active + 1;

    $(tab).class("add", "active");
    $(this._header.rows[0].cells[ai]).class("add", "active");
    $(this._content.rows[this._active]).class("remove", "none-active");

    filter = $('#filtersWindow').node();
    if(filter) filter.style.visibility = "hidden";
  },

  /**
   * @param node
   */
  append: function(node){
    node.appendChild(this._header);
    node.appendChild(this._content);
  },

  /**
   * @param {string} name
   */
  select: function(name){
    var index = null;

    this._tabs.forEach(function(tab, i){
      if(tab == name) index = i;
    });

    index != null ?
      this._selectTab(this._tabsNodes[index]):
      console.log("Нет такой вкладки!");
  }
};

/**
 * @param {[string, ...]}tabs
 * @param {number=} active
 * @returns {Tabs}
 */
module.exports = function(tabs, active){
  setStyle('tabs.js', '@include: ./../../css/tabs.css, true');
  return new Tabs(tabs, active);
};