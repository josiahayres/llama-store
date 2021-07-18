# llama-store

**llama-store** is a Typescript library for interacting with browser storage.
It makes it easy to store large objects into localStorage, and lets you so you can make small changes quickly. The restored objects are much more accurate copies of the saved ones and the API is incredibly simple. E.g.:

## Installation

Use the package manager [npm](https://www.npmjs.com) to install foobar.

```bash
npm install llama-store
```

## Usage

```typescript
import LlamaStore from "llama-store";

// Using localStorage
var appStore = LlamaStore.persistent("appStore");
//or
// Using sessionStorage
var messageStore = LlamaStore.perishable("messageStore");
```

## API

| Implemented | Method                  | Description      |
| :---------- | :---------------------- | :--------------- |
| ✅          | `persistent(storeName)` | Create new store |

### Events

```typescript
// Write your event handler
const handleStoreSetupSuccess = (storeName: string) => {
	console.log(`[LlamaStore] []${storeName}`);
};

const storeConfig = {
	onStoreSetupSuccess: handleStoreSetupSuccess,
};
var messageStore = LlamaStore.persistent("messageStore", storeConfig);
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

**Other tools**

-   [jest-localstorage-mock](https://www.npmjs.com/package/jest-localstorage-mock)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
