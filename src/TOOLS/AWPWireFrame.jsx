import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AWPWireframe = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.pointerEvents = 'none';  // <--- отключаем обработку мыши

    const existingCanvas = mountRef.current.querySelector('canvas');
    if (existingCanvas) mountRef.current.removeChild(existingCanvas);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;

    let model = null;
    let animationId = null;

    // Store original positions & glitch masks per mesh
    const originalPosMap = new WeakMap();
    let glitchMaskMap = new WeakMap();

    // Glitch state
    let glitchTimer = 0;
    let glitchActive = false;
    let glitchDir = new THREE.Vector3();
    let glitchStrength = 0;

    const startGlitch = () => {
      glitchActive = true;
      glitchTimer = 0.1 + Math.random() * 0.15; // short burst
      glitchStrength = 1 + Math.random() * 4;
      glitchDir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();

      glitchMaskMap = new WeakMap();
      model.traverse((child) => {
        if (child.isMesh) {
          const count = child.geometry.attributes.position.count;
          const mask = new Uint8Array(count);
          for (let i = 0; i < count; i++) {
            if (Math.random() < 0.07) mask[i] = 1; // ~7% vertices
          }
          glitchMaskMap.set(child, mask);
        }
      });
    };

    const loader = new GLTFLoader();
    loader.load(
      './assets/awpcs2.glb',
      (gltf) => {
        model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        model.position.x -= center.x + 4;
        model.position.y -= center.y + 3.3;
        model.position.z -= center.z;

        const maxDimension = Math.max(size.x, size.y, size.z);
        const scaleFactor = 23 / maxDimension;
        model.scale.setScalar(scaleFactor);

        model.rotation.x = Math.PI / 3;
        model.rotation.z = Math.PI / 0.45;
        model.rotation.y = Math.PI / 0.3;

        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              wireframe: true,
              side: THREE.DoubleSide,
            });
            // Save original positions for each mesh
            originalPosMap.set(
              child,
              new Float32Array(child.geometry.attributes.position.array)
            );
          }
        });

        scene.add(model);
      },
      undefined,
      (err) => console.error('Ошибка загрузки модели:', err)
    );

    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (model) {
        // Random glitch trigger
        if (!glitchActive && Math.random() < 0.02) {
          startGlitch();
        }

        if (glitchActive) {
          glitchTimer -= delta;

          model.traverse((child) => {
            if (child.isMesh) {
              const pos = child.geometry.attributes.position;
              const orig = originalPosMap.get(child);
              const mask = glitchMaskMap.get(child);

              for (let i = 0; i < pos.count; i++) {
                if (mask[i]) {
                  pos.setXYZ(
                    i,
                    orig[i * 3] + glitchDir.x * glitchStrength,
                    orig[i * 3 + 1] + glitchDir.y * glitchStrength,
                    orig[i * 3 + 2] + glitchDir.z * glitchStrength
                  );
                } else {
                  pos.setXYZ(i, orig[i * 3], orig[i * 3 + 1], orig[i * 3 + 2]);
                }
              }

              pos.needsUpdate = true;
              child.material.color.set(glitchActive ? 0xaaaaaa : 0xffffff);
            }
          });

          if (glitchTimer <= 0) glitchActive = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);

      if (model) {
        scene.remove(model);
        model.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }

      if (renderer.domElement && mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
    />
  );
};

export default AWPWireframe;
