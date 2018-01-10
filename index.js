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

    // I have no idea why the JavaScript proxy handler needs the
    // function to be called "deleteProperty".

    // It's not "setProperty" or "getProperty".

    // Maybe they wanted it to match "defineProperty"?

    // But we actually DO call "Object.defineProperty". We don't call
    // deleteProperty.

    // I'm glad we had this talk.
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

  // If it's approved on the options object, set the matching
  // custom handler function onto our handler object.
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
