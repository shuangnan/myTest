<template>
	<div class="emergency-resources-container">
		<div class="resource-kind-tab">
			<div
				v-for="(item, index) in emergencyResourceItems"
				:key="index"
				class="kind-tab"
				@click="handleItemChange(item)"
				:class="{
					selected: currentSelectedItem === item.id
				}"
			>
				<div>{{ item.name }} ({{ item.count }})</div>
			</div>
		</div>
		<div class="resource-table-container">
			<el-table size="mini" :data="currentTableData" height="680px" fit>
				<el-table-column
					v-for="(col, index) in currentTableCols"
					:key="index"
					align="center"
					:prop="col.key"
					:label="col.text"
					:formatter="col.formatter || (function(row, col, val, index) {return val === '' ? '/' : val})"
				></el-table-column>
			</el-table>
		</div>
		<div class="export-ops-container">
			<el-button
				type="primary"
				size="mini"
				style="width: 100%"
				@click="handleTablesExport"
				>导出</el-button
			>
		</div>
	</div>
</template>

<script>
	import XLSX from 'xlsx-style';
	import XLSXU from 'xlsx'
	export default {
		name: "emergencySources",
		data() {
			return {
				currentSelectedItem: "",
				currentTableData: [],
				currentTableCols: []
			};
		},
		mounted() {
			if (this.emergencyResourceItems.length !== 0) {
				this.handleItemChange(this.emergencyResourceItems[0]);
			}
		},
		computed: {
			/**
			 * 应急资源数据
			 * @returns {Object}
			 */
			emergencySource() {
				return this.$store.state.earthquake.emergencySource;
			},
			/**
			 * 可查询应急资源种类
			 * @returns {Array}
			 */
			emergencyResourceItems() {
				let items = [];
				for (let key in this.emergencySource) {
					items.push({
						id: key,
						name: this.emergencySource[key].name,
						count: this.emergencySource[key].source.length
					});
				}
				return items;
			}
		},
		methods: {
			/**
			 * 切换查询应急资源
			 */
			handleItemChange(item) {
				this.currentSelectedItem = item.id;
				this.currentTableData = [];
				this.currentTableCols = [];
				this.$nextTick(() => {
					this.currentTableData = this.emergencySource[item.id].source;
					this.currentTableCols = this.emergencySource[item.id].desc;
					console.log(this.currentTableCols)
				});
			},
			/**
			 * 导出应急资源统计表格
			 */
			handleTablesExport() {
				let sheets = [];
				for (let key in this.emergencySource) {
					let data = this.emergencySource[key].source;
					let desc = this.emergencySource[key].desc;
					let sheetData = data.map(d => {
						let ob = {};
						desc.map(de => {
							ob[de.text] = de.formatter === undefined ? (d[de.key] === '' ? '/' : d[de.key]) : (de.formatter(false, false, d[de.key], false));
						});
						return ob;
					});
          console.log('SHEETDATA', sheetData)
					let sheet = XLSXU.utils.json_to_sheet(sheetData)
          
          // 单元格固定宽度
					let colWidthArr = desc.map((d) => {
						return {
							wch: 30
						}
					})
					sheet['!cols'] = colWidthArr
          
          // 单元格居中
					Object.keys(sheet).forEach((key) => {
						if (key.indexOf('!') < 0) {
							sheet[key].s = {
								alignment: {
									vertical: 'center',
									horizontal: 'center',
									wrapText: true
								},
								font: {
									bold: /^[A-Z]1$/g.test(key)
								}
							}
						}
					})
     
					console.log(sheet)
					sheets.push(sheet);
				}
        
        // 导出 Excel 文件
				let excelFile = XLSXU.utils.book_new();
        
        // 将工作表添加到工作簿
				sheets.map((sheet, index) => {
					XLSXU.utils.book_append_sheet(
						excelFile,
						sheet,
						this.emergencyResourceItems[index].name
					);
				});
        
        // Excel 工作簿转换为 Blob
        let file = this.excelToBlob(excelFile);
        
        // 利用 a 标签触发下载
				this.manualDownload(file, "应急资源统计.xlsx");
			},
			/**
			 * XLSX生成工作簿转换为Blob
			 */
			excelToBlob(excel) {
				let wopts = {
					bookType: "xlsx",
					bookSST: false,
					type: "binary"
				};
				let wbout = XLSX.write(excel, wopts);
				let blob = new Blob([this.s2ab(wbout)], {
					type: "application/octet-stream"
				});
				return blob;
			},
			/**
			 * Excel工作簿二进制转换为Uint8Array
			 */
			s2ab(s) {
				let buf = new ArrayBuffer(s.length);
				let view = new Uint8Array(buf);
				for (let i = 0; i != s.length; ++i) {
					view[i] = s.charCodeAt(i) & 0xff;
				}
				return buf;
			},
			/**
			 * 手动触发文件下载
			 */
			manualDownload(blob, filename) {
				if (typeof blob === "object" && blob instanceof Blob) {
					blob = URL.createObjectURL(blob);
				}
				let aLink = document.createElement("a");
				aLink.href = blob;
				aLink.download = filename || "";
				let event = new MouseEvent("click");
				aLink.dispatchEvent(event);
				URL.revokeObjectURL(blob);
			}
		}
	};
</script>

<style scoped>
	.emergency-resources-container {
		width: 100%;
		height: 800px;
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		justify-content: center;
	}

	.resource-kind-tab {
		width: 100%;
		height: 50px;
		padding: 10px;
		display: flex;
		flex-direction: row;
		align-items: center;
		align-content: center;
		justify-content: flex-start;
	}

	.resource-kind-tab .kind-tab {
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		background: #4d5f83;
		display: flex;
		align-content: center;
		align-items: center;
		justify-content: center;
		min-width: 100px;
		max-width: 300px;
		height: 40px;
		cursor: pointer;
		padding-left: 10px;
		padding-right: 10px;
	}

	.kind-tab.selected {
		background: #5ea2e9 !important;
	}

	.kind-tab.selected > div {
		font-weight: bold !important;
	}

	.resource-kind-tab .kind-tab > div {
		color: white;
		font-size: 18px;
	}

	.resource-table-container {
		width: 100%;
		height: calc(800px - 100px);
		padding: 10px;
	}

	.resource-table-container >>> .el-table tr.el-table__row.expanded,
	.resource-table-container >>> .el-table__body tr.current-row > td {
		background: #4d5f83 !important;
	}

	.resource-table-container
		>>> .el-table--striped
		.el-table__body
		tr.el-table__row--striped.current-row
		td {
		background: #4d5f83 !important;
	}

	.resource-table-container
		>>> .el-table--enable-row-hover
		.el-table__body
		tr:hover
		> td {
		background: #4d5f83 !important;
	}

	.export-ops-container {
		width: 100%;
		padding: 10px;
	}
</style>
