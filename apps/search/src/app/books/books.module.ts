import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MainLayoutModule } from '../layouts/main-layout/main-layout.component';
import { BooksRoutingModule } from './books-routing.module';
import { BooksComponent } from './books.component';
import { BOOKS_PAGINATOR, createBooksPaginator } from './books.paginator';

@NgModule({
  declarations: [BooksComponent],
  imports: [
    BooksRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  providers: [
    {
      provide: BOOKS_PAGINATOR,
      useFactory: createBooksPaginator,
    },
  ],
})
export class BooksModule {}
