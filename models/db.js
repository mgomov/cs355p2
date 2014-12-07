var mysql   = require('mysql');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection({
	host: 'cwolf.cs.sonoma.edu',
	user: 'mgomov',
	password: '004013261'
	//user: 'your_username',
	//password: 'your_password'
});

var dbToUse = 'mgomov';

//use the database for any queries run
var useDatabaseQry = 'USE ' + dbToUse;

connection.query(useDatabaseQry, function(err, res){
	console.log("Using DB " + dbToUse);
	if(err) console.log(err);
});

exports.getUsers = function(callback) {
	connection.query('SELECT * FROM User',
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}


exports.getUser = function(id, callback) {
	connection.query('SELECT * FROM User WHERE userID = ' + id,
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.getUserItems = function(id, callback) {
	query = "SELECT Recording.*, Annotation.*, User.userName FROM Recording LEFT JOIN Annotation ON Annotation.ofRecording = Recording.recordingID JOIN User ON Annotation.belongsTo = User.userID WHERE Recording.belongsTo = " + id + " OR Annotation.belongsTo =" + id;
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 });
}

exports.getUserRecordings = function(id, callback){
	query = "SELECT * FROM Recording WHERE Recording.belongsTo = " + id;
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 });

}

exports.getUserAnnotations = function(id, callback){
	query = "SELECT Recording.*, Annotation.annotationTitle, Annotation.ofRecording, User.* FROM Annotation JOIN Recording ON Annotation.ofRecording = Recording.recordingID JOIN User ON Recording.belongsTo = User.userID WHERE Annotation.belongsTo = " + id;
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 });

}

/* Criteria #7 - Records from a view */
exports.getUserPermittedRecordings = function(id, callback){
	query = "SELECT * FROM sharedRecView WHERE permittedUserID = " + id;
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 });

}

/* Criteria #7 - Records from a view */
exports.getUserPermittedAnnotations = function(id, callback){
	query = "SELECT * FROM sharedAnnotView WHERE permittedUserID = " + id;
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);

}

exports.updateUserInfo = function(uinfo, callback){
	query = "UPDATE User SET userName=\"" + uinfo.userName + "\", accountType=\"" + uinfo.accountType + "\" WHERE userID="+uinfo.userID;
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.getAnnotation = function(ainfo, callback){

	query = "SELECT Annotation.*, User.userName FROM Annotation JOIN User ON Annotation.belongsTo = User.userID WHERE Annotation.belongsTo=" + ainfo.belongsTo + " AND Annotation.ofRecording=" + ainfo.ofRecording;
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.getRecording = function(rinfo, callback){

	query = "SELECT * FROM Recording WHERE recordingID=" + rinfo.recordingID;
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.getClasses = function(callback){

	query = "SELECT * FROM Class";
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.getCurrentSections = function(cn, callback){

	query = "SELECT * FROM (SELECT * FROM ClassSection JOIN User ON ClassSection.taughtBy = User.userID WHERE ClassSection.sectionOf = " + cn + ") AS T JOIN Class ON T.sectionOf = Class.classNumber WHERE T.sectionID IN (SELECT * FROM CurrentSection)";
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.getPastSections = function(cn, callback){

	query = "SELECT * FROM (SELECT * FROM ClassSection JOIN User ON ClassSection.taughtBy = User.userID WHERE ClassSection.sectionOf = " + cn + ") AS T JOIN Class ON T.sectionOf = Class.classNumber WHERE T.sectionID IN (SELECT * FROM PastSection)";
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.getSectionInstructor = function(cn, callback){

	query = "SELECT * FROM ClassSection WHERE sectionOf = " + cn;
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.getSectionLectures = function(sid, callback){

	query = "SELECT Lecture.*, Class.description FROM Lecture JOIN ClassSection ON Lecture.ofSection = ClassSection.sectionID JOIN Class ON ClassSection.sectionOf = Class.classNumber WHERE ofSection = " + sid;
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.getLectureRecordings = function(lid, callback){

	query = "SELECT Recording.*, User.userName FROM Lecture JOIN RecordingOf ON (Lecture.ofSection = RecordingOf.LectureSectionID AND Lecture.title=RecordingOf.LectureTitle) JOIN Recording ON Recording.recordingID = RecordingOf.recordingID JOIN User ON User.userID = Recording.belongsTo WHERE Lecture.ofSection = " + lid.sectionID + " AND Lecture.title =\'" + lid.title + "\'";
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.getRecordingAnnotations = function(rid, callback){
	var query = "SELECT Annotation.*, User.userName FROM Recording JOIN Annotation ON Recording.recordingID = Annotation.ofRecording JOIN User ON User.userID = Annotation.belongsTo WHERE Annotation.ofRecording = " + rid; 

	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 callback(false, result);
			 }
			);
}

exports.createNewClassAndSection = function(input, callback){
	var query = "INSERT INTO Class(school, description) VALUES (\'" + input.school + "\', \'" + input.description + "\')";
	connection.query(query, 
			 function (err, result) {
				 if(err) {
					 console.log(err);
					 callback(true);
					 return;
				 }
				 connection.query("SELECT LAST_INSERT_ID()", function(err2, result2){
					 if(err){
						 console.log(err);
						 callback(true);
						 return;
					 }
					 var query2 = "INSERT INTO ClassSection (sectionOf, taughtBy) VALUES(" + result2[0]['LAST_INSERT_ID()'] + ", " + input.userID + ")";
					 connection.query(query2, function(err3, result3){
						 if(err){
							 console.log(err);
							 callback(true);
							 return;
						 }
						 connection.query("SELECT LAST_INSERT_ID()", function(someErr, idkWhatResultWTF){
							 connection.query("INSERT INTO CurrentSection VALUES(" + idkWhatResultWTF[0]['LAST_INSERT_ID()']+ ")", function(error, finalResult){
								 if(error){
									 console.log(error);
									 callback(true);
									 return;
								 }
								 callback(false, finalResult);
							 });
						 });
					 });
				 });
			 }
			);

}


