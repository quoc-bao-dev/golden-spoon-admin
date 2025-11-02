"use client";

import { ImageCmp } from "@/core/components/ui";
import { Logo } from "@/core/components/ui/Logo";
import { auth, googleProvider } from "@/module/auth/firebase";
import { apiAuth } from "@/service/auth/api";
import { useLoginMuatation } from "@/service/auth/mutation";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export const LoginPage = () => {
    const { mutateAsync: login } = useLoginMuatation();
    const router = useRouter();
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            await login(idToken);
            router.push("/transaction-history");
        } catch (error) {
            console.error("Firebase popup login error:", error);
        }
    };
    return (
        <div className="w-full h-screen flex items-center justify-center relative">
            <ImageCmp
                src="login-background"
                alt="login-background"
                className="absolute inset-0 w-full h-full object-cover"
                width={1000}
                height={1000}
            />

            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 px-12 py-10 bg-white rounded-[24px] flex flex-col items-center gap-6">
                <Logo width={300} height={300} className="w-[190px]" />
                <h1 className="text-3xl font-bold">Đăng nhập </h1>
                <button
                    onClick={handleLogin}
                    className="w-[270px] h-12 rounded-[8px] border border-gray-300 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:scale-[0.99] transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="22"
                        height="22"
                    >
                        <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12   s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20   s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                        <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.817C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657   C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        />
                        <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36   c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        />
                        <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.236-2.231,4.166-4.094,5.571   c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34.5,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                    </svg>
                    <span className="text-sm font-medium">
                        Tiếp tục với Google
                    </span>
                </button>
            </div>
        </div>
    );
};
