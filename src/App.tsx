import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useTexture, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { TVShaderMaterial } from './TVShaderMaterial';
import { motion } from 'framer-motion';

extend({ TVShaderMaterial });

// Add type for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      tVShaderMaterial: any;
    }
  }
}

const TVScreen = ({ imageUrl }: { imageUrl: string }) => {
  const materialRef = useRef<any>(null);
  const texture = useTexture(imageUrl);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
      materialRef.current.mouse = state.pointer;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[16, 9, 64, 64]} />
      <tVShaderMaterial ref={materialRef} tDiffuse={texture} />
    </mesh>
  );
};

export default function App() {
  const imageUrl = 'https://pic1.imgdb.cn/item/699c2ffc8d93ad3aa183e68b.png';
  const [isEnglish, setIsEnglish] = useState(false);

  const texts = {
    title: isEnglish ? 'Dom Nei delivers a televised address' : 'Dom内衣发表全链电视讲话',
    breaking: isEnglish ? 'BREAKING NEWS' : 'Breaking News',
    breakingCN: isEnglish ? 'BREAKING NEWS' : '突发新闻',
    ticker: isEnglish 
      ? 'The "IC" Revolutionary Guard has successfully suppressed the "Eight-Year Party," and victory belongs to the people!   The "IC" Revolutionary Guard has successfully suppressed the "Eight-Year Party," and victory belongs to the people!   The "IC" Revolutionary Guard has successfully suppressed the "Eight-Year Party," and victory belongs to the people!'
      : 'IC革命卫队已成功镇压八年党，胜利属于人民！   IC革命卫队已成功镇压八年党，胜利属于人民！   IC革命卫队已成功镇压八年党，胜利属于人民！'
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans text-white">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <color attach="background" args={['#050505']} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <TVScreen imageUrl={imageUrl} />
        </Canvas>
      </div>

      {/* Scanline Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />

      {/* Language Toggle Button */}
      <button
        onClick={() => setIsEnglish(!isEnglish)}
        className="absolute top-6 right-6 z-20 pointer-events-auto bg-black/50 hover:bg-black/80 text-white px-3 py-1 rounded text-xs transition-colors border border-white/10"
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
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-lg">
                {texts.title}
              </h1>
              <p className="text-red-500 font-mono text-xs mt-1 uppercase tracking-widest">
                {texts.breaking}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar / News Ticker */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full pointer-events-auto"
        >
          <div className="bg-gradient-to-r from-red-700 to-red-900 border-t-4 border-red-500 shadow-2xl overflow-hidden flex">
            <div className="bg-black text-white px-6 py-3 font-black uppercase tracking-widest shrink-0 flex items-center z-10 shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
              {texts.breakingCN}
            </div>
            <div className="flex-1 overflow-hidden relative flex items-center">
              <div className="animate-marquee whitespace-nowrap text-xl md:text-2xl font-bold tracking-wide px-4">
                {texts.ticker}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
