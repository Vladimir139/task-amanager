export default {
  extends: ["@commitlint/config-conventional"],

  parserPreset: {
    parserOpts: {
      headerPattern: /^([a-z]+) - (\S.*)$/,
      headerCorrespondence: ["type", "subject"],
    },
  },

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
    "type-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "header-max-length": [2, "always", 100],
  },
};
