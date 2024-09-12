import { Injectable } from '@angular/core';
import { GoogleMapsAddress } from './google-maps.model';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  constructor() { }

  getAddress(autocompleteResult: any): GoogleMapsAddress {
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

  private extractAddressComponentValue(placeResult, type: string): string {
    if (!placeResult?.address_components) {
      return null;
    }

    const component = placeResult.address_components.find(x => x.types.some(y => y === type));
    return component?.short_name;
  }
}
