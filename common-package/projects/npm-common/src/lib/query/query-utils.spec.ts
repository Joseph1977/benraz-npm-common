import { DateUtils } from '../date-utils';
import { QueryConfig, QueryParameterType } from './query.model';
import { QueryUtils } from './query-utils';

const DEFAULT_DATE_STRING = '2021-08-04';
const DEFAULT_DATE = DateUtils.addUTOffset(new Date(DEFAULT_DATE_STRING));
const DEFAULT_UTC_DATE = new Date(DEFAULT_DATE);

describe('QueryUtils#toUrlQuery', () => {
  it('Should create correct query without config', () => {
    const query = {
      text: 'text001',
      number: 100,
      boolean: true,
      date: DEFAULT_DATE
    };

    const urlQuery = QueryUtils.toUrlQuery(query);

    const expectedUrlQuery = { ...query };
    expect(urlQuery).toEqual(expectedUrlQuery);
  });

  it('Should create correct query with config', () => {
    const query = {
      text: 'text001',
      number: 100,
      boolean: true,
      localDate: DEFAULT_DATE,
      localDateWithShift: DEFAULT_DATE,
      easternDate: DEFAULT_DATE,
      easternDateWithShift: DEFAULT_DATE,
      nullDate: null
    };

    const config = {
      localDate: { type: QueryParameterType.date, isEasternTime: false },
      localDateWithShift: { type: QueryParameterType.date, isEasternTime: false, addDay: 1 },
      easternDate: { type: QueryParameterType.date, isEasternTime: true },
      easternDateWithShift: { type: QueryParameterType.date, isEasternTime: true, addDay: 1 },
      nullDate: { type: QueryParameterType.date }
    } as QueryConfig;

    const urlQuery = QueryUtils.toUrlQuery(query, config);

    const expectedUrlQuery = {
      ...query,
      localDate: DEFAULT_DATE_STRING,
      localDateWithShift: DEFAULT_DATE_STRING,
      easternDate: DEFAULT_DATE_STRING,
      easternDateWithShift: DEFAULT_DATE_STRING,
    };
    delete expectedUrlQuery.nullDate;

    expect(urlQuery).toEqual(expectedUrlQuery);
  });
});

describe('QueryUtils#fromUrlQuery', () => {
  it('Should create correct query without config', () => {
    const urlQuery = {
      text: 'text001',
      number: 100,
      boolean: true,
      date: DEFAULT_DATE_STRING
    };

    const query = QueryUtils.fromUrlQuery(urlQuery);

    const expectedQuery = { ...urlQuery };
    expect(query).toEqual(expectedQuery);
  });

  it('Should create correct query with config', () => {
    const urlQuery = {
      text: 'text001',
      number: 100,
      boolean: true,
      localDate: DEFAULT_DATE_STRING,
      localDateWithShift: DEFAULT_DATE_STRING,
      easternDate: DEFAULT_DATE_STRING,
      easternDateWithShift: DEFAULT_DATE_STRING
    };

    const config = {
      localDate: { type: QueryParameterType.date, isEasternTime: false },
      localDateWithShift: { type: QueryParameterType.date, isEasternTime: false, addDay: 1 },
      easternDate: { type: QueryParameterType.date, isEasternTime: true },
      easternDateWithShift: { type: QueryParameterType.date, isEasternTime: true, addDay: 1 }
    } as QueryConfig;

    const query = QueryUtils.fromUrlQuery(urlQuery, config);

    const expectedQuery = {
      ...urlQuery,
      localDate: DEFAULT_DATE,
      localDateWithShift: DEFAULT_DATE,
      easternDate: DEFAULT_DATE,
      easternDateWithShift: DEFAULT_DATE
    };
    expect(query).toEqual(expectedQuery);
  });
});

describe('QueryUtils#toRequestQuery', () => {
  it('Should create correct query without config', () => {
    const query = {
      text: 'text001',
      number: 100,
      boolean: true,
      date: DEFAULT_DATE
    };

    const requestQuery = QueryUtils.toRequestQuery(query);

    const expectedRequestQuery = { ...query };
    expect(requestQuery).toEqual(expectedRequestQuery);
  });

  it('Should create correct query with config', () => {
    const query = {
      text: 'text001',
      number: 100,
      boolean: true,
      localDate: DEFAULT_DATE,
      localDateWithShift: DEFAULT_DATE,
      easternDate: DEFAULT_DATE,
      easternDateWithShift: DEFAULT_DATE,
      nullDate: null
    };

    const config = {
      localDate: { type: QueryParameterType.date, isEasternTime: false },
      localDateWithShift: { type: QueryParameterType.date, isEasternTime: false, addDay: 1 },
      easternDate: { type: QueryParameterType.date, isEasternTime: true },
      easternDateWithShift: { type: QueryParameterType.date, isEasternTime: true, addDay: 1 },
      nullDate: { type: QueryParameterType.date }
    } as QueryConfig;

    const requestQuery = QueryUtils.toRequestQuery(query, config);

    const expectedRequestQuery = {
      ...query,
      localDate: DEFAULT_UTC_DATE.toISOString(),
      localDateWithShift: DateUtils.addDays(DEFAULT_UTC_DATE, 1).toISOString(),
      easternDate: DateUtils.substructETOffset(DEFAULT_UTC_DATE).toISOString(),
      easternDateWithShift: DateUtils.substructETOffset(DateUtils.addDays(DEFAULT_UTC_DATE, 1)).toISOString()
    };
    delete expectedRequestQuery.nullDate;

    expect(requestQuery).toEqual(expectedRequestQuery);
  });
});
