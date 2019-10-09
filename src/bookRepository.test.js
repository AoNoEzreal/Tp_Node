const BookRepository = require('../../src/book.repository');

describe('save method', () => {
    test('should run the db write method once', () => {
        const dbMock = {
            get: jest.fn().mockReturnThis(),
            push: jest.fn().mockReturnThis(),
            write: jest.fn()
        };
        const repository = new BookRepository(dbMock);
        repository.save({id: 1, name: "Unit test", price: 9.99, added_at: '2019-09-12'});

        expect(dbMock.write.mock.calls.length).toBe(1);
    });
  
    test.each([
        [{name: "test book", price: 9.99, added_at: "2019-10-01"}, "no id field"],
        [{id: 1, price: 9.99, added_at: "2019-10-01"}, "no name field"],
        [{id: 1, name: "test book", added_at: "2019-10-01"}, "no price field"],
        [{id: 1, name: "test book", price: 9.99}, "no added_at field"],
        [{id: 1, name: "test book", price: 9.99, added_at:"2019-10-01", editor: "test editor"}, "additional field"]
    ])('should throw when book json object is not formed correctly (%p : %s)', (book) => {
        const dbMock = {
            get: jest.fn().mockReturnThis(),
            push: jest.fn().mockReturnThis(),
            write: jest.fn()
        };
        const repository = new BookRepository(dbMock);

        expect(() => repository.save(book)).toThrow();
    });
});

describe('getTotalCount method', () => {
    test('db should contain 7 books', () => {
        const dbMock = {
            get: jest.fn().mockReturnThis(),
            size: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue(7)
        };
        const repository = new BookRepository(dbMock);

        expect(repository.getTotalCount()).toBe(7);
    });
});

describe('getTotalPrice method', () => {
    test('books total price should be 25.74', () => {
        const dbMock = {
            get: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue([
                {id: 1, name: "Unit test1", price: 5.99},
                {id: 2, name: "Unit test2", price: 6.89},
                {id: 3, name: "Unit test3", price: 3.57},
                {id: 4, name: "Unit test4", price: 4.99},
                {id: 5, name: "Unit test5", price: 4.3}
            ])
        };
        const repository = new BookRepository(dbMock);

        expect(repository.getTotalPrice()).toBe(25.74);
    });
});

describe('getBookByName method', () => {
    test('should get all the books named "Pillars Of The Earth" from the db', () =>  {
        const pillarsOfTheEarthBooks =  [
            {
                id: 12,
                name: 'Pillars Of The Earth',
                price: 17.99,
                added_at: '2019-05-05'
            },
            {
                id: 13,
                name: 'Pillars Of The Earth',
                price: 17.99,
                added_at: '2019-05-05'
            },
            {
                id: 54,
                name: 'Pillars Of The Earth',
                price: 17.99,
                added_at: '2019-09-28'
            }
        ];

        const dbMock = {
            get: jest.fn().mockReturnThis(),
            find: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue(pillarsOfTheEarthBooks)
        };
        const repository = new BookRepository(dbMock);

        expect(repository.getBookByName('Pillars Of The Earth')).toBe(pillarsOfTheEarthBooks);
    });

    test('should get undefined when book does not exist', () => {
        const dbMock = {
            get: jest.fn().mockReturnThis(),
            find: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue(undefined)
        };
        const repository = new BookRepository(dbMock);

        expect(repository.getBookByName('missing_book')).toBeUndefined();
    });
});

describe('getCountBookAddedByMonth method', () => {
    test('should return a json object array of a book that has been added to the db ' +
        '10 times in 2019-01-01, 5 times in 2019-01-15 and 17 times in 2019-01-27: ' +
        '[{ year: 2019, month: 1, count: 32, count_cumulative: 32 }]', () => {

        const books = [];
        for (let i=1 ; i<11 ; ++i) {
            books.push({id: i, name: 'test', price: 9.99, added_at: '2019-01-01'});
        }
        for (let i=11 ; i<16 ; ++i) {
            books.push({id: i, name: 'test', price: 9.99, added_at: '2019-01-15'});
        }
        for (let i=16 ; i<33 ; ++i) {
            books.push({id: i, name: 'test', price: 9.99, added_at: '2019-01-27'});
        }

        const dbMock = {
            get: jest.fn().mockReturnThis(),
            filter: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue(books)
        };
        const repository = new BookRepository(dbMock);

        expect(repository.getCountBookAddedByMonth('test')).toEqual(
            [
                { year: 2019, month: 1, count: 32, count_cumulative: 32 }
            ]);
    });

    test('should return a json object array of a book that has been added to the db ' +
        '3 times in 2019-04-05, 2 times in 2019-09-19 and 1 time in 2019-12-12:\n' +
        '[{ year: 2019, month: 4, count: 3, count_cumulative: 3 },\n' +
        ' { year: 2019, month: 9, count: 2, count_cumulative: 5 },\n' +
        ' { year: 2019, month: 12, count: 1, count_cumulative: 6 }]', () => {

        const books = [];
        for (let i=1 ; i<4 ; ++i) {
            books.push({id: i, name: 'test', price: 9.99, added_at: '2019-04-05'});
        }
        for (let i=4 ; i<6 ; ++i) {
            books.push({id: i, name: 'test', price: 9.99, added_at: '2019-09-19'});
        }
        for (let i=6 ; i<7 ; ++i) {
            books.push({id: i, name: 'test', price: 9.99, added_at: '2019-12-12'});
        }

        const dbMock = {
            get: jest.fn().mockReturnThis(),
            filter: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue(books)
        };
        const repository = new BookRepository(dbMock);

        expect(repository.getCountBookAddedByMonth('test')).toEqual(
            [
                { year: 2019, month: 4, count: 3, count_cumulative: 3 },
                { year: 2019, month: 9, count: 2, count_cumulative: 5 },
                { year: 2019, month: 12, count: 1, count_cumulative: 6 }
            ]);
    });

    test('should return a json object array of a book that has been added to the db ' +
        '10 times in 2018-07-17 and 7 times in 2019-02-15:\n' +
        '[{ year: 2018, month: 7, count: 10, count_cumulative: 10 },\n' +
        ' { year: 2019, month: 2, count: 7, count_cumulative: 17 }', () => {

        const books = [];
        for (let i = 1; i < 11; ++i) {
            books.push({id: i, name: 'test', price: 9.99, added_at: '2018-07-17'});
        }
        for (let i = 11; i < 18; ++i) {
            books.push({id: i, name: 'test', price: 9.99, added_at: '2019-02-15'});
        }

        const dbMock = {
            get: jest.fn().mockReturnThis(),
            filter: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue(books)
        };
        const repository = new BookRepository(dbMock);

        expect(repository.getCountBookAddedByMonth('test')).toEqual(
            [
                {year: 2018, month: 7, count: 10, count_cumulative: 10},
                {year: 2019, month: 2, count: 7, count_cumulative: 17}
            ]);
    });

    test('should throw when book is not present in the db', () => {
        const dbMock = {
            get: jest.fn().mockReturnThis(),
            filter: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue([])
        };
        const repository = new BookRepository(dbMock);

        expect(() => {
            repository.getCountBookAddedByMonth('missing_book');
        }).toThrow();
    });
});