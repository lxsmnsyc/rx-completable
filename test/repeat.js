/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';


/**
 *
 */
describe('#repeat', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().repeat(100);
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if the amount is not a number and not undefined.', () => {
    const source = Completable.complete();
    const completable = source.repeat('Hello');
    assert(source === completable);
  });
  /**
   *
   */
  it('should return the same instance if the amount is a number and not positive', () => {
    const source = Completable.complete();
    const completable = source.repeat(-1);
    assert(source === completable);
  });
  /**
   *
   */
  it('should repeat with the given amount', (done) => {
    let count = 0;
    const source = Completable.complete().doOnComplete(() => { count += 1; });
    const completable = source.repeat(3);
    completable.subscribe(
      () => (count === 3 ? done() : done(false)),
      () => done(false),
    );
  });
});
