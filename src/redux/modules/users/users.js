import {ACTIONS} from './actions';
import _ from 'lodash';

//todo more user actions
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case ACTIONS.GET_ROLES_SUCCESS:
      return {
        ...state,
        roles: action.result
      };

    case ACTIONS.GET_CURRENT_USER:
      return {
        ...state,
        loadingCurrentUser: true
      };
    case ACTIONS.GET_CURRENT_USER_FAIL:
      return {
        ...state,
        loadingCurrentUser: false
      };
    case ACTIONS.GET_CURRENT_USER_SUCCESS:
      let user = _.get(action.result, 'username', 'undefined');
      let role = _.get(action.result, 'roles[0].name', '');
      let credentialsState = _.get(action.result, 'credentialsNonExpired', true);
      return {
        ...state,
        loadingCurrentUser: false,
        currentUser: {
          name: user,
          role: role,
          credentialsNonExpired: credentialsState
        }
      };
    case ACTIONS.GET_USERS_SUCCESS:
      return {
        ...state,
        usersList: _.keyBy(action.result, 'username')
      };
    case ACTIONS.GET_USER_SUCCESS:
      return {
        ...state,
        usersList: {...state.usersList, ..._.keyBy(action.result, 'username')}
      };
    case ACTIONS.SET_USER:
      return {
        ...state,
        settingUser: true,
        setUserError: null
      };
    case ACTIONS.SET_USER_FAIL:
      return {
        ...state,
        settingUser: false,
        setUserError: action.error.message
      };
    case ACTIONS.SET_USER_SUCCESS:
      return {
        ...state,
        settingUser: false,
        setUserError: null
      };
    case ACTIONS.GET_USER_ROLES_SUCCESS:
      return {
        ...state,
        usersList: {
          ...state.usersList,
          [action.id]: {
            ...state.usersList[action.id],
            roles: action.result
          }
        }
      };
    case ACTIONS.DELETE_USER_ROLE:
      return {
        ...state,
        deleteUserRoleError: null
      };
    case ACTIONS.DELETE_USER_ROLE_FAIL:
      return {
        ...state,
        deleteUserRoleError: action.error.message
      };
    case ACTIONS.ADD_USER_ROLE:
      return {
        ...state,
        addUserRoleError: null
      };
    case ACTIONS.ADD_USER_ROLE_FAIL:
      return {
        ...state,
        addUserRoleError: action.error.message
      };
    case ACTIONS.DELETE_USER:
      return {
        ...state,
        deleteUserError: null
      };
    case ACTIONS.DELETE_USER_FAIL:
      return {
        ...state,
        deleteUserError: action.error.message
      };
    case ACTIONS.GET_USER_ACL_SUCCESS:
      let entries = {};
      _.forEach(action.result, (value)=> {
        if (value.entries) {
          let entry = _.filter(value.entries, {"sid": {"principal": action.id}});
          let match = entry[0] ? entry[0].id.match(/:CLUSTER:(.+)/) : [];
          let id = match && match[1] ? match[1] : null;
          if (id) {
            entries = {...entries, [id]: entry[0]};
          }
        }
      });
      return {
        ...state,
        usersList: {
          ...state.usersList,
          [action.id]: {
            ...state.usersList[action.id],
            acl: entries
          }
        }
      };
    default:
      return state;
  }
}

export function getRoles() {
  return {
    types: [ACTIONS.GET_ROLES, ACTIONS.GET_ROLES_SUCCESS, ACTIONS.GET_ROLES_FAIL],
    promise: (client) => client.get(`/api/roles/`)
  };
}

export function getCurrentUser() {
  return {
    types: [ACTIONS.GET_CURRENT_USER, ACTIONS.GET_CURRENT_USER_SUCCESS, ACTIONS.GET_CURRENT_USER_FAIL],
    promise: (client) => client.get('/api/users/current/')
  };
}

export function getUsers() {
  return {
    types: [ACTIONS.GET_USERS, ACTIONS.GET_USERS_SUCCESS, ACTIONS.GET_USERS_FAIL],
    promise: (client) => client.get(`/api/users/`)
  };
}

export function deleteUser(userName) {
  return {
    types: [ACTIONS.DELETE_USER, ACTIONS.DELETE_USER_SUCCESS, ACTIONS.DELETE_USER_FAIL],
    promise: (client) => client.del(`/api/users/${userName}`)
  };
}

export function getUser(userName) {
  return {
    types: [ACTIONS.GET_USER, ACTIONS.GET_USER_SUCCESS, ACTIONS.GET_USER_FAIL],
    promise: (client) => client.get(`/api/users/${userName}`)
  };
}

export function setUser(userName, userData) {
  return {
    types: [ACTIONS.SET_USER, ACTIONS.SET_USER_SUCCESS, ACTIONS.SET_USER_FAIL],
    promise: (client) => client.post(`/api/users/${userName}`, {data: userData})
  };
}

export function getUserRoles(userName) {
  return {
    types: [ACTIONS.GET_USER_ROLES, ACTIONS.GET_USER_ROLES_SUCCESS, ACTIONS.GET_USER_ROLES_FAIL],
    id: userName,
    promise: (client) => client.post(`/api/users/${userName}/roles`)
  };
}

export function deleteUserRole(userName, role) {
  return {
    types: [ACTIONS.DELETE_USER_ROLE, ACTIONS.DELETE_USER_ROLE_SUCCESS, ACTIONS.DELETE_USER_ROLE_FAIL],
    promise: (client) => client.del(`/api/users/${userName}/roles/${role}`)
  };
}

export function addUserRole(userName, role) {
  return {
    types: [ACTIONS.ADD_USER_ROLE, ACTIONS.ADD_USER_ROLE_SUCCESS, ACTIONS.ADD_USER_ROLE_FAIL],
    promise: (client) => client.post(`/api/users/${userName}/roles/${role}`)
  };
}

export function setSingleACL(type, id, aclData) {
  return {
    types: [ACTIONS.SET_Single_ACL, ACTIONS.SET_Single_ACL_SUCCESS, ACTIONS.SET_Single_ACL_FAIL],
    promise: (client) => client.post(`/api/acl/${type}/${id}`, {data: aclData})
  };
}

export function setACL(aclData) {
  return {
    types: [ACTIONS.SET_ACL, ACTIONS.SET_ACL_SUCCESS, ACTIONS.SET_ACL_FAIL],
    promise: (client) => client.post(`/api/acl/`, {data: aclData})
  };
}

export function getUserAcl(userName) {
  return {
    types: [ACTIONS.GET_USER_ACL, ACTIONS.GET_USER_ACL_SUCCESS, ACTIONS.GET_USER_ACL_FAIL],
    id: userName,
    promise: (client) => client.get(`/api/users/${userName}/acls/`)
  };
}
