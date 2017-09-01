/*
  Helper for creating namespaces
*/

var el = el || {};

var createNS = (function(){

  function extend( ns, ns_string ) {
    var parts = ns_string.split('.'),
      parent = ns,
      pl, i;
    pl = parts.length;
    for (i = 0; i < pl; i++) {
      //create a property if it doesnt exist
      if (typeof parent[parts[i]] === 'undefined') {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }
    return parent;
  }

  extend(el, 'core.utils');

  return extend;  
}());

createNS(window, 'el.core.utils');
el.core.utils.createNamespace = createNS;