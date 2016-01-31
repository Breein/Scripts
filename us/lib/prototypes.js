module.exports = function(){
  /**
   * Вызывает функцию через указанное количество миллисекунд в контексте ctx с аргументами args.
   * @param {int} timeout
   * @param {Object} ctx
   * @param {Array} args
   * @return {Number} Идентификатор таймаута.
   */
  Function.prototype.gkDelay = function(timeout, ctx, args){
    var func = this;
    return setTimeout(function() {
      func.apply(ctx, args || []);
    }, timeout);
  };

  /**
   * @param {*} value
   * @returns {boolean}
   */
  Array.prototype.gkExist = function(value){
    var length, array;

    array = this;
    length = array.length;

    while(length--){
      if(array[length] == value){
        return true;
      }
    }
    return false;
  };

  /**
   * @param {Function} generator
   * @param {*} ctx
   * @param {*[]} args
   */
  Function.prototype.gkWait = function(generator, ctx, args){
    var f = this;
    f.apply(ctx, args || []).then((result)=>{
      generator.next(result);
    });
  };
};