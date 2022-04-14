"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3154],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=n.createContext({}),c=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=c(e.components);return n.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),b=c(r),d=a,m=b["".concat(p,".").concat(d)]||b[d]||u[d]||o;return r?n.createElement(m,i(i({ref:t},s),{},{components:r})):n.createElement(m,i({ref:t},s))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=b;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}b.displayName="MDXCreateElement"},8863:function(e,t,r){r.r(t),r.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return d},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return u}});var n=r(3117),a=r(102),o=(r(7294),r(3905)),i=["components"],l={id:"betterer.betterercontext",title:"BettererContext",sidebar_label:"BettererContext",slug:"/betterer.betterercontext"},p=void 0,c={unversionedId:"api/betterer.betterercontext",id:"api/betterer.betterercontext",title:"BettererContext",description:"API &gt; @betterer/betterer &gt; BettererContext",source:"@site/docs/api/betterer.betterercontext.md",sourceDirName:"api",slug:"/betterer.betterercontext",permalink:"/betterer/docs/betterer.betterercontext",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.betterercontext.md",tags:[],version:"current",frontMatter:{id:"betterer.betterercontext",title:"BettererContext",sidebar_label:"BettererContext",slug:"/betterer.betterercontext"}},s={},u=[{value:"Signature",id:"signature",level:2},{value:"Remarks",id:"remarks",level:2},{value:"Example",id:"example",level:2},{value:"Properties",id:"properties",level:2},{value:"Methods",id:"methods",level:2}],b={toc:u};function d(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},b,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.betterercontext"},"BettererContext")),(0,o.kt)("p",null,"The context of a set of test suite runs."),(0,o.kt)("h2",{id:"signature"},"Signature"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"export interface BettererContext \n")),(0,o.kt)("h2",{id:"remarks"},"Remarks"),(0,o.kt)("p",null,"The internal implementation of ",(0,o.kt)("inlineCode",{parentName:"p"},"BettererContext")," is responsible for a lot more than this interface suggests, but we want to minimise the public API surface as much as possible. You can get the ",(0,o.kt)("inlineCode",{parentName:"p"},"BettererContext")," via the ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererreporter"},(0,o.kt)("inlineCode",{parentName:"a"},"BettererReporter"))," interface."),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"const myReporter: BettererReporter = {\n  // Access the context before any tests are run:\n  contextStart (context: BettererContext) {\n    // ...\n  },\n  // Access the context when something goes wrong:\n  contextError (context: BettererContext) {\n    // ...\n  }\n}\n")),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Property"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterercontext.config"},"config")),(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.bettererconfig"},"BettererConfig")),(0,o.kt)("td",{parentName:"tr",align:null},"The ",(0,o.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.bettererconfig"},(0,o.kt)("inlineCode",{parentName:"a"},"config"))," of the context. You probably don't want to mess with this directly \ud83d\udd25. If you need to update the config, you should use ",(0,o.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterercontext.options"},(0,o.kt)("inlineCode",{parentName:"a"},"BettererContext.options()"))," instead.")))),(0,o.kt)("h2",{id:"methods"},"Methods"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Method"),(0,o.kt)("th",{parentName:"tr",align:null},"Description"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterercontext.options"},"options(optionsOverride)")),(0,o.kt)("td",{parentName:"tr",align:null},"Make changes to the context config. The updated config will be used for the next run.")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},(0,o.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterercontext.stop"},"stop()")),(0,o.kt)("td",{parentName:"tr",align:null},"Stop the test run and clean everything up. If tests are running, waits for them to end before stopping.")))))}d.isMDXComponent=!0}}]);