import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import {NgForm} from '@angular/forms';
import {SettingsModel} from '../../models/settings.model';

@Component({
    selector: 'app-settings-general',
    templateUrl: './settings-general.component.html'
})
export class SettingsGeneralComponent implements OnInit {
    isLoading = false;
    settingsLoaded: SettingsModel;
    infoMessage: string;
    errorMessage: string;
    lastUpdated: Date;

    formTrainerEmail: string = 'dupa';

    faSyncAlt = faSyncAlt;


    constructor(private service: SettingsService) {
    }

    ngOnInit() {
        this.service.loadingStatus.subscribe(bool => {
            this.isLoading = bool;
        });
        this.loadSettings();
    }

    loadSettings(): void {
        this.service.loadGeneralSettings().subscribe(settings => {
            this.settingsLoaded = settings;
            this.isLoading = false;
            this.fillInData(settings);
        }, error => {
            this.errorMessage = error;
            this.isLoading = false;
        });
    }

    tryAgain(): void {
        this.infoMessage = null;
        this.errorMessage = null;
        this.loadSettings();
    }

    private fillInData(settings: SettingsModel): void {
        this.formTrainerEmail = settings.email;
        this.lastUpdated = settings.whenCreated;
    }

    onSubmit(generalSettingsForm: NgForm) {
        this.settingsLoaded.email = generalSettingsForm.form.value.trainerEmail;
        this.service.saveSettings(this.settingsLoaded).subscribe(newSettings => {
            this.isLoading = false;
            this.settingsLoaded = newSettings;
            this.fillInData(newSettings);
            this.infoMessage = 'Ustawienia zostały poprawnie zapiane';
        }, error => {
            this.errorMessage = error;
            this.isLoading = false;
        });
    }

}
