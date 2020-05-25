<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2020/4/2
  Time: 21:44
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/map.css">
</head>
<body>
<div class="data">

    <div class="data-title">
        <div class="title-left fl"></div>
        <div class="title-center fl"></div>
        <div class="title-right fr"></div>
    </div>
    <div class="data-content">
        <div class="con-left fl">
            <div class="left-top">
                <div class="info">
                    <div class="info-title">实时统计</div>
                    <img src="img/bj-1.png" alt="" class="bj-1">
                    <img src="img/bj-2.png" alt="" class="bj-2">
                    <img src="img/bj-3.png" alt="" class="bj-3">
                    <img src="img/bj-4.png" alt="" class="bj-4">
                    <div class="info-main">
                        <div class="info-1">
                            <div class="info-img fl">
                                <img src="img/info-img-1.png" alt="">
                            </div>
                            <div class="info-text fl">
                                <p>项目总数(个)</p>
                                <p>12,457</p>
                            </div>
                        </div>
                        <div class="info-2">
                            <div class="info-img fl">
                                <img src="img/info-img-2.png" alt="">
                            </div>
                            <div class="info-text fl">
                                <p>项目总投资额(万元)</p>
                                <p>12,457</p>
                            </div>
                        </div>
                        <%--<div class="info-3">--%>
                            <%--<div class="info-img fl">--%>
                                <%--<img src="img/info-img-3.png" alt="">--%>
                            <%--</div>--%>
                            <%--<div class="info-text fl">--%>
                                <%--<p>今日活跃数(辆)</p>--%>
                                <%--<p>12,457</p>--%>
                            <%--</div>--%>
                        <%--</div>--%>
                        <div class="info-4">
                            <div class="info-img fl">
                                <img src="img/info-img-4.png" alt="">
                            </div>
                            <div class="info-text fl">
                                <p>项目问题总个数（个）</p>
                                <p>83</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="top-bottom">
                    <div class="title">行业主管部门分类</div>
                    <img src="img/bj-1.png" alt="" class="bj-1">
                    <img src="img/bj-2.png" alt="" class="bj-2">
                    <img src="img/bj-3.png" alt="" class="bj-3">
                    <img src="img/bj-4.png" alt="" class="bj-4">
                    <div id="echarts_1" class="charts"></div>
                </div>
            </div>
            <div class="left-bottom">
                <div class="title">项目分类</div>
                <img src="img/bj-1.png" alt="" class="bj-1">
                <img src="img/bj-2.png" alt="" class="bj-2">
                <img src="img/bj-3.png" alt="" class="bj-3">
                <img src="img/bj-4.png" alt="" class="bj-4">
                <div id="echarts_2" class="charts"></div>
            </div>
        </div>
        <div class="con-center fl">
            <%--<div class="map-num">--%>
                <%--<p>实时项目数（个）</p>--%>
                <%--<div class="num">--%>
                    <%--<span>1</span>--%>
                    <%--<span>,</span>--%>
                    <%--<span>2</span>--%>
                    <%--<span>3</span>--%>
                    <%--<span>4</span>--%>
                    <%--<span>,</span>--%>
                    <%--<span>5</span>--%>
                    <%--<span>6</span>--%>
                    <%--<span>7</span>--%>
                <%--</div>--%>
            <%--</div>--%>
            <div class="cen-top" id="map"></div>
            <div class="cen-bottom">
                <div class="title">网站被访问高峰时间</div>
                <img src="img/bj-1.png" alt="" class="bj-1">
                <img src="img/bj-2.png" alt="" class="bj-2">
                <img src="img/bj-3.png" alt="" class="bj-3">
                <img src="img/bj-4.png" alt="" class="bj-4">
                <div id="echarts_3" class="charts"></div>
            </div>
        </div>
        <div class="con-right fr">
            <div class="right-top">
                <div class="title">本月项目投资额TOP5</div>
                <img src="img/bj-1.png" alt="" class="bj-1">
                <img src="img/bj-2.png" alt="" class="bj-2">
                <img src="img/bj-3.png" alt="" class="bj-3">
                <img src="img/bj-4.png" alt="" class="bj-4">
                <div id="echarts_4" class="charts"></div>
            </div>
            <div class="right-center">
                <div class="title">项目类别TOP5</div>
                <img src="img/bj-1.png" alt="" class="bj-1">
                <img src="img/bj-2.png" alt="" class="bj-2">
                <img src="img/bj-3.png" alt="" class="bj-3">
                <img src="img/bj-4.png" alt="" class="bj-4">
                <div id="echarts_5" class="charts"></div>
            </div>
            <div class="right-bottom">
                <div class="title">项目所属部门TOP5</div>
                <img src="img/bj-1.png" alt="" class="bj-1">
                <img src="img/bj-2.png" alt="" class="bj-2">
                <img src="img/bj-3.png" alt="" class="bj-3">
                <img src="img/bj-4.png" alt="" class="bj-4">
                <div id="echarts_6" class="charts"></div>
            </div>
        </div>
    </div>
</div>

</body>
<script src="js/jquery-2.1.1.min.js"></script>
<script src="js/echarts.min.js"></script>
<script src="js/china.js"></script>
<script src="js/echarts.js"></script>
</html>