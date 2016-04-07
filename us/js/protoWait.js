module.exports = function(){
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
