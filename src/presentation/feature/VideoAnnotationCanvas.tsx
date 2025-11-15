
// React
import { useEffect, useRef, useState } from 'react';

// Konva
import { Stage, Layer, Rect } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node'

// Client Types
import type {  VideoAnnotationCanvasProps } from '../types';


export default function VideoAnnotationCanvas({ selectedVideo }: VideoAnnotationCanvasProps ) {

    // Destructure props
    const { url, width, controls } = selectedVideo;

    // References
    const videoRef = useRef<HTMLVideoElement>(null);


    // ---------------- State ------------------------------------------------
    const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });
    const [showAnnotationCanvas, setShowAnnotationCanvas] = useState(false);
    const [rect, setRect] = useState<{
        x: number,
        y: number,
        width: number,
        height: number
    } | null>(null)
    const [isDrawing, setIsDrawing] = useState(false);


    // ------------------------ Effect Hook runs once --------------------------
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.onloadedmetadata = () => {
            setVideoSize({
                width: video.clientWidth,
                height: video.clientHeight
            });
        };
    }, [])

    // Listen for Video Pause and Play with Spacebar
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // ⌨️ SPACE BAR toggles play/pause 
        function handleKeyDown(e: KeyboardEvent) {
            if (e.code !== "Space") return;
            e.preventDefault(); // recommended to stop page scrolling on space

            if (video!.paused) {
                video!.play();
            } else {
                video!.pause();
            }
        }

        // ▶️ Video started playing
        function handlePlay() {
            setShowAnnotationCanvas(false);
        }

        // ⏸️ Video paused
        function handlePause() {
            setShowAnnotationCanvas(true);
        }

        // Register all events
        window.addEventListener("keydown", handleKeyDown);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);

        // Cleanup all event listeners when component unmounts
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
        };
    }, []);

    // ------------------------ Event Handlers ----------------------------------
    function handleMouseDown(e: KonvaEventObject<MouseEvent>){
        if (rect) return; // rectangle already exists


        const stage = e.target.getStage();
        if (!stage) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        setRect({
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
        });

        setIsDrawing(true);
    }

    function handleMouseMove(e: KonvaEventObject<MouseEvent>){
        if (!isDrawing || !rect) return;

        const stage = e.target.getStage();
        if(!stage) return;

        const pos = stage.getPointerPosition();
        if(!pos) return;

        setRect({
            ...rect,
            width: pos.x - rect.x,
            height: pos.y - rect.y,
        })
    }

    function handleMouseUp () {
        setIsDrawing(false);
    };



    // Render
    return (
        <div className='relative'>
            {/* Video */}
            <video ref={videoRef} width={width} preload="metadata" controls={controls}>
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Canvas Overlay  */}
            { showAnnotationCanvas && 
                <div className={"absolute border-4 border-red-900  top-0 left-0"}  style={{ width: videoSize.width, height: videoSize.height  }}>
                    <Stage width={videoSize.width} height={videoSize.height} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                        <Layer>
                            {rect && (
                                <Rect
                                    x={rect.x}
                                    y={rect.y}
                                    width={rect.width}
                                    height={rect.height}
                                    fill="rgba(255, 0, 0, 0.1)"
                                    stroke="red"
                                    strokeWidth={2}
                                    draggable
                                    onDragEnd={(e) => {
                                        setRect({
                                            ...rect,
                                            x: e.target.x(),
                                            y: e.target.y(),
                                        });
                                    }}
                                />
                            )}
                        </Layer>
                    </Stage>
                </div>
            }

        </div>

    )
}