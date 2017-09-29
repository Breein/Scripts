// ==UserScript==
// @name        Add To Sell [GW]
// @author      гном убийца
// @description Автоматическая подача объявлений на ДО по автопродаже. (01.10.16.1520)
// @include     http://www.ganjawars.ru/market-i.php
// @version     1.4
// ==/UserScript==


(function() {

  var password_sell = 'd99924d';

  var aSpan = DCE('span');
  var table = findMainTable(BTN('table'));
  var data = {};

  var haha = table.getElementsByTagName('input')[1].value;
  var lopata = table.getElementsByTagName('input')[2].value;
  var list = table.getElementsByTagName('option');

  var $items, $cost, $tr, $prices;

  bindEvent(BTN('select')[0], 'onchange', calcEco);
  calcEco();
  loadPrices();
  //console.log(haha);

  for(var i= 0, len = list.length-1; i < len; i++){
    type = /(\d+)_(\d+)_(.+)/.exec(list[i].value)[3];
    if(data[type] == null){
      data[type] = {};
    }
    data[type][list[i].value] = {name:list[i].textContent};
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var value;
  var st = 'style="text-decoration: none;"';
  var nTable = DCE('span');
  var html = '<br></a><table class="wb" width="600" align="center"><tr height="25"><td colspan="4" class="wb" style="text-align: center; background-color: #d0eed0;">Продажа вещей</td></tr>' +
    '<tr height="25" style="background-color: #d0eed0;"><td class="wb" style="text-align: center;">Предмет</td><td class="wb" style="text-align: center; width: 90px;">Найти</td><td class="wb" style="text-align: center;">Кол-во</td><td class="wb" style="text-align: center;" width="172">Цена</td></tr>';
  var count = 0;

  for(var i in data){
    var amount = 0;
    var name = '';

    value = $prices[i] ? ('value="' + $prices[i] + '" ') : "";

    for(var j in data[i]){
      amount++
    }

    var color = count % 2 ? 'bgcolor="#f8faf8"' : 'bgcolor="#e7f8e7"';

    name = data[i][j].name.split(' [')[0];

    html += '<tr height="25" '+color+'>'+
      '<td class="wb">&nbsp;'+
      '<a target="_blank" href="http://www.ganjawars.ru/item.php?item_id='+i+'">'+name+'</a> '+
      '</td><td class="wb">&nbsp;'+
      '<a '+st+' target="_blank" href="http://www.ganjawars.ru/market.php?stage=2&item_id='+i+'&action_id=1&island=-1">[ALL]</a> '+
      '<a '+st+' target="_blank" href="http://www.ganjawars.ru/market.php?stage=2&item_id='+i+'&action_id=1&island=1">[Z]</a> '+
      '<a '+st+' target="_blank" href="http://www.ganjawars.ru/market.php?stage=2&item_id='+i+'&action_id=1&island=0">[G]</a>'+
      '</td><td class="wb" style="text-align: center;">'+amount+'</td><td class="wb" align="center";><input type="text" id="'+i+'_price" ' + value + '></td></tr>';

    count++;
  }

  html += '<tr height="30"><td colspan="4" class="wb" style="text-align: center; background-color: #d0eed0;"><input type="button" class="mainbutton" value="Выставить предметы" id="button_sell_all"></td></tr></table>';

  nTable.innerHTML = html;

  table.parentNode.insertBefore(nTable, table.nextSibling);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  if($prices.count) startSell();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  bindEvent(BID('button_sell_all'), 'onclick', startSell);

  function startSell(){
    var dataSell = [];

    for(var i in data){
      var price = parseInt(BID(i+'_price').value, 10);
      if(!isNaN(price) && price > 0){
        $prices[i] = price;
        $prices.count++;

        for(var j in data[i]){
          dataSell.push({id:j, price:price});
        }
      }
    }

    BID('button_sell_all').disabled = true;
    sell_all_slow(dataSell, 0, dataSell.length);
    savePrices();
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function calcEco(){
    var item, id, d, exp, refund, result, node, name, mod;

    if(!$items){
      $items = localStorage.getItem("gk_acfd_items");
      if(!$items == null) return;
      $items = JSON.parse($items);
      $items = $items.gos.items;
    }

    if(!$cost){
      $cost = localStorage.getItem("gk_EconomCalculator_data");
      if(!$cost == null) return;
      $cost = JSON.parse($cost);
      if($cost.costSell == null) return;
      $cost = $cost.costSell;
    }

    item = document.querySelector("option:checked");
    id = item.value.match(/(\d+)_(\d+)_(.+)/)[3];
    d = item.textContent.split("/")[1].split("]")[0];
    d = Number(d);

    name = item.textContent;
    mod = name.match(/\[[A-Za-z]+]/g);
    mod = mod != null ? mod.length : 0;
    mod = 2000 * mod;

    node = BID("gk_ads_eco");

    if(!$items[id]){
      if(node) BID("gk_ads_eco").innerHTML = "";
      return;
    }

    if(!node){
      $tr = document.createElement('tr');
      $tr.innerHTML = '<td class="wb" bgcolor="#d0eed0" align="right" height="30">Стоимость эконома:</td><td class="wb" id="gk_ads_eco" style="cursor: pointer;" title="Подставить цену"></td>';
      table.rows[4].parentNode.insertBefore($tr, table.rows[4]);
      node = BID("gk_ads_eco");

      bindEvent(node, "onclick", addPrice);
    }

    refund = getRefund(d, $items[id]);
    refund[1] = refund[1] + mod;

    result = `${parseInt(refund[1] * $cost + refund[0], 10)} гб. (${$cost}, $${refund[0]}, ${refund[1]})`;

    node.innerHTML = result;
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function addPrice(){
    var money;

    money = BID("gk_ads_eco").textContent;
    money = money.split(" гб");
    if(!money == null) return;

    money = Number(money[0]);
    document.querySelector('input[name="submitprice"]').value = money;
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function getRefund(dur, item){
    var durability, refund, exp, durLeft;

    durability = item[6];
    refund = item[4];
    exp = item[5];

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function sell_all_slow(dataSell, index, length){
    if(index < length){
      BID('button_sell_all').value = "Выставляю... " + (index+1) + "/" + length;

      var param = '';

      if(password_sell == ''){
        param = `stage=1&ne_nado_eto_avtomatizirovat=${haha}&lpt=${lopata}&item_iid=${dataSell[index].id}&action_id=1&submitprice=${dataSell[index].price}`;
      }else{
        param = `stage=1&ne_nado_eto_avtomatizirovat=${haha}&lpt=${lopata}&item_iid=${dataSell[index].id}&action_id=1&submitprice=${dataSell[index].price}&tr_pass=${password_sell}`;
      }

      REQ('http://www.ganjawars.ru/market-i.php', 'POST', param, false, function (req) {aSpan.innerHTML = req.responseText;});

      if(aSpan.getElementsByTagName('center')[2].textContent.indexOf('успешно размещено') == -1){
        console.log('Error!\n' + aSpan.getElementsByTagName('center')[2].textContent + '\nIndex:' + dataSell[index]);

        BID('button_sell_all').value = "Завершено, но не до конца :(";

        setTimeout(function(){
          location.href = "http://www.ganjawars.ru/market-i.php";
        }, intervalRandom(8, 20));
        return;
      }

      index++;
      setTimeout(function(){sell_all_slow(dataSell, index, length)}, intervalRandom(30, 50));
    }else{
      $prices = {count: 0};
      savePrices();

      BID('button_sell_all').value = "Завершено";
    }
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function REQ(url, method, param, async, onsuccess, onfailure) {
    var request = new XMLHttpRequest();

    request.open(method, url, async);
    if (method == 'POST') request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(param);

    if (async == true) {
      request.onreadystatechange = function(){
        if (request.readyState == 4 && request.status == 200 && typeof onsuccess != 'undefined'){
          onsuccess(request);
        }else if (request.readyState == 4 && request.status != 200 && typeof onfailure != 'undefined') onfailure(request);
      }
    }

    if (async == false) {
      if (request.status == 200 && typeof onsuccess != 'undefined') onsuccess(request);
      else if (request.status != 200 && typeof onfailure != 'undefined') onfailure(request);
    }
  }

  function findMainTable(tables){
    for(var i=tables.length - 1, len = 0; i > len; i-- ){
      if(tables[i].cellPadding == 3 && tables[i].width == 600 && tables[i].align == 'center'){
        return tables[i];
      }
    }
    return null;
  }

  function bindEvent(element, event, callback) {
    if (!element) {
      return;
    }
    if (element.addEventListener) {
      if (event.substr(0, 2) == 'on') {
        event = event.substr(2);
      }
      element.addEventListener(event, callback, false);
    } else if (element.attachEvent) {
      if (event.substr(0, 2) != 'on') {
        event = 'on'+event;
      }
      element.attachEvent(event, callback, false);
    }
    return;
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function loadPrices(){
    var prices;

    prices = localStorage.getItem("gk_ats_prices");
    if(prices == null){
      $prices = {count: 0};
      savePrices();
    }else{
      $prices = JSON.parse(prices);
    }
  }

  function savePrices(){
    localStorage.setItem("gk_ats_prices", JSON.stringify($prices));
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function Random(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min;}
  function intervalRandom(min, max){return Number(Random(min, max) + "" + Random(10, 99));}

  function BID(id){return window.document.getElementById(id)};
  function BTN(name){return window.document.getElementsByTagName(name)};
  function DCE(elem){return document.createElement(elem)};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
})();