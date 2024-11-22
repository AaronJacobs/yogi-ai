export default {
  transform: { '^.+\\.jsx?$': 'babel-jest' },
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/*.config.js',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/client/index.js',
  ],
};
