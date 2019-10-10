const BookRepository = require('./book.repository');

describe('Book repository Save', function () {

    test('Save a book', () => {

        const dbMock = {
            get : jest.fn().mockReturnThis(),
            push : jest.fn().mockReturnThis(),
            write : jest.fn().mockReturnThis()
        };
        const repository = new BookRepository(dbMock);
        repository.save({id: 1, name: "Unit test"});

        expect(dbMock.write.mock.calls.length).toBe(1);
    });
    
});

describe('Book repository getTotalCount',  () => {
    test('Get total books count ',() => {
        const dbMock = {
            get: jest.fn().mockReturnThis(),
            size: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue(12)
        };
        const repository = new BookRepository(dbMock);
        expect(repository.getTotalCount()).toBe(12);
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
    test('should get all the books named "Harry Potter" from the db', () =>  {
        const hpotter =  [
            {
                id: 12,
                name: 'Harry Potter',
                price: 17.99,
                added_at: '2019-05-05'
            },
            {
                id: 13,
                name: 'Harry Potter',
                price: 17.99,
                added_at: '2019-05-05'
            },
            {
                id: 54,
                name: 'Harry Potter',
                price: 17.99,
                added_at: '2019-05-05'
            }
        ];

        const dbMock = {
            get: jest.fn().mockReturnThis(),
            find: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue(hpotter)
        };
        const repository = new BookRepository(dbMock);

        expect(repository.getBookByName('Harry Potter')).toBe(hpotter);
    });
});

describe('getCountBookAddedByMonth method', () => {
    test('should return a json object array of a book that has been added to the db all the same month\n' +
        '   -4 times in 2019-01-04\n'+
        '   -5 times in 2019-01-05\n'+
        '   -6 times in 2019-01-06\n' +
        '[{ year: 2019, month: 1, count: 15, count_cumulative: 15 }]', () => {

        const books = [];
        for (let i=1 ; i<5 ; i++) {
            books.push({id: i, name: 'Harry Potter', price: 6.66, added_at: '2019-01-04'});
        }
        for (let i=5 ; i<10 ; i++) {
            books.push({id: i, name: 'Harry Potter', price: 6.66, added_at: '2019-01-05'});
        }
        for (let i=10 ; i<16 ; i++) {
            books.push({id: i, name: 'Harry Potter', price: 6.66, added_at: '2019-01-06'});
        }

        const dbMock = {
            get: jest.fn().mockReturnThis(),
            filter: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue(books)
        };
        const repository = new BookRepository(dbMock);

        expect(repository.getCountBookAddedByMonth('Harry Potter')).toEqual(
            [
                { year: 2019, month: 1, count: 15, count_cumulative: 15 }
            ]);
    });

    test('should return a json object array of a book that has been added to the db not the same month\n' +
        '   -3 times in 2019-01-10\n'+
        '   -2 times in 2019-02-20\n'+
        '   -1 time  in 2019-03-30\n'+
        '[{ year: 2019, month: 1, count: 3, count_cumulative: 3 },\n' +
        ' { year: 2019, month: 2, count: 2, count_cumulative: 5 },\n' +
        ' { year: 2019, month: 3, count: 1, count_cumulative: 6 }]', () => {

        const books = [];
        for (let i=1 ; i<4 ; i++) {
            books.push({id: i, name: 'The Witcher', price: 12.03, added_at: '2015-07-27'});
        }
        for (let i=4 ; i<6 ; i++) {
            books.push({id: i, name: 'The Witcher', price: 7.99, added_at: '2017-08-12'});
        }
        for (let i=6 ; i<7 ; i++) {
            books.push({id: i, name: 'The Witcher ', price: 17.99, added_at: '2019-08-08'});
        }

        const dbMock = {
            get: jest.fn().mockReturnThis(),
            filter: jest.fn().mockReturnThis(),
            value: jest.fn().mockReturnValue(books)
        };
        const repository = new BookRepository(dbMock);

        expect(repository.getCountBookAddedByMonth('Lor')).toEqual(
            [
                { year: 2019, month: 7, count: 3, count_cumulative: 3 },
                { year: 2019, month: 8, count: 2, count_cumulative: 5 },
                { year: 2019, month: 8, count: 1, count_cumulative: 6 }
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
            repository.getCountBookAddedByMonth('Coco');
        }).toThrow();
    });
});