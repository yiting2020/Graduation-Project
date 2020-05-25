package com.example.assets.entity;

import lombok.Data;

import java.util.Date;

@Data
public class Prodis {
    private Integer pid;
    private String projectname; //项目名称
    private String projectstatus;//项目状态
    private String directdept1;//项目监管单位
    private String buildplace;//建设地点
    private String investmenttotal;
    private Integer did;
    private String name;//调度填报人
    private String unit;//工作单位
    private String mobilephone;//手机
    private Date starttime;//实际开工时间
    private Date endtime;//实际竣工时间
    private String reason;//未开工原因
    private String zbtype;//招标形式
    private String buildunit;//建设单位
    private String reportnum;//任务期号
    private String reportname;//任务名称
    private String imageprogress;//形象进度
    private String buildcontent;//年度建设内容
    private String suggesions;//问题及建议
    private String directdept;//直接责任单位
    private String investplanadjust;//投资计划调整情况
    private String inspectname;//督察机构联系人
    private String inspectphone;//联系方式
    private String inspectname1;//发改部门联系人
    private String inspectphone1;//联系方式
    private String dispstatus;//填报情况

}
