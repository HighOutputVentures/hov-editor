module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testEnvironment: 'jsdom',
  bail: 1,
  verbose: true,
  maxWorkers: '50%',
  testTimeout: 100000,
};
