import { ListItem } from './list-item';

export class ListItems {
    length: number;
    items: Array<ListItem>;
    range: {
        skip: number;
        take: number;
    }
}