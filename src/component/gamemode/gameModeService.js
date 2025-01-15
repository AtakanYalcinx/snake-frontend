const baseURL = 'https://snake-backend-1jpo.onrender.com';

export default {
  async fetchGameModes() {
    try {
      const response = await fetch(`${baseURL}`);
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching game modes:', error);
      throw error;
    }
  },
  async createGameMode(gameMode) {
    try {
      const response = await fetch(`${baseURL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameMode),
      });
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating game mode:', error);
      throw error;
    }
  },
  async updateGameMode(id, gameMode) {
    try {
      const response = await fetch(`${baseURL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameMode),
      });
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating game mode:', error);
      throw error;
    }
  },
  async deleteGameMode(id) {
    try {
      const response = await fetch(`${baseURL}/${id}`, {
        method: 'DELETE',
      });

      // Wenn der Server 204 (No Content) liefert, gibt es keinen Body
      if (response.status === 204) {
        // alles okay, kein JSON-Body vorhanden
        return null;
      }

      // Prüfen, ob alles okay
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status}`);
      }

      // Wenn der Server bei Erfolg (z.B. 200) JSON zurückgibt:
      return await response.json();
    } catch (error) {
      console.error('Error deleting game mode:', error);
      throw error;
    }
  },
};
