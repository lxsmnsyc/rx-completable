/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#doOnCancel', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().doOnCancel(() => {});
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if the method received a non-function parameter.', () => {
    const source = Completable.complete();
    const completable = source.doOnCancel();
    assert(source === completable);
  });
  /**
   *
   */
  it('should signal the complete then fire cancel callback.', (done) => {
    let called;
    const source = Completable.complete();
    const completable = source.doOnCancel(() => called && done());

    const controller = completable.subscribe(
      () => { called = true; },
      () => done(false),
    );
    controller.cancel();
  });
  /**
   *
   */
  it('should signal the error value then fire cancel callback.', (done) => {
    let called;
    const source = Completable.error(new Error('Hello'));
    const completable = source.doOnCancel(() => called && done());

    const controller = completable.subscribe(
      () => done(false),
      () => { called = true; },
    );
    controller.cancel();
  });
  /**
   *
   */
  it('should call the given function on cancel.', (done) => {
    const source = Completable.complete().delay(100);
    const completable = source.doOnCancel(() => done());

    const controller = completable.subscribe(
      () => done(false),
      () => done(false),
    );
    controller.cancel();
  });
});
