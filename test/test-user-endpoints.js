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

function seedDatabase() {
	let userSeedData = [
	{ 	
	"username": "bryang695",
	"email": "bryang695@gmail.com",
	"password": "cookies",
	"createdAt": "4/11/17",
	"userNotes": []
	},

	{	
	"username": "bryang217",
	"email": "bryang217@gmail.com",
	"password": "cookies",
	"createdAt": "4/11/17",
	"userNotes": []
	},

	{
	
	"username": "cookieMonster",
	"email": "cookieMonster@gmail.com",
	"password": "cookies",
	"createdAt": "4/11/17",
	"userNotes": []
	}
	];
	
	return User.insertMany(userSeedData);
}

function newNote(userId) {
	return {
		user: userId,
		title: "Finance",
		subtitle: "FOR THE FUTURE"
	}
}

function tearDownDb() {
	return mongoose.connection.dropDatabase();
}

describe('ENDPOINTS TEST', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	})

	beforeEach(function() {
		return seedDatabase();
	})

	afterEach(function() {
		return tearDownDb();
	})

	after(function() {
		return closeServer();
	})

	describe('GET THE HOME PAGE FOR USER', function() {
		it('should render user homepage and notes', function() {
			User
			.findOne({"username": "cookieMonster"})
			.exec()
			.then(function(user) {
				return chai.request(app)
			 		.get('/' + user._id)
			 		.then(function(res) {
			 			res.should.have.status(200);
			 			expect(res).to.be.html;
			 		})
			})
		});
	})

	describe('GET JSON FILE FOR USER', function() {
		it('should return user json', function() {
			User
			.findOne({"username": "cookieMonster"})
			.exec()
			.then(function(user) {
				return chai.request(app)
					.get('/' + user._id + '.json')
					.then(function(res) {
						res.should.have.status(200);
						res.should.be.json;
						res.should.be.a('object');
				})
			})
		})
	})

	describe('POST FOR NEW NOTE', function() {
		it('should create a new instance in db', function() {
			User
				.findOne({"username": "cookieMonster"})
				.exec()
				.then(function(user) {
					let note = newNote(user._id)
					return chai.request(app)
						.post('/new-note')
						.send(note)
						.then(function(res) {
							res.should.have.status(201);
						})
					})
				})
	})

})