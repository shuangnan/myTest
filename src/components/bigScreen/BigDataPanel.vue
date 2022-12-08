<!--
	大数据页面数据面板边框
	@params：见vue props对象
	@author ZhangQX
	@time 2020年5月27日10:02:23
-->
<template>
    <component :more="haveMore" @titleClick="()=>this.$emit('titleClick')" :is="type==='border'?'BlueBorderPanel':'LinePanel'" v-bind="{...$attrs, ...$props}">
        <slot></slot>
    </component>
</template>

<script>
    import BlueBorderPanel from './BlueBorderPanel'
    import LinePanel from "./LinePanel";

    export default {
        props: {
            //类型:border-蓝色边框 line-横线
            type: {
                type: String,
                required: true,
                validator: function (value) {
                    return ["border", "line"].indexOf(value) !== -1
                }
            },
            haveMore: {
                type: [Boolean,String]
            }
        },
        components: {
            BlueBorderPanel,
            LinePanel
        },
    }
</script>

<style>
</style>