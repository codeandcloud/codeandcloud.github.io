---
layout: post
author: codeandcloud
title: Using Partials in TypeScript
date: '2020-05-12T07:07:00.000+05:30'
categories: [TypeScript]
tags: [typescript]
image: /assets/og-images/2020-05-12-using-partials-in-typescript.jpg
---

`Partial<T>` is one of the several utility types available globally in TypeScript.

> #### Partial<T>

> Constructs a type with all properties of T set to optional. This utility will return a type that represents all subsets of a given type.

Two common areas of application are 

1. Update properties with type-safety
2. Constructor Overloading

### Update properties with type-safety

Suppose we have an `interface` Todo

```ts
interface Employee {
    id: number;
    name: string;
    age: number;
    address: string;
}
```
and a function `updateEmployee` to update any or all of the employee details 

```ts
updateEmployee(employee: Employee, fieldsToUpdate: Partial<Employee>) => {
    return { ...employee, ...fieldsToUpdate };
}
```
Now we can update employee like,

```ts
const developer = {
    id: 1,
    name: 'Naveen',
    age: 38,
    address: '221B Baker Street'
};

const coder = updateEmployee(developer, {
    id: 2,
    name: 'Jino',
    age: 26
});
```
Thus we updated 3 properties and omitted one, ensuring type-safety in the above example.

### Constructor Overloading

We can also handle constructor overloading by using `Partial<T>`.

```ts
class FruitEmployee implements Employee {
    this.id: 1;
    this.name: 'Naveen';
    this.age: 38;
    this.address: '221B Baker Street';
    this.fruit: '🍉';
    constructor(obj?: Partial<FruitEmployee>) {
         Object.assign(this, obj);
    }
}
```
Now we can call it like this,

```ts
const naveen = new FruitEmployee();
const rehna = new FruitEmployee({
    id: 2,
    name: 'Rehna',
    age: 37,
    fruit: '🥭'
});
```
`Partial<T>` used like this can save a many lines of code, ensuring type-safety.
If [browser doesn't support](https://caniuse.com/#search=Object.assign) `Object.assign`, use

```ts
import { assign } from 'lodash';
assign(this, obj);
```
