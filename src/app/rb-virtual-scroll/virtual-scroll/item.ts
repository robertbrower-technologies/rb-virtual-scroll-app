export class Item {

    public item: any;
    
    public index: number;

    public take: number;

    constructor(item: any, index: number, take: number) {
        this.item = item;
        this.index = index;
        this.take = take;
    }
}
