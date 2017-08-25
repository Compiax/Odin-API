/**
 * This contains all component controllers
 */

var _       = require('lodash');
var debug   = require('debug')('odin-api:controllers:component');
var Component     = require('../models/component');
var ComponentNotFoundError = require('../helpers/errors').components.ComponentNotFoundError;

debug('Initialising component controller');


//Create a new component method and add to database
debug('Exporting method: create');
module.exports.create = function(req,res,next) {
    var component = new Component({
        name: req.body.name,
        description: req.body.description,
        usage: req.body.usage,
        author: req.user._id
    });

    component.save(function(err, component) {
        if (err) debug (err.errors);
        if(err) return next(err)
        if(component == undefined || component == null) return next('Error saving new component');

        debug('Building JSON:API response');
        var response = new JsonAPIResponse();
        response.addData('components')
            .id(component._id)
            .attribute(component.attributes());

        debug('Sending response(status: 200)');
        res.status(200).send(response.toJSON());
    });
};

module.exports.browse = function(req, res, next){
    debug('Getting all components');
    Component.find()
    .populate('author')
    .then(function(components, err) {
        debug('Checking for errors');
        if(err) return next(err);
        if(components == undefined || components == null) return next("Error retrieving components");

        debug('Building JSON:API response');
        var response = new JsonAPIResponse();
        debug (req.headers.host);
        components.forEach(component => {
            response.addData('components')
                .id(component._id)
                .attribute(component.attributes())
                .link({self: req.headers.host + "/components/" + component._id});
      });
  
        debug('Sending response (status: 200)');
        res.status(200).send(response.toJSON());
    });
};

module.exports.read = function(req, res, next){
    debug('Getting all components');
    Component.findById(req.params.id)
    .populate('author')
    .then(function(component, err) {
        debug('Checking for errors');
        if(err) return next(err);
        if(component == undefined || component == null) return next(new ComponentNotFoundError());

        debug('Building JSON:API response');
        var response = new JsonAPIResponse();
      
    response.addData('components')
        .id(component._id)
        .attribute(component.attributes());
  
        debug('Sending response (status: 200)');
        res.status(200).send(response.toJSON());
    });
};

module.exports.delete = function(req,res) {
    Component.findByIdAndRemove(req.params.id, (err, component) => {
        if (component == null || component == undefined) return next(new ComponentNotFoundError());
        if (err) return next(err);
        res.status(200).send("OK");
    });
};

module.exports.update = function(req, res, next) {
    debug(req.body);
    Component.findByIdAndUpdate(req.params.id, req.body, (err, component) => {
        if (err) return next(err);
        if (component == undefined || component == null) return next(new ComponentNotFoundError());

        // Return updated component
        Component.findById(req.params.id, (err, component) => {
            var response = new JsonAPIResponse();
            response.addData('components')
                .id(component._id)
                .attribute(component.attributes());         
            res.status(200).send(response.toJSON());
        })        
  });
};

