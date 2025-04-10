"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, RoundedBox } from "@react-three/drei";
import type { Mesh } from "three";

const DITHER_PIXEL_SIZE = 1;
const DARK_COLOR = [23, 23, 23] as const;

function CanvasDithering({ size }: { size: number }) {
  const { gl } = useThree();
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const overlayCanvas = document.createElement("canvas");
    overlayCanvas.width = size;
    overlayCanvas.height = size;
    overlayCanvas.style.position = "absolute";
    overlayCanvas.style.top = "0";
    overlayCanvas.style.left = "0";
    overlayCanvas.style.width = `${size}px`;
    overlayCanvas.style.height = `${size}px`;
    overlayCanvas.style.pointerEvents = "none";

    const container = gl.domElement.parentNode;
    if (container) {
      container.appendChild(overlayCanvas);
    }

    overlayCanvasRef.current = overlayCanvas;
    return () => {
      if (container && container.contains(overlayCanvas)) {
        container.removeChild(overlayCanvas);
      }
    };
  }, [gl]);

  useFrame(() => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return;

    const ctx = overlayCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(gl.domElement, 0, 0, size, size);

    // Get the image data
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    const width = size;
    const height = size;

    const downsampledWidth = Math.ceil(width / DITHER_PIXEL_SIZE);
    const downsampledHeight = Math.ceil(height / DITHER_PIXEL_SIZE);
    const grayscale = new Array(downsampledWidth * downsampledHeight).fill(0);
    const alphaMap = new Array(downsampledWidth * downsampledHeight).fill(
      false
    );

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const dx = Math.floor(x / DITHER_PIXEL_SIZE);
        const dy = Math.floor(y / DITHER_PIXEL_SIZE);
        const di = dy * downsampledWidth + dx;

        if (data[i + 3] < 10) continue;
        alphaMap[di] = true;
        grayscale[di] +=
          0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }
    }

    for (let i = 0; i < grayscale.length; i++) {
      if (alphaMap[i]) {
        grayscale[i] /= DITHER_PIXEL_SIZE * DITHER_PIXEL_SIZE;
      }
    }

    for (let y = 0; y < downsampledHeight; y++) {
      for (let x = 0; x < downsampledWidth; x++) {
        const index = y * downsampledWidth + x;
        if (!alphaMap[index]) continue;

        const oldPixel = grayscale[index];
        const newPixel = oldPixel < 128 ? 0 : 255;
        grayscale[index] = newPixel;
        const error = oldPixel - newPixel;
        if (x + 1 < downsampledWidth && alphaMap[index + 1]) {
          grayscale[index + 1] += error * (7 / 16);
        }
        if (
          x - 1 >= 0 &&
          y + 1 < downsampledHeight &&
          alphaMap[index + downsampledWidth - 1]
        ) {
          grayscale[index + downsampledWidth - 1] += error * (3 / 16);
        }
        if (y + 1 < downsampledHeight && alphaMap[index + downsampledWidth]) {
          grayscale[index + downsampledWidth] += error * (5 / 16);
        }
        if (
          x + 1 < downsampledWidth &&
          y + 1 < downsampledHeight &&
          alphaMap[index + downsampledWidth + 1]
        ) {
          grayscale[index + downsampledWidth + 1] += error * (1 / 16);
        }
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        if (data[i + 3] < 10) continue;

        const dx = Math.floor(x / DITHER_PIXEL_SIZE);
        const dy = Math.floor(y / DITHER_PIXEL_SIZE);
        const di = dy * downsampledWidth + dx;
        const value = grayscale[di];
        data[i] = Math.min(value + DARK_COLOR[0], 255); // R
        data[i + 1] = Math.min(value + DARK_COLOR[1], 255); // G
        data[i + 2] = Math.min(value + DARK_COLOR[2], 255); // B
      }
    }

    ctx.putImageData(imageData, 0, 0);
  });

  return null;
}

function Cube() {
  const meshRef = useRef<Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <RoundedBox
      ref={meshRef}
      args={[3.5, 3.5, 3.5]}
      radius={1.25}
      smoothness={10}
    >
      <meshPhysicalMaterial
        color="#000"
        envMapIntensity={1.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.4}
        roughness={0.2}
        reflectivity={0.9}
      />
    </RoundedBox>
  );
}

export default function Logo({ size }: { size: number }) {
  return (
    <div className="flex items-center justify-center">
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: "relative",
        }}
      >
        <Canvas
          shadows
          camera={{ position: [3, 3, 3], fov: 50 }}
          gl={{ alpha: true, preserveDrawingBuffer: true }}
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />
          <directionalLight position={[0, 0, 5]} intensity={0.8} />
          <Environment preset="studio" background={false} />
          <Cube />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minDistance={3}
            maxDistance={10}
            enableDamping
            dampingFactor={0.05}
          />
          <CanvasDithering size={size} />
        </Canvas>
      </div>
    </div>
  );
}
