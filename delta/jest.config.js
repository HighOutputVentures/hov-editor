module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testEnvironment: 'jsdom',
  testMatch: [ "**/__tests__/**/*.test.ts", "**/*.test.ts" ],
  bail: 1,
  verbose: true,
  maxWorkers: '75%',
  testTimeout: 100000,
};
