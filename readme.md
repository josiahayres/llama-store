# llama-store

![Statements](./coverage/badge-statements.svg)
![Statements](./coverage/badge-lines.svg)
![Statements](./coverage/badge-functions.svg)

**llama-store** is a Typescript library for interacting with browser storage.
It makes it easy to store large objects into localStorage, and lets you so you can make small changes quickly. The restored objects are much more accurate copies of the saved ones and the API is incredibly simple. E.g.:

## Installation

Use the package manager [npm](https://www.npmjs.com) to install llama-store.

```bash
npm install @josiahayres/llama-store
```

## Usage

```typescript
import LlamaStore from '@josiahayres/llama-store';

interface MyAppStore extends Record<string, any> {
    name: string;
    age: number;
}

const store = new LlamaStore<MyAppStore>('storeName');

store.set('name', 'Dr Llama');
store.get('name'); // => "Dr Llama"

store.get('age'); // => null
store.set('age', 12345);
store.get('age'); // => 12345

store.knownKeys; // Set({name})
store.knownKeys.has('name'); // => true
store.knownKeys.has('unset'); // => false

store.delete('age');
store.get('age'); // => null
```

## API

| Method                           | Description                                                                                              |
| :------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `new LlamaStore<T>("storeName")` | Create new instance of a llamaStore, where T describes the shape of what you're saving into localStorage |
| `.get(key)`                      | Gets value for `key` from localStorage and returns `JSON.parse(value)`                                   |
| `.set(key, value)`               | `JSON.stringify(value)` and stores that to localStorage                                                  |
| `.delete(key)`                   | `JSON.stringify(value)` and stores that to localStorage                                                  |
| `.knownKeys()`                   | Returns a list of keys stored for this storeName.                                                        |
| `.storeConfig `                  | Returns config about store.                                                                              |

### Configuration

You can provide a configuration object that allows you to hook into the following store events

```typescript
// Write your event handler
const handleStoreSet = (key: string, value: any) => {
    console.log(`[LlamaStore][set()] ${key} ${value}`);
};

const storeConfig = {
    onStoreSet: handleStoreSet,
};
var messageStore = LlamaStore.persistent('messageStore', storeConfig);
```

| Event name                         | Description                                                  |
| :--------------------------------- | ------------------------------------------------------------ |
| `onStoreInitialize(defaultConfig)` | Called when store is setup first time                        |
| `onStoreRestore(restoredConfig)`   | Called when store is init & found matching config in storage |
| `onStoreSet(key, value)`           | Called whenever store.set() is called                        |
| `onStoreGet(key)`                  | Called whenever store.get() is called                        |
| `onStoreDelete(key)`               | Called when the store.delete() is called                     |

## Tests

This project has tests written with Jest.

To run the tests: `npm run test`

**Test dependencies:**

-   [jest-localstorage-mock](https://www.npmjs.com/package/jest-localstorage-mock) makes it easy to interact with localStorage API is Jest tests.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
