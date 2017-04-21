//imports and requirments 
const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const {app, runServer, closeServer} = require('../server');
const {User} = require('../model');
const should = chai.should();
const mongoose = require('mongoose');
const {TEST_USER_DATABASE_URL} = require('../config');

//allowing for http integration testing
chai.use(chaiHTTP);

function seedUserCollection() {
	let userSeedData = [
	{ 	
	"username": "bryang695",
	"email": "bryang695@gmail.com",
	"password": "cookies",
	"userNotes": []
	},

	{	
	"id": "58ef96d7a1ef2e629502193f",
	"username": "bryang217",
	"email": "bryang217@gmail.com",
	"password": "cookies",
	"userNotes": ["58f50436aef859ac6e642884"]
	},

	{
	"id": "58ef96d7a1ef2e6295021942",
	"username": "cookieMonster",
	"email": "cookieMonster@gmail.com",
	"password": "cookies",
	"userNotes": ["58f50436aef859ac6e642885", "58f50436aef859ac6e642887"]
	}
	];
	
	return User.insertMany(userSeedData);
}


function tearDownDb() {
	return mongoose.connection.dropDatabase();
}

describe('ENDPOINTS TEST', function() {
	before(function() {
		return runServer(TEST_USER_DATABASE_URL);
	})

	beforeEach(function() {
		return seedUserCollection();
	})

	afterEach(function() {
		return tearDownDb();
	})

	after(function() {
		return closeServer();
	})

	describe('GET INDEX HTML', function() {
		it('should render the index.html', function() {
			return chai.request(app)
				.get('/')
				.then(function(res) {
					res.should.have.status(200);
					res.should.be.html;
				})
		});
	})

	describe('GET THE LOGGED IN HOME PAGE FILE', function() {
		it('should send and render FILE with a 200 status', function() {
			User
				.findOne({"username": "cookieMonster"})
				.exec()
				.then(function(user) {
					return chai.request(app)
						.get('/user/' + user._id)
						.then(function(res) {
							res.should.have.status(200);
							res.should.be.html;
						})
				})
		});
	})

	describe('GET THE USER DATA FOR FEED', function() {
		it('should send json of users notes', function() {
			User
			.findOne({"username": "cookieMonster"})
			.exec()
			.then(function(user) {
				return chai.request(app)
			 		.get('/user/' + user._id + '.json')
			 		.then(function(res) {
			 			res.should.have.status(200);
			 			res.body.should.be.a("object");
			 			res.should.include.keys('id', 'username', 'userNotes')
			 			res.should.be.json;
			 			return User.findOne({"username": "cookieMonster"}).exec()
			 		})
			 		.then(function(user) {
			 			"58ef96d7a1ef2e6295021942".should.equal(user._id);
			 		})
			})
		});
	})

});