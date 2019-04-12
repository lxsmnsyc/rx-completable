/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';


/**
 *
 */
describe('#timeout', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().timeout(100);
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if the amount is not a number.', () => {
    const source = Completable.complete();
    const completable = source.timeout();
    assert(source === completable);
  });
  /**
   *
   */
  it('should signal complete with the given value.', (done) => {
    const completable = Completable.complete().timeout(100);
    completable.subscribe(
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error with the given value.', (done) => {
    const completable = Completable.error('Hello').timeout(100);
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if the Completable does complete after the given timeout.', (done) => {
    const completable = Completable.timer(200).timeout(100);
    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should not signal complete if cancelled.', (done) => {
    const source = Completable.timer(200).timeout(100);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
    );

    controller.cancel();
    if (controller.cancelled) {
      done();
    }
  });
  /**
   *
   */
  it('should not signal error if cancelled.', (done) => {
    const source = Completable.error(new Error('Hello')).delay(200).timeout(100);
    const controller = source.subscribe(
      () => done(false),
      () => done(false),
    );

    controller.cancel();
    if (controller.cancelled) {
      done();
    }
  });
});
