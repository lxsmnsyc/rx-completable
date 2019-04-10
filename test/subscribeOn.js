/* eslint-disable no-undef */
import assert from 'assert';
import Scheduler from 'rx-scheduler';
import Completable from '../src/completable';

describe('#subscribeOn', () => {
  it('should return a Completable', () => {
    assert(Completable.complete().subscribeOn(Scheduler.current));
  });
  it('should be synchronous with non-Scheduler', (done) => {
    let flag = false;

    const completable = Completable.complete().subscribeOn();

    completable.subscribe(
      () => { flag = true; },
      done,
    );

    if (flag) {
      done();
    } else {
      done(false);
    }
  });
  it('should be synchronous with Scheduler.current', (done) => {
    let flag = false;

    const completable = Completable.complete().subscribeOn(Scheduler.current);

    completable.subscribe(
      () => { flag = true; },
      done,
    );

    if (flag) {
      done();
    } else {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.tick', (done) => {
    let flag = false;

    const completable = Completable.complete().subscribeOn(Scheduler.tick);

    completable.subscribe(
      () => { flag = true; },
      done,
    );

    process.nextTick(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.async', (done) => {
    let flag = false;

    const completable = Completable.complete().subscribeOn(Scheduler.async);

    completable.subscribe(
      () => { flag = true; },
      done,
    );

    Promise.resolve().then(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.immediate', (done) => {
    let flag = false;

    const completable = Completable.complete().subscribeOn(Scheduler.immediate);

    completable.subscribe(
      () => { flag = true; },
      done,
    );

    setImmediate(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
  it('should be asynchronous with Scheduler.timeout', (done) => {
    let flag = false;

    const completable = Completable.error(new Error('Hello World')).subscribeOn(Scheduler.timeout);

    completable.subscribe(
      done,
      () => { flag = true; },
    );

    setTimeout(() => {
      if (flag) {
        done();
      } else {
        done(false);
      }
    });

    if (flag) {
      done(false);
    }
  });
});
