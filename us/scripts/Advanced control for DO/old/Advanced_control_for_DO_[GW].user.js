// ==UserScript==
// @name        Advanced control for DO [GW]
// @namespace   гном убийца
// @description Улучшенное управление доской объявлений в gw.
// @include     http://www.ganjawars.ru/forum.php
// @version     0.1
// @grant       none
// ==/UserScript==


(function () {
    var list = [
        "Штурмовые винтовки",
        "Пулемёты",
        "Снайперские винтовки",
        "Пистолеты-пулемёты",
        "Пистолеты-пулемёты",
        "Дробовики",
        "Гранатометы",
        "Броня",
        "Шлемы",
        "Броня ног",
        "Маскировка",
        "Тепловизоры",
        "Оборудование",
        "Аптека",
        "Транспорт"
    ];
    var db = {
        "Штурмовые винтовки": {
            "g11": {name: "Винтовка G-11", cost: 8, durability: 50},
            "oicw": {name: "OICW 5.56", cost: 9, durability: 60},
            "an94": {name: "АН-94", cost: 25, durability: 70},
            "f2000": {name: "Винтовка F2000", cost: 45, durability: 80},
            "fnfnc": {name: "FN FNC", cost: 45, durability: 60},
            "hk_416": {name: "HK416", cost: 50, durability: 60},
            "groza": {name: "Гроза-1", cost: 55, durability: 60},
            "ka90": {name: "KA-90", cost: 60, durability: 62},
            "taiga": {name: "АБ-762 Тайга", cost: 64, durability: 63},
            "xcr": {name: "XCR 5.56", cost: 64, durability: 60},
            "tkb517": {name: "ТКБ-517", cost: 67, durability: 60},
            "steyr_a3": {name: "Steyr A3", cost: 65, durability: 60},
            "ak103": {name: "AK-103", cost: 65, durability: 60},
            "g36": {name: "HK G36", cost: 70, durability: 50},
            "g41": {name: "HK G41", cost: 75, durability: 50},
            "sig552": {name: "SG-552 SWAT", cost: 75, durability: 50},
            "ace": {name: "Galil ACE", cost: 75, durability: 50},
            "colt692": {name: "Colt 692 \"SpecOps\"", cost: 75, durability: 55},
            "thales": {name: "Thales F90", cost: 70, durability: 55},
            "thales_grl": {name: "Thales F90 Launcher", cost: 70, durability: 55}
        },
        "Пулемёты": {
            "pkp": {name: "ПК 7,62", cost: 18, durability: 60},
            "ameli": {name: "Амели", cost: 30, durability: 70},
            "hk21": {name: "HK-21 Wiper", cost: 45, durability: 80},
            "rpk74": {name: "РПК", cost: 55, durability: 60},
            "pkm": {name: "ПКМ", cost: 45, durability: 60},
            "m16lmg": {name: "Colt M16 LMG", cost: 50, durability: 60},
            "aa52": {name: "АА-52 Attaque", cost: 55, durability: 58},
            "mg43": {name: "HK MG-43", cost: 64, durability: 60},
            "pssg": {name: "ПССГ", cost: 66, durability: 62},
            "ares16": {name: "Ares 16 AMG", cost: 68, durability: 60},
            "spitfire": {name: "FN BRG-17 Spitfire", cost: 70, durability: 62},
            "pkms": {name: "ПКМС 7,62", cost: 70, durability: 62},
            "minigun762": {name: "MiniGun 7.62", cost: 76, durability: 50},
            "mg50": {name: "MG-50", cost: 78, durability: 50},
            "ultimax": {name: "Ultimax HMG", cost: 70, durability: 50},
            "shrike": {name: "Ares Shrike 5.56", cost: 70, durability: 50},
            "ng7": {name: "Negev NG7", cost: 78, durability: 55},
            "lwmmg": {name: "LWMMG .338", cost: 69, durability: 55}
        },
        "Снайперские винтовки": {
            "barret": {name: "Barret M99", cost: 40, durability: 50},
            "bfg": {name: "BFG-50", cost: 50, durability: 60},
            "tactical600": {name: "Tactical M-600", cost: 50, durability: 50},
            "pgm": {name: "PGM Mini-Hecate .338", cost: 45, durability: 60},
            "m89sr": {name: "TEI M89-SR", cost: 45, durability: 50},
            "m107": {name: "Barrett M107", cost: 50, durability: 45},
            "vssk": {name: "ВССК \"Выхлоп\"", cost: 50, durability: 50},
            "rt20": {name: "RT-20 Silent Shot", cost: 74, durability: 60},
            "cs5": {name: "McMillan CS5", cost: 74, durability: 60},
            "barret_xm500": {name: "Barret XM500", cost: 80, durability: 62},
            "m85": {name: "Parker-Hale M-85", cost: 80, durability: 55},
            "steyr_ste": {name: "Steyr Scout Tactical", cost: 80, durability: 50},
            "rangemaster": {name: "RPA Rangemaster", cost: 72, durability: 50},
            "mauser93": {name: "Mauser SR-93", cost: 75, durability: 50},
            "ar10": {name: "Armalite AR-10", cost: 78, durability: 55},
            "thor": {name: "Thor M408", cost: 70, durability: 55},
            "awm": {name: "Arctic Warfare Magnum", cost: 70, durability: 60}
        },
        "Пистолеты-пулемёты": {
            "mp5": {name: "MP-5", cost: 12, durability: 50},
            "berettam12": {name: "Beretta M12", cost: 18, durability: 50},
            "scorpion": {name: "Scorpion", cost: 20, durability: 50},
            "stkinetics": {name: "Kinetics CPW", cost: 25, durability: 50},
            "p90": {name: "P-90", cost: 30, durability: 60},
            "90m1": {name: "ПП-90М1", cost: 35, durability: 62},
            "mp7": {name: "HK MP-7", cost: 40, durability: 60},
            "kriss2": {name: "TDI Kriss V2", cost: 40, durability: 50},
            "mtar21": {name: "MTAR-21", cost: 35, durability: 50},
            "pm06": {name: "PM-06", cost: 35, durability: 50},
            "uzipro": {name: "Uzi Pro", cost: 32, durability: 55}
        },
        "Дробовики": {
            "mossberg": {name: "Mossberg 590", cost: 50, durability: 40},
            "vepr": {name: "Вепрь-12", cost: 50, durability: 50},
            "mag7": {name: "MAG-7", cost: 40, durability: 40},
            "usas12": {name: "USAS-12", cost: 45, durability: 50},
            "ksg": {name: "Kel-Tec KSG", cost: 48, durability: 60},
            "usas15": {name: "USAS-15", cost: 70, durability: 50},
            "uts15": {name: "UTAS UTS-15", cost: 70, durability: 60},
            "fabarm": {name: "FABARM Tactical", cost: 70, durability: 55}
        },
        "Гранатометы": {
            "milkor": {name: "Milkor MGL", cost: 58, durability: 40},
            "mk47": {name: "Mk 47 Striker", cost: 75, durability: 50}
        },
        "Броня": {
            "bronik3c": {name: "Легкая броня 3 класса", cost: 11, durability: 60},
            "bronik4c": {name: "Легкая броня 4 класса", cost: 38, durability: 80},
            "bronik5c": {name: "Легкая броня 5 класса", cost: 42, durability: 70},
            "bronik6c": {name: "Легкая броня 6 класса", cost: 45, durability: 60},
            "blackhawk": {name: "Бронежилет \"Blackhawk\"", cost: 40, durability: 40},
            "armour_p300": {name: "Бронежилет P-300", cost: 48, durability: 60},
            "blackcell": {name: "BlackCell", cost: 45, durability: 50},
            "rbr": {name: "RBR Tactical", cost: 40, durability: 40},
            "armour_patrol": {name: "Бронежилет \"Патруль\"", cost: 50, durability: 50},
            "delta5": {name: "Delta 5 Tactical", cost: 50, durability: 60},
            "mr1_armour": {name: "Броня MR-1", cost: 50, durability: 60},
            "delta7": {name: "Delta 7 TA", cost: 50, durability: 50},
            "fav": {name: "FAV Armour", cost: 55, durability: 60},
            "protector": {name: "Броня «Protector»", cost: 60, durability: 70}
        },
        "Шлемы": {
            "lwhelmet": {name: "Шлем Land Warrior", cost: 35, durability: 80},
            "empires": {name: "Имперский шлем", cost: 50, durability: 60},
            "sas_helmet": {name: "Шлем SAS", cost: 55, durability: 60},
            "chelmet": {name: "Кевларовый шлем", cost: 35, durability: 35},
            "spectra": {name: "Шлем \"Spectra\"", cost: 45, durability: 50},
            "arhelmet": {name: "AR Helmet", cost: 39, durability: 48},
            "fasthelmet": {name: "F.A.S.T. Helmet", cost: 44, durability: 40},
            "helmetmk6": {name: "Шлем Mk-6", cost: 50, durability: 50},
            "mpas": {name: "Шлем MPAS", cost: 50, durability: 50},
            "g15helmet": {name: "G-15 Helmet", cost: 50, durability: 50},
            "ksfhelmet": {name: "KSF Helmet", cost: 60, durability: 70}
        },
        "Броня ног": {
            "lowshieldc": {name: "Титановые щитки", cost: 10, durability: 50},
            "cboots": {name: "Кевларовые сапоги", cost: 20, durability: 50},
            "shields_la": {name: "Щитки Light Alloy", cost: 25, durability: 50},
            "hboots": {name: "Хромовые сапоги", cost: 30, durability: 50},
            "dboots": {name: "Десантные сапоги", cost: 40, durability: 50},
            "swatboots": {name: "Ботинки SWAT", cost: 50, durability: 50},
            "cobraboots": {name: "Ботинки \"Кобра\"", cost: 52, durability: 52},
            "officerboots": {name: "Ботинки офицера", cost: 54, durability: 60},
            "bootspec": {name: "Ботинки SpecOps", cost: 60, durability: 70}
        },
        "Маскировка": {
            "maskl": {name: "Лесной маскхалат", cost: 20, durability: 80},
            "rockycamo": {name: "Rocky Camo", cost: 30, durability: 45},
            "predator": {name: "Маскхалат Predator", cost: 30, durability: 45},
            "mesh": {name: "Mesh Ghillie Mask", cost: 30, durability: 45},
            "forester": {name: "Маскхалат Forester-1", cost: 30, durability: 40},
            "jackpyke": {name: "Маскхалат Jack Pyke", cost: 32, durability: 45},
            "swatcamo": {name: "SWAT Camo", cost: 38, durability: 48},
            "deltamask": {name: "Камуфляж \"Delta\"", cost: 40, durability: 50}
        },
        "Тепловизоры": {
            "ilight": {name: "Очки iLight", cost: 20, durability: 40},
            "deye": {name: "Digital Eye", cost: 30, durability: 40},
            "nighthawk": {name: "NightHawk IR", cost: 64, durability: 50},
            "atn14": {name: "ATN FIITS 14", cost: 65, durability: 50},
            "edge": {name: "Pulsar Edge", cost: 60, durability: 50},
            "nvg1": {name: "NVG1 Pro", cost: 53, durability: 50},
            "pvs21": {name: "Тепловизор PVS-21", cost: 45, durability: 50}
        },
        "Оборудование": {
            "nokia9500": {name: "Nokia 9500", cost: 20, durability: 40},
            "fan": {name: "Веер", cost: 10, durability: 20},
            "brelok": {name: "Брелок", cost: 10, durability: 18},
            "cigar": {name: "Сигара", cost: 10, durability: 20},
            "clocks": {name: "Карманные часы", cost: 10, durability: 20},
            "gift_wallet": {name: "Дамский кошелек", cost: 20, durability: 25},
            "gift_watch": {name: "Наручные часы", cost: 21, durability: 25},
            "lighter": {name: "Зажигалка", cost: 10, durability: 20},
            "n81": {name: "Nokia N81", cost: 30, durability: 40},
            "fieldcomp": {name: "Полевой компьютер", cost: 20, durability: 40},
            "n95": {name: "Nokia N95", cost: 40, durability: 40},
            "saperka3": {name: "Складная лопата", cost: 20, durability: 50},
            "attackbelt": {name: "Пояс штурмовика", cost: 20, durability: 40},
            "ammobelt": {name: "Патронташ", cost: 20, durability: 40},
            "watch_ganjarmani": {name: "Часы Ganjarmani", cost: 30, durability: 25},
            "mealpack": {name: "Сухой паек", cost: 24, durability: 40},
            "gwatch": {name: "GWatch", cost: 50, durability: 40},
            "cbelt": {name: "Кевларовый пояс", cost: 24, durability: 40},
            "sw_gp34": {name: "ГП-34", cost: 5, durability: 1},
            "ganjapad": {name: "GanjaPad", cost: 60, durability: 40}
        },
        "Аптека": {
            "ganjacola": {name: "Ганжа-кола", cost: 2, durability: 3},
            "mentats": {name: "Ментаты", cost: 2, durability: 3},
            "minimedikit": {name: "Мини-аптечка", cost: 2, durability: 4},
            "medikit": {name: "Аптечка", cost: 5, durability: 15},
            "bigmedikit": {name: "Большая аптечка", cost: 25, durability: 100}
        },
        "Транспорт": {
            "slr": {name: "Mercedes SLR", cost: 20, durability: 80},
            "apache": {name: "Вертолёт Apache", cost: 30, durability: 60},
            "mi8": {name: "Вертолёт МИ-8", cost: 40, durability: 60},
            "cadillac": {name: "Cadillac DTSL", cost: 35, durability: 50},
            "chinook": {name: "CH-47 \"Chinook\"", cost: 50, durability: 50},
            "harley": {name: "Harley-Davidson Road King", cost: 25, durability: 50}
        }
    };


    var css = {
        "#acfd_button_start":{
            "text-decoration": "underline",
            "cursor": "pointer"
        },
        "span[id=acfd_content] > div table":{
            "border": "1px solid #339933",
            "border-collapse": "collapse"
        },
        "span[id=acfd_content] > div table tr":{
            "border": "1px solid #339933",
            "border-collapse": "collapse"
        },
        "span[id=acfd_content] > div table tr td":{
            "border": "1px solid #339933",
            "border-collapse": "collapse"
        },
        "table[type=gui] tr td":{
            "font-weight": "800",
            "text-align": "center"
        },
        "table[type=gui] tr":{
            "height": "30px"
        },
        "table[type=gui] tr[type=header]":{
            "height": "24px",
            "background-color": "#d0eed0"
        }
    };

    var $answerSpan = DCE('span');

    if(location.pathname == "/forum.php"){
        addButton();
        parseDO();
        addStyle(css);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function addButton(){
        var button, node;

        node = QS('a[href*="forum.php"]');
        button = DCE('span');
        button.innerHTML = ' | <span id="acfd_button_start" title="Улучшенное управление доской объявлений">Работа с ДО</span>';

        node.parentNode.insertBefore(button, node.nextSibling);

        bindEvent(QS('#acfd_button_start'), "onclick", prepareContent);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function prepareContent(){
        var table, newContent;

        newContent = DCE('span');
        newContent.setAttribute('id', 'acfd_content');
        table = QS('b:contains("Форум")').offsetParent.offsetParent.offsetParent.offsetParent;
        table.parentNode.insertBefore(newContent, table);
        table.parentNode.removeChild(table);

        addGUI(QS('#acfd_content'));
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function addGUI(content){

        content.innerHTML = "<div>1</div><div>" + createHeader() + "</div><div>2</div>";

        function createHeader(){
            return '<table type="gui" align="center">'+
                        '<tr type="header">'+
                            '<td>Предмет</td>'+
                            '<td>Действие</td>'+
                            '<td>Остров</td>'+
                            '<td>Цена</td>'+
                            '<td>Модификатор</td>'+
                            '<td>Прочность</td>'+
                            '<td>Время</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td>&nbsp;<select id="item_id"></select>&nbsp;</td>'+
                            '<td>&nbsp;<select id="action_id"><option value=1>Продаю</option><option value=3>Сдаю</option></select>&nbsp;</td>'+
                            '<td>&nbsp;<select id="island"><option value=-1>Не имеет значения</option><option value=0>[G] G - Land</option><option value=1>[Z] Z - Land</option><option value=4>[P] P - Land</option></select>&nbsp;</td>'+
                            '<td>&nbsp;<input type=text size=6 value=0 id="price" />&nbsp;</td>'+
                            '<td>&nbsp;<select id="mod" style="width:205px;"></select>&nbsp;</td>'+
                            '<td>&nbsp;<input type=text size=2 id="durability1" value="50" /> / <input type=text size=2 id="durability2" value="50" />&nbsp;</td>'+
                            '<td>&nbsp;<select id="date_len"><option value=1>1 день</option><option value=2>2 дня</option><option value=3>3 дня</option></select>&nbsp;</td>'+
                        '</tr>'+
                        '<tr type="header">'+
                            '<td colspan=6 align=right>размещять на доске: <input type=checkbox id="send_sell_box" style="cursor:pointer;" />&nbsp;&nbsp;</td>' +
                            '<td align=center><input type=button value=Подать onclick=add_to_my_do() /></td>'+
                        '</tr>'+
                    '</table>';
        }
    }


    function parseDO(){

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function addStyle(style){
        var css;

        css = DCE("style");
        css.setAttribute("type", "text/css");
        css.setAttribute("script", "true");
        css.innerHTML = gCSS(style);

        document.head.appendChild(css);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function gCSS(css){
            var style, sCSS, i, length;

            sCSS = JSON.stringify(css);
            style = "";

            for(i = 1, length = sCSS.length - 1; i < length; i++){
                if(sCSS.charAt(i) == ":" && sCSS.charAt(i + 1) == "{"){
                    i++;
                }
                if(sCSS.charAt(i) != "\""){
                    if(sCSS.charAt(i) == ","){
                        if(sCSS.charAt(i - 1) != "}"){
                            style += "; ";
                        }else{
                            i++;
                        }
                    }else if(sCSS.charAt(i) == "}"){
                        if(i != length - 1){
                            style += ";}\n";
                        }else{
                            style += ";}";
                        }
                    }else{
                        style += sCSS.charAt(i);
                    }
                }
            }
            return style;
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
            element.attachEvent(event, callback);
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function REQ(url, method, param, async, onsuccess, onfailure) {
        var request = new XMLHttpRequest();

        if (async == true) {
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200 && typeof onsuccess != 'undefined') onsuccess(request);
                else if (request.readyState == 4 && request.status != 200 && typeof onfailure != 'undefined') onfailure(request);
            }
        }

        if (method == 'POST'){
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        request.open(method, url, async);
        request.send(param);

        if (async == false) {
            if (request.status == 200 && typeof onsuccess != 'undefined') onsuccess(request);
            else if (request.status != 200 && typeof onfailure != 'undefined') onfailure(request);
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function DCE(elem){return document.createElement(elem);}
    function QS(param, element){
        var result, string;
        var i, length;

        string = param.match(/(.+):contains\("(.+)"\)/);
        if(string){
            param = string[1];
            result = element == null ? document.querySelectorAll(param) : element.querySelectorAll(param);

            for(i = 0, length = result.length; i < length; i++){
                if(result[i].textContent == string[2]){
                    result = result[i];
                    break;
                }
            }

            if(result.length){
                result = null;
            }
        }else{
            result = element == null ? document.querySelector(param) : element.querySelector(param);
        }

        return result;
    }
    function QSA(param, element){return element == null ? document.querySelectorAll(param) : element.querySelectorAll(param);}

})();