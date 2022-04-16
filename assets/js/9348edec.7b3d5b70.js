"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3947],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return m}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},l=Object.keys(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)r=l[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),s=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,l=e.originalType,u=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),f=s(r),m=a,d=f["".concat(u,".").concat(m)]||f[m]||p[m]||l;return r?n.createElement(d,i(i({ref:t},c),{},{components:r})):n.createElement(d,i({ref:t},c))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=r.length,i=new Array(l);i[0]=f;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var s=2;s<l;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},8215:function(e,t,r){r.d(t,{Z:function(){return a}});var n=r(7294);function a(e){var t=e.children,r=e.hidden,a=e.className;return n.createElement("div",{role:"tabpanel",hidden:r,className:a},t)}},9877:function(e,t,r){r.d(t,{Z:function(){return c}});var n=r(3117),a=r(7294),l=r(2389),i=r(9575),o=r(6010),u="tabItem_LplD";function s(e){var t,r,l,s=e.lazy,c=e.block,p=e.defaultValue,f=e.values,m=e.groupId,d=e.className,b=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=f?f:b.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),h=(0,i.lx)(v,(function(e,t){return e.value===t.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===p?p:null!=(t=null!=p?p:null==(r=b.find((function(e){return e.props.default})))?void 0:r.props.value)?t:null==(l=b[0])?void 0:l.props.value;if(null!==y&&!v.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var g=(0,i.UB)(),k=g.tabGroupChoices,w=g.setTabGroupChoices,O=(0,a.useState)(y),E=O[0],N=O[1],T=[],x=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var j=k[m];null!=j&&j!==E&&v.some((function(e){return e.value===j}))&&N(j)}var C=function(e){var t=e.currentTarget,r=T.indexOf(t),n=v[r].value;n!==E&&(x(t),N(n),null!=m&&w(m,n))},D=function(e){var t,r=null;switch(e.key){case"ArrowRight":var n=T.indexOf(e.currentTarget)+1;r=T[n]||T[0];break;case"ArrowLeft":var a=T.indexOf(e.currentTarget)-1;r=T[a]||T[T.length-1]}null==(t=r)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":c},d)},v.map((function(e){var t=e.value,r=e.label,l=e.attributes;return a.createElement("li",(0,n.Z)({role:"tab",tabIndex:E===t?0:-1,"aria-selected":E===t,key:t,ref:function(e){return T.push(e)},onKeyDown:D,onFocus:C,onClick:C},l,{className:(0,o.Z)("tabs__item",u,null==l?void 0:l.className,{"tabs__item--active":E===t})}),null!=r?r:t)}))),s?(0,a.cloneElement)(b.filter((function(e){return e.props.value===E}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},b.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==E})}))))}function c(e){var t=(0,l.Z)();return a.createElement(s,(0,n.Z)({key:String(t)},e))}},4875:function(e,t,r){r.r(t),r.d(t,{assets:function(){return f},contentTitle:function(){return c},default:function(){return b},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return m}});var n=r(3117),a=r(102),l=(r(7294),r(3905)),i=r(9877),o=r(8215),u=["components"],s={id:"filters",title:"Filters",sidebar_label:"Filters",slug:"/filters"},c=void 0,p={unversionedId:"filters",id:"filters",title:"Filters",description:"If you want to be selective about which tests run, you can use the --filter option, which can take mutliple values. Each filter should be a regular expression.",source:"@site/docs/filters.md",sourceDirName:".",slug:"/filters",permalink:"/betterer/docs/filters",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/docs/filters.md",tags:[],version:"current",lastUpdatedBy:"Craig Spence",lastUpdatedAt:1636753986,formattedLastUpdatedAt:"11/12/2021",frontMatter:{id:"filters",title:"Filters",sidebar_label:"Filters",slug:"/filters"},sidebar:"docs",previous:{title:"Results file",permalink:"/betterer/docs/results-file"},next:{title:"Betterer & TypeScript",permalink:"/betterer/docs/betterer-and-typescript"}},f={},m=[],d={toc:m};function b(e){var t=e.components,r=(0,a.Z)(e,u);return(0,l.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"If you want to be selective about which tests run, you can use the ",(0,l.kt)("a",{parentName:"p",href:"./running-betterer#start-options"},(0,l.kt)("inlineCode",{parentName:"a"},"--filter"))," option, which can take mutliple values. Each filter should be a ",(0,l.kt)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"},"regular expression"),"."),(0,l.kt)(i.Z,{groupId:"package-manager",defaultValue:"yarn",values:[{label:"Yarn",value:"yarn"},{label:"npm",value:"npm"}],mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"yarn",mdxType:"TabItem"},(0,l.kt)("p",null,"Run ",(0,l.kt)("inlineCode",{parentName:"p"},"yarn betterer --filter my-test")," to run ",(0,l.kt)("strong",{parentName:"p"},"Betterer")," with a filter."),(0,l.kt)("p",null,"Run ",(0,l.kt)("inlineCode",{parentName:"p"},"yarn betterer --filter my-test --filter my-other-test")," to run ",(0,l.kt)("strong",{parentName:"p"},"Betterer")," with multiple filters.")),(0,l.kt)(o.Z,{value:"npm",mdxType:"TabItem"},(0,l.kt)("p",null,"Run ",(0,l.kt)("inlineCode",{parentName:"p"},"npm run betterer --filter my-test")," to run ",(0,l.kt)("strong",{parentName:"p"},"Betterer")," with a filter."),(0,l.kt)("p",null,"Run ",(0,l.kt)("inlineCode",{parentName:"p"},"npm run betterer --filter my-test --filter my-other-test")," to run ",(0,l.kt)("strong",{parentName:"p"},"Betterer")," with multiple filters."))),(0,l.kt)("p",null,"When running in ",(0,l.kt)("a",{parentName:"p",href:"./running-betterer#watch-mode"},"Watch mode"),", filters can be updated on the fly by first pressing ",(0,l.kt)("inlineCode",{parentName:"p"},"f"),", and then modifying the current filter."))}b.isMDXComponent=!0}}]);