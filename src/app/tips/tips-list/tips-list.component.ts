import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TipModel} from '../../models/tip.model';
import {TipService} from '../../services/tip.service';
import {PageableModel} from '../../models/pagination/pageableModel';
import {PageModel} from '../../models/pagination/page.model';

import {faRedoAlt} from '@fortawesome/free-solid-svg-icons';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-tips-list',
  templateUrl: './tips-list.component.html',
  styleUrls: ['./tips-list.component.css']
})
export class TipsListComponent implements OnInit, AfterViewInit, OnDestroy {

  tips: TipModel[];
  pageable: PageableModel;
  currentPage: PageModel<TipModel>;
  isLoading = true;
  showAlert = false;
  lastError: Error;
  faRedoAlt = faRedoAlt;
  scrollableHeight = window.innerHeight-200;

  isButtonLoadMoreVisible = true;
  isButtonNewVisible = true;
  isNotificationPossible = false;
  isNotificationBeingSent = false;

  isNotificationPossibleSub: Subscription;
  isNewTipPostedSub: Subscription;
  isNewTipButtonVisibleSub: Subscription;
  areTipsListLoadingSub: Subscription;
  tipLoadErrorSub: Subscription;

  @ViewChild('tipScrollingList') private scrollContainer: ElementRef;


  onScroll(): void {
    const element = this.scrollContainer.nativeElement;
    if (!this.isLoading && !this.service.lastLoadedPage.last && (element.scrollHeight - element.scrollTop >= element.offsetHeight)) {
      this.loadTips();
    }
  }

  constructor(private service: TipService) { }

  ngOnInit(): void {
    this.isNotificationPossibleSub = this.service.isNotifyPossibleSbj.subscribe(is => {
      this.isNotificationPossible = is;
    });
    this.service.isNotificationPossible().subscribe(is => {
      console.log(is);
      this.isNotificationPossible = is;
    });
    this.isNewTipPostedSub = this.service.newTipPostedId.subscribe(() => {
      this.tips = [];
      this.reloadTips();
    });
    this.isNewTipButtonVisibleSub = this.service.newTipButtonVisible.subscribe(visible => {
      this.isButtonNewVisible = visible;
    });

    this.areTipsListLoadingSub = this.service.tipsListLoading.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.service.newPage.subscribe(page => {
      this.tips = this.service.loadedTips;
      this.currentPage = page;
      this.lastError = null;

    });

    this.tipLoadErrorSub = this.service.tipLoadError.subscribe(error => {
      this.lastError = error;
    });
    if (!this.service.lastLoadedPage) {
      this.loadTips();
    }
    else {
      this.isLoading = false;
      this.tips = this.service.loadedTips;
    }
  }

  ngAfterViewInit() {
    const element = this.scrollContainer.nativeElement;
    this.isButtonLoadMoreVisible = this.scrollableHeight <= element.scrollHeight;
  }

  ngOnDestroy() {
    this.isNotificationPossibleSub.unsubscribe();
    this.isNewTipPostedSub.unsubscribe();
    this.isNewTipButtonVisibleSub.unsubscribe();
    this.areTipsListLoadingSub.unsubscribe();
    this.tipLoadErrorSub.unsubscribe();
  }

  loadTips() {
    this.isLoading = true;
    this.service.getTipsPage();
  }

  reloadTips() {
    this.service.reloadTipsList();
  }

  onSendNotification() {
    this.isNotificationBeingSent = true;
    this.isNotificationPossible = false;
    this.service.notifyUsersOnNewPosts().subscribe(() => {
      this.isNotificationBeingSent = false;

    })
  }


}
