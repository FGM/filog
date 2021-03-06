import sinon = require("sinon");

import * as MM from "meteor/mongo";
import {IContext, ITimestamps, KEY_TS} from "../../src/IContext";
import * as LogLevel from "../../src/LogLevel";
import { MongodbSender } from "../../src/Senders/MongodbSender";

function testMongoDbSender() {
  const mongo: any = {
    // Do NOT replace by an arrow function: it breaks the Sinon spy.
    Collection(name: string): void {
      // TSlint ignores the use of this method by Sinon in the 'should add a
      // "send" timestamp to non-empty context' test below, so do not remove it,
      // as it breaks that test.
      // tslint:disable-next-line
      this.insert = () => undefined;
      this.name = name;
    },
  };

  test("should accept a collection name", () => {
    const spy = sinon.spy(mongo, "Collection");
    const sender = new MongodbSender(mongo, "some_collection");
    expect(sender).toBeInstanceOf(MongodbSender);
    expect(spy.calledOnce).toBe(true);
  });

  test("should accept an existing collection", () => {
    const collection: MM.Mongo.Collection<object> = new mongo.Collection("fake");
    const sender = new MongodbSender(mongo, collection);
    expect(sender).toBeInstanceOf(MongodbSender);
    expect(sender.store).toBe(collection);
  });

  test("should reject invalid collection values", () => {
    const collection = 42;
    // Force type to accept invalid data.
    expect(() => new MongodbSender(mongo, collection as any)).toThrowError(Error);
  });

  test("should add a \"send\" timestamp to empty context", () => {
    const collection: MM.Mongo.Collection<object> = new mongo.Collection("fake");
    const sender = new MongodbSender(mongo, collection);
    const insertSpy = sinon.spy(sender.store, "insert");
    const before = +new Date();
    const level: LogLevel.Levels = LogLevel.WARNING;
    const message = "message";
    const context: IContext = {};

    sender.send(level, message, context);

    const after = +new Date();
    // Collection.insert was called once.
    expect(insertSpy.calledOnce).toBe(true);

    const callArgs: any = insertSpy.firstCall.args[0];
    // Level is passed.
    expect(callArgs.level).toBe(level);
    // Message is passed.
    expect(callArgs.message).toBe(message);

    const timestamp = callArgs.context[KEY_TS].server.send;
    // A numeric store timestamp is passed.
    expect(typeof timestamp).toBe("number");
    // Timestamp is later than 'before'.
    expect(timestamp >= before).toBe(true);
    // Timestamp is earlier than 'after'.
    expect(timestamp <= after).toBe(true);
  });

  test("should add a \"send\" timestamp to non-empty context", () => {
    const collection: MM.Mongo.Collection<object> = new mongo.Collection("fake");
    const sender = new MongodbSender(mongo, collection);
    const insertSpy = sinon.spy(sender.store, "insert");
    const before = +new Date();
    const level: LogLevel.Levels = LogLevel.Levels.WARNING;
    const message = "message";
    const tsInitial: ITimestamps = {
      whatever: {
        rocks: 1480849124018,
      },
    };
    const context: IContext = {
      [KEY_TS]: tsInitial,
    };

    sender.send(level, message, context);
    const after = +new Date();
    // Collection.insert was called once.
    expect(insertSpy.calledOnce).toBe(true);
    const callArgs : any = insertSpy.firstCall.args[0];
    // Level is passed.
    expect(callArgs.level).toBe(level);
    // Message is passed.
    expect(callArgs.message).toBe(message);

    // Preserves existing timestamps.
    const actualTsInitial: ITimestamps = callArgs.context[KEY_TS];
    expect(actualTsInitial).toMatchObject(tsInitial);

    // Adds its own timestamping.
    const tsStamping = callArgs.context[KEY_TS].server.send;
    // A numeric store timestamp is passed.
    expect(typeof tsStamping).toBe("number");
    // Timestamp is later than 'before'.
    expect(tsStamping >= before).toBe(true);
    // Timestamp is earlier than 'after'.
    expect(tsStamping <= after).toBe(true);
  });
}

export {
  testMongoDbSender,
};
