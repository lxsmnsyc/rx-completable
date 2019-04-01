/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#doOnComplete', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().doOnComplete(() => {});
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Completable.complete();
    const completable = source.doOnComplete();
    assert(source === completable);
  });
  /**
   *
   */
  it('should call the given function on error.', (done) => {
    let called;
    const source = Completable.complete();
    const completable = source.doOnComplete(() => { called = true; });
    completable.subscribe(
      () => done(false),
      () => called && done(),
    );
  });
});
