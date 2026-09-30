// IndexedDB Media & Portfolio Storage
// Eliminates localStorage 5MB quota limits and guarantees thumbnails, still-cuts, and videos are permanently persisted

const DB_NAME = 'gfl_media_db_v2';
const DB_VERSION = 2;
const VIDEO_STORE = 'videos';
const PORTFOLIO_STORE = 'portfolio_data';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(VIDEO_STORE)) {
        db.createObjectStore(VIDEO_STORE);
      }
      if (!db.objectStoreNames.contains(PORTFOLIO_STORE)) {
        db.createObjectStore(PORTFOLIO_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

/**
 * Save all portfolio items (including thumbnails, still-cuts, and metadata) in IndexedDB
 */
export async function savePortfolioItemsToDb(items: any[]): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PORTFOLIO_STORE, 'readwrite');
      const store = tx.objectStore(PORTFOLIO_STORE);
      const req = store.put(items, 'active_items');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error || new Error('Failed to save portfolio items to IndexedDB'));
    });
  } catch (err) {
    console.warn('[IndexedDB] Error saving portfolio items:', err);
  }
}

/**
 * Retrieve all portfolio items from IndexedDB
 */
export async function getPortfolioItemsFromDb(): Promise<any[] | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(PORTFOLIO_STORE, 'readonly');
      const store = tx.objectStore(PORTFOLIO_STORE);
      const req = store.get('active_items');
      req.onsuccess = () => {
        if (Array.isArray(req.result) && req.result.length > 0) {
          resolve(req.result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Save a video Blob/File in IndexedDB keyed by portfolio item ID
 */
export async function saveVideoBlob(id: string, blob: Blob): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(VIDEO_STORE, 'readwrite');
      const store = tx.objectStore(VIDEO_STORE);
      const req = store.put(blob, id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error || new Error('Failed to put blob'));
    });
  } catch (err) {
    console.error(`[IndexedDB] Error saving video for item ${id}:`, err);
    throw err;
  }
}

/**
 * Retrieve a video Blob from IndexedDB by portfolio item ID
 */
export async function getVideoBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(VIDEO_STORE, 'readonly');
      const store = tx.objectStore(VIDEO_STORE);
      const req = store.get(id);
      req.onsuccess = () => {
        resolve(req.result instanceof Blob ? req.result : null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Retrieve all stored video blobs mapped by item ID
 */
export async function getAllVideoBlobs(): Promise<Map<string, Blob>> {
  const map = new Map<string, Blob>();
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(VIDEO_STORE, 'readonly');
      const store = tx.objectStore(VIDEO_STORE);
      
      const req = store.openCursor();
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>).result;
        if (cursor) {
          if (typeof cursor.key === 'string' && cursor.value instanceof Blob) {
            map.set(cursor.key, cursor.value);
          }
          cursor.continue();
        } else {
          resolve(map);
        }
      };
      req.onerror = () => resolve(map);
    });
  } catch {
    return map;
  }
}

/**
 * Delete a video Blob from IndexedDB by portfolio item ID
 */
export async function deleteVideoBlob(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(VIDEO_STORE, 'readwrite');
      const store = tx.objectStore(VIDEO_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {
    // Ignore error on deletion
  }
}
