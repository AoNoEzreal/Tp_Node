class BookRepository {

    /**
     * @param db
     */
    constructor(db) {
        this.db = db;
    }

    save (book) {
        this.db.get('books').push(book).write();
    }

    /**
     * Nombre total de livre
     */
    getTotalCount() {
        return this.db.get('books').size().value();
    }

    /**
     * Somme du prix de tous les livre
     */
    getTotalPrice() {
        let totalPrice = 0;
        this.db.get('books').value().forEach(book => {
            totalPrice += book.price;
        });
        return totalPrice;
    }


    /**
     * Retourne un livre
     */
    getBookByName(bookName) {
        return this.db.get('books').find({name: bookName}).value();
    }

    /**
     * Nombre de livre ajouté par mois
     *
     *  [
     *      {
     *          year: 2017,
     *          month, 2,
     *          count, 129,
     *          count_cumulative: 129
     *      },
     *      {
     *          year: 2017,
     *          month, 3,
     *          count, 200,
     *          count_cumulative: 329
     *      },
     *      ....
     *  ]
     */
    getCountBookAddedByMonth(bookName) {
        const books = this.db.get('books').filter({name: bookName}).value();
        if (books.length === 0) {
            throw 'Book is not present in the database';
        }

        const results = [];
        let year;
        let month;
        let count = 0;
        let count_cumulative = 0;

        books.forEach(book => {
            count = 0;
            year = new Date(book.added_at).getFullYear();
            month = new Date(book.added_at).getMonth()+1;
            count = books.filter(book =>
                new Date(book.added_at).getFullYear() === year
                &&
                new Date(book.added_at).getMonth()+1 === month
            ).length;

            if (results.filter(result => result.year === year && result.month === month).length === 0) {
                count_cumulative += count;
                results.push({year, month, count, count_cumulative});
            }
        });
        return results;
    }

}


module.exports = BookRepository;