/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#delay', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().delay(100);
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if the amount is not a number.', () => {
    const source = Completable.complete();
    const completable = source.delay();
    assert(source === completable);
  });
  /**
   *
   */
  it('should signal complete.', (done) => {
    const completable = Completable.complete().delay(100);
    completable.subscribe(
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error with the given value.', (done) => {
    const completable = Completable.error(new Error('Hello')).delay(100);
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should not signal complete if aborted.', (done) => {
    const source = Completable.complete().delay(100);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
    );

    controller.abort();
    if (controller.signal.aborted) {
      done();
    }
  });
  /**
   *
   */
  it('should not signal error if aborted.', (done) => {
    const source = Completable.error(new Error('Hello')).delay(100);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
    );

    controller.abort();
    if (controller.signal.aborted) {
      done();
    }
  });
});
