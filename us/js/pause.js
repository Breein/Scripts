function Pause(){
  this.work = true;
  this.cancel = false;
  this.func = null;
  this.args = [];
  this.ctx = null;
}

Pause.prototype = {
  /**
   * @param {Function} f
   * @param {[]=}a
   * @param {*=}c
   */
  freeze: function(f, a, c){
    this.func = f;
    this.args = a || [];
    this.ctx = c || null;
  },
  /**
   */
  unfreeze: function(){
    this.func.apply(this.ctx, this.args);
  },
  /**
   * @param {Function=} f
   * @param {[]=}a
   * @param {*=}c
   * @returns {boolean}
   */
  isActive: function(f, a, c){
    if(f != null){
      if(!this.work){
        this.freeze(f, a, c);
        return true;
      }else{
        return false;
      }
    }else{
      return !this.work;
    }
  },
  /**
   */
  activate: function(){
    this.work = false;
    //console.log("Pause!");
  },
  /**
   */
  deactivate: function(){
    this.work = true;
    this.unfreeze();
    //console.log("Resume!");
  },

  /**
   * @param {Function} callback
   * @returns {boolean}
   */
  isStop: function(callback){
    if(this.cancel){
      callback();
      this.cancel = false;
      return true;
    }else{
      return false;
    }
  },

  /**
   */
  stop: function(){
    this.cancel = true;
    this.work = true;
    //console.log("Cancel!");
  }
};

module.exports = new Pause();