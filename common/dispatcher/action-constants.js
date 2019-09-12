const Actions = Object.assign({}, require('./base/_action-constants'), {
    'ACCEPT_INVITE': 'ACCEPT_INVITE',
    'CREATE_ENV': 'CREATE_ENV',
    'CREATE_FLAG': 'CREATE_FLAG',
    'CREATE_ORGANISATION': 'CREATE_ORGANISATION',
    'CREATE_PROJECT': 'CREATE_PROJECT',
    'CREATE_SEGMENT': 'CREATE_SEGMENT',
    'DELETE_ENVIRONMENT': 'DELETE_ENVIRONMENT',
    'DELETE_FLAG': 'DELETE_FLAG',
    'DELETE_INVITE': 'DELETE_INVITE',
    'DELETE_ORGANISATION': 'DELETE_ORGANISATION',
    'DELETE_PROJECT': 'DELETE_PROJECT',
    'DELETE_SEGMENT': 'DELETE_SEGMENT',
    'EDIT_ENVIRONMENT': 'EDIT_ENVIRONMENT',
    'EDIT_ENVIRONMENT_FLAG': 'EDIT_ENVIRONMENT_FLAG',
    'EDIT_FLAG': 'EDIT_FLAG',
    'EDIT_ORGANISATION': 'EDIT_ORGANISATION',
    'EDIT_PROJECT': 'EDIT_PROJECT',
    'EDIT_SEGMENT': 'EDIT_SEGMENT',
    'EDIT_TRAIT': 'EDIT_TRAIT',
    'EDIT_USER_FLAG': 'EDIT_USER_FLAG',
    'GET_AUDIT_LOG': 'GET_AUDIT_LOG',
    'GET_AUDIT_LOG_PAGE': 'GET_AUDIT_LOG_PAGE',
    'GET_ENVIRONMENT': 'GET_ENVIRONMENT',
    'GET_ENVIRONMENTS': 'GET_ENVIRONMENTS',
    'GET_FLAGS': 'GET_FLAGS',
    'GET_IDENTITIES': 'GET_IDENTITIES',
    'GET_IDENTITIES_PAGE': 'GET_IDENTITIES_PAGE',
    'GET_IDENTITY': 'GET_IDENTITY',
    'GET_ORGANISATION': 'GET_ORGANISATION',
    'GET_PROJECT': 'GET_PROJECT',
    'GET_SEGMENTS': 'GET_SEGMENTS',
    'INVITE_USERS': 'INVITE_USERS',
    'REMOVE_FLAG': 'REMOVE_FLAG',
    'REMOVE_SEGMENT': 'REMOVE_SEGMENT',
    'REMOVE_USER_FLAG': 'REMOVE_USER_FLAG',
    'RESEND_INVITE': 'RESEND_INVITE',
    'SEARCH_AUDIT_LOG': 'SEARCH_AUDIT_LOG',
    'SEARCH_IDENTITIES': 'SEARCH_IDENTITIES',
    'SELECT_ENVIRONMENT': 'SELECT_ENVIRONMENT',
    'SAVE_IDENTITY': 'SAVE_IDENTITY',
    'SELECT_ORGANISATION': 'SELECT_ORGANISATION',
    'SET_USER_FLAG': 'SET_USER_FLAG',
    'TOGGLE_FLAG': 'TOGGLE_FLAG',
    'TOGGLE_USER_FLAG': 'TOGGLE_USER_FLAG',
});

window.Actions = Actions;
module.exports = Actions;
