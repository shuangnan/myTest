<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	import C from './assets/com.js'
	export default {
		name: 'app',
		data: function() {
			return {
				isD: process.env.NODE_ENV === 'development'
			}
		},
		components: {},
		created: function() {
			//在这将整个系统公用的数据存入store
			// const params = C.getUrlParam(); //获取url参数
			//在这将整个系统公用的数据存入store
			// this.$store.commit("updateParams", params);
		}
	}
</script>
<style src="./assets/css/ELMTblueBox.css"></style>
<style>
	html,
	body {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		font-size: 14px;
	}

	* {
		box-sizing: border-box;
	}

	::-webkit-scrollbar {
		/*滚动条两端块*/
		width: 5px;
		height: 5px;
		border-radius: 0px;
		background-color: #f5f5f5;
	}

	::-webkit-scrollbar-track {
		/*滚动条滑槽*/
		border-radius: 0px;
		background-color: #f5f5f5;
		-webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, .3);
	}

	::-webkit-scrollbar-thumb {
		/*滚动条滑动条*/
		border-radius: 8px;
		background-color: silver;
		-webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, .3);
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: silver;
	}

	::-webkit-scrollbar-thumb:active {
		background-color: gray
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		width: 100%;
		height: 100%;
	}

	#oes_make {
		display: none;
	}

	.el-main {
		line-height: unset !important;
		text-align: unset !important;
	}

	.el-notification.right,
	.el-notification.left {
		width: 330px;
	}

	/* dialog 样式更改 */
	.el-dialog__header {
		padding: 10px !important;
	}

	.el-dialog__header>.el-dialog__headerbtn {
		top: 10px;
		right: 10px;
	}

	.el-dialog__body {
		padding: 0 !important;
		border-top: 1px solid #ddd;
		border-bottom: 1px solid #ddd;
	}

	.el-dialog__footer {
		padding: 10px !important;
	}

	/* 整个系统按钮字体加粗 ,.el-button--mini, .el-button--small */
	.big-btn .el-button {
		font-weight: bold !important;
		font-size: 14px !important;
	}

	.big-btn .el-button--small {
		padding: 8px 15px !important;
		vertical-align: middle;
	}

	/* 客运一体化-公用样式 */
	.kyyth-group-tit {
		text-align: center;
		color: white;
		font-weight: bold;
		background: #75A3DF;
		font-size: 15px;
		height: 40px;
		line-height: 40px;
	}

	/* 大屏---输入框---蓝色调 */
	.blue-control .el-input__inner,
	.blue-control .el-input.is-disabled .el-input__inner,
	.blue-control .el-textarea__inner {
		background-color: transparent;
		border-color: #5D6375;
		color: #FAFAFA;
	}

	/* 大屏---下拉框弹出层容器---蓝色调 */
	.blue-control.el-select-dropdown {
		background-color: rgba(52, 65, 87, .9);
		border: none;
	}

	.blue-control .el-select-dropdown__item {
		color: #fff;
		/* font: normal 14px microsoft yahei; */
	}

	.blue-control .el-select-dropdown__item.selected,
	.blue-control .el-select-dropdown__item.hover,
	.blue-control .el-select-dropdown__item:hover {
		background-color: unset;
		color: #60aff6;
	}

	.blue-control.el-popper[x-placement^=bottom] .popper__arrow,
	.blue-control.el-popper[x-placement^=bottom] .popper__arrow::after {
		border-bottom-color: #374568;
	}

	/* 大屏---菜单容器---蓝色调 */
	.blue-control.el-menu {
		background-color: transparent;
	}

	.blue-control>.el-submenu {
		width: 100%;
	}

	.blue-control.el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
		color: white;
		padding: 0 10px;
	}

	.blue-control.el-menu--horizontal>.el-submenu .el-submenu__title {
		height: 30px;
		line-height: 30px;
	}

	.blue-control.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
	.blue-control.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
	.blue-control.el-menu--horizontal>.el-submenu .el-submenu__title:hover {
		background-color: transparent;
		color: white;
	}

	.blue-control .el-menu,
	.blue-control.el-menu--horizontal .el-menu .el-menu-item {
		background-color: rgba(52, 65, 87, .9);
		color: #fff;
	}

	.blue-control.el-menu--horizontal .el-menu .el-menu-item.is-active,
	.blue-control.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
		color: #60aff6;
	}

	/* dialog */
	.blue-dialog .el-dialog__header {
		background: #4D5F83;
	}

	.blue-dialog .el-dialog__title {
		color: #FAFAFA;
	}

	.blue-dialog .el-dialog__body,
	.blue-dialog .el-dialog__footer {
		background: #272F46;
		border: none;
	}

	/* dialog 底部按钮 */
	.blue-dialog .el-button.is-plain {
		background: transparent;
		color: white;
	}

	.blue-dialog .el-button.is-plain:hover {
		background: transparent;
	}

	
	/* ============= 表格 ==============*/
	.blue-table .el-table,
	.blue-table .el-table th,
	.blue-table .el-table tr,
	.blue-table .el-table__footer-wrapper tbody td,
	.blue-table .el-table__header-wrapper tbody td,
	.blue-table .el-table__fixed-footer-wrapper tbody td{
		background: #2C324C;
	}
	.blue-table .el-table__footer-wrapper tbody td,
	.blue-table .el-table__header-wrapper tbody td,
	.blue-table .el-table__fixed-footer-wrapper tbody td{
		color: white;
	}

	.blue-table .el-table.el-expand-table,
	.blue-table .el-table.el-expand-table th,
	.blue-table .el-table.el-expand-table tr {
		background: #394263;
	}

	.blue-table .el-table {
		color: white;
	}

	/* 边框 */

	.blue-table .el-table::before,
	.blue-table .el-table__fixed-right::before,
	.blue-table .el-table__fixed::before {
		background-color: transparent;
	}

	.blue-table .el-table--border::after,
	.blue-table .el-table--group::after {
		background-color: #5D6375;
	}

	.blue-table .el-table--border,
	.blue-table .el-table--group {
		border-color: #5D6375;
	}

	/* 表格单元格边框 */
	.blue-table .el-table td,
	.blue-table .el-table th.is-leaf {
		border-bottom: 1px solid #5D6375;
	}
  
  .blue-table .el-table-filter {
    background-color: #2c324c;
  }

	.blue-table .el-table--border td,
	.blue-table .el-table--border th,
	.blue-table .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
		border-right: 1px solid #5D6375;
	}

	/* 表头颜色 */
	.blue-table .el-table thead {
		color: #62B1EC;
	}

	/* 当前行、展开行 */
	.blue-table .el-table tr.el-table__row.expanded,
	.blue-table .el-table__body tr.current-row>td {
		background: #7DACF0;
	}

	.blue-table .el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
		background-color: #7DACF0;
	}

	/* 展开行按钮 */
	.blue-table .el-table__expand-icon {
		color: white;
	}

	/* 展开行-单元格 */
	.blue-table .el-table,
	.blue-table .el-table__expanded-cell {
		background-color: #2C324C;
	}

	.blue-table .el-table__expanded-cell[class*=cell] {
		padding: 0;
	}

	.blue-table .el-table--striped .el-table__body tr.el-table__row--striped td {
		background: #3E476C;
	}

	/* 表格行鼠标移动 */
	.blue-table .el-table__body tr.hover-row.current-row>td,
	.blue-table .el-table__body tr.hover-row.el-table__row--striped.current-row>td,
	.blue-table .el-table__body tr.hover-row.el-table__row--striped>td,
	.blue-table .el-table__body tr.hover-row>td,
	.blue-table .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #7DACF0;
	}

	.blue-table .el-table .el-table__row.hover-row .el-button--text {
		color: white;
	}
/* ============= 输入控件 =============*/
	.blue-input .el-input__inner,
	.blue-input .el-input.is-disabled .el-input__inner,
	.blue-input .el-textarea__inner {
		background-color: transparent;
		border-color: #5D6375;
		color: #FAFAFA;
	}

	.blue-input .el-input__inner[type=number] {
		padding-right: 0px;
	}

	.blue-input .el-input-group__append,
	.blue-input .el-input-group__prepend {
		border-color: #5D6375;
		background: transparent;
	}

	/* 移动端的样式---通知 */
	.mobile-notify {
		width: 100% !important;
		right: 0px !important;
		top: 0px !important;
	}

	/* 移动端的样式---消息 */
	.mobile-message {
		min-width: 100px !important;
		width: 100% !important;
		top: 0px !important;
		right: 0px !important;
	}
	
	/* 发光字体 */
	.shadow-txt {
		color: #d0c5e3;
		text-shadow: 0 0 10px #0000ff, 0 0 20px #fff;
	}

  @font-face {
    font-family: 'LCD';
    src: url("/static/DigitalDisplay.woff?w0ybrd") format('woff');
  }

  .customPPopper {
    background: #19223C !important;
  }

	.railtrains-popper-table >>> .el-table th,
	.el-table tr,
	cell {
		background: #19223c !important;
		color: white;
		font-weight: bold;
		font-size: 14px;
		padding: 0;
	}

	.railtrains-popper-table >>> .el-table__row {
		color: white;
		font-weight: bold;
		font-size: 12px;
		padding: 0 !important;
		background: #19223c !important;
	}

	.railtrains-popper-table >>> .el-table .cell {
		padding-right: 0 !important;
		padding-left: 0 !important;
	}

	.railtrains-popper-table >>> .el-table .cell,
	.el-table--border td:first-child .cell,
	.el-table--border th:first-child .cell {
		padding: 0 !important;
	}

	.railtrains-popper-table >>> .el-table__empty-block {
		color: white;
		font-weight: bold;
		font-size: 12px;
		padding: 0 !important;
		background: #19223c !important;
	}

	.railtrains-popper-table
		>>> .el-table--enable-row-hover
		.el-table__body
		tr:hover
		> td {
		/*box-shadow: 0 0 5px #ee0a24 inset;*/
		background: rgba(238, 10, 36, 0.22) !important;
	}

	.railtrains-popper-table >>> .el-table__body tr.current-row > td {
		background: rgba(238, 10, 36, 0.22) !important;
	}
</style>
