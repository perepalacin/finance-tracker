package com.pere_palacin.app.config;

import com.pere_palacin.app.filters.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    //We inject the interface, but spring will look for our implementation
    private final UserDetailsService userDetailsService;
    private static final String[] WHITE_LIST_URL = {
            "/api/v1/auth/**",
            "/",
            "/index.html",
            "/assets/**",
            "/favicon.ico"
    };

    private final JwtFilter jwtFilter;
    //this class tells spring boot that we will not use the default security configuration.
    //But no filter is applied if we don't add anything else!
    @Bean
    public SecurityFilterChain securityFilterChain (HttpSecurity httpSecurity) throws Exception {

        //disable csrf requests filter using lambdas
        httpSecurity.csrf(AbstractHttpConfigurer::disable);

//        //make any request require login through the default form
//        httpSecurity.authorizeHttpRequests(request -> request.anyRequest().authenticated());

        //Add a whitelist of open urls!
        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(WHITE_LIST_URL)
                        .permitAll() //if it is on the whitelist, permit all
                        .anyRequest() //otherwise for any request
                        .authenticated() //require auth
        );

        //make requests from the browser required default auth login (password autogenerated)
//        httpSecurity.formLogin(Customizer.withDefaults());
//
//        //make requests from postman required default auth login (password autogenerated)
//        httpSecurity.httpBasic(Customizer.withDefaults());

        //make the session stateless, makes the server not store session ids and therefore not be vulnerale to crsf exploits
        httpSecurity.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        //Add the jwt filter before we check the credentials
        httpSecurity.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
//        //the previous code is the same as:
//        httpSecurity
//                .csrf(customizer -> customizer.disable())
//                .authorizeHttpRequests(request -> request.anyRequest().authenticated())
//                .formLogin(Customizer.withDefaults())
//                .httpBasic(Customizer.withDefaults())
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return httpSecurity.build();
    }

    // In order to manage looking for users in our db, we need to implement the authentication provider method
    //This method manages how the user is identified and such. On top of it, we need to implement the UserDetailsService
    // which will hold the logic to authenticate users.
    //We also create the userPrincipal pojo to manage this data easily, as it is not recommended to get requests and send responses with DAO such as Users pojo.
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        provider.setPasswordEncoder(NoOpPasswordEncoder.getInstance()); //NoOpPasswordEncoder means we do not encript the password! Very bad idea tbh
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12)); //And here we just say to use bcrypt
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    //Bean responsible for checking if a user is in the db
    //it will be using in the service layer
    //we tell spring that we want to take control of the auth
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}
