var $ = require('./dom.js');
const bindEvent = require('./events.js');
const $c = require('./common.js')();
const $calendar = require('./calendar.js')();

function Filter(id, table, td, f, key){
  this.fw = $(id).node();
  this.table = table;
  this.settings = table.setups.filters;
  this.cell = td;
  this.cp = td.getBoundingClientRect();
  this.column = key;
  this.types = this.getTypes(f);
  this.text = this.getText(f);

  this.button = null;
  this.min = null;
  this.max = null;
  this.html = "";

  $calendar.setContainer("#sf_calendar");
}

Filter.prototype = {
  getTypes: function(f){
    return f.type;
  },

  getText: function(type){
    return {
      header: type.header,
      rt: type.rTrue,
      rf: type.rFalse
    }
  },

  /**
   * @param {Function} callback
   */
  activate: function(callback){
    var row;

    if(this.hide()) return;
    this.getDefaults();

    if(this.html == "" || this.types[0] == "check"){
      row = this.createRow();
      this.html = '@include: ./../../html/filterWindow.html, true';
    }

    this.fw.style.left = 0;
    this.fw.style.top = 0;
    this.fw.innerHTML = this.html;

    this.setDataFilter();
    if(this.types[0] == "multiple") this.bindRowMultipleSelect();
    if(this.types[0] == "date") this.bindRowDateCall();
    this.bindStateFilterButton();
    this.bindSaveFilterButton(callback);
    this.show();
  },

  setDataFilter: function(){
    var state, fs, min, max, value, radio;

    state = this.settings[this.column] != null;

    if(state){
      fs = "filter enabled";
      min = this.settings[this.column].min; min = !min ? this.min : min;
      max = this.settings[this.column].max; max = !max ? this.max : max;
      value = this.settings[this.column].value;
    }else{
      fs = "filter disabled";
      min = this.min;
      max = this.max;
      value = null;
    }

    if(/date|number/.test(this.types[0])){
      this.setDataInput("min", min);
      this.setDataInput("max", max);
    }

    $(this.fw).find('input').nodeArr().forEach((i)=>{
      if(/text|radio/.test(i.type)) i.disabled = !state;
      if(i.type == "checkbox") i.checked = state;
    });

    if(typeof value == "boolean"){
      $(this.fw).find(`input[type="radio"][value="only ${value}"]`).node().checked = true;
    }else{
      $(this.fw).find('input[type="radio"]').node().checked = true;
    }
    $(this.fw).find('table').attr('type', fs);
  },

  setDataInput: function(name, value){
    var input;

    input = $(this.fw).find(`input[name="${name}"]`);
    input.node().value = value;

    if(value == this[name]){
      if(!this.settings[this.column] || value != this.settings[this.column][name]){
        input.class("add", "def");
      }
    }

    if(this.types[0] == "date"){
      if(value == 0) value = 1;
      input.node().value = value;
      input.prev('span').html($c.getNormalDate(value, true).d);
    }

    this.bindOnFocus(input.node());
    this.bindOnBlur(input.node());
  },

  show: function(){
    var w, wp, cp;

    w = this.fw;
    wp = w.getBoundingClientRect();
    cp = this.cp;

    this.setPositionWindow(w, wp, cp);
    this.setPositionSpace(w, wp, cp);
    $(this.cell).attr("style", "background-color: #defadc");
    this.fw.style.visibility = "visible";
  },

  hide: function(){
    var close, cell;

    cell = $(this.table.footer).find('td[filter][style]').node();
    close = cell == this.cell;

    if(cell) cell.removeAttribute("style");
    this.fw.style.visibility = "hidden";

    return close;
  },

  createRow: function(){
    var code = "";

    this.types.forEach((type)=>{
      switch(type){
        case "number":
          code += '@include: ./../../html/numberRow.html, true';
          break;
        case "date":
          code += '@include: ./../../html/dateRow.html, true';
          break;
        case "multiple":
          code += '@include: ./../../html/multipleRow.html, true';
          break;
        case "boolean":
          code += '@include: ./../../html/booleanRow.html, true';
          break;
        case "check":
          code += '@include: ./../../html/checkRow.html, true';
          break;
      }
    });

    return code;
  },

  createOptionList: function(){
    var code = "";

    if(this.column == "status"){
      [ "Необработан", "В порядке", "Торговый", "Арестован",
        "Форумный", "Общий бан", "Заблокирован"
      ].forEach((text, index)=>{
        code += `<div type="option" name="${index}">${text}</div>`;
      });
    }else{
      $(this.table.body).find('input[type="checkbox"]:checked').nodeArr().forEach((box)=>{
        var name;

        name = $(box).up('tr').node().cells[this.cell.cellIndex].textContent;
        code += `<div type="option" class="noSelect" name="${name}">${name}</div>`;
      });
    }

    return code;
  },

  getDefaults: function(){
    var content, type, length, value;

    content = this.table.getContent();
    length = content.length;
    type = this.types[0];

    while(length--){
      value = content[length][this.column];

      if(/boolean|multiple|check/.test(type)) return;
      if(type == "date" && value == 0) continue;

      if(this.min == null) this.min = value;
      if(this.max == null) this.max = value;
      if(this.min > value) this.min = value;
      if(this.max < value) this.max = value;
    }
  },

  setPositionWindow: function(w, wp, cp){
    var halfWidth, offsetLeft, offsetRight;

    halfWidth = (wp.width - cp.width) / 2;
    offsetLeft = cp.left - halfWidth - 2;

    offsetRight = wp.width + offsetLeft;
    if(offsetRight > 1890) offsetLeft = 1890 - wp.width;

    w.style.left = offsetLeft < 0 ? 15 + "px" : offsetLeft + "px";
    w.style.top = cp.top - wp.height - 7 + document.body.scrollTop;
  },

  setPositionSpace: function(w, wp, cp){
    var space, sp, offset, width;

    space =  $(w).find('div').node(-1);
    sp = space.getBoundingClientRect();
    wp = this.fw.getBoundingClientRect();

    width = cp.width - 2;

    if(width > wp.width) width = wp.width - 50;
    if(wp.left == 15 || wp.left + wp.width == 1890){
      offset = cp.left - sp.left - 1;
    }else{
      offset = wp.width / 2 - width / 2;
    }

    space.style.width = width + "px";
    space.style.left = offset + "px";
    space.style.top = wp.height - 2 + "px";
  },

  setRadioState: function(value){
    var radio;

    if(value != null){
      radio = $(this.fw).find(`input[value="only ${value}"]`).node();
    }else{
      radio = $(this.fw).find(`input[value="min-max"]`).node();
    }

    if(radio) radio.checked = true;
  },

  bindOnFocus: function(node){
    var value;

    bindEvent(node, "onfocus", ()=>{
      value = parseInt(node.value, 10);

      if(value == this[node.name]){
        node.value = "";
        $(node).class("remove", "def");
      }
    });
  },

  bindOnBlur: function(node){
    var value;

    bindEvent(node, "onblur", ()=>{
      value = parseInt(node.value, 10);

      if(isNaN(value) || value == this[node.name]){
        node.value = this[node.name];
        $(node).class("add", "def");
      }
    });
  },

  bindRowDateCall: function(){
    $(this.fw)
      .find('span[type="calendarCall"]')
      .nodeArr()
      .forEach(
        function(node){
          $calendar.bind(node);
        }
      );
  },

  bindRowMultipleSelect: function(){
    $(this.fw)
      .find('div[type^="option"]')
      .nodeArr()
      .forEach((node)=>{
        var n, array;

        n = $(node);
        array = this.settings[this.column];
        array = array ? array.value : [];

        if($c.exist(n.attr("name"), array)){
          n.attr("type", "option selected");
        }
        bindEvent(node, 'onclick', ()=>{
          n.attr("type", /selected/.test(n.attr("type")) ? "option" : "option selected");
        });
      });
  },

  bindStateFilterButton: function(){
    this.button = $(this.fw).find('input[name="stateButton"]').node();

    bindEvent(this.button, 'onclick', ()=>{
      var table, input, status;

      status = this.button.checked ? "enabled" : "disabled";
      table = $(this.button).up('table').attr("type", `filter ${status}`);

      table.find('input[type="text"],input[type="radio"]').nodeArr().forEach((input)=>{
        input.disabled = !this.button.checked;
      });
    });
  },

  bindSaveFilterButton: function(callback){
    var save;

    save = $(this.fw).find('input[type="button"]').node();
    bindEvent(save, 'onclick', ()=>{
      var settings, column, mm, v, b, result;

      settings = this.settings;
      column = this.column;

      mm = this.getMinMax();  if(mm) result = mm;
      v = this.getMultiple(); if(v) result = v;
      b = this.getBoolean();  if(b) result = b;

      if(this.button.checked && result){
        settings[column] = result;
        $(this.cell).class("set", "enable");
      }else{
        delete settings[column];
        $(this.cell).class("set", "disable");
      }
      this.hide();
      this.table.saveSettings();
      callback("filter");
    });
  },

  getMinMax: function(){
    var min, max;

    min = $(this.fw).find('input[name="min"]').node();
    max = $(this.fw).find('input[name="max"]').node();

    if(min && max){
      min = Number(min.value);
      max = Number(max.value);

      return min > max ? {type: this.types[0], min: max, max: min} : {type: this.types[0], min: min, max: max};
    }
  },

  getMultiple: function(){
    var result, selector, c;

    result = [];
    c = this.types[0] == "check";
    selector = c ? 'div[type="option"]' : 'div[type="option selected"]';

    $(this.fw).find(selector).nodeArr().forEach((option)=>{
      var v = c ? $(option).attr('name') : Number($(option).attr('name'));
      result.push(v);
    });

    if(result.length){
      return {type: this.types[0], value: result};
    }
  },

  getBoolean: function(){
    var radio;

    radio = $(this.fw).find('input[type="radio"]:checked').node();
    if(/true|false/.test(radio.value)){
      return {type: "boolean", value: /true/.test(radio.value)};
    }
  }
};


/**
 * @param id
 * @param table
 * @param td
 * @param f
 * @param key
 * @returns {Filter}
 */
module.exports = function (id, table, td, f, key){
  return new Filter(id, table, td, f, key);
};