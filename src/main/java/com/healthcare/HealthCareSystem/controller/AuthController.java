package com.healthcare.HealthCareSystem.controller;

import com.healthcare.HealthCareSystem.entity.User;
import com.healthcare.HealthCareSystem.repository.RoleRepository;
import com.healthcare.HealthCareSystem.repository.UserRepository;
import com.healthcare.HealthCareSystem.model.LoginRequest;
import com.healthcare.HealthCareSystem.model.UserProfileUpdateRequest;
import com.healthcare.HealthCareSystem.service.JwtService;

import java.util.Collections;
import java.util.Map;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.Optional;

import com.healthcare.HealthCareSystem.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080") // Allow React frontend access
//@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtService.generateToken(userDetails.getUsername());
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(
            @RequestParam("fullname") String fullname,
            @RequestParam("username") String username,
            @RequestParam("phone") String phone,
            @RequestParam("email") String email,
            @RequestParam("dob") String dob,
            @RequestParam("password") String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        User user = new User();
        user.setFullName(fullname);
        user.setusername(username);
        user.setEmail(email);
        user.setPhone(phone);
        user.setDob(dob);
        user.setPassword(passwordEncoder.encode(password)); // Correctly encode the received password

        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                // Custom image
                user.setProfileImage(profileImage.getBytes());
            } else {
                // Default image from classpath (safe for WAR/JAR)
                ClassPathResource defaultImage = new ClassPathResource("static/images/default-profile.jpeg");
                byte[] imageBytes = defaultImage.getInputStream().readAllBytes();
                user.setProfileImage(imageBytes);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process profile image: " + e.getMessage());
        }

        // Assign default role
        Role defaultRole = roleRepository.findByName("ROLE_HEALTH_USER");
        if (defaultRole == null) {
            defaultRole = new Role();
            defaultRole.setName("ROLE_HEALTH_USER");
            roleRepository.save(defaultRole);
        }

        user.setRoles(Collections.singleton(defaultRole));

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    
    @Controller
    public class FrontendController {

    	@RequestMapping(value = { "/", "/{path:[^\\.]*}" })  // ✅ VALID REGEX
        public String forward() {
            return "forward:/index.html";
        }
    }
    @GetMapping("/Dashboard")
    @PreAuthorize("hasAnyRole('ROLE_HEALTH_USER', 'ROLE_HEALTH_ADMIN')")
    public ResponseEntity<?> getDashboard(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract JWT token from header
            String token = authHeader.replace("Bearer ", "");

            // Decode username from JWT
            String username = jwtService.getUsernameFromToken(token);
            java.util.Optional<User> user = userRepository.findByUsername(username);

            // Fetch user details from database
            java.util.Optional<User> userOpt = userRepository.findByUsername(username);
            if (user.isPresent()) {
            	User u = user.get();
                // Return whatever dashboard data you want. For example:
            	return ResponseEntity.ok(Map.of(
                        "fullname", u.getFullName(),
                        "phone", u.getPhone(),
                        "username",u.getUsername(),
                        "profileImage", u.getProfileImage()
                    ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    
 // UserController.java

    @GetMapping("/user/profile")
    @PreAuthorize("hasAnyRole('ROLE_HEALTH_USER', 'ROLE_HEALTH_ADMIN')")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtService.getUsernameFromToken(token);
        java.util.Optional<User> user = userRepository.findByUsername(username);
        
        if (user.isPresent()) {
            User u = user.get();
            return ResponseEntity.ok(Map.of(
                "fullname", u.getFullName(),
                "phone", u.getPhone(),
                "username",u.getUsername(),
                "profileImage", u.getProfileImage()
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
    
    @PostMapping(value = "/user/profile-update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("fullname") String fullname,
            @RequestParam("phone") String phone,
            @RequestParam("password") String password,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage
    ) {
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        
        User user = optionalUser.get();
        user.setFullName(fullname);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password));

        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                user.setProfileImage(profileImage.getBytes()); // If storing as blob
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image processing failed");
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");
    }

}
