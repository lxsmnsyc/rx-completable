/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#fromPromise', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.fromPromise(new Promise(res => res('Hello World')));
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should succeed with the given value.', (done) => {
    const completable = Completable.fromPromise(new Promise(res => res('Hello World')));

    completable.subscribe(
      x => (x === 'Hello World' ? done() : done(false)),
      e => done(e),
    );
  });
  /**
   *
   */
  it('should signal error if the given value is not Promise like', (done) => {
    const completable = Completable.fromPromise();

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
