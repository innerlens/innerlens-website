export default {
  projects: [
    {
      displayName: "client",
      rootDir: "client",
      testEnvironment: "jsdom",
      testMatch: [
        // Matches anything under client/client_tests/js/**/*.test.js
        "<rootDir>/client_tests/js/**/*.test.js",
        "<rootDir>/client_tests/js/**/*.spec.js"
      ],
      moduleFileExtensions: ["js", "json"]
    },
    {
      displayName: "server",
      rootDir: ".",
      testEnvironment: "node",
      testMatch: [
        // If you have any tests in a server/ folder:
        "<rootDir>/server/**/*.test.js",
        "<rootDir>/server/**/*.spec.js",
        // And if your tests live in a top-level server_tests/ folder:
        "<rootDir>/server_tests/**/*.test.js",
        "<rootDir>/server_tests/**/*.spec.js"
      ],
      moduleFileExtensions: ["js", "json"]
    }
  ]
};


