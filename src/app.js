(function (red5prosdk) {


    let rtcPublisher = new red5prosdk.RTCPublisher();
    let publishStart = false;

    var config = {
        protocol: 'wss',
        host: 'red5.telenova.com.br',
        port: 443,
        app: 'live',
        streamName: 'stream1',
        mediaElementId: 'videoPainelControle',
        rtcConfiguration: {
            iceServers: [{ urls: 'stun:stun2.l.google.com:19302' }]
        }
    };

    function pararTransmissao() {
        rtcPublisher.unpublish()
            .then(function (rtcPublisher) {

                var transmitindo = document.getElementById('btnTransmitindo');
                transmitindo.style.display = "none";
                btnIniciarTransmissao.style.display = "inline";
                var btnPararTransmissao = document.getElementById('btnPararTransmissao');
                btnPararTransmissao.style.display = "none";
                publishStart = false;

            })
    }


    function ligarCamera() {
        try {

            rtcPublisher.init(config)
                .then(function (objeto) {

                    rtcPublisher.on('WebRTC.MediaStream.Available', (event) => {
                        //var teste = objeto;

                        var btnLigarCamera = document.getElementById('btnLigarCamera');
                        btnLigarCamera.style.display = "none";
                        var btnDesligarCamera = document.getElementById('btnDesligarCamera');
                        btnDesligarCamera.style.display = "inline";

                    })
                    rtcPublisher.on('*', (event) => {
                        console.log(event.type);
                    })
                })
                .catch(function (err) {
                    console.error('Could not publish: ' + err);
                });
        }
        catch (e) {
            alert("erro: " + e.message);
        }
    }

    function DesligarCamera() {
        try {
          

          
            // rtcPublisher.on('WebRTC.MediaStream.Available', (event) => {
            //     //var teste = objeto;

            //     var btnLigarCamera = document.getElementById('btnLigarCamera');
            //     btnLigarCamera.style.display = "none";
            //     var btnDesligarCamera = document.getElementById('btnDesligarCamera');
            //     btnDesligarCamera.style.display = "inline";

            // })
           if(publishStart)
           {
            alert("Não é possível desligar a câmera com a transmissão em andamento.")
           }else{
            rtcPublisher.getMediaStream().getTracks().forEach(function (track) {
                if (track.readyState == 'live') {
                    track.stop();
                };    
            })
            

            setTimeout(() => {
                var btnLigarCamera = document.getElementById('btnLigarCamera');
                btnLigarCamera.style.display = "inline";
                var btnDesligarCamera = document.getElementById('btnDesligarCamera');
                btnDesligarCamera.style.display = "none";
                reloadVideoContent();
                rtcPublisher = new red5prosdk.RTCPublisher();
            }, 500)
           }
            



        }
        catch (e) {
            alert("erro: " + e.message);
        }
    }

    function iniciarTransmissao() {
        try {

            var mediaStreams = rtcPublisher.getMediaStream();
            var tracks = mediaStreams.getTracks();
            if(tracks.length > 1){
                rtcPublisher.publish()
                .then(function (rtcPublisher) {
                    var transmitindo = document.getElementById('btnTransmitindo');
                    transmitindo.style.display = "inline";
                    btnIniciarTransmissao.style.display = "none";
                    var btnPararTransmissao = document.getElementById('btnPararTransmissao');
                    btnPararTransmissao.style.display = "inline";
                    publishStart = true;
                })
                .catch(function (err) {
                    console.error('Could not publish: ' + err);
                });
            }else{
               // alert("Por favor, ligue a câmera antes de transmitir.")
            }
       
        }
        catch (e) {
            alert("Camera desligada. Por favor, ligue a camera primeiro.");
        }
    }

    var btnLigarCamera = document.getElementById('btnLigarCamera');
    btnLigarCamera.addEventListener('click', function () {
        ligarCamera();
    })

    var btnDesligarCamera = document.getElementById('btnDesligarCamera');
    btnDesligarCamera.addEventListener('click', function () {
        DesligarCamera();
    })

    var btnIniciarTransmissao = document.getElementById('btnIniciarTransmissao');
    btnIniciarTransmissao.addEventListener('click', function () {
        iniciarTransmissao();
    })

    var btnPararTransmissao = document.getElementById('btnPararTransmissao');
    btnPararTransmissao.addEventListener('click', function () {
        pararTransmissao();
    })

   
    function reloadVideoContent(){
        var video = document.getElementById('video');
        video.innerHTML = '<video poster="img/foradoar.gif" id="videoPainelControle" width="670" height="503" muted autoplay controls></video>';
    }
    

    function hasGetUserMedia() {
        // Note: Opera builds are unprefixed.
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }

    if (hasGetUserMedia()) {
        console.log('Good to go!');
    } else {
        alert('getUserMedia() is not supported in your browser');
    }


})(red5prosdk);

// // stop both mic and camera
// function stopBothVideoAndAudio(stream) {
//     stream.getTracks().forEach(function(track) {
//         if (track.readyState == 'live') {
//             track.stop();
//         }
//     });
// }

// // stop only camera
// function stopVideoOnly(stream) {
//     stream.getTracks().forEach(function(track) {
//         if (track.readyState == 'live' && track.kind === 'video') {
//             track.stop();
//         }
//     });
// }

// // stop only mic
// function stopAudioOnly(stream) {
//     stream.getTracks().forEach(function(track) {
//         if (track.readyState == 'live' && track.kind === 'audio') {
//             track.stop();
//         }
//     });
// }

         //var video = document.getElementById("videoPainelControle")

            // navigator.mediaDevices.hasGetUserMedia({ audio: false, video: true })
            //     .then(mediaStream => {
            //         document.querySelector('video').srcObject = mediaStream;
            //         // Stop the stream after 5 seconds
            //         setTimeout(() => {
            //             const tracks = mediaStream.getTracks()
            //             tracks[0].stop()
            //         }, 5000)
            //     })

            // var tracks = video.videoTracks;
            // var tracks2 = video.audioTracks;
            // var teste2 = 1;
            // var teste = navigator.mediaDevices;
            // var media = teste.getDisplayMedia();

            // media.getTracks().forEach(function (track) {
            //     if (track.readyState == 'live') {
            //         track.stop();
            //     }
            // });


            // rtcPublisher.finish()
            //     .then(function () {
            //         rtcPublisher.on('WebRTC.MediaStream.Available', (event) =>{
            //             var btnLigarCamera = document.getElementById('btnLigarCamera');
            //             btnLigarCamera.style.display = "inline";
            //             var btnDesligarCamera = document.getElementById('btnDesligarCamera');
            //             btnDesligarCamera.style.display = "none";
            //         })
            //         rtcPublisher.on('*', (event) => {
            //             console.log(event.type);
            //         })
            //     })
            //     .catch(function (err) {
            //         console.error('Could not publish: ' + err);
            //     });