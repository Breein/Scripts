module.exports = function bindEvent(element, textEvent, callback, args, e) {
  var index; if (!element) return;

  args == null ? args = [element] : args.push(element);
  index = args.length;

  if(element.addEventListener){
    if(textEvent.substr(0, 2) == 'on') textEvent = textEvent.substr(2);
    element.addEventListener(textEvent, (event)=>{
      if(e != null) args[index] = event;
      callback.apply(null, args);
    }, false);
  }else if(element.attachEvent){
    if(textEvent.substr(0, 2) != 'on') textEvent = 'on' + textEvent;
    element.attachEvent(textEvent, (event)=>{
      if(e != null) args[index] = event;
      callback.apply(null, args);
    }, false);
  }
};