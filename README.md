# react-results-controller v1.0.0

A helper class to simplify handling jQuery elements with data updates based on react/redux/reselect.

Inspired by the NSFetchedResultsController and UITableViewController patterns in iOS

## Installation

Using npm:
```shell
$ npm i -g npm
$ npm i --save react-results-controller
```

In Node.js:
```js
// Load the full build.
var Controller = require('react-results-controller');
// Load only the KeyedFlatResultsController.
var KeyedController = require('react-results-controller').KeyedFlatResultsController;
```

## Usage
```js
// Import the controller type you wish to create
import { KeyedFlatResultsController } from 'react-results-controller';
```

This initial version supports a single flat array style controller as a key/value set inside an object structure. The key being the primary key of the object:

### KeyedFlatResultsController

```js
{
  23: {
    id: 23,
    name: 'Fred',
    worth: 10000
  },
  54: {
    id: 54,
    name: 'Bob',
    worth: 20000
  }
}
```

This controller works as a flat array controller (no sections, or exactly 1 section, whichever way you want to look at it).

It is configured as below, with all callbacks being optional:

```js
constructor(...args) {
  super(...args);

  this.dataSource = new KeyedFlatResultsController({
    willChangeContent: this.willChangeContent.bind(this),
    didChangeObject: this.didChangeObject.bind(this),
    didChangeContent: this.didChangeContent.bind(this)
  });
}
```

When you receive a new data set, or alter the data set, pass it through to the results controller and it will work out all the additions, deletions and modifications, calling the "didChangeObject(changetype, object)" callback for each one.

Write your callbacks to handle each change detected as the callbacks are triggered. For example, for a datatables component (https://datatables.net/), you may do this:

```js
willChangeContent() {
  console.log('willChangeContent');
}
```

```js
didChangeObject(changeType, obj) {
  var table = $('#devicesTable').DataTable();
  if (table) {
    console.log('didChangeObject', changeType, obj);
    if (changeType == 'INSERT') {
      table.row.add(obj).draw();
    }
    else if (changeType == 'DELETE') {
      let row = table.row('#device_' + obj.id);
      if (row) {
        row.remove();
      }
    }
    else if (changeType == 'UPDATE') {
      let row = table.row('#device_' + obj.id);
      if (row) {
        row.data(obj);
      } else {
        table.row.add(obj).draw();
      }
    }
  }
}
```

```js
didChangeContent() {
  console.log('didChangeContent');
  if (this.table) {
    this.table.draw();
  }
}
```


## Support

Initial version, needs more testing feel free to contribute
