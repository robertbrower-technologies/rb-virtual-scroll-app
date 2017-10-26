import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import { ListItem } from './list-item';
import { ListItems } from './list-items';
import { MockData } from './mock-data';

export const DELAY = 0;

@Injectable()
export class ListService {

  constructor() { }

  public getListLength(): Observable<number> {
    console.log(`ListService getListLength`);
    return Observable.of(MockData.length).delay(DELAY);
  }

  public getItemsByRange(skip: number, take: number): Observable<ListItems> {
    console.log(`ListService getByRange skip=${skip} take=${take}`);
    let items: ListItem[] = MockData.slice(skip, skip+take);
    let listItems: ListItems = {
      items: items,
      range: undefined
    };
    return Observable.of(listItems).delay(DELAY);
  }

  public getItemsByItem(selectedItem: any, viewIndex: number, take: number): Observable<ListItems> {
    console.log(`ListService getById skip=${selectedItem.id} viewIndex=${viewIndex} take=${take}`);
    let itemIndex = MockData.findIndex(item => item.id === selectedItem.id);
    let skip = itemIndex - viewIndex;
    let listItems: ListItems = {
      items: MockData.slice(skip, skip+take),
      range: { skip: skip, take: take }
    };
    return Observable.of(listItems).delay(DELAY);
  }

}
