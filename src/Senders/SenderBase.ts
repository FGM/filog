/**
 * @fileOverview Base Sender class.
 */

import * as LogLevel from "../LogLevel";
import {ISender} from "./ISender";

/**
 * SenderBase is an "abstract" class defining the sender interface.
 */
const SenderBase = class implements ISender {
  /** @inheritDoc */
  public send(_1: LogLevel.Levels, _2: string, _3: object): void { return; }
};

export default SenderBase;