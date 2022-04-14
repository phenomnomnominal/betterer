"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6027],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return f}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=u(n),f=a,m=d["".concat(s,".").concat(f)]||d[f]||c[f]||i;return n?r.createElement(m,o(o({ref:t},p),{},{components:n})):r.createElement(m,o({ref:t},p))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var u=2;u<i;u++)o[u]=n[u];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8215:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(7294);function a(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:function(e,t,n){n.d(t,{Z:function(){return p}});var r=n(3117),a=n(7294),i=n(2389),o=n(9575),l=n(6010),s="tabItem_LplD";function u(e){var t,n,i,u=e.lazy,p=e.block,c=e.defaultValue,d=e.values,f=e.groupId,m=e.className,v=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),b=null!=d?d:v.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),h=(0,o.lx)(b,(function(e,t){return e.value===t.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===c?c:null!=(t=null!=c?c:null==(n=v.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(i=v[0])?void 0:i.props.value;if(null!==g&&!b.some((function(e){return e.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+b.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=(0,o.UB)(),k=y.tabGroupChoices,w=y.setTabGroupChoices,T=(0,a.useState)(g),N=T[0],x=T[1],O=[],j=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=f){var B=k[f];null!=B&&B!==N&&b.some((function(e){return e.value===B}))&&x(B)}var E=function(e){var t=e.currentTarget,n=O.indexOf(t),r=b[n].value;r!==N&&(j(t),x(r),null!=f&&w(f,r))},C=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=O.indexOf(e.currentTarget)+1;n=O[r]||O[0];break;case"ArrowLeft":var a=O.indexOf(e.currentTarget)-1;n=O[a]||O[O.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":p},m)},b.map((function(e){var t=e.value,n=e.label,i=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:function(e){return O.push(e)},onKeyDown:C,onFocus:E,onClick:E},i,{className:(0,l.Z)("tabs__item",s,null==i?void 0:i.className,{"tabs__item--active":N===t})}),null!=n?n:t)}))),u?(0,a.cloneElement)(v.filter((function(e){return e.props.value===N}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},v.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==N})}))))}function p(e){var t=(0,i.Z)();return a.createElement(u,(0,r.Z)({key:String(t)},e))}},3485:function(e,t,n){n.r(t),n.d(t,{assets:function(){return d},contentTitle:function(){return p},default:function(){return v},frontMatter:function(){return u},metadata:function(){return c},toc:function(){return f}});var r=n(3117),a=n(102),i=(n(7294),n(3905)),o=n(9877),l=n(8215),s=["components"],u={id:"test-definition-file",title:"Test definition file",sidebar_label:"Test definition file",slug:"/test-definition-file"},p=void 0,c={unversionedId:"test-definition-file",id:"test-definition-file",title:"Test definition file",description:"All your tests should be exported from a test definition file. By default, Betterer expects this to be .betterer.ts or .betterer.js, but you can change that by using the --config option when running Betterer. You can also split your tests into multiple test definition files and pass multiple paths to the --config option.",source:"@site/docs/test-definition-file.md",sourceDirName:".",slug:"/test-definition-file",permalink:"/betterer/docs/test-definition-file",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/test-definition-file.md",tags:[],version:"current",lastUpdatedBy:"Craig Spence",lastUpdatedAt:1636753986,formattedLastUpdatedAt:"11/12/2021",frontMatter:{id:"test-definition-file",title:"Test definition file",sidebar_label:"Test definition file",slug:"/test-definition-file"},sidebar:"docs",previous:{title:"Workflow",permalink:"/betterer/docs/workflow"},next:{title:"Tests",permalink:"/betterer/docs/tests"}},d={},f=[{value:"Default export",id:"default-export",level:2},{value:"Constant export",id:"constant-export",level:2}],m={toc:f};function v(e){var t=e.components,n=(0,a.Z)(e,s);return(0,i.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"All your tests should be exported from a test definition file. By default, ",(0,i.kt)("strong",{parentName:"p"},"Betterer")," expects this to be ",(0,i.kt)("inlineCode",{parentName:"p"},".betterer.ts")," or ",(0,i.kt)("inlineCode",{parentName:"p"},".betterer.js"),", but you can change that by using the ",(0,i.kt)("a",{parentName:"p",href:"./running-betterer#start-options"},(0,i.kt)("inlineCode",{parentName:"a"},"--config"))," option when running ",(0,i.kt)("strong",{parentName:"p"},"Betterer"),". You can also split your tests into multiple test definition files and pass multiple paths to the ",(0,i.kt)("a",{parentName:"p",href:"./running-betterer#start-options"},(0,i.kt)("inlineCode",{parentName:"a"},"--config"))," option."),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"From ",(0,i.kt)("strong",{parentName:"p"},"Betterer")," v5.0.0 all tests must be functions which return a ",(0,i.kt)("strong",{parentName:"p"},"BettererTest"),". This is so that your tests can be run in parallel! Any top-level code in you test definition file ",(0,i.kt)("em",{parentName:"p"},"could")," run multiple times."))),(0,i.kt)("h2",{id:"default-export"},"Default export"),(0,i.kt)("p",null,"You can expose tests as properties on the default export:"),(0,i.kt)(o.Z,{groupId:"language",defaultValue:"ts",values:[{label:"TypeScript",value:"ts"},{label:"JavaScript",value:"js"}],mdxType:"Tabs"},(0,i.kt)(l.Z,{value:"ts",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"// .betterer.ts\nimport { BettererTest } from '@betterer/betterer';\n\nexport default {\n  'my test': () =>\n    new BettererTest({\n      // ... test config\n    }),\n  'my other test': () =>\n    new BettererTest({\n      // ... test config\n    })\n};\n"))),(0,i.kt)(l.Z,{value:"js",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"// .betterer.js\nconst { BettererTest } = require('@betterer/betterer');\n\nmodule.exports = {\n  'my test': () =>\n    new BettererTest({\n      // ... test config\n    }),\n  'my other test': () =>\n    new BettererTest({\n      // ... test config\n    })\n};\n")))),(0,i.kt)("h2",{id:"constant-export"},"Constant export"),(0,i.kt)("p",null,"You can also expose tests as specific named exports:"),(0,i.kt)(o.Z,{groupId:"language",defaultValue:"ts",values:[{label:"TypeScript",value:"ts"},{label:"JavaScript",value:"js"}],mdxType:"Tabs"},(0,i.kt)(l.Z,{value:"ts",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"// .betterer.ts\nimport { BettererTest } from '@betterer/betterer';\n\nexport function myTest() {\n  return new BettererTest({\n    // ... test config\n  });\n}\n\nexport function myOtherTest() {\n  return new BettererTest({\n    // ... test config\n  });\n}\n"))),(0,i.kt)(l.Z,{value:"js",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-javascript"},"// .betterer.js\nconst { BettererTest } = require('@betterer/betterer');\n\nmodule.exports.myTest = () => {\n  return new BettererTest({\n    // ... test config\n  });\n};\n\nmodule.exports.myOtherTest = () => {\n  return new BettererTest({\n    // ... test config\n  });\n};\n")))),(0,i.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"You can define your tests in other files and then import them into your test definition file and re-export! If you write a test that would be useful for others, please publish it as a package!"))))}v.isMDXComponent=!0}}]);