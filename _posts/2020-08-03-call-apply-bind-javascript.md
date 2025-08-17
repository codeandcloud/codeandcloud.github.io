---
layout: post
author: Naveen
title: Introduction to call, apply, bind
date: '2020-08-03T11:010:00.000+05:30'
categories: [javascript]
tags: [javascript]
modified_time: '2020-08-03T11:010:00.000+05:30'
---

Here is a short intro on the elusive call, apply, bind in JavaScript

## [Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

>The call() method of [Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) instances calls `this` function with a given this value and arguments provided individually.

For example call function acts as a generic utility function, which can assign an arbitrary value as `this` when calling an existing function, without first attaching the function to the object as a property.

Suppose we have an object like this.

```js
const alice = {
  username: "Alice",
  age: 35,
  sayHello: function() {
    console.log(`Hello, ${this.username}`);
  }
};
```
and another object

```js
const bob = {
  username: "Bob",
  age: 40,
};
```
To attach `sayHello()` to Bob, you can do this with the call method.
```js
alice.sayHello.call(bob); // console.logs "Hello, Bob"
```

As more common use case is creating `sayHello()` as an independent function and calling it like this.
```js
const alice = {
  username: "Alice",
  age: 35,
};

const bob = {
  username: "Bob",
  age: 40,
};

function sayHello() {
    console.log(`Hello, ${this.username}`);
}

sayHello.call(alice); // console.logs "Hello, Alice"
sayHello.call(bob); // console.logs "Hello, Bob"

```
The function `call` can also accept parameters. It's call signature is,
```js
call(thisArg[, arg1, arg2, /* …, */ argN])
```
Example
```js
function logDetails(city, state) {
    console.log(`Hello, ${this.username}. Age: ${this.age}. Lives in ${city}, ${state}`);
}

logDetails.call(alice, "Buffalo", "New York"); // console.logs "Hello, Alice. Age: 35. Lives in Buffalo, New York"
logDetails.call(bob, "London"); // console.logs "Hello, Bob. Age: 35. Lives in London, undefined"

// you can also pass an array with spread syntax
logDetails.call(alice, ...["Buffalo", "New York"]);
logDetails.call(bob, ...["London"]);
```
If the parameters are not provided, undefined will be the value.

**Note:** `call()` won't work while using [arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
```js
const charlie = {
  username: "Charlie",
  age: 45,
};
const sayBye = () => {
    console.log(`Bye, ${this.username}!`);
}
sayBye.call(charlie); // console.logs "Bye, undefined!"
```
Reason,

> Arrow functions don't have their own bindings to `this`, `arguments`, or `super`, and _should not be used as methods_.
i.e., Inside arrow function expressions this will be the window object
```js
const sayBye = () => {
    console.log(this === window); // true
}
const sayBye = function() {
    console.log(this === window); // false
}
```
<hr>

*** [Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

> This function is almost identical to `call()`, except that the function arguments are passed to `call()` individually as a list, while for `apply()` they are combined in one object, typically an array — for example, `func.call(this, "eat", "bananas")` vs. `func.apply(this, ["eat", "bananas"])`.

The function `apply` can also accept parameters. It's call signature is,
```js
apply(thisArg[, argsArray])
```


A example would be,
```js
const func = function(action, fruit) {
  console.log(`${this.animalType} ${action} ${fruit}.`);
};

const monkeys = {
  animalType: 'Monkeys',
  getFood: function() {
    func.apply(this, ["eat", "bananas"]);
    // func.call(this, "eat", "bananas");
  }
}

monkeys.getFood();
```

> **Note:**  
> In general, fn.apply(null, args) is equivalent to fn(...args) with the parameter spread syntax, except args is expected to be an array-like object

```js
const printItems = function(item1, item2, item3) {
  console.log(item3);
};

printItems.apply(null, ["Foo", "Bar", "Baz"]);
```
<hr>

*** [Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

>The `bind()` function creates a new bound function. Calling the bound function generally results in the execution of the function it wraps, which is also called the _target function_. The bound function will store the parameters passed — which include the value of this and the first few arguments — as its internal state.

For example,

```js
const alice = {
  username: "Alice",
  age: 35,
};

function sayHello(city, state) {
    console.log(`Hello, ${this.username} from ${city}, ${state}!`);
}

const helloAlice = sayHello.bind(alice, 'Buffalo', 'New York');
helloAlice(); // console logs Hello, Alice from Buffalo, New York!
```
The call signature is same as that of `call()`,
```js
bind(thisArg[, arg1, arg2, /* …, */ argN])
```

That's how we use the three utility functions. The post serves only as an introduction.  
Feel free to explore more on the topic. Happy coding!

