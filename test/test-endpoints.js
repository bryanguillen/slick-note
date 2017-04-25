//imports and requirments 
const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const {app, runServer, closeServer} = require('../server');
const {User, Note} = require('../model');
const should = chai.should();
const mongoose = require('mongoose');
const {TEST_DATABASE_URL} = require('../config');
const router = require('../route');

//allowing for http integration testing
chai.use(chaiHTTP);

function logUserIn() {
	let user = {
				username: "bryanguillen",
				password: "what"
			}
			return chai.request(app)
				.post('/login')
				.send(user)
				.then(function (req) {
					console.log(req.user)
				})
}

function logUserOut() {
	return chai.request(app)
		.get('/logout')
}

function seedNoteCollection() {
	let noteData = [
		{
			"_id": "58f50436aef859ac6e642884",
			"user":  "58ff589bc73482f7bc627111",
			"title": "THE TIME VALUE OF TIME",
			"subtitle": "FINANCE IN A CHANGING WORLD",
			"notes": "Hello Wolrd!"

		},

		{
			"_id": "58f50436aef859ac6e642885",
			"user":   "58ff588dc73482f7bc627110",
			"title": "Accounting",
			"subtitle": "Accounting IN A CHANGING WORLD",
			"notes": ""
		},

		{
			"_id": "58f50436aef859ac6e642887",
			"user":   "58ff588dc73482f7bc627110",
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

	describe('Test protected API endpoints.', function() {

		// beforeEach(function() {
		// 	return logUserIn();
		// })

		// afterEach(function() {
		// 	return logUserOut();
		// })

		describe('POST A NEW NOTE TO RESOURCE', function() {
			it('should create a new note upon successful post', function() {
				return logUserIn();
			// 	let newNote = {
			// 		"user": "58ff589bc73482f7bc627111",
			// 		"title": "NEW TEST TITLE",
			// 		"subtitle": "NEW TEST SUBTITLE",
			// 		"notes": "NEW TEST NOTE"
			// 	}

			// 	return chai.request(app)
			// 		.post('/new-note')
			// 		.send(newNote)
			// 		.then(function(res) {
			// 			res.should.have.status(201);
			// 			res.should.be.json;
			// 			res.should.be.a('object');
			// 		})
			})
		})
	})
})
