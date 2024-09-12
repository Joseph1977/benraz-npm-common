import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EnvironmentsServiceConfig, EnvironmentsService } from './environments.service';
import { InternalUrlsServiceConfig, InternalUrlsService } from './internal-urls.service';
import { ValidationService } from './validation.service';
import { ETOffsetPipe } from './et-offset.pipe';
import { YesNoPipe } from './yesNo.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { AutofocusDirective } from './autofocus.directive';
import { NotificationService } from './notification/notification.service';
import { NotificationComponent } from './notification/notification.component';
import { NotificationDialogComponent } from './notification/notification-dialog.component';
import { ConfirmationService } from './confirmation/confirmation.service';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { SmartFilterComponent } from './smart-filter/smart-filter.component';
import { LoaderComponent } from './loader/loader.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

export class BenrazNpmCommonModuleConfig {
  apiBaseUrl: string;
  authorizationUrl: string;
  companySubdomain: string;
  autoDetermineInternalUrls?: boolean;
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
    MatCheckboxModule,
    MatMenuModule,
    MatListModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    ETOffsetPipe,
    YesNoPipe,
    SafeUrlPipe,
    NotificationComponent,
    NotificationDialogComponent,
    ConfirmationComponent,
    SmartFilterComponent,
    LoaderComponent,
    AutofocusDirective
  ],
  providers: [
    InternalUrlsService,
    ValidationService,
    NotificationService,
    ConfirmationService
  ],
  exports: [
    ETOffsetPipe,
    YesNoPipe,
    SafeUrlPipe,
    NotificationComponent,
    NotificationDialogComponent,
    ConfirmationComponent,
    SmartFilterComponent,
    LoaderComponent
  ]
})
export class BenrazNpmCommonModule {
  static forRoot(config: BenrazNpmCommonModuleConfig): ModuleWithProviders<BenrazNpmCommonModule> {
    return {
      ngModule: BenrazNpmCommonModule,
      providers: [
        EnvironmentsService,
        {
          provide: EnvironmentsServiceConfig,
          useValue: {
            companySubdomain: config?.companySubdomain
          }
        },
        {
          provide: InternalUrlsServiceConfig,
          useValue: {
            apiBaseUrl: config?.apiBaseUrl,
            authorizationUrl: config?.authorizationUrl,
            autoDetermineInternalUrls: config?.autoDetermineInternalUrls
          }
        }
      ]
    };
  }
}
