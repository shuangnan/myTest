/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-08-18 09:44:07
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-18 15:47:14
 * @FilePath: \JFLCMS_MAP\src\views\singleScreen\kyd\menu.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var data=[{
						fName: '首页',
						comm1: '',
						fUrl: 'home'
					},
					{
						fName: '任务监控',
						comm1: '',
						fUrl: 'zt'
					},
					{
						fName: '交路派班',
						comm1: '',
						fUrl: 'jlpb'
					},
					{
						fName: '数据统计',
						comm1: ''
					},
					{
						fName: '综合设置',
						children: [{
								fName: '调度命令',
								fUrl: ''
							},
							{
								fName: '备品保洁',
								fUrl: 'bpbj',
								link: 'https://10.192.34.79/ky3450/SOSE/kydms/distv/web/sjfx/index.html?UserEncode=3C068B78A80C4ED9A5C713E0971373D1&UserName=%E6%9D%8E%E7%BA%A2%E5%86%9B&UserPID=522227198703061610&idCard=522227198703061610&Oid=19B8C3534E3B5665E0539106C00A58FD&Oname=%E8%B4%B5%E9%98%B3%E5%AE%A2%E8%BF%90%E6%AE%B5&DepName=%E4%B9%98%E5%8A%A1%E7%A7%91'
							},
							{
								fName: '乘务日志',
								fUrl: 'cwrz'
							},
							{
								fName: '任务模板',
								fUrl: 'rwmb'
							}
						]
					},
					{
						fName: '地图',
						fUrl: 'indexMap'
					},
					{
						fName: '飞行图',
						fUrl: 'fly'
					}
				]
export default{
	data
}