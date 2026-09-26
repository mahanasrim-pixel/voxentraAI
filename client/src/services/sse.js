/**
 * VOXENTRA Real-Time SSE Listener
 */

class SSEClient {
  constructor() {
    this.source = null;
    this.listeners = new Map();
    this.connected = false;
  }

  connect() {
    if (this.source) return;

    this.source = new EventSource('/api/stream/pulse');

    this.source.onopen = () => {
      this.connected = true;
      this.emit('connection_change', { status: 'connected' });
    };

    this.source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        this.emit(payload.type, payload.data);
        this.emit('*', payload);
      } catch (err) {
        console.warn('Error parsing SSE event:', err);
      }
    };

    this.source.onerror = () => {
      this.connected = false;
      this.emit('connection_change', { status: 'disconnected' });
    };
  }

  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);

    // Auto connect on first subscription
    if (!this.source) {
      this.connect();
    }

    return () => {
      const set = this.listeners.get(eventType);
      if (set) {
        set.delete(callback);
      }
    };
  }

  emit(eventType, data) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(cb => {
        try { cb(data); } catch (e) { console.error('SSE subscriber error:', e); }
      });
    }
  }

  disconnect() {
    if (this.source) {
      this.source.close();
      this.source = null;
      this.connected = false;
    }
  }
}

export const sseClient = new SSEClient();
