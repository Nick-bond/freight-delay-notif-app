import { Connection, WorkflowClient } from '@temporalio/client';
import { FreightDeliveryDelayWorkflow } from '../../lib/temporal/workflows';
import { Logger } from '@/lib/logger';
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
    message?: string,
    error?: string,
    workflowId?: string,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method === 'POST') {
        try {
            const { origin, destination, contact } = req.body

            if (!origin || !destination || !contact) {
                return res.status(400).json(
                    { 'error': 'origin, destination, and contact are required fields' },
                );
            }

            const connection = await Connection.connect();
            const client = new WorkflowClient({
                connection,
            });
            // Start the workflow
            const handle = await client.start(FreightDeliveryDelayWorkflow, {
                args: [origin, destination, contact],
                taskQueue: 'DELIVERY_DELAYS_QUEUE',
                workflowId: `freight-delay-${Date.now()}`,
            });

            return res.status(200).json({
                message: 'Freight Delivery Delay Workflow started',
                workflowId: handle.workflowId,
            });
        } catch (error: any) {
            Logger.error(error);
            return res.status(500).json(
                { error: error.message || 'Unknown error occurred' },
            );
        }
    } else {
        // TODO in case we will need something
        res.status(200).json({ message: 'Hello from freight delay app!' })
    }
}