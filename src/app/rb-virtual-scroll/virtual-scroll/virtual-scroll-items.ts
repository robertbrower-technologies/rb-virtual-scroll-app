import { Range } from './range';

export class VirtualScrollItems {

    length: number = 0;

    items: Array<any> = new Array<any>();

    range: Range = new Range(0, 0);

    constructor(length?: number, items?: any[], range?: Range) {
        this.length = length;
        this.items = items;
        this.range = range;
    }
}