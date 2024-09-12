export class QueryConfig {
  [key: string]: QueryParameterConfig;
}

export class QueryParameterConfig {
  type?: QueryParameterType;
  isEasternTime?: boolean;
  addDay?: number;
}

export enum QueryParameterType {
  date = 1
}
