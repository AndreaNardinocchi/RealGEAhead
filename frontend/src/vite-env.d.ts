/// <reference types="vite/client" />

/**
 * This is used as a compiler
 *
 * https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
 *  */

// https://vite.dev/guide/env-and-mode#intellisense-for-typescript
interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  // add any other VITE_ variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
