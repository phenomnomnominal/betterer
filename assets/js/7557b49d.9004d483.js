"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3940],{3905:function(e,r,t){t.d(r,{Zo:function(){return c},kt:function(){return b}});var n=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function u(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=n.createContext({}),p=function(e){var r=n.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},c=function(e){var r=p(e.components);return n.createElement(l.Provider,{value:r},e.children)},s={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),m=p(t),b=a,d=m["".concat(l,".").concat(b)]||m[b]||s[b]||o;return t?n.createElement(d,i(i({ref:r},c),{},{components:t})):n.createElement(d,i({ref:r},c))}));function b(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=m;var u={};for(var l in r)hasOwnProperty.call(r,l)&&(u[l]=r[l]);u.originalType=e,u.mdxType="string"==typeof e?e:a,i[1]=u;for(var p=2;p<o;p++)i[p]=t[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},1440:function(e,r,t){t.r(r),t.d(r,{assets:function(){return c},contentTitle:function(){return l},default:function(){return b},frontMatter:function(){return u},metadata:function(){return p},toc:function(){return s}});var n=t(3117),a=t(102),o=(t(7294),t(3905)),i=["components"],u={id:"betterer.runner",title:"runner()",sidebar_label:"runner()",slug:"/betterer.runner"},l=void 0,p={unversionedId:"api/betterer.runner",id:"api/betterer.runner",title:"runner()",description:"API &gt; @betterer/betterer &gt; runner",source:"@site/docs/api/betterer.runner.md",sourceDirName:"api",slug:"/betterer.runner",permalink:"/betterer/docs/betterer.runner",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.runner.md",tags:[],version:"current",frontMatter:{id:"betterer.runner",title:"runner()",sidebar_label:"runner()",slug:"/betterer.runner"}},c={},s=[{value:"Signature",id:"signature",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Exceptions",id:"exceptions",level:2},{value:"Example",id:"example",level:2}],m={toc:s};function b(e){var r=e.components,t=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},m,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.runner"},"runner")),(0,o.kt)("p",null,"Create a ",(0,o.kt)("strong",{parentName:"p"},"BettererRunner")," with the given options."),(0,o.kt)("h2",{id:"signature"},"Signature"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare function runner(options?: BettererOptionsRunner): Promise<BettererRunner>;\n")),(0,o.kt)("h2",{id:"parameters"},"Parameters"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"options"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.bettereroptionsrunner"},"BettererOptionsRunner")),(0,o.kt)("td",{parentName:"tr",align:null},"Options for creating the runner.")))),(0,o.kt)("h2",{id:"returns"},"Returns"),(0,o.kt)("p",null,"Promise","<",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererrunner"},"BettererRunner"),">"),(0,o.kt)("h2",{id:"exceptions"},"Exceptions"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/errors.betterererror"},(0,o.kt)("inlineCode",{parentName:"a"},"BettererError"))," Will throw if something goes wrong while creating the runner."),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"import { betterer } from '@betterer/betterer';\n\nconst runner = await betterer.runner(options);\n")))}b.isMDXComponent=!0}}]);