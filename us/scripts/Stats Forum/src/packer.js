function PackerData(){
  this.object = null;
}

PackerData.prototype = {
  /**
   * @param {object} o
   * @returns {object}
   */
  isPacked: function(o){
    return o.a ? true : false;
  },

  /**
   * @param {object} o
   * @returns {object}
   */
  player: function(o){
    return this.isPacked(o) ?
    {id: o.id, name: o.a, status: o.b, date: o.c, forums: o.d} :
    {id: o.id, a: o.name, b: o.status, c: o.date, d: o.forums};
  },

  /**
   * @param {object} o
   * @returns {object}
   */
  forum: function(o){
    return this.isPacked(o) ?
    {id: o.id, name: o.a, sid: o.b, posts: o.c, words: o.d, page: o.e, themes: o.f, log: o.g} :
    {id: o.id, a: o.name, b: o.sid, c: o.posts, d: o.words, e: o.page, f: o.themes, g: o.log};
  },

  /**
   * @param {object} o
   * @returns {object}
   */
  theme: function(o){
    return this.isPacked(o) ?
    {id: o.id, name: o.a, author: o.b, posts: o.c, pages: o.d, start: o.e} :
    {id: o.id, a: o.name, b: o.author, c: o.posts, d: o.pages, e: o.start};
  },

  /**
   * @param {object} o
   * @returns {object}
   */
  member: function(o){
    return this.isPacked(o) ?
    {id: o.id, posts: o.a, last: o.b, start: o.c, write: o.d, words: o.e, wordsAverage: o.f, carma: o.g, carmaAverage: o.h, sn: o.i, enter: o.j, exit: o.k, kick: o.l, invite: o.m} :
    {id: o.id, a: o.posts, b: o.last, c: o.start, d: o.write, e: o.words, f: o.wordsAverage, g: o.carma, h: o.carmaAverage, i: o.sn, j: o.enter, k: o.exit, l: o.kick, m: o.invite};
  },

  /**
   * @param {object} o
   * @returns {object}
   */
  timestamp: function(o){
    return this.isPacked(o) ?
    {id: o.id, time: o.a, data: o.b} :
    {id: o.id, a: o.time, b: o.data};
  }
};

/**
 * @returns {PackerData}
 */
module.exports = function(){
 return new PackerData();
};