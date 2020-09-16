import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TipService} from '../../services/tip.service';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {ViewportScroller} from '@angular/common';
import {faGlobe} from '@fortawesome/free-solid-svg-icons/faGlobe';
import {faLaptop} from '@fortawesome/free-solid-svg-icons/faLaptop';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-new-tip',
  templateUrl: './new-tip.component.html',
  styleUrls: ['./new-tip.component.css']
})
export class NewTipComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: false}) form: NgForm;
  currentImageUrl = '';
  faTimes = faTimes;
  uploadImageValidationMessage: string;
  uploadedImagePath = '';
  uploadedImageUrl: any;
  isPosting = false;
  postedId: number;
  addingTipError: Error;
  idSub: Subscription;
  newTipIsPostingSub: Subscription;
  newTipPostedIdSub: Subscription;
  routerSub: Subscription;

  faGlobe = faGlobe;
  faLaptop = faLaptop;

  constructor(
      private service: TipService,
      private router: Router,
      private route: ActivatedRoute,
      private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.service.newTipButtonVisible.next(false);
    this.newTipIsPostingSub = this.service.newTipIsPosting.subscribe(isPosting => {
      this.isPosting = isPosting;
    });
    this.newTipPostedIdSub = this.service.newTipPostedId.subscribe(id => {
      this.router.navigate(['../', id], {relativeTo: this.route}).then();
    });
    this.routerSub = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => this.viewportScroller.scrollToPosition([0,0]));
  }

  ngOnDestroy() {
    this.service.newTipButtonVisible.next(true);
    this.newTipIsPostingSub.unsubscribe();
    this.newTipPostedIdSub.unsubscribe();
    this.routerSub.unsubscribe();
  }

  onSubmit(submittedForm: NgForm) {
    if (submittedForm.invalid) {
      return;
    }
    const writeObject = {
      'heading': submittedForm.form.value['heading'],
      'body': submittedForm.form.value['body'],
      'imageUrl': this.currentImageUrl,
      'uploadedImage': this.uploadedImageUrl
    };
    this.service.postNewTip(writeObject);
  }

  onImageUrlLeft() {
    if(this.form.value.imageUrl !== this.currentImageUrl) {
      this.currentImageUrl = this.form.value.imageUrl;
    }
  }

  resetImgUrl() {
    this.currentImageUrl = '';
    this.form.form.patchValue({
      imageUrl: this.currentImageUrl
    });
  }

  previewUploadedImage(files) {
    if (files.length === 0)
      return;

    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.uploadImageValidationMessage = "Wskazany plik nie jest zdjęciem";
      return;
    }

    let reader = new FileReader();
    this.uploadedImagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.uploadedImageUrl = reader.result;
    }
  }

}
