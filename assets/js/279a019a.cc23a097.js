"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3295],{3905:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return b}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),s=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},l=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),f=s(r),b=o,m=f["".concat(u,".").concat(b)]||f[b]||p[b]||i;return r?n.createElement(m,a(a({ref:t},l),{},{components:r})):n.createElement(m,a({ref:t},l))}));function b(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=f;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:o,a[1]=c;for(var s=2;s<i;s++)a[s]=r[s];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},2016:function(e,t,r){r.r(t),r.d(t,{assets:function(){return l},contentTitle:function(){return u},default:function(){return b},frontMatter:function(){return c},metadata:function(){return s},toc:function(){return p}});var n=r(3117),o=r(102),i=(r(7294),r(3905)),a=["components"],c={id:"betterer.betterertestfunction",title:"BettererTestFunction",sidebar_label:"BettererTestFunction",slug:"/betterer.betterertestfunction"},u=void 0,s={unversionedId:"api/betterer.betterertestfunction",id:"api/betterer.betterertestfunction",title:"BettererTestFunction",description:"API &gt; @betterer/betterer &gt; BettererTestFunction",source:"@site/docs/api/betterer.betterertestfunction.md",sourceDirName:"api",slug:"/betterer.betterertestfunction",permalink:"/betterer/docs/betterer.betterertestfunction",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.betterertestfunction.md",tags:[],version:"current",frontMatter:{id:"betterer.betterertestfunction",title:"BettererTestFunction",sidebar_label:"BettererTestFunction",slug:"/betterer.betterertestfunction"}},l={},p=[{value:"Signature",id:"signature",level:2},{value:"References",id:"references",level:2},{value:"Example",id:"example",level:2}],f={toc:p};function b(e){var t=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,i.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,i.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.betterertestfunction"},"BettererTestFunction")),(0,i.kt)("p",null,"A function that runs the actual test."),(0,i.kt)("h2",{id:"signature"},"Signature"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare type BettererTestFunction<DeserialisedType> = (run: BettererRun) => MaybeAsync<DeserialisedType>;\n")),(0,i.kt)("h2",{id:"references"},"References"),(0,i.kt)("p",null," ",(0,i.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererrun"},"BettererRun")),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { BettererRun } from '@betterer/betterer';\n\nexport function test (run: BettererRun): number {\n  const numberOfJavaScriptFiles = countJavaScriptFiles(run.filePaths);\n  return numberOfJavaScriptFiles;\n}\n")))}b.isMDXComponent=!0}}]);