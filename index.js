const mergeUserOptionsIn = require('./mergeUserOptionsIn');

const warnUser = require('./warnUser');

function freezeTag(userOptions) {

  const handler = {};

  const mergedOptions = mergeUserOptionsIn(userOptions);

  const handlerFunctions = {
    get(target, property) {

      // where the recursion happens
      if (typeof target[property] === 'object' && target[property] !== null) {
        return freezeTag(mergedOptions)(target[property]);
      }
      return target[property];
    },

    set(target, property, value) {
      const { freeze, tag } = mergedOptions.set;
      if (tag) {
        warnUser(target, `Property "${property}"`, `changing its value to "${value}"`, freeze);
      }
      if (!freeze) {
        target[property] = value;
      }
      return true;
    },

    deleteProperty(target, property) {
      const { freeze, tag } = mergedOptions.deleteProperty;
      if (tag) {
        warnUser(target, `Property "${property}"`, 'delete', freeze);
      }
      if (!freeze) {
        delete target[property];
      }
      return true;
    },

    setPrototypeOf(target, prototype) {
      const { freeze, tag } = mergedOptions.setPrototypeOf;
      if (tag) {
        warnUser(target, 'The prototype', 'Object.setPrototypeOf', freeze);
      }
      if (!freeze) {
        Object.setPrototypeOf(target, prototype);
      }
      return true;
    },

    defineProperty(target, property, descriptor) {
      const { freeze, tag } = mergedOptions.setPrototypeOf;
      if (tag) {
        warnUser(target, `Property "${property}"`, 'Object.defineProperty', freeze);
      }
      if (!freeze) {
        Object.defineProperty(target, property, descriptor);
      }
      return true;
    }
  };

  Object.keys(mergedOptions).forEach(key => {
    if (mergedOptions[key]) {
      handler[key] = handlerFunctions[key];
    }
  });

  return obj => new Proxy(obj, handler);
}



module.exports = freezeTag;
