export class VirtualScrollRange {

    public skip: number;

    public take: number;

    constructor(skip: number, take: number) {
        this.skip = skip;
        this.take = take;
    }

    isEqual(range: VirtualScrollRange): boolean {
        return this.skip === range.skip && this.take === range.take;
    }
}
