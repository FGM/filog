/**
 * @fileOverview Server-side Logger.
 */
/// <reference types="node" />
/// <reference types="meteor" />
import { IncomingMessage, ServerResponse } from "http";
import * as connect from "connect";
import { WebApp } from "meteor/webapp";
import { IContext } from "../IContext";
import * as LogLevel from "../LogLevel";
import { IStrategy } from "../Strategies/IStrategy";
import { ILogger } from "./ILogger";
import { Logger } from "./Logger";
import WriteStream = NodeJS.WriteStream;
interface IWebApp {
    connectHandlers: connect.Server;
}
declare type OptionalWebApp = typeof WebApp | IWebApp | null;
interface IServerLoggerConstructorParameters {
    enableMethod?: boolean;
    logRequestHeaders?: boolean;
    maxReqListeners?: number;
    servePath?: string;
    verbose?: boolean;
}
declare const ServerSide = "server";
/**
 * An extension of the base logger which accepts log input on a HTTP URL.
 *
 * Its main method is log(level, message, context).
 *
 * @see ServerLogger.log
 */
declare class ServerLogger extends Logger implements ILogger {
    webapp: OptionalWebApp;
    /**
     * Return a plain object for all types of context values.
     *
     * @param rawContext
     *   Expect a POJO but accept just about anything.
     *   Expect a POJO but accept just about anything.
     *
     * @returns {{}}
     *   - Contexts which are objects are returned as the same key/values, but as
     *     POJOs, even for arrays.
     *   - Scalar contexts are returned as { value: <original value> }
     */
    static objectifyContext(rawContext: any): any;
    enableMethod: boolean;
    logRequestHeaders: boolean;
    hostname: string;
    maxReqListeners: number;
    output: WriteStream;
    servePath: string;
    side: string;
    verbose: boolean;
    /**
     * @constructor
     *
     * @param {StrategyBase} strategy
     *   A logging strategy instance.
     * @param {WebApp} webapp
     *   The Meteor WebApp service.
     * @param parameters
     * - enableMethod: enable the filog:log method or not. Defaults to true.
     * - logRequestHeaders: add request headers to the log context. Defaults to true.
     * - maxReqListeners: maximum number of request listeners. Defaults to 11.
     * - servePath: the path on which to expose the logger endpoint. Defaults to "/logger".
     */
    constructor(strategy: IStrategy, webapp?: OptionalWebApp, parameters?: IServerLoggerConstructorParameters);
    /**
     * Handle a log message from the client.
     *
     * @param req
     *   The request.
     * @param res
     *   The response.
     * @param _NEXT
     *   A callback, not used currently.
     *
     * @returns {void}
     */
    handleClientLogRequest(req: IncomingMessage, res: ServerResponse, _NEXT: () => void): void;
    /**
     * Extended syntax for log() method.
     *
     * @private
     *
     * @param level
     *   The event level.
     * @param message
     *   The event message.
     * @param context
     *   The context added to the details by upstream processors.
     * @param source
     *   The upstream sender type. Allow logging with source set from an incoming
     *   log event, as in client-sender logging or during tests.
     *
     * @throws InvalidArgumentException
     */
    logExtended(level: LogLevel.Levels, message: object | string, context: IContext, source?: string): void;
    /**
     * The Meteor server method registered a ${Logger.METHOD}.
     *
     * @param {number} level
     *   The event level.
     * @param {string} message
     *   The event message.
     * @param {Object} context
     *   The event context: any additional data added to the message.
     *
     * @returns {void}
     */
    logMethod({ level, message, context }: {
        level?: number | undefined;
        message?: string | undefined;
        context?: {} | undefined;
    }): void;
    /**
     * Sets up the Connect routing within the Meteor webapp component.
     *
     * @param webapp
     *   The Meteor webapp service (Connect wrapper).
     * @param servePath
     *   The path on which to expose the server logger. Must NOT start by a "/".
     */
    setupConnect(webapp: OptionalWebApp, servePath: string): void;
    /**
     * @inheritDoc
     */
    protected _getHostname(): string | undefined;
}
export { IServerLoggerConstructorParameters, ServerLogger, ServerSide, };
