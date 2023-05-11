"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1227],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var o=r.createContext({}),p=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(o.Provider,{value:t},e.children)},m="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,o=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=p(n),h=i,d=m["".concat(o,".").concat(h)]||m[h]||c[h]||a;return n?r.createElement(d,l(l({ref:t},u),{},{components:n})):r.createElement(d,l({ref:t},u))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,l=new Array(a);l[0]=h;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s[m]="string"==typeof e?e:i,l[1]=s;for(var p=2;p<a;p++)l[p]=n[p];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},8696:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>c,frontMatter:()=>a,metadata:()=>s,toc:()=>p});var r=n(7462),i=(n(7294),n(3905));const a={title:"Incrementally adding Stylelint rules with Betterer \u2600\ufe0f",author:"Craig Spence",authorURL:"http://twitter.com/phenomnominal",authorTwitter:"phenomnominal"},l=void 0,s={permalink:"/betterer/blog/2021/03/01/betterer-and-stylelint",editUrl:"https://github.com/phenomnomnominal/betterer/edit/master/website/blog/blog/2021-03-01-betterer-and-stylelint.md",source:"@site/blog/2021-03-01-betterer-and-stylelint.md",title:"Incrementally adding Stylelint rules with Betterer \u2600\ufe0f",description:"I just released v4.0.0 of Betterer \ud83c\udf89 (now with sweet new docs!) and it has a bunch of simplified APIs for writing tests. And just before I shipped it, I got an issue asking how to write a Stylelint test, so let's do it here and explain it line by line:",date:"2021-03-01T00:00:00.000Z",formattedDate:"March 1, 2021",tags:[],readingTime:5.56,hasTruncateMarker:!1,authors:[{name:"Craig Spence",url:"http://twitter.com/phenomnominal"}],frontMatter:{title:"Incrementally adding Stylelint rules with Betterer \u2600\ufe0f",author:"Craig Spence",authorURL:"http://twitter.com/phenomnominal",authorTwitter:"phenomnominal"},prevItem:{title:"Betterer v5.0.0 \u2600\ufe0f",permalink:"/betterer/blog/2021/11/13/betterer-v5.0.0"},nextItem:{title:"Improving accessibility with Betterer \u2600\ufe0f",permalink:"/betterer/blog/2020/05/15/improving-accessibility-with-betterer"}},o={authorsImageUrls:[void 0]},p=[{value:"TL;DR;",id:"tldr",level:2},{value:"NTL;PR (not that long, please read \ud83d\ude02)",id:"ntlpr-not-that-long-please-read-",level:2},{value:"<strong>Stylelint</strong>",id:"stylelint",level:3},{value:"Augmenting the configuration:",id:"augmenting-the-configuration",level:3},{value:"Passing the list of files:",id:"passing-the-list-of-files",level:3},{value:"Hooking into <strong>Betterer</strong>:",id:"hooking-into-betterer",level:3},{value:"Adding files:",id:"adding-files",level:3},{value:"Adding issues:",id:"adding-issues",level:3},{value:"The whole test:",id:"the-whole-test",level:3}],u={toc:p},m="wrapper";function c(e){let{components:t,...n}=e;return(0,i.kt)(m,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"I just released ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/phenomnomnominal/betterer"},"v4.0.0 of ",(0,i.kt)("strong",{parentName:"a"},"Betterer"))," \ud83c\udf89 (now with ",(0,i.kt)("a",{parentName:"p",href:"https://phenomnomnominal.github.io/betterer/"},"sweet new docs!"),") and it has a bunch of simplified APIs for writing ",(0,i.kt)("a",{parentName:"p",href:"https://phenomnomnominal.github.io/betterer/docs/betterer-file-test"},"tests"),". And just before I shipped it, I got ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/phenomnomnominal/betterer/issues/519"},"an issue")," asking how to write a ",(0,i.kt)("a",{parentName:"p",href:"https://stylelint.io/"},(0,i.kt)("strong",{parentName:"a"},"Stylelint"))," test, so let's do it here and explain it line by line:"),(0,i.kt)("h2",{id:"tldr"},"TL;DR;"),(0,i.kt)("p",null,"Here's the full test:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"// stylelint.ts\nimport { BettererFileTest } from '@betterer/betterer';\nimport { promises as fs } from 'fs';\nimport { Configuration, lint } from 'stylelint';\n\nexport function stylelint(configOverrides: Partial<Configuration> = {}) {\n  return new BettererFileTest(async (filePaths, fileTestResult) => {\n    const result = await lint({\n      files: [...filePaths],\n      configOverrides\n    });\n\n    await Promise.all(\n      result.results.map(async (result) => {\n        const contents = await fs.readFile(result.source, 'utf8');\n        const file = fileTestResult.addFile(result.source, contents);\n        result.warnings.forEach((warning) => {\n          const { line, column, text } = warning;\n          file.addIssue(line - 1, column - 1, line - 1, column - 1, text, text);\n        });\n      })\n    );\n  });\n}\n")),(0,i.kt)("p",null,"And then using the test:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"// .betterer.ts\nimport { stylelint } from './stylelint';\n\nexport default {\n  'no stylelint issues': stylelint({\n    rules: {\n      'unit-no-unknown': true\n    }\n  }).include('./**/*.css')\n};\n")),(0,i.kt)("h2",{id:"ntlpr-not-that-long-please-read-"},"NTL;PR (not that long, please read \ud83d\ude02)"),(0,i.kt)("h3",{id:"stylelint"},(0,i.kt)("strong",{parentName:"h3"},"Stylelint")),(0,i.kt)("p",null,"So how does it all work? Let's start with the actual ",(0,i.kt)("strong",{parentName:"p"},"Stylelint")," part."),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://stylelint.io/"},(0,i.kt)("strong",{parentName:"a"},"Stylelint"))," is pretty easy to set-up. You need a ",(0,i.kt)("inlineCode",{parentName:"p"},"stylelintrc.json")," file with configuration:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "extends": "stylelint-config-standard"\n}\n')),(0,i.kt)("p",null,"And then run it on your CSS files:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},'stylelint "**/*.css"\n')),(0,i.kt)("p",null,"Running that does the following:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"searches for the ",(0,i.kt)("inlineCode",{parentName:"li"},"stylelintrc.json")," configuration file"),(0,i.kt)("li",{parentName:"ol"},"reads the configuration"),(0,i.kt)("li",{parentName:"ol"},"finds the valid files"),(0,i.kt)("li",{parentName:"ol"},"runs the rules"),(0,i.kt)("li",{parentName:"ol"},"returns the results")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Stylelint")," also has a ",(0,i.kt)("a",{parentName:"p",href:"https://stylelint.io/user-guide/usage/node-api"},"JS API")," which we're going to use:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { lint } from 'stylelint';\n\nconst result = await lint({\n  // ...\n});\n")),(0,i.kt)("p",null,"We could just run the above and it will test the current state of the files with the current configuration in ",(0,i.kt)("inlineCode",{parentName:"p"},"stylelintrc.json"),". And that's great \u2728!"),(0,i.kt)("h3",{id:"augmenting-the-configuration"},"Augmenting the configuration:"),(0,i.kt)("p",null,"For the ",(0,i.kt)("strong",{parentName:"p"},"Betterer")," test we want to augment the ",(0,i.kt)("inlineCode",{parentName:"p"},"stylelintrc.json")," configuration with some extra rules... and ",(0,i.kt)("strong",{parentName:"p"},"Stylelint")," has ",(0,i.kt)("a",{parentName:"p",href:"https://stylelint.io/user-guide/usage/node-api#configoverrides"},"a really easy way")," to do that:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { Configuration, lint } from 'stylelint';\n\nfunction stylelint(configOverrides: Partial<Configuration> = {}) {\n  const result = await lint({\n    configOverrides\n  });\n}\n")),(0,i.kt)("h3",{id:"passing-the-list-of-files"},"Passing the list of files:"),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Stylelint")," also allows us to pass a specific set of files to test:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { Configuration, lint } from 'stylelint';\n\nfunction stylelint(configOverrides: Partial<Configuration> = {}, files: Array<string>) {\n  const result = await lint({\n    files,\n    configOverrides\n  });\n}\n")),(0,i.kt)("p",null,"So we could call the ",(0,i.kt)("inlineCode",{parentName:"p"},"stylelint")," function like:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"stylelint(\n  {\n    rules: {\n      'unit-no-unknown': true\n    }\n  },\n  './**/*.css'\n);\n")),(0,i.kt)("p",null,"And that will run the ",(0,i.kt)("strong",{parentName:"p"},"Stylelint")," from the ",(0,i.kt)("inlineCode",{parentName:"p"},"stylelinerc.json")," file, plus the ",(0,i.kt)("inlineCode",{parentName:"p"},"unit-no-unknown")," rule, on all ",(0,i.kt)("inlineCode",{parentName:"p"},".css")," files! Thats most of the tricky stuff sorted \u2b50\ufe0f!"),(0,i.kt)("h3",{id:"hooking-into-betterer"},"Hooking into ",(0,i.kt)("strong",{parentName:"h3"},"Betterer"),":"),(0,i.kt)("p",null,"This test needs to take advantage of all the snapshotting and diffing magic of ",(0,i.kt)("strong",{parentName:"p"},"Betterer"),", so we need to wrap it in a ",(0,i.kt)("a",{parentName:"p",href:"https://phenomnomnominal.github.io/betterer/docs/tests"},"test"),". We want to be able to target individual files, so it specifically needs to be a ",(0,i.kt)("a",{parentName:"p",href:"https://phenomnomnominal.github.io/betterer/docs/betterer-file-test"},(0,i.kt)("inlineCode",{parentName:"a"},"BettererFileTest")),". The function argument is the actual test, which is an ",(0,i.kt)("inlineCode",{parentName:"p"},"async")," function that runs the linter."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { BettererFileTest } from '@betterer/betterer';\nimport { Configuration, lint } from 'stylelint';\n\nfunction stylelint(configOverrides: Partial<Configuration> = {}) {\n  return new BettererFileTest(async (filePaths) => {\n    // ...\n  });\n}\n")),(0,i.kt)("p",null,"Each time it runs ",(0,i.kt)("strong",{parentName:"p"},"Betterer")," will call that function with the relevant set of files, which we will pass along to ",(0,i.kt)("strong",{parentName:"p"},"Stylelint"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { BettererFileTest } from '@betterer/betterer';\nimport { Configuration, lint } from 'stylelint';\n\nfunction stylelint(configOverrides: Partial<Configuration> = {}) {\n  return new BettererFileTest(async (filePaths) => {\n    const result = await lint({\n      files: [...filePaths],\n      configOverrides\n    });\n  });\n}\n")),(0,i.kt)("h3",{id:"adding-files"},"Adding files:"),(0,i.kt)("p",null,"Next thing is telling ",(0,i.kt)("strong",{parentName:"p"},"Betterer")," about all the files with issues reported by ",(0,i.kt)("strong",{parentName:"p"},"Stylelint"),". To do this we can use the ",(0,i.kt)("inlineCode",{parentName:"p"},"BettererFileTestResult")," object, which is the second parameter of the test function:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"new BettererFileTest(resolver, async (filePaths, fileTestResult) => {\n  // ...\n});\n")),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"result")," object from ",(0,i.kt)("strong",{parentName:"p"},"Stylelint")," contains a list of ",(0,i.kt)("inlineCode",{parentName:"p"},"results"),". For each item in that list, we need to read the file with ",(0,i.kt)("a",{parentName:"p",href:"https://nodejs.org/api/fs.html"},"Node's ",(0,i.kt)("inlineCode",{parentName:"a"},"fs")," module"),", and then call ",(0,i.kt)("a",{parentName:"p",href:"https://phenomnomnominal.github.io/betterer/docs/betterer-file-test#addfile"},(0,i.kt)("inlineCode",{parentName:"a"},"addFile()"))," with the file path (",(0,i.kt)("inlineCode",{parentName:"p"},"result.source"),"), and the contents of the file. That returns a ",(0,i.kt)("a",{parentName:"p",href:"https://phenomnomnominal.github.io/betterer/docs/betterer-file-test#bettererfile"},(0,i.kt)("inlineCode",{parentName:"a"},"BettererFile"))," object:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"import { promises as fs } from 'fs';\n\nawait Promise.all(\n  result.results.map(async (result) => {\n    const contents = await fs.readFile(result.source, 'utf8');\n    const file = fileTestResult.addFile(result.source, contents);\n  })\n);\n")),(0,i.kt)("h3",{id:"adding-issues"},"Adding issues:"),(0,i.kt)("p",null,"The last thing to do is convert from ",(0,i.kt)("strong",{parentName:"p"},"Stylelint")," warnings to ",(0,i.kt)("strong",{parentName:"p"},"Betterer")," issues. To do that we use the ",(0,i.kt)("a",{parentName:"p",href:"https://phenomnomnominal.github.io/betterer/docs/betterer-file-test#addissue"},(0,i.kt)("inlineCode",{parentName:"a"},"addIssue()"))," function! In this case we will use the following overload:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"addIssue(startLine: number, startCol: number, endLine: number, endCol: number, message: string, hash?: string):\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Stylelint")," only gives us the line and column for the start of the issue, so we use that as both the start position and the end position. ",(0,i.kt)("strong",{parentName:"p"},"Betterer")," expects them to be zero-indexed so we subtract ",(0,i.kt)("inlineCode",{parentName:"p"},"1")," from both. This also means that the ",(0,i.kt)("a",{parentName:"p",href:"https://marketplace.visualstudio.com/items?itemName=Betterer.betterer-vscode"},"VS Code extension")," will add a diagnostic to the whole token with the issue, which is pretty handy! We also pass the text of the issue twice, once as the ",(0,i.kt)("inlineCode",{parentName:"p"},"message"),", and a second time as the ",(0,i.kt)("inlineCode",{parentName:"p"},"hash"),". The ",(0,i.kt)("inlineCode",{parentName:"p"},"hash")," is used by ",(0,i.kt)("strong",{parentName:"p"},"Betterer")," to track issues as they move around within a file. ",(0,i.kt)("strong",{parentName:"p"},"Stylelint")," adds specific details to the ",(0,i.kt)("inlineCode",{parentName:"p"},"message")," so that makes it a good enough hash for our purposes. All up, converting an issue looks like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"result.warnings.forEach((warning) => {\n  const { line, column, text } = warning;\n  file.addIssue(line - 1, column - 1, line - 1, column - 1, text, text);\n});\n")),(0,i.kt)("h3",{id:"the-whole-test"},"The whole test:"),(0,i.kt)("p",null,"Putting that all together and you get this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"// stylelint.ts\nimport { BettererFileTest } from '@betterer/betterer';\nimport { promises as fs } from 'fs';\nimport { Configuration, lint } from 'stylelint';\n\nexport function stylelint(configOverrides: Partial<Configuration> = {}) {\n  return new BettererFileTest(async (filePaths, fileTestResult) => {\n    const result = await lint({\n      files: [...filePaths],\n      configOverrides\n    });\n\n    await Promise.all(\n      result.results.map(async (result) => {\n        const contents = await fs.readFile(result.source, 'utf8');\n        const file = fileTestResult.addFile(result.source, contents);\n        result.warnings.forEach((warning) => {\n          const { line, column, text } = warning;\n          file.addIssue(line - 1, column - 1, line - 1, column - 1, text, text);\n        });\n      })\n    );\n  });\n}\n")),(0,i.kt)("p",null,"And then we can use the test like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"// .betterer.ts\nimport { stylelint } from './stylelint';\n\nexport default {\n  'no stylelint issues': stylelint({\n    rules: {\n      'unit-no-unknown': true\n    }\n  }).include('./**/*.css')\n};\n")),(0,i.kt)("p",null,"And that's about it! The ",(0,i.kt)("strong",{parentName:"p"},"Stylelint")," API is the real MVP here, nice job to their team! \ud83d\udd25\ud83d\udd25\ud83d\udd25"),(0,i.kt)("p",null,"Hopefully that makes sense! I'm still pretty excited by ",(0,i.kt)("strong",{parentName:"p"},"Betterer"),", so hit me up on ",(0,i.kt)("a",{parentName:"p",href:"https://twitter.com/phenomnominal"},"Twitter")," if you have thoughts/feelings/ideas \ud83e\udd84"))}c.isMDXComponent=!0}}]);