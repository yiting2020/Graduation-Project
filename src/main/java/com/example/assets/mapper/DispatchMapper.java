package com.example.assets.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.assets.entity.Dispatch;
import com.example.assets.entity.Prodis;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DispatchMapper extends BaseMapper<Dispatch> {

    //还没分页时的查询
    @Select("select dispatch.*, projectinfo.`projectname`, projectinfo.`directdept1`, projectinfo.`buildplace` from dispatch , projectinfo" +
            "  where dispatch.pid = projectinfo.pid and dispatch.dispstatus like '%填'")
    List<Prodis> selectByPid(@Param(Constants.WRAPPER) Wrapper<Prodis> wrapper);

    @Select("select dispatch.*, projectinfo.`projectname`, projectinfo.`directdept1`, projectinfo.`buildplace` from dispatch , projectinfo " +
            " where dispatch.pid = projectinfo.pid and dispatch.dispstatus='已填'")
    List<Prodis> selectByStatus(@Param(Constants.WRAPPER) Wrapper<Prodis> wrapper);

    @Select("select dispatch.*, projectinfo.`projectname`, projectinfo.`directdept1`, projectinfo.`buildplace` from dispatch , projectinfo " +
            " where dispatch.pid = projectinfo.pid and dispatch.dispstatus='结项'")
    List<Prodis> selectByStatuso(@Param(Constants.WRAPPER) Wrapper<Prodis> wrapper);

    //分页查询
    @Select("select dispatch.*, projectinfo.`projectname`, projectinfo.`directdept1`, projectinfo.`buildplace` from dispatch , projectinfo" +
            "  where dispatch.pid = projectinfo.pid and dispatch.dispstatus like '%填'")
    IPage<Prodis>  selectProdisPage(Page<Prodis> page, @Param(Constants.WRAPPER) Wrapper<Prodis> queryWrapper);

    @Select("select dispatch.*, projectinfo.`projectname`, projectinfo.`directdept1`,projectinfo.`investmenttotal`, projectinfo.`buildplace` from dispatch , projectinfo " +
            " where dispatch.pid = projectinfo.pid and dispatch.dispstatus='已填'")
    IPage<Prodis>  selectProdisPagey(Page<Prodis> page, @Param(Constants.WRAPPER) Wrapper<Prodis> queryWrapper);

    @Select("select dispatch.*, projectinfo.`projectname`, projectinfo.`directdept1`, projectinfo.`buildplace` from dispatch , projectinfo " +
            " where dispatch.pid = projectinfo.pid and dispatch.dispstatus='结项'")
    IPage<Prodis>  selectProdisPageo(Page<Prodis> page, @Param(Constants.WRAPPER) Wrapper<Prodis> queryWrapper);


    //HUANG
    @Select("select * from dispatch")
    List<Dispatch> selectall();//
    @Select("select count(*) from dispatch ")
    int countsum();//统计所有调度
    //     @Select("select count(*) from dispatch where zbtype='未填'")
//     int countweitian();//统计所有未填状态的前期工作
    @Select("select count(*) from dispatch where zbtype=#{zbtype}")
    int  countByzbtype(String zbtype);//项目分类及占比

    @Select("select count(*) from dispatch where imageprogress=#{imageprogress}")
    int  countByimageprogress(String imageprogress);//项目分类及占比
    @Select("select count(*) from dispatch where investplanadjust=#{investplanadjust}")
    int  countByinvestplanadjust(String investplanadjust);//项目分类及占比

//    @Select("select count(*) from dispatch where imageprogress like CONCAT(#{imageprogress},'%')")
//    int countByimageprogress(String imageprogress);
}
