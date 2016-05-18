require('./../../../js/protoDelay.js')();
const $ = require('./../../../js/dom.js');
const bindEvent = require('./../../../js/events.js');
const ajax = require('./../../../js/request.js');
const setStyle = require('./../../../js/style.js');

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');

var $data, $answer, $tooltip, $add;

$answer = $('<span>').node();
$add = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

loadData();
addCallReset();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function update(){
  var time;

  time = $c.getTimeNow();

  if($data.time < time){
    if(!$add){
      setStyle('common.js', '@include: ./../../css/common.css, true');
      setStyle('auto_carma.js', '@include: ./html/index.css, true');
      bodyScroll();
      addTooltip();
      $add = true;
    }
    getPlayerInfo();
  }else{
    update.gkDelay(30000);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addCallReset(){
  bindEvent(document.body, "onkeyup", call, [], this, true);

  function call(n, e){
    if(e.keyCode == 82 && confirm("     Auto carma [GW]:\n\nЗапустить настройки?"))
      loadData(true);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addTooltip(){
  var top = window.innerHeight + 10;

  $tooltip = $('<div>')
    .attr("style", `top: ${top}px;`)
    .attr("id", "AC_tooltip")
    .class("set", " hide")
    .node();

  document.body.appendChild($tooltip);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bodyScroll(){
  if(window.scrollMaxY == 0) $('body').class("add", "scroll-hide");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function hide(){
  var top;
  top = window.innerHeight + 10;

  $tooltip.style.top = top + "px";
  $($tooltip).class("set", " hide");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function show(now, max, top){
  if(now == 0) $($tooltip).class("remove", "hide");
  if(now < max){
    top = top - 4;
    now++;

    $tooltip.style.top = top + "px";
    show.gkDelay(35, null, [now, max, top]);
  }else{
    hide.gkDelay(2000);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPlayerInfo(){
  var carma, name, level, go, top, blocked;

  ajax("http://www.ganjawars.ru/info.php?id=" + $data.id, "GET", null).then((r)=>{
    if(!/Internal error: failed to read user data/.test(r.text)){
      name = $($answer).html(r.text).find('#namespan').text();
      level = $($answer).find('tr:contains("~Боевой:")').find("font").text();
      blocked = $($answer).find('font[color="red"]:contains("Персонаж заблокирован")').node();

      if(!blocked){
        carma = $($answer).find('b:contains("Карма:")');

        if(carma.length != 0){
          carma = carma.up('tr').find('div');

          if(carma.length != 0){
            go = carma.find('a[title="Отправить Ваш голос: 3"]').node();
            carma = carma.up('tr').find('b:contains("Карма:")').next('font').text();
            carma = Number(carma);

            if($data.carma.min <= carma && carma <= $data.carma.max){
              showTooltip(name, level, `<span style="color: #009900;">${carma} [подходит]</span>`);
              setCarma.gkDelay($c.randomNumber(3200, 3500), null, [go]);
            }else{
              showTooltip(name, level, `<span style="color: #990000;">${carma} [не в заданных пределах]</span>`);
              next();
            }
          }else{
            showTooltip(name, level, `<span style="color: #009900;">[нельзя поставить]</span>`);
            next();
          }
        }else{
          showTooltip(name, level, `<span style="color: #000099;">[гость города]</span>`);
          next();
        }
      }else{
        showTooltip(name, level, `<span style="color: #990000;">[заблокирован]</span>`);
        next();
      }
    }else{
      showTooltip("Персонаж удален", "?", " - ");
      next();
    }
  });

  function showTooltip(name, level, carma){
    top =  parseInt($tooltip.style.top, 10) + document.body.scrollTop;
    $tooltip.innerHTML = '@include: ./html/tooltip-character.html, true';
    show(0, 26, top);
  }

  function next(){
    $data.id++;
    saveData();

    getPlayerInfo.gkDelay($c.randomNumber(5000, 8000));
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setCarma(url){
  var top, success, name;

  ajax(url, "GET", null).then((r)=>{
    success = $($answer)
      .html(r.text)
      .find('b:contains("Спасибо, Ваше мнение учтено.")')
      .node();

    if(success){
      name = $(success).up('center').next('a').text();
      top =  parseInt($tooltip.style.top, 10) + document.body.scrollTop;
      $tooltip.innerHTML = '@include: ./html/tooltip-carma.html, true';
      show(0, 23, top);

      $data.id++;
      $data.time = $c.getTimeNow() + $c.randomNumber(1850, 2000);
      saveData();
      update.gkDelay(60000);
    }else{
      alert(`Что то не то, карма не поставлена!\n Отключи скрипт, надо разбираться. [ID: ${data.id}]`);
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(reset){
  var id, min, max;

  $data = $ls.load("gk_ac_data");
  if($data.id == null || reset){
    id = getValue(true, "              Auto carma [GW]\n\nВведите начальный ID игрока:", "id", reset);
    min = getValue(false, "                Auto carma [GW]\n\nВведите минимальный порог кармы:", "min", reset);
    max = getValue(false, "                 Auto carma [GW]\n\nВведите максимальный порог кармы:", "max", reset);

    $data = {
      id: id,
      time: reset ? $data.time : 0,
      carma: {
        min: min,
        max: max
      }
    };

    saveData();
  }

  if(!reset){
    update();
  }

  function getValue(int, text, type, reset){
    var value, v;

    v = reset ? (type == "id" ? $data.id : $data.carma[type]) : 0;
    value = prompt(text, v);
    if(value == "" || value == null) return getValue(int, text, type);
    value = int ? parseInt(value) : parseFloat(value);
    if(isNaN(value) || (type == "id" && value == 0)) return getValue(int, text, type);
    return value;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveData(){
  $ls.save("gk_ac_data", $data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////