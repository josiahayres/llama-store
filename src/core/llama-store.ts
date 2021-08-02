type LlamaStoreMeta = {
    /** Timestamp Date.now() of last time localStorage was created.  */
    createdAt: string;
    /** Timestamp Date.now() of last time localStorage was accessed.  */
    lastAccessed?: string;
    /** Timestamp Date.now() of last time localStorage was updated.  */
    lastUpdated?: string;
};

export type storeInitializeEvent<T> = (
    configuration: LlamaStoreConfig<T>
) => void;
export type storeResetEvent<T> = (configuration: LlamaStoreConfig<T>) => void;

export type LlamaStoreOptions<T> = {
    onStoreInitialize?: storeInitializeEvent<T>;
    onStoreRestore?: storeResetEvent<T>;
};

/**
 * LlamaStoreConfig is stored
 */
export type LlamaStoreConfig<T> = {
    storeName: string;
    keysAvailable: Set<keyof T>;
    meta: LlamaStoreMeta;
};

export class LlamaStore<T> {
    private onStoreInitialize?: storeInitializeEvent<T>;
    private llamaStoreConfig: LlamaStoreConfig<T> = {
        storeName: 'default_llama_store',
        keysAvailable: new Set([]),
        meta: { createdAt: '' },
    };
    get storeName() {
        return this.llamaStoreConfig.storeName;
    }

    constructor(storeName: string, options?: LlamaStoreOptions<T>) {
        this.onStoreInitialize = options?.onStoreInitialize?.bind(this);
        const name = storeName || 'default_llama_store';
        this.llamaStoreConfig.storeName = name;
        const existingStoreConfig = localStorage.getItem(
            this.getStoreConfigName()
        );
        if (typeof existingStoreConfig === 'string' && existingStoreConfig) {
            // Store already created
            const parsedConfig: LlamaStoreConfig<T> =
                JSON.parse(existingStoreConfig);
            const keysAsSet = new Set(parsedConfig.keysAvailable);

            this.llamaStoreConfig = {
                storeName: name,
                keysAvailable: keysAsSet,
                meta: parsedConfig.meta,
            };
        } else {
            // Must initialize the store

            const initialStore = {
                storeName,
                keysAvailable: new Set([]),
                meta: {
                    createdAt: Date.now().toString(),
                },
            };
            this.llamaStoreConfig = initialStore;
            this.saveCurrentConfig();
            this.onStoreInitialize && this.onStoreInitialize(initialStore);
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
        this.llamaStoreConfig.meta.lastUpdated = Date.now().toString();
    }

    /**
     * Updates storeConfig metadata
     */
    private storeAccessed() {
        this.llamaStoreConfig.meta.lastAccessed = Date.now().toString();
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
        function Set_toJSON(key: string, value: any) {
            if (typeof value === 'object' && value instanceof Set) {
                return Array.from(value);
            }
            return value;
        }
        const storeConfigName = this.getStoreConfigName();
        const llamaConfigStr = JSON.stringify(
            this.llamaStoreConfig,
            Set_toJSON
        );
        localStorage.setItem(storeConfigName, llamaConfigStr);
    }

    get knownKeys() {
        this.storeAccessed();
        this.saveCurrentConfig();
        return this.llamaStoreConfig.keysAvailable;
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
            this.llamaStoreConfig.keysAvailable.add(key);
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
        this.llamaStoreConfig.keysAvailable.delete(key);
        this.saveCurrentConfig();
    }
}
