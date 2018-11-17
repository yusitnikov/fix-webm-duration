# fix-webm-duration

`navigator.mediaDevices.getUserMedia` + `MediaRecorder` create WEBM files without duration metadata.

This library appends missing metadata section right to the file blob.

## Usage

The library contains only one script `fix-webm-duration.js` and has no dependencies.

Syntax:

```javascript
ysFixWebmDuration(blob, duration, callback);
```

where
- `blob` is `Blob` object with file contents from `MediaRecorder`
- `duration` is video duration in milliseconds (you should calculate it while recording the video)
- `callback` is callback function that will receive fixed blob

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
        
        ysFixWebmDuration(buggyBlob, duration, function(fixedBlob) {
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
