var $ = require('./dom.js');
const bindEvent = require('./events.js');
const $c = require('./common.js')();
const $calendar = require('./calendar.js')();

function Filter(id, table, td, f, key){
  this.fw = $(id).node();
  this.table = table;
  this.settings = table.settings.show[table.getName()];
  this.cell = td;
  this.cp = td.getBoundingClientRect();
  this.cellKey = key;
  this.types = this.getTypes(f);
  this.text = this.getText(f);

  this.min = null;
  this.max = null;
  this.html = "";
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
   */
  prepare: function(){
    var row;

    if(this.hide()) return;
    this.getMaxMin();

    if(this.html == ""){
      row = this.createRow();
      this.html = '@include: ./../../html/filterWindow.html';
    }
    this.fw.style.left = 0;
    this.fw.style.top = 0;
    this.fw.innerHTML = this.html;

    this.setDataFilter();
    this.bindStateFilterButton();
    this.show();
  },

  setDataFilter: function(){
    var state, fs, min, max, value, radio;

    state = this.settings[this.cellKey] != null;

    console.log(state);

    if(state){
      fs = "filter";
      min = this.settings[this.cellKey].min;
      max = this.settings[this.cellKey].max;
      value = this.settings[this.cellKey].value;
    }else{
      fs = "filter disabled";
      min = this.min;
      max = this.max;
      value = null;
    }

    $(this.fw).find('input').nodeArr().forEach((i)=>{
      if(/text|radio/.test(i.type)) i.disabled = !state;
      if(i.name == "min"){
        i.value = min;
        if(this.min == min){
          i.className = i.className + " def";
        }
        if(this.types[0] == "date") i.previousElementSibling.innerHTML = $c.getNormalDate(min, true).d;
      }
      if(i.name == "max"){
        i.value = max;
        if(this.types[0] == "date") i.previousElementSibling.innerHTML = $c.getNormalDate(max, true).d;
      }
      if(i.type == "checkbox") i.checked = state;
    });

    $(this.fw).find('input[type="radio"]').node().checked = true;
    $(this.fw).find('table').attr('type', fs);
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
          code += '@include: ./../../html/numberRow.html';
          break;
        case "date":
          code += '@include: ./../../html/dateRow.html';
          break;
        case "multiple":
          code += '@include: ./../../html/multipleRow.html';
          break;
        case "boolean":
          code += '@include: ./../../html/booleanRow.html';
          break;
        case "check":
          code += '';
          break;
      }
    });

    return code;
  },

  getMaxMin: function(){
    var content, type, length, value;

    content = this.table.getContent();
    length = content.length;
    type = this.types[0];

    while(length--){
      value = content[length][this.cellKey];

      if(/boolean|multiple|check/.test(type)) return;
      if(type == "date") if(content[this.cellKey] == 0) continue;

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
        var n = $(node);

        if($c.exist(n.attr("name"), $ss.show.stats.status)){
          n.attr("type", "option selected");
        }
        bindEvent(node, 'onclick', ()=>{
          n.attr("type", /selected/.test(n.attr("type")) ? "option" : "option selected");
        });
      });
  },

  bindStateFilterButton: function(){
    var filter;

    filter = $(this.fw).find('input[name="stateButton"]').node();
    bindEvent(filter, 'onclick', ()=>{
      var table, input, status;

      status = filter.checked ? "enabled" : "disabled";
      table = $(filter).up('table').attr("type", `filter ${status}`);

      table.find('input[type="text"],input[type="radio"]').nodeArr().forEach((input)=>{
        input.disabled = !filter.checked;
      });
    });
  },

  bindSaveFilterButton: function(){
    var save;

    save = $(this.fw).find('input[type="button"]').node();
    bindEvent(save, 'onclick', ()=>{
      var mode, radio, values, min, max;

      mode = $(w).find('input[name="modeFilter"]:checked').node();
      if(mode){
        radio = $(w).find('input[type="radio"]:checked').node();
        if(!radio) return;

        if(radio.value == "min-max"){
          if(radio.name == "status"){
            values = [];
            $(w).find('div[type="option selected"]').nodeArr().forEach((option)=>{
              values.push(Number($(option).attr('name')));
            });
            if(values.length){
              settings[key] = {value: values};
            }
          }else{
            values = $(w).find('input[type="text"]').nodes();
            min = Number(values[0].value);
            max = Number(values[1].value);

            if(min > max){
              min = max;
              max = Number(values[0].value);
            }

            settings[key] = {min: min, max: max};
          }
        }else{
          settings[key] = {value: /true/.test(radio.value)};
        }
      }else{
        delete settings[key];
      }
      console.log($ss);
    });
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