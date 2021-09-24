export type LoggerCallback = (message: string) => void;

export interface Options {
    logger?: LoggerCallback | false;
}

export type ResultCallback = (fixedBlob: Blob) => void;

export interface FixWebmDurationFunction {
    (blob: Blob, duration: number, callback: ResultCallback, options?: Options): void;
    (blob: Blob, duration: number, options?: Options): Promise<Blob>;
}

declare const fixWebmDuration: FixWebmDurationFunction;
export default fixWebmDuration;
