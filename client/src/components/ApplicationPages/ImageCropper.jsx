import Cropper from "react-easy-crop";
import { useState } from "react";

const ImageCropper = ({ image, onCropComplete }) => {
    const [crop, setCrop] = useState({
        x: 0,
        y: 0,
    });

    const [zoom, setZoom] = useState(1);

    return (
        <div className="relative w-full h-100">
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
            />

            <div className="absolute bottom-4 left-4 right-4">
                <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) =>
                        setZoom(Number(e.target.value))
                    }
                />
            </div>
        </div>
    );
};

export default ImageCropper;