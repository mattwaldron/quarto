export class QInteractive {
    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    onClick() {
        // do nothing by default, but define this so we don't need null-checks for onClick calls
    }
}
