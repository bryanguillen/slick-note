exports.DATABASE_URL =  'mongodb://localhost/notes-app' || process.env.DATABASE_URL; 

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-notes-app';

exports.PORT = process.env.PORT || 8080; 