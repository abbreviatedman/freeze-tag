# freeze-tag

A simple, fast, and highly customizable way to recursively freeze objects, avoiding mutation.

### Features

* **Simple API** - Freezing is one extra function call. Then you can copy them for mutation any way you want!
* **Customizable** - A simple options parameter allows you to set rules for mutations.
* **Fast** - Places mutation handler on your objects, which is way faster than `Object.freeze`-ing them.

freeze-tag creates a recursive proxy of your object, affecting the ways you can mutate: `set`, `delete`, `setPropertyOf`, and `defineProperty`.

For each of these, you can decide whether you want your objects to be "tagged" and console.error() if they're mutated, or for them to be completely "frozen" so that you can't mutate them at all. Or both! Or neither.

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

Now you have a `freeze` function that affects the `set`, `delete`, and `setPrototypeOf` mutations, but not the `defineProperty` mutation. And you use it just like you did before.

```javascript
var frozenObj = freeze(obj);
```

You can also substitute an object for any `true` to decide between tagging mutations for `console.error`-ing and freezing them from happening.

```javascript
var freeze = freezeTag({
  set: {tag: false, freeze: true},
  delete: true,
  defineProperty: false,
  setPrototypeOf: {tag: true, freeze: false}
});
```

`true` defaults to `{tag: true, freeze: true}`, and the `options` object defaults to `{set: true}` and everything else `false`.

### Speed

**It is recommended that you do not use `freeze-tag` in a production build.** However, it is more than fast enough for development. If you want faster, use the default option, which just handles `set`, rather than  configuring `freeze-tag` to handle every possible kind of mutation.

Whether you freeze or tag or both doesn't matter, though. Go crazy.

### What's Next

TODO:
1. Expand and clarify this README.
2. Make the console.errors a bit more readable.
3. Add toggleable protection from production use.
4. Clean up the code and make it a bit prettier.
5. Remember what else I wanted to change.

### How Does One Play the Actual Game of Freeze Tag?

Like this:

![alt text][freeze tag gif]

[freeze tag gif]: http://www.footy4kids.co.uk/wp-content/uploads/2015/09/freeze.gif "how to play freeze tag?"
