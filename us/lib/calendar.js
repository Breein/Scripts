const bindEvent = require('./events');
const $c = require('./common')();
var $ = require('./dom');

function Calendar(id){
  this.node = $(id).node();
  this.months   = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентрябрь','Октябрь','Ноябрь','Декабрь'];
  this.days     = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  this.date     = parseInt(new Date().getTime() / 1000, 10);
  this.day      = 0;
  this.month    = 0;
  this.year     = 0;
  this.textDay  = "";
  this.textMonth= "";
  this.textYear = "";

  this.codeHeader =
    `<table class="wb" style="margin: 20px 25px;">
      <tr type="header">
        <td type="control">«</td>
        <td type="control" title="Выбрать год" colspan="5" id="gk_calendar_header"></td>
        <td type="control">»</td>
      </tr>
      <tr type="header">
        <td>П</td>
        <td>В</td>
        <td>С</td>
        <td>Ч</td>
        <td>П</td>
        <td>С</td>
        <td>В</td>
      </tr>`;
  this.codeContent = "";
  this.codeFooter =
    ` <tr type="header">
        <td colspan="7" id="gk_calendar_footer"></td>
      </tr>
    </table>`;
}

Calendar.prototype = {

  createContent: function(cDate){
    var code, row, coll, day, fdw, exit, color;

    code = "";
    exit = false;
    fdw = this.getFirstDay();
    day = 1;

    for(row = 0; row < 6; row++){
      if(exit) break;
      code += `<tr>`;

      for(coll = 0; coll < 7; coll++){
        if(row == 0 && coll < fdw){
          code += `<td colspan="${fdw}"></td>`;
          coll = fdw;
        }
        if(day <= this.days[this.month - 1]){
          if(day == this.days[this.month - 1] && coll == 6){
            exit = true;
          }

          this.textDay = day < 10 ? "0" + day : "" + day;
          color = day == day ? 'style="background-color: #d0eed0;"' : '';

          code += `<td type="day" ${color} name="${this.textDay}.${this.textMonth}.${this.textYear}" title="${this.textMonth}/${this.textDay}/${this.textYear} 00:00">${day}</td>`;
          day++;
        }else{
          code += `<td colspan="${7 - coll}"></td>`;
          exit = true;
          break;
        }
      }

      code += `</tr>`;
    }

    this.codeContent = code;
  },

  bind: function(node){
    var calendar = this;

    bindEvent(button, 'onclick', ()=>{calendar.render(node)});
  },

  render: function(node){
    var size, left, top, date;

    if(this.node.style.display == "block"){
      this.node.display = 'none';
      return;
    }
    if(node.nextElementSibling.disabled){
      return;
    }

    size = node.getBoundingClientRect();
    left = size.left + size.width + 10;
    top = size.top - 5;

    this.node.style.left = left + 'px';
    this.node.style.top = top + 'px';
    this.node.style.display = 'block';

    date = Number(node.nextElementSibling.value);

    this.getDate(date);
    this.show(node);
  },

  show: function(node){
    this.isLongYear();
    this.createContent();

    $(this.node).html(this.codeHeader + this.codeContent + this.codeFooter);
    $("#gk_calendar_header").html(`${this.months[this.month - 1]} ${this.textYear}`);
    $("#gk_calendar_footer").html($c.getNormalDate(this.date, true).d);

    this.bindControl(node);
  },

  bindControl: function(node){
    var calendar = this;

    $(this.node)
      .find('td[type="control"],[type="day"]')
      .nodeArr()
      .forEach(
        function(button){
          if(button.getAttribute("type") == "control"){
            if(button.title == "Выбрать год"){
              bindEvent(button, 'onclick', ()=>{calendar.setYear(node)});
            }else {
              bindEvent(button, 'onclick', ()=>{calendar.setMonth(button, node)});
            }
          }else{
            bindEvent(button, 'onclick', ()=>{calendar.setDate(button, node)});
          }
        }
      );
  },

  setMonth: function(button, node){
    if(button.textContent == "«"){
      this.month--;
      if(this.month == 0){
        this.year--;
        this.month = 12;
      }
    }else{
      this.month++;
      if(this.month == 13){
        this.year++;
        this.month = 1;
      }
    }

    this.textMonth = this.month < 10 ? '0' + this.month : "" + this.month;
    this.textYear = this.year < 10 ? '0' + this.year : "" + this.year;

    this.show(node);
  },

  setYear: function(node){
    var year = prompt("Введите поный год");

    if(year == ""){
      this.year = 1970;
      this.month = 1;
      this.textYear = "1970";
      this.textMonth = "01";
    }else{
      year = parseInt(year, 10);
      if(isNaN(year)) year = this.year;

      this.year = year;
      this.textYear = "" + year;
    }

    this.show(node);
  },

  setDate: function(button, node){
    var input, date, _date;

    input = node.nextElementSibling;
    date = button.getAttribute('name');
    _date = Date.parse(button.title) / 1000;

    node.innerHTML = date;
    input.value = _date;

    this.node.style.display = "none";
  },

  getDate: function(date){
    if(date == null){
      date = this.date;
    }
    date = $c.getNormalDate(date, true);
    date = date.d.split('.');


    this.day = Number(date[0]);
    this.month = Number(date[1]);
    this.year = Number(date[2]);
    this.textDay = date[0];
    this.textMonth = date[1];
    this.textYear = date[2];
  },

  getFirstDay: function(){
    var day;

    day = Date.parse(`${this.month}/01/${this.year}`);
    day = new Date(day).getDay();
    day--;
    if(day == -1) day = 6;

    return day;
  },

  isLongYear: function(){
    if(this.year % 4 == 0){
      this.days[1] = 29;
    }else{
      this.days[1] = 28;
    }
  }
};

/**
 * @returns {Calendar}
 */
module.exports = function (){
  var calendar;

  calendar = new Calendar();

  return calendar;
};