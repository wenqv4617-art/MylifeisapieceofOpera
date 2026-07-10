// 初始化本地 IndexedDB 数据库
const db = new Dexie("StoryPhoneDatabase");

// 声明表结构
db.version(2).stores({
  api_presets: 'id++, name, protocol, url, key, model, temperature',
  archives: 'id++, type, name, avatar, remark, group, persona, parentId', 
  relations: 'id++, fromId, toId, relation',
  sessions: 'id++, userId, charId, customCharName, customCharAvatar, customCharPersona, customUserAvatar, customUserPersona, lastMessageTime',
  messages: 'id++, sessionId, senderType, senderId, content, contentType, timestamp', // contentType: 'text', 'image', 'sticker'
  stickers: 'id++, imageUrl' // 共享表情包库
});