var $ = require('./../../../js/dom.js');

/**
 * @returns {{getPrice: getPrice, getSeller: getSeller, getDurability: getDurability, getIsland: getIsland, getMod: getMod, getFast: getFast, getRate: getRate, getRefund: getRefund, getExpCost: getExpCost}}
 */
module.exports = function(){
  return {
    /**
     * @param {HTMLTableRowElement} row
     * @returns {Number}
     */
    getPrice: function(row){
      var price;

      price = row.cells[0].textContent;
      price = price.replace(/,|\$/g, "");
      price = Number(price);

      return price;
    },

    /**
     * @param {HTMLTableRowElement} row
     * @returns {[Number, String]}
     */
    getSeller: function(row){
      var seller, id;

      seller = $(row).find('a[href*="info.php"]').node();
      id = seller.href.match(/(\d+)/)[0];
      id = Number(id);

      return [id, seller.textContent];
    },

    /**
     * @param {HTMLTableRowElement} row
     * @returns {[Number, Number]}
     */
    getDurability: function(row){
      var durability;

      durability = row.cells[1].textContent;
      durability = durability.split("/");
      durability = [Number(durability[0]), Number(durability[1])];

      return durability;
    },

    /**
     * @param {HTMLTableRowElement} row
     * @returns {Number}
     */
    getIsland: function(row){
      var island, isl;

      isl = {"[G]": 0, "[Z]": 1, "[P]": 4, "[G,Z,P]": -1, "[O]": 3};
      island = row.cells[3].textContent;

      return isl[island];
    },

    /**
     * @param {HTMLTableRowElement} row
     * @returns {Number}
     */
    getMod: function(row){
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
    },

    /**
     * @param {HTMLTableRowElement} row
     * @returns {Number}
     */
    getFast: function(row){
      var fast;

      fast = $(row.cells[4]).find('a[href*="market-i.php"]').node();
      if(fast){
        fast = fast.href.match(/(\d+)/g)[1];
        fast = Number(fast);
      }else{
        fast = 0;
      }
      return fast;
    },

    /**
     * @param {Number} price
     * @param {Number} cost
     * @returns {Number}
     */
    getRate: function(price, cost){
      if(cost == 0) return 0;
      return parseInt(price / cost, 10);
    },

    /**
     * @param {Number} dur
     * @param {Array} item
     * @returns {[Number, Number]}
     */
    getRefund: function(dur, item){
      var durLeft, durability, refund, exp;

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
    },

    /**
     * @param {Number} price
     * @param {Number} refund
     * @param {Number} exp
     * @returns {Number}
     */
    getExpCost: function(price, refund, exp){
      var cost;

      cost = price - refund;
      cost = cost / exp;
      cost = cost.toFixed(1);
      cost = parseFloat(cost);

      return cost;
    }
  };
};
