---
layout: post
author: codeandcloud
title: Introduction to Promises
date: '2020-06-07T10:23:00.000+05:30'
categories: [JavaScript]
tags: [javascript]
image: /assets/og-images/2020-06-07-promises-in-javascript.jpg
---

### Promises: A brief introduction

**Promise**

> The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
> A Promise is in one of these states:
> - pending: initial state, neither fulfilled nor rejected.
> - fulfilled: meaning that the operation was completed successfully.
> - rejected: meaning that the operation failed.

![Promise Diagram from MDN](/assets/post-images/2020-06/promises.png)
*Image by [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Used under Creative Commons license.*

A simple, pratical example will be 

```js
const lateBloomer = (bloomed) => {
  return new Promise((resolve, reject) => {
    if (bloomed) {
      setTimeout(() => resolve("The flower bloomed."), 300)
    } else {
      reject(Error("The flower won't bloom!"));
    }
  })
};
```
Here we are creating a `lateBloomer` function that accepts a boolean argument and,
- fullfill the promise after 300 milliseconds "bloomed" value is true.
- reject the promise if "bloomed" value is false.

Conventionally, a promise is called like this
```js
lateBloomer(false).then(response => {
    // success callback
    console.log(response)
  },err => {
    // error callback
    console.log(err.message)
  },
);

```
### async / await

Handling promises became much easier with [`async/await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

> **async:** The async function declaration creates a binding of a new async function to a given name. The await keyword is permitted within the function body, enabling asynchronous, promise-based behavior to be written in a cleaner style and avoiding the need to explicitly configure promise chains.

> **await:** The await operator is used to wait for a Promise and get its fulfillment value. It can only be used inside an async function or at the top level of a module.

An example would be,

```js
const lateBloomerAsAsync = async (bloomed) => {
  if (!bloomed) {
    throw new Error("The flower won't bloom!");
  }
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return 'The flower bloomed.';
};

async function logBloomStatusAsAsync() {
  try {
    const flowerStatus = await lateBloomerAsAsync(true);
    console.log(flowerStatus);
  } catch (err) {
    console.log(err.message);
  }
}

logBloomStatusAsAsync();
```

Thats's all for today. Happy coding
