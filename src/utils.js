const { execSync } = require('child_process');
const fetch = require('node-fetch');

module.exports = {
    async getUserInfo() {
        const workname = execSync("git config user.name").toString().replace('\n', '').replace('\r', '');

        const response = await fetch(`https://tianti.alibaba-inc.com/api/searchStaff?keyword=${workname}`);

        const data = await response.json();

        const userInfo = data.result.users[0]

        return userInfo;
    },
    async getWorkspaceInfo() {

    }
}