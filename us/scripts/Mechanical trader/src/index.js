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

if(location.pathname == "/me/"){
  createSettingsGUI();
}else{
  if($data.status == "wait") checkItems();
  if($data.status == "post-on-sell") checkItems();
  if($data.status == "get-price") getCurrentPrice();
  if($data.status == "remove-item") checkRemoveItem();
  if($data.status == "get-items") getItemAnObject();
  if($data.status == "get-items: done") goToSell();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createSettingsGUI(){
  var gui;

  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('mt.js', '@include: ./html/index.css, true');

  gui = $('<span>').attr("type", "mt_gui").html('@include: ./html/gui.html, true').node();
  document.body.appendChild(gui);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function goToSell(){
  go.gkDelay(intervalRandom($i.goSell[0], $i.goSell[1]), null, ["http://www.ganjawars.ru/market-i.php"]);
  $data.status = "post-on-sell";
  saveData();
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
      go.gkDelay(intervalRandom($i.getCost[0], $i.getCost[1]), null, [`http://www.ganjawars.ru/market.php?stage=2&item_id=${$data.item}&action_id=1&island=${$settings.items[$data.item].island}`]);
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
  }else if(position.my > position.other && $data.price < $settings.items[$data.item].price){
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

  //console.log($('input[type="submit"][value="Забрать отмеченные"]').node());

  if(get){
    //$i.getItem[0]
    console.log(intervalRandom(155, 180));
    go.gkDelay(intervalRandom(155, 180), null, [$('input[type="submit"][value="Забрать отмеченные"]').node()]);
    //$data.status = "get-items: done";
    //saveData();
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