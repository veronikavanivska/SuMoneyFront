import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

type Props = {
    label: string;
    value: File | null | undefined;
    onChange: (file: File | null) => void;
};

export function ReceiptInput({ label, value, onChange }: Props) {
    const { t } = useTranslation();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const cameraInputRef = useRef<HTMLInputElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.files?.[0] ?? null);
        event.target.value = "";
    };

    const openDesktopCamera = async () => {
        setCameraError(null);

        if (!navigator.mediaDevices?.getUserMedia) {
            cameraInputRef.current?.click();
            return;
        }

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment"
                },
                audio: false
            });

            setStream(mediaStream);
            setCameraOpen(true);
        } catch {
            setCameraError(t("expenses.cameraUnavailable"));
            cameraInputRef.current?.click();
        }
    };

    const closeCamera = () => {
        stream?.getTracks().forEach((track) => track.stop());
        setStream(null);
        setCameraOpen(false);
    };

    const capturePhoto = () => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    return;
                }

                const file = new File(
                    [blob],
                    `receipt-${Date.now()}.jpg`,
                    { type: "image/jpeg" }
                );

                onChange(file);
                closeCamera();
            },
            "image/jpeg",
            0.92
        );
    };

    useEffect(() => {
        if (cameraOpen && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [cameraOpen, stream]);

    useEffect(() => {
        return () => {
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, [stream]);

    return (
        <div className="field receipt-field">
            <span>{label}</span>

            <input
                ref={fileInputRef}
                className="hidden-file-input"
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={handleFileChange}
            />

            <input
                ref={cameraInputRef}
                className="hidden-file-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
            />

            <div className="receipt-picker">
                <div className="receipt-file-name">
                    {value ? value.name : t("expenses.noReceiptSelected")}
                </div>

                <div className="receipt-actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {t("expenses.chooseFile")}
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={openDesktopCamera}
                    >
                        {t("expenses.takePhoto")}
                    </Button>

                    {value && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onChange(null)}
                        >
                            {t("expenses.clearReceipt")}
                        </Button>
                    )}
                </div>
            </div>

            {cameraError && (
                <div className="form-error">
                    {cameraError}
                </div>
            )}

            {cameraOpen && (
                <div className="camera-overlay">
                    <div className="camera-card">
                        <div className="camera-header">
                            <h3>{t("expenses.cameraTitle")}</h3>

                            <button
                                type="button"
                                className="icon-button"
                                onClick={closeCamera}
                            >
                                ×
                            </button>
                        </div>

                        <video
                            ref={videoRef}
                            className="camera-video"
                            autoPlay
                            playsInline
                            muted
                        />

                        <div className="camera-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={closeCamera}
                            >
                                {t("common.cancel")}
                            </Button>

                            <Button
                                type="button"
                                onClick={capturePhoto}
                            >
                                {t("expenses.capturePhoto")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}