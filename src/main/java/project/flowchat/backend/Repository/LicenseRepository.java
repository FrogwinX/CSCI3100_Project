package project.flowchat.backend.Repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.LicenseModel;


@Repository
public interface LicenseRepository extends JpaRepository<LicenseModel, Integer> {
    /**
     * Get the license_id, license_key, email, created_at, expires_at, is_available from database table License by email and key
     * @param email email
     * @param key license key or authentication code
     * @return LicenseModel Object
     */
    @NativeQuery(value = "SELECT TOP 1 * FROM ACCOUNT.License WHERE email = ?1 AND license_key = ?2")
    LicenseModel getKeyInfo(String email, String key);

    /**
     * Set the is_available to false with the corresponding license key or authentication code
     * @param email email
     * @param key license key or authentication code
     */
    @Modifying
    @Transactional
    @NativeQuery(value = "UPDATE ACCOUNT.License SET is_available = 0 WHERE email = ?1 AND license_key = ?2")
    void setKeyUnavailable(String email, String key);
}
