import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

export const KitchenFlameAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [soundActive, setSoundActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Canvas ember particles simulation
  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    interface Ember {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      color: string;
    }

    const embers: Ember[] = [];
    const colors = ["#E58E26", "#B85D34", "#D4AF37", "#FFB142", "#EA2027"];
    const emberCount = 35; // Controlled count for optimal mobile performance

    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.8 + 1,
        speedY: -(Math.random() * 1.5 + 0.6),
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.8 + 0.2,
        fadeSpeed: Math.random() * 0.008 + 0.003,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y += e.speedY;
        e.x += e.speedX + Math.sin(e.y * 0.02) * 0.4;
        e.opacity -= e.fadeSpeed;

        if (e.y < -10 || e.opacity <= 0) {
          e.y = height + 10;
          e.x = width * 0.2 + Math.random() * (width * 0.6);
          e.opacity = Math.random() * 0.8 + 0.3;
          e.speedY = -(Math.random() * 1.6 + 0.6);
        }

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.globalAlpha = Math.max(0, e.opacity);
        ctx.shadowBlur = 8;
        ctx.shadowColor = e.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [prefersReduced]);

  // Synthesized Web Audio sizzle toggle (off by default, never autoplay)
  const toggleSound = () => {
    if (soundActive) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setSoundActive(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Generate brown/pink noise for gentle pan sizzle
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.15; // low pleasant volume
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Bandpass filter to sculpt warm grill sizzle frequencies
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.value = 0.08;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noiseNodeRef.current = noise;
      setSoundActive(true);
    } catch {
      // Audio not permitted
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 bg-[#141516] overflow-hidden border-y border-[#C5A059]/20">
      {/* Background radial flame glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,142,38,0.14)_0%,rgba(184,93,52,0.06)_40%,transparent_75%)] pointer-events-none" />

      {/* Canvas Particle Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial Content */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-['Cinzel'] text-xs font-bold tracking-[0.25em] text-[#C5A059] uppercase">
              The Fire &amp; The Pot
            </span>
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F5F1E8] leading-tight">
              Where Fire Meets Flavor
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-[#C5A059] to-transparent" />
            <p className="font-['Inter'] text-[#A8A29E] text-sm sm:text-base leading-relaxed">
              From searing hot chili paneer tossed over roaring flames to slow-simmered handi curries and marinated coastal fish fillets, our kitchen blends high-heat wok craft with aromatic Indian tradition.
            </p>
            <p className="font-['Cormorant_Garamond'] italic text-[#C5A059] text-lg">
              "Every dish is finished with freshly cracked spices, sizzling herbs, and fragrant ghee."
            </p>

            {/* Optional Synthesized Audio Toggle */}
            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={toggleSound}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-[#C5A059] border border-[#C5A059]/30 hover:bg-[#1F2022] transition-colors"
                aria-pressed={soundActive}
              >
                <span className="w-2 h-2 rounded-full bg-[#E58E26] animate-pulse" />
                <span>{soundActive ? "Mute Kitchen Sizzle" : "Listen: Kitchen Ambiance"}</span>
              </button>
              <span className="text-[11px] text-[#A8A29E]">Synthesized audio · Off by default</span>
            </div>
          </div>

          {/* Interactive Live Flame & Dish Visualizer */}
          <div className="lg:col-span-7 relative flex justify-center">
            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
              {/* Backglow disc */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#B85D34]/30 via-[#E58E26]/20 to-transparent blur-3xl pointer-events-none" />

              {/* Hand-hammered copper dish preview */}
              <div className="relative z-10 w-4/5 aspect-square rounded-full flex items-center justify-center p-3">
                <img
                  src="/src/assets/images/chicken_curry_1793027564712.jpg"
                  alt="Aromatic curry simmering in hammered copper handi"
                  className="w-full h-full object-cover rounded-full shadow-2xl border-2 border-[#C5A059]/30 dish-ground-shadow"
                  loading="lazy"
                />

                {/* Subtle floating flame callout */}
                <div className="absolute -bottom-2 right-4 bg-[#1F2022]/95 border border-[#C5A059]/40 px-4 py-2.5 rounded shadow-xl backdrop-blur-md">
                  <div className="text-[10px] font-['Cinzel'] tracking-widest text-[#C5A059] uppercase">
                    House Specialty
                  </div>
                  <div className="text-sm font-['Playfair_Display'] font-semibold text-[#F5F1E8]">
                    Simmered Copper Handi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
