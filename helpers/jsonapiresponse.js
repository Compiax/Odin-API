var debug = require('debug')('odin-api:helpers:jsonapiresponse');

var JSONAPIDataItem = function (type) {
    // Members
    this.json = {
        type: type,
    };

    // Functions
    this.attribute = function(attributes) {
        if (!this.json.hasOwnProperty('attributes')) {
            this.json.attributes = {};
        }
        for (var property in attributes) {
            this.json.attributes[property] = attributes[property];
        }
        return this;
    }
    this.id = function(id) {
        this.json.id = id;
        return this;
    }
}

var JSONAPIResponse = function() {
    // Members
    this.data = [];

    // Functions
    this.addData = function(type) {
        var newDataItem = new JSONAPIDataItem(type);
        this.data.push(newDataItem);
        return newDataItem;
    };
    this.toJSON = function() {
        return {
            data: this.data.map(function(el) { return el.json })
        }
    };
}

module.exports = JSONAPIResponse;