import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let matSnackBar: MatSnackBar;

  const defaultMessage = 'Default message';
  const defaultDuration = 5000;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule
      ],
      providers: [
        NotificationService,
        { provide: MatSnackBar }
      ]
    });

    notificationService = TestBed.inject(NotificationService);
    matSnackBar = TestBed.inject(MatSnackBar);
  });

  it('#notify() from NotificationService call SnackBar openFromComponent()', () => {
    const serviceSpy = spyOn(notificationService, 'notify').and.callThrough();
    const matSnackBarSpy = spyOn(matSnackBar, 'openFromComponent');
    expect(serviceSpy).not.toHaveBeenCalled();
    expect(matSnackBarSpy).not.toHaveBeenCalled();

    notificationService.notify(defaultMessage);
    expect(serviceSpy).toHaveBeenCalledWith(defaultMessage);
    notificationService.notify(defaultMessage, defaultDuration);
    expect(serviceSpy).toHaveBeenCalledWith(defaultMessage, defaultDuration);

    expect(matSnackBarSpy).toHaveBeenCalled();

  });

  it('#success() from NotificationService call SnackBar openFromComponent()', () => {
    const serviceSpy = spyOn(notificationService, 'success').and.callThrough();
    const matSnackBarSpy = spyOn(matSnackBar, 'openFromComponent');
    expect(serviceSpy).not.toHaveBeenCalled();
    expect(matSnackBarSpy).not.toHaveBeenCalled();

    notificationService.success(defaultMessage);
    expect(serviceSpy).toHaveBeenCalledWith(defaultMessage);
    notificationService.success(defaultMessage, defaultDuration);
    expect(serviceSpy).toHaveBeenCalledWith(defaultMessage, defaultDuration);

    expect(matSnackBarSpy).toHaveBeenCalled();
  });

  it('#error() from NotificationService call SnackBar openFromComponent()', () => {
    const serviceSpy = spyOn(notificationService, 'error').and.callThrough();
    const matSnackBarSpy = spyOn(matSnackBar, 'openFromComponent');
    expect(serviceSpy).not.toHaveBeenCalled();
    expect(matSnackBarSpy).not.toHaveBeenCalled();

    notificationService.error(defaultMessage);
    expect(serviceSpy).toHaveBeenCalledWith(defaultMessage);
    notificationService.error(defaultMessage, defaultDuration);
    expect(serviceSpy).toHaveBeenCalledWith(defaultMessage, defaultDuration);

    expect(matSnackBarSpy).toHaveBeenCalled();
  });
});
