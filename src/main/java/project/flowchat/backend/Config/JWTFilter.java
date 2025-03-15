package project.flowchat.backend.Config;

import io.jsonwebtoken.Claims;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import project.flowchat.backend.Service.SecurityService;

@AllArgsConstructor
@Component
public class JWTFilter implements Filter {

    @Autowired
    private final SecurityService securityService;

    /**
     * Filter out the request that does not have valid JWT in the header except /api/Account
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String authHeader = httpRequest.getHeader("Authorization");

        if (httpRequest.getRequestURI().startsWith("/api/Account")) {
            chain.doFilter(request, response);
            return;
        }

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT not provided");
                return;
            }

            String token = authHeader.substring(7); // After Bearer 
            Claims claims = securityService.validateToken(token);
            httpRequest.setAttribute("claims", claims);
            chain.doFilter(request, response);
        } catch (Exception e) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized" + e.getMessage());
        }
    }
}