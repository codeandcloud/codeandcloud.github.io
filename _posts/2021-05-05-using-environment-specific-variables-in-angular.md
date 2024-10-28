---
layout: post
author: Naveen
title: Using environment specific variables in Angular
date: "2021-05-05T05:05:00.000+05:30"
categories: [angular]
tags: [angular, environment, ng]
modified_time: "2021-05-05T05:05:00.000+05:30"
---

Using _environment-specific_ variables in angular, the right way!

We have seen environment variables being used in angular projects. They are used to in projects with different build configurations for sites hosted in different environments.

Suppose your project have two different environments

1. Production
2. Staging

and that you have different _api base urls_ for different environments.

Lets see how you can use environment variables to achieve that.

### Setup

First, create a 3 environment files like this for your angular project

```shell
└── src
    └── app
        ├── app.component.html
        └── app.component.ts
    └── environments
        ├── environment.prod.ts
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
  apiUrl: 'http://my-local-api-url'
};
```

**environment.prod.ts**

```ts
export const environment = {
  production: true,
  apiUrl: 'http://my-prod-api-url'
};
```

**environment.staging.ts**

```ts
export const environment = {
  production: false,
  apiUrl: 'http://my-staging-api-url'
};
```

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

As expected, the service will use the file `environment.ts`.

### Change configuration for different environment

To change confuguration options matching the target environment we need to [configure target-specific file replacements in angular.json][1]. For this, we add `fileReplacements` to the `angular.json`.

```json
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ]
  },
  "staging": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.staging.ts"
      }
    ]
  }
}
```

Now, we are all set to build according to different environments

```shell
ng build --configuration=production // production
ng build --configuration=staging // staging
```

That's all to it. Happy coding!

[1]: https://angular.io/guide/build#configure-target-specific-file-replacements
