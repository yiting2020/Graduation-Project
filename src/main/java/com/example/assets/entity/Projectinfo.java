package com.example.assets.entity;

import lombok.Data;

import java.util.Date;

@Data
public class Projectinfo {
    private Integer pid;
    /*private String searchName;  //搜索字段*/
    private String projectname; //项目名称
    private String projecttype; //项目类型
    private String buildnature; //建设性质
    private String buildplace; //建设地点
    private String buildaddress; //建设详细地址
    private String industry; //所属行业
    private String investmenttotal; //总投资额
    private Date nstarttime; //拟开工
    private Date nendtime; //拟竣工
    private String mainbuildscale; //建设规模
    private String mainbuildcontent; //建设内容
    private String projectaffiliation; //隶属
    private String directdept1; //监管责任单位
    private String directcontactorname; //监管责任人
    private String directcontactorphone; //监管责任人电话
    private String proorg; //项目（法人）单位
    private String moneyyear; //投资计划年度
    private String prousername; //项目负责人
    private String prouserphone; //负责人电话
    private String procontactorname; //项目联系人
    private String procontactorphone; //联系人电话
    private String projectstatus;//项目状态

}
