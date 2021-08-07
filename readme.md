# llama-store

[coverage-badge-green]: ./coverage/badge-statements.svg
[coverage-badge-green]: ./coverage/badge-branches.svg
[coverage-badge-green]: ./coverage/badge-lines.svg
[coverage-badge-green]: ./coverage/badge-functions.svg

**llama-store** is a Typescript library for interacting with browser storage.
It makes it easy to store large objects into localStorage, and lets you so you can make small changes quickly. The restored objects are much more accurate copies of the saved ones and the API is incredibly simple. E.g.:

## Installation

Use the package manager [npm](https://www.npmjs.com) to install foobar.

```bash
npm install llama-store
```

## Usage

```typescript
import LlamaStore from 'llama-store';

interface MyAppStore extends Record<string, any> {
    name: string;
    age: number;
}

// Using localStorage
const store = new LlamaStore<MyAppStore>('storeName');
```

## API

| Method                           | Description                                             |
| :------------------------------- | :------------------------------------------------------ |
| `new LlamaStore<T>("storeName")` | Create new instance of a llamaStore                     |
| `.get(key)`                      | Returns stored value                                    |
| `.set(key, value)`               | `JSON.stringify(value)` and stores that to localStorage |
| `.delete(key)`                   | `JSON.stringify(value)` and stores that to localStorage |
| `.knownKeys()`                   | Returns a list of keys stored for this storeName.       |
| `.storeConfig `                  | Returns config about store.                             |

### Events

> These are a work in progress

```typescript
// Write your event handler
const handleStoreSetupSuccess = (storeName: string) => {
    console.log(`[LlamaStore] []${storeName}`);
};

const storeConfig = {
    onStoreSetupSuccess: handleStoreSetupSuccess,
};
var messageStore = LlamaStore.persistent('messageStore', storeConfig);
```

| Implemented | Event name                         | Description                                 |
| :---------- | :--------------------------------- | :------------------------------------------ |
| ✅          | `onStoreSetup(key, value)`         | Called when store                           |
|             | `onStoreUpdateFailed(key, value)`  | Called when update to store failed          |
|             | `onStoreLimitReached(error)`       | Called when update to store failed          |
|             | `onStoreUpdateSuccess(key, value)` | Called after update to store was successful |
|             | `onStoreRemoveSuccess(key)`        | Called when the store was updated           |
|             | `onStoreRemoveFailure(key)`        | Called when the store was updated           |

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
