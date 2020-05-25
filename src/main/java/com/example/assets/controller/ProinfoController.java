package com.example.assets.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.assets.entity.Proinfo;
import com.example.assets.entity.Prostage;
import com.example.assets.mapper.ProinfoMapper;
import com.example.assets.mapper.ProstageMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ProinfoController {

    @Autowired
    private ProinfoMapper proinfoMapper;
    @Autowired
    private ProstageMapper prostageMapper;

    //**********************************************我是分割线**********************************************************
    //********************************************行业主管部门部分****************************************************

    //前期事项首页


    /*@PostMapping("/hangye/index-hy")
    public String index_hy(){
        return "hangye/index-hy";
    }*/


    //前期工作事项列表
    @GetMapping("/hangye/gz-list")
    public String gz_listPage(@RequestParam(value = "pageNum",
                                            defaultValue = "1") int pageNum,
                              @RequestParam(value = "pageSize",
                                            defaultValue = "12") int pageSize,
                              @ModelAttribute("proinfo") Proinfo proinfo ,
                              @ModelAttribute("prostage") Prostage prostage ,
                              Model model){
        LambdaQueryWrapper<Prostage> lambdap = Wrappers.<Prostage>lambdaQuery();
        Page<Prostage> pagew = new Page<Prostage>(pageNum,pageSize);
        IPage<Prostage> iPagew = proinfoMapper.selectProstagePage(pagew,lambdap);
        List<Prostage> lists = iPagew.getRecords();
        model.addAttribute("lists",lists);
        model.addAttribute("iPagew",iPagew);
        return "hangye/gz-list";
    }

    @PostMapping("/hangye/gz-list")
    public String gz_list(@ModelAttribute("prostage") Prostage prostage ,@RequestBody List<Integer> id_list, Model model){
//        for (int i=0;i<id_list.size();i++){
//            UpdateWrapper<Prostage> updated = new UpdateWrapper<Prostage>();
//            updated.eq("proid",id_list.get(i));
//            Prostage prost = new Prostage();
//            prost.setProstatus("已完成");
//            prostageMapper.update(prost,updated);
//        }
        return "hangye/gz-list";
    }

    @PostMapping("/hangye/gz-fix")
    public String gz_fix(){
        return "hangye/gz-fix";
    }
    //前期工作事项详情
    @GetMapping("/hangye/gz-page")
    public String gz_pagePage(@RequestParam("proid") Integer proid,
                              @ModelAttribute("proInfo") Proinfo proinfo ,
                              Model model){
        LambdaQueryWrapper<Proinfo> lambdapage = Wrappers.<Proinfo>lambdaQuery();
        lambdapage.eq(Proinfo::getProid,proid);
        Proinfo proInfo = proinfoMapper.selectOne(lambdapage);
        model.addAttribute("proInfo",proInfo);
        return "hangye/gz-page";
    }
    //前期工作事项填报
    @PostMapping("/hangye/gz-page")
    public String gz_page(@RequestParam("proid") Integer proid,
                          @ModelAttribute("proInfo") Proinfo proinfo , Model model){
        model.getAttribute("proInfo");
        UpdateWrapper<Proinfo> updatep = new UpdateWrapper<Proinfo>();
        updatep.eq("proid",proid);
        proinfo.setProstatus("已填");
        proinfoMapper.update(proinfo,updatep);
        return "redirect:/hangye/gz-list";
    }
    //已完成前期事项
    @GetMapping("/hangye/gz-over")
    public String gz_overPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                              @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                              @ModelAttribute("prostage") Prostage prostage ,
                              @ModelAttribute("proinfo") Proinfo proinfo ,Model model){
        LambdaQueryWrapper<Prostage> lambdaover = Wrappers.<Prostage>lambdaQuery();
        Page<Prostage> pagew = new Page<Prostage>(pageNum,pageSize);
        IPage<Prostage> iPagew = proinfoMapper.selectProstagePageo(pagew,lambdaover);
        List<Prostage> lists = iPagew.getRecords();
        model.addAttribute("lists",lists);
        model.addAttribute("iPagew",iPagew);
        return "hangye/gz-over";
    }
    //前期工作事项详情展示
    @GetMapping("/hangye/gz-fix")
    public String gz_fixPage(@RequestParam("proid") Integer proid,
                             @ModelAttribute("proInfo") Proinfo proinfo , Model model){
        LambdaQueryWrapper<Proinfo> lambdapage = Wrappers.<Proinfo>lambdaQuery();
        lambdapage.eq(Proinfo::getProid,proid);
        Proinfo proInfo = proinfoMapper.selectOne(lambdapage);
        model.addAttribute("proInfo",proInfo);
        return "hangye/gz-fix";
    }
    //**********************************************我是分割线**********************************************************
    //********************************************发改部门前期事项部分****************************************************

    //前期工作事项结项
    @GetMapping("/fagai/qq-handle")
    public String qq_handlePage(@RequestParam(value = "pageNum",
                                                defaultValue = "1") int pageNum,
                                @RequestParam(value = "pageSize",
                                                defaultValue = "12") int pageSize,
                                @ModelAttribute("prostage") Prostage prostage,
                                Model model){
        LambdaQueryWrapper<Prostage> lambdaqo = Wrappers.<Prostage>lambdaQuery();
        Page<Prostage> pagew = new Page<Prostage>(pageNum,pageSize);
        IPage<Prostage> iPagew = proinfoMapper.selectProstagePagey(pagew,lambdaqo);
        List<Prostage> listo = iPagew.getRecords();
        model.addAttribute("listo",listo);
        model.addAttribute("iPagew",iPagew);
        return "fagai/qq-handle";
    }
    @PostMapping("/fagai/qq-handle")
    public String qq_handle(@RequestBody List<Integer> id_list,
                            @ModelAttribute("proInfo") Proinfo proinfo ,
                            @ModelAttribute("prostage") Prostage prostage){
        for (int i=0;i<id_list.size();i++){
            UpdateWrapper<Proinfo> updated = new UpdateWrapper<Proinfo>();
            updated.eq("pid",id_list.get(i));
            proinfo.setProstatus("结项");
            proinfoMapper.update(proinfo,updated);
        }
        return "redirect:/fagai/qq-over";
    }

    //结项
    @GetMapping("/fagai/qq-over")
    public String qq_overPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                              @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                              @ModelAttribute("proinfo") Proinfo proinfo,Model model){
        LambdaQueryWrapper<Prostage> lambdaqo = Wrappers.<Prostage>lambdaQuery();
//        lambdaqo.eq(Prostage::getProstatus,"结项");
        Page<Prostage> pagew = new Page<Prostage>(pageNum,pageSize);//展示页数及条数
        IPage<Prostage> iPagew = proinfoMapper.selectProstagePageo(pagew,lambdaqo);//进行查询
        List<Prostage> listo = iPagew.getRecords();
//        List<Prostage> listo = proinfoMapper.selectByStatuso(lambdaqo);
        model.addAttribute("listo",listo);
        model.addAttribute("iPagew",iPagew);
        return "fagai/qq-over";
    }

    @PostMapping("/fagai/qq-over")
    public String qq_over(@ModelAttribute("proinfo") Proinfo proinfo,Model model){

        return "fagai/qq-over";
    }

    //详情展示
    @GetMapping("/fagai/qq-infofix")
    public String qq_infofixPage(@RequestParam("proid") Integer proid,@ModelAttribute("proinfo") Proinfo proinfo,Model model){
        model.getAttribute("proinfo");
        LambdaQueryWrapper<Proinfo> lambdapf = Wrappers.<Proinfo>lambdaQuery();
        lambdapf.eq(Proinfo::getProid,proid);
        Proinfo proinfofix = proinfoMapper.selectOne(lambdapf);
        model.addAttribute("proinfofix",proinfofix);
        return "fagai/qq-infofix";
    }

}
