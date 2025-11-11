import React, { useEffect, useRef } from "react";

const BackgroundEffect = () => {
  const gridCanvasRef = useRef(null);
  const starsCanvasRef = useRef(null);

  useEffect(() => {
    const gridCanvas = gridCanvasRef.current;
    const gridCtx = gridCanvas.getContext("2d");
    const starsCanvas = starsCanvasRef.current;
    const starsCtx = starsCanvas.getContext("2d");

    const resize = () => {
      gridCanvas.width = starsCanvas.width = window.innerWidth;
      gridCanvas.height = starsCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spacing = 60;
    let time = 0;

    function drawGrid() {
      gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
      for (let x = 0; x < gridCanvas.width; x += spacing) {
        for (let y = 0; y < gridCanvas.height; y += spacing) {
          const pulse = Math.sin((x + y + time) * 0.01);
          const radius = 3 + 2 * pulse;
          gridCtx.beginPath();
          gridCtx.arc(x, y, radius, 0, Math.PI * 2);
          gridCtx.fillStyle = `rgba(255, 255, 255, ${0.6 + 0.4 * pulse})`;
          gridCtx.fill();
        }
      }
    }

    let stars = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        length: Math.random() * 80 + 20,
        speed: Math.random() * 4 + 2,
      });
    }

    function drawStars() {
      starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      stars.forEach((star) => {
        starsCtx.beginPath();
        starsCtx.moveTo(star.x, star.y);
        starsCtx.lineTo(star.x - star.length, star.y + star.length);
        starsCtx.strokeStyle = "rgba(255,165,0,0.7)";
        starsCtx.lineWidth = 1.2;
        starsCtx.stroke();

        star.x += -star.speed;
        star.y += star.speed;

        if (star.y > window.innerHeight || star.x < 0) {
          star.x = Math.random() * window.innerWidth;
          star.y = -20;
        }
      });
    }

    function animate() {
      time += 1;
      drawGrid();
      drawStars();
      requestAnimationFrame(animate);
    }

    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <>
      <canvas
        ref={gridCanvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
        }}
      />
      <canvas
        ref={starsCanvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
    </>
  );
};

export default BackgroundEffect;
