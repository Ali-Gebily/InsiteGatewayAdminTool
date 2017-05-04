(function(angular) {
  /**
   * ng-polymer-elements links Angular directives to Polymer elements.
   * This is done by doing the following things:
   * 
   * 1. An Angular directive is created for each Polymer element
   *    A. The directive includes an isolate scope that maps Angular attributes to Polymer properties
   *    B. The scope is watched for changes to the Angular attributes and they are forwarded to Polymer properties
   *
   * 2. An EventListener is added to each Polymer property
   *    A. The scope value is updated whenever the Polymer property is changed
   *
   * To make things work with a new Polymer element, "notify: true" must be set on the declared properties for any two-way bindings
   * 
   * 
   */
  angular.module('ng-polymer-elements', []).config(
    ['$compileProvider', '$injector', function($compileProvider, $injector) {

    'use strict';

    // Each mapping is a link between the angular attribute and its respective polymer value.
    // The polymer value can be one of two types:
    // 
    // 1. Polymer value can be the String name of a polymer value with a binding type:
    //
    //    '=' - One-way or Two-way binding will propogate changes from both Polymer and Angular, depending on Polymer's property settings
    //          Will cause an error if the Polymer property 'notify' is not true.
    //          Example:
    //          inputMapping = {
    //            ngModel: '=value'
    //          }
    //    
    //    '@' - One-way binding will propogate changes from Angular to Polymer only.
    //          Value is NOT evaluted as a String (differs from Angular's scope)
    //          Will cause an error if the Polymer property 'readOnly' is true.
    //          Example:
    //          inputMapping = {
    //            ngDisabled: '@disabled'
    //          }
    //    
    //    '&' - Event binding will execute the Angular expression whenever the Polymer event by the same name occurs.
    //          Example:
    //          inputMapping = {
    //            ngOnDisabled: '&disabled-changed'
    //          }
    // 
    // 2. Polymer value can be a NAMED function that accepts the Polymer element as an argument and returns the name of the Polymer attribute to bind to.
    // 
    //    function twoway(element)    The polymer value returned mimics the '=' above
    //    function oneway(element)    The polymer value returned mimics the '@' above
    //    function event(element)  The polymer value returned mimics the '&' above
    // 

    var defaultMappings = {
      ngDisabled: '@disabled',
      ngFocused: '@focused',
      ngReadonly: '@readonly'
    };

    var inputMappings = angular.extend({
      ngModel: '=value'
    }, defaultMappings);

    var fileInputMappings = angular.extend({
      // ngModel: '=files',
      ngFiles: '=files',
      ngModel: '=value'
    }, inputMappings);

    var selectorMappings = angular.extend({
      ngModel: '=selected'
    }, defaultMappings);

    var checkMappings = angular.extend({
      ngModel: '=value',
      ngTrueValue: '@trueValue',
      ngFalseValue: '@falseValue'
    }, defaultMappings);

    var radioMappings = angular.extend({
      ngModel: '=model',
      ngValue: '@value'
    }, defaultMappings);

    var dropdownMappings = angular.extend({
      ngModel: '=value',
      ngItems: '@items',
      ngEquals: '@equals',
      ngCompare: '@compare'
    }, defaultMappings);

    var ironListMappings = angular.extend({
      ngModel: '=selectedItems',
      ngItems: '@items'
    }, defaultMappings);

    var datePickerMappings = angular.extend({
      ngModel: '=date',
      ngDates: '=dates'
    }, defaultMappings);

    var multiSelectableMappings = {
      ngModel: function property(element) {
        return element.hasAttribute('multi') ? 'selectedValues' : 'selected';
      }
    };

    var allMappings = {
      //pxblue
      pxInput: inputMappings,
      pxFileInput: fileInputMappings,
      pxTextarea: inputMappings,
      pxCheckbox: checkMappings,
      pxToggle: checkMappings,
      pxRadio: radioMappings,
      pxDropdown: dropdownMappings,
      pxDropdownMenu: dropdownMappings,
      pxDatePicker: datePickerMappings,
      pxTags: inputMappings,

      ironList: ironListMappings,

      //pxblue provisional
      pxTabs: selectorMappings,
      pxSelector: multiSelectableMappings,

    };

    var functionNameMap = {
      oneway: '@',
      twoway: '=',
      event: '&'
    };
    var typeMatch = /[@=&]/;
    var getMap = function(mapped) {
      var ret = {
        name: undefined,
        type: undefined,
        func: undefined,
        property: undefined
      };
      switch(typeof mapped) {
        case 'string':
          ret.name = mapped.substr(1);
          ret.type = mapped.charAt(0);
          if (!ret.type.match(typeMatch)) {
            throw 'Invalid mapping for "' + attr +'" - String must start with mapping type "=", "@", or "&"'
          }
          break;
        case 'function':
          ret.type = functionNameMap[mapped.name];
          ret.func = mapped;
          if (!ret.type) {
            throw 'Invalid mapping for "' + attr + '" - function name must be "twoway", "oneway", or "event"';
          }
          break;
        default:
          throw 'Invalid mapped type for "' + attr
            + '" - must be string or function';
      }

      ret.property = (ret.type !== functionNameMap.event);
      return ret;
    }


    // Extension point for overriding mappings
    if($injector.has('$ngPolymerMappings')) {
      var extendedMappings = $injector.get('$ngPolymerMappings');
      angular.extend(allMappings, extendedMappings);
    }

    // A directive is created for each web component according to the mappings
    Object.keys(allMappings).forEach(function(tag) {
      var mappings = allMappings[tag];

      $compileProvider.directive(tag, ['$parse', function($parse) {

        var scopeDefinition = {};
        var keys = Object.keys(mappings);
        keys.forEach(function(attr) {
          var map = getMap(mappings[attr]);
          scopeDefinition[attr] = map.property ? '=' : '&';
        });
        var requiresValue = mappings.ngModel ? '?ngModel' : undefined;

        return {
          restrict: 'E',
          require: requiresValue,
          scope: scopeDefinition,

          link: function (scope, element, attrs, ngModel) {

            var el = element[0];

            keys.forEach(function(attr) {

              // Don't create bindings for non-existent attributes
              if(!attrs[attr]) {
                return;
              }

              var map = getMap(mappings[attr]);
              if (map.func) {
                map.name = map.func(el);
              }

              if(map.type === functionNameMap.event) {

                // Event mapping

                var fn = $parse(attrs[attr]);
                el.addEventListener(map.name, function (e) {
                  scope.$apply(function() {
                    fn(scope.$parent, {$event: e});
                  });
                });

              } else {

                // In IE11, angular sometimes fires before polymer
                // In this case, ensure Polymer finishes loading first
                if (!el.getPropertyInfo) {
                  // Polymer must be setup
                  Polymer.dom.flush();
                }

                // Property mapping
                var propertyName = map.name;
                var propertyInfo = el.getPropertyInfo(map.name);
                var propertyType = propertyInfo.type;
                var readOnly = propertyInfo.readOnly;
                var notify = propertyInfo.notify;

                if (map.type === functionNameMap.twoway && !propertyInfo.notify) {
                  console.warn(el.tagName+'.'+propertyName+ ' mapped as a two-way binding, but notify is false. Set notify to true or ng-polymer-elements mapping to @');
                } else if (map.type === functionNameMap.oneway && propertyInfo.readOnly) {
                  console.warn(el.tagName+'.'+propertyName+ ' mapped as a one-way binding, but readOnly is true. Set readOnly to false or ng-polymer-elements mapping to =');
                } else if (map.type === functionNameMap.oneway && propertyInfo.notify) {
                  console.warn(el.tagName+'.'+propertyName+ ' mapped as a one-way binding, but notify is true. Set notify to false or ng-polymer-elements mapping to =');
                } else if (map.type === functionNameMap.event && propertyInfo.readOnly) {
                  console.warn(el.tagName+'.'+propertyName+ ' mapped as an event, but readOnly is true. Set readOnly to false or ng-polymer-elements mapping to =');
                } else if (map.type === functionNameMap.event && propertyInfo.notify) {
                  console.warn(el.tagName+'.'+propertyName+ ' mapped as an event, but notify is true. Set notify to false or ng-polymer-elements mapping to =');
                }

                // Copy the directive attribute value to the element's property.
                // For arrays and objects, copy the content.
                // The copying is deferred to the next event loop because some
                // elements (eg. gold-cc-input) may change the property value
                // immediately after inputting it, and we want to use only the
                // latest value.
                var timeout;
                if(!readOnly) {
                  var writeToPolymer = function(value) {
                    if(value !== el[propertyName]) {
                      el.set(propertyName, value);
                    }
                  };

                  if (attr === 'ngModel' && ngModel) {
                    ngModel.$render = function() {
                      writeToPolymer(ngModel.$viewValue);
                    };
                  } else {
                    scope.$watch(attr, function() {
                      if (timeout) {
                        clearTimeout(timeout);
                      }
                      timeout = setTimeout(function() {
                        timeout = undefined;
                        writeToPolymer(scope[attr]);
                      });
                    });
                  }
                }

                // When the polymer property value changes, copy its new value to the
                // angular scope attribute.
                if (map.type === functionNameMap.twoway) {
                  var eventName = propertyName.replace(/([A-Z])/g, function($1) {
                    return '-' + $1.toLowerCase();
                  }) + '-changed';
                  el.addEventListener(eventName, function(event) {
                    var value = el[propertyName]; //event.detail.value;
                    el.async(function() {
                      if (attr === 'ngModel' && ngModel) {
                        if (ngModel.$viewValue !== value) {
                          ngModel.$setViewValue(value);
                        }
                      } else {
                        scope.$apply(function () {
                          if(scope[attr] != value) {
                            scope[attr] = value;
                          }
                        });
                      }
                    });
                  });
                }

              }
            });
          }
        };
      }]);
    });
  }]);

})(angular);