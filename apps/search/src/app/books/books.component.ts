import { BookSummary } from '@/api';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { OBSERVE, ObserveFn, OBSERVE_PROVIDER } from 'ng-observe';
import { combineLatest, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { debounceTime, startWith, switchMap, tap } from 'rxjs/operators';
import { BOOKS_PAGINATOR } from './books.paginator';
import { BooksService, BooksState } from './state';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  viewProviders: [OBSERVE_PROVIDER],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksComponent implements OnInit, OnDestroy {
  qControl!: FormControl;
  maxResultsControl!: FormControl;
  orderByControl!: FormControl;
  pagination$!: Observable<PaginationResponse<BookSummary>>;
  isLoading = this.observe(this.paginatorRef.isLoading$);

  trackByFn: TrackByFunction<BookSummary> = (_, book) => book.id;

  constructor(
    private booksService: BooksService,
    @Inject(OBSERVE) private observe: ObserveFn,
    @Inject(BOOKS_PAGINATOR) public paginatorRef: PaginatorPlugin<BooksState>
  ) {}

  ngOnDestroy() {
    this.paginatorRef.destroy();
  }

  ngOnInit() {
    const qInit = this.getPaginatorMetadata('q', '');
    const maxResultsInit = this.getPaginatorMetadata('maxResults', 10);
    const orderByInit = this.getPaginatorMetadata('orderBy', 'relevance');

    this.qControl = new FormControl(qInit);
    this.orderByControl = new FormControl(orderByInit);
    this.maxResultsControl = new FormControl(maxResultsInit);

    const q$ = this.qControl.valueChanges.pipe(
      startWith<string>(qInit),
      this.tapResetPage()
    );
    const orderBy$ = this.orderByControl.valueChanges.pipe(
      startWith<string>(orderByInit),
      this.tapResetPage()
    );
    const maxResults$ = this.maxResultsControl.valueChanges.pipe(
      startWith<number>(maxResultsInit)
    );

    this.pagination$ = combineLatest([
      this.paginatorRef.pageChanges,
      combineLatest([q$, orderBy$, maxResults$]).pipe(
        tap()
        /**
         * I would have cleared the cache in the `tap` operator above
         * and not after every page change.
         * However, somehow, the previous page button
         * breaks the cache that Akita keeps.
         *
         * So, I will cache responses with a service worker instead.
         */
      ),
    ]).pipe(
      debounceTime(500),
      tap(() => this.paginatorRef.clearCache()), // please see the comment above
      switchMap(([page, [q, orderBy, maxResults]]) => {
        this.setPaginatorMetadata('q', q);
        this.setPaginatorMetadata('orderBy', orderBy);
        this.setPaginatorMetadata('maxResults', maxResults);

        const startIndex = Math.max(0, page - 1) * maxResults;

        const req = () =>
          this.booksService.search({ q, orderBy, maxResults, startIndex });
        return this.paginatorRef.getPage(req);
      })
    );
  }

  setMaxResults(pageSize: number) {
    if (this.maxResultsControl.value === pageSize) return;
    this.maxResultsControl.setValue(pageSize);
  }

  private getPaginatorMetadata<Key extends MetadataKey>(
    key: Key,
    defaultValue: MetadataValue<Key>
  ): MetadataValue<Key> {
    return this.paginatorRef.metadata.get(key) ?? defaultValue;
  }

  private setPaginatorMetadata<Key extends MetadataKey>(
    key: Key,
    value: MetadataValue<Key>
  ): void {
    this.paginatorRef.metadata.set(key, value);
  }

  private tapResetPage<T>(): MonoTypeOperatorFunction<T> {
    return tap<T>(() => this.paginatorRef.setFirstPage());
  }
}

type MetadataKey = 'q' | 'maxResults' | 'orderBy';
type MetadataValue<Key extends MetadataKey> = {
  q: string;
  orderBy: string;
  maxResults: number;
}[Key];
