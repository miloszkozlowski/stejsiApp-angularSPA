import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {SettingsComponent} from './settings.component';
import {SettingsGeneralComponent} from './settings-general/settings-general.component';
import {SettingsLocationsComponent} from './settings-locations/settings-locations.component';
import {LocationNewComponent} from './settings-locations/location-new/location-new.component';
import {LocationListItem} from './settings-locations/location-list-item/location-list-item';
import {LocationRemoveDialog} from './settings-locations/location-remove-dialog/location-remove-dialog';
import {FormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsGeneralComponent,
        SettingsLocationsComponent,
        LocationListItem,
        LocationNewComponent,
        LocationRemoveDialog
    ],
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild([{
            path: '', component: SettingsComponent, children: [
                {path: '', component: SettingsGeneralComponent},
                {
                    path: 'lokalizacje', component: SettingsLocationsComponent, children: [
                        {path: 'nowa', component: LocationNewComponent}
                    ]
                }
            ]
        }])
    ]
})
export class SettingsModule {}
