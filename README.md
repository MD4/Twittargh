# Twittargh
> Small twitter clone using Node.js, Polymer & Redis !

## Table of contents

- [Quick start](#quick-start)
- [Features](#features)
- [Documentation](#documentation)
- [Copyright and license](#copyright-and-license)

## Quick start

### Installation

- Clone the repo: `git clone https://github.com/MD4/Twittargh.git`
- Go to the folder : `cd Twittargh`
- Install dependencies with `npm install`
- Start your local redis server
- Start the app with `npm start`
- Go to [http://localhost:3000](http://localhost:3000)
- Take a coffee

### Test accounts

- Usernames : `joker, dvador, kfrueger, jtorrance, mcorleone, hlecter, ca`
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
  - [x] Be amazingly foolproof (Yes. Really.)
  - [ ] Make huge amount of money

## Documentation

### Front end

Written with [Polymer](https://www.polymer-project.org) : Web Components oriented frnt-end architecture

**Libs**

 - [momentjs](http://momentjs.com) : Parse, validate, manipulate and display dates

### Back-end

#### API (REST)

Written with [Node.js](https://nodejs.org) : Javascript platform

**Architecture** :
 - Classical Service Oriented Architecture (SOA)
 
**Methodogy** :
 - [YOLO Driven Development (YDD)](http://ruby.zigzo.com/2013/02/24/ydd-guidelines-yolo-driven-development)

**Libs**

 - [expressjs](http://expressjs.com) : Fast minimalist web framework
 - [Async.js](https://github.com/caolan/async) : Async utilities
 - [Underscorejs](http://underscorejs.org) : Utility-belt library

#### Database

Using [Redis](http://redis.io) : Open-source key-value database (cache and store)

**Redis keys structure :**
```
db0
├── tweets
│   ├── data
│   │   └── <tweet id> : HASH (tweet data : content, date, owner...)
│   ├── hashtags
│   │   └── <hashtag name> : ZSET<tweet id,timestamp> (tweets related to that hashtag)
│   └── users
│       └── <user username> : ZSET<tweet id,timestamp> (users tweets)
├── users
│   └── <user username> : HASH (user data : username, password, firstname...)
│   ├── followers
│   │   └── <user username> : SET<user username> (users followers)
│   ├── following
│   │   └── <user username> : SET<user username> (users subscriptions)
│   └── walls
│       └── <user username> : ZSET<tweet id,timestamp> (tweets on the users walls)
└── sess
    └── <session id> : STRING (current express sessions)
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
