const $c = require('./../../../js/common.js')();

function GeneratorData(){
  this.object = null;
}

GeneratorData.prototype = {
  item: function(i, s){
    return {
      id: i.id,
      section: s[i.b],
      name: i.a,
      durability: i.e,
      level: i.f,
      cost: i.c,
      price: i.d,
      check: false
    };
  },

  log: function(i, l, s, seller){
    return {
      id: l.id,
      section: s[i.b],
      name: i.a,
      price: i.d,
      sell: l.a,
      profit: l.a - i.d,
      seller: seller,
      date: l.b,
      check: false
    }
  },

  seller: function(s, id){
    return {
      id: id,
      level: s.b,
      name: s.a,
      sid: s.c,
      island: s.d,
      check: false
    }
  }
};

/**
 * @returns {GeneratorData}
 */
module.exports = function(){
  return new GeneratorData();
};
