declare module 'typewriter-effect/dist/core' {
  export default class Typewriter {
    constructor(container: string | HTMLElement, options?: {
      delay?: number;
      cursor?: string;
    });
    typeString(str: string): this;
    start(): this;
  }
} 