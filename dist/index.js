var Completable = (function (rxCancellable, Scheduler) {
  'use strict';

  Scheduler = Scheduler && Scheduler.hasOwnProperty('default') ? Scheduler['default'] : Scheduler;

  /**
   * @ignore
   */
  // eslint-disable-next-line valid-typeof
  const isType = (x, y) => typeof x === y;
  /**
   * @ignore
   */
  const isFunction = x => isType(x, 'function');
  /**
   * @ignore
   */
  const isNumber = x => isType(x, 'number');
  /**
   * @ignore
   */
  const isObject = x => isType(x, 'object');
  /**
   * @ignore
   */
  const isNull = x => x == null;
  /**
   * @ignore
   */
  const exists = x => x != null;
  /**
   * @ignore
   */
  const isOf = (x, y) => x instanceof y;
  /**
   * @ignore
   */
  const isArray = x => isOf(x, Array);
  /**
   * @ignore
   */
  const isIterable = obj => isObject(obj) && isFunction(obj[Symbol.iterator]);
  /**
   * @ignore
   */
  const isObserver = obj => isObject(obj) && isFunction(obj.onSubscribe);
  /**
   * @ignore
   */
  const toCallable = x => () => x;
  /**
   * @ignore
   */
  const isPromise = (obj) => {
    if (obj == null) return false;
    if (isOf(obj, Promise)) return true;
    return (isObject(obj) || isFunction(obj)) && isFunction(obj.then);
  };
  /**
   * @ignore
   */
  const identity = x => x;
  /**
   * @ignore
   */
  const throwError = (x) => { throw x; };
  /**
   * @ignore
   */
  const cleanObserver = x => ({
    onSubscribe: x.onSubscribe,
    onComplete: isFunction(x.onComplete) ? x.onComplete : identity,
    onError: isFunction(x.onError) ? x.onError : throwError,
  });
  /**
   * @ignore
   */
  const immediateComplete = (o) => {
    // const disposable = new SimpleDisposable();
    const { onSubscribe, onComplete } = cleanObserver(o);
    const controller = new rxCancellable.BooleanCancellable();
    onSubscribe(controller);

    if (!controller.cancelled) {
      onComplete();
      controller.cancel();
    }
  };
  /**
   * @ignore
   */
  const immediateError = (o, x) => {
    const { onSubscribe, onError } = cleanObserver(o);
    const controller = new rxCancellable.BooleanCancellable();
    onSubscribe(controller);

    if (!controller.cancelled) {
      onError(x);
      controller.cancel();
    }
  };
  /**
   * @ignore
   */
  const defaultScheduler = sched => (
    isOf(sched, Scheduler.interface)
      ? sched
      : Scheduler.current
  );

  /**
   * @ignore
   */
  function subscribeActual(observer) {
    let err;

    try {
      err = this.supplier();

      if (isNull(err)) {
        throw new Error('Completable.error: Error supplier returned a null value.');
      }
    } catch (e) {
      err = e;
    }
    immediateError(observer, err);
  }
  /**
   * @ignore
   */
  var error = (value) => {
    let report = value;
    if (!(isOf(value, Error) || isFunction(value))) {
      report = new Error('Completable.error received a non-Error value.');
    }

    if (!isFunction(report)) {
      report = toCallable(report);
    }
    const completable = new Completable(subscribeActual);
    completable.supplier = report;
    return completable;
  };

  /**
   * @ignore
   */
  var is = y => y instanceof Completable;

  /* eslint-disable no-restricted-syntax */

  /**
   * @ignore
   */
  function subscribeActual$1(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const controller = new rxCancellable.CompositeCancellable();

    onSubscribe(controller);

    const { sources } = this;

    for (const completable of sources) {
      if (controller.cancelled) {
        return;
      }

      if (is(completable)) {
        completable.subscribeWith({
          onSubscribe(c) {
            controller.add(c);
          },
          // eslint-disable-next-line no-loop-func
          onComplete() {
            onComplete();
            controller.cancel();
          },
          onError(x) {
            onError(x);
            controller.cancel();
          },
        });
      } else {
        onError(new Error('Completable.amb: One of the sources is a non-Completable.'));
        controller.cancel();
        break;
      }
    }
  }
  /**
   * @ignore
   */
  var amb = (sources) => {
    if (!isIterable(sources)) {
      return error(new Error('Completable.amb: sources is not Iterable.'));
    }
    const completable = new Completable(subscribeActual$1);
    completable.sources = sources;
    return completable;
  };

  /* eslint-disable no-restricted-syntax */

  /**
   * @ignore
   */
  function subscribeActual$2(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { sources } = this;
    const { length } = sources;

    if (length === 0) {
      immediateError(observer, new Error('Completable.ambArray: sources Array is empty.'));
    } else {
      const controller = new rxCancellable.CompositeCancellable();

      onSubscribe(controller);

      for (let i = 0; i < length; i += 1) {
        const completable = sources[i];
        if (controller.cancelled) {
          return;
        }
        if (is(completable)) {
          completable.subscribeWith({
            onSubscribe(c) {
              controller.add(c);
            },
            onComplete() {
              onComplete();
              controller.cancel();
            },
            onError(x) {
              onError(x);
              controller.cancel();
            },
          });
        } else {
          onError(new Error('Completable.ambArray: One of the sources is a non-Completable.'));
          controller.cancel();
          break;
        }
      }
    }
  }
  /**
   * @ignore
   */
  var ambArray = (sources) => {
    if (!isArray(sources)) {
      return error(new Error('Completable.ambArray: sources is not an Array.'));
    }
    const completable = new Completable(subscribeActual$2);
    completable.sources = sources;
    return completable;
  };

  /**
   * @ignore
   */
  var ambWith = (source, other) => {
    if (!is(other)) {
      return source;
    }
    return ambArray([source, other]);
  };

  /* eslint-disable no-restricted-syntax */

  /**
   * @ignore
   */
  function subscribeActual$3(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    const { sources } = this;
    const { length } = sources;
    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i < length; i += 1) {
      const completable = sources[i];
      if (!is(completable)) {
        onError(new Error('Completable.concatArray: One of the sources is a non-Completable.'));
        controller.cancel();
        return;
      }
    }

    let counter = 0;
    const sub = () => {
      controller.unlink();
      sources[0].subscribeWith({
        onSubscribe(c) {
          controller.link(c);
        },
        onComplete() {
          counter += 1;

          if (counter === length) {
            onComplete();
          } else {
            sub();
          }
        },
        onError,
      });
    };
    sub();
  }
  /**
   * @ignore
   */
  var concatArray = (sources) => {
    if (!isArray(sources)) {
      return error(new Error('Completable.concatArray: sources is non-Array.'));
    }
    const completable = new Completable(subscribeActual$3);
    completable.sources = sources;
    return completable;
  };

  /**
   * @ignore
   */
  var andThen = (source, other) => {
    if (!is(other)) {
      return source;
    }
    return concatArray([source, other]);
  };

  /**
   * @ignore
   */
  function subscribeActual$4(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const {
      source, cached, observers, subscribed,
    } = this;

    if (!cached) {
      const index = observers.length;
      observers[index] = observer;

      const controller = new rxCancellable.BooleanCancellable();

      controller.addEventListener('cancel', () => {
        observers.splice(index, 1);
      });

      onSubscribe(controller);

      if (!subscribed) {
        source.subscribeWith({
          onSubscribe() {
            // not applicable
          },
          onComplete: () => {
            this.cached = true;

            // eslint-disable-next-line no-restricted-syntax
            for (const obs of observers) {
              obs.onComplete();
            }
            controller.cancel();
            this.observers = undefined;
          },
          onError: (x) => {
            this.cached = true;
            this.error = x;

            // eslint-disable-next-line no-restricted-syntax
            for (const obs of observers) {
              obs.onError(x);
            }
            controller.cancel();
            this.observers = undefined;
          },
        });
        this.subscribed = true;
      }
    } else {
      const controller = new rxCancellable.BooleanCancellable();
      onSubscribe(controller);

      const { error } = this;
      if (isNull(error)) {
        onError(error);
      } else {
        onComplete();
      }
      controller.cancel();
    }
  }

  /**
   * @ignore
   */
  var cache = (source) => {
    const completable = new Completable(subscribeActual$4);
    completable.source = source;
    completable.cached = false;
    completable.subscribed = false;
    completable.observers = [];
    return completable;
  };

  /**
   * @ignore
   */
  let INSTANCE;
  /**
   * @ignore
   */
  var complete = () => {
    if (isNull(INSTANCE)) {
      INSTANCE = new Completable(o => immediateComplete(o));
    }
    return INSTANCE;
  };

  /**
   * @ignore
   */
  var compose = (source, transformer) => {
    if (!isFunction(transformer)) {
      return source;
    }

    let result;

    try {
      result = transformer(source);

      if (!is(result)) {
        throw new Error('Completable.compose: transformer returned a non-Completable.');
      }
    } catch (e) {
      result = error(e);
    }

    return result;
  };

  /* eslint-disable no-restricted-syntax */

  /**
   * @ignore
   */
  function subscribeActual$5(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    const { sources } = this;

    const buffer = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const completable of sources) {
      if (is(completable)) {
        buffer.push(completable);
      } else {
        onError(new Error('Completable.concat: One of the sources is a non-Completable.'));
        controller.cancel();
        return;
      }
    }

    const { length } = buffer;
    let counter = 0;
    const sub = () => {
      controller.unlink();
      buffer[0].subscribeWith({
        onSubscribe(c) {
          controller.link(c);
        },
        onComplete() {
          counter += 1;

          if (counter === length) {
            onComplete();
          } else {
            sub();
          }
        },
        onError,
      });
    };
    sub();
  }
  /**
   * @ignore
   */
  var concat = (sources) => {
    if (!isIterable(sources)) {
      return error(new Error('Completable.concat: sources is not Iterable.'));
    }
    const completable = new Completable(subscribeActual$5);
    completable.sources = sources;
    return completable;
  };

  /**
   * Abstraction over a CompletableObserver that allows associating
   * a resource with it.
   *
   * Calling onComplete() multiple times has no effect.
   * Calling onError(Error) multiple times or after onComplete
   * has no effect.
   */
  // eslint-disable-next-line no-unused-vars
  class CompletableEmitter extends rxCancellable.Cancellable {
    constructor(complete, error) {
      super();
      /**
       * @ignore
       */
      this.complete = complete;
      /**
       * @ignore
       */
      this.error = error;

      this.link = new rxCancellable.BooleanCancellable();
    }

    /**
     * Returns true if the emitter is cancelled.
     * @returns {boolean}
     */
    get cancelled() {
      return this.link.cancelled;
    }

    /**
     * Returns true if the emitter is cancelled successfully.
     * @returns {boolean}
     */
    cancel() {
      return this.link.cancel();
    }

    /**
     * Set the given Cancellable as the Emitter's cancellable state.
     * @param {Cancellable} cancellable
     * The Cancellable instance
     * @returns {boolean}
     * Returns true if the cancellable is valid.
     */
    setCancellable(cancellable) {
      if (cancellable instanceof rxCancellable.Cancellable) {
        if (this.cancelled) {
          cancellable.cancel();
        } else if (cancellable.cancelled) {
          this.cancel();
          return true;
        } else {
          const { link } = this;
          this.link = cancellable;
          link.cancel();
          return true;
        }
      }
      return false;
    }

    /**
     * Emits a completion.
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    onComplete() {
      if (this.cancelled) {
        return;
      }
      try {
        this.complete();
      } finally {
        this.cancel();
      }
    }

    /**
     * Emits an error value.
     * @param {!Error} err
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    onError(err) {
      let report = err;
      if (!(err instanceof Error)) {
        report = new Error('onError called with a non-Error value.');
      }
      if (this.cancelled) {
        return;
      }
      try {
        this.error(report);
      } finally {
        this.cancel();
      }
    }
  }

  /**
   * @ignore
   */
  function subscribeActual$6(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const emitter = new CompletableEmitter(onComplete, onError);

    onSubscribe(emitter);

    try {
      this.subscriber(emitter);
    } catch (ex) {
      emitter.onError(ex);
    }
  }
  /**
   * @ignore
   */
  var create = (subscriber) => {
    if (!isFunction(subscriber)) {
      return error(new Error('Completable.create: There are no subscribers.'));
    }
    const completable = new Completable(subscribeActual$6);
    completable.subscriber = subscriber;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$7(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    let result;

    let err;
    try {
      result = this.supplier();
      if (!is(result)) {
        throw new Error('Completable.defer: supplier returned a non-Completable.');
      }
    } catch (e) {
      err = e;
    }

    if (exists(err)) {
      immediateError(observer, err);
    } else {
      result.subscribeWith({
        onSubscribe,
        onComplete,
        onError,
      });
    }
  }
  /**
   * @ignore
   */
  var defer = (supplier) => {
    const completable = new Completable(subscribeActual$7);
    completable.supplier = supplier;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$8(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { amount, scheduler, doDelayError } = this;

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    this.source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete() {
        controller.link(scheduler.delay(() => {
          onComplete();
        }, amount));
      },
      onError(x) {
        controller.link(scheduler.delay(() => {
          onError(x);
        }, doDelayError ? amount : 0));
      },
    });
  }
  /**
   * @ignore
   */
  var delay = (source, amount, scheduler, doDelayError) => {
    if (!isNumber(amount)) {
      return source;
    }
    const completable = new Completable(subscribeActual$8);
    completable.source = source;
    completable.amount = amount;
    completable.scheduler = defaultScheduler(scheduler);
    completable.doDelayError = doDelayError;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$9(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { amount, scheduler } = this;

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    controller.link(
      scheduler.delay(() => {
        controller.unlink();
        this.source.subscribeWith({
          onSubscribe(ac) {
            controller.link(ac);
          },
          onComplete,
          onError,
        });
      }, amount),
    );
  }
  /**
   * @ignore
   */
  var delaySubscription = (source, amount, scheduler) => {
    if (!isNumber(amount)) {
      return source;
    }
    const completable = new Completable(subscribeActual$9);
    completable.source = source;
    completable.amount = amount;
    completable.scheduler = defaultScheduler(scheduler);
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$a(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete() {
        onComplete();
        callable();
      },
      onError(x) {
        onError(x);
        callable();
      },
    });
  }

  /**
   * @ignore
   */
  var doAfterTerminate = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const completable = new Completable(subscribeActual$a);
    completable.source = source;
    completable.callable = callable;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$b(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { source, callable } = this;

    let called = false;
    source.subscribeWith({
      onSubscribe(ac) {
        ac.addEventListener('cancel', () => {
          if (!called) {
            callable();
            called = true;
          }
        });
        onSubscribe(ac);
      },
      onComplete() {
        onComplete();
        if (!called) {
          callable();
          called = true;
        }
      },
      onError(x) {
        onError(x);
        if (!called) {
          callable();
          called = true;
        }
      },
    });
  }

  /**
   * @ignore
   */
  var doFinally = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const completable = new Completable(subscribeActual$b);
    completable.source = source;
    completable.callable = callable;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$c(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe(ac) {
        ac.addEventListener('cancel', callable);
        onSubscribe(ac);
      },
      onComplete,
      onError,
    });
  }

  /**
   * @ignore
   */
  var doOnCancel = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const completable = new Completable(subscribeActual$c);
    completable.source = source;
    completable.callable = callable;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$d(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete() {
        callable();
        onComplete();
      },
      onError,
    });
  }

  /**
   * @ignore
   */
  var doOnComplete = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const completable = new Completable(subscribeActual$d);
    completable.source = source;
    completable.callable = callable;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$e(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete,
      onError(x) {
        callable(x);
        onError(x);
      },
    });
  }

  /**
   * @ignore
   */
  var doOnError = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }

    const completable = new Completable(subscribeActual$e);
    completable.source = source;
    completable.callable = callable;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$f(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete() {
        callable();
        onComplete();
      },
      onError(x) {
        callable(undefined, x);
        onError(x);
      },
    });
  }

  /**
   * @ignore
   */
  var doOnEvent = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const completable = new Completable(subscribeActual$f);
    completable.source = source;
    completable.callable = callable;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$g(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe(d) {
        callable(d);
        onSubscribe(d);
      },
      onComplete,
      onError,
    });
  }

  /**
   * @ignore
   */
  var doOnSubscribe = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const completable = new Completable(subscribeActual$g);
    completable.source = source;
    completable.callable = callable;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$h(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { source, callable } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete(x) {
        callable();
        onComplete(x);
      },
      onError(x) {
        callable();
        onError(x);
      },
    });
  }

  /**
   * @ignore
   */
  var doOnTerminate = (source, callable) => {
    if (!isFunction(callable)) {
      return source;
    }
    const completable = new Completable(subscribeActual$h);
    completable.source = source;
    completable.callable = callable;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$i(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const emitter = new CompletableEmitter(onComplete, onError);

    onSubscribe(emitter);

    this.promise.then(
      () => emitter.onComplete(),
      x => emitter.onError(x),
    );
  }
  /**
   * @ignore
   */
  var fromPromise = (promise) => {
    if (!isPromise(promise)) {
      return error(new Error('Completable.fromPromise: expects a Promise-like value.'));
    }
    const completable = new Completable(subscribeActual$i);
    completable.promise = promise;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$j(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const emitter = new CompletableEmitter(onComplete, onError);

    onSubscribe(emitter);

    let result;
    try {
      result = this.callable();
    } catch (e) {
      emitter.onError(e);
      return;
    }

    if (isPromise(result)) {
      fromPromise(result).subscribeWith({
        onSubscribe(ac) {
          emitter.setCancellable(ac);
        },
        onComplete() {
          emitter.onComplete();
        },
        onError(e) {
          emitter.onError(e);
        },
      });
    } else {
      emitter.onComplete();
    }
  }
  /**
   * @ignore
   */
  var fromCallable = (callable) => {
    if (!isFunction(callable)) {
      return error(new Error('Completable.fromCallable: callable received is not a function.'));
    }
    const completable = new Completable(subscribeActual$j);
    completable.callable = callable;
    return completable;
  };

  function subscribeActual$k(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const emitter = new CompletableEmitter(onComplete, onError);

    onSubscribe(emitter);

    this.subscriber(
      () => emitter.onComplete(),
      x => emitter.onError(x),
    );
  }
  /**
   * @ignore
   */
  var fromResolvable = (subscriber) => {
    if (!isFunction(subscriber)) {
      return error(new Error('Completable.fromResolvable: expects a function.'));
    }
    const completable = new Completable(subscribeActual$k);
    completable.subscriber = subscriber;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$l(observer) {
    let result;

    try {
      result = this.operator(observer);

      if (!isObserver(result)) {
        throw new Error('Completable.lift: operator returned a non-Observer.');
      }
    } catch (e) {
      immediateError(observer, e);
      return;
    }

    this.source.subscribeWith(result);
  }

  /**
   * @ignore
   */
  var lift = (source, operator) => {
    if (!isFunction(operator)) {
      return source;
    }
    const completable = new Completable(subscribeActual$l);
    completable.source = source;
    completable.operator = operator;
    return completable;
  };

  /* eslint-disable no-loop-func */

  /**
   * @ignore
   */
  function subscribeActual$m(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const controller = new rxCancellable.CompositeCancellable();

    onSubscribe(controller);

    const { sources } = this;

    const buffer = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const completable of sources) {
      if (is(completable)) {
        buffer.unshift(completable);
      } else {
        onError(new Error('Completable.merge: One of the sources is a non-Completable.'));
        controller.cancel();
        return;
      }
    }

    let pending = buffer.length;
    for (const completable of buffer) {
      completable.subscribeWith({
        onSubscribe(ac) {
          controller.add(ac);
        },
        onComplete() {
          pending -= 1;

          if (pending === 0) {
            onComplete();
            controller.cancel();
          }
        },
        onError(x) {
          onError(x);
          controller.cancel();
        },
      });
    }
  }
  /**
   * @ignore
   */
  var merge = (sources) => {
    if (!isIterable(sources)) {
      return error(new Error('Completable.merge: sources is not Iterable.'));
    }
    const completable = new Completable(subscribeActual$m);
    completable.sources = sources;
    return completable;
  };

  /* eslint-disable no-loop-func */

  /**
   * @ignore
   */
  function subscribeActual$n(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const controller = new rxCancellable.CompositeCancellable();

    onSubscribe(controller);

    const { sources } = this;
    const { length } = sources;
    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i < length; i += 1) {
      const completable = sources[i];
      if (is(completable)) ; else {
        onError(new Error('Completable.mergeArray: One of the sources is a non-Completable.'));
        controller.cancel();
        return;
      }
    }

    let pending = length;
    for (let i = 0; i < length; i += 1) {
      const completable = sources[i];
      completable.subscribeWith({
        onSubscribe(ac) {
          controller.add(ac);
        },
        onComplete() {
          pending -= 1;

          if (pending === 0) {
            onComplete();
            controller.cancel();
          }
        },
        onError(x) {
          onError(x);
          controller.cancel();
        },
      });
    }
  }
  /**
   * @ignore
   */
  var mergeArray = (sources) => {
    if (!isArray(sources)) {
      return error(new Error('Completable.merge: sources is non-Array.'));
    }
    const completable = new Completable(subscribeActual$n);
    completable.sources = sources;
    return completable;
  };

  /**
   * @ignore
   */
  var mergeWith = (source, other) => {
    if (!is(other)) {
      return source;
    }
    return mergeArray([source, other]);
  };

  /* eslint-disable class-methods-use-this */

  /**
   * @ignore
   */
  function subscribeActual$o(observer) {
    observer.onSubscribe(rxCancellable.UNCANCELLED);
  }
  /**
   * @ignore
   */
  let INSTANCE$1;
  /**
   * @ignore
   */
  var never = () => {
    if (typeof INSTANCE$1 === 'undefined') {
      INSTANCE$1 = new Completable(subscribeActual$o);
    }
    return INSTANCE$1;
  };

  function subscribeActual$p(observer) {
    const { onSubscribe, onComplete, onError } = cleanObserver(observer);

    const { source, scheduler } = this;

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete() {
        controller.link(scheduler.schedule(onComplete));
      },
      onError(x) {
        controller.link(scheduler.schedule(() => {
          onError(x);
        }));
      },
    });
  }
  /**
   * @ignore
   */
  var observeOn = (source, scheduler) => {
    const completable = new Completable(subscribeActual$p);
    completable.source = source;
    completable.scheduler = defaultScheduler(scheduler);
    return completable;
  };

  function subscribeActual$q(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { source, item } = this;

    source.subscribeWith({
      onSubscribe,
      onComplete,
      onError(x) {
        let result;
        try {
          result = item(x);
        } catch (e) {
          onError([x, e]);
          return;
        }
        if (result) {
          onComplete();
        } else {
          onError(x);
        }
      },
    });
  }
  /**
   * @ignore
   */
  var onErrorComplete = (source, item) => {
    if (!isFunction(item)) {
      return source;
    }
    const completable = new Completable(subscribeActual$q);
    completable.source = source;
    completable.item = item;
    return completable;
  };

  function subscribeActual$r(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { source, resumeIfError } = this;

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete,
      onError(x) {
        controller.unlink();

        let result;

        if (isFunction(resumeIfError)) {
          try {
            result = resumeIfError(x);
            if (!(result instanceof Completable)) {
              throw new Error('Completable.onErrorResumeNext: returned an non-Completable.');
            }
          } catch (e) {
            onError(new Error([x, e]));
            controller.cancel();
            return;
          }
        } else {
          result = resumeIfError;
        }

        result.subscribeWith({
          onSubscribe(ac) {
            controller.link(ac);
          },
          onComplete,
          onError,
        });
      },
    });
  }
  /**
   * @ignore
   */
  var onErrorResumeNext = (source, resumeIfError) => {
    if (!(isFunction(resumeIfError) || resumeIfError instanceof Completable)) {
      return source;
    }

    const completable = new Completable(subscribeActual$r);
    completable.source = source;
    completable.resumeIfError = resumeIfError;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$s(observer) {
    const { onSubscribe, onComplete, onError } = cleanObserver(observer);

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    const { source, times } = this;

    let retries = -1;

    const sub = () => {
      controller.unlink();
      retries += 1;

      source.subscribeWith({
        onSubscribe(ac) {
          controller.link(ac);
        },
        onComplete() {
          if (isNumber(times)) {
            if (retries <= times) {
              sub();
            } else {
              onComplete();
            }
          } else {
            sub();
          }
        },
        onError,
      });
    };

    sub();
  }

  /**
   * @ignore
   */
  var repeat = (source, times) => {
    if (exists(times)) {
      if (!isNumber(times)) {
        return source;
      }
      if (times <= 0) {
        return source;
      }
    }
    const completable = new Completable(subscribeActual$s);
    completable.source = source;
    completable.times = times;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$t(observer) {
    const { onSubscribe, onComplete, onError } = cleanObserver(observer);

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    const { source, predicate } = this;

    const sub = () => {
      controller.unlink();
      source.subscribeWith({
        onSubscribe(ac) {
          controller.link(ac);
        },
        onComplete() {
          if (isFunction(predicate)) {
            const result = predicate();

            if (result) {
              onComplete();
            } else {
              sub();
            }
          } else {
            sub();
          }
        },
        onError,
      });
    };

    sub();
  }

  /**
   * @ignore
   */
  var repeatUntil = (source, predicate) => {
    const completable = new Completable(subscribeActual$t);
    completable.source = source;
    completable.predicate = predicate;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$u(observer) {
    const { onSubscribe, onComplete, onError } = cleanObserver(observer);

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    const { source, bipredicate } = this;

    let retries = -1;

    const sub = () => {
      controller.unlink();
      retries += 1;

      source.subscribeWith({
        onSubscribe(ac) {
          controller.link(ac);
        },
        onComplete,
        onError(x) {
          if (isFunction(bipredicate)) {
            const result = bipredicate(retries, x);

            if (result) {
              sub();
            } else {
              onError(x);
              controller.cancel();
            }
          } else {
            sub();
          }
        },
      });
    };

    sub();
  }

  /**
   * @ignore
   */
  var retry = (source, bipredicate) => {
    const completable = new Completable(subscribeActual$u);
    completable.source = source;
    completable.bipredicate = bipredicate;
    return completable;
  };

  /**
   * @ignore
   */
  var startWith = (source, other) => {
    if (!is(other)) {
      return source;
    }
    return concatArray([other, source]);
  };

  function subscribeActual$v(observer) {
    const { onSubscribe, onComplete, onError } = cleanObserver(observer);

    const { source, scheduler } = this;

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    controller.link(scheduler.schedule(() => {
      controller.unlink();
      source.subscribeWith({
        onSubscribe(ac) {
          controller.link(ac);
        },
        onComplete,
        onError,
      });
    }));
  }
  /**
   * @ignore
   */
  var subscribeOn = (source, scheduler) => {
    const completable = new Completable(subscribeActual$v);
    completable.source = source;
    completable.scheduler = defaultScheduler(scheduler);
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$w(observer) {
    const { onSubscribe, onComplete, onError } = cleanObserver(observer);

    const controller = new rxCancellable.CompositeCancellable();

    onSubscribe(controller);

    const { source, other } = this;

    other.subscribeWith({
      onSubscribe(ac) {
        controller.add(ac);
      },
      onComplete() {
        onError(new Error('Completable.takeUntil: Source cancelled by other Completable.'));
        controller.cancel();
      },
      onError(x) {
        onError(new Error(['Completable.takeUntil: Source cancelled by other Completable.', x]));
        controller.cancel();
      },
    });

    source.subscribeWith({
      onSubscribe(ac) {
        controller.add(ac);
      },
      onComplete() {
        onComplete();
        controller.cancel();
      },
      onError(x) {
        onError(x);
        controller.cancel();
      },
    });
  }

  /**
   * @ignore
   */
  const takeUntil = (source, other) => {
    if (!is(other)) {
      return source;
    }

    const completable = new Completable(subscribeActual$w);
    completable.source = source;
    completable.other = other;
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$x(observer) {
    const { onComplete, onError, onSubscribe } = cleanObserver(observer);

    const { amount, scheduler } = this;

    const controller = new rxCancellable.LinkedCancellable();

    onSubscribe(controller);

    const timeout = scheduler.delay(
      () => {
        onError(new Error('Completable.timeout: TimeoutException (no success signals within the specified timeout).'));
        controller.cancel();
      },
      amount,
    );

    controller.addEventListener('cancel', () => timeout.cancel());

    this.source.subscribeWith({
      onSubscribe(ac) {
        controller.link(ac);
      },
      onComplete,
      onError,
    });
  }
  /**
   * @ignore
   */
  var timeout = (source, amount, scheduler) => {
    if (!isNumber(amount)) {
      return source;
    }
    const completable = new Completable(subscribeActual$x);
    completable.source = source;
    completable.amount = amount;
    completable.scheduler = defaultScheduler(scheduler);
    return completable;
  };

  /**
   * @ignore
   */
  function subscribeActual$y(observer) {
    const { onComplete, onSubscribe } = cleanObserver(observer);

    onSubscribe(this.scheduler.delay(onComplete, this.amount));
  }
  /**
   * @ignore
   */
  var timer = (amount, scheduler) => {
    if (!isNumber(amount)) {
      return error(new Error('Completable.timer: "amount" is not a number.'));
    }
    const completable = new Completable(subscribeActual$y);
    completable.amount = amount;
    completable.scheduler = defaultScheduler(scheduler);
    return completable;
  };

  /* eslint-disable import/no-cycle */

  /**
   * @license
   * MIT License
   *
   * Copyright (c) 2019 Alexis Munsayac
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   *
   * @author Alexis Munsayac <alexis.munsayac@gmail.com>
   * @copyright Alexis Munsayac 2019
   */

  /**
   * The Completable class represents a deferred computation
   * without any value but only indication for completion
   * or exception.
   *
   * Completable behaves similarly to Observable except that
   * it can only emit either a completion or error signal
   * (there is no onNext or onSuccess as with the other
   * reactive types).
   *
   * The Completable operates with the following sequential protocol:
   *
   * onSubscribe (onError | onComplete)?
   *
   * Note that as with the Observable protocol, onError and
   * onComplete are mutually exclusive events.
   *
   * Like Observable, a running Completable can be stopped through
   * the Cancellable instance provided to consumers through
   * Observer.onSubscribe(Cancellable).
   *
   * Like an Observable, a Completable is lazy, can be either
   * "hot" or "cold", synchronous or asynchronous.
   * Completable instances returned by the methods of this class are
   * cold.
   *
   * The documentation for this class makes use of marble diagrams.
   * The following legend explains these diagrams:
   *
   * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.png" class="diagram">
   */
  class Completable {
    /**
     * @ignore
     */
    constructor(subscribeActual) {
      this.subscribeActual = subscribeActual;
    }

    /**
     * Returns a Completable which terminates as soon as
     * one of the source Completables terminates
     * (normally or with an error) and cancels all
     * other Completables.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.amb.png" class="diagram">
     *
     * @param {!Iterable} sources
     * the array of source Completables.
     * A subscription to each source will occur in the
     * same order as in this Iterable.
     * @returns {Completable}
     */
    static amb(sources) {
      return amb(sources);
    }

    /**
     * Returns a Completable which terminates as soon as one of
     * the source Completables terminates (normally or with an error)
     * and cancels all other Completables.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.ambArray.png" class="diagram">
     *
     * @param {!Array} sources
     *  the array of source Completables. A subscription to each source
     * will occur in the same order as in this array.
     * @returns {Completable}
     */
    static ambArray(sources) {
      return ambArray(sources);
    }

    /**
     * Returns a Completable that emits the a terminated
     * event of either this Completable or the other
     * Completable whichever fires first.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.ambWith.png" class="diagram">
     *
     * @param {!Completable} other
     * the other Completable, not null. A subscription to
     * this provided source will occur after subscribing
     * to the current source.
     * @returns {Completable}
     */
    ambWith(other) {
      return ambWith(this, other);
    }

    /**
     * Returns a Completable that first runs this Completable
     * and then the other completable.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.andThen.c.png" class="diagram">
     *
     * @param {!Completable} other
     * the other Completable, not null
     * @returns {Completable}
     */
    andThen(other) {
      return andThen(this, other);
    }

    /**
     * Subscribes to this Completable only once, when the first
     * Observer subscribes to the result Completable, caches its
     * terminal event and relays/replays it to observers.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.cache.png" class="diagram">
     *
     * @returns {Completable}
     */
    cache() {
      return cache(this);
    }

    /**
     * Returns a Completable instance that completes immediately
     * when subscribed to.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.complete.png" class="diagram">
     *
     * @returns {Completable}
     */
    static complete() {
      return complete();
    }

    /**
     * Calls the given transformer function with this instance an
     * returns the function's resulting Completable.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.compose.png" class="diagram">
     *
     * @param {!function(completable: Completable):Completable} transformer
     * the transformer function, not null
     * @returns {Completable}
     */
    compose(transformer) {
      return compose(this, transformer);
    }

    /**
     * Returns a Completable which completes only when all sources
     * complete, one after another.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.concat.png" class="diagram">
     *
     * @param {!Iterable} sources
     * the sources to concatenate
     * @returns {Completable}
     */
    static concat(sources) {
      return concat(sources);
    }

    /**
     * Returns a Completable which completes only when all sources complete,
     * one after another.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.concatArray.png" class="diagram">
     *
     * @param {!Array} sources
     * the sources to concatenate
     * @returns {Completable}
     */
    static concatArray(sources) {
      return concatArray(sources);
    }

    /**
     * Concatenates this Completable with another Completable.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.concatWith.png" class="diagram">
     *
     * This is an alias for andThen.
     * @param {!Completable} other
     * the other Completable, not null
     * @returns {Completable}
     */
    concatWith(other) {
      return andThen(this, other);
    }

    /**
     * Provides an API (via a cold Completable) that bridges the
     * reactive world with the callback-style world.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.create.png" class="diagram">
     *
     * @param {!function(e: Emitter)} subscriber
     * the emitter that is called when a Observer subscribes
     * to the returned Completable
     * @returns {Completable}
     */
    static create(subscriber) {
      return create(subscriber);
    }

    /**
     * Defers the subscription to a Completable instance returned
     * by a supplier.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.defer.png" class="diagram">
     *
     * @param {function():Completable} supplier
     * the supplier that returns the Completable that will be subscribed to.
     * @returns {Completable}
     */
    static defer(supplier) {
      return defer(supplier);
    }

    /**
     * Returns a Completable which delays the emission of the
     * completion event by the given time.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.delay.png" class="diagram">
     *
     * @param {!number} amount
     * the amount of time the success signal should be
     * delayed for (in milliseconds).
     * @param {?Scheduler} scheduler
     * the target scheduler to use for the non-blocking wait and emission.
     * By default, schedules on the current thread.
     * @param {?boolean} doDelayOnError
     * if true, both success and error signals are delayed.
     * if false, only success signals are delayed.
     * @returns {Completable}
     */
    delay(amount, scheduler, doDelayOnError) {
      return delay(this, amount, scheduler, doDelayOnError);
    }

    /**
     * Delays the actual subscription to the current
     * Completable until the given time delay elapsed.
     *
     * @param {!Number} amount
     * the time amount to wait with the subscription
     * (in milliseconds).
     * @param {?Scheduler} scheduler
     * the target scheduler to use for the non-blocking wait and emission.
     * By default, schedules on the current thread.
     * @returns {Completable}
     */
    delaySubscription(amount, scheduler) {
      return delaySubscription(this, amount, scheduler);
    }

    /**
     * Returns a Completable instance that calls the given
     * onTerminate callback after this Completable completes
     * normally or with an exception.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doAfterTerminate.png" class="diagram">
     *
     * @param {!function} action
     * the callback to call after this Completable terminates
     * @returns {Completable}
     */
    doAfterTerminate(action) {
      return doAfterTerminate(this, action);
    }

    /**
     * Calls the specified action after this Completable
     * signals onError or onComplete or gets aborted by
     * the downstream.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doFinally.png" class="diagram">
     *
     * In case of a race between a terminal event and
     * a cancel call, the provided onFinally action
     * is executed once per subscription.
     * @param {!function} action
     * the action called when this Completable terminates or gets aborted.
     * @returns {Completable}
     */
    doFinally(action) {
      return doFinally(this, action);
    }

    /**
     * Calls the shared Action if a Observer subscribed
     * to the current Completable aborts the common
     * Cancellable it received via onSubscribe.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnDispose.png" class="diagram">
     *
     * @param {!function} action
     * the action to call when the child subscriber aborts the subscription.
     * @returns {Completable}
     */
    doOnCancel(action) {
      return doOnCancel(this, action);
    }

    /**
     * Returns a Completable which calls the given onComplete
     * callback if this Completable completes.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnComplete.png" class="diagram">
     *
     * @param {!function} action
     * the callback to call when this emits an onComplete event
     * @returns {Completable}
     */
    doOnComplete(action) {
      return doOnComplete(this, action);
    }

    /**
     * Returns a Completable which calls the given onError
     * callback if this Completable emits an error.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnError.png" class="diagram">
     *
     * @param {!function(x: Error)} consumer
     * the error callback
     * @returns {Completable}
     */
    doOnError(consumer) {
      return doOnError(this, consumer);
    }

    /**
     * Returns a Completable which calls the given onEvent callback
     * with the Error for an onError or undefined for an onComplete
     * signal from this Completable before delivering said signal
     * to the downstream.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnEvent.png" class="diagram">
     *
     * @param {!function(x: Error)} consumer
     * the event callback
     * @returns {Completable}
     */
    doOnEvent(consumer) {
      return doOnEvent(this, consumer);
    }

    /**
     * Returns a Completable instance that calls the given onSubscribe
     * callback with the Cancellable that child subscribers receive
     * on subscription.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnSubscribe.png" class="diagram">
     *
     * @param {!function(ac: Cancellable)} consumer
     * the callback called when a child subscriber subscribes
     * @returns {Completable}
     */
    doOnSubscribe(consumer) {
      return doOnSubscribe(this, consumer);
    }

    /**
     * Returns a Completable instance that calls the given onTerminate
     * callback just before this Completable completes normally or with
     * an exception.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.doOnTerminate.png" class="diagram">
     *
     * @param {!function} action
     * the callback to call just before this Completable terminates
     * @returns {Completable}
     */
    doOnTerminate(action) {
      return doOnTerminate(this, action);
    }

    /**
     * Creates a Completable with an error.
     *
     * Signals an error returned by the callback function
     * for each individual Observer or returns a Completable
     * that invokes a subscriber's onError method when
     * the subscriber subscribes to it.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.error.png" class="diagram">
     *
     * @param {!(function():Error|Error)} err
     * - the callable that is called for each individual
     * Observer and returns or throws a value to be emitted.
     * - the particular value to pass to onError
     * @returns {Completable}
     */
    static error(err) {
      return error(err);
    }

    /**
     * Returns a Completable which when subscribed, executes
     * the callable function, ignores its normal result and
     * emits onError or onComplete only.
     *
     * If the result is a Promise-like instance, the
     * Observer is then subscribed to the Promise through
     * the fromPromise operator.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.fromCallable.png" class="diagram">
     * If the callable throws an exception, the respective Error
     * is delivered to the downstream via Observer.onError(Error),
     * except when the downstream has aborted this Completable source.
     *
     * @param {!function} callable
     * the callable instance to execute for each subscriber
     * @returns {Completable}
     */
    static fromCallable(callable) {
      return fromCallable(callable);
    }

    /**
     * Converts a Promise-like instance into a Completable.
     *
     * @param {!(Promise|Thennable|PromiseLike)} promise
     * The promise to be converted into a Completable.
     * @returns {Completable}
     */
    static fromPromise(promise) {
      return fromPromise(promise);
    }

    /**
     * Provides a Promise-like interface for emitting signals.
     *
     * @param {!function(resolve: function, reject:function))} fulfillable
     * A function that accepts two parameters: resolve and reject,
     * similar to a Promise construct.
     * @returns {Completable}
     */
    static fromResolvable(fulfillable) {
      return fromResolvable(fulfillable);
    }

    /**
     * This method requires advanced knowledge about building operators,
     * please consider other standard composition methods first;
     *
     * Returns a Completable which, when subscribed to, invokes the operator
     * method for each individual downstream Completable and allows the
     * insertion of a custom operator by accessing the downstream's
     * Observer during this subscription phase and providing a new Observer,
     * containing the custom operator's intended business logic,
     * that will be used in the subscription process going further upstream.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.lift.png" class="diagram">
     *
     * Generally, such a new Observer will wrap the downstream's Observer
     * and forwards the onError and onComplete events from the upstream
     * directly or according to the emission pattern the custom operator's
     * business logic requires. In addition, such operator can intercept
     * the flow control calls of abort and signal.abort that would have
     * traveled upstream and perform additional actions depending on
     * the same business logic requirements.
     *
     * Note that implementing custom operators via this lift()
     * method adds slightly more overhead by requiring an additional
     * allocation and indirection per assembled flows. Instead,
     * using compose() method and  creating a transformer function
     * with it is recommended.
     *
     * @param {!function(observer: Observer)} operator
     * the callback called when a child subscriber subscribes
     * @returns {Completable}
     */
    lift(operator) {
      return lift(this, operator);
    }

    /**
     * Returns a Completable instance that subscribes to all sources at once
     * and completes only when all source Completables complete or one of them
     * emits an error.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.merge.png" class="diagram">
     *
     * @param {Iterable} sources
     * the iterable sequence of sources.
     * @returns {Completable}
     */
    static merge(sources) {
      return merge(sources);
    }

    /**
     * Returns a Completable instance that subscribes to all sources at once
     * and completes only when all source Completables complete or one of them
     * emits an error.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.mergeArray.png" class="diagram">
     *
     * @param {Array} sources
     * the array of sources.
     * @returns {Completable}
     */
    static mergeArray(sources) {
      return mergeArray(sources);
    }

    /**
     * Returns a Completable which subscribes to this and the other Completable
     * and completes when both of them complete or one emits an error.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.mergeWith.png" class="diagram">
     *
     * @param {Completable} other
     * the other Completable instance
     * @returns {Completable}
     */
    mergeWith(other) {
      return mergeWith(this, other);
    }

    /**
     * Returns a Completable that never calls onError or onComplete.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.never.png" class="diagram">
     *
     * @returns {Completable}
     * the Completableton instance that never calls onError or onComplete
     */
    static never() {
      return never();
    }

    /**
     * Returns a Completable which emits the terminal events from the
     * thread of the specified scheduler.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.subscribeOn.png" class="diagram">
     *
     * @param {?Scheduler} scheduler
     * the target scheduler to use for the non-blocking wait and emission.
     * By default, schedules on the current thread.
     *
     * @returns {Completable}
     * the source Completable modified so that its subscribers are
     * notified on the specified Scheduler
     */
    observeOn(scheduler) {
      return observeOn(this, scheduler);
    }

    /**
     * Returns a Completable instance that if this Completable emits an
     * error and the predicate returns true, it will emit an onComplete
     * and swallow the throwable.
     *
     * If no predicate is provided, returns a Completable instance that
     * if this Completable emits an error, it will emit an onComplete
     * and swallow the error
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.onErrorComplete.png" class="diagram">
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.onErrorComplete.f.png" class="diagram">
     *
     * @param {?function(e: Error):boolean} completion
     * the predicate to call when an Error is emitted which should return
     * true if the Error should be swallowed and replaced with an onComplete.
     * @returns {Completable}
     */
    onErrorComplete(completion) {
      return onErrorComplete(this, completion);
    }

    /**
     * Returns a Completable instance that when encounters an error from
     * this Completable, calls the specified mapper function that returns
     * another Completable instance for it and resumes the execution with it.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.onErrorResumeNext.png" class="diagram">
     *
     * @param {function(e:Error):Completable} other
     * the mapper function that takes the error and should return a
     * Completable as continuation.
     * @returns {Completable}
     */
    onErrorResumeNext(other) {
      return onErrorResumeNext(this, other);
    }

    /**
     * Returns a Completable that subscribes repeatedly at most
     * the given times to this Completable. If no amount is given,
     * subscribes repeatedly until aborted.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.repeat.png" class="diagram">
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.repeat.n.png" class="diagram">
     *
     * @param {?number} times
     * the number of times the resubscription should happen
     * @returns {Completable}
     */
    repeat(times) {
      return repeat(this, times);
    }

    /**
     * Re-subscribe to the current Completable if the given predicate
     * returns true when the Completable fails with an onError.
     *
     * If no predicate is provided, repeatedly re-subscribes to
     * the current Completable indefinitely if it fails with an onError.
     *
     * @param {?function(retries: number, err: Error):boolean} predicate
     * the predicate called with the resubscription count and the failure
     * value and should return true if a resubscription should happen.
     * @returns {Completable}
     */
    retry(predicate) {
      return retry(this, predicate);
    }

    /**
     * Returns a Completable that repeatedly subscribes to this Completable
     * so long as the given stop supplier returns false.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.repeatUntil.png" class="diagram">
     *
     * @param {!function():boolean} stopper
     * the supplier that should return true to stop resubscribing.
     * @returns {Completable}
     */
    repeatUntil(stopper) {
      return repeatUntil(this, stopper);
    }

    /**
     * Returns a Completable which first runs the other Completable
     * then this completable if the other completed normally.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.startWith.png" class="diagram">
     *
     * @param {Completable} other
     *  the other completable to run first
     * @returns {Completable}
     */
    startWith(other) {
      return startWith(this, other);
    }

    /**
     * Returns a Completable which subscribes the child subscriber on the specified scheduler,
     * making sure the subscription side-effects happen on that specific thread of the scheduler.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.subscribeOn.png" class="diagram">
     *
     * @param {?Scheduler} scheduler
     * the target scheduler to use for the non-blocking wait and emission.
     * By default, schedules on the current thread.
     *
     * @returns {Completable}
     * the source Completable modified so that its subscriptions happen
     * on the specified Scheduler
     */
    subscribeOn(scheduler) {
      return subscribeOn(this, scheduler);
    }

    /**
     * Returns a Completable that emits the item emitted by
     * the source Completable until a second Completable emits an
     * item. Upon emission of an item from other,
     * this will emit an error rather than go to
     * Observer.onSuccess.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.takeuntil.c.png" class="diagram">
     *
     * @param {Completable} other
     * the Completable whose emitted item will cause takeUntil
     * to emit the item from the source Completable
     * @returns {Completable}
     * a Completable that emits the item emitted by the source
     * Completable until such time as other emits its item
     */
    takeUntil(other) {
      return takeUntil(this, other);
    }

    /**
     * Signals a TimeoutException if the current Completable
     * doesn't signal a completion within the specified
     * timeout window.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.timeout.png" class="diagram">
     *
     * @param {!Number} amount
     * amount of time in milliseconds.
     * @param {?Scheduler} scheduler
     * the target scheduler to use for the non-blocking wait and emission.
     * By default, schedules on the current thread.
     * @returns {Completable}
     */
    timeout(amount, scheduler) {
      return timeout(this, amount, scheduler);
    }

    /**
     * Signals completion after the given delay for each Observer.
     *
     * <img src="https://raw.githubusercontent.com/LXSMNSYC/rx-completable/master/assets/images/Completable.timer.png" class="diagram">
     *
     * @param {!Number} amount
     * the amount of time in milliseconds.
     * @param {?Scheduler} scheduler
     * the target scheduler to use for the non-blocking wait and emission.
     * By default, schedules on the current thread.
     * @returns {Completable}
     */
    static timer(amount, scheduler) {
      return timer(amount, scheduler);
    }

    /**
     * @desc
     * Subscribes with an Object that is an Observer.
     *
     * An Object is considered as an Observer if:
     *  - if it has the method onSubscribe
     *  - if it has the method onComplete (optional)
     *  - if it has the method onError (optional)
     *
     * The onSubscribe method is called when subscribeWith
     * or subscribe is executed. This method receives an
     * Cancellable instance.
     *
     * @param {!Object} observer
     * @returns {undefined}
     */
    subscribeWith(observer) {
      if (isObserver(observer)) {
        this.subscribeActual.call(this, observer);
      }
    }

    /**
     * @desc
     * Subscribes to a Completable instance with an onComplete
     * and an onError method.
     *
     * onError receives a string(or an Error object).
     *
     * Both are called once.
     * @param {?function(x: any)} onComplete
     * the function you have designed to accept the emission
     * from the Completable
     * @param {?function(x: any)} onError
     * the function you have designed to accept any error
     * notification from the Completable
     * @returns {Cancellable}
     * an Cancellable reference can request the Completable to abort.
     */
    subscribe(onComplete, onError) {
      const controller = new rxCancellable.LinkedCancellable();
      this.subscribeWith({
        onSubscribe(ac) {
          controller.link(ac);
        },
        onComplete,
        onError,
      });
      return controller;
    }

    /**
     * Converts the Completable to a Promise instance.
     *
     * @returns {Promise}
     */
    toPromise() {
      return new Promise((res, rej) => {
        this.subscribe(res, rej);
      });
    }

    /**
     * Converts the Completable to a Promise instance
     * and attaches callbacks to it.
     *
     * @param {!function():any} onFulfill
     * @param {?function(x: Error):any} onReject
     * @returns {Promise}
     */
    then(onFulfill, onReject) {
      return this.toPromise().then(onFulfill, onReject);
    }

    /**
     * Converts the Completable to a Promise instance
     * and attaches an onRejection callback to it.
     *
     * @param {!function(x: Error):any} onReject
     * @returns {Promise}
     */
    catch(onReject) {
      return this.toPromise().catch(onReject);
    }
  }

  /**
   * Provides a mechanism for receiving push-based notification of a valueless
   * completion or an error.
   *
   * When a CompletableObserver is subscribed to a Completable through the
   * Completable.subscribe(CompletableObserver) method, the Completable calls
   * onSubscribe(Cancellable) with a Cancellable that allows cancelling the
   * sequence at any time. A well-behaved Completable will call a CompletableObserver's
   * onError(Error) or onComplete() method exactly once as they are considered
   * mutually exclusive terminal signals.
   *
   * the invocation pattern must adhere to the following protocol:
   *
   * <code>onSubscribe (onError | onComplete)?</code>
   *
   * Subscribing a CompletableObserver to multiple Completables is not recommended.
   * If such reuse happens, it is the duty of the CompletableObserver implementation
   * to be ready to receive multiple calls to its methods and ensure proper concurrent
   * behavior of its business logic.
   *
   * Calling onSubscribe(Cancellable) or onError(Error) with a null argument is forbidden.
   * @interface
   */

  /* eslint-disable no-unused-vars */

  return Completable;

}(Cancellable, Scheduler));
