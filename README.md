# cherrypick-warnings-to-errors-webpack-plugin
A webpack plugin that allows users to choose from which warnings should be shown as errors.

## Installation

>  Webpack 2.2.0-rc or above version is required to use this plugin.

```
$ npm i -D cherrypick-warnings-to-errors-webpack-plugin
# or 
$ yarn add -D cherrypick-warnings-to-errors-webpack-plugin
```

## Usage
```
const CherryPickWarningsToErrorsWebpackPlugin = require('cherrypick-warnings-to-errors-webpack-plugin');
...

plugins: [
    new CherryPickWarningsToErrorsWebpackPlugin({
        warningsToConvert: ["WARN pattern in string you want to convert to ERROR"],
        exclude: [/WARN pattern in RegEx/, new RegExp("enter a WARN pattern to exclude "), "a string type can be used in the same array as well"]
    })
],

```

### `warningsToConvert`
An optional field used to convert matching WARN logs to ERROR logs. You can use both string (`""`) type pattern and RegEx type (`new RedgExp()`, `/.../`)pattern in the array. 

### `exclude`
An optional field used to filter out WARN webpack logs specified by the user. You can use both string (`""`) type pattern and RegEx type (`new RedgExp()`, `/.../`)pattern in the array. 
