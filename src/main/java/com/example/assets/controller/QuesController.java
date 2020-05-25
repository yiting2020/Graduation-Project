package com.example.assets.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.assets.entity.Ques;
import com.example.assets.mapper.QuesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class QuesController {

    @Autowired
    private QuesMapper quesMapper;

    //**********************************************我是分割线************************************************************
    //**********************************************法人部分************************************************************

    //问题填报
    @GetMapping("/faren/ques-tianbao")
    public String ques_tianbaoPage(Model model){
        model.addAttribute("ques",new Ques());
        return "faren/ques-tianbao";
    }

    @PostMapping("/faren/ques-tianbao")
    public String ques_tianbao(@ModelAttribute("ques") Ques ques,Model model){
        ques.setQstatus("未申请");
        quesMapper.insert(ques);//实体插入
        return "redirect:/faren/ques-list";
    }

    @PostMapping("/faren/gl-delques")
    public String fr_delques(@RequestBody List<Integer> id_list,Model model){
        LambdaQueryWrapper<Ques> lambdadelq = Wrappers.<Ques>lambdaQuery();
        //循环删除
        for (int i =0;i< id_list.size();i++) {
            lambdadelq.eq(Ques::getQid,id_list.get(i));//选择器选择条件
            quesMapper.delete(lambdadelq);
        }
        return "faren/ques-list";
    }

    //问题详情
    @GetMapping("/faren/ques-display")
    public String display_page(@RequestParam("qid") Integer qid, @ModelAttribute("ques") Ques ques , Model model){
        LambdaQueryWrapper<Ques> lambdaqpage = Wrappers.<Ques>lambdaQuery();

        lambdaqpage.eq(Ques::getQid,qid);
        Ques quesd = quesMapper.selectOne(lambdaqpage);//selectone id weiyi
        model.addAttribute("quesd",quesd);
        return "faren/ques-display";
    }

    @PostMapping("/faren/ques-display")
    public String diaplay(@RequestParam("qid") Integer qid,@ModelAttribute("ques") Ques ques,Model model){
        model.getAttribute("ques");
        UpdateWrapper<Ques> updatep = new UpdateWrapper<Ques>();
        updatep.eq("qid",qid);
        quesMapper.update(ques,updatep);
        return "redirect:/faren/ques-list";
    }

    //问题办理清单
    @GetMapping("/faren/ques-list")
    public String ques_listPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                Model model){
        Ques ques = new Ques();
        LambdaQueryWrapper<Ques> lambdaq =  Wrappers.<Ques>lambdaQuery();
        lambdaq.like(Ques::getQstatus,"申请").like(Ques::getQtype,"项目");
        Page<Ques> pagew = new Page<Ques>(pageNum,pageSize);//展示页数及条数
        IPage<Ques> iPagew = quesMapper.selectPage(pagew,lambdaq);//进行查询
        List<Ques> qlist = iPagew.getRecords();
//        List<Ques> qlist = quesMapper.selectList(lambdaq);
        model.addAttribute("qlist",qlist);
        model.addAttribute("iPagew",iPagew);
        return "faren/ques-list";
    }

    @PostMapping("/faren/ques-list")
    public String ques_list(@ModelAttribute("ques") Ques ques, @RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Ques> updateq = new UpdateWrapper<Ques>();
            updateq.eq("qid", id_list.get(i));
            ques.setQstatus("已申请");
            quesMapper.update(ques,updateq);
        }
        return "redirect:/faren/ques-list";
    }



    //问题处理
    @GetMapping("/faren/ques-handle")
    public String ques_handlePage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                  @ModelAttribute("ques") Ques ques,Model model){
        model.addAttribute("ques",ques);
        LambdaQueryWrapper<Ques> lambdaq =  Wrappers.<Ques>lambdaQuery();
        lambdaq.like(Ques::getQstatus,"已处理").like(Ques::getQtype,"项目");
        int count = quesMapper.selectCount(lambdaq);
        Page<Ques> pagew = new Page<Ques>(pageNum,pageSize);//展示页数及条数
        IPage<Ques> iPagew = quesMapper.selectPage(pagew,lambdaq);//进行查询
        List<Ques> qlist = iPagew.getRecords();
//        List<Ques> qlist = quesMapper.selectList(lambdaq);
        model.addAttribute("qlist",qlist);
        model.addAttribute("iPagew",iPagew);
        return "faren/ques-handle";
    }

    @PostMapping("/faren/ques-handle")
    public String ques_handle(@ModelAttribute("ques") Ques ques, @RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Ques> updateq = new UpdateWrapper<Ques>();
            updateq.eq("qid", id_list.get(i));
            ques.setQstatus("结项");
            quesMapper.update(ques,updateq);
        }
        return "redirect:/faren/ques-over";
    }

    //问题办理清单
    @GetMapping("/faren/ques-over")
    public String ques_overPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                @ModelAttribute("ques") Ques ques,Model model){
        LambdaQueryWrapper<Ques> lambdaq =  Wrappers.<Ques>lambdaQuery();
        lambdaq.like(Ques::getQstatus,"结项").like(Ques::getQtype,"项目");
        Page<Ques> pagew = new Page<Ques>(pageNum,pageSize);//展示页数及条数
        IPage<Ques> iPagew = quesMapper.selectPage(pagew,lambdaq);//进行查询
        List<Ques> qlist = iPagew.getRecords();
//        List<Ques> qlist = quesMapper.selectList(lambdaq);
        model.addAttribute("qlist",qlist);
        model.addAttribute("iPagew",iPagew);
        return "faren/ques-over";
    }

    @PostMapping("/faren/ques-over")
    public String ques_over(@ModelAttribute("ques") Ques ques,Model model){
        return "faren/ques-over";
    }

    //问题详情展示
    @GetMapping("/faren/ques-fix")
    public String ques_fixPage(@RequestParam("qid") Integer qid, @ModelAttribute("ques") Ques ques , Model model){
        LambdaQueryWrapper<Ques> lambdaqfix = Wrappers.<Ques>lambdaQuery();
        lambdaqfix.eq(Ques::getQid,qid);
        Ques quesd = quesMapper.selectOne(lambdaqfix);
        model.addAttribute("quesd",quesd);
        return "faren/ques-fix";
    }

    @PostMapping("/faren/ques-fix")
    public String ques_fix(){
        return "faren/ques-fix";
    }

    //**********************************************我是分割线************************************************************
    //**********************************************发改部分************************************************************

    //发改显示待处理问题
    @GetMapping("/fagai/quesfg-list")
    public String quesfg_listPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                  @ModelAttribute("ques") Ques ques,Model model){
        model.addAttribute("ques",ques);
        LambdaQueryWrapper<Ques> lambdaq =  Wrappers.<Ques>lambdaQuery();
        lambdaq.like(Ques::getQstatus,"已申请");
        ques.setQstatus("未处理");
        Page<Ques> pagew = new Page<Ques>(pageNum,pageSize);//展示页数及条数
        IPage<Ques> iPagew = quesMapper.selectPage(pagew,lambdaq);//进行查询
        List<Ques> qlist = iPagew.getRecords();
//        List<Ques> qlist = quesMapper.selectList(lambdal);
        model.addAttribute("qlist",qlist);
        model.addAttribute("iPagew",iPagew);
        return "fagai/quesfg-list";
    }

    @PostMapping("/fagai/quesfg-list")
    public String quesfg_list(@ModelAttribute("ques") Ques ques, @RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Ques> updateq = new UpdateWrapper<Ques>();
            updateq.eq("qid", id_list.get(i));
            ques.setQstatus("已处理");
            quesMapper.update(ques,updateq);
        }
        return "redirect:/fagai/quesfg-handle";
    }

    //发改处理问题
    @GetMapping("/fagai/quesfg-handle")
    public String quesfg_handlePage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                    @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                    @ModelAttribute("ques") Ques ques,Model model){
        model.addAttribute("ques",ques);
        LambdaQueryWrapper<Ques> lambdaq =  Wrappers.<Ques>lambdaQuery();
        lambdaq.like(Ques::getQstatus,"已处理");
        Page<Ques> pagew = new Page<Ques>(pageNum,pageSize);//展示页数及条数
        IPage<Ques> iPagew = quesMapper.selectPage(pagew,lambdaq);//进行查询
        List<Ques> qlist = iPagew.getRecords();
//        List<Ques> qlist = quesMapper.selectList(lambdaq);
        model.addAttribute("qlist",qlist);
        model.addAttribute("iPagew",iPagew);
        return "fagai/quesfg-handle";
    }

    @PostMapping("/fagai/quesfg-handle")
    public String quesfg_handle(@ModelAttribute("ques") Ques ques, @RequestBody List<Integer> id_list,Model model){

        return "fagai/quesfg-handle";
    }

    //发改显示结项问题
    @GetMapping("/fagai/quesfg-over")
    public String quesfg_overPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                  @ModelAttribute("ques") Ques ques,Model model){
        model.addAttribute("ques",ques);
        LambdaQueryWrapper<Ques> lambdaq =  Wrappers.<Ques>lambdaQuery();
        lambdaq.like(Ques::getQstatus,"结项");
        Page<Ques> pagew = new Page<Ques>(pageNum,pageSize);//展示页数及条数
        IPage<Ques> iPagew = quesMapper.selectPage(pagew,lambdaq);//进行查询
        List<Ques> qlist = iPagew.getRecords();
//        List<Ques> qlist = quesMapper.selectList(lambdaq);
        model.addAttribute("qlist",qlist);
        model.addAttribute("iPagew",iPagew);
        return "fagai/quesfg-over";
    }

    @PostMapping("/fagai/quesfg-over")
    public String quesfg_over(@ModelAttribute("ques") Ques ques,Model model){

        return "fagai/quesfg-over";
    }

    //问题详情
    @GetMapping("/fagai/quesfg-display")
    public String displayfg_page(@RequestParam("qid") Integer qid, @ModelAttribute("ques") Ques ques , Model model){
        LambdaQueryWrapper<Ques> lambdaqpage = Wrappers.<Ques>lambdaQuery();
        lambdaqpage.eq(Ques::getQid,qid);
        Ques quesfgd = quesMapper.selectOne(lambdaqpage);
        model.addAttribute("quesfgd",quesfgd);
        return "fagai/quesfg-display";
    }

    @PostMapping("/fagai/quesfg-display")
    public String diaplayfg(@RequestParam("qid") Integer qid,@ModelAttribute("ques") Ques ques,Model model){
        model.getAttribute("ques");
        UpdateWrapper<Ques> updatep = new UpdateWrapper<Ques>();
        updatep.eq("qid",qid);
        quesMapper.update(ques,updatep);
        return "redirect:/fagai/quesfg-list";
    }

    //问题详情展示
    @GetMapping("/fagai/quesfg-fix")
    public String fixfg_page(@RequestParam("qid") Integer qid, @ModelAttribute("ques") Ques ques , Model model){
        LambdaQueryWrapper<Ques> lambdaqpage = Wrappers.<Ques>lambdaQuery();
        lambdaqpage.eq(Ques::getQid,qid);
        Ques quesfg = quesMapper.selectOne(lambdaqpage);
        model.addAttribute("quesfg",quesfg);
        return "fagai/quesfg-fix";
    }

    //**********************************************我是分割线************************************************************
    //**********************************************行业部分************************************************************

    //填报
    @GetMapping("/hangye/queshy-tianbao")
    public String queshy_tianbaoPage(Model model){
        model.addAttribute("ques",new Ques());
        return "hangye/queshy-tianbao";
    }

    @PostMapping("/hangye/gl-delques")
    public String hy_delques(@RequestBody List<Integer> id_list,Model model){
        LambdaQueryWrapper<Ques> lambdadelq = Wrappers.<Ques>lambdaQuery();
        //循环删除
        for (int i =0;i< id_list.size();i++) {
            lambdadelq.eq(Ques::getQid,id_list.get(i));
            quesMapper.delete(lambdadelq);
        }
        return "hangye/queshy-list";
    }

    @PostMapping("/hangye/queshy-tianbao")
    public String queshy_tianbao(@ModelAttribute("ques") Ques ques,Model model){
        ques.setQstatus("未申请");
        quesMapper.insert(ques);
        return "redirect:/hangye/queshy-list";
    }

    //问题详情
    @GetMapping("/hangye/queshy-display")
    public String displayhy_page(@RequestParam("qid") Integer qid, @ModelAttribute("ques") Ques ques , Model model){
        LambdaQueryWrapper<Ques> lambdaqpage = Wrappers.<Ques>lambdaQuery();
        lambdaqpage.eq(Ques::getQid,qid);
        Ques quesd = quesMapper.selectOne(lambdaqpage);
        model.addAttribute("quesd",quesd);
        return "hangye/queshy-display";
    }

    @PostMapping("/hangye/queshy-display")
    public String diaplayhy(@RequestParam("qid") Integer qid,@ModelAttribute("ques") Ques ques,Model model){
        model.getAttribute("ques");
        UpdateWrapper<Ques> updatep = new UpdateWrapper<Ques>();
        updatep.eq("qid",qid);
        quesMapper.update(ques,updatep);
        return "redirect:/hangye/queshy-list";
    }

    //问题详情展示
    @GetMapping("/hangye/queshy-fix")
    public String fixhy_page(@RequestParam("qid") Integer qid, @ModelAttribute("ques") Ques ques , Model model){
        LambdaQueryWrapper<Ques> lambdaqpage = Wrappers.<Ques>lambdaQuery();
        lambdaqpage.eq(Ques::getQid,qid);
        Ques quesf = quesMapper.selectOne(lambdaqpage);
        model.addAttribute("quesf",quesf);
        return "hangye/queshy-fix";
    }

    //问题办理清单
    @GetMapping("/hangye/queshy-list")
    public String queshy_listPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                  Model model){
        LambdaQueryWrapper<Ques> lambdaq =  Wrappers.<Ques>lambdaQuery();
        lambdaq.like(Ques::getQstatus,"申请").like(Ques::getQtype,"前期工作事项");
        Page<Ques> pagew = new Page<Ques>(pageNum,pageSize);//展示页数及条数
        IPage<Ques> iPagew = quesMapper.selectPage(pagew,lambdaq);//进行查询
        List<Ques> qlist = iPagew.getRecords();
//        List<Ques> qlist = quesMapper.selectList(lambdaq);
        model.addAttribute("qlist",qlist);
        model.addAttribute("iPagew",iPagew);
        return "hangye/queshy-list";
    }

    @PostMapping("/hangye/queshy-list")
    public String queshy_list(@ModelAttribute("ques") Ques ques, @RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Ques> updateqhy = new UpdateWrapper<Ques>();
            updateqhy.eq("qid", id_list.get(i)).eq("qtype","前期工作事项");
            ques.setQstatus("已申请");
            quesMapper.update(ques,updateqhy);
        }
        return "redirect:/hangye/queshy-list";
    }

    //处理问题
    @GetMapping("/hangye/queshy-handle")
    public String quessh_handlePage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                    @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                    @ModelAttribute("ques") Ques ques,Model model){
        model.addAttribute("ques",ques);
        LambdaQueryWrapper<Ques> lambdaq =  Wrappers.<Ques>lambdaQuery();
        lambdaq.like(Ques::getQstatus,"已处理").like(Ques::getQtype,"前期工作事项");
//        List<Ques> qlist = quesMapper.selectList(lambdaq);
        Page<Ques> pagew = new Page<Ques>(pageNum,pageSize);//展示页数及条数
        IPage<Ques> iPagew = quesMapper.selectPage(pagew,lambdaq);//进行查询
        List<Ques> qlist = iPagew.getRecords();
        model.addAttribute("qlist",qlist);
        model.addAttribute("iPagew",iPagew);
        return "hangye/queshy-handle";
    }

    @PostMapping("/hangye/queshy-handle")
    public String quessh_handle(@ModelAttribute("ques") Ques ques, @RequestBody List<Integer> id_list,Model model){
        for (int i =0;i< id_list.size();i++) {
            UpdateWrapper<Ques> updateqhy = new UpdateWrapper<Ques>();
            updateqhy.eq("qid", id_list.get(i));
            Ques quesn = new Ques();
            quesn.setQstatus("结项");
            quesMapper.update(quesn,updateqhy);
        }
        return "redirect:/hangye/queshy-over";
    }

    //结项清单
    @GetMapping("/hangye/queshy-over")
    public String queshy_overPage(@RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
                                  @RequestParam(value = "pageSize", defaultValue = "12") int pageSize,
                                  @ModelAttribute("ques") Ques ques,Model model){
        model.addAttribute("ques",ques);
        LambdaQueryWrapper<Ques> lambdaq =  Wrappers.<Ques>lambdaQuery();
        lambdaq.like(Ques::getQstatus,"结项").like(Ques::getQtype,"前期工作事项");
        Page<Ques> pagew = new Page<Ques>(pageNum,pageSize);//展示页数及条数
        IPage<Ques> iPagew = quesMapper.selectPage(pagew,lambdaq);//进行查询
        List<Ques> qlist = iPagew.getRecords();
//        List<Ques> qlist = quesMapper.selectList(lambdaq);
        model.addAttribute("qlist",qlist);
        model.addAttribute("iPagew",iPagew);
        return "hangye/queshy-over";
    }

    @PostMapping("/hangye/queshy-over")
    public String queshy_over(@ModelAttribute("ques") Ques ques,Model model){
        return "hangye/queshy-over";
    }

}
