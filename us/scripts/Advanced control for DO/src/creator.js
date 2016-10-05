const $c = require('./../../../js/common.js')();

function GeneratorData(){
  this.object = null;
}

GeneratorData.prototype = {
  gosItem: function(i, a, s){
    return {
      id: i[0],
      section: s[i[2]],
      name: i[1],
      durability: i[6][0],
      level: i[7],
      cost: i[3],
      refundNew: i[4][0],
      refundBroken: i[4][1],
      refundOne: i[4][2],
      expNew: i[5][0],
      expBroken: i[5][1],
      expOne: i[5][2],
      sell: a[`${i[0]}-sell`] != null,
      buy: a[`${i[0]}-buy`] != null,
      rent: a[`${i[0]}-rent`] != null,
      check: false
    }
  },

  artItem: function(i, a, s){
    return {
      id: i[0],
      section: s[i[2]],
      name: i[1],
      durability: i[5],
      level: i[6],
      cost: i[3],
      renew: i[3] - i[4],
      refund: i[4],
      sell: a[`${i[0]}-sell`] != null,
      buy: a[`${i[0]}-buy`] != null,
      rent: a[`${i[0]}-rent`] != null,
      check: false
    };
  },

  advert: function(a, i, s){
    return {
      id: i[0],
      it: a.it,
      aid: i[0] + "-" + a.action,
      section: s[i[2]],
      name: i[1],
      mod: a.mod,
      level: i[7 - a.it],
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

  stats: function(p, i, s, pos){
    return {
      id: i[0],
      position: pos,
      section: s[i[2]],
      level: i[6],
      name: i[1],
      mod: p[2],
      refund: i[4],
      price: p[0],
      rate: p[6],
      durNow: p[1][0],
      durMax: p[1][1],
      fast: p[5],
      island: p[3],
      seller: [p[4][0], p[4][1]],
      check: false
    }
  },

  exp: function(p, i, s, pos){
    return {
      id: i[0],
      position: pos,
      section: s[i[2]],
      level: i[7],
      name: i[1],
      mod: p[2],
      price: p[0],
      refund: p[6],
      exp: p[7],
      expCost: p[8],
      durNow: p[1][0],
      durMax: p[1][1],
      fast: p[5],
      island: p[3],
      seller: [p[4][0], p[4][1]],
      check: false
    }
  },

  board: function(a){
    var action = {sell: 1, buy: 2, rent: 3};
    if(a.termPost == 365) a.termPost = 3;
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
