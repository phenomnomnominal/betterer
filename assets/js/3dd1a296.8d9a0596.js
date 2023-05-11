"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8270],{3905:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>d});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},l=Object.keys(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)r=l[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var p=a.createContext({}),u=function(e){var t=a.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},s=function(e){var t=u(e.components);return a.createElement(p.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,l=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),c=u(r),g=n,d=c["".concat(p,".").concat(g)]||c[g]||m[g]||l;return r?a.createElement(d,i(i({ref:t},s),{},{components:r})):a.createElement(d,i({ref:t},s))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=r.length,i=new Array(l);i[0]=g;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o[c]="string"==typeof e?e:n,i[1]=o;for(var u=2;u<l;u++)i[u]=r[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}g.displayName="MDXCreateElement"},2974:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>m,frontMatter:()=>l,metadata:()=>o,toc:()=>u});var a=r(7462),n=(r(7294),r(3905));const l={id:"angular.angular",title:"angular()",sidebar_label:"angular()",slug:"/angular.angular"},i=void 0,o={unversionedId:"api/angular.angular",id:"api/angular.angular",title:"angular()",description:"API &gt; @betterer/angular &gt; angular",source:"@site/docs/api/angular.angular.md",sourceDirName:"api",slug:"/angular.angular",permalink:"/betterer/docs/angular.angular",draft:!1,editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/angular.angular.md",tags:[],version:"current",frontMatter:{id:"angular.angular",title:"angular()",sidebar_label:"angular()",slug:"/angular.angular"}},p={},u=[{value:"Signature",id:"signature",level:2},{value:"Parameters",id:"parameters",level:2},{value:"Returns",id:"returns",level:2},{value:"Exceptions",id:"exceptions",level:2},{value:"Remarks",id:"remarks",level:2},{value:"Example",id:"example",level:2}],s={toc:u},c="wrapper";function m(e){let{components:t,...r}=e;return(0,n.kt)(c,(0,a.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/angular"},"@betterer/angular")," ",">"," ",(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/angular.angular"},"angular")),(0,n.kt)("p",null,"Use this test to incrementally introduce ",(0,n.kt)("a",{parentName:"p",href:"https://angular.io/guide/angular-compiler-options"},(0,n.kt)("strong",{parentName:"a"},"Angular")," compiler configuration")," to your codebase."),(0,n.kt)("h2",{id:"signature"},"Signature"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare function angular(configFilePath: string, extraCompilerOptions: CompilerOptions): BettererFileTest;\n")),(0,n.kt)("h2",{id:"parameters"},"Parameters"),(0,n.kt)("table",null,(0,n.kt)("thead",{parentName:"table"},(0,n.kt)("tr",{parentName:"thead"},(0,n.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,n.kt)("th",{parentName:"tr",align:null},"Type"),(0,n.kt)("th",{parentName:"tr",align:null},"Description"))),(0,n.kt)("tbody",{parentName:"table"},(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},"configFilePath"),(0,n.kt)("td",{parentName:"tr",align:null},"string"),(0,n.kt)("td",{parentName:"tr",align:null},"The relative path to a tsconfig.json file.")),(0,n.kt)("tr",{parentName:"tbody"},(0,n.kt)("td",{parentName:"tr",align:null},"extraCompilerOptions"),(0,n.kt)("td",{parentName:"tr",align:null},"CompilerOptions"),(0,n.kt)("td",{parentName:"tr",align:null},"Additional ",(0,n.kt)("a",{parentName:"td",href:"https://angular.io/guide/angular-compiler-options"},(0,n.kt)("strong",{parentName:"a"},"Angular")," compiler configuration")," to enable.")))),(0,n.kt)("h2",{id:"returns"},"Returns"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest"},"BettererFileTest")),(0,n.kt)("h2",{id:"exceptions"},"Exceptions"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/errors.betterererror"},(0,n.kt)("inlineCode",{parentName:"a"},"BettererError"))," Will throw if the user doesn't pass ",(0,n.kt)("inlineCode",{parentName:"p"},"configFilePath")," or ",(0,n.kt)("inlineCode",{parentName:"p"},"extraCompilerOptions"),"."),(0,n.kt)("h2",{id:"remarks"},"Remarks"),(0,n.kt)("p",null,(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/angular.angular"},(0,n.kt)("inlineCode",{parentName:"a"},"angular"))," is a ",(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest"},(0,n.kt)("inlineCode",{parentName:"a"},"BettererFileTest")),", so you can use ",(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.include"},(0,n.kt)("inlineCode",{parentName:"a"},"include()")),", ",(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.exclude"},(0,n.kt)("inlineCode",{parentName:"a"},"exclude()")),", ",(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.only"},(0,n.kt)("inlineCode",{parentName:"a"},"only()")),", and ",(0,n.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererfiletest.skip"},(0,n.kt)("inlineCode",{parentName:"a"},"skip()")),"."),(0,n.kt)("h2",{id:"example"},"Example"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-typescript"},"import { angular } from '@betterer/angular';\n\nexport default {\n  'stricter template compilation': () =>\n    angular('./tsconfig.json', {\n      strictTemplates: true\n    })\n    .include('./src/*.ts', './src/*.html')\n};\n")))}m.isMDXComponent=!0}}]);