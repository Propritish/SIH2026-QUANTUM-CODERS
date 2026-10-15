import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./AudioGuide.css";

function localAudioUrl(slug, lang) {
  return new URL(`../../assets/audio/${slug}_${lang}.mp3`, import.meta.url).href;
}

export default function AudioGuide({ monument, era, lang, setLang }) {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [usingEnglishFallback, setUsingEnglishFallback] = useState(false);
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
    const localizedNarration = monument.translations?.[lang]?.narration?.[era];
    const narration = localizedNarration || monument.narration?.[era] || monument.blurb || "";
    const utter = new SpeechSynthesisUtterance(narration);
    utter.lang = localizedNarration
      ? (lang === "or" ? "or-IN" : lang === "hi" ? "hi-IN" : "en-IN")
      : "en-IN";
    utter.rate = 0.95;
    utter.onend = () => setPlaying(false);
    window.speechSynthesis.speak(utter);
    setUsingFallback(true);
    setUsingEnglishFallback(lang !== "en" && !localizedNarration);
    setPlaying(true);
  };

  const play = () => {
    const el = audioRef.current;
    if (el) {
      el.play()
        .then(() => {
          setUsingFallback(false);
          setUsingEnglishFallback(false);
          setPlaying(true);
        })
        .catch(speakFallback);
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
      <button className="audio-guide-play" onClick={playing ? stop : play} aria-label={t(playing ? "audio.pause" : "audio.play")}>
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="audio-guide-body">
        <div className="audio-guide-title">{t("audio.title", { language: t(`lang.${lang}`) })}</div>
        <div className="audio-guide-langs">
          {["en", "or", "hi"].map((code) => (
            <button
              key={code}
              className={`audio-guide-lang ${lang === code ? "active" : ""}`}
              onClick={() => setLang(code)}
            >
              {t(`lang.${code}`)}
            </button>
          ))}
        </div>
        <div className="audio-guide-path mono">
          {remoteUrl || `assets/audio/${monument.slug}_${lang}.mp3 (${t("audio.localFallback")})`}
          {usingFallback && t("audio.fallback")}
          {usingEnglishFallback && t("audio.englishFallback")}
        </div>
      </div>
      {playing ? <Volume2 size={16} /> : <VolumeX size={16} className="dim" />}
      <audio ref={audioRef} src={src} onEnded={stop} preload="none" />
    </div>
  );
}
