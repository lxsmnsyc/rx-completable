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
  describe('#doOnAbort', () => {
    /**
     *
     */
    it('should create a Completable', () => {
      const completable = Completable.complete().doOnAbort(() => {});
      assert(completable instanceof Completable);
    });
    /**
     *
     */
    it('should return the same instance if the method received a non-function parameter.', () => {
      const source = Completable.complete();
      const completable = source.doOnAbort();
      assert(source === completable);
    });
    /**
     *
     */
    it('should signal the success value then fire abort callback.', (done) => {
      let called;
      const source = Completable.complete();
      const completable = source.doOnAbort(() => called && done());

      const controller = completable.subscribe(
        () => { called = true; },
        done,
      );
      controller.abort();
    });
    /**
     *
     */
    it('should signal the error value then fire abort callback.', (done) => {
      let called;
      const source = Completable.error(new Error('Hello'));
      const completable = source.doOnAbort(() => called && done());

      const controller = completable.subscribe(
        done,
        () => { called = true; },
      );
      controller.abort();
    });
    /**
     *
     */
    it('should call the given function on abort.', (done) => {
      const source = Completable.complete().delay(100);
      const completable = source.doOnAbort(() => done());

      const controller = completable.subscribe(
        done,
        done,
      );
      controller.abort();
    });
  });
});
