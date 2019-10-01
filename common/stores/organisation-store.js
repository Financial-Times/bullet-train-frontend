const BaseStore = require('./base/_store');
const data = require('../data/base/_data');


const controller = {

    getOrganisation: (id, force) => {
        if (id != store.id || force) {
            store.id = id;
            store.loading();

            Promise.all([
                data.get(`${Project.api}organisations/${id}/projects/`),
                data.get(`${Project.api}organisations/${id}/users/`),
                data.get(`${Project.api}organisations/${id}/invites/`),
                // data.get(`${Project.api}organisations/${id}/usage/`), // commented out as it is not returning,
            ]).then((res) => {
                if (id === store.id) {
                    const [projects, users, invites, usage] = res;
                    store.model = { users, invites: invites && invites.results };
                    return Promise.all(projects.map((project, i) => data.get(`${Project.api}projects/${project.id}/environments/`)
                        .then((res) => {
                            projects[i].environments = res;
                        })))
                        .then(() => {
                            projects.sort((a, b) => {
                                const textA = a.name.toLowerCase();
                                const textB = b.name.toLowerCase();
                                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                            });
                            store.model.projects = projects;
                            store.model.usage = usage && usage.events;
                            store.model.keyedProjects = _.keyBy(store.model.projects, 'id');
                            store.loaded();
                        });
                }
            });
        }
    },
    createProject: (name) => {
        store.saving();
        const createSampleUser = (res, envName) => data.post(`${Project.api}environments/${res.api_key}/identities/`, {
            environment: res.id,
            identifier: `${envName}_user_123456`,
        }).then(() => res);
        API.trackEvent(Constants.events.CREATE_PROJECT);
        data.post(`${Project.api}projects/`, { name, organisation: store.id })
            .then((project) => {
                Promise.all([
                    data.post(`${Project.api}environments/`, { name: 'Development', project: project.id })
                        .then(res => createSampleUser(res, 'development')),
                    data.post(`${Project.api}environments/`, { name: 'Production', project: project.id })
                        .then(res => createSampleUser(res, 'production')),
                ]).then((res) => {
                    project.environments = res;
                    store.model.projects = store.model.projects.concat(project);
                    store.savedId = {
                        projectId: project.id,
                        environmentId: res[0].api_key,
                    };
                    store.saved();
                });
            });
    },
    editOrganisation: (name) => {
        store.saving();
        data.put(`${Project.api}organisations/${store.id}/`, { name })
            .then((res) => {
                const idx = _.findIndex(store.model.organisations, { id: store.organisation.id });
                if (idx != -1) {
                    store.model.organisations[idx] = res;
                    store.organisation = res;
                }
                store.saved();
            });
    },
    deleteProject: (id) => {
        store.saving();
        if (store.model) {
            store.model.projects = _.filter(store.model.projects, p => p.id != id);
            store.model.keyedProjects = _.keyBy(store.model.projects, 'id');
        }
        API.trackEvent(Constants.events.REMOVE_PROJECT);
        data.delete(`${Project.api}projects/${id}/`)
            .then(() => {
                store.trigger('removed');
            });
    },
    inviteUsers: (emailAddresses) => {
        store.saving();
        data.post(`${Project.api}organisations/${store.id}/invite/`, {
            emails: emailAddresses.split(',').map((e) => {
                API.trackEvent(Constants.events.INVITE);
                return e.trim();
            }),
            frontend_base_url: `${document.location.origin}/invite/`,
        }).then((res) => {
            store.model.invites = store.model.invites || [];
            store.model.invites = store.model.invites.concat(res);
            store.saved();
            toast('Invite(s) sent successfully');
        }).catch((e) => {
            console.error('Failed to send invite(s)', e);
            store.saved();
            toast(`Failed to send invite(s). ${e && e.error ? e.error : 'Please try again later'}`);
        });
    },
    deleteInvite: (id) => {
        store.saving();
        data.delete(`${Project.api}organisations/${store.id}/invites/${id}/`)
            .then(() => {
                API.trackEvent(Constants.events.DELETE_INVITE);
                if (store.model) {
                    store.model.invites = _.filter(store.model.invites, i => i.id != id);
                }
                store.saved();
            })
            .catch(e => API.ajaxHandler(store, e));
    },
    resendInvite: (id) => {
        data.post(`${Project.api}organisations/${store.id}/invites/${id}/resend/`)
            .then(() => {
                API.trackEvent(Constants.events.RESEND_INVITE);
                toast('Invite resent successfully');
            })
            .catch((e) => {
                console.error('Failed to resend invite', e);
                toast(`Failed to resend invite. ${e && e.error ? e.error : 'Please try again later'}`);
            });
    },

};


var store = Object.assign({}, BaseStore, {
    id: 'account',
    getProject(id) {
        return store.model && store.model.keyedProjects && store.model.keyedProjects[id];
    },
    getUsage() {
        return store.model && store.model.usage;
    },
    getProjects() {
        return store.model && store.model.projects;
    },
    getUsers: () => store.model && store.model.users,
    getInvites: () => store.model && store.model.invites,
});


store.dispatcherIndex = Dispatcher.register(store, (payload) => {
    const action = payload.action; // this is our action from handleViewAction

    switch (action.actionType) {
        case Actions.GET_ORGANISATION:
            controller.getOrganisation(action.id || store.id, action.force);
            break;
        case Actions.CREATE_PROJECT:
            controller.createProject(action.name);
            break;
        case Actions.DELETE_PROJECT:
            controller.deleteProject(action.id);
            break;
        case Actions.INVITE_USERS:
            controller.inviteUsers(action.emailAddresses);
            break;
        case Actions.DELETE_INVITE:
            controller.deleteInvite(action.id);
            break;
        case Actions.RESEND_INVITE:
            controller.resendInvite(action.id);
            break;
        default:
    }
});
controller.store = store;
module.exports = controller.store;
