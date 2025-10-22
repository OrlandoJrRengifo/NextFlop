export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/*.spec.ts", "**/*.test.ts"],
  collectCoverage: false,
};
