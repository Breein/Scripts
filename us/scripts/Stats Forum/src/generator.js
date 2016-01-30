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
      forums: []
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
      log: [0, 0]
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
      start: 0
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
      invite: 0
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
      data: []
    }
  }
};

/**
 * @returns {GeneratorData}
 */
module.exports = function(){
  return new GeneratorData();
};
