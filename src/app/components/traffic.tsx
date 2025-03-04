'use client';

import React, { useState } from 'react';
import { Logger } from '@/lib/logger';

export default function TrafficPage() {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [contact, setContact] = useState('');
    const [status, setStatus] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('Submitting...');

        try {
            const res = await fetch('/api/freight-delay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ origin, destination, contact }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Request failed');
            }

            const data = await res.json();
            setStatus(`Workflow started. ID: ${data.workflowId}`);
        } catch (error: any) {
            Logger.error(error);
            setStatus(`Error: ${error.message}`);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Check Traffic & Notify
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Origin */}
                    <div>
                        <label
                            htmlFor="origin"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Origin
                        </label>
                        <input
                            id="origin"
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="e.g. 1600 Pennsylvania Ave, DC"
                            required
                            className="block w-full rounded-md border border-gray-300
                         px-3 py-2 text-gray-900 focus:outline-none
                         focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                    </div>

                    {/* Destination */}
                    <div>
                        <label
                            htmlFor="destination"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Destination
                        </label>
                        <input
                            id="destination"
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="e.g. One Apple Park Way, CA"
                            required
                            className="block w-full rounded-md border border-gray-300
                         px-3 py-2 text-gray-900 focus:outline-none
                         focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                    </div>

                    {/* Contact */}
                    <div>
                        <label
                            htmlFor="contact"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            Contact (Email or Phone)
                        </label>
                        <input
                            id="contact"
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="e.g. you@example.com or +123456789"
                            required
                            className="block w-full rounded-md border border-gray-300
                         px-3 py-2 text-gray-900 focus:outline-none
                         focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 text-white
                       font-semibold py-2 hover:bg-blue-700
                       focus:outline-none focus:ring-2
                       focus:ring-blue-600 focus:ring-offset-2
                       transition-colors"
                    >
                        Check & Notify
                    </button>
                </form>

                {/* Status Message */}
                {status && (
                    <p className="mt-4 text-center text-sm text-gray-700">
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
}