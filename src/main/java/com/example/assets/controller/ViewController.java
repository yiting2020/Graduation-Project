package com.example.assets.controller;
import com.alibaba.fastjson.JSON;

import com.example.assets.entity.*;
import com.example.assets.mapper.DispatchMapper;
import com.example.assets.mapper.ProinfoMapper;
import com.example.assets.mapper.ProjectinfoMapper;
import com.example.assets.mapper.QuesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
@Controller
public class ViewController {
//注入Mapper才能使用Mapper中定义的方法
    @Autowired
    private ProjectinfoMapper projectinfoMapper;
    @Autowired
    private DispatchMapper dispatchMapper;
    @Autowired
    private ProinfoMapper proinfoMapper;
    @Autowired
    private QuesMapper quesMapper;

//    @GetMapping("/viewfive")
//    public String viewfivePage(Model model) {
//        //给页面一个空的user属性
//        //返回注册页面
//        model.addAttribute("weitian",proinfoMapper.countweitian());
//        model.addAttribute("yitian",proinfoMapper.countyitian());
//        model.addAttribute("jiexian",proinfoMapper.countjiexian());
////        model.addAttribute("projects",projectinfoMapper.countprojects());
//        return "hangye/005";
//    }
//    @PostMapping("/viewfive")
//    public String viewfive() {
//        //重定向到登录页面
//        return "hangye/005";
//    }
//    //
//
//
//    @RequestMapping(value="/005pie1")
//    @ResponseBody
//    public String pie1() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Prostage> pros = proinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<pros.size();j++){
//            if(!list1.contains(pros.get(j).getProstatus())){//从proinfo中取出prostatus的值
//                list1.add(pros.get(j).getProstatus());//将取出的值放入list1
//            }
//        }
//        //System.out.println(list1);
//        int k= 0;
//        int[] value = new int[3];
//        String[] str ={"未填","已填","结项"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String status=str[m];//
//                value[m] = proinfoMapper.countByprostatus(status);//
//                Change change = new Change(status, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String status=str[m];
//                value[m]=0;
//                Change change = new Change(status, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }
//
//    @RequestMapping(value="/005pie2")
//    @ResponseBody
//    public String pie2() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Prostage> pros = proinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<pros.size();j++){
//            if(!list1.contains(pros.get(j).getPsland())){//从proinfo中取出prostatus的值
//                list1.add(pros.get(j).getPsland());//将取出的值放入list1
//            }
//        }
//        //System.out.println(list1);
//        int k= 0;
//        int[] value = new int[3];
//        String[] str ={"未办理","办理中","已批复"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String psland=str[m];
//                value[m] = proinfoMapper.countBypsland(psland);
//                Change change = new Change(psland, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String psland=str[m];
//                value[m]=0;
//                Change change = new Change(psland, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }
//
//    @RequestMapping(value="/005pie4")
//    @ResponseBody
//    public String pie4() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Prostage> pros = proinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<pros.size();j++){
//            if(!list1.contains(pros.get(j).getPifnland())){//从proinfo中取出prostatus的值
//                list1.add(pros.get(j).getPifnland());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//
//        int k= 0;
//        int[] value = new int[4];
//        String[] str ={"小于十万","十万至百万","百万至千万","千万以上"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String pifnland=str[m];
//                value[m] = proinfoMapper.countBypifnland(pifnland);
//                Change change = new Change(pifnland, value[m]);
//
//                list.add(k,change);
//                k++;
//            }else {
//                String psland=str[m];
//                value[m]=0;
//                Change change = new Change(psland, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }
//
//
//
//    @GetMapping("/viewnine")
//    public String viewninePage() {
//        //给页面一个空的user属性
//        //返回注册页面
//        return "hangye/009";
//    }
//
//    @PostMapping("/viewnine")
//    public String viewnine() {
//        //重定向到登录页面
//        return "hangye/009";
//    }
//
//    @GetMapping("/viewtwelve")
//    public String viewtwelvePage() {
//        //给页面一个空的user属性
//        //返回注册页面
//        return "hangye/012";
//    }
//
//    @PostMapping("/viewtwelve")
//    public String viewtwelve() {
//        //重定向到登录页面
//        return "hangye/012";
//    }

    ///////////////////////////////////////////////////////////////////////////////////hy行业主管部门
//hy前期工作问题统计
    @GetMapping("/pro-question")
    public String proquestionPage() {

        return "hangye/pro-question";
    }
    @PostMapping("/pro-question")
    public String proquestion() {
        //重定向到登录页面
        return "hangye/pro-question";
    }
//    @RequestMapping(value="/hyproqueschart1" ,method = RequestMethod.POST)
//    @ResponseBody
//    public List<String> hyproqueschart1() {
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//
//        String arr[]={"未申请","未处理","结项"};
//        for(int i=0;i<3;i++) {
//           String qstatus = arr[i];
//            list1.add(quesMapper.countByqianqi(qstatus));
//
//
//        }
//        Integer max=0;
//        for (int i=0;i<list1.size();i++){
//            if(list1.get(i)>max){
//                max=list1.get(i);
//            }
//
//        }
//
//        list1.add(max);
//
//
//        System.out.println("data:" + list1);
//        return list1;
//
//    }
//hy前期工作问题统计

//hy填报情况
@GetMapping("/pro-report")
public String hyreportPage(Model model) {
model.addAttribute("countsum",proinfoMapper.counsum());
model.addAttribute("countweitian",proinfoMapper.countweitian());
model.addAttribute("countyitian",proinfoMapper.countyitian());
model.addAttribute("countjiexiang",proinfoMapper.countjiexian());

    return "hangye/pro-report";
}
    @PostMapping("/pro-report")
    public String hyreport() {

        return "hangye/pro-report";
    }
//    @RequestMapping(value="/hyproreport")
//    @ResponseBody
//    public String hyproreport() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Prostage> pros = proinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<pros.size();j++){
//            if(!list1.contains(pros.get(j).getProstatus())){//从proinfo中取出prostatus的值
//                list1.add(pros.get(j).getProstatus());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[3];
//        String[] str ={"未填","已填","结项"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String prostatus =str[m];
//                value[m] = proinfoMapper.countByprostatus(prostatus);
//                Change change = new Change(prostatus, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String prostatus=str[m];
//                value[m]=0;
//                Change change = new Change(prostatus, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        //疑问，如何取出最大值？？？？在前端作为max刻度
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }
//
// //hy填报情况

//hy用地批复状态
@GetMapping("/pro-reply")
public String proreplyPage() {

    return "hangye/pro-reply";
}
    @PostMapping("/pro-reply")
    public String proreply() {

        return "hangye/pro-reply";
    }
//    @RequestMapping(value="/hyproreply")
//    @ResponseBody
//    public String hyproreply() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Prostage> pros = proinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<pros.size();j++){
//            if(!list1.contains(pros.get(j).getPsland())){//从proinfo中取出prostatus的值
//                list1.add(pros.get(j).getPsland());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[3];
//        String[] str ={"未办理","办理中","已批复"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String propsland =str[m];
//                value[m] = proinfoMapper.countBypsland(propsland);
//                Change change = new Change(propsland, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String propsland=str[m];
//                value[m]=0;
//                Change change = new Change(propsland, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        //疑问，如何取出最大值？？？？在前端作为max刻度
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }


//hy用地批复状态

/////////////////////////////////////////////////////////////////////////////above hangye
//////////////////////////////////////////////////////////////////////////////bolew   faren//////////////////////////////////////////////////////
//项目总数及类型统计
    @GetMapping("/project-sumandtype")
    public String sumandtypePage(Model model) {
        //给页面一个空的user属性
        //返回注册页面
        model.addAttribute("countbeian",projectinfoMapper.countbeian());//备案数
        model.addAttribute("counthezhun",projectinfoMapper.countshezhun());//核准数
        model.addAttribute("countshenpi",projectinfoMapper.countshenpi());//审批数
        model.addAttribute("projectsum",projectinfoMapper.countsum());//项目总数
        return "faren/project-sumandtype";
    }
    @PostMapping("/project-sumandtype")
    public String sumandtype() {
        //重定向到登录页面
        return "faren/project-sumandtype";
    }
//    @RequestMapping(value="/sumandtype")
//    @ResponseBody
//    public String frviewprojectechart1() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<projects.size();j++){
//            if(!list1.contains(projects.get(j).getProjecttype())){//从proinfo中取出prostatus的值
//                list1.add(projects.get(j).getProjecttype());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[3];
//        String[] str ={"审批","核准","备案"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String projecttype=str[m];
//                value[m] = projectinfoMapper.countByprojecttype(projecttype);
//                Change change = new Change(projecttype, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String projecttype=str[m];
//                value[m]=0;
//                Change change = new Change(projecttype, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }
//项目总数及类型统计

//项目建设性质
    @GetMapping("/project-buildnature")
    public String buildnaturePage(Model model) {
        //给页面一个空的user属性
    model.addAttribute("countxinjian",projectinfoMapper.countxinjian());//新建
    model.addAttribute("countkuojian",projectinfoMapper.countkuojian());
    model.addAttribute("countgaijian",projectinfoMapper.countgaijian());
    model.addAttribute("counthuifu",projectinfoMapper.counthuifu());
        return "faren/project-buildnature";
    }
    @PostMapping("/project-buildnature")
    public String buildnature() {
        //重定向到登录页面
        return "faren/project-buildnature";
    }

//    @RequestMapping(value="/buildnature")
//    @ResponseBody
//    public String build() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<projects.size();j++){
//            if(!list1.contains(projects.get(j).getBuildnature())){//从proinfo中取出prostatus的值
//                list1.add(projects.get(j).getBuildnature());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[4];
//        String[] str ={"新建","扩建","改建","恢复"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String buildnature=str[m];
//                value[m] = projectinfoMapper.countBybuildnature(buildnature);
//                Change change = new Change(buildnature, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String buildnature=str[m];
//                value[m]=0;
//                Change change = new Change(buildnature, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }
//项目建设性质

//项目建设地点
    @GetMapping("/project-buildplace")
    public String buildplacePage() {
        //给页面一个空的user属性
        //返回注册页面
        return "faren/project-buildplace";
    }
    @PostMapping("/project-buildplace")
    public String buildplace() {
        //重定向到登录页面
        return "faren/project-buildplace";
    }
//    @RequestMapping(value="/buildplace")
//    @ResponseBody
//    public String map() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<projects.size();j++){
//            if(!list1.contains(projects.get(j).getBuildplace())){//从proinfo中取出prostatus的值
//                list1.add(projects.get(j).getBuildplace());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[34];
//        String[] str ={"河北","山西","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","海南",
//                "四川","贵州","云南","陕西","甘肃","青海","台湾", "内蒙古","广西","西藏","宁夏","新疆","北京","天津","上海","重庆","香港","澳门"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String buildplcae=str[m];
//                value[m] = projectinfoMapper.countBybuildplace(buildplcae);
//                Change change = new Change(buildplcae, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String buildplace=str[m];
//                value[m]=0;
//                Change change = new Change(buildplace, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }
//项目建设地点
//项目开竣工
    @GetMapping("/project-start")
    public String startPage() {
        //给页面一个空的user属性
        //返回注册页面
        return "faren/project-start";
    }
    @PostMapping("/project-start")
    public String start() {
        //重定向到登录页面
        return "faren/project-start";
    }

//    @RequestMapping(value="/start" ,method = RequestMethod.POST)
//    @ResponseBody
//    public List<Integer> startend() {
//        ArrayList<Integer> list1 = new ArrayList();//具体有几个状态类型
//        Integer nstarttime=0;
//        Integer nendtime=0;
//        Integer arr[]={2016,2017,2018,2019,2020};
//        for(int i=0;i<5;i++) {
//            nstarttime = arr[i];
//            nendtime = arr[i];
//            list1.add(projectinfoMapper.countBynstarttime(nstarttime));
//            list1.add(projectinfoMapper.countBynendtime(nendtime));
//
//        }
//        Integer max=0;
//        for (int i=0;i<list1.size();i++){
//            if(list1.get(i)>max){
//                max=list1.get(i);
//            }
//
//        }
//
//        list1.add(max);
//
//
//        System.out.println("data:" + list1);
//        return list1;
//
//    }



//        for (int j=0;j<projects.size();j++){
//            if(!list1.contains(projects.get(j).getBuildplace())){//从proinfo中取出prostatus的值
//                list1.add(projects.get(j).getBuildplace());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[34];
//        String[] str ={"河北","山西","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","海南",
//                "四川","贵州","云南","陕西","甘肃","青海","台湾", "内蒙古","广西","西藏","宁夏","新疆","北京","天津","上海","重庆","香港","澳门"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String buildplcae=str[m];
//                value[m] = projectinfoMapper.countBybuildplace(buildplcae);
//                Change change = new Change(buildplcae, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String buildplace=str[m];
//                value[m]=0;
//                Change change = new Change(buildplace, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);


//项目开竣工
//项目投资
    @GetMapping("/project-investment")
    public String investmentPage() {
        //给页面一个空的user属性
        //返回注册页面
        return "faren/project-investment";
    }
    @PostMapping("/project-investment")
    public String investment() {
        //重定向到登录页面
        return "faren/project-investment";
    }
//项目投资


    @GetMapping("/fr-view-question")
    public String frviewquestionsPage() {
        //给页面一个空的user属性
        //返回注册页面
        return "faren/view-question";
    }
    @PostMapping("/fr-view-question")
    public String frviewquestions() {
        //重定向到登录页面
        return "faren/view-question";
    }
//法人问题类型及总数
    @GetMapping("/question-type")
    public String questiontypePage(Model model) {
        model.addAttribute("countsum",quesMapper.countsum());//
        model.addAttribute("countxinxi",quesMapper.countinfo());//
        model.addAttribute("countdiaodu",quesMapper.countdis());//
        model.addAttribute("countqianqi",quesMapper.countpro());//

        return "faren/question-type";
    }
    @PostMapping("/question-type")
    public String questiontype() {
        //重定向到登录页面
        return "faren/question-type";
    }
//    @RequestMapping(value="/questiontype")
//    @ResponseBody
//    public String qtype() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Ques> questions = quesMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<questions.size();j++){
//            if(!list1.contains(questions.get(j).getQtype())){//从proinfo中取出prostatus的值
//                list1.add(questions.get(j).getQtype());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[3];
//        String[] str ={"项目信息","项目调度","前期工作事项"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String qtype=str[m];
//                value[m] = quesMapper.countBytype(qtype);//提示出错？？？？有什么错？？？？
//                Change change = new Change(qtype, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String qtype=str[m];
//                value[m]=0;
//                    Change change = new Change(qtype, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }
//法人问题类型及总数
//法人问题状态
    @GetMapping("/question-status")
    public String questionstatusPage() {
        //给页面一个空的user属性
        //返回注册页面
        return "faren/question-status";
    }
    @PostMapping("/question-status")
    public String questionstatus() {
        //重定向到登录页面
        return "faren/question-status";
    }
//    @RequestMapping(value="/questionstatus")
//    @ResponseBody
//    public String quesstatus() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Ques> questions = quesMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<questions.size();j++){
//            if(!list1.contains(questions.get(j).getQstatus())){//从proinfo中取出prostatus的值
//                list1.add(questions.get(j).getQstatus());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[3];
//        String[] str ={"未申请","未处理","结项"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String qstatus=str[m];
//                value[m] = quesMapper.countByqstatus(qstatus);
//                Change change = new Change(qstatus, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String qstatus=str[m];
//                value[m]=0;
//                Change change = new Change(qstatus, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }
//法人问题状态
///////////////////////////////////////////////////////////////////////////////////////above   faren

    //////////////////////////////////////////////////////////////////////////////////////below  fg
    // 发改中的前期工作统计
    @GetMapping("/fg-view-pro")
    public String fgviewproPage() {
        //给页面一个空的user属性
        //返回注册页面
        return "fagai/view-pro";
    }
    @PostMapping("/fg-view-pro")
    public String fgviewpro() {
        //重定向到登录页面
        return "fagai/view-pro";
    }

    //填报情况

    @GetMapping("/fgproreport")
    public String fgproreportPage(Model model) {
        model.addAttribute("countsum",proinfoMapper.counsum());
        model.addAttribute("countweitian",proinfoMapper.countweitian());
        model.addAttribute("countyitian",proinfoMapper.countyitian());
        model.addAttribute("countjiexiang",proinfoMapper.countjiexian());
        return "fagai/pro-report";
    }
    @PostMapping("/fgproreport")
    public String fgproreport() {
        //重定向到登录页面
        return "fagai/pro-report";
    }


    @RequestMapping(value="/fgproreportchart1")
    @ResponseBody
    public String fgproreportchart1() {
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
        int[] value = new int[3];
        String[] str ={"未填","已填","结项"};
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
    //填报情况
    //用地批复状态
    @GetMapping("/fgproreply")
    public String fgproreplyPage() {
        //给页面一个空的user属性
        //返回注册页面
        return "fagai/pro-reply";
    }
    @PostMapping("/fgproreply")
    public String fgproreply() {
        //重定向到登录页面
        return "fagai/pro-reply";
    }

    @RequestMapping(value="/fgproreplychart1")
    @ResponseBody
    public String fgproreplychart1() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Prostage> pros = proinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<pros.size();j++){
            if(!list1.contains(pros.get(j).getPsland())){//从proinfo中取出prostatus的值
                list1.add(pros.get(j).getPsland());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[3];
        String[] str ={"未办理","办理中","已批复"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String propsland =str[m];
                value[m] = proinfoMapper.countBypsland(propsland);
                Change change = new Change(propsland, value[m]);
                list.add(k,change);
                k++;
            }else {
                String propsland=str[m];
                value[m]=0;
                Change change = new Change(propsland, value[m]);
                list.add(k,change);
                k++;
            }
        }
        //疑问，如何取出最大值？？？？在前端作为max刻度
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }
    //用地批复状态
    // 发改中的前期工作统计



    //发改里的项目总体统计
    @GetMapping("/fg-view-project")
    public String fgviewquestionsPage() {
        return "fagai/view-project";
    }
    @PostMapping("/fg-view-project")
    public String fgviewquestions() {
        return "fagai/view-project";
    }
    //项目状态统计
    @GetMapping("/fgprojectstatus")
    public String fgprojectstatusPage() {
        return "fagai/project-status";
    }
    @PostMapping("/fgprojectstatus")
    public String fgprojectstatus() {
        return "fagai/project-status";
    }
//    @RequestMapping(value="/fgprojectstatuschart1")
//    @ResponseBody
//    public String fgprojectstatus1() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<projects.size();j++){
//            if(!list1.contains(projects.get(j).getProjectstatus())){//从proinfo中取出prostatus的值
//                list1.add(projects.get(j).getProjectstatus());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[7];
//        String[] str ={"未报","已报","审核通过","审核失败","预备项目","当前年度","历史年度"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String projectstatus=str[m];
//                value[m] = projectinfoMapper.countByprojectstatus(projectstatus);
//                Change change = new Change(projectstatus, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String projectstatus=str[m];
//                value[m]=0;
//                Change change = new Change(projectstatus, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }

    //项目状态统计

    //所属行业统计
    @GetMapping("/fgprojectindustry")
    public String fgprojectindustryPage() {
        return "fagai/project-industry";
    }
    @PostMapping("/fgprojectindustry")
    public String fgprojectindustry() {
        return "fagai/project-industry";
    }
//    @RequestMapping(value="/fgprojectindustrychart1")
//    @ResponseBody
//    public String fgprojectindustry1() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<projects.size();j++){
//            if(!list1.contains(projects.get(j).getIndustry())){//从proinfo中取出prostatus的值
//                list1.add(projects.get(j).getIndustry());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[16];
//        String[] str ={"农业","林业","畜牧业","渔业","采矿业","制造业","生产和供应业","批发和零售业","交通运输业",
//                "仓储和邮政业","住宿与餐饮业","信息传输与软件业","建筑业","金融业","房地产业","租赁和商品服务业"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String industry=str[m];
//                value[m] = projectinfoMapper.countByindustry(industry);
//                Change change = new Change(industry, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String industry=str[m];
//                value[m]=0;
//                Change change = new Change(industry, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }

    ///所属行业统计

    //隶属关系统计
    @GetMapping("/fgprojectbelong")
    public String fgprojectbelongPage() {
        return "fagai/project-belong";
    }
    @PostMapping("/fgprojectbelong")
    public String fgprojectbelong() {
        return "fagai/project-belong";
    }

//    @RequestMapping(value="/fgprojectbelongchart1")
//    @ResponseBody
//    public String fgprojectbelong1() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<projects.size();j++){
//            if(!list1.contains(projects.get(j).getProjectaffiliation())){//从proinfo中取出prostatus的值
//                list1.add(projects.get(j).getProjectaffiliation());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[4];
//        String[] str ={"中央项目","地方项目","企业项目","无隶属"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String projectaffiliation=str[m];
//                value[m] = projectinfoMapper.countByprojectaffiliation(projectaffiliation);
//                Change change = new Change(projectaffiliation, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String projectaffiliation=str[m];
//                value[m]=0;
//                Change change = new Change(projectaffiliation, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }


    //隶属关系统计

    //建设地点统计
    @GetMapping("/fgprojectbuildplace")
    public String fgprojectbuildplacePage() {
        return "fagai/project-buildplace";
    }
    @PostMapping("/fgprojectbuildplace")
    public String fgprojectbuildplace() {
        return "fagai/project-buildplace";
    }

//    @RequestMapping(value="/fgprojectbuildplacechart1")
//    @ResponseBody
//    public String fgprojectbuildplacechart1() {
//        List<Change> list = new ArrayList();//最终json格式
//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<projects.size();j++){
//            if(!list1.contains(projects.get(j).getBuildplace())){//从proinfo中取出prostatus的值
//                list1.add(projects.get(j).getBuildplace());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[34];
//        String[] str ={"河北","山西","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","海南",
//                "四川","贵州","云南","陕西","甘肃","青海","台湾", "内蒙古","广西","西藏","宁夏","新疆","北京","天津","上海","重庆","香港","澳门"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String buildplcae=str[m];
//                value[m] = projectinfoMapper.countBybuildplace(buildplcae);
//                Change change = new Change(buildplcae, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String buildplace=str[m];
//                value[m]=0;
//                Change change = new Change(buildplace, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//
//        String data = JSON.toJSONString(list);
//        System.out.println("data:" + data);
//        return data;
//    }
    //建设地点统计

    //开竣工统计
    @GetMapping("/fgprojectstart")
    public String fgprojectstartPage() {
        return "fagai/project-start";
    }
    @PostMapping("/fgprojectstart")
    public String fgprojectstart() {
        return "fagai/project-start";
    }
//
//    @RequestMapping(value="/fgprojectstartchart1" ,method = RequestMethod.POST)
//    @ResponseBody
//    public List<Integer> fgprojectstartchart1() {
//        ArrayList<Integer> list1 = new ArrayList();//具体有几个状态类型
//        Integer nstarttime=0;
//        Integer nendtime=0;
//        Integer arr[]={2016,2017,2018,2019,2020};
//        for(int i=0;i<5;i++) {
//            nstarttime = arr[i];
//            nendtime = arr[i];
//            list1.add(projectinfoMapper.countBynstarttime(nstarttime));
//            list1.add(projectinfoMapper.countBynendtime(nendtime));
//
//        }
//        Integer max=0;
//        for (int i=0;i<list1.size();i++){
//            if(list1.get(i)>max){
//                max=list1.get(i);
//            }
//
//        }
//
//        list1.add(max);
//
//        System.out.println("data:" + list1);
//        return list1;
//
//    }


//        for (int j=0;j<projects.size();j++){
//            if(!list1.contains(projects.get(j).getBuildplace())){//从proinfo中取出prostatus的值
//                list1.add(projects.get(j).getBuildplace());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[34];
//        String[] str ={"河北","山西","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","海南",
//                "四川","贵州","云南","陕西","甘肃","青海","台湾", "内蒙古","广西","西藏","宁夏","新疆","北京","天津","上海","重庆","香港","澳门"};
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String buildplcae=str[m];
//                value[m] = projectinfoMapper.countBybuildplace(buildplcae);
//                Change change = new Change(buildplcae, value[m]);
//                list.add(k,change);
//                k++;
//            }else {
//                String buildplace=str[m];
//                value[m]=0;
//                Change change = new Change(buildplace, value[m]);
//                list.add(k,change);
//                k++;
//            }
//        }
//        String data = JSON.toJSONString(list);




    //开竣工统计

    //投资统计
    @GetMapping("/fgprojectinvestment")
    public String fgprojectinvestmentPage() {
        return "fagai/project-investment";
    }
    @PostMapping("/fgprojectinvestment")
    public String fgprojectinvestment() {
        return "fagai/project-investment";
    }
    // 投资计划统计
    //发改里的项目总体统计
    @GetMapping("/fg-view-question")
    public String fgviewquestionPage() {
        //给页面一个空的user属性
        //返回注册页面
        return "fagai/view-question";
    }
    @PostMapping("/fg-view-question")
    public String fgviewquestion() {
        //重定向到登录页面
        return "fagai/view-question";
    }
    //发改里的问题督办
    //问题总数及类型
    @GetMapping("/fgquessum")
    public String fgquessumPage(Model model) {
        model.addAttribute("countsum",quesMapper.countsum());//
        model.addAttribute("countxinxi",quesMapper.countinfo());//
        model.addAttribute("countdiaodu",quesMapper.countdis());//
        model.addAttribute("countqianqi",quesMapper.countpro());//
        return "fagai/ques-sum";
    }
    @PostMapping("/fgquessum")
    public String fgquessum() {
        return "fagai/ques-sum";
    }
    @RequestMapping(value="/fgquessumchart1")
    @ResponseBody
    public String fgquessumchart1() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Ques> questions = quesMapper.selectall();//查所有proinfo项目

        for (int j=0;j<questions.size();j++){
            if(!list1.contains(questions.get(j).getQtype())){//从proinfo中取出prostatus的值
                list1.add(questions.get(j).getQtype());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[3];
        String[] str ={"项目信息","项目调度","前期工作事项"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String qtype=str[m];
                value[m] = quesMapper.countBytype(qtype);//提示出错？？？？有什么错？？？？
                Change change = new Change(qtype, value[m]);
                list.add(k,change);
                k++;
            }else {
                String qtype=str[m];
                value[m]=0;
                Change change = new Change(qtype, value[m]);
                list.add(k,change);
                k++;
            }
        }
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }
    //问题总数及类型

    //问题状态
    @GetMapping("/fgquesstatus")
    public String fgquesstatusPage() {
        //给页面一个空的user属性
        //返回注册页面
        return "fagai/ques-status";
    }
    @PostMapping("/fgquesstatus")
    public String fgfgquesstatus() {
        //重定向到登录页面
        return "fagai/ques-status";
    }
    @RequestMapping(value="/fgquesstatuschart1")
    @ResponseBody
    public String fgquesstatuschart1() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Ques> questions = quesMapper.selectall();//查所有proinfo项目

        for (int j=0;j<questions.size();j++){
            if(!list1.contains(questions.get(j).getQstatus())){//从proinfo中取出prostatus的值
                list1.add(questions.get(j).getQstatus());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[3];
        String[] str ={"未申请","未处理","结项"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String qstatus=str[m];
                value[m] = quesMapper.countByqstatus(qstatus);
                Change change = new Change(qstatus, value[m]);
                list.add(k,change);
                k++;
            }else {
                String qstatus=str[m];
                value[m]=0;
                Change change = new Change(qstatus, value[m]);
                list.add(k,change);
                k++;
            }
        }
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }
    //问题状态
    //发改里的问题督办




}
