import {UserModel} from './user.model';
import {PackageTypeModel} from './package-type.model';
import {TrainingModel} from './training.model';

export class PackageModel {
    id: number;
    owner: UserModel;
    packageType: PackageTypeModel;
    trainings: TrainingModel[];
    paid: boolean;
    closed: boolean;
    whenCreated: Date;
    validityDays: number;
    valid: boolean;
    validInfinitely: boolean;
    amountTrainingsPlanned: number;

    getUnplannedTrainings(): TrainingModel[] {
        let unplanned: TrainingModel[] = [];
        for(let t of this.trainings) {
            if(!t.scheduledFor) {
                unplanned.push(t);
            }
        }
        return unplanned;
    }
}


