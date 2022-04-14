"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6397],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function p(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?p(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):p(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},p=Object.keys(e);for(n=0;n<p.length;n++)r=p[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(n=0;n<p.length;n++)r=p[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),c=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},s=function(e){var t=c(e.components);return n.createElement(i.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,p=e.originalType,i=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),m=c(r),d=a,g=m["".concat(i,".").concat(d)]||m[d]||u[d]||p;return r?n.createElement(g,l(l({ref:t},s),{},{components:r})):n.createElement(g,l({ref:t},s))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var p=r.length,l=new Array(p);l[0]=m;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var c=2;c<p;c++)l[c]=r[c];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},7002:function(e,t,r){r.r(t),r.d(t,{assets:function(){return s},contentTitle:function(){return i},default:function(){return d},frontMatter:function(){return o},metadata:function(){return c},toc:function(){return u}});var n=r(3117),a=r(102),p=(r(7294),r(3905)),l=["components"],o={id:"regexp.regexp",title:"regexp()",sidebar_label:"regexp()",slug:"/regexp.regexp"},i=void 0,c={unversionedId:"api/regexp.regexp",id:"api/regexp.regexp",title:"regexp()",description:"API &gt; @betterer/regexp &gt; regexp",source:"@site/docs/api/regexp.regexp.md",sourceDirName:"api",slug:"/regexp.regexp",permalink:"/betterer/docs/regexp.regexp",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/regexp.regexp.md",tags:[],version:"current",frontMatter:{id:"regexp.regexp",title:"regexp()",sidebar_label:"regexp()",slug:"/regexp.regexp"}},s={},u=[{value:"Signature",id:"signature",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Exceptions",id:"exceptions",level:2},{value:"Remarks",id:"remarks",level:2},{value:"Example",id:"example",level:2}],m={toc:u};function d(e){var t=e.components,r=(0,a.Z)(e,l);return(0,p.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/regexp"},"@betterer/regexp")," ",">"," ",(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/regexp.regexp"},"regexp")),(0,p.kt)("p",null,"Use this test to incrementally remove ",(0,p.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp"},(0,p.kt)("inlineCode",{parentName:"a"},"RegExp"))," matches from your codebase."),(0,p.kt)("h2",{id:"signature"},"Signature"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare function regexp(pattern: RegExp): BettererFileTest;\n")),(0,p.kt)("h2",{id:"parameters"},"Parameters"),(0,p.kt)("table",null,(0,p.kt)("thead",{parentName:"table"},(0,p.kt)("tr",{parentName:"thead"},(0,p.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,p.kt)("th",{parentName:"tr",align:null},"Type"),(0,p.kt)("th",{parentName:"tr",align:null},"Description"))),(0,p.kt)("tbody",{parentName:"table"},(0,p.kt)("tr",{parentName:"tbody"},(0,p.kt)("td",{parentName:"tr",align:null},"pattern"),(0,p.kt)("td",{parentName:"tr",align:null},"RegExp"),(0,p.kt)("td",{parentName:"tr",align:null},"A ",(0,p.kt)("a",{parentName:"td",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp"},(0,p.kt)("inlineCode",{parentName:"a"},"RegExp"))," pattern to match.")))),(0,p.kt)("h2",{id:"returns"},"Returns"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest"},"BettererFileTest")),(0,p.kt)("h2",{id:"exceptions"},"Exceptions"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/errors.betterererror"},(0,p.kt)("inlineCode",{parentName:"a"},"BettererError"))," Will throw if the user doesn't pass ",(0,p.kt)("inlineCode",{parentName:"p"},"pattern"),"."),(0,p.kt)("h2",{id:"remarks"},"Remarks"),(0,p.kt)("p",null,(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/regexp.regexp"},(0,p.kt)("inlineCode",{parentName:"a"},"regexp"))," is a ",(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest"},(0,p.kt)("inlineCode",{parentName:"a"},"BettererFileTest")),", so you can use ",(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.include"},(0,p.kt)("inlineCode",{parentName:"a"},"include()")),", ",(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.exclude"},(0,p.kt)("inlineCode",{parentName:"a"},"exclude()")),", ",(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.only"},(0,p.kt)("inlineCode",{parentName:"a"},"only()")),", and ",(0,p.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.skip"},(0,p.kt)("inlineCode",{parentName:"a"},"skip()")),"."),(0,p.kt)("h2",{id:"example"},"Example"),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-typescript"},"import { regexp } from '@betterer/regexp';\n\nexport default {\n  'no hack comments': () =>\n    regexp(/(\\/\\/\\s*HACK)/i)\n    .include('./src/*.ts')\n};\n")))}d.isMDXComponent=!0}}]);