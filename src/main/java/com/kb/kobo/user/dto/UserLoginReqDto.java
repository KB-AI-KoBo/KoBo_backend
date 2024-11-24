package com.kb.kobo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserLoginReqDto {

    private String username;
    private String password;

}

