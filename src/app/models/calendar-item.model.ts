export interface CalendarItemModel {
    eventStartsAt: Date;
    eventEndsAt: Date;
    eventName: string;
    eventSubName: string;
    userName: string;
    userSurname: string;
    userId: number;
    trainingId: number;
    packageId: number;
    canceled: boolean;
    confirmed: boolean;
}
