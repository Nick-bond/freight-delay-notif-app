import axios from 'axios';
import { sendNotification } from '../activities';
import { Logger } from '../../logger';

jest.mock('axios');
jest.mock('../../logger');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedLogger = Logger as jest.Mocked<typeof Logger>;

describe('sendNotification', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        process.env.TWILIO_ACCOUNT_SID = 'AC_TEST';
        process.env.TWILIO_AUTH_TOKEN = 'AUTH_TEST';
        process.env.TWILIO_MESSAGING_SERVICE_SID = 'MG_TEST';
    });

    it('should send SMS using Twilio MessagingServiceSid and log the response', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { sid: 'SMXXXX', status: 'queued' } } as any);
        await sendNotification('+1234567890', 'Hello from Jest!');

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);

        const [[url, formData, config]] = mockedAxios.post.mock.calls;
        // Auth check
        expect(config?.auth).toEqual({
            username: 'AC_TEST',
            password: 'AUTH_TEST',
        });
        expect(config?.headers).toEqual({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        expect(mockedLogger.info).toHaveBeenCalledWith(
            'Twilio response: [object Object]' // Because response.data is an object
        );
    });

});