"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5004],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return b}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),m=p(r),b=a,f=m["".concat(l,".").concat(b)]||m[b]||s[b]||o;return r?n.createElement(f,i(i({ref:t},u),{},{components:r})):n.createElement(f,i({ref:t},u))}));function b(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},575:function(e,t,r){r.r(t),r.d(t,{assets:function(){return u},contentTitle:function(){return l},default:function(){return b},frontMatter:function(){return c},metadata:function(){return p},toc:function(){return s}});var n=r(3117),a=r(102),o=(r(7294),r(3905)),i=["components"],c={id:"betterer.watch",title:"watch()",sidebar_label:"watch()",slug:"/betterer.watch"},l=void 0,p={unversionedId:"api/betterer.watch",id:"api/betterer.watch",title:"watch()",description:"API &gt; @betterer/betterer &gt; watch",source:"@site/docs/api/betterer.watch.md",sourceDirName:"api",slug:"/betterer.watch",permalink:"/betterer/docs/betterer.watch",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.watch.md",tags:[],version:"current",frontMatter:{id:"betterer.watch",title:"watch()",sidebar_label:"watch()",slug:"/betterer.watch"}},u={},s=[{value:"Signature",id:"signature",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Exceptions",id:"exceptions",level:2},{value:"Example",id:"example",level:2}],m={toc:s};function b(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.watch"},"watch")),(0,o.kt)("p",null,"Create a ",(0,o.kt)("strong",{parentName:"p"},"BettererRunner")," with the given options. Also starts up a file watcher for tracked files in the current working directory."),(0,o.kt)("h2",{id:"signature"},"Signature"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare function watch(options?: BettererOptionsWatch): Promise<BettererRunner>;\n")),(0,o.kt)("h2",{id:"parameters"},"Parameters"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"options"),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.bettereroptionswatch"},"BettererOptionsWatch")),(0,o.kt)("td",{parentName:"tr",align:null},"Options for creating the runner.")))),(0,o.kt)("h2",{id:"returns"},"Returns"),(0,o.kt)("p",null,"Promise","<",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererrunner"},"BettererRunner"),">"),(0,o.kt)("h2",{id:"exceptions"},"Exceptions"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/errors.betterererror"},(0,o.kt)("inlineCode",{parentName:"a"},"BettererError"))," Will throw if something goes wrong while creating the runner or watcher."),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"import { betterer } from '@betterer/betterer';\n\nconst runner = await betterer.watch(options);\n")))}b.isMDXComponent=!0}}]);