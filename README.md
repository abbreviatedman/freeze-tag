# freeze-tag

A simple, fast, and highly customizable way to deep freeze objects, avoiding mutation.

### Features

* **Recursive** - Begins at your root object and goes all the way down. No data structure left behind.
* **Fast** - Places mutation handler on your objects, which is way faster than `Object.freeze`-ing them.
* **Simple API** - Freezing is one extra function call. Then you can copy them for mutation using whatever method you normally (I hope!) use to copy mutable objects.
* **Customizable** - A simple options parameter allows you to set rules for handling mutations.

freeze-tag creates a deep proxy of your object, affecting the ways you can mutate: `set`, `delete`, `setPropertyOf`, and `defineProperty`.

For each of these, you can decide whether you want your objects to be "tagged" and console.error() if they're mutated, or for them to be completely "frozen" so that you can't mutate them at all. Or both! Or neither.

### Usage with Redux:

`freeze-tag` was designed so that you could cetainly use it alone, but [Redux][Redux] was the use case in mind. Use the tiny [redux-freeze-tag][redux-freeze-tag] library to immutabalize your reducers with one line of code in one file.

### Vanilla Usage:

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
var unfrozen = Object.assign({}, frozenObj, {whatIsBestInLife: 'tooling'});
```

### Configuration

You can also customize behavior by importing the `freeze-tag()` function, to which you can pass in an `options` object and get back a customized `freeze()` function.

```javascript
var freezeTag = require('freeze-tag').freezeTag;

var freeze = freezeTag({
  set: true,
  delete: true,
  defineProperty: false,
  setPrototypeOf: true
});
```

This example would give you a `freeze()` function that affects the `set`, `delete`, and `setPrototypeOf` mutations, but not the `defineProperty` mutation. And you use it just like you did before.

```javascript
var frozenObj = freeze(obj);
```

The default is for `set` to be `true` and the other three `false`. If you think `delete` is important to avoid as well (and some people do use it liberally), set that to be `true` as well. The initial focus with this library has been speed, but even full immutability with `defineProperty` and `setPrototypeOf` handlers turned on doesn't actually come with much cost unless your objects are _extraordinarily_ huge.

You can also substitute an object for a `true` to change the default behavior, if you want to really drill down. By default, `freeze()` will both 'tag' mutations for `console.error`-ing and 'freeze' mutations from happening at all. But if you want to do only one or the other, you can set that like so:

```javascript
var freeze = freezeTag({
  set: {tag: false, freeze: true},
  delete: true,
  defineProperty: false,
  setPrototypeOf: {tag: true, freeze: false}
});
```

Whether you choose `freeze` only, `tag` only, or both makes no difference whatsoever to your app's speed. The only speed difference is between `false` and any other setting. So feel free to customize the behavior to whatever would help your team most.

### What's Next

TODO:
1. Continue to fiddle with this README.
2. Make the console.errors a bit more readable.
3. Add toggleable protection from production use.
4. Clean up the code and make it a bit prettier.
5. Remember what else I wanted to change.

### What Actual Freeze Tag Looks Like

![alt text][freeze tag gif]

Except usually without soccer balls. But that looks kinda cool, right? Hit me up if you wanna play.

[Redux]: https://redux.js.org/
[redux-freeze-tag]: https://github.com/abbreviatedman/redux-freeze-tag
[freeze tag gif]: http://www.footy4kids.co.uk/wp-content/uploads/2015/09/freeze.gif "freeze tag gif? FREEZE TAG GIF."
