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

  public items: VirtualScrollItems = new VirtualScrollItems();

  constructor(private list: ListService) { }

  ngOnInit() {
    let timer = TimerObservable.create(1000, 1000);
    this.timer$ = timer.subscribe(t => this.updateItems());
  }

  onDisplayRangeChanged(range: Range) {
    this.displayRange = range;
  }
  
  onRangeChanged(range: Range) {
    this.range = range;
  }

  onItemChanged(item: Item) {
    this.selectedItem = item;
  }

  updateItems() {
    if (this.selectedItem) {
      this.getItemsByItem();
    } else if (this.range) {
      this.getItemsByRange();
    }
  }

  getItemsByRange() {
    let range = new Range(this.range.skip, this.range.take);
    this.list.getItemsByRange(range.skip, range.take)
      .subscribe(items => {
        this.items = new VirtualScrollItems(items.items, range);
      });
  }

  getItemsByItem() {
    let item = new Item(this.selectedItem.item, this.selectedItem.index, this.selectedItem.range);
    this.list.getItemsByItem(item.item, item.index, item.range.take)
      .subscribe(items => {
        let range = new Range(items.range.skip, items.range.take);
        this.items = new VirtualScrollItems(items.items, range);
      });
  }

}
