---
layout: post
author: codeandcloud
title: Using environment specific variables in Angular
date: "2021-05-05 05:05:00 +0530"
categories: [Angular]
tags: [angular, environment, ng]
last_modified_at: "2025-08-18 05:05:00 +0530"
image: /assets/og-images/2021-05-05-using-environment-specific-variables-in-angular.jpg
---

Using _environment-specific_ variables in angular, the right way!

We have seen environment variables being used in angular projects. They are used to in projects with different build configurations for sites hosted in different environments.

Suppose your project have two different environments

1. Production
2. Staging

and that you have different _api base urls_ for different environments.

Lets see how you can use environment variables to achieve that.

### Setup

Angular 15+ by default has no environments, add them we use the command

```shell
ng generate environments
```
This will create two files
1. src/environments/environment.ts (production)
2. src/environments/environment.development.ts

Now, you need to manually create a staging environment.staging.ts file by copying the environment.ts file. Then we have this setup


```shell
└── src
    └── app
        ├── app.component.html
        └── app.component.ts
    └── environments
        ├── environment.development.ts
        ├── environment.staging.ts
        └── environment.ts
    └── services
        ├── api.service.ts
        └── api.service.spec.ts
```

Now add the api urls to your environment files:

**environment.ts**

```ts
export const environment = {
  production: false,
  apiUrl: 'http://my-prod-api-url'
};
```

**environment.development.ts**

```ts
export const environment = {
  production: true,
  apiUrl: 'http://my-local-api-url'
};
```

**environment.staging.ts**

```ts
export const environment = {
  production: false,
  apiUrl: 'http://my-staging-api-url'
};
```
### Configuration for different environments

The `ng generate environments` command will automatically add these changes to the `angular.json` file.

```json
"configurations": {
  "development": {
    // ...
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.development.ts"
      }
    ]
  }
}
```
You will have to manually add the `configurations:staging` manually to the file like this.

```json
"configurations": {
  "staging": {
    // use the other production config here
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.staging.ts"
      }
    ]
  }
}
```
_Recommendation is to use the same configuration of production for staging._


### Using the environment variable in code

We will use that environment variable to get the `environment.apiUrl` for the service.

**api.service.ts**

```ts
import { environment } from '../environments/environment';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = environment.apiUrl;

  constructor() { }

  getProducts() : Observable<Products> {
    const url = this.apiUrl + '/api/products';
    return this.http.get<Products>(url);
  }

}
```


Now, we are all set to build according to different environments

```shell
ng build // production - default
ng build --configuration=staging // staging
```

That's all to it. Happy coding!
