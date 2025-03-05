import axios from 'axios';
import { Logger } from '@/lib/logger';
import dotenv from "dotenv";
dotenv.config();
const {
    TRAFFIC_API_KEY,
    OPENAI_API_KEY,
} = process.env;

/**
 * Parses a coordinate string in the format "LAT,LON"
 * and returns an array [lon, lat] for Mapbox.
 */
function parseLatLon(coordStr: string): [number, number] {
    const [latStr, lonStr] = coordStr.split(',').map((x) => x.trim());
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (isNaN(lat) || isNaN(lon)) {
        throw new Error(`Invalid coordinate string: "${coordStr}". Expected "LAT,LON"`);
    }
    return [lon, lat];
}

/**
 * Fetches an approximate travel time from the Mapbox Directions API
 * using the `driving-traffic` profile, and returns it in minutes.
 *
 * @param origin      String in the format "LAT,LON"
 * @param destination String in the format "LAT,LON"
 * @returns           Estimated travel time (minutes) from Mapbox
 */

export async function fetchTrafficData(
    origin: string,
    destination: string
): Promise<number> {
    try {
        Logger.info(`Fetching traffic data for origin=${origin}, destination=${destination}`);

        if (!TRAFFIC_API_KEY) {
            throw new Error('Missing TRAFFIC_API_KEY env variable.');
        }

        const [originLon, originLat] = parseLatLon(origin);
        const [destLon, destLat] = parseLatLon(destination);

        // Build the Directions API URL
        const coords = `${originLon},${originLat};${destLon},${destLat}`;
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coords}`;

        const response = await axios.get(url, {
            params: {
                access_token: TRAFFIC_API_KEY,
                overview: 'simplified',
                steps: false,
            },
        });

        if (!response.data || !response.data.routes || !Array.isArray(response.data.routes)) {
            throw new Error('No valid directions data returned from Mapbox');
        }

        const route = response.data.routes[0];
        if (!route || typeof route.duration !== 'number') {
            throw new Error('Mapbox directions response missing route duration');
        }

        // duration is in seconds; convert to integer minutes
        const durationSec = route.duration;
        const delayMinutes = Math.round(durationSec / 60);

        Logger.info(`Traffic data fetched. Estimated Delay: ${delayMinutes} minutes`);
        return delayMinutes;
    } catch (error: any) {
        Logger.error(`Error fetching traffic data: ${error.message}`);
        throw error;
    }
}

/**
 * Generate a message via OpenAI
 * @param delayMinutes number
 * @returns Promise<string> - AI message or fallback on error
 */
export async function generateDelayMessage(delayMinutes: number): Promise<string> {
    try {
        Logger.info(`Generating message for delay of ${delayMinutes} minutes.`);

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a friendly, helpful assistant generating delay notifications.'
                    },
                    {
                        role: 'user',
                        content: `We have a delay of ${delayMinutes} minutes. Please generate a short, empathetic message.`
                    }
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                }
            }
        );

        const responseMsg = response?.data?.choices?.[0]?.message?.content?.trim();
        if (!responseMsg) {
            throw new Error('No valid message found in response');
        }

        Logger.info(`Generated message: ${responseMsg}`);
        return responseMsg;
    } catch (error: any) {
        Logger.error(`Error generating message: ${error.message}`);
        return 'We are experiencing an unexpected delay. Thank you for your patience.';
    }
}

/**
 * Send an SMS via Twilio.
 *
 * @param recipient The "to" phone number (E.164 format, e.g. "+1234567890")
 * @param message   The message text
 * @returns         Promise<boolean> (true if success, false otherwise)
 */

export async function sendNotification(recipient: string, message: string): Promise<void> {
    try {
        const res = await fetch('http://localhost:3000/api/send-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient, message }),
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Request failed');
        }

        Logger.info('Notification sent successfully.');
    } catch (error: any) {
        Logger.error(error);
        throw new Error(error || 'Unknown error sending notification');
    }
}