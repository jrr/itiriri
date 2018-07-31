import { expect } from 'chai';
import { query } from '../lib/Query';
import { numberGenerator } from './helpers/generators';
import { SpyIterable } from './helpers/SpyIterable';

describe('Query', () => {
  describe('When calling constructor', () => {
    it('Should return a Query', () => {
      const source = new SpyIterable([]);
      const q = query(source);

      const methods = [
        'entries', 'keys', 'values', 'forEach', 'concat', 'prepend', 'fill',
        'toArray', 'toMap', 'toGroups', 'toSet', 'toString', 'filter', 'take',
        'skip', 'slice', 'splice', 'join', 'leftJoin', 'rightJoin', 'groupJoin',
        'sort', 'sortDesc', 'shuffle', 'reverse', 'every', 'some', 'includes',
        'distinct', 'exclude', 'intersect', 'union', 'map', 'flat', 'groupBy',
        'at', 'indexOf', 'findIndex', 'lastIndexOf', 'findLastIndex', 'count',
        'first', 'find', 'last', 'findLast', 'average', 'min',
        'max', 'sum', 'reduce', 'reduceRight',
      ];

      methods.forEach((method) => {
        expect(q).to.have.property(method);
      });

      expect(source.wasIterated).to.be.false;
    });
  });

  describe('When calling at with positive index', () => {
    it('Should return first element', () => {
      const source = new SpyIterable(numberGenerator());
      const q = query(source);

      expect(source.wasIterated).to.be.false;
      expect(q.at(3)).to.be.equal(3);
    });
  });

  describe('When calling at with negative index', () => {
    it('Should return last element', () => {
      const source = new SpyIterable(numberGenerator());
      const q = query(source).take(100);

      expect(source.wasIterated).to.be.false;
      expect(q.at(-1)).to.be.equal(99);
    });
  });

  describe('When calling skip and take', () => {
    it('Should return 4 elemens', () => {
      const source = new SpyIterable(numberGenerator(1, 2));
      const q = query(source).skip(2).take(4);

      expect(source.wasIterated).to.be.false;
      expect(q.toArray()).to.be.deep.equal([5, 7, 9, 11]);
    });

    it('Should return 1 element', () => {
      const source = new SpyIterable(numberGenerator(1, 2));
      const q = query(source).skip(10).take(1);

      expect(source.wasIterated).to.be.false;
      expect(q.at(0)).to.be.equal(21);
    });
  });

  describe('When calling entries', () => {
    it('Should return 4 key/value pairs', () => {
      const source = new SpyIterable(numberGenerator(0, 2));
      const q = query(source).take(4).entries();

      expect(source.wasIterated).to.be.false;
      expect(q.toArray()).to.be.deep.equal([[0, 0], [1, 2], [2, 4], [3, 6]]);
    });
  });

  describe('When calling keys', () => {
    it('Should return the keys', () => {
      const source = new SpyIterable(numberGenerator());
      const q = query(source).take(10).keys();

      expect(source.wasIterated).to.be.false;
      expect(q.toArray()).to.be.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('When calling values', () => {
    it('Should return a new query with same values', () => {
      const source = new SpyIterable([1, 3, 4, 2, 2]);
      const q1 = query(source);
      const q2 = q1.values();

      expect(source.wasIterated).to.be.false;
      expect(q2).to.not.be.equal(q1);
      expect(q2.toArray()).to.be.deep.equal(q1.toArray());
    });
  });

  describe('When calling forEach', () => {
    it('Should return 4 transfromed elements', () => {
      const source = new SpyIterable(numberGenerator());
      const q = query(source);
      const result = [];

      expect(source.wasIterated).to.be.false;

      q.take(4).forEach((elem, idx) => result.push(elem + 10));

      expect(result).to.be.deep.equal([10, 11, 12, 13]);
    });

    it('Should return 3 transformed elemnts', () => {
      const q = query(numberGenerator(10, 10));
      const result = [];
      q.take(3).forEach((elem, idx) => result.push(elem + idx));
      expect(result).to.be.deep.equal([
        10, 21, 32,
      ]);
    });
  });

  describe('When calling concat', () => {
    it('Should return 10 elements', () => {
      const source1 = new SpyIterable(numberGenerator(0, 2));
      const source2 = new SpyIterable(numberGenerator());
      const q1 = query(source1);
      const q2 = query(source2).take(5).concat(q1.take(5));

      expect(source1.wasIterated).to.be.false;
      expect(source2.wasIterated).to.be.false;
      expect(q2.toArray()).to.be.deep.equal([0, 1, 2, 3, 4, 0, 2, 4, 6, 8]);
    });
  });

  describe('When calling skip', () => {
    it('Should return 5 elements', () => {
      const source = new SpyIterable(numberGenerator());
      const q = query(source).skip(2).take(5);

      expect(source.wasIterated).to.be.false;
      expect(q.toArray()).to.be.deep.equal([2, 3, 4, 5, 6]);
    });
  });

  describe('When calling prepend', () => {
    it('Should return 6 elemnts', () => {
      const source1 = new SpyIterable(numberGenerator(0, 10));
      const source2 = new SpyIterable(numberGenerator(100, 100));
      const q1 = query(source1).skip(2).take(3);

      expect(source1.wasIterated).to.be.false;

      const q2 = query(source2).prepend(q1.toArray()).take(6);

      expect(source2.wasIterated).to.be.false;
      expect(q2.toArray()).to.be.deep.equal([20, 30, 40, 100, 200, 300]);
    });
  });

  describe.skip('When calling fill', () => {
    it('Should return 5 elements', () => {
      const source = new SpyIterable(numberGenerator());
      const q = query(source).fill(10, 1, 3).take(5);

      expect(source.wasIterated).to.be.false;
      expect(q.toArray()).to.be.deep.equal([0, 10, 10, 10, 4]);
    });

    it('Should return 4 elements', () => {
      const source = new SpyIterable(numberGenerator());
      const q = query(source).fill(11, 1, 1).take(4);

      expect(source.wasIterated).to.be.false;
      expect(q.toArray()).to.be.deep.equal([0, 11, 2, 3]);
    });
  });
});