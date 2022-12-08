import Vue from "vue";
import warp from '@vue/web-component-wrapper'

import PopperContainer from "@/components/map/components/webComponents/popperContainer/PopperContainer.vue";
import MarkerContainer from '../components/map/components/webComponents/markerContainer/MarkerContainer.vue'
import DialogContainer from '../views/singleScreen/ajsgdjc/dongdialog.vue'
import Dialog2Container from '../views/singleScreen/ajsgdjc/dialog2.vue'
const webComponentsList = [
	{
		component: MarkerContainer,
		tag: 'marker-container'
	},
	{
		component: PopperContainer,
		tag: 'popper-container'
	},
	{
		component:DialogContainer,
		tag:'dong-dialog'
	},
	{
		component:Dialog2Container,
		tag:'do-dialog'
	},
	
]

export default {
	init() {
		webComponentsList.map((comp) => {
			const ele = warp(Vue, comp.component)
			window.customElements.define(comp.tag, ele)
		})
	}
}
