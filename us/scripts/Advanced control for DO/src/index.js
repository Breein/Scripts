require('./../../../js/protoDelay.js')();
var $ = require('./../../../js/dom.js');
var bindEvent = require('./../../../js/events.js');
var ajax = require('./../../../js/request.js');
var createTable = require('./../../../js/table.js');
var setStyle = require('./../../../js/style.js');
var progress = require('./../../../js/progress.js')(renderTables);
var shadow = require('./../../../js/shadow.js')();
var tabs = require('./../../../js/tabs.js');

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');
const $mods = require('./../src/mods.js');
const Create = require('./../src/creator.js')();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var $answer, $tabs, $items, $adverts, $stats, $t, $texts, $data;

$answer = $('<span>').node();

$items = $ls.load("gk_acfd_items");
$adverts = $ls.load("gk_acfd_adverts");

$texts = {
  island: {
    "-1": "Не имеет значения",
    "0": "[G] Ganja Island",
    "1": "[Z] Z-Land",
    "3": "[O] Outland",
    "4": "[P] Palm Island"
  },
  action:{
    "sell": '<span style="color: darkgreen;">Продажа</span>',
    "buy": '<span style="color: darkred;">Покупка</span>',
    "rent": '<span style="color: darkblue;">Аренда</span>'
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
loadData();
addStyle();
createButton();
extensionAdverts();
//createGUI();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addStyle(){
  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('filter.js', '@include: ./../../css/filter.css, true');
  setStyle('acfd.js', '@include: ./html/index.css, true');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createButton(){
  var button, node;

  node = $('a[href*="forum.php"]').node();
  button = $('<span>').html('@include: ./html/startButton.html, true').node();

  node.parentNode.insertBefore(button, node.nextSibling);
  bindEvent(button.firstElementChild, "onclick", createGUI);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createGUI(){
  var td, height, ih, bh, ch, settings, gui, menu;

  if(!getItemsData()) return;

  menu = {
    "Установить курс Eun": "acfd_setCostEUN",
    "Обновить данные предметов": "acfd_updateItems"
  };

  settings = "gk_acfd_settings";
  gui = $('<span>').attr("type", "gui").html('@include: ./html/baseGUI.html, true').node();
  td = $('b[style="color: #990000"]:contains("Форум")').up('table').up('td').html('').node();

  $tabs = tabs(["Гос. предметы", "Арт. предметы", "Объявления", "Анализ цен", "Анализ эконома"], 2, menu);
  $tabs.append(td);
  document.body.appendChild(gui);

  $t = {
    gosItems: createTable(0, "gos-items", settings, "level"),
    artItems: createTable(1, "art-items", settings, "level"),
    adverts: createTable(2, "adverts", settings, "section"),
    stats: createTable(3, "stats", settings, "name"),
    exp: createTable(4, "exp", settings, "name")
  };

  renderBaseHTML();

  ih = window.innerHeight;
  bh = $('center').node(-1).offsetTop;
  ch = (parseInt((ih - bh) / 28, 10)) * 28;
  setStyle('adfd-content.js ', `div.tab-content-scroll{height: ${ch}px; overflow-y: scroll; margin: auto}`);

  bindEvent($('#acfd_setCostEUN').class("remove", "hidden"), "onclick", openSetCostEunWindow);
  bindEvent($('#acfd_updateItems'), "onclick", getItemsData, [true]);
  bindEvent($("#acfd_addAdvert"), "onclick", addAdvert);
  bindEvent($("#acfd_editAdvert"), "onclick", editAdvert);
  bindEvent($("#acfd_getDurItems"), "onclick", getDurItems);
  bindEvent($('#acfd_saveCostEun'), "onclick", saveCostEun);

  renderTables();
  bidHideContextMenu();
  bindActionsContextMenu();
  bindMoneyInputs();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bidHideContextMenu(){
  bindEvent(document.body, 'onclick', ()=>{
    var menu = $('#contextMenu').node();
    if(menu.style.visibility == "visible"){
      menu.style.visibility = "hidden";
      menu.removeAttribute("class");
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bindMoneyInputs(){
  var hidden, value;

  $('span[class="money-input"]').each((span)=>{
    bindEvent(span.firstElementChild, 'onkeyup', function(input){
      hidden = input.nextElementSibling;
      value = Number(input.value.replace(/,/g, ""));
      hidden.value = isNaN(value) ? 0 : value;
      input.value = $c.convertID(hidden.value);
    });
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function openSetCostEunWindow(){
  shadow.open('#acfd_costEunWindow');
  $tabs.closeMenu();
}

function saveCostEun(){
  $('#acfd_costEunWindow').find('input[type="hidden"]').each((input)=>{
    $data[input.name] = Number(input.value);
  });
  $ls.save("gk_acfd_data", $data);
  shadow.close();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function bindActionsContextMenu(){
  var actions, menu, table;

  menu = $('#contextMenu').node();

  actions = {
    addAdvert: (mode, text, itemType, list)=>{
      openAdvertWindow(mode, text, itemType, list);
    },

    analyzePrice: (add, all, list)=>{
      $stats.art = {
        time: $c.getTimeNow(),
        list: {}
      };

      if(all) list = $t.artItems.getContent();

      progress.start("Аналази цен Hi-Tech предметов доски объвлений", list.length, 1500);
      analyzePrice("art", 0, list.length, list, add);
    },

    analyzeExp: (all, list)=>{
      $stats.gos = {
        time: $c.getTimeNow(),
        list: {}
      };

      if(all) list = $t.gosItems.getContent();

      progress.start("Аналази цен и эконома Гос. предметов доски объвлений", list.length, 1500);
      analyzePrice("gos", 0, list.length, list, true);
    },

    updateItems: ()=>{
      getItemsData(true);
    },

    board: (action, list)=>{
      switch(action){
        case "add":
          progress.start("Размещение объявлений на доске", list.length, 1250);
          boardAdd(0, list.length, list);
          break;

        case "delete":
          checkAdverts(list, false);
          break;

        case "update":
          checkAdverts(list, true);
          break;
      }
    },

    setAutoPost: (value, list)=>{
      list.forEach((advert)=>{
        $adverts[advert.aid].autoPost = value;
      });
      $ls.save("gk_acfd_adverts", $adverts);
      renderAdvertsTable();
    },

    editAdvert: (list)=>{
      openEditAdvertWindow(list[0]);
    },

    //termPostEditAdvert:(list)=>{
    //  list.forEach((advert)=>{
    //    if(advert.termPost == 3)
    //      $adverts[advert.aid].termPost = 365;
    //  });
    //  $ls.save("gk_acfd_adverts", $adverts);
    //  renderAdvertsTable();
    //},

    reCalcPrice: (type, list)=>{
      var count = list.length;

      switch(type){
        case "sell":
          progress.start("Перерасчет цен по курсу продажи", count, 50);
          advertsAction("reCalc", 0, count, list, {key: 3, value: $data.sellEun});
          break;

        case "buy":
          progress.start("Перерасчет цен по курсу покупки", count, 50);
          advertsAction("reCalc", 0, count, list, {key: 4, value: $data.buyEun});
          break;

        case "rent":
          progress.start("Перерасчет цен по курсу аренды", count, 50);
          advertsAction("reCalc", 0, count, list, null);
          break;
      }
    },

    removeAdvert: (list)=>{
      progress.start("Удаление объялений из базы", list.length, 50);
      advertsAction("remove", 0, list.length, list);
    }
  };

  $(menu).find('ul[type]').nodeArr().forEach((ul)=>{
    ul = $(ul);
    table = $t[ul.attr("type")];

    ul.find('span[action]').nodeArr().forEach((item)=>{
      bindEvent(item, "onclick", action, [table]);
    });
  });

  function action(table, item){
    var func, args, index, array;

    index = Number($(menu).attr('index'));
    array = table.getCheckedContent();
    if(array.length == 0) array = table.getContentOnIndex(index);

    args = JSON.parse($(item).attr("action"));
    func = args.shift();
    args.push(array, table);

    actions[func].apply(null, args);
  }
}
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
function analyzePrice(type, now, max, list, all){
  var index, value, item, cell;
  var price, dur, mod, island, seller, fast, rate, refund, expCost;

  if(progress.isWork(analyzePrice, arguments)) return;
  if(now < max){
    item = list[now];
    ajax(`http://www.ganjawars.ru/market.php?buy=1&item_id=${item.id}`, "GET", null).then((r)=>{
      cell = $($answer).html(r.text).find('td:contains("Цена ")');
      if(cell.length != 0){
        cell.up('table').find('tr').each((tr, n)=>{
          if(/предложений других игроков не найдено/.test(tr.textContent)) return;

          index = `${n - 2}-${list[now].id}`;
          price = getPrice(tr);
          dur = getDurability(tr);
          mod = getMod(tr);
          island = getIsland(tr);
          seller = getSeller(tr);
          fast = getFast(tr);

          if(type == "art"){
            rate = getRate(price, item.refund);
            value = price <= $data.buyEun * item.cost;

            if(value || all){
              $stats.art.list[index] = [price, dur, mod, island, seller, fast, rate];
            }
          }else{
            refund = getRefund(dur[1], item);
            if(mod != 0) refund[1] += 2000;
            expCost = getExpCost(price, refund[0], refund[1]);

            $stats.gos.list[index] = [price, dur, mod, island, seller, fast, refund[0], refund[1], expCost];
          }
        }, 3);
      }else{
        console.log(item.id);
      }

      $ls.save("gk_acfd_stats", $stats);
      progress.work(false, r.time);
      now++;
      analyzePrice.gkDelay(1500, null, [type, now, max, list, all]);
    });
  }else{
    if(type == "art"){
      renderStatsTable();
      $tabs.select("Анализ цен");
    }else{
      renderExpTable();
      $tabs.select("Анализ эконома");
    }
    progress.done();
  }
  /////////////////////////////

  function getPrice(row){
    var price;

    price = row.cells[0].textContent;
    price = price.replace(/,|\$/g, "");
    price = Number(price);

    return price;
  }
  /////////////////////////////

  function getSeller(row){
    var seller, id;

    seller = $(row).find('a[href*="info.php"]').node();
    id = seller.href.match(/(\d+)/)[0];
    id = Number(id);

    return [id, seller.textContent];
  }
  /////////////////////////////

  function getDurability(row){
    var durability;

    durability = row.cells[1].textContent;
    durability = durability.split("/");
    durability = [Number(durability[0]), Number(durability[1])];

    return durability;
  }
  /////////////////////////////

  function getIsland(row){
    var island, isl;

    isl = {"[G]": 0, "[Z]": 1, "[P]": 4, "[G,Z,P]": -1, "[O]": 3};
    island = row.cells[3].textContent;

    return isl[island];
  }
  /////////////////////////////

  function getMod(row){
    var mod;

    mod = $(row.cells[2]).find('a').node();
    if(mod){
      mod = mod.href.match(/(\d+)/g);
      mod = mod[mod.length - 1];
      mod = Number(mod);
    }else{
      mod = 0;
    }

    return mod;
  }
  /////////////////////////////

  function getFast(row){
    var fast;

    fast = $(row.cells[4]).find('a[href*="market-i.php"]').node();
    if(fast){
      fast = fast.href.match(/(\d+)/g)[1];
      fast = Number(fast);
    }else{
      fast = 0;
    }
    return fast;
  }

  function getRate(price, cost){
    if(cost == 0) return 0;
    return parseInt(price / cost, 10);
  }
  /////////////////////////////

  function getRefund(dur, item){
    var durability, durLeft;

    durability = $items.gos.items[item.id][6];
    durLeft = durability[0] - dur;

    if(durLeft <= 0){
      return [item.refundNew, item.expNew];
    }

    if(durLeft < durability[2]){
      return [
        parseInt(item.refundNew - durLeft * item.refundOne, 10),
        parseInt(durLeft * item.expOne + item.expNew, 10)
      ];
    }

    if(durLeft >= durability[2]){
      return [item.refundBroken, item.expBroken];
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
function editAdvert(){
  var window, data, advert; //, item;

  shadow.close();
  window = $('#acfd_editAdvertWindow').node();
  data = getValues(window);
  advert = $adverts[data.aid];
  //item = $items.item[advert.id];

  advert.mod = Number(data.mod);
  advert.island = Number(data.island);
  advert.durNow = durability(data.durNow, 0);
  advert.durMax = durability(data.durMax, 1);
  advert.termPost = Number(data.termPost);
  advert.termRent = Number(data.termRent);
  advert.update = $c.getTimeNow();
  advert.price = Number(data.price);

  $ls.save("gk_acfd_adverts", $adverts);
  renderAdvertsTable();

  function durability(p, v){
    var d  = Number(p);

    if(isNaN(d) || d < 0) d = v;
    //if(d > item.durability) d = item.durability;

    return d;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addAdvert(){
  var window, data, list = [];

  window = $("#acfd_advertWindow").class("add", "hide").node();
  data = getValues(window);

  $t[data.it].getCheckedContent(true).forEach((item)=>{
    if(!$adverts[`${item.id}-${data.action}`]){
      list.push(item);
    }
  });

  progress.start("Добавление объявлений в базу", list.length, 50);
  advertsAction("add", 0, list.length, list, data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function advertsAction(action, now, max, list, data){
  var record, durability, aid, price, types;

  if(progress.isWork(advertsAction, arguments)) return;
  if(now < max){
    record = list[now];

    switch(action){
      case "add":
        types = data.it == "gosItems" ? 0 : 1;
        durability = data.durability == "new" ? [record.durability, record.durability] : [0, 1];
        aid = `${record.id}-${data.action}`;

        if(data.price != "0"){
          price = data.price == "sellEun" ? record.cost * $data.sellEun : record.refund * $data.buyEun;
        }else{
          price = 0;
        }

        $adverts[aid] = {
          id: record.id,
          it: types,
          did: 0,
          mod: 0,
          action: data.action,
          island: Number(data.island),
          durNow: durability[0],
          durMax: durability[1],
          termPost: Number(data.termPost),
          termRent: Number(data.termRent),
          update: $c.getTimeNow(),
          price: price,
          autoPost: 0,
          expire: 0
        };
        break;

      case "remove":
        delete $adverts[`${record.id}-${record.action}`];
        break;

      case "reCalc":
        aid = `${record.id}-${record.action}`;

        if(data){
          if($adverts[aid].it){
            $adverts[aid].price = $items.art.items[record.id][data.key] * data.value;
          }
        }else{
          if(!$adverts[aid].it){
            types = ["gos", "art"];
            price = $items[types[record.it]].items[record.id][3];
            price = parseInt(((price / 100) * 65) / 29, 10);

            $adverts[aid].price = price;
            $adverts[aid].termRent = 29;
          }
        }
        break;
    }

    $ls.save("gk_acfd_adverts", $adverts);
    progress.work(false, 0);
    now++;
    advertsAction.gkDelay(50, null, [action, now, max, list, data]);
  }else{
    progress.done();
    renderTables();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function boardAdd(now, max, list, ext){
  var advert;
  if(progress.isWork(boardAdd, arguments)) return;
  if(now < max){
    ajax("http://www.ganjawars.ru/market-p.php", "POST", Create.board(list[now])).then((r)=>{
      if(/Ваше объявление успешно размещено/.test(r.text)){
        advert = $adverts[list[now].aid];
        advert.expire = $c.getTimeNow() + 600 + (advert.termPost + 1) * 86400;
        advert.did = 0;

        $ls.save("gk_acfd_adverts", $adverts);
        console.log(`Success advert posted! [${advert.id}]`);
      }
      progress.work(false, r.time);
      now++;
      boardAdd.gkDelay(1250, null, [now, max, list, ext]);
    });
  }else{
    progress.done();
    if(!ext) renderTables();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkAdverts(list, update){
  var length, count, key, deleteList = [];

  count = [list.length, 0];
  length = list.length;

  while(length--){
    if($adverts[list[length].aid].did == 0) key = true;
    if(list[length].posted) deleteList.push(list[length]);
  }
  count[1] = deleteList.length;

  //console.log(list);
  //console.log(deleteList);

  if(key){
    progress.addTask(boardDelete, [0, count[1], deleteList], "удаление объявлений", ["Удаление объявлений", count[1], 1250]);
    addUpdate();
    boardAdverts();
    return;
  }

  addUpdate();
  progress.start("Удаление объявлений", count[1], 1250);
  boardDelete(0, count[1], deleteList);

  function addUpdate(){
    if(update){
      progress.addTask(boardAdd, [0, count[0], list], "размещение объявлений", ["Размещение объявлений на доске", count[0], 1250]);
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function boardDelete(now, max, list){
  var advert;

  if(progress.isWork(boardDelete, arguments)) return;
  if(now < max){
    advert = $adverts[list[now].aid];

    if(advert.did != 0){
      ajax("http://www.ganjawars.ru/market-l.php?del=" + advert.did, "GET", null).then((r)=>{
        if(/Объявление успешно удалено/.test(r.text)){
          advert.did = 0;
          advert.expire = 0;

          $ls.save("gk_acfd_adverts", $adverts);
          console.log(`Success advert deleted! [${advert.id}]`);
        }

        progress.work(false, r.time);
        now++;
        boardDelete.gkDelay(1250, null, [now, max, list]);
      });
    }else{
      advert.did = 0;
      advert.expire = 0;

      progress.work(false, 0);
      now++;
      boardDelete.gkDelay(1250, null, [now, max, list]);
    }
  }else{
    progress.done();
    renderTables();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function boardAdverts(){
  var did, id, aid, actions, maxPage;

  actions = {
    "Продаю": "sell",
    "Куплю": "buy",
    "Сдаю в аренду": "rent"
  };

  ajax("http://www.ganjawars.ru/market-l.php?page_id=1000", "GET", null).then((r)=>{
    if(!/У вас нет активных объявлений./.test(r.text)){
      maxPage = $($answer)
        .html(r.text)
        .find('a[href*="market-p.php"]:contains("Новое объявление")')
        .up('center')
        .prev('center')
        .find('a')
        .node(-1);
      maxPage = Number(maxPage.href.split("page_id=")[1]) + 1;

      progress.start("Получение списка объявлений c доски", maxPage, 1250);
      getAdverts(0, maxPage);
    }else{
      progress.done();
    }
  });

  /////////////////////////////
  function getAdverts(now, max){
    var url = "http://www.ganjawars.ru/market-l.php?page_id=" + now;

    if(now < max){
      ajax(url, "GET", null).then((r)=>{
        $($answer).html(r.text)
          .find('font[color="#990000"]:contains("Ваши объявления")')
          .up('table')
          .find('tr')
          .each((row)=>{
            did = $(row).find('a[href*="market-l.php?del="]').node();
            if(did){
              did = Number(did.href.match(/(\d+)/)[1]);
              id = $items.names[row.cells[0].textContent];
              aid = `${id}-${actions[row.cells[1].textContent]}`;

              if($adverts[aid] != null) $adverts[aid].did = did;
            }
          }, 2);

        $ls.save("gk_acfd_adverts", $adverts);
        progress.work(false, r.time);
        now++;
        getAdverts.gkDelay(1250, null, [now, max]);
      });
    }else{
      progress.done();
      renderAdvertsTable();
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function extensionAdverts(){
  var list, advert, count, date, types, item;

  if(!$items.art) return;

  date = $c.getTimeNow();
  types = ["gos", "art"];
  list = [];

  if(date - $data.time > 3600){
    Object.keys($adverts).forEach((id)=>{
      item = $items[types[$adverts[id].it]];
      advert = Create.advert($adverts[id], item.items[$adverts[id].id], item.sections);
      if(advert.autoPost && !advert.posted) list.push(advert);
    });

    count = list.length;

    if(count){
      progress.start("Размещение объявлений на доске (продление)", count, 1250);
      boardAdd(0, count, list, true);
    }

    $data.time = date;
    $ls.save("gk_acfd_data", $data);
  }

  extensionAdverts.gkDelay(1800000, null, []);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDurItems(){
  var window, advert, item, name, mod, durability;

  window = $("#acfd_editAdvertWindow").node();
  advert = $adverts[$(window).find('input[name="aid"]').node().value];
  item = $items.art.items[advert.id];
  mod = $(window).find(`select[name="mod"]`).find("option:checked").text();

  if(mod != "Без модификатора"){
    mod = mod.split(" ")[0];
    name = `${item[1]} ${mod}`;
  }else{
    name = item[1];
  }

  ajax("http://www.ganjawars.ru/items.php", "GET", null).then((r)=>{
    durability = $($answer).html(r.text)
      .find(`tr[bgcolor="#e0eee0"],tr[bgcolor="#d0f5d0"]:contains("~${name}")`);

    if(durability.length != 0){
      if(durability.attr("id")){
        durability = durability.next('tr').text();
        durability = durability.split(' • ')[2];
      }else{
        if(/Взять/.test(durability.text())){
          durability = durability.next('tr');
        }
        durability = durability.find('li:contains("~Прочность предмета:")').text();
      }
      durability = durability.match(/Прочность предмета: (\d+)\/(\d+) \((\d+)\)/);

      $(window).find('[name="durNow"]').node().value = durability[1];
      $(window).find('[name="durMax"]').node().value = durability[2];
    }else{
      alert("Предмет не найден");
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openAdvertWindow(mode, text, itemType, list){
  var window, hide;

  window = $("#acfd_advertWindow").node();
  hide = mode == "rent" ? "display: table-row;" : "display: none";

  createSelectList(mode, itemType);

  $(window).find('span[type="count"]').html(list.length);
  $(window).find('input[name="action"]').node().value = mode;
  $(window).find('input[name="it"]').node().value = itemType;
  $(window).find('span[name="action"]').text(text);
  $(window).find('tr[type="rent"]').attr("style", hide);
  $(window).class("remove", "hide");
  shadow.open();

  /////////////////////////////
  function createSelectList(){
    var code, i, length;

    code = '<option>Посмотреть список...</option>';
    for(i = 0, length = list.length; i < length; i++){
      code += `<option value="${list[i].id}">${i + 1}. ${list[i].name}</option>`;
    }

    $(window).find('select[name="iid"]').html(code); code = "";

    if(itemType == "artItems"){
      if(mode == "sell"){
        code = '<option value="sellEun">По курсу продажи</option>';
      }else if(mode == "buy"){
        code = '<option value="buyEun">По курсу покупки</option>';
      }
    }
    code += '<option value="0">Не устанавливать</option>';

    $(window).find('select[name="price"]').html(code);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openEditAdvertWindow(advert){
  var window, hide;

  shadow.open();
  window = $('#acfd_editAdvertWindow').class("remove", "hide").node();
  hide = advert.action == "rent" ? "display: table-row;" : "display: none";

  createModList();
  checkingSelect("island", advert.island, window);
  checkingSelect("termPost", advert.termPost, window);
  checkingSelect("termRent", advert.termRent, window);
  checkingSelect("mod", advert.mod, window);

  $(window).find('span[name="aid"]').text(advert.name);
  $(window).find('input[name="aid"]').node().value = advert.aid;
  $(window).find('[name="action"]').text($texts.action[advert.action]);
  $(window).find('tr[type="rent"]').attr("style", hide);
  $(window).find('[name="durNow"]').node().value = advert.durNow;
  $(window).find('[name="durMax"]').node().value = advert.durMax;
  $(window).find('input[type="text"][name="price"]').node().value = $c.convertID(advert.price);
  $(window).find('input[type="hidden"][name="price"]').node().value = advert.price;

  /////////////////////////////
  function createModList(){
    var code, mods, mid, m;

    mods = $mods(advert.section);
    code = '<option value="0">Без модификатора</option>';

    if(mods){
      for(mid in mods){
        m = mods[mid];
        code += `<option title="Эффект: ${m.d}, вероятность выпадения: ${m.f}" value="${mid}">${m.name} ${m.fn}</option>`;
      }
    }

    $(window).find('[name="mod"]').html(code);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkingSelect(name, value, node){
  var select;

  select = node ? $(node).find(`select[name="${name}"]`) : $(`select[name="${name}"]`);
  select.find(`option[value="${value}"]`).node().selected = true;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderBaseHTML(){
  var t;

  t = $t.gosItems;
  t.setStructure({
    section: [150, "check", "Тип предмета"],
    level: [28, "number", "Минимальный уровень"],
    name: [-1, "check", "Название предмета"],
    durability: [60, "number", "Прочность"],
    cost: [100, "number", "Стоимость предмета"],
    refundNew: [75, "number", "Возврат с продажи (новый)"],
    refundBroken: [75, "number", "Возврат с продажи (сломаный)"],
    refundOne: [75, "number", "Возврат с продажи (одна ед.пр.)"],
    expNew: [75, "number", "Эконом с продажи (новый)"],
    expBroken: [75, "number", "Эконом с продажи (сломаный)"],
    expOne: [75, "number", "Эконом с продажи (одна ед.пр.)"],
    sell: [35, "boolean", "Объявление, продажа|добавленные|тех что добавлены"],
    buy: [35, "boolean", "Объявление, покупка|добавленные|тех что добавлены"],
    rent: [35, "boolean", "Объявление, аредна|добавленные|тех что добавлены"],
    check: [45, null]
  });

  t.setHeader('@include: ./html/gosItemsTableHeader.html, true');
  t.setFooter('@include: ./html/gosItemsTableFooter.html, true');
  t.setControls(renderGosItemsTable, true, true, true);

  t = $t.artItems;
  t.setStructure({
    section: [150, "check", "Тип предмета"],
    level: [28, "number", "Минимальный уровень"],
    name: [-1, "check", "Название предмета"],
    durability: [60, "number", "Прочность"],
    cost: [100, "number", "Стоимость предмета"],
    renew: [115, "number", "Обновление предмета"],
    refund: [100, "number", "Возврат с продажи"],
    sell: [35, "boolean", "Объявление, продажа|добавленные|тех что добавлены"],
    buy: [35, "boolean", "Объявление, покупка|добавленные|тех что добавлены"],
    rent: [35, "boolean", "Объявление, аредна|добавленные|тех что добавлены"],
    check: [45, null]
  });

  t.setHeader('@include: ./html/artItemsTableHeader.html, true');
  t.setFooter('@include: ./html/artItemsTableFooter.html, true');
  t.setControls(renderArtItemsTable, true, true, true);

  t = $t.adverts;
  t.setStructure({
    section: [150, "check", "Тип предмета"],
    level: [28, "number", "Минимальный уровень"],
    name: [-1, "check", "Название предмета"],
    mod: [50, "check|boolean", "Модификтор|с модом|тех что с модом"],
    it: [28, "boolean", "Арт предмет|Hi-tech предметы|Hi-tech предметов"],
    action: [80, "multiple", "Тип объявления"],
    island: [130, "multiple", "Остров"],
    durNow: [60, "number|boolean", "Прочность (текущая)|новые предметы|новых предметов"],
    termPost: [50, "number", "Срок размещения"],
    termRent: [50, "number", "Срок аредны"],
    update: [60, "date", "Дата изменения"],
    price: [75, "number", "Цена предмета"],
    posted: [28, "boolean", "Размещенные на доске|размещенные|не размещенные"],
    autoPost: [28, "boolean", "Авто-продление объявления|с продлением|тех что с продлением"],
    check: [45, null]
  });

  t.setHeader('@include: ./html/advertsTableHeader.html, true');
  t.setFooter('@include: ./html/advertsTableFooter.html, true');
  t.setControls(renderAdvertsTable, true, true, true);

  t = $t.stats;
  t.setStructure({
    section: [150, "check", "Тип предмета"],
    level: [28, "number", "Минимальный уровень"],
    name: [-1, "check", "Название предмета"],
    mod: [50, "check|boolean", "Модификтор|с модом|что с модом"],
    refund: [50, "number", "Возврат с продажи"],
    price: [75, "number", "Цена предмета"],
    rate: [65, "number", "Цена предмета"],
    durMax: [60, "number", "Прочность максимальная"],
    island: [130, "multiple", "Остров"],
    seller: [150, "check", "Имя продавца"],
    fast: [40, "boolean", "Мнгновенная продажа|с быстрой продажей|быстрой продажи"],
    actions: [35, null],
    check: [45, null]
  });

  t.setHeader('@include: ./html/statsTableHeader.html, true');
  t.setFooter('@include: ./html/statsTableFooter.html, true');
  t.setControls(renderStatsTable, true, true, true);

  t = $t.exp;
  t.setStructure({
    section: [150, "check", "Тип предмета"],
    level: [28, "number", "Минимальный уровень"],
    name: [-1, "check", "Название предмета"],
    mod: [40, "check|boolean", "Модификтор|с модом|что с модом"],
    price: [70, "number", "Цена предмета"],
    refund: [60, "number", "Возврат с продажи"],
    exp: [60, "number", "Эконом с продажи"],
    expCost: [45, "number", "Цена за 1 ед. эконома"],
    durMax: [60, "number", "Прочность максимальная"],
    island: [130, "multiple", "Остров"],
    seller: [150, "check", "Имя продавца"],
    fast: [40, "boolean", "Мнгновенная продажа|с быстрой продажей|быстрой продажи"],
    actions: [35, null],
    check: [45, null]
  });

  t.setHeader('@include: ./html/expTableHeader.html, true');
  t.setFooter('@include: ./html/expTableFooter.html, true');
  t.setControls(renderExpTable, true, true, true);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderGosItemsTable(mode){
  var table, items;

  table = $t.gosItems;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    items = Object.keys($items.gos.items);

    items.forEach((id)=>{
      table.pushContent(Create.gosItem($items.gos.items[id], $adverts, $items.gos.sections));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(true);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderArtItemsTable(mode){
  var table, items, missing;

  // Их нет на доске, скрываем.
  missing = {
    oldcompass: 1,
    bottleopener: 1,
    ganjacup: 1,
    pendant: 1,
    flashlight: 1
  };

  table = $t.artItems;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    items = Object.keys($items.art.items);

    items.forEach((id)=>{
      if(missing[id]) return;
      table.pushContent(Create.artItem($items.art.items[id], $adverts, $items.art.sections));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(true);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderAdvertsTable(mode){
  var table, adverts, types, item;

  table = $t.adverts;
  types = ["gos", "art"];

  if(mode == null){
    mode = "filter";
    table.clearContent();
    adverts = Object.keys($adverts);

    adverts.forEach((id)=>{
      item = $items[types[$adverts[id].it]];
      table.pushContent(Create.advert($adverts[id], item.items[$adverts[id].id], item.sections));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(true);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderStatsTable(mode){
  var table, prices, data, date;

  table = $t.stats;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    prices = Object.keys($stats.art.list);

    prices.forEach((id)=>{
      data = id.split("-");
      table.pushContent(Create.stats($stats.art.list[id], $items.art.items[data[1]], $items.art.sections, Number(data[0])));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(false);

    date = $c.getNormalDate($stats.art.time);
    $('#acfd_time-update-stats').text(`${date.d} ${date.t}`);
  });
}

function renderExpTable(mode){
  var table, prices, data, date;

  table = $t.exp;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    prices = Object.keys($stats.gos.list);

    prices.forEach((id)=>{
      data = id.split("-");
      table.pushContent(Create.exp($stats.gos.list[id], $items.gos.items[data[1]], $items.gos.sections, Number(data[0])));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(false);

    date = $c.getNormalDate($stats.gos.time);
    $('#acfd_time-update-exp').text(`${date.d} ${date.t}`);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderTables(){
  renderGosItemsTable();
  renderArtItemsTable();
  renderAdvertsTable();
  renderStatsTable();
  renderExpTable();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function showTable(t){
  var code, rows, html, first = 1, n = 0, b;
  var i, length;

  rows = t.getContent(true);
  code = [];
  html = "";

  for(i = 0, length = rows.length; i < length; i++){
    b = i > 0 && i < length - 1 ? "" : (i == 0 ? 'type="no-b-top"' : 'type="no-b-bottom"');
    if(!n && i == 80){
      code[n] = html;
      html = "";
      n++;
    }
    html += getRows(t, rows[i], b);
  }
  code[n] = html;

  return code.reduce((sequence, c) => {
    return sequence.then(()=>{
      return insert(c);
    });
  }, Promise.resolve());

  /////////////////////////////

  function insert(code){
    return new Promise((resolve)=>{
      if(first){
        t.render(code, false);
        first = 0;
      }else{
        t.render(code, true);
      }
      setTimeout(()=>{
        resolve();
      }, 100);
    })
  }
  /////////////////////////////

  function getRows(t, tr, border){
    switch(t.getName()){
      case "gos-items":
        return '@include: ./html/gosItemsTableRow.html, true';
        break;
      case "art-items":
        return '@include: ./html/artItemsTableRow.html, true';
        break;
      case "adverts":
        return '@include: ./html/advertsTableRow.html, true';
        break;
      case "stats":
        return '@include: ./html/statsTableRow.html, true';
        break;
      case "exp":
        return '@include: ./html/expTableRow.html, true';
        break;
    }
  }
  /////////////////////////////

  function getClass(row){
    return row.check ? "light checked" : "light";
  }
  /////////////////////////////

  function getChecked(row){
    return row.check ? "checked" : "";
  }
  /////////////////////////////

  function getNameLink(row){
    var href;

    href = `http://www.ganjawars.ru/item.php?item_id=${row.id}`;
    if(row.mod != 0) href += "&m=" + row.mod;
    return `<a target="_blank" href="${href}">${row.name}</a>`;
  }
  /////////////////////////////

  function getMod(row, short){
    var m, url;

    if(row.mod == 0) return "";

    m = $mods(row.section);
    if(m == null) return "-1";

    m = m[row.mod];
    if(m == null) return "-2";

    url = `http://www.ganjawars.ru/item.php?item_id=${row.id}&m=${row.mod}`;

    if(short == null){
      return `<a target="_blank" title="Эффект: ${m.d}\nВероятность выпадения: ${m.f}" href="${url}" class="no-line">${m.name} ${m.fn}</a>`;
    }else{
      return `<a target="_blank" title="${m.fn}\nЭффект: ${m.d}\nВероятность выпадения: ${m.f}" href="${url}" class="no-line">${m.name}</a>`;
    }
  }

  function getActionsLink(row){
    var url, mod, style, title;

    if(row.fast != 0){
      url = `http://www.ganjawars.ru/market-i.php?stage=2&sell_id=${row.fast}`;
      style = "fast-buy";
      title = "Купить сейчас";
    }else{
      mod = row.mod == 0 ? "" : "+" + $mods(row.section)[row.mod].name;
      url = `http://www.ganjawars.ru/sms-create.php?mailto=${row.seller[1]}&subject=[+Покупка+]+${row.name}${mod}+${row.durNow}/${row.durMax}`;
      style = "send-mail";
      title = "Написать письмо";
    }

    return `<a href="${url}" target="_blank" class="no-line ${style}" title="${title}">»»»</a>`;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getItemsData(update){
  var sections, name;

  if($items.art == null || update){
    if(update){
      $tabs.closeMenu();
      if(!confirm("Обновить данные предметов?")) return true;
    }
    $items = {
      art: {
        sections: [],
        items: {}
      },
      gos: {
        sections: [],
        items: {}
      },
      names: {}
    };
    getSections("art");
  }else{
    return true;
  }
  /////////////////////////////

  function getSections(type){
    var url, text;

    url = type == "art" ? "shopc.php" : "shop.php";
    text = type == "art" ? "Hi-Tech" : "Государственного";

    sections = {
      names: [],
      urls: []
    };

    ajax("http://www.ganjawars.ru/" + url, "GET", null).then((r)=>{
      $($answer)
        .html(r.text)
        .find('font:contains("Разделы")')
        .up('table')
        .find(`a[href*="${url}"]`)
        .each((node)=>{
          name = node.textContent;
          if(name == "" || name == "Магазин синдиката") return;

          sections.names.push(name);
          sections.urls.push(node.href);
        });

      $items[type].sections = sections.names;

      progress.start(`Сбор новых данных предметов с ${text} магазина, разделы`, sections.names.length, 1250);
      getData(0, sections.names.length, type);
    });
  }
  /////////////////////////////

  function getData(index, max, type){
    var table, data;
    var id, name, section, cost, refund, exp, durability, level, excludeItems;

    excludeItems = {
      hk53: 1,
      helmet2: 1,
      heavyboots: 1,
      tbelt: 1,
      maskp: 1
    };

    if(progress.isWork(getData, arguments)) return;
    if(index < max){
      ajax(sections.urls[index], "GET", null).then((r)=>{
        $($answer)
          .html(r.text)
          .find('td[width="800"]')
          .find('a[href*="item.php"]')
          .each((node)=>{
            table = $(node).up('table').node();

            id = getID(node); if(excludeItems[id]) return;
            name = getName();
            section = index;
            cost = getCost(type);
            durability = getDurability(type);
            refund = getRefund(type, cost, section, durability);
            exp = getExp(type, cost, durability);
            level = getLevel();

            data = type == "art" ?
              [id, name, section, cost, refund, durability, level] :
              [id, name, section, cost, refund, exp, durability, level];

            $items[type].items[id] = data;
            $items.names[name] = id;
          });

        progress.work(false, r.time);
        index++;
        getData.gkDelay(1250, null, [index, max, type]);
      });
    }else{

      $ls.save("gk_acfd_items", $items);

      if(type == "art"){
        getSections.gkDelay(1000, null, ["gos"]);
      }else{
        if(update){
          renderArtItemsTable();
          renderGosItemsTable();
        }else{
          createGUI();
        }
      }

      progress.done();
    }

    /////////////////////////////

    function getID(node){
      return node.href.split(/item_id=/)[1];
    }
    /////////////////////////////

    function getName(){
      return $(table).find('font').text();
    }
    /////////////////////////////

    function getCost(type){
      var cost;

      cost = $(table).find('b:contains("Стоимость:")').next('b').text();
      cost = type == "art" ? cost.match(/(\d+)/)[1] : cost.replace(/,/g, "");
      cost = Number(cost);

      return cost;
    }
    /////////////////////////////

    function getDurability(type){
      var durability;

      durability = $(table).find('b:contains("Прочность:")').node();
      durability = durability.nextSibling.textContent;
      durability = Number(durability);

      if(type == "gos"){
        durability = [durability, parseInt((durability / 100) * 60, 10)];
        durability[2] = durability[0] - durability[1];
      }

      return durability;
    }

    /////////////////////////////

    function getRefund(type, cost, s, d){
      var refund;

      if(type == "art"){
        if(sections.names[s] == "Аптека") return 0;

        refund = cost / 10;
        refund = cost % 10 ? parseInt(refund, 10) + 1 : refund;
        refund = cost - refund;
      }else{
        refund = [cost * 0.5, cost * 0.3];
        refund[2] = parseInt((refund[0] - refund[1]) / d[2], 10);
      }

      return refund;
    }

    function getExp(type, cost, d){
      var exp;

      if(type == "art") return 0;
      exp = [cost * 0.027, cost * 0.047];
      exp[2] = (exp[1] - exp[0]) / d[2];

      exp[0] = parseFloat(exp[0].toFixed(1));
      exp[1] = parseFloat(exp[1].toFixed(1));
      exp[2] = parseFloat(exp[2].toFixed(1));

      return exp;
    }
    /////////////////////////////

    function getLevel(){
      var level;

      level = $(table).find('font:contains("Минимальный боевой уровень:")');
      if(level.length){
        level = level.next('b').text();
        level = Number(level);
      }else{
        level = 0;
      }

      return level;
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $data = $ls.load("gk_acfd_data");
  $stats = $ls.load("gk_acfd_stats");

  if($data.time == null){
    $data = {
      time: 0,
      buyEun: 0,
      sellEun: 0
    };

    $ls.save("gk_acfd_data", $data);
  }

  if($stats.art == null){
    $stats = {
      art: {
        list: {},
        time: $c.getTimeNow()
      },
      gos: {
        list: {},
        time: $c.getTimeNow()
      }
    };

    if($stats.time){
      delete $stats.list;
      delete $stats.time;
    }

    $ls.save("gk_acfd_stats", $stats);
  }
}