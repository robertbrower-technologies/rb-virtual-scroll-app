import { Component, EventEmitter, HostListener, Input, Output, OnInit, AfterViewInit, OnChanges, SimpleChanges, ContentChild, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/debounceTime';

import { Range } from './range';
import { Item } from './item';
import { VirtualScrollItemDirective } from './virtual-scroll-item.directive';
import { VirtualScrollItems } from './virtual-scroll-items';

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

  @Input()
  public listLength: number = 0;

  @Input()
  public items: VirtualScrollItems = new VirtualScrollItems();

  public scrollHeight: number = 0;

  public scrollTop: number = 0;

  public numVisibleItems: number = 0;

  @ViewChild('listContainer')
  private listContainer: ElementRef;

  @ContentChild(VirtualScrollItemDirective, {read: TemplateRef}) virtualScrollItemTemplate;

  private range: Range;

  private rangeSubject: Subject<Range> = new Subject<Range>();
  
  @Output() rangeChanged: EventEmitter<Range> = new EventEmitter<Range>();

  @Output() displayRangeChanged: EventEmitter<Range> = new EventEmitter<Range>();

  private selectedItem: Item;

  private selectedItemSubject: Subject<Item> = new Subject<Item>();
  
  @Output() selectedItemChanged: EventEmitter<Item> = new EventEmitter<Item>();

  marginTop: number = 0;

  scrolling: boolean = false;

  userScrolled: boolean = true;
  
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.scrollHeight = this.listLength * this.itemHeight;
    this.rangeSubject.debounceTime(250).subscribe(range => {
      this.range = range;
      if (this.selectedItem) {
        this.updateSelectedItem();
      }
      this.rangeChanged.emit(this.range);
      this.scrolling = false;
    });
    this.selectedItemSubject.debounceTime(250).subscribe(item => {
      this.selectedItem = item;
      this.selectedItemChanged.emit(this.selectedItem);
    });
  }

  ngAfterViewInit() {
    this.updateNumVisibleItems()
    this.updateRange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.scrolling) {
      if (changes.items && changes.items.currentValue.range) {
        this.marginTop = this.marginTop % this.itemHeight;
        if (!changes.items.currentValue.range.isEqual(this.range)) {
          this.userScrolled = false;
          this.elementRef.nativeElement.scrollTop = changes.items.currentValue.range.skip * this.itemHeight;
        }
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.updateNumVisibleItems();
    this.updateRange();
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    this.scrolling = true;
    let lastScrollTop = this.scrollTop;
    this.scrollTop = event.srcElement.scrollTop;

    if (this.userScrolled) {
      this.marginTop += lastScrollTop - this.scrollTop;  
    }

    this.updateRange();
    this.userScrolled = true;
  }
  
  private updateNumVisibleItems() {
    this.numVisibleItems = Math.ceil(this.listContainer.nativeElement.offsetHeight / this.itemHeight);
  }

  private updateRange() {
    let range = new Range(Math.floor(this.scrollTop / this.itemHeight), this.numVisibleItems);
    this.rangeSubject.next(range);
    this.displayRangeChanged.emit(range)
  }

  private onSelectedItemClick(item, index) {
    if (this.selectedItem && this.selectedItem.item[this.itemKey] === item[this.itemKey]) {
      this.selectedItemSubject.next(null);
    } else {
      this.selectedItemSubject.next(new Item(item, index, this.range));
    }
  }

  private updateSelectedItem() {
    if (this.selectedItem) {
      this.selectedItemSubject.next(new Item(this.selectedItem.item, this.selectedItem.index, this.range));
    }
  }

}
