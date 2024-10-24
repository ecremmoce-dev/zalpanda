import * as puppeteerType from 'puppeteer-core';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      // 다른 환경 변수들을 여기에 추가할 수 있습니다.
    }
  }
}

declare module 'puppeteer-core' {
  export = puppeteerType;
}

declare module '@sparticuz/chromium' {
  const args: string[];
  const executablePath: () => Promise<string>;
  const headless: boolean | 'new';
}
