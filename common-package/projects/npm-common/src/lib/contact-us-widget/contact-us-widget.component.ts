import {
  Component,
  Input,
  inject,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonPosition, ContactUsWidgetConfig, FormType, WidgetConfigApiRequest, WidgetConfigApiResponse } from './contact-us-widget.config';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contact-us-widget',
  templateUrl: './contact-us-widget.component.html',
  styleUrls: ['./contact-us-widget.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContactUsWidgetComponent implements OnDestroy {
  @Input() config!: ContactUsWidgetConfig;

  form!: FormGroup;
  formStep1!: FormGroup;
  formStep2!: FormGroup;
  isOpen = false;
  submitting = false;
  currentUrl = '';
  selectedFormType: FormType | null = null;
  formType = FormType;
  currentFormSubjects: string[] = [];
  isSubmittedResponse: { type: FormType | null; status: boolean } = {
    type: null,
    status: false,
  };
  buttonPositions = ButtonPosition;
  private destroy$ = new Subject<void>();

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
  }

  toggleModal(): void {
    this.isOpen = !this.isOpen;
  }

  get activeForms() {
    return this.config.forms?.filter((f) => f.isActive) || [];
  }

  selectFormType(type: FormType) {
    this.selectedFormType = type;

    let step1Fields: string[] = [];
    let step2Fields: string[] = [];

    if (type === FormType.LeaveAMessage) {
      step1Fields = ['name', 'email'];
      step2Fields = ['subject', 'message'];
    } else if (type === FormType.ReportBug) {
      step1Fields = ['subject', 'message'];
      step2Fields = ['name', 'email'];
    } else if (type === FormType.ShareFeedback) {
      step1Fields = ['subject', 'message'];
      step2Fields = ['name', 'email'];
    }

    // Build form before assigning subjects
    this.buildStepperForms(step1Fields, step2Fields);

    // Fetch and set subjects properly
    const form = this.config.forms?.find((f) => f.type === type);
    this.currentFormSubjects = Array.isArray(form?.subjects)
      ? [...form!.subjects]
      : [];

    // Force UI refresh
    this.cdr.detectChanges();
  }

  backToTypeSelection() {
    this.selectedFormType = null;
    this.form.reset();
  }

  buildStepperForms(step1Fields: string[], step2Fields: string[]) {
    const group1: any = {};
    const group2: any = {};

    const createField = (field: string) => {
      switch (field) {
        case 'subject':
          return ['', Validators.required];
        case 'message':
          return ['', Validators.required];
        case 'name':
          return [
            {
              value: this.config.userFullName || '',
              disabled: !!this.config.userFullName,
            },
            Validators.required,
          ];
        case 'email':
          return [
            {
              value: this.config.email || '',
              disabled: !!this.config.email,
            },
            [Validators.required, Validators.email],
          ];
        default:
          return [];
      }
    };

    // Only add fields that are actually assigned to each step
    step1Fields.forEach((f) => (group1[f] = createField(f)));
    step2Fields.forEach((f) => (group2[f] = createField(f)));

    this.formStep1 = this.fb.group(group1);
    this.formStep2 = this.fb.group(group2);

    // Create the main form with all controls from both steps
    const allControls: any = {};
    [...step1Fields, ...step2Fields].forEach(field => {
      allControls[field] = createField(field);
    });

    this.form = this.fb.group(allControls);

    // Sync values between step forms and main form
    this.syncFormValues();
  }

  private syncFormValues() {
    // Listen to step1 changes and update main form
    this.formStep1.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(values => {
      Object.keys(values).forEach(key => {
        if (this.form.get(key)) {
          this.form.get(key)?.setValue(values[key], { emitEvent: false });
        }
      });
    });

    // Listen to step2 changes and update main form
    this.formStep2.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(values => {
      Object.keys(values).forEach(key => {
        if (this.form.get(key)) {
          this.form.get(key)?.setValue(values[key], { emitEvent: false });
        }
      });
    });

    // Listen to main form changes and update step forms
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(values => {
      Object.keys(values).forEach(key => {
        if (this.formStep1.get(key)) {
          this.formStep1.get(key)?.setValue(values[key], { emitEvent: false });
        }
        if (this.formStep2.get(key)) {
          this.formStep2.get(key)?.setValue(values[key], { emitEvent: false });
        }
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onResetFormType(): void {
    this.selectedFormType = null;
    this.isSubmittedResponse = { type: null, status: false };
    // Reset all forms
    if (this.form) {
      this.form.reset();
    }
    if (this.formStep1) {
      this.formStep1.reset();
    }
    if (this.formStep2) {
      this.formStep2.reset();
    }
  }

  submitForm() {
    if (this.form.invalid || !this.config.apiUrl) return;
    const formData = this.form.getRawValue();

    const metadata = {
      currentPageUrl: window.location.href,
      userFullName: this.form.value.name,
    };

    const additionalData = this.config.additionalData;
    const payload: WidgetConfigApiRequest = { ...formData, ...metadata, additionalData, typeCode: this.selectedFormType };

    if (this.config.userId) {
      payload.userId = this.config.userId;
    }

    this.submitting = true;
    this.http.post<WidgetConfigApiResponse>(this.config.apiUrl, payload).subscribe({
      next: (res: WidgetConfigApiResponse) => {
        this.submitting = false;
        this.selectedFormType = null;
        this.form.reset();
        this.isSubmittedResponse = {
          type: this.selectedFormType,
          status: true
        };
      },
      error: () => {
        this.submitting = false;
      },
    });
  }
}
