"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5933],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return y}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),l=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(u.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),m=l(r),y=a,d=m["".concat(u,".").concat(y)]||m[y]||c[y]||o;return r?n.createElement(d,s(s({ref:t},p),{},{components:r})):n.createElement(d,s({ref:t},p))}));function y(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,s=new Array(o);s[0]=m;var i={};for(var u in t)hasOwnProperty.call(t,u)&&(i[u]=t[u]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var l=2;l<o;l++)s[l]=r[l];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},7231:function(e,t,r){r.r(t),r.d(t,{assets:function(){return p},contentTitle:function(){return u},default:function(){return y},frontMatter:function(){return i},metadata:function(){return l},toc:function(){return c}});var n=r(3117),a=r(102),o=(r(7294),r(3905)),s=["components"],i={id:"tsquery.tsquery",title:"tsquery()",sidebar_label:"tsquery()",slug:"/tsquery.tsquery"},u=void 0,l={unversionedId:"api/tsquery.tsquery",id:"api/tsquery.tsquery",title:"tsquery()",description:"API &gt; @betterer/tsquery &gt; tsquery",source:"@site/docs/api/tsquery.tsquery.md",sourceDirName:"api",slug:"/tsquery.tsquery",permalink:"/betterer/docs/tsquery.tsquery",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/tsquery.tsquery.md",tags:[],version:"current",frontMatter:{id:"tsquery.tsquery",title:"tsquery()",sidebar_label:"tsquery()",slug:"/tsquery.tsquery"}},p={},c=[{value:"Signature",id:"signature",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Exceptions",id:"exceptions",level:2},{value:"Remarks",id:"remarks",level:2},{value:"Example",id:"example",level:2}],m={toc:c};function y(e){var t=e.components,r=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/tsquery"},"@betterer/tsquery")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/tsquery.tsquery"},"tsquery")),(0,o.kt)("p",null,"Use this test to incrementally remove ",(0,o.kt)("strong",{parentName:"p"},"TSQuery")," matches from your codebase. See the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/phenomnomnominal/tsquery"},(0,o.kt)("strong",{parentName:"a"},"TSQuery")," documentation")," for more details about the query syntax."),(0,o.kt)("h2",{id:"signature"},"Signature"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare function tsquery(query: string): BettererFileTest;\n")),(0,o.kt)("h2",{id:"parameters"},"Parameters"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"query"),(0,o.kt)("td",{parentName:"tr",align:null},"string"),(0,o.kt)("td",{parentName:"tr",align:null},"A ",(0,o.kt)("a",{parentName:"td",href:"https://github.com/phenomnomnominal/tsquery"},(0,o.kt)("strong",{parentName:"a"},"TSQuery"))," query to match.")))),(0,o.kt)("h2",{id:"returns"},"Returns"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest"},"BettererFileTest")),(0,o.kt)("h2",{id:"exceptions"},"Exceptions"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/errors.betterererror"},(0,o.kt)("inlineCode",{parentName:"a"},"BettererError"))," Will throw if the user doesn't pass ",(0,o.kt)("inlineCode",{parentName:"p"},"query"),"."),(0,o.kt)("h2",{id:"remarks"},"Remarks"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/tsquery.tsquery"},(0,o.kt)("inlineCode",{parentName:"a"},"tsquery"))," is a ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest"},(0,o.kt)("inlineCode",{parentName:"a"},"BettererFileTest")),", so you can use ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.include"},(0,o.kt)("inlineCode",{parentName:"a"},"include()")),", ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.exclude"},(0,o.kt)("inlineCode",{parentName:"a"},"exclude()")),", ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.only"},(0,o.kt)("inlineCode",{parentName:"a"},"only()")),", and ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.skip"},(0,o.kt)("inlineCode",{parentName:"a"},"skip()")),"."),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"import { tsquery } from '@betterer/tsquery';\n\nexport default {\n  'no raw console.log': () =>\n    tsquery(\n      'CallExpression > PropertyAccessExpression[expression.name=\"console\"][name.name=\"log\"]'\n     )\n     .include('./src/*.ts')\n};\n")))}y.isMDXComponent=!0}}]);