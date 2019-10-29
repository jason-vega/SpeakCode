
// <!-- Speech Speech SDK Authorization token -->

        // Note: Replace the URL with a valid endpoint to retrieve
        //       authorization tokens for your subscription.

        // An authorization token is a more secure method to authenticate for a browser deployment as
        // it allows the subscription keys to be kept secure on a server and a 10 minute use token to be
        // handed out to clients from an endpoint that can be protected from unauthorized access.
        


   //     <!-- Speech SDK USAGE -->

        // On document load resolve the Speech SDK dependency
        function Initialize(onComplete) {
            if (!!window.SpeechSDK) {
                onComplete(window.SpeechSDK);
            }
        }

        Initialize(function (speechSdk) {
                SpeechSDK = speechSdk;
              
            });
 //       <!-- Browser Hooks -->

        var phraseDiv, statusDiv;
        var key, authorizationToken, appId, phrases;
        var regionOptions;
        var languageOptions, formatOptions, inputSource, filePicker;
        var SpeechSDK;
        var recognizer;

        var reco;
        var sdkStartContinousRecognitionBtn, sdkStopContinousRecognitionBtn;
        var sdkStartContinousTranslationBtn, sdkStopContinousTranslationBtn;
        var sdkStartRecognizeOnceAsyncBtn, sdkStopRecognizeOnceAsyncBtn, languageTargetOptions, voiceOutput;
        var sdkIntentStartRecognizeOnceAsyncBtn, sdkIntentStopRecognizeOnceAsyncBtn;
        var audioFile, audioFileValid;

        var soundContext = undefined;
        try {
            var AudioContext = window.AudioContext // our preferred impl
                || window.webkitAudioContext       // fallback, mostly when on Safari
                || false;                          // could not find.

                if (AudioContext) {
                    soundContext = new AudioContext();
                } else {
                    alert("Audio context not supported");
                }
            }
            catch (e) {
                window.console.log("no sound context found, no audio output. " + e);
            }


            var alltext = "";

            // Starts continuous speech recognition.
            function sdkStartContinousRecognition() {
                console.log("TEST START");
                //phraseDiv.innerHTML = "";
                //statusDiv.innerHTML = "";
                var lastRecognized = "";

                // If an audio file was specified, use it. Else use the microphone.
                // Depending on browser security settings, the user may be prompted to allow microphone use. Using continuous recognition allows multiple
                // phrases to be recognized from a single use authorization.
                var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
                
                var speechConfig;
                if (authorizationToken) {
                    speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, regionOptions.value);
                } else {
                    if (key.value === "" || key.value === "YOUR_SPEECH_API_KEY") {
                        alert("Please enter your Cognitive Services Speech subscription key!");
                        return;
                    }
                    speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key.value, regionOptions.value);
                }

                speechConfig.speechRecognitionLanguage = languageOptions.value;
                reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

                // Before beginning speech recognition, setup the callbacks to be invoked when an event occurs.

                // The event recognizing signals that an intermediate recognition result is received.
                // You will receive one or more recognizing events as a speech phrase is recognized, with each containing
                // more recognized speech. The event will contain the text for the recognition since the last phrase was recognized.
                reco.recognizing = function (s, e) {
                    window.console.log(e);
                    //statusDiv.innerHTML += "(recognizing) Reason: " + SpeechSDK.ResultReason[e.result.reason] + " Text: " + e.result.text + "\r\n";
                    //phraseDiv.innerHTML = lastRecognized + e.result.text;
                    alltext = lastRecognized + e.result.text;
                };

                // The event recognized signals that a final recognition result is received.
                // This is the final event that a phrase has been recognized.
                // For continuous recognition, you will get one recognized event for each phrase recognized.
                reco.recognized = function (s, e) {
                    window.console.log(e);

                    // Indicates that recognizable speech was not detected, and that recognition is done.
                    if (e.result.reason === SpeechSDK.ResultReason.NoMatch) {
                        var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(e.result);
                        // statusDiv.innerHTML += "(recognized)  Reason: " + SpeechSDK.ResultReason[e.result.reason] + " NoMatchReason: " + SpeechSDK.NoMatchReason[noMatchDetail.reason] + "\r\n";
                    } else {
                        // statusDiv.innerHTML += "(recognized)  Reason: " + SpeechSDK.ResultReason[e.result.reason] + " Text: " + e.result.text + "\r\n";
                    }

                    lastRecognized += e.result.text + "\r\n";
                    //phraseDiv.innerHTML = lastRecognized;
                    alltext = lastRecognized;
                    console.log(alltext);
                };

                // The event signals that the service has stopped processing speech.
                // https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognitioncanceledeventargs?view=azure-node-latest
                // This can happen for two broad classes of reasons.
                // 1. An error is encountered.
                //    In this case the .errorDetails property will contain a textual representation of the error.
                // 2. No additional audio is available.
                //    Caused by the input stream being closed or reaching the end of an audio file.
                reco.canceled = function (s, e) {
                    window.console.log(e);

                    //statusDiv.innerHTML += "(cancel) Reason: " + SpeechSDK.CancellationReason[e.reason];
                    if (e.reason === SpeechSDK.CancellationReason.Error) {
                        //statusDiv.innerHTML += ": " + e.errorDetails;
                    }
                    //statusDiv.innerHTML += "\r\n";
                };

                // Signals that a new session has started with the speech service
                reco.sessionStarted = function (s, e) {
                    window.console.log(e);
                    statusDiv.innerHTML += "(sessionStarted) SessionId: " + e.sessionId + "\r\n";
                };

                // Signals the end of a session with the speech service.
                reco.sessionStopped = function (s, e) {
                    window.console.log(e);
                    //statusDiv.innerHTML += "(sessionStopped) SessionId: " + e.sessionId + "\r\n";
                    //sdkStartContinousRecognitionBtn.disabled = false;
                    //sdkStopContinousRecognitionBtn.disabled = true;
                };

                // Signals that the speech service has started to detect speech.
                reco.speechStartDetected = function (s, e) {
                    window.console.log(e);
                    //statusDiv.innerHTML += "(speechStartDetected) SessionId: " + e.sessionId + "\r\n";
                };

                // Signals that the speech service has detected that speech has stopped.
                reco.speechEndDetected = function (s, e) {
                    window.console.log(e);
                    //statusDiv.innerHTML += "(speechEndDetected) SessionId: " + e.sessionId + "\r\n";
                };

                // Starts recognition
                console.log("RECOGNITION");
                reco.startContinuousRecognitionAsync();

                //sdkStartContinousRecognitionBtn.disabled = true;
                //sdkStopContinousRecognitionBtn.disabled = false;
            };

            


            