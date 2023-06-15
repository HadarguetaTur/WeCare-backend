import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testMatch: ['<rootDir>/src/**/test/*.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/test/*.ts?(x)', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1
    }
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {
    '@auth/(.*)': ['<rootDir>/src/api/auth/$1'],
    '@user/(.*)': ['<rootDir>/src/api/user/$1'],
    '@post/(.*)': ['<rootDir>/src/api/post/$1'],
    '@reaction/(.*)': ['<rootDir>/src/api/reactions/$1'],
    '@comment/(.*)': ['<rootDir>/src/api/comments/$1'],
    '@follower/(.*)': ['<rootDir>/src/api/followers/$1'],
    '@notification/(.*)': ['<rootDir>/src/api/notificartions/$1'],
    '@image/(.*)': ['<rootDir>/src/api/images/$1'],
    '@chat/(.*)': ['<rootDir>/src/api/chat/$1'],
    '@utils/(.*)': ['<rootDir>/src/utils/$1'],
    '@service/(.*)': ['<rootDir>/src/services/$1'],
    '@socket/(.*)': ['<rootDir>/src/sockets/$1'],
    '@worker/(.*)': ['<rootDir>/src/workers/$1'],
    '@root/(.*)': ['<rootDir>/src/$1'],
  }
};

export default config;
