import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';
import dotenv from 'dotenv';
import { Logger } from '@/lib/logger';

dotenv.config();

async function runWorker() {
    const connection = await NativeConnection.connect({
        address: 'localhost:7233',
    });
    try {
        const worker = await Worker.create({
            connection,
            workflowsPath: require.resolve('./workflows'),
            activities,
            taskQueue: 'DELIVERY_DELAYS_QUEUE',
            namespace: 'default',
        });
        Logger.info('Temporal Worker started. Listening for tasks...');
        await worker.run();
    } finally {
        // Close the connection once the worker has stopped
        await connection.close();
    }
}

runWorker().catch((err) => {
    Logger.error(err);
    process.exit(1);
});