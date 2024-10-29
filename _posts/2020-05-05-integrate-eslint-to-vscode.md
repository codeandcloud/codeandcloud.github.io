---
layout: post
author: Naveen
title: Integrating ESLint to VS Code 
date: '2020-05-05T12:05:00.000+05:30'
categories: [vs-code]
tags: [vs-code, es-lint, vscode-extensions]
modified_time: '2020-05-05T12:05:00.000+05:30'
---

Steps on how to [integrate ESLint on VS Code][1]

Before integration one will have to install ESLInt by opening the `Extensions` from inside the VS Code. You can also install it from [Visual Studio Marketplace][2]

After installation you will have a view like this  
![ESLint Extension Image][3]

Now we will open the terminal and as I am doing a `workspace` install, we will install it as

```shell
npm install eslint
```
for a global install, please append ` -g` to the command. Next step will be to initialize the linter

```shell
eslint --init
```
The config will ask you these question during this init phase.

1. How would you like to use ESLint? · To check syntax and find problems
2. What type of modules does your project use? · esm(Javascript module)
3. Which framework does your project use? · none
4. Does your project use TypeScript? · No / Yes
5. Where does your code run? · browser
6. What format do you want your config file to be in? · JSON

These are the values I set as my project is an `angular-typescript` project that runs on a `browser`.  
As this was my primary installation, I was prompted by the `init` to add more dependencies.

```terminal
Local ESLint installation not found.
The config that you've selected requires the following dependencies:

@typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest
√ Would you like to install them now with npm? · No / Yes
```

Once I allowed the installation with npm, they added the dependencies and created a `.eslintrc.json` for me like this.

```json
{
    "env": {
        "browser": true,
        "es2020": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```
If you want to set more rules, you can do so by visting [the documentation][4]  
That's all to the installations folks. Happy coding

[1]: https://eslint.org/
[2]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[3]: /assets/posts/2020-05/eslint.png
[4]: https://eslint.org/docs/rules/

