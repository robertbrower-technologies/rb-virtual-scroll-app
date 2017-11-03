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
    console.log(`updated id=${this.list[randomIndex].id}`);
    this.sortList();
  }

  private sortList() {
    this.list.sort((a, b) => b.lastUpdated - a.lastUpdated);
  }

  public getListLength(): Observable<number> {
    console.log(`ListService getListLength`);
    return Observable.of(this.list.length).delay(DELAY);
  }

  public getItemsByRange(skip: number, take: number): Observable<ListItems> {
    console.log(`ListService getByRange skip=${skip} take=${take}`);
    let items: ListItem[] = this.list.slice(skip, skip+take);
    let listItems: ListItems = {
      items: items,
      range: { skip: skip, take: take }
    };
    return Observable.of(listItems).delay(DELAY);;
  }

  public getItemsByItem(selectedItem: any, viewIndex: number, offset: number, take: number): Observable<ListItems> {
    console.log(`ListService getById id=${selectedItem.id} viewIndex=${viewIndex} offset=${offset} take=${take}`);
    let itemIndex = this.list.findIndex(item => item.id === selectedItem.id);
    if (itemIndex >= 0) {
      let skip = itemIndex - viewIndex;
      skip += offset;
      let listItems: ListItems = {
        items: this.list.slice(skip, skip+take),
        range: { skip: skip, take: take }
      };
      return Observable.of(listItems).delay(DELAY);
    } else {
      let listItems: ListItems = {
        items: [],
        range: { skip: NaN, take: take }
      };
      return Observable.of(listItems).delay(DELAY);
    }
    
  }

}
