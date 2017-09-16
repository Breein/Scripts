var $ = require('./../../../js/dom.js');
var ajax = require('./../../../js/request.js');
var bindEvent = require('./../../../js/events.js');

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var $answer, $adverts, $items, $data, $expire, $password;

$expire = 180;
$password = "";
$items = $ls.load("gk_acfd_items");
$adverts = $ls.load("gk_acfd_adverts");
$answer = $('<span>').node();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(location.pathname == "/sms-read.php"){
  getAdvertIntoMail();
}

if(location.pathname == "/home.senditem.php"){
  insertData();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getAdvertIntoMail(){
  var subject, name, itemName, sendName, sp, ep, id, advert, action, url, island;

  subject = $('td[class="greenbg"]:contains("~Тема:")').find('b').text();
  subject = subject.replace(/&laquo;/g, '«');
  subject = subject.replace(/&raquo;|&raquo|&raqu|&raq|&ra|&r/g, '»');
  subject = subject.replace(/&quot;|&quot|&quo|&qu|&q|&/g, '"');

  if(subject.match(/\[ Покупка ] (.+)|\[ Аренда ] (.+)/)){
    action = /Покупка/.test(subject) ? "sell" : "rent";
    if(subject.lastIndexOf('"') == subject.length) subject += " ";
    sp = subject.indexOf("]") + 2;
    ep = subject.lastIndexOf(" ");
    sendName = subject.substr(sp);
    itemName = subject.substring(sp, ep);
    itemName = itemName.replace(/ \[(.+)]/, "");

    name = $('td:contains("От:")').next('td').find('a');
    url = name.node().href;
    name = name.text();

    id = $items.names[itemName];
    if(id == null){
      insertIsland();
      return;
    }

    advert = $adverts[`${id}-${action}`];
    if(advert == null) {
      insertIsland();
      return;
    }

    $data = {
      action: advert.action,
      name: name,
      id: id,
      sendName: sendName,
      price: advert.price,
      termRent: advert.termRent,
      expire: $c.getTimeNow() + $expire
    };

    $ls.save("gk_asi_data", $data);
    $('td:contains("~Тема:")').up('table').html('@include: ./html/sendRow.html, true', true);
    insertIsland();
  }else{
    url = $('td:contains("От:")').next('td').find('a').node().href;
    insertIsland();
  }

  function insertIsland(){
    var node = $('#asi_island').node();

    if(node == null){
      $('td:contains("~Тема:")').up('table').html('@include: ./html/islandRow.html, true', true);
      node = $('#asi_island').node();
    }

    ajax(url, "GET", null).then((r)=>{
      island = $($answer).html(r.text).find('b:contains("Район:")').next('a').node();
      node.appendChild(island);
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertData(){
  var name, options, ot, cost;

  $data = $ls.load("gk_asi_data");

  if($c.getTimeNow() > $data.expire) return;
  options = $('option');

  if(!selectItem(new RegExp($data.sendName), "textContent")){
    name = $data.sendName;
    name = name.substring(0, name.lastIndexOf(" "));

    if(!selectItem(new RegExp(name), "textContent")){
      selectItem(new RegExp($data.id), "value");
    }
  }

  $('#username').node().value = $data.name;
  cost = $('#for_money_id').node();
  cost.value = $data.price;

  if($data.price != 0){
    if($data.action == "sell"){
      $('#send1').node().checked = true;
    }else{
      $('#noreturn').node().checked = true;
      ot = $('input[name="owned_time"]').node();
      ot.value = $data.termRent;

      if($data.termRent != 0)
        cost.value = $data.price * $data.termRent;

      bindEvent(ot, 'onkeyup', reCalcCost, [cost]);
    }
  }

  //owned_time

  if($password != ""){
    $('input[name="sendkey"]').node().value = $password;
  }

  window.update_selector();
  /////////////////////////////

  function selectItem(text, key){
    var select = false;

    options.each((option)=>{
      if(text.test(option[key])){
        option.selected = true;
        select = true;
      }
    });

    return select;
  }
  /////////////////////////////

  function reCalcCost(cost, input){
    var time;

    time = parseFloat(input.value);
    if(isNaN(time)) return;
    cost.value = $data.price * time;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////