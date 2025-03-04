const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  // etc...
};

module.exports = createJestConfig(customJestConfig);