function mergeUserOptionsIn(userOptions = {}) {

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

  // Fix for the fact that JS's Proxy syntax uses "deleteProperty" instead of
  // the more user-friendly term "delete". Pretty funny to delete a property
  // called delete!

  // Well.

  // I think it's funny.
  if (mergedOptions['delete']) {
    mergedOptions['deleteProperty'] = mergedOptions['delete'];
    delete mergedOptions['delete'];
  }

  // Add get trap for recursion to work.
  mergedOptions.get = true;

  return mergedOptions;
}

module.exports = mergeUserOptionsIn;
