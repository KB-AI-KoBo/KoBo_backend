package com.kb.kobo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfoDto {

    private Long id;
    private String username;
    private String password;
    private String email;
    private String companyName;
    private String companySize;
    private String registrationNumber;
    private String companyEmail;
    private String industry;
}
