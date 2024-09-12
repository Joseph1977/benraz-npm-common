import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { EnvironmentsService } from './environments.service';
import { InternalUrlsService } from './internal-urls.service';

describe('InternalUrlsService#getApiBaseUrl', () => {
  const baseTestCase = {
    autoDetermineInternalUrls: true,
    apiBaseUrl: 'api.benraz.com',
    environmentName: 'env'
  };

  const testCases = [
    { ...baseTestCase, autoDetermineInternalUrls: null, expected: 'api.benraz.com' },
    { ...baseTestCase, autoDetermineInternalUrls: false, expected: 'api.benraz.com' },

    { ...baseTestCase, apiBaseUrl: null, expected: null },
    { ...baseTestCase, apiBaseUrl: 'com', expected: 'com' },
    { ...baseTestCase, apiBaseUrl: 'benraz.com', expected: 'benraz.com' },
    { ...baseTestCase, apiBaseUrl: 'api.benraz.com', expected: 'api-env.benraz.com' },
    { ...baseTestCase, apiBaseUrl: 'api-env.benraz.com', expected: 'api-env-env.benraz.com' },
    { ...baseTestCase, apiBaseUrl: 'api.notbenraz.com', expected: 'api-env.notbenraz.com' },
    { ...baseTestCase, apiBaseUrl: 'www.api.benraz.com', expected: 'www.api-env.benraz.com' },

    { ...baseTestCase, environmentName: null, expected: 'api.benraz.com' },
    { ...baseTestCase, environmentName: 'devenv', expected: 'api-devenv.benraz.com' }
  ];

  testCases.forEach(testCase => {
    it(
      `for auto: ${testCase.autoDetermineInternalUrls}, ` +
      `api: ${testCase.apiBaseUrl}, ` +
      `environment: ${testCase.environmentName} ` +
      `should return ${testCase.expected}`,
      () => {
        const environmentsService = new EnvironmentsService(undefined);
        environmentsService.getEnvironmentNameByHostname = x => testCase.environmentName;

        const config = {
          autoDetermineInternalUrls: testCase.autoDetermineInternalUrls,
          apiBaseUrl: testCase.apiBaseUrl,
          authorizationUrl: null,
        };

        const service = new InternalUrlsService(TestBed.inject(DOCUMENT), environmentsService, config);

        expect(service.getApiBaseUrl()).toBe(testCase.expected);
      });
  });
});

describe('InternalUrlsService#getAuthorizationUrl', () => {
  const baseTestCase = {
    autoDetermineInternalUrls: true,
    authorizationUrl: 'authapi.benraz.com',
    environmentName: 'env'
  };

  const testCases = [
    { ...baseTestCase, autoDetermineInternalUrls: null, expected: 'authapi.benraz.com' },
    { ...baseTestCase, autoDetermineInternalUrls: false, expected: 'authapi.benraz.com' },

    { ...baseTestCase, authorizationUrl: null, expected: null },
    { ...baseTestCase, authorizationUrl: 'com', expected: 'com' },
    { ...baseTestCase, authorizationUrl: 'benraz.com', expected: 'benraz.com' },
    { ...baseTestCase, authorizationUrl: 'authapi.benraz.com', expected: 'authapi-env.benraz.com' },
    { ...baseTestCase, authorizationUrl: 'authapi-env.benraz.com', expected: 'authapi-env-env.benraz.com' },
    { ...baseTestCase, authorizationUrl: 'authapi.notbenraz.com', expected: 'authapi-env.notbenraz.com' },
    { ...baseTestCase, authorizationUrl: 'www.authapi.benraz.com', expected: 'www.authapi-env.benraz.com' },

    { ...baseTestCase, environmentName: null, expected: 'authapi.benraz.com' },
    { ...baseTestCase, environmentName: 'devenv', expected: 'authapi-devenv.benraz.com' }
  ];

  testCases.forEach(testCase => {
    it(
      `for auto: ${testCase.autoDetermineInternalUrls}, ` +
      `auth api: ${testCase.authorizationUrl}, ` +
      `environment: ${testCase.environmentName} ` +
      `should return ${testCase.expected}`,
      () => {
        const environmentsService = new EnvironmentsService(undefined);
        environmentsService.getEnvironmentNameByHostname = x => testCase.environmentName;

        const config = {
          autoDetermineInternalUrls: testCase.autoDetermineInternalUrls,
          apiBaseUrl: null,
          authorizationUrl: testCase.authorizationUrl,
        };

        const service = new InternalUrlsService(TestBed.inject(DOCUMENT), environmentsService, config);

        expect(service.getAuthorizationUrl()).toBe(testCase.expected);
      });
  });
});

describe('InternalUrlsService#getCustomUrl', () => {
  const baseTestCase = {
    autoDetermineInternalUrls: true,
    customUrl: 'customapi.benraz.com',
    environmentName: 'env'
  };

  const testCases = [
    { ...baseTestCase, autoDetermineInternalUrls: null, expected: 'customapi.benraz.com' },
    { ...baseTestCase, autoDetermineInternalUrls: false, expected: 'customapi.benraz.com' },

    { ...baseTestCase, customUrl: null, expected: null },
    { ...baseTestCase, customUrl: 'com', expected: 'com' },
    { ...baseTestCase, customUrl: 'benraz.com', expected: 'benraz.com' },
    { ...baseTestCase, customUrl: 'customapi.benraz.com', expected: 'customapi-env.benraz.com' },
    { ...baseTestCase, customUrl: 'customapi-env.benraz.com', expected: 'customapi-env-env.benraz.com' },
    { ...baseTestCase, customUrl: 'customapi.notbenraz.com', expected: 'customapi-env.notbenraz.com' },
    { ...baseTestCase, customUrl: 'www.customapi.benraz.com', expected: 'www.customapi-env.benraz.com' },

    { ...baseTestCase, environmentName: null, expected: 'customapi.benraz.com' },
    { ...baseTestCase, environmentName: 'devenv', expected: 'customapi-devenv.benraz.com' }
  ];

  testCases.forEach(testCase => {
    it(
      `for auto: ${testCase.autoDetermineInternalUrls}, ` +
      `custom api: ${testCase.customUrl}, ` +
      `environment: ${testCase.environmentName} ` +
      `should return ${testCase.expected}`,
      () => {
        const environmentsService = new EnvironmentsService(undefined);
        environmentsService.getEnvironmentNameByHostname = x => testCase.environmentName;

        const config = {
          autoDetermineInternalUrls: testCase.autoDetermineInternalUrls,
          apiBaseUrl: null,
          authorizationUrl: null,
        };

        const service = new InternalUrlsService(TestBed.inject(DOCUMENT), environmentsService, config);

        expect(service.getCustomUrl(testCase.customUrl)).toBe(testCase.expected);
      });
  });
});
