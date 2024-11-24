package com.kb.kobo.user.controller;

import com.kb.kobo.user.dto.UserInfoDto;
import com.kb.kobo.user.dto.UserSignupReqDto;
import com.kb.kobo.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserInfoDto> signup(@Valid @RequestBody UserSignupReqDto userSignupReqDto) {
        UserInfoDto savedUser = userService.signUp(userSignupReqDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }




}
