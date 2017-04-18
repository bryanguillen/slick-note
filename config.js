exports.DATABASE_URL = process.env.DATABASE_URL ||
						global.DATABASE_URL ||
						'mongodb://localhost/notes-app';
exports.TEST_DATABASE_URL = 'mongodb://bryan:pudding34@ds161960.mlab.com:61960/test_database' ||
							'mongodb://localhost/test-notes-app';
exports.PORT = process.env.PORT || 8080; 