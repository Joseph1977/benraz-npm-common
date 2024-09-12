import { CommonUtils } from '../common-utils';
import { DateUtils } from '../date-utils';
import { QueryConfig, QueryParameterType } from './query.model';

// @dynamic
export class QueryUtils {
  static toUrlQuery(query, config?: QueryConfig) {
    query = { ...query };
    config = { ...config };

    this.getQueryKeys(query).forEach(key => {
      if (query[key] === null || query[key] === undefined) {
        delete query[key];
        return;
      }

      const parameterConfig = config[key];
      if (parameterConfig?.type === QueryParameterType.date) {
        query[key] = DateUtils.toIsoDateString(query[key]);
      }
    });

    return query;
  }

  static fromUrlQuery(query, config?: QueryConfig) {
    query = { ...query };
    config = { ...config };

    this.getQueryKeys(query).forEach(key => {
      const parameterConfig = config[key];
      if (parameterConfig?.type === QueryParameterType.date) {
        query[key] = DateUtils.addUTOffset(new Date(query[key]));
      }
    });

    return query;
  }

  static toRequestQuery(query, config?: QueryConfig) {
    query = { ...query };
    config = { ...config };

    this.getQueryKeys(query).forEach(key => {
      if (query[key] === null || query[key] === undefined) {
        delete query[key];
        return;
      }

      const parameterConfig = config[key];
      if (parameterConfig?.type === QueryParameterType.date) {
        let value = new Date(query[key]);
        value = DateUtils.addDays(value, parameterConfig.addDay || 0);
        if (parameterConfig.isEasternTime) {
          value = DateUtils.substructETOffset(value);
        }

        query[key] = value.toISOString();
      }
    });

    return query;
  }

  static getSortBy(sortParameters: any[], name: string, defaultKey?: any): any {
    const parameter = sortParameters.find(x => x.name === name);
    return parameter ? parameter.key : defaultKey;
  }

  static getSortActive(sortParameters: any[], key: any, defaultName?: string): string {
    const parameter = sortParameters.find(x => x.key === Number(key));
    return parameter ? parameter.name : defaultName;
  }

  static getSortDirection(sortDesc: any): any {
    sortDesc = CommonUtils.toBoolean(sortDesc);
    return sortDesc ? 'desc' : 'asc';
  }

  static getSortDesc(sortDirection: string): boolean {
    return sortDirection === 'desc';
  }

  static toDate(query: any, key: string) {
    if (query[key]) {
      query[key] = new Date(query[key]);
    }
  }

  static toIsoString(query: any, key: string) {
    if (query[key]) {
      query[key] = new Date(query[key]).toISOString();
    }
  }

  private static getQueryKeys(query): string[] {
    return Object.keys(query);
  }
}
