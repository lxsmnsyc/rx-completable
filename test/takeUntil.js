/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#takeUntil', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.complete().takeUntil(Completable.timer(100));

    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should return the same instance if no other Completable is provided', () => {
    const source = Completable.complete();
    const completable = source.takeUntil();

    assert(source === completable);
  });
  /**
   *
   */
  it('should signal complete if other Completable has not emitted a complete signal', (done) => {
    const completable = Completable.complete().takeUntil(Completable.timer(100));

    completable.subscribe(
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal complete if other Completable has not emitted an error signal', (done) => {
    const completable = Completable.complete().takeUntil(Completable.error(new Error('World')).delay(100));

    completable.subscribe(
      () => done(),
      () => done(false),
    );
  });
  /**
   *
   */
  it('should signal error if other Completable has emitted a complete signal', (done) => {
    const completable = Completable.complete().delay(100).takeUntil(Completable.complete());

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if other Completable has emitted an error signal', (done) => {
    const completable = Completable.complete().delay(100).takeUntil(Completable.error(new Error('World')));

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if source signals error, nonetheless', (done) => {
    const completable = Completable.error(new Error('Hello')).takeUntil(Completable.timer(100));

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
