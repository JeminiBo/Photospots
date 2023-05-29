module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    eqeqeq: 'error',
    'no-console': 'warn',
    'react-native/sort-styles': 0,
    'react-native/split-platform-components': 0,
    'react-native/no-color-literals': 0,
    'react-native/no-raw-text': ['error', { skip: ['Animated.Text'] }],
    'react-hooks/exhaustive-deps': 0,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
