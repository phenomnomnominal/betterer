"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5106],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>b});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var f=n.createContext({}),p=function(e){var t=n.useContext(f),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(f.Provider,{value:t},e.children)},u="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,f=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(r),d=a,b=u["".concat(f,".").concat(d)]||u[d]||s[d]||i;return r?n.createElement(b,o(o({ref:t},c),{},{components:r})):n.createElement(b,o({ref:t},c))}));function b(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=d;var l={};for(var f in t)hasOwnProperty.call(t,f)&&(l[f]=t[f]);l.originalType=e,l[u]="string"==typeof e?e:a,o[1]=l;for(var p=2;p<i;p++)o[p]=r[p];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},318:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>f,contentTitle:()=>o,default:()=>s,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var n=r(7462),a=(r(7294),r(3905));const i={id:"betterer.bettererdiff",title:"BettererDiff",sidebar_label:"BettererDiff",slug:"/betterer.bettererdiff"},o=void 0,l={unversionedId:"api/betterer.bettererdiff",id:"api/betterer.bettererdiff",title:"BettererDiff",description:"API &gt; @betterer/betterer &gt; BettererDiff",source:"@site/docs/api/betterer.bettererdiff.md",sourceDirName:"api",slug:"/betterer.bettererdiff",permalink:"/betterer/docs/betterer.bettererdiff",draft:!1,editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.bettererdiff.md",tags:[],version:"current",frontMatter:{id:"betterer.bettererdiff",title:"BettererDiff",sidebar_label:"BettererDiff",slug:"/betterer.bettererdiff"}},f={},p=[{value:"Signature",id:"signature",level:2},{value:"Properties",id:"properties",level:2}],c={toc:p},u="wrapper";function s(e){let{components:t,...r}=e;return(0,a.kt)(u,(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererdiff"},"BettererDiff")),(0,a.kt)("p",null,"The result of computing the difference between two results."),(0,a.kt)("h2",{id:"signature"},"Signature"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"export interface BettererDiff<DiffType = null> \n")),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Property"),(0,a.kt)("th",{parentName:"tr",align:null},"Type"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.bettererdiff.diff"},"diff")),(0,a.kt)("td",{parentName:"tr",align:null},"DiffType"),(0,a.kt)("td",{parentName:"tr",align:null},"The difference between ",(0,a.kt)("code",null,"expected")," and ",(0,a.kt)("code",null,"result"),".")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.bettererdiff.logs"},"logs")),(0,a.kt)("td",{parentName:"tr",align:null},"BettererLogs"),(0,a.kt)("td",{parentName:"tr",align:null},"A set of logging instructions that provide insight about the diff. The default reporter will show these to the user once the test is complete.")))))}s.isMDXComponent=!0}}]);