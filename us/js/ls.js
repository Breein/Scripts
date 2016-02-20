function LocalStorage(){

}

LocalStorage.prototype = {
  /**
   * @param {string} key
   * @param {object} object
   */
  save: function(key, object){
    if(typeof object == "object"){
      object = JSON.stringify(object);
      localStorage.setItem(key, object);
    }
  },

  /**
   * @param {string} key
   * @returns {{}}
   */
  load: function(key){
    var object;

    object = localStorage.getItem(key);
    if(object){
      return JSON.parse(object);
    }else{
      this.save(key, {});
      return {};
    }
  }
};

module.exports = new LocalStorage();