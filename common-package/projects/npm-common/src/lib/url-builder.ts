import { HttpParams } from "@angular/common/http";
import { Params } from "@angular/router";

export class UrlBuilder {
  baseUrl: string;
  urlSegments: string[];
  queryParams;

  constructor() {
    this.urlSegments = [];
    this.queryParams = {};
  }

  addBaseUrl(baseUrl: string): UrlBuilder {
    this.baseUrl = baseUrl;
    return this;
  }

  addUrlSegment(segment: string): UrlBuilder {
    if (segment) {
      if (segment.startsWith('/')) {
        segment = segment.slice(1);
      }
      this.urlSegments.push(segment);
    }

    return this;
  }

  addQueryParameter(key: string, value: string): UrlBuilder {
    if (value) {
      this.queryParams[key] = value;
    }

    return this;
  }

  addQueryParameters(queryParameters: Params): UrlBuilder {
    if (queryParameters) {
      Object.entries(queryParameters).forEach(
        ([key, value]) => this.queryParams[key] = value
      );
    }

    return this;
  }

  toString(): string {
    let url = this.baseUrl;
    if (!url) {
      return null;
    }

    const urlSegment = this.urlSegments.join('/');
    if (urlSegment) {
      if (!url.endsWith('/')) {
        url += '/';
      }
      url += urlSegment;
    }

    let params = new HttpParams();
    Object.keys(this.queryParams).forEach(key => params = params.set(key, this.queryParams[key]));
    if (params) {
      url += `?${params.toString()}`;
    }

    return url;
  }
}
