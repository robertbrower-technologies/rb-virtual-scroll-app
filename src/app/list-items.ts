import { ListItem } from './list-item';

export class ListItems {
    items: ListItem[];
    range?: {
        skip: number;
        take: number;
    }
}