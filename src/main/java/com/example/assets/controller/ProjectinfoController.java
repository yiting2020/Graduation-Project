package com.example.assets.controller;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.assets.entity.Dispatch;
import com.example.assets.entity.Proinfo;
import com.example.assets.entity.Projectinfo;
import com.example.assets.mapper.DispatchMapper;
import com.example.assets.mapper.ProinfoMapper;
import com.example.assets.mapper.ProjectinfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;
@Controller
public class ProjectinfoController {
    @Autowired
    private ProjectinfoMapper projectinfoMapper;
    @Autowired
    private DispatchMapper dispatchMapper;
    @Autowired
    private ProinfoMapper proinfoMapper;
    //法人部分
    //首页展示
    /*@GetMapping("/faren/index-fr")
    public String index_fr(@ModelAttribute("projectinfo") Projectinfo projectinfo, Model model,HttpSession session){
        model.addAttribute("projectinfo",projectinfo);
        String username = (String) session.getAttribute("login");
        return "faren/index-fr";
    }*/
    //填报
    @GetMapping("/faren/gl-tianbao")
    public String gl_tianbaoPage(Model model){
        model.addAttribute("projectInfo",new Projectinfo());
        return "faren/gl-tianbao";
    }
    @PostMapping("/faren/gl-tianbao")
    public String gl_tianbao(@ModelAttribute("projectinfo") Projectinfo projectinfo, Model model){
        projectinfo.setProjectstatus("未报");
        projectinfoMapper.insert(projectinfo);
        return "redirect:/faren/gl-weibao";
    }
    //未报展示
    @GetMapping("/faren/gl-weibao")
    public String gl_weibaoPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                @ModelAttribute("projectInfo") Projectinfo projectinfo ,Model model){
        model.addAttribute("projectinfo",projectinfo);
        LambdaQueryWrapper<Projectinfo> lambdaw = Wrappers.<Projectinfo>lambdaQuery();
        lambdaw.like(Projectinfo::getProjectstatus,"未报");//查询条件
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,lambdaw);//进行查询
        List<Projectinfo> pList = iPagew.getRecords();
        long pagetotal = iPagew.getTotal();
        long pagecount = iPagew.getPages();
        System.out.println("总条数:"+pagetotal);
        System.out.println("页数:"+pagecount);
//        List<Projectinfo> pList = projectinfoMapper.selectList(lambdaw);
        model.addAttribute("pList",pList);
        model.addAttribute("iPagew",iPagew);
        return "faren/gl-weibao";
    }

    @PostMapping("/faren/gl-weibao")
    public String gl_weibao(@ModelAttribute("projectInfo") Projectinfo projectinfo ,@RequestBody List<Integer> id_list) {
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Projectinfo> updatey = new UpdateWrapper<Projectinfo>();
            updatey.eq("pid", id_list.get(i));
            Projectinfo pinfo = new Projectinfo();
            pinfo.setProjectstatus("已报");
            projectinfoMapper.update(pinfo, updatey);
        }
        return "redirect:/faren/gl-yibao";
    }



    //删除未报
    @GetMapping("/faren/gl-delweibao")
    public String gl_delweibaoPage(@ModelAttribute("projectInfo") Projectinfo projectinfo ,Model model){
        return "redirect:/faren/gl-weibao";
    }
    @PostMapping("/faren/gl-delweibao")
    public String gl_delweibao(@RequestBody List<Integer> id_list,Model model){
        LambdaQueryWrapper<Projectinfo> lambdadel = Wrappers.<Projectinfo>lambdaQuery();
        //循环删除
        for (int i =0;i< id_list.size();i++) {
            lambdadel.eq(Projectinfo::getPid,id_list.get(i));
            projectinfoMapper.delete(lambdadel);
        }
        return "faren/gl-weibao";
    }
    //未报项目详情
    @GetMapping("/faren/display-page")
    public String display_page(@RequestParam("pid") Integer pid,
                               @ModelAttribute("projectInfo") Projectinfo projectinfo,
                               Model model){
        LambdaQueryWrapper<Projectinfo> lambdapage = Wrappers.<Projectinfo>lambdaQuery();
        lambdapage.eq(Projectinfo::getPid,pid);
        Projectinfo projectInfo = projectinfoMapper.selectOne(lambdapage);
        model.addAttribute("projectInfo",projectInfo);
        return "faren/display-page";
    }
    @PostMapping("/faren/display-page")
    public String diaplay(@RequestParam("pid") Integer pid,@ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        model.getAttribute("projectInfo");
        UpdateWrapper<Projectinfo> updatep = new UpdateWrapper<Projectinfo>();
        updatep.eq("pid",pid);
        projectinfoMapper.update(projectinfo,updatep);
        return "redirect:/faren/gl-weibao";
    }
    //已报展示
    @GetMapping("/faren/gl-yibao")
    public String gl_yibaoPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                               @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                               @ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        model.addAttribute("projectinfo",projectinfo);
        LambdaQueryWrapper<Projectinfo> lambday = Wrappers.<Projectinfo>lambdaQuery();
        lambday.like(Projectinfo::getProjectstatus,"已报");
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,lambday);//进行查询
        List<Projectinfo> yList = iPagew.getRecords();
        /*List<Projectinfo> yList = projectinfoMapper.selectList(lambday);*/
        model.addAttribute("yList",yList);
        model.addAttribute("iPagew",iPagew);
        return "faren/gl-yibao";
    }
    @PostMapping("/faren/gl-yibao")
    public String gi_yibao(@ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        model.addAttribute("projectinfo",projectinfo);
        return "faren/gl-yibao";
    }
    //已报项目详情
    @GetMapping("/faren/display-fix")
    public String display_fixPage(@RequestParam("pid") Integer pid,
                                  @ModelAttribute("projectInfo") Projectinfo projectinfo ,Model model){
        LambdaQueryWrapper<Projectinfo> lambdapage = Wrappers.<Projectinfo>lambdaQuery();
        lambdapage.eq(Projectinfo::getPid,pid);
        Projectinfo projectInfo = projectinfoMapper.selectOne(lambdapage);
        model.addAttribute("projectInfo",projectInfo);
        return "faren/display-fix";
    }
    @PostMapping("/faren/display-fix")
    public String diaplay_fix(@ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        model.getAttribute("projectInfo");
        return "faren/display-fix";
    }
    //项目审核结果
    @GetMapping("/faren/gl-shenhe")
    public String gl_shenhePage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                @ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        model.addAttribute("projectinfo",projectinfo);
        LambdaQueryWrapper<Projectinfo> lambday = Wrappers.<Projectinfo>lambdaQuery();
        lambday.like(Projectinfo::getProjectstatus,"审核");
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,lambday);//进行查询
        List<Projectinfo> yList = iPagew.getRecords();
        /*List<Projectinfo> yList = projectinfoMapper.selectList(lambday)*/;
        model.addAttribute("yList",yList);
        model.addAttribute("iPagew",iPagew);
        return "faren/gl-shenhe";
    }
    @PostMapping("/faren/gl-shenhe")
    public String gl_shenhe(){
        return "faren/gl-shenhe";
    }

    //**********************************************我是分割线************************************************************
    //**********************************************法人未用到部分************************************************************

    //已报->未报
    @GetMapping("/faren/gl-reyibao")
    public String gl_reyibaoPage(@ModelAttribute("projectinfo") Projectinfo projectinfo,Model model){
        model.addAttribute("projectinfo",projectinfo);
        return "faren/gl-weibao";
    }

    @PostMapping("/faren/gl-reyibao")
    public String gl_reyibao(@RequestBody List<Integer> id_list,Model model){
        //循环修改
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Projectinfo> updatere = new UpdateWrapper<Projectinfo>();
            updatere.eq("pid", id_list.get(i));
            Projectinfo pinfo = new Projectinfo();
            pinfo.setProjectstatus("未报");
            projectinfoMapper.update(pinfo, updatere);
        }
        return "faren/gl-weibao";
    }


    //**********************************************我是分割线************************************************************
    //**********************************************发改部分************************************************************

    //发改首页
    /*@GetMapping("/fagai/index-fg")
    public  String index_fgPage(){
        return "fagai/index-fg";
    }*/

    @PostMapping("/fagai/index-fg")
    public String index_fg(){
        return "fagai/index-fg";
    }

    //发改页面项目详情展示，不可修改
    @GetMapping("/fagai/pinfofix-fg")
    public String pinfofix_fg(@RequestParam("pid") Integer pid,@ModelAttribute("projectInfo") Projectinfo projectinfo ,Model model){
        LambdaQueryWrapper<Projectinfo> lambdapage = Wrappers.<Projectinfo>lambdaQuery();
        lambdapage.eq(Projectinfo::getPid,pid);
        Projectinfo projectInfo = projectinfoMapper.selectOne(lambdapage);
        model.addAttribute("projectInfo",projectInfo);
        return "fagai/pinfofix-fg";
    }

    //发改页面项目详情，还可修改
    @GetMapping("/fagai/pinfo-fg")
    public String pinfo_fgPage(@RequestParam("pid") Integer pid,@ModelAttribute("projectInfo") Projectinfo projectinfo ,Model model){
        LambdaQueryWrapper<Projectinfo> lambdapage = Wrappers.<Projectinfo>lambdaQuery();
        lambdapage.eq(Projectinfo::getPid,pid);
        Projectinfo projectInfo = projectinfoMapper.selectOne(lambdapage);
        model.addAttribute("projectInfo",projectInfo);
        return "fagai/pinfo-fg";
    }

    @PostMapping("/fagai/pinfo-fg")
    public String pinfo_fg(@RequestParam("pid") Integer pid,@ModelAttribute("projectInfo") Projectinfo projectInfo,Model model){
        model.getAttribute("projectInfo");
        UpdateWrapper<Projectinfo> updatep = new UpdateWrapper<Projectinfo>();
        updatep.eq("pid",pid);
        projectinfoMapper.update(projectInfo,updatep);
        return "redirect:/fagai/sh-none";//修改后跳转
    }

    //项目审核
    @GetMapping("/fagai/sh-none")
    public String sh_nonePage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                              @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                              @ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        LambdaQueryWrapper<Projectinfo> lambdan = Wrappers.<Projectinfo>lambdaQuery();
        lambdan.like(Projectinfo::getProjectstatus,"已报");
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,lambdan);//进行查询
        List<Projectinfo> nList = iPagew.getRecords();
       /* List<Projectinfo> nList = projectinfoMapper.selectList(lambdan);*/
        model.addAttribute("nList",nList);
        model.addAttribute("iPagew",iPagew);
        return "fagai/sh-none";
    }
    //项目审核通过之后生成调度和前期事项
    @PostMapping("/fagai/sh-none")
    public String sh_none(@RequestBody List<Integer> id_list,Model model){
        //循环生成
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Projectinfo> updaten = new UpdateWrapper<Projectinfo>();
            updaten.eq("projectstatus","已报");
            updaten.eq("pid", id_list.get(i));
            Projectinfo pname = projectinfoMapper.selectOne(updaten);
            Projectinfo pinfo = new Projectinfo();
            pinfo.setProjectstatus("审核通过");
            projectinfoMapper.update(pinfo,updaten);
            //形成项目调度
            Dispatch dispatch = new Dispatch();
            dispatch.setReportname("发改投资[2020]第"+id_list.get(i)+"号项目调度");//调度名称不能为空
            dispatch.setDispstatus("未填");//新调度的调度填报状态是未填写
            dispatch.setPid(id_list.get(i));//调度中获取并设置项目的pid
            dispatch.setProjectname(pname.getProjectname());
            dispatchMapper.insert(dispatch);//将这个调度插入数据库
            //形成前期事项
            Proinfo proinfo = new Proinfo();
            proinfo.setProname("发改投资[2020]第"+id_list.get(i)+"号前期工作事项");
            proinfo.setProstatus("未填");
            proinfo.setPid(id_list.get(i));
            proinfo.setProjectname(pname.getProjectname());
            proinfoMapper.insert(proinfo);
        }
        return "fagai/sh-over";//跳转审核完成界面
    }

    //已审核（审核通过）
    @GetMapping("/fagai/sh-over")
    public String sh_overPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                              @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                              @ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        LambdaQueryWrapper<Projectinfo> wrappero = Wrappers.<Projectinfo>lambdaQuery();
        wrappero.like(Projectinfo::getProjectstatus,"审核通过");
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,wrappero);//进行查询
        List<Projectinfo> nList = iPagew.getRecords();
        /*List<Projectinfo> nList = projectinfoMapper.selectList(wrappero);*/
        model.addAttribute("nList",nList);
        model.addAttribute("iPagew",iPagew);
        return "fagai/sh-over";
    }

    @PostMapping("/fagai/sh-over")
    public String sh_over(@RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Projectinfo> updateo = new UpdateWrapper<Projectinfo>();
            updateo.eq("projectstatus","审核通过");
            updateo.eq("pid", id_list.get(i));
            Projectinfo pinfo = new Projectinfo();
            pinfo.setProjectstatus("预备项目");//审核通过项目成为预备项目
            projectinfoMapper.update(pinfo,updateo);
        }
        return "fagai/sh-over";
    }

    //审核失败
    @GetMapping("/fagai/sh-fail")
    public String sh_failPage(){
        return "fagai/sh-none";
    }

    @PostMapping("/fagai/sh-fail")
    public String sh_fail(@RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++){
            UpdateWrapper<Projectinfo> updatef = new UpdateWrapper<Projectinfo>();
            updatef.eq("projectstatus","已报");
            updatef.eq("pid", id_list.get(i));
            Projectinfo pinfo = new Projectinfo();
            pinfo.setProjectstatus("审核失败");
            projectinfoMapper.update(pinfo,updatef);
        }
        return "fagai/sh-none";
    }

    //入库
    @GetMapping("/fagai/rk-ready")
    public String rk_readyPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                               @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                               @ModelAttribute("projectinfo") Projectinfo projectinfo,Model model){
        LambdaQueryWrapper<Projectinfo> lambdar = Wrappers.<Projectinfo>lambdaQuery();
        lambdar.like(Projectinfo::getProjectstatus,"预备项目");
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,lambdar);//进行查询
        List<Projectinfo> nList = iPagew.getRecords();
//        List<Projectinfo> nList = projectinfoMapper.selectList(lambdar);
        model.addAttribute("nList",nList);
        model.addAttribute("iPagew",iPagew);
        return "fagai/rk-ready";
    }
    //预备项目->当前年度
    @PostMapping("/fagai/rk-ready")
    public String rk_ready(@RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Projectinfo> updateo = new UpdateWrapper<Projectinfo>();
            updateo.eq("projectstatus","预备项目");
            updateo.eq("pid", id_list.get(i));
            Projectinfo pinfo = new Projectinfo();
            pinfo.setProjectstatus("当前年度");
            projectinfoMapper.update(pinfo,updateo);
        }
        return "fagai/rk-ready";
    }
    //预备项目退库
    @GetMapping("/fagai/sh-overback")
    public String sh_overbackPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                  @ModelAttribute("projectinfo") Projectinfo projectinfo,Model model){
        LambdaQueryWrapper<Projectinfo> lambdarob = Wrappers.<Projectinfo>lambdaQuery();
        lambdarob.like(Projectinfo::getProjectstatus,"审核通过");
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,lambdarob);//进行查询
        List<Projectinfo> nList = iPagew.getRecords();
//        List<Projectinfo> nList = projectinfoMapper.selectList(lambdarob);
        model.addAttribute("nList",nList);
        model.addAttribute("iPagew",iPagew);
        return "fagai/sh-over";
    }
    //预备项目退库（预备项目->审核通过）
    @PostMapping("/fagai/sh-overback")
    public String sh_overback(@RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Projectinfo> updateback = new UpdateWrapper<Projectinfo>();
            updateback.eq("projectstatus","预备项目");
            updateback.eq("pid", id_list.get(i));
            Projectinfo pinfo = new Projectinfo();
            pinfo.setProjectstatus("审核通过");
            projectinfoMapper.update(pinfo, updateback);
        }
        return "fagai/sh-over";
    }
    //当前年度
    @GetMapping("/fagai/rk-now")
    public String rk_nowPage(@RequestParam(value = "pageNum",
                                            defaultValue = "1") int pageNum,
                             @RequestParam(value = "pageSize",
                                            defaultValue = "12") int pageSize,
                             @ModelAttribute("projectInfo") Projectinfo projectinfo,
                             Model model){
        LambdaQueryWrapper<Projectinfo> lambdarn = Wrappers.<Projectinfo>lambdaQuery();
        lambdarn.like(Projectinfo::getProjectstatus,"当前年度");
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,lambdarn);//进行查询
        List<Projectinfo> nList = iPagew.getRecords();
        model.addAttribute("nList",nList);
        model.addAttribute("iPagew",iPagew);
        return "fagai/rk-now";
    }
    //当前年度->历史年度（往前）
    @PostMapping("/fagai/rk-now")
    public String rk_now(@RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Projectinfo> updatern = new UpdateWrapper<Projectinfo>();
            updatern.eq("projectstatus","当前年度");
            updatern.eq("pid", id_list.get(i));
            Projectinfo pinfo = new Projectinfo();
            pinfo.setProjectstatus("历史年度");
            projectinfoMapper.update(pinfo,updatern);
        }
        return "fagai/rk-history";
    }
    //当前年度->预备项目（往后）
    @GetMapping("/fagai/rk-backready")
    public String rk_backreadyPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                   @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                   @ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        LambdaQueryWrapper<Projectinfo> lambdarb = Wrappers.<Projectinfo>lambdaQuery();
        lambdarb.like(Projectinfo::getProjectstatus,"预备项目");
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,lambdarb);//进行查询
        List<Projectinfo> nList = iPagew.getRecords();
//        List<Projectinfo> nList = projectinfoMapper.selectList(lambdarb);
        model.addAttribute("nList",nList);
        model.addAttribute("iPagew",iPagew);
        return "fagai/rk-ready";
    }
    @PostMapping("/fagai/rk-backready")
    public String rk_backready(@RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Projectinfo> updatern = new UpdateWrapper<Projectinfo>();
            updatern.eq("projectstatus","当前年度");
            updatern.eq("pid", id_list.get(i));
            Projectinfo pinfo = new Projectinfo();
            pinfo.setProjectstatus("预备项目");
            projectinfoMapper.update(pinfo,updatern);
        }
        return "fagai/rk-ready";
    }
    //历史年度
    @GetMapping("/fagai/rk-history")
    public String rk_historyPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                 @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                 @ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        LambdaQueryWrapper<Projectinfo> lambdarhis = Wrappers.<Projectinfo>lambdaQuery();
        lambdarhis.like(Projectinfo::getProjectstatus,"历史年度");
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,lambdarhis);//进行查询
        List<Projectinfo> nList = iPagew.getRecords();
//        List<Projectinfo> nList = projectinfoMapper.selectList(lambdarhis);
        model.addAttribute("nList",nList);
        model.addAttribute("iPagew",iPagew);
        return "fagai/rk-history";
    }
    @PostMapping("/fagai/rk-history")
    public String rk_history(@ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        return "fagai/rk-history";
    }

    //**********************************************我是分割线**********************************************************
    //******************************************行业主管部门项目部分****************************************************

    //行业主管部项目信息展示
    @GetMapping("/hangye/pinfofix-hy")
    public String pinfofix_hy(@RequestParam("pid") Integer pid,@ModelAttribute("projectInfo") Projectinfo projectinfo ,Model model){
        LambdaQueryWrapper<Projectinfo> lambdapage = Wrappers.<Projectinfo>lambdaQuery();
        lambdapage.eq(Projectinfo::getPid,pid);
        Projectinfo projectInfo = projectinfoMapper.selectOne(lambdapage);
        model.addAttribute("projectInfo",projectInfo);
        return "hangye/pinfofix-hy";
    }
}
