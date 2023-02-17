module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },
  coverageDirectory: "coverage/jest",
  testEnvironment: "jsdom",
  testMatch: [
    "**/__tests__/**/*.spec.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],
  testPathIgnorePatterns: ["\\\\node_modules\\\\", "<rootDir>/e2e/"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  moduleNameMapper: {
    "^@weather/(.*)": "<rootDir>/src/$1",
  },
};
