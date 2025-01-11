import gameModeService from '../../src/component/gamemode/gameModeService';

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

  test('should handle error during createGameMode', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(gameModeService.createGameMode({ name: 'Classic' })).rejects.toThrow(
      'Fetch error: 500'
    );
  });

  test('should successfully update a game mode', async () => {
    const mockResponse = { id: 1, name: 'Updated Mode' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    const result = await gameModeService.updateGameMode(1, { name: 'Updated Mode' });
    expect(result).toEqual(mockResponse);
  });

  test('should delete a game mode successfully', async () => {
    fetch.mockResolvedValueOnce({ status: 204 });
    const result = await gameModeService.deleteGameMode(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/gamemodes/1', { method: 'DELETE' });
    expect(result).toBeNull();
  });

  test('should throw an error when deleteGameMode fails', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(gameModeService.deleteGameMode(1)).rejects.toThrow('Fetch error: 404');
  });


  test('should handle 204 No Content response when deleting a game mode', async () => {
    fetch.mockResolvedValueOnce({ status: 204 });
    const result = await gameModeService.deleteGameMode(1);
    expect(result).toBeNull();
  });

  test('should throw an error for unexpected HTTP status codes', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 418 }); // "I'm a teapot" (Beispiel für unerwarteten Status)
    await expect(gameModeService.fetchGameModes()).rejects.toThrow('Fetch error: 418');
  });

});
