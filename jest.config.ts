module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    testEnvironment: 'jsdom',
    resetMocks: false,
    coverageReporters: ['json-summary', 'text', 'lcov'],
};
