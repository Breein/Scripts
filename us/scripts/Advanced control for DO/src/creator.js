const $c = require('./../../../js/common.js')();

function GeneratorData(){
  this.object = null;
}

GeneratorData.prototype = {
  item: function(i, a){
    return {
      id: i.id,
      section: i.section,
      name: i.name,
      durability: i.durability,
      level: i.level,
      cost: i.cost,
      renew: i.cost - i.refund,
      refund: i.refund,
      sell: a[`${i.id}-sell`] != null,
      buy: a[`${i.id}-buy`] != null,
      rent: a[`${i.id}-rent`] != null,
      check: false
    };
  },

  advert: function(a, i){
    return {
      id: i.id,
      aid: i.id + "-" + a.action,
      section: i.section,
      name: i.name,
      mod: a.mod,
      level: i.level,
      action: a.action,
      island: a.island,
      durNow: a.durNow,
      durMax: a.durMax,
      termPost: a.termPost,
      termRent: a.termRent,
      update: a.update,
      price: a.price,
      posted: $c.getTimeNow() < a.expire,
      autoPost: a.autoPost,
      check: false
    };
  },

  stats: function(p, i, pos){
    return {
      id: i.id,
      position: pos,
      section: i.section,
      level: i.level,
      name: i.name,
      mod: p.mod,
      refund: i.refund,
      price: p.price,
      rate: p.rate,
      durNow: p.dur[0],
      durMax: p.dur[1],
      fast: p.fast,
      island: p.island,
      seller: [p.seller[0], p.seller[1]],
      check: false
    }
  },

  board: function(a){
    var action = {sell: 1, buy: 2, rent: 3};
    return a.action == "rent" ?
      `stage=3&action_id=3&item_id=${a.id}&island=${a.island}&price=${a.price}&mindays=${a.termRent}&modificator=${a.mod}&durability1=${a.durNow}&durability2=${a.durMax}&date_len=${a.termPost}` :
      `stage=3&action_id=${action[a.action]}&item_id=${a.id}&island=${a.island}&price=${a.price}&modificator=${a.mod}&durability1=${a.durNow}&durability2=${a.durMax}&date_len=${a.termPost}`;
  }
};

/**
 * @returns {GeneratorData}
 */
module.exports = function(){
  return new GeneratorData();
};
