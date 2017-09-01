createNS(window, 'el.core.utils');

el.core.utils.uniqueId = (function(){

  var usedIds = {};

  function get(prefix) {

    var newId = null;

    do {
      newId = generateId(prefix);

    } while(usedIds[newId] == true);

    usedIds[newId] = true;

    return newId;
  };

  function generateId(prefix) {

    if(!Boolean(prefix)) {

      prefix = 'id_';
    }

    return prefix + Math.ceil(1000000 * Math.random());
  }

  return {
    get: get
  };
})();