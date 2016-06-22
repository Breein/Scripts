const $ = require('./../../../js/dom.js');
const bindEvent = require('./../../../js/events.js');
const setStyle = require('./../../../js/style.js');
const shadow = require('./../../../js/shadow.js')();

const $c = require('./../../../js/common.js')();

var $items;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
getItems();
createCalculateWindow();
createButton();
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

  bindEvent($('input.ce-cost'), 'onkeyup', calculating);
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

function calculating(){
  var cost, price, _price, item, exp, result = "";

  cost = $('input.ce-cost').node().value;
  cost = Number(cost);
  if(isNaN(cost)) cost = 0;

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