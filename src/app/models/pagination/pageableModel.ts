import {SortModel} from './sort.model';

export class PageableModel {
    sort: SortModel;
    pageSize: number;
    pageNumber: number;
    offset:number;
    unpaged:boolean;
    paged:boolean;

    static readonly DEFAULT_PAGE_SIZE = 3;
    static readonly FIRST_PAGE_NUMBER = 0;

    public constructor() {
        this.pageSize = PageableModel.DEFAULT_PAGE_SIZE;
        this.pageNumber = PageableModel.FIRST_PAGE_NUMBER;
    }
}
