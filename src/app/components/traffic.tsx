'use client';

import React, { useState } from 'react';
import { Logger } from '@/lib/logger';

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button
} from '@mui/material';

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
        <Box
            // Full viewport height, centered content
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: 'grey.100', // light background color
                p: 2
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 400,
                    width: '100%',
                    p: 4,
                    borderRadius: 2
                }}
            >
                <Typography variant="h5" component="h1" align="center" gutterBottom>
                    Check Traffic & Notify
                </Typography>

                {/* The form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <TextField
                        required
                        id="origin"
                        label="Origin"
                        variant="outlined"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                    />

                    <TextField
                        required
                        id="destination"
                        label="Destination"
                        variant="outlined"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />

                    <TextField
                        required
                        id="contact"
                        label="Contact (Phone number)"
                        variant="outlined"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />

                    <Button variant="contained" type="submit">
                        Check & Notify
                    </Button>
                </Box>

                {/* Status Message */}
                {status && (
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        {status}
                    </Typography>
                )}
            </Paper>
        </Box>
    );
}