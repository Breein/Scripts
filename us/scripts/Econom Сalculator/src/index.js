const $ = require('./../../../js/dom.js');
const bindEvent = require('./../../../js/events.js');
const setStyle = require('./../../../js/style.js');
const shadow = require('./../../../js/shadow.js')();

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');

var $items, $data;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
loadData();
getItems();
createCalculateWindow();
createButton();
calculateReceived();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculateReceived(){
  var receive, item, items, id, name, mod, price, durability, refund, expCost, info, insert;
  var art, eunCost;

  receive = $('b:contains("Получено")');
  if(receive.length == 0) return;

  items = $ls.load('gk_acfd_items');
  if(!items) return;

  receive = receive.up('table').node();
  item = $(receive).find('a[href*="item.php"]').node();
  name = item.textContent;
  item = item.href.split('?')[1];

  id = item.split('&');
  if(id.length > 1){
    mod = true;
  }else{
    mod = name.match(/\[[A-Za-z]+]/g);
    mod = mod != null;
  }
  id = id[0].match(/item_id=(.+)/)[1];

  item = items.gos.items[id];
  if(!item){
    item = items.art.items[id];
    art = true;
    if(!item) return;
  }

  insert = $(receive).find('li:contains("~Прочность:")').node();

  price = $(receive).find('li:contains("~Цена:")').text();
  price = price.split('$')[1];
  price = Number(price.replace(/,/g, ''));

  durability = insert.textContent;
  durability = durability.split('/')[1];
  durability = Number(durability);

  if(!art){
    refund = getRefund(durability, item);
    if(mod) refund[1] += 2000;
    expCost = getExpCost(price, refund[0], refund[1]);

    /////////////////////////////
    info = $('<span>').html(
      `<li> Опыт: <b>${$c.convertID(refund[1])}</b> exp. по <b>$${expCost}</b> за ед.</li>
     <li> Возврат: <b>$${$c.convertID(refund[0])}</b></li>`
    ).node();
    insert.parentNode.insertBefore(info, insert);
    /////////////////////////////

  }else{
    eunCost = parseInt(price / item[4], 10);

    /////////////////////////////
    info = $('<span>').html(
      `<li> Стоимость: <b>${item[3]}</b> EUN</li>
     <li> Возврат: <b>${item[4]}</b> EUN по курсу <b>$${$c.convertID(eunCost)}</b> за 1 EUN</li>`
    ).node();
    insert.parentNode.insertBefore(info, insert);
    /////////////////////////////
  }

  function getRefund(dur, item){
    var durability, refund, exp, durLeft;

    refund = item[4];
    exp = item[5];
    durability = item[6];

    durLeft = durability[0] - dur;

    if(durLeft <= 0){
      return [refund[0], exp[0]];
    }

    if(durLeft < durability[2]){
      return [
        parseInt(refund[0] - durLeft * refund[2], 10),
        parseInt(durLeft * exp[2] + exp[0], 10)
      ];
    }

    if(durLeft >= durability[2]){
      return [refund[1], exp[1]];
    }
  }
  /////////////////////////////

  function getExpCost(price, refund, exp){
    var cost;

    cost = price - refund;
    cost = cost / exp;
    cost = cost.toFixed(1);
    cost = parseFloat(cost);

    return cost;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createButton(){
  var button, node;

  node = $('a[href*="forum.php"]').node();
  button = $('<span>').html('@include: ./html/startButton.html, true').node();

  node.parentNode.insertBefore(button, node.nextSibling);
  bindEvent(button.firstElementChild, "onclick", openCalculatorWindow);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openCalculatorWindow(){
  shadow.open();
  $("#ec_calculatorWindow").class("remove", "hide");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createCalculateWindow(){
  var gui, html = '', c;

  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('econom_calculator.js', '@include: ./html/index.css, true');

  gui = $('<span>').attr("type", "gui").html('@include: ./html/gui.html, true').node();
  document.body.appendChild(gui);

  $items.forEach((item, n)=>{
    c = n == 0 ? "light no-b-top" : "light";
    html += '@include: ./html/itemsRow.html, true';
  });

  $(gui)
    .find('div.ec-content-scroll')
    .find('table')
    .html(html)
    .find('input[type="checkbox"]')
    .each((input)=>{
      bindEvent(input, 'onclick', calculating);
    });

  bindEvent($('input.ec-cost'), 'onkeyup', calculating);
  bindEvent($('input.ec-cost-sell'), 'onkeyup', saveCostSell);
  bindEvent($(`td.check-all`), 'onclick', checkingAll);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkingAll(button){
  var state;

  if(/checked/.test(button.className)){
    $(button).class('remove', 'checked');
    state = false;
  }else{
    $(button).class('add', 'checked');
    state = true;
  }

  $('#ec_calculatorWindow')
    .find('input[type="checkbox"]')
    .each((input)=>{
      input.checked = state;
    });

  calculating();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveCostSell(input){
  var cost;

  cost = input.value;
  cost = Number(cost);
  if(isNaN(cost)) cost = 0;

  if(cost != $data.costSell){
    $data.costSell = cost;
    saveData();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculating(input){
  var cost, price, _price, item, exp, result = "";

  cost = input.value;
  cost = Number(cost);
  if(isNaN(cost)) cost = 0;

  if(cost != $data.cost){
    $data.cost = cost;
    saveData();
  }

  _price = 0;
  exp = 0;

  $('#ec_calculatorWindow')
    .find('input[type="checkbox"]:checked')
    .each((input)=>{
      item = $items[Number(input.name.split('-')[1])];
      price = parseInt(item.exp * cost + item.money , 10);
      _price += price;
      exp += item.exp;

      result += `${item.name} [$${$c.convertNumber(item.money)}, ${item.exp} exp], цена: $${$c.convertNumber(price)} гб; \n`;
    });

  result += `
    Всего опыта: ${$c.convertNumber(parseInt(exp, 10))} по курсу $${cost} за 1 ед.экнома.
    Полная цена: $${$c.convertNumber(_price)} гб.`;

  $('#ec-result').html(result);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getItems(){
  $items = [];

  $('td.txt:contains("~ exp)")').each((td)=>{
    var item, name, href, sell, money, exp;

    item = td.cellIndex == 0 ?
      $(td).up('tr').prev('tr').find('b').up('a').node() :
      $(td).prev('td').find('b').up('a').node();

    name = item.textContent;
    href = item.href;
    sell = $(td).find('li:contains("~ exp)")');

    if(sell.length){
      sell = sell.text();
      sell = sell.match(/Продать \[ \$(.+) \(\+(.+) exp\) ]/);
    }else{
      sell = $(td).find('a:contains("Продать")').node();
      sell = sell.nextSibling.textContent;
      sell = sell.match(/ \[ \$(.+) \(\+(.+) exp\) ]/);
    }

    if(sell){
      money = sell[1].replace(/,/g, "");
      money = Number(money);
      exp = parseFloat(sell[2]);

      if(exp > 99){
        $items.push({
          name: name,
          href: href,
          money: money,
          exp: exp
        });
      }
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $data = $ls.load('gk_EconomCalculator_data');

  if($data.costSell == null){
    $data.cost = 0;
    $data.costSell = 0;
    saveData();
  }
}

function saveData(){
  $ls.save('gk_EconomCalculator_data', $data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////