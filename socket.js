import socketio from 'socket.io';
import https from 'https';
import http from 'http';
import fs from 'fs';
import CONSTANTS from './constants';

const isDev = process.env.NODE_ENV !== 'production';

const options = {
  key: fs.readFileSync('./certs/private.pem'),
  cert: fs.readFileSync('./certs/origin.pem'),
};

const handler = (req, res) => {
  console.log('Server running');

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Hello World!');
  res.end();
};

const app = isDev ? http.createServer(handler) : https.createServer(options, handler);

const io = socketio(app);
app.listen(4545);

export default class {
  constructor(client) {
    this.client = client;
    this.s = null;
  }

  async connect() {
    return new Promise((resolve) => {
      io.on('connection', (s) => {
        this.s = s;
        console.log('A client just joined!');

        this.s.on('get-list-users', () => {
          this.updateUsers();
        });

        this.s.on('get-list-channels', () => {
          this.updateChannels();
        });

        this.s.on('ask-is-staff', (id) => {
          this.askIsStaff(id);
        });

        resolve();
      });
    });
  }

  askIsStaff(id) {
    this.s.emit(
      'is-staff',
      this.client.guilds
        .get(CONSTANTS.GUILD_ID)
        .members
        .array()
        .find(m => m.id === id)
        .roles
        .array()
        .find(r => r.id === CONSTANTS.ROLES.STAFF),
    );
  }

  updateUsers() {
    this.s.emit('list-users', this.client.guilds.get(CONSTANTS.GUILD_ID).members.array().map(m => ({
      username: m.user.username,
      avatar: m.user.avatarURL,
      id: m.id,
    })));
  }

  updateChannels() {
    this.s.emit('list-channels', this.client
      .guilds.get(CONSTANTS.GUILD_ID)
      .channels
      .array()
      .filter(m => m.type === 'text')
      .map(m => ({
        name: `#${m.name}`,
        id: m.id,
        type: m.type,
      })));
  }
}
