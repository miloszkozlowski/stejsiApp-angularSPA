import {TipCommentModel} from './tip-comment.model';

export interface TipModel {
    id: number;
    body: string;
    heading: string;
    imageUrl?: string;
    localImagePresent: boolean;
    comments?: TipCommentModel[];
    amountUserRead: number;
    whenCreated: Date;
}
