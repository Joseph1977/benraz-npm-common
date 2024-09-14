import { Inject, Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export class DialogData {
  message: string | undefined;
  titleMessage: string | undefined;
  notificationType: NotificationDialogType | undefined;
}

export enum NotificationDialogType {
  information = 1,
  error = 2,
  attention = 3,
}

@Component({
  selector: 'lib-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {
  title: string | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
    this.title = this.getTitle();
  }

  get titleClass() {
    switch (this.data?.notificationType) {
      case NotificationDialogType.attention:
        return 'attention-title';
      case NotificationDialogType.error:
        return 'error-title';
      default:
        return 'info-title';
    }
  }

  private getTitle(): string {
    if(this.data?.titleMessage) return this.data?.titleMessage;
    switch (this.data?.notificationType) {
      case NotificationDialogType.attention:
        return 'Attention';
      case NotificationDialogType.error:
        return 'Error';
      default:
        return 'Information';
    }
  }
}
