require('./../../../js/protoDelay.js')();

var $ = require('./../../../js/dom.js');
var bindEvent = require('./../../../js/events.js');
var ajax = require('./../../../js/request.js');
var setStyle = require('./../../../js/style.js');

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');


var $password = "d99924d";
var $answer, $data, $settings, $islands, $texts, $i;

$texts = {
  island: {
    "-1": "Не имеет значения",
    "0": "[G] Ganja Island",
    "1": "[Z] Z-Land",
    "2": "[S] Santa Maria",
    "3": "[O] Outland",
    "4": "[P] Palm Island"
  }
};

$answer = $('<span>').node();
$data = {};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
loadData();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


switch(location.pathname){
  case "/me/":
    createSettingsGUI();
    break;

  case "/item.php":
    createAddItemGUI();
    break;

  case "/object.php":
  case "/market.php":
  case "/market-i.php":
    switch($data.status){
      case "off":
        waitScriptIsOn();
        break;

      case "wait":
      case "post-on-sell":
        checkItems();
        break;

      case "get-price":
        getCurrentPrice();
        break;

      case "remove-item":
        checkRemoveItem();
        break;

      case "get-items":
        getItemAnObject();
        break;

      case "get-items: done":
        goToSell();
        break;
    }
    break;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createAddItemGUI(){
  var gui, row, ra, rn;
  var id, name;

  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('mt.js', '@include: ./html/index.css, true');

  id = location.search.match(/\?item_id=(.+)/)[1];
  if(/&/.test(id)) id = id.split('&')[0];
  name = $('b:contains("Вес:")').up('table').find('font[color="#990000"]').text();

  rn = '@include: ./html/addItemRow.html, true';
  ra = '@include: ./html/addItemRow-added.html, true';
  row = $settings.items[id] == null ? rn : ra;
  gui = $('<span>').attr("type", "mt_gui").html('@include: ./html/addItem-gui.html, true').node();
  document.body.appendChild(gui);

  bindEvent($(gui).find('input[value="Добавить"]'), 'onclick', addItem, [gui]);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createSettingsGUI(){
  var gui, state;

  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('mt.js', '@include: ./html/index.css, true');

  state = $data.status != "off" ? "Отключить скрипт" : "Включить скрипт";
  gui = $('<span>').attr("type", "mt_gui").html('@include: ./html/base-gui.html, true').node();
  document.body.appendChild(gui);

  showItems();

  bindEvent($('#mt_changeStatus'), 'onclick', changeScriptStatus);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addItem(node){
  var data, values, i, c, p;

  data = getValues(node);

  i = [Number(data.ot), Number(data.do)];
  if(isNaN(i[0]) || isNaN(i[0])) return;
  c = Number(data.count);
  if(isNaN(c)) return;
  p = Number(data.price);
  if(isNaN(p)) return;

  values = {
    name: data.name,
    time: $c.getTimeNow(),
    interval: i,
    auto: false,
    count: c,
    price: p
  };

  $settings.items[data.id] = values;
  saveSettings();
  location.href = location.href.toString();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function removeItem(node){
  var id;

  id = $(node).up('tr').find('[name="id"]').node().value;

  if($data.item == id){
    $data.item = null;
    $data.island = 1;
    $data.price = 0;
  }

  delete $settings.items[id];
  saveSettings();
  saveData();
  showItems();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function changeScriptStatus(button){
  var state, text;

  text = $data.status == "off" ? "Отключить скрипт" : "Включить скрипт";
  state = $data.status != "off" ? "off" : "wait";

  button.value = text;
  $data.status = state;
  saveData();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function goToSell(){
  go.gkDelay(intervalRandom($i.goSell[0], $i.goSell[1]), null, ["http://www.ganjawars.ru/market-i.php"]);
  $data.status = "post-on-sell";
  saveData();
}

function showItems(){
  var id, result, items, item;

  result = "";
  items = $settings.items;

  for(id in items){
    item = items[id];
    result += '@include: ./html/itemsTableRow.html, true';
  }

  $('#mt_items-table')
    .html(result)
    .find('[name="remove-item"]')
    .each((button)=>{
      bindEvent(button, 'onclick', removeItem);
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkRemoveItem(){
  if($('center:contains("Предмет успешно снят с продажи")').length == 1){
    goToSell();
  }else{
    console.log("Error on remove item!");
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkItems(){
  var time = $c.getTimeNow(), item, interval;

  loadData();

  if($data.status == "off")
    return waitScriptIsOn();

  if($data.item == null){
    Object.keys($settings.items).forEach((id)=>{
      if($data.item != null) return;

      item = $settings.items[id];
      interval = $c.randomNumber(item.interval[0], item.interval[1]) * 60;

      //console.log(interval + item.time < time);

      if(interval + item.time < time && item.auto){
        $data.item = id;
      }
    });
  }

  if($data.item != null){
    if($data.status == "wait"){
      $data.status = "get-price";
      saveData();
    }
    if($data.status == "get-price"){
      go.gkDelay(intervalRandom($i.getCost[0], $i.getCost[1]), null, [`http://www.ganjawars.ru/market.php?stage=2&item_id=${$data.item}&action_id=1&island=${$data.island}`]);
    }
    if($data.status == "post-on-sell"){
      postOnSellItem();
    }

    if($data.status == "posted-item"){
      workDoneOnItem();
    }
  }else{
    console.log("Working...");
    checkItems.gkDelay(intervalRandom($i.main[0], $i.main[1]));
  }
}

function waitScriptIsOn(){
  loadData();

  if($data.status == "off"){
    waitScriptIsOn.gkDelay(120000);
  }else{
    location.href = location.href.toString();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getCurrentPrice(){
  var price, table, position, remove;

  position = {
    my: 0,
    other: 0
  };

  table = $('font[color="#990000"]:contains("Поиск объявления")').up('table').node();

  price = $(table).find('a[href*="/market-i.php?stage=4"]').node();
  if(price){
    price = $(price).up('tr').node();
    position.my = price.rowIndex;
  }

  price = $(table).find('a[href*="/market-i.php?stage=2"]').up('tr').node();
  if(price) position.other = price.rowIndex;

  price = price.cells[0].textContent;
  price = price.replace(/\$|,/g, "");
  price = Number(price); price--;

  $data.price = price;

  if(position.my == 0){
    goToSell();
  }else if(position.my > position.other && $data.price > $settings.items[$data.item].price){
    remove = $(table).find('a[href*="/market-i.php?stage=4"]').node().href;
    go.gkDelay(intervalRandom($i.removeAdvert[0], $i.removeAdvert[1]), null, [remove]);
    $data.status = "remove-item";
    saveData();
  }else{
    workDoneOnItem();
    checkItems();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function postOnSellItem(){
  var option;

  option = $(`option[value$="_${$data.item}"]`).node();

  if(option){
    option.selected = true;
    $('input[name="submitprice"]').node().value = $data.price;
    $('input[name="tr_pass"]').node().value = $password;

    go.gkDelay(intervalRandom($i.postSell[0], $i.postSell[1]), null, [$('input[type="submit"][value="Выставить предмет"]').node()]);
    $data.status = "posted-item";
    saveData();
  }else{
    go.gkDelay(intervalRandom($i.openStorage[0], $i.openStorage[1]), null, ["http://www.ganjawars.ru/object.php?id=102761"]);
    $data.status = "get-items";
    saveData();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getItemAnObject(){
  var count, get = false;

  if($('font[color="#990000"]:contains("Склад")').length == 0) return;
  count = $settings.items[$data.item].count;

  checkAndGet.gkDelay(2000);

  function checkAndGet(){
    $('b:contains("~можете забрать")')
      .up('table')
      .next('div')
      .find(`input[type="checkbox"][value$="${$data.item}"]`)
      .each((box)=>{
        console.log(box);
        box.checked = true;
        get = true;

        console.log(box.checked);
      }, 0, count);

    if(get){
      go.gkDelay(intervalRandom($i.getItem[0], $i.getItem[1]), null, [$('input[type="submit"][value="Забрать отмеченные"]').node()]);
      $data.status = "get-items: done";
      saveData();
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function go(url){
  if(typeof url == "string"){
    location.href = url;
  }else{
    url.click();
  }
}

function workDoneOnItem(){
  $settings.items[$data.item].time = $c.getTimeNow();
  $data.status = "wait";
  $data.item = null;
  saveData();
  saveSettings();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveData(){
  console.log("---> " + $data.status);
  $ls.save("gk_mt_data", $data);
}

function saveSettings(){
  $ls.save("gk_mt_settings", $settings);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $data = $ls.load("gk_mt_data");
  $settings = $ls.load("gk_mt_settings");

  console.log($data.status);

  if(!$data.status){
    $data = {
      item: null,
      island: 1,
      price: 0,
      status: "wait"
    };

    saveData();
  }

  if($settings.items == null){
    $settings = {
      items: {
        "weedset": {
          name: "Трава",
          time: $c.getTimeNow(),
          interval: [1, 2],
          auto: true,
          count: 1,
          price: 150
        }
      },
      storage:{
        '102761':["weedset"]
      },
      intervals:{
        main: [598, 701],
        getCost: [18, 24],
        removeAdvert: [16, 19],
        goSell: [19, 23],
        openStorage: [12, 19],
        getItem: [25, 38],
        postSell: [45, 67]
      }
    };

    saveSettings();
  }

  $i = $settings.intervals;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function intervalRandom(min, max){return Number($c.randomNumber(min, max) + "" + $c.randomNumber(10, 99));}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getValues(element){
  var result = {};

  $(element).find('input[type="text"],input[type="hidden"]').each((input)=>{
    result[input.name] = input.value;
  });
  $(element).find('input[type="checkbox"]').each((input)=>{
    result[input.name] = input.checked;
  });
  $(element).find('input[type="radio"]:checked').each((input)=>{
    result[input.name] = input.value;
  });
  $(element).find('select').each((select)=>{
    result[select.name] = $(select).find('option:checked').node().value;
  });
  $(element).find('textarea').each((textarea)=>{
    result[textarea.name] = textarea.value;
  });

  return result;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////