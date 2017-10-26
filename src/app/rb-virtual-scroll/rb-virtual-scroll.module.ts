import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';
import { VirtualScrollItemDirective } from './virtual-scroll/virtual-scroll-item.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [VirtualScrollComponent, VirtualScrollItemDirective],
  exports: [VirtualScrollComponent, VirtualScrollItemDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RbVirtualScrollModule { }
