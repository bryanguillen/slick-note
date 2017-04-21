//imports and requirments 
const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const {app, runServer, closeServer} = require('../server');
const {User, Note} = require('../model');
const should = chai.should();
const mongoose = require('mongoose');
const {TEST_DATABASE_URL} = require('../config');

//allowing for http integration testing
chai.use(chaiHTTP);

function seedNoteCollection() {
	let noteData = [
		{
			"_id": "58f50436aef859ac6e642884",
			"user":  "58f93387f88780c640942e13",
			"title": "THE TIME VALUE OF TIME",
			"subtitle": "FINANCE IN A CHANGING WORLD",
			"notes": "Hello Wolrd!"

		},

		{
			"_id": "58f50436aef859ac6e642885",
			"user":   "58f93387f88780c640942e13",
			"title": "Accounting",
			"subtitle": "Accounting IN A CHANGING WORLD",
			"notes": ""
		},

		{
			"_id": "58f50436aef859ac6e642887",
			"user":   "58ef96d7a1ef2e6295021942",
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

describe('NOTE ENDPOINTS TEST', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
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

	describe('GET NOTE', function() {
		it('should get a single note', function() {
			Note
				.findById({"title": "Accounting"})
				.exec()
				.then(function(note) {
					return chai.request(app)
						.get('/note/' + note._id)
						.then(function(res) {
							res.should.have.status(200);
							res.should.be.a('object');
							res.should.include.keys(
								'id', 'user', 'title', 'subtitle', 'notes'
							);
							res.should.be.json;
						})				
				})
		});
	})

	describe('POST NEW NOTE', function() {
		let newNote = {
				"user": "58f50436aef859ac6e642884",
				"title": "A NEW TITLE",
				"subtitle": "A NEW subtitle",
				"notes": ""
			}
		it('should create a new note in db', function() {	
			return chai.request(app)
				.post('/new-note')
				.send(newNote)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.should.be.a('object');
					return Note.findById(res.body.id)
				})
				.then(function(note) {
					note.title.should.equal(newNote.title);
					note.subtitle.should.equal(newNote.subtitle);
					note.notes.should.equal(newNote.notes);
				})
		})
	})

})