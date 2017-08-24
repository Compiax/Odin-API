var _       = require('lodash');
var debug   = require('debug')('odin-api:controllers:project');
var Project     = require('../models/project');
var JsonAPIResponse = require('../helpers/jsonapiresponse');
var ProjectNotFoundError = require('../helpers/errors/').ProjectNotFoundError;

debug('Exporting method: Create');
module.exports.create = function(req,res,next) {  
    var project = new Project({
        name: req.body.name,
        description: req.body.description,
        owner: req.user._id
    });

    project.save(function(err, project) {
        if(err) return next(err);
        if(project == undefined || project == null) return next('Error saving new project');

        debug('Building JSON:API response');
        var response = new JsonAPIResponse();
        response.addData('projects')
            .id(project._id)
            .attribute(project.attributes());

        debug('Sending response(status: 200)');
        res.status(200).send(response.toJSON());
    });
};

module.exports.browse = function(req, res, next){
  debug('Getting all projects');
  Project.find({owner: req.user._id}, function(err, projects) {
    debug('Checking for errors');
    if(err) return next(err);
    if(projects == undefined || projects == null) return next("Error retrieving projects");

    debug('Building JSON:API response');
    var response = new JsonAPIResponse();
    // debug(pro)
    projects.forEach(project => {
        response.addData('projects')
            .id(project._id)
            .attribute(project.attributes());
    });

    debug('Sending response (status: 200)');
    res.status(200).send(response.toJSON());
  });
};


module.exports.read = function(req, res, next){
    debug('Getting all projects');
    Project.findById(req.params.id, function(err, project) {
        debug('Checking for errors');
        if(err) return next(err);
        if(project == undefined || project == null) return next(new ProjectNotFoundError());

        debug('Building JSON:API response');
        var response = new JsonAPIResponse();
      
    response.addData('projects')
        .id(project._id)
        .attribute(project.attributes());
  
        debug('Sending response (status: 200)');
        res.status(200).send(response.toJSON());
    });
};

module.exports.delete = function(req,res) {
    Project.findByIdAndRemove(req.params.id, (err, project) => {
        if (project == null || project == undefined) return next(new ProjectNotFoundError());
        if (err) return next(err);
        res.status(200).send("OK");
    });
};

module.exports.update = function(req, res, next) {
    let update = {};
    if (req.body.name != undefined && req.body.name != null) {
        update.name = req.body.name;
    }
    if (req.body.description != undefined && req.body.description != null) {
        update.description = req.body.description;
    }

    Project.findByIdAndUpdate(req.params.id, update, (err, project) => {
        debug('Checking for errors');
        if(err) return next(err);
        if(project == undefined || project == null) return next(new ProjectNotFoundError());

        // Return updated project
        Project.findById(req.params.id, (err, project) => {
            var response = new JsonAPIResponse();
            response.addData('projects')
                .id(project._id)
                .attribute(project.attributes());         
            res.status(200).send(response.toJSON());
        })        
  });
};
