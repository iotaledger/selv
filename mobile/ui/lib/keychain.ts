import 'capacitor-secure-storage-plugin';
import { Plugins } from '@capacitor/core';

const { SecureStoragePlugin } = Plugins;

export default {
    get(key: string): Promise<{ value: string }> {
        return SecureStoragePlugin.get({ key });
    },
    set(key: string, value: string): Promise<{ value: boolean }> {
        return SecureStoragePlugin.set({ key, value });
    }
}
