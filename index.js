require('./config')

/*

# Base By coderxsa
# Owner ? : https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q
!- do not delete this credit

*/

// const https = require('https');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
// const { SocksProxyAgent } = require('socks-proxy-agent')
// const agent = new SocksProxyAgent('socks5://174.77.111.196:4145')
// https.get('https://ipinfo.io', { agent }, (res) => {
//     // console.log(res.statusCode, res.headers);
//     res.pipe(process.stdout);
// });
const {
    default: makeWAsocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    proto,
    getAggregateVotesInPollMessage,
    makeCacheableSignalKeyStore,
    Browsers,
    MessageRetryMap
} = require("@whiskeysockets/baileys");
const pino = require('pino')
const chalk = require('chalk')
const { exec } = require('child_process')
const { Boom } = require('@hapi/boom');
const readline = require('readline');
const path = require('path')
const fs = require('fs')
const _ = require('lodash');
const yargs = require('yargs/yargs');
const { smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins } = require('./trashbase/lib/myfunc.js')
const listcolor = ['cyan', 'magenta', 'green', 'yellow', 'blue'];
const randomcolor = listcolor[Math.floor(Math.random() * listcolor.length)];
const { color, bgcolor } = require('./trashbase/lib/color.js');
const { imageToWebp,
    videoToWebp,
    writeExifImg,
    writeExifVid
} = require('./trashbase/lib/exif');
const FileType = require('file-type');
let low;
try {
    low = require('lowdb');
} catch (e) {
    low = require('./trashbase/lib/lowdb');
};
const {
    Low,
    JSONFile
} = low;
const mongoDB = require('./trashbase/lib/mongoDB');

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(color(text, randomcolor), (answer) => {
            resolve(answer);
            rl.close();
        });
    });
};

const start = async() => {
	const store = makeInMemoryStore({
        logger: pino().child({
            level: 'silent',
            stream: 'store'
        })
    });
	const {
		state,
		saveCreds
	} = await useMultiFileAuthState('./session')
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion();

	const coderxsa = await makeWAsocket({
	    //agent,
        keepAliveIntervalMs: 10000,
        printQRInTerminal: !global.connect,
        logger: pino({
            level: "silent"
        }),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }).child({ level: "silent" }))
        },
        browser: ["Ubuntu", "Chrome", "20.0.00"],
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        maxMsgRetryCount: 15,
        retryRequestDelayMs: 10,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        MessageRetryMap,
        resolveMsgBuffer: true,
        emitOwnEvents: true,
        fireInitQueries: true,
        markOnlineOnConnect: false,
	})

    if (global.connect && !coderxsa.authState.creds.registered) {
        await sleep(2000)
        let phoneNumber = await question("[ = ] - Enter the WhatsApp number you want to use as a bot  :  \n");
        let togel = phoneNumber.replace(/[^0-9]/g, '')
        await console.clear()
        let pairCode = await coderxsa.requestPairingCode(togel.trim());
        await sleep(2000)
        await console.log(color(`[ # ] enter that code into WhatsApp, motherfucker : ${pairCode}`, randomcolor));
    };

    store?.bind(coderxsa.ev)
    
    global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
    global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ? new mongoDB(opts['db']) : new JSONFile(`./trashbase/database/database.json`));
    global.DATABASE = global.db;
    global.loadDatabase = async function loadDatabase() {
        if (global.db.READ) return new Promise((resolve) => setInterval(function() {
            if (!global.db.READ) {
                clearInterval(this);
                resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
            }
        }, 1 * 1000));
        if (global.db.data !== null) return;
        global.db.READ = true;
        await global.db.read();
        global.db.READ = false;
        global.db.data = {
            users: {},
            chats: {},
            game: {},
            database: {},
            settings: {},
            setting: {},
            others: {},
            sticker: {},
            ...(global.db.data || {})
        };
        global.db.chain = _.chain(global.db.data);
    };
    loadDatabase();
    
    if (global.db) setInterval(async () => {
        if (global.db.data) await global.db.write();
    }, 30 * 1000);

    coderxsa.ev.on('creds.update', saveCreds)

	coderxsa.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
        } else return jid;
    };

	coderxsa.sendText = (jid, text, quoted = '', options) => coderxsa.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    });
	
    coderxsa.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, receivedPendingNotifications } = update;
    
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            
            switch (reason) {
                case DisconnectReason.connectionLost:
                    console.log(color('Connection to Server Lost, Attempting to Reconnect...', 'red'));
                    start();
                    break;
                case DisconnectReason.connectionClosed:
                    console.log(color('Connection closed, Attempting to Reconnect...', 'red'));
                    start();
                    break;
                case DisconnectReason.restartRequired:
                    console.log(color('Restart Required...', 'red'));
                    start();
                    break;
                case DisconnectReason.timedOut:
                    console.log(color('Connection Timed Out, Attempting to Reconnect...', 'red'));
                    start();
                    break;
                case DisconnectReason.badSession:
                    console.log(color('Delete Session and Scan again...', 'red'));
                    start();
                    break;
                case DisconnectReason.connectionReplaced:
                    console.log(color('Close current Session first...', 'red'));
                    start();
                    break;
                case DisconnectReason.loggedOut:
                    console.log(color('Scan again and Run...', 'red'));
                    exec('rm -rf ./session/*');
                    process.exit(1);
                    break;
                case DisconnectReason.Multidevicemismatch:
                    console.log(color('Scan again...', 'green'));
                    exec('rm -rf ./session/*');
                    process.exit(0);
                    break;
                default:
                    coderxsa.end(color(`Unknown DisconnectReason: ${reason}|${connection}`, 'red'));
                    break;
            }
        }
    
        if (connection === 'open') {
            console.log(color('Connected to: ' + JSON.stringify(coderxsa.user, null, 2), 'red'));
        }
        
        if (receivedPendingNotifications === 'true') {
            console.log(color('Please wait About 1 Minute...', 'red'));
            coderxsa.ev.flush();
        }
    });
    
    coderxsa.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
        } else return jid;
    };
    
    coderxsa.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = coderxsa.decodeJid(contact.id);
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            };
        }
    });
    
    coderxsa.setStatus = (status) => {
        coderxsa.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        });
        return status;
    };
    
    coderxsa.public = true
    
    coderxsa.getName = (jid, withoutContact = false) => {
        let id = coderxsa.decodeJid(jid);
        withoutContact = coderxsa.withoutContact || withoutContact;
        let v;
        if (id.endsWith("@g.us")) {
            return new Promise(async (resolve) => {
                v = store.contacts[id] || {};
                if (!(v.name || v.subject)) v = await coderxsa.groupMetadata(id) || {};
                resolve(v.name || v.subject || PhoneNumber(`+${id.replace('@s.whatsapp.net', '')}`).getNumber('international'));
            });
        } else {
            v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === coderxsa.decodeJid(coderxsa.user.id) ? coderxsa.user : (store.contacts[id] || {});
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber(`+${jid.replace('@s.whatsapp.net', '')}`).getNumber('international');
        }
    };
    
    coderxsa.sendContact = async (jid, kon, quoted = '', opts = {}) => {
        let list = [];
        for (let i of kon) {
            list.push({
                displayName: await coderxsa.getName(i),
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await coderxsa.getName(i)}\nFN:${await coderxsa.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            });
        }
        coderxsa.sendMessage(jid, {
            contacts: {
                displayName: `${list.length} Contact`,
                contacts: list
            },
            ...opts
        }, {
            quoted
        });
    };
    
    coderxsa.serializeM = (m) => smsg(coderxsa, m, store);
    coderxsa.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
        let mime = '';
        let res = await axios.head(url);
        mime = res.headers['content-type'];
        if (mime.split("/")[1] === "gif") {
            return coderxsa.sendMessage(jid, {
                video: await getBuffer(url),
                caption: caption,
                gifPlayback: true,
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        let type = mime.split("/")[0] + "Message";
        if (mime === "application/pdf") {
            return coderxsa.sendMessage(jid, {
                document: await getBuffer(url),
                mimetype: 'application/pdf',
                caption: caption,
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        if (mime.split("/")[0] === "image") {
            return coderxsa.sendMessage(jid, {
                image: await getBuffer(url),
                caption: caption,
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        if (mime.split("/")[0] === "video") {
            return coderxsa.sendMessage(jid, {
                video: await getBuffer(url),
                caption: caption,
                mimetype: 'video/mp4',
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
        if (mime.split("/")[0] === "audio") {
            return coderxsa.sendMessage(jid, {
                audio: await getBuffer(url),
                caption: caption,
                mimetype: 'audio/mpeg',
                ...options
            }, {
                quoted: quoted,
                ...options
            });
        }
    };
    
    coderxsa.sendPoll = (jid, name = '', values = [], selectableCount = 1) => {
        return coderxsa.sendMessage(jid, {
            poll: {
                name,
                values,
                selectableCount
            }
        });
    }
    ;
    coderxsa.sendText = (jid, text, quoted = '', options) => coderxsa.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    });
    
    coderxsa.sendImage = async (jid, path, caption = '', quoted = '', options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        return await coderxsa.sendMessage(jid, {
            image: buffer,
            caption: caption,
            ...options
        }, {
            quoted
        });
    };
    
    coderxsa.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        return await coderxsa.sendMessage(jid, {
            video: buffer,
            caption: caption,
            gifPlayback: gif,
            ...options
        }, {
            quoted
        });
    };
    
    coderxsa.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        return await coderxsa.sendMessage(jid, {
            audio: buffer,
            ptt: ptt,
            ...options
        }, {
            quoted
        });
    };
    
    coderxsa.sendTextWithMentions = async (jid, text, quoted, options = {}) => {
        return coderxsa.sendMessage(jid, {
            text: text,
            mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
            ...options
        }, {
            quoted
        });
    };
    
    coderxsa.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options);
        } else {
            buffer = await imageToWebp(buff);
        }
        await coderxsa.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        });
        return buffer;
    };
    
    coderxsa.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.?\/.?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await getBuffer(path) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }
        await coderxsa.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        });
        return buffer;
    };
    
    coderxsa.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message;
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(quoted, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        let type = await FileType.fromBuffer(buffer);
        let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
        await fs.writeFileSync(trueFileName, buffer);
        return trueFileName;
    };
    
    coderxsa.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || '';
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
        const stream = await downloadContentFromMessage(message, messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    };
    
    coderxsa.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
        let types = await coderxsa.getFile(path, true);
        let {
            mime,
            ext,
            res,
            data,
            filename
        } = types;
        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw {
                    json: JSON.parse(file.toString())
                }
            } catch (e) {
                if (e.json) throw e.json
            }
        }
        let type = '',
            mimetype = mime,
            pathFile = filename;
        if (options.asDocument) type = 'document';
        if (options.asSticker || /webp/.test(mime)) {
            let {
                writeExif
            } = require('./trashbase/lib/exif');
            let media = {
                mimetype: mime,
                data
            };
            pathFile = await writeExif(media, {
                packname: options.packname ? options.packname : global.packname,
                author: options.author ? options.author : global.author,
                categories: options.categories ? options.categories : []
            });
            await fs.promises.unlink(filename);
            type = 'sticker';
            mimetype = 'image/webp';
        } else if (/image/.test(mime)) type = 'image';
        else if (/video/.test(mime)) type = 'video';
        else if (/audio/.test(mime)) type = 'audio';
        else type = 'document';
        await coderxsa.sendMessage(jid, {
            [type]: {
                url: pathFile
            },
            caption,
            mimetype,
            fileName,
            ...options
        }, {
            quoted,
            ...options
        });
        return fs.promises.unlink(pathFile);
    }
    
    coderxsa.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype;
        if (options.readViewOnce) {
            message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined);
            vtype = Object.keys(message.message.viewOnceMessage.message)[0];
            delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined));
            delete message.message.viewOnceMessage.message[vtype].viewOnce;
            message.message = {
                ...message.message.viewOnceMessage.message
            };
        }
        let mtype = Object.keys(message.message)[0];
        let content = await generateForwardMessageContent(message, forceForward);
        let ctype = Object.keys(content)[0];
        let context = {};
        if (mtype != "conversation") context = message.message[mtype].contextInfo;
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        };
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {});
        await coderxsa.relayMessage(jid, waMessage.message, {
            messageId: waMessage.key.id
        });
        return waMessage;
    }
    
    coderxsa.cMod = (jid, copy, text = '', sender = coderxsa.user.id, options = {}) => {
        // let copy = message.toJSON()
        let mtype = Object.keys(copy.message)[0];
        let isEphemeral = mtype === 'ephemeralMessage';
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
        let content = msg[mtype];
        if (typeof content === 'string') msg[mtype] = text || content;
        else if (content.caption) content.caption = text || content.caption;
        else if (content.text) content.text = text || content.text;
        if (typeof content !== 'string') msg[mtype] = {
            ...content,
            ...options
        };
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
        else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
        if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
        else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
        copy.key.remoteJid = jid;
        copy.key.fromMe = sender === coderxsa.user.id;
        return proto.WebMessageInfo.fromObject(copy);
    }
    
    coderxsa.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await coderxsa.getFile(path, true);
        let {
            res,
            data: file,
            filename: pathFile
        } = type;
        if (res && res.status !== 200 || file.length <= 65536) {
            try {
                throw {
                    json: JSON.parse(file.toString())
                };
            } catch (e) {
                if (e.json) throw e.json;
            }
        }
        let opt = {
            filename
        };
        if (quoted) opt.quoted = quoted;
        if (!type) options.asDocument = true;
        let mtype = '',
            mimetype = type.mime,
            convert;
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
        else if (/video/.test(type.mime)) mtype = 'video';
        else if (/audio/.test(type.mime)) {
            convert = await (ptt ? toPTT : toAudio)(file, type.ext);
            file = convert.data;
            pathFile = convert.filename;
            mtype = 'audio';
            mimetype = 'audio/ogg codecs=opus';
        } else mtype = 'document';
        if (options.asDocument) mtype = 'document';
        delete options.asSticker;
        delete options.asLocation;
        delete options.asVideo;
        delete options.asDocument;
        delete options.asImage;
        let message = {
            ...options,
            caption,
            ptt,
            [mtype]: {
                url: pathFile
            },
            mimetype
        };
        let m;
        try {
            m = await coderxsa.sendMessage(jid, message, {
                ...opt,
                ...options
            });
        } catch (e) {
            // console.error(e)
            m = null;
        } finally {
            if (!m) m = await coderxsa.sendMessage(jid, {
                ...message,
                [mtype]: file
            }, {
                ...opt,
                ...options
            });
            file = null;
            return m;
        }
    }
    
    coderxsa.getFile = async (PATH, save) => {
        let res;
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.?\/.?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0);
        // if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        };
        filename = path.resolve(__dirname, './trashbase/src/' + new Date * 1 + '.' + type.ext);
        if (data && save) fs.promises.writeFile(filename, data);
        return {
            res,
            filename,
            size: await getSizeMedia(data),
            ...type,
            data
        };
    }
	
	coderxsa.ev.on('creds.update', saveCreds)
	
	coderxsa.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            let mek = chatUpdate.messages[0];
            if (!mek.message) return;
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
            let m = smsg(coderxsa, mek, store);
            require("./coderxsa.js")(coderxsa, m, chatUpdate, store);
        } catch (err) {
            console.log(err);
        }
    });
    return coderxsa;

}


start();


let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});