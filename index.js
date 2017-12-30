const mergeUserOptionsIn = require('./mergeUserOptionsIn');

const warnUser = require('./warnUser');

function freezeTag(userOptions) {

  const handler = {};

  const options = mergeUserOptionsIn(userOptions);

  const handlerFunctions = {
    get(target, property) {

      // where the recursion happens
      if (typeof target[property] === 'object' && target[property] !== null) {
        return freezeTag(options)(target[property]);
      }
      return target[property];
    },

    set(target, property, value) {
      const { freeze, tag } = options.set;
      if (tag) {
        warnUser(target, `Property "${property}"`, `changing its value to "${value}"`, freeze);
      }
      if (!freeze) {
        target[property] = value;
      }
      return true;
    },

    // Note the difference between 'deleteProperty' and 'delete'.
    // Our users don't care that the proxy handler is called 'deleteProperty'.
    // (And thus this function must be named the same, or the es6 proxy mother
    // bird won't recognize it as hers and will throw it right out of the nest.)
    // Our uses will remember 'delete' much more easily, as that's THE ACTUAL
    // NAME OF THE OPERATOR.
    // So the options object property is called 'delete'.
    // And this function is called 'deleteProperty'.
    // And their feud is neverending.
    deleteProperty(target, property) {
      const { freeze, tag } = options.delete;
      if (tag) {
        warnUser(target, `Property "${property}"`, 'delete', freeze);
      }
      if (!freeze) {
        delete target[property];
      }
      return true;
    },

    setPrototypeOf(target, prototype) {
      const { freeze, tag } = options.setPrototypeOf;
      if (tag) {
        warnUser(target, 'The prototype', 'Object.setPrototypeOf', freeze);
      }
      if (!freeze) {
        Object.setPrototypeOf(target, prototype);
      }
      return true;
    },

    defineProperty(target, property, descriptor) {
      const { freeze, tag } = options.defineProperty;
      if (tag) {
        warnUser(target, `Property "${property}"`, 'Object.defineProperty', freeze);
      }
      if (!freeze) {
        Object.defineProperty(target, property, descriptor);
      }
      return true;
    }
  };

  // If we want it, the matching function goes in the handler object.
  Object.keys(options).forEach(key => {
    if (options[key]) {
      handler[key] = handlerFunctions[key];
    }
  });

  return obj => new Proxy(obj, handler);
}

// Make a default version of the freeze function.
const freeze = freezeTag();


module.exports = {freezeTag, freeze};
