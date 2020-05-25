package com.example.assets.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.example.assets.entity.User;
import com.example.assets.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.*;

@Controller
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/login")
    public String loginPage(Model model) {
        model.addAttribute("user", new User());
        //返回登录页面
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute("user") User user, Model model,ServletRequest servletRequest, ServletResponse servletResponse) {
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        HttpSession session = request.getSession();
        LambdaQueryWrapper<User> wrapper = Wrappers.<User>lambdaQuery().eq(User::getEmail, user.getEmail());
        User loginUser = userMapper.selectOne(wrapper);
        //用户存在且密码相同
        if (loginUser != null && user.getPassword().equals(loginUser.getPassword())&&"faren".equals(loginUser.getRole())) {
            session.setAttribute("login", loginUser.getEmail());
            session.setAttribute("role", loginUser.getRole());
            session.setAttribute("loginuser", loginUser);
            return "redirect:/faren/index-fr";
        }else if (loginUser != null && user.getPassword().equals(loginUser.getPassword())&&"fagai".equals(loginUser.getRole())){
            session.setAttribute("login", loginUser.getEmail());
            session.setAttribute("role", loginUser.getRole());
            session.setAttribute("loginuser", loginUser);
            return "redirect:/fagai/index-fg";
        }else if (loginUser != null && user.getPassword().equals(loginUser.getPassword())&&"hangye".equals(loginUser.getRole())){
            session.setAttribute("login", loginUser.getEmail());
            session.setAttribute("role", loginUser.getRole());
            session.setAttribute("loginuser", loginUser);
            return "redirect:/hangye/index-hy";
        }
        else {
            model.addAttribute("errorMessage", "用户名或密码错误");//否则不存在，报错
            return "login";
        }
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        //给页面一个空的user属性
        model.addAttribute("user", new User());
        //返回注册页面
        return "register";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute("user") User user, Model model) {

        userMapper.insert(user);
        //重定向到登录页面
        return "redirect:/login";
    }

    //退出登录
    @GetMapping("/exit")
    public String exit(HttpSession session){
        session.invalidate();//让session失效即可退出登录
        return "redirect:/login";
    }

}
