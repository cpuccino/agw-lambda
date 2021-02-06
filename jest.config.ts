const confugration = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['html', ['lcovonly', { projectRoot: __dirname }], 'text']
};

export default confugration;
