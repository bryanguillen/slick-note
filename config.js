exports.DATABASE_URL = process.env.DATABASE_URL ||
						global.DATABASE_URL ||
						'mongodb://localhost/notes-app';

exports.TEST_DATABASE_URL = 'mongodb://localhost/test-notes-app';

exports.TEST_USER_DATABASE_URL = 'mongodb://bryan:pudding34@ds157459.mlab.com:57459/test_user_database' ||
								'mongodb://localhost/test-user-database';

exports.PORT = process.env.PORT || 8080; 