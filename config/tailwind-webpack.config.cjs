const path = require('node:path');

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const TAILWIND_WEBPACK_LOADER = require.resolve('@tailwindcss/webpack');

function getLoaderName(useEntry) {
  if (typeof useEntry === 'string') {
    return useEntry;
  }

  if (useEntry && typeof useEntry === 'object' && typeof useEntry.loader === 'string') {
    return useEntry.loader;
  }

  return undefined;
}

function isCssOnlyRule(rule) {
  if (!(rule?.test instanceof RegExp)) {
    return false;
  }

  return (
    rule.test.test('tailwind.css') &&
    !rule.test.test('tailwind.scss') &&
    !rule.test.test('tailwind.sass') &&
    !rule.test.test('tailwind.less')
  );
}

function isTailwindPostcssPlugin(plugin) {
  return typeof plugin?.postcssPlugin === 'string' && plugin.postcssPlugin.toLowerCase().includes('tailwind');
}

function stripTailwindPostcssPlugin(postcssOptions) {
  if (!postcssOptions || !Array.isArray(postcssOptions.plugins)) {
    return postcssOptions;
  }

  return {
    ...postcssOptions,
    plugins: postcssOptions.plugins.filter((plugin) => !isTailwindPostcssPlugin(plugin)),
  };
}

function wrapPostcssOptions(useEntry) {
  if (!useEntry || typeof useEntry !== 'object' || !useEntry.options) {
    return;
  }

  const { options } = useEntry;
  const originalPostcssOptions = options.postcssOptions;

  if (!originalPostcssOptions || originalPostcssOptions.__tailwindWebpackWrapped) {
    return;
  }

  if (typeof originalPostcssOptions === 'function') {
    const wrappedPostcssOptions = (...args) => {
      const resolvedPostcssOptions = originalPostcssOptions(...args);

      if (resolvedPostcssOptions && typeof resolvedPostcssOptions.then === 'function') {
        return resolvedPostcssOptions.then(stripTailwindPostcssPlugin);
      }

      return stripTailwindPostcssPlugin(resolvedPostcssOptions);
    };

    wrappedPostcssOptions.__tailwindWebpackWrapped = true;
    options.postcssOptions = wrappedPostcssOptions;

    return;
  }

  options.postcssOptions = stripTailwindPostcssPlugin(originalPostcssOptions);
}

function patchCssRule(rule) {
  if (!Array.isArray(rule.use)) {
    return;
  }

  for (const useEntry of rule.use) {
    const loaderName = getLoaderName(useEntry);

    if (loaderName?.includes('postcss-loader')) {
      wrapPostcssOptions(useEntry);
    }
  }

  const hasTailwindWebpackLoader = rule.use.some((useEntry) =>
    getLoaderName(useEntry)?.includes('@tailwindcss/webpack'),
  );

  if (hasTailwindWebpackLoader) {
    return;
  }

  const cssLoaderIndex = rule.use.findIndex((useEntry) => getLoaderName(useEntry)?.includes('css-loader'));

  if (cssLoaderIndex === -1) {
    return;
  }

  rule.use.splice(cssLoaderIndex + 1, 0, {
    loader: TAILWIND_WEBPACK_LOADER,
    options: {
      base: WORKSPACE_ROOT,
    },
  });
}

function visitRules(rules) {
  for (const rule of rules) {
    if (!rule || typeof rule !== 'object') {
      continue;
    }

    if (Array.isArray(rule.rules)) {
      visitRules(rule.rules);
    }

    if (Array.isArray(rule.oneOf)) {
      visitRules(rule.oneOf);
    }

    if (isCssOnlyRule(rule)) {
      patchCssRule(rule);
    }
  }
}

module.exports = (config) => {
  if (Array.isArray(config?.module?.rules)) {
    visitRules(config.module.rules);
  }

  return config;
};
