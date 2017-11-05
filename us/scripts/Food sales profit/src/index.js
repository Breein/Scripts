require('./../../../js/protoDelay.js')();

const $ = require('./../../../js/dom.js');
const ajax = require('./../../../js/request.js');
const setStyle = require('./../../../js/style.js');
const bindEvent = require('./../../../js/bindEvents.js');
const shadow = require('./../../../js/shadow.js')();
const $ls = require('./../../../js/ls.js');
const $c = require('./../../../js/common.js')();

setStyle('common.js', '@include: ./../../css/common.css, true');
setStyle("food_sales_profit.js", '@include: ./html/index.css, true');


var $gData, $data, $day;
var $answer, $pid;
var $lootDecode, $lootCode;

$answer = $('<html>').node();

$lootDecode = {
    a: 'HK-53',
    b: 'L83 A1 HG',
    c: 'M84',
    d: 'Ржавая граната RGD-5',
    e:'Маскировочный плащ',
    f:'Титановый пояс',
    g:'Тяжёлые ботинки',
    h:'Шлем 2-го класса',
    i:'Вяленая рыба',
    j:'Грибы',
    k:'Кофейные зёрна',
    l:'Медицинский бинт',
    m:'Походная аптечка',
    n:'Родниковая вода',
    o:'Травяной сбор',
    p:'Стимпак бессмертия',
    q:'Стимпак бессмертия XL',
    r:'Стимпак брони',
    s:'Стимпак брони XL',
    t:'Стимпак скорости',
    u:'Стимпак урона',
    v:'Стимпак урона XL',
    w:'Динамит',
    x:'Журнал «Современное оружие»',
    y:'Книга опыта'
};

$lootCode = {
  'HK-53': 'a',
  'L83 A1 HG': 'b',
  'M84': 'c',
  'Ржавая граната RGD-5': 'd',
  'Маскировочный плащ': 'e',
  'Титановый пояс': 'f',
  'Тяжёлые ботинки': 'g',
  'Шлем 2-го класса': 'h',
  'Вяленая рыба': 'i',
  'Грибы': 'j',
  'Кофейные зёрна': 'k',
  'Медицинский бинт': 'l',
  'Походная аптечка': 'm',
  'Родниковая вода': 'n',
  'Травяной сбор': 'o',
  'Стимпак бессмертия': 'p',
  'Стимпак бессмертия XL': 'q',
  'Стимпак брони': 'r',
  'Стимпак брони XL': 's',
  'Стимпак скорости': 't',
  'Стимпак урона': 'u',
  'Стимпак урона XL': 'v',
  'Динамит': 'w',
  'Журнал «Современное оружие»': 'x',
  'Книга опыта': 'y'
};

$pid = getPlayerID();
loadData();

$day = new Date().toLocaleDateString('en-US') + ' 12:00';
$day = Date.parse($day) / 1000;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPlayerID(){
  var id;

  id = $('a[href*="info.php?id="]').node().href;
  id = id.match(/(\d+)/)[1];
  return id;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $gData = $ls.load('gk_fsp-data');

  if($gData[$pid] == null){
    $gData[$pid] = {
      day: 1,
      profit: 0,
      timestamp: {},
      stop: '',
      money: 0
    };
    saveData();
  }

  $data = $gData[$pid];
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveData(){
  $ls.save('gk_fsp-data', $gData);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

createGUI();


function checkToChangeMoney(node){
  var money;

  money = node.textContent.replace(/,/g, '');
  money = Number(money);

  if($data.money != money){
    $data.money = money;
    getLogData(0, '');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var gui, button, node, money;

  button = $('<span>')
    .html(' » Прибыль: <b id="fst-profit">$0</b><div class="sync-wrap"><div class="sync-button"></div></div><br>')
    .attr('style', 'line-height: 24px;')
    .node();
  money = $('td[valign="top"]').find('#cdiv').node();
  node = $(money).up('b').next('br').node();
  node.parentNode.insertBefore(button, node.nextSibling);

  gui = $('<span>').html('@include: ./html/gui.html, true').node();
  document.body.appendChild(gui);

  bindEvent($('.sync-button'), 'onclick', getLogData, [0, '']);
  bindEvent($('#fst-profit'), 'onclick', openWindow, [gui.firstElementChild]);

  rangeEvents();
  chartColumns($data.day);
  calculateProfit();
  checkToChangeMoney(money);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createCheckLines(count){
  var code, offset, c, s, t;
  var i, k = 1;

  code = '<div class="check-lines-wrap">';
  offset = (211 - count) / count;
  offset = offset.toFixed(2);

  for(i = 0; i < count; i++, k++){
    c = k % 5 == 0 || i == 0 ? ' check-max' : '';
    t = c != '' ? `<div style="position: absolute; margin-top: -7px;">${i + 1}           ${i + 1}</div>` : '';

    code += `<div class="check-line${c}" style="margin-top: ${offset}px;">${t}</div>`;
  }

  code += '</div>';

  return code;
}

function openWindow(w){
  $(w).class('remove', 'hide');
  shadow.open();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLogData(page, text){
  var string, result, count, key, ts, date, tDate;
  var proceed;

  if(page == 0)
    $('.sync-button').class('set', 'sync-button-rotate');


  ajax(`http://www.ganjawars.ru/usertransfers.php?id=${$pid}&page_id=${page}`, "GET", null).then((r)=>{
    $($answer).html(r.text).find('body > nobr').each((nobr, i, max)=>{
      proceed = true;
      string = nobr.textContent;
      result = string.match(/  (.+)   Передано \$(\d+) от (.+) : Приобретение предмета (HK-53|L83 A1 HG|M84|Ржавая граната RGD-5|Маскировочный плащ|Титановый пояс|Тяжёлые ботинки|Шлем 2-го класса|Вяленая рыба|Грибы|Кофейные зёрна|Медицинский бинт|Походная аптечка|Родниковая вода|Травяной сбор|Стимпак бессмертия XL|Стимпак брони XL|Стимпак урона XL|Стимпак брони|Стимпак бессмертия|Стимпак скорости|Стимпак урона|Динамит|Журнал «Современное оружие»|Книга опыта)/);

      if(page == 0 && i == 0){
        text = string;
      }

      if($data.stop == string){
        proceed = false;
        return false;
      }

      if(result != null){
        if(i != max - 1){
          count = $(nobr).next('nobr').text().match(/\[(\d+)\/(\d+)]/);
          if(count != null){
            count = count[1] == count[2] ? 1 : Number(count[1]);
          }else{
            count = 1;
          }
        }else{
          count = 1;
        }

        tDate = result[1].split(' ')[0];
        date = result[1].match(/(\d+)/g);
        date = `${date[1]}/${date[0]}/20${date[2]} 12:00`;
        date = Date.parse(date) / 1000;

        if($data.timestamp[date] == null){
          $data.timestamp[date] = {t: tDate, profit: 0, values: {}};
        }

        ts = $data.timestamp[date];
        key = $lootCode[result[4]];

        if(ts.values[key] == null){
          ts.values[key] = 0;
        }

        ts.values[key] += count;
        ts.profit += Number(result[2]);
      }
    });

    if(proceed){
      page++;
      getLogData.gkDelay(1000, null, [page, text]);
    }else{
      $data.stop = text;
      saveData();
      calculateProfit();
      chartColumns($data.day);
      $('.sync-button-rotate').class('set', 'sync-button');
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculateProfit(){
  var current, i, profit;

  $data.profit = 0;

  for(i = 0, current = $day; i < $data.day; i++, current -= 86400){
    if($data.timestamp[current] != null){
      $data.profit += $data.timestamp[current].profit;
    }
  }

  profit = '$' + $c.convertID($data.profit);

  $('#fst-profit').html(profit);
  $('.days-profit').html(profit);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function chartColumns(value){
  var data, max, current, p, w, h, code, width;
  var i, profit, values, array = [], key;

  width = 596;
  data = $data.timestamp;
  max = 0;
  code = '';

  for(i = 0, current = $day; i < value; i++, current -= 86400){
    values = "";

    if(data[current] != null){
      profit = data[current].profit;

      for(key in data[current].values){
        values += $lootDecode[key] + ': ' + data[current].values[key]+ '\n';
      }
    }else{
      profit = 0;
    }

    array.push({
      profit: profit,
      day: current,
      text: values
    });
    if(max < profit) max = profit;
  }

  max = (max / 90) * 100;
  p = max / 100;

  w = (7 * value) / (width / 100);
  w = (100 - w) / value;
  w = 5.96 * w;

  array.forEach((day)=>{
    profit = day.profit > 0 ? day.profit : '';
    h = parseInt(day.profit / p, 10);
    h = 3 * h;
    code += `<div class="c-chart" style="height: ${h}px; width: ${w.toFixed(2)}px;" title="${day.text}"><div class="chart-money">${profit}</div></div>`;
  });

  array.forEach((day)=>{
    code += `<div class="c-chart-day" style="font-size: 9px; height: 10px; width: ${w.toFixed(2)}px;">${$c.getNormalDate(day.day).d.split('.')[0]}</div>`;
  });

  $('td.wrap').html(code);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function rangeEvents(){
  var node, value, action, counter;

  value = 0;
  node = $('input[type="range"]').node();
  counter = $('span.days-counter').node();

  bindEvent(node, 'onmousedown', down);
  bindEvent(node, 'onchange', change);

  function down(input){
    action = bindEvent(input, 'onmousemove', change);
    bindEvent(input, 'onmouseup', up);
  }

  function change(input){
    if(value == input.value) return;

    value = input.value;
    $data.day = value;
    counter.innerHTML = textDays(value);
    chartColumns(value);
    calculateProfit();
    saveData();
  }

  function up(){
    action.unBind();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function textDays(value){
  var text;

  if(value == 1 || value == 21){
    text = ' день';
  }else if(value <= 4 || value >= 22 && value <= 24){
    text = ' дня';
  }else{
    text = ' дней';
  }

  return value + text;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////