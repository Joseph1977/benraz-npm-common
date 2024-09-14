import { Injectable } from '@angular/core';

export class EnvironmentsServiceConfig {
  companySubdomain: string | undefined;
}

@Injectable()
export class EnvironmentsService {
  constructor(private config: EnvironmentsServiceConfig) {
  }

  public getEnvironmentNameByUrl(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      return this.getEnvironmentNameByHostname(hostname);
    } catch (e) {
      return '';
    }
  }

  public getEnvironmentNameByHostname(hostname: string): string {
    if (!hostname) {
      return '';
    }

    const hostnameParts = hostname.split('.');

    if (hostnameParts.length >= 1 && hostnameParts[0] === 'www') {
      hostnameParts.splice(0, 1);
    }
    if (hostnameParts.length < 3 || hostnameParts[hostnameParts.length - 2] !== this.config.companySubdomain) {
      return '';
    }

    const environmentNameSection = hostnameParts[hostnameParts.length - 3];
    const environmentNameSectionParts = environmentNameSection.split('-');
    if (environmentNameSectionParts.length < 2) {
      return '';
    }

    return environmentNameSectionParts[environmentNameSectionParts.length - 1];
  }
}
