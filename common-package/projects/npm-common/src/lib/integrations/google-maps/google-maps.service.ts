import { Injectable } from '@angular/core';
import { GoogleMapsAddress } from './google-maps.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  constructor() { }

  getAddress(autocompleteResult: any): GoogleMapsAddress | null {
    if (!autocompleteResult?.address_components) {
      return null;
    }

    const adress: GoogleMapsAddress = {
      address: this.extractAddressComponentValue(autocompleteResult, 'route'),
      houseNumber: this.extractAddressComponentValue(autocompleteResult, 'street_number'),
      state: this.extractAddressComponentValue(autocompleteResult, 'administrative_area_level_1'),
      zipCode: this.extractAddressComponentValue(autocompleteResult, 'postal_code'),
      country: this.extractAddressComponentValue(autocompleteResult, 'country'),
      city: this.extractAddressComponentValue(autocompleteResult, 'locality') ||
        this.extractAddressComponentValue(autocompleteResult, 'sublocality') ||
        this.extractAddressComponentValue(autocompleteResult, 'neighborhood') ||
        this.extractAddressComponentValue(autocompleteResult, 'administrative_area_level_3')
    };

    return adress;
  }

  private extractAddressComponentValue(placeResult: any, type: string): string {
    if (!placeResult || !placeResult.address_components) {
      return '';
    }

    const component = placeResult.address_components.find((x: any) => x.types.some((y: string) => y === type));
    return component ? component.long_name : '';
  }
}
