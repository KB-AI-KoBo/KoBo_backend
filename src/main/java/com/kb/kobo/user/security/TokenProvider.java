package com.kb.kobo.user.security;

import com.kb.kobo.user.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class TokenProvider {

    private static final String USERNAME_CLAIM = "Username ";

    private final Key key;
    private final long accessTokenValidityTime;

    public TokenProvider(@Value("${jwt.secret}") String secretKey,
                         @Value("${jwt.access-token-validity-in-milliseconds}") long accessTokenValidityTime) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenValidityTime = accessTokenValidityTime;
    }

    public String createAccessToken(User user) {
        long nowTime = (new Date().getTime());

        Date accessTokenExpiredTime = new Date(nowTime + accessTokenValidityTime);

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim(USERNAME_CLAIM, user.getUsername())
                .setExpiration(accessTokenExpiredTime)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰에서 username 추출
    public String extractUsername(String token) {
        String jwtToken = validateAndExtractToken(token);
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(jwtToken)
                .getBody();
        return claims.getSubject();
    }

    // 토큰 검증
    public boolean validateToken(String token, String username) {
        final String tokenUsername = extractUsername(token);
        return (tokenUsername.equals(username) && !isTokenExpired(token));
    }

    // 토큰 만료 확인
    public boolean isTokenExpired(String token) {
        String jwtToken = validateAndExtractToken(token);
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(jwtToken)
                .getBody();
        return claims.getExpiration().before(new Date());
    }

    // 토큰 유효성 검사 및 추출
    private String validateAndExtractToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token must not be null or empty");
        }
        if (!token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid token format: must start with 'Bearer '");
        }
        return token.substring(7); // "Bearer " 제거
    }
}
