import {
  BookSearchParams,
  BooksService as ApiService,
  BookSummary,
} from '@/api';
import { Injectable } from '@angular/core';
import { PaginationResponse } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BooksStore } from './books.store';

@Injectable({ providedIn: 'root' })
export class BooksService {
  constructor(private booksStore: BooksStore, private apiService: ApiService) {}

  search(
    params: BookSearchParams
  ): Observable<PaginationResponse<BookSummary>> {
    const perPage = params.maxResults!;

    return this.apiService.searchVolumes(params).pipe(
      tap((response) => this.booksStore.set(response.items)),
      map((response) => ({
        perPage,
        currentPage: Math.floor(params.startIndex! / perPage) + 1,
        lastPage: Math.floor(response.totalItems / perPage),
        data: response.items,
        total: response.totalItems,
      }))
    );
  }
}
