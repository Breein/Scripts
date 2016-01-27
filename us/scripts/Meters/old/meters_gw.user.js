// ==UserScript==
// @name           Meters [GW]
// @namespace      гном убийца
// @description    Счетчики опыта и умений (26.12.14.1508)
// @version        2.0
// @grant          none
// @include        http://www.ganjawars.ru/me/
// ==/UserScript==


(function () {

var $tb_scils, $tb_levels, $sindMeter;

if(location.pathname == "/me/"){
	if(typeof(localStorage) === 'undefined' ){
 		alert('Meters [GW]: Ваш браузер не поддерживает LocalStorage(), обновите барузер или удалите скрипт.');
 	}else{
		main();
 	}
}

function main(){
    var now_meters, meters, set_to_zero;

	now_meters = find_now_meters();
	meters = localStorage.getItem('meters');

	if(meters == null){
		meters = now_meters.join("|");
		localStorage.setItem('meters', meters);
	}

	set_to_zero = document.createElement('table');
    set_to_zero.setAttribute("align", "right");
    set_to_zero.innerHTML = "<tr><td style='font-size: 8px; cursor:pointer; text-decoration: underline;' id='setNewMeters'>сбросить счетчики</td></tr>";
		
	$tb_scils.parentNode.insertBefore(set_to_zero, $tb_scils.nextSibling);
		
    QS('#setNewMeters').addEventListener('click', setNewMeter, true);
	
	print_meters(now_meters);
}

function find_now_meters(){
    var tmp_meter, tmp_meters, sind_exp, nobr_sin_exp;
    var i, reg;

    $tb_scils = QS('img[src*="skill_combat_pistols.gif"]').offsetParent.offsetParent;
    $tb_levels = QS('td[align="right"]:contains("Боевой уровень:")').offsetParent;
    nobr_sin_exp = QS('b:contains("Основной синдикат:")');

	tmp_meters = [];
	
	reg = /(.+) \((.+)\)/;
	for(i = 0; i < 3; i++){
		tmp_meter = $tb_levels.rows[i].cells[1].textContent;
        tmp_meter = reg.exec(tmp_meter)[2];
		tmp_meters.push(tmp_meter);
	}
	
	reg = /(.+) \((.+)\)\+(.+)/;
	for(i = 0; i < 6; i++){
		tmp_meter = $tb_scils.rows[i].cells[1].textContent;
        tmp_meter = reg.exec(tmp_meter)[2];
        tmp_meters.push(tmp_meter);
	}

    reg=/\[ (.+) \((.+)\)(.+)\]/;
	if(nobr_sin_exp){
        nobr_sin_exp = nobr_sin_exp.parentNode;
        $sindMeter = QS("#sindMeter");
        if(!$sindMeter){
            nobr_sin_exp.innerHTML += "&nbsp;&nbsp;<span style='font-size: 8px; color: red;' id='sindMeter'>0</span>";
            $sindMeter = QS("#sindMeter");
        }
        sind_exp = nobr_sin_exp.childNodes[3].textContent;
        tmp_meters.push(reg.exec(sind_exp)[2]);
	}else{
        tmp_meters.push(0);
	}

    tmp_meters.push(getHours());
	
	return tmp_meters;
}

function print_meters(now_meters){
    var meters, meter, tmp, how_long, how_long_d;
    var i;

	meters = localStorage.getItem('meters').split("|");
	
	if($sindMeter){
        $sindMeter.innerHTML = parseInt(parseFloat(now_meters[9]) - parseFloat(meters[9]), 10);
	}
	
	for(i = 0; i < 3; i++){
		meter = $tb_levels.rows[i].cells[3];
		meter.setAttribute("align", "right");
		meter.setAttribute("style", "font-size: 8px; color: red;");
		if(i == 2){
			tmp = parseFloat(now_meters[i]) - parseFloat(meters[i]);
			meter.innerHTML = tmp.toFixed(1);
		}else{
			meter.innerHTML = parseInt(parseFloat(now_meters[i]) - parseFloat(meters[i]));
		}
	}
	
	for(i=0; i < 6; i++){
		meter = $tb_scils.rows[i].cells[2];
		meter.setAttribute("align", "right");
		meter.setAttribute("width", "20");
		
		tmp = parseFloat(now_meters[i + 3]) - parseFloat(meters[i + 3]);
		tmp = tmp.toFixed(1);
		if(tmp != "0.0"){
			meter.innerHTML = "&nbsp;&nbsp;<span style='font-size: 8px; color: red;'>" + tmp + "</span>";
		}else{
			meter.innerHTML = '<img width="20" src="http://images.ganjawars.ru/i/tbg.gif">';
		}
	}
	
	how_long = now_meters[10] - meters[10]; how_long = Math.floor((how_long/60)/60);
	
	if(how_long > 24){
		how_long_d = Math.floor(how_long / 24);
		how_long = Math.floor(how_long % 24);
		how_long = how_long_d + " д. и " + how_long + " ч.";
	}else{
		how_long = how_long + " ч.";
	}

	QS("#setNewMeters").setAttribute("title", "Прошло "+ how_long);
}

function setNewMeter(){
    var now_meters, meters;

	if(confirm("Сбросить счетчики?")){
		now_meters = find_now_meters();
		meters = now_meters.join("|");
		localStorage.setItem('meters', meters);
		print_meters(now_meters);
	}
}

function getHours(){
	return Math.round(new Date().getTime() / 1000);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

})();