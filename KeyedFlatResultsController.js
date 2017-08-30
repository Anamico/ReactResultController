import _ from 'underscore';

const ResultsChangeInsert = 'INSERT';
const ResultsChangeUpdate = 'UPDATE';
const ResultsChangeDelete = 'DELETE';

export default class KeyedFlatResultsController {

    constructor(args) {

        this.willChangeContent = args.willChangeContent;
        this.didChangeSection = args.didChangeSection; // todo
        this.didChangeObject = args.didChangeObject;
        this.didChangeContent = args.didChangeContent;

        this.lastObjects = {};
    }

    newObjects(newObjects) {

        //console.log(newObjects);
        if (_.isEqual(newObjects, this.lastObjects)) {
            return;
        }

        if (this.willChangeContent) {
            this.willChangeContent();
        }

        // process additions
        let oldKeys = Object.keys(this.lastObjects[0]);
        let newKeys = Object.keys(newObjects[0]);
        let addedKeys = newKeys.filter(x => oldKeys.indexOf(x) < 0);
        if (this.didChangeObject) {
            addedKeys.map((id) => {
                this.didChangeObject(ResultsChangeInsert, newObjects[0][parseInt(id)]);
            });
        }

        // process deletions
        let deletedKeys = oldKeys.filter(x => newKeys.indexOf(x) < 0);
        if (this.didChangeObject) {
            deletedKeys.map((id) => {
                this.didChangeObject(ResultsChangeInsert, this.lastObjects[0][parseInt(id)]);
            });
        }

        // process updates
        let existingKeys = oldKeys.filter(x => newKeys.indexOf(x) > -1);
        if (this.didChangeObject) {
            existingKeys.map((id) => {
                let oldObj = this.lastObjects[0][parseInt(id)];
                let newObj = newObjects[0][parseInt(id)];
                if (!_.isEqual(oldObj, newObj)) {
                    this.didChangeObject(ResultsChangeUpdate, newObj);
                }
            });
        }

        if (this.didChangeContent) {
            this.didChangeContent();
        }

        this.lastObjects = newObjects;
    }
}
