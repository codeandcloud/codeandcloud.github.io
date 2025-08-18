---
layout: post
author: codeandcloud
title: Non-null assertion operator in TypeScript
date: '2020-10-05T12:05:00.000+05:30'
categories: [typescript]
tags: [typescript, operator]
modified_time: '2020-10-05T12:05:00.000+05:30'
---

Have you seen something like `node!.parent` and ever wondered what the `post-fix expression !` is doing in the typescript code? That is the [non-null assertion operator][1] introduced in *TypeScript 2.0*. As the typescript documentation notes,


> ### Non-null assertion operator
>
> A new ! post-fix expression operator may be used to assert that its operand is non-null and non-undefined in contexts where the type checker is unable to conclude that fact. Specifically, the operation x! produces a value of the type of x with null and undefined excluded. Similar to type assertions of the forms <T>x and x as T, the ! non-null assertion operator is simply removed in the emitted JavaScript code.

Now let us look at a use case. Suppose we have `document.getElementById('post')`, the typescript type checker will be unable to determine whether the element will be present in the DOM or not. In such cases, we assure the type checker that the element indeed exist in the DOM using the `post-fix expression !`. This assertion *excludes* both `null` and `undefined` from the context. 

Look at how we do that in code. Suppose we have a `class` *Blog* with signature `Blog(HtmlElement, object)` and we write

```ts
let postEl: HTMLElement = document.getElementById('post');

let post = new Blog(postEl, {
  mood: '😊'
  // more options here
});
```

We will get the error,

> Type 'HTMLElement | null' is not assignable to type 'HTMLElement'.  
> Type 'null' is not assignable to type 'HTMLElement'.(2322)

The error message tells us that the compiler could not determine the `type`.

This is *where* the non-null assertion operator comes in handy. By changing the first line like

```ts
let postEl: HTMLElement = document.getElementById('post')!;
```
the error goes away and the code gets compiled.

And if you look at the emitted javascript code, you can see that the *the ! non-null assertion operator is simply removed in the emitted JavaScript code* as noted in the documentation.

Happy Coding!

[1]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator
