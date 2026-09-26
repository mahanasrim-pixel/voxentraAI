/**
 * VOXENTRA Client API Client
 */

const API_BASE = '/api';
const DIRECT_BACKEND = 'http://localhost:5000/api';

function getAuthHeader() {
  const token = localStorage.getItem('voxentra_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  let url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    // If relative request fails (e.g. proxy unavailable or different host), retry with direct backend
    console.warn(`Initial fetch to ${url} failed. Retrying with direct backend URL: ${DIRECT_BACKEND}${endpoint}`);
    try {
      url = `${DIRECT_BACKEND}${endpoint}`;
      response = await fetch(url, { ...options, headers });
    } catch (fallbackErr) {
      throw new Error(`Cannot connect to VOXENTRA backend at http://localhost:5000: ${fallbackErr.message}`);
    }
  }

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const data = await response.json();
      errorMsg = data.error || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  async login(username, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.token) {
      localStorage.setItem('voxentra_token', data.token);
      localStorage.setItem('voxentra_admin', JSON.stringify(data.admin));
    }
    return data;
  },

  logout() {
    localStorage.removeItem('voxentra_token');
    localStorage.removeItem('voxentra_admin');
  },

  getCurrentAdmin() {
    try {
      return JSON.parse(localStorage.getItem('voxentra_admin'));
    } catch {
      return null;
    }
  },

  // Voice Interaction
  async voiceInteract(utterance, sessionId, phone = '+91 98421 55678', citizenName = 'Citizen') {
    return request('/voice/interact', {
      method: 'POST',
      body: JSON.stringify({ utterance, sessionId, phone, citizenName })
    });
  },

  async resetVoiceSession(sessionId) {
    return request('/voice/reset', {
      method: 'POST',
      body: JSON.stringify({ sessionId })
    });
  },

  // Complaints
  async getComplaints(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.append(k, v);
      }
    });
    return request(`/complaints?${query.toString()}`);
  },

  async getComplaintById(id) {
    return request(`/complaints/${id}`);
  },

  async createComplaint(payload) {
    return request('/complaints', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async updateComplaint(id, updates) {
    return request(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  async getDuplicates(id) {
    return request(`/complaints/${id}/duplicates`);
  },

  // Hotspots
  async getHotspots(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.append(k, v);
      }
    });
    return request(`/hotspots?${query.toString()}`);
  },

  // Analytics
  async getAnalyticsSummary() {
    return request('/analytics/summary');
  },

  // Departments
  async getDepartments() {
    return request('/departments');
  },

  // Staff
  async getStaff(departmentId) {
    const query = departmentId && departmentId !== 'all' ? `?departmentId=${departmentId}` : '';
    return request(`/staff${query}`);
  },

  async addStaff(data) {
    return request('/staff', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Notifications
  async getNotifications(limit = 50) {
    return request(`/notifications?limit=${limit}`);
  },

  // Coimbatore Locations Intelligence
  async getLocations() {
    return request('/locations');
  },

  async getTaluks() {
    return request('/locations/taluks');
  },

  async getLocationHierarchy() {
    return request('/locations/hierarchy');
  }
};
