/**
 *   commit type 类型说明：
 *
 *   feat：新功能（feature）
 *   fix：修补bug
 *   docs：文档（documentation）
 *   style： 样式，格式方面的优化
 *   refactor：重构
 *   test：测试
 *   chore：构建过程或辅助工具的变动.
 *
 */
const types = ["feat", "fix", "docs", "style", "refactor", "test", "chore"];

// 配置规则文档: https://commitlint.js.org/#/reference-rules.
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", types],
    "type-case": [0],
    "type-empty": [0],
    "scope-empty": [0],
    "scope-case": [0],
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"],
    "header-max-length": [0, "always", 72],
  },
};
