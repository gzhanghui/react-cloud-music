module.exports = {
  root: true,
  env: {
    "browser": true,
    "node": true
  },
  'extends': [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "plugins": [
    "react"
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-script-url": 0,
    'no-unused-vars': 1,
    'react/prop-types:': 0,
    'require-yield': 0
  },
  parser: 'babel-eslint'
};


