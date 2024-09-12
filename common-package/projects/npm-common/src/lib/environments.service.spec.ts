import { EnvironmentsService } from './environments.service';

describe('EnvironmentsService#getEnvironmentByUrl', () => {
  const baseTestCase = {
    companySubdomain: 'benraz',
    url: 'https://ui-env.benraz.com'
  };

  const testCases = [
    { ...baseTestCase, url: null, expected: null },
    { ...baseTestCase, url: 'ui-env.benraz.com', expected: null },
    { ...baseTestCase, url: 'https://ui.benraz.com', expected: null },
    { ...baseTestCase, url: 'https://ui-env.notbenraz.com', expected: null },
    { ...baseTestCase, url: 'https://ui-env.benraz.com', expected: 'env' },
    { ...baseTestCase, url: 'https://www.ui-env.benraz.com', expected: 'env' },
    { ...baseTestCase, url: 'https://ui-env.benraz.com/segment', expected: 'env' },
    { ...baseTestCase, url: 'http://ui-env.benraz.com', expected: 'env' },

    { ...baseTestCase, companySubdomain: null, expected: null },
    { ...baseTestCase, companySubdomain: 'benraz', expected: 'env' },
    { ...baseTestCase, companySubdomain: 'notbenraz', expected: null }
  ];

  testCases.forEach(testCase => {
    it(
      `for ${testCase.companySubdomain} subdomain and ${testCase.url} URL ` +
      `should return ${testCase.expected}`,
      () => {
        const service = new EnvironmentsService({ companySubdomain: testCase.companySubdomain });
        expect(service.getEnvironmentNameByUrl(testCase.url)).toBe(testCase.expected);
      });
  });
});

describe('EnvironmentsService#getEnvironmentByHostname', () => {
  const baseTestCase = {
    companySubdomain: 'benraz',
    hostname: 'ui-env.benraz.com'
  };

  const testCases = [
    { ...baseTestCase, hostname: null, expected: null },
    { ...baseTestCase, hostname: 'ui.benraz.com', expected: null },
    { ...baseTestCase, hostname: 'ui-env.notbenraz.com', expected: null },
    { ...baseTestCase, hostname: 'ui-env.benraz.com', expected: 'env' },
    { ...baseTestCase, hostname: 'www.ui-env.benraz.com', expected: 'env' },
    { ...baseTestCase, hostname: 'ui-env.benraz.com/segment', expected: 'env' },
    { ...baseTestCase, hostname: 'ui-env.benraz.com', expected: 'env' },

    { ...baseTestCase, companySubdomain: null, expected: null },
    { ...baseTestCase, companySubdomain: 'benraz', expected: 'env' },
    { ...baseTestCase, companySubdomain: 'notbenraz', expected: null }
  ];

  testCases.forEach(testCase => {
    it(
      `for ${testCase.companySubdomain} subdomain and ${testCase.hostname} hostname ` +
      `should return ${testCase.expected}`,
      () => {
        const service = new EnvironmentsService({ companySubdomain: testCase.companySubdomain });
        expect(service.getEnvironmentNameByHostname(testCase.hostname)).toBe(testCase.expected);
      });
  });
});
