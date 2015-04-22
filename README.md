# Twittargh
> Small twitter clone using Node.js, Polymer & Redis !

## Table of contents

- [Quick start](#quick-start)
- [Features](#features)
- [Documentation](#documentation)
- [Copyright and license](#copyright-and-license)

## Quick start

### Installation

- Clone the repo: `git clone https://github.com/MD4/Twittargh.git`.
- Install dependencies with `npm install`
- Start your local redis server
- Start the app with `npm start`
- Go to [http://localhost:3000](http://localhost:3000)
- Take a coffee

### Tests

- Usernames : `joker, dvado, kfrueger, jtorrance, mcorleone, hlecter, ca`
- Password : `password`

## Features

- [x] Authentication
  - [x] Sign-in
  - [x] Sign-out
- [x] Tweets
  - [x] Post tweet
  - [x] User wall
  - [ ] Retweet
  - [ ] Tweet on specific user wall
- [x] Users
  - [x] Profile
  - [x] Follow
  - [x] Unfollow
  - [x] Tweet propagation to followers
- [x] Hashtags
  - [x] Post tweets with hashtag
  - [x] Tweet list from hashtag name
  - [x] Tweet propagation to hashtag
- [ ] Be a twitter competitor
  - [x] Be amazingly foolproof 
  - [ ] Make huge amount of money

## Documentation

### Front end

Written with Polymer : Web Components oriented frnt-end architecture

[https://www.polymer-project.org](https://www.polymer-project.org)

### Back-end

#### API (REST)

Written with Node.js : Javascript platform

[https://nodejs.org](https://nodejs.org)

Architecture : Classical Service Oriented Architecture (SOA)

#### Database

Using Redis : Open-source key-value database (cache and store)

[http://redis.io/](http://redis.io/)

Redis keys structure :
```
db0
├── tweets
│   ├── data
│   │   └── <tweet id> : HASH
│   ├── hashtags
│   │   └── <hashtag name> : ZSET<tweet id,timestamp>
│   └── users
│       └── <user username> : ZSET<tweet id,timestamp>
├── users
│   └── <user username> : HASH
│   ├── followers
│   │   └── <user username> : SET<user username>
│   ├── following
│   │   └── <user username> : SET<user username>
│   └── walls
│       └── <user username> : ZSET<tweet id,timestamp>
└── sess
    └── <session id> : STRING
```

## Copyright and license

```
           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                   Version 2, December 2004
 
Copyright (C) 2015 Martin DEQUATREMARE
 
Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.
 
           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 
 0. You just DO WHAT THE FUCK YOU WANT TO.
```
