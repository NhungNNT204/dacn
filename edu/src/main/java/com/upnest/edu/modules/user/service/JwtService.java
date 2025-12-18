package com.upnest.edu.modules.user.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service: JwtService
 * Quản lý JWT token generation, validation, extraction
 */

@Slf4j
@Service
public class JwtService {

    @Value("${app.jwt.secret:upnestedu-secret-key-for-jwt-token-generation-and-validation-purposes}")
    private String jwtSecret;

    @Value("${app.jwt.access-token-expiration:86400000}") // 24 hours
    private long accessTokenExpiration;

    @Value("${app.jwt.refresh-token-expiration:604800000}") // 7 days
    private long refreshTokenExpiration;

    /**
     * Tạo secret key từ string
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Generate access token
     */
    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails.getUsername(), accessTokenExpiration);
    }

    /**
     * Generate access token (username/email string)
     * Useful for modules that don't expose Spring Security UserDetails.
     */
    public String generateAccessToken(String username) {
        return generateToken(username, accessTokenExpiration);
    }

    /**
     * Generate refresh token
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails.getUsername(), refreshTokenExpiration);
    }

    /**
     * Generate refresh token (username/email string)
     */
    public String generateRefreshToken(String username) {
        return generateToken(username, refreshTokenExpiration);
    }

    /**
     * Generate token với expiration time
     */
    private String generateToken(String username, long expirationTime) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "JWT");

        return createToken(claims, username, expirationTime);
    }

    /**
     * Tạo JWT token
     */
    private String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Kiểm tra token có valid không
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        } catch (Exception e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Kiểm tra token có hết hạn không
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Lấy expiration date từ token
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Lấy username từ token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Lấy claim từ token
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims từ token
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
