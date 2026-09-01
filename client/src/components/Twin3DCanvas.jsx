// Twin3DCanvas.jsx - Three.js 3D Digital Twin Visualizer (Lime & Dark Theme)

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Layers, Eye } from 'lucide-react';

const Twin3DCanvas = ({ cellTemps = [], selectedCell, onSelectCell }) => {
  const mountRef = useRef(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const sceneObjectsRef = useRef({ cells: [], channels: [], particles: null });

  const getTempColor = (temp) => {
    // Range 24°C to 42°C
    const t = Math.min(Math.max((temp - 24) / (40 - 24), 0), 1);
    const color = new THREE.Color();
    if (t < 0.35) {
      // Lime green to light green
      color.setRGB(0.70 - t * 0.3, 0.94 - t * 0.1, 0.0);
    } else if (t < 0.7) {
      // Yellow-amber
      color.setRGB(0.95, 0.65 - (t - 0.35) * 0.8, 0.05);
    } else {
      // Vivid red/rose for hotspot
      color.setRGB(0.95, 0.15, 0.25);
    }
    return color;
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 600;
    const height = currentMount.clientHeight || 380;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b); // deep matte black

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 14, 28);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    currentMount.innerHTML = '';
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xb4f000, 0.9);
    dirLight1.position.set(15, 25, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight2.position.set(-15, -10, -20);
    scene.add(dirLight2);

    // Group
    const packGroup = new THREE.Group();
    scene.add(packGroup);

    // Aluminum casing plates
    const basePlateGeo = new THREE.BoxGeometry(22, 1.2, 9);
    const basePlateMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.8,
      roughness: 0.3
    });
    const basePlate = new THREE.Mesh(basePlateGeo, basePlateMat);
    basePlate.position.y = -4.2;
    packGroup.add(basePlate);

    const topPlate = basePlate.clone();
    topPlate.position.y = 4.2;
    packGroup.add(topPlate);

    // Cylindrical 21700 cells
    const cellRadius = 1.05;
    const cellHeight = 7.0;
    const cylinderGeo = new THREE.CylinderGeometry(cellRadius, cellRadius, cellHeight, 32);
    const capGeo = new THREE.CylinderGeometry(cellRadius * 0.6, cellRadius * 0.6, 0.4, 24);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, metalness: 0.9, roughness: 0.2 });

    const cells = [];
    const channels = [];

    const positions = [
      { id: "C1", x: -8, z: 2.2 },
      { id: "C2", x: -4, z: 2.2 },
      { id: "C3", x: 0, z: 2.2 },
      { id: "C4", x: 4, z: 2.2 },
      { id: "C5", x: 8, z: 2.2 },
      { id: "C6", x: 8, z: -2.2 },
      { id: "C7", x: 4, z: -2.2 },
      { id: "C8", x: 0, z: -2.2 },
      { id: "C9", x: -4, z: -2.2 },
      { id: "C10", x: -8, z: -2.2 },
    ];

    positions.forEach((pos, idx) => {
      const initialTemp = (cellTemps && cellTemps[idx]) || 28.0;
      const cellMat = new THREE.MeshStandardMaterial({
        color: getTempColor(initialTemp),
        metalness: 0.4,
        roughness: 0.35,
        emissive: getTempColor(initialTemp),
        emissiveIntensity: 0.2
      });

      const cellMesh = new THREE.Mesh(cylinderGeo, cellMat);
      cellMesh.position.set(pos.x, 0, pos.z);
      cellMesh.castShadow = true;
      cellMesh.receiveShadow = true;
      cellMesh.userData = { id: pos.id, index: idx };

      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.y = cellHeight / 2 + 0.2;
      cellMesh.add(capMesh);

      packGroup.add(cellMesh);
      cells.push(cellMesh);

      const channelGeo = new THREE.BoxGeometry(0.3, cellHeight, 3.8);
      const channelMat = new THREE.MeshStandardMaterial({
        color: 0xb4f000,
        transparent: true,
        opacity: 0.25,
        roughness: 0.1,
        metalness: 0.7
      });
      const channelMesh = new THREE.Mesh(channelGeo, channelMat);
      channelMesh.position.set(pos.x + 1.8, 0, pos.z);
      packGroup.add(channelMesh);
      channels.push(channelMesh);
    });

    // Particle flow stream
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xb4f000,
      size: 0.35,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    packGroup.add(particleSystem);

    sceneObjectsRef.current = { cells, channels, particles: particleSystem, packGroup };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cells);
      if (intersects.length > 0) {
        setHoveredCell(intersects[0].object.userData.id);
      } else {
        setHoveredCell(null);
      }
    };

    const handleClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cells);
      if (intersects.length > 0 && onSelectCell) {
        onSelectCell(intersects[0].object.userData.id);
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleDragMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      packGroup.rotation.y += deltaX * 0.008;
      packGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleDragMove);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        packGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.25 - 0.2;
      }

      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let x = posAttr.getX(i) + 0.06;
        if (x > 9.5) x = -9.5;
        posAttr.setX(i, x);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleDragMove);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('click', handleClick);
        renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      }
      if (currentMount) {
        currentMount.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    const { cells } = sceneObjectsRef.current;
    if (!cells || cells.length === 0) return;

    cells.forEach((cell, idx) => {
      const temp = (cellTemps && cellTemps[idx]) || 28.0;
      const color = getTempColor(temp);
      const isSelected = cell.userData.id === selectedCell;

      cell.material.color.copy(color);
      cell.material.emissive.copy(isSelected ? new THREE.Color(0xffffff) : color);
      cell.material.emissiveIntensity = isSelected ? 0.5 : 0.2;

      cell.scale.set(isSelected ? 1.08 : 1, isSelected ? 1.04 : 1, isSelected ? 1.08 : 1);
    });
  }, [cellTemps, selectedCell]);

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bento-card">
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-dark-950 px-3.5 py-1.5 rounded-full border border-dark-700 text-xs font-mono">
        <Eye className="w-3.5 h-3.5 text-lime" />
        <span className="text-white font-bold">3D Pack Visualizer</span>
        <span className="text-[10px] text-dark-950 font-bold bg-lime px-2 py-0.5 rounded-full">
          10x 21700
        </span>
      </div>

      {(hoveredCell || selectedCell) && (
        <div className="absolute top-4 right-4 z-10 bg-dark-950 border border-lime/40 px-3.5 py-1.5 rounded-xl text-xs font-mono shadow-lime-sm">
          <div className="text-zinc-400">Inspecting Cell:</div>
          <div className="text-lime font-bold text-sm">
            {hoveredCell || selectedCell} — {cellTemps[parseInt((hoveredCell || selectedCell).replace('C', '')) - 1] || 28.5}°C
          </div>
        </div>
      )}

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 bg-dark-950 px-3.5 py-1.5 rounded-full border border-dark-700 pointer-events-auto text-[10px] font-mono">
          <span className="text-lime font-bold">24°C</span>
          <div className="w-28 h-2 rounded-full bg-gradient-to-r from-lime via-amber-400 to-rose-500" />
          <span className="text-rose-400 font-bold">40°C+</span>
        </div>

        <div className="text-[11px] text-zinc-400 bg-dark-950 px-3 py-1 rounded-full border border-dark-800">
          Drag to rotate • Click cell to inspect
        </div>
      </div>
    </div>
  );
};

export default Twin3DCanvas;
