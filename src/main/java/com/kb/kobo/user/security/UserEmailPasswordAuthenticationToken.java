package com.kb.kobo.user.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class UserEmailPasswordAuthenticationToken extends UsernamePasswordAuthenticationToken {

    public UserEmailPasswordAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
    }

    public UserDetails getUserDetails() {
        return (UserDetails) getPrincipal();
    }
}