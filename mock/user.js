const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    Roles: ['admin'],
    Introduction: 'I am a super administrator',
    Avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    Name: 'Super Admin'
  },
  'editor-token': {
    Roles: ['editor'],
    Introduction: 'I am an editor',
    Avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    Name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {

      return {
        Code: 0,
        Data: {
          access_token: 'admin-token'
        }
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const {
        token
      } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          Code: 50008,
          Message: 'Login failed, unable to get user details.'
        }
      }

      return {
        Code: 0,
        Data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        Code: 0,
        Data: 'success'
      }
    }
  }
]
