/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-11-18 17:17:35
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-11-21 17:47:15
 * @FilePath: \JFLCMS_MAP\src\components\map\js\config_ga.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  wu_pcs: {
    wu_pcs_dfpcs: false, // 全部地方派出所
    wu_pcs_tlpcs: {
      ALL: true, // 全部铁路派出所
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
    // 铁路派出所
    wu_pcs_jjing: {
      ALL: false,
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
    wu_pcs_jjiang: {
      ALL: false,
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
    wu_pcs_jzang: {
      ALL: false,
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
    wu_pcs_kysn: {
      ALL: false,
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
    wu_pcs_kya: {
      ALL: false,
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
    wu_pcs_kyb: {
      ALL: false,
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
    wu_pcs_kyc: {
      ALL: false,
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
    wu_pcs_linea: {
      ALL: false,
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
    wu_pcs_lineb: {
      ALL: false,
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
    wu_pcs_linec: {
      ALL: false,
      CD: false,
      CQ: false,
      XC: false,
      GY: false
    },
  },
  wu_yxjg: {
    // 沿线机构
    // wu_yxjg_tlpcs: true,
    // wu_yxjg_dfpcs: false
    wu_yxjg_tlnb: false,
    wu_yxjg_town: false,
    wu_yxjg_hospital: false,
    wu_yxjg_school: false,
    wu_yxjg_danger: false,
    wu_yxjg_special: false,
  },
  wu_sb: {
    wu_sb_complex: false, // 重点复杂区段
    wu_sb_bridge: false,
    wu_sb_tunnel: false, // 隧道
    wu_sb_culvert: false, // 涵洞
    wu_sb_bds: false, // 变电所
    wu_sb_pds: false, // 配电所
    wu_sb_at: false, // AT所
    wu_sb_sxjk: false, // 三线接口
    wu_sb_gktq: false, // 公跨铁桥
    wu_sb_sktq: false, // 上跨铁桥
  },
  person_wffz: { // 违法犯罪人员
    person_wffz_xs: false, // 刑事犯罪嫌疑人
    person_wffz_xz: false, // 行政违法人员
    person_wffz_net: false, // 网上在逃人员
  },
  person_zdzw: { // 重点掌握人员
    person_zdzw_dsc: false, // 大牲畜养殖户
    person_zdzw_fp: false, // 废品收购人员
    person_zdzw_wc: false, // 五残人员
    person_zdzw_wxp: false, // 危险品从业人员
    person_zdzw_other: false, // 其他重点人员
  },
  person_tlnb: { // 铁路内部人员
    person_tlnb_regular: false, // 正式职工
    person_tlnb_collect: false, // 大集体工
    person_tlnb_fj: false, // 辅警
    person_tlnb_ba: false, // 保安
    person_tlnb_aj: false, // 安检
    person_tlnb_bj: false, // 保洁
    person_tlnb_xfdy: false, // 巡防队员
    person_tlnb_gcsg: false, // 工程施工人员
    person_tlnb_zxby: false, // 装卸搬运人员
    person_tlnb_shyy: false, // 商户营业人员
    person_tlnb_other: false, // 其他务工人员

  },
  shi_aj: { // 案件类
    shi_aj_xzjy: false, // 行政简易程序案件
    shi_aj_xzyb: false, // 行政一般程序案件
    shi_aj_xs: false, // 刑事案件
    shi_aj_wx: false, // 危行案件
    shi_aj_other: false, // 其他案件
  },
  shi_sj: { // 事件类
    shi_sj_qt: false, // 群体事件
    shi_sj_tljt: false, // 铁路交通事故
    shi_sj_fire: false, // 火灾事故
    shi_sj_zdzr: false, // 重大自然灾害事故
    shi_sj_other: false, // 其他事件
  },
  shi_yh: { // 隐患类
    shi_yh_za: false, // 治安隐患
    shi_yh_nb: false, // 内保隐患
    shi_yh_xf: false, // 消防隐患
    shi_yh_fk: false, // 反恐隐患

  }
}