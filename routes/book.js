const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parseUrlencoded = bodyParser.urlencoded({ extended: false });
const debug = require('debug')('nodebooks:server');
const redis = require('redis');
const client = redis.createClient();

// check or init books for test
const booksInitDb = require('../books-init-db');
booksInitDb.checkAndInit();

client.on('connect', () => debug('Connected to Redis'));
client.on('error', (err) => debug(`${err} Connected to Redis`));

//// select Production 'Number' DB or '11' DB (get length from 'development') for local PC
// Heroku - process.env.REDIS_URL
client.select((process.env.REDIS_URL || 'development').length);

router
	.get('/', function (req, res) {
		/* GET all Books */

		client.scan('0', 'MATCH', 'book:*', function (error, bookListAll) {
			// if isset hash with book:* (book:1, book:2 etc.)
			if (bookListAll[1]) {
				let allBooks = bookListAll[1].length,
					bookListArr = [];
				for(let i = 1; i <= allBooks; i++) {
					client.hmget('book:' + i, 'name', 'author', 'bookCreated', function (error, bookList) {
						if (error) throw error;
						bookListArr.push({
							name: bookList[0], author: bookList[1], bookCreated: bookList[2], numHash: i
						});
						if (i === allBooks) {
							// reverse to add a new item to the top of the list
							bookListArr.reverse();
							res.render('book', { bookList: bookListArr, title: 'Book List' });
						}
					});
				}
			}
		});
	})
	.put('/book', parseUrlencoded, function (req, res) {
		/* PUT Book */

		let newBook = req.body;
		if (newBook.name && newBook.author && newBook.bookCreated) {
			client.scan('0', 'MATCH', 'book:*', function (error, book) {
				// if isset hash with book:* (book:1, book:2 etc.)
				if (book[1]) {
					// get count all book:* and + 1 for creating a new book:N
					let newBookId = book[1].length + 1;
					client.hmset('book:' + newBookId, {
							'name': newBook.name,
							'author': newBook.author,
							'bookCreated': newBook.bookCreated,
							'dateCreated': +new Date(),
						}, function (error) {
							if (error) throw error;
							debug(`Added a new book:${newBookId} with name: ${newBook.name}`);
							res.status(201).json(newBookId); // get new numHash for list of books
					});
				}
			});
		} else {
			let message = 'The PUT has an incorrect body.';
			debug(`${message} Original Request: ${JSON.stringify(req.body)}`);
			res.status(400).send(message);
		}
	});

router.route('/book/:numhash')
	.get(function (req, res) {
		/* GET a Book */

		let numHash = req.params.numhash;
		client.exists('book:' + numHash, function (err, book) {
			if (book > 0) {
				client.hmget('book:' + numHash, 'name', 'author', 'bookCreated', function (error, book) {
					if (error) throw error;
					res.render('book-edit', {
						bookList: {name: book[0], author: book[1], bookCreated: book[2], numHash}, title: book[0]
					});
				});
			} else {
				let message = isBookId(numHash)
					? `Not found Book Id ${numHash}.`
					: `Your request ${numHash} is not correct!`;
				debug(`${message} Original Request: ${JSON.stringify(req.params)}`);
				res.status(404).render('not-found', {message, title: 'Not Found'});
			}
		});
	})
	.post(parseUrlencoded, function (req, res) {
		/* POST Book */

		let updateBook = req.body,
			numHash = req.params.numhash;
		client.exists('book:' + numHash, function (err, book) {
			if (book > 0) {
				client.hmset('book:' + numHash, {
					'name': updateBook.name,
					'author': updateBook.author,
					'bookCreated': updateBook.bookCreated
				}, function (error) {
					if (error) throw error;
					debug('Updated a book:' + numHash);
					res.status(200).send('updated');
				});
			} else {
				let message = 'The POST has an incorrect body.';
				debug(`${message} Original Request: ${JSON.stringify(req.body)}. ${JSON.stringify(req.params)}`);
				res.status(404).render('not-found', {message, title: 'Not Found'});
			}
		});
	})
	.delete(function (req, res) {
		/* DELETE Book */

		let numHash = req.params.numhash;
		client.exists('book:' + numHash, function (err, book) {
			if (book > 0) {
				client.del('book:' + numHash, function (error) {
					if (error) throw error;
					debug('Deleted a book:' + numHash);
					res.status(204).send('No Content');
				});
			} else {
				let message = 'The DELETE has an incorrect request';
				debug(`${message}. Original Request: ${JSON.stringify(req.params)}`);
				res.status(404).render('not-found', {message, title: 'Not Found'});
			}
		});
	});

/**
 * Check Book id
 * @param {Number} id
 * @returns {boolean}
 */
function isBookId(id) {
	let reg = new RegExp(/^\d/);
	return reg.test(parseInt(id));
}

module.exports = router;