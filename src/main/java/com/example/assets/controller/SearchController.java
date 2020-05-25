package com.example.assets.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.assets.entity.Projectinfo;
import com.example.assets.entity.Ques;
import com.example.assets.mapper.ProjectinfoMapper;
import com.example.assets.mapper.QuesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class SearchController {

    @Autowired
    private ProjectinfoMapper projectinfoMapper;
    @Autowired
    private QuesMapper quesMapper;

    //未报按条件查询
    @GetMapping("/faren/gl-weibao/{projectName}")
    public String gl_weibaoSearch(Model model,
                                  @PathVariable(value = "projectName") String projectName,
                                  @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "12") int pageSize){
        LambdaQueryWrapper<Projectinfo> lambdas = Wrappers.<Projectinfo>lambdaQuery();
        lambdas.eq(Projectinfo::getProjectstatus,"未报").and(wq->wq.like(Projectinfo::getProjectname,projectName)
                .or().eq(Projectinfo::getProjecttype,projectName).or().eq(Projectinfo::getIndustry,projectName));
        Page<Projectinfo> pagew = new Page<Projectinfo>(pageNum,pageSize);//展示页数及条数
        IPage<Projectinfo> iPagew = projectinfoMapper.selectPage(pagew,lambdas);//进行查询
        List<Projectinfo> pList = iPagew.getRecords();
        model.addAttribute("pList",pList);
        model.addAttribute("iPagew",iPagew);
        return "faren/gl-weibao";
    }

    //问题按条件查询
    @GetMapping("/faren/ques-list/{quesName}")
    public String ques_listSearch(Model model,
                                  @PathVariable(value = "quesName") String quesName,
                                  @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "12") int pageSize){
        LambdaQueryWrapper<Ques> lambdas = Wrappers.<Ques>lambdaQuery();
        lambdas.eq(Ques::getQtype,quesName).or().eq(Ques::getQstatus,quesName);
        Page<Ques> pagew = new Page<Ques>(pageNum,pageSize);//展示页数及条数
        IPage<Ques> iPagew = quesMapper.selectPage(pagew,lambdas);//进行查询
        List<Ques> qlist = iPagew.getRecords();
        model.addAttribute("qlist",qlist);
        model.addAttribute("iPagew",iPagew);
        return "faren/ques-list";
    }

    //调度按条件查询
}
