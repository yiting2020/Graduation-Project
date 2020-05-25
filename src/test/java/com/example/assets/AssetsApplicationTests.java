package com.example.assets;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.assets.entity.Dispatch;
import com.example.assets.entity.Projectinfo;
import com.example.assets.mapper.DispatchMapper;
import com.example.assets.mapper.ProjectinfoMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.sql.SQLOutput;
import java.util.List;

@SpringBootTest
class AssetsApplicationTests {

    @Autowired
    private DispatchMapper dispatchMapper;
    @Autowired
    private ProjectinfoMapper projectinfoMapper;
    @Test
    void contextLoads() {
        Dispatch dispatch = new Dispatch();
        dispatch.setName("未定义");//调度名称不能为空
        dispatch.setDispstatus("未填");//新调度的调度填报状态是未填写
        dispatch.setPid(20);//调度中获取并设置项目的pid
        dispatchMapper.insert(dispatch);//将这个调度插入数据库
    }

//    @Test
//    public void selectPage(){
//        QueryWrapper<Projectinfo> queryWrapper = new QueryWrapper<Projectinfo>();
//        queryWrapper.ge("projectstatus","未报");
//        Page<Projectinfo> page = new Page<Projectinfo>(1,5);
//        IPage<Projectinfo> iPage = projectinfoMapper.selectPage(page,queryWrapper);
//        System.out.println("页数:"+iPage.getPages());
//        System.out.println("总数："+iPage.getTotal());
//        List<Projectinfo> projectinfoList = iPage.getRecords();
//    }

}
