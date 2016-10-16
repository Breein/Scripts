const $mods = require('./../src/mods.js');

/**
 * @returns {{getClass: getClass, getChecked: getChecked, getNameLink: getNameLink, getMod: getMod, getActionsLink: getActionsLink}}
 */
module.exports = function(){
  return {
    /**
     * @param {Object} row
     * @returns {String}
     */
    getClass: function(row){
      return row.check ? "light checked" : "light";
    },

    /**
     * @param {Object} row
     * @returns {String}
     */
    getChecked: function(row){
      return row.check ? "checked" : "";
    },

    /**
     * @param {Object} row
     * @returns {String}
     */
    getNameLink: function(row){
      var href;

      href = `http://www.ganjawars.ru/item.php?item_id=${row.id}`;
      if(row.mod != 0) href += "&m=" + row.mod;
      return `<a target="_blank" href="${href}">${row.name}</a>`;
    },

    /**
     * @param {Object} row
     * @param {Boolean} short
     * @returns {String}
     */
    getMod: function(row, short){
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
    },

    /**
     * @param {Object} row
     * @returns {String}
     */
    getActionsLink: function(row){
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
};