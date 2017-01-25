(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global.tFluxReact = factory(global.React));
}(this, (function (React) { 'use strict';

React = 'default' in React ? React['default'] : React;

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var plugin = function plugin(BoundComponent, store) {
  return React.createClass({
    componentWillMount: function componentWillMount() {
      var _this = this;

      this._unsubscribe = store.subscribe(function (state) {
        _this.setState(state);
      });
    },
    componentWillUnmount: function componentWillUnmount() {
      this._unsubscribe();
    },
    render: function render() {
      return React.createElement(BoundComponent, _extends({}, this.props, { store: store.getState() }));
    }
  });
};

var index = {
  install: function install(tFlux) {
    tFlux.prototype.bind = plugin;
  }
};

return index;

})));
