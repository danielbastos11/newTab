(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.tFlux = factory());
}(this, (function () { 'use strict';

var Store = function Store(initialState) {
  // if false, don't react to anything
  this._isOn = true;
  // list of functions to call on change
  this._subs = [];
  // current state
  this._state = initialState;
  // actionType to Function dictionary
  this._reducers = {
    attempted: {}, completed: {}, failed: {}
  };
};

Store.prototype.on = function (actionType, reducer) {
  this._reducers.completed[actionType] = reducer;
};

Store.prototype.attempted = function (actionType, reducer) {
  this._reducers.attempted[actionType] = reducer;
};

Store.prototype.failed = function (actionType, reducer) {
  this._reducers.failed[actionType] = reducer;
};

Store.prototype.getState = function () {
  return this._state;
};

Store.prototype._update = function (actionType, action, hook) {
  var _this = this;

  hook = hook || 'completed';
  if (!this._reducers[hook]) {
    return console.log('Invalid hook passed');
  }

  // don't do anything if store is stopped
  // check if action is of interest to the store
  if (!this._isOn || !this._reducers[hook][actionType]) {
    return;
  }

  // call reducer
  this._state = this._reducers[hook][actionType](action, this._state);

  // notify listener
  this._subs.forEach(function (fn) {
    fn(_this._state, actionType, action);
  });
};

Store.prototype.subscribe = function (cb) {
  var _this2 = this;

  this._subs.push(cb);
  // i don't like this
  return function () {
    _this2._subs = _this2._subs.filter(function (sub) {
      return sub != cb;
    });
  };
};

Store.prototype.stop = function () {
  this._isOn = false;
};

Store.prototype.start = function () {
  this._isOn = true;
};

var internals = {};
internals.done = function (actionType, action) {
  this._stores.forEach(function (store) {
    return store._update(actionType, action, 'completed');
  });
};

internals.failed = function (actionType, action) {
  this._stores.forEach(function (store) {
    return store._update(actionType, action, 'failed');
  });
};

var tFlux = function tFlux() {
  this._stores = [];
};

tFlux.prototype.store = function (state) {
  var store = new Store(state);
  this._stores.push(store);

  return store;
};

tFlux.prototype.dispatch = function (actionType, action, hook) {
  this._stores.forEach(function (store) {
    return store._update(actionType, action, hook);
  });
};

tFlux.prototype.async = function (actionType, action, cb) {
  // if function is called without an action
  if (typeof action == 'function') {
    cb = action;
    action = undefined;
  }

  this._stores.forEach(function (store) {
    return store._update(actionType, action, 'attempted');
  });

  var done = internals.done.bind(this, actionType);
  var failed = internals.failed.bind(this, actionType);

  cb(done, failed);
};

tFlux.prototype.use = function (plugin) {
  plugin.install(tFlux);
};

// Prepare instance
var singleton = new tFlux();

return singleton;

})));
