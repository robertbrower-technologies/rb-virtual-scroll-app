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
  public itemHeight: number = 0;

  @Input()
  public listLength: number = 0;

  @Input()
  public items: VirtualScrollItems = new VirtualScrollItems();

  public scrollHeight: number = 0;

  public scrollTop: number = 0;

  public lastScrollTop: number = 0;

  public numVisibleItems: number = 0;

  @ViewChild('listContainer')
  private listContainer: ElementRef;

  @ContentChild(VirtualScrollItemDirective, {read: TemplateRef}) virtualScrollItemTemplate;

  private range: Range;

  private rangeSubject: Subject<Range> = new Subject<Range>();
  
  @Output() rangeChanged: EventEmitter<Range> = new EventEmitter<Range>();

  @Output() displayRangeChanged: EventEmitter<Range> = new EventEmitter<Range>();

  private item: Item;

  private itemSubject: Subject<Item> = new Subject<Item>();
  
  @Output() itemChanged: EventEmitter<Item> = new EventEmitter<Item>();

  marginTop: number = 0;
  
  constructor() { }

  ngOnInit() {
    this.scrollHeight = this.listLength * this.itemHeight;
    this.rangeSubject.debounceTime(250).subscribe(range => this.rangeChanged.emit(this.range));
    this.itemSubject.debounceTime(250).subscribe(item => this.itemChanged.emit(this.item));
  }

  ngAfterViewInit() {
    this.updateNumVisibleItems()
    this.updateRange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items.currentValue.range &&
        changes.items.currentValue.range.isEqual(this.range)) {
      this.marginTop = 0;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.updateNumVisibleItems();
    this.updateRange();
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    this.lastScrollTop = this.scrollTop;
    this.scrollTop = event.srcElement.scrollTop;
    this.marginTop += this.lastScrollTop - this.scrollTop;
    this.updateRange();
  }
  
  private updateNumVisibleItems() {
    this.numVisibleItems = Math.ceil(this.listContainer.nativeElement.offsetHeight / this.itemHeight);
  }

  private updateRange() {
    this.range = new Range(Math.floor(this.scrollTop / this.itemHeight), this.numVisibleItems);
    this.rangeSubject.next(this.range);
    this.displayRangeChanged.emit(this.range)
  }

  private updateItem(item, index) {
    this.item = new Item(item, index, this.numVisibleItems);
    this.itemSubject.next(this.item);
  }

}
