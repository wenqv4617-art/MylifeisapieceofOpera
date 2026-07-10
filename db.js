// 初始化本地 IndexedDB 数据库
const db = new Dexie("StoryPhoneDatabase");

// 声明表结构
// 我们预留了 "messages" 表，并对 "sessionId" 和 "timestamp" 建立了复合索引，以便未来处理海量聊天记录时实现快速分页读取
db.version(1).stores({
  api_presets: 'id++, name, protocol, url, key, model, temperature',
  archives: 'id++, type, name, avatar, remark, group, persona, parentId', // parentId 用于 NPC 指向所属的角色/用户
  relations: 'id++, fromId, toId, relation'
});