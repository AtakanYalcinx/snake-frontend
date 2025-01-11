import gameModeService from '../gameModeService';

global.fetch = jest.fn();

describe('GameModeService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetchGameModes calls fetch and returns data', async () => {
    const mockData = [{ id: 1, name: 'Classic Mode' }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await gameModeService.fetchGameModes();
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/gamemodes');
    expect(data).toEqual(mockData);
  });

  test('createGameMode sends POST request with correct data', async () => {
    const newMode = { name: 'New Mode', speed: 3 };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 2, ...newMode }),
    });

    const response = await gameModeService.createGameMode(newMode);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/gamemodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMode),
    });
    expect(response).toEqual({ id: 2, ...newMode });
  });

  test('handles errors correctly', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    await expect(gameModeService.fetchGameModes()).rejects.toThrow(
      'Fetch error: 500'
    );
  });
});
