import { BookSearchResponse, BookSummaryResponse } from '../models/book.model';

export const bookSearchResponse: BookSearchResponse = {
  items: [
    {
      id: '__id1__',
      volumeInfo: {
        title: '__title1__',
        authors: ['__author1_1__', '__author1_2__'],
        publishedDate: '2021',
        imageLinks: {
          thumbnail: '__thumbnail1__',
        },
      },
    },
    {
      id: '__id2__',
      volumeInfo: {
        title: '__title2__',
        authors: ['__author2_1__'],
      },
    },
    {
      id: '__id3__',
      volumeInfo: {
        title: '__title3__',
      },
    },
  ],
  totalItems: 3,
};

export const bookSummaryResponse: BookSummaryResponse = {
  items: [
    {
      id: '__id1__',
      title: '__title1__',
      authors: ['__author1_1__', '__author1_2__'],
      publishedDate: '2021',
      thumbnail: '__thumbnail1__',
    },
    {
      id: '__id2__',
      title: '__title2__',
      authors: ['__author2_1__'],
    },
    {
      id: '__id3__',
      title: '__title3__',
      authors: [],
    },
  ],
  totalItems: 3,
};
