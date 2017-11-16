import { Injectable } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { ListItem } from './list-item';
import { ListItems } from './list-items';

export const LIST_LENGTH = 1000;

export const DELAY = 0;

export const UPDATE_INTERVAL = 3000;

@Injectable()
export class ListService {

  list: ListItem[] = [];

  private timer$: Subscription;

  constructor() {
    for (let id=1; id<=LIST_LENGTH; id++) {
      this.list.push(new ListItem(id, (new Date()).getTime() - id * 1000));
    }
    this.sortList();
    let timer = TimerObservable.create(UPDATE_INTERVAL, UPDATE_INTERVAL);
    this.timer$ = timer.subscribe(t => this.updateItems());
  }

  private updateItems() {
    let randomIndex = Math.floor((Math.random() * (LIST_LENGTH - 1)));
    this.list[randomIndex].lastUpdated = (new Date()).getTime();
    this.sortList();
  }

  private sortList() {
    this.list.sort((a, b) => b.lastUpdated - a.lastUpdated);
  }

  public getListLength(): Observable<number> {
    return Observable.of(this.list.length).delay(DELAY);
  }

  public getItemsByRange(skip: number, take: number): Observable<ListItems> {
    let items: ListItem[] = this.list.slice(skip, skip+take);
    let listItems: ListItems = {
      length: this.list.length,
      items: items,
      range: { skip: skip, take: take }
    };
    return Observable.of(listItems).delay(DELAY);;
  }

  public getItemsById(id: number, viewIndex: number, skip: number, take: number): Observable<ListItems> {
    let itemIndex = this.list.findIndex(item => item.id === id);
    let found = itemIndex >= 0;
    let itemSkip = itemIndex - viewIndex;
    let skipToUse = found ? itemSkip : skip;
    let listItems: ListItems = {
      length: this.list.length,
      items: found ? this.list.slice(skipToUse, skipToUse+take) : new Array<ListItem>(),
      range: { skip: skipToUse, take: take }
    };
    return Observable.of(listItems).delay(DELAY);
    
  }

}
