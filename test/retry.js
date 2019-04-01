/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#retry', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.error(new Error('Hello')).retry(x => x === 3);

    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should signal a complete if no error', (done) => {
    const completable = Completable.complete().retry(x => x === 3);

    completable.subscribe(
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should retry if there is an error and if it passes the predicate', (done) => {
    let retried;
    const completable = Completable.error(new Error('Hello')).retry((x) => {
      if (x === 2) {
        retried = true;
      }
      return x < 3;
    });

    completable.subscribe(
      () => done(false),
      () => retried && done(),
    );
  });
  /**
   *
   */
  it('should signal an error if predicate is false', (done) => {
    const completable = Completable.error(new Error('Hello')).retry(x => x === 3);

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
