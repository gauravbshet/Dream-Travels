"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Search, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { useToast } from "./Toast";
import { AdminCard, AdminTableState } from "./ui";

type Customer = {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
    created_at: string | null;
};

type PackageDetail = {
    title: string;
    duration: string | null;
    price: number | null;
};

type Booking = {
    id: string;
    package_id: string;
    packages: PackageDetail[] | null;
};

export function CustomersManager() {
    const supabase = createBrowserSupabaseClient();
    const { showToast } = useToast();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [bookings, setBookings] = useState<Record<string, Booking[]>>({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);

    async function loadCustomers() {
        setLoading(true);
        const { data, error } = await supabase
            .from("profiles")
            .select("id,full_name,email,phone,created_at")
            .order("created_at", { ascending: false });

        if (error) {
            showToast(`Failed to load customers: ${error.message}`, "error");
        } else {
            setCustomers(data ?? []);
        }
        setLoading(false);
    }

    async function loadCustomerBookings(customerId: string) {
        setProfileLoading(true);
        const { data, error } = await supabase
            .from("wishlists")
            .select("id,package_id,packages(title,duration,price)")
            .eq("user_id", customerId);

        setProfileLoading(false);

        if (error) {
            showToast(`Failed to load booking history: ${error.message}`, "error");
            return;
        }

        setBookings((prev) => ({ ...prev, [customerId]: data ?? [] }));
    }

    useEffect(() => {
        loadCustomers();
    }, []);

    const filteredCustomers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return customers;
        return customers.filter((customer) => {
            return (
                customer.full_name?.toLowerCase().includes(query) ||
                customer.email.toLowerCase().includes(query)
            );
        });
    }, [customers, search]);

    const selectedCustomerBookings = selectedCustomer ? bookings[selectedCustomer.id] ?? [] : [];

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-admin-ink">Customers</h3>
                    <p className="mt-1 text-sm text-admin-ink-muted">
                        View customer profiles, contact details, and their package interests.
                    </p>
                </div>
                <label className="relative block w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-ink-muted" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email"
                        className="admin-input pl-11 pr-12"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-ink-muted hover:text-admin-ink"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </label>
            </div>

            <AdminCard className="mt-6 overflow-x-auto" padded={false}>
                <table className="w-full min-w-[min(100%,720px)] text-left text-sm">
                    <thead>
                        <tr className="border-b border-admin-border text-xs font-semibold uppercase tracking-wide text-admin-ink-muted">
                            <th className="px-5 py-4">Customer ID</th>
                            <th className="px-5 py-4">Full Name</th>
                            <th className="px-5 py-4">Email</th>
                            <th className="px-5 py-4">Phone</th>
                            <th className="px-5 py-4">Date Joined</th>
                            <th className="px-5 py-4">Total Bookings</th>
                            <th className="px-5 py-4 text-right">Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <AdminTableState colSpan={7}>Loading customers...</AdminTableState>
                        ) : filteredCustomers.length === 0 ? (
                            <AdminTableState colSpan={7}>No customers match your search.</AdminTableState>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="border-b border-admin-border last:border-0">
                                    <td className="px-5 py-4 text-admin-ink-2">{customer.id}</td>
                                    <td className="px-5 py-4 font-semibold text-admin-ink">{customer.full_name ?? "—"}</td>
                                    <td className="px-5 py-4 text-admin-ink-2">{customer.email}</td>
                                    <td className="px-5 py-4 text-admin-ink-2">{customer.phone ?? "—"}</td>
                                    <td className="px-5 py-4 text-admin-ink-2">
                                        {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-5 py-4 text-admin-ink-2">
                                        {bookings[customer.id]?.length ?? 0}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                setSelectedCustomer(customer);
                                                if (!bookings[customer.id]) {
                                                    await loadCustomerBookings(customer.id);
                                                }
                                            }}
                                            className="rounded-[10px] border border-admin-border bg-admin-primary-soft px-4 py-2 text-sm font-semibold text-admin-primary transition hover:bg-admin-primary-soft/70"
                                        >
                                            <Eye className="mr-2 inline h-4 w-4" /> Profile
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </AdminCard>

            {selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
                    <div className="w-full max-w-[min(100%,theme(width.3xl))] rounded-[24px] bg-admin-surface p-6 shadow-admin-pop">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h4 className="text-xl font-semibold text-admin-ink">Customer profile</h4>
                                <p className="mt-1 text-sm text-admin-ink-muted">
                                    Contact details and package activity for this profile.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedCustomer(null)}
                                className="text-admin-ink-muted hover:text-admin-ink"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            <div className="rounded-[18px] border border-admin-border bg-admin-surface-2 p-5">
                                <p className="text-sm uppercase tracking-wide text-admin-ink-muted">Name</p>
                                <p className="mt-2 text-lg font-semibold text-admin-ink">{selectedCustomer.full_name ?? "—"}</p>
                            </div>
                            <div className="rounded-[18px] border border-admin-border bg-admin-surface-2 p-5">
                                <p className="text-sm uppercase tracking-wide text-admin-ink-muted">Email</p>
                                <p className="mt-2 text-lg font-semibold text-admin-ink">{selectedCustomer.email}</p>
                            </div>
                            <div className="rounded-[18px] border border-admin-border bg-admin-surface-2 p-5">
                                <p className="text-sm uppercase tracking-wide text-admin-ink-muted">Phone</p>
                                <p className="mt-2 text-lg font-semibold text-admin-ink">{selectedCustomer.phone ?? "—"}</p>
                            </div>
                            <div className="rounded-[18px] border border-admin-border bg-admin-surface-2 p-5">
                                <p className="text-sm uppercase tracking-wide text-admin-ink-muted">Joined</p>
                                <p className="mt-2 text-lg font-semibold text-admin-ink">
                                    {selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString() : "—"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 rounded-[18px] border border-admin-border bg-admin-surface p-5">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h5 className="text-lg font-semibold text-admin-ink">Past package bookings</h5>
                                    <p className="mt-1 text-sm text-admin-ink-muted">
                                        Shows packages saved through wishlists as a lightweight booking history.
                                    </p>
                                </div>
                                {profileLoading && <span className="text-sm text-admin-ink-muted">Loading...</span>}
                            </div>

                            <div className="mt-4 space-y-3">
                                {selectedCustomerBookings.length === 0 ? (
                                    <p className="text-admin-ink-muted">No package history found for this customer.</p>
                                ) : (
                                    selectedCustomerBookings.map((booking) => (
                                        <div key={booking.id} className="rounded-[16px] border border-admin-border bg-admin-surface-2 p-4">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-admin-ink-muted">Package</p>
                                                    <p className="mt-1 font-semibold text-admin-ink">{booking.packages?.[0]?.title ?? "Unknown package"}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-admin-ink-muted">Duration</p>
                                                    <p className="mt-1 font-semibold text-admin-ink">{booking.packages?.[0]?.duration ?? "—"}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-admin-ink-muted">Price</p>
                                                    <p className="mt-1 font-semibold text-admin-ink">
                                                        {booking.packages?.[0]?.price != null ? `₹${booking.packages[0].price}` : "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
