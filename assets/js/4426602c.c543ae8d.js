"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7721],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return m}});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var i=a.createContext({}),u=function(e){var t=a.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},s=function(e){var t=u(e.components);return a.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),g=u(r),m=n,v=g["".concat(i,".").concat(m)]||g[m]||p[m]||o;return r?a.createElement(v,c(c({ref:t},s),{},{components:r})):a.createElement(v,c({ref:t},s))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,c=new Array(o);c[0]=g;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:n,c[1]=l;for(var u=2;u<o;u++)c[u]=r[u];return a.createElement.apply(null,c)}return a.createElement.apply(null,r)}g.displayName="MDXCreateElement"},5330:function(e,t,r){r.r(t),r.d(t,{assets:function(){return s},contentTitle:function(){return i},default:function(){return m},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return p}});var a=r(3117),n=r(102),o=(r(7294),r(3905)),c=["components"],l={id:"coverage.coveragetotal",title:"coverageTotal()",sidebar_label:"coverageTotal()",slug:"/coverage.coveragetotal"},i=void 0,u={unversionedId:"api/coverage.coveragetotal",id:"api/coverage.coveragetotal",title:"coverageTotal()",description:"API &gt; @betterer/coverage &gt; coverageTotal",source:"@site/docs/api/coverage.coveragetotal.md",sourceDirName:"api",slug:"/coverage.coveragetotal",permalink:"/betterer/docs/coverage.coveragetotal",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/coverage.coveragetotal.md",tags:[],version:"current",frontMatter:{id:"coverage.coveragetotal",title:"coverageTotal()",sidebar_label:"coverageTotal()",slug:"/coverage.coveragetotal"}},s={},p=[{value:"Signature",id:"signature",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}],g={toc:p};function m(e){var t=e.components,r=(0,n.Z)(e,c);return(0,o.kt)("wrapper",(0,a.Z)({},g,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/coverage"},"@betterer/coverage")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/coverage.coveragetotal"},"coverageTotal")),(0,o.kt)("p",null,"Use this test to track your total test coverage. Reads a ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/istanbuljs/istanbuljs/blob/master/packages/istanbul-reports/lib/json-summary/index.js"},"json-summary format")," coverage summary. Make sure to run your tests separately before running Betterer."),(0,o.kt)("h2",{id:"signature"},"Signature"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare function coverageTotal(coverageSummaryPath?: string): BettererCoverageTest;\n")),(0,o.kt)("h2",{id:"parameters"},"Parameters"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"coverageSummaryPath"),(0,o.kt)("td",{parentName:"tr",align:null},"string"),(0,o.kt)("td",{parentName:"tr",align:null},"relative path to the coverage summary. Defaults to './coverage/coverage-summary.json'.")))),(0,o.kt)("h2",{id:"returns"},"Returns"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/coverage.betterercoveragetest"},"BettererCoverageTest")))}m.isMDXComponent=!0}}]);