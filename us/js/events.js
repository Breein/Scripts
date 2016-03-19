module.exports = function bindEvent(element, event, callback, args) {
  if (!element) return;

  if(args == null){
    args = [element];
  }else{
    args.push(element);
  }

  if(element.addEventListener){
    if(event.substr(0, 2) == 'on'){
      event = event.substr(2);
    }
    element.addEventListener(event, ()=>{callback.apply(this, args)}, false);
  }else if(element.attachEvent){
    if(event.substr(0, 2) != 'on'){
      event = 'on' + event;
    }
    element.attachEvent(event, ()=>{callback.apply(this, args)}, false);
  }
};