"use client";

import Link from "next/link";
import { User, Lock } from "lucide-react";

export default function LoginPage() {

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">

      <div className="w-full max-w-md bg-card border border-border p-8 rounded-xl shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Admin Login
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your admin dashboard
          </p>
        </div>



        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Username
            </label>
            <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                type="text"
                required
                placeholder="Enter username"
                className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                />
            </div>
        </div>

        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Password
            </label>
            <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                />
            </div>
        </div>

          <Link
            href={'/admin/dashboard'}
            className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium py-2.5 rounded-md text-sm cursor-pointer transition-all flex items-center justify-center gap-2 mt-6"
          >
            Log In
          </Link>


      </div>
    </div>
  );
}