const Interval = require('./interval');

describe('overlaps', function () {
    let intervalGenerale = new Interval(5,6);

    test('Test interval overlaps valeur return true', () => {
	let interval2 = new Interval(5,6);
        expect(intervalGenerale.overlaps(interval2)).toBe(true)
    });
    test('Test interval overlaps valeur return false', () => {
	let interval2 = new Interval(1,3);
        expect(intervalGenerale.overlaps(interval2)).toBe(false)
    });
});


describe('includes', function () {
    let intervalGenerale = new Interval(4,8);

    test('Test interval total includes - return true', () => {
	let interval2 = new Interval(4,8);
        expect(intervalGenerale.includes(interval2)).toBe(true)
    });

    test('Test interval  includes - return true', () => {
	let interval2 = new Interval(5,6);
        expect(intervalGenerale.includes(interval2)).toBe(true)
    });
    test('Test interval total includes - return false', () => {
	let interval2 = new Interval(1,3);
        expect(intervalGenerale.includes(interval2)).toBe(false)
    });
    test('Test interval includes - return false', () => {
	let interval2 = new Interval(1,5);
        expect(intervalGenerale.includes(interval2)).toBe(false)
    });
});