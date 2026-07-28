export default {
  extends: ["@commitlint/config-conventional"],

  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "perf",
        "style",
        "test",
        "docs",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],

    "type-case": [2, "always", "lower-case"],
    "scope-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "header-max-length": [2, "always", 100],
  },
};
