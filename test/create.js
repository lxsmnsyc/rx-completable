/* eslint-disable no-undef */
import assert from 'assert';
import Completable from '../src/completable';

/**
 *
 */
describe('#create', () => {
  /**
   *
   */
  it('should create a Completable', () => {
    const completable = Completable.create(e => e.onComplete('Hello World'));

    assert(completable instanceof Completable);
  });
  /**
   *
   */
  it('should signal error if the create received a non-function', (done) => {
    const completable = Completable.create();

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if the emitter signals complete.', (done) => {
    const completable = Completable.create(e => e.onComplete() || e.onComplete());

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should signal error if the emitter signals error with undefined value.', (done) => {
    const completable = Completable.create(e => e.onError() || e.onError());

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
  /**
   *
   */
  it('should be aborted successfully if emitter is aborted before any signal.', (done) => {
    const completable = Completable.create((e) => {
      setTimeout(e.onComplete, 100);
    });

    const controller = completable.subscribe(
      () => done(false),
      () => done(false),
    );
    controller.abort();
    if (controller.signal.aborted) {
      done();
    }
  });
  /**
   *
   */
  it('should signal error if subscriber throws an error.', (done) => {
    const completable = Completable.create(() => {
      throw new Error('Expected');
    });

    completable.subscribe(
      () => done(false),
      () => done(),
    );
  });
});
