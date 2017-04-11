//imports and requirments 
const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
const mongoose = require('mongoose');

//allowing for http integration testing
chai.use(chaiHTTP);

describe('ENDPOINTS TEST', function() {
	before(function() {
		return runServer();
	})

	after(function() {
		return closeServer();
	})

	describe('Get the index static file', function() {
		it('should render static index.html', function() {
			return chai.request(app)
				.get('/')
				.then(function(res) {
					res.should.have.status(200);
				})
		});
	})

})