package com.example.assets.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.assets.entity.Proinfo;
import com.example.assets.entity.Prostage;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProinfoMapper extends BaseMapper<Proinfo> {

    @Select("select proinfo.*, projectinfo.`projectname`, projectinfo.`directdept1` from proinfo , projectinfo " +
            " where proinfo.pid = projectinfo.pid and proinfo.prostatus like '%填'")
    List<Prostage> selectByPid(@Param(Constants.WRAPPER) Wrapper<Prostage> wrapper);

    @Select("select proinfo.*, projectinfo.`projectname`, projectinfo.`directdept1` from proinfo , projectinfo " +
            " where proinfo.pid = projectinfo.pid and proinfo.prostatus = '已填'")
    List<Prostage> selectByStatus(@Param(Constants.WRAPPER) Wrapper<Prostage> wrapper);

    @Select("select proinfo.*, projectinfo.`projectname`, projectinfo.`directdept1` from proinfo , projectinfo " +
            " where proinfo.pid = projectinfo.pid and proinfo.prostatus = '结项'")
    List<Prostage> selectByStatuso(@Param(Constants.WRAPPER) Wrapper<Prostage> wrapper);

    //分页查询
    @Select("select proinfo.*, projectinfo.`projectname`, projectinfo.`directdept1` from proinfo , projectinfo " +
            " where proinfo.pid = projectinfo.pid and proinfo.prostatus like '%填'")
    IPage<Prostage> selectProstagePage(Page<Prostage> page, @Param(Constants.WRAPPER) Wrapper<Prostage> queryWrapper);

    @Select("select proinfo.*, projectinfo.`projectname`, projectinfo.`directdept1` from proinfo , projectinfo " +
            " where proinfo.pid = projectinfo.pid and proinfo.prostatus = '已填'")
    IPage<Prostage>  selectProstagePagey(Page<Prostage> page, @Param(Constants.WRAPPER) Wrapper<Prostage> queryWrapper);

    @Select("select proinfo.*, projectinfo.`projectname`, projectinfo.`directdept1` from proinfo , projectinfo " +
            " where proinfo.pid = projectinfo.pid and proinfo.prostatus = '结项'")
    IPage<Prostage>  selectProstagePageo(Page<Prostage> page, @Param(Constants.WRAPPER) Wrapper<Prostage> queryWrapper);

    @Select("select proinfo.*, projectinfo.`projectname`, projectinfo.`directdept1` from proinfo , projectinfo " +
            " where proinfo.pid = projectinfo.pid and proinfo.prostatus like '%预警'")
    IPage<Prostage> selectProstageAlarm(Page<Prostage> page, @Param(Constants.WRAPPER) Wrapper<Prostage> queryWrapper);
    //hyt
    @Select("select count(*) from proinfo ")
    int counsum();//统计所有未填状态的前期工作
    @Select("select count(*) from proinfo where prostatus='未填'")
    int countweitian();//统计所有未填状态的前期工作

    @Select("select count(*) from proinfo where prostatus='已填'")
    int countyitian();//统计所有未填状态的前期工作

    @Select("select count(*) from proinfo where prostatus='结项'")
    int countjiexian();//统计所有未填状态的前期工作
    @Select("select * from proinfo")
    List<Prostage> selectall();//
    @Select("select count(*) from proinfo where prostatus=#{prostatus}")
    int  countByprostatus(String prostatus);//前期工作状态分类及占比
    @Select("select count(*) from proinfo where psland=#{psland}")
    int  countBypsland(String psland);//前期工作状态分类及占// 比

    @Select("select count(*) from proinfo where pifnland=#{pifnland}")
    int  countBypifnland(String pifnland);//前期工作投资估计

}
