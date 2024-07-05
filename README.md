# fix-webm-duration

`navigator.mediaDevices.getUserMedia` + `MediaRecorder` create WEBM files without duration metadata.

This library appends missing metadata section right to the file blob.

## Installation

Install from a package manager:

```
npm install @fix-webm-duration/fix
```

Then, the library could be imported:

```typescript
import { fixWebmDuration } from "@fix-webm-duration/fix";
```

## Usage

Syntax:

```typescript
const newBlob = await fixWebmDuration(blob, duration, options = {});
```

where

- `blob` is `Blob` object with file contents from `MediaRecorder`
- `duration` is video duration in milliseconds (you should calculate it while recording the video)
- `options` is an object of options:
    - `options.logger` - a callback for logging debug messages or `false`.
      The callback should accept one argument - the message string.
      By default, `console.debug` will be used for logging.
      Passing `false` will disable the logging.

`fixWebmDuration` will parse and fix your file asynchronously and return the fixed blob once the result is ready.

If the original blob already contains duration metadata section and the duration value is not empty, the callback will receive it without any changes made.

Example:

```typescript
let mediaRecorder;
let mediaParts;
let startTime;

function startRecording(stream: MediaStream, options: MediaRecorderOptions) {
    mediaParts = [];
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.onstop = async () => {
        const duration = Date.now() - startTime;
        const buggyBlob = new Blob(mediaParts, { type: "video/webm" });

        const fixedBlob = await fixWebmDuration(buggyBlob, duration)
        displayResult(fixedBlob);
    };
    mediaRecorder.ondataavailable = (event) => {
        var data = event.data;
        if (data && data.size > 0) {
            mediaParts.push(data);
        }
    };
    mediaRecorder.start();
    startTime = Date.now();
}

function stopRecording() {
    mediaRecorder.stop();
}

function displayResult(blob: Blob) {
    // ...
}
```

Note: this example **is not** a `MediaRecorder` usage guide.
