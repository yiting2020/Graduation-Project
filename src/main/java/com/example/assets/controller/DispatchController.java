package com.example.assets.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.assets.entity.Dispatch;
import com.example.assets.entity.Prodis;
import com.example.assets.entity.Projectinfo;
import com.example.assets.mapper.DispatchMapper;
import com.example.assets.mapper.ProdisMapper;
import com.example.assets.mapper.ProjectinfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
public class DispatchController {

    @Autowired
    private DispatchMapper dispatchMapper;
    @Autowired
    private ProjectinfoMapper projectinfoMapper;
    @Autowired
    private ProdisMapper prodisMapper;

    //**********************************************我是分割线************************************************************
    //**********************************************法人调度部分************************************************************

    //调度填报
    @GetMapping("/faren/dd-tianbao")
    public String dd_tiaobaoPage(Model model){
        model.addAttribute("dispatch", new Dispatch());
        return "faren/dd-tianbao";
    }
    @PostMapping("/faren/dd-tianbao")
    public String dd_tianbao(@ModelAttribute("dispatch") Dispatch dispatch,Model model){
        dispatch.setDispstatus("已填");
        dispatchMapper.insert(dispatch);
        return "faren/dd-tianbao";
    }
    //调度展示
    @GetMapping("/faren/dd-mytask")
    public String dd_mytaskPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                @ModelAttribute("prodis") Prodis prodis,
                                @ModelAttribute("projectInfo") Projectinfo projectinfo,
                                @ModelAttribute("dispatch") Dispatch dispatch, Model model){
        LambdaQueryWrapper<Prodis> lambdap = Wrappers.<Prodis>lambdaQuery();
        Page<Prodis> pagew = new Page<Prodis>(pageNum,pageSize);//展示页数及条数
        IPage<Prodis> iPagew = dispatchMapper.selectProdisPage(pagew,lambdap);//进行查询
        List<Prodis> listd = iPagew.getRecords();
        model.addAttribute("listd",listd);
        model.addAttribute("iPagew",iPagew);
        return "faren/dd-mytask";

    }
    @PostMapping("/faren/dd-mytask")
    public String dd_mytask(@ModelAttribute("prodis") Prodis prodis){
        return "faren/dd-mytask";
    }
    //调度详情展示
    @GetMapping("/faren/dispatch-page")
    public String dispatch(@RequestParam("did") Integer did,
                           @ModelAttribute("dispatch") Dispatch dispatch,
                           Model model){
        model.getAttribute("dispatch");
        LambdaQueryWrapper<Dispatch> lambdapaged = Wrappers.<Dispatch>lambdaQuery();
        lambdapaged.eq(Dispatch::getDid,did);
        Dispatch dispa = dispatchMapper.selectOne(lambdapaged);
        model.addAttribute("dispa",dispa);
        return "faren/dispatch-page";
    }

    //法人修改调度详情
    @PostMapping("/faren/dispatch-page")
    public String dispatch_page(@RequestParam("did") Integer did,
                                @ModelAttribute("dispatch") Dispatch dispatch,
                                Model model){
        model.getAttribute("dispatch");
        UpdateWrapper<Dispatch> updated = new UpdateWrapper<Dispatch>();
        updated.eq("did",did);
        dispatch.setDispstatus("已填");
        dispatchMapper.update(dispatch,updated);
        return "redirect:/faren/dd-mytask";
    }

    //已完成调度
    @GetMapping("/faren/dd-overtask")
    public String dd_overtaskPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                  @ModelAttribute("prodis") Prodis prodis,Model model){
        LambdaQueryWrapper<Prodis> lambdao = Wrappers.<Prodis>lambdaQuery();
        lambdao.like(Prodis::getDispstatus,"已完成");
        Page<Prodis> pagew = new Page<Prodis>(pageNum,pageSize);//展示页数及条数
        IPage<Prodis> iPagew = dispatchMapper.selectProdisPageo(pagew,lambdao);//进行查询
        List<Prodis> listd = iPagew.getRecords();
//        List<Prodis> listd = dispatchMapper.selectByStatuso(lambdao);
//        List<Prodis> listd = prodisMapper.selectById(lambdao);
        model.addAttribute("listd",listd);
        model.addAttribute("iPagew",iPagew);
        return "faren/dd-overtask";
    }

    @PostMapping("/faren/dd-overtask")
    public String dd_over(@ModelAttribute("prodis") Prodis prodis,Model model){
        return "faren/dd-overtask";
    }

    //调度详情
    @GetMapping("/faren/dispatch-fix")
    public String display_fixage(@RequestParam("did") Integer did,@ModelAttribute("dispatch") Dispatch dispatch ,Model model){
        LambdaQueryWrapper<Dispatch> lambdapaged = Wrappers.<Dispatch>lambdaQuery();
        lambdapaged.eq(Dispatch::getDid,did);
        Dispatch dispatchf = dispatchMapper.selectOne(lambdapaged);
        model.addAttribute("dispatchf",dispatchf);
        return "faren/dispatch-fix";
    }

    @PostMapping("/faren/dispatch-fix")
    public String diaplay_fix(@RequestParam("pid") Integer pid,@ModelAttribute("projectInfo") Projectinfo projectinfo,Model model){
        model.getAttribute("projectInfo");
        return "faren/dispatch-fix";
    }

    //**********************************************我是分割线************************************************************
    //**********************************************发改部门调度部分************************************************************

    //处理调度任务
    @GetMapping("/fagai/dd-handle")
    public String dd_handlePage(@RequestParam(value = "pageNum",
                                                defaultValue = "1") int pageNum,
                                @RequestParam(value = "pageSize",
                                                defaultValue = "12") int pageSize,
                                @ModelAttribute("prodis") Prodis prodis,
                                @ModelAttribute("projectInfo") Projectinfo projectinfo,
                                @ModelAttribute("dispatch") Dispatch dispatch,
                                Model model){
        LambdaQueryWrapper<Prodis> lambdap = Wrappers.<Prodis>lambdaQuery();
        Page<Prodis> pagew = new Page<Prodis>(pageNum,pageSize);//展示页数及条数
        IPage<Prodis> iPagew = dispatchMapper.selectProdisPagey(pagew,lambdap);//进行查询
        List<Prodis> listd = iPagew.getRecords();
        model.addAttribute("listd",listd);
        model.addAttribute("iPagew",iPagew);
        return "fagai/dd-handle";
    }
    @PostMapping("/fagai/dd-handle")
    public String dd_handle(@RequestBody List<Integer> id_list,
                            @ModelAttribute("dispatch") Dispatch dispatch ,
                            @ModelAttribute("prostage") Prodis prostage){
        for (int i=0;i<id_list.size();i++){
            UpdateWrapper<Dispatch> updated = new UpdateWrapper<Dispatch>();
            updated.eq("pid",id_list.get(i));
            dispatch.setDispstatus("结项");
            dispatchMapper.update(dispatch,updated);
        }
        return "fagai/dd-handle";
    }
    //调度任务列表
    @GetMapping("/fagai/dd-over")
    public String dd_overPage(@RequestParam(value = "pageNum",
                                            defaultValue = "1") int pageNum,
                              @RequestParam(value = "pageSize",
                                            defaultValue = "12") int pageSize,
                              @ModelAttribute("prodis") Prodis prodis,
                              @ModelAttribute("projectInfo") Projectinfo projectinfo,
                              @ModelAttribute("dispatch") Dispatch dispatch,
                              Model model){
        LambdaQueryWrapper<Prodis> lambdao = Wrappers.<Prodis>lambdaQuery();
        Page<Prodis> pagew = new Page<Prodis>(pageNum,pageSize);//展示页数及条数
        IPage<Prodis> iPagew = dispatchMapper.selectProdisPageo(pagew,lambdao);//进行查询
        List<Prodis> listd = iPagew.getRecords();
        model.addAttribute("listd",listd);
        model.addAttribute("iPagew",iPagew);
        return "fagai/dd-over";
    }

    @PostMapping("/fagai/dd-over")
    public String dd_over(){
        return "fagai/dd-over";
    }

    //发改调度详情展示
    @GetMapping("/fagai/dd-fix")
    public String dd_fix(@RequestParam("did") Integer did, @ModelAttribute("dispatch") Dispatch dispatch , Model model){
        model.getAttribute("dispatch");
        LambdaQueryWrapper<Dispatch> lambdafixd = Wrappers.<Dispatch>lambdaQuery();
        lambdafixd.eq(Dispatch::getDid,did);
        Dispatch dispaf = dispatchMapper.selectOne(lambdafixd);
        model.addAttribute("dispaf",dispaf);
        return "fagai/dd-fix";
    }

}
