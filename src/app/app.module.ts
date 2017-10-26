import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list/list-item/list-item.component';
import { ListService } from './list.service';
import { RbVirtualScrollModule } from './rb-virtual-scroll/rb-virtual-scroll.module';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    ListItemComponent
  ],
  imports: [
    BrowserModule,
    RbVirtualScrollModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ListService],
  bootstrap: [AppComponent]
})
export class AppModule { }
