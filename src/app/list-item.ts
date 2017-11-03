export class ListItem {

    id: number;
    
    lastUpdated?: number;

    constructor(id: number, lastUpdated?: number) {
        this.id = id;
        this.lastUpdated = lastUpdated ? lastUpdated : (new Date()).getTime();
    }
}