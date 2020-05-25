package com.example.assets;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

//@ServletComponentScan
@MapperScan(basePackages = "com.example.assets.mapper")
@SpringBootApplication
public class AssetsApplication {

    public static void main(String[] args) {
        SpringApplication.run(AssetsApplication.class, args);
    }

}
