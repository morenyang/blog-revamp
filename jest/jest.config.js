module.exports = {
  rootDir: '../',
  transform: {
    '^.+\\.js?$': '<rootDir>/jest/jest-preprocess.js',
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)(test|spec).js'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/jest/mocks/file-mock.js`,
  },
  testPathIgnorePatterns: [`node_modules`, `.cache`, `public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/jest/loadershim.js`],
  setupFilesAfterEnv: ['<rootDir>/jest/jest.setup.js'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/common/**', '<rootDir>/src/**'],
}
