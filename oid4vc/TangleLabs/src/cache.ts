import pkg from 'memory-cache-node';
const { MemoryCache } = pkg;
import type { MemoryCache as IMemoryCache } from 'memory-cache-node';

const itemsExpirationCheckIntervalInSecs = 5 * 60; // 5 Minutes
const defaultTimeToLiveInSecs = 10 * 60; // 10 Minutes
const maxItemCount = 1000000;

export class Cache<K,V> {
    
    memoryCache: IMemoryCache<K,V>;

    private constructor(memoryCache) {
        this.memoryCache = memoryCache; 
    }

    static async init<K,V>() {
        return new Cache<K,V>(new MemoryCache<K,V>(itemsExpirationCheckIntervalInSecs, maxItemCount));
    }

    async storeItem(key: K, item: V, TTL: number = defaultTimeToLiveInSecs) {
        console.debug(`storing key=${key}, TTL=${TTL} with value=`, item);
        return this.memoryCache.storeExpiringItem(key, item, TTL);
    }

    async hasItem(key: K) {
        return this.memoryCache.hasItem(key);
    }

    async retrieveItem(key: K) {
        const item = this.memoryCache.retrieveItemValue(key);
        console.debug(`retrieving key=${key} with value=`, item);
        return item;
    }

}