package com.healthcare.HealthCareSystem.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // ✅ Allow frontend (adjust if needed)
public class DashboardController {

    @GetMapping("/dashboard")
    public String getDashboard(Authentication authentication) {
        String username = authentication.getName();
        return "Welcome to your Healthcare Dashboard, " + username + "!";
    }
}
