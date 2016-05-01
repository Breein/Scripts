var $ = require('./../../../js/dom.js');
var ajax = require('./../../../js/request.js');

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

  subject = $('div:contains("~Тема:")').find('b').text();
  subject = subject.replace(/&quot;|&quot|&quo|&qu|&q|&/g, '"');

  if(subject.match(/\[ Покупка ] (.+)|\[ Аренда ] (.+)/)){
    action = /Покупка/.test(subject) ? "sell" : "rent";
    if(subject.lastIndexOf('"') == subject.length) subject += " ";
    sp = subject.indexOf("]") + 2;
    ep = subject.lastIndexOf(" ");
    sendName = subject.substr(sp);
    itemName = subject.substring(sp, ep);
    itemName = itemName.replace(/ \[(.+)]/, "");

    id = $items.names[itemName];
    if(id == null) return;

    advert = $adverts[`${id}-${action}`];
    if(advert == null) return;

    name = $('td:contains("От:")').next('td').find('a');
    url = name.node().href;
    name = name.text();

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

    ajax(url, "GET", null).then((r)=>{
      island = $($answer).html(r.text).find('b:contains("Район:")').next('a').node();
      $('#asi_island').node().appendChild(island);
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function insertData(){
  var name, options;

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
  $('#for_money_id').node().value = $data.price;

  if($data.price != 0){
    if($data.action == "sell"){
      $('#send1').node().checked = true;
    }else{
      $('#noreturn').node().checked = true;
      $('input[name="owned_time"]').node().value = $data.termRent;
    }
  }

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
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////