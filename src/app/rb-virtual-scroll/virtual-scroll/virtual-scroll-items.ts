import { Range } from './range';

export class VirtualScrollItems {

    items: any[];

    range: Range;

    constructor(items?: any[], range?: Range) {
        this.items = items;
        this.range = range;
    }
}