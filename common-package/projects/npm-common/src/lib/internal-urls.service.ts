import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { EnvironmentsService } from './environments.service';

export class InternalUrlsServiceConfig {
  apiBaseUrl: string;
  authorizationUrl: string;
  autoDetermineInternalUrls?: boolean;
}

@Injectable()
export class InternalUrlsService {
  private static readonly APPLICATION_NAME_POSITION = 3;

  private readonly environmentName: string;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private environmentsService: EnvironmentsService,
    private config: InternalUrlsServiceConfig) {
    this.environmentName = this.environmentsService.getEnvironmentNameByHostname(this.document.location.hostname);
  }

  public getApiBaseUrl(): string {
    return this.getUrl(this.config.apiBaseUrl, true);
  }

  public getAuthorizationUrl(): string {
    return this.getUrl(this.config.authorizationUrl, false);
  }

  public getCustomUrl(initialUrl: string): string {
    return this.getUrl(initialUrl, false);
  }

  private getUrl(initialUrl: string, isK8s: boolean) {
    if (!this.environmentName || !this.config.autoDetermineInternalUrls || !initialUrl) {
      return initialUrl;
    }

    const applicationNameParts = initialUrl.split('.');
    if (applicationNameParts.length < InternalUrlsService.APPLICATION_NAME_POSITION) {
      return initialUrl;
    }

    const applicationName =
      applicationNameParts[applicationNameParts.length - InternalUrlsService.APPLICATION_NAME_POSITION];
    if (!applicationName) {
      return initialUrl;
    }

    if (!isK8s) {
      const url = initialUrl.replace(
        `${applicationName}.`,
        `${applicationName}-${this.environmentName}.`);

      return url;
    }

    const protocol = new URL(initialUrl).protocol;
    return initialUrl.replace(
      `${applicationName}.`,
      `${protocol}//${this.environmentName}.`);
  }
}
