import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Inject,
  LOCALE_ID,
} from "@angular/core";
import { formatDate } from "@angular/common";
import { FormControl } from "@angular/forms";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { CommonUtils } from "../common-utils";

export class SmartFilterObject {
  parameters: SmartFilterParameter[] | undefined;
  any?: boolean;

  static reset(filter: SmartFilterObject, value: any) {
    if (!this.isCorrect(filter)) {
      return;
    }

    filter.parameters?.forEach((parameter) => {
      const parameterValues: KeyValuePair[] = [];
      parameter.keys?.forEach((key) => {
        parameterValues.push({ key, value: value[key] });
      });

      SmartFilterParameter.setValues(parameter, parameterValues);
    });

    filter.any = CommonUtils.toBoolean(value.any);
  }

  static apply(filter: SmartFilterObject, value: any) {
    if (!value) {
      return;
    }

    const parameterValues = this.getValues(filter);
    if (!parameterValues) {
      return;
    }

    parameterValues.forEach((x) => (value[x.key] = x.value));

    value.any = filter.any;
  }

  private static getValues(filter: SmartFilterObject): KeyValuePair[] {
    if (!this.isCorrect(filter)) {
      return [];
    }
    let values: KeyValuePair[] = [];
    filter.parameters?.filter((x) => SmartFilterParameter.hasValue(x))
      .forEach((x) => {
        const parameterValues = SmartFilterParameter.getValues(x);
        if (parameterValues) {
          values = [...values, ...parameterValues];
        }
      });

    return values;
  }

  private static isCorrect(filter: SmartFilterObject): boolean {
    if (!filter || !filter.parameters || !filter.parameters.length) {
      return false;
    }

    return true;
  }
}

export class SmartFilterParameter {
  type: SmartFilterParameterType | undefined;
  name: string | undefined;
  keys: string[] | undefined;
  values?: any[];
  operator?: string;
  availableValues?: SmartFilterSelectItem[];

  static hasValue(parameter: SmartFilterParameter): boolean {
    if (!parameter.values || !parameter.values.length) {
      return false;
    }

    switch (parameter?.type) {
      case SmartFilterParameterType.text:
      case SmartFilterParameterType.boolean:
      case SmartFilterParameterType.selectOne:
      case SmartFilterParameterType.date:
        return parameter.values.length > 0 && parameter.values[0] !== undefined;

      case SmartFilterParameterType.select:
        return parameter.values.length > 0 && parameter.values[0];

      case SmartFilterParameterType.dateRange:
        return (
          (parameter.values.length > 0 && parameter.values[0]) ||
          (parameter.values.length > 1 && parameter.values[1])
        );

      default:
        return false;
    }
  }

  static getValues(parameter: SmartFilterParameter): KeyValuePair[] {
    switch (parameter?.type) {
      case SmartFilterParameterType.text:
      case SmartFilterParameterType.date:
      case SmartFilterParameterType.selectOne:
        return [{ key: parameter.keys?.[0] ?? '', value: parameter.values?.[0] }];

      case SmartFilterParameterType.boolean:
        return [
          {
            key: parameter.keys?.[0] ?? '',
            value: CommonUtils.toBoolean(parameter.values?.[0]),
          },
        ];

      case SmartFilterParameterType.select:
        return [{ key: parameter.keys?.[0] ?? '', value: parameter.values }];

      case SmartFilterParameterType.dateRange:
        return [
          { key: parameter.keys?.[0] ?? '', value: parameter.values?.[0] },
          { key: parameter.keys?.[1] ?? '', value: parameter.values?.[1] },
        ];

      default:
        return [];
    }
  }

  static setValues(parameter: SmartFilterParameter, values: KeyValuePair[]) {
    if (!values) {
      return;
    }

    switch (parameter?.type) {
      case SmartFilterParameterType.text:
      case SmartFilterParameterType.date:
      case SmartFilterParameterType.selectOne:
        parameter.values = [values[0].value];
        break;

      case SmartFilterParameterType.boolean:
        parameter.values =
          values[0].value === undefined || values[0].value === null
            ? []
            : [CommonUtils.toBoolean(values[0].value)];
        break;

      case SmartFilterParameterType.select:
        const selectValues = !values[0].value
          ? []
          : (values[0].value as string).split(",");
        parameter.values = selectValues;
        break;

      case SmartFilterParameterType.dateRange:
        parameter.values = [values[0].value, values[1].value];
        break;
    }
  }
}

export class KeyValuePair {
  key!: string;
  value: any;
}

export enum SmartFilterParameterType {
  text = 1,
  select = 2,
  boolean = 3,
  date = 4,
  dateRange = 5,
  selectOne = 6,
}

export interface SmartFilterSelectItem {
  key: string;
  name: string;
}

@Component({
  selector: "lib-smart-filter",
  templateUrl: "./smart-filter.component.html",
  styleUrls: ["./smart-filter.component.scss"],
})
export class SmartFilterComponent {
  get filter(): SmartFilterObject {
    return this.filterValue;
  }
  @Input()
  set filter(filter: SmartFilterObject) {
    this.filterValue = filter;
    if (this.filterValue && this.filterValue.parameters) {
      this.selectedParameters = this.filterValue.parameters.filter((x) =>
        SmartFilterParameter.hasValue(x)
      );
    }
  }
  private filterValue!: SmartFilterObject;

  @Output()
  filterChange = new EventEmitter<SmartFilterObject>();

  @ViewChild("autocomplete")
  autocomplete!: MatAutocomplete;

  @ViewChild("menuTrigger")
  menuTrigger!: MatMenuTrigger;

  @ViewChild("menu")
  menu!: MatMenu;

  smartFilterParameterType = SmartFilterParameterType;

  parameterControl = new FormControl();
  parameterValuesControl = new FormControl();
  parameterFromControl = new FormControl();
  parameterToControl = new FormControl();

  availableParameters: Observable<SmartFilterParameter[] | undefined | null>;
  currentParameter: SmartFilterParameter | undefined;
  selectedParameters: SmartFilterParameter[] = [];

  constructor(@Inject(LOCALE_ID) private locale: string) {
    this.availableParameters = this.parameterControl.valueChanges.pipe(
      startWith(null),
      map((search: string | null) =>
        this.applySearch(this.filter?.parameters || [], search)
      )
    );
  }

  onParameterOptionSelect(event: MatAutocompleteSelectedEvent) {
    this.currentParameter = this.filter.parameters?.find(
      (x) => this.getParameterId(x) === event.option.value
    );

    this.menuTrigger.openMenu();
  }

  getParameterId(parameter: SmartFilterParameter) {
    if (!parameter || !parameter.keys) {
      return null;
    }

    return parameter.keys[0];
  }

  onParameterAdd() {
    if (
      this.parameterValuesControl.value ||
      this.currentParameter?.type === SmartFilterParameterType.boolean
    ) {
      if (this.currentParameter?.type === SmartFilterParameterType.select) {
        this.currentParameter.values = [...this.parameterValuesControl.value];
      } else if (
        this.currentParameter?.type === SmartFilterParameterType.selectOne
      ) {
        this.currentParameter!.values = [this.parameterValuesControl.value[0]];
      } else if (this.currentParameter?.type === SmartFilterParameterType.text) {
        this.currentParameter!.values = [
          this.parameterValuesControl.value?.trim() ?? '',
        ];
      } else if (this.currentParameter?.type === SmartFilterParameterType.boolean) {
        this.currentParameter.values = [this.parameterValuesControl.value];
      } else if (this.currentParameter) {
        this.currentParameter.values = [this.parameterValuesControl.value];
      }

      if (this.currentParameter) {
        this.selectedParameters.push(this.currentParameter);
        this.notifyChange();
      }
    }

    if (this.currentParameter?.type === SmartFilterParameterType.dateRange) {
      if (this.parameterFromControl?.value || this.parameterToControl?.value) {
        if (this.parameterToControl?.value == null) {
          const currentDate = new Date();
          this.parameterToControl?.setValue(currentDate.toISOString());
        }

        this.currentParameter.values = [
          this.parameterFromControl.value,
          this.parameterToControl.value,
        ];
      }

      this.selectedParameters.push(this.currentParameter);
      this.notifyChange();
    }

    this.discardParameterControl();
    this.menuTrigger.closeMenu();
  }

  onParameterRemove(parameter: SmartFilterParameter) {
    parameter.values = [];
    const index = this.selectedParameters.indexOf(parameter);
    if (index !== -1) {
      this.selectedParameters.splice(index, 1);
      this.notifyChange();
    }

    this.discardParameterControl();
  }
  onMenuClose() {
    this.currentParameter = undefined;
    this.parameterValuesControl.setValue(null);
    this.discardParameterControl();
  }

  get canClear(): boolean {
    return this.selectedParameters.length > 0;
  }

  clear() {
    this.selectedParameters.forEach((x) => (x.values = []));
    this.selectedParameters = [];
    this.notifyChange();

    this.discardParameterControl();
  }

  changeMode() {
    this.filter.any = !this.filter.any;
    this.notifyChange();
  }

  formatParameterString(parameter: SmartFilterParameter): string {
    switch (parameter?.type) {
      case SmartFilterParameterType.text:
        return `${parameter.name}: "${parameter.values?.[0] ?? ''}"`;
      case SmartFilterParameterType.select:
        return `${parameter.name}: ${parameter.values?.length ?? 0} item(s)`;
      case SmartFilterParameterType.boolean:
        return `${parameter.name}: ${parameter.values?.[0] ? "Yes" : "No"}`;
      case SmartFilterParameterType.date:
        return `${parameter.name}: ${this.formatDateString(
          parameter.values?.[0]
        )}`;
      case SmartFilterParameterType.dateRange:
        const fromDate = this.formatDateString(parameter.values?.[0]);
        const toDate = this.formatDateString(parameter.values?.[1]);
        return `${parameter.name}: ${fromDate} - ${toDate}`;
      case SmartFilterParameterType.selectOne:
        return `${parameter.name}: "${parameter.values?.[0] ?? ''}"`;
      default:
        return '';
    }
  }

  disableTyping(event: { preventDefault: () => void; }) {
    event.preventDefault();
  }

  private applySearch(
    parameters: SmartFilterParameter[],
    text: string | null
  ): SmartFilterParameter[] {
    const filteredParameters = parameters.filter(
      (x) => !SmartFilterParameter.hasValue(x)
    );

    if (!text) {
      return filteredParameters;
    }

    return filteredParameters.filter((x) =>
      x.name?.toLowerCase().includes(text.toLowerCase()) ?? false
    );
  }
  private discardParameterControl() {
    this.parameterControl.setValue(null);
    this.parameterFromControl.setValue(null);
    this.parameterToControl.setValue(null);
  }

  private notifyChange() {
    this.filterChange.emit(this.filter);
  }

  private formatDateString(value: string | number | Date): string {
    return value ? formatDate(value, "MM/dd/yyyy", this.locale) : "";
  }
}
