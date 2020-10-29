# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.1.1](https://github.com/phenomnomnominal/betterer/compare/v3.1.0...v3.1.1) (2020-10-29)


### Bug Fixes

* **eslint 🐛:** fix no-floating-promises errors ([#291](https://github.com/phenomnomnominal/betterer/issues/291)) ([bba3d8c](https://github.com/phenomnomnominal/betterer/commit/bba3d8cf1ddb23abcc466ea87e65d0d7b0b6501a))
* **eslint 🐛:** fix restrict-template-expressions ([#115](https://github.com/phenomnomnominal/betterer/issues/115)) ([#306](https://github.com/phenomnomnominal/betterer/issues/306)) ([2229b93](https://github.com/phenomnomnominal/betterer/commit/2229b937b83a2a0d1a416a0a61aa42460665f3b5))





# [3.1.0](https://github.com/phenomnomnominal/betterer/compare/v3.0.3...v3.1.0) (2020-09-18)


### Features

* **betterer ✨:** make --ignore implementation useful ([#288](https://github.com/phenomnomnominal/betterer/issues/288)) ([19abdb3](https://github.com/phenomnomnominal/betterer/commit/19abdb3b15acbd1b3e63cd4c94dfbb4e294e6b46))


### Reverts

* Revert "Ignore git changes in watch (#287)" ([aff032a](https://github.com/phenomnomnominal/betterer/commit/aff032ad74371e2e10c04acb4fefa88e4a50cbb4)), closes [#287](https://github.com/phenomnomnominal/betterer/issues/287)





## [3.0.3](https://github.com/phenomnomnominal/betterer/compare/v3.0.2...v3.0.3) (2020-08-20)


### Bug Fixes

* **typescript 🐛:** fix replacing paths in error messages ([#229](https://github.com/phenomnomnominal/betterer/issues/229)) ([b4af4c8](https://github.com/phenomnomnominal/betterer/commit/b4af4c871963d181117fc93c0d8a203c4b73506e))





## [3.0.2](https://github.com/phenomnomnominal/betterer/compare/v3.0.1...v3.0.2) (2020-08-18)


### Bug Fixes

* **betterer 🐛:** handle the case when multiple issues are moved ([#213](https://github.com/phenomnomnominal/betterer/issues/213)) ([9c63fbf](https://github.com/phenomnomnominal/betterer/commit/9c63fbf316f08b28073c26efed002fedb18b90d3))





# [3.0.0](https://github.com/phenomnomnominal/betterer/compare/v2.4.1...v3.0.0) (2020-07-02)


### Features

* **betterer ✨:** removing timestamps ([#146](https://github.com/phenomnomnominal/betterer/issues/146)) ([10906e5](https://github.com/phenomnomnominal/betterer/commit/10906e519d3cffd111e4b6ce435718f3dd3d32a2))


### BREAKING CHANGES

* **betterer ✨:** Remove timestamps from results file





## [2.4.1](https://github.com/phenomnomnominal/betterer/compare/v2.4.0...v2.4.1) (2020-07-01)


### Bug Fixes

* **betterer 🐛:** correctly handle blank lines ([#143](https://github.com/phenomnomnominal/betterer/issues/143)) ([07680be](https://github.com/phenomnomnominal/betterer/commit/07680bec9b214b09591fa9e0dc3efbc263fbf333))





# [2.4.0](https://github.com/phenomnomnominal/betterer/compare/v2.3.0...v2.4.0) (2020-07-01)


### Features

* **betterer ✨:** borrow merge conflict handler from yarn ([#141](https://github.com/phenomnomnominal/betterer/issues/141)) ([5c396eb](https://github.com/phenomnomnominal/betterer/commit/5c396eb039e074dd479a6e394071bbd6215fe666))
* **betterer ✨:** differentiate between `worse` and `updated` ([#140](https://github.com/phenomnomnominal/betterer/issues/140)) ([a726472](https://github.com/phenomnomnominal/betterer/commit/a7264722f1bbf7f66d07f0c3d83f4a1d77d71e15))





# [2.3.0](https://github.com/phenomnomnominal/betterer/compare/v2.2.3...v2.3.0) (2020-06-30)


### Features

* **betterer ✨:** removing score mechanism from core lib ([#139](https://github.com/phenomnomnominal/betterer/issues/139)) ([145c883](https://github.com/phenomnomnominal/betterer/commit/145c8830741d9ec9d999e09b94671fc405de21c9))





## [2.2.3](https://github.com/phenomnomnominal/betterer/compare/v2.2.2...v2.2.3) (2020-06-30)

**Note:** Version bump only for package @betterer/betterer





## [2.2.2](https://github.com/phenomnomnominal/betterer/compare/v2.2.1...v2.2.2) (2020-06-29)


### Bug Fixes

* **betterer 🐛:** add new line character to the end of the generated reports file ([#135](https://github.com/phenomnomnominal/betterer/issues/135)) ([9c3e441](https://github.com/phenomnomnominal/betterer/commit/9c3e441bb4751def29e225cf5bf8ba9a6e8dca62))
* **betterer 🐛:** run git log with --no-color to prevent parsing error ([#134](https://github.com/phenomnomnominal/betterer/issues/134)) ([b1c7513](https://github.com/phenomnomnominal/betterer/commit/b1c7513cbded6a2fa492ae513777a65353796e70))





## [2.2.1](https://github.com/phenomnomnominal/betterer/compare/v2.2.0...v2.2.1) (2020-06-29)


### Bug Fixes

* **betterer 🐛:** add missing dependencies ([#132](https://github.com/phenomnomnominal/betterer/issues/132)) ([b336917](https://github.com/phenomnomnominal/betterer/commit/b336917fe1a43b14fc99cf4adf26c70fd1378b12))





# [2.2.0](https://github.com/phenomnomnominal/betterer/compare/v2.1.0...v2.2.0) (2020-06-28)


### Bug Fixes

* **extension 🐛:** fix scandir errors in VS Code extension by narrowing the globby scope ([#130](https://github.com/phenomnomnominal/betterer/issues/130)) ([4e49c63](https://github.com/phenomnomnominal/betterer/commit/4e49c639f505e03864a976ef4d8d300126b7fa53))


### Features

* **betterer ✨:** add `reporters` config option and `--reporter` flag ([#129](https://github.com/phenomnomnominal/betterer/issues/129)) ([784b2fa](https://github.com/phenomnomnominal/betterer/commit/784b2fa515e4801e365906e70c3926ea94d976e4))
* **betterer ✨:** create per contributor score from git history of result file ([#131](https://github.com/phenomnomnominal/betterer/issues/131)) ([bc288c4](https://github.com/phenomnomnominal/betterer/commit/bc288c4eacb6f7cdc37580f430287a39ae7a4ad0))
* **logger ✨:** add `silent` config option and `--silent` flag ([#127](https://github.com/phenomnomnominal/betterer/issues/127)) ([816fe34](https://github.com/phenomnomnominal/betterer/commit/816fe34c888096c1c967705f4855a44851a30b4a))





## [2.0.2](https://github.com/phenomnomnominal/betterer/compare/v2.0.1...v2.0.2) (2020-06-24)


### Bug Fixes

* **betterer 🐛:** use globby for gitignore handling ([#122](https://github.com/phenomnomnominal/betterer/issues/122)) ([d540d6c](https://github.com/phenomnomnominal/betterer/commit/d540d6c67e92dcd6ffcce4b662b4cd6436125353))





## [2.0.1](https://github.com/phenomnomnominal/betterer/compare/v2.0.0...v2.0.1) (2020-06-24)

**Note:** Version bump only for package @betterer/betterer





# [2.0.0](https://github.com/phenomnomnominal/betterer/compare/v1.2.1...v2.0.0) (2020-06-23)


### Features

* **betterer :sparkles::** respect includes, excludes and ignore files better ([8497e81](https://github.com/phenomnomnominal/betterer/commit/8497e812aa85f46ff8e24b65bc2107c1ab71c441))


### BREAKING CHANGES

* **betterer :sparkles::** Changes to the BettererFileTest API
