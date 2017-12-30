const mergeUserOptionsIn = (userOptions = {}) => {

  const defaultOptions = {
    set: true,
    delete: false,
    setPrototypeOf: false,
    defineProperty: false,
  };

  const mergedOptions = Object.assign({}, defaultOptions, userOptions);

  Object.keys(mergedOptions).forEach(key => {
    // Change the shorthand 'true' to {tag: true, freeze: true}
    if (typeof mergedOptions[key] === 'boolean' && mergedOptions[key] === true) {
      mergedOptions[key] = {tag: true, freeze: true};
    }

    // Make sure anyone weird enough to put "{tag: false, freeze: false}"
    // doesn't waste they own time.
    if (typeof mergedOptions[key] === 'object'
          && mergedOptions[key].tag === false
          && mergedOptions[key].freeze === false) {
      mergedOptions[key] = false;
    }
  });

  // Add get trap for recursion to work.
  mergedOptions.get = true;

  return mergedOptions;
};

module.exports = mergeUserOptionsIn;
