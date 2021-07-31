type StoreHistory = {
    /** Timestamp Date.now() of last time localStorage was created.  */
    createdAt: string;
    /** Timestamp Date.now() of last time localStorage was accessed.  */
    lastAccessed?: string;
    /** Timestamp Date.now() of last time localStorage was updated.  */
    lastUpdated?: string;
};

/**
 * LlamaStoreConfig is stored
 */
export type LlamaStoreConfig<T> = {
    storeName: string;
    keysAvailable: Array<keyof T>;
    storeConfig: StoreHistory;
};

export class LlamaStore<T> {
    private storeName: string;
    private keysAvailable: Set<keyof T>;
    storeConfig: StoreHistory;

    constructor(storeName: string = 'default_llama_store') {
        this.storeName = storeName;
        this.keysAvailable = new Set();
        this.storeConfig = {
            createdAt: Date.now().toString(),
        };

        const existingStoreConfig = localStorage.getItem(
            this.getStoreConfigName()
        );
        if (typeof existingStoreConfig === 'string' && existingStoreConfig) {
            // Store already created
            const parsedConfig: LlamaStoreConfig<T> =
                JSON.parse(existingStoreConfig);
            const keysAsSet = new Set(parsedConfig.keysAvailable);
            this.keysAvailable = keysAsSet;
        } else {
            // Must initialize the store
            this.saveCurrentConfig();
        }
    }

    /**
     *
     * @returns key where store config is stored to in localStorage
     */
    private getStoreConfigName() {
        return `${this.storeName}_config`;
    }

    /**
     * Updates storeConfig metadata
     */
    private storeUpdated() {
        this.storeConfig.lastUpdated = Date.now().toString();
    }

    /**
     * Updates storeConfig metadata
     */
    private storeAccessed() {
        this.storeConfig.lastAccessed = Date.now().toString();
    }

    /**
     *
     * @param forKey
     * @returns string of key used to write to localStorage.
     */
    private localStorageKeyFor(forKey: string | number | symbol): string {
        return `${this.storeName}__${String(forKey)}`;
    }

    private saveCurrentConfig() {
        const llamaConfig: LlamaStoreConfig<T> = {
            storeName: this.storeName,
            keysAvailable: Array.from(this.keysAvailable),
            storeConfig: this.storeConfig,
        };
        const storeConfigName = this.getStoreConfigName();
        const llamaConfigStr = JSON.stringify(llamaConfig);
        localStorage.setItem(storeConfigName, llamaConfigStr);
    }

    get knownKeys() {
        this.storeAccessed();
        this.saveCurrentConfig();
        return this.keysAvailable;
    }

    get<K extends keyof T>(key: K): T[K] | null {
        this.storeAccessed();
        this.saveCurrentConfig();
        const val = localStorage.getItem(this.localStorageKeyFor(key));
        if (!val) return null;
        try {
            return JSON.parse(val);
        } catch (error) {
            throw Error('Unable to parse stored value for key');
        }
    }

    /**
     *
     * Stringify value and save to localstorage.
     * @param key
     * @param value
     */
    set<K extends keyof T>(key: K, value: T[K]) {
        this.storeUpdated();
        if (!key) throw Error('Invalid key provided');
        try {
            // Try to JSON.stringify when value not string
            let valueAsString = JSON.stringify(value);
            localStorage.setItem(this.localStorageKeyFor(key), valueAsString);
            this.keysAvailable.add(key);
        } catch (error) {
            throw Error(error);
        }
        this.saveCurrentConfig();
    }

    /**
     * Attempts to delete the key,val from localStorage.
     * Removes key from keysAvailable
     */
    delete<K extends keyof T>(key: K) {
        this.storeUpdated();
        localStorage.removeItem(this.localStorageKeyFor(key));
        this.keysAvailable.delete(key);
        this.saveCurrentConfig();
    }
}
