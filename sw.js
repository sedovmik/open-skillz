if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,t)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let o={};const d=e=>i(e,r),l={module:{uri:r},exports:o,require:d};s[r]=Promise.all(n.map((e=>l[e]||d(e)))).then((e=>(t(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-DMt59nsw.css",revision:null},{url:"assets/index-iRTAQXMK.js",revision:null},{url:"index.html",revision:"5a396480592a6d4c5d56bd9bfe284447"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"manifest.webmanifest",revision:"d7439ec09b27718871e09cc3ba4dd7da"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
