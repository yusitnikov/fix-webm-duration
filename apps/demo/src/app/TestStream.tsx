import { useMemo, useState } from "react";
import { DebugFile } from "./DebugFile";

const codec = "vp9";

export interface TestStreamProps {
    stream: MediaStream;
    video: boolean;
}

export const TestStream = ({ stream, video }: TestStreamProps) => {
    const recorder = useMemo(
        () =>
            new MediaRecorder(stream, {
                mimeType: video ? "video/webm" + (codec ? `;codecs=${codec}` : "") : "audio/webm",
                videoBitsPerSecond: 8000000,
            }),
        [stream, video],
    );

    const [recording, setRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [file, setFile] = useState<Blob | null>(null);

    const start = () => {
        const parts: Blob[] = [];
        const startTime = +new Date();
        const onData = ({ data }: BlobEvent) => parts.push(data);
        const onStop = () => {
            recorder.removeEventListener("dataavailable", onData);
            recorder.removeEventListener("stop", onStop);

            setRecording(false);
            setDuration(+new Date() - startTime);
            const file = new Blob(parts, {
                type: video ? "video/webm" : "audio/webm",
            });
            setFile(file);
        };

        recorder.addEventListener("dataavailable", onData);
        recorder.addEventListener("stop", onStop);
        recorder.start(100);
        setRecording(true);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {!recording && (
                <div>
                    <button type={"button"} onClick={start}>
                        Start
                    </button>
                </div>
            )}

            {recording && (
                <div>
                    <button type={"button"} onClick={() => recorder.stop()}>
                        Stop
                    </button>
                </div>
            )}

            {!recording && file && <DebugFile file={file} duration={duration} />}
        </div>
    );
};
