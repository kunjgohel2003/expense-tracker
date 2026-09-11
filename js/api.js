/**
 * RESTful JSON API Client
 * Connects directly to the JSON API endpoint via HTTP fetch (GET, POST, PUT, DELETE).
 * No localStorage is used.
 * json-server : npx json-server --watch db.json --port 3001
 */
const ExpenseAPI = (() => {
  // Base URL for the JSON REST API (Update if using MockAPI or a remote URL)
  const API_BASE_URL = 'http://localhost:3060/expenses';

  return {
    /**
     * GET: Fetch all expenses from the JSON server
     */
    async getAll() {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch expenses: ${response.statusText}`);
        }
        const data = await response.json();
        return { status: response.status, data };
      } catch (error) {
        console.error('API GET Error:', error);
        throw error;
      }
    },

    /**
     * POST: Send new expense JSON to the API
     */
    async create(expensePayload) {
      try {
        const recordWithTimestamp = {
          ...expensePayload,
          createdAt: Date.now()
        };

        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(recordWithTimestamp)
        });

        if (!response.ok) {
          throw new Error(`Failed to create expense: ${response.statusText}`);
        }
        const data = await response.json();
        return { status: response.status, data };
      } catch (error) {
        console.error('API POST Error:', error);
        throw error;
      }
    },

    /**
     * PUT: Update existing expense by ID on the JSON server
     */
    async update(id, updatedFields) {
      try {
        // Fetch current record first to preserve createdAt timestamp
        const getRes = await fetch(`${API_BASE_URL}/${id}`);
        const currentRecord = await getRes.json();

        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...currentRecord,
            ...updatedFields
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to update expense: ${response.statusText}`);
        }
        const data = await response.json();
        return { status: response.status, data };
      } catch (error) {
        console.error('API PUT Error:', error);
        throw error;
      }
    },

    /**
     * DELETE: Remove an expense by ID from the JSON server
     */
    async delete(id) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`Failed to delete expense: ${response.statusText}`);
        }
        return { status: response.status };
      } catch (error) {
        console.error('API DELETE Error:', error);
        throw error;
      }
    }
  };
})();