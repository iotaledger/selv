import pkg from 'memory-cache-node';
const { MemoryCache } = pkg;
import type { MemoryCache as IMemoryCache } from 'memory-cache-node';

const itemsExpirationCheckIntervalInSecs = 10 * 60;
const maxItemCount = 1000000;

export class Cache<K,V> {
    
    memoryCache: IMemoryCache<K,V>;

    private constructor(memoryCache) {
        this.memoryCache = memoryCache; 
    }

    static async init<K,V>() {
        return new Cache<K,V>(new MemoryCache<K,V>(itemsExpirationCheckIntervalInSecs, maxItemCount));
    }

    async storeItem(key: K, item: V) {
        return this.memoryCache.storePermanentItem(key, item);
    }

    async hasItem(key: K) {
        return this.memoryCache.hasItem(key);
    }

    async consumeItem(key: K) {
        const item = this.memoryCache.retrieveItemValue(key);
        this.memoryCache.removeItem(key);
        return item;
    }

    private generate
}