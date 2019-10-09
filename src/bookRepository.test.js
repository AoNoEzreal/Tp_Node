const BookRepository = require('./bookRepository');

describe('save method', () => {
    test('should run the db write method once', () => {
        const dbMock = {
            get: jest.fn().mockReturnThis(),
            push: jest.fn().mockReturnThis(),
            write: jest.fn()
        };
        const repository = new BookRepository(dbMock);
        repository.save({id: 1, name: "Unit test"});

        expect(dbMock.write.mock.calls.length).toBe(1);
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