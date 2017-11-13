const request = require('supertest');
const app = require('./app');
const redis = require('redis');
const client = redis.createClient();


// select DB '4' (get length from 'test') for Mocha test
client.select('test'.length);
// flush test db
client.flushdb();

describe('Get a list of Books', () => {
	before(() => {
		client.hmset('book:1',
			{
				'name': 'jQuery',
				'author': 'Yehuda Katz',
				'bookCreated': 'August 2015',
				'dateCreated': +new Date(),
			});
	});
	after(() => {
		client.flushdb();
	});

	it('Returns a 200 status code', (done) => {
		request(app)
			.get('/')
			.expect(200, done);
	});
	it('Returns a HTML format', (done) => {
		request(app)
			.get('/')
			.expect('Content-Type', /html/, done);
	});
	it('Returns an index file with Books', (done) => {
		request(app)
			.get('/')
			.expect(/jquery/i)
			.end( (err, res) => {
				if (err) throw err;
				//console.log(res.text);
				done();
			});
	});
});

describe('Create a new Book', () => {
	before(() => {
		client.hmset('book:2',
			{
				'name': 'jQuery',
				'author': 'Yehuda Katz',
				'bookCreated': 'August 2015',
				'dateCreated': +new Date(),
			});
	});
	after(() => {
		client.flushdb();
	});

	it('Returns a 201 status code', (done) => {
		request(app)
			.put('/book')
			.send('name=jQuery&author=Yehuda+Katz&bookCreated=August+2015')
			.expect(201, done);

	});
	it('Returns a Book numHash', (done) => {
		request(app)
			.put('/book')
			.send('name=jQuery&author=Yehuda+Katz&bookCreated=August+2015')
			.expect(/^\d/i)
			.end( (err, res) => {
				if (err) throw err;
				//console.log(res.text);
				done();
			});
	});
	it('Validate a Book: name, author, bookCreated', (done) => {
		request(app)
			.put('/book')
			.send('name=&author=&bookCreated=')
			.expect(400, done);
	});
});

describe('Update a Book', () => {
	before(() => {
		client.hmset('book:5',
			{
				'name': 'jQuery',
				'author': 'Yehuda Katz',
				'bookCreated': 'August 2015',
				'dateCreated': +new Date(),
			});
	});
	after(() => {
		client.flushdb();
	});

	it('Returns a 200 status code', (done) => {
		request(app)
			.post('/book/5')
			.send('name=jQuery&author=Yehuda+Katz&bookCreated=August+2015')
			.expect(200, done);
	});
	it('Returns a HTML format with short body', (done) => {
		request(app)
			.post('/book/5')
			.send('name=jQuery&author=Yehuda+Katz&bookCreated=August+2015')
			.expect('Content-Type', /html/, done);
	});
	it('Update info for given book', (done) => {
		request(app)
			.post('/book/5')
			.send('name=jQuery&author=Yehuda+Katz&bookCreated=August+2015')
			.expect(/updated/i)
			.end( (err, res) => {
				if (err) throw err;
				//console.log(res.text);
				done();
			});
	});

});

describe('Delete a Book', () => {
	before(() => {
		client.hmset('book:3',
			{
				'name': 'jQuery',
				'author': 'Yehuda Katz',
				'bookCreated': 'August 2015',
				'dateCreated': +new Date(),
			});
	});
	after(() => {
		client.flushdb();
	});

	it('Returns a 204 status code', (done) => {
		request(app)
			.delete('/book/3')
			.expect(204, done);
	});
});

describe('Show book info', () => {
	before(() => {
		client.hmset('book:4',
			{
				'name': 'jQuery',
				'author': 'Yehuda Katz',
				'bookCreated': 'August 2015',
				'dateCreated': +new Date(),
			});
	});
	after(() => {
		client.flushdb();
	});

	it('Returns a 200 status code', (done) => {
		request(app)
			.get('/book/4')
			.expect(200, done);
	});
	it('Returns a HTML format', (done) => {
		request(app)
			.get('/book/4')
			.expect('Content-Type', /html/, done);
	});
	it('Returns info for given book', (done) => {
		request(app)
			.get('/book/4')
			.expect(/jquery/i)
			.end( (err, res) => {
				if (err) throw err;
				//console.log(res.text);
				done();
			});
	});
});
