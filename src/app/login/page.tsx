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
            // A database trigger (on_auth_user_created) already creates this row
            // from auth.users, so upsert here instead of insert to avoid a
            // duplicate-key conflict and to fill in full_name/phone right away.
            // `role` is intentionally omitted here — it's server-controlled
            // (see enforce_profiles_role_default trigger) and should never
            // be set from client-side code.
            const { error: profileError } = await supabase.from("profiles").upsert(
                [
                    {
                        id: data.user.id,
                        email,
                        full_name: fullName,
                        phone,
                    },
                ],
                { onConflict: "id" }
            );
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
        <main data-tone="dark" className="relative flex min-h-screen items-center justify-center px-4 py-24">
            {/* Terrain backdrop: the place is present even on a utility screen. */}
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
                <img
                    src={unsplash(IMG.manali, 2000)}
                    alt=""
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[oklch(0.14_0.02_158/0.48)]" />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(70% 55% at 50% 45%, transparent 0%, oklch(0.14 0.02 158 / 0.55) 100%)",
                    }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[440px]"
            >
                <Link
                    href="/"
                    className="mb-7 flex items-center justify-center gap-2.5 text-ink"
                >
                    <img
                        src="/logo.png"
                        alt="Dream Travels Logo"
                        className="h-10 w-10 object-contain rounded-full bg-white/40 p-0.5 shadow-xs"
                    />
                    <span className="font-display text-[19px] tracking-[-0.02em] font-bold">
                        Dream Travels
                    </span>
                </Link>

                <div data-tone="light" className="rounded-[16px] border border-border bg-[rgba(245,245,238,0.94)] p-7 backdrop-blur-2xl sm:p-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 className="font-display text-[30px] leading-tight text-ink">
                                {mode === "signIn" ? "Welcome back" : "Create your account"}
                            </h1>
                            <p className="mt-2 text-[15px] text-ink-muted">
                                {mode === "signIn"
                                    ? "Sign in to reach your bookings and saved trips."
                                    : "Start planning your next escape with Dream Travels."}
                            </p>

                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={googleLoading}
                                className="mt-7 flex w-full items-center justify-center gap-3 rounded-[11px] border border-border bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition-colors duration-[180ms] hover:border-border-lit hover:bg-surface-2 disabled:opacity-60"
                            >
                                <GoogleIcon className="h-4 w-4" />
                                {googleLoading ? "Redirecting..." : "Continue with Google"}
                            </button>

                            <div className="my-6 flex items-center gap-4 text-xs text-ink-muted">
                                <span className="h-px flex-1 bg-border" />
                                or
                                <span className="h-px flex-1 bg-border" />
                            </div>

                            <form className="space-y-3.5" onSubmit={handleSubmit}>
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
                                            className="text-ink-muted transition-colors hover:text-ink"
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
                                            className="text-xs font-semibold text-canopy hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            role="alert"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden rounded-[11px] border border-[oklch(0.55_0.18_25)] bg-[oklch(0.55_0.18_25/0.12)] px-4 py-3 text-sm text-[oklch(0.4_0.18_25)]"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                    {message && (
                                        <motion.p
                                            role="status"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden rounded-[11px] border border-canopy-deep bg-[oklch(0.55_0.12_150/0.12)] px-4 py-3 text-sm text-[oklch(0.35_0.1_150)]"
                                        >
                                            {message}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-[11px] bg-canopy px-6 py-4 text-sm font-semibold text-white transition-colors duration-[180ms] hover:bg-canopy-hover disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? mode === "signIn"
                                            ? "Signing in..."
                                            : "Creating account..."
                                        : mode === "signIn"
                                            ? "Sign in"
                                            : "Create account"}
                                </motion.button>
                            </form>

                            <p className="mt-7 text-center text-sm text-ink-muted">
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
                                            className="font-semibold text-canopy hover:underline"
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
                                            className="font-semibold text-canopy hover:underline"
                                        >
                                            Sign in instead
                                        </button>
                                    </>
                                )}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <p className="mt-6 text-center text-xs text-ink-muted">
                    <Link href="/" className="transition-colors hover:text-ink-2">
                        &larr; Back to home
                    </Link>
                </p>
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
        <div className="flex items-center gap-3 rounded-[11px] border border-border bg-surface px-4 py-3.5 transition-colors duration-[180ms] focus-within:border-canopy">
            <span className="text-ink-muted">{icon}</span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-muted focus:outline-none"
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
