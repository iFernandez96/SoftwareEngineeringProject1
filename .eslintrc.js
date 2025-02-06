module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
  ],
  parser: "babel-eslint", // or another parser if needed
  plugins: ["react", "react-native"],
  rules: {
    // Your custom rules
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
