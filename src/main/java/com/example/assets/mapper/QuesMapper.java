package com.example.assets.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.assets.entity.Ques;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuesMapper extends BaseMapper<Ques> {
    @Select("select * from ques")
    List<Ques> selectall();//
    @Select("select count(*) from ques")
    int countsum();//统计所有问题数
    @Select("select count(*) from ques where qtype='项目信息'")
    int countinfo();//统计所有sehnpileix的xmushu
    @Select("select count(*) from ques where qtype='项目调度'")
    int countdis();
    @Select("select count(*) from ques where qtype='前期工作事项'")
    int countpro();
    @Select("select count(*) from ques where qtype=#{qtype}")
    int countBytype(String qtype);
    @Select("select count(*) from ques where qtype='前期工作事项'and qstatus='已处理'")
    int countyichuli();

    @Select("select count(*) from ques where qstatus=#{qstatus}")
    int countByqstatus(String qstatus);

    @Select(" select count(*) from ques where   qstatus=#{0}  and qtype=#{1}'")

//    @Select("select count(*) from ques where  proinfo.pid = projectinfo.pid and proinfo.prostatus = '结项'");
    int countprostatus(@Param("qststus") String qstatus, @Param("qtype") String qtype);//查出所有类型为前期工作事项的问题




//    @Select("select count(*) from ques where qstatus like CONCAT(#{qstatus},'%')")
//    int countByqianqi(String qstatus);
}
