import Vue from "vue";

const cp = Vue.component('test-web-component', {
	data: function () {
		return {
			// msg: 'Hello'
		}
	},
	props: ['msg'],
	methods: {
		eecho() {
			console.log('Hello')
		}
	},
	template: `<span @click="eecho">{{ msg }}</span>`
})

export default cp
