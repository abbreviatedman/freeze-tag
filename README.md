# freeze-tag

A simple, fast, and highly customizable way to recursively freeze objects, avoiding mutation.

### Features

* **Simple API** - Freezing is one extra function call. Then you can copy them for mutation any way you want!
* **Customizable** - A simple options parameter allows you to set rules for mutations.
* **Fast** - Places mutation handler on your objects, which is way faster than `Object.freeze`-ing them.

freeze-tag creates a recursive proxy of your object, affecting the ways you can mutate: `set`, `delete`, `setPropertyOf`, and `defineProperty`.

For each of these, you can decide whether you want your objects to be "tagged" and console.warn()  you if they're mutated, or for them to be completely "frozen" so that you can't mutate them at all. Or both! Or neither.


### Usage:

```shell
npm install freeze-tag
```

```javascript
var freeze = require('freeze-tag').freeze;
```

Now you have a function you can use anywhere in your app.

```javascript
var frozenObj = freeze(obj);
```

And to unfreeze and mutate your object, you can simply `Object.assign` or Object Spread or however you like to do it.

```javascript
var unfrozen = Object.assign({}, frozenObj, {bestInLife: 'tooling'});
```

### Configuration

You can also customize behavior by importing the `freeze-tag` function, to which you can pass in an `options` object.

```javascript
var freezeTag = require('freeze-tag').freezeTag;

var freeze = freezeTag({
  set: true,
  delete: true,
  defineProperty: false,
  setPrototypeOf: true
});
```

This would return a function that affects the `set`, `delete`, and `setPrototypeOf` mutations, but not the `defineProperty` mutation.

You can also substitute an object for any `true` to decide between tagging mutations and freezing them from happening.

```javascript
var freeze = freezeTag({
  set: {tag: false, freeze: true},
  delete: true,
  defineProperty: false,
  setPrototypeOf: {tag: true, freeze: false}
});
```

`true` defaults to `{tag: true, freeze: true}`, and the `options` object defaults to `{set: true}` and everything else `false`.

In terms of speed, whether you freeze or tag doesn't matter, but the more mutation types you care about, the slower things will get. I recommend not using it at all in production, and the default is set to just care about `set`, which is fine for most use cases.

### What's Next

TODO:
1. Expand and clarify this README.
2. Add toggleable protections from usage in production.
3. Clean up the code and make it a bit prettier.
4. Remember what else I wanted to change.
