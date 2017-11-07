import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { ListService } from '../list.service';
import { ListItem } from '../list-item';
import { Range } from '../rb-virtual-scroll/virtual-scroll/range';
import { Item } from '../rb-virtual-scroll/virtual-scroll/item';
import { VirtualScrollItems } from '../rb-virtual-scroll/virtual-scroll/virtual-scroll-items';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  private timer$: Subscription;

  private displayRange: Range;

  private range: Range;

  public selectedItem: Item;

  private scrolling: boolean;

  public items: VirtualScrollItems = new VirtualScrollItems();

  private getItemsCallback: Function = this.getItemsByRange;

  constructor(private list: ListService) { }

  ngOnInit() {
    let timer = TimerObservable.create(1000, 1000);
    this.timer$ = timer.subscribe(t => this.updateItems());
  }

  onDisplayRangeChanged(range: Range) {
    this.displayRange = range;
    console.log(`ListComponent onDisplayRangeChanged() this.displayRange=${JSON.stringify(this.displayRange)}`);
  }
  
  onRangeChanged(range: Range) {
    this.range = range;
    console.log(`ListComponent onRangeChanged() this.range=${JSON.stringify(this.range)}`);
  }

  onScrollingChanged(scrolling: boolean) {
    this.scrolling = scrolling;
    this.getItemsCallback = this.getItemsByRange;
    console.log(`ListComponent onScrollingChanged() this.scrolling=${this.scrolling}`);
  }

  onSelectedItemChanged(selectedItem: Item) {
    if (!this.selectedItem || (this.selectedItem && this.selectedItem.item.id !== selectedItem.item.id)) {
      this.getItemsCallback = this.getItemsById;
    }
    this.selectedItem = selectedItem;
    console.log(`ListComponent onSelectedItemChanged() this.selectedItem=${JSON.stringify(this.selectedItem)}`);
  }

  updateItems() {
    if (!this.scrolling) {
      this.getItemsCallback();
    }
  }

  getItemsByRange() {
    this.list.getItemsByRange(this.range.skip, this.range.take)
      .subscribe(items => {
        let range = new Range(items.range.skip, items.range.take);
        if (range.isEqual(this.range) && this.getItemsCallback === this.getItemsByRange) {
          this.items = new VirtualScrollItems(items.items, range);
        }
      });
  }

  getItemsById() {
    this.list.getItemsById(this.selectedItem.item.id, this.selectedItem.viewIndex, this.range.take)
      .subscribe(items => {
        let range = new Range(items.range.skip, items.range.take);
        if (this.getItemsCallback === this.getItemsById) {
          this.items = new VirtualScrollItems(items.items, range);
        }
      });
  }

}
