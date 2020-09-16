import {SortModel} from './sort.model';
import {PageableModel} from './pageableModel';

export class PageModel<T> {
    content: Array<T>;
    pageable: PageableModel;
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    sort: SortModel;
    numberOfElements: number;
    size: number;
    number: number;

    public constructor() {
        this.pageable = new PageableModel();
    }
}
