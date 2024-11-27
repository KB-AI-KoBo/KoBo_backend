package com.kb.kobo.user.controller;

import com.kb.kobo.user.dto.TokenDto;
import com.kb.kobo.user.dto.UserLoginReqDto;
import com.kb.kobo.user.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> login(@RequestBody UserLoginReqDto userLoginReqDto) {
        TokenDto token = authService.login(userLoginReqDto);
        return ResponseEntity.ok(token);
    }


}
