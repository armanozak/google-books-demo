import { BookSummary } from '@/api';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface BooksState extends EntityState<BookSummary> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: 'books',
})
export class BooksStore extends EntityStore<BooksState> {
  constructor() {
    super();
  }
}
