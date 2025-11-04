"use client";

import React from "react";
import Image from "next/image";
import { _Image } from "@/core/const/asset/image";

type AppLoadingProps = {
    fullscreen?: boolean;
};

export const AppLoading: React.FC<AppLoadingProps> = ({
    fullscreen = true,
}) => {
    return (
        <div
            className={`$${""} ${
                fullscreen ? "fixed inset-0" : "w-full h-full"
            } flex items-center justify-center bg-white`}
        >
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 animate-pulseSlow rounded-full blur-2xl bg-white/60" />
                <div className="animate-bounceSoft">
                    <Image
                        src={_Image["logo-symbol"]}
                        alt="app-loading"
                        width={96}
                        height={96}
                        priority
                        className="drop-shadow-md select-none"
                    />
                </div>
            </div>

            <style jsx>{`
                @keyframes bounceSoft {
                    0%,
                    100% {
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        transform: translateY(-10px) scale(1.05);
                    }
                }
                @keyframes pulseSlow {
                    0%,
                    100% {
                        opacity: 0.25;
                        transform: scale(0.9);
                    }
                    50% {
                        opacity: 0.6;
                        transform: scale(1.1);
                    }
                }
                .animate-bounceSoft {
                    animation: bounceSoft 1.2s ease-in-out infinite;
                }
                .animate-pulseSlow {
                    animation: pulseSlow 1.8s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default AppLoading;
