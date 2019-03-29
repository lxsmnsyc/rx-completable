/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('Completable', () => {
  /**
   *
   */
  describe('#delaySubscription', () => {
    /**
     *
     */
    it('should create a Completable', () => {
      const completable = Completable.complete().delaySubscription(100);
      assert(completable instanceof Completable);
    });
    /**
     *
     */
    it('should return the same instance if the amount is not a number.', () => {
      const source = Completable.complete();
      const completable = source.delaySubscription();
      assert(source === completable);
    });
    /**
     *
     */
    it('should signal success with the given value.', (done) => {
      const completable = Completable.complete().delaySubscription(100);
      completable.subscribe(
        x => (x === 'Hello' ? done() : done(false)),
        x => done(x),
      );
    });
    /**
     *
     */
    it('should signal error with the given value.', (done) => {
      const completable = Completable.error(new Error('Hello')).delaySubscription(100);
      completable.subscribe(
        x => done(x),
        x => (x === 'Hello' ? done() : done(false)),
      );
    });
    /**
     *
     */
    it('should not signal success if aborted.', (done) => {
      const source = Completable.complete().delaySubscription(100);
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
      const source = Completable.error(new Error('Hello')).delaySubscription(100);
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
});
