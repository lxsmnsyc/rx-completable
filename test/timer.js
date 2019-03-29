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
    it('should signal success 0', (done) => {
      const completable = Completable.timer(100);
      completable.subscribe(
        x => (x === 0 ? done() : done(false)),
        () => done(false),
      );
    });
    /**
     *
     */
    it('should not signal success if aborted.', (done) => {
      const completable = Completable.timer(100);
      const controller = completable.subscribe(
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
