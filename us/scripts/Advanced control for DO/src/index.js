require('./../../../js/protoDelay.js')();
var $ = require('./../../../js/dom.js');
var bindEvent = require('./../../../js/events.js');
var ajax = require('./../../../js/request.js');
var createTable = require('./../../../js/table.js');
var setStyle = require('./../../../js/style.js');
var progress = require('./../../../js/progress.js')(renderTables);
var shadow = require('./../../../js/shadow.js')();

const $c = require('./../../../js/common.js')();
const $ls = require('./../../../js/ls.js');
const $ico = require('./../src/icons.js');
const $mods = require('./../src/mods.js');
const Create = require('./../src/creator.js')();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var $answer, $items, $adverts, $prices, $t, $texts, $data;

$answer = $('<span>').node();

$items = $ls.load("gk_acfd_items");
$adverts = $ls.load("gk_acfd_adverts");

$texts = {
  island: {
    "-1": "Не имеет значения",
    "0": "[G] Ganja Island",
    "1": "[Z] Z-Land",
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
  var css;

  css = `
    tr.light div[type="checkbox"]{
      background-image: url(${$ico.boxOff});
    }
    tr.checked div[type="checkbox"]{
      background-image: url(${$ico.boxOn});
    }
    td[filter]{
      background-position: center center;
      background-repeat: no-repeat;
    }
    td[filter].disable{
      background-image: url(${$ico.boxOff});
    }
    td[filter].enable{
      background-image: url(${$ico.boxOn});
      background-color: #cfe5cf;
    }`;

  css += '@include: ./html/index.css, true';
  setStyle('common.js', '@include: ./../../css/common.css, true');
  setStyle('advanced control for do.js', css);
  setStyle('filter.js', '@include: ./../../css/filter.css, true');
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
  var td;

  if(!getItemsData()) return;

  $t = {
    items: createTable(["#header-items", "#content-items", "#footer-items", "#contextMenu"], "items", "gk_acfd_settings", $ico, "level"),
    adverts: createTable(["#header-adverts", "#content-adverts", "#footer-adverts", "#contextMenu"], "adverts", "gk_acfd_settings", $ico, "section"),
    stats: createTable(["#header-stats", "#content-stats", "#footer-stats", "#contextMenu"], "stats", "gk_acfd_settings", $ico, "name")
  };

  td = $('b[style="color: #990000"]:contains("Форум")').up('table').up('td');
  td = td.html('@include: ./html/baseGUI.html, true').node();

  $('td[class="tab"],[class="tab tabActive"]').each((tab)=>{
    bindEvent(tab, 'onclick', selectTabTable);
  });

  bindEvent($('#setCostEUN').class("remove", "hidden"), "onclick", openSetCostEunWindow);
  bindEvent($("#acfd_addAdvert"), "onclick", addAdvert);
  bindEvent($("#acfd_editAdvert"), "onclick", editAdvert);
  bindEvent($("#acfd_getDurItems"), "onclick", getDurItems);
  bindEvent($('#acfd_saveCostEun'), "onclick", saveCostEun);

  renderBaseHTML();
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
  shadow.open();
  $('#acfd_costEunWindow').class("remove", "hide");
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
    addAdvert: (mode, text, list)=>{
      openAdvertWindow(mode, text, list);
    },

    analyzePrice: (add, list)=>{
      $prices = {
        time: $c.getTimeNow(),
        list: {}
      };
      progress.start("Аналази цен доски объвлений", list.length, 1500);
      analyzePrice(0, list.length, list, add);
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

    reCalcPrice: (type, list)=>{
      var count = list.length;

      switch(type){
        case "sell":
          progress.start("Перерасчет цен по курсу продажи", count, 50);
          advertsAction("reCalc", 0, count, list, {key: "cost", value: $data.sellEun});
          break;

        case "buy":
          progress.start("Перерасчет цен по курсу покупки", count, 50);
          advertsAction("reCalc", 0, count, list, {key: "refund", value: $data.buyEun});
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
    result[input.name] = input.checked;
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
function analyzePrice(now, max, list, all){
  var index, record, price, value, item, cell;

  if(progress.isWork(analyzePrice, arguments)) return;
  if(now < max){
    item = list[now];
    ajax(`http://www.ganjawars.ru/market.php?buy=1&item_id=${item.id}`, "GET", null).then((r)=>{
      cell = $($answer).html(r.text).find('td:contains("Цена ")');
      if(cell.length != 0){
        cell.up('table').find('tr').each((tr, n)=>{
          if(/предложений других игроков не найдено/.test(tr.textContent)) return;
          price = getPrice(tr);
          value = price <= $data.buyEun * item.cost;

          if(value || all){
            index = `${n - 2}-${list[now].id}`;
            $prices.list[index] = {};

            record = $prices.list[index];
            record.price = price;
            record.rate = getRate(price, item.cost);
            record.dur = getDurability(tr);
            record.mod = getMod(tr);
            record.island = getIsland(tr);
            record.seller = getSeller(tr);
            record.fast = getFast(tr);
          }
        }, 3);

        $ls.save("gk_acfd_stats", $prices);
      }else{
        console.log(item.id);
      }
      progress.work(false, r.time);
      now++;
      analyzePrice.gkDelay(1500, null, [now, max, list, all]);
    });
  }else{
    renderStatsTable();
    selectTabTable("Анализ цен");
    progress.done();
  }

  function getPrice(row){
    var price;

    price = row.cells[0].textContent;
    price = price.replace(/,|\$/g, "");
    price = Number(price);

    return price;
  }

  function getRate(price, cost){
    return parseInt(price / cost, 10);
  }

  function getSeller(row){
    var seller, id;

    seller = $(row).find('a[href*="info.php"]').node();
    id = seller.href.match(/(\d+)/)[0];
    id = Number(id);

    return [id, seller.textContent];
  }

  function getDurability(row){
    var durability;

    durability = row.cells[1].textContent;
    durability = durability.split("/");
    durability = [Number(durability[0]), Number(durability[1])];

    return durability;
  }

  function getIsland(row){
    var island, isl;

    isl = {"[G]": 0, "[Z]": 1, "[P]": 4, "[G,Z,P]": -1};
    island = row.cells[3].textContent;

    return isl[island];
  }

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
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function editAdvert(){
  var window, data, advert, item;

  shadow.close();
  window = $('#acfd_editAdvertWindow').node();
  data = getValues(window);
  advert = $adverts[data.aid];
  item = $items.item[advert.id];

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
    if(d > item.durability) d = item.durability;
    return d;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addAdvert(){
  var window, data, list = [];

  window = $("#acfd_advertWindow").class("add", "hide").node();
  data = getValues(window);

  $t.items.getCheckedContent(true).forEach((item)=>{
    if(!$adverts[`${item.id}-${data.action}`]){
      list.push(item);
    }
  });

  progress.start("Добавление объявлений в базу", list.length, 50);
  advertsAction("add", 0, list.length, list, data);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function advertsAction(action, now, max, list, data){
  var record, durability, aid, price;

  if(progress.isWork(advertsAction, arguments)) return;
  if(now < max){
    record = list[now];

    switch(action){
      case "add":
        durability = data.durability == "new" ? [record.durability, record.durability] : [0, 1];
        aid = `${record.id}-${data.action}`;

        if(data.price != "0"){
          price = data.price == "sellEun" ? record.cost * $data.sellEun : record.refund * $data.buyEun;
        }else{
          price = 0;
        }

        $adverts[aid] = {
          id: record.id,
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
        $adverts[aid].price = $items.item[record.id][data.key] * data.value;
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
        advert.expire = $c.getTimeNow() + 600 + Number(advert.termPost) * 86400;

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
    }else
      advert.did = 0;{
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
  var list, advert, count, date;

  if(!$items.names) return;

  date = $c.getTimeNow();
  list = [];

  if(date - $data.time > 3600){
    Object.keys($adverts).forEach((id)=>{
      advert = Create.advert($adverts[id], $items.item[$adverts[id].id]);
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
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDurItems(){
  var window, advert, item, name, mod, durability;

  window = $("#acfd_editAdvertWindow").node();
  advert = $adverts[$(window).find('input[name="aid"]').node().value];
  item = $items.item[advert.id];
  mod = $(window).find(`select[name="mod"]`).find("option:checked").text();

  if(mod != "Без модификатора"){
    mod = mod.split(" ")[0];
    name = `${item.name} ${mod}`;
  }else{
    name = item.name;
  }

  ajax("http://www.ganjawars.ru/items.php", "GET", null).then((r)=>{
    durability = $($answer).html(r.text)
      .find(`tr[bgcolor="#e0eee0"],tr[bgcolor="#e0eee0"]:contains("~${name}")`);

    if(durability.length != 0){
      if(durability.attr("id")){
        durability = durability.next('tr').text();
        durability = durability.split(' • ')[2];
      }else{
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

function selectTabTable(tab){
  var active, tabs, table, t;

  if(typeof tab == "string") tab = $(`td[class="tab"]:contains("${tab}")`).node();
  if(tab.className == "tab tabActive") return;

  active = $('td[class="tab tabActive"]').node();
  tabs = $(active).up('table').node();
  table = $('table[class="mainTable"]').node();

  tabs.rows[0].cells[active.cellIndex].className = "tabTop";
  active.className = "tab";

  tabs.rows[0].cells[tab.cellIndex].className = "tabTop tabTopActive";
  tab.className = "tab tabActive";

  table.rows[tab.cellIndex - 1].className = "tabRow";
  table.rows[active.cellIndex - 1].className = "tabRowHide";

  for(t in $t){
    if($t[t].openFilter)
      $t[t].openFilter.hide();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function openAdvertWindow(mode, text, list){
  var window, hide;

  window = $("#acfd_advertWindow").node();
  hide = mode == "rent" ? "display: table-row;" : "display: none";

  createSelectList();

  $(window).find('span[type="count"]').html(list.length);
  $(window).find('input[name="action"]').node().value = mode;
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

    $(window).find('select[name="iid"]').html(code);
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

  t = $t.items;
  t.setStructure({
    section: [150, "check", "Тип предмета"],
    level: [28, "number", "Минимальный уровень"],
    name: [-1, "check", "Название предмета"],
    durability: [50, "number", "Прочность"],
    cost: [100, "number", "Стоимость предмета"],
    renew: [115, "number", "Обновление предмета"],
    refund: [100, "number", "Возврат с продажи"],
    sell: [75, "boolean", "Объявление, продажа|добавленные|тех что добавлены"],
    buy: [75, "boolean", "Объявление, покупка|добавленные|тех что добавлены"],
    rent: [75, "boolean", "Объявление, аредна|добавленные|тех что добавлены"],
    check: [45, null, null]
  });

  $('#header-items').html('@include: ./html/itemsTableHeader.html, true');
  $('#footer-items').html('@include: ./html/itemsTableFooter.html, true');

  t.setSizes();
  t.setSorts(renderItemsTable);
  t.setFilters(renderItemsTable);
  t.bindCheckAll();

  t = $t.adverts;
  t.setStructure({
    section: [150, "check", "Тип предмета"],
    level: [28, "number", "Минимальный уровень"],
    name: [-1, "check", "Название предмета"],
    mod: [165, "check|boolean", "Модификтор|с модом|что с модом"],
    action: [80, "multiple", "Тип объявления"],
    island: [130, "multiple", "Остров"],
    durNow: [50, "number|boolean", "Прочность (текущая)|новые предметы|новых предметов"],
    termPost: [50, "number", "Срок размещения"],
    termRent: [50, "number", "Срок аредны"],
    update: [60, "date", "Дата изменения"],
    price: [75, "number", "Цена предмета"],
    posted: [28, "boolean", "Размещенные на доске|размещенные|не размещенные"],
    autoPost: [28, "boolean", "Авто-продление объявления|с продлением|тех что с продлением"],
    check: [45, null, null]
  });

  $('#header-adverts').html('@include: ./html/advertsTableHeader.html, true');
  $('#footer-adverts').html('@include: ./html/advertsTableFooter.html, true');

  t.setSizes();
  t.setSorts(renderAdvertsTable);
  t.setFilters(renderAdvertsTable);
  t.bindCheckAll();

  t = $t.stats;
  t.setStructure({
    section: [150, "check", "Тип предмета"],
    level: [28, "number", "Минимальный уровень"],
    name: [-1, "check", "Название предмета"],
    mod: [50, "check|boolean", "Модификтор|с модом|что с модом"],
    cost: [50, "number", "Стоимость предмета"],
    price: [75, "number", "Цена предмета"],
    rate: [65, "number", "Цена предмета"],
    durMax: [60, "number", "Прочность максимальная"],
    fast: [50, "boolean", "Мнгновенная продажа|с быстрой продажей|быстрой продажи"],
    island: [130, "multiple", "Остров"],
    seller: [150, "check", "Имя продавца"],
    actions: [50, null, null],
    check: [45, null, null]
  });

  $('#header-stats').html('@include: ./html/statsTableHeader.html, true');
  $('#footer-stats').html('@include: ./html/statsTableFooter.html, true');

  t.setSizes();
  t.setSorts(renderStatsTable);
  t.setFilters(renderStatsTable);
  t.bindCheckAll();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderItemsTable(mode){
  var table, items, missing;

  // Их нет на доске, скрываем.
  missing = {
    oldcompass: 1,
    bottleopener: 1,
    ganjacup: 1,
    pendant: 1,
    flashlight: 1
  };

  table = $t.items;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    items = Object.keys($items.item);

    items.forEach((id)=>{
      if(missing[id]) return;
      table.pushContent(Create.item($items.item[id], $adverts));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(true);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderAdvertsTable(mode){
  var table, adverts;

  table = $t.adverts;

  if(mode == null){
    mode = "filter";
    table.clearContent();
    adverts = Object.keys($adverts);

    adverts.forEach((id)=>{
      table.pushContent(Create.advert($adverts[id], $items.item[$adverts[id].id]));
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
    prices = Object.keys($prices.list);

    prices.forEach((id)=>{
      data = id.split("-");
      table.pushContent(Create.stats($prices.list[id], $items.item[data[1]], Number(data[0])));
    });
  }

  table.prepare(mode);
  showTable(table).then(()=>{
    table.bindClickRow(false);

    date = $c.getNormalDate($prices.time);
    $('#acfd_time-update').text(`${date.d} ${date.t}`);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderTables(){
  renderItemsTable();
  renderAdvertsTable();
  renderStatsTable();
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
      case "items":
        return '@include: ./html/itemsTableRow.html, true';
        break;
      case "adverts":
        return '@include: ./html/advertsTableRow.html, true';
        break;
      case "stats":
        return '@include: ./html/statsTableRow.html, true';
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
    var m;

    if(row.mod == 0) return "";
    m = $mods(row.section)[row.mod];
    if(m == null) return "";

    if(short == null){
      return `<span title="Эффект: ${m.d}, вероятность выпадения: ${m.f}">${m.name} ${m.fn}</span>`;
    }else{
      return `<span title="${m.fn}, эффект: ${m.d}, вероятность выпадения: ${m.f}">${m.name}</span>`;
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

  if($items.names == null || update){
    $items = {
      item: {},
      names: {}
    };
  }else{
    return true;
  }
  /////////////////////////////

  sections = {
    names: []
  };

  ajax("http://www.ganjawars.ru/shopc.php", "GET", null).then((r)=>{
    $($answer)
      .html(r.text)
      .find('font:contains("Разделы")')
      .up('table')
      .find('a[href*="shopc.php"]')
      .nodeArr()
      .forEach((node)=>{
        name = node.textContent;
        sections[name] = node.href;
        sections.names.push(name);
    });

    progress.start("Сбор новых данных предметов с Hi-Tech магазина, разделы", sections.names.length, 750);
    getData(0, sections.names.length);
  });
  /////////////////////////////

  function getData(index, max){
    var table, data, url;

    if(progress.isWork(getData, arguments)) return;
    if(index < max){
      url = sections.names[index];
      url = sections[url];

      ajax(url, "GET", null).then((r)=>{
        $($answer)
          .html(r.text)
          .find('td[width="800"]')
          .find('a[href*="item.php"]')
          .each((node)=>{
            table = $(node).up('table').node();

            data = {};
            data.id = getID(node);
            data.name = getName();
            data.section = getSection();
            data.cost = getCost();
            data.refund = getRefund();
            data.durability = getDurability();
            data.level = getLevel();

            $items.item[data.id] = data;
            $items.names[data.name] = data.id;
          });

        progress.work(false, r.time);
        index++;
        getData.gkDelay(750, null, [index, max]);
      });
      /////////////////////////////

      function getID(node){
        return node.href.split(/item_id=/)[1];
      }
      /////////////////////////////

      function getName(){
        return $(table).find('font').text();
      }
      /////////////////////////////

      function getSection(){
        return sections.names[index];
      }
      /////////////////////////////

      function getCost(){
        var cost;

        cost = $(table).find('b:contains("Стоимость:")').next('b').text();
        cost = cost.match(/(\d+)/)[1];
        cost = Number(cost);

        return cost;
      }
      /////////////////////////////

      function getRefund(){
        var refund;

        if(data.section == "Аптека") return 0;

        refund = data.cost / 10;
        refund = data.cost % 10 ? parseInt(refund, 10) + 1 : refund;
        refund = data.cost - refund;

        return refund;
      }
      /////////////////////////////

      function getDurability(){
        var durability;

        durability = $(table).find('b:contains("Прочность:")').node();
        durability = durability.nextSibling.textContent;
        durability = Number(durability);

        return durability;
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
      /////////////////////////////
    }else{
      $ls.save("gk_acfd_items", $items);
      console.log(update);
      update ? renderItemsTable() : createGUI();
      progress.done();
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadData(){
  $data = $ls.load("gk_acfd_data");
  $prices = $ls.load("gk_acfd_stats");

  if($data.time == null){
    $data = {
      time: 0,
      buyEun: 0,
      sellEun: 0
    };

    $ls.save("gk_acfd_data", $data);
  }

  if($prices.time == null){
    $prices = {
      time: $c.getTimeNow(),
      list: {}
    };

    $ls.save("gk_acfd_stats", $prices);
  }
}