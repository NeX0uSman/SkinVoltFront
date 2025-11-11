import React, { useRef, useState, useEffect } from 'react'
import cl from './ImageCarousel.module.css'
const ImageCarousel = ({ images }) => {

    const [rotation, setRotation] = useState(0);
    const [velocity, setVelocity] = useState(0);

    const dragging = useRef(false);
    const lastX = useRef(0);
    const frame = useRef(null);

    useEffect(() => {
        const animate = () => {
            if (!dragging.current) {
                setRotation((prev) => prev + velocity);
                setVelocity((v) => v * 0.95); // Friction
            }
            frame.current = requestAnimationFrame(animate);
        };
        frame.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame.current);
    }, [velocity]);

    const handleMouseDown = (e) => {
        dragging.current = true;
        lastX.current = e.clientX;
    }

    const handleMouseMove = (e) => {
        if (dragging.current) {
            const delta = e.clientX - lastX.current;
            lastX.current = e.clientX;
            setRotation((prev) => prev + delta * 0.5)
            setVelocity(delta * 0.5)
        }
    }

    const handleMouseUp = () => {
        dragging.current = false;
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [])
    return (
        <div className={cl.carousel_wrapper} onMouseDown={handleMouseDown}>
            <div className={cl.carousel_gallery} style={{ transform: `rotateY(${rotation}deg)` }}>
                {images.map((img, index) => {
                    const sliceAngle = 360 / images.length;
                    const angle = sliceAngle * index;
                    const itemWidth = 250; // ширина карточки
                    const spacing = 1.3;   // коэффициент "расстояния" (чуть больше 1 = больше зазор)
                    const radius = (itemWidth * spacing) / (2 * Math.tan(Math.PI / images.length));

                    const totalAngle = (angle + rotation) % 360;
                    const isBack = totalAngle > 90 && totalAngle < 270;
                    return (
                        <div
                            key={index}
                            className={`${cl.carousel_image} ${isBack ? cl.image_dimmed : ''}`}
                            style={{
                                transform: `rotateY(${angle}deg) translateZ(${radius}px) translate(-50%, -50%)`,
                                zIndex: isBack ? 0 : 1,
                                opacity: isBack ? 0.5 : 1,
                            }}
                        >
                            <img src={`http://localhost:3000${img.imageUrl}`} alt={`Carousel item ${index}`} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ImageCarousel