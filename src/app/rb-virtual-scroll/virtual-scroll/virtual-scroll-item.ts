export class VirtualScrollItem {

    public item: any;
    
    public viewIndex: number;

    constructor(item: any, viewIndex: number) {
        this.item = item;
        this.viewIndex = viewIndex;
    }
}
