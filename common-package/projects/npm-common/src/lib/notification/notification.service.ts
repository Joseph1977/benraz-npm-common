import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { NotificationComponent } from './notification.component';
import { NotificationDialogComponent, NotificationDialogType } from './notification-dialog.component';

export const NOTIFICATION_DURATION = new InjectionToken<number>('RENTIGO_COMMON_NOTIFICATION_DURATION');

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private readonly DEFAULT_NOTIFICATION_DURATION: number = 3000;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Optional()
    @Inject(NOTIFICATION_DURATION)
    notificationDuration: number) {
    this.DEFAULT_NOTIFICATION_DURATION = notificationDuration || this.DEFAULT_NOTIFICATION_DURATION;
  }

  notify(message: string, duration?: number) {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: message,
      duration: duration || this.DEFAULT_NOTIFICATION_DURATION
    });
  }

  success(message: string, duration?: number) {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: message,
      panelClass: ['bg-success', 'text-white'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
      politeness: 'polite',
      duration: duration || this.DEFAULT_NOTIFICATION_DURATION
    });
  }

  error(error: any, duration?: number) {
    const message = this.getErrorMessage(error);
    this.snackBar.openFromComponent(NotificationComponent, {
      data: message,
      panelClass: ['bg-danger', 'text-white'],
      horizontalPosition: 'right',
      verticalPosition: 'top',
      politeness: 'polite',
      duration: duration || this.DEFAULT_NOTIFICATION_DURATION
    });
  }

  notifyDialog(message: string, notificationType = NotificationDialogType.information, titleMessage: string = ''): Observable<void> {
    const dialogRef = this.dialog.open(NotificationDialogComponent, { data: { message, notificationType, titleMessage } });
    return dialogRef.afterClosed();
  }

  private getErrorMessage(error: any) {
    if (!error) {
      return null;
    }

    if (this.isProperMessage(error)) {
      return error;
    }

    const httpErrorResponse = error as HttpErrorResponse;
    if (httpErrorResponse.status === 403) {
      return 'Access denied';
    }

    if (httpErrorResponse.error) {
      if (this.isProperMessage(httpErrorResponse.error)) {
        return httpErrorResponse.error;
      }

      const message = httpErrorResponse.error?.Message || httpErrorResponse.error?.message;
      if (this.isProperMessage(message)) {
        return message;
      }
    }

    if (this.isProperMessage(httpErrorResponse.statusText)) {
      return httpErrorResponse.statusText;
    }

    return 'Unknown error';
  }

  private isProperMessage(value: any): boolean {
    return value && typeof value === 'string';
  }
}
