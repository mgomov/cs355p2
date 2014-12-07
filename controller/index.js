var express = require('express');
var router = express.Router();
var db   = require('../models/db');

/* Criteria #2 - a request to the root loads the homepage */
router.get('/', function(req, res) {
	db.getUsers(function(err, result){
		var users = result;
		users.userName = "No user selected";
		users.accountType = "N/A";
		users.disabled = "true";
		res.render('home', {rs: users});
	});
});

router.get('/home', function(req, res) {
	db.getUsers(function(err, result){
		var users = result;
		users.userName = "No user selected";
		users.accountType = "N/A";
		users.userID = -1;
		users.disabled = "true";
		res.render('home', {rs: users});
	});
});

/* Criteria #8 - Allows the user to change their username and account type */
router.post('/home/update', function(req, res){
	db.updateUserInfo(req.body, function(err, result){
		goToUser(req, res);
	});
});

router.post('/home', function(req, res){
	goToUser(req, res);
});

function goToUser(req, res){
	db.getUsers(function(err, result){
		var users = result;
		db.getUser(req.body.userID, function(err, guidres){
			db.getUserAnnotations(req.body.userID, function(err, guians){
				db.getUserRecordings(req.body.userID, function(err, guirecs){
					/* Criteria #8 - Getting data from views (the next two lines) */
					db.getUserPermittedRecordings(req.body.userID, function(err, guipr){
						db.getUserPermittedAnnotations(req.body.userID, function(err, guipa){
							users.recordings = guirecs;
							users.annotations= guians;
							guidres=guidres[0];
							users.userID = req.body.userID;
							users.rshared = guipr;
							users.ashared = guipa;
							users.userName = guidres.userName;
							users.accountType = guidres.accountType;
							users.disabled = "false";
							res.render('home', {rs: users});
						});
					});
				});
			});
		});
	});
}

/* Criteria #5 - a link to an about page with the required info */
router.get('/about', function(req, res) {
	res.render('about', { title: 'MG CS355 P2' });
});

router.get('/section', function(req, res){
	db.getSectionLectures(req.query.sectionID, function(err, result){
		var input = {lectures:result};
		res.render('section', {rs:input});
	});
});

router.get('/lecture', function(req, res){
	db.getLectureRecordings(req.query, function(err, result){
		res.render('lecture', {rs:result});
	});

});

router.get('/browseclass', function(req, res) {
	db.getClasses(function(err, result){
		var input = {};
		input.classes = result;
		res.render('browseClass', {rs:input});
	});
});

router.post('/browseclass', function(req, res) {
	db.getClasses(function(err, result){
		db.getCurrentSections(req.body.sectionOf, function(err, sectionsResult){
			db.getPastSections(req.body.sectionOf, function(err, sectionsPResult){
				var input = {
					// why I have to parseint here and nowhere else, I have no idea
					active: parseInt(req.body.sectionOf),
					classes:result,
					currentSections:sectionsResult,
					pastSections:sectionsPResult
				};
				res.render('browseClass', {rs:input});
			});
		});
	});
});

router.get('/annotation', function(req, res){
	annotInfo = {
		ofRecording:req.query.ofRecording,
		belongsTo:req.query.belongsTo
	};
	db.getAnnotation(annotInfo, function(err, result){
		res.render('annotation', {rs:result[0]});
	});
});

router.get('/recording', function(req, res){
	recInfo = {
		recordingID:req.query.recordingID
	};

	db.getRecording(recInfo, function(err, result){
		db.getRecordingAnnotations(result[0].recordingID, function(err, result2){
			var input = {};
			input.recordingTitle = result[0].recordingTitle;
			input.recordingID = result[0].recordingID;
			input.annotations = result2;
			res.render('recording', {rs:input});	
		});
	});
});

/* Criteria #7 - A form submission that manipulates multiple DB tables */
router.post('/create', function(req, res){
	var input = {};
	input.school = req.body.school;
	input.description = req.body.description;
	input.userID = req.body.userID;
	db.createNewClassAndSection(input, function(err, result){
		db.getClasses(function(err, result){
			var input = {};
			input.classes = result;
			res.render('browseClass', {rs:input});
		});

	});
});

module.exports = router;

