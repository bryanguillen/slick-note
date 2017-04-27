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
		
		describe('GET A USER AND THEIR NOTES', function() {
			it('should return user home page with notes', function() {
				let newNote = {
					"user": "59001649c831088d943b57df",
					"title": "NEW TEST TITLE",
					"subtitle": "NEW TEST SUBTITLE",
					"notes": "NEW TEST NOTE"
				}
				
				return chai.request(app)
					.get('/user/59001649c831088d943b57df')
					.then(function(res) {
						res.should.have.status(200);
						res.should.be.html;
					})
      		})
		})
	
		describe('GET NOTE BY ID', function() {
			it('should render a note individually', function() {

				return chai.request(app)
					.get('/note/59001649c831088d943b57df')
					.then(function(res) {
						res.should.have.status(200);
						res.shoud.be.html;
					})
			})
		})

		describe('DELETE NOTE BY ID', function() {
			it('should render a note individually', function() {

				return chai.request(app)
					.delete('/note/59001649c831088d943b57df')
					.then(function(res) {
						res.should.have.status(204);
    					return Note.findById(posts.id).exec();
  					})
  					.then(function(_post) {
    					should.not.exist(_post);
  					});
					})
			})
		})

	})
})
