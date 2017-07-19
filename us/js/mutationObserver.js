/**
 * @param {Api|Object} target
 * @param {Object} config
 * @param {Function} callback
 * @param {Array=} args
 * @param {Object=} context
 */
module.exports = function bindMutationObserver(target, config, callback, args, context){
  var observer;

  if (!target) return;
  if(target.node) target = target.node();

  if(!config)
    config = {childList: true};

  args == null ? args = [target] : args.push(target);
  if(!context) context = null;

  observer = new MutationObserver(()=>{
      callback.apply(context, args);
    }
  );

  observer.observe(target, config);
};
