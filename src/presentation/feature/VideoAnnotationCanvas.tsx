
// React
import { useEffect, useRef, useState } from 'react';

// Konva
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node'
import type { Rect as KonvaRect } from 'konva/lib/shapes/Rect';
import type { Transformer as KonvaTransformer } from 'konva/lib/shapes/Transformer';

// Client Types
import type {  VideoAnnotationCanvasProps, VideoScreenShot, VideoSelectionBox } from '../types/video';


export default function VideoAnnotationCanvas({ selectedVideo }: VideoAnnotationCanvasProps ) {

    // Destructure props
    const { url, width, controls } = selectedVideo;

    // References
    const videoRef = useRef<HTMLVideoElement>(null);
    const rectRef = useRef<KonvaRect | null>(null);
    const transformerRef = useRef<KonvaTransformer | null>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);


    // ---------------- State ------------------------------------------------
    // Stage
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 }); // For the Stage
    const [showAnnotationCanvas, setShowAnnotationCanvas] = useState(false);
    // Rect
    const [rect, setRect] = useState<VideoSelectionBox>(null)
    const [isDrawing, setIsDrawing] = useState(false);
    // Image
    const [captureImage, setCapturedImage] = useState<VideoScreenShot>();


    // ------------------------ Effect Hook runs once --------------------------
    // Load Video 
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.onloadedmetadata = () => {
            setStageSize({
                width: video.clientWidth,
                height: video.clientHeight
            });
        };
    }, [])

    // Listen for Video Pause and Play with Spacebar
    // Runs once — listens for video play/pause
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        function handlePlay() {
            setShowAnnotationCanvas(false);
        }

        function handlePause() {
            setShowAnnotationCanvas(true);
        }

        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);

        return () => {
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
        };
    }, []);



        // Always has the latest rect when pressing keys
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        function handleKeyDown(e: KeyboardEvent) {
            // SPACE = play/pause
            if (e.code === "Space") {
                e.preventDefault();
                video!.paused ? video!.play() : video!.pause();
            }

            // ENTER = capture frame
            if (e.code === "Enter") {
                e.preventDefault();
                const isRectFrameCaptured = handleCaptureRectFrame(video!, rect);
                if(isRectFrameCaptured){
                    console.log("Successfully captured");
                }else{
                    console.log("Not captured")
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

    }, [rect]); // ← ensures handleKeyDown always sees latest rect



    // Attach the Transformer to the Rectangle when it is present on screen
    useEffect(() => {
        if (
            rectRef.current &&
            transformerRef.current &&
            transformerRef.current.nodes()[0] !== rectRef.current
        ) {
            transformerRef.current.nodes([rectRef.current]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [rect, showAnnotationCanvas]);

    // ------------------------ Event Handlers ----------------------------------

    // Events to handle drag selection
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

    function handleCaptureRectFrame(video: HTMLVideoElement, rect: VideoSelectionBox) {
        if (!videoRef.current || !rect) return;

        const scaleX = video.videoWidth / video.clientWidth;
        const scaleY = video.videoHeight / video.clientHeight;

        const canvas = document.createElement('canvas');
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return false;

        ctx.drawImage(
            video,
            rect.x * scaleX,           // sx: start x in video pixels
            rect.y * scaleY,           // sy: start y in video pixels
            rect.width * scaleX,       // sw: width in video pixels
            rect.height * scaleY,      // sh: height in video pixels
            0,                         // dx: start x on canvas
            0,                         // dy: start y on canvas
            rect.width,                // dw: width on canvas
            rect.height                // dh: height on canvas
        );

        // Convert canvas to Blob
        canvas.toBlob((blob) => {
            if (!blob) return;

            // Save the captured image to update UI State
            setCapturedImage({
                blob,
                objectURL: URL.createObjectURL(blob)
            })

            // Send the Blob to the backend
            submitScreenshotToAPI(blob)
        }, 'image/png');
        
        return true;
    }

    async function submitScreenshotToAPI(blob: Blob){
        // 2. Create Form Data
        const formData = new FormData();
        formData.append('videoName', selectedVideo.name);
        formData.append('screenshot', blob, 'screenshot.png');

        // Send form data to backend
        await fetch(`/api/videos/${selectedVideo.name}/screenshots`, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            console.log('Image saved on server:', data);
            // Optionally update state with permanent URL returned by server
        })
        .catch(err => console.error('Error uploading screenshot:', err));
    }

    
    


    // Render
    return (
        <>
            <div className='relative'>
                {/* Video */}
                <video ref={videoRef} width={width} preload="metadata" controls={controls} crossOrigin="anonymous">
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Canvas Overlay  */}
                { showAnnotationCanvas && 
                    <div className={"absolute border-4 border-red-900  top-0 left-0"}  style={{ width: stageSize.width, height: stageSize.height  }}>
                        <Stage width={stageSize.width} height={stageSize.height} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
                            <Layer>
                                {rect && (
                                    <>
                                        <Rect
                                            ref={rectRef}
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
                                            onTransformEnd={() => {
                                                if (rectRef.current) {
                                                    const node = rectRef.current;

                                                    // Save the rectangle's new position and size into state
                                                    setRect({
                                                        x: node.x(),
                                                        y: node.y(),
                                                        width: node.width() * node.scaleX(),
                                                        height: node.height() * node.scaleY(),
                                                    });

                                                    // Reset the scale back to 1 so that future transforms start clean
                                                    node.scaleX(1);
                                                    node.scaleY(1);
                                                }
                                            }}
                                        />

                                        <Transformer
                                            ref={transformerRef}
                                            rotateEnabled={false} // optional: disable rotation
                                        />
                                    </>

                                )}
                            </Layer>
                        </Stage>
                    </div>
                }

            </div>
            {/* <div ref={canvasContainerRef} className="mt-4 border" /> */}
            <div>
                <img src={captureImage?.objectURL}></img>
            </div>
        </>
        

    )
}