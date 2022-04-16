"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2884],{3905:function(e,t,r){r.d(t,{Zo:function(){return d},kt:function(){return b}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),o=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},d=function(e){var t=o(e.components);return n.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,u=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),c=o(r),b=a,m=c["".concat(u,".").concat(b)]||c[b]||p[b]||i;return r?n.createElement(m,l(l({ref:t},d),{},{components:r})):n.createElement(m,l({ref:t},d))}));function b(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,l=new Array(i);l[0]=c;var s={};for(var u in t)hasOwnProperty.call(t,u)&&(s[u]=t[u]);s.originalType=e,s.mdxType="string"==typeof e?e:a,l[1]=s;for(var o=2;o<i;o++)l[o]=r[o];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}c.displayName="MDXCreateElement"},3904:function(e,t,r){r.r(t),r.d(t,{assets:function(){return d},contentTitle:function(){return u},default:function(){return b},frontMatter:function(){return s},metadata:function(){return o},toc:function(){return p}});var n=r(3117),a=r(102),i=(r(7294),r(3905)),l=["components"],s={id:"betterer.bettererfile.addissue",title:"BettererFile.addIssue()",sidebar_label:"BettererFile.addIssue()",slug:"/betterer.bettererfile.addissue"},u=void 0,o={unversionedId:"api/betterer.bettererfile.addissue",id:"api/betterer.bettererfile.addissue",title:"BettererFile.addIssue()",description:"API &gt; @betterer/betterer &gt; BettererFile &gt; addIssue",source:"@site/docs/api/betterer.bettererfile.addissue.md",sourceDirName:"api",slug:"/betterer.bettererfile.addissue",permalink:"/betterer/docs/betterer.bettererfile.addissue",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.bettererfile.addissue.md",tags:[],version:"current",frontMatter:{id:"betterer.bettererfile.addissue",title:"BettererFile.addIssue()",sidebar_label:"BettererFile.addIssue()",slug:"/betterer.bettererfile.addissue"}},d={},p=[{value:"Signature",id:"signature",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2}],c={toc:p};function b(e){var t=e.components,r=(0,a.Z)(e,l);return(0,i.kt)("wrapper",(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,i.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,i.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfile"},"BettererFile")," ",">"," ",(0,i.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfile.addissue"},"addIssue")),(0,i.kt)("p",null,"Add an issue to the file from start and end indices in the file contents string."),(0,i.kt)("h2",{id:"signature"},"Signature"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"addIssue(start: number, end: number, message: string, hash?: string): void;\n")),(0,i.kt)("h2",{id:"parameters"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,i.kt)("th",{parentName:"tr",align:null},"Type"),(0,i.kt)("th",{parentName:"tr",align:null},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"start"),(0,i.kt)("td",{parentName:"tr",align:null},"number"),(0,i.kt)("td",{parentName:"tr",align:null},"The start index of the issue.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"end"),(0,i.kt)("td",{parentName:"tr",align:null},"number"),(0,i.kt)("td",{parentName:"tr",align:null},"The end index of the issue.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"message"),(0,i.kt)("td",{parentName:"tr",align:null},"string"),(0,i.kt)("td",{parentName:"tr",align:null},"A message that describes the issue.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:null},"hash"),(0,i.kt)("td",{parentName:"tr",align:null},"string"),(0,i.kt)("td",{parentName:"tr",align:null},"A hash for the issue. If omitted, the hash of ",(0,i.kt)("code",null,"message")," will be used.")))),(0,i.kt)("h2",{id:"returns"},"Returns"),(0,i.kt)("p",null,"void"))}b.isMDXComponent=!0}}]);