import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainLayoutModule } from '../layouts/main-layout/main-layout.component';
import { BooksRoutingModule } from './books-routing.module';
import { BooksComponent } from './books.component';

@NgModule({
  declarations: [BooksComponent],
  imports: [BooksRoutingModule, CommonModule, MainLayoutModule],
})
export class BooksModule {}
