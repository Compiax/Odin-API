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

    this.link = function(links) {
        if (!this.json.hasOwnProperty('links')) {
            this.json.links = {};
        }
        for (var link in links) {
            this.json.links[link] = links[link];
        }
        return this;
    }
}

var JSONAPIErrorItem = function (type) {
    // Members
    this.json = {
        status: "500",
        title: "Internal Server Error",
        detail: "Something went wrong."
    };

    this.title = (title) => {
        this.json.title = title;
        return this;
    }

    this.status = (status) => {
        this.json.status = status;
        return this;
    }

    this.detail = (detail) => {
        this.json.detail = detail;
        return this;
    }
}

var JSONAPIResponse = function() {
    // Members
    this.data = [];
    this.errors = [];

    // Functions
    this.addData = function(type) {
        var newDataItem = new JSONAPIDataItem(type);
        this.data.push(newDataItem);
        return newDataItem;
    };

    // Functions
    this.addError = function() {
        var newErrorItem = new JSONAPIErrorItem();
        this.errors.push(newErrorItem);
        return newErrorItem;
    };

    this.toJSON = function() {
        var json = {};
        if (this.errors.length != 0) {
            json.errors = this.errors.map(function(err) { return err.json })
        }
        if (this.data.length != 0) {
            json.data = this.data.map(function(el) { return el.json })
        }
        return json;
    };
}

module.exports = JSONAPIResponse;