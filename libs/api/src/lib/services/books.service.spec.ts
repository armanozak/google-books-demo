import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiModule } from '../api.module';
import { bookSearchResponse, bookSummaryResponse } from '../test/books.data';
import { BooksService } from './books.service';

describe('BooksService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: BooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ApiModule.forRoot()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BooksService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const searchCases = [
    {
      q: 'foo',
      startIndex: 10,
      expectedStartIndex: 10,
      maxResults: 10,
      expectedMaxResults: 10,
      orderBy: 'relevance',
      expectedOrderBy: 'relevance',
    },
    {
      q: 'bar',
      startIndex: 50,
      expectedStartIndex: 50,
      maxResults: 20,
      expectedMaxResults: 20,
      orderBy: 'newest',
      expectedOrderBy: 'newest',
    },
    {
      q: 'baz',
      startIndex: undefined,
      expectedStartIndex: 0,
      maxResults: undefined,
      expectedMaxResults: 40,
      orderBy: undefined,
      expectedOrderBy: 'relevance',
    },
  ];

  it.each(searchCases)(
    'should search books and return a stream of summaries %#',
    (
      { expectedStartIndex, expectedMaxResults, expectedOrderBy, ...input },
      done: any
    ) => {
      service.searchVolumes(input).subscribe((response) => {
        expect(response).toEqual(bookSummaryResponse);
        done();
      });

      const req = httpTestingController.expectOne(
        ({ url, method }) => url === service.volumesUrl && method === 'GET'
      );

      expect(req.request.params.get('q')).toBe(input.q);
      expect(req.request.params.get('startIndex')).toBe(expectedStartIndex);
      expect(req.request.params.get('maxResults')).toBe(expectedMaxResults);
      expect(req.request.params.get('orderBy')).toBe(expectedOrderBy);

      req.flush(bookSearchResponse);
    }
  );
});
