package project.flowchat.backend.Repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.stereotype.Repository;
import project.flowchat.backend.Model.LicenseModel;


@Repository
public interface LicenseRepository extends JpaRepository<LicenseModel, Integer> {
    @NativeQuery(value = "SELECT * FROM ACCOUNT.License WHERE email = ?1 AND license_key = ?2")
    LicenseModel getKeyInfo(String email, String key);

    @Modifying
    @Transactional
    @NativeQuery(value = "UPDATE ACCOUNT.License SET is_available = 0 WHERE email = ?1 AND license_key = ?2")
    void setLicenseKeyUnavailable(String email, String key);
}
