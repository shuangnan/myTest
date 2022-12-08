export default {
    chinaConsumptionLevel: [["北京市", 116.407283, 39.904557, 22023, 24982, 27760, 30350, 33337], ["天津市", 117.215268, 39.120963, 15200, 17852, 20624, 22984, 26261], ["上海市", 121.47398, 31.230075, 26582, 32271, 35439, 36893, 39223], ["重庆市", 106.551417, 29.563228, 8494, 9723, 11832, 13655, 15270], ["黑龙江省", 126.661901, 45.742659, 7922, 9121, 10634, 11601, 12978], ["吉林省", 125.326104, 43.89604, 8538, 9241, 10811, 12276, 13676], ["辽宁省", 123.43707, 41.835528, 10906, 13016, 15635, 17999, 20156], ["山西省", 112.562359, 37.874938, 6854, 8447, 9746, 10829, 12078], ["河北省", 114.469767, 38.036032, 7193, 8057, 9551, 10749, 11557], ["陕西省", 108.953051, 34.267153, 7154, 8474, 10053, 11852, 13206], ["甘肃省", 103.826321, 36.059405, 5509, 6234, 7493, 8542, 9616], ["四川省", 104.075463, 30.651149, 6863, 8182, 9903, 11280, 12485], ["贵州省", 106.707603, 26.597997, 5456, 6218, 7389, 8372, 9541], ["云南省", 102.709129, 25.046619, 5976, 6811, 8278, 9782, 11224], ["海南省", 109.691225, 19.047108, 6695, 7553, 9238, 10634, 11712], ["浙江省", 120.154526, 30.267173, 15867, 18274, 21346, 22845, 24771], ["山东省", 117.020411, 36.669569, 10494, 11606, 13524, 15095, 16728], ["江苏省", 118.763288, 32.061173, 11993, 14035, 17167, 19452, 23585], ["安徽省", 117.285057, 31.861554, 6829, 8237, 10055, 10978, 11618], ["福建省", 119.296405, 26.100023, 11336, 13187, 14958, 16144, 17115], ["江西省", 115.908871, 28.674211, 6212, 7989, 9523, 10573, 11910], ["河南省", 113.687284, 34.767907, 6607, 7837, 9171, 10380, 11782], ["湖北省", 114.341949, 30.545553, 7791, 8977, 10873, 12283, 13912], ["湖南省", 112.983553, 28.116295, 7929, 8922, 10547, 11740, 12920], ["广东省", 113.265246, 23.130964, 15243, 17211, 19578, 21823, 23739], ["青海省", 101.780064, 36.620995, 6501, 7326, 8744, 10289, 12070], ["西藏自治区", 91.117774, 29.647017, 3985, 4469, 4730, 5340, 6275], ["广西壮族自治区", 108.327509, 22.816721, 6968, 7920, 9181, 10519, 11710], ["内蒙古自治区", 111.765996, 40.817419, 9460, 10925, 13264, 15196, 17168], ["宁夏回族自治区", 106.258639, 38.471179, 7918, 8992, 10937, 12120, 13537], ["新疆维吾尔自治区", 87.626951, 43.793217, 5945, 7400, 8895, 10675, 11401]],
    themeLayer: null,
    features: [],
    chartsSettingForBarAddBar3DCommon: null,
    chartsSettingForPieOrRing: null,
    themeLayerOptions: null,
    initFeaterDatasAddStyles($this) {
        //创建附着要素
        for (var i = 0, len = this.chinaConsumptionLevel.length; i < len; i++) {
            // 省居民消费水平（单位：元）信息
            var provinceInfo = this.chinaConsumptionLevel[i];
            var geo = L.point([provinceInfo[1], provinceInfo[2]]);
            var attrs = {};
            attrs.NAME = provinceInfo[0];
            attrs.CON2009 = provinceInfo[3];
            attrs.CON2010 = provinceInfo[4];
            attrs.CON2011 = provinceInfo[5];
            attrs.CON2012 = provinceInfo[6];
            attrs.CON2013 = provinceInfo[7];
            var fea = L.supermap.themeFeature(geo, attrs);
            this.features.push(fea);
        }

        //Bar add Bar3D chartsSetting
        this.chartsSettingForBarAddBar3DCommon = {
            width: 260,
            height: 120,
            codomain: [0, 40000],
            xShapeBlank: [15, 15, 15],
            axisYTick: 4,
            axisYLabels: ["4万", "3万", "2万", "1万", "0"],
            axisXLabels: ["09年", "10年", "11年", "12年", "13年"],
            backgroundRadius: [5, 5, 5, 5],
            backgroundStyle: {
                fillColor: "#d1eeee",
                shadowBlur: 12,
                shadowColor: "#d1eeee"
            }
        }

        //Pie add Ring chartsSetting
        this.chartsSettingForPieOrRing = {
            width: 240,
            height: 100,
            codomain: [0, 40000],       // 允许图表展示的值域范围，此范围外的数据将不制作图表
            sectorStyle: {fillOpacity: 0.8},      // 柱状图中柱条的（表示字段值的图形）样式
            sectorStyleByFields: [
                {fillColor: "#FFB980"},
                {fillColor: "#5AB1EF"},
                {fillColor: "#B6A2DE"},
                {fillColor: "#2EC7C9"},
                {fillColor: "#D87A80"}],
            sectorHoverStyle: {fillOpacity: 1},
            xShapeBlank: [10, 10, 10],      // 水平方向上的空白间距参数
            axisYLabels: ["4万", "3万", "2万", "1万", "0"],         // y 轴标签内容
            axisXLabels: ["09年", "10年", "11年", "12年", "13年"],         // x 轴标签内容
            backgroundStyle: {fillColor: "#CCE8CF"},        // 背景样式
            backgroundRadius: [5, 5, 5, 5],        // 背景框圆角参数
        };

        //设置graphThemeLayer option参数
        this.themeLayerOptions = {
            map: $this.map,
            isOverLay: true,
            attributions: " ",
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            opacity: 0.9,
            chartsSetting: {},
        };
    },
    createRingThemeLayer($this) {
        this.chartsSettingForPieOrRing.innerRingRadius = 20;
        this.themeLayerOptions.chartsSetting = this.chartsSettingForPieOrRing;
        this.themeLayer = L.supermap.graphThemeLayer("RingLayer", "Ring", this.themeLayerOptions);
        this.themeLayer.addFeatures(this.features);
        $this.map.addLayer(this.themeLayer);
        // this.themeLayer.on('mousemove', showInfoWin);
        // this.themeLayer.on("mouseout", closeInfoWin);
    },
    createBarThemeLayer($this) {
        var chartsSettingForBar = this.chartsSettingForBarAddBar3DCommon;
        chartsSettingForBar.barStyle = {fillOpacity: 0.7};      // 柱状图中柱条的（表示字段值的图形）样式
        chartsSettingForBar.barHoverStyle = {fillOpacity: 1};      //  柱条 hover 样式
        //阴影样式
        chartsSettingForBar.barShadowStyle = {
            shadowBlur: 8,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            shadowColor: "rgba(100,100,100,0.8)"
        };
        chartsSettingForBar.barLinearGradient = [
            ["#00FF00", "#00CD00"],
            ["#00CCFF", "#5E87A2"],
            ["#00FF66", "#669985"],
            ["#CCFF00", "#94A25E"],
            ["#FF9900", "#A2945E"]];

        this.themeLayerOptions.chartsSetting = chartsSettingForBar;
        this.themeLayer = L.supermap.graphThemeLayer("BarLayer", "Bar", this.themeLayerOptions);//.addTo(map)
        this.themeLayer.addFeatures(this.features);
        $this.map.addLayer(this.themeLayer);
        // themeLayer.on('mousemove', showInfoWin);
        // themeLayer.on("mouseout", closeInfoWin);
    }
}