---
layout: post
author: codeandcloud
title: Exploring Genkit GenAI in Angular
date: "2025-08-22 22:08:00 +0530"
categories: [Angular, GenAI]
tags: [angular, genai, genkit]
image: /assets/og-images/2025-08-19-exploring-genkit-genai-in-angular.jpg
---

The post is about building a basic application that uses Genkit Flows, Angular and Gemini 2.0 Flash. 

Let's create a full-stack Angular application with AI features.

> Following [Use Genkit in an Angular app](https://genkit.dev/docs/angular/)  _(loosely)_ because I encountered errors building the app using the tutorial

## Installation

Install the Genkit CLI globally. This is an optional dependency but I recommend it anyway

```bash
npm install -g genkit-cli
```

**My Angular Version**

> Angular CLI: 20.2.0
> Node: 22.17.0
> Package Manager: npm 10.9.2
> OS: win32 x64

Let's *create* the angular application

```bash
ng new genkit-ng-demo

✔ Which stylesheet format would you like to use? CSS
✔ Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? Yes
✔ Do you want to create a 'zoneless' application without zone.js? Yes
✔ Which AI tools do you want to configure with Angular best practices? None
```
Now install dependencies

```bash
code ./genkit-ng-demo #open vs code

npm install genkit
npm install @genkit-ai/googleai
npm install @genkit-ai/express
```
## Optional: `@genkit-ai/express` error 

*Use this section only if you encounter an error, I think this will be fixed in the latest versions*

When you install `@genkit-ai/express` you get an error,

> While resolving: genkit-ng-demo@0.0.0   
> npm error Found: express@5.1.0
> npm error node_modules/express
> npm error   express@"^5.1.0" from the root > project
> npm error
> npm error Could not resolve dependency:
> npm error peer express@"^4.21.1" from > @genkit-ai/express@1.16.1
> npm error node_modules/@genkit-ai/express
> npm error   @genkit-ai/express@"*" from the > root project

That means you have to downgrade express package to v4.21.1.
I removed package.lock.json file, the node_modules folder and added the following to package.json 

```json
"dependencies": {
  "express": "^4.21.1",
}
```
{: file='src/package.json'}

Now proceed with

```bash
npm install
npm install @genkit-ai/express
```

## Define Genkit Flow

The `ai.defineFlow` is a generic function and expects a `ZodObject`. The documentation shows that genkit already has the `ZodObject` z, but I got an errors while using `import { genkit, z} from 'genkit';`

### Install zod

```bash
npm install zod
```
### Create I/O schema

```typescript
import z from 'zod';

export const PersonInputSchema = z.object({
  person: z.string(),
});

export const CarOutputSchema = z.object({
  car: z.string(),
});

export type PersonModel = z.infer<typeof PersonInputSchema>;
export type CarModel = z.infer<typeof CarOutputSchema>;


```
{: file='src/app/schemas/car.schema.ts'}

### Create Genkit Flow

```typescript
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { z } from 'zod';
import {
  CarModel,
  CarOutputSchema,
  PersonInputSchema,
} from '../app/schemas/car.schema';

const ai = genkit({
  plugins: [googleAI()],
});

const carSuggestionFlow = ai.defineFlow(
  {
    name: 'carSuggestionFlow',
    inputSchema: PersonInputSchema,
    outputSchema: CarOutputSchema,
    streamSchema: z.string(),
  },
  async ({ person }, { sendChunk }) => {
    const { stream } = ai.generateStream({
      model: googleAI.model('gemini-2.5-flash'),
      prompt: `Make a concise (100 words), and funny car suggestion for a ${person} person.`,
    });

    const model: CarModel = { car: '' };
    for await (const chunk of stream) {
      sendChunk(chunk.text);
      model.car += chunk.text;
    }

    return model;
  }
);

const carSuggestionFlowUrl = '/api/car-suggestion';

export { carSuggestionFlow, carSuggestionFlowUrl };
```
{: file='src/genkit/car-suggestion-flow.ts'}

## Configure server.ts route

Again, this is a lot different from the example given from the [Genkit in Angular App Tutorial](https://genkit.dev/docs/angular/)
The below config is the one that worked for me

```typescript
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import cors from 'cors';

import { expressHandler } from '@genkit-ai/express';
import {
  carSuggestionFlow,
  carSuggestionFlowUrl,
} from './genkit/car-suggestion-flow';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

app.use(cors());
app.use(express.json());

app.post(carSuggestionFlowUrl, expressHandler(carSuggestionFlow));

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

const angularApp = new AngularNodeAppEngine();

app.use((req, res, next) => {
  // Only handle requests that are not your API endpoints.
  if (req.originalUrl.startsWith('/api/')) {
    return next();
  }
  
  angularApp
    .handle(req)
    .then((response) => {
      if (!response) return next();
      return writeResponseToNodeResponse(response, res);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

const port = process.env['PORT'] || 4000;
app.listen(port, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Listening on port: ${port}`);
});

export const reqHandler = createNodeRequestHandler(app);
```
{: file='src/server.ts'}

## Calling the flow from the frontend

In your frontend code, you can now call your flows using the Genkit client library. You can use both non-streaming and streaming approaches:

### Non-streaming Flow Calls


```html
<main>
  <section class="prompt-section">
    <h3>Suggest a Car</h3>
    <label for="theme">Suggest a car for a person with the personality: </label>
    <input type="text"
           placeholder="jovial, fun loving, adventurous"
           [(ngModel)]="personInput" />
    <button (click)="generateCar()"
            [disabled]="loading">
      Generate
    </button>
  </section>
  @if (carResult) {
  <section class="result-section">
    <h4>Generated Car:</h4>
    <article [innerHTML]="carResult"></article>
  </section>
  }
</main>
```
{: file='src/app/app.html'}


```ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { runFlow } from 'genkit/beta/client';
import { marked } from 'marked';
import { CarModel, PersonModel } from './schemas/car.schema';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private sanitizer = inject(DomSanitizer);

  loading = false;
  personInput = '';
  result: CarModel | null = null;
  carResult: SafeHtml | null = null;

  async generateCar() {
    this.clearCarResult();
    this.loading = true;
    this.result = await this.invokeCarFlow();
    if (!this.result) {
      this.result = { car: 'No car suggestion available.' };
    } else {
      const carHtml = await marked.parse(this.result.car);
      this.carResult = this.sanitizer.bypassSecurityTrustHtml(carHtml);
    }
    this.loading = false;
  }

  async invokeCarFlow() {
    const url = environment.apiBaseUrl + '/car-suggestion';
    const model: PersonModel = { person: this.personInput.trim() };
    return runFlow({
      url,
      input: model,
    });
  }

  clearCarResult() {
    this.carResult = null;
  }
}

```
{: file='src/app/app.ts'}

### Extras

1. added `npm install marked`
*A small library that converts markdown to html. Gemini API returns the result as markdown.*
2. `app.css` for the sake of completeness

```css
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

main>section {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.5rem;
}

main>section+section {
    margin-top: 0.5rem;
}

main>section.prompt-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 35rem;
}

main>section.prompt-section>input {
    margin: 1rem 0;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 70%;
}

main>section.prompt-section>button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

main>section.result-section {
    min-width: 35rem;
}
```
{: file='src/app/app.css'}

## Running the App

```bash
npm run start #ng serve
```
The page should load like this

![Initial Screen](/assets/post-images/2025-08-22/screen-1.jpg)

Now if you enter any value and press enter you will get the error

> Non-streaming request failed with error: FAILED_PRECONDITION: Please pass in the API key or set the **GEMINI_API_KEY or GOOGLE_API_KEY** environment variable.
> 
> For more details see https://genkit.dev/docs/plugins/google-genai  
> GenkitError: FAILED_PRECONDITION: Please pass in the API key or set the GEMINI_API_KEY or GOOGLE_API_KEY environment variable.

As the error notes, we have to get an API key.

### Getting the API key

1. [Generate an API key](https://aistudio.google.com/app/apikey) for the Gemini API using Google AI Studio.
2. Set the GEMINI_API_KEY environment variable to your key:

```powershell
$env:GEMINI_API_KEY = "<your API key>"
```
```bash
export GEMINI_API_KEY=<your API key>
```
![Final Screen](/assets/post-images/2025-08-22/screen-2.jpg)

*Please note that you will have to again set the environment variable when you restart the session, for a permanent setup, please add your key to environment variable.*

That's all to it. Happy Coding!
