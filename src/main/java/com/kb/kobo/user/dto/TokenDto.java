package com.kb.kobo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import com.google.gson.annotations.SerializedName;

@Builder
@AllArgsConstructor
public class TokenDto {

    @SerializedName("access_token")
    String access_token;
}
