/**
 * This contains all project controllers
 */

var _       = require('lodash');
var debug   = require('debug')('odin-api:controllers:project');
var Project     = require('../models/project');

debug('Initialising project controller');


//Create a new project method and add to database
debug('Exporting method: create');
module.exports.create = function(req,res,next){
    
    
    var project = new Project({
        name: req.body.name,
        description: req.body.description,
        owner: req.body.owner, //User ID or something like that
        public: req.body.public
    });

    project.save(function(err, project){
        if(err) return next(err);
        if(!project) return next(new Error('project returned empty'));

        debug('Building JSON:API response');
        var response = {
            data: {
                type: "project",
                id: project.id,
                attributes: {
                name: project.name,
                description: project.description,
                owner: project.owner,
                public: project.public
                }
            }
        }

        debug('Sending response(status: 200)');
        res.status(200).send(response);
    });
};

/*Public list Project Method*/
debug('Exporting method: publicList');
module.exports.publicList = function(req, res, next){
  debug('Getting all projects');
  Project.find(function(err, project){
    debug('Checking for errors');
    if(err) return next(err);
    if(!project) return next(new Error('No projects found.'));

    debug('Building JSON:API response');
    var data = [];

    _.forEach(project, function(project){
        if(project.public){ //Only display public projects
            var _data = {
                type: 'project',
                id: project.id,
                attributes: {
                name: project.name,
                description: project.description,
                owner: project.owner,
                public: project.public
                }
            
      };

      data.push(_data);
        }
    });

    var response = {
      data: data
    };

    debug('Sending response (status: 200)');
    res.status(200).send(response);
  });
};


/*Private Project List Method*/
debug('Exporting method: privateList');
module.exports.privateList = function(req, res, next){
  debug('Getting all projects');
  Project.find(function(err, project){
    debug('Checking for errors');
    if(err) return next(err);
    if(!project) return next(new Error('No projects found.'));

    debug('Building JSON:API response');
    var data = [];

    _.forEach(project, function(project){
        debug(req.body.owner);
        if(project.owner == req.body.owner){ //Only display the specific owner's projects
            var _data = {
                type: 'project',
                id: project.id,
                attributes: {
                name: project.name,
                description: project.description,
                owner: project.owner,
                public: project.public
                }
            
      };

      data.push(_data);
        }
    });

    var response = {
      data: data
    };
  

    debug('Sending response (status: 200)');
    res.status(200).send(response);
  });
};


/*Delete project method*/
debug("Exporting method Delete");
module.exports.Delete = function(req,res){
    var project = Project.model('Project', Project);

    project.remove({name: req.body.name}, function(err){
      if(!err){
          res.send(req.body.name + "has been removed successfully\n");
      }
      else{
          res.send("Remove not possible:  " + req.body.name);
      }
    });
};

/*Update project method */
debug('Exporting method: Update');
module.exports.patch = function(req,res,next){
  var project = Project.model('Project', Project);

  project.findOneAndUpdate({name : req.body.name}, req.body, function(err,project){
    debug('Checking for errors');
    if(err) return next(err);
    if(!project) return next(new Error('could not find project'));

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
  
      project.save(function(err, project){
        if(err) return next(err);
        if(!project) return next(new Error('project returned empty'));

        debug('Building JSON:API response');
        var response = {
            data: {
                type: "Updated project",
                id: project.id,
                attributes: {
                    name: project.name,
                    description: project.description
                }
            }
        }

        debug('Sending response(status: 200)');
        res.status(200).send(response);
  });

});

};
