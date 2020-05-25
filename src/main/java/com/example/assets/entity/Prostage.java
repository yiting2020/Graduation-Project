package com.example.assets.entity;

import lombok.Data;

import java.util.Date;

@Data
public class Prostage {
    private Integer pid;
    private String projectname; //项目名称
    private String projectstatus;//项目状态
    private String proid;
    private String proname;
    private String prostatus;//前期事项填写状态
    private String pioland;//用地
    private Date pdland;
    private String pifland;
    private String pifnland;
    private String psland;
    private String pioaddress;//选址
    private Date pdaddress;
    private String pifaddress;
    private String pifnaddress;
    private String psaddress;
    private String pioenv;//环评
    private Date pdenv;
    private String pifenv;
    private String pifnenv;
    private String psenv;
    private String piosave;//节能
    private Date pdsave;
    private String pifsave;
    private String pifnsave;
    private String pssave;
}
