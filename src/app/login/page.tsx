"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, Plane } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { unsplash, IMG } from "@/data/images";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    async function resolvePostAuthRoute(supabase: ReturnType<typeof createBrowserSupabaseClient>, userId: string) {
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

        if (profileError || !profileData) {
            return "/dashboard";
        }

        return profileData.role === "admin" ? "/admin" : "/dashboard";
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setMessage(null);

        const supabase = createBrowserSupabaseClient();

        if (mode === "signIn") {
            if (!email || !password) {
                setError("Please enter both email and password.");
                return;
            }

            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            setLoading(false);

            if (error) {
                setError(error.message);
                return;
            }

            if (data?.session?.user?.id) {
                const redirectTo = await resolvePostAuthRoute(supabase, data.session.user.id);
                router.push(redirectTo);
                return;
            }

            setMessage("Signed in successfully.");
            router.push("/dashboard");
            return;
        }

        if (!fullName || !email || !phone || !password || !confirmPassword) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone,
                },
            },
        });
        setLoading(false);

        if (signUpError) {
            setError(signUpError.message);
            return;
        }

        if (data?.user?.id) {
            const { error: profileError } = await supabase.from("profiles").insert([
                {
                    id: data.user.id,
                    full_name: fullName,
                    phone,
                    role: "user",
                },
            ]);
            if (profileError) {
                console.warn("Unable to save profile metadata:", profileError.message);
            }
        }

        if (data?.session) {
            router.push("/dashboard");
            return;
        }

        setMessage("Your account has been created. Please check your email to verify your address before signing in.");
        setMode("signIn");
        setPassword("");
        setConfirmPassword("");
    }

    async function handleGoogleSignIn() {
        setError(null);
        setGoogleLoading(true);
        const supabase = createBrowserSupabaseClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) {
            setGoogleLoading(false);
            setError(error.message);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-24 lg:py-28">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-card lg:grid-cols-2"
            >
                {/* Left: image collage */}
                <div className="relative hidden min-h-[600px] flex-col justify-end overflow-hidden bg-ink p-10 lg:flex">
                    <motion.img
                        initial={{ scale: 1.15, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        src={unsplash(IMG.manali, 1200)}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/10" />

                    <motion.div
                        initial={{ opacity: 0, x: -30, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative hidden w-48 overflow-hidden rounded-2xl border-4 border-white/90 shadow-float sm:block lg:absolute lg:right-8 lg:top-24"
                    >
                        <img src={unsplash(IMG.goa, 500)} alt="" className="h-32 w-full object-cover" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30, y: -20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10 mb-2 flex items-center gap-2 text-white"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                            <Plane className="h-4 w-4" />
                        </span>
                        <span className="font-bold text-lg tracking-tight">Dream Travels</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-10"
                    >
                        <h2 className="font-sans text-3xl font-bold text-white text-balance">
                            Secure Your Next Adventure
                        </h2>
                        <p className="mt-3 max-w-sm text-sm text-white/80">
                            Discover curated escapes, manage your bookings, and plan your dream vacation — all in one place.
                        </p>
                    </motion.div>
                </div>

                {/* Right: form */}
                <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14">
                    <div className="mx-auto w-full max-w-sm">
                        <div className="mb-8 flex gap-2 rounded-full bg-surface p-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setMode("signIn");
                                    setError(null);
                                    setMessage(null);
                                }}
                                className={`relative flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${mode === "signIn" ? "text-white" : "text-ink/50 hover:text-ink"
                                    }`}
                            >
                                {mode === "signIn" && (
                                    <motion.span
                                        layoutId="auth-tab-pill"
                                        className="absolute inset-0 rounded-full bg-primary"
                                        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                                    />
                                )}
                                <span className="relative">Sign In</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode("signUp");
                                    setError(null);
                                    setMessage(null);
                                }}
                                className={`relative flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${mode === "signUp" ? "text-white" : "text-ink/50 hover:text-ink"
                                    }`}
                            >
                                {mode === "signUp" && (
                                    <motion.span
                                        layoutId="auth-tab-pill"
                                        className="absolute inset-0 rounded-full bg-primary"
                                        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                                    />
                                )}
                                <span className="relative">Sign Up</span>
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, x: mode === "signIn" ? -16 : 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: mode === "signIn" ? 16 : -16 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h1 className="font-sans text-2xl font-bold text-ink">
                                    {mode === "signIn" ? "Welcome back" : "Create your account"}
                                </h1>
                                <p className="mt-2 text-sm text-ink/60">
                                    {mode === "signIn"
                                        ? "Sign in to access your bookings, wishlist, and saved trips."
                                        : "Join Dream Travels to start planning your next escape."}
                                </p>

                                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                                    {mode === "signUp" && (
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <InputField
                                                icon={<User className="h-4 w-4" />}
                                                type="text"
                                                placeholder="Full name"
                                                value={fullName}
                                                onChange={setFullName}
                                            />
                                            <InputField
                                                icon={<Phone className="h-4 w-4" />}
                                                type="tel"
                                                placeholder="Phone number"
                                                value={phone}
                                                onChange={setPhone}
                                            />
                                        </div>
                                    )}

                                    <InputField
                                        icon={<Mail className="h-4 w-4" />}
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={setEmail}
                                    />

                                    <InputField
                                        icon={<Lock className="h-4 w-4" />}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={setPassword}
                                        trailing={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                className="text-ink/40 hover:text-ink/70"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        }
                                    />

                                    {mode === "signUp" && (
                                        <InputField
                                            icon={<Lock className="h-4 w-4" />}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm password"
                                            value={confirmPassword}
                                            onChange={setConfirmPassword}
                                        />
                                    )}

                                    {mode === "signIn" && (
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                className="text-xs font-semibold text-primary hover:underline"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}

                                    <AnimatePresence>
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
                                            >
                                                {error}
                                            </motion.p>
                                        )}
                                        {message && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                                            >
                                                {message}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-primary/70"
                                    >
                                        {loading
                                            ? mode === "signIn"
                                                ? "Signing in..."
                                                : "Creating account..."
                                            : mode === "signIn"
                                                ? "Sign In"
                                                : "Sign Up"}
                                    </motion.button>
                                </form>

                                <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-ink/40">
                                    <span className="h-px flex-1 bg-ink/10" />
                                    or continue with
                                    <span className="h-px flex-1 bg-ink/10" />
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={googleLoading}
                                    className="flex w-full items-center justify-center gap-3 rounded-full border border-ink/[0.08] bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-ink/5 disabled:opacity-60"
                                >
                                    <GoogleIcon className="h-4 w-4" />
                                    {googleLoading ? "Redirecting..." : "Continue with Google"}
                                </motion.button>

                                <p className="mt-8 text-center text-sm text-ink/60">
                                    {mode === "signIn" ? (
                                        <>
                                            New to Dream Travels?{" "}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMode("signUp");
                                                    setError(null);
                                                    setMessage(null);
                                                }}
                                                className="font-semibold text-primary"
                                            >
                                                Create an account
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMode("signIn");
                                                    setError(null);
                                                    setMessage(null);
                                                }}
                                                className="font-semibold text-primary"
                                            >
                                                Sign in instead
                                            </button>
                                        </>
                                    )}
                                </p>

                                <p className="mt-4 text-center text-xs text-ink/40">
                                    <Link href="/" className="hover:text-ink/60">
                                        &larr; Back to home
                                    </Link>
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

function InputField({
    icon,
    type,
    placeholder,
    value,
    onChange,
    trailing,
}: {
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    trailing?: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-ink/[0.08] bg-surface px-4 py-3 transition focus-within:border-primary">
            <span className="text-ink/40">{icon}</span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
            />
            {trailing}
        </div>
    );
}

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                fill="#4285F4"
                d="M23.49 12.27c0-.85-.08-1.68-.22-2.47H12v4.68h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.58-5.15 3.58-8.82Z"
            />
            <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.86-3c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A12 12 0 0 0 12 24Z"
            />
            <path
                fill="#FBBC05"
                d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.28a12 12 0 0 0 0 10.78l3.99-3.11Z"
            />
            <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.61l3.99 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
            />
        </svg>
    );
}
