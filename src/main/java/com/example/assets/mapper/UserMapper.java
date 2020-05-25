package com.example.assets.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.assets.entity.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMapper extends BaseMapper<User> {
}
