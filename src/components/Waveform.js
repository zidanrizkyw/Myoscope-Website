import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import 'bootstrap/dist/css/bootstrap.min.css';

const Waveform = ({ audioUrl }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());
  const [isPlaying, setIsPlaying] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const debouncedLoad = debounce((url) => {
    if (wavesurfer.current) {
      wavesurfer.current.load(url);
    }
  }, 300);

  useEffect(() => {
    if (waveformRef.current && audioUrl) {
      // Inisialisasi WaveSurfer
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ff0000',
        progressColor: '#ff4d4d',
        height: 100,
        normalize: true,
        minPxPerSec: 100,
        audioContext: audioContext.current,
      });

      // Set konfigurasi high-pass filter
      const highPassFilter = audioContext.current.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.setValueAtTime(500, audioContext.current.currentTime); // Cutoff bawah yang lebih tinggi

      // Set konfigurasi low-pass filter
      const lowPassFilter = audioContext.current.createBiquadFilter();
      lowPassFilter.type = 'lowpass';
      lowPassFilter.frequency.setValueAtTime(1500, audioContext.current.currentTime); // Cutoff atas yang lebih rendah

      // Dynamic Range Compression
      const compressor = audioContext.current.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-30, audioContext.current.currentTime);
      compressor.knee.setValueAtTime(30, audioContext.current.currentTime);
      compressor.ratio.setValueAtTime(8, audioContext.current.currentTime);
      compressor.attack.setValueAtTime(0.5, audioContext.current.currentTime);
      compressor.release.setValueAtTime(1, audioContext.current.currentTime);

      // Noise Gate (sederhana)
      const gateThreshold = -40; // Threshold untuk noise gate
      const gainNode = audioContext.current.createGain();
      gainNode.gain.setValueAtTime(0, audioContext.current.currentTime); // Mulai dengan gain 0

      // Load file audio dengan debounce
      debouncedLoad(audioUrl);

      // Setelah audio dimuat, hubungkan ke filter dan compressor
      wavesurfer.current.on('ready', () => {
        const mediaElement = wavesurfer.current.getMediaElement();
        const mediaElementSource = audioContext.current.createMediaElementSource(mediaElement);

        // Hubungkan ke filter dan compressor
        mediaElementSource.connect(highPassFilter)
          .connect(lowPassFilter)
          .connect(compressor)
          .connect(gainNode)
          .connect(audioContext.current.destination);

        // Cek level audio dan kontrol gain
        const analyzer = audioContext.current.createAnalyser();
        mediaElementSource.connect(analyzer);
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        
        const checkAudioLevel = () => {
          analyzer.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value) / dataArray.length;
          
          // Mengatur gain berdasarkan average level
          if (average < gateThreshold) {
            gainNode.gain.setValueAtTime(0, audioContext.current.currentTime); // Mute jika di bawah threshold
          } else {
            gainNode.gain.setValueAtTime(1, audioContext.current.currentTime); // Aktifkan gain jika di atas threshold
          }
          requestAnimationFrame(checkAudioLevel);
        };

        checkAudioLevel(); // Mulai memantau level audio
      });

      // Tangani error
      wavesurfer.current.on('error', (e) => {
        console.error('WaveSurfer Error:', e);
      });

      // Cleanup saat unmount
      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      };
    }
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (isPlaying) {
      wavesurfer.current.pause();
    } else {
      wavesurfer.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (wavesurfer.current) {
      wavesurfer.current.stop();
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <div id="waveform" ref={waveformRef}></div>
      <div className="d-flex justify-content-center align-items-center mt-3">
        <button
          onClick={handlePlayPause}
          className={`btn ${isPlaying ? 'btn-warning' : 'btn-success'} mx-2`}
        >
          {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
        </button>
        <button
          onClick={handleStop}
          className="btn btn-danger"
        >
          <i className="fa-solid fa-stop"></i>
        </button>
      </div>
    </div>
  );
};

export default Waveform;
