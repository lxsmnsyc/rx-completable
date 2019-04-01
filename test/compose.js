/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

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
    const completable = Completable.complete().compose(source => source.delay(100));

    assert(completable instanceof Completable);
  });
  /**
     *
     */
  it('should correctly signal the composed Completable', (done) => {
    const completable = Completable.complete().compose(source => source.delay(100));

    completable.subscribe(
      () => done(),
      () => done(false),
    );
  });
  /**
     *
     */
  it('should signal error if the transformer function returned a non-Completable', (done) => {
    const completable = Completable.complete().compose(() => undefined);

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
