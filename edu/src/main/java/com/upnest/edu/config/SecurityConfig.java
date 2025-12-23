package com.upnest.edu.config;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final ApplicationContext applicationContext;

    public SecurityConfig(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    // Định nghĩa Bean PasswordEncoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Định nghĩa Bean UserDetailsService
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            try {
                Object repo = applicationContext.getBean("userRepository");
                Method findByEmail = repo.getClass().getMethod("findByEmail", String.class);
                Object opt = findByEmail.invoke(repo, username);
                @SuppressWarnings("unchecked")
                Optional<Object> optionalUser = (Optional<Object>) opt;
                Object userEntity = optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));

                String email = null;
                String password = null;
                try {
                    Method getEmail = userEntity.getClass().getMethod("getEmail");
                    email = (String) getEmail.invoke(userEntity);
                } catch (NoSuchMethodException ignored) {
                    try {
                        Method getUsername = userEntity.getClass().getMethod("getUsername");
                        email = (String) getUsername.invoke(userEntity);
                    } catch (NoSuchMethodException ignored2) {
                    }
                }

                try {
                    Method getPassword = userEntity.getClass().getMethod("getPassword");
                    password = (String) getPassword.invoke(userEntity);
                } catch (NoSuchMethodException e) {
                    throw new UsernameNotFoundException("User record missing password", e);
                }

                String usernameToUse = (email != null) ? email : username;

                return org.springframework.security.core.userdetails.User
                        .withUsername(usernameToUse)
                        .password(password)
                        .authorities("ROLE_USER")
                        .build();

            } catch (UsernameNotFoundException e) {
                throw e;
            } catch (Exception e) {
                throw new UsernameNotFoundException("User lookup failed", e);
            }
        };
    }

    // Định nghĩa AuthenticationProvider (sử dụng UserDetailsService và PasswordEncoder)
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Định nghĩa AuthenticationManager (Spring sẽ tự động dùng AuthenticationProvider bean ở trên)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // ĐỊNH NGHĨA CORS TRỰC TIẾP TRONG FILE CONFIG NÀY
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Cho phép gọi từ cổng ReactJS (localhost:5173-5178, v.v.)
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173", 
            "http://localhost:5174", 
            "http://localhost:5175",
            "http://localhost:5176",
            "http://localhost:5177",
            "http://localhost:5178"
        )); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight cho 1 giờ

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Cấu hình các đường dẫn (URLs) nào được truy cập và cần bảo mật
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            // SỬ DỤNG BEAN CORS ĐÃ ĐỊNH NGHĨA
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
            .authorizeHttpRequests(auth -> auth
                // [FIX LỖI 403] Cho phép CORS preflight OPTIONS requests
                .requestMatchers("OPTIONS", "/**").permitAll()
                // Cho phép handshake WebSocket/STOMP
                .requestMatchers(
                    "/ws",
                    "/ws/**",
                    "/ws-qa",
                    "/ws-qa/**",
                    "/ws-chat",
                    "/ws-chat/**",
                    "/ws-social",
                    "/ws-social/**",
                    "/ws-video",
                    "/ws-video/**",
                    "/ws-roadmap",
                    "/ws-roadmap/**"
                ).permitAll()
                // CHỈ cho phép Auth công khai. Mọi thứ khác cần Token.
                .requestMatchers("/api/v1/auth/**").permitAll()
                
                // Mọi request khác đều phải có Token hợp lệ
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider());

        return http.build();
    }
}