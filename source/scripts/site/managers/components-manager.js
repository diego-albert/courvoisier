/*
*/

var site = site || {};
;

el.core.utils.createNamespace(site, 'managers').componentsManager = (function() {

  var components = {}
  ;

  function registerComponent(component) {
    components[component.id] = component;

    // console.log('componentsManager.registerComponent', components);
  }

  function unregisterComponent(component) {
    delete components[component.id];
  }

  function getComponentByID(id) {
    return components[id];
  }

  function destroyComponents() {

    var force = Boolean(force),
        component = null
    ;

    for( var id in components ) {

      if(components[id]) {
        components[id].destroy();
        delete components[id];
      }
    }
  }

  function createComponent(key, options) {

    try {
      var c = new site.components[dashToCamelCase(key)](options);
    }
    catch(e) {
      console.log('ERROR, no component for key:', key, e);
    }

    return c;
  }

  function dashToCamelCase(input) {

    var bits = input.split('-'),
        output = ''
    ;
    while(bits.length) {
      var bit = bits.shift();
      output += bit.charAt(0).toUpperCase() + bit.slice(1)
    }

    return output;
  }

  return {

    registerComponent: registerComponent,
    unregisterComponent: unregisterComponent,
    createComponent: createComponent,
    getComponentByID: getComponentByID,
    destroyComponents: destroyComponents
  };
}());