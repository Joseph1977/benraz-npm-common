import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  SmartFilterObject,
  SmartFilterParameterType,
  QueryService,
  QueryUtils
} from '@josephbenraz/npm-common';

@Component({
  selector: 'app-ngx-common-demo',
  templateUrl: './ngx-common-demo.component.html'
})
export class NgxCommonDemoComponent implements OnInit {
  
  @ViewChild(MatSort, { static: true })
  public sort!: MatSort;

  @ViewChild(MatPaginator, { static: true })
  public paginator!: MatPaginator;

  public filterObject: SmartFilterObject;

  columns = [
    'text',
    'select',
    'boolean',
    'date1',
    'date2'
  ];

  sortParameters = [
    { key: 1, name: 'text' },
    { key: 2, name: 'boolean' },
    { key: 3, name: 'select' },
    { key: 4, name: 'date1' },
    { key: 5, name: 'date2' },
  ];

  dataSource = new MatTableDataSource<any>();

  isLoading = false;

  constructor(private querySharedService: QueryService) {
    console.log('constructor');

    this.filterObject = this.createSmartFilterObject();
  }

  ngOnInit() {
    console.log('ngOnInit');

    const query = this.getQueryFromUrl();
    this.applyQueryToControls(query);

    this.reload();
  }

  onFilter() {
    console.log('onFilter');

    this.reload();
  }

  onSort() {
    console.log('onSort');

    this.reload();
  }

  onPage() {
    console.log('onPage');

    this.reload();
  }


  private reload() {
    console.log('reload');
    const query = this.getQueryFromControls();

    this.querySharedService.applyQueryToUrl(query);
    
    this.isLoading = true;
    of(null)
      .pipe(delay(300))
      .subscribe(() => {
        this.dataSource.data = [
          { text: 'Text001', boolean: true, select: 1, date1: '2020-01-01', date2: '2020-02-01' },
          { text: 'Text002', boolean: false, select: 2, date1: '2020-02-01', date2: '2020-02-02' }
        ];
      })
      .add(() => this.isLoading = false);
  }

  private getQueryFromUrl() {
    console.log('getQueryFromUrl');

    const query = this.querySharedService.getQueryFromUrl();
    QueryUtils.toDate(query, 'date1');
    QueryUtils.toDate(query, 'date2to');
    QueryUtils.toDate(query, 'date2from');

    return query;
  }

  private applyQueryToControls(query: any) {
    console.log('applyQueryToControls');

    this.sort.active = QueryUtils.getSortActive(this.sortParameters, query.sortBy, 'date1');
    this.sort.direction = QueryUtils.getSortDirection(query.sortDesc);
    this.paginator.pageSize = query.pageSize || 50;
    this.paginator.pageIndex = query.pageNo ? query.pageNo - 1 : 0;
    SmartFilterObject.reset(this.filterObject, query);
  }

  private getQueryFromControls(): any {
    console.log('getQueryFromControls');

    const query = {
      sortBy: QueryUtils.getSortBy(this.sortParameters, this.sort.active, 1),
      sortDesc: QueryUtils.getSortDesc(this.sort.direction),
      pageNo: this.paginator.pageIndex + 1,
      pageSize: this.paginator.pageSize
    } as any;

    SmartFilterObject.apply(this.filterObject, query);
    QueryUtils.toIsoString(query, 'date1');
    QueryUtils.toIsoString(query, 'date2from');
    QueryUtils.toIsoString(query, 'date2to');

    return query;
  }

  private createSmartFilterObject(): SmartFilterObject {
    console.log('createSmartFilterObject');

    const selectOptions = [
      { key: 1, name: 'One' },
      { key: 2, name: 'Two' }
    ];

    const filterObject = {
      any: false,
      parameters: [
        { keys: ['text'], name: 'Text', type: SmartFilterParameterType.text },
        { keys: ['select'], name: 'Select', type: SmartFilterParameterType.select, availableValues: selectOptions },
        { keys: ['boolean'], name: 'Boolean', type: SmartFilterParameterType.boolean },
        { keys: ['date1'], name: 'Date 1', type: SmartFilterParameterType.date },
        { keys: ['date2from', 'date2to'], name: 'Date 2', type: SmartFilterParameterType.dateRange },
        { keys: ['selectOne'], name: 'Select One', type: SmartFilterParameterType.selectOne, availableValues: selectOptions }
      ]
    } as SmartFilterObject;

    return filterObject;
  }
}