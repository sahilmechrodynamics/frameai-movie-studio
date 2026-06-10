import { useState, useEffect, useRef, useCallback } from "react";
import {
  Film, Play, Pause, SkipBack, Maximize2, Volume2, VolumeX,
  CheckCircle, AlertCircle, Info, ChevronDown, ChevronUp,
  Sparkles, Download, RefreshCw, Share2, Edit3, X, Lock, Unlock,
  Plus, Trash2, Copy, ArrowUp, ArrowDown, List, Layers,
  Music, Mic, Clock, User, BookOpen, Scissors, Settings
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --pink: #ff2d78; --cyan: #00f5ff; --gold: #ffd700; --purple: #a600ff;
  --green: #6aff6a; --bg: #0a0a0f; --surface: #0f0f1a; --surface2: #141428;
  --surface3: #1a1a38; --text: #e8e8f0; --muted: #6a6a8a;
}
html { scroll-behavior: smooth; }
body { background:var(--bg); color:var(--text); font-family:'Rajdhani',sans-serif; cursor:none; overflow-x:hidden; }
#cursor-dot { width:8px;height:8px;border-radius:50%;background:var(--cyan);position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);box-shadow:0 0 10px var(--cyan),0 0 20px var(--cyan);mix-blend-mode:screen;transition:transform 0.05s; }
#cursor-ring { width:28px;height:28px;border-radius:50%;border:1.5px solid var(--cyan);position:fixed;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);opacity:0.5;transition:left 0.12s ease,top 0.12s ease; }
#bg-canvas { position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none; }
.grain-overlay { position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;opacity:0.03;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E"); }
.grid-overlay { position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;opacity:0.04;background-image:linear-gradient(rgba(0,245,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.5) 1px,transparent 1px);background-size:60px 60px; }
.app-wrapper { position:relative;z-index:2;animation:fadeInUp 0.8s ease both; }
@keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
.header { position:sticky;top:0;z-index:100;background:rgba(10,10,15,0.9);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,245,255,0.15);padding:0 40px;display:flex;align-items:center;justify-content:space-between;height:64px;animation:slideDown 0.5s ease both; }
@keyframes slideDown { from{transform:translateY(-64px);opacity:0} to{transform:translateY(0);opacity:1} }
.logo { font-family:'Orbitron',sans-serif;font-size:1.3rem;font-weight:900;background:linear-gradient(135deg,var(--pink),var(--cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:3px; }
.nav { display:flex;gap:32px; }
.nav a { font-family:'Rajdhani',sans-serif;font-size:0.9rem;font-weight:600;letter-spacing:1px;color:var(--muted);text-decoration:none;cursor:none;transition:color 0.2s; }
.nav a:hover { color:var(--cyan); }
.pro-btn { padding:7px 20px;border-radius:6px;background:transparent;border:none;position:relative;font-family:'Orbitron',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:2px;color:var(--pink);cursor:none;overflow:hidden; }
.pro-btn::before { content:'';position:absolute;inset:0;border-radius:6px;padding:1.5px;background:linear-gradient(135deg,var(--pink),var(--cyan));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:destination-out;mask-composite:exclude; }
.pro-btn:hover { background:rgba(255,45,120,0.1); }
.ticker-wrap { background:rgba(15,15,26,0.9);border-bottom:1px solid rgba(255,215,0,0.2);padding:8px 0;overflow:hidden; }
.ticker-track { display:flex;white-space:nowrap;animation:tickerScroll 40s linear infinite;animation-fill-mode:forwards; }
.ticker-track:hover { animation-play-state:paused; }
@keyframes tickerScroll { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
.ticker-item { display:inline-flex;align-items:center;gap:6px;padding:0 32px;font-size:0.8rem;font-weight:600;letter-spacing:1px;color:var(--muted); }
.ticker-val { color:var(--gold);font-weight:700; }
.ticker-sep { color:rgba(0,245,255,0.3);margin:0 8px; }
.hero { text-align:center;padding:80px 40px 60px;animation:fadeInUp 0.9s 0.1s ease both; }
.eyebrow { font-size:0.8rem;font-weight:700;letter-spacing:4px;color:var(--cyan);margin-bottom:20px;opacity:0.8; }
.hero-title { font-family:'Orbitron',sans-serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:900;letter-spacing:4px;background:linear-gradient(135deg,var(--cyan) 30%,var(--pink) 70%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:glowPulse 3s ease-in-out infinite;line-height:1.1;margin-bottom:24px; }
@keyframes glowPulse { 0%,100%{filter:drop-shadow(0 0 8px rgba(0,245,255,0.5))} 50%{filter:drop-shadow(0 0 24px rgba(255,45,120,0.7))} }
.hero-sub { font-size:1.2rem;color:var(--muted);margin-bottom:36px;min-height:2em; }
.typewriter-word { color:var(--cyan);font-weight:700; }
.cta-btn { display:inline-flex;align-items:center;gap:10px;padding:14px 40px;background:linear-gradient(135deg,var(--pink),var(--purple));border:none;border-radius:8px;cursor:none;font-family:'Orbitron',sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:3px;color:white;box-shadow:0 0 30px rgba(255,45,120,0.4),0 0 60px rgba(166,0,255,0.2);animation:heartbeat 2s ease-in-out infinite;transition:transform 0.2s; }
.cta-btn:hover { transform:scale(1.04); }
@keyframes heartbeat { 0%,100%{box-shadow:0 0 30px rgba(255,45,120,0.4)} 50%{box-shadow:0 0 50px rgba(255,45,120,0.7),0 0 80px rgba(166,0,255,0.4)} }

/* TAB BAR */
.mode-tabs { display:flex;gap:0;padding:0 40px;background:rgba(10,10,15,0.6);border-bottom:1px solid rgba(0,245,255,0.1);overflow-x:auto; }
.mode-tab { padding:14px 24px;background:transparent;border:none;border-bottom:2px solid transparent;font-family:'Orbitron',sans-serif;font-size:0.72rem;font-weight:700;letter-spacing:2px;color:var(--muted);cursor:none;transition:all 0.2s;display:flex;align-items:center;gap:8px;white-space:nowrap; }
.mode-tab:hover { color:var(--text); }
.mode-tab.active { color:var(--cyan);border-bottom-color:var(--cyan); }

/* MAIN LAYOUT */
.studio-grid { display:grid;grid-template-columns:40% 60%;gap:0;padding:0 40px 60px;animation:fadeInUp 1s 0.2s ease both;max-width:1600px;margin:0 auto; }
@media(max-width:900px) { .studio-grid{grid-template-columns:1fr;padding:0 16px 40px} .header{padding:0 16px} .hero{padding:60px 16px 40px} .nav{display:none} .mode-tabs{padding:0 16px} }
.left-col { padding:0 20px 0 0;display:flex;flex-direction:column;gap:20px; }
.right-col { padding:0 0 0 20px;display:flex;flex-direction:column;gap:20px; }
.panel { background:var(--surface);border:1px solid rgba(0,245,255,0.12);border-radius:12px;padding:24px;transition:transform 0.2s,box-shadow 0.2s; }
.panel:hover { transform:translateY(-2px);box-shadow:0 8px 40px rgba(0,245,255,0.08); }
.panel-title { font-family:'Orbitron',sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:3px;color:var(--cyan);margin-bottom:18px;display:flex;align-items:center;gap:8px; }

/* PROMPT */
.prompt-area { width:100%;min-height:120px;background:rgba(10,10,15,0.8);border:1px solid rgba(0,245,255,0.2);border-radius:8px;padding:14px;color:var(--text);font-family:'Rajdhani',sans-serif;font-size:1rem;resize:vertical;transition:border-color 0.2s,box-shadow 0.2s;outline:none; }
.prompt-area:focus { border-color:var(--cyan);box-shadow:0 0 20px rgba(0,245,255,0.2); }
.prompt-footer { display:flex;align-items:center;justify-content:space-between;margin-top:10px;gap:8px;flex-wrap:wrap; }
.char-counter { font-size:0.8rem;font-weight:600; }
.enhance-btn { display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(166,0,255,0.15);border:1px solid rgba(166,0,255,0.4);border-radius:6px;cursor:none;font-family:'Rajdhani',sans-serif;font-size:0.85rem;font-weight:600;letter-spacing:1px;color:#c060ff;transition:all 0.2s; }
.enhance-btn:hover { background:rgba(166,0,255,0.25);box-shadow:0 0 16px rgba(166,0,255,0.3); }
.enhance-btn:disabled { opacity:0.5;cursor:not-allowed; }
.templates-btn { display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:rgba(0,245,255,0.1);border:1px solid rgba(0,245,255,0.3);border-radius:6px;cursor:none;font-family:'Rajdhani',sans-serif;font-size:0.85rem;font-weight:600;letter-spacing:1px;color:var(--cyan);transition:all 0.2s;position:relative; }
.templates-btn:hover { background:rgba(0,245,255,0.18); }
.templates-dropdown { position:absolute;top:calc(100% + 8px);right:0;z-index:200;background:var(--surface2);border:1px solid rgba(0,245,255,0.25);border-radius:10px;padding:8px;min-width:220px;box-shadow:0 8px 40px rgba(0,0,0,0.6),0 0 20px rgba(0,245,255,0.1);animation:fadeInUp 0.15s ease both; }
.templates-dropdown button { display:block;width:100%;padding:9px 14px;text-align:left;background:transparent;border:none;border-radius:6px;font-family:'Rajdhani',sans-serif;font-size:0.88rem;font-weight:600;color:var(--muted);cursor:none;transition:all 0.15s; }
.templates-dropdown button:hover { background:rgba(0,245,255,0.1);color:var(--cyan); }
.neg-prompt-toggle { display:inline-flex;align-items:center;gap:5px;margin-top:10px;padding:5px 10px;background:transparent;border:1px solid rgba(255,45,120,0.25);border-radius:5px;cursor:none;font-family:'Rajdhani',sans-serif;font-size:0.78rem;font-weight:600;letter-spacing:1px;color:rgba(255,45,120,0.6);transition:all 0.2s; }
.neg-prompt-toggle:hover { background:rgba(255,45,120,0.08);color:var(--pink); }
.neg-prompt-label { font-size:0.7rem;font-weight:700;letter-spacing:2px;color:rgba(255,45,120,0.6);margin-bottom:6px;margin-top:10px; }
.neg-prompt-area { width:100%;min-height:70px;background:rgba(10,10,15,0.8);border:1px solid rgba(255,45,120,0.2);border-radius:8px;padding:12px;color:var(--text);font-family:'Rajdhani',sans-serif;font-size:0.9rem;resize:vertical;transition:border-color 0.2s,box-shadow 0.2s;outline:none;cursor:text; }
.neg-prompt-area:focus { border-color:var(--pink);box-shadow:0 0 16px rgba(255,45,120,0.15); }
.history-select { width:100%;margin-top:10px;background:rgba(10,10,15,0.8);border:1px solid rgba(0,245,255,0.15);border-radius:6px;padding:8px 12px;color:var(--muted);font-family:'Rajdhani',sans-serif;font-size:0.85rem;outline:none;cursor:none; }
.history-select option { background:#0f0f1a; }
.format-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
.format-btn { padding:12px 8px;background:var(--surface2);border:1px solid rgba(0,245,255,0.1);border-radius:8px;cursor:none;font-family:'Rajdhani',sans-serif;font-size:0.85rem;font-weight:600;color:var(--muted);text-align:center;transition:all 0.2s; }
.format-btn:hover { border-color:rgba(0,245,255,0.3);color:var(--text); }
.format-btn.active { background:rgba(0,245,255,0.1);border-color:var(--cyan);color:var(--cyan);box-shadow:0 0 16px rgba(0,245,255,0.2);transform:scale(1.02); }
.style-pills { display:flex;flex-wrap:wrap;gap:8px; }
.style-pill { padding:6px 14px;border-radius:20px;cursor:none;font-family:'Rajdhani',sans-serif;font-size:0.8rem;font-weight:700;letter-spacing:1px;border:1px solid;transition:all 0.2s; }
.style-pill:hover { transform:scale(1.05); }
.style-pill.active { transform:scale(1.08);filter:brightness(1.3); }
.accordion-header { display:flex;align-items:center;justify-content:space-between;cursor:none;padding:10px 0;font-size:0.85rem;font-weight:600;color:var(--muted);letter-spacing:1px;border-top:1px solid rgba(255,255,255,0.05);transition:color 0.2s; }
.accordion-header:hover { color:var(--text); }
.control-row { margin-bottom:18px; }
.control-label { font-size:0.78rem;font-weight:600;letter-spacing:2px;color:var(--muted);margin-bottom:10px;display:flex;justify-content:space-between; }
.control-label span { color:var(--cyan); }
.slider { -webkit-appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:none; }
.slider::-webkit-slider-thumb { -webkit-appearance:none;width:16px;height:16px;border-radius:50%;cursor:none;box-shadow:0 0 10px currentColor; }
.toggle-row { display:flex;gap:8px; }
.toggle-btn { flex:1;padding:8px 4px;border-radius:6px;cursor:none;background:var(--surface2);border:1px solid rgba(255,255,255,0.08);font-family:'Rajdhani',sans-serif;font-size:0.8rem;font-weight:600;color:var(--muted);transition:all 0.2s; }
.toggle-btn.active { background:rgba(0,245,255,0.1);border-color:var(--cyan);color:var(--cyan); }
.seed-row { display:flex;align-items:center;gap:10px;margin-top:12px;margin-bottom:12px; }
.seed-input { background:rgba(10,10,15,0.8);border:1px solid rgba(0,245,255,0.2);border-radius:6px;padding:6px 10px;color:var(--cyan);font-family:'Rajdhani',sans-serif;font-size:0.85rem;font-weight:600;outline:none;width:120px;cursor:text; }
.seed-input:focus { border-color:var(--cyan); }
.seed-lock-btn { display:inline-flex;align-items:center;gap:5px;padding:6px 12px;background:rgba(0,245,255,0.08);border:1px solid rgba(0,245,255,0.2);border-radius:6px;cursor:none;font-family:'Rajdhani',sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:1px;color:var(--muted);transition:all 0.2s; }
.seed-lock-btn.locked { background:rgba(0,245,255,0.15);border-color:var(--cyan);color:var(--cyan);box-shadow:0 0 10px rgba(0,245,255,0.2); }
.generate-btn { width:100%;padding:18px;border:none;border-radius:10px;cursor:none;font-family:'Orbitron',sans-serif;font-size:0.9rem;font-weight:700;letter-spacing:4px;color:white;background:linear-gradient(135deg,var(--pink),var(--purple),var(--cyan),var(--pink));background-size:300% 300%;animation:gradientShift 4s ease infinite,heartbeat 2s ease-in-out infinite;box-shadow:0 0 40px rgba(255,45,120,0.3);display:flex;align-items:center;justify-content:center;gap:12px;transition:transform 0.2s; }
.generate-btn:hover { transform:scale(1.01); }
.generate-btn:disabled { animation:gradientShift 4s ease infinite;opacity:0.7; }
@keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
.clapper { width:32px;height:26px;position:relative;display:flex;flex-direction:column; }
.clapper-body { width:32px;height:18px;border-radius:2px;background:repeating-linear-gradient(45deg,#fff 0px,#fff 4px,#000 4px,#000 8px);margin-top:8px; }
.clapper-flap { position:absolute;top:0;left:0;width:32px;height:10px;background:repeating-linear-gradient(-45deg,#ff2d78 0px,#ff2d78 4px,#fff 4px,#fff 8px);transform-origin:left top;border-radius:2px; }
.clapper-flap.snap { animation:clapSnap 0.15s ease forwards; }
@keyframes clapSnap { 0%{transform:rotate(-40deg)} 60%{transform:rotate(5deg)} 100%{transform:rotate(0deg)} }
.progress-wrap { margin-top:12px; }
.progress-bar-bg { width:100%;height:6px;border-radius:3px;background:rgba(255,255,255,0.08);overflow:hidden; }
.progress-bar-fill { height:100%;border-radius:3px;background:linear-gradient(90deg,var(--cyan),var(--pink));transition:width 0.3s ease;box-shadow:0 0 12px var(--cyan); }
.progress-status { font-size:0.78rem;font-weight:600;letter-spacing:1px;color:var(--cyan);margin-bottom:6px;display:flex;justify-content:space-between; }

/* VIDEO PLAYER */
.video-canvas-wrap { position:relative;border-radius:12px;overflow:hidden;border:2px solid rgba(0,245,255,0.1);background:#000;transition:border-color 0.3s,box-shadow 0.3s,aspect-ratio 0.3s; }
.video-canvas-wrap.generated { border-color:var(--cyan);box-shadow:0 0 40px rgba(0,245,255,0.2),0 0 80px rgba(255,45,120,0.1); }
.video-canvas { width:100%;height:100%;display:block; }
.real-video { width:100%;height:100%;object-fit:cover;display:block; }
.hud-corner { position:absolute;width:20px;height:20px;border-color:var(--cyan);border-style:solid;opacity:0.6; }
.hud-tl { top:12px;left:12px;border-width:2px 0 0 2px; }
.hud-tr { top:12px;right:12px;border-width:2px 2px 0 0; }
.hud-bl { bottom:12px;left:12px;border-width:0 0 2px 2px; }
.hud-br { bottom:12px;right:12px;border-width:0 2px 2px 0; }
.scanlines { position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px); }
.video-overlay-badge { position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);border:1px solid var(--cyan);border-radius:4px;padding:4px 12px;font-family:'Orbitron',sans-serif;font-size:0.65rem;letter-spacing:2px;color:var(--cyan); }

/* PLAYER CONTROLS */
.player-controls { background:var(--surface);border:1px solid rgba(0,245,255,0.1);border-radius:0 0 12px 12px;margin-top:-1px;padding:12px 16px; }
.scrubber { -webkit-appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:none;margin-bottom:10px; }
.scrubber::-webkit-slider-thumb { -webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--cyan);cursor:none;box-shadow:0 0 10px var(--cyan); }
.ctrl-row { display:flex;align-items:center;gap:10px; }
.ctrl-btn { background:transparent;border:none;cursor:none;color:var(--muted);display:flex;align-items:center;padding:4px;border-radius:4px;transition:color 0.2s; }
.ctrl-btn:hover { color:var(--cyan); }
.ctrl-btn.play-btn { background:rgba(0,245,255,0.1);border:1px solid rgba(0,245,255,0.3);border-radius:6px;padding:6px 10px;color:var(--cyan); }
.timestamp { font-size:0.8rem;font-weight:600;color:var(--muted);margin-left:auto; }

/* TAGS + ACTIONS */
.tags-row { display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px; }
.tag { padding:4px 10px;border-radius:4px;background:rgba(0,245,255,0.08);border:1px solid rgba(0,245,255,0.25);font-size:0.75rem;font-weight:700;letter-spacing:1px;color:var(--cyan); }
.tag-seed { padding:4px 10px;border-radius:4px;background:rgba(0,245,255,0.12);border:1px solid rgba(0,245,255,0.4);font-size:0.75rem;font-weight:700;letter-spacing:1px;color:var(--cyan);box-shadow:0 0 8px rgba(0,245,255,0.2); }
.action-btns { display:flex;gap:10px;flex-wrap:wrap; }
.action-btn { display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:7px;cursor:none;font-family:'Rajdhani',sans-serif;font-size:0.82rem;font-weight:700;letter-spacing:1px;border:1px solid;transition:all 0.2s; }
.action-btn:hover { transform:translateY(-1px);filter:brightness(1.2); }
.btn-cyan { color:var(--cyan);border-color:rgba(0,245,255,0.3);background:rgba(0,245,255,0.08); }
.btn-pink { color:var(--pink);border-color:rgba(255,45,120,0.3);background:rgba(255,45,120,0.08); }
.btn-gold { color:var(--gold);border-color:rgba(255,215,0,0.3);background:rgba(255,215,0,0.08); }
.btn-purple { color:#c060ff;border-color:rgba(166,0,255,0.3);background:rgba(166,0,255,0.08); }
.btn-green { color:var(--green);border-color:rgba(106,255,106,0.3);background:rgba(106,255,106,0.08); }

/* SESSION HISTORY */
.session-history-strip { background:var(--surface);border:1px solid rgba(0,245,255,0.12);border-radius:12px;padding:16px 20px; }
.session-history-label { font-family:'Orbitron',sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:3px;color:var(--muted);margin-bottom:12px; }
.session-history-scroll { display:flex;gap:10px;overflow-x:auto;padding-bottom:6px; }
.session-history-scroll::-webkit-scrollbar { height:4px; }
.session-history-scroll::-webkit-scrollbar-track { background:rgba(255,255,255,0.05); }
.session-history-scroll::-webkit-scrollbar-thumb { background:var(--cyan);border-radius:2px; }
.session-thumb { flex-shrink:0;width:72px;cursor:none;border-radius:6px;overflow:hidden;border:1px solid rgba(0,245,255,0.2);transition:all 0.2s; }
.session-thumb:hover { border-color:var(--cyan);transform:scale(1.05); }
.session-thumb img { width:72px;height:42px;object-fit:cover;disp
