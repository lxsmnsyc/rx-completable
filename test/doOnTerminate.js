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
  describe('#doOnTerminate', () => {
    /**
     *
     */
    it('should create a Completable', () => {
      const completable = Completable.complete().doOnTerminate(() => {});
      assert(completable instanceof Completable);
    });
    /**
     *
     */
    it('should return the same instance if the method received a non-function parameter.', () => {
      const source = Completable.complete();
      const completable = source.doOnTerminate();
      assert(source === completable);
    });
    /**
     *
     */
    it('should call the given function on success.', (done) => {
      let called;
      const source = Completable.complete();
      const completable = source.doOnTerminate(() => { called = true; });
      completable.subscribe(
        () => called && done(),
        () => done(false),
      );
    });
    /**
     *
     */
    it('should call the given function on error.', (done) => {
      let called;
      const source = Completable.error(new Error('Hello'));
      const completable = source.doOnTerminate(() => { called = true; });
      completable.subscribe(
        () => done(false),
        () => called && done(),
      );
    });
  });
});
