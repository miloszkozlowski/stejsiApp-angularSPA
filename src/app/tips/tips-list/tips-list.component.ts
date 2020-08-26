import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TipModel} from '../../models/tip.model';
import {TipService} from '../../services/tip.service';
import {PageableModel} from '../../models/pagination/pageableModel';
import {PageModel} from '../../models/pagination/page.model';

import {faRedoAlt} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tips-list',
  templateUrl: './tips-list.component.html',
  styleUrls: ['./tips-list.component.css']
})
export class TipsListComponent implements OnInit, AfterViewInit {

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

  @ViewChild('tipScrollingList') private scrollContainer: ElementRef;


  onScroll(): void {
    const element = this.scrollContainer.nativeElement;
    if (!this.isLoading && !this.service.lastLoadedPage.last && (element.scrollHeight - element.scrollTop >= element.offsetHeight)) {
      this.loadTips();
    }
  }

  constructor(private service: TipService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.service.newTipPostedId.subscribe(id => {
      this.tips = [];
      this.reloadTips();
    });
    this.service.newTipButtonVisible.subscribe(visible => {
      this.isButtonNewVisible = visible;
    });

    this.service.tipsListLoading.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
    this.service.newPage.subscribe(page => {
      this.tips = this.service.loadedTips;
      this.currentPage = page;
      this.lastError = null;

    });

    this.service.tipLoadError.subscribe(error => {
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

  loadTips() {
    this.isLoading = true;
    this.service.getTipsPage();
  }

  reloadTips() {
    this.service.reloadTipsList();
  }

}
