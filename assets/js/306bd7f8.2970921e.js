"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1919],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return m}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),u=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),b=u(r),m=a,d=b["".concat(l,".").concat(m)]||b[m]||s[m]||o;return r?n.createElement(d,i(i({ref:t},c),{},{components:r})):n.createElement(d,i({ref:t},c))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=b;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p.mdxType="string"==typeof e?e:a,i[1]=p;for(var u=2;u<o;u++)i[u]=r[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}b.displayName="MDXCreateElement"},7531:function(e,t,r){r.r(t),r.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return m},frontMatter:function(){return p},metadata:function(){return u},toc:function(){return s}});var n=r(3117),a=r(102),o=(r(7294),r(3905)),i=["components"],p={id:"betterer.betterer",title:"betterer()",sidebar_label:"betterer()",slug:"/betterer.betterer"},l=void 0,u={unversionedId:"api/betterer.betterer",id:"api/betterer.betterer",title:"betterer()",description:"API &gt; @betterer/betterer &gt; betterer",source:"@site/docs/api/betterer.betterer.md",sourceDirName:"api",slug:"/betterer.betterer",permalink:"/betterer/docs/betterer.betterer",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.betterer.md",tags:[],version:"current",frontMatter:{id:"betterer.betterer",title:"betterer()",sidebar_label:"betterer()",slug:"/betterer.betterer"}},c={},s=[{value:"Signature",id:"signature",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Exceptions",id:"exceptions",level:2},{value:"Example",id:"example",level:2}],b={toc:s};function m(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},b,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.betterer"},"betterer")),(0,o.kt)("p",null,"Run ",(0,o.kt)("strong",{parentName:"p"},"Betterer")," with the given options."),(0,o.kt)("h2",{id:"signature"},"Signature"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare function betterer(options?: BettererOptionsStart): Promise<BettererSuiteSummary>;\n")),(0,o.kt)("h2",{id:"parameters"},"Parameters"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"options"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.bettereroptionsstart"},"BettererOptionsStart")),(0,o.kt)("td",{parentName:"tr",align:null},"Options for running ",(0,o.kt)("strong",{parentName:"td"},"Betterer"),".")))),(0,o.kt)("h2",{id:"returns"},"Returns"),(0,o.kt)("p",null,"Promise","<",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.betterersuitesummary"},"BettererSuiteSummary"),">"),(0,o.kt)("h2",{id:"exceptions"},"Exceptions"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/errors.betterererror"},(0,o.kt)("inlineCode",{parentName:"a"},"BettererError"))," Will throw if something goes wrong while running ",(0,o.kt)("strong",{parentName:"p"},"Betterer"),"."),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"import { betterer } from '@betterer/betterer';\n\nconst suiteSummary = await betterer(options);\n")))}m.isMDXComponent=!0}}]);