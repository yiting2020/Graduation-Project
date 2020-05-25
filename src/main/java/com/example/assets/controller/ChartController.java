package com.example.assets.controller;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
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
public class ChartController {
    //注入Mapper才能使用Mapper中定义的方法
    @Autowired
    private ProjectinfoMapper projectinfoMapper;
    @Autowired
    private DispatchMapper dispatchMapper;
    @Autowired
    private ProinfoMapper proinfoMapper;
    @Autowired
    private QuesMapper quesMapper;

    //////////////////////////////////////////////////////////////////////////////////////////////hangye
    //hy
    //前期工作事项情况统计
    @GetMapping("/hyproview")
    public String hyproviewPage(Model model) {
        model.addAttribute("countsum",proinfoMapper.counsum());
        model.addAttribute("countweitian",proinfoMapper.countweitian());
        model.addAttribute("countyitian",proinfoMapper.countyitian());
        model.addAttribute("countjiexiang",proinfoMapper.countjiexian());
        return "hangye/hy-pro-view";
    }
    @PostMapping("/hyproview")
    public String hyproview() {
        return "hangye/hy-pro-view";
    }
//hy前期工作事项填报情况
    @RequestMapping(value="/hyproreport")
    @ResponseBody
    public String hyproreport() {
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
    //hy填报情况


    //hystatus
    @RequestMapping(value="/hyproreply")
    @ResponseBody
    public String hyproreply() {
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
        int[] value = new int[4];
        String[] str ={"未办理","办理中","已批复","已办结"};
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
        //在前端作为max刻度
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }
    //hystatus


    //前期工作事项问题情况统计
    @RequestMapping(value="/hyquesstaus")
    @ResponseBody
    public String hyquesstatus() {

        List<Integer> list = new ArrayList();//最终json格式

        LambdaQueryWrapper<Ques> lambdaq1 =  Wrappers.<Ques>lambdaQuery();
        lambdaq1.like(Ques::getQstatus,"已申请").like(Ques::getQtype,"前期工作事项");
        int count1 = quesMapper.selectCount(lambdaq1);
        list.add(count1);
        LambdaQueryWrapper<Ques> lambdaq2 =  Wrappers.<Ques>lambdaQuery();
        lambdaq2.like(Ques::getQstatus,"未处理").like(Ques::getQtype,"前期工作事项");
        int count2 = quesMapper.selectCount(lambdaq2);
        list.add(count2);
        LambdaQueryWrapper<Ques> lambdaq3 =  Wrappers.<Ques>lambdaQuery();
        lambdaq3.like(Ques::getQstatus,"已处理").like(Ques::getQtype,"前期工作事项");
        int count3 = quesMapper.selectCount(lambdaq3);
        list.add(count3);
        LambdaQueryWrapper<Ques> lambdaq4 =  Wrappers.<Ques>lambdaQuery();
        lambdaq4.like(Ques::getQstatus,"结项").like(Ques::getQtype,"前期工作事项");
        int count4 = quesMapper.selectCount(lambdaq4);
        list.add(count4);





//        String[] str ={"未处理","已申请","已处理","结项"};
//        for(int i=0;i<=str.length;i++){
//            String qstatus=str[i];
//            list.add(quesMapper.countprostatus(qstatus,"前期工作事项"));
//        }

//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Ques> ques = quesMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<ques.size();j++){
//            if(!list1.contains(ques.get(j).getQstatus())){//从proinfo中取出prostatus的值
//                list1.add(ques.get(j).getQstatus());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[4];
//
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String qstatus =str[m];
//                value[m] = quesMapper.(qstatus);
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
        //疑问，如何取出最大值？？？？在前端作为max刻度
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }

    //前期工作问题情况统计



    //////////////////////////////////////////////////////////////////////////////////////////////////////hangye

    //////////////////////////////////////////////////////////////////////////////////////////////////////fagai

    // 项目总体统计
    @GetMapping("/fgprojectview")
    public String fgprojectviewPage(Model model) {
     ;
        return "fagai/view-project";
    }
    @PostMapping("/fgprojectview")
    public String fgprojectview() {
        return "fagai/view-project";
    }
//status
@RequestMapping(value="/fgprojectstatuschart1")
@ResponseBody
public String fgprojectstatus1() {
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
    //status
//belong
    @RequestMapping(value="/fgprojectbelongchart1")
    @ResponseBody
    public String fgprojectbelong1() {
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
        int[] value = new int[4];
        String[] str ={"中央项目","地方项目","企业项目","无隶属"};
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
    //belong
//industry

    @RequestMapping(value="/fgprojectindustrychart1")
    @ResponseBody
    public String fgprojectindustry1() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<projects.size();j++){
            if(!list1.contains(projects.get(j).getIndustry())){//从proinfo中取出prostatus的值
                list1.add(projects.get(j).getIndustry());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[16];
        String[] str ={"农业","林业","畜牧业","渔业","采矿业","制造业","生产和供应业","批发和零售业","交通运输业",
                "仓储和邮政业","住宿与餐饮业","信息传输与软件业","建筑业","金融业","房地产业","租赁和商品服务业"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String industry=str[m];
                value[m] = projectinfoMapper.countByindustry(industry);
                Change change = new Change(industry, value[m]);
                list.add(k,change);
                k++;
            }else {
                String industry=str[m];
                value[m]=0;
                Change change = new Change(industry, value[m]);
                list.add(k,change);
                k++;
            }
        }
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }
    //industry
//buildplace
    @RequestMapping(value="/fgprojectbuildplacechart1")
    @ResponseBody
    public String fgprojectbuildplacechart1() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<projects.size();j++){
            if(!list1.contains(projects.get(j).getBuildplace())){//从proinfo中取出prostatus的值
                list1.add(projects.get(j).getBuildplace());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[34];
        String[] str ={"河北","山西","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","海南",
                "四川","贵州","云南","陕西","甘肃","青海","台湾", "内蒙古","广西","西藏","宁夏","新疆","北京","天津","上海","重庆","香港","澳门"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String buildplcae=str[m];
                value[m] = projectinfoMapper.countBybuildplace(buildplcae);
                Change change = new Change(buildplcae, value[m]);
                list.add(k,change);
                k++;
            }else {
                String buildplace=str[m];
                value[m]=0;
                Change change = new Change(buildplace, value[m]);
                list.add(k,change);
                k++;
            }
        }

        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }
    //buildplace
//start

    @RequestMapping(value="/fgprojectstartchart1" ,method = RequestMethod.POST)
    @ResponseBody
    public List<Integer> fgprojectstartchart1() {
        ArrayList<Integer> list1 = new ArrayList();//具体有几个状态类型
        Integer nstarttime=0;
        Integer nendtime=0;
        Integer arr[]={2016,2017,2018,2019,2020};
        for(int i=0;i<5;i++) {
            nstarttime = arr[i];
            nendtime = arr[i];
            list1.add(projectinfoMapper.countBynstarttime(nstarttime));
            list1.add(projectinfoMapper.countBynendtime(nendtime));

        }
        Integer max=0;
        for (int i=0;i<list1.size();i++){
            if(list1.get(i)>max){
                max=list1.get(i);
            }

        }

        list1.add(max);

        System.out.println("data:" + list1);
        return list1;

    }
    //start
//invest
    @RequestMapping(value="/fgprojectinvestchart1")
    @ResponseBody
    public String fgprojectinvestchart1() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<projects.size();j++){
            if(!list1.contains(projects.get(j).getMoneyyear())){//从proinfo中取出prostatus的值
                list1.add(projects.get(j).getMoneyyear());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[6];
        String[] str ={"2015","2016","2017","2018","2019","2020"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String moneyyear=str[m];
                value[m] = projectinfoMapper.countBymoneyyear(moneyyear);
                Change change = new Change(moneyyear, value[m]);
                list.add(k,change);
                k++;
            }else {
                String moneyyear=str[m];
                value[m]=0;
                Change change = new Change(moneyyear, value[m]);
                list.add(k,change);
                k++;
            }
        }

        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }
    //invest

    // 项目总体统计



//前期工作统计
    @GetMapping("/fgproview")
    public String fgproviewPage(Model model) {
        model.addAttribute("countsum",proinfoMapper.counsum());
        model.addAttribute("countweitian",proinfoMapper.countweitian());
        model.addAttribute("countyitian",proinfoMapper.countyitian());
        model.addAttribute("countjiexiang",proinfoMapper.countjiexian());
        return "fagai/view-pro";
    }
    @PostMapping("/fgproview")
    public String fgproview() {
        return "fagai/view-pro";
    }

    @RequestMapping(value="/fgproquesstaus")
    @ResponseBody
    public String fgproquesstaus() {

        List<Integer> list = new ArrayList();//最终json格式

        LambdaQueryWrapper<Ques> lambdaq1 =  Wrappers.<Ques>lambdaQuery();
        lambdaq1.like(Ques::getQstatus,"已申请").like(Ques::getQtype,"前期工作事项");
        int count1 = quesMapper.selectCount(lambdaq1);
        list.add(count1);
        LambdaQueryWrapper<Ques> lambdaq2 =  Wrappers.<Ques>lambdaQuery();
        lambdaq2.like(Ques::getQstatus,"未处理").like(Ques::getQtype,"前期工作事项");
        int count2 = quesMapper.selectCount(lambdaq2);
        list.add(count2);
        LambdaQueryWrapper<Ques> lambdaq3 =  Wrappers.<Ques>lambdaQuery();
        lambdaq3.like(Ques::getQstatus,"已处理").like(Ques::getQtype,"前期工作事项");
        int count3 = quesMapper.selectCount(lambdaq3);
        list.add(count3);
        LambdaQueryWrapper<Ques> lambdaq4 =  Wrappers.<Ques>lambdaQuery();
        lambdaq4.like(Ques::getQstatus,"结项").like(Ques::getQtype,"前期工作事项");
        int count4 = quesMapper.selectCount(lambdaq4);
        list.add(count4);





//        String[] str ={"未处理","已申请","已处理","结项"};
//        for(int i=0;i<=str.length;i++){
//            String qstatus=str[i];
//            list.add(quesMapper.countprostatus(qstatus,"前期工作事项"));
//        }

//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Ques> ques = quesMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<ques.size();j++){
//            if(!list1.contains(ques.get(j).getQstatus())){//从proinfo中取出prostatus的值
//                list1.add(ques.get(j).getQstatus());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[4];
//
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String qstatus =str[m];
//                value[m] = quesMapper.(qstatus);
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
        //疑问，如何取出最大值？？？？在前端作为max刻度
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }

//前期工作统计
// 问题督办统计
@GetMapping("/fgquesview")
public String fgquesviewPage(Model model) {
    model.addAttribute("countsum",quesMapper.countsum());//
    model.addAttribute("countxinxi",quesMapper.countinfo());//
    model.addAttribute("countdiaodu",quesMapper.countdis());//
    model.addAttribute("countqianqi",quesMapper.countpro());//
    return "fagai/view-question";
}
    @PostMapping("/fgquesview")
    public String fgquesview() {
        return "fagai/view-question";
    }
// 问题督办统计
    //type
@RequestMapping(value="/questiontype")
@ResponseBody
public String qtype() {
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
    //type
//status
    @RequestMapping(value="/questionstatus")
    @ResponseBody
    public String quesstatus() {
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
    //status

    ///////////////////////////////////////////////////////////////////////////////////////////////////fagai


    //////////////////////////////////////////////////////////////////////////////////////////////////faren

    //project
    @GetMapping("/frprojectview")
    public String frprojectviewPage(Model model) {
        model.addAttribute("countbeian",projectinfoMapper.countbeian());//备案数
        model.addAttribute("counthezhun",projectinfoMapper.countshezhun());//核准数
        model.addAttribute("countshenpi",projectinfoMapper.countshenpi());//审批数
        model.addAttribute("projectsum",projectinfoMapper.countsum());//项目总数
        return "faren/view-project";
    }
    @PostMapping("/frprojectview")
    public String frprojectview() {
        return "faren/view-project";
    }

    @RequestMapping(value="/sumandtype")
    @ResponseBody
    public String frviewprojectechart1() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<projects.size();j++){
            if(!list1.contains(projects.get(j).getProjecttype())){//从proinfo中取出prostatus的值
                list1.add(projects.get(j).getProjecttype());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[3];
        String[] str ={"审批","核准","备案"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String projecttype=str[m];
                value[m] = projectinfoMapper.countByprojecttype(projecttype);
                Change change = new Change(projecttype, value[m]);
                list.add(k,change);
                k++;
            }else {
                String projecttype=str[m];
                value[m]=0;
                Change change = new Change(projecttype, value[m]);
                list.add(k,change);
                k++;
            }
        }
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }

    @RequestMapping(value="/buildnature")
    @ResponseBody
    public String build() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<projects.size();j++){
            if(!list1.contains(projects.get(j).getBuildnature())){//从proinfo中取出prostatus的值
                list1.add(projects.get(j).getBuildnature());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[9];
        String[] str ={"新建","扩建","改建","改扩建","恢复","单纯购置","改造和技术改造","迁建","单纯建造生活措施"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String buildnature=str[m];
                value[m] = projectinfoMapper.countBybuildnature(buildnature);
                Change change = new Change(buildnature, value[m]);
                list.add(k,change);
                k++;
            }else {
                String buildnature=str[m];
                value[m]=0;
                Change change = new Change(buildnature, value[m]);
                list.add(k,change);
                k++;
            }
        }
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }


    @RequestMapping(value="/start" ,method = RequestMethod.POST)
    @ResponseBody
    public List<Integer> startend() {
        ArrayList<Integer> list1 = new ArrayList();//具体有几个状态类型
        Integer nstarttime=0;
        Integer nendtime=0;
        Integer arr[]={2016,2017,2018,2019,2020};
        for(int i=0;i<5;i++) {
            nstarttime = arr[i];
            nendtime = arr[i];
            list1.add(projectinfoMapper.countBynstarttime(nstarttime));
            list1.add(projectinfoMapper.countBynendtime(nendtime));

        }
        Integer max=0;
        for (int i=0;i<list1.size();i++){
            if(list1.get(i)>max){
                max=list1.get(i);
            }

        }

        list1.add(max);


        System.out.println("data:" + list1);
        return list1;

    }

    //invest
    @RequestMapping(value="/frprojectinvest")
    @ResponseBody
    public String frprojectinvest() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<projects.size();j++){
            if(!list1.contains(projects.get(j).getMoneyyear())){//从proinfo中取出prostatus的值
                list1.add(projects.get(j).getMoneyyear());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[6];
        String[] str ={"2015","2016","2017","2018","2019","2020"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String moneyyear=str[m];
                value[m] = projectinfoMapper.countBymoneyyear(moneyyear);
                Change change = new Change(moneyyear, value[m]);
                list.add(k,change);
                k++;
            }else {
                String moneyyear=str[m];
                value[m]=0;
                Change change = new Change(moneyyear, value[m]);
                list.add(k,change);
                k++;
            }
        }

        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }
    //invest

    @RequestMapping(value="/buildplace")
    @ResponseBody
    public String map() {
        List<Change> list = new ArrayList();//最终json格式
        List<String> list1 = new ArrayList();//具体有几个状态类型
        List<Projectinfo> projects = projectinfoMapper.selectall();//查所有proinfo项目

        for (int j=0;j<projects.size();j++){
            if(!list1.contains(projects.get(j).getBuildplace())){//从proinfo中取出prostatus的值
                list1.add(projects.get(j).getBuildplace());//将取出的值放入list1
            }
        }
        System.out.println(list1);
        int k= 0;
        int[] value = new int[34];
        String[] str ={"河北","山西","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","海南",
                "四川","贵州","云南","陕西","甘肃","青海","台湾", "内蒙古","广西","西藏","宁夏","新疆","北京","天津","上海","重庆","香港","澳门"};
        for(int m=0;m<str.length;m++){
            if(list1.contains(str[m])){
                String buildplcae=str[m];
                value[m] = projectinfoMapper.countBybuildplace(buildplcae);
                Change change = new Change(buildplcae, value[m]);
                list.add(k,change);
                k++;
            }else {
                String buildplace=str[m];
                value[m]=0;
                Change change = new Change(buildplace, value[m]);
                list.add(k,change);
                k++;
            }
        }

        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }
    //project
    //question
    @GetMapping("/frquesview")
    public String frquesviewPage(Model model) {
        model.addAttribute("countsum",quesMapper.countsum());//
        model.addAttribute("countxinxi",quesMapper.countinfo());//
        model.addAttribute("countdiaodu",quesMapper.countdis());//
        model.addAttribute("countqianqi",quesMapper.countpro());//
        return "faren/view-question";
    }
    @PostMapping("/frquesview")
    public String frquesview() {
        return "faren/view-question";
    }

    @RequestMapping(value="/frques")
    @ResponseBody
    public String frques() {

        List<Integer> list = new ArrayList();//最终json格式

        LambdaQueryWrapper<Ques> lambdaq1 =  Wrappers.<Ques>lambdaQuery();
        lambdaq1.like(Ques::getQstatus,"未申请").like(Ques::getQtype,"项目信息");
        int count1 = quesMapper.selectCount(lambdaq1);
        System.out.println("项目信息未申请"+count1);
        list.add(count1);
        LambdaQueryWrapper<Ques> lambdaq2 =  Wrappers.<Ques>lambdaQuery();
        lambdaq2.like(Ques::getQstatus,"已申请").like(Ques::getQtype,"项目信息");
        int count2 = quesMapper.selectCount(lambdaq2);
        System.out.println("项目信息已申请"+count2);
        list.add(count2);
        LambdaQueryWrapper<Ques> lambdaq3 =  Wrappers.<Ques>lambdaQuery();
        lambdaq3.like(Ques::getQstatus,"未处理").like(Ques::getQtype,"项目信息");
        int count3 = quesMapper.selectCount(lambdaq3);
        System.out.println("项目信息未处理"+count3);
        list.add(count3);
        LambdaQueryWrapper<Ques> lambdaq4 =  Wrappers.<Ques>lambdaQuery();
        lambdaq4.like(Ques::getQstatus,"已处理").like(Ques::getQtype,"项目信息");
        int count4 = quesMapper.selectCount(lambdaq4);
        System.out.println("项目信息已处理"+count4);
        list.add(count3);
        LambdaQueryWrapper<Ques> lambdaq5 =  Wrappers.<Ques>lambdaQuery();
        lambdaq5.like(Ques::getQstatus,"结项").like(Ques::getQtype,"项目信息");
        int count5 = quesMapper.selectCount(lambdaq5);
        System.out.println("项目信息结项"+count5);
        list.add(count5);

        LambdaQueryWrapper<Ques> lambdaq6 =  Wrappers.<Ques>lambdaQuery();
        lambdaq6.like(Ques::getQstatus,"未申请").like(Ques::getQtype,"项目调度");
        int count6 = quesMapper.selectCount(lambdaq6);
        list.add(count6);
        LambdaQueryWrapper<Ques> lambdaq7 =  Wrappers.<Ques>lambdaQuery();
        lambdaq7.like(Ques::getQstatus,"已申请").like(Ques::getQtype,"项目调度");
        int count7 = quesMapper.selectCount(lambdaq7);
        list.add(count7);
        LambdaQueryWrapper<Ques> lambdaq8=  Wrappers.<Ques>lambdaQuery();
        lambdaq8.like(Ques::getQstatus,"未处理").like(Ques::getQtype,"项目调度");
        int count8 = quesMapper.selectCount(lambdaq8);
        list.add(count8);
        LambdaQueryWrapper<Ques> lambdaq9 =  Wrappers.<Ques>lambdaQuery();
        lambdaq9.like(Ques::getQstatus,"已处理").like(Ques::getQtype,"项目调度");
        int count9 = quesMapper.selectCount(lambdaq9);
        list.add(count9);
        LambdaQueryWrapper<Ques> lambdaq10 =  Wrappers.<Ques>lambdaQuery();
        lambdaq10.like(Ques::getQstatus,"结项").like(Ques::getQtype,"项目调度");
        int count10 = quesMapper.selectCount(lambdaq10);
        list.add(count10);



//        String[] str ={"未处理","已申请","已处理","结项"};
//        for(int i=0;i<=str.length;i++){
//            String qstatus=str[i];
//            list.add(quesMapper.countprostatus(qstatus,"前期工作事项"));
//        }

//        List<String> list1 = new ArrayList();//具体有几个状态类型
//        List<Ques> ques = quesMapper.selectall();//查所有proinfo项目
//
//        for (int j=0;j<ques.size();j++){
//            if(!list1.contains(ques.get(j).getQstatus())){//从proinfo中取出prostatus的值
//                list1.add(ques.get(j).getQstatus());//将取出的值放入list1
//            }
//        }
//        System.out.println(list1);
//        int k= 0;
//        int[] value = new int[4];
//
//        for(int m=0;m<str.length;m++){
//            if(list1.contains(str[m])){
//                String qstatus =str[m];
//                value[m] = quesMapper.(qstatus);
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
        //疑问，如何取出最大值？？？？在前端作为max刻度
        String data = JSON.toJSONString(list);
        System.out.println("data:" + data);
        return data;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////faren





}
