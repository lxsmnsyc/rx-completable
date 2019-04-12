/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#doFinally', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().doFinally(() => {});
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Completable.complete();
    const completable = source.doFinally();
    assert(source === completable);
  });
  /**
   *
   */
  it('should call the given function after complete.', (done) => {
    let called;
    const source = Completable.complete();
    const completable = source.doFinally(() => called && done());
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
    const completable = source.doFinally(() => called && done());
    completable.subscribe(
      () => done(false),
      () => { called = true; },
    );
  });
  /**
   *
   */
  it('should call the given function on cancel.', (done) => {
    const source = Completable.timer(100);
    const completable = source.doFinally(() => done());

    const controller = completable.subscribe(
      () => done(false),
      () => done(false),
    );
    controller.cancel();
  });
});
