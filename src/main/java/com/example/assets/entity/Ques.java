package com.example.assets.entity;

import lombok.Data;

@Data
public class Ques {
    private Integer qid;
    private String qname;
    private String qtype;
    private String qstatus;
    private String qcontent;
    private String qfeedback;
    private String qperson;
    private String qptel;
}
