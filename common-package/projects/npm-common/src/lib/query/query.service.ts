import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  getQueryFromUrl(): any {
    const query = {};

    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => query[key] = value);

    return query;
  }

  applyQueryToUrl(query: any) {
    let test: Params = null;
    const params = new URLSearchParams();

    Object.keys(query).forEach((key) => {
      params.append(key, query[key]);
    });

    history.pushState(null, '', window.location.pathname + '?' + params.toString());
  }
}
