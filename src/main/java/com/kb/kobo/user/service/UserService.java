package com.kb.kobo.user.service;

import com.kb.kobo.user.domain.User;
import com.kb.kobo.user.dto.UserInfoDto;
import com.kb.kobo.user.dto.UserSignupReqDto;
import com.kb.kobo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public UserInfoDto signUp(UserSignupReqDto userSignUpRequest) {
        if (userRepository.findByEmail(userSignUpRequest.getEmail()).isPresent()) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .id(userSignUpRequest.getId())
                .username(userSignUpRequest.getUsername())
                .email(userSignUpRequest.getEmail())
                .companyName(userSignUpRequest.getCompanyName())
                .companySize(userSignUpRequest.getCompanySize())
                .registrationNumber(userSignUpRequest.getRegistrationNumber())
                .industry(userSignUpRequest.getIndustry())
                .build();

        userRepository.save(user);

        return UserInfoDto.from(user);
    }

}
