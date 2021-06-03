import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BookSearchParams,
  BookSearchResponse,
  BookSummaryResponse,
} from '../models/book.model';
import { GOOGLE_API_URL } from '../tokens/api-url.token';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  public readonly apiUrl: string;
  public readonly volumesUrl: string;

  constructor(
    @Inject(GOOGLE_API_URL) baseUrl: string,
    private http: HttpClient
  ) {
    this.apiUrl = baseUrl + '/books/v1';
    this.volumesUrl = this.apiUrl + '/volumes';
  }

  searchVolumes({
    q,
    startIndex = 0,
    maxResults = 10,
    orderBy = 'relevance',
  }: BookSearchParams): Observable<BookSummaryResponse> {
    if (!q) {
      return of(new BookSummaryResponse());
    }

    return this.http
      .get<BookSearchResponse>(this.volumesUrl, {
        params: {
          q,
          startIndex,
          maxResults,
          orderBy,
          fields:
            'totalItems,items(volumeInfo/id,volumeInfo/title,volumeInfo/imageLinks/thumbnail,volumeInfo/authors,volumeInfo/publishedDate)',
          langRestrict: 'en',
        },
      })
      .pipe(map(BookSummaryResponse.create));
  }
}
