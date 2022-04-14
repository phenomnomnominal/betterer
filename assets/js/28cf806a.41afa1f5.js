"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1399],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return g}});var n=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),f=u(r),g=i,d=f["".concat(s,".").concat(g)]||f[g]||p[g]||o;return r?n.createElement(d,l(l({ref:t},c),{},{components:r})):n.createElement(d,l({ref:t},c))}));function g(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=r.length,l=new Array(o);l[0]=f;var a={};for(var s in t)hasOwnProperty.call(t,s)&&(a[s]=t[s]);a.originalType=e,a.mdxType="string"==typeof e?e:i,l[1]=a;for(var u=2;u<o;u++)l[u]=r[u];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},5674:function(e,t,r){r.r(t),r.d(t,{assets:function(){return c},contentTitle:function(){return s},default:function(){return g},frontMatter:function(){return a},metadata:function(){return u},toc:function(){return p}});var n=r(3117),i=r(102),o=(r(7294),r(3905)),l=["components"],a={id:"eslint.betterereslintrulesconfig",title:"BettererESLintRulesConfig",sidebar_label:"BettererESLintRulesConfig",slug:"/eslint.betterereslintrulesconfig"},s=void 0,u={unversionedId:"api/eslint.betterereslintrulesconfig",id:"api/eslint.betterereslintrulesconfig",title:"BettererESLintRulesConfig",description:"API &gt; @betterer/eslint &gt; BettererESLintRulesConfig",source:"@site/docs/api/eslint.betterereslintrulesconfig.md",sourceDirName:"api",slug:"/eslint.betterereslintrulesconfig",permalink:"/betterer/docs/eslint.betterereslintrulesconfig",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/api/eslint.betterereslintrulesconfig.md",tags:[],version:"current",frontMatter:{id:"eslint.betterereslintrulesconfig",title:"BettererESLintRulesConfig",sidebar_label:"BettererESLintRulesConfig",slug:"/eslint.betterereslintrulesconfig"}},c={},p=[{value:"Signature",id:"signature",level:2}],f={toc:p};function g(e){var t=e.components,r=(0,i.Z)(e,l);return(0,o.kt)("wrapper",(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/index"},"API")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/eslint"},"@betterer/eslint")," ",">"," ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/eslint.betterereslintrulesconfig"},"BettererESLintRulesConfig")),(0,o.kt)("p",null,"The ",(0,o.kt)("a",{parentName:"p",href:"/betterer/docs/eslint.eslint"},(0,o.kt)("inlineCode",{parentName:"a"},"eslint"))," test factory takes a map of rule names and the rule's configuration."),(0,o.kt)("p",null,"The configuration options are defined by each rule, but will be either a ",(0,o.kt)("a",{parentName:"p",href:"https://eslint.org/docs/user-guide/configuring/rules#configuring-rules"},(0,o.kt)("inlineCode",{parentName:"a"},"RuleLevel"))," or ",(0,o.kt)("a",{parentName:"p",href:"https://eslint.org/docs/user-guide/configuring/rules#configuring-rules"},(0,o.kt)("inlineCode",{parentName:"a"},"RuleLevelAndOptions")),"."),(0,o.kt)("h2",{id:"signature"},"Signature"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"export declare type BettererESLintRulesConfig = Record<string, Linter.RuleLevel | Linter.RuleLevelAndOptions>;\n")))}g.isMDXComponent=!0}}]);