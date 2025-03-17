/*

# Base By coderxsa
# Owner ? : https://whatsapp.com/channel/0029VayIXEaISTkIAQEeFL2q
!- do not delete this credit

*/

require('./config.js')
const {
	coderxsaConnect,
	downloadContentFromMessage,
	emitGroupParticipantsUpdate,
	emitGroupUpdate,
	generateWAMessageContent,
	generateWAMessage,
	makeInMemoryStore,
	prepareWAMessageMedia,
	generateWAMessageFromContent,
	MediaType,
	areJidsSameUser,
	WAMessageStatus,
	downloadAndSaveMediaMessage,
	AuthenticationState,
	GroupMetadata,
	initInMemoryKeyStore,
	getContentType,
	MiscMessageGenerationOptions,
	useSingleFileAuthState,
	BufferJSON,
	WAMessageProto,
	MessageOptions,
	WAFlag,
	WANode,
	WAMetric,
	ChatModification,
	MessageTypeProto,
	WALocationMessage,
	ReconnectMode,
	WAContextInfo,
	proto,
	WAGroupMetadata,
	ProxyAgent,
	waChatKey,
	MimetypeMap,
	MediaPathMap,
	WAContactMessage,
	WAContactsArrayMessage,
	WAGroupInviteMessage,
	WATextMessage,
	WAMessageContent,
	WAMessage,
	BaileysError,
	WA_MESSAGE_STATUS_TYPE,
	MediaConnInfo,
	URL_REGEX,
	WAUrlInfo,
	WA_DEFAULT_EPHEMERAL,
	WAMediaUpload,
	mentionedJid,
	processTime,
	Browser,
	MessageType,
	Presence,
	WA_MESSAGE_STUB_TYPES,
	Mimetype,
	relayWAMessage,
	Browsers,
	GroupSettingChange,
	DisconnectReason,
	WASocket,
	getStream,
	WAProto,
	isBaileys,
	AnyMessageContent,
	fetchLatestBaileysVersion,
	templateMessage,
	InteractiveMessage,
	Header
} = require("@whiskeysockets/baileys")
const fs = require('fs')
const axios = require('axios')
const fetch = require('node-fetch')
const chalk = require('chalk')
const util = require('util')
const { spawn: spawn, exec } = require("child_process")
const moment = require('moment-timezone')
//=================================================//
module.exports = coderxsa = handler = async (coderxsa, m, chatUpdate, store) => {
	try {
	
		const { smsg, formatp, tanggal, formatDate, getTime, isUrl, sleep, clockString, runtime, fetchJson, getBuffer, jsonformat, format, parseMention, getRandom, getGroupAdmins } = require('./trashbase/lib/myfunc.js');
		const { toAudio, toPTT, toVideo, ffmpeg, addExifAvatar } = require('./trashbase/lib/converter.js');
		const { TelegraPh, UploadFileUgu, webp2mp4File, floNime } = require('./trashbase/lib/uploader.js');
    //=================================================//
		var body = (
			m.mtype === 'conversation' ? m.message.conversation :
			m.mtype === 'imageMessage' ? m.message.imageMessage.caption :
			m.mtype === 'videoMessage' ? m.message.videoMessage.caption :
			m.mtype === 'extendedTextMessage' ? m.message.extendedTextMessage.text :
			m.mtype === 'buttonsResponseMessage' ? m.message.buttonsResponseMessage.selectedButtonId :
			m.mtype === 'listResponseMessage' ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
			m.mtype === 'interactiveResponseMessage' ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id :
			m.mtype === 'templateButtonReplyMessage' ? m.message.templateButtonReplyMessage.selectedId :
			m.mtype === 'messageContextInfo' ?
			m.message.buttonsResponseMessage?.selectedButtonId ||
			m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
			m.message.InteractiveResponseMessage.NativeFlowResponseMessage ||
			m.text :
			''
			);
		if (body == undefined) { body = '' };
		var budy = (typeof m.text == "string" ? m.text : "");
    //=================================================//
		//command
		const prefixRegex = /[.!#÷×/]/;
		const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : null;
		const isCmd = prefix ? body.startsWith(prefix) : false;
		const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';		
		const args = budy.trim().split(/ +/).slice(1);
		const q = text = args.join(' ')

		// Individual
		const botNumber = coderxsa.user.id.split(':')[0];
		const pushname = m.pushName || "No Name";
		const senderNumber = m.sender.split('@')[0];	
		const itsMe = m.sender == botNumber;
		const isOwner = [botNumber, ...global.owner]
			.map(v => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
			.includes(m.sender);
			
		if (!coderxsa.public) {
			if (!m.fromMe && !isOwner) return;
		};

		// Group
		const isGroup = m.chat.endsWith('@g.us');
		const groupMetadata = isGroup ? await coderxsa.groupMetadata(m.chat).catch(e => {}) : '';
		const groupName = isGroup ? groupMetadata.subject : '';
		const groupMembers = isGroup ? groupMetadata.participants : '';
		const groupAdmins = isGroup ? await getGroupAdmins(groupMembers) : '';
		const isBotAdmin = isGroup ? groupAdmins.includes(botNumber + '@s.whatsapp.net') : false;
		const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
		const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
		const groupOwner = isGroup ? groupMetadata.owner : '';
		const isGroupOwner = isGroup ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender) : false;

		//msg
		const isMedia = (m.type === 'imageMessage' || m.type === 'videoMessage')
		const fatkuns = (m.quoted || m)
		const quoted = (fatkuns.mtype == "buttonsMessage") ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == "templateMessage") ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == "product") ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
		const qmsg = (quoted.msg || quoted)
		const mime = qmsg.mimetype || "";
		const moon = fs.readFileSync('./trashbase/media/moon.jpeg')
		const wangy = fs.readFileSync('./trashbase/media/coderxsa.jpg')

		//time
		const time = moment().tz("Africa/Johannesburg").format("HH:mm:ss");
		let ucapanWaktu;
		if (time >= "19:00:00" && time < "23:59:00") {
			ucapanWaktu = "夜 🌌";
		} else if (time >= "15:00:00" && time < "19:00:00") {
			ucapanWaktu = "午後 🌇";
		} else if (time >= "11:00:00" && time < "15:00:00") {
			ucapanWaktu = "正午 🏞️";
		} else if (time >= "06:00:00" && time < "11:00:00") {
			ucapanWaktu = "朝 🌁";
		} else {
			ucapanWaktu = "夜明け 🌆";
		}
		const wib = moment(Date.now()).tz("Africa/Johannesburg").locale("id").format("HH:mm:ss z");
		const wita = moment(Date.now()).tz("Africa/Johannesburg").locale("id").format("HH:mm:ss z");
		const wit = moment(Date.now()).tz("Africa/Johannesburg").locale("id").format("HH:mm:ss z");
		const salam = moment(Date.now()).tz("Africa/Johannesburg").locale("id").format("a");
		let d = new Date();
		let gmt = new Date(0).getTime() - new Date("1 Jan 2025").getTime();
		let weton = ["sex", "on", "the", "bitch", "cum"][Math.floor(((d * 1) + gmt) / 84600000) % 5];
		let week = d.toLocaleDateString("id", { weekday: "long" });
		let calendar = d.toLocaleDateString("id", {
			day: "numeric",
			month: "long",
			year: "numeric"
		});		

        //quoted
		const ctt = {
			key: {
				remoteJid: '0@s.whatsapp.net', // 'status@broadcast', using remote jid with value 'statusbroadcast' will cause message crash on wa desktop. as an alternative, I use value '0@s.whatsapp.net'
				participant: '0@s.whatsapp.net',
				fromMe: false,
			},
			message: {
				contactMessage: {
					displayName: (pushname),
					vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pushname},;;;\nFN:${pushname}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
				}
			}
		};

		const callg = {
			key: {
				remoteJid: 'status@broadcast', //'0@s.whatsapp.net', using remote jid with value 'statusbroadcast' will cause the message to crash on wa desktop. as an alternative, it is better to use the value '0@s.whatsapp.net'
				participant: '0@s.whatsapp.net',
				fromMe: false,
			},
			message: {
				callLogMesssage: {
                    isVideo: true,
                    callOutcome: "1",
                    durationSecs: "0",
                    callType: "REGULAR",
                    participants: [{ jid: "0@s.whatsapp.net", callOutcome: "1" }]
                }
			}
		};

        //reply
		const xreply = async (teks) => {
			await sleep(500)
			return coderxsa.sendMessage(m.chat, {
				contextInfo: {
					mentionedJid: [
						m.sender
					],
					externalAdReply: {
						showAdAttribution: false, 
						renderLargerThumbnail: false, 
						title: `codeerxsa- IdIoT`,
						body: `By coderxsa`,
						previewType: "VIDEO",
						thumbnail: moon,
						sourceUrl: global.url,
						mediaUrl: global.url
					}
				},
				text: teks
			}, {
				quoted: ctt
			})
		}
//=================================================//
    // Print a note in the console when someone sends a command

//  	if (m.message)  {		
		//if (isCmd)  {
            //console.log(chalk.black(chalk.bgWhite('[ MESSAGE ]')), chalk.black(chalk.bgGreen(new Date)), chalk.black(chalk.bgBlue(budy || m.mtype)) + '\n' + chalk.magenta('=> From'), chalk.green(pushname), chalk.yellow(m.sender) + '\n' + chalk.blueBright('=> From'), chalk.green(m.isGroup ? pushname : 'Private Chat', m.chat))
        //}
//=================================================//

           // Command Scope "Command"

		switch (command) {
			case "menu": {
				let cap = `
Library : coderxsa - baileys
Prefix : ( ${prefix} )
Status : ${coderxsa.public ? 'Public' : 'Self'}

*# main* :

.menu
.public
.self

*# convert* :

.s
.sticker
.toimg
.shorturl
.tourl

*# owner*: 
\u0000> ( eval )
< ( eval-async )
$ ( cmd-exec )
				`
				coderxsa.sendMessage(m.chat, { 
					image: wangy ,
					caption: cap,
					contextInfo: {
						mentionedJid: [
							m.sender
						],
						externalAdReply: {
							showAdAttribution: false,
							renderLargerThumbnail: false,
							title: `coderxsa- IdIoT`,
							body: `By coderxsa`,
							previewType: "VIDEO",
							thumbnail: moon,
							sourceUrl: global.url2,
							mediaUrl: global.url2
						}
					},
				}, { quoted: ctt })
			}
			break

            case 'pe': {
               m.reply('dick')
            }
            break
			
			case "public": {
				if (!isOwner) return
				m.reply("succes change status to public")
				coderxsa.public = true
			}
			break

			case "self": {
				if (!isOwner) return
				m.reply("succes change status to self")
				coderxsa.public = false
			}
			break

            case 's': 
            case 'sticker': 
            case 'stiker': {            
                if (/image/.test(mime)) {
                    let media = await quoted.download();
                    let encmedia = await coderxsa.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author });
                } else if (/video/.test(mime)) {
                    if ((quoted.msg || quoted).seconds > 11) {
                        return xreply(`Reply to the image with a caption ${prefix+command}\nIf the media you want to use as a sticker is a video, the maximum video duration is 1-9 seconds.`);
                    }
                    let media = await quoted.download();
                    let encmedia = await coderxsa.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author });
                } else {
                    xreply(`Reply image with caption ${prefix+command}\nVideo Duration 1-9 Seconds`);
                }
            }
            break

            case 'toimage': 
            case 'toimg': {
                if (!/webp/.test(mime)) {
                    return xreply(`Reply/Reply sticker with text: *${prefix + command}*`);
                }
                
                let media = await coderxsa.downloadAndSaveMediaMessage(qmsg);
                let ran = await getRandom('.png');
                
                exec(`ffmpeg -i ${media} ${ran}`, (err) => {
                    fs.unlinkSync(media);
                    if (err) return err;
            
                    let buffer = fs.readFileSync(ran);
                    coderxsa.sendMessage(m.chat, { image: buffer }, { quoted: m });
                    fs.unlinkSync(ran);
                });
            }
            break

            case "shortlink": 
            case "shorturl": {
                if (!text) return xreply(`Example: ${prefix + command} https://showmypenis`);
                if (!isUrl(text)) return xreply(`Example: ${prefix + command} https://showmypenis`);
            
                var res = await axios.get('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(text));
                var link = `\n*Shortlink by TinyURL*\n${res.data.toString()}`;
            
                await xreply(link);
            }
            break

            case 'tourl': {
                if (!/video/.test(mime) && !/image/.test(mime)) return xreply(`Reply image with caption ${prefix+command}`);
                let pnis = await m.quoted ? m.quoted : m;
                let media = await pnis.download();
                let link = await TelegraPh(media);
                await sleep(1000);
                await xreply(`${link}`);
            }
            break

            case "checkjid": {
                if (!isOwner) return
                xreply(`${m.chat}`);
            }
            break



			default:
			if (body.startsWith("<")) {
                if (!isOwner) return;
                try {
                    const output = await eval(`(async () => ${q})()`);
                    await m.reply(`${typeof output === 'string' ? output : JSON.stringify(output, null, 4)}`);
                } catch (e) {
                    await m.reply(`Error: ${String(e)}`);
                }
            }
			if (budy.startsWith(">")) {
			if (!isOwner) return
				try {
					let evaled = await eval(q);
					if (typeof evaled !== "string") evaled = util.inspect(evaled);
					await m.reply(evaled);
				} catch (e) {
					await m.reply(`Error: ${String(e)}`);
				}
			}
			if (budy.startsWith("$")) {
			if (!isOwner) return
				exec(q,
					(err, stdout) => {
						if (err) return m.reply(err.toString());
						if (stdout) return m.reply(stdout.toString());
				})
				}
		}
		
	} catch (e) {
		console.log(e)
	}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
})
