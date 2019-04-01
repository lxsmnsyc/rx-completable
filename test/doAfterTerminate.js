/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#doAfterTerminate', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().doAfterTerminate(() => {});
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Completable.complete();
    const completable = source.doAfterTerminate();
    assert(source === completable);
  });
  /**
   *
   */
  it('should call the given function after complete.', (done) => {
    let called;
    const source = Completable.complete();
    const completable = source.doAfterTerminate(() => called && done());
    completable.subscribe(
      () => { called = true; },
      () => done(false),
    );
  });
  /**
   *
   */
  it('should call the given function after error.', (done) => {
    let called;
    const source = Completable.error(new Error('Hello'));
    const completable = source.doAfterTerminate(() => called && done());
    completable.subscribe(
      () => done(false),
      () => { called = true; },
    );
  });
});
