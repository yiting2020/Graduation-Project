package com.example.assets.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.assets.entity.Proinfo;
import com.example.assets.entity.Prostage;
import com.example.assets.mapper.ProinfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class AlarmController {

    @Autowired
    private ProinfoMapper proinfoMapper;

    @GetMapping("/fagai/alarm-handle")
    public String alarm_handlePage(@RequestParam(value = "pageNum",
            defaultValue = "1") int pageNum,
                               @RequestParam(value = "pageSize",
                                       defaultValue = "12") int pageSize,
                               @ModelAttribute("proinfo") Proinfo proinfo ,
                               @ModelAttribute("prostage") Prostage prostage ,
                               Model model){
        LambdaQueryWrapper<Prostage> lambdap = Wrappers.<Prostage>lambdaQuery();
        Page<Prostage> pagew = new Page<Prostage>(pageNum,pageSize);
        IPage<Prostage> iPagew = proinfoMapper.selectProstageAlarm(pagew,lambdap);
        List<Prostage> listo = iPagew.getRecords();
        model.addAttribute("listo",listo);
        model.addAttribute("iPagew",iPagew);
        return "fagai/alarm-handle";
    }

    @GetMapping("/hangye/gz-alarm")
    public String gz_alarmPage(@RequestParam(value = "pageNum",
            defaultValue = "1") int pageNum,
                               @RequestParam(value = "pageSize",
                                       defaultValue = "12") int pageSize,
                               @ModelAttribute("proinfo") Proinfo proinfo ,
                               @ModelAttribute("prostage") Prostage prostage ,
                               Model model){
        LambdaQueryWrapper<Prostage> lambdap = Wrappers.<Prostage>lambdaQuery();
        Page<Prostage> pagew = new Page<Prostage>(pageNum,pageSize);
        IPage<Prostage> iPagew = proinfoMapper.selectProstageAlarm(pagew,lambdap);
        List<Prostage> lists = iPagew.getRecords();
        model.addAttribute("lists",lists);
        model.addAttribute("iPagew",iPagew);
        return "hangye/gz-alarm";
    }

    @PostMapping("/fagai/alarm-yellow")
    public String alarm_yellow(@RequestBody List<Integer> id_list,
                               @ModelAttribute("proInfo") Proinfo proinfo ,
                               @ModelAttribute("prostage") Prostage prostage){
        for (int i=0;i<id_list.size();i++){
            UpdateWrapper<Proinfo> updated = new UpdateWrapper<Proinfo>();
            updated.eq("pid",id_list.get(i));
            proinfo.setProstatus("黄色预警");
            proinfoMapper.update(proinfo,updated);
        }
        return "fagai/qq-handle";
    }

    @PostMapping("/fagai/alarm-red")
    public String alarm_red(@RequestBody List<Integer> id_list,
                            @ModelAttribute("proInfo") Proinfo proinfo ,
                            @ModelAttribute("prostage") Prostage prostage){
        for (int i=0;i<id_list.size();i++){
            UpdateWrapper<Proinfo> updated = new UpdateWrapper<Proinfo>();
            updated.eq("pid",id_list.get(i));
            proinfo.setProstatus("红色预警");
            proinfoMapper.update(proinfo,updated);
        }
        return "fagai/qq-handle";
    }
}
