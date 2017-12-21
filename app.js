const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const HASH = uuidv4();
const fs = require('fs');
const CONSTANTS = require('./constants.json');
const Bot = require('./api/Bot');

require('pretty-error').start();

const documentation = require('./routes/documentation');
const api = require('./routes/api');
const commands = require('./routes/commands');
const dashboard = require('./routes/dashboard');

const Raven = require('raven');
Raven.config('https://d27747b9414d435ab6dae396ce61a4d2:caaa873cdb824239b3f422e0e2c76d1a@sentry.io/260708').install();

const app = express();

const port = process.env.PORT || 8080;
const ip = process.env.IP || '0.0.0.0';

const isDev = !process.env.ONLINE;

let bot;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(Raven.requestHandler());
app.use(Raven.errorHandler());

const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const DiscordStrategy = require('passport-discord').Strategy;

const scopes = [ 'identify', 'email', 'guilds' ];

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

const discordStrat = new DiscordStrategy({
    clientID: CONSTANTS.BOT.CLIENT_ID,
    clientSecret: CONSTANTS.BOT.CLIENT_SECRET,
    callbackURL: isDev ? 'http://localhost:8080/api/discord/callback' : 'https://alfred-botler.now.sh/api/discord/callback',
    scope: scopes
}, (accessToken, refreshToken, profile, done) => {
    profile.refreshToken = refreshToken; // store this for later refreshes
    process.nextTick(function () {
        return done(null, profile);
    });
});
passport.use(discordStrat);
refresh.use(discordStrat);

app.use(session({
    resave: true,
    saveUninitialized: true,
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
    secret: 'alfred is awesome'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.bot = bot;
    res.locals.guild = bot.guilds.get(CONSTANTS.GUILD_ID);
    next();
});

function checkAuth (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function empty (a, b, next) {
    next();
}

/* GET home page. */
app.get('/', function (req, res) {
    res.render('home');
});
app.get('/login', passport.authenticate('discord', {scope: scopes}), function (req, res) {
    res.locals.bot = bot;
    res.locals.guild = bot.guilds.get(CONSTANTS.GUILD_ID);
});
app.use('/doc', documentation);
app.use('/api', api);
app.use('/commands', isDev ? empty : checkAuth, commands);
app.use('/dashboard', checkAuth, dashboard);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/**
 * -----------------------------------------------------------------
 */

bot = new Bot({
    commandPrefix: '!',
    owner: '107180621981298688',
    disableEveryone: true
});

let getConnectedUsers = function () {
    const guild = bot.guilds.get(CONSTANTS.GUILD_ID);

    const guildMembers = guild.members;

    const connectedUsers = guildMembers.filter(member => {
        return (member.presence.status !== 'offline');
    });

    return connectedUsers.size;
};

let updateStatus = function () {
    const users = getConnectedUsers();
    bot.user.setPresence({
        game: {
            name: `with ${users} users`
        }
    });
};

process.on('uncaughtException', err => {
    console.info('Uncaugh');
    console.info('Caught exception: ' + err);
    console.info('Stack : ', err.stack);
    bot.emit('disconnect', {
        code: 1000,
        reason: 'Process: Uncaught exception',
        wasClean: true
    });
    process.exit();
});

bot
    .on('presenceUpdate', () => {
        updateStatus();
    })
    .on('message', message => {
        try {
            bot.parse(message);
        } catch (e) {
            Raven.captureException(e);
            console.log('ERROR PARSING MESSAGE', e);
        }
    })
    .on('disconnect', closeEvent => {
        console.info('BOT DISCONNECTING');
        bot.login(CONSTANTS.BOT.TOKEN);
        console.info('Close Event : ', closeEvent);
    })
    .on('ready', () => {
        console.log('Bot ready');
        updateStatus();
    });

bot.login(CONSTANTS.BOT.TOKEN);
app.listen(port, ip, () => {
    console.log('Server running on http://%s:%s', ip, port);
});
