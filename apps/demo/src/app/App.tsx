import { useState } from "react";
import { TestFile } from "./TestFile";
import { TestCanvas } from "./TestCanvas";
import { TestVideoAudio } from "./TestVideoAudio";

enum SourceType {
    video = "video",
    audio = "audio",
    canvas = "canvas",
    file = "file",
}

export const App = () => {
    const [sourceType, setSourceType] = useState(SourceType.file);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h1 style={{ margin: 0 }}>Debug parsing/fixing webm files</h1>

            <div>
                See more details in the <a href={"https://github.com/yusitnikov/fix-webm-duration"}>GitHub repo</a>.
            </div>

            <label>
                Source type:&nbsp;
                <select value={sourceType} onChange={(ev) => setSourceType(ev.target.value as SourceType)}>
                    <option value={SourceType.file}>File from disk</option>
                    <option value={SourceType.video}>Video from camera</option>
                    <option value={SourceType.audio}>Audio from microphone</option>
                    <option value={SourceType.canvas}>Capture a canvas</option>
                </select>
            </label>

            {sourceType === SourceType.file && <TestFile key={"file"} />}
            {sourceType === SourceType.video && <TestVideoAudio key={"video"} video={true} />}
            {sourceType === SourceType.audio && <TestVideoAudio key={"audio"} video={false} />}
            {sourceType === SourceType.canvas && <TestCanvas key={"canvas"} />}
        </div>
    );
};
