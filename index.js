var express = require('express');
var app = express();

var Sequelize = require('sequelize');

// Veritabanı bağlantısını tanımla
var sequelize = new Sequelize('test', 'root', 'root');


// Veritabanı olusturdu ve projenin görevleri olabilecegini belirtti.
var sequelize = new Sequelize('sequelize', 'root', 'root');
var Project = sequelize.define('Project', {
  title:       Sequelize.STRING,
  description: Sequelize.TEXT
});
var Task = sequelize.define('Task', {
  title:       Sequelize.STRING,
  description: Sequelize.TEXT,
  deadline:    Sequelize.DATE
});


// ilişkiyi belirttiğimiz yer
Project.hasMany(Task);
Task.belongsTo(Project);



app.get('/task/', function (req, res) {
  var projectId   = req.query.projectId;
  var title       = req.query.title;
  var description = req.query.description;
  var deadline    = req.query.deadline;
  var task_id     = "";
  var d = new Date(deadline);

  sequelize.sync().then(function() {
    return Task.create({
      title       : title,
      description : description,
      deadline    : d
    });
  }).then(function(taskCreate) {
    // Proje objesini gelen id ye göre bul.
    Project.findById(projectId).then(function(project) {

      if(project)
      {
        // Proje yi task' e  set ediyoruz.
        taskCreate.setProject(project);
      }else {
        console.log("proje bulamadım");
      }
    });
    console.log(taskCreate.get({
      plain: true
    }));

    task_id = taskCreate.get('id');
    res.json({
      'taskId'      : task_id,
      'title'       : title,
      'description' : description,
      'deadline'    : deadline
    });
  });  
});

app.listen(3000);
