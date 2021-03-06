function Common(){

}

Common.prototype = {

  /**
   * @param {number} now
   * @param {number} max
   * @param {boolean} int
   * @returns {number}
   */
  getPercent: function (now, max, int){
    var percent;

    if(now == 0 || max == 0){
      return 0;
    }

    percent = (now / max) * 100;
    if(int){
      percent = parseInt(percent, 10);
    }else{
      percent = parseFloat(percent.toFixed(1));
    }

    return percent;
  },

  /**
   *
   * @param {Number|String} date
   * @param {boolean=} full
   * @param {boolean=} utc
   * @returns {object}
   */
  getNormalDate: function (date, full, utc){
    if(isNaN(date)) return {d: date, t: '-'};
    if(date == 0) return {d: '', t: '-'};

    date = date * 1000;
    date = new Date(date);
    date = utc != null ? date.toLocaleString('ru-RU', {timeZone: "UTC"}) : date.toLocaleString();

    date = date.match(/(\d+).(\d+).(\d+), (\d+):(\d+):(.+)/);
    if(date[4] < 10) date[4] = "0" + date[4];

    if(full != null) {
      date = {
        d: `${date[1]}.${date[2]}.${date[3]}`,
        t: `${date[4]}:${date[5]}`
      };
    }else{
      date = {
        d: `${date[1]}.${date[2]}.${date[3].charAt(2)}${date[3].charAt(3)}`,
        t: `${date[4]}:${date[5]}`
      };
    }

    return date;
  },

  /**
   *
   * @param {number} t
   * @param {boolean=} s
   * @returns {string}
   */
  getNormalTime: function (t, s){
    var result, hh, mm, ss;

    hh = 0;
    if(!s) t = parseInt(t / 1000, 10);

    if(t > 3600){
      hh = parseInt(t / 3600, 10);
      t = t % 3600;
    }
    mm = parseInt(t / 60, 10);
    ss = parseInt(t % 60, 10);

    if(mm < 10) mm = "0" + mm;
    if(ss < 10) ss = "0" + ss;

    result = `${mm}:${ss}`;

    if(hh > 0){
      if(hh < 10) hh = "0" + hh;
      result = `${hh}:${result}`;
    }
    return result;
  },

  /**
   * @param {number} value
   * @returns {string|number}
   */
  convertID: function (value){
    var result, vs, i, j;

    if(value < 1000) return value;

    vs = value + "";
    j = 1; i = vs.length;
    result = "";

    while(i--){
      result = vs.charAt(i) + result;
      if(j%3 == 0 && j != 0 && i != 0){
        result = ',' + result;
      }
      j++
    }

    return result;
  },

  /**
   * @param {number} value
   * @returns {string|number}
   */
  convertNumber: function(value){
    var result, d, m;

    if(value < 1000 && value >= 0) return value;
    if(value < 0){
      m = true;
      value = value * -1;
    }

    d = (value + "").split('.');

    if(d){
      value = Number(d[0]);
      d = d[1];
    }

    result = this.convertID(value);

    if(m) result = "-" + result;
    if(d) result = result + "." + d;

    return result;
  },

  /**
   * @param {string} str
   * @returns {string}
   */
  encodeHeader: function (str){
    var a, string;

    if(!str) return str;

    string = String(str).replace(/%/g, '%25').replace(/\+/g, '%2B').replace(/\n/g, '%0A');
    a = document.createElement('a');
    a.href = "http://www.ganjawars.ru/encoded_str=?" + string;
    string = a.href.split('encoded_str=?')[1];
    string = string.replace(/%20/g, '+').replace(/=/g, '%3D').replace(/&/g, '%26');

    return string;
  },

  /**
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  randomNumber: function (min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   *
   * @param {*} value
   * @param {*[]} array
   * @returns {boolean}
   */
  exist: function(value, array){
    if(!array) return false;
    var length;

    length = array.length;

    while(length--){
      if(array[length] == value){
        return true;
      }
    }
    return false;
  },

  hz: function(value, key){
    if(key){
      if(key == "%"){
        return value == 0 ? "" : value + '<span style="font-size: 9px;"> %</span>';
      }else{
        return key == 0 ? "" : value;
      }
    }else{
      return value == 0 ? "" : value;
    }
  },

  /**
   * @returns {Number}
   */
  getTimeNow: function(){
    return parseInt(new Date().getTime() / 1000, 10);
  }
};

module.exports = function (){
  return new Common();
};
