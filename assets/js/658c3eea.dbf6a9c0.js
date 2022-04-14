"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2293],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return b}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=n.createContext({}),l=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},u=function(e){var t=l(e.components);return n.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},s=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),s=l(r),b=o,m=s["".concat(p,".").concat(b)]||s[b]||d[b]||a;return r?n.createElement(m,c(c({ref:t},u),{},{components:r})):n.createElement(m,c({ref:t},u))}));function b(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,c=new Array(a);c[0]=s;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:o,c[1]=i;for(var l=2;l<a;l++)c[l]=r[l];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}s.displayName="MDXCreateElement"},6655:function(e,t,r){r.r(t),r.d(t,{assets:function(){return u},contentTitle:function(){return p},default:function(){return b},frontMatter:function(){return i},metadata:function(){return l},toc:function(){return d}});var n=r(3117),o=r(102),a=(r(7294),r(3905)),c=["components"],i={id:"betterer.bettererreporter.contextend",title:"BettererReporter.contextEnd()",sidebar_label:"BettererReporter.contextEnd()",slug:"/betterer.bettererreporter.contextend"},p=void 0,l={unversionedId:"api/betterer.bettererreporter.contextend",id:"api/betterer.bettererreporter.contextend",title:"BettererReporter.contextEnd()",description:"API &gt; @betterer/betterer &gt; BettererReporter &gt; contextEnd",source:"@site/docs/api/betterer.bettererreporter.contextend.md",sourceDirName:"api",slug:"/betterer.bettererreporter.contextend",permalink:"/betterer/docs/betterer.bettererreporter.contextend",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.bettererreporter.contextend.md",tags:[],version:"current",frontMatter:{id:"betterer.bettererreporter.contextend",title:"BettererReporter.contextEnd()",sidebar_label:"BettererReporter.contextEnd()",slug:"/betterer.bettererreporter.contextend"}},u={},d=[{value:"Signature",id:"signature",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}],s={toc:d};function b(e){var t=e.components,r=(0,o.Z)(e,c);return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererreporter"},"BettererReporter")," ",">"," ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererreporter.contextend"},"contextEnd")),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"contextEnd()")," hook is called when a ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.betterercontext"},(0,a.kt)("inlineCode",{parentName:"a"},"BettererContext"))," ends."),(0,a.kt)("h2",{id:"signature"},"Signature"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"contextEnd?(contextSummary: BettererContextSummary): Promise<void> | void;\n")),(0,a.kt)("h2",{id:"parameters"},"Parameters"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,a.kt)("th",{parentName:"tr",align:null},"Type"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"contextSummary"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/betterer.betterercontextsummary"},"BettererContextSummary")),(0,a.kt)("td",{parentName:"tr",align:null},"The test context summary.")))),(0,a.kt)("h2",{id:"returns"},"Returns"),(0,a.kt)("p",null,"Promise","<","void",">"," ","|"," void"))}b.isMDXComponent=!0}}]);