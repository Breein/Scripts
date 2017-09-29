require('./../../../js/protoDelay.js')();

const $ = require('./../../../js/dom.js');
const bindEvent = require('./../../../js/bindEvents.js');
const setStyle = require('./../../../js/style.js');
const ajax = require('./../../../js/request.js');

const $ls = require('./../../../js/ls.js');

setStyle("add_to_sell.js", '@include: ./html/index.css, true');

var $password = 'd99924d';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var $answer, $table, $data, $protect, $lopata, $prices;
var $items, $cost;


$answer = $('<span>').node();
$table = $('b:contains("Размещение объявления")').up('table').node();

$protect = $($table).find('input[name="ne_nado_eto_avtomatizirovat"]').value();
$lopata = $($table).find('input[name="lpt"]').value();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

loadPrices();
collectItemsData();
createGUI();

if($prices.count > 0) startSell();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
bindEvent($('select'), 'onchange', calcEco);
calcEco();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function collectItemsData(){
  var type;

  $data = {};

  $($table).find('select[name="item_iid"]').find('option').each((option)=>{
    type = /(\d+)_(\d+)_(.+)/.exec(option.value)[3];

    if($data[type] == null) $data[type] = {};

    $data[type][option.value] = {
      name: option.textContent
    };
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var value, node, tableRows, count;
  var amount, name, color, off;

  tableRows = '';
  count = 0;

  for(var i in $data){
    amount = 0;
    name = '';
    off = '';

    value = $prices[i] ? (`value="${$prices[i]}"`) : "";

    for(var j in $data[i]){
      amount++;
    }

    color = count % 2 ? 'bgcolor="#f8faf8"' : 'bgcolor="#e7f8e7"';

    name = $data[i][j].name.match(/(.+) \[(\d+)\/(\d+)]/);
    if(name[3] == "0"){
      amount = `<span class="ads-stack" title="Стак: ${name[1].toLowerCase()}, рассчитать полную цену.">${name[2]}</span>`;
      off = 'disabled';
    }
    name = name[1];

    tableRows += '@include: ./html/row.html, true';
    count++;
  }

  node = $('<span>').html('@include: ./html/table.html, true').node();

  $table.parentNode.insertBefore(node, $table.nextSibling);

  bindEvent($('#button_sell_all'), 'onclick', startSell);
  $('.ads-stack').each((node)=>{
    bindEvent(node, 'onclick', calculateStackPrice);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculateStackPrice(node){
  var count, input, price;

  input = $(node).up('tr').find('input[name*="_price"]').node();
  price = Number(input.value);

  if(isNaN(price) || price <= 0) return;
  count = Number(node.textContent);
  input.value = count * price;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startSell(button){
  var dataSell, price;
  var group, id, count, current;

  dataSell = [];

  for(group in $data){

    price = Number($(`input[name="${group}_price"]`).value());

    if(!isNaN(price) && price > 0){
      $prices[group] = price;
      $prices.count++;

      count = Number($(`input[name="${group}_count"]`).value());
      current = 0;

      for(id in $data[group]){
        dataSell.push({id: id, price: price});

        if(!isNaN(count) && count > 0){
          current++;
          if(count == current) break;
        }
      }
    }
  }

  $('.ads-input').each((input)=>{
    input.disabled = true;
  });
  button.disabled = true;

  selling(dataSell, 0, dataSell.length);
  savePrices();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calcEco(){
  var item, row, id, d, refund, result, node, name, mod;

  if(!$items){
    $items = localStorage.getItem("gk_acfd_items");
    if($items == null) return;
    $items = JSON.parse($items);
    $items = $items.gos.items;
  }

  if(!$cost){
    $cost = localStorage.getItem("gk_EconomCalculator_data");
    if($cost == null) return;
    $cost = JSON.parse($cost);
    if($cost.costSell == null) return;
    $cost = $cost.costSell;
  }

  item = $('option:checked').node();
  id = item.value.match(/(\d+)_(\d+)_(.+)/)[3];
  d = item.textContent.split("/")[1].split("]")[0];
  d = Number(d);

  name = item.textContent;
  mod = name.match(/\[[A-Za-z]+]/g);
  mod = mod != null ? mod.length : 0;
  mod = 2000 * mod;

  node = $('#gk_ads-eco');

  if(!$items[id]){
    if(node.length) node.html('');
    return;
  }

  if(!node.length){
    row = $('<tr>').html('@include: ./html/eco.html, true').node();
    $table.rows[4].parentNode.insertBefore(row, $table.rows[4]);

    node = $(row).find('#gk_ads-eco');

    bindEvent(node, "onclick", addPrice);
  }

  refund = getRefund(d, $items[id]);
  refund[1] = refund[1] + mod;

  result = `${parseInt(refund[1] * $cost + refund[0], 10)} гб. (${$cost}, $${refund[0]}, ${refund[1]})`;
  node.html(result);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addPrice(node){
  var money;

  money = node.textContent;
  money = money.split(" гб");
  if(money == null) return;

  money = Number(money[0]);
  $('input[name="submitprice"]').value(money);
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

function selling(dataSell, index, length){
  var result, param, button;

  button = $('#button_sell_all').node();

  if(index < length){
    button.value = "Выставляю... " + (index+1) + "/" + length;

    param = `stage=1&ne_nado_eto_avtomatizirovat=${$protect}&lpt=${$lopata}&item_iid=${dataSell[index].id}&action_id=1&submitprice=${dataSell[index].price}`;
    if($password != '') param += `&tr_pass=${$password}`;

    ajax('http://www.ganjawars.ru/market-i.php', 'POST', param, false).then((r)=>{
      result = $($answer).html(r.text).find('center').node(2).textContent;

      if(result.indexOf('успешно размещено') == -1){
        console.log('Error!\n' + result + '\nIndex:' + dataSell[index]);

        button.value = "Завершено, но не до конца :(";

        reload.gkDelay(intervalRandom(8, 20));
        return;
      }

      index++;
      selling.gkDelay(intervalRandom(30, 50), null, [dataSell, index, length]);
    });

  }else{
    $prices = {count: 0};
    savePrices();

    button.value = "Завершено";
  }

  function reload(){
    location.href = "http://www.ganjawars.ru/market-i.php";
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadPrices(){
  $prices = $ls.load("gk_ats_prices");

  if($prices.count == null){
    $prices = {
      count: 0
    };

    savePrices();
  }
}

function savePrices(){
  $ls.save("gk_ats_prices", $prices);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Random(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min;}
function intervalRandom(min, max){return Number(Random(min, max) + "" + Random(10, 99));}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////