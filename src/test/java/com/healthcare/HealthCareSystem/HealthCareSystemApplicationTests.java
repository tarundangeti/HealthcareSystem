package com.healthcare.HealthCareSystem;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class HealthCareSystemApplicationTests {

    @Test
    void contextLoads() {
        // sanity check: application context loads with H2
    }
}