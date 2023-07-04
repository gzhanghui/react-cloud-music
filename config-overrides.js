const { override, useEslintRc, addLessLoader, fixBabelImports, addWebpackAlias } = require("customize-cra");
const { getThemeVariables } = require("antd/dist/theme");
const path = require("path");
const resolve = (dir) => path.resolve(__dirname, dir);

const useEslintConfig = (configRules) => (config) => {
  const updatedRules = config.module.rules.map((rule) => {
    // Only target rules that have defined a `useEslintrc` parameter in their options
    if (rule.use && rule.use.some((use) => use.options && use.options.useEslintrc !== void 0)) {
      const ruleUse = rule.use[0];
      const baseOptions = ruleUse.options;
      const baseConfig = baseOptions.baseConfig || {};
      const newOptions = {
        useEslintrc: false,
        ignore: true,
        baseConfig: { ...baseConfig, ...configRules },
      };
      ruleUse.options = newOptions;
      return rule;

      // Rule not using eslint. Do not modify.
    } else {
      return rule;
    }
  });

  config.module.rules = updatedRules;
  return config;
};

const customTheme = {
  "@primary-color": "#0BBD70",
  "@font-family": "PingFangSC-Regular, -apple-system, Helvetica, Arial, 'Microsoft Yahei', sans-serif;",
  "@text-color": "hsla(0, 0%, 100%, 0.5)",
  "@text-color-secondary": "hsla(0, 0%, 100%, 0.7)",
  "@header-color": "hsla(0,0%,100%,0.9)",
  "@text-color-active": "#FFF",
  "@tabs-horizontal-padding": "12px 2px",
  "@border-color-split": "hsla(0, 0%, 100%, 0.04)",
  "@border-width-base": "1px", // width of the border for a component
  "@border-style-base": "solid",
  "@table-row-hover-bg": "hsla(0, 0%, 0%, 0.08)",
  "@table-header-bg": "hsla(0, 0%, 0%, 0)",
  "@component-background": "#14161a",
  "@font-size-base": "14px",
  "@card-background": "transparent",
  "@card-head-font-size": "@font-size-lg",
};
const themeVar = getThemeVariables({
  dark: true, // 开启暗黑模式
  compact: true, // 开启紧凑模式
});
module.exports = {
  webpack: override(
    useEslintConfig(require("./.eslintrc.js")),
    useEslintRc(),

    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true,
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: Object.assign(themeVar, customTheme),
    }),
    addWebpackAlias({ "@": resolve("src") })
  ),

  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.proxy = {
        "/api": {
          target: "http://localhost:10010",
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            "^/api": "",
          },
        },
      };
      config.before = function () {};
      return config;
    };
  },
  jest: function override(config) {
    return config;
  },
};
