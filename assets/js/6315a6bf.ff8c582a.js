"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6078],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return f}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),p=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=p(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=p(r),f=a,d=m["".concat(l,".").concat(f)]||m[f]||u[f]||o;return r?n.createElement(d,i(i({ref:t},c),{},{components:r})):n.createElement(d,i({ref:t},c))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var p=2;p<o;p++)i[p]=r[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},4983:function(e,t,r){r.r(t),r.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return f},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return u}});var n=r(3117),a=r(102),o=(r(7294),r(3905)),i=["components"],s={id:"eslint-test",title:"ESLint test",slug:"/eslint-test"},l=void 0,p={unversionedId:"eslint-test",id:"eslint-test",title:"ESLint test",description:"Betterer ships several built-in tests to get you started. Check out the implementations for inspiration for your own tests!",source:"@site/docs/eslint-test.md",sourceDirName:".",slug:"/eslint-test",permalink:"/betterer/docs/eslint-test",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/eslint-test.md",tags:[],version:"current",lastUpdatedBy:"Craig Spence",lastUpdatedAt:1636753986,formattedLastUpdatedAt:"11/12/2021",frontMatter:{id:"eslint-test",title:"ESLint test",slug:"/eslint-test"},sidebar:"docs",previous:{title:"Coverage test",permalink:"/betterer/docs/coverage-test"},next:{title:"RegExp test",permalink:"/betterer/docs/regexp-test"}},c={},u=[{value:"<code>@betterer/eslint</code>",id:"betterereslint",level:3}],m={toc:u};function f(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Betterer")," ships several built-in tests to get you started. Check out the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/phenomnomnominal/betterer/blob/master/packages/eslint/src/eslint.ts"},"implementations")," for inspiration for your own tests!"),(0,o.kt)("h3",{id:"betterereslint"},(0,o.kt)("a",{parentName:"h3",href:"https://www.npmjs.com/package/@betterer/eslint"},(0,o.kt)("inlineCode",{parentName:"a"},"@betterer/eslint"))),(0,o.kt)("p",null,"Use this test to incrementally introduce new ",(0,o.kt)("a",{parentName:"p",href:"https://eslint.org/"},(0,o.kt)("strong",{parentName:"a"},"ESLint"))," rules to your codebase. You can pass as many ",(0,o.kt)("a",{parentName:"p",href:"https://eslint.org/docs/rules/"},"rule configurations")," as you like:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"import { eslint } from '@betterer/eslint';\n\nexport default {\n  'no more debuggers': () => eslint({ 'no-debugger': 'error' }).include('./src/**/*.ts')\n};\n")),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@betterer/eslint"},(0,o.kt)("inlineCode",{parentName:"a"},"@betterer/eslint"))," is a ",(0,o.kt)("a",{parentName:"p",href:"./betterer.bettererfiletest"},"BettererFileTest"),", so you can use ",(0,o.kt)("a",{parentName:"p",href:"./betterer.bettererfiletest.include"},(0,o.kt)("inlineCode",{parentName:"a"},"include")),", ",(0,o.kt)("a",{parentName:"p",href:"./betterer.bettererfiletest.exclude"},(0,o.kt)("inlineCode",{parentName:"a"},"exclude")),", ",(0,o.kt)("a",{parentName:"p",href:"betterer.bettererfiletest.only"},(0,o.kt)("inlineCode",{parentName:"a"},"only")),", and ",(0,o.kt)("a",{parentName:"p",href:"betterer.bettererfiletest.skip"},(0,o.kt)("inlineCode",{parentName:"a"},"skip")),"."))}f.isMDXComponent=!0}}]);