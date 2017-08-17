/**
 * This contains all component controllers
 */

var _       = require('lodash');
var debug   = require('debug')('odin-api:controllers:component');
var Component     = require('../models/component');

debug('Initialising component controller');


//Create a new component method and add to database
debug('Exporting method: create');
module.exports.create = function(req,res,next){
    
    
    var component = new Component({
        name: req.body.name,
        description: req.body.description
    });

    component.save(function(err, component){
        if(err) return next(err);
        if(!component) return next(new Error('component returned empty'));

        debug('Building JSON:API response');
        var response = {
            data: {
                type: component,
                id: component.id,
                attributes: {
                    name: component.name,
                    description: component.description
                }
            }
        }

        debug('Sending response(status: 200)');
        res.status(200).send(response);
    });
};


debug('Exporting method: list');
module.exports.list = function(req, res, next){
  debug('Getting all components');
  Component.find(function(err, component){
    debug('Checking for errors');
    if(err) return next(err);
    if(!component) return next(new Error('No components found.'));

    debug('Building JSON:API response');
    var data = [];

    _.forEach(component, function(component){
      var _data = {
        type: 'component',
        id: component.id,
        attributes: {
          name: component.name,
          description: component.description,
        }
      };

      data.push(_data);
    });

    var response = {
      data: data
    };

    debug('Sending response (status: 200)');
    res.status(200).send(response);
  });


};
