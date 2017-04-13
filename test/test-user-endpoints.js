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
			"_id": "58ef96d7a1ef2e629502193f",
			"username": "bryang123",
			"email": "bryang123@gmail.com",
			"password": "cookies",
			"createdAt": "4/11/17",
			"userNotes": ["58ef97e9a1ef2e6295021945", "58ef97e9a1ef2e6295021946"]
		}
	];
	
	return User.insertMany(userSeedData);
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
			return chai.request(app)
				.get('/bryang695')
				.then(function(res) {
					res.should.have.status(200);
				})
		});
	})

	describe('GET JSON FILE FOR USER', function() {
		it('should return user json', function() {
			return chai.request(app)
				.get('/bryang695' + '.json')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.json;
					res.should.be.a('object');
				})
		})
	})

})