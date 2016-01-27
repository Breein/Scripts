var $ = require('./../../../lib/dom');
var request = require('./../../../lib/request');
var bindEvent = require('./../../../lib/events');
var asdfohasdf = require('./html');

var $tb_skills, $tb_levels, $sMeter;

if(location.pathname == "/me/"){
  if(typeof(localStorage) === 'undefined' ){
    alert('Meters [GW]: Ваш браузер не поддерживает LocalStorage(), обновите барузер или удалите скрипт.');
  }else{
    document.head.innerHTML += asdfohasdf.css();
    main();
  }
}

function main(){
  var now_meters, meters, resetButton;

  now_meters = find_now_meters();
  meters = localStorage.getItem('meters');

  if(meters == null){
    meters = now_meters.join("|");
    localStorage.setItem('meters', meters);
  }

  resetButton = $('<table>')
    .html(asdfohasdf.resetButton())
    .node();
  resetButton.setAttribute("align", "right");
  $tb_skills.parentNode.insertBefore(resetButton, $tb_skills.nextSibling);

  bindEvent($('#m_setNewMeters').node(), 'onclick', setNewMeter);

  print_meters(now_meters);
}

function find_now_meters(){
  var tmp_meter, tmp_meters, sind_exp, nobr_sin_exp;
  var i, reg;

  $tb_skills = $('img[src*="skill_combat_pistols.gif"]').up('table').node();
  $tb_levels = $('td[align="right"]:contains("Боевой уровень:")').up('table').node();
  nobr_sin_exp = $('b:contains("Основной синдикат:")').node();

  tmp_meters = [];

  reg = /(.+) \((.+)\)/;
  for(i = 0; i < 3; i++){
    tmp_meter = $tb_levels.rows[i].cells[1].textContent;
    tmp_meter = reg.exec(tmp_meter)[2];
    tmp_meters.push(tmp_meter);
  }

  reg = /(.+) \((.+)\)\+(.+)/;
  for(i = 0; i < 6; i++){
    tmp_meter = $tb_skills.rows[i].cells[1].textContent;
    tmp_meter = reg.exec(tmp_meter)[2];
    tmp_meters.push(tmp_meter);
  }

  reg=/\[ (.+) \((.+)\)(.+)\]/;
  if(nobr_sin_exp){
    nobr_sin_exp = nobr_sin_exp.parentNode;
    $sMeter = $("#sindMeter").node();
    if(!$sMeter){
      nobr_sin_exp.innerHTML += "&nbsp;&nbsp;<span style='font-size: 8px; color: red;' id='sindMeter'>0</span>";
      $sMeter = $("#sindMeter").node();
    }
    sind_exp = nobr_sin_exp.childNodes[3].textContent;
    tmp_meters.push(reg.exec(sind_exp)[2]);
  }else{
    tmp_meters.push(0);
  }

  tmp_meters.push(Math.round(new Date().getTime() / 1000));
  return tmp_meters;
}

function print_meters(now_meters){
  var meters, meter, tmp, how_long, how_long_d;
  var i;

  meters = localStorage.getItem('meters').split("|");

  if($sMeter){
    $sMeter.innerHTML = parseInt(parseFloat(now_meters[9]) - parseFloat(meters[9]), 10);
  }

  for(i = 0; i < 3; i++){
    meter = $tb_levels.rows[i].cells[3];
    meter.setAttribute("align", "right");
    meter.setAttribute("style", "font-size: 8px; color: red;");
    if(i == 2){
      tmp = parseFloat(now_meters[i]) - parseFloat(meters[i]);
      meter.innerHTML = tmp.toFixed(1);
    }else{
      meter.innerHTML = parseInt(parseFloat(now_meters[i]) - parseFloat(meters[i]));
    }
  }

  for(i=0; i < 6; i++){
    meter = $tb_skills.rows[i].cells[2];
    meter.setAttribute("align", "right");
    meter.setAttribute("width", "20");

    tmp = parseFloat(now_meters[i + 3]) - parseFloat(meters[i + 3]);
    tmp = tmp.toFixed(1);
    if(tmp != "0.0"){
      meter.innerHTML = "&nbsp;&nbsp;<span style='font-size: 8px; color: red;'>" + tmp + "</span>";
    }else{
      meter.innerHTML = '<img width="20" src="http://images.ganjawars.ru/i/tbg.gif">';
    }
  }

  how_long = now_meters[10] - meters[10]; how_long = Math.floor((how_long/60)/60);

  if(how_long > 24){
    how_long_d = Math.floor(how_long / 24);
    how_long = Math.floor(how_long % 24);
    how_long = how_long_d + " д. и " + how_long + " ч.";
  }else{
    how_long = how_long + " ч.";
  }

  $("#m_setNewMeters").node().setAttribute("title", "Прошло "+ how_long);
}

function setNewMeter(){
  var now_meters, meters;

  if(confirm("Сбросить счетчики?")){
    now_meters = find_now_meters();
    meters = now_meters.join("|");
    localStorage.setItem('meters', meters);
    print_meters(now_meters);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

