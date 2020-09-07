import {Component, Input, OnInit} from '@angular/core';
import {TipModel} from '../../models/tip.model';
import {TipService} from '../../services/tip.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-tips-list-item',
  templateUrl: './tips-list-item.component.html',
  styleUrls: ['./tips-list-item.component.css']
})
export class TipsListItemComponent implements OnInit {
  @Input() tip: TipModel;
  tipThumbUrl: string;

  ngOnInit(): void {
    this.tipThumbUrl = environment.serverPath + '/tips/thumb/' + this.tip.id;
  }

}
