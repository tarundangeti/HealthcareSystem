package com.healthcare.HealthCareSystem.entity;

import java.util.HashSet;
import java.util.Set;

import com.healthcare.HealthCareSystem.model.Role;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Lob
    @Column(name = "profile_image", columnDefinition = "LONGBLOB")
    private byte[] profileImage;

    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String dob;
    private String username;
    private String role;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    // ✅ Add this setter if it's missing
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    // Getters
    public Long getId() {
        return id;
    }
    public String username() {
    	return username;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }
    public String getUsername() {  // ✅ Add this Getter
        return username;
    }

    public String getPhone() {
        return phone;
    }

    public String getPassword() {
        return password;
    }

    public String getDob() {
        return dob;
    }
    
    public byte[] getProfileImage() {
        return profileImage;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public void setusername(String username) {
    	this.username = username;    
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

	public void setProfileImage(byte[] profileImage) {
		// TODO Auto-generated method stub
		this.profileImage = profileImage;
		
	}

}
