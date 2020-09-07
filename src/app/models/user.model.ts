import {PackageModel} from './package.model';
import {TipCommentModel} from './tip-comment.model';

export class UserModel {
    id: number;
    name: string;
    surname: string;
    email: string;
    phoneNumber: number;
    active: boolean;
    settingTipNotifications: boolean;
    trainingPackages: PackageModel[];
    tipComments: TipCommentModel[];
    activePackages: number[];
    inactivePackages: number[];
    rankReadable: string;
    progressPoints: number;
    totalTrainingsDone: number;
    lastFourWeeksAvgTrainingsDone: number;
    unconfirmedTrainings: number;
}
