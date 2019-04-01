/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';


/**
 *
 */
describe('#repeatUntil', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().repeatUntil(100);
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should repeatUntil with the predicate returns true', (done) => {
    let count = 0;
    const source = Completable.complete().doOnComplete(() => { count += 1; });
    const completable = source.repeatUntil(() => count === 3);
    completable.subscribe(
      () => (count === 3 ? done() : done(false)),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should emit error', (done) => {
    const source = Completable.error(new Error('Hello'));
    const completable = source.repeatUntil(() => false);
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
