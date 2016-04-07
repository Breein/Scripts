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
      refund: i.refund,
      sell: a[`${i.id}-sell`] != null,
      buy: a[`${i.id}-buy`] != null,
      rent: a[`${i.id}-rent`] != null,
      check: false
    };
  },

  advert: function(a, i){
    return {
      id: a.id,
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
      date: a.date,
      price: a.price,
      posted: a.posted,
      autoPost: a.autoPost,
      check: false
    };
  }
};

/**
 * @returns {GeneratorData}
 */
module.exports = function(){
  return new GeneratorData();
};
