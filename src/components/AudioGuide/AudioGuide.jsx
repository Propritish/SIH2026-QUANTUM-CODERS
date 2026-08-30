import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import "./AudioGuide.css";

const LANGS = [
  { code: "en", label: "English" },
  { code: "or", label: "ଓଡ଼ିଆ" },
  { code: "hi", label: "हिन्दी" },
];

function localAudioUrl(slug, lang) {
  return new URL(`../../assets/audio/${slug}_${lang}.mp3`, import.meta.url).href;
}

// Multilingual audio narration player. Plays monument.audioGuides[lang]
// (a hosted URL from MongoDB) when set; otherwise tries the local
// src/assets/audio fallback file, and falls back further to the browser's
// built-in text-to-speech (using monument.narration) if neither loads —
// so the guide still works before real recordings exist.
export default function AudioGuide({ monument, era, lang, setLang }) {
  const [playing, setPlaying] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const audioRef = useRef(null);

  const remoteUrl = monument.audioGuides?.[lang];
  const src = remoteUrl || localAudioUrl(monument.slug, lang);

  useEffect(() => {
    stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, era, monument]);

  const speakFallback = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(monument.narration?.[era] || monument.blurb || "");
    utter.rate = 0.95;
    utter.onend = () => setPlaying(false);
    window.speechSynthesis.speak(utter);
    setUsingFallback(true);
    setPlaying(true);
  };

  const play = () => {
    const el = audioRef.current;
    if (el) {
      el.play()
        .then(() => {
          setUsingFallback(false);
          setPlaying(true);
        })
        .catch(speakFallback); // file missing/not found — fall back to TTS
    } else {
      speakFallback();
    }
  };

  const stop = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    window.speechSynthesis?.cancel();
    setPlaying(false);
  };

  return (
    <div className="audio-guide">
      <button className="audio-guide-play" onClick={playing ? stop : play}>
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <div className="audio-guide-body">
        <div className="audio-guide-title">
          Audio guide · {LANGS.find((l) => l.code === lang)?.label}
        </div>
        <div className="audio-guide-langs">
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`audio-guide-lang ${lang === l.code ? "active" : ""}`}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="audio-guide-path mono">
          {remoteUrl || `assets/audio/${monument.slug}_${lang}.mp3 (local fallback)`}
          {usingFallback && " · falling back to device text-to-speech"}
        </div>
      </div>

      {playing ? <Volume2 size={16} /> : <VolumeX size={16} className="dim" />}
      <audio ref={audioRef} src={src} onEnded={stop} preload="none" />
    </div>
  );
}
