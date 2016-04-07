module.exports = function bindEvent(element, textEvent, callback, args, context, e) {
  var index; if (!element) return;

  args == null ? args = [element] : args.push(element);
  if(!context) context = null;
  index = args.length;

  if(element.addEventListener){
    if(textEvent.substr(0, 2) == 'on') textEvent = textEvent.substr(2);
    element.addEventListener(textEvent, (event)=>{
      if(e != null) args[index] = event;
      callback.apply(context, args);
    }, false);
  }else if(element.attachEvent){
    if(textEvent.substr(0, 2) != 'on') textEvent = 'on' + textEvent;
    element.attachEvent(textEvent, (event)=>{
      if(e != null) args[index] = event;
      callback.apply(context, args);
    }, false);
  }
};