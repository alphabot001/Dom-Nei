import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function App() {
  const videoUrl = '/1.mp4';
  const [isEnglish, setIsEnglish] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video1 = videoRef.current;
    const video2 = videoRef2.current;
    
    const startVideo1 = () => {
      if (video1) {
        video1.currentTime = 0;
        video1.play().catch(() => {});
      }
    };
    
    const startVideo2 = () => {
      if (video2) {
        video2.currentTime = 0;
        video2.play().catch(() => {});
      }
    };
    
    if (video1) {
      video1.play().catch(() => {});
      video1.addEventListener('ended', () => {
        setActiveVideo(2);
        startVideo2();
      });
    }
    if (video2) {
      video2.addEventListener('ended', () => {
        setActiveVideo(1);
        startVideo1();
      });
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const texts = {
    title: isEnglish ? 'Dom Nei delivers a televised address' : 'Dom内衣发表全链电视讲话',
    breakingCN: isEnglish ? 'BREAKING NEWS' : '突发新闻',
    ticker: isEnglish 
      ? 'The "IC" Revolutionary Guard has successfully suppressed the "Eight-Year Party," and victory belongs to the people!'
      : 'IC革命卫队已成功镇压八年党，胜利属于人民！   IC革命卫队已成功镇压八年党，胜利属于人民！   IC革命卫队已成功镇压八年党，胜利属于人民！'
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans text-white">
      {/* Video Player - Seamless loop */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${activeVideo === 1 ? 'opacity-100' : 'opacity-0'}`}
        />
        <video
          ref={videoRef2}
          src={videoUrl}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${activeVideo === 2 ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />

      {/* Language Toggle Button */}
      <button
        onClick={() => setIsEnglish(!isEnglish)}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 20,
          background: 'none',
          border: 'none',
          color: '#ef4444',
          cursor: 'pointer',
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          transition: 'all 0.2s ease',
          fontWeight: 'bold',
          fontSize: 14
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'none'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {isEnglish ? 'CN' : 'EN'}
      </button>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white px-3 py-1 rounded-sm font-bold tracking-wider text-sm flex items-center gap-2 shadow-[0_0_10px_rgba(220,38,38,0.8)]">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>
            <div className="pointer-events-auto">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-lg select-text">
                {texts.title}
              </h1>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar / News Ticker */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full pointer-events-auto relative"
        >
          <button
            onClick={toggleFullscreen}
            style={{
              position: 'absolute',
              right: 0,
              top: '-40px',
              background: 'none',
              border: 'none',
              color: '#22c55e',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              transition: 'all 0.2s ease'
            }}
            title={isFullscreen ? "退出全屏" : "全屏"}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
          <div className="bg-gradient-to-r from-red-700 to-red-900 border-t-4 border-red-500 shadow-2xl overflow-hidden flex">
            <div className="bg-black text-white px-6 py-3 font-black uppercase tracking-widest shrink-0 flex items-center z-10 shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
              {texts.breakingCN}
            </div>
            <div className="flex-1 overflow-hidden relative flex items-center">
              <div className={`whitespace-nowrap text-xl md:text-2xl font-bold tracking-wide px-4 ${isEnglish ? 'animate-marquee-slow' : 'animate-marquee'}`}>
                {texts.ticker}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
