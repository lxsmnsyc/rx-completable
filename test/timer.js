/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#timer', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.timer(100);
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should signal error if amount is not a number.', (done) => {
    const completable = Completable.timer();

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal complete', (done) => {
    const completable = Completable.timer(100);
    completable.subscribe(
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should not signal complete if cancelled.', (done) => {
    const completable = Completable.timer(100);
    const controller = completable.subscribe(
      () => done(false),
      () => done(false),
    );


    controller.cancel();
    if (controller.cancelled) {
      done();
    }
  });
});
