import apiClient from "./apiClient";

/**
 * tableService: Handles all table-related API calls for the Waiter App.
 */
export const tableService = {
  /**
   * Fetch the current status of all dining tables.
   */
  getTables: async () => {
    const response = await apiClient.get("/tables");
    return response.data;
  },
};
