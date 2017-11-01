import { Range } from './range';

export class Item {

    public item: any;
    
    public index: number;

    public range: Range;

    constructor(item: any, index: number, range: Range) {
        this.item = item;
        this.index = index;
        this.range = range;
    }
}
