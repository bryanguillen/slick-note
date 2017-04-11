//imports and requirments 
const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const {app} = require('../server');
const should = chai.should();
const mongoose = require('mongoose');

//allowing for http integration testing
chai.use(chaiHTTP);

