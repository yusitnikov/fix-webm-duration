export type LoggerCallback = (message: string) => void;

export interface Options {
    logger?: LoggerCallback | false;
}
