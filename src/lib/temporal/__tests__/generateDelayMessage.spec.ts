import axios from 'axios';
import { generateDelayMessage } from '../activities';
import { Logger } from '../../logger';

jest.mock('axios');
jest.mock('../../logger');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedLogger = Logger as jest.Mocked<typeof Logger>;

describe('generateDelayMessage', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        process.env.OPENAI_API_KEY = 'TEST_OPENAI_KEY';
    });

    it('should return the AI-generated message when API call succeeds', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                choices: [
                    {
                        message: {
                            content: 'Hello, this is a test message.',
                        },
                    },
                ],
            },
        });
        const result = await generateDelayMessage(45);

        expect(result).toBe('Hello, this is a test message.');
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        expect(mockedLogger.info).toHaveBeenCalledWith(
            'Generating message for delay of 45 minutes.'
        );
        expect(mockedLogger.info).toHaveBeenCalledWith(
            'Generated message: Hello, this is a test message.'
        );
    });

    it('should throw fallback message if no valid message is found in response', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                choices: [
                    {
                        message: {
                            content: '', // or undefined
                        },
                    },
                ],
            },
        });

        const result = await generateDelayMessage(60);
        expect(result).toBe('We are experiencing an unexpected delay. Thank you for your patience.');
        expect(mockedLogger.error).toHaveBeenCalledWith(
            'Error generating message: No valid message found in response'
        );
    });

    it('should return fallback message if the API call fails (network error)', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'));

        const result = await generateDelayMessage(15);

        expect(result).toBe('We are experiencing an unexpected delay. Thank you for your patience.');
        expect(mockedLogger.error).toHaveBeenCalledWith(
            'Error generating message: Network Error'
        );
    });

    it('should return fallback if OPENAI_API_KEY is missing', async () => {
        process.env.OPENAI_API_KEY = '';
        const result = await generateDelayMessage(30);
        expect(result).toBe('We are experiencing an unexpected delay. Thank you for your patience.');
        expect(mockedLogger.error).toHaveBeenCalled();
    });
});