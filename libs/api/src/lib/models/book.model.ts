import type { books_v1 } from 'googleapis';

export type BookSearchParams = Pick<
  books_v1.Params$Resource$Volumes$List,
  'q' | 'startIndex' | 'maxResults'
>;

export type BookSearchResponse = Pick<
  books_v1.Schema$Volumes,
  'items' | 'totalItems'
>;

export class BookSummaryResponse {
  constructor(
    public readonly items: BookSummary[] = [],
    public readonly totalItems: number = 0
  ) {}

  static create({ items, totalItems }: BookSearchResponse) {
    if (!items) return new BookSummaryResponse();

    const summaries = items.map(BookSummary.create);

    return new BookSummaryResponse(summaries, totalItems || summaries.length);
  }
}

export class BookSummary {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly authors: string[],
    public readonly thumbnail?: string,
    public readonly publishedDate?: string
  ) {}

  static create({ id, volumeInfo }: books_v1.Schema$Volume) {
    const { title, authors = [], imageLinks = {}, publishedDate } = volumeInfo!;

    return new BookSummary(
      id!,
      title!,
      authors,
      imageLinks.thumbnail,
      publishedDate
    );
  }
}
