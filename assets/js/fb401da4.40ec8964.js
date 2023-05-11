"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9909],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>f});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),s=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},c="mdxType",b={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),c=s(r),m=o,f=c["".concat(u,".").concat(m)]||c[m]||b[m]||a;return r?n.createElement(f,i(i({ref:t},l),{},{components:r})):n.createElement(f,i({ref:t},l))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=m;var p={};for(var u in t)hasOwnProperty.call(t,u)&&(p[u]=t[u]);p.originalType=e,p[c]="string"==typeof e?e:o,i[1]=p;for(var s=2;s<a;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8094:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>b,frontMatter:()=>a,metadata:()=>p,toc:()=>s});var n=r(7462),o=(r(7294),r(3905));const a={id:"betterer.bettererrunner.stop",title:"BettererRunner.stop()",sidebar_label:"BettererRunner.stop()",slug:"/betterer.bettererrunner.stop"},i=void 0,p={unversionedId:"api/betterer.bettererrunner.stop",id:"api/betterer.bettererrunner.stop",title:"BettererRunner.stop()",description:"API &gt; @betterer/betterer &gt; BettererRunner &gt; stop",source:"@site/docs/api/betterer.bettererrunner.stop.md",sourceDirName:"api",slug:"/betterer.bettererrunner.stop",permalink:"/betterer/docs/betterer.bettererrunner.stop",draft:!1,editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.bettererrunner.stop.md",tags:[],version:"current",frontMatter:{id:"betterer.bettererrunner.stop",title:"BettererRunner.stop()",sidebar_label:"BettererRunner.stop()",slug:"/betterer.bettererrunner.stop"}},u={},s=[{value:"Signature",id:"signature",level:2},{value:"Returns",id:"returns",level:2},{value:"Exceptions",id:"exceptions",level:2}],l={toc:s},c="wrapper";function b(e){let{components:t,...r}=e;return(0,o.kt)(c,(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererrunner"},"BettererRunner")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererrunner.stop"},"stop")),(0,o.kt)("p",null,"Stop the runner, but first wait for it to finish running the suite."),(0,o.kt)("h2",{id:"signature"},"Signature"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"stop(): Promise<BettererSuiteSummary>;\n")),(0,o.kt)("h2",{id:"returns"},"Returns"),(0,o.kt)("p",null,"Promise","<",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.betterersuitesummary"},"BettererSuiteSummary"),">"),(0,o.kt)("p",null,"the most recent ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.betterersuitesummary"},(0,o.kt)("inlineCode",{parentName:"a"},"BettererSuiteSummary")),"."),(0,o.kt)("h2",{id:"exceptions"},"Exceptions"),(0,o.kt)("p",null,"the error if something went wrong while stopping everything."))}b.isMDXComponent=!0}}]);