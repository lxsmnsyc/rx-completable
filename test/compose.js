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
  describe('#compose', () => {
    /**
     *
     */
    it('should return the same instance if no function is provided', () => {
      const source = Completable.complete();
      const completable = source.compose();

      assert(source === completable);
    });
    /**
     *
     */
    it('should return a Completable from the transformer', () => {
      const completable = Completable.complete().compose(source => source.map(x => `${x} World`));

      assert(completable instanceof Completable);
    });
    /**
     *
     */
    it('should correctly signal the composed Completable', (done) => {
      const completable = Completable.complete().compose(source => source.map(x => `${x} World`));

      completable.subscribe(
        x => (x === 'Hello World' ? done() : done(x)),
        done,
      );
    });
    /**
     *
     */
    it('should signal error if the transformer function returned a non-Completable', (done) => {
      const completable = Completable.complete().compose(() => undefined);

      completable.subscribe(
        done,
        () => done(),
      );
    });
  });
});
