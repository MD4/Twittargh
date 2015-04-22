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

Written with **Polymer** : Web Components oriented frnt-end architecture

[https://www.polymer-project.org](https://www.polymer-project.org)

**libs**

 - momentjs : Parse, validate, manipulate and display dates - [http://momentjs.com](http://momentjs.com)

### Back-end

#### API (REST)

Written with **Node.js** : Javascript platform

[https://nodejs.org](https://nodejs.org)

**Architecture** : Classical Service Oriented Architecture (SOA)

**libs**

 - expressjs : Fast minimalist web framework - [http://expressjs.com](http://expressjs.com)
 - Async.js : Async utilities - [https://github.com/caolan/async](https://github.com/caolan/async)
 - Underscorejs : Utility-belt library - [http://underscorejs.org](http://underscorejs.org)

#### Database

Using **Redis** : Open-source key-value database (cache and store)

[http://redis.io/](http://redis.io/)

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
