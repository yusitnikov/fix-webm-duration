import { WebmContainer } from "./WebmContainer";

export class WebmFile extends WebmContainer {
    constructor(source: Uint8Array) {
        super("File");
        this.setSource(source);
    }

    override getType() {
        return "File";
    }

    toBlob(mimeType = "video/webm") {
        return new Blob([this.source!.buffer], { type: mimeType });
    }

    static blobToArray(blob: Blob) {
        return new Promise<Uint8Array>((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    try {
                        resolve(new Uint8Array(reader.result as ArrayBuffer));
                    } catch (ex: unknown) {
                        reject(ex);
                    }
                };
                reader.readAsArrayBuffer(blob);
            } catch (ex: unknown) {
                reject(ex);
            }
        });
    }

    static async fromBlob(blob: Blob) {
        const array = await WebmFile.blobToArray(blob);
        return new WebmFile(array);
    }
}
