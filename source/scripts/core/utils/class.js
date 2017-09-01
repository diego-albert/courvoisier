var el = el || {};
el.core.utils.createNamespace(el, 'core.utils');

el.core.utils.class = (function(){

  Function.prototype.inheritsFrom = function( parentClassOrObject ) {
    if ( parentClassOrObject.constructor == Function )
    {
      //Normal Inheritance
      this.prototype = new parentClassOrObject;
      this.prototype.constructor = this;
      this.prototype.parent = parentClassOrObject.prototype;
    }
    else
    {
      //Pure Virtual Inheritance
      this.prototype = parentClassOrObject;
      this.prototype.constructor = this;
      this.prototype.parent = parentClassOrObject;
    }
    return this;
  }

  function mixin(ClassFunction, mixin) {

    return $.extend(ClassFunction.prototype, mixin); 
  }

  function extend(ChildClassFunction, ParentClassFunction) {

    ChildClassFunction.inheritsFrom(ParentClassFunction);

    return ChildClassFunction;
  }

  return {
    mixin: mixin,
    extend: extend
  };
}());