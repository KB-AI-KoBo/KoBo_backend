package com.kb.kobo.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Program {
    private String 사업명;
    private String 분야;
    private String 신청시작일자;
    private String 신청종료일자;
    private String 소관기관;
    private String 수행기관;
    private String 상세URL;

    public Program() {
    }

    public Program(String 사업명, String 분야, String 신청시작일자, String 신청종료일자, String 소관기관, String 수행기관, String 상세URL) {
        this.사업명 = 사업명;
        this.분야 = 분야;
        this.신청시작일자 = 신청시작일자;
        this.신청종료일자 = 신청종료일자;
        this.소관기관 = 소관기관;
        this.수행기관 = 수행기관;
        this.상세URL = 상세URL;
    }
}
