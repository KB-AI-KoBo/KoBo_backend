package com.kb.kobo.mail.controller;

import com.kb.kobo.mail.dto.MailDto;
import com.kb.kobo.mail.service.MailService;
import com.kb.kobo.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/findPassword")
@RequiredArgsConstructor
public class MailController {

    private final UserService userService;
    private final MailService mailService;

    @PostMapping("/checkEmail")
    public ResponseEntity<?> checkEmail(@RequestParam("email") String email) {
        if(!userService.emailExist(email)) {
            return new ResponseEntity<>("일치하는 메일이 없습니다.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("이메일을 사용하는 유저가 존재합니다.", HttpStatus.OK);
    }

    @PostMapping("/sendPassword")
    public ResponseEntity<?> sendPassword(@RequestParam("email") String email) {
        String tmpPassword = userService.getTmpPassword();
        userService.updatePassword(tmpPassword, email);
        MailDto mail = mailService.createMail(tmpPassword, email);

        mailService.sendMail(mail);

        return new ResponseEntity<>("비밀번호 발급이 완료되었습니다.", HttpStatus.OK);
    }
}
