package com.example.assets.filter;


import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

//@WebFilter(filterName = "loginFilter",urlPatterns = {"/*"})
public class loginFilter implements Filter {


    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        HttpSession session = request.getSession();
        Object login = session.getAttribute("login");
        System.out.println("login:"+login);
        if(login != null){
            filterChain.doFilter(servletRequest,servletResponse);
        }else {
            HttpServletResponse response = (HttpServletResponse) servletResponse;
            response.sendRedirect("login");
        }
    }

    @Override
    public void destroy() {

    }
}
