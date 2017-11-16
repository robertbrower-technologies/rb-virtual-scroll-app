import { Component, EventEmitter, HostListener, Input, Output, OnInit, AfterViewInit, OnChanges, SimpleChanges, ContentChild, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/debounceTime';

import { Range } from './range';
import { Item } from './item';
import { VirtualScrollItemDirective } from './virtual-scroll-item.directive';
//import { VirtualScrollItems } from './virtual-scroll-items';

@Component({
  selector: 'virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.css']
})
export class VirtualScrollComponent implements OnInit {

  @Input()
  public itemKey: string = 'id';

  @Input()
  public itemHeight: number = 0;

  public _listLength: number = 0;

  @Input()
  set listLength(value: number) {
    this._listLength = value;
    this.updateScrollHeight();
  }

  public _items: Array<any> = new Array<any>();

  @Input()
  set items(value: Array<any>) {
    this._items = value;
    let remainder = this.marginTop % this.itemHeight;
    console.log(`VirtualScrollComponent set items this.marginTop=${this.marginTop} remainder=${remainder}`);
    //this.marginTop = this.marginTop % this.itemHeight;// + scrollDirectionChangeModifier;
    let scrollDirectionChangeModifier =
      this.scrollDirection !== this.lastScrollDirection ? this.itemHeight * this.scrollDirection * -1 : 0;
    this.marginTop = remainder + scrollDirectionChangeModifier;
    this.scrollDirection = 0;
    console.log(`VirtualScrollComponent set items this.scrollDirection=${this.scrollDirection} this.lastScrollDirection=${this.lastScrollDirection} scrollDirectionChangeModifier=${scrollDirectionChangeModifier} this.marginTop=${this.marginTop}`);
  }

  private _range: Range = new Range(0, 0);

  @Input()
  set range(value: Range) {
    if (value && !this.scrolling) {
      if (!value.isEqual(this._range)) {
        this._range = value;
        this.userScrolled = false;
        this.elementRef.nativeElement.scrollTop = this._range.skip * this.itemHeight;
        console.log(`VirtualScrollComponent set range ${JSON.stringify(this._range)}`);
      }
    }
  }

  public scrollHeight: number = 0;

  public scrollTop: number = 0;

  private scrollChange: number = 0;

  private lastScrollChange: number = 0;

  private scrollDirection: number = 0;

  private lastScrollDirection: number = 0;

  public numVisibleItems: number = 0;

  @ViewChild('listContainer')
  private listContainer: ElementRef;

  @ContentChild(VirtualScrollItemDirective, {read: TemplateRef}) virtualScrollItemTemplate;

  private rangeSubject: Subject<Range> = new Subject<Range>();
  
  @Output() rangeChanged: EventEmitter<Range> = new EventEmitter<Range>();

  @Output() displayRangeChanged: EventEmitter<Range> = new EventEmitter<Range>();

  private selectedItem: Item;

  private selectedItemSubject: Subject<Item> = new Subject<Item>();
  
  @Output() selectedItemChanged: EventEmitter<Item> = new EventEmitter<Item>();

  private marginTop: number = 0;

  private scrolling: boolean = false;

  @Output() scrollingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  userScrolled: boolean = true;
  
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.updateScrollHeight();
    this.rangeSubject.debounceTime(250).subscribe(range => {
      this._range = range;
      this.updateScrolling(false);
      this.rangeChanged.emit(this._range);
    });
    this.selectedItemSubject.debounceTime(250).subscribe(item => {
      this.selectedItem = item;
      this.selectedItemChanged.emit(this.selectedItem);
    });
  }

  ngAfterViewInit() {
    this.updateScrollHeight();
    this.updateNumVisibleItems()
    this.updateRange();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.updateScrollHeight();
    this.updateNumVisibleItems();
    this.updateRange();
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    let lastScrollTop = this.scrollTop;
    this.scrollTop = event.srcElement.scrollTop;

    if (this.userScrolled) {
      this.updateScrolling(true);
      this.marginTop += lastScrollTop - this.scrollTop;
      
      if (this.scrollDirection === 0) {
        this.lastScrollChange = this.scrollChange;
        this.scrollChange = lastScrollTop - this.scrollTop;
        this.lastScrollDirection = this.scrollDirection;
        if (this.lastScrollChange >= 0 && this.scrollChange < 0) {
          this.scrollDirection = -1;
        } else if (this.lastScrollChange <= 0 && this.scrollChange > 0) {
          this.scrollDirection = 1;
        }
      }
            
    }

    this.updateRange();
    this.userScrolled = true;
  }

  public onSelectedItemClick(item, viewIndex) {
    if (this.selectedItem) {
      if (this.selectedItem.item[this.itemKey] !== item[this.itemKey]) {
        this.selectedItemSubject.next(new Item(item, viewIndex));
      }
    } else {
      this.selectedItemSubject.next(new Item(item, viewIndex));
    }
  }

  private updateScrollHeight() {
    console.log('VirtualScrollComponent updateScrollHeight()');
    this.scrollHeight = this._listLength * this.itemHeight;
  }

  private updateNumVisibleItems() {
    this.numVisibleItems = Math.ceil(this.listContainer.nativeElement.offsetHeight / this.itemHeight);
  }

  private updateRange() {
    let range = new Range(Math.floor(this.scrollTop / this.itemHeight), this.numVisibleItems);
    this.rangeSubject.next(range);
    this.displayRangeChanged.emit(range)
  }

  private updateScrolling(scrolling: boolean) {
    if (this.scrolling !== scrolling) {
      this.scrolling = scrolling;
      this.scrollingChanged.emit(this.scrolling);
    }
  }

}
