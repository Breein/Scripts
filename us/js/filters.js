var $ = require('./dom');
const bindEvent = require('./events');
const $c = require('./common')();
const $calendar = require('./calendar')();

function Filter(id, table, settings){
  this.fw = $(id).node();
  this.table = table;
  this.settings = settings;
  this.min = 0;
  this.max = 0;
  this.value = null;
  this.type = null;
  this.key = null;
  this.element = null;
  this.filter = null;
  this.input = null;
}

Filter.prototype = {
  setPositionWindow: function(w){
    var halfWidth, offsetLeft, offsetRight, ws;

    ws = w.getBoundingClientRect();

    halfWidth = (ws.width - tds.width) / 2;
    offsetLeft = tds.left - halfWidth - 2;

    offsetRight = ws.width + offsetLeft;
    if(offsetRight > 1890) offsetLeft = 1890 - ws.width;

    w.style.left = offsetLeft < 0 ? 15 + "px" : offsetLeft + "px";
    w.style.top = tds.top - ws.height - 7 + document.body.scrollTop;
  },

  setPositionSpace: function(){
    var space, ss, ws, offset, width;

    space =  $(this.fw).find('div').node(-1);
    ss = space.getBoundingClientRect();
    ws = this.fw.getBoundingClientRect();

    width = tds.width - 2;

    if(width > ws.width) width = ws.width - 50;
    if(ws.left == 15 || ws.left + ws.width == 1890){
      offset = tds.left - ss.left - 1;
    }else{
      offset = ws.width / 2 - width / 2;
    }

    space.style.width = width + "px";
    space.style.left = offset + "px";
    space.style.top = ws.height - 2 + "px";
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
  }


};


/**
 * @param id
 * @param table
 * @param settings
 * @returns {Filter}
 */
module.exports = function (id, table, settings){
  return new Filter(id, table, settings);
};


function openFilters(key, td, settings, type, text){
  var state, window, code, row, tds;

  type = typeof type == "object" ? type : [type];

  window = $('#sf_filtersWindow').node();
  window.style.left = 0;
  window.style.top = 0;

  state = {
    element: settings[key] == null ? 'disabled' : 'enabled',
    filter: settings[key] == null ? '' : 'checked',
    input: settings[key] == null ? 'disabled' : '',
    min: settings[key].min,
    max: settings[key].max,
    value: settings[key].value
  };

  tds = td.getBoundingClientRect();

  row = createRow(type, text, state);
  code = '@include: ./html/filterWindow.html';
  $(window).html(code);

  setPositionWindow(window);
  setPositionSpace(window);
  setRadioState(window, state.value);
  bindEvents(window, type[0]);

  $(td).attr("style", "background-color: #defadc");

  if($cd.filterNode != td){
    if($cd.filterNode) $cd.filterNode.removeAttribute("style");
    $cd.filterNode = td;

    window.style.visibility = "visible";
  }else{
    if(window.style.visibility == "visible"){
      td.removeAttribute("style");
      window.style.visibility = "hidden";
    }else{
      window.style.visibility = "visible";
    }
  }
  /////////////////////////////

  function getMaxMin(list){
    var key, values = $cd.values.stats;
    var keys, length;

    keys = Object.keys(list);
    length = keys.length;

    while(length--){
      key = keys[length];

      if(key == 'date' || key == 'enter' || key == 'exit' || key == 'goAway') {
        if(list[key] == 0) continue;
      }

      if (values[key][1] == -1) values[key][1] = list[key];
      if (values[key][2] == -1) values[key][2] = list[key];
      if (values[key][1] > list[key]) values[key][1] = list[key];
      if (values[key][2] < list[key]) values[key][2] = list[key];
    }
  }



  /////////////////////////////

  function createRow(type, text, state){
    var code = "", min, max, value;

    min = state.min;
    max = state.max;
    value = state.value;

    type.forEach((type)=>{
      switch(type){
        case "number":
          code += '@include: ./html/numberRow.html';
          break;
        case "date":
          if(min == 0) min = 1;
          if(max == 0) max = 1;
          code += '@include: ./html/dateRow.html';
          break;
        case "multiple":
          code += '@include: ./html/multipleRow.html';
          break;
        case "boolean":
          code += '@include: ./html/booleanRow.html';
          break;
        case "check":
          code += '';
          break;
      }
    });

    return code;
  }
  /////////////////////////////

  function bindEvents(w, type){
    var filter, save;

    if(type == "date"){

    }

    if(type == "multiple"){
      $(w)
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
    }

    filter = $(w).find('input[type="checkbox"][name="modeFilter"]').node();
    bindEvent(filter, 'onclick', ()=>{
      var table, input, status;

      status = filter.checked ? "enabled" : "disabled";
      table = $(filter).up('table').attr("type", `filter ${status}`);

      table.find('input[type="text"],input[type="radio"]').nodeArr().forEach((input)=>{
        input.disabled = !filter.checked;
      });
    });

    save = $(w).find('input[type="button"]').node();
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
}