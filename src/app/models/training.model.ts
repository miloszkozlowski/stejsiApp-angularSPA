import {LocationModel} from './location.model';

export class TrainingModel {
    id: number;
    scheduledFor: Date;
    markedAsDone: Date;
    scheduleConfirmed: Date;
    whenCanceled: Date;
    presenceConfirmedByUser: Date;
    trainingPackage: number;
    location: LocationModel;
}
