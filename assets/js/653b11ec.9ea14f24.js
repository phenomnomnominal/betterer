"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4098],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var o=n.createContext({}),p=function(e){var t=n.useContext(o),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(o.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,l=e.originalType,o=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=p(r),m=a,f=c["".concat(o,".").concat(m)]||c[m]||d[m]||l;return r?n.createElement(f,i(i({ref:t},u),{},{components:r})):n.createElement(f,i({ref:t},u))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=r.length,i=new Array(l);i[0]=m;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s[c]="string"==typeof e?e:a,i[1]=s;for(var p=2;p<l;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},246:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>o,contentTitle:()=>i,default:()=>d,frontMatter:()=>l,metadata:()=>s,toc:()=>p});var n=r(7462),a=(r(7294),r(3905));const l={id:"eslint.eslint",title:"eslint()",sidebar_label:"eslint()",slug:"/eslint.eslint"},i=void 0,s={unversionedId:"api/eslint.eslint",id:"api/eslint.eslint",title:"eslint()",description:"API &gt; @betterer/eslint &gt; eslint",source:"@site/docs/api/eslint.eslint.md",sourceDirName:"api",slug:"/eslint.eslint",permalink:"/betterer/docs/eslint.eslint",draft:!1,editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/eslint.eslint.md",tags:[],version:"current",frontMatter:{id:"eslint.eslint",title:"eslint()",sidebar_label:"eslint()",slug:"/eslint.eslint"}},o={},p=[{value:"Signature",id:"signature",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Exceptions",id:"exceptions",level:2},{value:"Remarks",id:"remarks",level:2},{value:"Example",id:"example",level:2}],u={toc:p},c="wrapper";function d(e){let{components:t,...r}=e;return(0,a.kt)(c,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/eslint"},"@betterer/eslint")," ",">"," ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/eslint.eslint"},"eslint")),(0,a.kt)("p",null,"Use this test to incrementally introduce new ",(0,a.kt)("a",{parentName:"p",href:"https://eslint.org/"},(0,a.kt)("strong",{parentName:"a"},"ESLint"))," rules to your codebase. You can pass as many ",(0,a.kt)("strong",{parentName:"p"},"ESLint")," ",(0,a.kt)("a",{parentName:"p",href:"https://eslint.org/docs/rules/"},"rule configurations")," as you like:"),(0,a.kt)("h2",{id:"signature"},"Signature"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare function eslint(rules: BettererESLintRulesConfig): BettererFileTest;\n")),(0,a.kt)("h2",{id:"parameters"},"Parameters"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,a.kt)("th",{parentName:"tr",align:null},"Type"),(0,a.kt)("th",{parentName:"tr",align:null},"Description"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"rules"),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/betterer/docs/eslint.betterereslintrulesconfig"},"BettererESLintRulesConfig")),(0,a.kt)("td",{parentName:"tr",align:null},"Additional ",(0,a.kt)("a",{parentName:"td",href:"https://eslint.org/"},(0,a.kt)("strong",{parentName:"a"},"ESLint"))," ",(0,a.kt)("a",{parentName:"td",href:"https://eslint.org/docs/rules/"},"rules")," to enable.")))),(0,a.kt)("h2",{id:"returns"},"Returns"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest"},"BettererFileTest")),(0,a.kt)("h2",{id:"exceptions"},"Exceptions"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/errors.betterererror"},(0,a.kt)("inlineCode",{parentName:"a"},"BettererError"))," Will throw if the user doesn't pass ",(0,a.kt)("inlineCode",{parentName:"p"},"rules"),"."),(0,a.kt)("h2",{id:"remarks"},"Remarks"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/eslint.eslint"},(0,a.kt)("inlineCode",{parentName:"a"},"eslint"))," is a ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest"},(0,a.kt)("inlineCode",{parentName:"a"},"BettererFileTest")),", so you can use ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.include"},(0,a.kt)("inlineCode",{parentName:"a"},"include()")),", ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.exclude"},(0,a.kt)("inlineCode",{parentName:"a"},"exclude()")),", ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.only"},(0,a.kt)("inlineCode",{parentName:"a"},"only()")),", and ",(0,a.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.skip"},(0,a.kt)("inlineCode",{parentName:"a"},"skip()")),"."),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { eslint } from '@betterer/eslint';\n\nexport default {\n  'new eslint rules': () =>\n    eslint({\n      'no-debugger': 'error',\n      'no-unsafe-finally': 'error',\n    })\n    .include('./src/*.ts')\n};\n")))}d.isMDXComponent=!0}}]);