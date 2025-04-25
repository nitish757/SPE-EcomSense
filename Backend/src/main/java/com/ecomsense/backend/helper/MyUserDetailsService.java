package com.ecomsense.backend.helper;

import com.ecomsense.backend.entity.User;
import com.ecomsense.backend.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepo repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = repo.findByEmail(username)
                .orElseThrow(() -> {
                    System.out.println("User Not found");
                    return new UsernameNotFoundException("User Not found");
                });

        return new UserPrincipal(user);
    }
}
