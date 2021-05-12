const cfg = require('./config.js');
const shell = require('shelljs');
const { resolve } = require('path');
const Client = require('ssh2-sftp-client');

// 获取npm参数
const args = process.argv.slice(2);
const { log } = console;

// 可以接收打包路径更换 .. 返回至项目根目录下
const i = args.indexOf('--path');
let path = '../dist';
if (i > -1 && args[i + 1]) {
  path = '../' + args[i]
}

// 本地执行脚本-->打包
const compileDist = async () => {
  if (shell.exec('npm run build:prod').code == 0) {
    log('打包成功')
  }
};

// 部署项目
async function connectSSh () {
  let sftp = new Client();
  sftp.connect(cfg.server).then(() => {
    // 删除文件
    log('正在删除文件');
    return sftp.rmdir(cfg.path, true);
  }).then(() => {
    log('正在上传文件',resolve(__dirname, path),' -> ', cfg.path);
    //
    return sftp.uploadDir(resolve(__dirname, path), cfg.path)
  }).then(data => {
    // 上传成功，断开sftp链接
    // const user = cfg.server.username + '@' + cfg.server.password;
    // // 重启nginx
    // if (shell.exec(`ssh ${user} "nginx -s reload"`) == 0) {
    //   log('重启nginx成功')
    // } else {
    //   log('重启失败！请检查')
    // }
    log('上传成功', data)
  }).catch(() => {
    // 上传失败
    log('上传失败！')
  }).finally(() => {
    sftp.end()
  })
}

async function runTask () {
  if (args.includes('build')) {
    await compileDist()
  }
  await connectSSh()
}

runTask();
// 使用方法npm run deploy
// 接收俩个参数：参数1：build:-->是否打包  参数2:path 参数--> 根目录下的目录路径    path是需要上传的根目录路径
