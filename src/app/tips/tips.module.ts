import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TipsComponent} from './tips.component';
import {TipsStartComponent} from './tips-start/tips-start.component';
import {NewTipComponent} from './new-tip/new-tip.component';
import {TipItemComponent} from './tip-item/tip-item.component';
import {TipsListComponent} from './tips-list/tips-list.component';
import {TipsListItemComponent} from './tips-list-item/tips-list-item.component';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {ImageLoadPipe} from '../auth/image-load.pipe';

@NgModule({
    declarations: [
        TipsComponent,
        TipItemComponent,
        TipsStartComponent,
        TipsListComponent,
        TipsListItemComponent,
        NewTipComponent,
        ImageLoadPipe
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        RouterModule.forChild([
            {
                path: '', component: TipsComponent, children: [
                    {path: '', component: TipsStartComponent},
                    {path: 'nowa', component: NewTipComponent},
                    {path: ':id', component: TipItemComponent}
                ]
            }
        ])
    ]
})
export class TipsModule {}
