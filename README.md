# rx-completable

Reactive Extensions - represents a deferred computation without any value but only indication for completion or exception. 

[![NPM](https://nodei.co/npm/rx-completable.png)](https://nodei.co/npm/rx-completable/)

[![](https://data.jsdelivr.com/v1/package/npm/rx-completable/badge)](https://www.jsdelivr.com/package/npm/rx-completable)
[![HitCount](http://hits.dwyl.io/lxsmnsyc/rx-completable.svg)](http://hits.dwyl.io/lxsmnsyc/rx-completable)

| Platform | Build Status |
| --- | --- |
| Linux | [![Build Status](https://travis-ci.org/LXSMNSYC/rx-completable.svg?branch=master)](https://travis-ci.org/LXSMNSYC/rx-completable) |
| Windows | [![Build status](https://ci.appveyor.com/api/projects/status/mkjwe462uk80axx4?svg=true)](https://ci.appveyor.com/project/LXSMNSYC/rx-completable) |


[![codecov](https://codecov.io/gh/LXSMNSYC/rx-completable/branch/master/graph/badge.svg)](https://codecov.io/gh/LXSMNSYC/rx-completable)
[![Known Vulnerabilities](https://snyk.io/test/github/LXSMNSYC/rx-completable/badge.svg?targetFile=package.json)](https://snyk.io/test/github/LXSMNSYC/rx-completable?targetFile=package.json)

## Install

NPM

```bash
npm i rx-completable
```

CDN

* jsDelivr
```html
<script src="https://cdn.jsdelivr.net/npm/rx-completable/dist/index.min.js"></script>
```

* unpkg
```html
<script src="https://unpkg.com/rx-completable/dist/index.min.js"></script>
```

## Usage

### Loading the module

#### CommonJS

```js
const Completable = require('rx-completable');
```

Loading the CommonJS module provides the Completable class.

#### Browser

Loading the JavaScript file for the rx-completable provides the Completable class

## Documentation

You can read the documentation at the [official doc site](https://lxsmnsyc.github.io/rx-completable/)

## Build

Clone the repo first, then run the following to install the dependencies

```bash
npm install
```

To build the coverages, run the test suite, the docs, and the distributable modules:

```bash
npm run build
```