// ==UserScript==
// @name             Outlander [GW]
// @namespace        http://www.ganjawars.ru/info.php?id=611489
// @include          http://quest.ganjawars.ru/*
// @version          1.6 
// @author           Jimmy Banditto (fix гном убийца)
// ==/UserScript==

(function() {
    // Костыль для Оперы, против ложных срабатыванйи на левых страницах
    if (window.location.href.indexOf('quest.ganjawars.ru') == -1) return;

    var SettingsURI = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%0C%00%00%00%0C%08%06%00%00%00Vu%5C%E7%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%01~IDAT(%CFc%60%C0%01%9A%5B%9ByN%9D%3A%D9v%F9%CA%A5%A7%5B%B7m%BE%D2%D3%DB%E5%CB%C0%C0%C0%C0%82K%03%0B3s%9E%8E%8EN%E5%9B7o%18%D6%ACY%B7%E3%F1%E3G%3F5%B54%98pj%F8%F4%E9s%EC%E7%CF%9F%19%BE%7C%F9%CA0%7F%DE%FCd%988%23%0E%F5%02K%96.z%2F%2C%2C%CA%60cm%CD%B0%7C%C5%F2%852%D22%DD%D7o%5C%CFdBV%F5%FF%FF%7F%06%06%06%06%86%F9%0B%E6%A5%FF%FC%F9%9Ba%C1%A2%25%FF%CF%9D%BB%F0_KK%2B%FE%F7%9F%DFW%AE%5D%BD%A6%08W%9C%91%99%CE%C0%C0%C0%C00o%C1%5C%ED%F7%EF%DE%BE%DC%B3o%CF%7F'W%F7%FF%2BW%AF%FE%7F%F3%D6%8D%FFaa%A1%B7%05%05%05%95%19%1A%9A%EA%E0%9A%D6oXg%BE%7D%FB%B6%D7%EB%D7%AF%FF%FF%F9%F3%A7o%CD-%CD%E7--%CC%E7000%C4200%08%A18z%EB%B6%CD%C5%7D%FD%BD%7F%FC%FC%7C%FFo%DE%B2%F9wnnN%3CV%DF%E9%E8%E9%B0%CE%5D0%7BIaQ%C1_qq%F1%FF%DD%BD%DD%FF%B3%B2%B3Rq%85%1ESRb%FC%E4%BB%B7%EFE%EF%DB%BB%9F14%3C%94%81%99%99a%CE%B4%A9%D3%E6%2B%2B%2Bb%D5%C08o%C1%9C%87%8F%1E%3D%94cddd%60aa%3BP%5DY%13%C2%C0%C0%F0%16g%84~%FE%FC9%95%95%95u%FA%A3%87%8F%F6%AF%5E%B5%AE%94%81%81%E1%3D%03%1E%00%00%26%E6%9F%23%18%EE%92O%00%00%00%00IEND%AEB%60%82";
    var OkURI = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%03%00%00%00(-%0FS%00%00%00%03sBIT%08%08%08%DB%E1O%E0%00%00%00%09pHYs%00%00%01%BB%00%00%01%BB%01%3A%EC%E3%E2%00%00%00%19tEXtSoftware%00www.inkscape.org%9B%EE%3C%1A%00%00%01%0EPLTE%FF%FF%FF%00N%00%00I%00%00U%00%00L%00%00O%00%00M%00%00N%00%00M%00%00K%00%00N%00%00M%00%00L%00%00M%00%00L%00%00N%00%00L%00%02P%02%04S%04%04S%04%03R%03%02N%02%02N%02%02M%02%02H%02%00%5B%00%13d%12%01%5B%01%0Eh%0C%17f%15%17i%15%15k%12%11k%0E%0Eh%0B%09_%07%12k%10%10%5C%0D%18%5D%14%17V%11%1AT%12%1CP%11%1CP%14%2C%84%23G%BA%0EJ%8D0M%7D)N%82-N%8B1P%AC*T%83-W%C2%18X%A0BY%9FA%5B%9C%3F%5D%B2-d%B1Pd%BA2s%B4dv%B5cv%BCYw%C0Uy%B8a%7B%BBf%7F%C0h%7F%C85%82%C6E%83%C2J%88%C2z%89%BDK%89%C6%7B%8A%C1W%8A%C1%5B%8E%C4%60%8E%C7D%8F%C9%5C%90%BDk%90%C1o%91%C5i%91%DE%3E%93%C6p%93%C8j%96%C3l%98%D5G%99%D0%8F%99%D2%90%9A%C8h%9A%CB%7B%9D%C9m%A6%D0w%B6%EA%A1)%EC%EF%A8%00%00%00%2BtRNS%00%0D%0E%18%1B%1D!%2423456Fklr%8D%90%91%95%9A%9D%A0%A3%BC%D6%D8%DB%E6%E7%E9%EB%ED%F5%F5%F6%F7%F9%F9%FA%FA%FE%0D%0E%C0%F1%00%00%00%82IDAT%18%D3c%60%20%05%B0%0A0%A1%F0%D9%14%AD%A4%19%91%E5%15%C2%22m%25A%2C~ea%20%C9%22%EF%1F%12%EC%23%05d%F1iE%18%0B10%CB%F9%BA%3A%7B%2Bq%00%05dB-%03LDd%3D%EC%ED%02U8A%3A%04u%DC%CD%BDL%DDl%AC%C3U%B9%20%A6%89%EA%3B%198Z%98%B9%A8q%C1%CC%17%D3s%D06%F2T%E7F%D8(n%E8%17%A4%C9%8D%EC%26%09%5D%0D%1ETW%F3%B2%13%EFC%00~%C7%0F%C0%9E.Ow%00%00%00%00IEND%AEB%60%82";
    var CancelURI = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%06bKGD%00%FF%00%FF%00%FF%A0%BD%A7%93%00%00%00%09pHYs%00%00%0D%D7%00%00%0D%D7%01B(%9Bx%00%00%00%07tIME%07%D7%0C%1B%16%19%10%1F%1B%DD%16%00%00%02%BAIDATx%DAe%CF%5Bh%D5%05%00%C7%F1%CF%FF%7F%CE%D9%CE%CE%AE%E7lG%CB%E6jc%8B%DA%1C9-%A4%07%83%12%82.%F4%12EX%0F%16%12J%A3%8722%C9%B1(%D4%20%7C%EB%A1%7C%ACH%09%04%E9%A1%CB%C0%20XZ%8B%F5%92L%D2%1C%9C%AD%E9n%EDv%B6s%B6s%0B%1Fm%9F%87%DF%E3%17~%01%9B%7DDC%82%7D1%1E%08%88%16%C9%14%B8%F8%0E%13%FE%E7%8E%C0qj%1B%18%A8%09%C37Zw%EF%AEM%F7%F4%08c1%8B%E3%E32%C3%C3%E5l.w~%9D%B7%8F%91%D9%14%18%60K%13%DF%B7n%DF%DE%D7%D7%DF%AF%AE%AD%ED%8E%FA%C6%CA%8A%2Bg%CE%B8622%BF%C63G%F9%15%02x%96%E8%E3%5ClK%26%F7%3E%D4%7FX%B4..%12%06T%02J%94K%14K%25%01%AE%9F%3D%EB%AF%B1%B1%D9%25%FA%8E%F3O%08%8F%F2j%92%BD%F7%EE%E9%93%0B%B3%EEz%E5%80%15Y%1B%CB%D7%14%96%AE%9B%9F%BEa%EB%FE%FD%F2%D5%D5n%DFJG%22%E98%A7%10%84%88%248%9C%8C%84bMy%85%E6%A4%9Am%DBu%1D%3Af%BA%B4.37%AE%E3%CD%23%EA%3B%3B%C5%7B%BB-MNH%D5%D7K%F0%E2%7B4G%0E%90%EE%E0%93t%BC%12%D4%B7%CC%C8%CF%8C%CA%DCZ%D2%BE%F7i%5B%1E%D9%A7i%E7c%9A%BB%BA%5D%FD%E1%82%AB%83%075LO)%CE%2C%CBWD%CA%5C%0E%B7qO5A%F4%F6%04%EBZ%12%0BJ%BF%9D%F4%DD%E9A%F1%86%A4tW%8F%3F%7F%FA%D1%E8%A9%17%B4%B7%CC%AAj%CC%8A%D6R%8D*Z%C3u%8AU%08J%94%8B%14K%2C%16Sz%9F%7C%0E%40%FB%CE%87%C5%3BzU%1A%A9j%26RC%0C1%0A%E19%26BV%D7s%E4%16%19%9FO%D930%A4u%C7.%99%CB%E7%8D~uTm2%E5%A9%D3Cf%1Aw)%C4)%14%08%B0%C6X8%C9Z%9E%8B%1BE%E6%26%D9%FA%C4%EB%B6%3E%B8%CB%CDK%E7%DD%FA%FA%25%D5W%3Fv%ED%9B%23j%1ASv%BCv%C2%FC%3Ck%CB%94%99%FA%94%DF%23(w0%DD%C9%CB%1By%E1%C2%95a%85%D5)%93%E7%DE%97%88%16D%CA%E4n%5C%92%9D%F8%5B%E6%CB%13%B2%23ya%8E9%3E%FC%82%9F%03%40%FC3%06%DByw)%A4%92%A4%E6n%E2)bu%04%01%B9Y%B2WH%AC%B2%C1%D0%01%9E_d%25%00%40%C3%E7%1C%BB%9F%B7%96%89%AD%86%94%AB%11%12%16%88o%D0%84e.%7C%C0%A1Q%A6Q%89%00%60%FD%5B~%891%7C%1F%F5%C9%8At%5DQ%22Q%A0%AEd%B5%CC%E5%3F%188%C8%C9%9B%FC%8B%0A%046%0B%91%40%AA%9B%96z%A2%23%CC%94Y%40%16%25%00%F8%0F%80%A0%FF%98%BBZ%5BQ%00%00%00%00IEND%AEB%60%82";
    var MapBase = "data:image/png;base64,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";
    var FrameURI = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00d%00%00%00d%08%06%00%00%00p%E2%95T%00%00%00%01sRGB%00%AE%CE%1C%E9%00%00%00%B2IDATx%DA%ED%D1%A1%11%00%20%0C%04A%60%D2Q%AA%A5%DA%60R%01*b%CF%BC%FF%DDy%B3%96%C6%14%BD%DB%15%23%AA%E3%83Y%01%01%22%20%40%04%04%88%80%00%11%10%20%02%22%20%40%04%04%88%80%00%11%10%20%02%22%20%40%04%04%88%80%00%11%10%20%02%22%20%40%04%04%88%80%00%11%10%20%02%22%20%40%04%04%88%80%00%11%10%20%02%22%20%40%04%04%88%80%00%11%10%20%02%22%20%40%04%04%88%80%00%11%10%20%02%22%20%40%04%04%88%80%00%11%10%20%02%22%20%40%04%04%88%80%00%11%10%20%02%22%20%40%04%04%88%80%00%11%10%20%02%02D%40%04%04%88%FE%8A%DEr%C5%8C%1E9%C7%04%C9%D81%E9%5B%00%00%00%00IEND%AEB%60%82";
    var PointBase = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB9oGEAMGAYMzHp8AAADdSURBVCjPldIxToJBEAXgT0mstNGKzk47kz//KSi4xp9oxQm4B3exoiOhN9iRWNDCAZ4FA/xYqGyy2dnZ97LvzYwkjpsmzMIy7OqchaaPO4AHYRo+w2t4DDehDZOwqfdBnzQN7+Hh7OeTgmGYh+metJf0Fe4LMAqLsK1z1CNuQqM0v/UI69AVqKv7gTgJM2X2pZKL0P2Q1oVFxW1YqirdVnIbhhWnJ2tb8V3YXWOFZ/v1gTFIrio3rjw8YXXwNLnUU1NVGf6/eqc+zY/EP/t0PhGbktCW6V8m4sLZ+waFuzRKBAJDmAAAAABJRU5ErkJggg==";
    var SafeBase = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADcSURBVCiRlZI9asNAFIQ/InAVN0mlLl3SGYRO4cLXENiVTiCdQ3dJpU6Q3jhdIIVa6QCT4o1gLQiJFpb3szPLvB8ksVxQAepAH6DZtgMVdziDM1AD+gSdQS+gHagE1aDR71lKakDvoOf0x0RBDupBTcQh6Rv0ZMARNIAm22NCHAMfmi8J4QtUGVQ5Xoh14KPYg5MDqFpJq0CD/TLw0aVHJydQbr9NZE3296D5AbgBb8S5AicAida5k/MAr8arA9Vbayrclfzf3Uvm1C/EP+e02ojREkoX/ftGbN29H5Q5NEr66HK/AAAAAElFTkSuQmCC";
    
    var $showMap = GetCookie("outShowMap");

    var Sectors = [
        {Name: "Nou Lake", X: 0, Y: 3},
        {Name: "Shoretale", X: 0, Y: 4},
        {Name: "Sector SA98", X: 1, Y: 1},
        {Name: "Ejection Point", X: 1, Y: 2},
        {Name: "Dangerous Xith", X: 1, Y: 3},
        {Name: "Second Path", X: 1, Y: 4},
        {Name: "West Cape", X: 2, Y: 0},
        {Name: "Raged Land", X: 2, Y: 1},
        {Name: "Spherix point", X: 2, Y: 2},
        {Name: "Eye of Glory", X: 2, Y: 3},
        {Name: "Chelby", X: 2, Y: 4},
        {Name: "Tiger Lairs", X: 2, Y: 5},
        {Name: "South Tibet", X: 2, Y: 6},
        {Name: "North Beach", X: 3, Y: 0},
        {Name: "Alpha Three", X: 3, Y: 1},
        {Name: "Aikon", X: 3, Y: 2},
        {Name: "Thordendal", X: 3, Y: 3},
        {Name: "Tracid Line", X: 3, Y: 4},
        {Name: "Hypercube", X: 3, Y: 5},
        {Name: "Abbey road", X: 4, Y: 0},
        {Name: "Army Base", X: 4, Y: 1},
        {Name: "South Normand", X: 4, Y: 2},
        {Name: "Por Eso One", X: 4, Y: 3},
        {Name: "Freestates", X: 4, Y: 4},
        {Name: "World`s Corner", X: 4, Y: 5},
        {Name: "Threeforce", X: 5, Y: 0},
        {Name: "Overlord Point", X: 5, Y: 1},
        {Name: "East Cape", X: 5, Y: 2}
    ];

    var mapDragStartX = mapDragStartY = mouseDragStartX = mouseDragStartY = isDrag = 0;

    function SetCookie(name, value)
    {
        var expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        window.document.cookie = name + "=" + value + "; expires=" + expires.toGMTString();
    }

    function GetCookie(name)
    {
        var results = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        if(results)
            return(results[2]);
        else
            return null;
    }

    function DelCookie(name)
    {
        window.document.cookie = name + "=;expires=Thu, 01-Jan-70 00:00:01 GMT";
    }

    function ToggleMap()
    {
        if(!GetCookie("outShowMap")) {
            //Показываем карту и ставим плюшку
            window.document.getElementById("uMap").style.visibility = "visible";
            window.document.getElementById("Blank").style.visibility = "visible";
            SetCookie("outShowMap", 1);
        } else {
            //Убираем карту и чистим плюшку
            window.document.getElementById("uMap").style.visibility = "hidden";
            window.document.getElementById("Blank").style.visibility = "hidden";
            DelCookie("outShowMap");
        }
    }

    function ToggleSettings()
    {
        window.document.getElementById("outMapSize").selectedIndex = outMapSize;
        window.document.getElementById("outMapSafe").checked = outMapSafe;
        window.document.getElementById("outSettings").style.visibility = window.document.getElementById("outSettings").style.visibility == "visible" ? "hidden" : "visible";
    }

    function SaveSettings()
    {
        SetCookie("outMapSize", window.document.getElementById("outMapSize").selectedIndex);
        if(window.document.getElementById("outMapSafe").checked)
            SetCookie("outMapSafe", "1");
        else
            DelCookie("outMapSafe");
        outMapSize = window.document.getElementById("outMapSize").selectedIndex;
        outMapSafe = window.document.getElementById("outMapSafe").checked;
        ToggleSettings();
    }

    function ShowLabel(e)
    {
        // Обрабатываем Драг-н-дроп
        if(isDrag) {
            window.document.getElementById("uLabel").style.visibility = "hidden";
            window.document.getElementById("FrameIMG").style.visibility = "hidden";
            deltaX = e.pageX - mouseDragStartX;
            deltaY = e.pageY - mouseDragStartY;
            window.document.getElementById("uMap").style.left = mapDragStartX + e.pageX - mouseDragStartX;
            window.document.getElementById("uMap").style.top = mapDragStartY + e.pageY - mouseDragStartY;
            canvasXY = findPos(window.document.getElementById("MapCanvas"));
            window.document.getElementById("Blank").style.left = canvasXY[0];
            window.document.getElementById("Blank").style.top = canvasXY[1];
        } else {
            // Очередной костыль для ФФ :E
            if(typeof e.offsetX == 'undefined') {
                offsetX = e.layerX;
                offsetY = e.layerY;
                fX = 0;
                fY = 0;
            } else {
                offsetX = e.offsetX;
                offsetY = e.offsetY;
                fX = 1;
                fY = 1;
            }
            SectorName = getSectorName((offsetX - offsetX % 98) / 98 + sX, (offsetY - offsetY % 98) / 98 + sY);
            if(SectorName) {
                canvasXY = findPos(window.document.getElementById("MapCanvas"));
                window.document.getElementById("uLabel").style.left = canvasXY[0] + offsetX - offsetX % 98;
                window.document.getElementById("uLabel").style.top = canvasXY[1] + offsetY - offsetY % 98 - 2;
                window.document.getElementById("FrameIMG").style.left = canvasXY[0] + offsetX - offsetX % 98 - fX;
                window.document.getElementById("FrameIMG").style.top = canvasXY[1] + offsetY - offsetY % 98 - fX;
                window.document.getElementById("uLabel").innerHTML = SectorName;
                window.document.getElementById("uLabel").style.visibility = "visible";
                window.document.getElementById("FrameIMG").style.visibility = "visible";
            } else {
            window.document.getElementById("uLabel").style.visibility = "hidden";
            window.document.getElementById("FrameIMG").style.visibility = "hidden";
            }
        }
    }

    function HideLabel()
    {
        window.document.getElementById("uLabel").style.visibility = "hidden";
        window.document.getElementById("FrameIMG").style.visibility = "hidden";
    }

    function findPos(obj)
    {
        var curleft = curtop = 0;
        if (obj.offsetParent)
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
        return [curleft,curtop];
    }

    function getSectorName(x, y)
    {
        for(var i in Sectors)
            if((Sectors[i].X == x) && (Sectors[i].Y == y))
                return(Sectors[i].Name);

        return(false);
    }

    function DragStart(e)
    {
        mapXY = findPos(window.document.getElementById("uMap"));
        mapDragStartX = mapXY[0];
        mapDragStartY = mapXY[1];
        mouseDragStartX = e.pageX;
        mouseDragStartY = e.pageY;
        isDrag = true;
    }

    function DragStop(e)
    {
        isDrag = false;
        mapXY = findPos(window.document.getElementById("uMap"));
        SetCookie("outMapPosX", mapXY[0]);
        SetCookie("outMapPosY", mapXY[1]);
    }

    var NoBr = window.document.getElementsByTagName('nobr');
    NoBr[1].innerHTML = '<a id="showMap" href="#">Карта</a> <a id="showSettings" href="#"><img src="' + SettingsURI + '" title="Настройки" border="0" /></a> | ' + NoBr[1].innerHTML;

    // Определяем сектор и координаты
    var Sector = />(.+?)\</.exec(NoBr[0].innerHTML)[1];
    var Pos = /\>(\d+),(\d+)\</.exec(NoBr[0].innerHTML);
    if(Pos){
        var GPSx = 1 * Pos[1];
        var GPSy = 1 * Pos[2];
    }

    // Если включен показ сейфов, парсим их
    var outMapSafe = GetCookie("outMapSafe") ? true : false;
    if(outMapSafe)
    {
        var chat, table;
        var Safes = [];
        var SafeRegExp = /В\ секторе\ (.+?)\ \[(\d+),(\d+)\]\ лежит\ Сейф\ с\ (.+?)\ Гб/g;
        
        chat = document.getElementById("chatform");
        
        if(chat != null){
            table = chat.parentNode.parentNode.parentNode;
        }else{
            table = document.querySelector('table[width="100%"][cellspacing="0"][cellpadding="10"][border="0"]').rows[0].cells[0];
        }
        
        if(table != null){
            while((Safe = SafeRegExp.exec(table.innerHTML)) != null)
               Safes.push({Sector: Safe[1], X: 1*Safe[2], Y: 1*Safe[3], Cash: Safe[4]});
        }
    }

    // Создаем диалог настроек
    var outSettings = window.document.createElement('div');
    outSettings.id = 'outSettings';
    outSettings.style.position = 'absolute';
    outSettings.style.visibility = 'hidden';
    outSettings.style.top = '24px';
    outSettings.style.right = '5px';
    outSettings.style.border = '1px solid #393';
    outSettings.style.backgroundColor = '#d0eed0';
    outSettings.style.padding = '5px';
    outSettings.style.zIndex = '105';
    outSettings.innerHTML = '<p>Размер карты: '
    + '<select id="outMapSize">'
    + '<option>1x1</option>'
    + '<option selected>3x3 (по-умолчанию)</option>'
    + '<option>5x5</option>'
    + '<option>6x7 (вся карта)</option>'
    + '</select><br/>'
    + 'Показывать сейфы: <input type="checkbox" id="outMapSafe"></p>'
    + '<p style="text-align:right;"><a id="saveSettings" href="#"><img src="' + OkURI + '" title="Сохранить" border="0" /></a>&nbsp;&nbsp;&nbsp;<a id="closeSettings" href="#"><img src="' + CancelURI + '" title="Отменить" border="0"/></a></p>';
    window.document.body.appendChild(outSettings);

    // Вычисляем размер карты и создаем канву
    var outMapSize = GetCookie("outMapSize") ? GetCookie("outMapSize") : 1;
    var sXY = /(\d+)x(\d+)/.exec(window.document.getElementById("outMapSize").item(outMapSize).value);   

    // Вешаем функции на линки... заебал меня ФФ :E
    window.document.getElementById("showMap").addEventListener('click', ToggleMap, false);
    window.document.getElementById("showSettings").addEventListener('click', ToggleSettings, false);
    window.document.getElementById("closeSettings").addEventListener('click', ToggleSettings, false);
    window.document.getElementById("saveSettings").addEventListener('click', SaveSettings, false);

    for(var i in Sectors) {
        if(Sectors[i].Name == Sector) {
            SectorID = i;
            break;
        }
    }

    if(typeof(SectorID) == 'undefined') return false; // заглушка на новые карты аута, лечимся от ошибок

    // Вычисляем координаты отрисовки
    sX = Sectors[SectorID].X - (sXY[1] - sXY[1] % 2) / 2;
    sX = sX < 0 ? 0 : sX;
    sX = sX > (6 - sXY[1]) ? (6 - sXY[1]) : sX;
    sY = Sectors[SectorID].Y - (sXY[2] - sXY[2] % 2) / 2;
    sY = sY < 0 ? 0 : sY;
    sY = sY > (6 - sXY[2]) ? (7 - sXY[2]) : sY;

    var MapCanvas, mapSize;
    
    mapSize = {w: sXY[1] * 98, h: sXY[2] * 98};
    MapCanvas = document.createElement("div");
    MapCanvas.setAttribute("id", "MapCanvas");
    MapCanvas.setAttribute("style", `background-image:url(${MapBase}); background-position: -${sX * 98}px -${sY * 98}px; background-repeat: no-repeat; width: ${mapSize.w}px; height: ${mapSize.h}px`);
    
    // ...рамку...
    var FrameIMG = new Image();
    FrameIMG.src = FrameURI;
    FrameIMG.id = 'FrameIMG';
    FrameIMG.style.position = 'absolute';
    FrameIMG.style.visibility = 'hidden';
    FrameIMG.style.top = 0; // Избавляемся от скролла
    FrameIMG.style.zIndex = '102';

    // Отображение сейфов, если включено
    if(outMapSafe && Safes.length > 0)
    {
        var SafeIMG, sip;
        for(var i in Safes) {
           SafeIMG = document.createElement("div");
            
            for(var j in Sectors) {
                if(Sectors[j].Name == Safes[i].Sector) {
                    sID = j;
                    break;
                }
            }
            
            sip = {x: (Sectors[sID].X - sX) * 98 + Safes[i].X - 6, y: (Sectors[sID].Y - sY) * 98 + Safes[i].Y - 6};
            SafeIMG.setAttribute("style", `position: absolute; background-image:url(${SafeBase}); background-position: ${sip.x}px ${sip.y}px; background-repeat: no-repeat; width: ${mapSize.w}px; height: ${mapSize.h}px`);
            MapCanvas.appendChild(SafeIMG);
        }
    }

    // Ставим точку если есть GPS
    if(Pos){
        var PointIMG, pip;
        
        PointIMG = document.createElement("div");
        pip = {x: (Sectors[SectorID].X - sX) * 98 + GPSx - 6, y: (Sectors[SectorID].Y - sY) * 98 + GPSy - 6};
        PointIMG.setAttribute("style", `position: absolute; background-image:url(${PointBase}); background-position: ${pip.x}px ${pip.y}px; background-repeat: no-repeat; width: ${mapSize.w}px; height: ${mapSize.h}px`);
        MapCanvas.appendChild(PointIMG);
    }

    var uMap, uMapContainer, uLabel;
    
    uMap = window.document.createElement('div');
    uMap.id = 'uMap';
    uMap.style.position = 'absolute';
    uMap.style.visibility = $showMap ? 'visible' : 'hidden';
    uMap.style.left = GetCookie("outMapPosX") ? GetCookie("outMapPosX") : '500px';
    uMap.style.top = GetCookie("outMapPosY") ? GetCookie("outMapPosY") : '24px';
    uMap.style.border = '1px solid #393';
    uMap.style.backgroundColor = '#d0eed0';
    uMap.style.padding = '5px';
    uMap.style.zIndex = '99';

    uMapContainer = window.document.createElement('div');
    uMapContainer.id = 'uMapContainer';
    uMapContainer.style.backgroundColor = '#f0fff0';
    uMapContainer.style.border = '1px solid #393';
    uMapContainer.style.height = mapSize.h + 'px';
    uMapContainer.style.width = mapSize.w + 'px;';

    uLabel = window.document.createElement('p');
    uLabel.id = 'uLabel';
    uLabel.style.position = 'absolute';
    uLabel.style.fontSize = '10px';
    uLabel.style.fontWeight = 'bold';
    uLabel.style.color = '#009';
    uLabel.style.margin = '0';
    uLabel.style.zIndex = '101';

    uMapContainer.appendChild(MapCanvas);
    uMap.appendChild(uMapContainer);

    window.document.body.appendChild(uMap);
    window.document.body.appendChild(uLabel);
    window.document.body.appendChild(FrameIMG);

    // Создаем пустой див поверх всего, чтобы лейблы не мигали
    var Blank = window.document.createElement("div");
    Blank.id = 'Blank';
    Blank.style.position = 'absolute';
    Blank.style.visibility = $showMap ? 'visible' : 'hidden';
    Blank.style.width = mapSize.w + 'px';
    Blank.style.height = mapSize.h + 'px';
    canvasXY = findPos(window.document.getElementById("MapCanvas"));
    Blank.style.left = canvasXY[0];
    Blank.style.top = canvasXY[1];
    Blank.style.zIndex = '103';
    Blank.style.cursor = 'move';
    Blank.addEventListener('mousemove', ShowLabel, false);
    Blank.addEventListener('mouseout', HideLabel, false);
    Blank.addEventListener('mousedown', DragStart, false);
    Blank.addEventListener('mouseup', DragStop, false);
    window.document.body.appendChild(Blank);
})();
