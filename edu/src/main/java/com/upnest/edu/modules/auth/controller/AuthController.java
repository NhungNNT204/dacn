package com.upnest.edu.modules.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.upnest.edu.modules.auth.payload.AuthResponse;
import com.upnest.edu.modules.auth.payload.LoginRequest;
import com.upnest.edu.modules.auth.payload.VerifyRequest;
import com.upnest.edu.modules.auth.service.TwoFactorService;
import com.upnest.edu.modules.user.entity.User;
import com.upnest.edu.modules.user.repository.UserRepository;
import com.upnest.edu.modules.user.service.JwtService;

// [FIX] Thêm @CrossOrigin để giải quyết lỗi 403 Forbidden từ trình duyệt
@CrossOrigin(origins = "http://localhost:5173") 
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final TwoFactorService twoFactorService;

    // [FIX LỖI] Constructor thủ công thay vì dùng @RequiredArgsConstructor của Lombok
    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          JwtService jwtService,
                          TwoFactorService twoFactorService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.twoFactorService = twoFactorService;
    }

    // BƯỚC 1: Đăng nhập (Kiểm tra Email/Pass)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            if (request.getEmail() == null || request.getPassword() == null) {
                return ResponseEntity.badRequest().body("Email và mật khẩu không được để trống");
            }

            System.out.println(">>> Login attempt: " + request.getEmail());

            // 1. Xác thực Email & Password với Spring Security
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // 2. Tìm User trong DB
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            System.out.println(">>> User found: " + user.getEmail() + ", Role: " + user.getRole() + ", 2FA: " + user.isTwoFactorEnabled());

            // 3. Kiểm tra xem User có bật bảo mật 2 lớp (2FA) không
            if (user.isTwoFactorEnabled()) {
                // Nếu có -> Trả về thông báo "Cần OTP" (chưa đưa Token vội)
                System.out.println(">>> 2FA required for: " + user.getEmail());
                return ResponseEntity.ok(new AuthResponse(
                    null,               // Token chưa có
                    null,               // FullName chưa cần
                    user.getEmail(),    // Trả email về để client biết đường gửi tiếp bước verify
                    null,               // Role chưa cần
                    true                // is2faRequired = true
                ));
            }

            // 4. Nếu không bật 2FA -> Cấp Token luôn
            String token = jwtService.generateAccessToken(user);
            System.out.println(">>> Token generated for: " + user.getEmail());
            
            // Trả về kết quả thành công dùng Constructor
            return ResponseEntity.ok(new AuthResponse(
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                false // is2faRequired = false
            ));
        } catch (IllegalArgumentException e) {
            System.err.println("Login error (IllegalArgument): " + e.getMessage());
            return ResponseEntity.status(401).body("Sai email hoặc mật khẩu!");
        } catch (Exception e) {
            System.err.println("Login error (Exception): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    // BƯỚC 2: Xác thực mã 2FA (Chỉ dùng khi bước 1 trả về is2faRequired=true)
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Kiểm tra mã OTP 6 số user gửi lên
        boolean isCodeValid = twoFactorService.isOtpValid(user.getTwoFactorSecret(), request.getCode());

        if (isCodeValid) {
            // Mã đúng -> Cấp Token đăng nhập
            String token = jwtService.generateAccessToken(user);
            
            return ResponseEntity.ok(new AuthResponse(
                token,
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                false
            ));
        } else {
            return ResponseEntity.badRequest().body("Mã OTP không đúng hoặc đã hết hạn!");
        }
    }
}