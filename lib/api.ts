export const listingAPI = {
  // Create new listing
  async createListing(listingData: FormData) {
    const response = await fetch('/api/listings', {
      method: 'POST',
      body: listingData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  },

  // Get dealer's listings
  async getDealerListings(search?: string) {
    const url = search ? `/api/dealer/listings?search=${encodeURIComponent(search)}` : '/api/dealer/listings';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }

    return response.json();
  },

  // Update listing status
  async updateListingStatus(id: string, status: string) {
    const response = await fetch(`/api/listings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  },

  // Delete listing
  async deleteListing(id: string) {
    const response = await fetch(`/api/listings/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  },
};