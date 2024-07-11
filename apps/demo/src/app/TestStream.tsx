import { useMemo, useState } from "react";
import { DebugFile } from "./DebugFile";

export interface TestStreamProps {
    stream: MediaStream;
    video: boolean;
}

export const TestStream = ({ stream, video }: TestStreamProps) => {
    const [codecOption, setCodecOption] = useState("");
    const [codecCustom, setCodecCustom] = useState("");
    const codec = codecOption === "custom" ? codecCustom : codecOption;

    const recorder = useMemo(() => {
        try {
            return new MediaRecorder(stream, {
                mimeType: (video ? "video/webm" : "audio/webm") + (codec ? `;codecs=${codec}` : ""),
                videoBitsPerSecond: 8000000,
            });
        } catch (error: unknown) {
            return error;
        }
    }, [stream, video, codec]);

    const [recording, setRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [file, setFile] = useState<Blob | null>(null);

    const start = () => {
        if (!(recorder instanceof MediaRecorder)) {
            return;
        }

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
            <div>
                <label>
                    Codec:&nbsp;
                    <select value={codecOption} onChange={(ev) => setCodecOption(ev.target.value)}>
                        <option value={""}>auto</option>
                        {video && (
                            <>
                                <option value={"vp8"}>vp8</option>
                                <option value={"vp9"}>vp9</option>
                            </>
                        )}
                        <option value={"custom"}>custom</option>
                    </select>
                </label>

                {codecOption === "custom" && (
                    <span>
                        &nbsp;
                        <input
                            type={"text"}
                            placeholder={"Enter value..."}
                            value={codecCustom}
                            onChange={(ev) => setCodecCustom(ev.target.value)}
                        />
                    </span>
                )}
            </div>

            {!(recorder instanceof MediaRecorder) && <div>{(recorder as object).toString()}</div>}

            {recorder instanceof MediaRecorder && (
                <>
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
                </>
            )}
        </div>
    );
};
