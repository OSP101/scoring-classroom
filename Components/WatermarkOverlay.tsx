// components/WatermarkOverlay.tsx
'use client'
import React, { useState, useEffect } from "react";

interface WatermarkOverlayProps {
  name: string;
  email: string;
}

const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({ name, email }) => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    // ตั้งค่าขนาดหน้าจอเมื่อ component mount
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });

      const handleResize = () => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // สร้าง pattern ที่ซ้ำกันทั้งหน้าจอ
  const createWatermarkPattern = () => {
    const patterns = [];
    const patternWidth = 320; // ความกว้างของแต่ละ pattern
    const patternHeight = 200; // ความสูงของแต่ละ pattern
    
    // คำนวณจำนวน pattern ที่ต้องการเพื่อให้เต็มหน้าจอ
    const columns = Math.ceil(dimensions.width / patternWidth) + 2;
    const rows = Math.ceil(dimensions.height / patternHeight) + 2;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = col * patternWidth - patternWidth / 2;
        const y = row * patternHeight - patternHeight / 2;
        
        patterns.push(
          <div
            key={`${row}-${col}`}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              width: `${patternWidth}px`,
              height: `${patternHeight}px`,
              display: "flex",
              alignItems: "start",
              justifyContent: "start",
              textAlign: "start",
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "1.4",
              whiteSpace: "nowrap",
            }}
          >
            <div>
              <div>{name}</div>
              <div>{email}</div>
            </div>
          </div>
        );
      }
    }
    return patterns;
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 50,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -50,
          left: -50,
          width: "100%",
          height: "100%",
          transform: "rotate(-25deg)",
          transformOrigin: "start",
          opacity: 0.05,
          color: "#000",
        }}
      >
        {createWatermarkPattern()}
      </div>
    </div>
  );
};

export default WatermarkOverlay;