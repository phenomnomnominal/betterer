"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3780],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>d});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function m(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var i=n.createContext({}),p=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):m(m({},t),e)),r},s=function(e){var t=p(e.components);return n.createElement(i.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),u=p(r),b=a,d=u["".concat(i,".").concat(b)]||u[b]||c[b]||o;return r?n.createElement(d,m(m({ref:t},s),{},{components:r})):n.createElement(d,m({ref:t},s))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,m=new Array(o);m[0]=b;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[u]="string"==typeof e?e:a,m[1]=l;for(var p=2;p<o;p++)m[p]=r[p];return n.createElement.apply(null,m)}return n.createElement.apply(null,r)}b.displayName="MDXCreateElement"},2364:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>i,contentTitle:()=>m,default:()=>c,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var n=r(7462),a=(r(7294),r(3905));const o={id:"betterer.betterercontextsummary",title:"BettererContextSummary",sidebar_label:"BettererContextSummary",slug:"/betterer.betterercontextsummary"},m=void 0,l={unversionedId:"api/betterer.betterercontextsummary",id:"api/betterer.betterercontextsummary",title:"BettererContextSummary",description:"API &gt; @betterer/betterer &gt; BettererContextSummary",source:"@site/docs/api/betterer.betterercontextsummary.md",sourceDirName:"api",slug:"/betterer.betterercontextsummary",permalink:"/betterer/docs/betterer.betterercontextsummary",draft:!1,editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.betterercontextsummary.md",tags:[],version:"current",frontMatter:{id:"betterer.betterercontextsummary",title:"BettererContextSummary",sidebar_label:"BettererContextSummary",slug:"/betterer.betterercontextsummary"}},i={},p=[{value:"Signature",id:"signature",level:2},{value:"Remarks",id:"remarks",level:2},{value:"Example 1",id:"example-1",level:2},{value:"Example 2",id:"example-2",level:2},{value:"Properties",id:"properties",level:2}],s={toc:p},u="wrapper";function c(e){let{components:t,...r}=e;return(0,a.kt)(u,(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.betterercontextsummary"},"BettererContextSummary")),(0,a.kt)("p",null,"The summary of a set of test suite runs."),(0,a.kt)("h2",{id:"signature"},"Signature"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"export interface BettererContextSummary \n")),(0,a.kt)("h2",{id:"remarks"},"Remarks"),(0,a.kt)("p",null,"You can get the ",(0,a.kt)("inlineCode",{parentName:"p"},"BettererContextSummary")," via the ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererreporter"},(0,a.kt)("inlineCode",{parentName:"a"},"BettererReporter"))," interface."),(0,a.kt)("h2",{id:"example-1"},"Example 1"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"const myReporter: BettererReporter = {\n  // Access the summary after the context has ended:\n  contextEnd (contextSummary: BettererContextSummary) {\n    // ...\n  }\n}\n")),(0,a.kt)("p",null,"or by using ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererreporter"},(0,a.kt)("inlineCode",{parentName:"a"},"BettererReporter"),"'s")," Promise-based ",(0,a.kt)("inlineCode",{parentName:"p"},"lifecycle")," interface:"),(0,a.kt)("h2",{id:"example-2"},"Example 2"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"const myReporter: BettererReporter = {\n  // Access the summary after the context has ended:\n  contextStart (context: BettererContext, lifecycle: Promise<BettererContextSummary>) {\n    const summary: BettererContextSummary = await lifecycle;\n    // ...\n  }\n}\n")),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Property"),(0,a.kt)("th",{parentName:"tr",align:null},"Type"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterercontextsummary.config"},"config")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.bettererconfig"},"BettererConfig")),(0,a.kt)("td",{parentName:"tr",align:null},"The ",(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.bettererconfig"},"config")," of the context.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterercontextsummary.lastsuite"},"lastSuite")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterersuitesummary"},"BettererSuiteSummary")),(0,a.kt)("td",{parentName:"tr",align:null},"The ",(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterersuitesummary"},(0,a.kt)("inlineCode",{parentName:"a"},"BettererSuiteSummary"))," for the last test suite run by a context.")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterercontextsummary.suites"},"suites")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterersuitesummaries"},"BettererSuiteSummaries")),(0,a.kt)("td",{parentName:"tr",align:null},"The ",(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterersuitesummaries"},(0,a.kt)("inlineCode",{parentName:"a"},"BettererSuiteSummaries"))," for all test suite runs completed by a context.")))))}c.isMDXComponent=!0}}]);