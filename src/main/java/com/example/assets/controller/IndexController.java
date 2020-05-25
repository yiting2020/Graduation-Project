package com.example.assets.controller;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.example.assets.entity.*;
import com.example.assets.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;


@Controller
public class IndexController {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ProjectinfoMapper projectinfoMapper;
    @Autowired
    private DispatchMapper dispatchMapper;
    @Autowired
    private ProinfoMapper proinfoMapper;
    @Autowired
    private QuesMapper quesMapper;

    //行业主管部门前期事项首页
    @GetMapping("/hangye/index-hy")
    public String index_hyPage(@ModelAttribute("proinfo") Proinfo proinfo ,
                               @ModelAttribute("projectinfo") Projectinfo projectinfo ,
                               @ModelAttribute("ques") Ques ques ,Model model){
        model.addAttribute("countsum",proinfoMapper.counsum());
        model.addAttribute("countweitian",proinfoMapper.countweitian());
        model.addAttribute("countquespro",quesMapper.countpro());
        model.addAttribute("countyichuli",quesMapper.countpro());
        return "hangye/index-hy";
    }
    /*@GetMapping("/index-hy")
    public String index_hyPage(@ModelAttribute("proinfo") Proinfo proinfo, Model model) {
        model.addAttribute("countsum",proinfoMapper.counsum());
        model.addAttribute("countweitian",proinfoMapper.countweitian());

        model.addAttribute("countquespro",quesMapper.countpro());
        model.addAttribute("countyichuli",quesMapper.countpro());

        return "hangye/index-hy";
    }*/

    @PostMapping("/index-hy")
    public String index_hy() {
        return "hangye/index-hy";
    }


    //法人首页展示
    @GetMapping("/faren/index-fr")
    public String index_fr(@ModelAttribute("projectinfo") Projectinfo projectinfo, Model model,HttpSession session){
        model.addAttribute("countsum",dispatchMapper.countsum());
        model.addAttribute("projectsum",projectinfoMapper.countsum());//项目总数
        model.addAttribute("countxinxi",quesMapper.countinfo());//备案数
        model.addAttribute("countdiaodu",quesMapper.countdis());//核准数
        model.addAttribute("projectinfo",projectinfo);
        String username = (String) session.getAttribute("login");
        return "faren/index-fr";
    }

    /*@GetMapping("/index-fr")
    public String index_fr(@ModelAttribute("projectinfo") Projectinfo projectinfo, Model model, HttpSession session) {
//        model.addAttribute("projectinfo", projectinfo);
//        String username = (String) session.getAttribute("login");
        model.addAttribute("countsum",proinfoMapper.counsum());
        model.addAttribute("projectsum",projectinfoMapper.countsum());//项目总数
        model.addAttribute("countxinxi",quesMapper.countinfo());//备案数
        model.addAttribute("countdiaodu",quesMapper.countdis());//核准数
        return "faren/index-fr";
    }*/

    @PostMapping("/index-fr")
    public String index_fr() {
        return "faren/index-fr";
    }

    @RequestMapping(value="/frindexprostatus")
    @ResponseBody
    public String frindexprostatus() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<projects.size();j++){
            if(!list1.contains(projects.get(j).getProjectstatus())){//从proinfo中取出prostatus的值
                list1.add(projects.get(j).getProjectstatus());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[7];
        String[] str ={"未报","已报","审核通过","审核失败","预备项目","当前年度","历史年度"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String projectstatus=str[m];
                value[m] = projectinfoMapper.countByprojectstatus(projectstatus);
                Change change = new Change(projectstatus, value[m]);
                list.add(k,change);
                k++;
            }else {
                String projectstatus=str[m];
                value[m]=0;
                Change change = new Change(projectstatus, value[m]);
                list.add(k,change);
                k++;
            }
        }
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }

    @RequestMapping(value="/frindexprobelong")
    @ResponseBody
    public String frindexprobelong() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<projects.size();j++){
            if(!list1.contains(projects.get(j).getProjectaffiliation())){//从proinfo中取出prostatus的值
                list1.add(projects.get(j).getProjectaffiliation());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[3];
        String[] str ={"中央项目","地方项目","企业项目"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String projectaffiliation=str[m];
                value[m] = projectinfoMapper.countByprojectaffiliation(projectaffiliation);
                Change change = new Change(projectaffiliation, value[m]);
                list.add(k,change);
                k++;
            }else {
                String projectaffiliation=str[m];
                value[m]=0;
                Change change = new Change(projectaffiliation, value[m]);
                list.add(k,change);
                k++;
            }
        }
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }

    //发改首页展示
    @GetMapping("/fagai/index-fg")
    public  String index_fgPage(Model model){
        model.addAttribute("projectsum", projectinfoMapper.countsum());//项目总数
        model.addAttribute("countdis", dispatchMapper.countsum());//项目总数
        model.addAttribute("countpro", proinfoMapper.counsum());//proinfo
        model.addAttribute("countques", quesMapper.countsum());//ques
        return "fagai/index-fg";
    }
    /*@GetMapping("/index-fg")
    public String index_fgPage(Model model) {

        model.addAttribute("projectsum", projectinfoMapper.countsum());//项目总数
        model.addAttribute("countdis", dispatchMapper.countsum());//项目总数
        model.addAttribute("countpro", proinfoMapper.counsum());//proinfo
        model.addAttribute("countques", quesMapper.countsum());//ques

        return "fagai/index-fg";
    }*/

    @PostMapping("/index-fg")
    public String index_fg() {
        return "fagai/index-fg";
    }

    //dispatchzbtype
    @RequestMapping(value = "/fgindexdiszbtype")
    @ResponseBody
    public String fgindexdiszbtype(){

        List<Integer> list = new ArrayList();//最终json格式

        LambdaQueryWrapper<Dispatch> lambdaq1 =  Wrappers.<Dispatch>lambdaQuery();
        lambdaq1.eq(Dispatch::getInvestplanadjust,"不调整").eq(Dispatch::getImageprogress,"工程类");
        int count1 = dispatchMapper.selectCount(lambdaq1);
        System.out.println("不调整工程类："+count1);
        list.add(count1);

        LambdaQueryWrapper<Dispatch> lambdaq2 =  Wrappers.<Dispatch>lambdaQuery();
        lambdaq2.eq(Dispatch::getInvestplanadjust,"准备调整").eq(Dispatch::getImageprogress,"工程类");
        int count2 = dispatchMapper.selectCount(lambdaq2);
        System.out.println("准备调整工程类："+count2);
        list.add(count2);

        LambdaQueryWrapper<Dispatch> lambdaq3 =  Wrappers.<Dispatch>lambdaQuery();
        lambdaq3.eq(Dispatch::getInvestplanadjust,"已调整").eq(Dispatch::getImageprogress,"工程类");
        int count3 = dispatchMapper.selectCount(lambdaq3);
        System.out.println("已调整工程类："+count3);
        list.add(count3);

        LambdaQueryWrapper<Dispatch> lambdaq4 =  Wrappers.<Dispatch>lambdaQuery();
        lambdaq4.eq(Dispatch::getInvestplanadjust,"不调整").eq(Dispatch::getImageprogress,"非工程类");
        int count4 = dispatchMapper.selectCount(lambdaq4);
        list.add(count4);
        LambdaQueryWrapper<Dispatch> lambdaq5 =  Wrappers.<Dispatch>lambdaQuery();
        lambdaq5.eq(Dispatch::getInvestplanadjust,"准备调整").eq(Dispatch::getImageprogress,"非工程类");
        int count5 = dispatchMapper.selectCount(lambdaq5);
        list.add(count5);
        LambdaQueryWrapper<Dispatch> lambdaq6 =  Wrappers.<Dispatch>lambdaQuery();
        lambdaq6.eq(Dispatch::getInvestplanadjust,"已调整").eq(Dispatch::getImageprogress,"非工程类");
        int count6 = dispatchMapper.selectCount(lambdaq6);
        list.add(count6);
        System.out.println("不调整工程类："+count1);
        System.out.println("准备调整工程类："+count2);
        System.out.println("已调整工程类："+count3);
        System.out.println("不调整非工程类："+count4);
        System.out.println("准备调整非工程类："+count5);
        System.out.println("已调整非工程类："+count6);
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }


    @RequestMapping(value="/fgindexproreply")
    @ResponseBody
    public String fgindexproreply() {

        List<Integer> list = new ArrayList();//最终json格式

        LambdaQueryWrapper<Proinfo> lambdaq1 = Wrappers.<Proinfo>lambdaQuery();
        lambdaq1.like(Proinfo::getPsland,"办理中");//
        int count1 = proinfoMapper.selectCount(lambdaq1);
        list.add(count1);
        LambdaQueryWrapper<Proinfo> lambdaq2 = Wrappers.<Proinfo>lambdaQuery();
        lambdaq2.like(Proinfo::getPsland,"已办结");//
        int count2 = proinfoMapper.selectCount(lambdaq2);
        list.add(count2);
        LambdaQueryWrapper<Proinfo> lambdaq3 =  Wrappers.<Proinfo>lambdaQuery();
        lambdaq3.like(Proinfo::getPsaddress,"办理中");
        int count3 = proinfoMapper.selectCount(lambdaq3);
        list.add(count3);
        LambdaQueryWrapper<Proinfo> lambdaq4 =  Wrappers.<Proinfo>lambdaQuery();
        lambdaq4.like(Proinfo::getPsaddress,"已办结");
        int count4 = proinfoMapper.selectCount(lambdaq4);
        list.add(count4);

        LambdaQueryWrapper<Proinfo> lambdaq5 =  Wrappers.<Proinfo>lambdaQuery();
        lambdaq5.like(Proinfo::getPsenv,"办理中");
        int count5 = proinfoMapper.selectCount(lambdaq5);
        list.add(count5);
        LambdaQueryWrapper<Proinfo> lambdaq6 =  Wrappers.<Proinfo>lambdaQuery();
        lambdaq6.like(Proinfo::getPsenv,"已办结");
        int count6 = proinfoMapper.selectCount(lambdaq6);
        list.add(count6);

        LambdaQueryWrapper<Proinfo> lambdaq7 =  Wrappers.<Proinfo>lambdaQuery();
        lambdaq7.like(Proinfo::getPssave,"办理中");
        int count7 = proinfoMapper.selectCount(lambdaq7);
        list.add(count7);
        LambdaQueryWrapper<Proinfo> lambdaq8 =  Wrappers.<Proinfo>lambdaQuery();
        lambdaq8.like(Proinfo::getPssave,"已办结");
        int count8 = proinfoMapper.selectCount(lambdaq8);
        list.add(count8);

        //疑问，如何取出最大值？？？？在前端作为max刻度
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }

    @RequestMapping(value="/hyindexreport")
    @ResponseBody
    public String hyindexreport() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Prostage> pros = proinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<pros.size();j++){
            if(!list1.contains(pros.get(j).getProstatus())){//从proinfo中取出prostatus的值
                list1.add(pros.get(j).getProstatus());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[5];
        String[] str ={"未填","已填","结项","黄牌预警","红牌预警"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String prostatus =str[m];
                value[m] = proinfoMapper.countByprostatus(prostatus);
                Change change = new Change(prostatus, value[m]);
                list.add(k,change);
                k++;
            }else {
                String prostatus=str[m];
                value[m]=0;
                Change change = new Change(prostatus, value[m]);
                list.add(k,change);
                k++;
            }
        }
        //疑问，如何取出最大值？？？？在前端作为max刻度
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }



}
