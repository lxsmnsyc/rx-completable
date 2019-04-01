/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#fromResolvable', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.fromResolvable(res => res('Hello World'));
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should succeed with the given value.', (done) => {
    const completable = Completable.fromResolvable(res => res('Hello World'));

    completable.subscribe(
      x => (x === 'Hello World' ? done() : done(false)),
      e => done(e),
    );
  });
  /**
   *
   */
  it('should signal error if the given value is not a function', (done) => {
    const completable = Completable.fromResolvable();

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
