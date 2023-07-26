import { Component, ChangeDetectorRef } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Dropper';
  showSpinner: boolean = false;

  constructor(
    private themeService: ThemeService,
    private commonService: CommonService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.commonService.spinnerSubject$.subscribe((spinnerState) => {
      this.showSpinner = spinnerState;
      this.cdRef.detectChanges();
    });

    this.commonService.clearNotificationOnRouteChange();
  }
}
