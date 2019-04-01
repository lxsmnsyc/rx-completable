/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#error', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.error(new Error('Hello World'));

    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should error with the given value.', (done) => {
    const completable = Completable.error(new Error('Hello World'));

    completable.subscribe(
      () => done(false),
      e => (typeof e !== 'undefined' ? done() : done(false)),
    );
  });
  /**
   *
   */
  it('should error with the a message if the given value is undefined', (done) => {
    const completable = Completable.error();

    completable.subscribe(
      () => done(false),
      e => (e === 'Completable.error received an undefined value.' ? done() : done(false)),
    );
  });
  /**
   *
   */
  it('should error with the a message if the callable returned undefined', (done) => {
    const completable = Completable.error(() => {});

    completable.subscribe(
      () => done(false),
      e => (e === 'Completable.error: Error supplier returned an undefined value.' ? done() : done(false)),
    );
  });
  /**
   *
   */
  it('should error if the callable throws an error.', (done) => {
    const completable = Completable.error(() => {
      throw new Error('Expected');
    });

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
