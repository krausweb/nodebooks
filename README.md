Node.js 8.8.x web app with a books and with CRUD and Rest API
===========================================

# Run web app
    $ redis-server
    // run in the second window in your project folder
    $ npm start
    // OR start with debug messages
    $ DEBUG=nodebooks:* npm start
    // addition in the third window see node test CRUD results
    $ npm test

# Url by default
http://localhost:3000

# Pre setup
1. install npm via nvm install node<br/>
https://github.com/creationix/nvm
2. install redis-server<br/>
https://redis.io/topics/quickstart

# DB Redis info
test.js used DB '4' (test.length)<br/>
app.js used DB '11' (development.length)<br/>
// see all book:* in DB '11' in redis-cli<br/>
SELECT 11<br/>
SCAN 0 MATCH book*

# Test DB init data
books-init-db.js

# Node.js version
8.8.x

# Technology
Node.js + Express
Supertest + Mocha<br/>
Redis<br/>
Jade(Pug)<br/>
SASS<br/>
ES2015
