import { proxyActivities } from '@temporalio/workflow';
import type * as Activities from './activities';
import { Logger } from '../logger';

const {
    fetchTrafficData,
    generateDelayMessage,
    sendNotification
} = proxyActivities<typeof Activities>({
    startToCloseTimeout: '1 minute',
    retry: {
        maximumAttempts: 3,
    },
});

// Threshold (in minutes) above which we notify the customer
const DELAY_THRESHOLD = 30;

export async function FreightDeliveryDelayWorkflow(
    origin: string,
    destination: string,
    contact: string
): Promise<void> {
    const delayMinutes = await fetchTrafficData(origin, destination);

    if (delayMinutes > DELAY_THRESHOLD) {
        const message = await generateDelayMessage(delayMinutes);
        await sendNotification(contact, message);
    } else {
        Logger.info(`Delay is under threshold: ${delayMinutes} min. No notification sent.`);
    }
}