import { IContext } from "../IContext";
import { ILogger } from "../Loggers/ILogger";
import * as LogLevel from "../LogLevel";
import { ISender } from "../Senders/ISender";
interface IStrategy {
    /**
     * Select senders to use for a given log event.
     *
     * @param level
     *   The log event level.
     * @param message
     *   The log event string/template.
     * @param context
     *   The context of the log event.
     *
     * @returns
     *   An array of senders to use for this event.
     */
    selectSenders(level: LogLevel.Levels, message: string, context: IContext): ISender[];
    /**
     * This method may modify the logger methods, e.g. to do nothing on debug.
     *
     * @param logger
     *   A logger service to customize.
     */
    customizeLogger(logger: ILogger): void;
}
export { IStrategy, };
