import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { BooksState } from './state';
import { BooksQuery } from './state/books.query';

export const BOOKS_PAGINATOR = new InjectionToken<PaginatorPlugin<BooksState>>(
  'BOOKS_PAGINATOR'
);

export function createBooksPaginator() {
  const booksQuery = inject(BooksQuery);
  return new PaginatorPlugin(booksQuery).withControls().withRange();
}
