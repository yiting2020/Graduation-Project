package com.example.assets.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.assets.entity.Projectinfo;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ProjectinfoMapper extends BaseMapper<Projectinfo> {

    @Select("select dispatch.*, projectinfo.`projectname`, projectinfo.`directdept1`, projectinfo.`buildplace` from  projectinfo " +
            " where projectinfo.projecttype='' and peojectinfo.dispstatus='未报'")
    IPage<Projectinfo> selectByStatus(Page<Projectinfo> page, @Param(Constants.WRAPPER) Wrapper<Projectinfo> queryWrapper);


    @Select("select count(*) from projectinfo")
    int countprojects();//声明方法

    @Select("select * from projectinfo")
    List<Projectinfo> selectall();//

    @Select("select count(*) from projectinfo")
    int countsum();

    @Select("select count(*) from projectinfo where projecttype='审批'")
    int countshenpi();//统计所有sehnpileix的xmushu

    @Select("select count(*) from projectinfo where projecttype='核准'")
    int countshezhun();

    @Select("select count(*) from projectinfo where projecttype='备案'")
    int countbeian();

    @Select("select count(*) from projectinfo where projecttype=#{projecttype}")
    int  countByprojecttype(String prostatus);//项目分类及占比

    @Select("select count(*) from projectinfo where buildnature='新建'")
    int countxinjian();//统计所有sehnpileix的xmushu

    @Select("select count(*) from projectinfo where buildnature='扩建'")
    int countkuojian();

    @Select("select count(*) from projectinfo where buildnature='改建'")
    int countgaijian();

    @Select("select count(*) from projectinfo where buildnature='恢复'")
    int counthuifu();

    @Select("select count(*) from projectinfo where buildnature=#{buildnature}")
    int countBybuildnature(String buildnature);

    @Select("select count(*) from projectinfo where buildplace=#{buildplace}")
    int countBybuildplace(String buildplace);

    @Select("select count(*) from projectinfo where nstarttime like CONCAT(#{nstarttime},'%')")
    int countBynstarttime(Integer nstarttime);

    @Select("select count(*) from projectinfo where nendtime like CONCAT(#{nendtime},'%')")
    int countBynendtime(Integer nendtime);

    //select count(*) from projectinfo where nstarttime like '2016%' and buildplace='北京'
    @Select("select count(*) from projectinfo where buildplace=#{buildplace}and nstarttime like CONCAT(#{nstarttime},'%')" )
    int countByniandu(String buildplace,Integer nstarttime);

    @Select("select count(*) from projectinfo where projectaffiliation=#{projectaffiliation}")
    int countByprojectaffiliation(String projectaffiliation);

    @Select("select count(*) from projectinfo where projectstatus=#{projectstatus}")
    int countByprojectstatus(String projectstatus);

    @Select("select count(*) from projectinfo where industry=#{industry}")
    int countByindustry(String industry);

    @Select("select count(*) from projectinfo where moneyyear=#{moneyyear}")
    int countBymoneyyear(String moneyyear);
}
