const debug = require('debug')('nodebooks:server');
const redis = require('redis');
const client = redis.createClient();

client.select('development'.length);

exports.checkAndInit = function() {

	client.exists('book:1', 'book:2', 'book:3', function (err, book) {
		if (book === 0) {
			debug('Init DB data of books');
			client.hmset('book:1', {
					'name': 'jQuery in Action, Third Edition',
					'author': 'Bear Bibeault, Yehuda Katz, and Aurelio De Rosa',
					'bookCreated': 'August 2015',
					'dateCreated': +new Date(),
				},
				redis.print);
			debug('Book HASH "book:1" was created');

			client.hmset('book:2', {
					'name': "Programming in HTML5 with JavaScript and CSS3",
					'author': "Glenn Johnson",
					'bookCreated': "August 2013",
					'dateCreated': +new Date()
				},
				redis.print);
			debug('Book HASH "book:2" was created');

			client.hmset('book:3', {
					'name': "Learning jQuery",
					'author': "Jonathan Chaffer, Karl Swedberg",
					'bookCreated': "June 2007",
					'dateCreated': +new Date()
				},
				redis.print);
			debug('Book HASH "book:3" was created');
			debug('All Books HASHes "book:1, book:2, book:3" were created');
		}
	});
};

/*let bookList = [
    {
      id: 1,
      name: "jQuery in Action, Third Edition",
      author: "Bear Bibeault, Yehuda Katz, and Aurelio De Rosa",
      bookCreated: "August 2015"
    },
    {
      id: 2,
      name: "Programming in HTML5 with JavaScript and CSS3",
      author: "Glenn Johnson",
      bookCreated: "August 2013"
    },
    {
      id: 3,
      name: "Learning jQuery",
      author: "Jonathan Chaffer, Karl Swedberg",
      bookCreated: "June 2007"
    }
];*/