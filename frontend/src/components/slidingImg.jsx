import { useEffect, useRef } from "react";

const SlidingImg = () => {
    const images = [
        "../../public/slide_1.jpeg",
        "../../public/slide_2.jpg",
        "../../public/slide_3.jpeg"
    ];

    const containerRef = useRef(null);
    const imageCount = images.length;

    useEffect(() => {
        let index = 0; // Track the current slide index

        const interval = setInterval(() => {
            if (containerRef.current) {
                const container = containerRef.current;
                index = (index + 1) % imageCount; // Cycle through images
                container.scrollTo({
                    left: index * container.offsetWidth,
                    behavior: "smooth",
                });
            }
        }, 3000); // Slide every 2 seconds

        return () => clearInterval(interval);
    }, [imageCount]);

    return (
        <>
            <style>{`
                .container {
                    display: flex;
                    overflow-x: hidden;
                    scroll-snap-type: x mandatory;
                    width: 100%;
                    height: 100%;
                    position: relative;
                }

                .container img {
                    min-width: 100%;
                    height: 85vh;
                    scroll-snap-align: start;
                    object-fit: cover;                    
                    border-radius : 10px;
                    margin : 10px 0px 0 0;
                    padding : 0 10px 0 10px;
                }
            `}</style>

            <div className="container" ref={containerRef}>
                {images.map((src, index) => (
                    <img key={index} src={src} alt={`Slide ${index + 1}`} />
                ))}
            </div>
        </>
    );
};

export default SlidingImg;
