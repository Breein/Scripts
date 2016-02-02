function GeneratorData(){
  this.object = null;
}

GeneratorData.prototype = {
  /**
   * @param {number} id
   * @returns {object}
   */
  player: function(id){
    return {
      id: id,
      name: "",
      status: "",
      date: 0,
      forums: [],
      _ch: true
    }
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  forum: function(id){
    return {
      id: id,
      name: "",
      sid: 0,
      posts: 0,
      words: 0,
      page: [0, 0],
      themes: [0, 0],
      log: [0, 0],
      _ch: true
    }
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  theme: function(id){
    return {
      id: id,
      name: "",
      author: [0, ""],
      posts: [0, 0],
      pages: [0, 0],
      start: 0,
      _ch: true
    }
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  member: function(id){
    return {
      id: id,
      posts: 0,
      last: 0,
      start: [],
      write: [],
      words: 0,
      wordsAverage: 0,
      carma: 0,
      carmaAverage: 0,
      sn: 0,
      enter: 0,
      exit: 0,
      kick: 0,
      invite: 0,
      _ch: true
    }
  },

  /**
   * @param {number} id
   * @returns {object}
   */
  timestamp: function(id){
    return {
      id: id,
      time: [],
      data: [],
      _ch: true
    }
  },

  /**
   * @param {object} m member (упакованный)
   * @param {object} p player (упакованный)
   * @returns {object}
   */
  characters: function(m, p){
    return {
      id: m.id,
      name: p.a,
      member: (m.i != 0) + "",
      status: p.b,
      date: p.c,
      posts: m.a,
      lastMessage: m.b,
      starts: m.c,
      start: m.c.length,
      writes: m.d,
      write: m.d.length,
      words: m.e,
      wordsAverage: m.f,
      carma: m.g,
      carmaAverage: m.h,
      sNumber: m.i,
      enter: m.j,
      exit: m.k,
      kick: (m.l != 0) + "",
      invite: (m.m != 0) + ""
    };
  }
};

/**
 * @returns {GeneratorData}
 */
module.exports = function(){
  return new GeneratorData();
};
