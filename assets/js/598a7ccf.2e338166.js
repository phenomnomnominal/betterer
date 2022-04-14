"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4363],{3905:function(e,r,t){t.d(r,{Zo:function(){return l},kt:function(){return f}});var n=t(7294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=n.createContext({}),p=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},l=function(e){var r=p(e.components);return n.createElement(c.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},b=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,s=e.originalType,c=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),b=p(t),f=o,d=b["".concat(c,".").concat(f)]||b[f]||u[f]||s;return t?n.createElement(d,a(a({ref:r},l),{},{components:t})):n.createElement(d,a({ref:r},l))}));function f(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var s=t.length,a=new Array(s);a[0]=b;var i={};for(var c in r)hasOwnProperty.call(r,c)&&(i[c]=r[c]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var p=2;p<s;p++)a[p]=t[p];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}b.displayName="MDXCreateElement"},5770:function(e,r,t){t.r(r),t.d(r,{assets:function(){return l},contentTitle:function(){return c},default:function(){return f},frontMatter:function(){return i},metadata:function(){return p},toc:function(){return u}});var n=t(3117),o=t(102),s=(t(7294),t(3905)),a=["components"],i={id:"betterer.bettererprogress",title:"BettererProgress",sidebar_label:"BettererProgress",slug:"/betterer.bettererprogress"},c=void 0,p={unversionedId:"api/betterer.bettererprogress",id:"api/betterer.bettererprogress",title:"BettererProgress",description:"API &gt; @betterer/betterer &gt; BettererProgress",source:"@site/docs/api/betterer.bettererprogress.md",sourceDirName:"api",slug:"/betterer.bettererprogress",permalink:"/betterer/docs/betterer.bettererprogress",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/betterer.bettererprogress.md",tags:[],version:"current",frontMatter:{id:"betterer.bettererprogress",title:"BettererProgress",sidebar_label:"BettererProgress",slug:"/betterer.bettererprogress"}},l={},u=[{value:"Signature",id:"signature",level:2},{value:"References",id:"references",level:2}],b={toc:u};function f(e){var r=e.components,t=(0,o.Z)(e,a);return(0,s.kt)("wrapper",(0,n.Z)({},b,t,{components:r,mdxType:"MDXLayout"}),(0,s.kt)("p",null,(0,s.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,s.kt)("a",{parentName:"p",href:"/betterer/docs/betterer"},"@betterer/betterer")," ",">"," ",(0,s.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererprogress"},"BettererProgress")),(0,s.kt)("p",null,"A function that converts a test result to a numeric value that represents the progress towards the goal."),(0,s.kt)("h2",{id:"signature"},"Signature"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare type BettererProgress<DeserialisedType> = (baseline: DeserialisedType | null, result: DeserialisedType | null) => MaybeAsync<BettererDelta | null>;\n")),(0,s.kt)("h2",{id:"references"},"References"),(0,s.kt)("p",null," ",(0,s.kt)("a",{parentName:"p",href:"/betterer/docs/betterer.bettererdelta"},"BettererDelta")))}f.isMDXComponent=!0}}]);