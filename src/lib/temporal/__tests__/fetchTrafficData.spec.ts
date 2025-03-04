import axios from 'axios';
import { fetchTrafficData } from '../activities';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchTrafficData', () => {
    const ORIGIN = '40.7128,-74.0060'; // NYC lat,lon
    const DESTINATION = '34.0522,-118.2437'; // LA lat,lon

    beforeEach(() => {
        jest.resetAllMocks();
        process.env.TRAFFIC_API_KEY = 'TEST_MAPBOX_KEY';
    });

    it('should return delay in minutes when Mapbox responds with valid data', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                routes: [
                    {
                        duration: 3600,
                    },
                ],
            },
        });

        const delayMinutes = await fetchTrafficData(ORIGIN, DESTINATION);

        expect(delayMinutes).toBe(60);
    });

    it('should throw if no routes are returned', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                routes: [],
            },
        });

        await expect(fetchTrafficData(ORIGIN, DESTINATION)).rejects.toThrow(
            'Mapbox directions response missing route duration'
        );
    });

    it('should throw if no data is returned', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: null,
        });

        await expect(fetchTrafficData(ORIGIN, DESTINATION)).rejects.toThrow(
            'No valid directions data returned from Mapbox'
        );
    });

    it('should throw if axios request fails', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

        await expect(fetchTrafficData(ORIGIN, DESTINATION)).rejects.toThrow(
            'Network Error'
        );
    });
});