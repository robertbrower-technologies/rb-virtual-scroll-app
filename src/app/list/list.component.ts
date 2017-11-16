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

  public displayRange: Range;

  public selectedItem: Item;

  public listLength: number = 0;

  public items: Array<ListItem> = new Array<ListItem>();

  public range: Range = new Range(0, 0);

  private timer$: Subscription;

  private scrolling: boolean;

  private getItemsCallback: Function = this.getItemsByRange;

  private getListLength$: Subscription;

  private getItemsByRange$: Subscription;

  private getItemsById$: Subscription;

  constructor(private list: ListService) { }

  ngOnInit() {
    this.getListLength();
  }

  ngOnDestroy() {
    if (this.getListLength$) {
      this.getListLength$.unsubscribe();
    }
    
    if (this.getItemsByRange$) {
      this.getItemsByRange$.unsubscribe();
    }

    if (this.getItemsById$) {
      this.getItemsById$.unsubscribe();
    }
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
      console.log('ListComponent updateItems()');
      this.getItemsCallback();
    }
  }

  getListLength() {
    this.getListLength$ = this.list.getListLength()
      .subscribe(listLength => {
        this.getListLength$.unsubscribe();
        this.getListLength$ = null;
        this.listLength = listLength;
        let timer = TimerObservable.create(1000, 1000);
        this.timer$ = timer.subscribe(t => this.updateItems());
      });
  }

  getItemsByRange() {
    if (!this.getItemsByRange$) {
      this.getItemsByRange$ = this.list.getItemsByRange(this.range.skip, this.range.take)
      .subscribe(items => {
        this.getItemsByRange$.unsubscribe();
        this.getItemsByRange$ = null;
        let range = new Range(items.range.skip, items.range.take);
        if (range.isEqual(this.range) && this.getItemsCallback === this.getItemsByRange) {
          this.listLength = items.length;
          console.log('ListComponent getItemsByRange()');
          this.items = items.items;
          this.range = range;
        }
      });
    }
  }

  getItemsById() {
    if (!this.getItemsById$) {
      this.getItemsById$ = this.list.getItemsById(this.selectedItem.item.id, this.selectedItem.viewIndex, this.range.skip, this.range.take)
      .subscribe(items => {
        this.getItemsById$.unsubscribe();
        this.getItemsById$ = null;
        let range = new Range(items.range.skip, items.range.take);
        if (this.getItemsCallback === this.getItemsById) {
          this.listLength = items.length;
          console.log('ListComponent getItemsById()');
          this.items = items.items;
          this.range = range;
        }
      });
    }
  }

}
