//imports and requirments 
const chai = require('chai');
const chaiHTTP = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const {User, Note} = require('../model');
const should = chai.should();
const mongoose = require('mongoose');
const {TEST_DATABASE_URL} = require('../config');
const router = require('../route');

//allowing for http integration testing
chai.use(chaiHTTP);

function seedNoteCollection() {
	let noteData = [
		{
			"user":  "59001649c831088d943b57df",
			"title": "THE TIME VALUE OF TIME",
			"subtitle": "FINANCE IN A CHANGING WORLD",
			"notes": "Hello Wolrd!"

		},

		{
			"user":   "59001649c831088d943b57df",
			"title": "Accounting",
			"subtitle": "Accounting IN A CHANGING WORLD",
			"notes": ""
		},

		{
			"user":   "59001649c831088d943b57df",
			"title": "MATH",
			"subtitle": "MATH IN A CHANGING WORLD",
			"notes": ""
		}
	]

	return Note.insertMany(noteData);
}

function dropNoteCollection() {
	return mongoose.connection.db.dropCollection('notes');
}

describe('ENDPOINT API TEST', function() {
	before(function() {
		return runServer(process.env.TEST_DATABASE_URL);
	})

	beforeEach(function() {
		return seedNoteCollection();
	})

	afterEach(function() {
		return dropNoteCollection();
	})

	after(function() {
		return closeServer();
	})

	describe('Test protected API endpoints.', function() {
		
		describe('GET a user resource and their home page', function() {
			it('should return user home page with notes', function() {
				return chai.request(app)
					.get('/user/59001649c831088d943b57df')
					.then(res => {
						res.should.have.status(200);
						res.should.be.html;
					})
      		})
		})

		describe('GET a note resource and then render', function() {
			it('should render html file with all of the users notes', function() {
				Note
					.findOne()
					.exec()
					.then(doc => {
						return doc._id;
					})
					.then(id => {
						return chai.request(app)
							.get('note/${id}');
					})
					.then(res => {
						res.should.have.status(200);
						res.should.be.html;
					})
			})
		})

		describe('POST a new note resource and then render html file', function() {
			it('should render html file with the new titles on it and textarea.', function() {
				let newNote = {
					"user": "59001649c831088d943b57df",
					"title": "NEW TEST TITLE",
					"subtitle": "NEW TEST SUBTITLE",
					"notes": ""
				}

				return chai.request(app)
					.post('/new-note')
					.send(newNote)
					.then(res => {
						res.should.have.status(201);
						res.should.be.json;
						res.should.be.a('object');
						return Note.findOne({"title": "NEW TEST TITLE"}).exec()
					})
					.then(doc => {
						doc.title.should.equal(newNote.title)
						doc.subtitle.should.equal(newNote.subtitle)
						doc.notes.should.equal(newNote.notes)
					})
			})
		})

		describe('PUT an existing note in the database', function() {
			it('should return the updated notes', function() {
				let noteUpdate = {"notes": "this is a new note"}
				let id;
				Note
					.findOne()
					.exec()
					.then(doc => {
						id = doc._id
						return chai.request(app)
							.put('/note/' + doc._id)
							.send({noteUpdate})
							.then(res => {
								res.should.have.status(204);
								return Note.findOne({"_id": id}).exec()
							})
							.then(newNote => {
							 	newNote.notes.should.equal(noteUpdate.notes);
							})
					})
			})
		})

	})

})
