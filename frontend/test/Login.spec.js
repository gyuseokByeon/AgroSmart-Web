import { createLocalVue, mount } from '@vue/test-utils';
import flushPromises from "flush-promises";

import Login from 'components/Login.vue';

import BootstrapVue from 'bootstrap-vue';
import ReactiveStorage from "vue-reactive-localstorage";
import VueRouter from 'vue-router';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(ReactiveStorage, {
    "token": "",
    "isAdmin": false, 
    "otherUserPk": 0,
    "loggedInUser": {}
});
localVue.use(VueRouter);
const router = new VueRouter({});

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter';

describe('Login component', () => {
    let wrapper, mock;

    beforeEach(() => {
        wrapper = mount(Login, { localVue, router });
        mock = new MockAdapter(axios);
    });

    afterEach(function () {
        mock.restore();
    });

    it("sets token if all successful", async () => {
        mock.onPost("api/api-auth").replyOnce(200, {token: "foobar"})
            .onGet("api/users").replyOnce(200, [{id: 1, username: "myname"}]);

        wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(wrapper.find('.alert-danger').exists()).toBeFalsy();
        expect(wrapper.vm.storage.token).toBe("foobar");
    });

    it("shows error if auth call fails with network error", async () =>  {
        mock.onPost("api/api-auth").networkErrorOnce();

        wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(mock.history.post.length).toBe(1);
        expect(mock.history.get.length).toBe(0);
        expect(wrapper.find('.alert-danger').exists()).toBeTruthy();
    });

    it("shows error if auth call fails with 401 Unauthorized error", async () => {
        mock.onPost("api/api-auth").replyOnce(401, {});
        
        wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(mock.history.post.length).toBe(1);
        expect(wrapper.find('.alert-danger').exists()).toBeTruthy();
    });
});