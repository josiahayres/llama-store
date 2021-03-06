import { LlamaStore } from './llama-store';
import type { LlamaStoreOptions } from './llama-store';
interface MyStore extends Record<string, any> {
    name: string;
    age: number;
}

describe('LlamaStore', () => {
    const defaultStoreName = 'test_store';
    let store: LlamaStore<MyStore>;

    beforeEach(() => {
        // Arrange
        localStorage.clear();
        jest.clearAllMocks();
        store = new LlamaStore<MyStore>(defaultStoreName);
    });

    it('Init empty store', () => {
        expect(store).toBeInstanceOf(LlamaStore);
        expect(store.knownKeys.size).toBe(0);
    });

    it('setting a single value updates the config', () => {
        store.set('age', 22);
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(store.knownKeys.size).toBe(1);
        expect(store.knownKeys.has('age')).toBeTruthy();

        expect(localStorage.__STORE__['test_store_config']).toContain(
            '{"storeName":"test_store","keysAvailable":["age"],"meta":{"createdAt":"'
        );

        const age = store.get('age');
        expect(localStorage.getItem).toHaveBeenCalledWith('test_store__age');

        expect(age).toBe(22);
    });

    it('Creating a second store instance with same store returns same store config', () => {
        store.set('age', 22);
        expect(localStorage.setItem).toHaveBeenCalled();
        expect(store.knownKeys.size).toBe(1);
        expect(store.knownKeys.has('age')).toBeTruthy();

        const age = store.get('age');
        expect(localStorage.getItem).toHaveBeenCalledWith('test_store__age');

        expect(age).toBe(22);

        const store2 = new LlamaStore<MyStore>('test_store');

        expect(store2.knownKeys.size).toBe(1);
        expect(store2.knownKeys.has('age')).toBeTruthy();

        const age2 = store2.get('age');
        expect(localStorage.getItem).toHaveBeenCalledWith('test_store__age');

        expect(age2).toBe(22);
    });
    it('Can delete a key from a store', () => {
        store.set('age', 22);
        expect(store.get('age')).toBe(22);

        store.set('name', 'Tom');
        expect(store.get('name')).toBe('Tom');

        store.delete('name');
        expect(store.get('name')).toBe(null);
        expect(store.get('age')).toBe(22);

        store.delete('age');
        expect(store.get('age')).toBe(null);
    });
    describe('Edge cases', () => {
        it('get() is unable to parse stored value should throw', () => {
            // Manually set localstorage value
            localStorage.setItem(
                `${defaultStoreName}__happy`,
                JSON.stringify('OK')
            );
            expect(store.get('happy')).toBe('OK');

            // Invalid json has trailing comma
            const invalidJson = '{number:2,}';
            localStorage.setItem(`${defaultStoreName}__broken`, invalidJson);
            expect(() => store.get('broken')).toThrowError();

            const validJson = { number: 2 };
            localStorage.setItem(
                `${defaultStoreName}__valid`,
                JSON.stringify(validJson)
            );
            expect(() => store.get('valid')).not.toThrowError();
            expect(store.get('valid')).toHaveProperty('number');
        });

        it('set() given invalid key should throw', () => {
            expect(() => store.set(0, undefined)).toThrowError();
        });

        it('set() given invalid data should throw', () => {
            // This is the main case where set would throw error
            const obj = { prop: {} };
            // Cyclical object that references itself
            obj.prop = obj;

            expect(() => store.set('fail', obj)).toThrowError();
            expect(store.get('fail')).toBe(null);
            expect(store.knownKeys).not.toContain('fail');
        });
    });
});

describe('Default store name when empty name provided', () => {
    beforeAll(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });
    it('Store can still setup without provided name', () => {
        expect(localStorage.getItem).not.toHaveBeenCalled();
        expect(localStorage.setItem).not.toHaveBeenCalled();
        const defaultStore = new LlamaStore<MyStore>('');
        expect(localStorage.getItem).toHaveBeenCalledWith(
            'default_llama_store_config'
        );
        expect(localStorage.setItem).toHaveBeenCalled();
    });
});

describe('LlamaStore options', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });
    it('onStoreInitialize is called ', () => {
        const options: LlamaStoreOptions<MyStore> = {
            onStoreInitialize: () => {},
        };
        const spy_onStoreInitialize = jest.spyOn(options, 'onStoreInitialize');
        const defaultStore = new LlamaStore<MyStore>('store', options);
        expect(spy_onStoreInitialize).toHaveBeenCalled();
        expect(spy_onStoreInitialize).toHaveBeenCalledWith(
            expect.objectContaining({
                storeName: 'store',
                keysAvailable: new Set([]),
            })
        );
    });

    it('onStoreRestore is called', () => {
        const options: LlamaStoreOptions<MyStore> = {
            onStoreRestore: () => {},
        };
        const spy = jest.spyOn(options, 'onStoreRestore');
        const defaultStore = new LlamaStore<MyStore>('store', options);
        expect(spy).not.toHaveBeenCalled();
        defaultStore.set('name', 'spy');
        const storeTwo = new LlamaStore<MyStore>('store', options);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(
            expect.objectContaining({
                storeName: 'store',
                keysAvailable: new Set(),
            })
        );
        expect(storeTwo.knownKeys.has('name')).toBeTruthy();
        expect(storeTwo.knownKeys.has('age')).toBeFalsy();
    });
    it('onStoreSet is called', () => {
        const options: LlamaStoreOptions<MyStore> = {
            onStoreSet: () => {},
        };
        const spy_onStoreSet = jest.spyOn(options, 'onStoreSet');
        const store = new LlamaStore<MyStore>('store', options);

        expect(spy_onStoreSet).not.toHaveBeenCalled();

        store.set('name', 'llama');

        expect(spy_onStoreSet).toHaveBeenCalled();
        expect(spy_onStoreSet).toHaveBeenCalledWith('name', 'llama');
    });

    it('onStoreGet is called', () => {
        const options: LlamaStoreOptions<MyStore> = {
            onStoreGet: () => {},
        };
        const spy = jest.spyOn(options, 'onStoreGet');
        const store = new LlamaStore<MyStore>('store', options);

        expect(spy).not.toHaveBeenCalled();

        store.get('name');

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith('name');
    });
    it('onStoreDelete is called', () => {
        const options: LlamaStoreOptions<MyStore> = {
            onStoreDelete: () => {},
        };
        const spy = jest.spyOn(options, 'onStoreDelete');
        const store = new LlamaStore<MyStore>('store', options);

        expect(spy).not.toHaveBeenCalled();

        store.delete('name');

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith('name');
    });
});
