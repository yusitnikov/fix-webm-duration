# fix-webm-duration

`navigator.mediaDevices.getUserMedia` + `MediaRecorder` create WEBM files without duration metadata.

This library appends missing metadata section right to the file blob.

## Installation

### Install from a package manager

```
npm install fix-webm-duration
```

Then, the library could be imported or required:
```javascript
import fixWebmDuration from "fix-webm-duration";
// or
const fixWebmDuration = require("fix-webm-duration");
```

Typescript support included.

### Include as a file asset

Download the [./fix-webm-duration.js](fix-webm-duration.js) file from this repository,
and load it in your web page:
```html
<script src="/path/to/fix-webm-duration.js"></script>
```

It will add a global `ysFixWebmDuration` function to the window.

## Usage

The library contains only one script `fix-webm-duration.js` and has no dependencies.

Syntax:

```javascript
ysFixWebmDuration(blob, duration, callback = undefined, options = {});
```

where
- `blob` is `Blob` object with file contents from `MediaRecorder`
- `duration` is video duration in milliseconds (you should calculate it while recording the video)
- `callback` is callback function that will receive fixed blob.
  If omitted, a `Promise` object will be returned instead.
- `options` is an object of options:
  - `options.logger` - a callback for logging debug messages or `false`.
    The callback should accept one argument - the message string.
    By default, `console.log` will be used for logging.
    Passing `false` will disable the logging.

`ysFixWebmDuration` will parse and fix your file asynchronously and will call your callback once the result is ready.

If the original blob already contains duration metadata section and the duration value is not empty, the callback will receive it without any changes made.

Example:

```javascript
var mediaRecorder;
var mediaParts;
var startTime;

function startRecording(stream, options) {
    mediaParts = [];
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.onstop = function() {
        var duration = Date.now() - startTime;
        var buggyBlob = new Blob(mediaParts, { type: 'video/webm' });

        // v1: callback-style
        ysFixWebmDuration(buggyBlob, duration, function(fixedBlob) {
            displayResult(fixedBlob);
        });

        // v2: promise-style, disable logging
        ysFixWebmDuration(buggyBlob, duration, {logger: false})
            .then(function(fixedBlob) {
                displayResult(fixedBlob);
            });
    };
    mediaRecorder.ondataavailable = function(event) {
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

function displayResult(blob) {
    // ...
}
```

Note: this example **is not** a `MediaRecorder` usage guide.
