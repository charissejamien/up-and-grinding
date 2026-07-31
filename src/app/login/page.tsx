import { Input } from "@/components/ui/input"
import Image from "next/image";
import Link from "next/link";

export default function AdminLogin() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md space-y-5">
                
                <div className="flex justify-center">
                    <Image src={'/logo.png'} alt="logo" width={200} height={200} />
                </div>

                <p className="text-xl font-bold text-center">Admin Login</p>
                
                <div className="space-y-2">
                    <p className="text-sm font-medium">Username</p>
                    <Input type="text" />
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Password</p>
                    <Input type="password" />
                </div>

                <Link href="/admin/dashboard" className="block w-full">
                    <button className="bg-foreground py-2 px-5 text-white rounded-lg w-full mt-5 hover:opacity-90 transition-opacity">
                        Login
                    </button>
                </Link>
            </div>
        </div>
    );
}