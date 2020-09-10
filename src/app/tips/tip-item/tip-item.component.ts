import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { TipService } from '../../services/tip.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TipModel} from '../../models/tip.model';
import {faTrash, faEdit, faComment, faRedoAlt} from '@fortawesome/free-solid-svg-icons';
import {environment} from '../../../environments/environment';
import {NgForm} from '@angular/forms';
import {ViewportScroller} from '@angular/common';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-tip-item',
  templateUrl: './tip-item.component.html',
  styleUrls: ['./tip-item.component.css']
})
export class TipItemComponent implements OnInit {
  currentTipId: number;
  loadedTip: TipModel;
  isLoading: boolean;
  errorLoading: string;
  isActionMenuOpened = false;
  isMakingComment = false;
  isPostingComment = false;
  imageServerPath = environment.serverPath + '/tips/pic/';
  errorAddingComment: Error = null;
  @ViewChild('newCommentDiv') newCommentDiv: ElementRef;
  @ViewChild('newComment') newCommentForm: NgForm;
  @ViewChild('newCommentBody') newCommentInput: ElementRef;


  faTrash = faTrash;
  faEdit = faEdit;
  faComment = faComment;
  faRedoAlt = faRedoAlt;

  constructor(
      private service: TipService,
      private route: ActivatedRoute,
      private router: Router,
      private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentTipId = params.id;
      this.onLoadTip(this.currentTipId);
    });
    this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => this.viewportScroller.scrollToPosition([0,0]));
  }

  onLoadTip(id: number) {
    this.isLoading = true;
    this.isMakingComment = false;
    this.loadedTip = null;
    for(let tip of this.service.loadedTips) {
      if(tip.id === +id) {
        this.loadedTip = tip;
        if(this.loadedTip.localImagePresent) {
          this.loadedTip.imageUrl= this.imageServerPath + this.loadedTip.id;
        }
        this.isLoading = false;
        break;
      }
    }
    if(!this.loadedTip) {
      this.loadOnLine(id);
    }

  }

  loadOnLine(id: number) {
    this.isActionMenuOpened = false;
    this.errorLoading = null;
    this.isLoading = true;
    this.service.getTipById(id).subscribe(resp => {
      this.loadedTip = resp;
      if(this.loadedTip.localImagePresent) {
        this.loadedTip.imageUrl= this.imageServerPath + this.loadedTip.id;
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.errorLoading = error.message;
    });
  }

  onRemoveTip() {
    this.errorLoading = null;
    this.isLoading = true;
    this.service.deleteTipById(this.loadedTip.id).subscribe(() => {
      this.service.reloadTipsList();
      this.isLoading = false;
      this.router.navigate(['../'], {relativeTo: this.route});
    }, error => {
      this.isLoading = false;
      this.errorLoading = error.message;
    });

  }

  makeComment() {
    this.isMakingComment = true;
    setTimeout(() => {
      this.newCommentDiv.nativeElement.scrollIntoView({behavior: 'smooth'});
      this.newCommentInput.nativeElement.focus();
    })
  }

  submitNewComment(form: NgForm) {
    this.isPostingComment = true;
    this.errorAddingComment = null;
    const newComment = {
      tipId : this.loadedTip.id,
      body : form.value.body
    }
    this.service.addNewComment(newComment).subscribe(resp => {
      this.loadedTip.comments.push(resp);
      form.reset();
      this.isMakingComment = false;
      this.isPostingComment = false;
    }, error => {
      this.errorAddingComment = error;
      this.isPostingComment = false;
    });
  }

}
