"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7115],{3905:(e,r,t)=>{t.d(r,{Zo:()=>d,kt:()=>b});var a=t(7294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function l(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var s=a.createContext({}),p=function(e){var r=a.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):l(l({},r),e)),t},d=function(e){var r=p(e.components);return a.createElement(s.Provider,{value:r},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},u=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),c=p(t),u=n,b=c["".concat(s,".").concat(u)]||c[u]||m[u]||o;return t?a.createElement(b,l(l({ref:r},d),{},{components:t})):a.createElement(b,l({ref:r},d))}));function b(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var o=t.length,l=new Array(o);l[0]=u;var i={};for(var s in r)hasOwnProperty.call(r,s)&&(i[s]=r[s]);i.originalType=e,i[c]="string"==typeof e?e:n,l[1]=i;for(var p=2;p<o;p++)l[p]=t[p];return a.createElement.apply(null,l)}return a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},5460:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>s,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var a=t(7462),n=(t(7294),t(3905));const o={id:"errors",title:"errors",sidebar_label:"errors",slug:"/errors"},l=void 0,i={unversionedId:"api/errors",id:"api/errors",title:"errors",description:"API &gt; @betterer/errors",source:"@site/docs/api/errors.md",sourceDirName:"api",slug:"/errors",permalink:"/betterer/docs/errors",draft:!1,editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/errors.md",tags:[],version:"current",lastUpdatedBy:"Craig Spence",lastUpdatedAt:1636753986,formattedLastUpdatedAt:"Nov 12, 2021",frontMatter:{id:"errors",title:"errors",sidebar_label:"errors",slug:"/errors"}},s={},p=[{value:"Classes",id:"classes",level:2},{value:"Functions",id:"functions",level:2},{value:"Type Aliases",id:"type-aliases",level:2}],d={toc:p},c="wrapper";function m(e){let{components:r,...t}=e;return(0,n.kt)(c,(0,a.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/errors"},"@betterer/errors")),(0,n.kt)("p",null,"Error type used within ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/phenomnomnominal/betterer"},(0,n.kt)("strong",{parentName:"a"},"Betterer")),"."),(0,n.kt)("h2",{id:"classes"},"Classes"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:null},"Class"),(0,n.kt)("th",{parentName:"tr",align:null},"Description"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("a",{parentName:"td",href:"/betterer/docs/errors.betterererror"},"BettererError")),(0,n.kt)("td",{parentName:"tr",align:null},"A custom Error for use in ",(0,n.kt)("strong",{parentName:"td"},"Betterer"),". It attaches some extra details to a standard JavaScript error for better logging and debugging.")))),(0,n.kt)("h2",{id:"functions"},"Functions"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:null},"Function"),(0,n.kt)("th",{parentName:"tr",align:null},"Description"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("a",{parentName:"td",href:"/betterer/docs/errors.isbetterererror"},"isBettererError(err)")),(0,n.kt)("td",{parentName:"tr",align:null},"Check if an object is a ",(0,n.kt)("a",{parentName:"td",href:"/betterer/docs/errors.betterererror"},(0,n.kt)("inlineCode",{parentName:"a"},"BettererError")),".")))),(0,n.kt)("h2",{id:"type-aliases"},"Type Aliases"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:null},"Type Alias"),(0,n.kt)("th",{parentName:"tr",align:null},"Description"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("a",{parentName:"td",href:"/betterer/docs/errors.betterererrordetail"},"BettererErrorDetail")),(0,n.kt)("td",{parentName:"tr",align:null},"An additional piece of information attached to a ",(0,n.kt)("a",{parentName:"td",href:"/betterer/docs/errors.betterererror"},(0,n.kt)("inlineCode",{parentName:"a"},"BettererError")),". This might be a more detailed error message, or the original Error that caused the ",(0,n.kt)("a",{parentName:"td",href:"/betterer/docs/errors.betterererror"},(0,n.kt)("inlineCode",{parentName:"a"},"BettererError"))," to be created.")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},(0,n.kt)("a",{parentName:"td",href:"/betterer/docs/errors.betterererrordetails"},"BettererErrorDetails")),(0,n.kt)("td",{parentName:"tr",align:null},"A list of ",(0,n.kt)("a",{parentName:"td",href:"/betterer/docs/errors.betterererrordetail"},(0,n.kt)("inlineCode",{parentName:"a"},"BettererErrorDetail"),"s"),".")))))}m.isMDXComponent=!0}}]);