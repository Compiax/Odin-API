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
                type: "component",
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

/**List all components in the database */
debug('Exporting method: list');
module.exports.list = function(req, res, next){
  debug('Getting all components');
  Component.find(function(err, component){
    debug('Checking for errors');
    if(err) {
        debug(err);
        debug(err.name);
        debug(err.errors);
        return next(err);
    } 
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
          created: component.created
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

/*Delete component method*/
debug("Exporting method Delete");
module.exports.Delete = function(req,res){
    var component = Component.model('Component', Component);
    component.findByIdAndRemove(req.params.id, function(err) {
        if(!err){
            res.send("Success");
        }
        else{
            res.send("Error: " + err);
        }
    });
};

/*Update component method */
debug('Exporting method: Update');
module.exports.patch = function(req,res,next){
  var component = Component.model('Component', Component);

  component.findOneAndUpdate({name : req.body.name}, req.body, function(err,component){
    debug('Checking for errors');
    if(err) return next(err);
    if(!component) return next(new Error('could not find component'));

    component.name = req.body.name || component.name;
    component.description = req.body.description || component.description;
  
      component.save(function(err, component){
        if(err) return next(err);
        if(!component) return next(new Error('component returned empty'));

        debug('Building JSON:API response');
        var response = {
            data: {
                type: "Updated Component",
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

});

};

