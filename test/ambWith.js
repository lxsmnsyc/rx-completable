/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#ambWith', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().ambWith(Completable.complete());
    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if the other value is non-Completable', () => {
    const source = Completable.complete();
    const completable = source.ambWith();
    assert(source === completable);
  });
  /**
   *
   */
  it('should signal success from the source (if earlier)', (done) => {
    const completable = Completable.complete().ambWith(Completable.timer(100));
    completable.subscribe(
      () => done(),
      done,
    );
  });
  /**
   *
   */
  it('should signal success from the other (if earlier).', (done) => {
    const completable = Completable.timer(100).ambWith(Completable.complete());
    completable.subscribe(
      () => done(),
      done,
    );
  });
  /**
   *
   */
  it('should signal error from the source (if earlier).', (done) => {
    const completable = Completable.error(new Error('Hello')).ambWith(Completable.timer(100));
    completable.subscribe(
      done,
      e => (e instanceof Error ? done() : done(false)),
    );
  });
  /**
   *
   */
  it('should signal error from the other (if earlier).', (done) => {
    const completable = Completable.timer(100).ambWith(Completable.error(new Error('Hello')));
    completable.subscribe(
      done,
      e => (e instanceof Error ? done() : done(false)),
    );
  });
});
