import { BooksService, bookSummaryResponse } from '@/api';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BooksComponent } from './books.component';
import { BooksModule } from './books.module';
import { PAGE_SIZE_OPTIONS } from './tokens/page-size-options.token';

describe('BooksComponent', () => {
  let fixture: ComponentFixture<BooksComponent>;
  let loader: HarnessLoader;
  const bookSearchSpy = jest.fn((params: any) =>
    of(params.q ? bookSummaryResponse : { items: [], totalItems: 0 })
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
        BooksModule,
      ],
      providers: [
        {
          provide: BooksService,
          useValue: {
            searchVolumes: bookSearchSpy,
          },
        },
        {
          provide: PAGE_SIZE_OPTIONS,
          useValue: [1, 10],
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should have a card with "No data available" text on it', async () => {
    await fixture.whenStable();

    const card = await loader.getHarness(MatCardHarness);

    const text = await card.getText();

    expect(text).toBe('No data available');
  });

  it('should search books when input value changes', async () => {
    const input = await loader.getHarness(MatInputHarness);

    await input.setValue('dune');

    expect(bookSearchSpy).toHaveBeenCalledWith({
      q: 'dune',
      orderBy: 'relevance',
      maxResults: 10,
      startIndex: 0,
    });

    const cards = await loader.getAllHarnesses(MatCardHarness);

    expect(cards.length).toBe(bookSummaryResponse.totalItems);

    const titles = await Promise.all([
      cards[0].getTitleText(),
      cards[1].getTitleText(),
      cards[2].getTitleText(),
    ]);

    expect(titles[0]).toBe(bookSummaryResponse.items[0].title);
    expect(titles[1]).toBe(bookSummaryResponse.items[1].title);
    expect(titles[2]).toBe(bookSummaryResponse.items[2].title);
  });

  it('should search books when pagination changes', async () => {
    const input = await loader.getHarness(MatInputHarness);
    await input.setValue('dune');

    const paginator = await loader.getHarness(MatPaginatorHarness);
    await paginator.setPageSize(1);

    expect(bookSearchSpy).toHaveBeenCalledWith({
      q: 'dune',
      orderBy: 'relevance',
      maxResults: 1,
      startIndex: 0,
    });

    await paginator.goToNextPage();

    expect(bookSearchSpy).toHaveBeenCalledWith({
      q: 'dune',
      orderBy: 'relevance',
      maxResults: 1,
      startIndex: 1,
    });
  });

  it('should search books when sort option changes', async () => {
    const input = await loader.getHarness(MatInputHarness);
    const select = await loader.getHarness(MatSelectHarness);

    await input.setValue('dune');
    await select.open();
    const [option] = await select.getOptions({ text: 'Sort by newest' });
    await option.click();

    expect(bookSearchSpy).toHaveBeenCalledWith({
      q: 'dune',
      orderBy: 'newest',
      maxResults: 10,
      startIndex: 0,
    });
  });
});
