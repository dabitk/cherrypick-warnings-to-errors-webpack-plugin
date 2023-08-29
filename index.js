class CherryPickWarningsToErrorsWebpackPlugin {
    constructor(options) {
        this.warningsToConvert = options?.warningsToConvert || [];
        this.exclude = options?.exclude || [];
      }

  apply(compiler) {
    if ('hooks' in compiler) {
      // For webpack v4+
      compiler.hooks.shouldEmit.tap('CherryPickWarningsToErrorsWebpackPlugin', (compilation) => {
        this.handleHook(this.warningsToConvert, compilation);
      });
    } else {
      // For webpack v2, v3
      compiler.plugin('should-emit', (compilation) => this.handleHook(this.warningsToConvert, compilation));
    }
  }

  normalizeInputsToPredicate(convertTargets) {
    return convertTargets.map((convertTarget) => {
        switch (typeof convertTarget) {
            case 'string':
                return (warning) => warning.message.includes(convertTarget);
            case 'object': {
                if (convertTarget instanceof RegExp) {
                    return (warning) => convertTarget.test(warning.message);
                } 
            }
            default:
                return convertTarget;
        }
    });
  }

  filterWarningsAndConvertToErrors(allWarnings, compilation) {
    const targetWarnings = this.normalizeInputsToPredicate(this.warningsToConvert);
    return allWarnings.filter(warning => targetWarnings.some(isConvertTarget => isConvertTarget(warning, compilation)));
  }

  excludeWarnings(allWarnings, compilation) {
    const targetWarnings = this.normalizeInputsToPredicate(this.exclude);
    return allWarnings.filter(warning => !targetWarnings.some(isWarningsToInclude => isWarningsToInclude(warning, compilation)));
  }

  handleHook(warningsToConvert, compilation) {

    if (compilation.warnings.length > 0) {
      const filteredWarnings = this.excludeWarnings(compilation.warnings, compilation);
      const convertedErrors = this.filterWarningsAndConvertToErrors(filteredWarnings, compilation);
      const convertedErrorSet = new Set(convertedErrors); //array to Set conversion is a time-complexity of O(n)
      compilation.errors = compilation.errors.concat(convertedErrors);
      compilation.warnings = filteredWarnings.filter((warnings) => !convertedErrorSet.has(warnings)); //and with Set, lookup operation has a time-complexity of O(1)
    }

    compilation.children.forEach((child) => {
      if (child.warnings.length > 0) {
        const filteredWarnings = this.excludeWarnings(child.warnings, compilation);
        const convertedErrors = this.filterWarningsAndConvertToErrors(filteredWarnings, compilation);
        const convertedErrorSet = new Set(convertedErrors);
        child.errors = child.errors.concat(convertedErrors);
        child.warnings = filteredWarnings.filter((warnings) => !convertedErrorSet.has(warnings));
      }
    });
  }

}

module.exports = CherryPickWarningsToErrorsWebpackPlugin;
