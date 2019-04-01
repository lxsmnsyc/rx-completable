/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#cache', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().cache();
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should signal cached complete', (done) => {
    let flag;
    const completable = Completable.complete().delay(100).cache();

    setTimeout(() => {
      completable.subscribe(
        () => { flag = true; },
        () => done(false),
      );
      setTimeout(() => {
        completable.subscribe(
          () => (flag ? done() : done(false)),
          () => done(false),
        );
      }, 100);
    }, 200);
  });
  /**
   *
   */
  it('should signal cached error value', (done) => {
    let flag;
    const completable = Completable.error(new Error('Hello')).delay(100).cache();

    setTimeout(() => {
      completable.subscribe(
        () => done(false),
        () => { flag = true; },
      );

      setTimeout(() => {
        completable.subscribe(
          () => done(false),
          () => (flag ? done() : done(false)),
        );
      }, 100);
    }, 200);
  });
});
